"""Runs the scraper's in-page JavaScript against a small mock of Facebook's group-feed markup.

Skipped when Playwright/Chromium is not installed. Facebook changes its HTML often;
when real scraping breaks, save a real post's outerHTML into a fixture and adapt.
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import common  # noqa: E402
import scraper  # noqa: E402

FEED = """<!doctype html><html><body><div role="feed">
 <div><div role="article" aria-labelledby="x">
   <h3><a role="link" href="#">Some Person</a></h3>
   <a href="https://www.facebook.com/groups/123/posts/456789/?__cft__=abc&__tn__=R">2h</a>
   <div data-ad-comet-preview="message"><div dir="auto">شباب كيف بقدر اطلب huurtoeslag وانا ساكن جديد في اوتريخت؟</div></div>
   <div role="button">See more</div>
   <ul>
    <li><div role="article" aria-label="Comment by A">
       <a role="link" href="#"><span>Commenter One</span></a>
       <div dir="auto">قدمت عن طريق موقع Mijn toeslagen واجاني الرد بعد شهر تقريباً والحمد لله</div>
       <div role="button">Reply</div>
       <div role="article" aria-label="Reply by B"><div dir="auto">نفس الشي معي</div></div>
    </div></li>
    <li><div role="article" aria-label="Comment by C"><div dir="auto">متابعة</div></div></li>
   </ul>
   <div role="button" id="more">View 3 more comments</div>
 </div></div>
 <div><div role="article"><a href="https://www.facebook.com/groups/123/permalink/999/">1d</a>
   <div dir="auto">غسالة للبيع بحالة ممتازة، السعر 100 يورو</div></div></div>
</div>
<script>
document.querySelector('#more').addEventListener('click', () => {
  const li = document.createElement('li');
  li.innerHTML = '<div role="article"><div dir="auto">الطلب لازم يكون خلال السنة نفسها حسب Belastingdienst</div></div>';
  document.querySelector('ul').appendChild(li);
  document.querySelector('#more').remove();
});
</script></body></html>"""


def _browser(p):
    try:
        return p.chromium.launch()
    except Exception:
        # CI/sandbox with a preinstalled Chromium of another Playwright version
        exe = "/opt/pw-browsers/chromium"
        if os.path.exists(exe) and os.path.isfile(exe):
            return p.chromium.launch(executable_path=exe)
        raise


class ScraperDomTest(unittest.TestCase):
    def test_extract_and_save(self):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            self.skipTest("playwright not installed")
        tmp = Path(tempfile.mkdtemp())
        scraper.SHOTS = tmp / "screenshots"
        con = common.db(tmp / "t.db")
        try:
            with sync_playwright() as p:
                b = _browser(p)
                page = b.new_page()
                page.set_content(FEED)
                marks = page.evaluate(scraper.JS_MARK_POSTS)
                self.assertEqual(len(marks), 2, "comments must not be counted as posts")
                art = page.query_selector(f'div[data-fbqa-p="{marks[0]}"]')
                self.assertEqual(page.evaluate(scraper.JS_CLICK, [art, [], scraper.MORE_COMMENTS]), 1)
                data = page.evaluate(scraper.JS_EXTRACT, art)
                self.assertEqual(data["link"], "https://www.facebook.com/groups/123/posts/456789/")
                self.assertIn("huurtoeslag", data["body"])
                self.assertNotIn("قدمت", data["body"], "comments must be separated from the post")
                texts = [c["text"] for c in data["comments"]]
                self.assertEqual(len(texts), 4)               # 2 comments + 1 reply + 1 loaded
                self.assertTrue(any("Mijn toeslagen" in t for t in texts))
                self.assertFalse(any("Commenter One" in t for t in texts), "names must not be stored")
                self.assertFalse(any("نفس الشي" in t and "قدمت" in t for t in texts), "reply kept separate")
                self.assertTrue(scraper.save_post(con, page, "g", art, data))
                self.assertFalse(scraper.save_post(con, page, "g", art, data))   # dedupe
                art2 = page.query_selector(f'div[data-fbqa-p="{marks[1]}"]')
                d2 = page.evaluate(scraper.JS_EXTRACT, art2)
                self.assertEqual(d2["link"], "https://www.facebook.com/groups/123/permalink/999/")
                self.assertTrue(scraper.is_known(con, "g", data))
                self.assertFalse(scraper.is_known(con, "g", d2))

                # scrape_group: stops at the quota and never clicks known posts
                cfg = dict(common.DEFAULTS, post_pause_seconds=[0, 0], max_scrolls_per_session=1,
                           chronological_feed=False)
                scraper.pause = lambda a=0, b=0: None
                page.goto = lambda *a, **k: page.set_content(FEED)
                orig_random = scraper.random.random
                scraper.random.random = lambda: 1.0                    # no long breaks in tests
                try:
                    con2 = common.db(tmp / "t2.db")
                    self.assertEqual(scraper.scrape_group(page, con2, "g", cfg, quota=1), 1)
                    self.assertEqual(scraper.posts_today(con2), 1)
                    self.assertEqual(scraper.scrape_group(page, con2, "g", cfg, quota=5), 1)  # the other one
                    self.assertEqual(scraper.scrape_group(page, con2, "g", cfg, quota=5), 0)  # all known
                    con2.close()
                finally:
                    scraper.random.random = orig_random
                b.close()
        except Exception as e:
            if "Executable doesn't exist" in str(e):
                self.skipTest("chromium not installed")
            raise
        self.assertEqual(con.execute("SELECT COUNT(*) FROM comments").fetchone()[0], 4)
        shots = con.execute("SELECT COUNT(*) FROM comments WHERE screenshot IS NOT NULL").fetchone()[0]
        self.assertEqual(shots, 2)                            # only the long comments
        self.assertEqual(len(list(scraper.SHOTS.glob("*.png"))), 2)


if __name__ == "__main__":
    unittest.main()
