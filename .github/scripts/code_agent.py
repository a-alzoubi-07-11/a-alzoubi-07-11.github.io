#!/usr/bin/env python3
"""Audit the checked out branch and published Pages sites; suggest, never edit."""
import argparse
import datetime as dt
import os
from pathlib import Path

from agent_core import live_pages, local_broken_links, local_pages, parse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", default=".")
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()
    site = Path(args.site_dir)
    rows, problems = [], []
    for path, html in local_pages(site):
        doc = parse(html)
        issues = []
        if not doc.title.strip():
            issues.append("title مفقود")
        if not doc.lang:
            issues.append("lang مفقود")
        if not doc.canonical:
            issues.append("canonical مفقود")
        if doc.images_without_alt:
            issues.append(f"{doc.images_without_alt} صورة بلا وصف")
        for link in local_broken_links(site, Path(path), doc.links):
            issues.append(f"رابط محلي مفقود: {link}")
        rows.append((path, len(html.encode("utf-8")), len(issues)))
        problems += [f"- `{path}`: {issue}" for issue in issues]
    live_rows = []
    if args.live:
        for url, html in live_pages():
            if html.startswith("<!-- fetch error:"):
                problems.append(f"- تعذر تحميل الصفحة المنشورة: {url}")
                live_rows.append((url, "غير متاحة للفحص"))
            else:
                doc = parse(html)
                live_rows.append((url, f"HTTP OK؛ {len(html)} حرف؛ {len(doc.links)} رابط"))
                if not doc.title.strip():
                    problems.append(f"- عنوان مفقود في: {url}")
    now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# تقرير فحص الكود والروابط",
        f"وقت الفحص: {now}",
        f"المستودع: {os.getenv('GITHUB_REPOSITORY', 'local')}؛ الفرع: {os.getenv('GITHUB_REF_NAME', 'local')}",
        "",
        "| صفحة المستودع | الحجم بالبايت | الملاحظات |",
        "|---|---:|---:|",
        *[f"| `{p}` | {size} | {count} |" for p, size, count in rows],
        "", "## صفحات منشورة فُحصت", "",
        *[f"- {url} — {status}" for url, status in live_rows],
        "", "## ملاحظات تحتاج مراجعة", "",
        *(problems or ["لا توجد ملاحظات في الفحص الآلي."]),
        "", "هذه نتائج فحص آلي؛ أخطاء الشبكة أو الحظر لا تعني أن الصفحة معطلة للزوار.",
    ]
    out = site / "reports" / f"code-audit-{dt.date.today().isoformat()}.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{out}: {len(rows)} local pages, {len(live_rows)} published pages, {len(problems)} notes")


if __name__ == "__main__":
    main()
