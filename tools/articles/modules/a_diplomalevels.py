from a_student_finance import T
SLUG='diploma-recognition-by-education-level'
N='https://www.nuffic.nl/onderwijssystemen/syrie'
SRC=[('Nuffic · Onderwijssysteem Syrië',N),
('Nuffic · Syrië: niveau van diploma’s (vergelijking met Nederlandse diploma’s)',N+'/niveau-van-diplomas'),
('Nuffic · Syrië: basis- en voortgezet onderwijs',N+'/basis-en-voortgezet-onderwijs'),
('Nuffic · Syrië: middelbaar beroepsonderwijs (technical/intermediate institutes)',N+'/middelbaar-beroepsonderwijs'),
('Nuffic · Syrië: hoger onderwijs (bachelor, master, doctor)',N+'/hoger-onderwijs'),
('Nuffic · Level of Dutch diplomas (NLQF en EQF)','https://www.nuffic.nl/en/education-systems/the-netherlands/level-of-dutch-diplomas'),
('Rijksoverheid · Hoe laat ik mijn buitenlandse diploma in Nederland waarderen of erkennen?','https://www.rijksoverheid.nl/vraag-en-antwoord/onderwijs-en-internationalisering/hoe-laat-ik-mijn-buitenlandse-diploma-in-nederland-waarderen-of-erkennen'),
('Rijksoverheid · Met welke diploma’s kan ik naar de universiteit of hogeschool? (21+-toelatingsonderzoek)','https://www.rijksoverheid.nl/onderwerpen/hoger-onderwijs/vraag-en-antwoord/met-welke-diploma-s-kan-ik-naar-de-universiteit-of-hogeschool'),
('Rijksoverheid · Leerplicht en kwalificatieplicht','https://www.rijksoverheid.nl/themas/onderwijs/leerplicht/leerplicht-en-kwalificatieplicht'),
('VO-raad · Onderwijs aan nieuwkomers (internationale schakelklas)','https://vo-raad.nl/onderwerpen/onderwijs-aan-nieuwkomers'),
('DUO · Hoe het staatsexamen Nt2 werkt (programma I en II)','https://duo.nl/particulier/staatsexamen-nt2/hoe-het-staatsexamen-nt2-werkt.jsp'),
('DUO · Nederlandse titel aanvragen met een buitenlands diploma','https://duo.nl/particulier/buitenlands-diploma-in-nederland/nederlandse-titel-aanvragen.jsp'),
('UAF · Diplomawaardering en indicatie onderwijsniveau','https://www.uaf.nl/en/ondersteuning/ik-wil-studeren/studievoorbereiding/diplomawaardering-en-indicatie-onderwijsniveau/'),
('Nederland Wereldwijd · Beroepserkenning voor een beschermd beroep','https://www.nederlandwereldwijd.nl/buitenlands-diploma-in-nederland/beroepserkenning-beschermd-beroep')]

A='/articles/'
AR=dict(title='شهادتي تعادل ماذا في هولندا؟ دليل حسب مستواك الدراسي 2026: من الإعدادية والبكالوريا والمعهد إلى البكالوريوس والماجستير والدكتوراه — مستويات NLQF، من يقيّم، وماذا تفعل بعدها',
crumb='معادلة الشهادة حسب المستوى',
seo_title='شهادتي تعادل ماذا في هولندا؟ حسب المستوى',
desc='دليل حسب مستواك الدراسي: البكالوريا السورية تُقارَن بـhavo، المعهد بـMBO 4، البكالوريوس بـHBO أو WO، مع مستويات NLQF، ومن يقيّم (Nuffic أو SBB)، والخطوة التالية.',
summary='<ol><li><strong>لكل مستوى طريق مختلف.</strong> الأطفال لا يحتاجون معادلة؛ تضعهم المدرسة أو صف الانتقال الدولي (ISK). البالغون يحتاجونها غالباً للدراسة أو العمل.</li><li><strong>من يقيّم:</strong> <strong>SBB</strong> للشهادات المهنية (مستوى vmbo وMBO)، و<strong>Nuffic</strong> للثانوي العام والتعليم العالي. تقدّم عبر IDW (التفاصيل في <a href="/articles/diploma-evaluation-sbb.html">دليل إجراءات المعادلة</a>).</li><li><strong>أمثلة من Nuffic للشهادات السورية:</strong> الشهادة الإعدادية = <strong>سنتان من havo</strong>؛ الثانوية العامة (البكالوريا) = <strong>شهادة havo</strong>؛ الثانوية المهنية = <strong>MBO 2 أو 3</strong>؛ المعهد التقاني (سنتان) = <strong>MBO 4</strong>؛ إجازة 4 سنوات = <strong>بكالوريوس HBO أو سنتان من WO</strong>؛ إجازة 5 سنوات (هندسة، صيدلة، أسنان…) = <strong>بكالوريوس WO</strong>؛ الماجستير = <strong>ماجستير HBO أو WO لسنة واحدة</strong>.</li><li><strong>النتيجة النهائية تُقرَّر لكل شهادة على حدة.</strong> الجدول هنا توضيحي، ويختلف حسب البلد والاختصاص.</li><li><strong>بلا شهادة؟</strong> طرق بديلة: صف Entree في MBO، اختبار القبول لمن عمره <strong>21 سنة فأكثر</strong> في HBO والجامعة، و«مؤشر مستوى التعليم» (ION) لمن فقد وثائقه.</li><li><strong>اللغة:</strong> امتحان الدولة NT2 <strong>البرنامج I (B1)</strong> للدراسة أو العمل بمستوى MBO 3–4، و<strong>البرنامج II (B2)</strong> لمستوى HBO والجامعة.</li></ol>',
body=(
'<h2 id="concepts">أربعة مفاهيم يخلط الناس بينها</h2>'
'<p>قبل أن تبحث عن «معادلة» شهادتك، افهم الفرق بين هذه الأشياء الأربعة. كثير من خيبات الأمل سببها الخلط بينها:</p>'
+T([['تقييم الشهادة (diplomawaardering)','تقرير يقول بأي شهادة أو دراسة هولندية تُقارَن شهادتك. ليس قراراً ملزماً.','IDW (عبر Nuffic أو SBB)'],
    ['القبول في الدراسة (toelating)','قرار المدرسة أو المعهد العالي أو الجامعة بقبولك في برنامج معيّن. قد تطلب شروطاً إضافية (مواد، لغة، اختبار).','المدرسة أو الجامعة نفسها'],
    ['الاعتراف المهني (beroepserkenning)','إذن بممارسة مهنة محمية (مثل الطب والتمريض والتدريس). لكل مهنة جهة خاصة.','جهة المهنة (مثلاً DUO للمعلمين)'],
    ['اللقب الهولندي (Nederlandse titel)','حق استخدام لقب هولندي مثل ir. أو mr. أو drs. أو dr. بناءً على شهادة أجنبية. مجاني.','DUO']],
   ['المفهوم','ماذا يعني','من يقرره'])
+'<p>هذا الدليل منظَّم <strong>حسب مستواك الدراسي</strong>: ماذا تعادل شهادتك عادة، هل المعادلة مفيدة، ومن يقيّم، وما خطوتك التالية. أما <strong>طريقة التقديم والتكلفة والمدة</strong> فموجودة في <a href="/articles/diploma-evaluation-sbb.html">دليل إجراءات معادلة الشهادة (IDW وNuffic وSBB)</a> ولن نكررها هنا.</p>'
'<h2 id="who">من يقيّم ماذا؟</h2>'
'<p>بحسب الحكومة الهولندية (Rijksoverheid):</p>'
+T([['SBB (مركز الخبرة لتقييم الشهادات الدولية)','الإعدادي المهني (vmbo) والتعليم المهني المتوسط (MBO)'],
    ['Nuffic','التعليم الثانوي (العام) والتعليم العالي (HBO وWO)'],
    ['DUO','طلب لقب هولندي، والاعتراف للعمل كمعلم أو في رعاية الأطفال'],
    ['المعهد العالي أو الجامعة','قد تقيّم الشهادة بنفسها أو تطلب ذلك من Nuffic عند تقديمك للدراسة'],
    ['مدرسة MBO (ROC)','تطلب التقييم من نقطة SBB المرجعية عند الحاجة'],
    ['UWV','يطلب التقييم من SBB لبعض متلقي الإعانات فقط']],
   ['الجهة','تختص بـ'])
+'<p><strong>نتيجة عملية:</strong> إذا كنت ستقدّم إلى جامعة أو معهد عالٍ، اسألهم أولاً: هل تقيّمون شهادتي بأنفسكم؟ أحياناً لا تحتاج أن تطلب المعادلة بنفسك. وتقول Nuffic إن تقييم SBB قد يختلف إن كان <strong>لغرض القبول في MBO أو للعمل</strong> عن المقارنة العامة.</p>'
'<h2 id="nlqf">سُلَّم المستويات الهولندي: NLQF وEQF</h2>'
'<p>هولندا تضع كل شهادة على سُلَّم وطني اسمه <strong>NLQF</strong> (الإطار الهولندي للمؤهلات)، وهو مربوط بالسُّلَّم الأوروبي <strong>EQF</strong>. حين تقرأ «تعادل havo» فهذا يعني عملياً المستوى 4. الجدول من Nuffic:</p>'
+T([['شهادة vmbo مسار BB، وMBO المستوى 1 (Entree)','1','1'],
    ['شهادة vmbo مسار KB أو GL أو T، وMBO المستوى 2','2','2'],
    ['MBO المستوى 3','3','3'],
    ['MBO المستوى 4، وشهادة havo','4','4'],
    ['شهادة vwo','4+','4'],
    ['Associate degree (دبلوم مشارك، سنتان في HBO)','5','5'],
    ['بكالوريوس HBO وبكالوريوس WO','6','6'],
    ['ماجستير HBO وماجستير WO','7','7'],
    ['الدكتوراه (PhD) وEngD','8','8']],
   ['الشهادة الهولندية','NLQF','EQF'])
+'<p>تنبيه من Nuffic: المستوى يصف <strong>المعرفة والمهارات</strong> بعد إنهاء البرنامج، لا عدد سنوات الدراسة ولا محتواها. لذلك قد تكون دراستك أطول من الهولندية وتُقارَن بمستوى أقل. وانتبه أيضاً: <strong>«سنتان من havo»</strong> ليست شهادة هولندية كاملة، فليس لها مستوى NLQF خاص بها.</p>'
'<h2 id="overview">الجدول الكبير: مستواك ← المقارنة المحتملة ← من يقيّم ← الخطوة التالية</h2>'
+T([['طفل في سن المدرسة (حتى 18)','لا حاجة لمعادلة','—','المدرسة / ISK','التسجيل في المدرسة فوراً؛ التعليم إلزامي'],
    ['ابتدائي فقط أو بلا شهادة','لا شيء يُقارَن','—','لا أحد (أو ION للاجئين)','MBO Entree (المستوى 1) + لغة'],
    ['إعدادية (شهادة التعليم الأساسي)','سنتان من havo','دون 2','Nuffic','MBO 1 أو 2 حسب اختبار المدرسة'],
    ['ثانوي غير مكتمل','لا شهادة؛ ربما ION','—','IDW (ION) / المدرسة','اختبار قبول في MBO؛ أو 21+ للعالي'],
    ['ثانوية عامة (بكالوريا علمي/أدبي)','شهادة havo','4','Nuffic','HBO مع شروط إضافية؛ WO غالباً بعد سنة HBO'],
    ['ثانوية مهنية (صناعي/تجاري/زراعي)','MBO 2 أو 3','2–3','SBB','عمل، أو MBO 3/4 ثم HBO'],
    ['معهد تقاني/متوسط سنتان','MBO 4','4','SBB','عمل أو HBO'],
    ['إجازة جامعية 4 سنوات','بكالوريوس HBO أو سنتان WO','6 (أو أقل)','Nuffic','عمل، ماجستير HBO، أو إكمال WO'],
    ['إجازة 5 سنوات (هندسة، عمارة، صيدلة، أسنان، بيطري)','بكالوريوس WO','6','Nuffic','عمل أو ماجستير WO؛ الصحة: BIG'],
    ['طب بشري 6 سنوات','سنة من ماجستير الطب WO (3 سنوات)','—','Nuffic + BIG','مسار BIG للطب'],
    ['ماجستير','ماجستير HBO أو WO لسنة واحدة','7','Nuffic','عمل، دكتوراه، لقب DUO'],
    ['دكتوراه','لا مقارنة منشورة لسوريا','(8 للهولندية)','Nuffic / DUO للقب','لقب dr. عبر DUO']],
   ['مستواك','المقارنة الشائعة (مثال سوريا – Nuffic)','NLQF','من يقيّم','الخطوة التالية'])
+'<p><strong>مهم جداً:</strong> المقارنات في هذا الجدول مأخوذة من وصف Nuffic <strong>للنظام التعليمي السوري</strong>، وهي توضيحية فقط. النتيجة الفعلية تقررها Nuffic أو SBB <strong>لكل شهادة على حدة</strong> حسب المحتوى والاختصاص، وقد تختلف لبلدان أخرى (العراق، مصر، المغرب، تركيا…). لكل بلد صفحة «onderwijssysteem» على موقع Nuffic تبيّن مقارنتها.</p>'
'<h2 id="children">1. الأطفال والمراهقون: لا معادلة، بل تسجيل في المدرسة</h2>'
'<p>إن كان طفلك في سن المدرسة <strong>فلا تحتاج</strong> إلى معادلة شهاداته. المهم هو التسجيل بسرعة، لأن القانون يُلزم بذلك:</p>'
+T([['بداية التعليم الإلزامي (leerplicht)','اليوم الأول من الشهر التالي لبلوغ الطفل 5 سنوات'],
    ['نهاية التعليم الإلزامي الكامل','نهاية السنة الدراسية التي يبلغ فيها 16 سنة، أو بعد 12 سنة دراسية كاملة'],
    ['واجب التأهيل (kwalificatieplicht)','من 16 إلى 18 سنة لمن ليس لديه «تأهيل أساسي» (startkwalificatie)'],
    ['ما هو التأهيل الأساسي؟','على الأقل شهادة havo أو vwo أو MBO من المستوى 2 فما فوق'],
    ['هل يشمل القادمين الجدد؟','نعم، يشمل الأطفال من جنسيات أخرى والقادمين الجدد، ومنهم طالبو اللجوء']],
   ['القاعدة','التفاصيل'])
+'<ul><li><strong>الابتدائي (4–12 سنة):</strong> المدرسة تضع الطفل في مجموعة مناسبة، وكثير من البلديات لديها صفوف للقادمين الجدد لتعلّم الهولندية. انظر <a href="/articles/dutch-school-system-basisschool.html">دليل المدرسة الابتدائية</a>.</li>'
'<li><strong>الثانوي (12 سنة فأكثر):</strong> عادة <strong>صف الانتقال الدولي (internationale schakelklas – ISK)</strong>. بحسب مجلس المدارس الثانوية (VO-raad) يدرس التلاميذ الجدد <strong>نحو سنتين في المتوسط</strong> في ISK، ثم ينتقلون غالباً إلى الثانوي العادي أو MBO، في الاتجاه الذي يناسبهم.</li>'
'<li><strong>تمويل المدرسة:</strong> المدارس تحصل على تمويل إضافي للتلاميذ الموجودين في هولندا منذ أقل من سنتين، ومنذ 1 يناير 2026 تُحسب هذه المدة من <strong>أول يوم دراسي</strong> لا من تاريخ الوصول.</li>'
'<li><strong>عمر 16–17 سنة:</strong> حتى لو كان لدى ابنك شهادة إعدادية أو جزء من الثانوي، فهو ما زال تحت <strong>واجب التأهيل</strong> حتى 18 سنة إن لم يحصل على havo أو vwo أو MBO 2. الطريق المعتاد: ISK ثم MBO أو الثانوي.</li>'
'<li><strong>ماذا تحضر؟</strong> كشوف العلامات والشهادات المدرسية (حتى غير المترجمة) تساعد المدرسة على تقدير المستوى، لكنها ليست شرطاً للتسجيل.</li></ul>'
'<p><strong>فخ شائع:</strong> انتظار «المعادلة» قبل تسجيل الطفل. لا تنتظر؛ الالتزام بالتعليم يبدأ فوراً، وموظف التعليم الإلزامي في البلدية (leerplichtambtenaar) يتابع ذلك.</p>'
'<h2 id="primary">2. بالغ لديه تعليم ابتدائي فقط أو لا شهادة</h2>'
'<p><strong>هل المعادلة مفيدة؟</strong> غالباً لا: لا توجد شهادة ثانوية تُقارَن، والتقييم لن يفتح لك باباً جديداً. ركّز بدلاً من ذلك على اللغة والتعليم المهني.</p>'
'<ul><li><strong>MBO المستوى 1 (Entreeopleiding):</strong> هو المسار المخصص لمن لا يستوفي شروط القبول في المستويات 2 أو 3 أو 4. بعده تستطيع الانتقال إلى المستوى 2، وهو «التأهيل الأساسي». تفاصيل الشروط في <a href="/articles/mbo-conditions.html">دليل شروط MBO</a>.</li>'
'<li><strong>اسأل عن مقابلة قبول أطول</strong> أو أيام تجربة: يذكر صندوق الطلاب اللاجئين UAF أنه يمكن طلب حضور الدروس بضعة أيام أو مقابلة قبول أطول (ليس في كل المدارس)، أو اتباع Entree ثم الانتقال إلى MBO 2.</li>'
'<li><strong>اللغة أولاً:</strong> إن كان هدفك MBO 3 أو 4 لاحقاً، فالبرنامج I من امتحان الدولة NT2 (B1) هو المستوى المناسب (القسم 14).</li>'
'<li><strong>العمل:</strong> كثير من الوظائف لا تطلب شهادة. المسار المزدوج (BBL) يجمع العمل براتب مع الدراسة في MBO: انظر <a href="/articles/bol-bbl-comparison.html">BOL أم BBL</a>.</li>'
'<li><strong>التمويل:</strong> لمن عمره 30 سنة فأكثر توجد قروض وبرامج للتعلّم: <a href="/articles/adult-learning-finance.html">تمويل الدراسة للبالغين</a>.</li></ul>'
'<h2 id="middle">3. أنهيت المرحلة الإعدادية (شهادة التعليم الأساسي / البريفيه / الصف التاسع)</h2>'
'<p><strong>ما المقارنة؟</strong> في سوريا، التعليم الأساسي 9 سنوات (من 6 إلى 15 سنة)، وينتهي بامتحان وطني و<strong>شهادة التعليم الأساسي (Basic Education Certificate)</strong>. تقارنها Nuffic بـ<strong>«سنتين من havo»</strong>.</p>'
'<p><strong>ماذا يعني ذلك عملياً؟</strong> «سنتان من havo» ليست شهادة هولندية، وهي أقل من «التأهيل الأساسي». وشروط القبول في MBO 2 تطلب مثلاً شهادة vmbo أو إثبات أنك أنهيت <strong>أول 3 سنوات</strong> من havo/vwo بنجاح. لذلك قد تضعك المدرسة في <strong>Entree</strong> أو تقبلك في المستوى 2 بعد اختبار. <strong>المدرسة تقرر</strong>، فاسألها عن اختبار تحديد المستوى (intake/niveautoets).</p>'
'<ul><li><strong>هل أطلب المعادلة؟</strong> مفيدة إن أردت إثبات مستواك لمدرسة MBO أو لصاحب عمل، لكنها لن تجعلك مؤهلاً للتعليم العالي.</li><li><strong>الخطوة التالية:</strong> MBO 2 ثم 3 أو 4، أو بعد سن 21 اختبار القبول في التعليم العالي (القسم 5).</li></ul>'
'<h2 id="nosecondary">4. درست الثانوي ولم تتقدم للامتحان النهائي (البكالوريا)</h2>'
'<p>ليست لديك شهادة نهائية، لكن لديك سنوات دراسة. ما الخيارات؟</p>'
'<ol><li><strong>اجمع كشوف العلامات</strong> (cijferlijsten) لكل سنة أنهيتها، مع شهادة الإعدادية. المدرسة تستخدمها لتقدير مستواك.</li><li><strong>مؤشر مستوى التعليم (Indicatie Onderwijsniveau – ION):</strong> يذكر UAF أنه مخصص لمن <strong>لم يُنهِ دراسته</strong> أو لم يستطع إحضار شهادته؛ يقدّر IDW مستواك بناءً على المعلومات التي تقدّمها. مجاني لمن حصل على إقامته بعد 1 يناير 2015 وله حق قرض الاندماج من DUO.</li><li><strong>MBO:</strong> بإثبات أنك أنهيت أول 3 سنوات من مستوى يعادل havo/vwo قد تُقبل في MBO 2 أو 3؛ وإلا Entree. المدرسة تقرر، وقد تطلب من SBB نصيحة عن مستواك وخياراتك في MBO.</li><li><strong>عمرك 21 سنة أو أكثر؟</strong> تستطيع طلب <strong>اختبار القبول (toelatingsonderzoek، ويسمى أيضاً colloquium doctum)</strong> في المعهد العالي أو الجامعة، حتى بلا الشهادة المطلوبة. يُفحص فيه هل مستوى معرفتك كافٍ لمتابعة الدراسة.</li></ol>'
'<h2 id="bac">5. الثانوية العامة (البكالوريا) – الفرع العلمي أو الأدبي</h2>'
'<p><strong>ما المقارنة؟</strong> في سوريا، الثانوي العام 3 سنوات: السنة الأولى مشتركة، ثم فرع <strong>أدبي</strong> أو <strong>علمي</strong>، وتنتهي بامتحان وطني و<strong>شهادة الثانوية العامة (الباكالوريا)</strong>. تقارنها Nuffic بـ<strong>شهادة havo</strong> (المستوى 4 في NLQF).</p>'
+T([['HBO (المعاهد العليا – hogeschool)','شهادة havo أو vwo أو MBO 4 تكفي عادة، مع شروط إضافية لبعض البرامج','الطريق الأقرب لحامل البكالوريا'],
    ['WO (الجامعة)','تتطلب vwo أو سنة أولى ناجحة في HBO (propedeuse)','غالباً لا قبول مباشر بمستوى havo؛ لكن الجامعة تقرر في الشهادات الأجنبية'],
    ['MBO','لا مشكلة في المستوى','مفيد لمن يريد مهنة عملية بسرعة']],
   ['أين؟','القاعدة الهولندية (Rijksoverheid)','ماذا يعني لحامل بكالوريا تُقارَن بـhavo'])
+'<ul><li><strong>علمي أم أدبي؟</strong> في سوريا نفسها، الفرع العلمي يفتح كل البرامج تقريباً، والأدبي يفتح مجالات مثل اللغات والأدب والتاريخ والاقتصاد والحقوق. في هولندا لا يوجد تقسيم بهذا الاسم، لكن كل برنامج قد يطلب <strong>مواد معيّنة</strong> (مثلاً الرياضيات أو الفيزياء). إن نقصتك مادة، قد يُطلب منك تعويضها (deficiëntie) باختبار أو دورة قبل القبول. اسأل البرنامج مباشرة.</li>'
'<li><strong>الدرجات:</strong> المقارنة بـhavo تتعلق بالمستوى لا بالمعدل. لكن البرامج ذات المقاعد المحدودة قد تختار حسب معايير أخرى.</li>'
'<li><strong>اللغة:</strong> للدراسة باللغة الهولندية في HBO أو الجامعة يُطلب عادة مستوى <strong>B2</strong> (البرنامج II من امتحان الدولة NT2). البرامج بالإنجليزية تطلب إثبات إنجليزية؛ الشروط في صفحة البرنامج.</li>'
'<li><strong>بلد آخر؟</strong> شهادات ثانوية من بلدان أخرى قد تُقارَن بـhavo أو vwo أو مستوى آخر. تحقق من صفحة بلدك لدى Nuffic، أو اطلب تقييماً.</li></ul>'
'<p>انظر أيضاً <a href="/articles/mbo-hbo-wo-comparison.html">الفرق بين MBO وHBO وWO</a> و<a href="/articles/student-finance.html">المنحة الدراسية</a>.</p>'
'<h2 id="vocational">6. الثانوية المهنية (الصناعي، التجاري، الزراعي)</h2>'
'<p><strong>ما المقارنة؟</strong> الثانوي المهني في سوريا 3 سنوات بعد شهادة التعليم الأساسي، والشهادة تحمل اسم الاختصاص: صناعي أو تجاري أو زراعي (Vocational Secondary Education Certificate). تقارنها Nuffic بـ<strong>شهادة MBO من المستوى 2 أو 3</strong>، و«المستوى الدقيق يعتمد على محتوى الدراسة».</p>'
'<ul><li><strong>من يقيّم؟</strong> <strong>SBB</strong>، لأنها شهادة مهنية. وتقول Nuffic إن تقييم SBB قد يختلف حسب الغرض (القبول في MBO أو العمل).</li><li><strong>الوصول للتعليم العالي:</strong> في سوريا ممكن أحياناً بدرجات عالية جداً، لكن مقارنة MBO 2–3 لا تفتح HBO مباشرة في هولندا. الطريق: <strong>MBO 4</strong> (غالباً بإعفاءات) ثم HBO، أو اختبار القبول بعد سن 21.</li><li><strong>العمل:</strong> تقرير SBB مفيد جداً هنا: صاحب العمل الهولندي يفهم «MBO 3 كهربائي» أكثر من اسم شهادة أجنبية.</li><li><strong>مهن تقنية:</strong> بعض الأعمال (مثلاً الكهرباء أو الغاز) قد تتطلب شهادات أو تصاريح أمان هولندية إضافية؛ اسأل صاحب العمل أو المدرسة.</li></ul>'
'<h2 id="institute">7. شهادة المعهد (المعهد التقاني أو المتوسط – سنتان)</h2>'
'<p><strong>ما المقارنة؟</strong> بعد المرحلة الثانوية يمكن في سوريا الدراسة سنتين في <strong>معهد تقاني</strong> أو <strong>معهد متوسط</strong> (صناعة، زراعة، إدارة أعمال، إدارة، وأيضاً معاهد إعداد معلمي المرحلة الابتدائية). الشهادة: <strong>شهادة دبلوم تقاني (Technical Diploma Certificate)</strong> أو <strong>شهادة مساعد المجاز (Certificate of Associate Degree)</strong>، وتُترجم كثيراً «Certificate of Licensed Assistant». تقارن Nuffic الثلاث جميعها بـ<strong>شهادة MBO من المستوى 4</strong>، وتحيل التقييم الفردي إلى <strong>SBB</strong>.</p>'
'<ul><li><strong>فخ الاسم:</strong> رغم أن الترجمة الإنجليزية «Associate Degree»، فإن المقارنة <strong>ليست</strong> بالـAssociate degree الهولندي (مستوى 5)، بل بـMBO 4 (مستوى 4).</li><li><strong>الخطوة التالية:</strong> شهادة MBO 4 الهولندية تفتح باب <strong>HBO</strong>. فإن قيّمت SBB شهادتك بمستوى MBO 4، اسأل المعهد العالي هل يقبلك على أساسها، وما المواد الإضافية المطلوبة.</li><li><strong>معهد إعداد المعلمين:</strong> التدريس مهنة محمية في هولندا؛ الاعتراف يمر عبر <strong>DUO</strong> (القسم 13).</li><li><strong>دبلوم سنتين في بلد آخر:</strong> قد يقيّمه SBB أو Nuffic حسب نوعه (مهني أو أكاديمي)؛ عبر IDW يُوجَّه الطلب للجهة الصحيحة.</li></ul>'
'<h2 id="bachelor">8. الإجازة الجامعية (البكالوريوس)</h2>'
'<p>في سوريا الإجازة 4 سنوات عادة، و5 سنوات للعمارة والطب البيطري والهندسة والصيدلة وطب الأسنان، و6 سنوات للطب البشري. مقارنات Nuffic:</p>'
+T([['إجازة 4 سنوات','بكالوريوس HBO أو سنتان من WO (حسب محتوى البرنامج)','الآداب، الحقوق، الاقتصاد، العلوم…'],
    ['إجازة 5 سنوات: عمارة، هندسة، أسنان، صيدلة، بيطري','بكالوريوس WO','مستوى 6'],
    ['إجازة الطب البشري 6 سنوات','سنة واحدة من ماجستير الطب WO ذي السنوات الثلاث','الممارسة تحتاج تسجيل BIG']],
   ['الشهادة السورية','المقارنة لدى Nuffic','ملاحظة'])
+'<ul><li><strong>HBO أم WO؟</strong> في هولندا التعليم العالي نوعان: HBO (تطبيقي مهني) وWO (جامعي بحثي). كلاهما مستوى 6 للبكالوريوس، لكن الفرق مهم للقبول في الماجستير: ماجستير WO قد يطلب بكالوريوس WO أو سنة تمهيدية (premaster).</li>'
'<li><strong>«سنتان من WO»:</strong> تعني أن الجامعة قد تقبلك في سنة متقدمة من بكالوريوس WO أو تمنحك إعفاءات (vrijstellingen)، لا أنك تحمل بكالوريوس WO. القرار لكلية الامتحانات (examencommissie).</li>'
'<li><strong>العمل:</strong> أرفق تقرير Nuffic مع سيرتك الذاتية. معظم المهن (مثل المحاسبة الإدارية أو تقنية المعلومات أو التسويق) لا تحتاج اعترافاً رسمياً، فالتقرير يكفي ليفهم صاحب العمل مستواك.</li>'
'<li><strong>اللقب:</strong> بشهادة أكاديمية معترف بها تستطيع طلب لقب هولندي مجاناً من <strong>DUO</strong> (مثل ing. أو bc. أو ir. أو mr. أو drs.) إذا كان برنامجك مماثلاً لبرنامج هولندي وبلا فروق جوهرية.</li>'
'<li><strong>الرسوم الدراسية:</strong> إن أردت دراسة ثانية، اسأل DUO والجامعة: هل تدفع الرسوم القانونية أم رسوم المؤسسة (instellingscollegegeld)؟ هذا يعتمد على شهاداتك السابقة ونوع إقامتك.</li></ul>'
'<h2 id="master">9. الماجستير</h2>'
'<p><strong>ما المقارنة؟</strong> الماجستير السوري سنتان (سنة مقررات وامتحانات وسنة رسالة)، ويُقبل فيه بمعدل بكالوريوس 70% على الأقل. تقارنه Nuffic بـ<strong>ماجستير HBO أو WO مدته سنة واحدة</strong>، حسب محتوى البرنامج (المستوى 7 في NLQF).</p>'
'<ul><li><strong>لماذا سنة واحدة رغم أنك درست سنتين؟</strong> لأن المقارنة تقيس المستوى النهائي لا المدة.</li><li><strong>الخطوات التالية:</strong> العمل بمستوى عالٍ، أو التقديم لوظيفة دكتوراه (promotieplaats) في جامعة هولندية، والجامعة تقرر القبول. أو طلب لقب هولندي من DUO.</li><li><strong>ماجستير HBO أم WO؟</strong> الفرق يظهر في التقرير. ماجستير يُقارَن بـWO يفتح عادة باب الدكتوراه بسهولة أكبر.</li></ul>'
'<h2 id="phd">10. الدكتوراه واستخدام لقب «د.» (dr.) في هولندا</h2>'
'<p>الدكتوراه السورية 3 سنوات على الأقل (بحث ورسالة ومقالتان علميتان منشورتان على الأقل). صفحة Nuffic عن سوريا <strong>لا تذكر مقارنة هولندية للدكتوراه</strong>. والدكتوراه الهولندية (PhD) في المستوى 8 من NLQF.</p>'
+T([['اطلب اللقب الهولندي من DUO','مجاني. تفحص DUO هل برنامجك معترف به، ومماثل لبرنامج هولندي بنفس الهدف، ويمنح الحقوق نفسها، وبلا فروق جوهرية. الألقاب الممكنة: ing.، bc.، ir.، mr.، drs.، dr.'],
    ['بعد منح اللقب','يجوز لك استخدام اللقب الهولندي <strong>أو</strong> الدرجة الأجنبية؛ وإن استخدمت الأجنبية فاكتبها كما تُكتب في البلد الذي منحها'],
    ['قبل منح اللقب','الأسلم أن تكتب درجتك كما مُنحت، مثلاً «PhD (جامعة دمشق)»، لا «dr.» الهولندي'],
    ['الأساس القانوني','قاعدة سياسات (Beleidsregel) منشورة على wetten.overheid.nl، تشير إليها DUO']],
   ['الموضوع','ماذا تقول DUO'])
+'<p><strong>انتبه للطب:</strong> في العربية نقول «دكتور» للطبيب. في هولندا اللقب <strong>dr.</strong> لقب أكاديمي مرتبط بالدكتوراه، والطبيب يُسمّى عادة <strong>arts</strong>. فطبيب بلا دكتوراه لا يحصل على لقب dr. بسبب شهادة الطب وحدها. والعمل كطبيب يحتاج تسجيل BIG (القسم 13). اللقب الهولندي ليس معادلة شهادة: للمعادلة تبقى IDW هي الطريق.</p>'
'<h2 id="incomplete">11. دراسة جامعية لم تكتمل</h2>'
'<p>توقفت دراستك بسبب الحرب أو اللجوء؟ لا تخسر ما أنجزته:</p>'
'<ol><li><strong>اجمع ما تستطيع:</strong> كشوف العلامات لكل سنة، أوصاف المقررات، بطاقة الطالب، رسالة من الجامعة. انظر <a href="/articles/syrian-documents-legalisation-translation.html">تصديق وترجمة الوثائق السورية</a>.</li><li><strong>مؤشر مستوى التعليم (ION):</strong> مخصص لمن شهادته غير مكتملة أو مفقودة. مجاني لمن حصل على إقامته بعد 1 يناير 2015 وله حق قرض الاندماج من DUO.</li><li><strong>للقبول:</strong> قدّم شهادة الثانوية (البكالوريا) كأساس للقبول، وكشوف السنوات الجامعية لطلب <strong>إعفاءات (vrijstellingen)</strong> من مقررات. كلية الامتحانات في البرنامج تقرر.</li><li><strong>بلا بكالوريا وعمرك 21+؟</strong> اختبار القبول (toelatingsonderzoek) في المعهد العالي أو الجامعة.</li><li><strong>لا تقبلك الجامعة بعد؟</strong> البدائل: سنة تحضيرية (schakeltraject)، أو HBO ثم الانتقال.</li></ol>'
'<h2 id="nodocs">12. فقدت وثائقك (اللاجئون)</h2>'
'<p>هذا موضوع مشروح بالتفصيل في <a href="/articles/diploma-evaluation-sbb.html">دليل إجراءات المعادلة</a>. باختصار:</p>'
'<ul><li><strong>Indicatie Onderwijsniveau (ION):</strong> تقدير لمستواك يضعه IDW بناءً على المعلومات التي تقدّمها عن دراستك. ليس معادلة رسمية، لكن المدارس تستخدم مثل هذه المعلومات لوضعك في البرنامج والسنة المناسبين.</li><li><strong>مجاني</strong> لمن حصل على إقامته بعد 1 يناير 2015 وله حق قرض الاندماج من DUO.</li><li><strong>المعادلة المجانية:</strong> يذكر UAF أن التقييم المجاني عبر IDW يشمل <strong>شهادة واحدة فقط</strong>؛ فاختر الشهادة الأهم لهدفك (عادة أعلى شهادة).</li><li><strong>بلا شهادة عند التسجيل في MBO:</strong> أحضر كشوف العلامات أو معلومات عن المواد؛ تستطيع المدرسة طلب نصيحة SBB عن مستواك.</li></ul>'
'<h2 id="regulated">13. المهن المحمية (الطب، التمريض، التدريس…)</h2>'
'<p>تقول الحكومة إن المهنة المحمية (gereglementeerd beroep) لا يمارسها إلا من يستوفي شروطاً معيّنة، ومن الأمثلة: <strong>المعلم، والممرض، والمحامي، والمترجم الفوري المحلّف</strong>. المعادلة وحدها <strong>لا تكفي</strong>. التفاصيل الكاملة في <a href="/articles/diploma-evaluation-sbb.html">دليل المعادلة</a>.</p>'
+T([['الطبيب، طبيب الأسنان، الصيدلي، الممرض، المعالج الفيزيائي، القابلة…','سجل BIG (bigregister.nl): إجراء «بيان الكفاءة» مع مستوى لغة هولندية حسب المهنة'],
    ['المعلم (كل المراحل) والعامل في رعاية الأطفال','DUO'],
    ['المحامي، المترجم المحلّف، ومهن أخرى','الجهة المختصة بكل مهنة؛ ابحث في قاعدة بيانات المهن المحمية لدى المفوضية الأوروبية (اختر Netherlands)'],
    ['مهن غير محمية (أغلب المهن الإدارية والتقنية)','لا اعتراف مطلوب؛ تقرير المعادلة يساعد صاحب العمل على فهم مستواك']],
   ['المهنة','أين تبدأ؟'])
+'<p><strong>كيف تعرف إن كانت مهنتك محمية؟</strong> ابحث عنها في قاعدة البيانات الأوروبية للمهن المنظَّمة (Regulated professions database) واختر هولندا. إن لم تجدها، فغالباً لا تحتاج اعترافاً، لكن صاحب العمل قد يطلب شهادات إضافية. المهندس مثلاً يحتاج غالباً تقرير Nuffic فقط، مع أن بعض الأعمال التقنية لها شهادات أمان خاصة.</p>'
'<h2 id="language">14. اللغة: امتحان الدولة NT2 – البرنامج I أم II؟</h2>'
'<p>المعادلة تقول ما مستوى شهادتك، لكن الدراسة والعمل يحتاجان أيضاً لغة. بحسب DUO:</p>'
+T([['البرنامج I','B1','دراسة في MBO، أو عمل بمستوى MBO 3 أو 4','للثانوية المهنية، المعهد، ومن يريد MBO'],
    ['البرنامج II','B2','دراسة أو عمل بمستوى HBO أو الجامعة','للبكالوريا الطامح لـHBO/WO، والجامعيين، وكثير من المهن الصحية العليا']],
   ['البرنامج','المستوى','ماذا يفتح (DUO)','لمن يناسب عادة'])
+'<ul><li>السعر والتسجيل والنتيجة في <a href="/articles/nt2-b1-exam-guide.html">دليل امتحان NT2</a>.</li><li>البرنامج بالإنجليزية يطلب إثبات إنجليزية بدلاً من الهولندية؛ الشرط في صفحة البرنامج.</li><li>شهادة NT2 مفيدة أيضاً للاندماج والجنسية: <a href="/articles/dutch-naturalisation-guide.html">دليل الجنسية</a>.</li></ul>'
'<h2 id="examples">أمثلة توضيحية</h2>'
'<p><strong>أمثلة توضيحية وليست حالات أشخاص حقيقيين.</strong> المقارنات مأخوذة من وصف Nuffic للنظام السوري، والنتيجة الفعلية قد تختلف.</p>'
+T([['شاب 17 سنة، معه شهادة التعليم الأساسي السورية','لا يحتاج معادلة؛ تحت واجب التأهيل حتى 18','ISK نحو سنتين، ثم MBO أو الثانوي'],
    ['امرأة 35 سنة، بكالوريا أدبي، تريد دراسة العمل الاجتماعي','بكالوريا ≈ havo ← HBO ممكن','NT2 البرنامج II، ثم التقديم إلى HBO وسؤال البرنامج عن المواد المطلوبة'],
    ['رجل 28 سنة، ثانوية صناعية كهرباء','≈ MBO 2 أو 3 (SBB)','تقرير SBB للعمل، أو MBO 4 عبر BBL مع راتب'],
    ['خريج معهد تقاني محاسبة (سنتان)','≈ MBO 4، لا Associate degree هولندي','عمل كمساعد محاسب، أو HBO اقتصاد'],
    ['مهندس مدني، إجازة 5 سنوات','≈ بكالوريوس WO','تقرير Nuffic للعمل، وطلب لقب ir. من DUO إن استوفى الشروط'],
    ['خريجة أدب إنكليزي، إجازة 4 سنوات، تريد التدريس','≈ بكالوريوس HBO أو سنتان WO','الاعتراف عبر DUO؛ ربما برنامج تكميلي لإعداد المعلمين'],
    ['طالب ترك كلية الطب في السنة الثالثة دون وثائق','لا شهادة؛ ION ممكن','ION + البكالوريا كأساس للقبول + طلب إعفاءات'],
    ['حامل دكتوراه في الكيمياء','لا مقارنة منشورة لسوريا','كتابة «PhD» كما مُنحت، وطلب لقب dr. من DUO']],
   ['الحالة','المقارنة المحتملة','الخطوة التالية'])
+'<h2 id="steps">خطوة بخطوة: كيف تختار طريقك</h2><ol><li><strong>حدّد هدفك أولاً:</strong> عمل؟ MBO؟ HBO أو جامعة؟ مهنة محمية؟ الهدف يحدد هل تحتاج معادلة أصلاً.</li><li><strong>اقرأ صفحة بلدك لدى Nuffic</strong> (onderwijssysteem + اسم البلد) لترى المقارنة المعتادة لشهادتك.</li><li><strong>اجمع الوثائق:</strong> الشهادة وكشف العلامات لكل مرحلة. الترجمة والتصديق في <a href="/articles/syrian-documents-legalisation-translation.html">دليل الوثائق السورية</a>.</li><li><strong>للدراسة:</strong> اسأل المدرسة أو الجامعة: هل تقيّمون الشهادة بأنفسكم؟ ما شروط المواد واللغة؟</li><li><strong>للعمل أو الاندماج:</strong> اطلب التقييم عبر IDW (<a href="/articles/diploma-evaluation-sbb.html">الإجراءات والتكلفة</a>).</li><li><strong>مهنة محمية؟</strong> ابدأ مبكراً لدى الجهة المختصة (BIG، DUO…).</li><li><strong>اللغة:</strong> خطّط لامتحان NT2 بالبرنامج المناسب.</li><li><strong>احفظ التقرير PDF</strong> وأرفقه بطلبات العمل والدراسة.</li></ol>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li><strong>انتظار المعادلة قبل تسجيل الأطفال</strong> في المدرسة.</li><li><strong>ظن أن «Associate Degree» السوري يعادل Associate degree الهولندي</strong>؛ Nuffic تقارنه بـMBO 4.</li><li><strong>إرسال الشهادة دون كشف العلامات</strong>؛ المحتوى يحدد المستوى.</li><li><strong>ظن أن المعادلة تعطي حق القبول أو حق ممارسة المهنة.</strong></li><li><strong>استخدام لقب «dr.» دون حق</strong> أو لمجرد أنك طبيب.</li><li><strong>دفع مكاتب خاصة</strong> لخدمات تقدمها IDW وDUO (اللقب مجاني).</li><li><strong>التقييم المجاني لشهادة أقل أهمية</strong> بينما التقييم المجاني لشهادة واحدة فقط.</li><li><strong>إهمال اللغة:</strong> المستوى الدراسي العالي بلا B1/B2 لا يكفي للقبول.</li><li><strong>الاستسلام بلا شهادة:</strong> طريق Entree واختبار 21+ وION موجودة.</li></ol>'
'<h2 id="help">أين تجد مساعدة مجانية؟</h2><ul><li><strong>IDW:</strong> فيديوهات شرح بعدة لغات منها العربية، وأسئلة متكررة.</li><li><strong>المدرسة أو ROC أو المعهد العالي:</strong> مستشار القبول (decaan / toelatingsadviseur) يجيب عن الشروط مجاناً.</li><li><strong>UAF:</strong> صندوق دعم الطلاب اللاجئين، وله مكتب مساعدة لأسئلة مسارات الانتقال في MBO. الشروط على موقعه.</li><li><strong>البلدية:</strong> مستشار الاندماج أو موظف التعليم الإلزامي للأطفال.</li><li><strong>DUO:</strong> للقب الهولندي، والاعتراف للمعلمين، وامتحان NT2.</li><li><strong>UWV:</strong> إن كنت تتلقى إعانة، قد يطلب UWV التقييم لك من SBB.</li></ul>'
'<h2 id="related">أدلة مرتبطة</h2><ul><li><a href="/articles/diploma-evaluation-sbb.html">إجراءات معادلة الشهادة (IDW وNuffic وSBB)</a></li><li><a href="/articles/mbo-hbo-wo-comparison.html">MBO وHBO وWO: الفرق</a></li><li><a href="/articles/mbo-conditions.html">شروط القبول في MBO</a></li><li><a href="/articles/dutch-school-system-basisschool.html">المدرسة الابتدائية</a></li><li><a href="/articles/nt2-b1-exam-guide.html">امتحان الدولة NT2</a></li><li><a href="/articles/student-finance.html">المنحة الدراسية</a></li><li><a href="/articles/adult-learning-finance.html">تمويل الدراسة للبالغين</a></li><li><a href="/articles/syrian-documents-legalisation-translation.html">الوثائق السورية</a></li><li><a href="/articles/dutch-naturalisation-guide.html">الجنسية الهولندية</a></li></ul>'),
faq=[('البكالوريا السورية تعادل ماذا في هولندا؟','تقارن Nuffic شهادة الثانوية العامة السورية بشهادة havo (المستوى 4 في NLQF). القرار النهائي لكل شهادة على حدة.'),
('هل أستطيع دخول الجامعة مباشرة بالبكالوريا؟','الجامعة (WO) تطلب عادة vwo أو سنة أولى ناجحة في HBO. بمستوى havo يكون HBO هو الطريق الأقرب، لكن الجامعة تقرر في الشهادات الأجنبية.'),
('الفرع الأدبي أم العلمي، هل يفرق؟','لا يوجد هذا التقسيم في هولندا، لكن البرامج قد تطلب مواد معيّنة مثل الرياضيات. إن نقصتك مادة قد يُطلب تعويضها قبل القبول.'),
('شهادة المعهد المتوسط (سنتان) تعادل ماذا؟','تقارن Nuffic شهادة دبلوم تقاني وشهادة مساعد المجاز السوريتين بـMBO 4، وSBB تقيّمها فردياً. ليست Associate degree هولندياً.'),
('الثانوية الصناعية تعادل ماذا؟','MBO من المستوى 2 أو 3 حسب محتوى الدراسة، والتقييم لدى SBB.'),
('الإجازة الجامعية 4 سنوات تعادل ماذا؟','بكالوريوس HBO أو سنتين من WO حسب البرنامج. أما الهندسة والعمارة والصيدلة والأسنان والبيطري (5 سنوات) فتُقارَن ببكالوريوس WO.'),
('لماذا يُقارَن ماجستيري (سنتان) بماجستير سنة واحدة؟','لأن المقارنة تقيس المستوى النهائي لا المدة. Nuffic تقارن الماجستير السوري بماجستير HBO أو WO لسنة واحدة.'),
('هل أستطيع كتابة dr. أمام اسمي بدكتوراه أجنبية؟','اطلب اللقب الهولندي مجاناً من DUO. بعد المنح يجوز لك استخدام اللقب الهولندي أو الدرجة الأجنبية كما تُكتب في بلدها. قبل ذلك اكتب الدرجة كما مُنحت (مثلاً PhD).'),
('أنا طبيب، هل أصبح dr. في هولندا؟','لا تلقائياً. dr. لقب الدكتوراه الأكاديمية. للعمل كطبيب تحتاج تسجيل BIG.'),
('ابني 16 سنة وعنده الإعدادية، هل يجب أن يدرس؟','نعم. واجب التأهيل حتى 18 سنة لمن ليس لديه havo أو vwo أو MBO 2. عادة يدخل ISK ثم MBO أو الثانوي.'),
('لا أملك أي شهادة، هل أستطيع الدراسة؟','نعم: MBO Entree (المستوى 1) ثم المستوى 2، وبعد سن 21 اختبار القبول في HBO أو الجامعة.'),
('ما هو اختبار 21+؟','اختبار قبول (toelatingsonderzoek / colloquium doctum) لمن عمره 21 سنة فأكثر وليست لديه الشهادة المطلوبة، يفحص هل معرفتك كافية للدراسة.'),
('لم أكمل دراستي الجامعية، هل أخسر السنوات؟','لا بالضرورة. قدّم كشوف العلامات واطلب إعفاءات، أو اطلب ION إن كانت الوثائق ناقصة.'),
('أي امتحان NT2 أحتاج؟','البرنامج I (B1) لـMBO أو العمل بمستوى MBO 3–4، والبرنامج II (B2) لـHBO والجامعة.')],
src_note='راجعنا Nuffic (النظام التعليمي السوري ومستويات الشهادات الهولندية NLQF/EQF) وRijksoverheid وDUO وVO-raad وUAF وNederland Wereldwijd في 12 أكتوبر 2026. المقارنات خاصة بسوريا وتوضيحية؛ لم نتحقق من صفحات بلدان أخرى. Nuffic لا تذكر مقارنة للدكتوراه السورية. لم نذكر رقم مادة قانونية عن الألقاب ولا شروط برامج UAF لأننا لم نتحقق منها. التكلفة والمدة في دليل إجراءات المعادلة. الأمثلة توضيحية.')

B='/nl/articles/'
NL=dict(title='Wat is mijn buitenlandse diploma waard in Nederland? Gids per opleidingsniveau 2026: van basisonderwijs, middelbare school en instituut tot bachelor, master en doctoraat — NLQF-niveaus, wie waardeert en wat daarna',
crumb='Diploma per niveau',
seo_title='Buitenlands diploma per niveau: wat is het waard?',
desc='Gids per niveau: het Syrische eindexamendiploma vergeleken met havo, het instituut met mbo 4, de bachelor met hbo of wo, met NLQF-niveaus, wie waardeert (Nuffic of SBB) en de volgende stap.',
summary='<ol><li><strong>Elk niveau een andere route.</strong> Kinderen hebben geen waardering nodig; school of internationale schakelklas (ISK) plaatst ze. Volwassenen hebben die vaak wel nodig voor studie of werk.</li><li><strong>Wie waardeert:</strong> <strong>SBB</strong> voor vmbo en mbo, <strong>Nuffic</strong> voor voortgezet en hoger onderwijs. Aanvragen via IDW (zie <a href="/nl/articles/diploma-evaluation-sbb.html">de procedure</a>).</li><li><strong>Nuffic over Syrische diploma’s:</strong> Basic Education Certificate = <strong>2 jaar havo</strong>; eindexamendiploma = <strong>havodiploma</strong>; beroepsgericht voortgezet = <strong>mbo 2 of 3</strong>; technical/intermediate institute (2 jaar) = <strong>mbo 4</strong>; 4-jarige bachelor = <strong>hbo-bachelor of 2 jaar wo</strong>; 5-jarige bachelor (engineering, farmacie, tandheelkunde…) = <strong>wo-bachelor</strong>; master = <strong>1-jarige hbo- of wo-master</strong>.</li><li><strong>De uitkomst wordt per diploma bepaald.</strong> Deze tabel is illustratief en verschilt per land en richting.</li><li><strong>Geen diploma?</strong> Entreeopleiding, het <strong>21+-toelatingsonderzoek</strong> voor hbo/wo en de Indicatie Onderwijsniveau (ION).</li><li><strong>Taal:</strong> staatsexamen Nt2 <strong>programma I (B1)</strong> voor mbo en werk op mbo 3–4, <strong>programma II (B2)</strong> voor hbo en universiteit.</li></ol>',
body=(
'<h2 id="concepts">Vier begrippen die vaak door elkaar lopen</h2>'
'<p>Voordat je zoekt naar ‘erkenning’ van je diploma: dit zijn vier verschillende dingen. Veel teleurstelling ontstaat doordat mensen ze verwarren.</p>'
+T([['Diplomawaardering','Een rapport dat zegt met welke Nederlandse opleiding of welk diploma jouw diploma vergelijkbaar is. Niet bindend.','IDW (via Nuffic of SBB)'],
    ['Toelating','Besluit van de school, hogeschool of universiteit of je een opleiding mag volgen. Er kunnen extra eisen zijn (vakken, taal, toets).','De onderwijsinstelling'],
    ['Beroepserkenning','Toestemming om een beschermd (gereglementeerd) beroep uit te oefenen, zoals arts, verpleegkundige of leraar. Per beroep een eigen organisatie.','Bevoegde instantie (bijv. DUO voor leraren)'],
    ['Nederlandse titel','Het recht een Nederlandse titel te voeren (ir., mr., drs., dr. enz.) op basis van een buitenlands diploma. Gratis.','DUO']],
   ['Begrip','Wat het is','Wie beslist'])
+'<p>Deze gids is ingedeeld <strong>naar jouw situatie en opleidingsniveau</strong>: waarmee je diploma meestal wordt vergeleken, of een waardering zinvol is, wie waardeert en wat je daarna kunt doen. <strong>Hoe je aanvraagt, wat het kost en hoe lang het duurt</strong> staat in <a href="/nl/articles/diploma-evaluation-sbb.html">onze gids over diplomawaardering (IDW, Nuffic en SBB)</a>; dat herhalen we hier niet.</p>'
'<h2 id="who">Wie waardeert wat?</h2>'
'<p>Volgens de Rijksoverheid:</p>'
+T([['SBB (Expertisecentrum Internationale diplomawaardering)','Voorbereidend middelbaar beroepsonderwijs (vmbo) en middelbaar beroepsonderwijs (mbo)'],
    ['Nuffic','Voortgezet onderwijs en hoger onderwijs (hbo en wo)'],
    ['DUO','Nederlandse titel aanvragen; erkenning als leraar of in de kinderopvang'],
    ['Hogeschool of universiteit','Kan je diploma zelf beoordelen of een waardering bij Nuffic aanvragen'],
    ['Mbo-school (ROC)','Vraagt de waardering aan bij het Nationaal Referentiepunt van SBB'],
    ['UWV','Vraagt alleen voor mensen met bepaalde uitkeringen een waardering aan bij SBB']],
   ['Organisatie','Voor'])
+'<p><strong>Praktisch gevolg:</strong> meld je je aan bij een hogeschool of universiteit, vraag dan eerst of zij je diploma zelf beoordelen. Soms hoef je de waardering niet zelf aan te vragen. Nuffic schrijft bovendien dat een beoordeling door SBB <strong>voor toelating tot het mbo of voor werk</strong> kan afwijken van de algemene vergelijking.</p>'
'<h2 id="nlqf">De Nederlandse niveauladder: NLQF en EQF</h2>'
'<p>Nederland plaatst elk diploma op het <strong>Nederlands Kwalificatieraamwerk (NLQF)</strong>, gekoppeld aan het Europese <strong>EQF</strong>. ‘Vergelijkbaar met havo’ betekent in de praktijk niveau 4. De tabel van Nuffic:</p>'
+T([['Vmbo basisberoepsgerichte leerweg (BB), mbo niveau 1 (Entree)','1','1'],
    ['Vmbo KB, GL of TL, mbo niveau 2','2','2'],
    ['Mbo niveau 3','3','3'],
    ['Mbo niveau 4, havodiploma','4','4'],
    ['Vwo-diploma','4+','4'],
    ['Associate degree','5','5'],
    ['Bachelor (hbo en wo)','6','6'],
    ['Master (hbo en wo)','7','7'],
    ['Doctor (PhD) en Engineering Doctorate (EngD)','8','8']],
   ['Nederlands diploma','NLQF','EQF'])
+'<p>Nuffic benadrukt: het niveau zegt iets over <strong>kennis en vaardigheden</strong> na afronding, niet over studielast of inhoud. Een langere buitenlandse opleiding kan dus met een lager niveau worden vergeleken. En let op: <strong>‘2 jaar havo’</strong> is geen volledig Nederlands diploma en heeft geen eigen NLQF-niveau.</p>'
'<h2 id="overview">De grote tabel: jouw niveau → waarschijnlijke vergelijking → wie waardeert → volgende stap</h2>'
+T([['Kind in de leerplichtige leeftijd (tot 18)','Geen waardering nodig','—','School / ISK','Direct inschrijven; leerplicht geldt'],
    ['Alleen basisonderwijs of geen diploma','Niets om te vergelijken','—','Niemand (of ION voor vluchtelingen)','Entreeopleiding (mbo 1) + taal'],
    ['Basic Education Certificate (9 jaar)','2 jaar havo','onder 2','Nuffic','Mbo 1 of 2 na intake'],
    ['Voortgezet onderwijs zonder eindexamen','Geen diploma; mogelijk ION','—','IDW (ION) / school','Intake mbo; of 21+-toets hoger onderwijs'],
    ['Algemeen eindexamendiploma (literair/exact)','Havodiploma','4','Nuffic','Hbo met eventuele extra eisen; wo vaak via hbo-propedeuse'],
    ['Beroepsgericht voortgezet (industrie/handel/landbouw)','Mbo 2 of 3','2–3','SBB','Werk, of mbo 3/4 en daarna hbo'],
    ['Technical/intermediate institute (2 jaar)','Mbo 4','4','SBB','Werk of hbo'],
    ['Bachelor 4 jaar','Hbo-bachelor of 2 jaar wo','6 (of lager)','Nuffic','Werk, hbo-master of wo afronden'],
    ['Bachelor 5 jaar (engineering, architectuur, farmacie, tandheelkunde, diergeneeskunde)','Wo-bachelor','6','Nuffic','Werk of wo-master; zorg: BIG'],
    ['Geneeskunde 6 jaar','1 jaar van de 3-jarige wo-master geneeskunde','—','Nuffic + BIG','BIG-route arts'],
    ['Master','1-jarige hbo- of wo-master','7','Nuffic','Werk, promotie, titel via DUO'],
    ['Doctoraat','Geen gepubliceerde vergelijking voor Syrië','(8 voor NL)','Nuffic / DUO voor titel','Titel dr. via DUO']],
   ['Jouw niveau','Gangbare vergelijking (voorbeeld Syrië – Nuffic)','NLQF','Wie waardeert','Volgende stap'])
+'<p><strong>Belangrijk:</strong> de vergelijkingen in deze tabel komen uit de beschrijving van het <strong>Syrische onderwijssysteem</strong> door Nuffic en zijn alleen illustratief. De echte uitkomst bepalen Nuffic of SBB <strong>per diploma</strong>, op basis van inhoud en richting, en kan voor andere landen (Irak, Egypte, Marokko, Turkije…) anders zijn. Nuffic heeft per land een pagina ‘onderwijssysteem’ met de vergelijkingen.</p>'
'<h2 id="children">1. Kinderen en tieners: geen waardering, wel inschrijven</h2>'
'<p>Voor een leerplichtig kind <strong>is geen diplomawaardering nodig</strong>. Snel inschrijven is wat telt, want de wet verplicht het:</p>'
+T([['Begin leerplicht','De 1e dag van de nieuwe maand nadat het kind 5 is geworden'],
    ['Einde volledige leerplicht','Einde van het schooljaar waarin het kind 16 wordt, of na minimaal 12 volledige schooljaren'],
    ['Kwalificatieplicht','Van 16 tot 18 jaar voor wie nog geen startkwalificatie heeft'],
    ['Startkwalificatie','(Minimaal) een diploma havo, vwo of mbo (niveau 2 of hoger)'],
    ['Geldt het voor nieuwkomers?','Ja, ook voor kinderen met een andere nationaliteit en nieuwkomers (asielzoekers en vreemdelingen)']],
   ['Regel','Uitleg'])
+'<ul><li><strong>Basisschool (4–12 jaar):</strong> de school plaatst het kind in een passende groep; veel gemeenten hebben nieuwkomersvoorzieningen om Nederlands te leren. Zie <a href="/nl/articles/dutch-school-system-basisschool.html">de basisschool</a>.</li>'
'<li><strong>Voortgezet onderwijs (12+):</strong> meestal de <strong>internationale schakelklas (ISK)</strong>. Volgens de VO-raad krijgen nieuwkomers <strong>gemiddeld eerst twee jaar</strong> les in een ISK en stromen ze daarna (veelal) door naar het reguliere vo en mbo, in de passende onderwijsrichting.</li>'
'<li><strong>Bekostiging:</strong> scholen krijgen extra geld voor nieuwkomers die korter dan twee jaar in Nederland zijn; sinds 1 januari 2026 telt die periode vanaf de <strong>eerste schooldag</strong> in plaats van de aankomstdatum.</li>'
'<li><strong>16 of 17 jaar:</strong> ook met een Basic Education Certificate of een deel van het voortgezet onderwijs geldt de <strong>kwalificatieplicht</strong> tot 18 zonder havo, vwo of mbo 2. Gebruikelijke route: ISK, daarna mbo of vo.</li>'
'<li><strong>Wat meenemen?</strong> Rapporten en schooldiploma’s (ook onvertaald) helpen de school het niveau in te schatten, maar zijn geen voorwaarde voor inschrijving.</li></ul>'
'<p><strong>Valkuil:</strong> wachten op een ‘waardering’ voordat je je kind inschrijft. Niet doen; de leerplicht geldt meteen en de leerplichtambtenaar van de gemeente houdt toezicht.</p>'
'<h2 id="primary">2. Volwassene met alleen basisonderwijs of zonder diploma</h2>'
'<p><strong>Is een waardering zinvol?</strong> Meestal niet: er is geen diploma voortgezet onderwijs om te vergelijken. Richt je liever op taal en beroepsonderwijs.</p>'
'<ul><li><strong>Mbo niveau 1 (Entreeopleiding):</strong> bedoeld voor wie niet voldoet aan de toelatingseisen van niveau 2, 3 of 4. Daarna kun je door naar niveau 2, de startkwalificatie. Eisen: <a href="/nl/articles/mbo-conditions.html">toelating mbo</a>.</li>'
'<li><strong>Vraag om een langere intake</strong> of meeloopdagen: volgens UAF kun je vragen een paar dagen mee te doen of om een langere intake (niet overal mogelijk), of eerst Entree volgen en dan naar mbo 2.</li>'
'<li><strong>Eerst de taal:</strong> wil je later naar mbo 3 of 4, dan past staatsexamen Nt2 programma I (B1) (zie deel 14).</li>'
'<li><strong>Werk:</strong> veel banen vragen geen diploma. De bbl combineert betaald werk met een mbo-opleiding: <a href="/nl/articles/bol-bbl-comparison.html">bol of bbl</a>.</li>'
'<li><strong>Financiering</strong> vanaf 30 jaar: <a href="/nl/articles/adult-learning-finance.html">studiefinanciering voor volwassenen</a>.</li></ul>'
'<h2 id="middle">3. Middelbare school onderbouw afgerond (Basic Education Certificate / brevet / 9e klas)</h2>'
'<p><strong>Vergelijking:</strong> in Syrië duurt de basisfase 9 jaar (6 tot 15 jaar) en eindigt met een centraal examen en het <strong>Basic Education Certificate</strong>. Nuffic vergelijkt dit met <strong>2 jaar havo</strong>.</p>'
'<p><strong>Wat betekent dat?</strong> ‘2 jaar havo’ is geen Nederlands diploma en ligt onder de startkwalificatie. Voor mbo 2 vraagt de wet bijvoorbeeld een vmbo-diploma of bewijs dat je de <strong>eerste 3 leerjaren</strong> havo/vwo met goed gevolg hebt doorlopen. De school kan je dus in de <strong>Entreeopleiding</strong> plaatsen of na een toets toelaten tot niveau 2. <strong>De school beslist</strong>; vraag naar een intake of niveautoets.</p>'
'<ul><li><strong>Waardering aanvragen?</strong> Handig om je niveau aan een mbo-school of werkgever te laten zien, maar het geeft geen toegang tot hoger onderwijs.</li><li><strong>Volgende stap:</strong> mbo 2, dan 3 of 4; of vanaf 21 jaar het toelatingsonderzoek (deel 5).</li></ul>'
'<h2 id="nosecondary">4. Voortgezet onderwijs zonder eindexamen</h2>'
'<p>Geen einddiploma, wel jaren onderwijs. Wat kan je doen?</p>'
'<ol><li><strong>Verzamel cijferlijsten</strong> van elk afgerond jaar, plus het diploma van de basisfase. De school gebruikt die om je niveau in te schatten.</li><li><strong>Indicatie Onderwijsniveau (ION):</strong> volgens UAF bedoeld voor wie de opleiding <strong>niet heeft afgemaakt</strong> of het diploma niet kon meenemen; IDW schat je niveau in op basis van jouw informatie. Gratis als je je verblijfsvergunning na 1 januari 2015 kreeg en recht hebt op de DUO-inburgeringslening.</li><li><strong>Mbo:</strong> met bewijs van 3 afgeronde leerjaren op havo/vwo-niveau kan mbo 2 of 3 mogelijk zijn; anders Entree. De school beslist en kan SBB om advies vragen over je niveau en mbo-mogelijkheden.</li><li><strong>21 jaar of ouder?</strong> Vraag een <strong>toelatingsonderzoek (colloquium doctum)</strong> aan bij de hogeschool of universiteit, ook zonder het vereiste diploma. Daarin wordt gekeken of je kennisniveau voldoende is om de studie te kunnen volgen.</li></ol>'
'<h2 id="bac">5. Algemeen eindexamendiploma – literaire of exacte richting</h2>'
'<p><strong>Vergelijking:</strong> in Syrië duurt de algemene bovenbouw 3 jaar: het eerste jaar is voor iedereen gelijk, daarna kies je de <strong>literaire</strong> of <strong>exacte</strong> richting. Het eindigt met een nationaal examen en het <strong>General Secondary Education Certificate (Baccalaureate)</strong>. Nuffic vergelijkt dit met een <strong>havodiploma</strong> (NLQF 4).</p>'
+T([['Hbo (hogeschool)','Havo, vwo of mbo 4; soms extra toelatingseisen','De meest voor de hand liggende route'],
    ['Wo (universiteit)','Vwo of een hbo-propedeuse','Op havoniveau meestal geen directe toelating; bij buitenlandse diploma’s beslist de universiteit'],
    ['Mbo','Niveau is geen probleem','Handig voor wie snel een praktisch beroep wil']],
   ['Waar?','Nederlandse regel (Rijksoverheid)','Wat betekent dat bij havo-vergelijking?'])
+'<ul><li><strong>Literair of exact?</strong> In Syrië geeft exact toegang tot vrijwel alle opleidingen en literair tot o.a. talen, letteren, geschiedenis, economie en rechten. In Nederland bestaat die indeling niet, maar een opleiding kan <strong>bepaalde vakken</strong> eisen (bijv. wiskunde of natuurkunde). Ontbreekt een vak, dan moet je dat soms eerst wegwerken (deficiëntie) met een toets of cursus. Vraag het de opleiding.</li>'
'<li><strong>Cijfers:</strong> de vergelijking met havo gaat over niveau, niet over je gemiddelde. Opleidingen met beperkte plaatsen kunnen anders selecteren.</li>'
'<li><strong>Taal:</strong> voor Nederlandstalig hbo of wo wordt meestal <strong>B2</strong> gevraagd (staatsexamen Nt2 programma II). Engelstalige opleidingen vragen een Engelse taaltoets; zie de opleidingspagina.</li>'
'<li><strong>Ander land?</strong> Diploma’s uit andere landen kunnen met havo, vwo of iets anders worden vergeleken. Kijk op de landenpagina van Nuffic of vraag een waardering aan.</li></ul>'
'<p>Zie ook <a href="/nl/articles/mbo-hbo-wo-comparison.html">mbo, hbo en wo vergeleken</a> en <a href="/nl/articles/student-finance.html">studiefinanciering</a>.</p>'
'<h2 id="vocational">6. Beroepsgericht voortgezet onderwijs (industrie, handel, landbouw)</h2>'
'<p><strong>Vergelijking:</strong> de Syrische beroepsgerichte bovenbouw duurt 3 jaar na het Basic Education Certificate; de richting staat in de naam van het diploma: Industrial, Commercial of Agriculture Vocational Secondary Education Certificate. Nuffic vergelijkt dit met <strong>een mbo-diploma niveau 2 of 3</strong>; het exacte niveau ‘hangt af van de inhoud van de opleiding’.</p>'
'<ul><li><strong>Wie waardeert?</strong> <strong>SBB</strong>, omdat het een beroepsdiploma is. Volgens Nuffic kan de beoordeling van SBB afwijken bij toelating tot het mbo of voor werk.</li><li><strong>Hoger onderwijs:</strong> in Syrië soms mogelijk met zeer hoge cijfers, maar een vergelijking op mbo 2–3 geeft in Nederland geen directe toegang tot het hbo. Route: <strong>mbo 4</strong> (vaak met vrijstellingen) en dan hbo, of het 21+-toelatingsonderzoek.</li><li><strong>Werk:</strong> hier is een SBB-rapport erg nuttig: een werkgever begrijpt ‘mbo 3 elektrotechniek’ beter dan een buitenlandse diplomanaam.</li><li><strong>Technische beroepen:</strong> voor sommige werkzaamheden (bijv. elektra of gas) kunnen extra Nederlandse certificaten of veiligheidsdiploma’s nodig zijn; vraag de werkgever of school.</li></ul>'
'<h2 id="institute">7. Diploma van een instituut (technical of intermediate institute – 2 jaar)</h2>'
'<p><strong>Vergelijking:</strong> na de beroepsgerichte of algemene bovenbouw kun je in Syrië 2 jaar studeren aan een <strong>technical institute</strong> of <strong>intermediate institute</strong> (industrie, landbouw, bedrijfskunde, administratie, en ook een opleiding tot leraar basisonderwijs). Diploma’s: <strong>Technical Diploma Certificate</strong> (شهادة دبلوم تقاني) of <strong>Certificate of Associate Degree</strong> (شهادة مساعد المجاز), vaak vertaald als ‘Certificate of Licensed Assistant’. Nuffic vergelijkt alle drie met <strong>een mbo-diploma niveau 4</strong> en verwijst voor individuele waardering naar <strong>SBB</strong>.</p>'
'<ul><li><strong>Valkuil in de naam:</strong> ondanks de Engelse vertaling ‘Associate Degree’ is de vergelijking <strong>niet</strong> het Nederlandse associate degree (NLQF 5), maar mbo 4 (NLQF 4).</li><li><strong>Volgende stap:</strong> een Nederlands mbo 4-diploma geeft toegang tot het <strong>hbo</strong>. Waardeert SBB jouw diploma op mbo 4-niveau, vraag de hogeschool dan of je daarmee wordt toegelaten en welke extra vakken nodig zijn.</li><li><strong>Lerarenopleiding:</strong> leraar is in Nederland een beschermd beroep; erkenning via <strong>DUO</strong> (deel 13).</li><li><strong>2-jarig diploma uit een ander land:</strong> afhankelijk van het type (beroepsgericht of academisch) waardeert SBB of Nuffic; via IDW komt de aanvraag bij de juiste organisatie.</li></ul>'
'<h2 id="bachelor">8. Bachelor (universitair diploma)</h2>'
'<p>In Syrië duurt de bachelor (الإجازة, ook Licence) meestal 4 jaar, 5 jaar voor architectuur, diergeneeskunde, engineering, farmacie en tandheelkunde, en 6 jaar voor geneeskunde. Vergelijkingen van Nuffic:</p>'
+T([['Bachelor 4 jaar','Hbo-bachelor of 2 jaar wo (afhankelijk van de inhoud)','Letteren, rechten, economie, wetenschappen…'],
    ['Bachelor 5 jaar: architectuur, engineering, tandheelkunde, farmacie, diergeneeskunde','Wo-bachelor','NLQF 6'],
    ['Bachelor geneeskunde 6 jaar','1 jaar van een 3-jarige wo-masteropleiding geneeskunde','Werken als arts vraagt BIG-registratie']],
   ['Syrisch diploma','Vergelijking Nuffic','Opmerking'])
+'<ul><li><strong>Hbo of wo?</strong> Nederland heeft hbo (beroepsgericht) en wo (wetenschappelijk). Beide bachelors zijn NLQF 6, maar het verschil telt bij een master: een wo-master kan een wo-bachelor of een premaster vragen.</li>'
'<li><strong>‘2 jaar wo’:</strong> betekent dat de universiteit je misschien in een later jaar plaatst of vrijstellingen geeft, niet dat je een wo-bachelor hebt. De examencommissie beslist.</li>'
'<li><strong>Werk:</strong> voeg het Nuffic-rapport toe aan je cv. De meeste beroepen (bijv. administratie, ICT, marketing) vragen geen formele erkenning; het rapport helpt de werkgever je niveau te begrijpen.</li>'
'<li><strong>Titel:</strong> met een erkende academische graad kun je bij <strong>DUO</strong> gratis een Nederlandse titel aanvragen (zoals ing., bc., ir., mr. of drs.), als de opleiding vergelijkbaar is met een Nederlandse opleiding zonder wezenlijke verschillen.</li>'
'<li><strong>Collegegeld bij een tweede studie:</strong> vraag DUO en de instelling of je wettelijk collegegeld of instellingscollegegeld betaalt; dat hangt af van eerdere diploma’s en je verblijfsvergunning.</li></ul>'
'<h2 id="master">9. Master</h2>'
'<p><strong>Vergelijking:</strong> de Syrische master duurt 2 jaar (een jaar vakken en examens, een jaar scriptie); toelating vraagt een bachelor met gemiddeld 70%. Nuffic vergelijkt hem met <strong>een 1-jarige hbo- of wo-master</strong>, afhankelijk van de inhoud (NLQF 7).</p>'
'<ul><li><strong>Waarom 1 jaar terwijl je 2 jaar studeerde?</strong> De vergelijking meet het eindniveau, niet de duur.</li><li><strong>Volgende stappen:</strong> werk op hoog niveau, solliciteren op een promotieplaats (de universiteit beslist) of een Nederlandse titel bij DUO.</li><li><strong>Hbo- of wo-master?</strong> Dat staat in het rapport. Een vergelijking met een wo-master maakt de weg naar promotie meestal makkelijker.</li></ul>'
'<h2 id="phd">10. Doctoraat en de titel ‘dr.’ in Nederland</h2>'
'<p>Het Syrische doctoraat duurt minimaal 3 jaar (onderzoek, proefschrift en minstens 2 gepubliceerde wetenschappelijke artikelen). De Nuffic-pagina over Syrië <strong>noemt geen Nederlandse vergelijking voor het doctoraat</strong>. Het Nederlandse doctoraat (PhD) is NLQF 8.</p>'
+T([['Nederlandse titel aanvragen bij DUO','Gratis. DUO onderzoekt of je opleiding erkend is, vergelijkbaar met een Nederlandse opleiding met hetzelfde doel, dezelfde rechten geeft en geen wezenlijke verschillen heeft. Mogelijke titels: ing., bc., ir., mr., drs., dr.'],
    ['Na toekenning','Je mag de Nederlandse titel óf de buitenlandse graad voeren; gebruik je de buitenlandse graad, schrijf die dan zoals in het land waar je hem behaalde'],
    ['Vóór toekenning','Het veiligst is je graad te schrijven zoals hij is verleend, bijv. ‘PhD (Universiteit van Damascus)’, en niet de Nederlandse ‘dr.’'],
    ['Juridische basis','Een beleidsregel op wetten.overheid.nl, waarnaar DUO verwijst']],
   ['Onderwerp','Wat DUO zegt'])
+'<p><strong>Let op bij artsen:</strong> in het Arabisch noem je een arts ‘dokter’. In Nederland is <strong>dr.</strong> een academische titel die bij een promotie hoort; een arts heet <strong>arts</strong>. Een arts zonder promotie krijgt dus niet alleen door zijn artsdiploma de titel dr. Werken als arts vraagt BIG-registratie (deel 13). Een titel is geen diplomawaardering: daarvoor blijft IDW de route.</p>'
'<h2 id="incomplete">11. Onafgemaakte universitaire studie</h2>'
'<p>Studie gestopt door oorlog of vlucht? Gooi wat je hebt gedaan niet weg:</p>'
'<ol><li><strong>Verzamel wat kan:</strong> cijferlijsten per jaar, vakbeschrijvingen, studentenkaart, een verklaring van de universiteit. Zie <a href="/nl/articles/syrian-documents-legalisation-translation.html">Syrische documenten legaliseren en vertalen</a>.</li><li><strong>Indicatie Onderwijsniveau (ION):</strong> voor wie een onvolledig of ontbrekend diploma heeft. Gratis bij een verblijfsvergunning na 1 januari 2015 en recht op de DUO-inburgeringslening.</li><li><strong>Toelating:</strong> gebruik je eindexamendiploma voortgezet onderwijs als basis en je cijferlijsten om <strong>vrijstellingen</strong> aan te vragen. De examencommissie van de opleiding beslist.</li><li><strong>Geen eindexamendiploma en 21+?</strong> Het toelatingsonderzoek bij hogeschool of universiteit.</li><li><strong>Nog niet toelaatbaar?</strong> Een schakeltraject, of eerst hbo en daarna doorstromen.</li></ol>'
'<h2 id="nodocs">12. Documenten kwijt (vluchtelingen)</h2>'
'<p>Dit staat uitgebreid in <a href="/nl/articles/diploma-evaluation-sbb.html">onze gids over diplomawaardering</a>. Kort:</p>'
'<ul><li><strong>Indicatie Onderwijsniveau (ION):</strong> een inschatting van je niveau door IDW op basis van jouw informatie. Geen formele waardering, maar scholen gebruiken zulke informatie om je in de juiste opleiding en het juiste jaar te plaatsen.</li><li><strong>Gratis</strong> bij een verblijfsvergunning na 1 januari 2015 en recht op de DUO-inburgeringslening.</li><li><strong>Gratis waardering:</strong> volgens UAF kan via IDW <strong>maar één diploma</strong> gratis worden gewaardeerd; kies dus het diploma dat voor je doel het belangrijkst is (meestal het hoogste).</li><li><strong>Geen diploma bij aanmelding mbo:</strong> neem cijferlijsten of vakinformatie mee; de school kan SBB om advies vragen.</li></ul>'
'<h2 id="regulated">13. Beschermde beroepen (arts, verpleegkundige, leraar…)</h2>'
'<p>Volgens de Rijksoverheid mag iemand een gereglementeerd beroep alleen uitoefenen als hij aan de eisen voldoet; voorbeelden zijn <strong>leraar, verpleegkundige, advocaat en tolk</strong>. Een waardering alleen is <strong>niet genoeg</strong>. Meer in <a href="/nl/articles/diploma-evaluation-sbb.html">de waarderingsgids</a>.</p>'
+T([['Arts, tandarts, apotheker, verpleegkundige, fysiotherapeut, verloskundige…','BIG-register (bigregister.nl): procedure verklaring van vakbekwaamheid, met een taalniveau Nederlands per beroep'],
    ['Leraar (alle sectoren) en kinderopvang','DUO'],
    ['Advocaat, beëdigd tolk/vertaler en andere','De bevoegde instantie per beroep; zoek in de database gereglementeerde beroepen van de Europese Commissie (kies Netherlands)'],
    ['Niet-beschermde beroepen (de meeste administratieve en technische)','Geen erkenning nodig; het waarderingsrapport helpt de werkgever']],
   ['Beroep','Waar begin je?'])
+'<p><strong>Is mijn beroep beschermd?</strong> Zoek het op in de Europese database van gereglementeerde beroepen en kies Nederland. Staat het er niet in, dan heb je meestal geen erkenning nodig, al kan een werkgever extra certificaten vragen. Een ingenieur heeft bijvoorbeeld meestal genoeg aan een Nuffic-rapport, al gelden voor sommige technische werkzaamheden eigen veiligheidscertificaten.</p>'
'<h2 id="language">14. Taal: staatsexamen Nt2 programma I of II?</h2>'
'<p>De waardering zegt wat je diploma waard is; voor studie en werk heb je ook taal nodig. Volgens DUO:</p>'
+T([['Programma I','B1','Een mbo-opleiding of werken op mbo 3- of 4-niveau','Beroepsonderwijs, instituut, wie naar het mbo wil'],
    ['Programma II','B2','Studeren of werken op hbo- of universitair niveau','Eindexamen + hbo/wo-wens, academici, veel hogere zorgberoepen']],
   ['Programma','Niveau','Waarvoor (DUO)','Voor wie meestal'])
+'<ul><li>Prijs, aanmelden en uitslag: <a href="/nl/articles/nt2-b1-exam-guide.html">gids staatsexamen Nt2</a>.</li><li>Engelstalige opleidingen vragen een Engelse taaltoets; zie de opleidingspagina.</li><li>Het Nt2-diploma helpt ook bij inburgering en naturalisatie: <a href="/nl/articles/dutch-naturalisation-guide.html">naturalisatie</a>.</li></ul>'
'<h2 id="examples">Voorbeelden</h2>'
'<p><strong>Illustratief, geen echte personen.</strong> De vergelijkingen komen uit Nuffics beschrijving van het Syrische systeem; de werkelijke uitkomst kan afwijken.</p>'
+T([['Jongen van 17 met Syrisch Basic Education Certificate','Geen waardering nodig; kwalificatieplicht tot 18','Ongeveer 2 jaar ISK, daarna mbo of vo'],
    ['Vrouw van 35, eindexamen literair, wil social work','Eindexamen ≈ havo → hbo mogelijk','Nt2 programma II, dan aanmelden bij hbo en vragen naar vakeisen'],
    ['Man van 28, beroepsgericht voortgezet elektrotechniek','≈ mbo 2 of 3 (SBB)','SBB-rapport voor werk, of mbo 4 via bbl met salaris'],
    ['Afgestudeerde technical institute boekhouding (2 jaar)','≈ mbo 4, geen Nederlands associate degree','Werk als assistent-boekhouder, of hbo economie'],
    ['Civiel ingenieur, bachelor 5 jaar','≈ wo-bachelor','Nuffic-rapport voor werk; titel ir. bij DUO als aan de eisen is voldaan'],
    ['Afgestudeerde Engelse letteren (4 jaar), wil lesgeven','≈ hbo-bachelor of 2 jaar wo','Erkenning via DUO; mogelijk aanvullende lerarenopleiding'],
    ['Student geneeskunde gestopt in jaar 3, zonder documenten','Geen diploma; ION mogelijk','ION + eindexamendiploma als basis + vrijstellingen aanvragen'],
    ['Gepromoveerde chemicus','Geen gepubliceerde vergelijking voor Syrië','‘PhD’ schrijven zoals verleend; titel dr. aanvragen bij DUO']],
   ['Situatie','Waarschijnlijke vergelijking','Volgende stap'])
+'<h2 id="steps">Stap voor stap je route kiezen</h2><ol><li><strong>Bepaal eerst je doel:</strong> werk, mbo, hbo/universiteit of een beschermd beroep? Je doel bepaalt of je überhaupt een waardering nodig hebt.</li><li><strong>Lees de landenpagina van Nuffic</strong> (onderwijssysteem + land) voor de gangbare vergelijking.</li><li><strong>Verzamel documenten:</strong> diploma én cijferlijst per niveau. Vertalen en legaliseren: <a href="/nl/articles/syrian-documents-legalisation-translation.html">Syrische documenten</a>.</li><li><strong>Voor studie:</strong> vraag de instelling of zij zelf beoordelen en welke vak- en taaleisen gelden.</li><li><strong>Voor werk of inburgering:</strong> vraag een waardering aan via IDW (<a href="/nl/articles/diploma-evaluation-sbb.html">procedure en kosten</a>).</li><li><strong>Beschermd beroep?</strong> Begin vroeg bij de bevoegde instantie (BIG, DUO…).</li><li><strong>Taal:</strong> plan het juiste Nt2-programma.</li><li><strong>Bewaar het rapport als pdf</strong> en stuur het mee bij sollicitaties en aanmeldingen.</li></ol>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li><strong>Wachten op een waardering</strong> voordat je je kind op school inschrijft.</li><li><strong>Denken dat het Syrische ‘Associate Degree’ gelijk is aan het Nederlandse associate degree</strong>; Nuffic vergelijkt het met mbo 4.</li><li><strong>Diploma insturen zonder cijferlijst</strong>; de inhoud bepaalt het niveau.</li><li><strong>Denken dat een waardering toelating of beroepsbevoegdheid geeft.</strong></li><li><strong>‘dr.’ voeren zonder recht</strong>, of alleen omdat je arts bent.</li><li><strong>Bureaus betalen</strong> voor wat IDW en DUO doen (de titel is gratis).</li><li><strong>De gratis waardering gebruiken voor een minder belangrijk diploma</strong>, terwijl maar één diploma gratis is.</li><li><strong>Taal vergeten:</strong> een hoog diploma zonder B1/B2 is niet genoeg voor toelating.</li><li><strong>Opgeven zonder diploma:</strong> Entree, het 21+-toelatingsonderzoek en ION bestaan.</li></ol>'
'<h2 id="help">Gratis hulp</h2><ul><li><strong>IDW:</strong> uitlegvideo’s in meerdere talen, waaronder Arabisch, en veelgestelde vragen.</li><li><strong>School, ROC of hogeschool:</strong> de decaan of toelatingsadviseur beantwoordt vragen over eisen gratis.</li><li><strong>UAF:</strong> stichting voor vluchtelingstudenten, met een mbo-helpdesk voor vragen over schakeltrajecten. Voorwaarden op de site.</li><li><strong>Gemeente:</strong> je inburgeringsconsulent, of de leerplichtambtenaar voor kinderen.</li><li><strong>DUO:</strong> Nederlandse titel, erkenning als leraar, staatsexamen Nt2.</li><li><strong>UWV:</strong> met bepaalde uitkeringen vraagt UWV de waardering voor je aan bij SBB.</li></ul>'
'<h2 id="related">Gerelateerde gidsen</h2><ul><li><a href="/nl/articles/diploma-evaluation-sbb.html">Diplomawaardering aanvragen (IDW, Nuffic, SBB)</a></li><li><a href="/nl/articles/mbo-hbo-wo-comparison.html">Mbo, hbo en wo vergeleken</a></li><li><a href="/nl/articles/mbo-conditions.html">Toelating mbo</a></li><li><a href="/nl/articles/dutch-school-system-basisschool.html">De basisschool</a></li><li><a href="/nl/articles/nt2-b1-exam-guide.html">Staatsexamen Nt2</a></li><li><a href="/nl/articles/student-finance.html">Studiefinanciering</a></li><li><a href="/nl/articles/adult-learning-finance.html">Studiefinanciering voor volwassenen</a></li><li><a href="/nl/articles/syrian-documents-legalisation-translation.html">Syrische documenten</a></li><li><a href="/nl/articles/dutch-naturalisation-guide.html">Naturalisatie</a></li></ul>'),
faq=[('Waarmee wordt het Syrische eindexamendiploma vergeleken?','Nuffic vergelijkt het General Secondary Education Certificate met een havodiploma (NLQF 4). De uitkomst wordt per diploma bepaald.'),
('Kan ik met dat diploma direct naar de universiteit?','Het wo vraagt meestal vwo of een hbo-propedeuse. Op havoniveau ligt het hbo meer voor de hand, maar bij buitenlandse diploma’s beslist de universiteit.'),
('Maakt literair of exact uit?','Die indeling bestaat in Nederland niet, maar opleidingen kunnen vakken als wiskunde eisen. Ontbreekt een vak, dan moet je dat soms eerst wegwerken.'),
('Wat is een 2-jarig instituutsdiploma waard?','Nuffic vergelijkt het Syrische Technical Diploma Certificate en Certificate of Associate Degree met mbo 4; SBB waardeert individueel. Het is geen Nederlands associate degree.'),
('Wat is een Syrisch beroepsgericht diploma (industrie, handel) waard?','Mbo niveau 2 of 3, afhankelijk van de inhoud; SBB waardeert.'),
('Wat is een 4-jarige bachelor waard?','Een hbo-bachelor of 2 jaar wo, afhankelijk van de opleiding. Vijfjarige bachelors (engineering, architectuur, farmacie, tandheelkunde, diergeneeskunde) worden vergeleken met een wo-bachelor.'),
('Waarom wordt mijn 2-jarige master vergeleken met een 1-jarige master?','De vergelijking meet het eindniveau, niet de duur. Nuffic vergelijkt de Syrische master met een 1-jarige hbo- of wo-master.'),
('Mag ik ‘dr.’ voeren met een buitenlands doctoraat?','Vraag de Nederlandse titel gratis aan bij DUO. Daarna mag je de Nederlandse titel of de buitenlandse graad voeren, zoals die in het land van herkomst wordt geschreven. Daarvóór schrijf je de graad zoals verleend (bijv. PhD).'),
('Ik ben arts. Word ik dan dr. in Nederland?','Niet automatisch. Dr. hoort bij een promotie. Om als arts te werken heb je BIG-registratie nodig.'),
('Mijn zoon is 16 en heeft alleen het Basic Education Certificate. Moet hij naar school?','Ja. De kwalificatieplicht geldt tot 18 zonder havo, vwo of mbo 2. Meestal eerst ISK, daarna mbo of vo.'),
('Ik heb geen enkel diploma. Kan ik studeren?','Ja: de Entreeopleiding (mbo 1) en daarna niveau 2; vanaf 21 jaar het toelatingsonderzoek voor hbo of universiteit.'),
('Wat is het 21+-toelatingsonderzoek?','Een toelatingsonderzoek (colloquium doctum) voor wie 21 of ouder is en niet het vereiste diploma heeft. Er wordt gekeken of je kennisniveau voldoende is voor de studie.'),
('Mijn universitaire studie is niet af. Zijn die jaren verloren?','Niet per se. Lever cijferlijsten in en vraag vrijstellingen aan, of vraag een ION aan als documenten ontbreken.'),
('Welk staatsexamen Nt2 heb ik nodig?','Programma I (B1) voor mbo of werk op mbo 3–4; programma II (B2) voor hbo en universiteit.')],
src_note='Gecontroleerd bij Nuffic (onderwijssysteem Syrië en niveau van Nederlandse diploma’s NLQF/EQF), Rijksoverheid, DUO, VO-raad, UAF en Nederland Wereldwijd op 12 oktober 2026. De vergelijkingen gelden voor Syrië en zijn illustratief; pagina’s voor andere landen hebben we niet gecontroleerd. Nuffic noemt geen vergelijking voor het Syrische doctoraat. Een wetsartikel over titulatuur en de voorwaarden van UAF-programma’s noemen we niet, omdat we die niet hebben gecontroleerd. Kosten en doorlooptijd staan in de gids over diplomawaardering. Voorbeelden illustratief.')
#xlink
AR['body']+='<p><strong>مصطلح غير مفهوم في رسالتك؟</strong> ابحث عنه في <a href="/articles/dutch-government-terms-glossary.html">قاموس المصطلحات الحكومية الهولندية</a>.</p>'
NL['body']+='<p><strong>Een woord niet begrepen?</strong> Zoek het op in <a href="/nl/articles/dutch-government-terms-glossary.html">Overheidstaal uitgelegd</a>.</p>'
AR['seo_title']='شهادتي تعادل ماذا في هولندا؟ معادلة الشهادة حسب المستوى'
AR['desc']='معادلة الشهادة الأجنبية حسب مستواك: ابتدائي، إعدادي، بكالوريا، معهد، إجازة، ماجستير، دكتوراه أو بلا وثائق، ومن يقيّم والخطوة التالية.'
NL['seo_title']='Buitenlands diploma waarderen per opleidingsniveau'
NL['desc']='Wat is uw buitenlandse diploma waard in Nederland? Per niveau: basisschool tot doctoraat of zonder papieren, met NLQF, wie waardeert en de volgende stap.'
AR['title']='شهادتي تعادل ماذا في هولندا؟ معادلة الشهادة حسب مستواك الدراسي 2026: من الابتدائي إلى الدكتوراه'
NL['title']='Wat is mijn buitenlandse diploma waard in Nederland? Per opleidingsniveau, van basisschool tot doctoraat (2026)'
