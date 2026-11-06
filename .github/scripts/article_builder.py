#!/usr/bin/env python3
"""Build a guide page (AR or NL) in the exact site layout from structured content.

The <head> boilerplate (consent defaults, AdSense, analytics, styles) and the site
header/footer are copied from an existing guide, so new guides stay identical in
structure to the rest of the site. Content is passed as plain data.
"""
import html, json, pathlib, re


def _iso_dt(d):
    """Google wants uploadDate as ISO 8601 datetime with a time zone."""
    d = str(d)
    return d if "T" in d else d + "T12:00:00+00:00"

ROOT = pathlib.Path(__file__).resolve().parents[2]
SITE = "https://gidsnederland.nl"
TEMPLATE = {"ar": ROOT / "articles/digid-registration-guide.html", "nl": ROOT / "nl/articles/digid-registration-guide.html"}
MONTHS = {"ar": ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
          "nl": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]}
L = {
    "ar": dict(home="الرئيسية", articles="المقالات", crumbs="مسار التنقل / Kruimelpad", summary="الخلاصة العملية", toc="في هذا الدليل",
               faq_h="أسئلة شائعة", faq_toc="الأسئلة الشائعة", src_h="المصادر الرسمية", rel_h="اقرأ أيضاً",
               upd="الناشر: أحمد الزعبي · آخر تحديث للمحتوى: {d}",
               ai="إعداد وتحقق من المصادر بمساعدة الذكاء الاصطناعي؛ لا توجد مراجعة متخصصة مستقلة. تحقق من المصدر الرسمي لحالتك.",
               policy=("/editorial-policy.html", "سياسة المراجعة والتصحيح"),
               src_p="تم التحقق من المصادر في {d}. اقرأ التعليمات الحالية التي تظهر في المصدر؛ هذا الدليل لا يحل محل الجهة المختصة.",
               author='<aside class="author-box"><h2>عن الناشر</h2><p>أحمد الزعبي ناشر هذا الدليل المستقل للعرب في هولندا. يهدف الموقع إلى شرح المصادر الرسمية بلغة بسيطة، ولا يمثل جهة حكومية أو يقدم استشارة قانونية شخصية.</p><a href="/about.html">من نحن</a></aside>',
               closing='<p>الطلب والقرارات لدى الجهة المختصة. لا تشارك معنا كلمة المرور أو الرموز أو بيانات الهوية.</p><a href="/contact.html">أبلغ عن خطأ مع الفقرة والمصدر</a>',
               lang_btn="Nederlands", other="nl", prefix="/articles/", author_name="أحمد الزعبي", cat_all="جميع أدلة: {c}",
               v_h="شاهد الشرح بالفيديو", v_intro="شرح عملي خطوة بخطوة من قناتنا على يوتيوب.", v_note="لا يُحمَّل أي محتوى من يوتيوب قبل أن تضغط تشغيل.",
               v_play="تشغيل الفيديو", v_yt="شاهد على يوتيوب", v_label="فيديو الشرح", og_locale="ar_AR", og_alt="nl_NL"),
    "nl": dict(home="Home", articles="Artikelen", crumbs="Kruimelpad", summary="Kort samengevat", toc="In deze gids",
               faq_h="Veelgestelde vragen", faq_toc="Veelgestelde vragen", src_h="Officiële bronnen", rel_h="Lees ook",
               upd="Uitgever: Ahmad Alzoubi · Laatste inhoudelijke update: {d}",
               ai="Voorbereid en gecontroleerd met AI-ondersteuning. Geen onafhankelijke specialistische beoordeling; controleer je eigen situatie bij de officiële bron.",
               policy=("/nl/editorial-policy.html", "Redactie- en correctiebeleid"),
               src_p="Bronnen gecontroleerd op {d}. Lees de actuele instructies bij de bron; deze gids vervangt de betreffende organisatie niet.",
               author='<aside class="author-box"><h2>Over de uitgever</h2><p>Ahmad Alzoubi publiceert deze onafhankelijke gids voor Arabischtaligen in Nederland. De informatie legt officiële bronnen in eenvoudige taal uit; het is geen officiële dienstverlening of persoonlijk juridisch advies.</p><a href="/nl/about.html">Over ons</a></aside>',
               closing='<p>De aanvraag en beslissingen verlopen bij de betreffende organisatie. Deel geen wachtwoorden, codes of identiteitsgegevens met ons.</p><a href="/nl/contact.html">Meld een fout met de betreffende passage en bron</a>',
               lang_btn="العربية", other="ar", prefix="/nl/articles/", author_name="Ahmad Alzoubi", cat_all="Alle gidsen: {c}",
               v_h="Bekijk de uitleg in een video", v_intro="Een praktische stap-voor-stapuitleg van ons YouTube-kanaal (in het Arabisch).",
               v_note="Er wordt niets van YouTube geladen voordat je op afspelen drukt.", v_play="Video afspelen", v_yt="Bekijk op YouTube",
               v_label="Uitlegvideo", og_locale="nl_NL", og_alt="ar_AR"),
}


def date_text(lang, iso):
    y, m, d = (int(x) for x in iso.split("-"))
    return f"{d} {MONTHS[lang][m-1]} {y}"


def url(lang, slug):
    return SITE + L[lang]["prefix"] + slug + ".html"


def video_block(lang, videos):
    t = L[lang]; e = lambda s: html.escape(s, quote=True)
    items = "".join(
        f'<figure class="cv-item"><div class="video-slot" data-video-id="{v}" data-video-title="{e(ti)}"><div class="video-placeholder">'
        f'<p class="cv-title">{e(ti)}</p><button type="button" class="cv-play" data-play-video>{t["v_play"]}</button>'
        f'<p class="cv-note">{t["v_note"]}</p></div></div><figcaption><a href="https://www.youtube.com/watch?v={v}" target="_blank" rel="noopener">{t["v_yt"]}</a></figcaption></figure>'
        for v, ti in videos)
    return (f'<!-- channel-videos:start --><section class="cv" id="video" aria-label="{t["v_label"]}"><h2>{t["v_h"]}</h2>'
            f'<p class="cv-intro">{t["v_intro"]}</p>{items}</section><!-- channel-videos:end -->')


def build(lang, a, today):
    """a: dict(slug, title, desc, summary, sections=[(id, h2, html)], faq=[(q, a)], sources=[(id, label, url)],
    related=[(href, title)], category=(href, name), videos=[(id, title)])."""
    t = L[lang]; e = lambda s: html.escape(s, quote=True)
    tpl = TEMPLATE[lang].read_text(encoding="utf-8")
    head_pre = tpl.split("<title>", 1)[0]
    me, other = url(lang, a["slug"]), url(t["other"], a["slug"])
    ar_u, nl_u = url("ar", a["slug"]), url("nl", a["slug"])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": a["title"], "description": a["desc"], "inLanguage": lang, "mainEntityOfPage": me,
         "datePublished": today, "dateModified": today, "image": SITE + "/assets/og-image.png",
         "author": {"@type": "Person", "name": t["author_name"], "url": SITE + ("/about.html" if lang == "ar" else "/nl/about.html")},
         "publisher": {"@type": "Person", "name": "Ahmad Alzoubi", "url": SITE + "/about.html"},
         "citation": [u for _, _, u in a["sources"]],
         "video": [{"@type": "VideoObject", "name": ti, "embedUrl": f"https://www.youtube-nocookie.com/embed/{v}",
                    "url": f"https://www.youtube.com/watch?v={v}", "thumbnailUrl": f"https://i.ytimg.com/vi/{v}/hqdefault.jpg",
                    "uploadDate": _iso_dt(a.get("video_dates", {}).get(v, today)), "description": ti} for v, ti in a["videos"]]},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": t["home"], "item": SITE + ("/" if lang == "ar" else "/nl/")},
            {"@type": "ListItem", "position": 2, "name": t["articles"], "item": SITE + ("/articles.html" if lang == "ar" else "/nl/articles.html")},
            {"@type": "ListItem", "position": 3, "name": a["title"], "item": me}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", ans)}} for q, ans in a["faq"]]}]}
    head = (head_pre + f'<title>{e(a["title"])}</title><meta name="description" content="{e(a["desc"])}">\n'
            '<meta name="robots" content="index,follow,max-image-preview:large"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f5f5f7">\n'
            f'<meta property="og:type" content="article"><meta property="og:locale" content="{t["og_locale"]}"><meta property="og:locale:alternate" content="{t["og_alt"]}">'
            f'<meta property="og:site_name" content="{"دليل هولندا بالعربية" if lang == "ar" else "Gids Nederland"}"><meta property="og:title" content="{e(a["title"])}">'
            f'<meta property="og:description" content="{e(a["desc"])}"><meta property="og:url" content="{me}">'
            f'<meta property="og:image" content="{SITE}/assets/og-image.png"><meta property="og:image:alt" content="{e(a["title"])}">'
            f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(a["title"])}"><meta name="twitter:description" content="{e(a["desc"])}">'
            f'<meta name="twitter:image" content="{SITE}/assets/og-image.png">\n'
            '<meta name="google-site-verification" content="A9hem9lFx7-Zdjg2rwL9IQqAU1kmCPdOonknPoIP_0">\n'
            '<link rel="stylesheet" href="/assets/guide.css?v=2"><link rel="stylesheet" href="/assets/apple.css?v=5"><script src="/assets/guide.js?v=2" defer></script>\n'
            f'<link rel="canonical" href="{me}"><link rel="alternate" hreflang="ar" href="{ar_u}"><link rel="alternate" hreflang="nl" href="{nl_u}"><link rel="alternate" hreflang="x-default" href="{ar_u}">\n'
            f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n</head>\n')
    header = re.search(r"<body>.*?</header>", tpl, re.S).group(0)
    header = re.sub(r'<a class="lang-button" href="[^"]*"', f'<a class="lang-button" href="{other}"', header)
    footer = re.search(r'<footer class="wrap">.*?</footer>', tpl, re.S).group(0)
    dt = date_text(lang, today)
    toc = "".join(f'<li><a href="#{i}">{e(h)}</a></li>' for i, h, _ in a["sections"]) + f'<li><a href="#faq">{t["faq_toc"]}</a></li>'
    body_sections = "\n".join(f'<h2 id="{i}">{e(h)}</h2>\n{c}' for i, h, c in a["sections"])
    faq = "\n".join(f"<details open><summary>{e(q)}</summary><p>{ans}</p></details>" for q, ans in a["faq"])
    sources = "".join(f'<li id="source-{i}"><a href="{e(u)}" rel="noopener noreferrer">{e(lb)}</a></li>' for i, lb, u in a["sources"])
    related = "".join(f'<li><a href="{h}">{e(ti)}</a></li>' for h, ti in a["related"])
    cat_href, cat_name = a["category"]
    dirattr = 'lang="ar" dir="rtl"' if lang == "ar" else 'lang="nl" dir="ltr"'
    main = (f'<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="{t["crumbs"]}"><ol><li><a href="{"/" if lang == "ar" else "/nl/"}"><span>{t["home"]}</span></a></li>'
            f'<li><a href="{"/articles.html" if lang == "ar" else "/nl/articles.html"}"><span>{t["articles"]}</span></a></li><li aria-current="page">{e(a["title"])}</li></ol></nav>'
            f'<article class="reader"><h1>{e(a["title"])}</h1><div class="meta"><p>{t["upd"].format(d=dt)}</p><p>{t["ai"]}</p><a href="{t["policy"][0]}">{t["policy"][1]}</a></div>'
            f'<div {dirattr}><div class="summary"><strong>{t["summary"]}</strong><p>{a["summary"]}</p></div>\n'
            f'<nav class="toc" aria-label="{t["toc"]}"><h2>{t["toc"]}</h2><ul>{toc}</ul></nav>{body_sections}\n'
            f'{video_block(lang, a["videos"])}<section id="faq"><h2>{t["faq_h"]}</h2>\n{faq}\n</section>\n</div>'
            f'<section id="sources"><h2>{t["src_h"]}</h2><p>{t["src_p"].format(d=dt)}</p><ul>{sources}</ul></section>{t["author"]}{t["closing"]}</article>'
            f'<section class="related-guides"><h2>{t["rel_h"]}</h2><ul>{related}</ul><a href="{cat_href}">{t["cat_all"].format(c=cat_name)}</a></section></main>\n')
    scripts = '<script src="/assets/chatbot.js?v=4" defer></script><script src="/assets/site-chrome.js?v=9" defer></script>\n<script src="/assets/video-embed.js?v=2" defer></script>\n'
    html_tag = f'<html lang="{lang}" dir="{"rtl" if lang == "ar" else "ltr"}" data-fixed-language="{lang}" data-ad-reviewed="false">'
    head = re.sub(r"<html[^>]*>", html_tag, head, count=1)
    return head + header + "\n" + main + footer + "\n" + scripts + "</body></html>\n"
