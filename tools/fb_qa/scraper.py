"""Step 1: read new posts + comments from Facebook groups, slowly, with your own login.

    python scraper.py              # plan today: 3-5 sessions at random times, 15 new posts in total
    python scraper.py --now        # one short session right now (still inside today's 15)
    python scraper.py --plan-only  # just print today's random plan

Daily limit: at most max_posts_per_day (15) NEW posts per day across all groups and
all runs - there is no override. Sessions start at random times inside active_hours,
read a random share of the 15 from 1-2 random groups, pause 25-90 s per post, and
close the browser in between. Posts already read are not clicked or expanded again.

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
import datetime as dt
import random
import sys
import time

import os
import subprocess
from pathlib import Path

from common import CHROME_PROFILE, PROFILE, SHOTS, db, load_config, now, sha, today

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


def pause_cfg(rng):
    pause(*rng)


def posts_today(con) -> int:
    return con.execute("SELECT COUNT(*) FROM posts WHERE substr(scraped_at, 1, 10) = ?", (today(),)).fetchone()[0]


def quota_left(con, cfg) -> int:
    return max(0, int(cfg["max_posts_per_day"]) - posts_today(con))


def plan_day(cfg: dict, start: dt.datetime, remaining: int, rnd: random.Random | None = None):
    """Random session times today (from `start` until the end of active_hours) and how many
    new posts each may read. Quotas add up to `remaining`, each at least 1."""
    rnd = rnd or random.Random()
    if remaining <= 0:
        return []
    h0, h1 = cfg["active_hours"]
    day = start.replace(hour=0, minute=0, second=0, microsecond=0)
    lo = max(start + dt.timedelta(minutes=1), day + dt.timedelta(hours=h0))
    hi = day + dt.timedelta(hours=h1)
    if lo >= hi:
        return []
    gap = dt.timedelta(minutes=cfg["min_minutes_between_sessions"])
    n = rnd.randint(*cfg["sessions_per_day"])
    n = max(1, min(n, remaining, int((hi - lo) / gap) + 1))
    span = (hi - lo).total_seconds()
    times = []
    for _ in range(200):                      # random times, spaced at least `gap` apart
        times = sorted(lo + dt.timedelta(seconds=rnd.uniform(0, span)) for _ in range(n))
        if all(b - a >= gap for a, b in zip(times, times[1:])):
            break
    else:
        times = [lo + i * gap for i in range(n)]
    cuts = sorted(rnd.sample(range(1, remaining), n - 1)) if n > 1 else []
    quotas = [b - a for a, b in zip([0] + cuts, cuts + [remaining])]
    return list(zip(times, quotas))


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


def scrape_group(page, con, url: str, cfg: dict, quota: int) -> int:
    """Read up to `quota` NEW posts from one group (never more than today's limit)."""
    page.goto(feed_url(url, cfg["chronological_feed"]), wait_until="domcontentloaded")
    pause(5, 12)
    if "login" in page.url or "checkpoint" in page.url:
        raise SystemExit("Facebook asks for login/verification. Run again and log in by hand.")
    done: set[str] = set()
    new = known_streak = 0
    for _ in range(cfg["max_scrolls_per_session"]):
        for mark in page.evaluate(JS_MARK_POSTS):
            if mark in done:
                continue
            done.add(mark)
            if new >= quota or quota_left(con, cfg) <= 0:
                return new
            art = page.query_selector(f'div[data-fbqa-p="{mark}"]')
            if not art:
                continue
            try:
                art.scroll_into_view_if_needed(timeout=5000)
                pause(1.5, 4)
                first = page.evaluate(JS_EXTRACT, art)          # look only, no clicks yet
                if is_known(con, url, first):
                    known_streak += 1
                    if known_streak >= cfg["stop_after_known_posts"]:
                        return new                              # reached what we read before
                    continue
                if page.evaluate(JS_CLICK, [art, SEE_MORE, []]):
                    pause(1.5, 3)
                for _ in range(MAX_COMMENT_EXPANDS):
                    if not page.evaluate(JS_CLICK, [art, [], MORE_COMMENTS]):
                        break
                    pause(2, 4)
                    close_dialogs(page)
                data = page.evaluate(JS_EXTRACT, art)
            except Exception as e:                      # element vanished / FB re-rendered
                print(f"  skip post ({type(e).__name__})")
                continue
            if save_post(con, page, url, art, data):
                new += 1
                known_streak = 0
                print(f"  +1 post ({posts_today(con)}/{cfg['max_posts_per_day']} today)")
                pause_cfg(cfg["post_pause_seconds"])            # "reading time"
                if random.random() < 0.15:
                    pause(120, 300)                             # occasional longer break
        page.mouse.wheel(0, random.randint(900, 1800))
        pause(4, 9)
    return new


def is_known(con, group_url: str, data: dict) -> bool:
    body = (data.get("body") or "").strip()
    link = data.get("link") or ""
    if not link and len(body) < MIN_POST_CHARS:
        return False
    if link:
        return con.execute("SELECT 1 FROM posts WHERE id=?", (sha(link),)).fetchone() is not None
    # no permalink: compare the start of the text (before "See more" cut it off)
    head = body[:80].replace("%", "").replace("_", "")
    return con.execute("SELECT 1 FROM posts WHERE group_url=? AND text LIKE ?",
                       (group_url, head + "%")).fetchone() is not None


def run_session(con, cfg: dict, quota: int) -> int:
    """One short browsing session: 1-2 random groups, at most `quota` new posts."""
    quota = min(quota, quota_left(con, cfg))
    if quota <= 0:
        print("Daily limit reached.")
        return 0
    from playwright.sync_api import sync_playwright
    groups = random.sample(cfg["groups"], k=min(len(cfg["groups"]), random.choice([1, 1, 2])))
    con.execute("INSERT INTO runs(day, started_at, kind, note) VALUES(?,?, 'scrape', ?)",
                (today(), now(), f"quota {quota}"))
    con.commit()
    total = 0
    with sync_playwright() as p:
        ctx = open_browser(p)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            if not logged_in(ctx):
                sys.exit("Not logged in to Facebook. Run login.bat (python scraper.py --login) first.")
            for i, g in enumerate(groups):
                if total >= quota:
                    break
                if i:
                    pause_cfg(cfg["group_pause_seconds"])
                try:
                    n = scrape_group(page, con, g, cfg, quota - total)
                except SystemExit:
                    raise
                except Exception as e:
                    print(f"{g}: error {type(e).__name__}: {e}")
                    n = 0
                total += n
                print(f"{g}: {n} new posts")
        finally:
            ctx.close()
    return total


def find_chrome() -> str | None:
    """Path of the normal Google Chrome installed on this computer (Windows/macOS/Linux)."""
    cands = []
    for env in ("PROGRAMFILES", "PROGRAMFILES(X86)", "LOCALAPPDATA"):
        base = os.environ.get(env)
        if base:
            cands.append(Path(base) / "Google" / "Chrome" / "Application" / "chrome.exe")
    cands += [Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
              Path("/usr/bin/google-chrome"), Path("/usr/bin/google-chrome-stable")]
    for c in cands:
        if c.exists():
            return str(c)
    return None


def open_browser(p):
    """Your installed Google Chrome (own profile for this tool); bundled Chromium only as fallback."""
    if find_chrome():
        return p.chromium.launch_persistent_context(str(CHROME_PROFILE), channel="chrome", headless=False,
                                                    viewport={"width": 1280, "height": 900})
    print("Google Chrome not found - using Playwright's Chromium (Google sign-in may be refused there).")
    return p.chromium.launch_persistent_context(str(PROFILE), headless=False,
                                                viewport={"width": 1280, "height": 900})


def login_only():
    """Open the normal Google Chrome - NOT controlled by this tool - so you can log in to
    Facebook and pass "verify with Google" exactly as in everyday browsing. The login is
    saved in chrome_profile/ and used by the reading sessions afterwards."""
    chrome = find_chrome()
    if not chrome:
        print("Google Chrome is not installed: install it from https://www.google.com/chrome/ and run this again.")
        print("Trying with Playwright's Chromium instead...")
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            ctx = open_browser(p)
            page = ctx.pages[0] if ctx.pages else ctx.new_page()
            page.goto("https://www.facebook.com")
            if not logged_in(ctx):
                input("Log in to Facebook in the opened window, then press Enter here... ")
            print("Logged in." if logged_in(ctx) else "Not logged in.")
            ctx.close()
        return
    CHROME_PROFILE.mkdir(parents=True, exist_ok=True)
    print("A normal Chrome window opens (separate profile for this tool).")
    print("1. Log in to Facebook there. If Facebook asks, click 'Verify with Google' and sign in.")
    print("2. When you see your Facebook home page, CLOSE that Chrome window.")
    proc = subprocess.Popen([chrome, f"--user-data-dir={CHROME_PROFILE}", "--no-first-run",
                             "--no-default-browser-check", "--new-window", "https://www.facebook.com/"])
    proc.wait()
    time.sleep(2)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        ctx = open_browser(p)
        ok = logged_in(ctx)
        ctx.close()
    print("Logged in - the tool is ready." if ok else
          "Not logged in yet. Run login.bat again and finish the login before closing Chrome.")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--now", action="store_true", help="one session right now (inside the daily limit)")
    ap.add_argument("--plan-only", action="store_true", help="print today's random plan and exit")
    ap.add_argument("--login", action="store_true", help="only open the browser to log in to Facebook")
    args = ap.parse_args(argv)
    if args.login:
        login_only()
        return

    cfg = load_config()
    if not cfg["groups"]:
        sys.exit("No groups configured. Copy config.example.json to config.json and fill in \"groups\".")
    con = db()
    left = quota_left(con, cfg)
    print(f"{posts_today(con)}/{cfg['max_posts_per_day']} new posts read today, {left} left.")
    if left <= 0:
        return

    if args.now:
        n = run_session(con, cfg, random.randint(max(1, left // 3), left))
        print(f"Session done: {n} new posts.")
        return

    plan = plan_day(cfg, dt.datetime.now(), left)
    if not plan:
        print(f"Outside active hours {cfg['active_hours']}; nothing planned for today.")
        return
    print("Today's plan: " + ", ".join(f"{t:%H:%M} ({q})" for t, q in plan))
    if args.plan_only:
        return
    for t, q in plan:
        wait = (t - dt.datetime.now()).total_seconds()
        if wait > 0:
            print(f"Next session at {t:%H:%M}, sleeping {wait / 60:.0f} min...")
            time.sleep(wait)
        n = run_session(con, cfg, q)
        print(f"Session {t:%H:%M} done: {n} new posts ({posts_today(con)}/{cfg['max_posts_per_day']} today).")
        if quota_left(con, cfg) <= 0:
            break
    print("Done for today.")


if __name__ == "__main__":
    main()
