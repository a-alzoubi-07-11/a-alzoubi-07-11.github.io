"""Step 4: write Arabic article drafts for verified topics (for your review, never auto-published).

    python articles.py               # all verified topics without a fresh draft
    python articles.py --topic 12

Output (git-ignored):
  drafts/<slug>.md          the article draft: official answer + official sources,
                            then anonymized community experiences
  drafts/<slug>.review.md   PRIVATE review sheet: post links, screenshots and the
                            original comments behind every experience. Never publish.

Rules applied:
  - The official part is written ONLY from the verified official answer + sources.
  - Experiences are the anonymized summaries, listed as-is (nothing invented),
    minus noise and minus anything that contradicts the official sources.
  - Topics with no official answer, or low confidence, get no draft.
To publish, turn the draft into a guide module (tools/articles/README.md).
"""
from __future__ import annotations

import argparse
import json
import re

from common import DATA, DRAFTS, db, load_config, now, write_text
import site_index

MAX_EXPERIENCES = 10

ARTICLE_PROMPT = """Write the official-information part of an Arabic article for gidsnederland.nl,
a website that helps Arabic speakers in the Netherlands. Audience: Syrians/Arabs, plain Modern Standard Arabic.

Question people keep asking: {q}
Verified official answer (the ONLY facts you may use): {answer}
Official sources: {sources}

Rules: do not add any fact, number, date or rule that is not in the verified answer. Keep Dutch official terms
in brackets. Use short paragraphs, "##" headings, a short numbered step list if the answer contains steps, and
end with "## أسئلة شائعة" with 2-3 short Q&As that are answered by the verified answer only.
Do not write a sources section and do not write a community-experiences section (added separately).

Return JSON: {{"slug": "short-english-slug-with-dashes", "title": "Arabic title (max 70 chars)",
 "description": "Arabic meta description (max 160 chars)", "body": "markdown"}}"""

OUTCOME = {"worked": "✅ نجح معه", "did_not_work": "❌ لم ينجح معه", "unknown": "ℹ️"}
DISCLAIMER = ("> تجارب ملخّصة من نقاشات عامة في مجموعات الجالية العربية في هولندا، بدون أسماء أو تفاصيل شخصية. "
              "هي تجارب فردية وليست نصيحة رسمية، وقد يختلف وضعك. استُبعدت الردود العشوائية والردود المخالفة "
              "للمصادر الرسمية.")


def experiences(con, cid: int) -> list:
    rows = con.execute("""SELECT cm.id, cm.summary, cm.outcome, cm.text, cm.screenshot, p.post_url
                          FROM comments cm JOIN questions q ON q.post_id = cm.post_id
                          JOIN posts p ON p.id = cm.post_id
                          WHERE q.cluster_id=? AND cm.kind='experience' AND cm.summary <> ''
                            AND COALESCE(cm.verdict,'') <> 'contradict'
                          ORDER BY (cm.outcome='unknown'), cm.rowid""", (cid,)).fetchall()
    seen, out = set(), []
    for r in rows:
        key = re.sub(r"\W+", "", r["summary"])[:80]
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
        if len(out) >= MAX_EXPERIENCES:
            break
    return out


def slugify(s: str, fallback: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")
    return s[:60] or fallback


def draft_cluster(con, c, llm) -> tuple[str, str, str]:
    sources = json.loads(c["sources"] or "[]")
    res = llm.json(ARTICLE_PROMPT.format(
        q=c["title"], answer=c["official_answer"],
        sources="; ".join(f"{s.get('title') or ''} {s['url']}" for s in sources)))
    slug = slugify(res.get("slug"), f"topic-{c['id']}")
    title = (res.get("title") or c["title"]).strip()
    body = (res.get("body") or c["official_answer"]).strip()
    exps = experiences(con, c["id"])

    md = ["---", f"title: {json.dumps(title, ensure_ascii=False)}",
          f"description: {json.dumps(res.get('description') or '', ensure_ascii=False)}",
          f"slug: {slug}", f"topic_id: {c['id']}", f"asked_times: {c['n_questions']}",
          f"confidence: {c['confidence']}", f"verified_at: {c['verified_at']}",
          "status: draft - review every fact against the sources before publishing", "---", "",
          f"# {title}", "", body, "", "## المصادر الرسمية", ""]
    md += [f"- [{s.get('title') or s['url']}]({s['url']})" for s in sources]
    if c["article_url"] or c["video_url"]:
        md += ["", "## اقرأ أيضاً / شاهد", ""]
        if c["article_url"]:
            md.append(f"- {site_index.full_url(c['article_url'])}")
        if c["video_url"]:
            md.append(f"- {c['video_url']}")
    if exps:
        md += ["", "## تجارب من الجالية", "", DISCLAIMER, ""]
        md += [f"- {OUTCOME.get(e['outcome'], 'ℹ️')} — {e['summary']}" for e in exps]
    article = "\n".join(md) + "\n"

    rv = [f"# PRIVATE review sheet - topic {c['id']}: {c['title']}", "",
          "Do NOT publish this file. It links each experience in the draft to its original comment.", "",
          "## Questions in this topic", ""]
    for q in con.execute("""SELECT q.question, p.post_url FROM questions q JOIN posts p ON p.id=q.post_id
                            WHERE q.cluster_id=? LIMIT 30""", (c["id"],)):
        rv.append(f"- {q['question']}  {q['post_url'] or ''}")
    rv += ["", "## Experiences used", ""]
    for e in exps:
        shot = (DATA / e["screenshot"]).as_posix() if e["screenshot"] else "(no screenshot)"
        rv += [f"### {e['summary']}", f"- post: {e['post_url'] or '?'}", f"- screenshot: {shot}",
               "- original:", "", "  > " + e["text"].replace("\n", "\n  > "), ""]
    return slug, article, "\n".join(rv) + "\n"


def run(con=None, llm=None, cfg=None, topic=None) -> list[str]:
    con, cfg = con or db(), cfg or load_config()
    if llm is None:
        from llm import Gemini
        llm = Gemini(cfg)
    if topic:
        rows = con.execute("SELECT * FROM clusters WHERE id=?", (topic,)).fetchall()
    else:
        rows = con.execute("""SELECT * FROM clusters WHERE confidence IN ('high','medium')
                              AND official_answer <> '' AND n_questions >= ?
                              AND (drafted_at IS NULL OR drafted_at < verified_at)
                              ORDER BY n_questions DESC""", (cfg["min_questions_for_article"],)).fetchall()
    made = []
    for c in rows:
        if not c["official_answer"]:
            print(f"[{c['id']}] no verified official answer - run verify.py first")
            continue
        try:
            slug, article, review = draft_cluster(con, c, llm)
        except Exception as e:
            if type(e).__name__ == "BudgetExhausted":
                print(e)
                break
            print(f"[{c['id']}] failed: {e}")
            continue
        path = write_text(DRAFTS / f"{slug}.md", article)
        write_text(DRAFTS / f"{slug}.review.md", review)
        con.execute("UPDATE clusters SET draft_path=?, drafted_at=? WHERE id=?", (str(path), now(), c["id"]))
        con.commit()
        made.append(str(path))
        print(f"[{c['id']}] draft: {path}")
    return made


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--topic", type=int)
    a = ap.parse_args()
    run(topic=a.topic)
