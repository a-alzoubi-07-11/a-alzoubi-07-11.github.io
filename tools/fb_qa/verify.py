"""Step 3: check each topic against official Dutch sources.

    python verify.py                 # topics with >= min_questions_for_article questions
    python verify.py --all           # every topic
    python verify.py --topic 12      # one topic

Sources, in this order:
  1. the official links already cited in the matching gidsnederland.nl guide
     (those were checked by hand when the guide was written);
  2. official pages the LLM suggests - only fetched if the domain is on the
     official_domains allowlist in config (IND, Rijksoverheid, UWV, ...).
The LLM then writes the official answer (Arabic) using ONLY the fetched text,
and marks every community claim/experience as match / contradict / not_covered.
Contradicting comments are excluded from articles and flagged in the report.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import urllib.request
from html.parser import HTMLParser

from common import OUT, db, load_config, now, today, write_text
import site_index

MAX_SOURCES = 3
MAX_CHARS_PER_SOURCE = 12000
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) fb-qa-verifier"

SUGGEST_PROMPT = """Which official Dutch government web pages answer this question from a newcomer in the Netherlands?
Question (Arabic): {q}
Keywords: {kw}
Give up to 3 exact URLs you are confident exist, only on these domains: {domains}.
Prefer specific Q&A pages (e.g. rijksoverheid.nl/onderwerpen/.../vraag-en-antwoord/...) over home pages.
Return JSON: {{"urls": ["..."]}}"""

VERIFY_PROMPT = """You verify community answers against OFFICIAL Dutch sources.

QUESTION (from Arabic Facebook groups in the Netherlands): {q}

OFFICIAL SOURCE TEXTS:
{sources}

COMMUNITY COMMENTS (anonymized summaries):
{claims}

Rules:
- Write "official_answer" in clear Modern Standard Arabic (80-200 words), using ONLY facts present in the
  official texts. Keep Dutch official terms in brackets, e.g. (huurtoeslag). Mention amounts/dates only if the
  text gives them. If the texts do not answer the question, set "official_answer" to "".
- "sources": the source keys (S1, S2...) you actually used.
- "confidence": "high" if the texts answer it directly, "medium" if partly, "low" if barely.
- For each comment: "match" (consistent with the official texts), "contradict" (conflicts with them),
  or "not_covered" (the texts say nothing about it - normal for personal experiences).
Return JSON: {{"official_answer": "...", "sources": ["S1"], "confidence": "high|medium|low",
  "comments": [{{"c": key, "verdict": "match|contradict|not_covered"}}]}}"""


class _Text(HTMLParser):
    SKIP = {"script", "style", "nav", "header", "footer", "noscript", "svg", "form"}

    def __init__(self):
        super().__init__()
        self.out, self.depth, self.title = [], 0, ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.depth += 1
        if tag == "title":
            self._in_title = True
        if tag in ("p", "li", "h1", "h2", "h3", "h4", "tr", "br", "div"):
            self.out.append("\n")

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif not self.depth:
            self.out.append(data)


def fetch_text(url: str) -> tuple[str, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "nl,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        if "html" not in (r.headers.get("Content-Type") or ""):
            return "", ""
        raw = r.read(2_000_000).decode(r.headers.get_content_charset() or "utf-8", "replace")
    p = _Text()
    p.feed(raw)
    text = re.sub(r"[ \t\r\f\v]+", " ", html.unescape("".join(p.out)))
    text = re.sub(r"\n\s*\n+", "\n", text).strip()
    return p.title.strip(), text[:MAX_CHARS_PER_SOURCE]


def gather_sources(c, llm, cfg, fetch=fetch_text) -> list[dict]:
    allowed = cfg["official_domains"]
    urls = site_index.official_links(c["article_url"], allowed) if c["article_url"] else []
    if len(urls) < MAX_SOURCES:
        try:
            sug = llm.json(SUGGEST_PROMPT.format(q=c["title"], kw=c["keywords"] or "",
                                                 domains=", ".join(allowed)))
            for u in (sug.get("urls") if isinstance(sug, dict) else sug) or []:
                if isinstance(u, str) and site_index.is_official(u, allowed) and u not in urls:
                    urls.append(u)
        except Exception as e:
            if type(e).__name__ == "BudgetExhausted":
                raise
            print(f"  (no URL suggestions: {e})")
    out = []
    for u in urls:
        if len(out) >= MAX_SOURCES:
            break
        try:
            title, text = fetch(u)
        except Exception as e:
            print(f"  skip {u}: {type(e).__name__}")
            continue
        if len(text) > 300:
            out.append({"url": u, "title": title, "text": text})
    return out


def verify_cluster(con, c, llm, cfg, fetch=fetch_text) -> dict:
    comments = con.execute("""SELECT cm.id, cm.kind, cm.summary FROM comments cm
                              JOIN questions q ON q.post_id = cm.post_id
                              WHERE q.cluster_id=? AND cm.kind IN ('official_claim','experience')
                                AND cm.summary <> '' LIMIT 60""", (c["id"],)).fetchall()
    sources = gather_sources(c, llm, cfg, fetch)
    if not sources:
        con.execute("UPDATE clusters SET official_answer='', sources='[]', confidence='none', verified_at=? "
                    "WHERE id=?", (now(), c["id"]))
        con.commit()
        return {"topic": c["id"], "status": "no_sources"}
    skeys = {f"S{i}": s for i, s in enumerate(sources, 1)}
    ckeys = {f"c{i}": r["id"] for i, r in enumerate(comments, 1)}
    res = llm.json(VERIFY_PROMPT.format(
        q=c["title"],
        sources="\n\n".join(f"[{k}] {s['url']}\n{s['title']}\n{s['text']}" for k, s in skeys.items()),
        claims="\n".join(f"[{k}] ({r['kind']}) {r['summary']}" for k, r in zip(ckeys, comments)) or "(none)"))
    used = [skeys[k] for k in (res.get("sources") or []) if k in skeys] or list(skeys.values())
    answer = (res.get("official_answer") or "").strip()
    conf = res.get("confidence") if res.get("confidence") in ("high", "medium", "low") else "low"
    if not answer:
        conf = "none"
    con.execute("UPDATE clusters SET official_answer=?, sources=?, confidence=?, verified_at=? WHERE id=?",
                (answer, json.dumps([{"url": s["url"], "title": s["title"]} for s in used], ensure_ascii=False),
                 conf, now(), c["id"]))
    bad = 0
    for v in res.get("comments") or []:
        cid = ckeys.get(str(v.get("c")))
        verdict = v.get("verdict")
        if cid and verdict in ("match", "contradict", "not_covered"):
            con.execute("UPDATE comments SET verdict=? WHERE id=?", (verdict, cid))
            bad += verdict == "contradict"
    con.commit()
    return {"topic": c["id"], "status": "verified", "confidence": conf, "contradictions": bad}


def report(con) -> str:
    rows = con.execute("""SELECT c.id, c.title, cm.summary FROM comments cm
                          JOIN questions q ON q.post_id = cm.post_id JOIN clusters c ON c.id = q.cluster_id
                          WHERE cm.verdict='contradict' ORDER BY c.n_questions DESC""").fetchall()
    lines = [f"# Community answers that contradict official sources ({today()})", "",
             "Common misconceptions - good material for a 'myth vs fact' video or article section.", ""]
    cur = None
    for r in rows:
        if r["id"] != cur:
            cur = r["id"]
            lines += ["", f"## [{r['id']}] {r['title']}"]
        lines.append(f"- {r['summary']}")
    return "\n".join(lines) + "\n"


def run(con=None, llm=None, cfg=None, topic=None, all_topics=False, fetch=fetch_text) -> list[dict]:
    con, cfg = con or db(), cfg or load_config()
    if llm is None:
        from llm import Gemini
        llm = Gemini(cfg)
    if topic:
        rows = con.execute("SELECT * FROM clusters WHERE id=?", (topic,)).fetchall()
    else:
        minq = 1 if all_topics else cfg["min_questions_for_article"]
        # (re)verify topics never verified, or verified more than 30 days ago
        rows = con.execute("""SELECT * FROM clusters WHERE n_questions >= ?
                              AND (verified_at IS NULL OR verified_at < date('now','-30 day'))
                              ORDER BY n_questions DESC""", (minq,)).fetchall()
    out = []
    for c in rows:
        print(f"verify [{c['id']}] {c['title']}")
        try:
            out.append(verify_cluster(con, c, llm, cfg, fetch))
        except Exception as e:
            if type(e).__name__ == "BudgetExhausted":
                print(e)
                break
            print(f"  failed: {e}")
    write_text(OUT / f"contradictions_{today()}.md", report(con))
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--topic", type=int)
    a = ap.parse_args()
    for r in run(topic=a.topic, all_topics=a.all):
        print(json.dumps(r, ensure_ascii=False))
