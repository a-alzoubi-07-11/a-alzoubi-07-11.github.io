from a_student_finance import T
SLUG='minimum-wage-netherlands'
SRC=[('Rijksoverheid · Bedragen minimumloon 2026','https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026'),
('Government.nl · Minimum wage amounts','https://www.government.nl/themes/work/minimum-wage/minimum-wage-amounts'),
('Rijksoverheid · Bedragen minimumloon bbl-opleiding 2026','https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon-bbl-opleiding/bedragen-minimumloon-bbl-2026'),
('Rijksoverheid · Hoger minimumjeugdloon vanaf 2027 (17-04-2026)','https://www.rijksoverheid.nl/actueel/nieuws/2026/04/17/hoger-minimumjeugdloon-vanaf-2027')]
YOUTH=[['21+','14.71','14.99'],['20','11.77','11.99'],['19','8.83','8.99'],['18','7.36','7.50'],['17','5.81','5.92'],['16','5.07','5.17'],['15','4.41','4.50']]
BBL=[['21+','14.71','14.99'],['20','9.05','9.22'],['19','7.72','7.87'],['18','6.69','6.82'],['17','5.81','5.92'],['16','5.07','5.17'],['15','4.41','4.50']]
def nl(rows): return [[r[0],r[1].replace('.',','),r[2].replace('.',',')] for r in rows]
AR=dict(title='الحد الأدنى للأجر في هولندا 2026: الأجر الساعي حسب العمر، وكيف تحسب راتبك الشهري',
crumb='الحد الأدنى للأجر',
desc='الحد الأدنى للأجر في هولندا من 1 يوليو 2026: 14.99 يورو في الساعة (21+). جدول الأعمار، جدول BBL، طريقة تحويله إلى راتب أسبوعي وشهري، وما الذي سيتغير للشباب في 2027.',
summary='<ol><li>منذ 1 يناير 2024 الحد الأدنى <strong>بالساعة</strong> فقط؛ لم يعد هناك حد أدنى شهري أو أسبوعي أو يومي ثابت.</li><li>من <strong>1 يوليو 2026</strong>: <strong>14.99 يورو إجمالي للساعة</strong> لمن هم 21 سنة فأكثر (14.71 من 1 يناير 2026).</li><li>من هم دون 21 يأخذون نسبة تتوقف على العمر؛ وطلاب <strong>BBL</strong> لهم جدول أدنى خاص حتى نهاية 2026.</li><li>الراتب الشهري = الأجر الساعي × عدد ساعات العمل الرسمية، فقد يختلف من شهر لآخر.</li><li>الأرقام <strong>إجمالية قبل الضريبة</strong>؛ ما يصلك صافياً أقل (<a href="/articles/dutch-payslip-explained.html">شرح قسيمة الراتب</a>).</li></ol>',
body=(
'<h2 id="amounts">الأرقام الحالية</h2><p>الأجر الأدنى القانوني هو المبلغ <strong>الإجمالي قبل الضريبة</strong> الذي يجب أن يُدفع لكل ساعة عمل. يتغير مرتين في السنة (1 يناير و1 يوليو). هذه أرقام الحكومة الهولندية:</p>'
+T(YOUTH,['العمر','من 1 يناير 2026 (يورو/ساعة)','من 1 يوليو 2026 (يورو/ساعة)'])
+'<p>كل من بلغ 15 سنة فأكثر يجب أن يُدفع له على الأقل الحد الأدنى المطبّق على عمره. من يبلغ 21 يستحق الرقم الكامل.</p>'
'<h2 id="monthly">كيف أحوّله إلى راتب أسبوعي أو شهري؟</h2><p>لا يوجد رقم شهري رسمي ثابت. الراتب يتبع <strong>ساعات العمل الرسمية</strong>، وهي تشمل ساعات العمل الفعلية وساعات الإجازة المأخوذة وساعات المرض المدفوعة. لذلك قد تختلف من شهر لآخر لأن بعض الأشهر فيها أيام عمل أكثر. وإن اتفقتَ مع صاحب العمل على عدد ثابت من الساعات أسبوعياً فيمكن الاتفاق على راتب شهري ثابت.</p>'
'<p>تقدير تقريبي لمن عمره 21+ (من 1 يوليو 2026): الأجر الساعي × ساعات الأسبوع × 52 ÷ 12.</p>'
+T([['32 ساعة','14.99 × 32 × 52 ÷ 12','≈ 2,078.6'],['36 ساعة','14.99 × 36 × 52 ÷ 12','≈ 2,338.4'],['38 ساعة','14.99 × 38 × 52 ÷ 12','≈ 2,468.3'],['40 ساعة','14.99 × 40 × 52 ÷ 12','≈ 2,598.3']],['ساعات الأسبوع','الحساب','إجمالي شهري تقريبي (يورو)'])
+'<ul><li>هذه <strong>أدنى حد</strong>؛ كثير من العقود الجماعية (CAO) تدفع أكثر.</li><li>الأرقام تقديرية: تحتسب شهراً متوسطاً، وراتبك الفعلي يتبع احتساب صاحب العمل.</li><li>الحد الأدنى لا يشمل عادة <strong>بدل العطلة</strong> (يُدفع عادة 8% إضافة)، فاقرأ عقدك أو CAO لتتأكد.</li></ul>'
'<h2 id="youth">الشباب وطلاب BBL</h2><p>طلاب مسار <strong>BBL</strong> (دراسة مع عمل، انظر <a href="/articles/bol-bbl-comparison.html">BOL أم BBL</a>) يطبّق عليهم جدول أدنى خاص حتى نهاية 2026:</p>'
+T(BBL,['العمر','BBL من 1 يناير 2026','BBL من 1 يوليو 2026'])
+'<p>مثلاً من عمره 20 سنة: الحد العام 11.99 يورو/ساعة، لكن في BBL 9.22 يورو/ساعة. <strong>تنبيه:</strong> إن كنت طالب BBL فتحقق من أن جدولك هو المطبّق على عقدك.</p>'
'<h2 id="2027">ما الذي سيتغير في 2027؟</h2><p>أعلنت الحكومة في 17 أبريل 2026 رفع الحد الأدنى للشباب من 16 إلى 20 سنة <strong>اعتباراً من 1 يناير 2027</strong>. النسب الحالية والجديدة من الأجر الكامل:</p>'
+T([['20','80%','87.5%'],['19','60%','75%'],['18','50%','62.5%'],['17','39.5%','50%'],['16','34.5%','40%'],['15','30%','30% (بلا تغيير)']],['العمر','النسبة الحالية','بعد الرفع'])
+'<p>وأعلنت أيضاً أن الحد الأدنى لطلاب BBL يُساوى بالحد العام للشباب. هذه خطط معلنة؛ راجع صفحة الحكومة عند اقتراب الموعد قبل الاعتماد على أرقام 2027.</p>'
'<h2 id="check">كيف تتحقق من راتبك؟</h2><ol><li>اقرأ قسيمة الراتب: ابحث عن الأجر الساعي والساعات الرسمية.</li><li>اقسم <strong>الأجر الإجمالي</strong> على الساعات الرسمية وقارن بالجدول حسب عمرك وتاريخ الشهر.</li><li>إن كان الرقم أقل، اسأل صاحب العمل <strong>كتابياً</strong> (بريد إلكتروني) واحتفظ بنسخة.</li><li>إن لم يُصحَّح فاستشر نقابة أو جهة استشارة قانونية؛ والجهة المكلفة بالتفتيش على تطبيق الحد الأدنى هي Inspectie SZW.</li></ol>'
'<h2 id="mistakes">أخطاء شائعة</h2><ul><li><strong>مقارنة الصافي بالحد الأدنى.</strong> الأرقام الرسمية إجمالية.</li><li><strong>الحديث عن حد شهري ثابت.</strong> انتهى هذا منذ 2024.</li><li><strong>نسيان تاريخ التغيير.</strong> الأجر يتغير في يناير ويوليو.</li><li><strong>خلط BBL بالدراسة العادية:</strong> الجدول مختلف.</li><li><strong>الظن أن العقود المرنة لا يحميها الحد الأدنى.</strong> ساعاتك تُدفع بالحد الأدنى على الأقل (<a href="/articles/zero-hours-contract.html">عقد الصفر ساعة</a>، <a href="/articles/temporary-agency-work-rights.html">وكالات التوظيف</a>).</li></ul>'
'<p>للمزيد: <a href="/articles/employment-contracts-labor-law-2026.html">عقود العمل وقانون العمل</a>.</p>'),
faq=[('كم الحد الأدنى للأجر في هولندا اليوم؟','من 1 يوليو 2026: 14.99 يورو إجمالي للساعة لمن عمره 21 سنة فأكثر.'),
('هل يوجد حد أدنى شهري؟','لا. منذ 2024 الحد الأدنى بالساعة فقط، والراتب الشهري يتبع الساعات الرسمية.'),
('ما الأجر لمن عمره 18 سنة؟','7.50 يورو في الساعة من 1 يوليو 2026 (وفق الجدول العام).'),
('هل الرقم قبل الضريبة؟','نعم، إجمالي قبل الضريبة والاشتراكات.'),
('هل سيرتفع حد الشباب؟','أعلنت الحكومة رفعاً اعتباراً من 1 يناير 2027 لمن 16–20 سنة، وتحقق قبل الاعتماد على الأرقام.')],
src_note='أرقام الأجر الساعي ونسب 2027 من موقع الحكومة الهولندية (Rijksoverheid وGovernment.nl)، راجعناها في 4 أكتوبر 2026. المبالغ الشهرية في الجدول حسابات تقريبية منا وليست أرقاماً رسمية.')
NL=dict(title='Minimumloon 2026: minimumuurloon per leeftijd en wat het per maand betekent',
crumb='Minimumloon',
desc='Minimumloon vanaf 1 juli 2026: € 14,99 per uur (21+). Tabellen per leeftijd en voor bbl, omrekening naar week en maand, en wat er in 2027 verandert voor jongeren.',
summary='<ol><li>Sinds 1 januari 2024 geldt een minimum <strong>per uur</strong>; er is geen vast minimum maand-, week- of dagloon meer.</li><li>Per <strong>1 juli 2026</strong>: <strong>€ 14,99 bruto per uur</strong> voor 21 jaar en ouder (€ 14,71 vanaf 1 januari 2026).</li><li>Onder de 21 geldt een percentage per leeftijd; voor <strong>bbl</strong>-leerlingen is er tot eind 2026 een eigen, lagere tabel.</li><li>Maandloon = uurloon × officiele arbeidsduur; dat kan per maand verschillen.</li><li>Alle bedragen zijn <strong>bruto</strong> (<a href="/nl/articles/dutch-payslip-explained.html">loonstrook uitgelegd</a>).</li></ol>',
body=(
'<h2 id="amounts">De actuele bedragen</h2><p>Het wettelijk minimumloon is het brutobedrag per uur dat een werkgever minimaal moet betalen. Het wordt twee keer per jaar aangepast (1 januari en 1 juli).</p>'
+T(nl(YOUTH),['Leeftijd','Vanaf 1 januari 2026 (€/uur)','Vanaf 1 juli 2026 (€/uur)'])
+'<p>Iedereen vanaf 15 jaar moet minimaal het uurloon voor zijn leeftijd krijgen. Vanaf 21 jaar geldt het volledige bedrag.</p>'
'<h2 id="monthly">Omrekenen naar week of maand</h2><p>Er is geen officieel vast maandbedrag. Het loon volgt de <strong>officiele arbeidsduur</strong>: gewerkte uren, opgenomen verlofuren en uren ziekte met loondoorbetaling. Die kan per maand verschillen. Is een vast aantal uren per week afgesproken, dan mag een vast maandsalaris worden afgesproken.</p><p>Indicatie voor 21+ (vanaf 1 juli 2026): uurloon × uren per week × 52 ÷ 12.</p>'
+T([['32 uur','14,99 × 32 × 52 ÷ 12','≈ 2.078,6'],['36 uur','14,99 × 36 × 52 ÷ 12','≈ 2.338,4'],['38 uur','14,99 × 38 × 52 ÷ 12','≈ 2.468,3'],['40 uur','14,99 × 40 × 52 ÷ 12','≈ 2.598,3']],['Uren per week','Berekening','Bruto per maand, indicatie (€)'])
+'<ul><li>Dit is het <strong>minimum</strong>; veel cao-s betalen meer.</li><li>Het zijn eigen indicatieve berekeningen met een gemiddelde maand, geen officiele bedragen.</li><li>Vakantiegeld zit normaal gesproken niet in het minimumloon (meestal 8% extra); controleer je contract of cao.</li></ul>'
'<h2 id="youth">Jongeren en bbl</h2><p>Voor leerlingen in de <strong>bbl</strong> (werken en leren, zie <a href="/nl/articles/bol-bbl-comparison.html">bol of bbl</a>) geldt tot eind 2026 een eigen tabel:</p>'
+T(nl(BBL),['Leeftijd','Bbl vanaf 1 januari 2026','Bbl vanaf 1 juli 2026'])
+'<p>Voorbeeld: op je 20e is het algemene minimum € 11,99, maar in de bbl € 9,22 per uur. Controleer dus welke tabel voor jouw contract geldt.</p>'
'<h2 id="2027">Wat verandert er in 2027?</h2><p>Het kabinet maakte op 17 april 2026 bekend dat het minimumjeugdloon voor 16 tot en met 20 jaar <strong>per 1 januari 2027</strong> stijgt. Percentages van het volledige minimumloon:</p>'
+T([['20','80%','87,5%'],['19','60%','75%'],['18','50%','62,5%'],['17','39,5%','50%'],['16','34,5%','40%'],['15','30%','30% (ongewijzigd)']],['Leeftijd','Huidig percentage','Na verhoging'])
+'<p>Ook het bbl-minimumjeugdloon wordt gelijkgetrokken met het reguliere jeugdloon. Dit zijn aangekondigde plannen; controleer de officiele pagina voordat je op bedragen voor 2027 rekent.</p>'
'<h2 id="check">Zo controleer je je loon</h2><ol><li>Bekijk je loonstrook: uurloon en officiele uren.</li><li>Deel het <strong>brutoloon</strong> door de officiele uren en vergelijk met de tabel voor jouw leeftijd en maand.</li><li>Is het lager, vraag het je werkgever <strong>schriftelijk</strong> (e-mail) en bewaar een kopie.</li><li>Wordt het niet hersteld, vraag advies bij een vakbond of juridisch loket; de Inspectie SZW houdt toezicht op de naleving van het minimumloon.</li></ol>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ul><li><strong>Netto vergelijken met het minimumloon.</strong> De bedragen zijn bruto.</li><li><strong>Uitgaan van een vast maandminimum.</strong> Dat is er sinds 2024 niet meer.</li><li><strong>De wijzigingsdatum vergeten.</strong> Januari en juli.</li><li><strong>Bbl en gewone tabel door elkaar halen.</strong></li><li><strong>Denken dat flexcontracten uitgezonderd zijn.</strong> Elk uur is minimaal het minimumloon (<a href="/nl/articles/zero-hours-contract.html">nulurencontract</a>, <a href="/nl/articles/temporary-agency-work-rights.html">uitzendwerk</a>).</li></ul>'
'<p>Meer: <a href="/nl/articles/employment-contracts-labor-law-2026.html">arbeidscontracten en arbeidsrecht</a>.</p>'),
faq=[('Hoeveel is het minimumloon nu?','Vanaf 1 juli 2026: € 14,99 bruto per uur voor 21 jaar en ouder.'),
('Is er een minimum maandloon?','Nee. Sinds 2024 alleen per uur; het maandloon volgt de officiele uren.'),
('Wat is het minimumloon op 18 jaar?','€ 7,50 per uur vanaf 1 juli 2026 (algemene tabel).'),
('Is het bedrag bruto?','Ja, voor loonheffing en premies.'),
('Gaat het jeugdloon omhoog?','Het kabinet kondigde een verhoging aan per 1 januari 2027 voor 16 tot en met 20 jaar; controleer de actuele cijfers.')],
src_note='Uurbedragen en percentages voor 2027 komen van Rijksoverheid en Government.nl, gecontroleerd op 4 oktober 2026. De maandbedragen in de tabel zijn onze eigen indicatieve berekeningen.')
