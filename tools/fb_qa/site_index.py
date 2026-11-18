"""Knowledge about gidsnederland.nl itself: which articles exist, their videos and official sources.

Reads assets/search-index.json and the article HTML files straight from this repo,
so new guides are picked up automatically after the search index is rebuilt.
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlsplit

from common import SITE_ROOT, tokens

SITE = "https://gidsnederland.nl"
YT = re.compile(r"(?:youtube\.com/(?:watch\?v=|embed/)|youtu\.be/)([\w-]{11})")
HREF = re.compile(r'href="(https?://[^"]+)"')


@lru_cache(maxsize=1)
def items() -> list[dict]:
    p = SITE_ROOT / "assets" / "search-index.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    out = []
    for it in data["items"]:
        if it.get("l") != "ar" or it.get("y") not in ("guide", "topic", "tool"):
            continue
        it = dict(it)
        it["_tok"] = tokens(" ".join(it.get(k, "") for k in ("t", "d", "h", "k", "c")))
        it["_ttok"] = tokens(it.get("t", "") + " " + it.get("k", ""))
        out.append(it)
    return out


def candidates(text: str, n: int = 5) -> list[dict]:
    q = tokens(text)
    if not q:
        return []
    scored = []
    for it in items():
        hit = q & it["_tok"]
        if not hit:
            continue
        score = len(hit) + 0.5 * len(q & it["_ttok"])
        scored.append((score / (len(q) ** 0.5), it))
    scored.sort(key=lambda x: -x[0])
    return [dict(it, score=round(s, 2)) for s, it in scored[:n]]


def page_file(url_path: str) -> Path:
    return SITE_ROOT / url_path.lstrip("/")


@lru_cache(maxsize=256)
def page_html(url_path: str) -> str:
    f = page_file(url_path)
    return f.read_text(encoding="utf-8") if f.exists() else ""


def videos(url_path: str) -> list[str]:
    ids = list(dict.fromkeys(YT.findall(page_html(url_path))))
    return [f"https://www.youtube.com/watch?v={i}" for i in ids]


def official_links(url_path: str, allowed: list[str]) -> list[str]:
    out = []
    for u in HREF.findall(page_html(url_path)):
        if is_official(u, allowed) and u not in out:
            out.append(u)
    return out


def is_official(url: str, allowed: list[str]) -> bool:
    host = (urlsplit(url).hostname or "").lower()
    if not host:
        return False
    if any(host == d or host.endswith("." + d) for d in allowed):
        return True
    return "gemeente" in host and host.endswith(".nl")


def full_url(url_path: str) -> str:
    return url_path if url_path.startswith("http") else SITE + url_path
