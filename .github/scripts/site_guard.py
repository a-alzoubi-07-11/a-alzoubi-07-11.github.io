#!/usr/bin/env python3
"""Site guard: refuses anything that would break what we have built.

Runs on every push and pull request (and daily). It checks the whole site,
offline and fast, and exits 1 when a rule is broken, so the commit shows a red
cross and the guard workflow opens an alert issue.

Rules
  1. Every HTML page: has <title>, lang/dir, the calm design (apple.css) and the
     site chrome (site-chrome.js); every JSON-LD block parses.
  2. Every internal link, script, stylesheet and image points to a file that exists.
  3. Every article exists in both languages (AR <-> NL pairs).
  4. sitemap.xml is valid XML and every <loc> exists in the repo.
  5. assets/search-index.json is valid and every entry points to an existing page,
     and it has not shrunk dramatically (protects the search engine).
  6. assets/news-ticker.json passes the news validator (protects the ticker).
  7. ads.txt still carries the AdSense publisher line; robots.txt still allows the site.
  8. No credentials committed (API keys, private keys, tokens).
  9. Core files the site cannot live without are present.

Usage: python .github/scripts/site_guard.py [--json report.json]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[2]
SITE = "https://gidsnederland.nl"
PUB_LINE = "google.com, pub-9944637611029429, DIRECT, f08c47fec0942fa0"

CORE_FILES = [
    "CNAME", "index.html", "nl/index.html", "404.html", "sitemap.xml", "robots.txt", "ads.txt", "sw.js",
    "manifest.webmanifest", "privacy.html", "editorial-policy.html", "about.html", "contact.html",
    "assets/apple.css", "assets/site-chrome.js", "assets/site-search.js", "assets/search-index.json",
    "assets/news-ticker.js", "assets/news-ticker.json", "assets/home.css", "assets/home.js",
    ".github/scripts/build_search_index.py", ".github/scripts/news_ticker_validate.py",
    "docs/news-agents/PLAYBOOK.md",
]
# Pages that are not part of the public site design (verification stubs, templates, reports).
SKIP_DESIGN = re.compile(r"^(docs/|reports/|cloudflare/|google[0-9a-f]+\.html$|refresh\.html$)")
SECRET_PATTERNS = [
    (re.compile(r"sk-ant-[A-Za-z0-9_\-]{20,}"), "Anthropic API key"),
    (re.compile(r"sk-[A-Za-z0-9]{32,}"), "API secret key"),
    (re.compile(r"gh[pousr]_[A-Za-z0-9]{30,}"), "GitHub token"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key"),
    (re.compile(r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"), "private key"),
    (re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"), "Slack token"),
]
TEXT_EXT = {".html", ".js", ".css", ".json", ".md", ".py", ".yml", ".yaml", ".txt", ".xml", ".webmanifest"}

problems: list[tuple[str, str, str]] = []  # (rule, file, detail)


def bad(rule: str, file: str, detail: str) -> None:
    problems.append((rule, file, detail))


def tracked_files() -> list[str]:
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return [l for l in out.splitlines() if l]


def exists(url_path: str) -> bool:
    p = unquote(url_path.split("#")[0].split("?")[0])
    if not p or p == "/":
        return (ROOT / "index.html").exists()
    target = ROOT / p.lstrip("/")
    if p.endswith("/"):
        return (target / "index.html").exists()
    return target.exists() or (target.with_suffix(".html")).exists()


def check_html(rel: str) -> None:
    text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
    design_page = not SKIP_DESIGN.match(rel)
    if design_page:
        if not re.search(r"<title>[^<]{3,}</title>", text):
            bad("html", rel, "missing or empty <title>")
        if not re.search(r"<html[^>]*\blang=", text):
            bad("html", rel, "missing lang attribute on <html>")
        if "apple.css" not in text:
            bad("design", rel, "calm design stylesheet apple.css is not loaded")
        if rel.startswith(("articles/", "nl/articles/")) and re.search(r'<meta name="robots" content="[^"]*noindex', text):
            bad("seo", rel, "article is set to noindex (Google will not show it)")
        if "site-chrome.js" not in text:
            bad("design", rel, "site-chrome.js (sticky header, search, back-to-top) is not loaded")
    for i, block in enumerate(re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', text, re.S)):
        try:
            json.loads(block)
        except Exception as e:  # noqa: BLE001
            bad("json-ld", rel, f"JSON-LD block {i + 1} does not parse: {e}")
    base = "/" + rel
    for attr, url in re.findall(r'\b(href|src)="([^"]+)"', text):
        if url.startswith(("http://", "https://")):
            if url.startswith(SITE):
                url = url[len(SITE):] or "/"
            else:
                continue
        if url.startswith(("mailto:", "tel:", "javascript:", "data:", "#", "{", "$")) or "${" in url:
            continue
        if not url.startswith("/"):
            # relative link: resolve against the page folder
            folder = base.rsplit("/", 1)[0]
            parts = []
            for seg in (folder + "/" + url).split("/"):
                if seg == "..":
                    parts and parts.pop()
                elif seg not in ("", "."):
                    parts.append(seg)
            url = "/" + "/".join(parts)
        if not exists(url):
            bad("links", rel, f"{attr} points to missing file: {url}")


AR_ONLY_BASELINE: set[str] = set()  # every article now has its Dutch twin


def check_pairs(files: list[str]) -> None:
    ar = {f.split("/", 1)[1] for f in files if f.startswith("articles/") and f.endswith(".html")}
    nl = {f.split("/", 2)[2] for f in files if f.startswith("nl/articles/") and f.endswith(".html")}
    for f in sorted(ar - nl - AR_ONLY_BASELINE):
        bad("pairs", "articles/" + f, "Arabic article has no Dutch twin in nl/articles/")
    for f in sorted(nl - ar):
        bad("pairs", "nl/articles/" + f, "Dutch article has no Arabic twin in articles/")


def check_sitemap() -> None:
    try:
        tree = ET.parse(ROOT / "sitemap.xml")
    except ET.ParseError as e:
        bad("sitemap", "sitemap.xml", f"not valid XML: {e}")
        return
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [l.text.strip() for l in tree.getroot().findall(".//s:loc", ns) if l.text]
    if len(locs) < 20:
        bad("sitemap", "sitemap.xml", f"only {len(locs)} URLs left (expected the full site)")
    for loc in locs:
        path = urlsplit(loc).path
        if not exists(path):
            bad("sitemap", "sitemap.xml", f"lists a page that does not exist: {path}")


def check_search_index() -> None:
    f = ROOT / "assets/search-index.json"
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        bad("search", "assets/search-index.json", f"not valid JSON: {e}")
        return
    entries = data.get("items") or data.get("entries") or (data if isinstance(data, list) else [])
    if len(entries) < 40:
        bad("search", "assets/search-index.json", f"only {len(entries)} entries (search would be broken)")
    for e in entries:
        url = e.get("url") or e.get("u") or ""
        if url and not exists(urlsplit(url).path):
            bad("search", "assets/search-index.json", f"entry points to missing page: {url}")


def check_ticker() -> None:
    r = subprocess.run([sys.executable, ".github/scripts/news_ticker_validate.py"], cwd=ROOT,
                       capture_output=True, text=True)
    if r.returncode != 0:
        bad("ticker", "assets/news-ticker.json", (r.stdout + r.stderr).strip()[-600:] or "validator failed")


def check_domain() -> None:
    cname = (ROOT / "CNAME").read_text(encoding="utf-8").strip() if (ROOT / "CNAME").exists() else ""
    if cname != "gidsnederland.nl":
        bad("domain", "CNAME", f"custom domain changed or missing (found {cname!r}); the site would fall back to github.io")


def check_ads_robots() -> None:
    ads = (ROOT / "ads.txt").read_text(encoding="utf-8", errors="replace") if (ROOT / "ads.txt").exists() else ""
    if PUB_LINE not in ads:
        bad("adsense", "ads.txt", "the AdSense publisher line is missing or changed")
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8", errors="replace") if (ROOT / "robots.txt").exists() else ""
    if re.search(r"(?im)^\s*Disallow:\s*/\s*$", robots):
        bad("seo", "robots.txt", "robots.txt blocks the whole site (Disallow: /)")
    if "sitemap" not in robots.lower():
        bad("seo", "robots.txt", "robots.txt no longer points to the sitemap")


def check_secrets(files: list[str]) -> None:
    for rel in files:
        if Path(rel).suffix.lower() not in TEXT_EXT or rel.endswith("site_guard.py"):
            continue
        try:
            text = (ROOT / rel).read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for pat, name in SECRET_PATTERNS:
            if pat.search(text):
                bad("secrets", rel, f"looks like a committed {name}; remove it and rotate the key")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", help="write the findings to this JSON file")
    args = ap.parse_args()
    files = tracked_files()
    for core in CORE_FILES:
        if core not in files:
            bad("core", core, "core file is missing")
    html = [f for f in files if f.endswith(".html")]
    for rel in html:
        check_html(rel)
    check_pairs(files)
    check_sitemap()
    check_search_index()
    check_ticker()
    check_ads_robots()
    check_domain()
    check_secrets(files)

    print(f"Site guard: {len(html)} pages checked, {len(problems)} problem(s).")
    for rule, f, d in problems:
        print(f"  [{rule}] {f}: {d}")
    if args.json:
        Path(args.json).write_text(json.dumps([{"rule": r, "file": f, "detail": d} for r, f, d in problems],
                                              ensure_ascii=False, indent=2), encoding="utf-8")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
