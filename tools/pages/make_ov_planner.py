"""Build the OV route-cost tool pages (AR + NL).

Run: python3 tools/pages/make_ov_planner.py
Writes calculators/ov-reiskosten.html and nl/calculators/ov-reiskosten.html.
Logic: assets/ov-planner.js (fares in object P). Data: assets/ov/*.json (tools/pages/make_ov_data.py).
Every amount in the tables below must match P in assets/ov-planner.js.
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, SITE  # noqa: E402

SLUG = 'ov-reiskosten'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/ov-planner.css?v=1">'
        '<link rel="preconnect" href="https://api.pdok.nl" crossorigin>'
        '<script src="/assets/ov-planner.js?v=3" defer></script>')

NS_PDF = 'https://ocp.ns.nl/caas/v1/media/92530/data/fa92c1f442da6fc8e87bd9b6773ddfbc/ns-prijslijst-2026-nl.pdf'
SOURCES = [
    ('NS · Tarieven Consumenten, geldig per 1 januari 2026 (pdf)', NS_PDF),
    ('U-OV · Tarieven 2026 (basistarief en kilometertarief)', 'https://www.u-ov.nl/tarieven'),
    ('HTM · Producten en tarieven 2026', 'https://www.htm.nl/reisproducten/producten-tarieven/'),
    ('allGo · Tarieven 2026 Almere', 'https://www.allgobus.nl/nieuws/tarieven-2026/'),
    ('EBS · Nieuwe ov-tarieven vanaf 1 januari 2026', 'https://www.ebs-ov.nl/waterland/actueel/nieuws/artikel/tarieven2026/'),
    ('NL Times · NS raises ticket prices 4.7% from January 2027', 'https://nltimes.nl/2026/10/20/dutch-rail-operator-ns-raise-ticket-prices-47-starting-january-2027'),
    ('OVpay · Betalen met bankpas of telefoon', 'https://www.ovpay.nl/'),
    ('DUO · Studentenreisproduct', 'https://duo.nl/particulier/studentenreisproduct/'),
    ('OVapi · Dienstregeling (GTFS, NDOV open data)', 'https://gtfs.ovapi.nl/'),
    ('PDOK · Locatieserver (adressen)', 'https://www.pdok.nl/introductie/-/article/pdok-locatieserver'),
]


def eur(x):
    s = f'{x:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    return f'<span dir="ltr">€ {s}</span>'


def form(L):
    def place(name, label, ph):
        return (f'<label class="ovp-field" for="ovp-{name}"><span>{label}</span>'
                f'<input id="ovp-{name}" name="{name}" type="text" autocomplete="off" role="combobox" aria-autocomplete="list" '
                f'aria-expanded="false" aria-controls="ovp-{name}-list" placeholder="{ph}" required maxlength="120">'
                f'<ul id="ovp-{name}-list" class="ovp-list" role="listbox" hidden></ul></label>')
    trips = ''.join(f'<option value="{v}"{" selected" if v == 10 else ""}>{t}</option>' for v, t in L['trips'])
    ages = ''.join(f'<option value="{v}">{t}</option>' for v, t in L['ages'])
    return (
        f'<section id="ov-planner" class="tool-section"><h2><span>{L["form_h"]}</span></h2>'
        f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
        '<form novalidate autocomplete="off"><div class="ovp-places">'
        + place('from', L['from'], L['ph_from'])
        + f'<button class="tool-button ovp-swap" type="button" aria-label="{L["swap"]}" title="{L["swap"]}">⇄</button>'
        + place('to', L['to'], L['ph_to'])
        + '</div><div class="ovp-opts">'
        f'<label for="ovp-trips"><span>{L["f_trips"]}</span><select id="ovp-trips" name="trips">{trips}</select></label>'
        f'<label for="ovp-when"><span>{L["f_when"]}</span><select id="ovp-when" name="when"><option value="peak">{L["peak"]}</option><option value="offpeak">{L["offpeak"]}</option></select></label>'
        f'<label for="ovp-age"><span>{L["f_age"]}</span><select id="ovp-age" name="age">{ages}</select></label>'
        '</div>'
        f'<button class="tool-button primary" type="submit"><span>{L["btn"]}</span></button>'
        '</form><div class="tool-result" role="status" aria-live="polite"></div>'
        f'<p class="muted"><span>{L["privacy"]}</span></p></section>'
    )


AR = dict(
    lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='حاسبة المواصلات في هولندا',
    page_title='حاسبة المواصلات في هولندا: كم تكلّفك رحلتك بالقطار والباص، وأي اشتراك يوفّر لك؟',
    desc='اكتب عنوان البيت والمدرسة أو العمل، فتعرف بالعربية: قطار أم باص أم ترام، أي شركة تشغّل كل جزء، كم سعر الرحلة بتعرفة NS الرسمية 2026، والاشتراك الذي يوفّر عليك شهرياً.',
    summary='اكتب من أين تنطلق وإلى أين تذهب (البيت، المدرسة، العمل، أو أي محطة). الأداة تبيّن لك كل جزء من الطريق: مشي أو باص أو ترام أو مترو أو قطار، واسم الشركة، والسعر التقريبي، ثم تقارن الدفع لكل رحلة مع اشتراكات NS لتعرف كم توفّر.',
    form_h='احسب رحلتك',
    noscript='الأداة تحتاج JavaScript. يمكنك استخدام جدول الأسعار أدناه أو مخطط رحلات NS أو 9292.',
    from_='من أين تنطلق؟', to_='إلى أين تذهب؟',
    ph_from='عنوان البيت، رمز بريدي أو محطة', ph_to='المدرسة، العمل، المدينة أو المحطة', swap='بدّل الاتجاه',
    f_trips='كم رحلة في الأسبوع؟ (الذهاب رحلة والعودة رحلة)',
    trips=[(2, 'رحلتان (ذهاب وعودة مرة)'), (4, '4 رحلات'), (6, '6 رحلات'), (8, '8 رحلات'), (10, '10 رحلات (5 أيام ذهاباً وعودة)'), (12, '12 رحلة (6 أيام)'), (14, '14 رحلة (كل يوم)')],
    f_when='متى تسافر غالباً؟', peak='في أوقات الذروة (المدرسة/العمل صباحاً)', offpeak='خارج الذروة أو في العطلة',
    f_age='فئتك', ages=[('adult', 'بالغ'), ('student', 'طالب MBO أو HBO أو جامعة'), ('youth', 'من 12 إلى 18 سنة'), ('kid', 'طفل من 4 إلى 11 سنة'), ('senior', '65 سنة فأكثر')],
    btn='احسب الطريق والسعر',
    privacy='العنوان يُرسل فقط إلى خدمة العناوين الحكومية PDOK لتحديد المكان على الخريطة. لا نحفظ بياناتك، والحساب يتم في متصفحك.',
)
AR['from'] = AR.pop('from_'); AR['to'] = AR.pop('to_')
NL = dict(
    lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='OV-reiskosten berekenen',
    page_title='OV-reiskosten berekenen: wat kost uw reis met trein en bus, en welk abonnement is goedkoper?',
    desc='Vul uw adres en uw school of werk in en zie welke trein, bus, tram of metro u neemt, welke vervoerder elk deel rijdt, wat de reis kost met de officiële NS-tarieven 2026 en welk abonnement u per maand bespaart.',
    summary='Vul in waar u vertrekt en waar u naartoe gaat (huis, school, werk of een station). U ziet elk deel van de reis: lopen, bus, tram, metro of trein, de vervoerder en een prijsschatting. Daarna vergelijken we betalen per reis met NS-abonnementen, zodat u ziet wat u bespaart.',
    form_h='Bereken uw reis',
    noscript='Deze rekenhulp vraagt JavaScript. Gebruik de tarieventabel hieronder, de NS Reisplanner of 9292.',
    **{'from': 'Waar vertrekt u?', 'to': 'Waar gaat u naartoe?'},
    ph_from='Adres, postcode of station', ph_to='School, werk, plaats of station', swap='Wissel richting',
    f_trips='Hoeveel reizen per week? (heen = 1 reis, terug = 1 reis)',
    trips=[(2, '2 reizen (1× heen en terug)'), (4, '4 reizen'), (6, '6 reizen'), (8, '8 reizen'), (10, '10 reizen (5 dagen heen en terug)'), (12, '12 reizen (6 dagen)'), (14, '14 reizen (elke dag)')],
    f_when='Wanneer reist u meestal?', peak='In de spits (school/werk ’s ochtends)', offpeak='Buiten de spits of in het weekend',
    f_age='U bent', ages=[('adult', 'Volwassene'), ('student', 'Student mbo, hbo of wo'), ('youth', '12 t/m 18 jaar'), ('kid', 'Kind van 4 t/m 11 jaar'), ('senior', '65 jaar of ouder')],
    btn='Bereken route en prijs',
    privacy='Uw adres gaat alleen naar de adresservice van de overheid (PDOK) om de plek op de kaart te vinden. We bewaren niets; de berekening gebeurt in uw browser.',
)

AR_BODY = f'''
<section><h2>هل يجب أن أشترك عند 3 شركات (قطار وباص وترام)؟ لا</h2>
<p>هذا أكثر سؤال نسمعه. في هولندا <b>بطاقة واحدة تكفي لكل الشركات</b>: NS وArriva وQbuzz وRET وGVB وHTM وغيرها. تدفع بإحدى طريقتين:</p>
<ul>
<li><b>OVpay:</b> بطاقتك البنكية (Debit/Credit) أو هاتفك. تمرّرها عند الصعود والنزول، ويُخصم المبلغ من حسابك. لا تحتاج رصيداً مسبقاً.</li>
<li><b>OV-chipkaart:</b> بطاقة تشحنها برصيد. للقطار تحتاج عادة رصيداً لا يقل عن 20 يورو عند تسجيل الدخول. تُستبدل تدريجياً بـ OVpay وببطاقة OV-pas الجديدة حتى نهاية 2027.</li>
</ul>
<p>حالياً ما زالت اشتراكات NS ومنتج سفر الطلاب تُحمَّل على OV-chipkaart شخصية، أما الرحلات العادية فيكفيها OVpay.</p>
<p>الاشتراك عند الشركة <b>اختياري</b>: تأخذه فقط إذا كان أرخص من الدفع لكل رحلة. والأداة أعلاه تحسب لك ذلك. القاعدة الذهبية: سجّل الدخول (inchecken) عند الصعود والخروج (uitchecken) عند النزول في كل وسيلة، وإلا تدفع غرامة أو أعلى سعر.</p>
<p>اقرأ أيضاً <a href="/articles/ns-train-ov-chipkaart-ovpay.html">دليل NS وOV-chipkaart وOVpay</a>.</p>
</section>
<section><h2>كيف تحسب الأداة السعر؟</h2>
<ul>
<li><b>القطار:</b> نحسب طول السكة الحقيقي بين المحطات من جدول المواعيد الرسمي المفتوح، ثم نطبّق جدول NS الرسمي لسنة 2026 لكل وحدة تعرفة (tariefeenheid). مثال: 0 إلى 8 وحدات = {eur(3.00)}، و50 وحدة = {eur(12.40)}، و200 وحدة فأكثر = {eur(33.30)}.</li>
<li><b>الباص والترام والمترو:</b> تعرفة البداية الوطنية {eur(1.16)} في 2026، زائد نحو {eur(0.20)} لكل كيلومتر. سعر الكيلومتر يختلف قليلاً حسب المنطقة: بين {eur(0.192)} و{eur(0.215)}.</li>
<li><b>الشركات:</b> نعرف أي شركة تقف قرب عنوانك وقرب المحطة من بيانات المواعيد الرسمية (NDOV)، ونعرض الأرجح.</li>
<li><b>عند تغيير الشركة في القطار</b> (مثلاً Arriva ثم NS) تدفع تعرفة بداية جديدة، ونضيفها للتقدير.</li>
</ul>
<p>النتيجة تقدير قريب من السعر الحقيقي، وليست تذكرة. للمواعيد والسعر الدقيق افتح المسار في تطبيق NS أو 9292 أو خرائط Google من زر النتيجة.</p>
</section>
<section><h2>اشتراكات NS لعام 2026: متى تستحق؟</h2>
<table><thead><tr><th>الاشتراك (NS Flex، الدرجة الثانية)</th><th>السعر الشهري 2026</th><th>يناسب من؟</th></tr></thead><tbody>
<tr><td>Dal Voordeel: خصم 40% خارج الذروة وفي العطلة</td><td>{eur(6.35)}</td><td>من يسافر بعد التاسعة صباحاً أو في العطلة. مجاني للشباب.</td></tr>
<tr><td>Traject Vrij: سفر غير محدود بين محطتين</td><td>من {eur(68.30)} (حتى 8 وحدات) إلى {eur(399.95)}</td><td>من يذهب للمدرسة أو العمل كل يوم على المسار نفسه.</td></tr>
<tr><td>Dal Vrij: كل القطارات مجاناً خارج الذروة</td><td>{eur(127.95)}</td><td>من يسافر كثيراً خارج الذروة.</td></tr>
<tr><td>Weekend Vrij: مجاناً في العطلة</td><td>{eur(39.50)}</td><td>رحلات العطلة إلى العائلة.</td></tr>
<tr><td>Altijd Vrij: كل القطارات بلا حدود</td><td>{eur(399.95)}</td><td>من يسافر مسافات طويلة يومياً.</td></tr>
</tbody></table>
<p>أوقات الذروة: أيام العمل من 06:30 إلى 09:00 ومن 16:00 إلى 18:30. لشركات الباص والترام اشتراكات شهرية خاصة بالمنطقة؛ الأداة تخبرك باسم الشركة لتسألها إذا كانت مصاريفك عالية.</p>
<p><b>2027:</b> أعلنت NS زيادة متوسطة 4.7% من 1 يناير 2027، مع خصومات أكبر في بعض الرحلات خارج الذروة. سنحدّث الأرقام عند نشر قائمة الأسعار الرسمية الجديدة.</p>
</section>
<section><h2>أكبر توفير: الطلاب والشباب والأطفال</h2>
<ul>
<li><b>طلاب MBO وHBO والجامعة:</b> اطلب <b>studentenreisproduct</b> من DUO. تسافر مجاناً بالقطار والباص والترام في أيام الأسبوع أو في العطلة (حسب اختيارك)، وبخصم في باقي الأوقات. اقرأ <a href="/articles/student-finance.html">دليل التمويل الدراسي</a>.</li>
<li><b>من 12 إلى 18 سنة:</b> اشتراك NS Dal Voordeel مجاني للشباب، وكثير من شركات الباص تعطي خصماً للشباب.</li>
<li><b>الأطفال من 4 إلى 11 سنة:</b> مجاناً بالقطار مع بالغ يدفع (Kids Vrij، تحتاج OV-chipkaart شخصية)، وتحت 4 سنوات مجاناً.</li>
<li><b>65 سنة فأكثر:</b> اسأل عن خصم المتقاعدين لدى شركة الباص، واشتراكات NS الخاصة بهذه الفئة.</li>
</ul>
</section>
'''

NL_BODY = f'''
<section><h2>Moet ik een abonnement bij 3 vervoerders nemen (trein, bus en tram)? Nee</h2>
<p>Dat is de vraag die we het vaakst horen. In Nederland is <b>één betaalmiddel genoeg voor alle vervoerders</b>: NS, Arriva, Qbuzz, RET, GVB, HTM en de rest. U betaalt op een van twee manieren:</p>
<ul>
<li><b>OVpay:</b> uw bankpas (debit of credit) of telefoon. U houdt die bij het in- en uitstappen tegen de paal; het bedrag wordt van uw rekening afgeschreven. Geen saldo vooraf nodig.</li>
<li><b>OV-chipkaart:</b> een kaart met saldo. Voor de trein hebt u meestal minstens € 20 saldo nodig bij het inchecken. De OV-chipkaart wordt tot eind 2027 vervangen door OVpay en de nieuwe OV-pas.</li>
</ul>
<p>NS-abonnementen en het studentenreisproduct staan voorlopig nog op een persoonlijke OV-chipkaart; voor losse reizen is OVpay genoeg.</p>
<p>Een abonnement bij een vervoerder is <b>optioneel</b>: neem het alleen als het goedkoper is dan per reis betalen. De rekenhulp hierboven rekent dat voor u uit. Vergeet nooit in te checken bij het instappen en uit te checken bij het uitstappen, in elk vervoermiddel.</p>
<p>Lees ook <a href="/nl/articles/ns-train-ov-chipkaart-ovpay.html">trein en ov: NS-kaartje, OV-chipkaart en OVpay</a>.</p>
</section>
<section><h2>Hoe berekent de rekenhulp de prijs?</h2>
<ul>
<li><b>Trein:</b> we nemen de echte spoorafstand tussen de stations uit de officiële open dienstregeling en passen de officiële NS-tabel 2026 per tariefeenheid toe. Voorbeeld: 0 t/m 8 eenheden = {eur(3.00)}, 50 eenheden = {eur(12.40)}, 200 of meer = {eur(33.30)}.</li>
<li><b>Bus, tram en metro:</b> landelijk basistarief {eur(1.16)} in 2026 plus ongeveer {eur(0.20)} per kilometer. Het kilometertarief verschilt per regio, van {eur(0.192)} tot {eur(0.215)}.</li>
<li><b>Vervoerders:</b> welke vervoerder bij uw adres en bij het station stopt, halen we uit de officiële dienstregelingsdata (NDOV).</li>
<li><b>Wisselt u van treinvervoerder</b> (bijvoorbeeld Arriva en daarna NS), dan betaalt u opnieuw een starttarief; dat tellen we mee.</li>
</ul>
<p>De uitkomst is een goede schatting, geen kaartje. Voor vertrektijden en de exacte prijs opent u de reis in de NS-app, bij 9292 of in Google Maps via de knop bij de uitkomst.</p>
</section>
<section><h2>NS-abonnementen 2026: wanneer lonen ze?</h2>
<table><thead><tr><th>Abonnement (NS Flex, 2e klas)</th><th>Prijs per maand 2026</th><th>Voor wie?</th></tr></thead><tbody>
<tr><td>Dal Voordeel: 40% korting buiten de spits en in het weekend</td><td>{eur(6.35)}</td><td>Wie na 9 uur of in het weekend reist. Gratis voor jongeren.</td></tr>
<tr><td>Traject Vrij: onbeperkt tussen twee stations</td><td>van {eur(68.30)} (t/m 8 eenheden) tot {eur(399.95)}</td><td>Wie elke dag hetzelfde traject naar school of werk reist.</td></tr>
<tr><td>Dal Vrij: gratis met alle treinen buiten de spits</td><td>{eur(127.95)}</td><td>Wie veel buiten de spits reist.</td></tr>
<tr><td>Weekend Vrij: gratis in het weekend</td><td>{eur(39.50)}</td><td>Weekendbezoek aan familie.</td></tr>
<tr><td>Altijd Vrij: onbeperkt met alle treinen</td><td>{eur(399.95)}</td><td>Wie dagelijks lange afstanden reist.</td></tr>
</tbody></table>
<p>Spits: werkdagen van 06:30 tot 09:00 en van 16:00 tot 18:30. Bus- en tramvervoerders hebben eigen maand- of regioabonnementen; de rekenhulp noemt de vervoerder, zodat u kunt navragen of dat goedkoper is.</p>
<p><b>2027:</b> NS verhoogt de prijzen per 1 januari 2027 gemiddeld 4,7%, met meer korting op sommige reizen buiten de spits. We passen de cijfers aan zodra de nieuwe officiële prijslijst verschijnt.</p>
</section>
<section><h2>De grootste besparing: studenten, jongeren en kinderen</h2>
<ul>
<li><b>Studenten mbo, hbo en wo:</b> vraag het <b>studentenreisproduct</b> aan bij DUO. U reist doordeweeks of in het weekend (naar keuze) gratis met trein, bus en tram, en met korting op de andere momenten. Lees <a href="/nl/articles/student-finance.html">studiefinanciering uitgelegd</a>.</li>
<li><b>12 t/m 18 jaar:</b> het NS Dal Voordeel-abonnement is gratis voor jongeren, en veel busvervoerders hebben jongerenkorting.</li>
<li><b>Kinderen van 4 t/m 11 jaar:</b> gratis met de trein met een betalende volwassene (Kids Vrij, persoonlijke OV-chipkaart nodig); onder de 4 jaar gratis.</li>
<li><b>65 of ouder:</b> vraag uw busvervoerder naar ouderenkorting en kijk naar de NS-abonnementen voor 65-plussers.</li>
</ul>
</section>
'''

AR_FAQ = [
    ('هل أحتاج اشتراكاً عند كل شركة مواصلات؟', 'لا. بطاقة واحدة (OVpay أو OV-chipkaart) تعمل في كل القطارات والباصات والترام والمترو في هولندا. الاشتراك اختياري ويستحق فقط إذا وفّر لك المال.'),
    ('كيف أعرف أي شركة تشغّل الباص قرب بيتي؟', 'اكتب عنوانك في الأداة. نعرض الشركات التي تقف قرب عنوانك وقرب المحطة، من بيانات المواعيد الرسمية، مع رابط موقع كل شركة.'),
    ('لماذا يختلف السعر قليلاً عن تطبيق NS؟', 'نحسب طول السكة من بيانات المواعيد، بينما NS تستخدم جدول وحدات تعرفة ثابتاً لكل محطتين. الفرق عادة بضع عشرات من السنتات. السعر الدقيق يظهر في تطبيق NS أو عند تسجيل الخروج.'),
    ('هل تعرض الأداة مواعيد القطارات؟', 'لا، الأداة تحسب الطريق والسعر والاشتراك الأوفر. للمواعيد المباشرة استخدم زر خرائط Google أو 9292 أو تطبيق NS في النتيجة.'),
    ('ما الأرخص للطالب؟', 'studentenreisproduct من DUO: سفر مجاني في أيام الأسبوع أو في العطلة. اطلبه عبر حسابك في DUO قبل أن تبدأ الدراسة.'),
    ('هل تُحفظ عناويني؟', 'لا. العنوان يُرسل فقط إلى خدمة العناوين الحكومية PDOK لتحديد موقعه، والحساب يتم داخل متصفحك.'),
]
NL_FAQ = [
    ('Heb ik een abonnement per vervoerder nodig?', 'Nee. Eén betaalmiddel (OVpay of OV-chipkaart) werkt in alle treinen, bussen, trams en metro’s in Nederland. Een abonnement is optioneel en loont alleen als het geld bespaart.'),
    ('Hoe weet ik welke vervoerder de bus bij mijn huis rijdt?', 'Vul uw adres in. We tonen de vervoerders die bij uw adres en bij het station stoppen, op basis van de officiële dienstregelingsdata, met een link naar hun website.'),
    ('Waarom wijkt de prijs iets af van de NS-app?', 'Wij rekenen met de spoorafstand uit de dienstregeling; NS gebruikt een vaste tabel met tariefeenheden per stationspaar. Het verschil is meestal enkele dubbeltjes. De exacte prijs ziet u in de NS-app of bij het uitchecken.'),
    ('Toont de rekenhulp vertrektijden?', 'Nee, de rekenhulp berekent route, prijs en het voordeligste abonnement. Voor actuele vertrektijden gebruikt u de knop naar Google Maps, 9292 of de NS-app.'),
    ('Wat is het goedkoopst voor studenten?', 'Het studentenreisproduct van DUO: gratis reizen doordeweeks of in het weekend. Vraag het aan via Mijn DUO voordat uw opleiding begint.'),
    ('Worden mijn adressen bewaard?', 'Nee. Uw adres gaat alleen naar de adresservice van de overheid (PDOK) om de locatie te vinden; de berekening gebeurt in uw browser.'),
]
AI = {
    'ar': 'راجع الناشر أحمد الزعبي هذه الأداة ومصادر بياناتها. النتيجة تقديرية وليست قراراً رسمياً.',
    'nl': 'De uitgever Ahmad Alzoubi heeft deze tool en de databronnen gecontroleerd. De uitkomst is een schatting, geen officieel besluit.',
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
