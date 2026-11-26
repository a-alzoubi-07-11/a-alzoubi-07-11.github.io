"""Build the «العطل المدرسية / Schoolvakanties» tool pages (AR + NL).

Run: python3 tools/pages/make_holiday_data.py && python3 tools/pages/make_schoolvakanties.py
Logic: assets/schoolvakanties.js. Data: assets/schoolvakanties.json.
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'schoolvakanties'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/schoolvakanties.css?v=1">'
        '<script src="/assets/schoolvakanties.js?v=1" defer></script>')

SOURCES = [
    ('Rijksoverheid · Overzicht schoolvakanties per schooljaar', 'https://www.rijksoverheid.nl/themas/onderwijs/schoolvakanties/overzicht-schoolvakanties-per-schooljaar'),
    ('Rijksoverheid · Regio’s schoolvakantie (provincies en gemeenten)', 'https://www.rijksoverheid.nl/themas/onderwijs/schoolvakanties/regios-schoolvakantie'),
    ('Rijksoverheid open data · Schoolvakanties (CC0 1.0)', 'https://opendata.rijksoverheid.nl/v1/infotypes/schoolholidays?output=json'),
    ('Rijksoverheid · Mag ik mijn kind meenemen op vakantie buiten de schoolvakantie?', 'https://www.rijksoverheid.nl/themas/onderwijs/leerplicht/vraag-en-antwoord/leerplicht/leerplicht-schoolvakanties'),
    ('Rijksoverheid · Geoorloofd schoolverzuim en spijbelen', 'https://www.rijksoverheid.nl/themas/onderwijs/leerplicht/geoorloofd-schoolverzuim-en-spijbelen'),
]


def form(L):
    regs = ''.join(f'<button type="button" class="sv-r" data-r="{r}">{t}<small>{s}</small></button>' for r, t, s in L['regs'])
    return (
        f'<section id="schoolvakanties" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        f'<div class="sv-pick" hidden><p class="sv-or">{L["pick"]}</p><div class="sv-regions">{regs}</div>'
        f'<p class="sv-or"><label for="sv-g">{L["or"]}</label></p><form autocomplete="off">'
        f'<input id="sv-g" name="g" list="sv-gem" dir="ltr" placeholder="{L["gem_ph"]}" enterkeyhint="search">'
        f'<datalist id="sv-gem"></datalist><button class="tool-button" type="submit">{L["go"]}</button></form>'
        f'<button type="button" class="tool-button secondary sv-loc">📍 {L["loc"]}</button></div>'
        '<div class="tool-result" role="status" aria-live="polite"></div></section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='العطل المدرسية في هولندا',
    page_title='العطل المدرسية في هولندا 2026–2027 حسب بلديتك: متى العطلة الجاية؟',
    desc='مواعيد العطل المدرسية بهولندا حسب منطقتك (شمال، وسط، جنوب): العطلة الجاية وكم يوم باقي، جدول السنة الدراسية كاملة حتى 2030، وزر لإضافتها لتقويم الموبايل. من بيانات الحكومة الهولندية.',
    summary='هولندا مقسومة لثلاث مناطق للعطل المدرسية، وكل منطقة إلها مواعيد مختلفة لبعض العطل. اختر منطقتك أو اكتب اسم بلديتك، وبتطلعلك العطلة الجاية وكم يوم باقي، وكل مواعيد السنة، وبتقدر تضيفها لتقويم موبايلك بكبسة. الموقع بيتذكر اختيارك، فالمرة الجاية بتشوف النتيجة فوراً.',
    form_h='اختر منطقتك',
    noscript='الأداة تحتاج JavaScript. شوف المواعيد على موقع Rijksoverheid.',
    pick='كبسة وحدة: وين ساكن؟', gem_l='اسم البلدية', gem_ph='اسم بلديتك، مثل Utrecht', go='اعرض', loc='حدد بلديتي من موقعي',
    regs=[('noord', 'الشمال', 'أمستردام، غرونينغن، زفوله'), ('midden', 'الوسط', 'روتردام، لاهاي، أوترخت'), ('zuid', 'الجنوب', 'أيندهوفن، ماستريخت، نايميخن')],
)
AR['or'] = 'أو اكتب اسم بلديتك (إذا ما متأكد من منطقتك):'
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Schoolvakanties per regio',
    page_title='Schoolvakanties 2026–2027 per gemeente: wanneer is de volgende vakantie?',
    desc='De schoolvakanties in jouw regio (Noord, Midden, Zuid): de volgende vakantie met aftelling, het hele schooljaar tot 2030 en een agendabestand voor je telefoon. Op basis van open data van de Rijksoverheid.',
    summary='Nederland heeft drie regio’s voor schoolvakanties, met deels verschillende data. Kies je regio of typ je gemeente en je ziet de volgende vakantie, hoeveel dagen het nog duurt en alle data van het schooljaar. Met één tik zet je ze in je agenda. Je keuze wordt onthouden, dus de volgende keer zie je het meteen.',
    form_h='Kies je regio',
    noscript='Deze tool vraagt JavaScript. Bekijk de data op Rijksoverheid.nl.',
    pick='Eén tik: waar woon je?', gem_l='Gemeente', gem_ph='Je gemeente, bijvoorbeeld Utrecht', go='Toon', loc='Zoek mijn gemeente via mijn locatie',
    regs=[('noord', 'Noord', 'Amsterdam, Groningen, Zwolle'), ('midden', 'Midden', 'Rotterdam, Den Haag, Utrecht'), ('zuid', 'Zuid', 'Eindhoven, Maastricht, Nijmegen')],
)
NL['or'] = 'Of typ je gemeente (als je je regio niet zeker weet):'

AR_BODY = '''
<section><h2>شو يعني المواعيد «ملزمة» و«مُوصى بها»؟</h2>
<ul>
<li><b>العطلة الصيفية وعطلة الميلاد:</b> مواعيدها ملزمة لكل المدارس حسب المنطقة.</li>
<li><b>عطلة الخريف وعطلة الربيع والأسبوع التاني من عطلة أيار:</b> وزارة التعليم بتعطي مواعيد مُوصى بها بس، والمدرسة مسموحلها تختار أيام تانية. لهيك الوزارة بتنصح تسأل مدرسة ابنك عن أيام العطلة الفعلية.</li>
<li>كمان كل مدرسة إلها أيام عطلة خاصة (studiedagen) ما بتظهر بهالجدول. شوف رزنامة المدرسة أو تطبيقها.</li>
</ul>
</section>
<section><h2>بقدر آخد ولادي إجازة خارج العطل المدرسية؟</h2>
<p>إذا ابنك بعمر التعليم الإلزامي (leerplicht)، <b>ما مسموح</b> تاخده إجازة خارج العطل المدرسية، وممكن تاخد غرامة. الاستثناء الوحيد إذا شغلك ما بيسمحلك تطلع بأي عطلة مدرسية بالسنة كلها بسبب طبيعة مهنتك (مثلاً شغل موسمي). وقتها بتطلب الإذن من مدير المدرسة قبل 8 أسابيع على الأقل، والمدير بيقدر يعطي لحد 10 أيام بالسنة الدراسية، مرة وحدة بالسنة، ولازم تثبت إنك ما بتقدر تطلع بالعطل.</p>
<p><b>الأعياد الدينية</b> (مثل عيد الفطر وعيد الأضحى) من أسباب الغياب المسموح. بتطلب الإذن من مدير المدرسة حسب شروط المدرسة، فاحكي معهم قبل العيد بوقت كافي. اقرأ كمان <a href="/articles/dutch-school-system-basisschool.html">دليل نظام المدارس الابتدائية</a>.</p>
</section>
<section><h2>كيف بضيف العطل للتقويم؟</h2>
<p>بعد ما تختار منطقتك، اكبس «أضف العطل لتقويم موبايلك». بينزل ملف صغير (.ics). افتحه على الآيفون أو الأندرويد، وبتنضاف كل العطل الجاية لتقويمك مرة وحدة.</p>
</section>
'''
NL_BODY = '''
<section><h2>Wat betekenen «verplicht» en «adviesdatum»?</h2>
<ul>
<li><b>Zomervakantie en kerstvakantie:</b> deze data zijn verplicht voor alle scholen in de regio.</li>
<li><b>Herfstvakantie, voorjaarsvakantie en de extra week meivakantie:</b> het ministerie van OCW geeft alleen adviesdata. Scholen mogen daarvan afwijken; het ministerie adviseert om bij de school na te vragen wanneer die dicht is.</li>
<li>Scholen hebben daarnaast eigen vrije dagen (studiedagen) die niet in deze tabel staan. Kijk in de schoolkalender of de app van de school.</li>
</ul>
</section>
<section><h2>Mag ik mijn kind meenemen op vakantie buiten de schoolvakantie?</h2>
<p>Is je kind leerplichtig, dan mag dat <b>niet</b> en kun je een boete krijgen. Alleen als je door de specifieke aard van je beroep in geen enkele schoolvakantie weg kunt (bijvoorbeeld seizoenswerk), kun je toestemming vragen aan de directeur van de school, 8 weken of eerder van tevoren. De directeur mag maximaal 10 dagen per schooljaar vrij geven, één keer per schooljaar, en je moet aantonen dat je in de schoolvakanties niet weg kunt.</p>
<p>Een <b>religieuze feestdag</b> (zoals het Suikerfeest of Offerfeest) is een geldige reden voor verlof. Vraag dit tijdig aan bij de directeur, volgens de regels van de school. Zie ook onze <a href="/nl/articles/dutch-school-system-basisschool.html">gids over de basisschool</a>.</p>
</section>
<section><h2>Hoe zet ik de vakanties in mijn agenda?</h2>
<p>Kies je regio en tik op «Zet de vakanties in je agenda». Er wordt een klein bestand (.ics) gedownload. Open het op je iPhone of Android-telefoon en alle komende vakanties staan in één keer in je agenda.</p>
</section>
'''
AR_FAQ = [
    ('بأي منطقة أنا؟', 'الشمال: درنته، فريسلاند، غرونينغن، شمال هولندا، أوفرآيسل، فليفولاند (ما عدا Zeewolde)، وكمان Hattem وEemnes. الوسط: جنوب هولندا، أوترخت (ما عدا Eemnes)، Zeewolde وقسم من خيلدرلاند. الجنوب: زيلاند، ليمبورخ، شمال برابانت والقسم التاني من خيلدرلاند. إذا مش متأكد، اكتب اسم بلديتك بالأداة.'),
    ('بلديتي مقسومة بين منطقتين، شو أعمل؟', 'في أربع بلديات مقسومة: Montferland (منطقة Didam بالجنوب)، Neder-Betuwe (منطقة Dodewaard بالجنوب)، Altena (Woudrichem وSleeuwijk وNieuwendijk وWerkendam بالوسط) وDe Ronde Venen (منطقة Abcoude بالشمال). الأداة بتنبهك، وبتقدر تختار المنطقة الصح بالأزرار.'),
    ('ليش مدرسة ابني عطلتها غير هالموعد؟', 'لأن عطلة الخريف والربيع والأسبوع التاني من عطلة أيار مواعيد مُوصى بها بس، والمدرسة بتقدر تغيّرها. العطلة الصيفية وعطلة الميلاد ملزمة.'),
    ('لحد أي سنة المواعيد منشورة؟', 'الحكومة نشرت المواعيد لحد السنة الدراسية 2029–2030. بنحدّث البيانات لما تنشر سنوات جديدة.'),
    ('بقدر آخد ولادي إجازة قبل العطلة بأسبوع؟', 'لا، إذا ابنك بعمر التعليم الإلزامي. الاستثناء بس إذا شغلك ما بيسمحلك تطلع بأي عطلة مدرسية، وبتطلب إذن من المدير قبل 8 أسابيع، لحد 10 أيام بالسنة.'),
    ('بيعطوا ولادنا إجازة بالعيد؟', 'الأعياد الدينية من أسباب الغياب المسموح. بتطلب الإذن من مدير المدرسة حسب شروطها، فخبّرهم بكير.'),
    ('الموقع بيحفظ عنواني؟', 'لا. الموقع بيتذكر بس المنطقة اللي اخترتها بمتصفحك أنت. إذا استعملت «حدد بلديتي من موقعي»، الموقع بيرسل الإحداثيات لخدمة العناوين الحكومية PDOK حتى يعرف البلدية، وما بيخزنها.'),
]
NL_FAQ = [
    ('In welke regio woon ik?', 'Noord: Drenthe, Friesland, Groningen, Noord-Holland, Overijssel, Flevoland (behalve Zeewolde), plus Hattem en Eemnes. Midden: Zuid-Holland, Utrecht (behalve Eemnes), Zeewolde en een deel van Gelderland. Zuid: Zeeland, Limburg, Noord-Brabant en het andere deel van Gelderland. Twijfel je, typ dan je gemeente in de tool.'),
    ('Mijn gemeente valt in twee regio’s. Wat nu?', 'Vier gemeenten zijn verdeeld: Montferland (Didam in Zuid), Neder-Betuwe (Dodewaard in Zuid), Altena (Woudrichem, Sleeuwijk, Nieuwendijk en Werkendam in Midden) en De Ronde Venen (Abcoude in Noord). De tool waarschuwt je; kies dan zelf de juiste regio met de knoppen.'),
    ('Waarom heeft de school van mijn kind andere data?', 'Herfst-, voorjaars- en de extra week meivakantie zijn adviesdata; scholen mogen afwijken. Zomer- en kerstvakantie zijn verplicht.'),
    ('Tot welk jaar zijn de data bekend?', 'De Rijksoverheid heeft de data gepubliceerd tot en met schooljaar 2029–2030. We werken de gegevens bij zodra er nieuwe jaren verschijnen.'),
    ('Mag ik een week eerder op vakantie?', 'Niet als je kind leerplichtig is. Alleen als je door je beroep in geen enkele schoolvakantie weg kunt, kun je 8 weken vooraf toestemming vragen aan de directeur, voor maximaal 10 dagen per schooljaar.'),
    ('Krijgt mijn kind vrij voor het Suikerfeest of Offerfeest?', 'Een religieuze feestdag is een geldige reden voor verlof. Vraag het tijdig aan bij de directeur, volgens de regels van de school.'),
    ('Slaat de site mijn adres op?', 'Nee. Alleen je gekozen regio wordt in je eigen browser onthouden. Gebruik je «Zoek mijn gemeente via mijn locatie», dan gaan de coördinaten naar de overheidsdienst PDOK om de gemeente te vinden; de site bewaart ze niet.'),
]
AI = {
    'ar': 'راجع الناشر أحمد الزعبي هذه الأداة ومصادر بياناتها. المواعيد من البيانات الرسمية، وأيام عطلة مدرستك الفعلية ممكن تختلف.',
    'nl': 'De uitgever Ahmad Alzoubi heeft deze tool en de databronnen gecontroleerd. De data komen uit officiële open data; de vrije dagen van jouw school kunnen afwijken.',
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
         'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Any', 'inLanguage': lang,
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
