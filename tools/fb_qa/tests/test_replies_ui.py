"""Replies page: renders drafts, refuses requests without the secret, marks posts."""
from __future__ import annotations

import json
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import common  # noqa: E402
import replies_ui  # noqa: E402


class RepliesUiTest(unittest.TestCase):
    def setUp(self):
        self.dbp = Path(tempfile.mkdtemp()) / "t.db"
        con = common.db(self.dbp)
        for pid in ("p1", "p2"):
            con.execute("""INSERT INTO posts(id, group_url, post_url, text, scraped_at, is_question,
                           reply_status, reply_text) VALUES(?,?,?,?,?,1,'drafted',?)""",
                        (pid, "https://www.facebook.com/groups/syriansNL", f"https://www.facebook.com/groups/syriansNL/posts/{pid}",
                         "x", common.now(), f"أهلاً <b>{pid}</b>\nhttps://gidsnederland.nl/a"))
            con.execute("INSERT INTO questions(post_id, question) VALUES(?, 'كيف أطلب بدل الإيجار؟')", (pid,))
        con.commit()
        con.close()
        self.srv, self.url = replies_ui.serve(self.dbp, port=replies_ui.free_port(18765), open_browser=False)
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()

    def tearDown(self):
        self.srv.shutdown()

    def post(self, body, token):
        req = urllib.request.Request(self.url + "api/status", data=json.dumps(body).encode(), method="POST",
                                     headers={"Content-Type": "application/json", "X-Token": token})
        return urllib.request.urlopen(req)

    def test_page_and_api(self):
        page = urllib.request.urlopen(self.url).read().decode()
        self.assertIn("كيف أطلب بدل الإيجار؟", page)
        self.assertIn("&lt;b&gt;p1&lt;/b&gt;", page)            # reply text is escaped
        self.assertIn("syriansNL", page)
        with self.assertRaises(urllib.error.HTTPError) as e:
            self.post({"id": "p1", "status": "posted"}, "wrong")
        self.assertEqual(e.exception.code, 403)
        self.assertEqual(self.post({"id": "p1", "status": "posted", "text": "edited"}, replies_ui.TOKEN).status, 200)
        con = common.db(self.dbp)
        r = con.execute("SELECT reply_status, reply_text, replied_at FROM posts WHERE id='p1'").fetchone()
        self.assertEqual((r[0], r[1]), ("posted", "edited"))
        self.assertTrue(r[2])
        page = urllib.request.urlopen(self.url).read().decode()
        self.assertNotIn('id="c-p1"', page)                     # posted ones disappear
        self.assertIn("<bdi>syriansNL</bdi>: 1 اليوم", page)

    def test_buttons_in_browser(self):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            self.skipTest("playwright not installed")
        with sync_playwright() as p:
            try:
                b = p.chromium.launch()
            except Exception:
                b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
            ctx = b.new_context()
            ctx.grant_permissions(["clipboard-read", "clipboard-write"])
            page = ctx.new_page()
            page.goto(self.url)
            page.click("#c-p2 button.primary")
            self.assertIn("p2", page.evaluate("navigator.clipboard.readText()"))
            page.click("#c-p2 button.ok")
            page.wait_for_selector("#c-p2.done")
            b.close()
        con = common.db(self.dbp)
        self.assertEqual(con.execute("SELECT reply_status FROM posts WHERE id='p2'").fetchone()[0], "posted")


if __name__ == "__main__":
    unittest.main()
