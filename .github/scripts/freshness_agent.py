#!/usr/bin/env python3
"""Freshness agent (scanner): finds articles whose facts may be out of date.

It never edits articles. It produces a ranked work queue that a human or the
monthly Claude freshness agent (docs/freshness/PLAYBOOK.md) works through,
always re-verifying against the official source before changing anything.

Signals per article (AR and NL):
  * age      - days since dateModified (review after 90 days, stale after 180)
  * milestone- a date in the text has just passed or is about to arrive
               (e.g. "from 1 January 2027": once that day passes, the sentence is
               written in the wrong tense and the new rule must be checked)
  * year     - the title promises a year that is already over (e.g. "2025")
  * links    - an official source link returns 404/410 (only with --links)

Outputs: docs/freshness/queue.json (machine) and reports/freshness.md (human).
Usage: python .github/scripts/freshness_agent.py [--links] [--today YYYY-MM-DD]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AR_M = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
NL_M = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
DATE_AR = re.compile(r"(\d{1,2})\s+(" + "|".join(AR_M) + r")\s+(20\d\d)")
DATE_NL = re.compile(r"(\d{1,2})\s+(" + "|".join(NL_M) + r")\s+(20\d\d)", re.I)
REVIEW_DAYS, STALE_DAYS = 90, 180
MILESTONE_PAST, MILESTONE_AHEAD = 120, 45  # look back / ahead window in days
# A passed date only matters when the sentence looks forward ("from", "until", "before"...).
# "The Senate voted on 7 July 2026" is history and stays correct.
FORWARD = re.compile(r"(من|ابتداء|اعتبارا|يبدأ|تبدأ|سيبدأ|ستبدأ|يدخل|سي|حتى|قبل|موعد|آخر|بحلول|"
                     r"vanaf|per|gaat|gaan|wordt|worden|tot|vóór|voor|uiterlijk|deadline|ingang|start)\b", re.I)
# High-stakes topics get checked first: money, residence, legal deadlines.
PRIORITY_WORDS = ("toeslag", "tax", "minimum-wage", "student-finance", "health-insurance", "naturalisation",
                  "residence", "family-reunification", "inburgering", "kinderbijslag", "kindgebonden",
                  "contracts", "payslip", "zorgtoeslag", "housing", "childcare", "prinsjesdag")


def strip_tags(html: str) -> str:
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html))


def article_body(html: str) -> str:
    """The factual part only: from the first <h2> to the FAQ/sources, without bylines,
    review notes or correction logs (their dates are about us, not about the rules)."""
    m = re.search(r"<article[^>]*>(.*?)</article>", html, re.S)
    body = m.group(1) if m else html
    start = body.find("<h2")
    body = body[start:] if start >= 0 else body
    end = re.search(r'<section[^>]*(faq|sources|related)|<h2[^>]*>\s*(الأسئلة|المصادر|Veelgestelde|Bronnen)', body)
    body = body[:end.start()] if end else body
    body = re.sub(r'<aside[^>]*class="[^"]*notice[^"]*"[^>]*>.*?</aside>', " ", body, flags=re.S)
    return re.sub(r'<div[^>]*class="[^"]*meta[^"]*"[^>]*>.*?</div>', " ", body, flags=re.S)


def date_modified(html: str) -> date | None:
    m = re.search(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})', html)
    if not m:
        m = re.search(r'article:modified_time"\s+content="(\d{4}-\d{2}-\d{2})', html)
    return datetime.strptime(m.group(1), "%Y-%m-%d").date() if m else None


def milestones(text: str, lang: str, today: date, verified: date | None = None) -> list[dict]:
    out, seen = [], set()
    pat, months = (DATE_AR, AR_M) if lang == "ar" else (DATE_NL, NL_M)
    for m in pat.finditer(text):
        try:
            d = date(int(m.group(3)), months.index(m.group(2).lower() if lang == "nl" else m.group(2)) + 1,
                     int(m.group(1)))
        except ValueError:
            continue
        delta = (d - today).days
        before = text[max(0, m.start() - 45):m.start()]
        if delta < 0 and not FORWARD.search(before):
            continue
        if delta < 0 and verified and d <= verified:
            continue  # the page was re-verified after this date passed: already handled
        if -MILESTONE_PAST <= delta <= MILESTONE_AHEAD and d not in seen:
            seen.add(d)
            s = max(0, m.start() - 90)
            out.append({"date": d.isoformat(), "days": delta,
                        "context": text[s:m.end() + 60].strip()})
    return out


def official_links(html: str) -> list[str]:
    return sorted({u for u in re.findall(r'href="(https?://[^"]+)"', html)
                   if not u.startswith("https://a-alzoubi-07-11.github.io")
                   and re.search(r"\.(nl|eu)/", u + "/")})


def link_status(url: str) -> tuple[str, int | None]:
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "Mozilla/5.0 (freshness-agent)"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception:  # noqa: BLE001 - network hiccups are "unknown", never "broken"
        return url, None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--links", action="store_true", help="also check official source links (needs network)")
    ap.add_argument("--today", help="override today's date (YYYY-MM-DD) for testing")
    args = ap.parse_args()
    today = datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else date.today()

    pages = sorted(ROOT.glob("articles/*.html")) + sorted(ROOT.glob("nl/articles/*.html"))
    items, all_links = [], {}
    for p in pages:
        rel = p.relative_to(ROOT).as_posix()
        lang = "nl" if rel.startswith("nl/") else "ar"
        html = p.read_text(encoding="utf-8", errors="replace")
        title = re.sub(r"\s+", " ", (re.search(r"<title>(.*?)</title>", html, re.S) or [None, ""])[1]).strip()
        dm = date_modified(html)
        age = (today - dm).days if dm else 999
        text = strip_tags(article_body(html))
        ms = milestones(text, lang, today, dm)
        years = [int(y) for y in re.findall(r"\b(20\d\d)\b", title)]
        old_year = bool(years) and max(years) < today.year
        links = official_links(html)
        for u in links:
            all_links.setdefault(u, []).append(rel)
        reasons, score = [], 0
        if dm is None:
            reasons.append("no verification date (dateModified) found: verify and restamp"); score += 40
        elif age >= STALE_DAYS:
            reasons.append(f"stale: last verified {age} days ago"); score += 40
        elif age >= REVIEW_DAYS:
            reasons.append(f"review: last verified {age} days ago"); score += 15
        if old_year:
            reasons.append(f"title only mentions {max(years)}; check whether a {today.year} version is due"); score += 20
        for m in ms:
            if m["days"] < 0:
                reasons.append(f"date passed {-m['days']} days ago ({m['date']}): rewrite tense and check the new rule")
                score += 30
            else:
                reasons.append(f"milestone in {m['days']} days ({m['date']}): prepare the update")
                score += 10
        if any(w in rel for w in PRIORITY_WORDS):
            score = int(score * 1.3)
        items.append({"page": rel, "lang": lang, "title": title, "dateModified": dm.isoformat() if dm else None,
                      "age_days": age, "score": score, "reasons": reasons, "milestones": ms,
                      "sources": links})

    broken = {}
    if args.links and all_links:
        with ThreadPoolExecutor(max_workers=6) as ex:
            for url, status in ex.map(link_status, list(all_links)):
                if status in (404, 410):
                    broken[url] = status
        for it in items:
            for u in it["sources"]:
                if u in broken:
                    it["reasons"].append(f"source link broken ({broken[u]}): {u}")
                    it["score"] += 25

    queue = sorted((i for i in items if i["reasons"]), key=lambda i: (-i["score"], i["page"]))
    out = {"generated": today.isoformat(), "pages_checked": len(items), "links_checked": len(all_links) if args.links else 0,
           "broken_links": broken, "queue": queue}
    (ROOT / "docs/freshness").mkdir(parents=True, exist_ok=True)
    (ROOT / "docs/freshness/queue.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    lines = [f"# Freshness report — {today.isoformat()}", "",
             f"Pages checked: {len(items)} · needing attention: {len(queue)} · broken official links: {len(broken)}", "",
             "| # | Page | Score | Why |", "|---|---|---|---|"]
    for n, i in enumerate(queue[:40], 1):
        lines.append(f"| {n} | `{i['page']}` | {i['score']} | " + "<br>".join(i["reasons"]).replace("|", "/") + " |")
    lines += ["", "Work through the queue with docs/freshness/PLAYBOOK.md. Never change a fact without an official source."]
    (ROOT / "reports").mkdir(exist_ok=True)
    (ROOT / "reports/freshness.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines[:3] + lines[4:16]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
