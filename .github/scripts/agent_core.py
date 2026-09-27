"""Shared discovery and HTML parsing for the site audit agents."""
from __future__ import annotations

import os
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from xml.etree import ElementTree

OWNER = os.getenv("SITE_OWNER", "a-alzoubi-07-11")
HOST = f"https://{OWNER}.github.io/"
TIMEOUT = 12
MAX_SITES = 20
MAX_PAGES_PER_SITE = 60

def get(url):
    with urlopen(Request(url, headers={"User-Agent": "AhmadSiteAudit/1.0"}), timeout=TIMEOUT) as response:
        body = response.read(2_000_001)
        charset = response.headers.get_content_charset() or "utf-8"
        return body, response.headers.get("Content-Type", ""), charset


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.title = ""
        self.description = ""
        self.h1 = 0
        self.lang = ""
        self.canonical = ""
        self.og = set()
        self.images_without_alt = 0
        self.text = []
        self._in_title = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("script", "style"):
            self._skip += 1
        if tag == "title":
            self._in_title = True
        if tag == "html":
            self.lang = attrs.get("lang", "")
        if tag == "h1":
            self.h1 += 1
        if tag == "img" and not attrs.get("alt"):
            self.images_without_alt += 1
        if tag == "meta":
            if attrs.get("name", "").lower() == "description":
                self.description = attrs.get("content", "")
            if attrs.get("property", "").startswith("og:"):
                self.og.add(attrs["property"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag in ("a", "link", "script", "img"):
            link = attrs.get("href") or attrs.get("src")
            if link:
                self.links.append(link)

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = max(0, self._skip - 1)
        if tag == "title":
            self._in_title = False

    def handle_data(self, value):
        if self._in_title:
            self.title += value
        if not self._skip and not self._in_title:
            self.text.append(value)


def parse(html):
    page = PageParser()
    page.feed(html)
    return page


def local_pages(site_dir):
    root = Path(site_dir).resolve()
    for path in sorted(root.rglob("*.html")):
        if not set(path.relative_to(root).parts) & {".git", ".github", "reports", "node_modules"}:
            yield path.relative_to(root).as_posix(), path.read_text(encoding="utf-8", errors="replace")


def local_broken_links(site_dir, page_path, links):
    root = Path(site_dir).resolve()
    misses = []
    for link in links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc or link.startswith(("//", "#", "mailto:", "tel:", "data:")):
            continue
        path = unquote(parts.path)
        if not path:
            continue
        candidate = root / path.lstrip("/") if path.startswith("/") else root / page_path.parent / path
        candidate = candidate.resolve()
        if not candidate.is_relative_to(root):
            misses.append(link)
        elif not (candidate.is_file() or (candidate.is_dir() and (candidate / "index.html").is_file())):
            misses.append(link)
    return misses


def site_roots():
    """Discover public GitHub Pages repos; keep known sites if API is unavailable."""
    roots = [HOST, urljoin(HOST, "mbo_netherlands_branches_overview/")]
    try:
        for page in range(1, 4):
            body, _, _ = get(f"https://api.github.com/users/{OWNER}/repos?per_page=100&page={page}&type=owner")
            repos = json.loads(body)
            for repo in repos:
                if repo.get("has_pages") and not repo.get("private"):
                    name = repo["name"]
                    roots.append(HOST if name.lower() == f"{OWNER}.github.io".lower()
                                 else urljoin(HOST, name + "/"))
            if len(repos) < 100:
                break
    except (URLError, ValueError, KeyError) as exc:
        print(f"Pages discovery unavailable: {type(exc).__name__}; auditing known sites")
    return list(dict.fromkeys(roots))[:MAX_SITES]


def live_pages():
    """Yield published HTML from each site's home, sitemap and home links."""
    seen = set()
    for root in site_roots():
        split_root = urlsplit(root)
        urls = [root]
        try:
            body, _, _ = get(urljoin(root, "sitemap.xml"))
            xml = ElementTree.fromstring(body)
            urls += [entry.text for entry in xml.iter() if entry.tag.endswith("loc") and entry.text]
        except (URLError, ElementTree.ParseError):
            pass
        count = 0
        while urls and count < MAX_PAGES_PER_SITE:
            url = urls.pop(0)
            if url in seen:
                continue
            split = urlsplit(url)
            if split.scheme != "https" or split.netloc != split_root.netloc or not split.path.startswith(split_root.path):
                continue
            seen.add(url)
            try:
                body, mime, charset = get(url)
                if "html" not in mime.lower():
                    continue
                if len(body) > 2_000_000:
                    continue
                html = body.decode(charset, errors="replace")
                page = parse(html)
                if url == root:
                    urls += [urljoin(url, link) for link in page.links
                             if link.startswith(("./", "/")) and (".html" in link or link.endswith("/"))]
                yield url, html
                count += 1
            except (URLError, UnicodeError) as exc:
                yield url, f"<!-- fetch error: {type(exc).__name__} -->"
                count += 1
