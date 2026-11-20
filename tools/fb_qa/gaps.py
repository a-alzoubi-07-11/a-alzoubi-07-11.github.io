"""Step 6: topics people ask about that have no guide and/or no video yet - ranked by demand.

    python gaps.py

Writes out/gaps_<date>.md and out/gaps_<date>.csv:
  1. No guide and no video   -> new article + video ideas (most asked first)
  2. Guide exists, no video  -> video ideas
No LLM calls.
"""
from __future__ import annotations

import csv
import io

from common import OUT, db, today, write_text
import site_index


def run(con=None, min_questions: int = 1) -> tuple[str, str]:
    con = con or db()
    rows = con.execute("""SELECT c.*, MAX(p.scraped_at) AS last_asked
                          FROM clusters c JOIN questions q ON q.cluster_id=c.id JOIN posts p ON p.id=q.post_id
                          WHERE c.n_questions >= ? AND (c.article_url IS NULL OR c.video_url IS NULL)
                          GROUP BY c.id ORDER BY c.n_questions DESC, last_asked DESC""",
                       (min_questions,)).fetchall()
    none_ = [r for r in rows if not r["article_url"] and not r["video_url"]]
    novideo = [r for r in rows if r["article_url"] and not r["video_url"]]

    md = [f"# Content gaps {today()}", "",
          f"## 1. No guide and no video ({len(none_)})", "",
          "| # | asked | topic | official answer found? | last asked |", "|---|---|---|---|---|"]
    for i, r in enumerate(none_, 1):
        md.append(f"| {i} | {r['n_questions']} | [{r['id']}] {r['title']} | "
                  f"{r['confidence'] or 'not verified'} | {(r['last_asked'] or '')[:10]} |")
    md += ["", f"## 2. Guide exists, no video yet ({len(novideo)})", "",
           "| # | asked | topic | guide |", "|---|---|---|---|"]
    for i, r in enumerate(novideo, 1):
        md.append(f"| {i} | {r['n_questions']} | [{r['id']}] {r['title']} | {site_index.full_url(r['article_url'])} |")

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["gap", "asked", "topic_id", "topic", "keywords", "article_url", "confidence", "last_asked"])
    for gap, rs in (("no_article_no_video", none_), ("no_video", novideo)):
        for r in rs:
            w.writerow([gap, r["n_questions"], r["id"], r["title"], r["keywords"] or "",
                        site_index.full_url(r["article_url"]) if r["article_url"] else "",
                        r["confidence"] or "", (r["last_asked"] or "")[:10]])
    a = write_text(OUT / f"gaps_{today()}.md", "\n".join(md) + "\n")
    # utf-8-sig so Excel opens the Arabic correctly
    b = OUT / f"gaps_{today()}.csv"
    b.write_text(buf.getvalue(), encoding="utf-8-sig")
    print(f"{len(none_)} topics without guide/video, {len(novideo)} without video -> {a}")
    return str(a), str(b)


if __name__ == "__main__":
    run()
