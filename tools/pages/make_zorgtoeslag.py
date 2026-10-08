"""Build the zorgtoeslag 2026 calculator pages (AR + NL), reusing the kindgebonden-budget page builder.

Run: python3 tools/pages/make_zorgtoeslag.py
Parameters live in assets/calc-zorgtoeslag.js (object P); numbers in the tables below must match it.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import make_kindgebondenbudget as k  # noqa: E402

SLUG = 'zorgtoeslag'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
k.HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1">'
          '<script src="/assets/calc-zorgtoeslag.js?v=1" defer></script>')
T_ = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/'
k.SOURCES = [
    ('Dienst Toeslagen · Berekening zorgtoeslag 2026 (pdf)', 'https://download.belastingdienst.nl/toeslagen/docs/berekening_zorgtoeslag_tg0821z61fd.pdf'),
    ('Dienst Toeslagen · Kan ik zorgtoeslag krijgen?', T_ + 'kan-ik-zorgtoeslag-krijgen'),
    ('Dienst Toeslagen · Hoeveel zorgtoeslag krijg ik?', T_ + 'hoeveel-zorgtoeslag'),
    ('Dienst Toeslagen · Maximaal vermogen zorgtoeslag', T_ + 'maximaal-vermogen-zorgtoeslag'),
    ('Dienst Toeslagen · Zorgtoeslag met een andere nationaliteit', T_ + 'zorgtoeslag-andere-nationaliteit'),
    ('Staatscourant · Besluit percentages drempel- en toetsingsinkomen zorgtoeslag', 'https://zoek.officielebekendmakingen.nl/stcrt-2025-42977.html'),
    ('Dienst Toeslagen · Proefberekening toeslagen', k.PROEF),
]
k.AI = {'ar': k.AI['ar'], 'nl': k.AI['nl']}


def form(L):
    def numf(name, label, ph, mx, req=False):
        return (f'<label for="zt-{name}"><span>{label}</span><input id="zt-{name}" name="{name}" type="number" inputmode="decimal" '
                f'min="0" max="{mx}" step="1" placeholder="{ph}" dir="ltr"{" required" if req else ""}></label>')
    return (
        f'<section id="calc-zorgtoeslag" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript><form novalidate>'
        f'<label for="zt-partner"><span>{L["f_partner"]}</span><select id="zt-partner" name="partner">'
        f'<option value="no">{L["no"]}</option><option value="yes">{L["yes"]}</option></select></label>'
        f'<label class="tool-check zt-partner-only" hidden><input name="partnerInsured" type="checkbox" checked><span>{L["f_pins"]}</span></label>'
        '<div class="tool-fields">' + numf('income', L['f_income'], '25000', '1000000', True) + numf('assets', L['f_assets'], '0', '10000000') + '</div>'
        f'<label class="tool-check"><input name="age18" type="checkbox" checked><span>{L["f_age"]}</span></label>'
        f'<label class="tool-check"><input name="insured" type="checkbox" checked><span>{L["f_ins"]}</span></label>'
        f'<label class="tool-check"><input name="legalStay" type="checkbox" checked><span>{L["f_stay"]}</span></label>'
        f'<button class="tool-button primary" type="submit"><span>{L["btn"]}</span></button></form>'
        '<div class="tool-result" role="status" aria-live="polite"></div>'
        f'<p class="muted"><span>{L["after"]}</span></p></section>')
k.form = form
e = k.eur

AR = dict(lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='حاسبة Zorgtoeslag 2026',
    page_title='حاسبة Zorgtoeslag 2026 بالعربية: كم بدل التأمين الصحي الذي تستحقه؟',
    desc='احسب تقديرياً zorgtoeslag لعام 2026 بالعربية: حسب دخلك المتوقع، وجود شريك بدلات، والأصول في 1 يناير. بالأرقام الرسمية من Dienst Toeslagen، دون حفظ أي بيانات.',
    summary='أدخل دخلك المتوقع لعام 2026 وأصولك في 1 يناير ووضع الشريك، فتحصل على تقدير شهري وسنوي لبدل التأمين الصحي (zorgtoeslag) أو سبب عدم الاستحقاق.',
    how_h='كيف تعمل الحاسبة؟',
    how=('نتّبع طريقة Dienst Toeslagen لعام 2026: القسط المعياري (standaardpremie) ناقص القسط المفترض (normpremie) الذي يرتفع مع دخلك. '
         'إن كان الدخل أو الأصول فوق الحد، أو لم تستوفِ الشروط، فلا استحقاق. الحساب يتم داخل متصفحك ولا نرسل أي بيانات.'),
    form_h='احسب تقديرك لعام 2026',
    noscript='الحاسبة تحتاج JavaScript. يمكنك استخدام الحساب التجريبي الرسمي من Belastingdienst.',
    f_partner='هل لديك شريك بدلات (toeslagpartner) في 2026؟', no='لا', yes='نعم',
    f_pins='شريكي لديه تأمين صحي هولندي', f_income='الدخل الخاضع للاختبار (toetsingsinkomen) المتوقع لعام 2026 باليورو، مجموعك مع شريكك إن وُجد',
    f_assets='الأصول في 1 يناير 2026 باليورو (مشتركة مع الشريك)، اختياري',
    f_age='عمري 18 سنة أو أكثر', f_ins='لدي تأمين صحي أساسي هولندي', f_stay='إقامتي في هولندا قانونية',
    btn='احسب التقدير',
    after='الدخل هنا هو إجمالي دخلك السنوي المتوقع لسنة 2026 كاملة (ليس الشهري). الاستحقاق الفعلي تحدده Dienst Toeslagen بعد الطلب.')
NL = dict(lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Zorgtoeslag berekenen 2026',
    page_title='Zorgtoeslag 2026 berekenen: hoeveel krijgt u per maand?',
    desc='Bereken een schatting van uw zorgtoeslag 2026: op basis van verwacht toetsingsinkomen, toeslagpartner en vermogen op 1 januari. Met de officiële bedragen van Dienst Toeslagen; er worden geen gegevens opgeslagen.',
    summary='Vul uw verwachte inkomen over 2026, uw vermogen op 1 januari en de situatie van uw toeslagpartner in. U ziet een schatting per maand en per jaar, of de reden waarom u waarschijnlijk geen recht hebt.',
    how_h='Hoe werkt de rekenhulp?',
    how=('We volgen de rekenmethode van Dienst Toeslagen voor 2026: standaardpremie min normpremie, die stijgt met uw inkomen. '
         'Ligt uw inkomen of vermogen boven de grens, of voldoet u niet aan de voorwaarden, dan is er geen recht. Alles wordt in uw browser berekend; er worden geen gegevens verstuurd.'),
    form_h='Bereken uw schatting voor 2026',
    noscript='De rekenhulp vraagt JavaScript. U kunt de officiële proefberekening van de Belastingdienst gebruiken.',
    f_partner='Hebt u in 2026 een toeslagpartner?', no='Nee', yes='Ja',
    f_pins='Mijn toeslagpartner heeft een Nederlandse zorgverzekering', f_income='Verwacht toetsingsinkomen 2026 in euro, van u en uw toeslagpartner samen',
    f_assets='Vermogen op 1 januari 2026 in euro (samen met partner), optioneel',
    f_age='Ik ben 18 jaar of ouder', f_ins='Ik heb een Nederlandse basisverzekering', f_stay='Ik verblijf rechtmatig in Nederland',
    btn='Bereken schatting',
    after='Vul het verwachte bruto jaarinkomen voor heel 2026 in (niet per maand). Dienst Toeslagen beslist over het recht en het bedrag.')

AR_BODY = f'''
<section><h2>قواعد وأرقام 2026 الرسمية</h2>
<table><thead><tr><th>البند</th><th>المبلغ 2026</th></tr></thead><tbody>
<tr><td>القسط المعياري (standaardpremie) لكل مؤمَّن</td><td>{e(2119)}</td></tr>
<tr><td>حد الدخل للحصول على zorgtoeslag: بدون شريك / مع شريك</td><td>{e(40857)} / {e(51142)}</td></tr>
<tr><td>حد الأصول في 1 يناير 2026: بدون شريك / مع شريك</td><td>{e(146011)} / {e(184633)}</td></tr>
<tr><td>الحد الأقصى السنوي تقريباً: بدون شريك / مع شريك</td><td>{e(1550)} / {e(2963)}</td></tr>
</tbody></table>
<p>تُحسب الصيغة هكذا: <b>القسط المعياري − القسط المفترض</b>. القسط المفترض يزيد كلما ارتفع دخلك فوق نحو 29,736 يورو، وعند حد الدخل يقترب المبلغ من الصفر. إن كان شريكك بلا تأمين هولندي فتحصل على نصف المبلغ المحسوب.</p>
<p><b>مثال توضيحي (وليس حالة شخص حقيقي):</b> دخل 25,000 يورو بدون شريك وأصول أقل من الحد: التقدير نحو {e(1550)} سنوياً، أي نحو <span dir="ltr">€ 129</span> شهرياً. ارفع الدخل إلى 35,000 يورو فينخفض المبلغ بوضوح، وتجد الرقم الدقيق في الحاسبة.</p>
</section>
<section><h2>أخطاء شائعة</h2>
<ul>
<li>إدخال الدخل الشهري بدل السنوي. الحاسبة تحتاج دخل سنة 2026 كاملة.</li>
<li>نسيان دخل الشريك: يُحتسب الدخل المشترك لك ولشريك البدلات.</li>
<li>تجاوز حد الأصول في 1 يناير ولو بيورو واحد يلغي الاستحقاق للسنة كلها.</li>
<li>عدم تعديل الدخل المتوقع في Mijn toeslagen عند تغيّره: النتيجة مبلغ يجب ردّه بعد الحساب النهائي.</li>
</ul>
<p>للشرح الكامل خطوة بخطوة اقرأ <a href="/articles/zorgtoeslag-guide.html">دليل zorgtoeslag بالعربية</a> و<a href="/articles/health-insurance-newcomers.html">دليل التأمين الصحي للقادمين الجدد</a>.</p>
</section>
'''
NL_BODY = f'''
<section><h2>Officiële regels en bedragen 2026</h2>
<table><thead><tr><th>Onderdeel</th><th>Bedrag 2026</th></tr></thead><tbody>
<tr><td>Standaardpremie per verzekerde</td><td>{e(2119)}</td></tr>
<tr><td>Inkomensgrens zorgtoeslag: zonder / met toeslagpartner</td><td>{e(40857)} / {e(51142)}</td></tr>
<tr><td>Vermogensgrens 1 januari 2026: zonder / met toeslagpartner</td><td>{e(146011)} / {e(184633)}</td></tr>
<tr><td>Maximale zorgtoeslag per jaar, ongeveer: zonder / met toeslagpartner</td><td>{e(1550)} / {e(2963)}</td></tr>
</tbody></table>
<p>De formule is <b>standaardpremie − normpremie</b>. De normpremie stijgt naarmate uw inkomen boven circa € 29.736 komt; bij de inkomensgrens blijft bijna niets over. Heeft uw toeslagpartner geen Nederlandse zorgverzekering, dan krijgt u de helft van het berekende bedrag.</p>
<p><b>Voorbeeld (illustratief, geen echte personen):</b> inkomen € 25.000 zonder toeslagpartner en vermogen onder de grens: een schatting van ongeveer {e(1550)} per jaar, dus circa <span dir="ltr">€ 129</span> per maand. Bij € 35.000 is het bedrag duidelijk lager; de exacte uitkomst ziet u in de rekenhulp.</p>
</section>
<section><h2>Veelgemaakte fouten</h2>
<ul>
<li>Het maandinkomen invullen in plaats van het jaarinkomen. De rekenhulp wil het verwachte inkomen over heel 2026.</li>
<li>Het inkomen van uw toeslagpartner vergeten: het gezamenlijke inkomen telt.</li>
<li>Vermogen op 1 januari: één euro boven de grens betekent het hele jaar geen recht.</li>
<li>Een gewijzigd inkomen niet doorgeven via Mijn toeslagen; dat leidt tot terugbetalen na de definitieve berekening.</li>
</ul>
<p>Lees de volledige uitleg in onze <a href="/nl/articles/zorgtoeslag-guide.html">gids over zorgtoeslag</a> en de <a href="/nl/articles/health-insurance-newcomers.html">gids zorgverzekering voor nieuwkomers</a>.</p>
</section>
'''
AR_FAQ = [
    ('من يحق له zorgtoeslag في 2026؟', 'من عمره 18 سنة أو أكثر، ولديه تأمين صحي هولندي أساسي، وإقامته قانونية، ودخله وأصوله ضمن الحدود: دخل حتى 40,857 يورو بدون شريك أو 51,142 مع شريك.'),
    ('هل النتيجة قرار رسمي؟', 'لا. هي تقدير بالأرقام الرسمية. القرار والمبلغ النهائي من Dienst Toeslagen، وجرّب الحساب التجريبي الرسمي قبل الطلب.'),
    ('ماذا لو تغيّر دخلي خلال السنة؟', 'عدّل الدخل المتوقع في Mijn toeslagen في أقرب وقت. التقدير الأقل من الواقع يعني ردّ مبلغ بعد الحساب النهائي.'),
    ('هل تُحفظ بياناتي؟', 'لا. الحساب يتم داخل متصفحك ولا نرسل أي معلومة.'),
]
NL_FAQ = [
    ('Wie heeft in 2026 recht op zorgtoeslag?', 'Wie 18 jaar of ouder is, een Nederlandse basisverzekering heeft, rechtmatig in Nederland verblijft en met inkomen en vermogen binnen de grenzen blijft: inkomen tot € 40.857 zonder of € 51.142 met toeslagpartner.'),
    ('Is de uitkomst een officieel besluit?', 'Nee. Het is een schatting met de officiële bedragen. Dienst Toeslagen beslist; doe ook de officiële proefberekening.'),
    ('Wat als mijn inkomen verandert?', 'Geef het verwachte inkomen zo snel mogelijk door via Mijn toeslagen. Te laag inschatten betekent terugbetalen na de definitieve berekening.'),
    ('Worden mijn gegevens opgeslagen?', 'Nee. Alles wordt in uw browser berekend; er wordt niets verstuurd.'),
]
if __name__ == '__main__':
    print(k.build(AR, AR_BODY, AR_FAQ, AR_PATH, NL_PATH))
    print(k.build(NL, NL_BODY, NL_FAQ, NL_PATH, AR_PATH))
