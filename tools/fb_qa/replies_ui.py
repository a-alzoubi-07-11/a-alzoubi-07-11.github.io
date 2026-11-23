"""Replies page: copy each drafted reply, open the post, mark it as posted - in seconds.

    python replies_ui.py          # or the desktop shortcut "fb_qa - replies"

Opens http://127.0.0.1:<port>/ in your browser. The page runs only on this computer
(bound to 127.0.0.1, every change needs a per-session secret), and stops when you close
the black window. Nothing is ever posted automatically: you paste each reply yourself.
"""
from __future__ import annotations

import html
import json
import secrets
import socket
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from common import db, load_config
import replies

TOKEN = secrets.token_urlsafe(24)
SOFT_LIMIT_PER_GROUP = 3      # replies with links per group per day before the page warns

PAGE = """<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ردود جاهزة</title>
<style>
:root { --bg:#f6f7f9; --card:#fff; --ink:#1d2433; --muted:#667085; --line:#e3e6eb;
        --blue:#1877f2; --green:#16a34a; --amber:#b45309; --amberbg:#fff7e6; }
@media (prefers-color-scheme: dark) {
  :root { --bg:#14171c; --card:#1d2128; --ink:#e7eaf0; --muted:#98a2b3; --line:#2c323c;
          --blue:#4c94ff; --green:#22c55e; --amber:#f5b452; --amberbg:#2a2214; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink);
       font: 16px/1.6 "Segoe UI", Tahoma, Arial, sans-serif; }
main { max-width: 760px; margin: 0 auto; padding: 20px 16px 60px; }
h1 { font-size: 22px; margin: 0 0 4px; }
.sub { color: var(--muted); margin: 0 0 16px; font-size: 14px; }
.groups { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
.chip { font-size:13px; padding:3px 10px; border-radius:99px; border:1px solid var(--line); background:var(--card); }
.chip.warn { border-color: var(--amber); color: var(--amber); background: var(--amberbg); }
.card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:14px; }
.card.done { opacity:.45; }
.q { font-weight:600; margin:0 0 4px; }
.meta { color:var(--muted); font-size:13px; margin-bottom:10px; word-break: break-all; }
.warnline { display:none; color:var(--amber); background:var(--amberbg); font-size:13px;
            border-radius:8px; padding:6px 10px; margin-bottom:8px; }
.card.overlimit .warnline { display:block; }
textarea { width:100%; min-height:175px; resize:vertical; border:1px solid var(--line); border-radius:8px;
           padding:10px; font:inherit; background:var(--bg); color:var(--ink); }
.row { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
button, a.btn { font:inherit; font-size:15px; border-radius:8px; padding:8px 14px; cursor:pointer;
       border:1px solid var(--line); background:var(--card); color:var(--ink); text-decoration:none; }
button.primary { background:var(--blue); border-color:var(--blue); color:#fff; }
button.ok { border-color:var(--green); color:var(--green); }
.empty { text-align:center; color:var(--muted); padding:40px 0; }
.toast { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--ink); color:var(--bg);
         padding:8px 16px; border-radius:8px; opacity:0; transition:opacity .2s; pointer-events:none; }
.toast.show { opacity:1; }
</style></head><body><main>
<h1>ردود جاهزة للنشر</h1>
<p class="sub">١) انسخ الرد  ٢) افتح المنشور والصقه كتعليق  ٣) اضغط «نشرته». يمكنك تعديل النص قبل النسخ.
لا يُنشر أي شيء تلقائياً.</p>
<div class="groups">__GROUPS__</div>
__CARDS__
</main><div class="toast" id="toast"></div>
<script>
const TOKEN = "__TOKEN__", LIMIT = __LIMIT__;
const counts = __COUNTS__;
function toast(t) { const el = document.getElementById('toast'); el.textContent = t;
  el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1600); }
function refreshLimits() {
  document.querySelectorAll('.card').forEach(c => {
    c.classList.toggle('overlimit', !c.classList.contains('done') && (counts[c.dataset.group] || 0) >= LIMIT);
  });
}
async function copyReply(id) {
  const ta = document.getElementById('t-' + id);
  try { await navigator.clipboard.writeText(ta.value); } catch (e) { ta.select(); document.execCommand('copy'); }
  toast('تم النسخ ✓');
}
async function mark(id, status) {
  const card = document.getElementById('c-' + id);
  const r = await fetch('/api/status', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Token': TOKEN },
    body: JSON.stringify({ id, status, text: document.getElementById('t-' + id).value }) });
  if (!r.ok) { toast('خطأ - هل أغلقت النافذة السوداء؟'); return; }
  card.classList.add('done');
  card.querySelectorAll('button').forEach(b => b.disabled = true);
  if (status === 'posted') { counts[card.dataset.group] = (counts[card.dataset.group] || 0) + 1; }
  refreshLimits();
  toast(status === 'posted' ? 'سُجّل كمنشور ✓' : 'تم التخطي');
}
refreshLimits();
</script></body></html>"""


def group_label(url: str) -> str:
    u = (url or "").rstrip("/")
    return u.split("/groups/")[-1].split("/")[0] if "/groups/" in u else u[-30:]


def render(con) -> str:
    rows = con.execute("""SELECT p.id, p.post_url, p.group_url, p.reply_text, q.question
                          FROM posts p LEFT JOIN questions q ON q.post_id = p.id
                          WHERE p.reply_status='drafted' AND COALESCE(p.reply_text,'') <> ''
                          ORDER BY p.scraped_at DESC""").fetchall()
    counts = {group_label(r["group_url"]): r["n"] for r in con.execute(
        """SELECT group_url, COUNT(*) AS n FROM posts WHERE reply_status='posted'
           AND substr(replied_at, 1, 10) = date('now','localtime') GROUP BY group_url""")}
    e = html.escape
    cards = []
    for r in rows:
        g = group_label(r["group_url"])
        link = r["post_url"] or r["group_url"]
        cards.append(f"""<div class="card" id="c-{e(r['id'])}" data-group="{e(g)}">
  <p class="q">{e(r['question'] or '')}</p>
  <div class="meta">مجموعة: <bdi>{e(g)}</bdi></div>
  <div class="warnline">نشرت اليوم {SOFT_LIMIT_PER_GROUP} ردود أو أكثر في هذه المجموعة - الأفضل تأجيله لغدٍ.</div>
  <textarea id="t-{e(r['id'])}">{e(r['reply_text'])}</textarea>
  <div class="row">
    <button class="primary" onclick="copyReply('{e(r['id'])}')">📋 انسخ الرد</button>
    <a class="btn" href="{e(link)}" target="_blank" rel="noopener">↗ افتح المنشور</a>
    <button class="ok" onclick="mark('{e(r['id'])}','posted')">✓ نشرته</button>
    <button onclick="mark('{e(r['id'])}','skipped')">تخطَّ</button>
  </div></div>""")
    groups = "".join(
        f'<span class="chip{" warn" if n >= SOFT_LIMIT_PER_GROUP else ""}"><bdi>{e(g)}</bdi>: {n} اليوم</span>'
        for g, n in counts.items())
    body = "\n".join(cards) or '<p class="empty">لا توجد ردود جديدة الآن. تظهر هنا بعد كل تشغيل يومي.</p>'
    return (PAGE.replace("__CARDS__", body).replace("__GROUPS__", groups)
            .replace("__TOKEN__", TOKEN).replace("__LIMIT__", str(SOFT_LIMIT_PER_GROUP))
            .replace("__COUNTS__", json.dumps(counts, ensure_ascii=False)))


def make_handler(db_path=None):
    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def _send(self, code, body, ctype="text/html; charset=utf-8"):
            data = body.encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.path not in ("/", "/index.html"):
                return self._send(404, "not found", "text/plain")
            con = db(db_path)
            try:
                self._send(200, render(con))
            finally:
                con.close()

        def do_POST(self):
            if self.path != "/api/status" or self.headers.get("X-Token") != TOKEN:
                return self._send(403, "forbidden", "text/plain")
            try:
                n = int(self.headers.get("Content-Length", "0"))
                data = json.loads(self.rfile.read(min(n, 20000)).decode("utf-8"))
                status = data["status"]
                assert status in ("posted", "skipped")
            except Exception:
                return self._send(400, "bad request", "text/plain")
            con = db(db_path)
            try:
                cur = con.execute("""UPDATE posts SET reply_status=?, reply_text=COALESCE(?, reply_text),
                                     replied_at=datetime('now','localtime') WHERE id=?""",
                                  (status, data.get("text"), str(data.get("id"))))
                con.commit()
            finally:
                con.close()
            self._send(200 if cur.rowcount else 404, json.dumps({"ok": bool(cur.rowcount)}), "application/json")
    return H


def free_port(start=8765) -> int:
    for port in range(start, start + 50):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise SystemExit("No free port found.")


def serve(db_path=None, port=None, open_browser=True):
    port = port or free_port()
    srv = ThreadingHTTPServer(("127.0.0.1", port), make_handler(db_path))
    url = f"http://127.0.0.1:{port}/"
    if open_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    return srv, url


def main():
    con = db()
    replies.run(con, load_config())          # draft replies for any new posts first (no LLM)
    con.close()
    srv, url = serve()
    print(f"Replies page: {url}")
    print("Keep this window open while you work. Close it when you are done.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
