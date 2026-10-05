from a_student_finance import T
SLUG='unemployment-benefit-ww'
SRC=[('UWV · About unemployment benefit (WW)','https://www.uwv.nl/en/individuals/unemployment-benefit/about'),
('UWV · Hoelang krijg ik WW?','https://www.uwv.nl/nl/ww/hoelang-ww'),
('Rijksoverheid · Hoe lang heb ik recht op een WW-uitkering?','https://www.rijksoverheid.nl/onderwerpen/ww-uitkering/vraag-en-antwoord/hoe-lang-heb-ik-recht-op-een-ww-uitkering'),
('UWV · Hoogte WW','https://www.uwv.nl/nl/ww/hoogte-ww'),
('UWV · Maximum dagloon','https://www.uwv.nl/nl/premies-bedragen/maximum-dagloon'),
('UWV · Wanneer moet ik WW aanvragen?','https://www.uwv.nl/particulieren/werkloos/ik-word-werkloos/detail/wanneer-moet-ik-een-ww-uitkering-aanvragen'),
('UWV · Sollicitatieplicht','https://www.uwv.nl/nl/ww/sollicitatieplicht'),
('UWV · WW na ontslag','https://www.uwv.nl/nl/ww/ww-na-ontslag'),
('UWV · Ontslag met wederzijds goedvinden','https://www.uwv.nl/particulieren/ontslag/ik-word-ontslagen/detail/ontslag-met-wederzijds-goedvinden-of-instemming/ontslag-met-wederzijds-goedvinden'),
('UWV · Toeslag (Toeslagenwet)','https://www.uwv.nl/nl/toeslag'),
('Rijksoverheid · Prinsjesdag 2026: maatregelen SZW','https://www.rijksoverheid.nl/actueel/nieuws/2026/09/15/prinsjesdag-2026-maatregelen-op-het-gebied-van-szw')]

AR=dict(title='إعانة البطالة WW في هولندا 2026: الشروط، المدة حتى 24 شهراً، 75% ثم 70%، الطلب خلال أسبوع، التزامات البحث عن عمل، والفصل بالتراضي',
crumb='إعانة البطالة WW',
desc='دليل عميق لإعانة البطالة من UWV: شرط 26 أسبوع عمل من آخر 36، فقدان 5 ساعات أسبوعياً على الأقل، المدة 3 أشهر ثم شهر لكل سنة عمل حتى 24 شهراً، المبلغ 75% في أول شهرين ثم 70% بحد أقصى 309.91 يورو يومياً، الطلب من أسبوع قبل حتى أسبوع بعد آخر يوم، 4 أنشطة بحث كل 4 أسابيع، والبطالة بالخطأ، واتفاقية الإنهاء، وتأجيل تقصير WW إلى 2029.',
summary='<ol><li><strong>الشرط الأساسي:</strong> عملت كموظف <strong>26 أسبوعاً على الأقل من آخر 36 أسبوعاً</strong>، وفقدت 5 ساعات أسبوعياً على الأقل (أو نصف ساعاتك إن كنت تعمل أقل من 10).</li><li><strong>المدة:</strong> 3 أشهر أساساً؛ ومع «شرط السنوات» شهر عن كل سنة عمل، حتى <strong>24 شهراً</strong>.</li><li><strong>المبلغ:</strong> <strong>75%</strong> من أجرك في أول شهرين، ثم <strong>70%</strong>، بحد أقصى أجر يومي 309.91 يورو إجمالي (2026).</li><li><strong>اطلبها</strong> من أسبوع قبل حتى <strong>أسبوع بعد</strong> أول يوم بطالة؛ التأخير قد يقلل الإعانة.</li><li><strong>التزام:</strong> 4 أنشطة بحث عن عمل على الأقل كل 4 أسابيع، وإبلاغ دخلك شهرياً.</li><li>تقصير مدة WW المخطط <strong>أُجّل إلى 1 يناير 2029</strong>.</li></ol>',
body=(
'<h2 id="who">من يستحق WW؟</h2>'
+T([['كنت موظفاً مؤمّناً','عقد عمل (ليس عملاً حراً)'],['شرط الأسابيع','26 أسبوع عمل على الأقل في آخر 36 أسبوعاً قبل البطالة'],['فقدان الساعات','5 ساعات أسبوعياً على الأقل إن كنت تعمل 10 ساعات أو أكثر؛ أو نصف ساعاتك إن كنت تعمل أقل'],['متاح للعمل','يجب أن تكون قادراً ومستعداً للعمل'],['لست عاطلاً بخطئك','الفصل بسبب سلوكك أو الاستقالة دون سبب قد يُفقدك WW']],['الشرط','التفاصيل'])
+'<h2 id="duration">كم المدة؟</h2><ul><li><strong>شرط الأسابيع فقط:</strong> 3 أشهر.</li><li><strong>مع شرط السنوات</strong> (عملت 4 سنوات على الأقل من آخر 5): شهر عن كل سنة عمل في أول 10 سنوات، ثم نصف شهر عن كل سنة (من 2016). السنة التي تبدأ فيها WW لا تُحسب.</li><li><strong>الحد الأقصى 24 شهراً</strong>؛ وقد يكمّل الـCAO حتى 38 شهراً.</li><li>خطة تقصير WW إلى 12 شهراً <strong>أُجّلت إلى 1 يناير 2029</strong> (Prinsjesdag 2026) (<a href="/articles/prinsjesdag-2026-changes.html">التفاصيل</a>).</li></ul>'
'<h2 id="amount">كم المبلغ؟</h2>'
+T([['أول شهرين','<strong>75%</strong> من أجرك الشهري المحسوب لـWW'],['بعد ذلك','<strong>70%</strong>'],['الحد الأقصى للأجر اليومي (1 يناير 2026)','<strong>309.91 يورو</strong> إجمالي يومياً؛ يُراجع في 1 يناير و1 يوليو'],['إن كان المجموع تحت الحد الاجتماعي','قد تحصل على «تكملة» (Toeslagenwet) من UWV']],['الفترة','المبلغ'])
+'<p>WW دخل خاضع للضريبة. حدّث تقدير دخلك في Toeslagen فوراً، فانخفاض الدخل قد يرفع بدلاتك (<a href="/articles/toeslagen-income-update.html">كيف تحدّث دخلك</a>).</p>'
'<h2 id="apply">متى وكيف تطلب؟</h2><ol><li>اطلب من <strong>أسبوع قبل</strong> حتى <strong>أسبوع بعد</strong> أول يوم بطالة (اليوم الذي كنت ستعمل فيه لو بقيت وظيفتك).</li><li>عبر موقع UWV بـDigiD (<a href="/articles/digid-registration-guide.html">DigiD</a>).</li><li>جهّز: رسالة الفصل أو انتهاء العقد، آخر قسائم الراتب، بيانات البنك.</li><li>يقرر UWV خلال <strong>4 أسابيع</strong>.</li><li>إن تأخرت في الطلب فقد تحصل مؤقتاً على إعانة أقل أو لا شيء.</li></ol>'
'<h2 id="duties">التزاماتك أثناء WW</h2><ul><li><strong>4 أنشطة بحث عن عمل على الأقل كل 4 أسابيع</strong> ما لم يُتفق على غير ذلك.</li><li>سجّل أنشطتك (الطلبات، المقابلات) واحتفظ بالإثبات.</li><li>أبلغ كل دخل كل شهر.</li><li>اقبل العمل المناسب.</li><li>أبلغ قبل السفر للخارج.</li></ul>'
'<h2 id="fault">البطالة بالخطأ (verwijtbaar werkloos)</h2><p>إن فُصلت بسبب سلوكك (مثلاً فصل فوري لسبب خطير) أو استقلت دون سبب مقبول، قد تفقد WW. لذلك <strong>لا تستقل</strong> في خلاف قبل أن تستشير (<a href="/articles/employment-contracts-labor-law-2026.html">دليل عقد العمل</a>).</p>'
'<h2 id="vso">الفصل بالتراضي (vaststellingsovereenkomst)</h2><ul><li>تحتفظ عادة بحق WW، <strong>بشرط</strong> أن تذكر الاتفاقية أن صاحب العمل هو من بادر وأنك لست مذنباً.</li><li>تبدأ WW حسب UWV بعد انتهاء <strong>مهلة الإنذار القانونية</strong>؛ اتفق بوضوح على تاريخ الانتهاء.</li><li>مع الاتفاقية لا تحصل عادة على تعويض الفصل القانوني (transitievergoeding)، فتفاوض على تعويض بديل.</li><li>لا توقّع قبل الاستشارة (Juridisch Loket أو النقابة).</li></ul>'
'<h2 id="flex">عقود مؤقتة ووكالات واستدعاء</h2><p>الشروط نفسها تنطبق: الأسابيع الـ26 من آخر 36 تحسب كل أسبوع عملت فيه ولو قليلاً. احتفظ بقسائم رواتبك (<a href="/articles/temporary-agency-work-rights.html">الوكالات</a>، <a href="/articles/zero-hours-contract.html">عقود الاستدعاء</a>).</p>'
'<h2 id="after">بعد انتهاء WW</h2><p>إن لم تجد عملاً ولا تملك مالاً كافياً، قد يحق لك <a href="/articles/social-assistance-bijstand.html">المساعدة الاجتماعية (Bijstand)</a>. ابدأ الاستعداد قبل انتهاء WW بشهرين.</p>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>الطلب متأخراً أكثر من أسبوع.</li><li>الاستقالة في خلاف.</li><li>توقيع اتفاقية إنهاء دون نص «مبادرة صاحب العمل».</li><li>عدم تسجيل أنشطة البحث.</li><li>نسيان إبلاغ دخل جانبي.</li></ol>'),
faq=[('ما شرط الحصول على WW؟','عملت 26 أسبوعاً على الأقل من آخر 36 كموظف، وفقدت 5 ساعات أسبوعياً على الأقل (أو نصف ساعاتك إن كانت أقل من 10).'),
('كم مدة WW؟','3 أشهر أساساً، ومع شرط السنوات شهر عن كل سنة عمل، حتى 24 شهراً.'),
('كم المبلغ؟','75% من أجرك في أول شهرين ثم 70%، بحد أقصى 309.91 يورو يومياً إجمالي في 2026.'),
('متى أطلب؟','من أسبوع قبل حتى أسبوع بعد أول يوم بطالة.'),
('هل أفقد WW إن وقعت اتفاقية إنهاء؟','عادة لا، إن ذكرت أن صاحب العمل بادر وأنك لست مذنباً؛ وتبدأ بعد مهلة الإنذار.'),
('هل ستُقصّر WW؟','التقصير المخطط أُجّل إلى 1 يناير 2029.')],
src_note='راجعنا UWV وRijksoverheid في 5 أكتوبر 2026. الحد الأقصى للأجر اليومي يُعدَّل كل 1 يناير و1 يوليو؛ تحقق منه في UWV.')

NL=dict(title='WW-uitkering in 2026: voorwaarden, duur tot 24 maanden, 75% en dan 70%, aanvragen binnen een week, sollicitatieplicht en de vaststellingsovereenkomst',
crumb='WW-uitkering',
desc='Uitgebreide gids WW: wekeneis 26 van 36 weken, minimaal 5 uur verlies, duur 3 maanden plus een maand per gewerkt jaar tot 24 maanden, 75% de eerste 2 maanden en daarna 70% met maximumdagloon € 309,91, aanvragen vanaf een week vóór tot een week na, 4 sollicitatieactiviteiten per 4 weken, verwijtbare werkloosheid, vaststellingsovereenkomst en uitstel duurverkorting naar 2029.',
summary='<ol><li><strong>Wekeneis:</strong> minimaal <strong>26 van de laatste 36 weken</strong> gewerkt als werknemer, en minstens 5 uur per week verloren (of de helft bij minder dan 10 uur).</li><li><strong>Duur:</strong> 3 maanden; met de jareneis een maand per gewerkt jaar, tot <strong>24 maanden</strong>.</li><li><strong>Hoogte:</strong> <strong>75%</strong> de eerste 2 maanden, daarna <strong>70%</strong>; maximumdagloon € 309,91 bruto (2026).</li><li><strong>Aanvragen</strong> vanaf een week vóór tot <strong>een week na</strong> je eerste werkloze dag.</li><li><strong>Plicht:</strong> minimaal 4 sollicitatieactiviteiten per 4 weken; inkomsten maandelijks doorgeven.</li><li>De duurverkorting is <strong>uitgesteld tot 1 januari 2029</strong>.</li></ol>',
body=(
'<h2 id="who">Wie heeft recht?</h2>'
+T([['Verzekerd werknemer','Arbeidscontract (geen zzp)'],['Wekeneis','Minimaal 26 weken gewerkt in de 36 weken vóór werkloosheid'],['Urenverlies','Minstens 5 uur per week bij ≥ 10 uur; of de helft bij < 10 uur'],['Beschikbaar','Je kunt en wilt werken'],['Niet verwijtbaar','Ontslag door eigen schuld of zonder reden ontslag nemen kan WW kosten']],['Voorwaarde','Toelichting'])
+'<h2 id="duration">Duur</h2><ul><li><strong>Alleen wekeneis:</strong> 3 maanden.</li><li><strong>Met jareneis</strong> (4 van de laatste 5 jaar gewerkt): 1 maand per gewerkt jaar voor de eerste 10 jaar, daarna 0,5 maand per jaar (vanaf 2016). Het jaar waarin de WW start telt niet.</li><li><strong>Maximaal 24 maanden</strong>; via cao aanvulling tot 38 maanden mogelijk.</li><li>De verkorting naar 12 maanden is <strong>uitgesteld tot 1 januari 2029</strong> (<a href="/nl/articles/prinsjesdag-2026-changes.html">Prinsjesdag 2026</a>).</li></ul>'
'<h2 id="amount">Hoogte</h2>'
+T([['Eerste 2 maanden','<strong>75%</strong> van het WW-maandloon'],['Daarna','<strong>70%</strong>'],['Maximumdagloon (1 januari 2026)','<strong>€ 309,91</strong> bruto per dag; aanpassing 1 januari en 1 juli'],['Onder sociaal minimum','Mogelijk Toeslag (Toeslagenwet) van UWV']],['Periode','Bedrag'])
+'<p>Pas je inkomen bij Toeslagen direct aan (<a href="/nl/articles/toeslagen-income-update.html">inkomen doorgeven</a>).</p>'
'<h2 id="apply">Aanvragen</h2><ol><li>Vanaf <strong>een week vóór</strong> tot <strong>een week na</strong> je eerste werkloze dag.</li><li>Via UWV met DigiD (<a href="/nl/articles/digid-registration-guide.html">DigiD</a>).</li><li>Klaarleggen: ontslagbrief of einde contract, laatste loonstroken, bankgegevens.</li><li>UWV beslist binnen <strong>4 weken</strong>.</li><li>Te laat: mogelijk tijdelijk lagere of geen WW.</li></ol>'
'<h2 id="duties">Plichten</h2><ul><li><strong>Minimaal 4 sollicitatieactiviteiten per 4 weken</strong>, tenzij anders afgesproken.</li><li>Bewaar bewijs.</li><li>Inkomsten elke maand doorgeven.</li><li>Passend werk aanvaarden.</li><li>Buitenlandse reizen vooraf melden.</li></ul>'
'<h2 id="fault">Verwijtbaar werkloos</h2><p>Ontslag door eigen toedoen of zonder goede reden ontslag nemen kan je WW kosten. <strong>Neem geen ontslag</strong> in een conflict zonder advies (<a href="/nl/articles/employment-contracts-labor-law-2026.html">arbeidscontract</a>).</p>'
'<h2 id="vso">Vaststellingsovereenkomst</h2><ul><li>Meestal behoud van WW, <strong>als</strong> erin staat dat de werkgever het initiatief nam en jou niets te verwijten valt.</li><li>WW start volgens UWV pas na afloop van de wettelijke opzegtermijn; spreek de einddatum duidelijk af.</li><li>Geen wettelijke transitievergoeding; onderhandel over een vergoeding.</li><li>Niet tekenen zonder advies (Juridisch Loket of vakbond).</li></ul>'
'<h2 id="flex">Flex, uitzend en oproep</h2><p>Dezelfde wekeneis; elke week waarin je werkte telt. Bewaar loonstroken (<a href="/nl/articles/temporary-agency-work-rights.html">uitzendwerk</a>, <a href="/nl/articles/zero-hours-contract.html">oproepcontract</a>).</p>'
'<h2 id="after">Na de WW</h2><p>Geen werk en weinig geld? Mogelijk <a href="/nl/articles/social-assistance-bijstand.html">bijstand</a>. Bereid je twee maanden voor het einde voor.</p>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Meer dan een week te laat aanvragen.</li><li>Ontslag nemen in een conflict.</li><li>Een vaststellingsovereenkomst zonder «initiatief werkgever».</li><li>Sollicitaties niet vastleggen.</li><li>Bijverdiensten niet doorgeven.</li></ol>'),
faq=[('Wanneer heb ik recht op WW?','Na minimaal 26 van de laatste 36 weken werken als werknemer, bij een verlies van minstens 5 uur per week (of de helft bij minder dan 10 uur).'),
('Hoe lang krijg ik WW?','3 maanden; met de jareneis een maand per gewerkt jaar, tot 24 maanden.'),
('Hoe hoog is de WW?','75% de eerste 2 maanden, daarna 70%, met een maximumdagloon van € 309,91 bruto (2026).'),
('Wanneer moet ik aanvragen?','Vanaf een week vóór tot een week na je eerste werkloze dag.'),
('Verlies ik WW bij een vaststellingsovereenkomst?','Meestal niet als het initiatief bij de werkgever ligt en jou niets te verwijten valt; WW start na de opzegtermijn.'),
('Wordt de WW korter?','De verkorting is uitgesteld tot 1 januari 2029.')],
src_note='Gecontroleerd bij UWV en Rijksoverheid op 5 oktober 2026. Het maximumdagloon wordt per 1 januari en 1 juli aangepast; check UWV.')
