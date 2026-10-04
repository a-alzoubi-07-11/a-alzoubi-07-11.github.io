#!/usr/bin/env python3
"""Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) which pages changed.

Google does not use IndexNow; for Google the sitemap + Search Console remain the route.
Usage: python indexnow_submit.py [--all] [changed files...]
"""
import json, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOST = "gidsnederland.nl"
KEY = next(p.stem for p in ROOT.glob("*.txt") if len(p.stem) == 32 and p.read_text().strip() == p.stem)


def to_url(path: str) -> str | None:
    if not path.endswith(".html") or path.startswith(("docs/", "reports/", ".github/")) or path in ("404.html", "refresh.html"):
        return None
    if not (ROOT / path).exists():
        return None
    public_path = path[:-len("index.html")] if path.endswith("index.html") else path
    return f"https://{HOST}/" + public_path


def main() -> int:
    args = sys.argv[1:]
    if "--all" in args:
        files = [p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*.html")]
    else:
        files = args
    urls = sorted({u for f in files if (u := to_url(f))})
    if not urls:
        print("No public pages changed; nothing to submit.")
        return 0
    body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls[:10000]}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, method="POST",
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow: HTTP {r.status} for {len(urls)} URL(s)")
    except urllib.error.HTTPError as e:
        print(f"IndexNow: HTTP {e.code} {e.read()[:200]!r}")
        return 0 if e.code in (200, 202) else 1
    for u in urls:
        print("  ", u)
    return 0


if __name__ == "__main__":
    sys.exit(main())
