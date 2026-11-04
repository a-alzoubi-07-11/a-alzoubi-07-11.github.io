#!/usr/bin/env python3
"""Build the link-in-bio pages /links/ (AR) and /nl/links/ (NL) from one list.

Edit LINKS below and run the script again. The page is noindex (a link list is
thin content for search) but follow, so the links still pass through.
"""
import html, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
ICON = {
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    "doc": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    "tools": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 19h8"/>',
    "book": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    "play": '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
    "music": '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    "camera": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h0"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    "work": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
}
GO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'

# (section, icon, url_ar, url_nl, title_ar, title_nl, sub_ar, sub_nl, main)
LINKS = [
    ("site", "globe", "/", "/nl/", "دليل هولندا بالعربية", "Gids Nederland", "أدلة عملية عن الإقامة والعمل والبدلات بمصادر رسمية", "Praktische gidsen in het Arabisch en Nederlands", True),
    ("site", "doc", "/beroep/", "/nl/beroep/", "رسالة الطعن على رفض الإقامة الدائمة", "Beroepschrift tegen afwijzing permanent verblijf", "أداة مجانية: رسالة جاهزة + استمارة + الإرسال للمحكمة", "Gratis tool: kant-en-klare brief en formulier", False),
    ("site", "tools", "/tools.html", "/nl/tools.html", "الحاسبات والأدوات", "Rekenhulpen en tools", "zorgtoeslag، kindgebonden budget، فاحص الإقامة والمزيد", "Zorgtoeslag, kindgebonden budget, verblijfscheck en meer", False),
    ("site", "book", "/articles.html", "/nl/articles.html", "كل المقالات", "Alle artikelen", "الإقامة، العمل، الدراسة، البدلات والضرائب", "Verblijf, werk, studie, toeslagen en belasting", False),
    ("social", "play", "https://www.youtube.com/@a.alzoubi.07.11", None, "YouTube", "YouTube", "شروحات بالفيديو خطوة بخطوة", "Stap-voor-stap uitlegvideo's (Arabisch)", False),
    ("social", "music", "https://www.tiktok.com/@a.alzoubi.07.11", None, "TikTok", "TikTok", "@a.alzoubi.07.11", "@a.alzoubi.07.11", False),
    ("social", "camera", "https://www.instagram.com/a.alzoubi.07.11/", None, "Instagram", "Instagram", "@a.alzoubi.07.11", "@a.alzoubi.07.11", False),
    ("social", "users", "https://www.facebook.com/a.alzzoubi.07.11", None, "Facebook", "Facebook", "Ahmad Alzoubi", "Ahmad Alzoubi", False),
    ("social", "work", "https://www.linkedin.com/in/ahmad-alzoubi-5b1467149/", None, "LinkedIn", "LinkedIn", "Ahmad Alzoubi", "Ahmad Alzoubi", False),
    ("contact", "mail", "/contact.html", "/nl/contact.html", "تواصل معنا", "Contact", "اقتراحات، تصحيحات وتعاون", "Suggesties, correcties en samenwerking", False),
]
TXT = {
    "ar": dict(dir="rtl", title="روابط Ahmad Alzoubi | دليل هولندا بالعربية", desc="كل روابط Ahmad Alzoubi في مكان واحد: موقع دليل هولندا بالعربية، أداة رسالة الطعن، يوتيوب، تيكتوك، إنستغرام ولينكدإن.",
               name="Ahmad Alzoubi — أحمد الزعبي", bio="أشرح الحياة في هولندا بالعربي: الإقامة، الأوراق، العمل والبدلات، خطوة بخطوة.",
               sec={"site": "الموقع والأدوات", "social": "تابعني", "contact": "تواصل"}, other="Nederlands", other_href="/nl/links/",
               foot="دليل هولندا بالعربية · gidsnederland.nl", privacy="الخصوصية", privacy_href="/privacy.html", canon="https://gidsnederland.nl/links/"),
    "nl": dict(dir="ltr", title="Links van Ahmad Alzoubi | Gids Nederland", desc="Alle links van Ahmad Alzoubi op één plek: Gids Nederland, de beroeptool, YouTube, TikTok, Instagram en LinkedIn.",
               name="Ahmad Alzoubi", bio="Ik leg het leven in Nederland uit in het Arabisch: verblijf, papieren, werk en toeslagen, stap voor stap.",
               sec={"site": "Website en tools", "social": "Volg mij", "contact": "Contact"}, other="العربية", other_href="/links/",
               foot="Gids Nederland · gidsnederland.nl", privacy="Privacy", privacy_href="/nl/privacy.html", canon="https://gidsnederland.nl/nl/links/"),
}


def page(lang):
    t = TXT[lang]
    e = lambda s: html.escape(s, quote=True)
    sections, cur = [], None
    for sec, ic, u_ar, u_nl, ti_ar, ti_nl, su_ar, su_nl, main in LINKS:
        url = u_ar if lang == "ar" or not u_nl else u_nl
        title, sub = (ti_ar, su_ar) if lang == "ar" else (ti_nl, su_nl)
        ext = url.startswith("http")
        if sec != cur:
            if cur: sections.append("</ul>")
            sections.append(f'<h2 class="lk-sec">{t["sec"][sec]}</h2><ul class="lk-list">'); cur = sec
        attrs = ' target="_blank" rel="noopener me"' if ext else ""
        sections.append(
            f'<li><a class="lk-a{" lk-main" if main else ""}" href="{e(url)}"{attrs}>'
            f'<span class="lk-ic"><svg viewBox="0 0 24 24" aria-hidden="true">{ICON[ic]}</svg></span>'
            f'<span class="lk-t"><strong>{e(title)}</strong><span><bdi>{e(sub)}</bdi></span></span><span class="lk-go">{GO}</span></a></li>')
    sections.append("</ul>")
    return f"""<!doctype html>
<html lang="{lang}" dir="{t['dir']}" data-fixed-language="{lang}">
<head>
<script>
window.dataLayer=window.dataLayer||[];
window.gtag=function(){{window.dataLayer.push(arguments)}};
window.gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500}});
</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(t['title'])}</title>
<meta name="description" content="{e(t['desc'])}">
<meta name="robots" content="noindex,follow">
<meta name="theme-color" content="#f5f5f7" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="{t['canon']}">
<link rel="alternate" hreflang="ar" href="https://gidsnederland.nl/links/"><link rel="alternate" hreflang="nl" href="https://gidsnederland.nl/nl/links/"><link rel="alternate" hreflang="x-default" href="https://gidsnederland.nl/links/">
<meta property="og:type" content="profile"><meta property="og:title" content="{e(t['title'])}"><meta property="og:description" content="{e(t['desc'])}"><meta property="og:url" content="{t['canon']}"><meta property="og:image" content="https://gidsnederland.nl/assets/og-image.png">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/links.css?v=1">
<script src="/assets/site-config.js?v=2" defer></script>
<script src="/assets/consent.js?v=8" defer></script>
<script src="/assets/partners-bar.js?v=8" defer></script>
</head>
<body>
<main class="lk">
<p class="lk-lang"><a href="{t['other_href']}" hreflang="{'nl' if lang=='ar' else 'ar'}">{t['other']}</a></p>
<header class="lk-head">
<img class="lk-avatar" src="/assets/links-avatar.svg" width="96" height="96" alt="">
<h1>{e(t['name'])}</h1>
<p class="lk-handle">@a.alzoubi.07.11</p>
<p class="lk-bio">{e(t['bio'])}</p>
</header>
<nav aria-label="{e(t['title'])}">
{''.join(sections)}
</nav>
<p class="lk-foot">{e(t['foot'])} · <a href="{t['privacy_href']}">{t['privacy']}</a></p>
</main>
</body>
</html>
"""


for lang, out in (("ar", ROOT / "links/index.html"), ("nl", ROOT / "nl/links/index.html")):
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(lang), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))
