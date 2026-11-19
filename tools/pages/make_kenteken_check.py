"""Build the kentekencheck tool pages (AR + NL).

Run: python3 tools/pages/make_kenteken_check.py
Writes calculators/kenteken-check.html and nl/calculators/kenteken-check.html.
Logic: assets/kenteken-check.js (RDW Open Data, public domain, no key).
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'kenteken-check'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/kenteken-check.css?v=1">'
        '<link rel="preconnect" href="https://opendata.rdw.nl" crossorigin>'
        '<script src="/assets/kenteken-check.js?v=1" defer></script>')

SOURCES = [
    ('RDW Open Data · Gekentekende voertuigen', 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2'),
    ('RDW Open Data · Terugroepacties', 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Terugroep_actie_status/t49b-isb7'),
    ('RDW Open Data · Geconstateerde gebreken (APK)', 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Geconstateerde-Gebreken/a34c-vvps'),
    ('RDW · Online voertuiginformatie (OVI)', 'https://ovi.rdw.nl/'),
    ('Belastingdienst · Motorrijtuigenbelasting berekenen', 'https://www.belastingdienst.nl/mrb-berekenen'),
    ('Milieuzones in Nederland', 'https://www.milieuzones.nl/'),
]


def form(L):
    return (
        f'<section id="kenteken-check" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        '<form novalidate autocomplete="off">'
        f'<label for="kc-plate"><span><b>{L["f_plate"]}</b></span></label>'
        '<div class="kc-input" dir="ltr"><span aria-hidden="true">NL</span>'
        f'<input id="kc-plate" name="plate" type="text" inputmode="text" autocapitalize="characters" spellcheck="false" maxlength="10" placeholder="GX-232-F" required aria-describedby="kc-help"></div>'
        f'<p id="kc-help" class="muted"><span>{L["help"]}</span></p>'
        f'<button class="tool-button primary" type="submit"><span>{L["btn"]}</span></button>'
        '</form><div class="tool-result" role="status" aria-live="polite"></div>'
        f'<p class="muted"><span>{L["privacy"]}</span></p></section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='فحص السيارة من رقم اللوحة',
    page_title='فحص السيارة من رقم اللوحة في هولندا: الفحص الدوري والعداد والاستدعاءات قبل الشراء',
    desc='اكتب رقم لوحة أي سيارة هولندية فتعرف بالعربي: موعد انتهاء الفحص الدوري APK، هل العداد منطقي، هل يوجد استدعاء مفتوح، هل هي مؤمّنة أو مستوردة أو كانت تاكسي، وسجل العيوب. مجاناً من بيانات RDW الرسمية.',
    summary='تشتري سيارة مستعملة؟ اكتب رقم اللوحة فقط، فنعرض لك من السجل الرسمي لـ RDW أهم ما يجب معرفته قبل الدفع: الفحص الدوري، حكم العداد، الاستدعاءات، التأمين، الاستيراد، وسجل العيوب في الفحوصات.',
    form_h='افحص السيارة',
    noscript='الأداة تحتاج JavaScript. يمكنك استخدام الفحص الرسمي على موقع RDW.',
    f_plate='رقم اللوحة (kenteken)', help='اكتب الأحرف والأرقام كما على اللوحة الصفراء، مع أو بدون الشرطات.',
    btn='افحص الآن',
    privacy='رقم اللوحة يُرسل فقط إلى موقع RDW الحكومي. لا نحفظ أي شيء، ولا نعرض اسم المالك (هذه المعلومة غير متاحة للعامة).',
)
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Kentekencheck',
    page_title='Kentekencheck: APK, tellerstand en terugroepacties controleren voordat u een auto koopt',
    desc='Vul een Nederlands kenteken in en zie direct: wanneer de APK verloopt, of de tellerstand logisch is, of er een terugroepactie openstaat, of het voertuig verzekerd, geïmporteerd of een taxi is, en de APK-gebreken. Gratis, uit de officiële RDW-gegevens.',
    summary='Koopt u een tweedehands auto? Vul alleen het kenteken in. U ziet uit het officiële RDW-register wat u moet weten voordat u betaalt: APK, telleroordeel, terugroepacties, verzekering, import en gebreken bij keuringen.',
    form_h='Controleer het voertuig',
    noscript='Deze check vraagt JavaScript. Gebruik anders de officiële check van de RDW.',
    f_plate='Kenteken', help='Typ de letters en cijfers zoals op de gele plaat, met of zonder streepjes.',
    btn='Nu controleren',
    privacy='Het kenteken gaat alleen naar de RDW. We bewaren niets en tonen geen eigenaar (die gegevens zijn niet openbaar).',
)

AR_BODY = '''
<section><h2>ماذا تعني كل نتيجة؟</h2>
<ul>
<li><b>الفحص الدوري APK:</b> فحص إلزامي للسلامة. السيارة التي انتهى فحصها لا يجوز قيادتها، والغرامة عالية. اسأل البائع أن يجدّده قبل البيع.</li>
<li><b>حكم العداد (tellerstand):</b> RDW تقارن قراءات العداد عبر السنين. «منطقي» يعني أن كل قراءة أعلى من التي قبلها. «غير منطقي» إنذار قوي بأن العداد رُجّع.</li>
<li><b>الاستدعاء (terugroepactie):</b> عيب أعلنته الشركة المصنّعة. الإصلاح عند الوكيل مجاني، لكن تأكد أنه تم قبل الشراء.</li>
<li><b>التأمين (WAM):</b> يبيّن إذا كانت السيارة مؤمّنة الآن عند المالك الحالي. أنت تحتاج تأمينك الخاص من يوم نقل الملكية.</li>
<li><b>مستوردة:</b> إذا كان أول تسجيل في العالم قبل أول تسجيل في هولندا بفترة، فالسيارة جاءت من الخارج وتاريخ عدادها هناك غير معروف.</li>
<li><b>تاكسي وتصدير:</b> سيارة التاكسي تمشي كيلومترات كثيرة، والسيارة المسجّلة للتصدير قد لا تُنقل باسمك.</li>
</ul>
<p>البيانات العامة لا تُظهر الحوادث أو الأضرار أو إذا كانت السيارة مرهونة بقرض. للسيارات الغالية اطلب فحصاً عند ورشة مستقلة أو من ANWB.</p>
</section>
<section><h2>كيف تنقل ملكية السيارة باسمك؟</h2>
<ol>
<li>اذهب أنت والبائع معاً إلى مكتب بريد فيه خدمة RDW أو إلى تاجر سيارات معتمد، مع بطاقة الهوية ووثيقة التسجيل (بطاقة التسجيل وكود نقل الملكية).</li>
<li>يُنقل التسجيل باسمك فوراً، ويحصل البائع على إثبات نقل الملكية (vrijwaringsbewijs). من هذه اللحظة أنت المسؤول عن الغرامات والضريبة.</li>
<li>أمّن السيارة باسمك قبل أن تقودها. القيادة بدون تأمين ممنوعة وغرامتها كبيرة.</li>
<li>ضريبة الطريق تبدأ تلقائياً، وتصلك رسالة من Belastingdienst.</li>
</ol>
</section>
'''

NL_BODY = '''
<section><h2>Wat betekent elke uitkomst?</h2>
<ul>
<li><b>APK:</b> verplichte veiligheidskeuring. Met een verlopen APK mag u niet rijden en de boete is hoog. Vraag de verkoper de APK vóór de verkoop te vernieuwen.</li>
<li><b>Telleroordeel:</b> de RDW vergelijkt de tellerstanden over de jaren. «Logisch» betekent dat elke stand hoger is dan de vorige. «Onlogisch» is een sterk signaal dat de teller is teruggedraaid.</li>
<li><b>Terugroepactie:</b> een defect dat de fabrikant heeft gemeld. Herstel bij de dealer is gratis, maar controleer dat het is gebeurd voordat u koopt.</li>
<li><b>WAM-verzekering:</b> laat zien of het voertuig nu bij de huidige eigenaar verzekerd is. U hebt vanaf de overschrijving uw eigen verzekering nodig.</li>
<li><b>Import:</b> ligt de eerste toelating ruim vóór de eerste tenaamstelling in Nederland, dan komt het voertuig uit het buitenland en is de tellerstand daar onbekend.</li>
<li><b>Taxi en export:</b> een taxi rijdt veel kilometers; een voertuig dat voor export staat geregistreerd, kunt u mogelijk niet op uw naam zetten.</li>
</ul>
<p>Openbare gegevens tonen geen ongelukken, schade of een lening op het voertuig. Laat een duurdere auto keuren door een onafhankelijke garage of de ANWB.</p>
</section>
<section><h2>Hoe zet u een auto op uw naam?</h2>
<ol>
<li>Ga samen met de verkoper naar een postkantoor met RDW-service of een erkend autobedrijf, met uw ID en het kentekenbewijs (kentekencard en tenaamstellingscode).</li>
<li>De auto staat direct op uw naam en de verkoper krijgt een vrijwaringsbewijs. Vanaf dat moment bent u verantwoordelijk voor boetes en belasting.</li>
<li>Verzeker de auto op uw naam voordat u gaat rijden. Rijden zonder verzekering is verboden en de boete is hoog.</li>
<li>De motorrijtuigenbelasting start automatisch; u krijgt bericht van de Belastingdienst.</li>
</ol>
</section>
'''

AR_FAQ = [
    ('هل الفحص مجاني؟', 'نعم. نقرأ البيانات المفتوحة من RDW مباشرة، بدون تسجيل وبدون رسوم.'),
    ('هل أستطيع معرفة اسم صاحب السيارة؟', 'لا. اسم المالك وعنوانه غير متاحين للعامة في هولندا. تظهر فقط معلومات السيارة نفسها.'),
    ('هل يظهر إذا كانت السيارة عملت حادثاً؟', 'لا. بيانات RDW العامة لا تحتوي الحوادث أو الأضرار. اطلب فحصاً عند ورشة مستقلة قبل شراء سيارة غالية.'),
    ('العداد «غير منطقي»، ماذا أفعل؟', 'لا تشترِ قبل أن يشرح البائع السبب بفواتير وإثباتات. شراء سيارة بعداد مُرجَّع يعني أنك تدفع أكثر من قيمتها.'),
    ('هل يعمل للدراجات النارية والسكوترات والمقطورات؟', 'نعم، لكل مركبة لها لوحة هولندية مسجّلة عند RDW.'),
]
NL_FAQ = [
    ('Is de check gratis?', 'Ja. We lezen de open data van de RDW rechtstreeks, zonder registratie en zonder kosten.'),
    ('Kan ik zien wie de eigenaar is?', 'Nee. Naam en adres van de eigenaar zijn in Nederland niet openbaar. U ziet alleen gegevens over het voertuig.'),
    ('Zie ik of de auto schade heeft gehad?', 'Nee. De openbare RDW-gegevens bevatten geen ongelukken of schade. Laat een duurdere auto keuren door een onafhankelijke garage.'),
    ('De tellerstand is «onlogisch», wat nu?', 'Koop pas als de verkoper de reden met facturen en bewijzen uitlegt. Met een teruggedraaide teller betaalt u te veel.'),
    ('Werkt het ook voor motoren, scooters en aanhangers?', 'Ja, voor elk voertuig met een Nederlands kenteken dat bij de RDW geregistreerd is.'),
]
AI = {
    'ar': 'أُعدّت هذه الأداة بمساعدة الذكاء الاصطناعي، والبيانات تأتي مباشرة من سجل RDW المفتوح. النتيجة معلومات عامة وليست تقرير فحص فني.',
    'nl': 'Deze check is gemaakt met hulp van AI; de gegevens komen rechtstreeks uit het open RDW-register. De uitkomst is openbare informatie, geen technisch keuringsrapport.',
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
