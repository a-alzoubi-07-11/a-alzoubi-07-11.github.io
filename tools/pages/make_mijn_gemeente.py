"""Build the «بلديتي / Mijn gemeente» tool pages (AR + NL).

Run: python3 tools/pages/make_mijn_gemeente.py
Writes calculators/mijn-gemeente.html and nl/calculators/mijn-gemeente.html.
Logic: assets/mijn-gemeente.js. Data: assets/gemeenten.json (tools/pages/make_gemeente_data.py), assets/ov/rail.json.
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'mijn-gemeente'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/mijn-gemeente.css?v=1">'
        '<link rel="preconnect" href="https://api.pdok.nl" crossorigin>'
        '<script src="/assets/mijn-gemeente.js?v=1" defer></script>')

SOURCES = [
    ('Organisaties.overheid.nl · Gemeenten (contactgegevens, CC0)', 'https://organisaties.overheid.nl/Gemeenten/'),
    ('PDOK · Locatieserver (adressen en gemeentecode)', 'https://www.pdok.nl/introductie/-/article/pdok-locatieserver'),
    ('Rijksoverheid · Wanneer moet ik mij inschrijven in de BRP?', 'https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/privacy-en-persoonsgegevens/wanneer-in-brp-inschrijven'),
    ('Rijksoverheid · Hoe kan ik mijn verhuizing doorgeven aan de gemeente?', 'https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/gemeenten/hoe-kan-ik-mijn-verhuizing-doorgeven-aan-de-gemeente'),
    ('Juridisch Loket · Gratis juridisch advies', 'https://www.juridischloket.nl/'),
    ('VluchtelingenWerk Nederland', 'https://www.vluchtelingenwerk.nl/'),
]


def form(L):
    return (
        f'<section id="mijn-gemeente" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        '<form novalidate autocomplete="off">'
        f'<label for="mg-q"><span>{L["f_q"]}</span><input id="mg-q" name="q" type="text" maxlength="100" placeholder="{L["ph"]}" required></label>'
        f'<button class="tool-button primary" type="submit"><span>{L["btn"]}</span></button>'
        '</form><div class="tool-result" role="status" aria-live="polite"></div>'
        f'<p class="muted"><span>{L["privacy"]}</span></p></section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='بلديتي: كل شي عن بلديتك من رمزك البريدي',
    page_title='بلديتي: اكتب رمزك البريدي فتعرف بلديتك وعنوانها وتلفونها، وأقرب محطة، وخطة أول 30 يوم',
    desc='للقادمين الجدد واللاجئين في هولندا: اكتب رمزك البريدي أو عنوانك فتعرف بلديتك وعنوانها وتلفونها وموقعها، وأقرب محطات القطار، وخطة أول 30 يوم بالعربي، والمساعدات اللي فيك تسأل عنها بلديتك.',
    summary='وصلت على بيت جديد أو بلدية جديدة؟ اكتب رمزك البريدي بس. بتعرف بلديتك وكيف تتواصل معها، وأقرب محطة قطار، وشو لازم تعمل بأول 30 يوم خطوة بخطوة، وأي مساعدات فيك تطلبها من البلدية.',
    form_h='اعرف بلديتك',
    noscript='الأداة تحتاج JavaScript. ابحث عن بلديتك على organisaties.overheid.nl.',
    f_q='رمزك البريدي أو عنوانك', ph='مثلاً 3511 AB 10 أو Utrecht', btn='اعرض بلديتي',
    privacy='العنوان يُرسل فقط إلى خدمة العناوين الحكومية PDOK. لا نحفظ أي شيء.',
)
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Mijn gemeente: alles over je gemeente vanaf je postcode',
    page_title='Mijn gemeente: vul je postcode in en zie je gemeente, adres en telefoon, het dichtstbijzijnde station en een plan voor de eerste 30 dagen',
    desc='Voor nieuwkomers en statushouders: vul je postcode of adres in en zie je gemeente met adres, telefoon en website, de dichtstbijzijnde treinstations, een plan voor de eerste 30 dagen en regelingen om naar te vragen.',
    summary='Net verhuisd of nieuw in een gemeente? Vul alleen je postcode in. Je ziet je gemeente en hoe je contact opneemt, het dichtstbijzijnde station, wat je in de eerste 30 dagen regelt en naar welke regelingen je bij de gemeente kunt vragen.',
    form_h='Vind je gemeente',
    noscript='Deze tool vraagt JavaScript. Zoek je gemeente op organisaties.overheid.nl.',
    f_q='Je postcode of adres', ph='Bijvoorbeeld 3511 AB 10 of Utrecht', btn='Toon mijn gemeente',
    privacy='Je adres gaat alleen naar de adresservice van de overheid (PDOK). We bewaren niets.',
)

AR_BODY = '''
<section><h2>ليش البلدية مهمة لهالدرجة؟</h2>
<p>البلدية (gemeente) هي أقرب جهة حكومية إلك. عندها بتسجّل عنوانك وبتاخد رقم المواطن (BSN)، ومنها بتطلب المساعدة المالية (bijstand) والمساعدة الخاصة (bijzondere bijstand) والإعفاء من ضرائب البلدية. وهي اللي بتعمللك خطة الاندماج (inburgering)، وبتساعدك بالديون وبالسكن والمساعدة بالبيت. كل بلدية إلها قواعدها ومبالغها، عشان هيك مهم تعرف بلديتك بالضبط.</p>
<ul>
<li><b>الرقم 14 + رمز المنطقة:</b> كتير بلديات إلها رقم عام بيبلّش بـ14، متل 14 020 لأمستردام. بتتصل فيه من أي تلفون بهولندا.</li>
<li><b>الموعد:</b> أغلب الخدمات بالبلدية بدها موعد مسبق. احجزه من موقع البلدية أو بالتلفون.</li>
<li><b>الرسائل:</b> رسائل البلدية بتوصل بالبريد أو على صندوق رسائل الحكومة (Berichtenbox). فوت عليه مرة بالأسبوع.</li>
</ul>
</section>
<section><h2>إذا انتقلت من مركز اللجوء لبيت</h2>
<ol>
<li>سجّل عنوانك الجديد بالبلدية الجديدة خلال 5 أيام من الانتقال.</li>
<li>غيّر عنوانك عند التأمين الصحي والبنك، وتحقق من البدلات (Toeslagen).</li>
<li>اسأل البلدية عن الإعفاء من الضرائب والمساعدات لأصحاب الدخل القليل.</li>
<li>سجّل عند طبيب عائلة قريب من بيتك الجديد.</li>
</ol>
<p>التفاصيل خطوة بخطوة بـ<a href="/articles/change-address-netherlands.html">دليل تغيير العنوان</a>، وكل أدلة اللجوء بـ<a href="/articles/asylum-residence-hub.html">مركز أدلة اللجوء والإقامة</a>.</p>
</section>
'''

NL_BODY = '''
<section><h2>Waarom je gemeente zo belangrijk is</h2>
<p>De gemeente is de overheid die het dichtst bij je staat. Daar schrijf je je adres in en krijg je je BSN, vraag je bijstand, bijzondere bijstand en kwijtschelding van gemeentelijke belastingen aan, maakt de gemeente je inburgeringsplan en helpt ze bij schulden, wonen en hulp thuis. Elke gemeente heeft eigen regels en bedragen, dus het is belangrijk dat je weet welke gemeente de jouwe is.</p>
<ul>
<li><b>14 + netnummer:</b> veel gemeenten hebben een algemeen nummer dat met 14 begint, zoals 14 020 voor Amsterdam. Je belt het vanaf elke telefoon in Nederland.</li>
<li><b>Afspraak:</b> voor de meeste balies heb je een afspraak nodig. Maak die via de website of telefonisch.</li>
<li><b>Post:</b> brieven van de gemeente komen per post of in je Berichtenbox. Kijk daar wekelijks.</li>
</ul>
</section>
<section><h2>Van het azc naar een eigen woning</h2>
<ol>
<li>Schrijf je binnen 5 dagen na de verhuizing in op je nieuwe adres bij de nieuwe gemeente.</li>
<li>Geef je nieuwe adres door aan je zorgverzekeraar en bank en controleer je toeslagen.</li>
<li>Vraag de gemeente naar kwijtschelding en minimaregelingen.</li>
<li>Schrijf je in bij een huisarts dicht bij je nieuwe woning.</li>
</ol>
<p>Stap voor stap: <a href="/nl/articles/change-address-netherlands.html">verhuizen en adres wijzigen</a>, en alle gidsen over asiel in de <a href="/nl/articles/asylum-residence-hub.html">hub asiel en verblijf</a>.</p>
</section>
'''

AR_FAQ = [
    ('كيف بعرف لأي بلدية بتبع؟', 'اكتب رمزك البريدي بالأداة. الحكومة بتربط كل عنوان ببلدية وحدة، والأداة بتقرأها من خدمة العناوين الحكومية.'),
    ('شو الرقم 14 اللي بيطلع؟', 'هو الرقم العام لكتير بلديات: 14 مع رمز المنطقة، متل 14 030 لأوترخت. بتتصل فيه من أي تلفون بهولندا.'),
    ('هل المساعدات نفسها بكل البلديات؟', 'لا. المساعدة الخاصة والإعفاء من الضرائب ومساعدات الدخل القليل بتختلف من بلدية لبلدية بالشروط والمبالغ. أزرار البحث بالأداة بتفتحلك صفحة بلديتك.'),
    ('انتقلت لبيت جديد، متى لازم سجّل؟', 'خلال 5 أيام من الانتقال، عند البلدية الجديدة.'),
    ('هل بتحفظوا عنواني؟', 'لا. العنوان بيروح بس لخدمة العناوين الحكومية PDOK لتحديد البلدية، وما منحفظ شي.'),
]
NL_FAQ = [
    ('Hoe weet ik bij welke gemeente ik hoor?', 'Vul je postcode in. Elk adres hoort bij één gemeente; de tool leest die uit de adresservice van de overheid.'),
    ('Wat is het nummer met 14?', 'Het algemene nummer van veel gemeenten: 14 plus het netnummer, zoals 14 030 voor Utrecht. Je belt het vanaf elke telefoon in Nederland.'),
    ('Zijn de regelingen overal hetzelfde?', 'Nee. Bijzondere bijstand, kwijtschelding en minimaregelingen verschillen per gemeente in voorwaarden en bedragen. De zoekknoppen openen de pagina van jouw gemeente.'),
    ('Ik ben verhuisd. Wanneer moet ik me inschrijven?', 'Binnen 5 dagen na de verhuizing, bij je nieuwe gemeente.'),
    ('Bewaren jullie mijn adres?', 'Nee. Je adres gaat alleen naar PDOK om de gemeente te bepalen; wij bewaren niets.'),
]
AI = {
    'ar': 'أُعدّت هذه الأداة بمساعدة الذكاء الاصطناعي. بيانات البلديات من دليل الجهات الحكومية الرسمي، وقد تتغير؛ تأكد دائماً من موقع بلديتك.',
    'nl': 'Deze tool is gemaakt met hulp van AI. De gegevens van gemeenten komen uit de officiële overheidsgids en kunnen veranderen; controleer altijd de website van je gemeente.',
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
