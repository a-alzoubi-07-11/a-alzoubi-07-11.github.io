"""Small admin commands.

    python manage.py stats
    python manage.py topics [N]                 list the N most-asked topics (default 30)
    python manage.py show <topic_id>            questions + answers of one topic
    python manage.py set-video <topic_id> <youtube_url>
    python manage.py set-article <topic_id> </articles/slug.html | none>
    python manage.py merge <keep_id> <other_id> merge two topics that are really the same
    python manage.py posted <post_id>           you posted the drafted reply
    python manage.py skip <post_id>             don't reply to this post
    python manage.py purge-old <days>           delete raw posts/comments/screenshots older than N days
                                                (topics, counts and summaries are kept)
"""
from __future__ import annotations

import sys

from common import DATA, db


def main(argv):
    if not argv:
        print(__doc__)
        return
    con = db()
    cmd, args = argv[0], argv[1:]
    if cmd == "stats":
        for t, q in [("posts", "SELECT COUNT(*) FROM posts"),
                     ("question posts", "SELECT COUNT(*) FROM posts WHERE is_question=1"),
                     ("not analyzed", "SELECT COUNT(*) FROM posts WHERE analyzed=0"),
                     ("comments", "SELECT COUNT(*) FROM comments"),
                     ("experiences", "SELECT COUNT(*) FROM comments WHERE kind='experience'"),
                     ("topics", "SELECT COUNT(*) FROM clusters"),
                     ("topics with guide", "SELECT COUNT(*) FROM clusters WHERE article_url IS NOT NULL"),
                     ("verified topics", "SELECT COUNT(*) FROM clusters WHERE confidence IN ('high','medium')"),
                     ("screenshots", "SELECT COUNT(*) FROM comments WHERE screenshot IS NOT NULL")]:
            print(f"{t:20} {con.execute(q).fetchone()[0]}")
    elif cmd == "topics":
        n = int(args[0]) if args else 30
        for r in con.execute("SELECT * FROM clusters ORDER BY n_questions DESC LIMIT ?", (n,)):
            flags = ("G" if r["article_url"] else "-") + ("V" if r["video_url"] else "-") + \
                    ("✓" if r["confidence"] in ("high", "medium") else "-")
            print(f"[{r['id']:>4}] {r['n_questions']:>3}x {flags}  {r['title']}")
        print("\nG = guide on site, V = video, ✓ = verified against official sources")
    elif cmd == "show":
        c = con.execute("SELECT * FROM clusters WHERE id=?", (int(args[0]),)).fetchone()
        if not c:
            sys.exit("no such topic")
        for k in ("title", "keywords", "n_questions", "article_url", "video_url", "confidence",
                  "official_answer", "sources", "draft_path"):
            print(f"{k}: {c[k]}")
        print("\nquestions:")
        for q in con.execute("SELECT question FROM questions WHERE cluster_id=?", (c["id"],)):
            print(" -", q["question"])
        print("\ncomments:")
        for r in con.execute("""SELECT cm.kind, cm.verdict, cm.outcome, cm.summary FROM comments cm
                                JOIN questions q ON q.post_id=cm.post_id
                                WHERE q.cluster_id=? AND cm.kind <> 'noise'""", (c["id"],)):
            print(f" - [{r['kind']}/{r['verdict'] or '?'}/{r['outcome']}] {r['summary']}")
    elif cmd == "set-video":
        con.execute("UPDATE clusters SET video_url=? WHERE id=?", (args[1], int(args[0])))
    elif cmd == "set-article":
        url = None if args[1].lower() == "none" else args[1]
        con.execute("UPDATE clusters SET article_url=?, matched_at=datetime('now') WHERE id=?", (url, int(args[0])))
    elif cmd == "merge":
        keep, other = int(args[0]), int(args[1])
        con.execute("UPDATE questions SET cluster_id=? WHERE cluster_id=?", (keep, other))
        con.execute("DELETE FROM clusters WHERE id=?", (other,))
        con.execute("UPDATE clusters SET n_questions=(SELECT COUNT(*) FROM questions WHERE cluster_id=?) WHERE id=?",
                    (keep, keep))
    elif cmd in ("posted", "skip"):
        n = con.execute("UPDATE posts SET reply_status=? WHERE id=?",
                        ("posted" if cmd == "posted" else "skipped", args[0])).rowcount
        print("ok" if n else "no such post")
    elif cmd == "purge-old":
        days = int(args[0])
        cutoff = f"-{days} day"
        for r in con.execute("""SELECT cm.screenshot FROM comments cm JOIN posts p ON p.id=cm.post_id
                                WHERE cm.screenshot IS NOT NULL AND p.scraped_at < datetime('now', 'localtime', ?)""", (cutoff,)):
            (DATA / r["screenshot"]).unlink(missing_ok=True)
        con.execute("""UPDATE comments SET text='', screenshot=NULL WHERE post_id IN
                       (SELECT id FROM posts WHERE scraped_at < datetime('now', 'localtime', ?))""", (cutoff,))
        con.execute("UPDATE posts SET text='' WHERE scraped_at < datetime('now', 'localtime', ?)", (cutoff,))
        print("raw text and screenshots purged")
    else:
        print(__doc__)
        return
    con.commit()


if __name__ == "__main__":
    main(sys.argv[1:])
