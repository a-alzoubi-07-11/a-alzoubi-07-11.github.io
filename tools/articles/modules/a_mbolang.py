from a_student_finance import T
SLUG='mbo-dutch-language-options'
R='https://www.rijksoverheid.nl/'
SRC=[('Rijksoverheid · Uit welke mbo-opleidingen kan ik kiezen?',R+'vraag-en-antwoord/middelbaar-beroepsonderwijs/uit-welke-mbo-opleidingen-kan-ik-kiezen'),
('Rijksoverheid · Taalexamens mbo',R+'onderwerpen/basisvaardigheden/vraag-en-antwoord/taalexamens-mbo'),
('Rijksoverheid · Aanmelden mbo',R+'vraag-en-antwoord/middelbaar-beroepsonderwijs/aanmelden-mbo'),
('Rijksoverheid · Hoogte lesgeld en cursusgeld mbo',R+'vraag-en-antwoord/middelbaar-beroepsonderwijs/hoogte-lesgeld-en-cursusgeld-mbo'),
('Staatsexamens Nt2 · Wat is het staatsexamen Nt2?','https://www.staatsexamensnt2.nl/over-het-staatsexamen-nt2/wat-is-het-staatsexamen-nt2'),
('Rijksoverheid · Nieuwe Wet inburgering (onderwijsroute)','https://www.rijksoverheid.nl/themas/migratie-en-reizen/inburgeren-in-nederland/nieuwe-wet-inburgering')]

AR=dict(title='اللغة الهولندية ودراسة MBO للقادمين الجدد 2026: شروط الدخول لكل مستوى، مستوى اللغة 2F و3F، امتحان NT2، مسار التعليم في الاندماج، التسجيل قبل 1 أبريل، والرسوم',
crumb='اللغة وMBO',
desc='دليل عميق للقادم الجديد الذي يريد دراسة MBO: شروط الدخول للمستويات 1–4 (المستوى 1 دون شهادة من 16 سنة)، امتحانات الهولندية عند التخرج (2F للمستويات 1–3 و3F للمستوى 4)، دور امتحان الدولة NT2 B1، مسار التعليم في الاندماج، التسجيل قبل 1 أبريل لضمان القبول، والرسوم الدراسية 1,511 يورو لـBOL في 2026/2027.',
summary='<ol><li><strong>المستوى 1 (Entree)</strong>: لا يتطلب شهادة، العمر 16 سنة على الأقل في 1 أغسطس، ومدته سنة.</li><li><strong>المستوى 2</strong>: شهادة vmbo أو ما يعادلها، أو إكمال Entree. <strong>المستويان 3 و4</strong>: vmbo أو المستوى 2 أو ما يعادل havo/vwo.</li><li><strong>عند التخرج</strong> امتحان هولندية: <strong>2F</strong> للمستويات 1–3، و<strong>3F</strong> للمستوى 4.</li><li>كثير من المدارس تطلب من القادمين الجدد مستوى لغة قبل البدء (غالباً قريباً من A2–B1)؛ <strong>امتحان الدولة NT2 B1</strong> مصمم أصلاً لمن يريد دراسة MBO.</li><li><strong>سجّل قبل 1 أبريل</strong> ليكون لك حق القبول. <strong>الرسوم</strong> لمن عمره 18+: BOL 1,511 يورو في 2026/2027.</li></ol>',
body=(
'<h2 id="levels">شروط الدخول لكل مستوى</h2>'
+T([['المستوى 1: Entree','لا شهادة مطلوبة؛ 16 سنة على الأقل في 1 أغسطس؛ سنة واحدة','الباب لمن لا يملك شهادة معترفاً بها'],
    ['المستوى 2: مساعد مهني','شهادة lbo/vbo/vmbo، أو إكمال Entree، أو إثبات 3 سنوات havo/vwo','مثلاً مساعد في الرعاية أو المستودع'],
    ['المستوى 3: مهني مستقل','vmbo (المسار المناسب)، أو المستوى 2، أو إثبات havo/vwo','مثلاً Verzorgende IG'],
    ['المستوى 4: متوسط/متخصص','vmbo (المسار المناسب) أو havo/vwo؛ والتخصص 4 بعد المستوى 3','يفتح الطريق إلى HBO']],
   ['المستوى','شرط الدخول','ملاحظة'])
+'<p>شهادتك الأجنبية قد تعادل vmbo أو havo أو أكثر: اطلب <strong>معادلتها</strong> أولاً (مجانية للاجئين) (<a href="/articles/diploma-evaluation-sbb.html">دليل معادلة الشهادة</a>).</p>'
'<h2 id="language">ما مستوى الهولندية المطلوب؟</h2><ul><li><strong>عند التخرج</strong> تجري امتحاناً مركزياً في الهولندية على الحاسوب: <strong>2F</strong> للمستويات 1 و2 و3 (90 دقيقة)، و<strong>3F</strong> للمستوى 4 (120 دقيقة).</li><li><strong>عند البدء</strong>: لا يوجد مستوى وطني موحد للقادمين الجدد؛ كل مدرسة تحدد شروطها الإضافية وتعلنها <strong>قبل 1 فبراير</strong>، وقد تطلب مقابلة أو اختبار لغة.</li><li><strong>امتحان الدولة NT2 البرنامج I (B1)</strong> مصمم «لمن يريد دراسة MBO» بمهام بمستوى MBO 3–4، ويُقبل كإثبات قوي لدى المدارس (<a href="/articles/nt2-b1-exam-guide.html">دليل NT2</a>).</li></ul>'
'<h2 id="routes">طرق الوصول إلى MBO</h2>'
+T([['مسار التعليم في الاندماج (onderwijsroute)','للشباب غالباً: لغة B1 أو أعلى وتحضير لـMBO أو HBO أو الجامعة، تنظمه البلدية (<a href="/articles/inburgering-integration-law-2026.html">الاندماج</a>).'],
    ['سنة تحضيرية أو برنامج انتقالي في المدرسة','كثير من مدارس MBO تقدم صفوف NT2 أو برامج تحضيرية قبل المساق المهني؛ اسأل المدرسة.'],
    ['Entree (المستوى 1)','ابدأ دون شهادة ثم انتقل للمستوى 2.'],
    ['BBL (عمل ودراسة)','تعمل وتتقاضى أجراً وتدرس يوماً في الأسبوع؛ فرص عمل عالية جداً بعد التخرج (<a href="/articles/bol-bbl-comparison.html">BOL أم BBL</a>).']],
   ['الطريق','التفاصيل'])
+'<h2 id="apply">التسجيل والمواعيد</h2><ol><li><strong>قبل 1 فبراير</strong>: المدارس تعلن الشروط الإضافية للمساقات.</li><li><strong>قبل 1 أبريل</strong>: سجّل ليكون لك <strong>حق القبول</strong> في المساق (إن استوفيت الشروط).</li><li>مقابلة التعارف (intake) قد تكون إلزامية.</li><li>لمن عمره 18+ قد تطلب المدرسة إثبات دفع الرسوم.</li></ol><p>تفاصيل الشروط العامة في <a href="/articles/mbo-conditions.html">دليل شروط MBO</a>.</p>'
'<h2 id="costs">الرسوم والدعم المالي</h2>'
+T([['BOL، 18 سنة فأكثر في 1 أغسطس','1,511 يورو (2026/2027)؛ 1,554 يورو (2027/2028)'],['BBL المستويان 1–2','314 يورو (2026/2027)'],['BBL المستويان 3–4','762 يورو (2026/2027)'],['تحت 18 سنة','لا رسوم دراسية']],['الحالة','الرسوم'])
+'<p>لطلاب BOL من 18 سنة قد يحق لهم <strong>تمويل الدراسة من DUO</strong> (<a href="/articles/student-finance.html">دليل تمويل الدراسة</a>). المدارس الخاصة تحدد رسومها بنفسها.</p>'
'<h2 id="plan">خطة عملية من الصفر</h2><ol><li>عادل شهادتك (IDW).</li><li>حدد المهنة (انظر <a href="/articles/trending-jobs-2026.html">المهن المطلوبة</a>).</li><li>اسأل 2–3 مدارس MBO عن شروط اللغة والبرامج التحضيرية.</li><li>استهدف NT2 B1 أو أجزاءه الأقوى أولاً.</li><li>سجّل قبل 1 أبريل.</li><li>فكّر في BBL إن كنت تحتاج دخلاً.</li></ol>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>انتظار «إتقان» الهولندية قبل السؤال عن البرامج التحضيرية.</li><li>التسجيل بعد 1 أبريل وفقدان حق القبول.</li><li>عدم معادلة الشهادة، فتبدأ بمستوى أدنى من اللازم.</li><li>نسيان امتحان 2F/3F في خطة الدراسة.</li></ol>'),
faq=[('هل أستطيع دراسة MBO دون شهادة؟','نعم، المستوى 1 (Entree) لا يتطلب شهادة، بشرط 16 سنة على الأقل.'),
('ما مستوى الهولندية المطلوب؟','عند التخرج 2F (المستويات 1–3) أو 3F (المستوى 4). عند البدء تحدد كل مدرسة شروطها؛ NT2 B1 مصمم لمن يريد MBO.'),
('متى يجب أن أسجل؟','قبل 1 أبريل لضمان حق القبول.'),
('كم الرسوم؟','لـ18+ في BOL: 1,511 يورو في 2026/2027. BBL: 314 أو 762 يورو حسب المستوى.'),
('ما هو مسار التعليم في الاندماج؟','مسار للشباب غالباً للوصول إلى B1 أو أعلى والتحضير لـMBO أو HBO أو الجامعة.')],
src_note='راجعنا Rijksoverheid وstaatsexamensnt2.nl في 5 أكتوبر 2026. شروط اللغة عند البدء تختلف بين المدارس؛ اسأل المدرسة مباشرة.')

NL=dict(title='Nederlands en mbo voor nieuwkomers in 2026: toelating per niveau, taalniveau 2F en 3F, staatsexamen Nt2, onderwijsroute, aanmelden vóór 1 april en lesgeld',
crumb='Taal en mbo',
desc='Uitgebreide gids voor nieuwkomers die mbo willen doen: toelatingseisen niveau 1–4 (entree zonder diploma vanaf 16), taalexamens 2F (niveau 1–3) en 3F (niveau 4), de rol van staatsexamen Nt2 B1, de onderwijsroute in de inburgering, aanmelden vóór 1 april en lesgeld € 1.511 (bol 2026/2027).',
summary='<ol><li><strong>Niveau 1 (entree)</strong>: geen diploma nodig, minimaal 16 op 1 augustus, 1 jaar.</li><li><strong>Niveau 2</strong>: vmbo of gelijkwaardig, of entree. <strong>Niveau 3 en 4</strong>: vmbo, niveau 2 of havo/vwo-bewijs.</li><li><strong>Bij diplomering</strong> een taalexamen: <strong>2F</strong> (niveau 1–3), <strong>3F</strong> (niveau 4).</li><li>Scholen bepalen zelf extra taaleisen bij de start; <strong>staatsexamen Nt2 programma I (B1)</strong> is gemaakt voor wie mbo wil doen.</li><li><strong>Aanmelden vóór 1 april</strong> voor recht op toelating. <strong>Lesgeld</strong> 18+: bol € 1.511 in 2026/2027.</li></ol>',
body=(
'<h2 id="levels">Toelating per niveau</h2>'
+T([['Niveau 1: entree','Geen diploma; minimaal 16 op 1 augustus; 1 jaar','Instap zonder erkend diploma'],['Niveau 2','Diploma lbo/vbo/vmbo, entree afgerond, of bewijs eerste 3 jaar havo/vwo','Bijv. helpende of magazijn'],['Niveau 3','Vmbo (passende leerweg), niveau 2 of havo/vwo-bewijs','Bijv. verzorgende IG'],['Niveau 4','Vmbo (passende leerweg) of havo/vwo; specialist na niveau 3','Doorstroom naar hbo']],['Niveau','Toelating','Opmerking'])
+'<p>Laat je buitenlandse diploma eerst <strong>waarderen</strong> (gratis voor vluchtelingen) (<a href="/nl/articles/diploma-evaluation-sbb.html">diplomawaardering</a>).</p>'
'<h2 id="language">Welk taalniveau?</h2><ul><li><strong>Bij diplomering</strong>: centraal digitaal examen Nederlands: <strong>2F</strong> voor niveau 1, 2 en 3 (90 min), <strong>3F</strong> voor niveau 4 (120 min).</li><li><strong>Bij de start</strong>: geen landelijke eis voor nieuwkomers; scholen maken extra toelatingscriteria uiterlijk <strong>1 februari</strong> bekend en kunnen een intake of taaltoets vragen.</li><li><strong>Staatsexamen Nt2 programma I (B1)</strong> is bedoeld «als u een mbo-opleiding wilt doen» (<a href="/nl/articles/nt2-b1-exam-guide.html">Nt2</a>).</li></ul>'
'<h2 id="routes">Routes naar het mbo</h2>'
+T([['Onderwijsroute (inburgering)','Vooral jongeren: B1 of hoger en voorbereiding op mbo/hbo/wo, via de gemeente (<a href="/nl/articles/inburgering-integration-law-2026.html">inburgeren</a>).'],['Voorbereidend jaar of schakeltraject','Veel mbo-scholen bieden NT2-klassen of voorbereidende programma’s; vraag de school.'],['Entree','Start zonder diploma en stroom door naar niveau 2.'],['Bbl','Werken, loon en één dag school; zeer goede baankansen (<a href="/nl/articles/bol-bbl-comparison.html">bol of bbl</a>).']],['Route','Toelichting'])
+'<h2 id="apply">Aanmelden en data</h2><ol><li>Uiterlijk <strong>1 februari</strong>: scholen maken extra toelatingseisen bekend.</li><li>Vóór <strong>1 april</strong> aanmelden voor <strong>recht op toelating</strong>.</li><li>Intake kan verplicht zijn.</li><li>18+: bewijs van betaling lesgeld kan worden gevraagd.</li></ol><p>Zie ook <a href="/nl/articles/mbo-conditions.html">toelating mbo</a>.</p>'
'<h2 id="costs">Lesgeld en financiering</h2>'
+T([['Bol, 18+ op 1 augustus','€ 1.511 (2026/2027); € 1.554 (2027/2028)'],['Bbl niveau 1–2','€ 314 (2026/2027)'],['Bbl niveau 3–4','€ 762 (2026/2027)'],['Onder 18','Geen lesgeld']],['Situatie','Bedrag'])
+'<p>Bol-studenten vanaf 18 kunnen recht hebben op <strong>studiefinanciering</strong> (<a href="/nl/articles/student-finance.html">studiefinanciering</a>). Particuliere instellingen bepalen eigen tarieven.</p>'
'<h2 id="plan">Plan vanaf nul</h2><ol><li>Diploma laten waarderen (IDW).</li><li>Beroep kiezen (<a href="/nl/articles/trending-jobs-2026.html">kansrijke beroepen</a>).</li><li>2–3 mbo-scholen vragen naar taaleisen en voorbereidende programma’s.</li><li>Werk naar Nt2 B1 (sterkste onderdelen eerst).</li><li>Aanmelden vóór 1 april.</li><li>Overweeg bbl als je inkomen nodig hebt.</li></ol>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Wachten tot je «perfect» Nederlands spreekt.</li><li>Na 1 april aanmelden.</li><li>Geen diplomawaardering, waardoor je te laag instapt.</li><li>Het 2F/3F-examen vergeten.</li></ol>'),
faq=[('Kan ik zonder diploma naar het mbo?','Ja, entree (niveau 1) vraagt geen diploma; minimaal 16 jaar.'),
('Welk taalniveau heb ik nodig?','Bij diplomering 2F (niveau 1–3) of 3F (niveau 4). Bij de start bepaalt de school; Nt2 B1 is bedoeld voor mbo.'),
('Wanneer moet ik me aanmelden?','Vóór 1 april voor recht op toelating.'),
('Hoe hoog is het lesgeld?','Bol 18+: € 1.511 in 2026/2027; bbl € 314 of € 762.'),
('Wat is de onderwijsroute?','Een inburgeringsroute, vooral voor jongeren, naar B1 of hoger en vervolgonderwijs.')],
src_note='Gecontroleerd bij Rijksoverheid en staatsexamensnt2.nl op 5 oktober 2026. Taaleisen bij de start verschillen per school.')
