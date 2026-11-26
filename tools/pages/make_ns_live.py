"""Build the «مواعيد القطارات المباشرة / Treintijden live» tool pages (AR + NL).

Run: python3 tools/pages/make_ns_live.py
Logic: assets/ns-live.js. Data: NS Reisinformatie API through cloudflare/ns-proxy-worker.js.
Set NS_API to the deployed worker URL (empty = the page shows «coming soon»).
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

NS_API = ''
SLUG = 'treintijden'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = (f'<script>window.GN_NS_API={NS_API!r};</script>'
        '<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/ns-live.css?v=1">'
        '<script src="/assets/ns-live.js?v=1" defer></script>')

SOURCES = [
    ('NS API Portal · Reisinformatie API (NS-App)', 'https://apiportal.ns.nl/'),
    ('NS · Reisplanner', 'https://www.ns.nl/reisplanner'),
]


def form(L):
    def f(i, label):
        return (f'<label class="ns-f" for="ns-{i}"><span>{label}</span><input id="ns-{i}" type="text" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" '
                f'aria-controls="ns-{i}-list" placeholder="{L["ph"]}" maxlength="60"><ul id="ns-{i}-list" class="ns-list" role="listbox" hidden></ul></label>')
    tabs = ''.join(f'<button type="button" role="tab" aria-selected="{"true" if k == 0 else "false"}" aria-controls="ns-p{k}">{t}</button>' for k, t in enumerate(L['tabs']))
    return (
        f'<section id="ns-live" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        f'<div class="ns-tabs" role="tablist">{tabs}</div>'
        f'<div id="ns-p0" role="tabpanel"><form id="ns-form-trip" novalidate autocomplete="off">{f("from", L["from"])}{f("to", L["to"])}'
        f'<button class="tool-button primary" type="submit">{L["go"]}</button></form><div id="ns-out-trip" class="ns-out tool-result" role="status" aria-live="polite"></div></div>'
        f'<div id="ns-p1" role="tabpanel" hidden><form id="ns-form-dep" novalidate autocomplete="off">{f("st", L["station"])}'
        f'<button class="tool-button primary" type="submit">{L["dep"]}</button></form><div id="ns-out-dep" class="ns-out tool-result" role="status" aria-live="polite"></div></div>'
        f'<div id="ns-p2" role="tabpanel" hidden><div id="ns-out-dis" class="ns-out tool-result" role="status" aria-live="polite"></div></div>'
        '</section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='مواعيد القطارات المباشرة بالعربي',
    page_title='مواعيد القطارات المباشرة في هولندا بالعربي: التأخير والرصيف والسعر والأعطال',
    desc='مواعيد قطارات NS المباشرة بالعربي: الرحلة بين محطتين مع التأخير والرصيف والتبديل والازدحام والسعر الرسمي، والقطارات المغادرة من أي محطة، والأعطال وأعمال السكة الآن.',
    summary='اختار محطة الانطلاق والوصول، فتشوف القطارات الجاية مع التأخير الحقيقي، ورقم الرصيف، وكم تبديل، والازدحام، وسعر التذكرة الرسمي من NS. وفيك تشوف القطارات المغادرة من أي محطة، والأعطال المعلنة الآن.',
    form_h='مواعيد مباشرة من NS',
    noscript='الأداة تحتاج JavaScript. استعمل مخطط رحلات NS.',
    tabs=['🚆 رحلة', '🕒 المغادرة من محطة', '⚠️ الأعطال الآن'], **{'from': 'من محطة', 'to': 'إلى محطة'}, station='المحطة', ph='اكتب اسم المحطة، مثلاً Utrecht',
    go='اعرض المواعيد', dep='اعرض القطارات المغادرة',
)
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Treintijden live',
    page_title='Treintijden live: vertraging, spoor, prijs en storingen',
    desc='Actuele NS-treintijden: reizen tussen twee stations met vertraging, spoor, overstappen, drukte en de officiële prijs, vertrektijden per station en storingen en werkzaamheden nu.',
    summary='Kies je vertrek- en aankomststation en zie de volgende treinen met de echte vertraging, het spoor, het aantal overstappen, de verwachte drukte en de officiële NS-prijs. Bekijk ook de vertrektijden van elk station en de storingen van dit moment.',
    form_h='Actuele reisinformatie van NS',
    noscript='Deze tool vraagt JavaScript. Gebruik de NS Reisplanner.',
    tabs=['🚆 Reis', '🕒 Vertrektijden', '⚠️ Storingen nu'], **{'from': 'Van station', 'to': 'Naar station'}, station='Station', ph='Typ een stationsnaam, bijv. Utrecht',
    go='Toon reizen', dep='Toon vertrekkende treinen',
)
AR_BODY = '''
<section><h2>كيف تستعمل الأداة؟</h2>
<ul>
<li><b>رحلة:</b> اكتب أول حرفين من اسم المحطة واختارها من القائمة. بتطلعلك الرحلات الجاية مع وقت المغادرة والوصول، والتأخير بالأحمر، ورقم الرصيف، وعدد التبديلات، والسعر الرسمي للدرجة الثانية.</li>
<li><b>المغادرة من محطة:</b> لوحة القطارات المغادرة متل الشاشة بالمحطة. إذا تغيّر الرصيف بتطلع علامة ⚠️.</li>
<li><b>الأعطال الآن:</b> الأعطال وأعمال السكة المعلنة من NS، مع المدة المتوقعة.</li>
</ul>
<p>بدك تعرف كم بتكلّفك الرحلة شهرياً وأي اشتراك أوفر، أو رحلتك من البيت بالباص والترام؟ جرّب <a href="/calculators/ov-reiskosten.html">حاسبة المواصلات</a>. ولشرح التذاكر وOVpay اقرأ <a href="/articles/ns-train-ov-chipkaart-ovpay.html">دليل NS وOVpay</a>.</p>
</section>
'''
NL_BODY = '''
<section><h2>Hoe gebruik je de tool?</h2>
<ul>
<li><b>Reis:</b> typ de eerste letters van een station en kies het uit de lijst. Je ziet de volgende reizen met vertrek- en aankomsttijd, vertraging in rood, spoor, aantal overstappen en de officiële prijs voor de 2e klas.</li>
<li><b>Vertrektijden:</b> het vertrekbord, zoals op het station. Bij een spoorwijziging zie je ⚠️.</li>
<li><b>Storingen nu:</b> storingen en werkzaamheden die NS meldt, met de verwachte duur.</li>
</ul>
<p>Wil je weten wat je reis per maand kost en welk abonnement voordeliger is, of je reis van deur tot deur met bus en tram? Probeer de <a href="/nl/calculators/ov-reiskosten.html">OV-reiskosten rekenhulp</a>. Uitleg over kaartjes en OVpay: <a href="/nl/articles/ns-train-ov-chipkaart-ovpay.html">trein en ov</a>.</p>
</section>
'''
AR_FAQ = [
    ('من وين جاية المواعيد؟', 'مباشرة من معلومات السفر الرسمية لشركة NS، وبتتحدث كل دقيقة تقريباً.'),
    ('هل السعر هو السعر الحقيقي؟', 'نعم، هو سعر NS الرسمي للرحلة الواحدة بالدرجة الثانية بدون خصم. إذا عندك اشتراك أو خصم، بتدفع أقل.'),
    ('ليش بعض الكلام بالهولندي؟', 'رسائل NS (سبب العطل، الملاحظات) بتوصل بالهولندي، فتركناها متل ما هي لحتى ما يصير خطأ بالترجمة.'),
    ('هل فيها الباص والترام؟', 'هالأداة لقطارات NS والشركات اللي معها. للرحلة الكاملة من البيت بالباص والترام استعمل حاسبة المواصلات أو تطبيق 9292.'),
]
NL_FAQ = [
    ('Waar komen de tijden vandaan?', 'Rechtstreeks uit de officiële reisinformatie van NS, ongeveer elke minuut bijgewerkt.'),
    ('Is de prijs echt?', 'Ja, het is de officiële NS-prijs voor een enkele reis 2e klas zonder korting. Met een abonnement of korting betaal je minder.'),
    ('Waarom staat er soms Nederlands?', 'Meldingen van NS (oorzaak, opmerkingen) komen in het Nederlands; we laten ze ongewijzigd om vertaalfouten te voorkomen.'),
    ('Zit de bus en tram erin?', 'Deze tool is voor treinen van NS en andere vervoerders op het spoor. Voor deur-tot-deur met bus en tram gebruik je de OV-reiskosten rekenhulp of 9292.'),
]
AI = {
    'ar': 'أُعدّت هذه الأداة بمساعدة الذكاء الاصطناعي. المعلومات مباشرة من NS؛ تحقق دائماً من شاشات المحطة.',
    'nl': 'Deze tool is gemaakt met hulp van AI. De informatie komt rechtstreeks van NS; let altijd op de borden op het station.',
}


def build(L, body, faq, path, twin):
    lang = L['lang']
    crumbs = (f'<nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="{L["home"]}"><span>{L["home_t"]}</span></a></li>'
              f'<li><a href="{L["tools"]}"><span>{L["tools_t"]}</span></a></li><li aria-current="page"><span>{L["title"]}</span></li></ol></nav>')
    faq_h = 'أسئلة شائعة' if lang == 'ar' else 'Veelgestelde vragen'
    src_h = 'المصادر الرسمية' if lang == 'ar' else 'Bronnen'
    faq_html = f'<section><h2>{faq_h}</h2>' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faq) + '</section>'
    src_html = f'<section><h2>{src_h}</h2><ul>' + ''.join(f'<li><a href="{u}" rel="noopener" target="_blank">{t}</a></li>' for t, u in SOURCES) + '</ul></section>'
    main = (f'<main id="content" class="wrap">{crumbs}<article class="reader"><h1><span>{L["page_title"]}</span></h1>'
            f'<p class="summary"><span>{L["summary"]}</span></p>' + form(L) + body + faq_html + src_html
            + f'<p class="muted"><span>{AI[lang]}</span></p></article></main>')
    url = f'{SITE}/{path}'
    jsonld = [
        {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': L['title'], 'url': url, 'description': L['desc'],
         'applicationCategory': 'TravelApplication', 'operatingSystem': 'Any', 'inLanguage': lang,
         'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'}},
        {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': L['home_t'], 'item': SITE + L['home']},
            {'@type': 'ListItem', 'position': 2, 'name': L['tools_t'], 'item': SITE + L['tools']},
            {'@type': 'ListItem', 'position': 3, 'name': L['title'], 'item': url}]},
    ]
    return page(lang=lang, path=path, twin=twin, title=L['title'], desc=L['desc'], main=main, head_extra=HEAD, jsonld=jsonld)


if __name__ == '__main__':
    print(build(AR, AR_BODY, AR_FAQ, AR_PATH, NL_PATH))
    print(build(NL, NL_BODY, NL_FAQ, NL_PATH, AR_PATH))
