"""Step 2: turn raw posts into questions, answers and experiences, then group questions.

    python analyze.py

1. For each new post the LLM decides: is it a question? what is the question
   (rewritten in clear Arabic, without names)? and for each comment: is it a
   claim about the rules, a personal experience, or noise? Each comment gets an
   anonymized one-line summary - articles only ever use these summaries.
2. Screenshots of noise comments are deleted (only useful ones are kept).
3. New questions are grouped into clusters ("topics") of the same question.
4. Each cluster is matched to an existing gidsnederland.nl guide + its YouTube video.
"""
from __future__ import annotations

import json

from common import DATA, db, now, tokens
import site_index

POSTS_PER_CALL = 4
QUESTIONS_PER_CALL = 25
MAX_COMMENTS_PER_POST = 25

EXTRACT_PROMPT = """You analyse posts from Facebook groups of Syrians/Arabs living in the Netherlands.
For EACH post below return an object in a JSON array, same order, with:
  "post": the post key (e.g. "p1"),
  "is_question": true if the post asks for information/advice about life in the Netherlands
                 (residence, IND, benefits, taxes, work, housing, health insurance, study, municipality...),
                 false for ads, selling, greetings, news without a question, etc.
  "question": if is_question, ONE clear standalone question in Modern Standard Arabic (max 25 words),
              general enough that others asking the same thing would get the same wording.
              No names, no phone numbers, no personal details. Else "".
  "keywords": 3-6 short keywords (Arabic and the Dutch official term if any, e.g. "huurtoeslag").
  "comments": for each comment key: {{"c": key, "kind": one of
       "official_claim" (states a rule/fact/procedure),
       "experience" (tells what happened to them or someone they know when they tried something),
       "noise" (jokes, tags, "following", "pm me", off-topic, insults, ads, vague answers),
     "summary": one neutral sentence in Arabic WITHOUT any names or identifying details
                (e.g. "شخص قدّم الطلب عبر الإنترنت وحصل على الرد خلال 3 أسابيع"), "" for noise,
     "outcome": "worked" | "did_not_work" | "unknown"}}
Return ONLY the JSON array.

POSTS:
{posts}
"""

CLUSTER_PROMPT = """Group questions from Arabic Facebook groups in the Netherlands into topics.
Two questions belong to the same topic when ONE article could answer both.

Existing topics (id: title):
{clusters}

New questions (key: question):
{questions}

Return a JSON array, one object per new question:
  {{"q": key, "topic": existing topic id (number)}}  OR
  {{"q": key, "new": "short canonical question in Arabic", "keywords": "k1, k2, k3"}}
Questions in this batch that share a NEW topic must use the exact same "new" text.
Return ONLY the JSON array.
"""

MATCH_PROMPT = """For each topic decide which article of the website answers it, or none.
Pick an article only if it really answers the question (not just the same general area).

{blocks}

Return a JSON array: [{{"topic": id, "article": "the url" or null}}]. Only JSON.
"""


def _chunks(xs, n):
    for i in range(0, len(xs), n):
        yield xs[i:i + n]


def extract(con, llm) -> int:
    posts = con.execute("SELECT id, text FROM posts WHERE analyzed=0 ORDER BY scraped_at").fetchall()
    done = 0
    for batch in _chunks(posts, POSTS_PER_CALL):
        keymap, cmap, blocks = {}, {}, []
        for i, p in enumerate(batch, 1):
            pk = f"p{i}"
            keymap[pk] = p["id"]
            lines = [f"[{pk}] POST: {p['text'][:2500]}"]
            rows = con.execute("SELECT id, text FROM comments WHERE post_id=? LIMIT ?",
                               (p["id"], MAX_COMMENTS_PER_POST)).fetchall()
            for j, c in enumerate(rows, 1):
                ck = f"{pk}c{j}"
                cmap[ck] = c["id"]
                lines.append(f"   [{ck}] COMMENT: {c['text'][:700]}")
            blocks.append("\n".join(lines))
        res = llm.json(EXTRACT_PROMPT.format(posts="\n\n".join(blocks)))
        if isinstance(res, dict):
            res = res.get("posts") or res.get("results") or [res]
        for r in res:
            pid = keymap.get(str(r.get("post")))
            if not pid:
                continue
            isq = bool(r.get("is_question")) and bool((r.get("question") or "").strip())
            con.execute("UPDATE posts SET analyzed=1, is_question=? WHERE id=?", (int(isq), pid))
            if isq:
                con.execute("INSERT OR REPLACE INTO questions(post_id, question, keywords, cluster_id) "
                            "VALUES(?,?,?,NULL)", (pid, r["question"].strip(), _kw(r)))
            for c in r.get("comments") or []:
                cid = cmap.get(str(c.get("c")))
                if not cid:
                    continue
                kind = c.get("kind") if c.get("kind") in ("official_claim", "experience", "noise") else "noise"
                con.execute("UPDATE comments SET kind=?, summary=?, outcome=? WHERE id=?",
                            (kind, (c.get("summary") or "").strip(), c.get("outcome") or "unknown", cid))
            done += 1
        # Posts the model skipped: mark analyzed anyway so one bad post can't block the queue.
        for pid in keymap.values():
            con.execute("UPDATE posts SET analyzed=1 WHERE id=? AND analyzed=0", (pid,))
        con.commit()
    prune_screenshots(con)
    return done


def _kw(r) -> str:
    kw = r.get("keywords") or ""
    if isinstance(kw, list):
        kw = ", ".join(map(str, kw))
    return str(kw)


def prune_screenshots(con):
    """Keep screenshots only for comments that turned out useful."""
    rows = con.execute("SELECT id, screenshot FROM comments WHERE kind='noise' AND screenshot IS NOT NULL").fetchall()
    for r in rows:
        f = DATA / r["screenshot"]
        try:
            f.unlink(missing_ok=True)
        except OSError:
            pass
        con.execute("UPDATE comments SET screenshot=NULL WHERE id=?", (r["id"],))
    con.commit()


def cluster(con, llm) -> int:
    rows = con.execute("SELECT post_id, question, keywords FROM questions WHERE cluster_id IS NULL").fetchall()
    n = 0
    for batch in _chunks(rows, QUESTIONS_PER_CALL):
        qtext = {f"q{i}": (r["question"], r["keywords"] or "") for i, r in enumerate(batch, 1)}
        qpost = {f"q{i}": r["post_id"] for i, r in enumerate(batch, 1)}
        want = set().union(*(tokens(a + " " + b) for a, b in qtext.values()))
        existing = con.execute("SELECT id, title, keywords FROM clusters").fetchall()
        ranked = sorted(existing, key=lambda c: -len(want & tokens(f"{c['title']} {c['keywords'] or ''}")))[:60]
        res = llm.json(CLUSTER_PROMPT.format(
            clusters="\n".join(f"{c['id']}: {c['title']}" for c in ranked) or "(none yet)",
            questions="\n".join(f"{k}: {a}" for k, (a, _) in qtext.items())))
        if isinstance(res, dict):
            res = res.get("results") or res.get("questions") or []
        valid = {c["id"] for c in existing}
        made: dict[str, int] = {}
        for r in res:
            k = str(r.get("q"))
            if k not in qpost:
                continue
            cid = r.get("topic")
            try:
                cid = int(cid) if cid is not None else None
            except (TypeError, ValueError):
                cid = None
            if cid not in valid:
                title = (r.get("new") or qtext[k][0]).strip()
                if title in made:
                    cid = made[title]
                else:
                    cur = con.execute("INSERT INTO clusters(title, keywords) VALUES(?,?)",
                                      (title, r.get("keywords") or qtext[k][1]))
                    cid = made[title] = cur.lastrowid
                    valid.add(cid)
            con.execute("UPDATE questions SET cluster_id=? WHERE post_id=?", (cid, qpost[k]))
            n += 1
        con.commit()
    con.execute("""UPDATE clusters SET n_questions =
                   (SELECT COUNT(*) FROM questions q WHERE q.cluster_id = clusters.id)""")
    con.commit()
    return n


def match_site(con, llm, refresh: bool = False) -> int:
    where = "" if refresh else "WHERE matched_at IS NULL"
    rows = con.execute(f"SELECT id, title, keywords, video_url FROM clusters {where}").fetchall()
    todo = []
    for c in rows:
        cands = site_index.candidates(f"{c['title']} {c['keywords'] or ''}")
        if cands:
            todo.append((c, cands))
        else:
            con.execute("UPDATE clusters SET matched_at=? WHERE id=?", (now(), c["id"]))
    for batch in _chunks(todo, 8):
        blocks = []
        for c, cands in batch:
            opts = "\n".join(f"   - {x['u']} | {x['t']} | {x.get('d', '')[:160]}" for x in cands)
            blocks.append(f"TOPIC {c['id']}: {c['title']}\n  candidate articles:\n{opts}")
        res = llm.json(MATCH_PROMPT.format(blocks="\n\n".join(blocks)))
        if isinstance(res, dict):
            res = res.get("results") or []
        picked = {}
        for r in res:
            try:
                picked[int(r.get("topic"))] = r.get("article")
            except (TypeError, ValueError):
                pass
        for c, cands in batch:
            url = picked.get(c["id"])
            if url not in {x["u"] for x in cands}:
                url = None
            video = c["video_url"]
            if url and not video:
                vids = site_index.videos(url)
                video = vids[0] if vids else None
            con.execute("UPDATE clusters SET article_url=?, video_url=?, matched_at=? WHERE id=?",
                        (url, video, now(), c["id"]))
        con.commit()
    return len(todo)


def run(con=None, llm=None, refresh_matches=False) -> dict:
    con = con or db()
    if llm is None:
        from llm import Gemini
        llm = Gemini()
    from llm import BudgetExhausted
    stats = {"posts": 0, "clustered": 0, "matched": 0}
    try:
        stats["posts"] = extract(con, llm)
        stats["clustered"] = cluster(con, llm)
        stats["matched"] = match_site(con, llm, refresh_matches)
    except BudgetExhausted as e:
        print(e)
    return stats


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refresh-matches", action="store_true",
                    help="re-match every topic to the site (after publishing new guides)")
    a = ap.parse_args()
    print(json.dumps(run(refresh_matches=a.refresh_matches), ensure_ascii=False))
