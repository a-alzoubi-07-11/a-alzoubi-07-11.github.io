"""Step 1: read new posts + comments from Facebook groups, slowly, with your own login.

    python scraper.py              # normal run (refuses a 3rd run on the same day)
    python scraper.py --force      # ignore the daily run limit
    python scraper.py --jitter 30  # wait a random 0-30 minutes first (for scheduled runs)

First run: a Chromium window opens; log in to Facebook by hand. The session is
saved in ./fb_profile (git-ignored) so later runs start logged in.

What it stores (SQLite, data/fb_groups.db, local only):
  posts:    post URL, post text (without comments)
  comments: comment text (without the commenter's name where Facebook allows it)
            + a private screenshot of comments that look useful
Nothing is posted, liked or clicked apart from "See more" / "More comments".
"""
from __future__ import annotations

import argparse
import random
import sys
import time

from common import PROFILE, SHOTS, db, load_config, now, sha, today

SEE_MORE = ["See more", "عرض المزيد", "Meer weergeven", "Lees meer"]
MORE_COMMENTS = [r"^View (\d+ )?more comments?", r"^View (all )?\d+ (more )?(comments|replies)",
                 r"^عرض (المزيد من )?التعليقات", r"^عرض \d+ ", r"^Meer reacties", r"^Bekijk (nog )?\d* ?(meer )?reacties"]
MAX_COMMENT_EXPANDS = 2         # per post: keep it light
MIN_POST_CHARS = 20
SHOT_MIN_CHARS = 40             # screenshot comments at least this long (likely real answers)
MAX_SHOTS_PER_POST = 6

# --- JavaScript run inside the page -------------------------------------------------
# Marks top-level posts in the feed (not the comments, which are also role=article).
JS_MARK_POSTS = r"""
() => {
  const feed = document.querySelector('div[role="feed"]') || document;
  const arts = [...feed.querySelectorAll('div[role="article"]')]
      .filter(a => !a.parentElement.closest('div[role="article"]'));
  window.__fbqa = window.__fbqa || 0;
  const ids = [];
  for (const a of arts) {
    if (!a.dataset.fbqaP) a.dataset.fbqaP = String(++window.__fbqa);
    ids.push(a.dataset.fbqaP);
  }
  return ids;
}
"""

JS_CLICK = r"""
([art, plain, patterns]) => {
  const res = patterns.map(p => new RegExp(p, 'i'));
  let n = 0;
  for (const b of art.querySelectorAll('div[role="button"], span[role="button"]')) {
    const t = (b.innerText || '').trim();
    if (!t || t.length > 60) continue;
    if (plain.includes(t) || res.some(r => r.test(t))) { b.click(); n++; }
  }
  return n;
}
"""

# Splits one post element into: permalink, post body, list of comment texts.
JS_EXTRACT = r"""
(art) => {
  const leafTexts = (root, owner) => {
    const out = [];
    for (const d of root.querySelectorAll('div[dir="auto"], span[dir="auto"]')) {
      if (owner && d.closest('div[role="article"]') !== owner) continue;
      if (d.querySelector('div[dir="auto"], span[dir="auto"]')) continue;
      if (d.closest('a[role="link"] h2, h2, h3, h4')) continue;      // names / headers
      const t = (d.innerText || '').trim();
      if (t) out.push(t);
    }
    return [...new Set(out)];
  };
  let link = null;
  for (const a of art.querySelectorAll('a[href]')) {
    const h = a.href;
    if (/\/groups\/[^/]+\/(posts|permalink)\/\d+/.test(h) || /[?&]story_fbid=\d+/.test(h)) {
      link = h.replace(/[?&](__cft__|__tn__|comment_id|ref)[^&]*/g, '').split('#')[0];
      if (link.includes('/posts/') || link.includes('/permalink/')) link = link.split('?')[0];
      break;
    }
  }
  const comments = [...art.querySelectorAll('div[role="article"]')];
  const msg = art.querySelector('[data-ad-preview="message"], [data-ad-comet-preview="message"]');
  let body = msg ? (msg.innerText || '').trim() : '';
  if (!body) {
    const parts = [];
    for (const d of art.querySelectorAll('div[dir="auto"]')) {
      if (comments.some(c => c.contains(d))) continue;
      if (d.querySelector('div[dir="auto"]')) continue;
      const t = (d.innerText || '').trim();
      if (t) parts.push(t);
    }
    body = [...new Set(parts)].join('\n');
  }
  const out = comments.map((c, i) => {
    c.dataset.fbqaC = art.dataset.fbqaP + '-' + i;
    return { mark: c.dataset.fbqaC, text: leafTexts(c, c).join('\n') };
  }).filter(c => c.text);
  return { link, body, comments: out };
}
"""


def pause(a: float = 2, b: float = 5):
    time.sleep(random.uniform(a, b))


def runs_today(con) -> int:
    return con.execute("SELECT COUNT(*) FROM runs WHERE day=? AND kind='scrape'", (today(),)).fetchone()[0]


def logged_in(ctx) -> bool:
    return any(c["name"] == "c_user" for c in ctx.cookies("https://www.facebook.com"))


def feed_url(url: str, chronological: bool) -> str:
    url = url.rstrip("/")
    if chronological and "sorting_setting" not in url:
        url += ("&" if "?" in url else "?") + "sorting_setting=CHRONOLOGICAL"
    return url


def close_dialogs(page):
    if page.query_selector('div[role="dialog"]'):
        page.keyboard.press("Escape")
        pause(0.8, 1.5)


def save_post(con, page, group_url: str, art, data: dict) -> bool:
    """Store one post + its comments. Returns True if the post was new."""
    body = (data.get("body") or "").strip()
    if len(body) < MIN_POST_CHARS:
        return False
    link = data.get("link") or ""
    pid = sha(link) if link else sha(group_url, body[:300])
    if con.execute("SELECT 1 FROM posts WHERE id=?", (pid,)).fetchone():
        # Known post: still pick up comments added since last time.
        new = _save_comments(con, page, pid, data["comments"])
        if new:
            con.commit()
        return False
    con.execute("INSERT INTO posts(id, group_url, post_url, text, scraped_at) VALUES(?,?,?,?,?)",
                (pid, group_url, link, body, now()))
    _save_comments(con, page, pid, data["comments"])
    con.commit()
    return True


def _save_comments(con, page, pid: str, comments: list[dict]) -> int:
    shots = 0
    new = 0
    for c in comments:
        text = c["text"].strip()
        if not text:
            continue
        cid = sha(pid, text[:300])
        if con.execute("SELECT 1 FROM comments WHERE id=?", (cid,)).fetchone():
            continue
        shot = None
        if len(text) >= SHOT_MIN_CHARS and shots < MAX_SHOTS_PER_POST:
            el = page.query_selector(f'[data-fbqa-c="{c["mark"]}"]')
            if el:
                try:
                    SHOTS.mkdir(parents=True, exist_ok=True)
                    path = SHOTS / f"{cid}.png"
                    el.screenshot(path=str(path), timeout=8000)
                    shot = str(path.relative_to(SHOTS.parent))
                    shots += 1
                except Exception:
                    pass
        con.execute("INSERT INTO comments(id, post_id, text, screenshot) VALUES(?,?,?,?)",
                    (cid, pid, text, shot))
        new += 1
    return new


def scrape_group(page, con, url: str, cfg: dict) -> int:
    page.goto(feed_url(url, cfg["chronological_feed"]), wait_until="domcontentloaded")
    pause(4, 8)
    if "login" in page.url or "checkpoint" in page.url:
        raise SystemExit("Facebook asks for login/verification. Run again and log in by hand.")
    done: set[str] = set()
    new = known_streak = 0
    for _ in range(cfg["max_scrolls_per_group"]):
        for mark in page.evaluate(JS_MARK_POSTS):
            if mark in done:
                continue
            done.add(mark)
            art = page.query_selector(f'div[data-fbqa-p="{mark}"]')
            if not art:
                continue
            try:
                art.scroll_into_view_if_needed(timeout=5000)
                pause(0.8, 2)
                if page.evaluate(JS_CLICK, [art, SEE_MORE, []]):
                    pause(1, 2)
                for _ in range(MAX_COMMENT_EXPANDS):
                    if not page.evaluate(JS_CLICK, [art, [], MORE_COMMENTS]):
                        break
                    pause(1.5, 3)
                    close_dialogs(page)
                data = page.evaluate(JS_EXTRACT, art)
            except Exception as e:                      # element vanished / FB re-rendered
                print(f"  skip post ({type(e).__name__})")
                continue
            if save_post(con, page, url, art, data):
                new += 1
                known_streak = 0
            elif (data.get("body") or "").strip():
                known_streak += 1
            if new >= cfg["max_posts_per_group"] or known_streak >= cfg["stop_after_known_posts"]:
                return new
        page.mouse.wheel(0, random.randint(1200, 2200))
        pause(3, 6)
    return new


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--force", action="store_true", help="ignore max_runs_per_day")
    ap.add_argument("--jitter", type=int, default=0, help="wait a random 0..N minutes before starting")
    args = ap.parse_args(argv)

    cfg = load_config()
    if not cfg["groups"]:
        sys.exit("No groups configured. Copy config.example.json to config.json and fill in \"groups\".")
    con = db()
    if not args.force and runs_today(con) >= cfg["max_runs_per_day"]:
        sys.exit(f"Already {runs_today(con)} scrape runs today (limit {cfg['max_runs_per_day']}). Use --force to override.")
    if args.jitter:
        w = random.uniform(0, args.jitter * 60)
        print(f"Waiting {w / 60:.1f} minutes before starting...")
        time.sleep(w)

    from playwright.sync_api import sync_playwright
    con.execute("INSERT INTO runs(day, started_at, kind) VALUES(?,?, 'scrape')", (today(), now()))
    con.commit()
    groups = cfg["groups"][:]
    random.shuffle(groups)
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(str(PROFILE), headless=False,
                                                   viewport={"width": 1280, "height": 900},
                                                   locale="ar")
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        if not logged_in(ctx):
            page.goto("https://www.facebook.com")
            input("Log in to Facebook in the opened window, then press Enter here... ")
            if not logged_in(ctx):
                ctx.close()
                sys.exit("Still not logged in; stopping.")
        total = 0
        for i, g in enumerate(groups):
            try:
                n = scrape_group(page, con, g, cfg)
            except SystemExit:
                raise
            except Exception as e:
                print(f"{g}: error {type(e).__name__}: {e}")
                n = 0
            total += n
            print(f"{g}: {n} new posts")
            if i < len(groups) - 1:
                pause(20, 60)                           # long human-like gap between groups
        ctx.close()
    print(f"Done: {total} new posts.")


if __name__ == "__main__":
    main()
