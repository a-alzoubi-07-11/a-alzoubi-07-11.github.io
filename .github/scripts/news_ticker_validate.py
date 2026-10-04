#!/usr/bin/env python3
"""Validate, clean and stamp assets/news-ticker.json.

Guardrail for the daily news agents (see docs/news-agents/PLAYBOOK.md).
It never invents content: it only removes items that break the rules,
deduplicates, sorts, caps the list and refreshes the timestamps.

Usage:
  python .github/scripts/news_ticker_validate.py            # check only
  python .github/scripts/news_ticker_validate.py --write    # clean + stamp + save
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
FILE = ROOT / "assets" / "news-ticker.json"
TZ = ZoneInfo("Europe/Amsterdam")

SOURCES = {
    "BZK": {"ar": "وزارة الداخلية (BZK)", "nl": "Ministerie van BZK"},
    "IND": {"ar": "دائرة الهجرة IND", "nl": "IND"},
    "DUO": {"ar": "DUO", "nl": "DUO"},
    "SZW": {"ar": "وزارة الشؤون الاجتماعية (SZW)", "nl": "Ministerie van SZW"},
    "UWV": {"ar": "UWV", "nl": "UWV"},
}
ALLOWED_HOSTS = {
    "rijksoverheid.nl", "www.rijksoverheid.nl", "government.nl", "www.government.nl",
    "ind.nl", "www.ind.nl", "duo.nl", "www.duo.nl", "uwv.nl", "www.uwv.nl",
}
STATUSES = {"confirmed", "announced", "proposed"}
MAX_AGE_DAYS = 60
MAX_ITEMS = 8
MAX_PER_SOURCE = 2
VALID_HOURS = 48


def bilingual(value, limit):
    return (isinstance(value, dict)
            and all(isinstance(value.get(k), str) and 0 < len(value[k].strip()) <= limit for k in ("ar", "nl")))


def check_item(item, now):
    problems = []
    if item.get("source") not in SOURCES:
        problems.append(f"unknown source {item.get('source')!r}")
    url = item.get("url", "")
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.hostname not in ALLOWED_HOSTS:
        problems.append(f"url not on an official allowlisted host: {url}")
    try:
        published = datetime.strptime(item.get("publishedAt", ""), "%Y-%m-%d").date()
        age = (now.date() - published).days
        if age < -1:
            problems.append(f"publishedAt in the future: {published}")
        if age > MAX_AGE_DAYS:
            problems.append(f"older than {MAX_AGE_DAYS} days ({published})")
    except ValueError:
        problems.append("publishedAt must be YYYY-MM-DD")
    if item.get("status") not in STATUSES:
        problems.append(f"status must be one of {sorted(STATUSES)}")
    if not bilingual(item.get("title"), 140):
        problems.append("title needs ar+nl, max 140 chars")
    if not bilingual(item.get("summary"), 220):
        problems.append("summary needs ar+nl, max 220 chars")
    if not bilingual(item.get("category"), 30):
        problems.append("category needs ar+nl, max 30 chars")
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()
    now = datetime.now(TZ)
    data = json.loads(FILE.read_text(encoding="utf-8"))
    items = data.get("items") if isinstance(data.get("items"), list) else []

    kept, dropped, seen = [], [], set()
    for item in items:
        problems = check_item(item, now)
        if not problems and item["url"] in seen:
            problems = ["duplicate url"]
        if problems:
            dropped.append((item.get("url", "?"), problems))
            continue
        seen.add(item["url"])
        item["sourceName"] = SOURCES[item["source"]]
        item.setdefault("id", f"{item['source'].lower()}-{item['publishedAt']}-{hashlib.sha1(item['url'].encode()).hexdigest()[:8]}")
        kept.append(item)

    kept.sort(key=lambda i: (i["publishedAt"], i.get("firstSeen", "")), reverse=True)
    per_source, capped = {}, []
    for item in kept:
        n = per_source.get(item["source"], 0)
        if n >= MAX_PER_SOURCE or len(capped) >= MAX_ITEMS:
            dropped.append((item["url"], ["over the per-source or total cap"]))
            continue
        per_source[item["source"]] = n + 1
        capped.append(item)

    for url, problems in dropped:
        print(f"DROP {url}: {'; '.join(problems)}")
    print(f"OK {len(capped)} item(s) kept: " + ", ".join(f"{k}={v}" for k, v in sorted(per_source.items())))

    if args.write:
        data["schemaVersion"] = 2
        data["items"] = capped
        data["updatedAt"] = now.isoformat(timespec="seconds")
        data["validUntil"] = (now + timedelta(hours=VALID_HOURS)).isoformat(timespec="seconds")
        FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"WROTE {FILE.relative_to(ROOT)}")
    elif dropped:
        sys.exit(1)


if __name__ == "__main__":
    main()
