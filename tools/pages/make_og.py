"""Share images (og:image, 1200x630) for every guide, AR and NL, plus the meta tags that point to them.

- Image: brand line, topic, the guide's short H1 and subtitle. Rendered with Chromium (Playwright) and the
  Cairo font that already ships in beroep/fonts, so Arabic is shaped correctly.
- Writes assets/og/<slug>.jpg (Arabic) and assets/og/nl-<slug>.jpg (Dutch); skips images whose text did not change
  (assets/og/manifest.json keeps a hash per image).
- Adds or updates og:image (+ width/height/alt) and twitter:image in each guide.

Run: python3 tools/pages/make_og.py            (needs: pip install playwright; the Chromium in this image works)
"""
import hashlib, html as H, json, os, re, sys, tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "assets" / "og"
SITE = "https://gidsnederland.nl"
FONT = REPO / "beroep" / "fonts"

TPL = """<!doctype html><html lang="{lang}" dir="{dir}"><head><meta charset="utf-8"><style>
@font-face{{font-family:C;src:url("{font}/Cairo-Regular.ttf");font-weight:400}}
@font-face{{font-family:C;src:url("{font}/Cairo-Bold.ttf");font-weight:700}}
html,body{{margin:0;width:1200px;height:630px}}
body{{box-sizing:border-box;padding:64px 76px;background:#f5f5f7;font-family:C,system-ui,sans-serif;color:#1d1d1f;display:flex;flex-direction:column}}
.brand{{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700}}
.dot{{width:18px;height:18px;border-radius:5px;background:#ee731c}}
.topic{{margin-top:44px;align-self:flex-start;font-size:26px;font-weight:700;color:#0066cc;background:#e8f1fd;border-radius:999px;padding:4px 22px}}
h1{{margin:22px 0 0;font-size:{size}px;line-height:1.25;font-weight:700;max-height:3.75em;overflow:hidden}}
p{{margin:18px 0 0;font-size:30px;line-height:1.45;color:#5e5e63;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}
.foot{{margin-top:auto;display:flex;justify-content:space-between;font-size:24px;color:#5e5e63}}
</style></head><body><div class="brand"><span class="dot"></span>{brand}</div>
{topic}<h1>{title}</h1>{sub}<div class="foot"><span>gidsnederland.nl</span><span>{note}</span></div></body></html>"""


def guides():
    idx = {e["u"]: e for e in json.loads((REPO / "assets/search-index.json").read_text(encoding="utf-8"))["items"]}
    for lang, folder in (("ar", REPO / "articles"), ("nl", REPO / "nl" / "articles")):
        for f in sorted(folder.glob("*.html")):
            t = f.read_text(encoding="utf-8")
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
            sub = re.search(r'<p class="article-sub"><span>(.*?)</span></p>', t, re.S)
            clean = lambda s: re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", "", s))).strip()
            url = ("/nl" if lang == "nl" else "") + f"/articles/{f.stem}.html"
            yield {"path": f, "lang": lang, "slug": f.stem, "title": clean(h1.group(1)) if h1 else f.stem,
                   "sub": clean(sub.group(1)) if sub else "", "topic": (idx.get(url) or {}).get("c", ""),
                   "img": f"{'nl-' if lang == 'nl' else ''}{f.stem}.jpg"}


def meta(page, g):
    url = f"{SITE}/assets/og/{g['img']}"
    alt = H.escape(g["title"], quote=True)
    tags = (f'<meta property="og:image" content="{url}">\n<meta property="og:image:width" content="1200">\n'
            f'<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="{alt}">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="{url}">')
    page = re.sub(r'\n?<meta (?:property="og:image(?::[a-z]+)?"|name="twitter:(?:card|image)")[^>]*>', "", page)
    anchor = re.search(r'<meta property="og:description"[^>]*>', page) or re.search(r"</title>", page)
    page = page[:anchor.end()] + "\n" + tags + page[anchor.end():]
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)   # structured data: same image
    if m:
        try:
            j = json.loads(m.group(1))
            for n in j.get("@graph", []):
                if n.get("@type") == "Article":
                    n["image"] = {"@type": "ImageObject", "url": url, "width": 1200, "height": 630}
            page = page[:m.start(1)] + json.dumps(j, ensure_ascii=False) + page[m.end(1):]
        except ValueError:
            pass
    return page


def main():
    from playwright.sync_api import sync_playwright
    OUT.mkdir(parents=True, exist_ok=True)
    man_p = OUT / "manifest.json"
    man = json.loads(man_p.read_text()) if man_p.exists() else {}
    items = list(guides())
    made = 0
    with tempfile.TemporaryDirectory() as tmp, sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        for g in items:
            key = hashlib.sha1(json.dumps([g["title"], g["sub"], g["topic"], 2], ensure_ascii=False).encode()).hexdigest()[:12]
            if man.get(g["img"]) != key or not (OUT / g["img"]).exists():
                ar = g["lang"] == "ar"
                size = 64 if len(g["title"]) < 40 else 54 if len(g["title"]) < 70 else 46
                doc = TPL.format(lang=g["lang"], dir="rtl" if ar else "ltr", font=FONT.as_uri(), size=size,
                                 brand="دليل هولندا بالعربية" if ar else "Gids Nederland",
                                 topic=f'<div class="topic">{H.escape(g["topic"])}</div>' if g["topic"] else "",
                                 title=H.escape(g["title"]), sub=f'<p>{H.escape(g["sub"])}</p>' if g["sub"] else "",
                                 note="مع المصادر الرسمية" if ar else "Met officiële bronnen")
                f = Path(tmp) / "og.html"
                f.write_text(doc, encoding="utf-8")
                pg.goto(f.as_uri())
                pg.evaluate("document.fonts.ready")
                pg.screenshot(path=str(OUT / g["img"]), type="jpeg", quality=82)
                man[g["img"]] = key
                made += 1
            t = g["path"].read_text(encoding="utf-8")
            new = meta(t, g)
            if new != t:
                g["path"].write_text(new, encoding="utf-8")
        b.close()
    man_p.write_text(json.dumps(man, indent=1, sort_keys=True), encoding="utf-8")
    print(f"guides: {len(items)}, images rendered: {made}")


if __name__ == "__main__":
    main()
