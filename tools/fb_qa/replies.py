"""Step 5: draft replies for NEW posts that ask a question you already answered.

    python replies.py

Writes out/replies_<date>.md: for each recent unanswered question post, the post
link, the question and a short ready-to-paste Arabic reply with the guide and/or
YouTube link. YOU post them by hand (automatic link posting gets accounts banned).

Easiest: open the replies page (replies_ui.py / "fb_qa - replies" shortcut) and use its
Copy / Open post / Posted buttons. Or by hand:  python manage.py posted|skip <post_id>
No LLM calls: replies come from varied templates, so this step costs nothing.
"""
from __future__ import annotations

import random

from common import OUT, db, load_config, today, write_text
import site_index

OPENERS = ["أهلاً بك 🌷", "مرحباً،", "أهلاً وسهلاً،", "السلام عليكم،", "يعطيك العافية،"]
ARTICLE_LINES = ["كتبنا شرحاً مفصلاً عن هذا الموضوع مع المصادر الرسمية:",
                 "هذا الموضوع مشروح خطوة بخطوة هنا مع روابط الجهات الرسمية:",
                 "تجد الجواب بالتفصيل في هذا الدليل (مع المصادر الرسمية):"]
VIDEO_LINES = ["وهذا فيديو يشرح الموضوع:", "وإذا كنت تفضّل الفيديو:", "وفيه شرح بالفيديو هنا:"]
CLOSERS = ["بالتوفيق 🙏", "إن شاء الله يفيدك.", "وإذا بقي عندك سؤال اكتبه هنا.", ""]


def compose(article_url: str | None, video_url: str | None, rnd: random.Random) -> str:
    parts = [rnd.choice(OPENERS)]
    if article_url:
        parts += [rnd.choice(ARTICLE_LINES), site_index.full_url(article_url)]
    if video_url:
        parts += [rnd.choice(VIDEO_LINES), video_url]
    closer = rnd.choice(CLOSERS)
    if closer:
        parts.append(closer)
    return "\n".join(parts)


def run(con=None, cfg=None, seed=None) -> str | None:
    con, cfg = con or db(), cfg or load_config()
    rnd = random.Random(seed)
    rows = con.execute("""SELECT p.id, p.post_url, p.group_url, q.question, c.id AS cid, c.title,
                                 c.article_url, c.video_url
                          FROM posts p JOIN questions q ON q.post_id = p.id JOIN clusters c ON c.id = q.cluster_id
                          WHERE p.reply_status='none' AND p.is_question=1
                            AND (c.article_url IS NOT NULL OR c.video_url IS NOT NULL)
                            AND p.scraped_at >= datetime('now', 'localtime', ?)
                          ORDER BY p.scraped_at DESC""", (f"-{int(cfg['reply_max_age_days'])} day",)).fetchall()
    if not rows:
        print("No new posts to reply to.")
        return None
    lines = [f"# Reply drafts {today()} ({len(rows)})", "",
             "Post these BY HAND, a few per group per day at most. Mark each one afterwards with",
             "`python manage.py posted <post_id>` (or `skip`).", ""]
    for r in rows:
        lines += [f"## {r['question']}", "",
                  f"- post: {r['post_url'] or r['group_url']}",
                  f"- topic [{r['cid']}]: {r['title']}", f"- post_id: `{r['id']}`", "", "```text"]
        text = compose(r["article_url"], r["video_url"], rnd)
        lines += [text, "```", ""]
        con.execute("UPDATE posts SET reply_status='drafted', reply_text=? WHERE id=?", (text, r["id"]))
    con.commit()
    path = write_text(OUT / f"replies_{today()}.md", "\n".join(lines))
    print(f"{len(rows)} reply drafts -> {path}")
    return str(path)


if __name__ == "__main__":
    run()
