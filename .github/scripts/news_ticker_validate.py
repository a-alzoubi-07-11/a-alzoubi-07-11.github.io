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

RIJK = {"rijksoverheid.nl", "www.rijksoverheid.nl", "government.nl", "www.government.nl"}
# tier "official": government bodies; tier "media": fast news outlets (status must be "reported").
SOURCES = {
    "BZK": ("official", {"ar": "وزارة الداخلية (BZK)", "nl": "Ministerie van BZK"}, RIJK),
    "SZW": ("official", {"ar": "وزارة الشؤون الاجتماعية (SZW)", "nl": "Ministerie van SZW"}, RIJK),
    "IND": ("official", {"ar": "دائرة الهجرة IND", "nl": "IND"}, {"ind.nl", "www.ind.nl"}),
    "DUO": ("official", {"ar": "DUO", "nl": "DUO"}, {"duo.nl", "www.duo.nl"}),
    "UWV": ("official", {"ar": "UWV", "nl": "UWV"}, {"uwv.nl", "www.uwv.nl"}),
    "SVB": ("official", {"ar": "بنك التأمينات الاجتماعية SVB", "nl": "SVB"}, {"svb.nl", "www.svb.nl"}),
    "TOESLAGEN": ("official", {"ar": "دائرة البدلات (Toeslagen)", "nl": "Dienst Toeslagen"},
                  {"belastingdienst.nl", "www.belastingdienst.nl", "toeslagen.nl", "www.toeslagen.nl"}),
    "TK": ("official", {"ar": "البرلمان (Tweede Kamer)", "nl": "Tweede Kamer"}, {"tweedekamer.nl", "www.tweedekamer.nl"}),
    "STAB": ("official", {"ar": "الجريدة الرسمية", "nl": "Officiële bekendmakingen"},
             {"officielebekendmakingen.nl", "zoek.officielebekendmakingen.nl", "wetten.overheid.nl"}),
    "NOS": ("media", {"ar": "NOS", "nl": "NOS"}, {"nos.nl", "www.nos.nl"}),
    "NU": ("media", {"ar": "NU.nl", "nl": "NU.nl"}, {"nu.nl", "www.nu.nl"}),
    "RTL": ("media", {"ar": "RTL Nieuws", "nl": "RTL Nieuws"}, {"rtl.nl", "www.rtl.nl", "rtlnieuws.nl", "www.rtlnieuws.nl"}),
}
OFFICIAL_STATUSES = {"confirmed", "announced", "proposed"}
MEDIA_STATUSES = {"reported"}
MAX_AGE_DAYS = 60
MAX_ITEMS = 10
MAX_MEDIA = 3
MAX_PER_SOURCE = 2
VALID_HOURS = 48


def bilingual(value, limit):
    return (isinstance(value, dict)
            and all(isinstance(value.get(k), str) and 0 < len(value[k].strip()) <= limit for k in ("ar", "nl")))


def check_item(item, now):
    problems = []
    src = SOURCES.get(item.get("source"))
    if not src:
        return [f"unknown source {item.get('source')!r}"]
    tier, _, hosts = src
    url = item.get("url", "")
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.hostname not in hosts:
        problems.append(f"url is not on a host of {item['source']}: {url}")
    try:
        published = datetime.strptime(item.get("publishedAt", ""), "%Y-%m-%d").date()
        age = (now.date() - published).days
        if age < -1:
            problems.append(f"publishedAt in the future: {published}")
        if age > MAX_AGE_DAYS:
            problems.append(f"older than {MAX_AGE_DAYS} days ({published})")
    except ValueError:
        problems.append("publishedAt must be YYYY-MM-DD")
    allowed = MEDIA_STATUSES if tier == "media" else OFFICIAL_STATUSES
    if item.get("status") not in allowed:
        problems.append(f"status for {tier} source must be one of {sorted(allowed)}")
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
        item["sourceName"] = SOURCES[item["source"]][1]
        item["tier"] = SOURCES[item["source"]][0]
        item.setdefault("id", f"{item['source'].lower()}-{item['publishedAt']}-{hashlib.sha1(item['url'].encode()).hexdigest()[:8]}")
        kept.append(item)

    kept.sort(key=lambda i: (i["publishedAt"], i.get("firstSeen", "")), reverse=True)
    per_source, capped, media = {}, [], 0
    for item in kept:
        n = per_source.get(item["source"], 0)
        if n >= MAX_PER_SOURCE or len(capped) >= MAX_ITEMS or (item["tier"] == "media" and media >= MAX_MEDIA):
            dropped.append((item["url"], ["over the per-source or total cap"]))
            continue
        per_source[item["source"]] = n + 1
        media += item["tier"] == "media"
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
