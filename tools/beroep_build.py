"""Builds the beroep (appeal letter) tool pages: /beroep/index.html (AR) and /nl/beroep/index.html (NL).

Shared files: /beroep/beroep.css, /beroep/beroep.js. Run:  python3 tools/beroep_build.py
Nothing typed into the tool is stored or sent anywhere.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tool_tiles import tiles_html  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://gidsnederland.nl"
ZIVVER = "https://app.zivver.com/l/start/9fd886a5-459d-4c08-8606-07c385ed0df1"
LEEG = "/beroep/formulier-leeg.pdf"
VOORBEELD = "/beroep/voorbeeld-beroep.pdf"

T = {
    "ar": {
        "lang": "ar", "dir": "rtl", "path": "/beroep/", "other": "/nl/beroep/", "other_lang": "nl", "other_label": "Nederlands",
        "title": "رسالة الطعن على رفض الإقامة الدائمة | دليل هولندا بالعربية",
        "desc": "أداة مجانية: اكتب بياناتك وانسخ رسالة الطعن الهولندية على رفض asiel onbepaalde tijd وأرسلها للمحكمة أونلاين. لا يتم حفظ أي بيانات.",
        "home": "/", "brand": "دليل هولندا بالعربية",
        "nav": [("/", "الرئيسية"), ("/articles.html", "المقالات"), ("/tools.html", "الأدوات"), ("/about.html", "من نحن"), ("/cv.html", "أنشئ سيرتك الذاتية")],
        "crumbs": [("/", "الرئيسية"), ("/tools.html", "أدوات عملية للحياة في هولندا")], "crumb_here": "رسالة الطعن",
        "badge": "أداة مجانية • لا نحفظ أي بيانات — كل شيء يحدث داخل هاتفك",
        "h1": "رسالة الطعن على رفض الإقامة الدائمة (اللجوء) — جاهزة للنسخ",
        "lead": "اكتب بياناتك مرة واحدة، فتتعبّأ الرسالة الهولندية تلقائياً. بعدها اضغط \"نسخ\" وأرسلها للمحكمة أونلاين.",
        "steps": ["املأ بياناتك (الخانات فارغة)", "اختر مختصرة أو كاملة", "انسخ وأرسل"],
        "quick_h": "ابدأ من هنا",
        "q_send": "✉ أرسل الطعن أونلاين للمحكمة", "q_leeg": "⬇ تحميل الاستمارة فارغة", "q_vb": "⬇ تحميل نموذج تعليمي معبّأ (شرح بالعربي)",
        "docs_h": "📎 الأوراق التي ترفقها مع الإرسال", "docs_hint": "(اضغط على كل ورقة بعد تجهيزها)",
        "docs": [
            ("الاستمارة معبّأة وموقّعة", "", "حمّلها فارغة من الزر في الأعلى، املأها ووقّعها، ثم صوّرها PDF"),
            ("قرار الرفض من الـ IND", "beschikking", "كل الصفحات — من Mijn IND أو صورة الرسالة الورقية"),
            ("رسالة الطعن", "beroepschrift", "انسخها من الأسفل والصقها في الإيميل، أو أرفقها كملف PDF"),
            ("إثبات دفع الرسوم للـ IND", "leges", "لقطة شاشة للدفع أو تأكيد استلام الدفع من الـ IND — يثبت أنك قدّمت الطلب ودفعت"),
            ("نسخة من بطاقة الإقامة (اختياري)", "", "الوجهين"),
        ],
        "scan": "💡 لتحويل الأوراق إلى PDF مجاناً: آيفون ← تطبيق Bestanden أو Notities ← Scan documenten. أندرويد ← Google Drive ← Scannen.",
        "data_h": "① بياناتك", "b_example": "عرض مثال", "b_clear": "مسح كل البيانات",
        "example_flag": "هذه بيانات <b>وهمية للمثال فقط</b>. اضغط \"مسح كل البيانات\" واكتب بياناتك.",
        "fields": {
            "naam": ("الاسم الكامل", "كما في بطاقة الإقامة"),
            "vnr": ("رقم V (V-nummer)", "10 أرقام — على بطاقة الإقامة"),
            "kenmerk": ("رقم ملف الـ IND (zaaknummer / kenmerk)", "في أعلى رسالة القرار عند Ons kenmerk أو Zaaknummer"),
            "rbnr": ("رقم قضية المحكمة (zaaknummer rechtbank)", "اختياري — فقط إذا أعطتك المحكمة رقماً يبدأ بـ NL"),
            "adres": ("العنوان", ""),
            "tel": ("رقم الهاتف", "اختياري"),
            "woonplaats": ("مدينة التوقيع", ""),
            "daanvraag": ("تاريخ تقديم طلبك للـ IND", "في أول سطر من رسالة القرار"),
            "dbesluit": ("تاريخ قرار الرفض", "التاريخ المكتوب على الرسالة"),
            "dvandaag": ("تاريخ اليوم", ""),
            "dvergunning": ("من متى عندك إقامة اللجوء المؤقتة؟", "للرسالة الكاملة فقط"),
        },
        "letter_h": "② رسالتك بالهولندي", "tab_kort": "مختصرة", "tab_lang": "كاملة", "tabs_label": "نوع الرسالة",
        "subj_label": "الموضوع (Onderwerp)", "copy_subj": "نسخ الموضوع", "body_label": "نص الرسالة", "copy_body": "نسخ الرسالة",
        "send_h": "③ أرسلها للمحكمة", "send_btn": "أرسل أونلاين الآن (Zivver)", "leeg_btn": "⬇ الاستمارة فارغة",
        "where": [
            "الصق الموضوع في خانة الموضوع، والرسالة في خانة النص.",
            "أرفق الأوراق الموجودة في قائمة \"ابدأ من هنا\" في أعلى الصفحة.",
            "خذ لقطة شاشة لتأكيد الإرسال واحتفظ بها.",
            "المهلة: <b>4 أسابيع</b> من تاريخ القرار. الطعن مجاني.",
        ],
        "note": "هذه أداة تعليمية وليست استشارة قانونية. الأسباب في الرسالة تناسب من قدّم طلبه <b>قبل 12 يونيو 2026</b>. قبل الإرسال اتصل بـ Juridisch Loket على <span class='ltr'>0800-8020</span> (مجاني).",
        "more_h": "أدوات أخرى في الموقع",
        "more": [("/calculators/permanent-residence-check.html", "فاحص الإقامة الدائمة والجنسية"), ("/calculators/zorgtoeslag.html", "حاسبة zorgtoeslag"),
                 ("/calculators/kindgebonden-budget.html", "حاسبة kindgebonden budget"), ("/cv.html", "أنشئ سيرتك الذاتية CV"), ("/tools.html", "كل الأدوات")],
        "read_h": "اقرأ أيضاً", "read": [("/articles/permanent-residence-asylum-route.html", "من إقامة اللجوء إلى الإقامة الدائمة 2026")],
        "footer": {"pol": [("/editorial-policy.html", "سياسة المحتوى والتصحيح"), ("/privacy.html", "الخصوصية"), ("/contact.html", "تواصل")],
                   "pub": "الناشر: أحمد الزعبي · موقع مستقل للمعلومات التوعوية.",
                   "nav": [("/", "الرئيسية"), ("/articles.html", "المقالات"), ("/tools.html", "الحاسبات"), ("/about.html", "من نحن"), ("/contact.html", "اتصل بنا"), ("/privacy.html", "الخصوصية"), ("/editorial-policy.html", "سياسة المحتوى")]},
        "js": {"missing": "باقي {n} خانة فارغة (باللون الأحمر) — املأها قبل النسخ.", "complete": "كل الخانات معبّأة ✓",
               "kort": "المختصرة تكفي لحفظ حقك في المهلة. المحكمة ستطلب منك الأسباب الكاملة لاحقاً.",
               "lang": "الكاملة فيها كل الأسباب. يُفضّل أن يراجعها محامٍ قبل الإرسال.",
               "copied_subj": "تم نسخ الموضوع ✓", "copied_body": "تم نسخ الرسالة ✓", "selected": "تم تحديد النص — اضغط نسخ من القائمة", "cleared": "تم مسح البيانات"},
    },
    "nl": {
        "lang": "nl", "dir": "ltr", "path": "/nl/beroep/", "other": "/beroep/", "other_lang": "ar", "other_label": "العربية",
        "title": "Beroepschrift tegen afwijzing asiel onbepaalde tijd | Gids Nederland",
        "desc": "Gratis hulpmiddel: vul je gegevens in, kopieer je beroepschrift tegen de afwijzing van asiel onbepaalde tijd en stuur het online naar de rechtbank. Er wordt niets opgeslagen.",
        "home": "/nl/", "brand": "Gids Nederland",
        "nav": [("/nl/", "Home"), ("/nl/articles.html", "Artikelen"), ("/nl/tools.html", "Hulpmiddelen"), ("/nl/about.html", "Over ons"), ("/nl/cv.html", "Maak je cv")],
        "crumbs": [("/nl/", "Home"), ("/nl/tools.html", "Praktische hulpmiddelen voor Nederland")], "crumb_here": "Beroepschrift",
        "badge": "Gratis • We slaan niets op — alles gebeurt op je eigen telefoon",
        "h1": "Beroepschrift tegen afwijzing van asiel onbepaalde tijd — klaar om te kopiëren",
        "lead": "Vul je gegevens één keer in; de brief wordt automatisch ingevuld. Druk daarna op \"Kopiëren\" en stuur hem online naar de rechtbank.",
        "steps": ["Vul je gegevens in (velden zijn leeg)", "Kies kort of volledig", "Kopieer en verstuur"],
        "quick_h": "Begin hier",
        "q_send": "✉ Beroep online indienen bij de rechtbank", "q_leeg": "⬇ Leeg formulier downloaden", "q_vb": "⬇ Ingevuld voorbeeld downloaden (uitleg in het Arabisch)",
        "docs_h": "📎 Bijlagen die je meestuurt", "docs_hint": "(vink elke bijlage aan als die klaar is)",
        "docs": [
            ("Ingevuld en ondertekend formulier", "", "Download het lege formulier hierboven, vul het in, onderteken het en scan het als PDF"),
            ("Besluit van de IND", "beschikking", "Alle pagina's — uit Mijn IND of een foto van de papieren brief"),
            ("Beroepschrift", "", "Kopieer de tekst hieronder in je bericht, of voeg hem toe als PDF"),
            ("Bewijs van betaling van de leges", "", "Screenshot van de betaling of de ontvangstbevestiging van de IND"),
            ("Kopie verblijfsdocument (optioneel)", "", "Voor- en achterkant"),
        ],
        "scan": "💡 Gratis scannen naar PDF: iPhone ← app Bestanden of Notities ← Scan documenten. Android ← Google Drive ← Scannen.",
        "data_h": "① Je gegevens", "b_example": "Voorbeeld tonen", "b_clear": "Alles wissen",
        "example_flag": "Dit zijn <b>verzonnen voorbeeldgegevens</b>. Druk op \"Alles wissen\" en vul je eigen gegevens in.",
        "fields": {
            "naam": ("Volledige naam", "Zoals op je verblijfsdocument"),
            "vnr": ("V-nummer", "10 cijfers — op je verblijfsdocument"),
            "kenmerk": ("Zaaknummer IND (kenmerk)", "Bovenaan het besluit bij Ons kenmerk of Zaaknummer"),
            "rbnr": ("Zaaknummer rechtbank", "Optioneel — alleen als de rechtbank je al een nummer gaf (begint met NL)"),
            "adres": ("Adres", ""),
            "tel": ("Telefoonnummer", "Optioneel"),
            "woonplaats": ("Plaats van ondertekening", ""),
            "daanvraag": ("Datum van je aanvraag bij de IND", "Staat in de eerste zin van het besluit"),
            "dbesluit": ("Datum van het besluit", "De datum op de brief"),
            "dvandaag": ("Datum van vandaag", ""),
            "dvergunning": ("Sinds wanneer heb je asiel bepaalde tijd?", "Alleen voor de volledige brief"),
        },
        "letter_h": "② Je brief", "tab_kort": "Kort", "tab_lang": "Volledig", "tabs_label": "Soort brief",
        "subj_label": "Onderwerp", "copy_subj": "Onderwerp kopiëren", "body_label": "Tekst van de brief", "copy_body": "Brief kopiëren",
        "send_h": "③ Versturen naar de rechtbank", "send_btn": "Nu online versturen (Zivver)", "leeg_btn": "⬇ Leeg formulier",
        "where": [
            "Plak het onderwerp in het onderwerpveld en de brief in het tekstveld.",
            "Voeg de bijlagen uit de lijst \"Begin hier\" bovenaan toe.",
            "Maak een screenshot van de verzendbevestiging en bewaar die.",
            "Termijn: <b>4 weken</b> na de datum van het besluit. Beroep in asielzaken is gratis.",
        ],
        "note": "Dit is een informatief hulpmiddel, geen juridisch advies. De gronden in de brief passen bij wie de aanvraag <b>vóór 12 juni 2026</b> heeft ingediend. Bel vóór het versturen het Juridisch Loket: 0800-8020 (gratis).",
        "more_h": "Andere hulpmiddelen",
        "more": [("/nl/calculators/permanent-residence-check.html", "Check permanent verblijf en naturalisatie"), ("/nl/calculators/zorgtoeslag.html", "Zorgtoeslag berekenen"),
                 ("/nl/calculators/kindgebonden-budget.html", "Kindgebonden budget berekenen"), ("/nl/cv.html", "Maak je cv"), ("/nl/tools.html", "Alle hulpmiddelen")],
        "read_h": "Lees ook", "read": [("/nl/articles/permanent-residence-asylum-route.html", "Van asielvergunning naar permanent verblijf 2026")],
        "footer": {"pol": [("/nl/editorial-policy.html", "Redactioneel beleid en correcties"), ("/nl/privacy.html", "Privacy"), ("/nl/contact.html", "Contact")],
                   "pub": "Uitgever: Ahmad Alzoubi · Onafhankelijke informatieve website.",
                   "nav": [("/nl/", "Home"), ("/nl/articles.html", "Artikelen"), ("/nl/tools.html", "Rekentools"), ("/nl/about.html", "Over ons"), ("/nl/contact.html", "Contact"), ("/nl/privacy.html", "Privacy"), ("/nl/editorial-policy.html", "Redactiebeleid")]},
        "js": {"missing": "Nog {n} leeg veld(en) (rood) — vul ze in vóór het kopiëren.", "complete": "Alle velden zijn ingevuld ✓",
               "kort": "De korte brief is genoeg om de termijn te halen. De rechtbank vraagt later om de volledige gronden.",
               "lang": "De volledige brief bevat alle gronden. Laat hem bij voorkeur nakijken door een advocaat.",
               "copied_subj": "Onderwerp gekopieerd ✓", "copied_body": "Brief gekopieerd ✓", "selected": "Tekst geselecteerd — kies Kopiëren in het menu", "cleared": "Gegevens gewist"},
    },
}

FIELD_ATTRS = {
    "naam": 'autocomplete="name"', "vnr": 'inputmode="numeric"', "kenmerk": "", "rbnr": "",
    "adres": 'autocomplete="street-address"', "tel": 'autocomplete="tel" inputmode="tel"', "woonplaats": 'autocomplete="address-level2"',
    "daanvraag": 'type="date"', "dbesluit": 'type="date"', "dvandaag": 'type="date"', "dvergunning": 'type="date"',
}
PLACEHOLDERS = {"naam": "Mohammed Voorbeeld", "vnr": "1234567890", "kenmerk": "1234567890", "rbnr": "NL26.12345",
                "adres": "Voorbeeldstraat 1, 1234 AB Enschede", "tel": "06-12345678", "woonplaats": "Enschede"}
FULL = {"adres"}


def links(items, sep=""):
    return sep.join(f'<a href="{h}"><span>{t}</span></a>' for h, t in items)


def page(L):
    t = T[L]
    fields = []
    for k, (label, hint) in t["fields"].items():
        ph = f' placeholder="{PLACEHOLDERS[k]}"' if k in PLACEHOLDERS else ""
        cls = "f full" if k in FULL else "f"
        h = f'<span class="hint">{hint}</span>' if hint else ""
        fields.append(f'<div class="{cls}"><label for="{k}">{label}</label><input id="{k}" {FIELD_ATTRS[k]}{ph}>{h}</div>')
    docs = "".join(
        f'<label class="doc"><input type="checkbox"><span><b>{a}</b>{f" <span class=\"ltr\">({b})</span>" if b else ""}<small>{c}</small></span></label>'
        for a, b, c in t["docs"])
    steps = "".join(f'<span class="step"><b>{i + 1}</b>{s}</span>' for i, s in enumerate(t["steps"]))
    where = "".join(f"<li>{w}</li>" for w in t["where"])
    crumbs = "".join(f'<li><a href="{h}"><span>{n}</span></a></li>' for h, n in t["crumbs"])
    f = t["footer"]
    url, alt = SITE + t["path"], SITE + t["other"]
    ar_url, nl_url = SITE + T["ar"]["path"], SITE + T["nl"]["path"]
    ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": t["h1"], "url": url, "inLanguage": t["lang"],
          "applicationCategory": "UtilitiesApplication", "operatingSystem": "Web", "isAccessibleForFree": True,
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "description": t["desc"],
          "author": {"@type": "Person", "name": "Ahmad Alzoubi", "url": SITE + "/about.html"}}
    return f"""<!doctype html>
<html lang="{t['lang']}" dir="{t['dir']}" data-fixed-language="{t['lang']}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{t['title']}</title>
<meta name="description" content="{t['desc']}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#f5f5f7">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="ar" href="{ar_url}"><link rel="alternate" hreflang="nl" href="{nl_url}"><link rel="alternate" hreflang="x-default" href="{ar_url}">
<meta property="og:type" content="website"><meta property="og:title" content="{t['title']}"><meta property="og:description" content="{t['desc']}"><meta property="og:url" content="{url}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css?v=1">
<link rel="stylesheet" href="/assets/guide.css?v=1">
<link rel="stylesheet" href="/assets/apple.css?v=4">
<link rel="stylesheet" href="/assets/tool-tiles.css?v=1">
<link rel="stylesheet" href="/beroep/beroep.css?v=3">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script>window.BEROEP_TXT={json.dumps(t['js'], ensure_ascii=False)};</script>
<script src="/beroep/beroep.js?v=2" defer></script>
<script src="/assets/site-chrome.js?v=3" defer></script>
</head><body>
<header class="site-header"><div class="wrap"><div class="header-row"><a class="brand" href="{t['home']}"><span>{t['brand']}</span></a><a class="lang-button" href="{alt}" hreflang="{t['other_lang']}">{t['other_label']}</a></div><nav class="nav" aria-label="التنقل / Navigatie">{links(t['nav'])}</nav></div></header>
<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol>{crumbs}<li aria-current="page"><span>{t['crumb_here']}</span></li></ol></nav>
<div class="bt">
  <div class="bt-head">
    <span class="ex">{t['badge']}</span>
    <h1>{t['h1']}</h1>
    <p class="lead">{t['lead']}</p>
    <div class="steps">{steps}</div>
  </div>

  <section class="panel quick" aria-labelledby="h-quick">
    <h2 id="h-quick">{t['quick_h']}</h2>
    <div class="qbtns">
      <a class="gbtn gprimary big" href="{ZIVVER}" target="_blank" rel="noopener">{t['q_send']}</a>
      <a class="gbtn accent" href="{LEEG}" download="beroepschrift-asielprocedure-leeg.pdf">{t['q_leeg']}</a>
      <a class="gbtn ghost" href="{VOORBEELD}" download="voorbeeld-beroep-gidsnederland.pdf">{t['q_vb']}</a>
    </div>
    <div class="docs">
      <h3>{t['docs_h']} <span class="hint">{t['docs_hint']}</span></h3>
      {docs}
      <p class="hint">{t['scan']}</p>
    </div>
  </section>

  <section class="panel" aria-labelledby="h-data">
    <div class="row between">
      <h2 id="h-data">{t['data_h']}</h2>
      <div class="row">
        <button class="gbtn ghost" id="btn-example" type="button">{t['b_example']}</button>
        <button class="gbtn danger" id="btn-clear" type="button">{t['b_clear']}</button>
      </div>
    </div>
    <p id="example-flag" class="note" hidden>{t['example_flag']}</p>
    <form class="grid" id="form" autocomplete="on">
      {''.join(fields)}
    </form>
  </section>

  <section class="panel" aria-labelledby="h-letter">
    <div class="row between">
      <h2 id="h-letter">{t['letter_h']}</h2>
      <div class="tabs" role="tablist" aria-label="{t['tabs_label']}">
        <button role="tab" id="tab-kort" aria-selected="true" type="button">{t['tab_kort']}</button>
        <button role="tab" id="tab-lang" aria-selected="false" type="button">{t['tab_lang']}</button>
      </div>
    </div>
    <p class="hint" id="kind-hint"></p>
    <div class="f"><span class="lbl">{t['subj_label']}</span>
      <div class="subj" id="out-subj"></div>
      <div class="row"><button class="gbtn accent" id="copy-subj" type="button">{t['copy_subj']}</button></div>
    </div>
    <div class="f"><span class="lbl">{t['body_label']}</span>
      <div class="paper" id="out-body" aria-live="polite"></div>
    </div>
    <div class="row">
      <button class="gbtn gprimary" id="copy-body" type="button">{t['copy_body']}</button>
      <span class="hint" id="missing-hint"></span>
    </div>
  </section>

  <section class="panel" aria-labelledby="h-send">
    <h2 id="h-send">{t['send_h']}</h2>
    <div class="row">
      <a class="gbtn gprimary" href="{ZIVVER}" target="_blank" rel="noopener">{t['send_btn']}</a>
      <a class="gbtn ghost" href="{LEEG}" download="beroepschrift-asielprocedure-leeg.pdf">{t['leeg_btn']}</a>
    </div>
    <ul class="where">{where}</ul>
    <p class="note">{t['note']}</p>
  </section>

  <section class="panel" aria-labelledby="h-more">
    <h2 id="h-more">{t['more_h']}</h2>
    {tiles_html(L, current=t['path'], page_local=False, base=t['crumbs'][1][0])}
    <h3>{t['read_h']}</h3>
    <nav class="more" aria-label="{t['read_h']}">{links(t['read'])}</nav>
  </section>

  <div class="social">
    <a class="yt" href="https://www.youtube.com/@a.alzoubi.07.11" target="_blank" rel="noopener">▶ YouTube</a>
    <a class="tt" href="https://www.tiktok.com/@a.alzoubi.07.11" target="_blank" rel="noopener">♪ TikTok</a>
  </div>
</div>
</main>
<div class="toast" id="toast" role="status"></div>
<footer class="wrap"><nav class="nav" aria-label="Website">{links(f['pol'])}</nav><p><span>{f['pub']}</span></p><nav class="site-footer-nav" aria-label="Footer">{''.join(f'<a href="{h}">{n}</a>' for h, n in f['nav'])}</nav></footer>
</body>
</html>
"""


if __name__ == "__main__":
    for L, out in (("ar", ROOT / "beroep/index.html"), ("nl", ROOT / "nl/beroep/index.html")):
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page(L), encoding="utf-8")
        print("wrote", out.relative_to(ROOT))
