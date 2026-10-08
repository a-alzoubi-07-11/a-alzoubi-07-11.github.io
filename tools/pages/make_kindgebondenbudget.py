"""Build the kindgebonden budget 2026 calculator pages (AR + NL).

Run: python3 tools/pages/make_kindgebondenbudget.py
Writes calculators/kindgebonden-budget.html and nl/calculators/kindgebonden-budget.html.
Parameters are in assets/calc-kindgebondenbudget.js (object P); the numbers in the tables below must match it.
"""
import os, sys, html

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'kindgebonden-budget'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1">'
        '<script src="/assets/calc-kindgebondenbudget.js?v=1" defer></script>')

PROEF = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/hulpmiddel-proefberekening-toeslagen'
SOURCES = [
    ('Dienst Toeslagen · Berekening kindgebonden budget 2026 (pdf)',
     'https://download.belastingdienst.nl/toeslagen/docs/berekening_kindgebonden_budget_tg0811z61fd.pdf'),
    ('Dienst Toeslagen · Berekening kindgebonden budget (overzicht)',
     'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/berekening-kindgebonden-budget'),
    ('Dienst Toeslagen · Hoeveel kindgebonden budget krijg ik?',
     'https://www.belastingdienst.nl/wps/wcm/connect/nl/kindgebonden-budget/content/hoeveel-kindgebonden-budget'),
    ('Dienst Toeslagen · Hoeveel inkomen mag ik hebben voor kindgebonden budget?',
     'https://www.belastingdienst.nl/wps/wcm/connect/nl/kindgebonden-budget/content/maximaal-inkomen-kindgebonden-budget'),
    ('Dienst Toeslagen · Maximaal vermogen kindgebonden budget',
     'https://www.belastingdienst.nl/wps/wcm/connect/nl/kindgebonden-budget/content/maximaal-vermogen-kindgebonden-budget'),
    ('Dienst Toeslagen · Voorwaarden kindgebonden budget',
     'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/kindgebonden-budget/voorwaarden/voorwaarden-kindgebonden-budget'),
    ('Dienst Toeslagen · Proefberekening toeslagen', PROEF),
    ('Rijksoverheid · Minder kindgebonden budget voor hogere inkomens in 2027 (internetconsultatie, 6-10-2025)',
     'https://www.rijksoverheid.nl/actueel/nieuws/2025/10/06/internetconsultatie-minder-kindgebonden-budget-voor-hogere-inkomens-in-2027'),
]

AR = dict(
    lang='ar',
    home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='حاسبة Kindgebonden budget 2026',
    page_title='حاسبة Kindgebonden budget 2026 بالعربية: كم ستحصل شهرياً؟',
    desc='احسب تقديرياً kindgebonden budget لعام 2026 بالعربية: حسب الدخل المشترك، والأصول في 1 يناير، وعدد الأطفال وأعمارهم، والوالد الوحيد. بأرقام Dienst Toeslagen الرسمية.',
    summary='أدخل دخل أسرتك لعام 2026 وأصولكم في 1 يناير وعدد الأطفال حسب العمر، فتحصل على تقدير شهري وسنوي لـ kindgebonden budget مع سبب عدم الاستحقاق إن وُجد.',
    how_h='كيف تعمل الحاسبة؟',
    how=('نتّبع خطوات الحساب الخمس التي نشرتها Dienst Toeslagen لعام 2026: المبلغ الأقصى حسب عدد الأطفال، '
         'ثم زيادة للوالد الوحيد (ALO-kop)، ثم زيادة لكل طفل بين 12 و15 وبين 16 و17، ثم نطرح 7.6% من الدخل المشترك الذي يزيد على حد الدخل. '
         'إن كانت الأصول في 1 يناير 2026 فوق الحد فلا استحقاق للسنة كلها. الحساب يتم داخل متصفحك ولا نرسل أي بيانات.'),
    form_h='احسب تقديرك لعام 2026',
    noscript='الحاسبة تحتاج JavaScript. يمكنك الحساب يدوياً بالجدول أدناه أو عبر الحساب التجريبي الرسمي من Belastingdienst.',
    f_partner='لديّ شريك بدلات (toeslagpartner) في 2026',
    f_income='الدخل الخاضع للاختبار (toetsingsinkomen) لعام 2026 باليورو، مجموعك أنت وشريكك',
    f_assets='الأصول في 1 يناير 2026 باليورو (أنت وشريكك والأطفال دون 18)، اختياري',
    f_a='عدد الأطفال من 0 إلى 11 سنة', f_b='عدد الأطفال من 12 إلى 15 سنة', f_c='عدد الأطفال 16 أو 17 سنة',
    f_kb='تُدفع لي أو لشريكي kinderbijslag عن هؤلاء الأطفال',
    f_abroad='طفل واحد على الأقل يعيش خارج الاتحاد الأوروبي/EER/سويسرا',
    btn='احسب التقدير',
    after='الدخل هنا هو دخلكما السنوي الإجمالي المتوقع لسنة 2026 كاملة (ليس الشهري). المبلغ الشهري يُدفع بالأورو الكامل، وعادةً قبل بداية الشهر.',
)
NL = dict(
    lang='nl',
    home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Kindgebonden budget berekenen 2026',
    page_title='Kindgebonden budget 2026 berekenen: hoeveel krijgt u per maand?',
    desc='Bereken een schatting van uw kindgebonden budget 2026: op basis van gezamenlijk toetsingsinkomen, vermogen op 1 januari, aantal kinderen per leeftijd en alleenstaande ouder. Met de officiële bedragen van Dienst Toeslagen.',
    summary='Vul uw inkomen over 2026, uw vermogen op 1 januari en het aantal kinderen per leeftijdsgroep in. U ziet een schatting per maand en per jaar, of de reden waarom u waarschijnlijk geen recht hebt.',
    how_h='Hoe werkt de rekenhulp?',
    how=('We volgen de 5 rekenstappen die Dienst Toeslagen voor 2026 publiceert: het maximale bedrag per aantal kinderen, '
         'de verhoging voor alleenstaande ouders (ALO-kop), de verhoging per kind van 12 t/m 15 en van 16–17 jaar, en daarna 7,6% vermindering over het (gezamenlijke) '
         'toetsingsinkomen boven de inkomensdrempel. Is uw vermogen op 1 januari 2026 te hoog, dan hebt u het hele jaar geen recht. Alles wordt in uw browser berekend; er worden geen gegevens verstuurd.'),
    form_h='Bereken uw schatting voor 2026',
    noscript='De rekenhulp vraagt JavaScript. U kunt handmatig rekenen met de tabel hieronder of de officiële proefberekening van de Belastingdienst gebruiken.',
    f_partner='Ik heb in 2026 een toeslagpartner',
    f_income='Toetsingsinkomen 2026 in euro, van u en uw toeslagpartner samen',
    f_assets='Vermogen op 1 januari 2026 in euro (u, partner en minderjarige kinderen), optioneel',
    f_a='Aantal kinderen van 0 t/m 11 jaar', f_b='Aantal kinderen van 12 t/m 15 jaar', f_c='Aantal kinderen van 16 of 17 jaar',
    f_kb='Ik of mijn toeslagpartner krijg kinderbijslag voor deze kinderen',
    f_abroad='Minstens één kind woont buiten de EU/EER/Zwitserland',
    btn='Bereken schatting',
    after='Vul het verwachte bruto jaarinkomen voor heel 2026 in (niet per maand). Het maandbedrag wordt in hele euro’s uitbetaald, meestal vóór het begin van de maand.',
)


def eur(x):
    return '<span dir="ltr">€ ' + f'{x:,.0f}'.replace(',', '.') + '</span>'


def form(L):
    def numf(name, label, ph, mx, step='1', req=False):
        return (f'<label for="kgb-{name}"><span>{label}</span><input id="kgb-{name}" name="{name}" type="number" '
                f'inputmode="decimal" min="0" max="{mx}" step="{step}" placeholder="{ph}" dir="ltr"{" required" if req else ""}></label>')
    return (
        f'<section id="calc-kindgebondenbudget" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        '<form novalidate>'
        f'<label class="tool-check"><input name="partner" type="checkbox"><span>{L["f_partner"]}</span></label>'
        '<div class="tool-fields">'
        + numf('income', L['f_income'], '35000', '1000000', '1', True)
        + numf('assets', L['f_assets'], '0', '10000000')
        + numf('kids0to11', L['f_a'], '0', '20')
        + numf('kids12to15', L['f_b'], '0', '20')
        + numf('kids16to17', L['f_c'], '0', '20')
        + '</div>'
        f'<label class="tool-check"><input name="kinderbijslag" type="checkbox" checked><span>{L["f_kb"]}</span></label>'
        f'<label class="tool-check"><input name="abroad" type="checkbox"><span>{L["f_abroad"]}</span></label>'
        f'<button class="tool-button primary" type="submit"><span>{L["btn"]}</span></button>'
        '</form><div class="tool-result" role="status" aria-live="polite"></div>'
        f'<p class="muted"><span>{L["after"]}</span></p></section>'
    )


AR_BODY = f'''
<section><h2>قواعد وأرقام 2026 الرسمية</h2>
<p>هذه هي الأرقام التي نشرتها Dienst Toeslagen في «Berekening kindgebonden budget 2026»، وهي نفسها المستخدمة في الحاسبة. المبالغ سنوية:</p>
<table><thead><tr><th>البند</th><th>المبلغ 2026</th></tr></thead><tbody>
<tr><td>لكل طفل (الأول والثاني والثالث وما بعده بالمبلغ نفسه)</td><td>{eur(2580)}</td></tr>
<tr><td>زيادة الوالد الوحيد (ALO-kop): طفل واحد للوالد الوحيد = {eur(5996)}</td><td>{eur(3416)}</td></tr>
<tr><td>زيادة لكل طفل من 12 حتى 15 سنة</td><td>{eur(724)}</td></tr>
<tr><td>زيادة لكل طفل 16 أو 17 سنة</td><td>{eur(964)}</td></tr>
<tr><td>حد الدخل للمبلغ الكامل، والد وحيد</td><td>{eur(29736)}</td></tr>
<tr><td>حد الدخل للمبلغ الكامل، مع شريك (دخل مشترك)</td><td>{eur(39141)}</td></tr>
<tr><td>التخفيض فوق حد الدخل</td><td><span dir="ltr">7.6%</span></td></tr>
<tr><td>حد الأصول في 1 يناير 2026، بدون شريك / مع شريك</td><td>{eur(146011)} / {eur(184633)}</td></tr>
</tbody></table>
<p><b>مثال رسمي:</b> زوجان دخلهما المشترك 45,000 يورو ولهما طفلان (4 و8 سنوات). الحد الأقصى {eur(5160)}؛ التخفيض = 7.6% × (45,000 − 39,141) = <span dir="ltr">€ 445,28</span>؛ الصافي <span dir="ltr">€ 4.714,72</span> سنوياً، أي نحو <span dir="ltr">€ 392</span> شهرياً.</p>
<p><b>وماذا عن 2027؟</b> أعلنت الحكومة أن المبالغ ترتفع تدريجياً حتى 2028، واقترحت (استشارة عامة في أكتوبر 2025) تخفيض المبلغ أكثر للدخول فوق نحو 60,000 يورو بدءاً من 2027. هذه خطط لم نُدخلها في الحساب؛ سنحدّث الحاسبة عندما تنشر Toeslagen أرقام 2027 النهائية.</p>
</section>
<section><h2>ما الذي يُحسب دخلاً وأصولاً؟</h2>
<ul>
<li><b>الدخل (toetsingsinkomen):</b> دخلك السنوي الإجمالي لعام 2026 من العمل أو الإعانة أو العمل الحر، مضافاً إليه دخل شريك البدلات. يُحتسب الدخل الهولندي والأجنبي. دخل الطفل نفسه لا يُحتسب.</li>
<li><b>الأصول (vermogen):</b> المدخرات والاستثمارات وغيرها ناقص الديون، كما هي في 1 يناير 2026 فقط. تُضاف أصول شريكك وأصول أطفالك دون 18، وكذلك الأصول في الخارج.</li>
<li><b>الشريك:</b> المهم هو شريك البدلات (toeslagpartner) وفق قواعد Toeslagen، لا مجرد الحالة الاجتماعية. اقرأ <a href="/articles/single-parent-support.html">دليل دعم الوالد الوحيد</a> إن انفصلت خلال السنة.</li>
</ul>
</section>
<section><h2>متى تُبلغ عن تغيير؟ وأخطاء شائعة</h2>
<ul>
<li>أبلغ Toeslagen عبر Mijn toeslagen عند تغير الدخل المتوقع، أو بداية أو نهاية علاقة الشراكة، أو ولادة طفل، أو انتقال طفل للعيش في مكان آخر. التأخير يعني غالباً استرداداً لاحقاً.</li>
<li>تقدير الدخل أقل من الواقع (مثل نسيان بدل الإجازة أو العمل الإضافي) يؤدي إلى مبلغ يجب ردّه بعد الحساب النهائي.</li>
<li>الخلط بين <a href="/articles/kinderbijslag-guide.html">kinderbijslag</a> من SVB (لا يرتبط بالدخل) وkindgebonden budget من Toeslagen (يرتبط بالدخل والأصول).</li>
<li>تجاهل الأصول في 1 يناير بعد ميراث أو بيع شيء: تجاوز الحد بيورو واحد يلغي الاستحقاق للسنة كلها.</li>
</ul>
<p>للشرح الكامل خطوة بخطوة اقرأ <a href="/articles/kindgebonden-budget-guide.html">دليل kindgebonden budget بالعربية</a>.</p>
</section>
'''

NL_BODY = f'''
<section><h2>Officiële regels en bedragen 2026</h2>
<p>Dit zijn de bedragen uit «Berekening kindgebonden budget 2026» van Dienst Toeslagen. De rekenhulp gebruikt precies deze cijfers. Bedragen per jaar:</p>
<table><thead><tr><th>Onderdeel</th><th>Bedrag 2026</th></tr></thead><tbody>
<tr><td>Per kind (1e, 2e, 3e en volgende kind hetzelfde bedrag)</td><td>{eur(2580)}</td></tr>
<tr><td>Verhoging alleenstaande ouder (ALO-kop); 1 kind alleenstaande = {eur(5996)}</td><td>{eur(3416)}</td></tr>
<tr><td>Verhoging per kind van 12 t/m 15 jaar</td><td>{eur(724)}</td></tr>
<tr><td>Verhoging per kind van 16 en 17 jaar</td><td>{eur(964)}</td></tr>
<tr><td>Inkomensdrempel voor het maximale bedrag, alleenstaande ouder</td><td>{eur(29736)}</td></tr>
<tr><td>Inkomensdrempel, met toeslagpartner (gezamenlijk)</td><td>{eur(39141)}</td></tr>
<tr><td>Vermindering boven de drempel</td><td><span dir="ltr">7,6%</span></td></tr>
<tr><td>Vermogensgrens 1 januari 2026, zonder / met toeslagpartner</td><td>{eur(146011)} / {eur(184633)}</td></tr>
</tbody></table>
<p><b>Officieel rekenvoorbeeld:</b> een stel met samen € 45.000 en 2 kinderen van 4 en 8 jaar. Maximaal {eur(5160)}; vermindering 7,6% × (45.000 − 39.141) = <span dir="ltr">€ 445,28</span>; per jaar <span dir="ltr">€ 4.714,72</span>, per maand afgerond <span dir="ltr">€ 392</span>.</p>
<p><b>En 2027?</b> Het kabinet meldt dat de bedragen tot en met 2028 stapsgewijs stijgen, en stelde (internetconsultatie oktober 2025) voor om ouders met een inkomen boven ongeveer € 60.000 vanaf 2027 minder kindgebonden budget te geven. Dat zijn plannen; ze zitten niet in deze berekening. We passen de rekenhulp aan zodra Toeslagen de definitieve bedragen voor 2027 publiceert.</p>
</section>
<section><h2>Wat telt als inkomen en vermogen?</h2>
<ul>
<li><b>Inkomen (toetsingsinkomen):</b> uw bruto jaarinkomen over 2026 uit werk, uitkering of onderneming, plus dat van uw toeslagpartner. Binnenlands en buitenlands inkomen tellen mee. Het eigen inkomen van uw kind telt niet mee.</li>
<li><b>Vermogen:</b> spaargeld, beleggingen en andere bezittingen min schulden, alleen op peildatum 1 januari 2026. Vermogen van uw toeslagpartner en van uw minderjarige kinderen telt mee, net als buitenlands vermogen.</li>
<li><b>Partner:</b> het gaat om uw toeslagpartner volgens de regels van Toeslagen, niet alleen om uw burgerlijke staat. Lees <a href="/nl/articles/single-parent-support.html">ondersteuning voor alleenstaande ouders</a> als u dit jaar uit elkaar bent gegaan.</li>
</ul>
</section>
<section><h2>Wanneer wijzigingen doorgeven? En veelgemaakte fouten</h2>
<ul>
<li>Geef via Mijn toeslagen door als uw verwachte inkomen verandert, u een toeslagpartner krijgt of niet meer hebt, er een kind geboren wordt of een kind ergens anders gaat wonen. Te laat doorgeven betekent vaak later terugbetalen.</li>
<li>Inkomen te laag inschatten (vakantiegeld of overuren vergeten) leidt tot terugbetalen na de definitieve berekening.</li>
<li><a href="/nl/articles/kinderbijslag-guide.html">Kinderbijslag</a> van de SVB (niet inkomensafhankelijk) verwarren met kindgebonden budget van Toeslagen (wel inkomens- en vermogensafhankelijk).</li>
<li>Vermogen op 1 januari vergeten na een erfenis of verkoop: één euro boven de grens betekent het hele jaar geen recht.</li>
</ul>
<p>Lees de volledige uitleg in onze <a href="/nl/articles/kindgebonden-budget-guide.html">gids over kindgebonden budget</a>.</p>
</section>
'''

AR_FAQ = [
    ('هل المبلغ لكل طفل مختلف للطفل الأول والثاني والثالث في 2026؟',
     'لا. منذ 2024 أصبح المبلغ الأساسي متساوياً لكل طفل؛ في 2026 هو 2,580 يورو سنوياً لكل طفل، مع زيادة 724 يورو للطفل بين 12 و15 و964 يورو للطفل 16 أو 17.'),
    ('كم يحصل الوالد الوحيد زيادةً؟',
     'يحصل الوالد الوحيد بلا شريك بدلات على زيادة ALO-kop قدرها 3,416 يورو سنوياً في 2026، فيصبح الحد الأقصى لطفل واحد 5,996 يورو. ويبدأ التخفيض عنده بعد دخل 29,736 يورو.'),
    ('ما أعلى دخل يمكن أن أحصل معه على شيء؟',
     'لا يوجد حد واحد؛ يعتمد على عدد الأطفال وأعمارهم. مثلاً زوجان بطفل واحد دون 12 سنة يصل المبلغ عندهما إلى الصفر عند دخل مشترك يقارب 73,000 يورو، ووالد وحيد بطفل واحد عند نحو 108,600 يورو. الحاسبة تعرض الحد لأسرتك.'),
    ('هل أحصل عليه تلقائياً مع kinderbijslag؟',
     'لا تعتمد على ذلك. kinderbijslag من SVB شرط أساسي، لكن kindgebonden budget بدل من Toeslagen تطلبه وتدير بياناته عبر Mijn toeslagen بـ DigiD.'),
    ('متى تبدأ زيادة 12 و16 سنة؟',
     'في الشهر التالي للشهر الذي يبلغ فيه الطفل 12 أو 16 سنة. لذلك قد يكون مبلغ السنة الفعلي بين الحسابين إن كان عيد الميلاد خلال 2026.'),
    ('هل نتيجة الحاسبة قرار رسمي؟',
     'لا. هي تقدير مبني على الأرقام الرسمية لعام 2026. القرار والمبلغ النهائي من Dienst Toeslagen، وجرّب الحساب التجريبي الرسمي قبل الطلب.'),
]
NL_FAQ = [
    ('Is het bedrag in 2026 verschillend voor het 1e, 2e en 3e kind?',
     'Nee. Sinds 2024 is het basisbedrag gelijk per kind: in 2026 € 2.580 per jaar per kind, plus € 724 voor een kind van 12 t/m 15 jaar en € 964 voor een kind van 16 of 17 jaar.'),
    ('Hoeveel extra krijgt een alleenstaande ouder?',
     'Een ouder zonder toeslagpartner krijgt in 2026 een verhoging (ALO-kop) van € 3.416 per jaar; het maximum voor 1 kind wordt dan € 5.996. De vermindering begint boven een toetsingsinkomen van € 29.736.'),
    ('Tot welk inkomen krijg ik nog iets?',
     'Dat verschilt per gezin. Een stel met 1 kind jonger dan 12 komt rond € 73.000 gezamenlijk inkomen op € 0 uit, een alleenstaande ouder met 1 kind rond € 108.600. De rekenhulp toont de grens voor uw situatie.'),
    ('Krijg ik het automatisch bij de kinderbijslag?',
     'Ga daar niet van uit. Kinderbijslag van de SVB is een voorwaarde, maar kindgebonden budget is een toeslag van Dienst Toeslagen die u regelt via Mijn toeslagen met DigiD.'),
    ('Wanneer gaat de verhoging bij 12 en 16 jaar in?',
     'Ná de maand waarin uw kind 12 of 16 jaar wordt. Is de verjaardag in 2026, dan ligt uw werkelijke jaarbedrag tussen de twee berekeningen in.'),
    ('Is de uitkomst een officieel besluit?',
     'Nee. Het is een schatting met de officiële bedragen voor 2026. Dienst Toeslagen beslist over het recht en het bedrag; doe ook de officiële proefberekening.'),
]

AI = {
    'ar': 'أُعدّت هذه الأداة بمساعدة الذكاء الاصطناعي وراجعناها مقابل المصادر الرسمية؛ النتيجة تقديرية وليست قراراً رسمياً.',
    'nl': 'Deze tool is gemaakt met hulp van AI en gecontroleerd aan de hand van officiële bronnen; de uitkomst is een schatting, geen officieel besluit.',
}


def build(L, body, faqs, path, twin):
    lang = L['lang']
    crumbs = (f'<nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol>'
              f'<li><a href="{L["home"]}"><span>{L["home_t"]}</span></a></li>'
              f'<li><a href="{L["tools"]}"><span>{L["tools_t"]}</span></a></li>'
              f'<li aria-current="page"><span>{L["title"]}</span></li></ol></nav>')
    faq_h = 'أسئلة شائعة' if lang == 'ar' else 'Veelgestelde vragen'
    src_h = 'المصادر الرسمية' if lang == 'ar' else 'Officiële bronnen'
    faq_html = ''.join(f'<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in faqs)
    src_html = ''.join(f'<li><a href="{u}" rel="noopener" target="_blank">{html.escape(t)}</a></li>' for t, u in SOURCES)
    main = (f'<main id="content" class="wrap">{crumbs}<article class="reader">'
            f'<h1><span>{L["page_title"]}</span></h1><p class="summary"><span>{L["summary"]}</span></p>'
            f'<h2>{L["how_h"]}</h2><p>{L["how"]}</p>'
            + form(L) + body +
            f'<section><h2>{faq_h}</h2>{faq_html}</section>'
            f'<section><h2>{src_h}</h2><ul>{src_html}</ul></section>'
            f'<p class="muted"><span>{AI[lang]}</span></p>'
            '</article></main>')
    url = f'{SITE}/{path}'
    jsonld = [
        {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': L['title'], 'url': url,
         'description': L['desc'], 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Any',
         'inLanguage': lang, 'isAccessibleForFree': True,
         'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'}},
        {'@context': 'https://schema.org', '@type': 'FAQPage', 'inLanguage': lang,
         'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faqs]},
    ]
    return page(lang=lang, path=path, twin=twin, title=L['title'], desc=L['desc'], main=main,
                head_extra=HEAD, jsonld=jsonld)


if __name__ == '__main__':
    print(build(AR, AR_BODY, AR_FAQ, AR_PATH, NL_PATH))
    print(build(NL, NL_BODY, NL_FAQ, NL_PATH, AR_PATH))
