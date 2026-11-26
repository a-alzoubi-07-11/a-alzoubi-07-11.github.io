"""Build the «أرخص ساعات الكهرباء / Stroomprijs vandaag» tool pages (AR + NL).

Run: python3 tools/pages/make_energy_prices.py
Logic: assets/energy-prices.js. Data: assets/energy/nl-prices.json (.github/workflows/energy-prices.yml).
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'stroomprijs-vandaag'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/energy-prices.css?v=1">'
        '<script src="/assets/energy-prices.js?v=1" defer></script>')

SOURCES = [
    ('Energy-Charts (Fraunhofer ISE) · Day-ahead prijzen Nederland (CC BY 4.0, data Bundesnetzagentur | SMARD.de)', 'https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=nl&c=NL'),
    ('Rijksoverheid · Opbouw energierekening (energiebelasting en btw)', 'https://www.rijksoverheid.nl/vraag-en-antwoord/energie-thuis/opbouw-energierekening'),
    ('ACM ConsuWijzer · Tips bij het kiezen van een energieleverancier', 'https://consument.acm.nl/elektriciteit-en-gas/overstappen-vergelijken-en-verhuizen/tips-bij-het-kiezen-van-een-energieleverancier'),
]


def form(L):
    opts = ''.join(f'<option value="{v}"{" selected" if v == 2 else ""}>{t}</option>' for v, t in L['durs'])
    return (
        f'<section id="energy-prices" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        f'<label class="ep-ctl" for="ep-dur"><span>{L["f_dur"]}</span><select id="ep-dur" name="dur">{opts}</select></label>'
        '<div class="ep-out tool-result" role="status" aria-live="polite"></div></section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='أرخص ساعات الكهرباء اليوم',
    page_title='أرخص ساعات الكهرباء اليوم وبكرا في هولندا: متى تشغّل الغسالة والنشافة؟',
    desc='سعر الكهرباء بهولندا لكل ساعة اليوم وبكرا، وأفضل وقت لتشغيل الغسالة والنشافة وشحن السيارة. مفيد لأصحاب عقود الكهرباء الديناميكية، ومحدّث تلقائياً كل يوم.',
    summary='إذا عندك عقد كهرباء ديناميكي (dynamisch contract)، سعر الكهرباء بيتغير كل ربع ساعة. هالأداة بتورجيك السعر الآن، وأسعار اليوم وبكرا، وأرخص وقت لتشغيل الأجهزة حسب المدة اللي بتحتاجها.',
    form_h='أسعار اليوم وبكرا',
    noscript='الأداة تحتاج JavaScript. شوف الأسعار على موقع Energy-Charts.',
    f_dur='كم ساعة يحتاج جهازك؟', durs=[(1, 'ساعة واحدة (غسالة صحون، شحن الموبايل واللابتوب)'), (2, 'ساعتان (غسالة ملابس)'), (3, '3 ساعات (نشافة، شحن سيارة كهربائية)'), (4, '4 ساعات')],
)
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Stroomprijs vandaag: goedkoopste uren',
    page_title='Stroomprijs vandaag en morgen: wanneer zet je de wasmachine en droger aan?',
    desc='De Nederlandse stroomprijs per uur vandaag en morgen, en het beste moment om de wasmachine, droger of auto te laden. Handig bij een dynamisch energiecontract; elke dag automatisch bijgewerkt.',
    summary='Met een dynamisch energiecontract verandert de stroomprijs elk kwartier. Deze tool toont de prijs nu, de prijzen van vandaag en morgen, en het goedkoopste moment voor je apparaat, afhankelijk van hoe lang het draait.',
    form_h='Prijzen vandaag en morgen',
    noscript='Deze tool vraagt JavaScript. Bekijk de prijzen op Energy-Charts.',
    f_dur='Hoe lang draait je apparaat?', durs=[(1, '1 uur (vaatwasser, telefoon en laptop laden)'), (2, '2 uur (wasmachine)'), (3, '3 uur (droger, elektrische auto laden)'), (4, '4 uur')],
)

AR_BODY = '''
<section><h2>كيف تقرأ الأسعار؟</h2>
<ul>
<li><b>سعر السوق:</b> سعر الجملة بسوق اليوم التالي (day-ahead) لهولندا، لكل ربع ساعة. بيتحدد كل يوم حوالي الساعة 1 الظهر لليوم اللي بعده.</li>
<li><b>مع الضرائب:</b> أضفنا ضريبة الطاقة على الكهرباء لعام 2026 (9.161 سنت لكل كيلوواط ساعة بدون ضريبة القيمة المضافة، للشريحة الأولى)، وضريبة القيمة المضافة 21%. ما أضفنا رسوم شركتك، لأنها بتختلف من شركة لشركة.</li>
<li><b>أرخص الأوقات</b> غالباً بالليل، أو بنص النهار بالأيام المشمسة لما في كهربا شمسية كتير. الأغلى عادةً الصبح بكير والمسا بين 5 و8.</li>
<li><b>سعر سالب؟</b> أحياناً بيكون في كهربا أكتر من الطلب، فبيصير السعر تحت الصفر.</li>
</ul>
</section>
<section><h2>بيفرق معي إذا عقدي ثابت؟</h2>
<p>إذا عقدك <b>ثابت (vast)</b> أو <b>متغير (variabel)</b>، بتدفع نفس السعر لكل كيلوواط ساعة بأي وقت، فالساعة ما بتغيّر فاتورتك. بس تشغيل الأجهزة بأوقات الرخص بيساعد الشبكة. إذا عقدك <b>ديناميكي</b>، هالأداة بتوفّر عليك مصاري فعلاً. قبل ما تختار عقد ديناميكي اقرأ <a href="/articles/energy-contracts-saving-2026.html">دليل عقود الطاقة والتوفير</a>، لأن الأسعار ممكن ترتفع كتير بالشتا.</p>
</section>
'''
NL_BODY = '''
<section><h2>Hoe lees je de prijzen?</h2>
<ul>
<li><b>Marktprijs:</b> de groothandelsprijs op de day-aheadmarkt voor Nederland, per kwartier. Die wordt elke dag rond 13.00 uur vastgesteld voor de volgende dag.</li>
<li><b>Met belastingen:</b> we tellen de energiebelasting op elektriciteit van 2026 op (9,161 ct per kWh exclusief btw, eerste schijf) en 21% btw. De vergoeding van je leverancier zit er niet in, want die verschilt per leverancier.</li>
<li><b>Goedkoopst</b> is het vaak ’s nachts, of midden op de dag als er veel zonnestroom is. Duur is het meestal vroeg in de ochtend en ’s avonds tussen 17.00 en 20.00 uur.</li>
<li><b>Negatieve prijs?</b> Soms is er meer stroom dan vraag; dan zakt de prijs onder nul.</li>
</ul>
</section>
<section><h2>Maakt het uit als ik een vast contract heb?</h2>
<p>Met een <b>vast</b> of <b>variabel</b> contract betaal je op elk moment dezelfde prijs per kWh; het tijdstip verandert je rekening niet, maar verbruik op goedkope momenten helpt het net. Met een <b>dynamisch</b> contract bespaar je met deze tool echt geld. Lees vóór je kiest onze <a href="/nl/articles/energy-contracts-saving-2026.html">gids over energiecontracten en besparen</a>, want prijzen kunnen in de winter flink stijgen.</p>
</section>
'''
AR_FAQ = [
    ('من وين جاية الأسعار؟', 'من Energy-Charts التابع لمعهد Fraunhofer ISE، وهي أسعار سوق الكهرباء الهولندي لليوم التالي (day-ahead)، ببيانات الوكالة الألمانية Bundesnetzagentur (منصة SMARD). الموقع بيحدّثها تلقائياً كل يوم.'),
    ('ليش سعري بالفاتورة غير هالسعر؟', 'لأن هالسعر سعر جملة. إذا عقدك ديناميكي بتدفع فوقه ضريبة الطاقة وضريبة القيمة المضافة ورسوم شركتك. وإذا عقدك ثابت أو متغير، سعرك ما بيرتبط بالساعة.'),
    ('متى بتنزل أسعار بكرا؟', 'عادةً بعد الساعة 1 الظهر بتوقيت هولندا، والموقع بيجيبها تلقائياً بعدها بشوي.'),
    ('شو هو العقد الديناميكي؟', 'عقد سعره بيتغير مع سعر السوق كل ربع ساعة أو كل ساعة. ممكن يوفّر إذا استهلكت بأوقات الرخص، بس ممكن يكون غالي بأوقات الذروة وبالشتا.'),
    ('كم بوفّر إذا شغلت الغسالة بالوقت الأرخص؟', 'الأداة بتحسب الفرق بين أرخص وأغلى وقت بنفس المدة لكل كيلوواط ساعة. غسلة واحدة بتستهلك عادةً حوالي كيلوواط ساعة واحد أو أكتر حسب الحرارة والجهاز.'),
]
NL_FAQ = [
    ('Waar komen de prijzen vandaan?', 'Van Energy-Charts van Fraunhofer ISE: de day-aheadprijzen voor Nederland, met data van de Bundesnetzagentur (SMARD). De site werkt ze elke dag automatisch bij.'),
    ('Waarom wijkt mijn prijs op de rekening af?', 'Dit is de groothandelsprijs. Met een dynamisch contract betaal je daarbovenop energiebelasting, btw en de vergoeding van je leverancier. Met een vast of variabel contract hangt je prijs niet af van het uur.'),
    ('Wanneer verschijnen de prijzen van morgen?', 'Meestal na 13.00 uur Nederlandse tijd; de site haalt ze kort daarna automatisch op.'),
    ('Wat is een dynamisch contract?', 'Een contract waarvan de prijs per kwartier of per uur meebeweegt met de markt. Het kan voordelig zijn als je op goedkope momenten verbruikt, maar duur in piekuren en in de winter.'),
    ('Hoeveel bespaar ik met de wasmachine op het goedkoopste moment?', 'De tool toont het verschil per kWh tussen het goedkoopste en duurste moment van dezelfde duur. Eén wasbeurt verbruikt vaak ongeveer één kWh of meer, afhankelijk van temperatuur en apparaat.'),
]
AI = {
    'ar': 'أُعدّت هذه الأداة بمساعدة الذكاء الاصطناعي. الأسعار من Energy-Charts (رخصة CC BY 4.0) وتُحدَّث تلقائياً؛ هي أسعار سوق تقديرية وليست فاتورتك.',
    'nl': 'Deze tool is gemaakt met hulp van AI. De prijzen komen van Energy-Charts (licentie CC BY 4.0) en worden automatisch bijgewerkt; het zijn marktprijzen, niet je rekening.',
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
