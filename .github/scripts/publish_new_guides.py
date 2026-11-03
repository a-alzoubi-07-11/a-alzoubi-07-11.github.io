#!/usr/bin/env python3
"""Publish new guides (AR + NL): build pages, then register them on the listing
pages, category pages, sitemap and language pairs. Safe to run again: pages are
rebuilt and nothing is listed twice. Afterwards run build_search_index.py,
build_feeds.py and build_llms_txt.py."""
import importlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / ".github/scripts"))
from article_builder import build, date_text  # noqa: E402

TODAY = "2026-11-03"
MODULES = ["content_2026_11_ing", "content_2026_11_telecom", "content_2026_11_transport"]
TOPIC = {"content_2026_11_ing": "support", "content_2026_11_telecom": "life", "content_2026_11_transport": "life"}
LISTING = {"ar": ROOT / "articles.html", "nl": ROOT / "nl/articles.html"}
CHECK = {"ar": "تحقق من المصادر: ", "nl": "Broncontrole: "}


def card(lang, slug, a, topic):
    href = ("/articles/" if lang == "ar" else "/nl/articles/") + slug + ".html"
    return (f'<article class="guide-card" data-guide-card data-topic="{topic}" data-search="{a["title"]} {a["desc"]}">'
            f'<h3><a href="{href}">{a["title"]}</a></h3><p>{a["desc"]}</p>'
            f'<p class="muted"><span>{CHECK[lang]}{date_text(lang, TODAY)}</span></p></article>')


def add_to_listing(lang, slug, a, topic):
    p = LISTING[lang]; s = p.read_text(encoding="utf-8")
    href = ("/articles/" if lang == "ar" else "/nl/articles/") + slug + ".html"
    if f'href="{href}"' in s: return
    # after the last card with the same topic, so it sits in the right group
    last = None
    for m in re.finditer(r'<article class="guide-card" data-guide-card data-topic="' + topic + r'".*?</article>', s, re.S): last = m
    if not last: raise SystemExit(f"no {topic} card in {p}")
    s = s[:last.end()] + card(lang, slug, a, topic) + s[last.end():]
    p.write_text(s, encoding="utf-8")


def add_to_category(lang, slug, a, cat_href):
    p = ROOT / cat_href.lstrip("/"); s = p.read_text(encoding="utf-8")
    href = ("/articles/" if lang == "ar" else "/nl/articles/") + slug + ".html"
    if f'href="{href}"' in s: return
    i = s.rfind('<article class="topic-card">'); j = s.find("</article>", i) + len("</article>")
    s = s[:j] + f'<article class="topic-card"><h2><a href="{href}">{a["title"]}</a></h2><p>{a["summary"]}</p></article>' + s[j:]
    p.write_text(s, encoding="utf-8")


def add_to_sitemap(slug):
    p = ROOT / "sitemap.xml"; s = p.read_text(encoding="utf-8")
    for lang in ("ar", "nl"):
        loc = f"https://gidsnederland.nl/{'articles' if lang == 'ar' else 'nl/articles'}/{slug}.html"
        if f"<loc>{loc}</loc>" in s: continue
        ar = f"https://gidsnederland.nl/articles/{slug}.html"; nl = f"https://gidsnederland.nl/nl/articles/{slug}.html"
        block = (f"\n  <url>\n    <loc>{loc}</loc>\n    <lastmod>{TODAY}</lastmod>\n"
                 f'    <xhtml:link rel="alternate" hreflang="ar" href="{ar}"/>\n    <xhtml:link rel="alternate" hreflang="nl" href="{nl}"/>\n'
                 f'    <xhtml:link rel="alternate" hreflang="x-default" href="{ar}"/>\n  </url>')
        s = s.replace("\n</urlset>", block + "\n</urlset>")
    p.write_text(s, encoding="utf-8")


def add_pairs(slug):
    p = ROOT / "docs/language-pairs.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    entry = f"articles/{slug}.html"
    if isinstance(data, list) and entry not in data:
        data.append(entry); p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


for name in MODULES:
    m = importlib.import_module(name)
    for lang, folder in (("ar", "articles"), ("nl", "nl/articles")):
        a = dict(getattr(m, lang.upper()), slug=m.SLUG, sources=m.SOURCES, videos=m.VIDEOS, video_dates=m.VIDEO_DATES, category=m.CATEGORY[lang])
        (ROOT / folder / f"{m.SLUG}.html").write_text(build(lang, a, TODAY), encoding="utf-8")
        add_to_listing(lang, m.SLUG, a, TOPIC[name])
        add_to_category(lang, m.SLUG, a, m.CATEGORY[lang][0])
    add_to_sitemap(m.SLUG); add_pairs(m.SLUG)
    print("published", m.SLUG)
