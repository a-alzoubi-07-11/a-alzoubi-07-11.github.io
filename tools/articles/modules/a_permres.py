from a_student_finance import T
from infog import FIG
SLUG='eu-permanent-residence-netherlands'
SRC=[('IND · Verblijfsvergunning EU-langdurig ingezetene (laatste update 11 november 2026)','https://ind.nl/nl/verblijfsvergunningen/langdurig-ingezetene-eu/verblijfsvergunning-eu-langdurig-ingezetene'),
('IND · Inkomenseisen: zelfstandig, duurzaam en voldoende inkomen (1 juli 2026)','https://ind.nl/en/independent-sustainable-and-sufficient-income'),
('IND · Normbedragen inkomenseisen (1 juli t/m 31 december 2026)','https://ind.nl/en/required-amounts-income-requirements'),
('IND · Formulier 6009 (versie 2026/3, 30 pagina’s)','https://ind.nl/nl/formulieren/6009.pdf'),
('IND · Formulier 6011 asiel (versie 2026/5, 26 pagina’s)','https://ind.nl/nl/formulieren/6011.pdf'),
('IND · Bijlage Bewijsmiddelen inkomen 7111','https://ind.nl/nl/formulieren/7111.pdf'),
('IND · Leges: kosten van een aanvraag (2026)','https://ind.nl/nl/leges-kosten-van-een-aanvraag'),
('IND · Documenten uploaden','https://ind.nl/nl/documenten-uploaden'),
('IND · Uw stukken opsturen','https://ind.nl/nl/stukken-opsturen'),
('IND · Inburgering bij sterkere verblijfsvergunning','https://ind.nl/nl/met-een-verblijfsvergunning-wonen-in-nederland/inburgering-bij-sterkere-verblijfsvergunning')]

CHECKED_AR='26 نوفمبر 2026'
CHECKED_NL='26 november 2026'

def nl(s): return f'<span lang="nl" dir="ltr">{s}</span>'
def RULE(t,lang='ar'): return f'<div class="box-rule"><b>{"قاعدة رسمية" if lang=="ar" else "Officiële regel"}</b>{t}</div>'
def TIP(t,lang='ar'): return f'<div class="box-tip"><b>{"نصيحة عملية" if lang=="ar" else "Praktische tip"}</b>{t}</div>'
def OPEN(t,lang='ar'): return f'<div class="box-open"><b>{"غير محسوم" if lang=="ar" else "Niet zeker"}</b>{t}</div>'
def SRCL(t,lang='ar'):
    return f'<p class="st-src">{"المصدر" if lang=="ar" else "Bron"}: {t} · {"تحقّقنا" if lang=="ar" else "Gecontroleerd"}: {CHECKED_AR if lang=="ar" else CHECKED_NL}</p>'
def H(n,i,t,lang='ar'):
    lab=f'المحطة {n} من 6' if lang=='ar' else f'Stap {n} van 6'
    return f'<h2 id="{i}"><span class="st-num">{lab}</span>{t}</h2>'
def CHK(key,items):
    return f'<ul class="gn-check" data-key="{key}">'+''.join(f'<li><label><input type="checkbox"><span>{x}</span></label></li>' for x in items)+'</ul>'

ST_AR=[('conditions','الشروط'),('income','الدخل'),('documents','الأوراق'),('form','الاستمارة'),('send','الإرسال'),('after','بعد التقديم')]
ST_NL=[('conditions','Voorwaarden'),('income','Inkomen'),('documents','Documenten'),('form','Formulier'),('send','Versturen'),('after','Na de aanvraag')]
def ROUTE(st): return '<ol class="st-route">'+''.join(f'<li><a href="#{i}"><b>{k+1}</b>{t}</a></li>' for k,(i,t) in enumerate(st))+'</ol>'

# ---------------------------------------------------------------- AR
AR=dict(title='الإقامة الأوروبية الدائمة في هولندا 2026: الدليل العملي خطوة بخطوة من الشروط حتى القرار',
seo_title='الإقامة الأوروبية الدائمة في هولندا 2026: خطوة بخطوة',
crumb='الإقامة الأوروبية الدائمة',
desc='دليل عملي لـ EU-langdurig ingezetene في 6 محطات: الشروط، الدخل 1.635,90 يورو، الأوراق حسب حالتك، الاستمارة 6009 أو 6011 قسماً قسماً، الإرسال، الرسوم 254 يورو، وما بعد التقديم.',
summary='<ol><li><strong>EU-langdurig ingezetene</strong> إقامة بلا تاريخ انتهاء (النوع V). البطاقة صالحة 5 سنوات وتجديدها 85 يورو، والعمل حر بلا '+nl('TWV')+'.</li>'
'<li>تحتاج: <strong>5 سنوات متواصلة</strong> بإقامة صالحة، غياب لا يزيد عن <strong>6 أشهر متتالية و10 أشهر مجموعاً</strong>، دخل مستقل ومستدام وكافٍ، الاندماج أو إعفاء، وتسجيل في '+nl('BRP')+'.</li>'
'<li>الدخل من 1 يوليو حتى 31 ديسمبر 2026: <strong>1.635,90 يورو</strong> '+nl('sv-loon')+' إجمالي بالشهر بدون بدل العطلة، أو <strong>2.337,00 يورو</strong> إذا انحسب دخل الزوج معك.</li>'
'<li>إقامة لجوء: الاستمارة <strong>6011 بالبريد فقط</strong>. إقامة عادية: الاستمارة <strong>6009</strong> بالبريد، أو أونلاين مع '+nl('DigiD')+'.</li>'
'<li>الرسوم 2026: <strong>254 يورو</strong> للبالغ و85 للقاصر، ولكل فرد طلبه ورسومه، وما بترجع إذا انرفض الطلب.</li></ol>',
body=(
'<p class="notice"><strong>قبل ما تبلّش:</strong> جرّب <a href="/calculators/permanent-residence-check.html">الفحص السريع للإقامة والجنسية</a>. بكبسات قليلة بيقلّك إذا بتقدر تقدّم هلق أو من أي تاريخ، وشو ناقصك.</p>'
+'<p>هالدليل لكل شخص عايش بهولندا بإقامة، وبدو يجهّز طلب الإقامة الأوروبية الدائمة بنفسه. مقسوم لـ<strong>6 محطات</strong> بالترتيب اللي بتمشي فيه فعلياً. كل معلومة معلّمة بلون:</p>'
+'<div class="st-legend"><span><b style="color:#1b5fa8">■ قاعدة رسمية</b> نص منشور من IND أو مكتوب بالاستمارة، ومصدره تحت القسم.</span>'
'<span><b style="color:#16803c">■ نصيحة عملية</b> خبرة تنظيمية بتسهّل عليك، بس مش شرط رسمي.</span>'
'<span><b style="color:#8a5200">■ غير محسوم</b> ما لقينا نص رسمي واضح. بهالحالة اسأل IND.</span></div>'
+ROUTE(ST_AR)
+'<p>ولكل نوع إقامة دليل إضافي: <a href="/articles/permanent-residence-asylum-route.html">من إقامة اللجوء للإقامة الدائمة</a> و<a href="/articles/permanent-residence-regular-route.html">الإقامة الدائمة لأصحاب الإقامة العادية</a>.</p>'

# ---------- 1 conditions
+H(1,'conditions','الشروط: مين بيحقله يقدّم؟')
+'<p>الإقامة الأوروبية الدائمة إلها خمس شروط أساسية. لازم تكون مستوفيها كلها يوم بيوصل طلبك:</p>'
+T([['<strong>نوع إقامتك الحالية</strong>','إقامة غير محددة المدة (النوع II أو IV)، أو إقامة لجوء (النوع III)، أو إقامة عادية (النوع I) غرضها <strong>غير مؤقت</strong>.'],
    ['<strong>المدة</strong>','5 سنوات متواصلة على الأقل بهولندا بإقامة هولندية صالحة، مباشرة قبل الطلب.'],
    ['<strong>الغياب</strong>','خلال هالسنين الخمس: ولا مرة أكتر من <strong>6 أشهر ورا بعض</strong>، وما يزيد المجموع عن <strong>10 أشهر</strong>.'],
    ['<strong>الدخل</strong>','دخل مستقل ومستدام وكافٍ (المحطة 2).'],
    ['<strong>الاندماج</strong>','شهادة الاندماج أو إعفاء (تحت).'],
    ['<strong>البلدية والسلوك</strong>','مسجّل بعنوانك بالـ'+nl('BRP')+'، وما بتشكّل خطر على النظام العام، ودايماً التزمت بشروط إقامتك.']],
   ['الشرط','شو يعني'])
+RULE('<p>ملصق الإقامة بالجواز (<span lang="nl" dir="ltr">verblijfssticker</span>) مش إقامة. والسنين اللي كانت فيها إقامتك <strong>دراسة</strong> بتنحسب <strong>بالنص</strong>: سنتين دراسة = سنة وحدة. أما سنين الإقامات المؤقتة التانية (مثل الشغل الموسمي أو العلاج) فما بتنحسب أبداً.</p>')
+'<h3>أمثلة على الغياب <small class="muted">(أمثلة توضيحية وليست حالات أشخاص حقيقيين)</small></h3>'
+T([['سفرتين: شهرين وبعدين 3 أشهر','المجموع 5 أشهر، والأطول 3','✅ ضمن الحدود'],
    ['سفرة وحدة 7 أشهر ورا بعض','أطول من 6 أشهر متتالية','❌ تجاوز الحد'],
    ['خمس سفرات، كل وحدة شهرين ونص','المجموع 12 ونص شهر','❌ أكتر من 10 أشهر مجموعاً']],
   ['السفر خلال آخر 5 سنين','الحساب','النتيجة'])
+TIP('<p>قبل ما تعبّي الاستمارة، اجمع تواريخ سفرك من تذاكر الطيران وأختام الجواز، وحطها بجدول صغير. استمارة اللجوء 6011 بتسألك مباشرة عن هالفترات.</p>')
+'<h3>الاندماج (inburgeringsvereiste)</h3>'
+'<p>إذا عمرك 18 أو أكتر، بتحتاج واحدة من هدول:</p><ul>'
'<li><strong>دبلوم الاندماج</strong> ('+nl('inburgeringsdiploma')+').</li>'
'<li><strong>شهادة الاندماج</strong> ('+nl('certificaat inburgering')+')، بس إذا كنت تابع لقانون الاندماج 2021.</li>'
'<li><strong>إعفاء</strong>: مثلاً إذا عشت بهولندا 8 سنين بعمر المدرسة الإلزامية (من 5 لـ 16 سنة تقريباً) وكنت مسجّل بالـ'+nl('BRP')+' (مش لازم ورا بعض)، أو عندك شهادة هولندية بالدراسة باللغة الهولندية مثل '+nl('MBO')+' من المستوى 2 وطالع، '+nl('HAVO')+'، '+nl('VWO')+'، '+nl('MAVO')+'، '+nl('VMBO')+'، أو الجامعة، أو عندك قرار إعفاء رسمي.</li></ul>'
+RULE('<p>اللي عمره أقل من 18، أو وصل لعمر التقاعد (AOW)، ما بيقدّم امتحان اندماج. وبترفق «ملحق الاندماج» ('+nl('Bijlage Inburgeringsvereiste')+') بالطلب، وبتعلّم فيه على حالتك، ومعه الإثبات. نسخة دبلوم الاندماج بتكون نسخة عادية، أما الشهادات المدرسية فلازم <strong>نسخة مصدّقة</strong> من المدرسة نفسها.</p>')
+'<h3>شو بتعطيك هالإقامة؟</h3><ul>'
'<li>إقامة <strong>بلا تاريخ انتهاء</strong> (النوع V). البطاقة نفسها صالحة 5 سنين وبتجددها.</li>'
'<li>نفس حقوق الإقامة الهولندية الدائمة، والشغل حر ('+nl('Arbeid vrij toegestaan, TWV niet vereist')+').</li>'
'<li>إمكانية تسكن بدولة أوروبية تانية أكتر من 3 أشهر، حسب شروط هديك الدولة.</li>'
'<li>عليك تخبّر IND بأي تغيير بوضعك ('+nl('informatieplicht')+').</li></ul>'
+'<h3>الأوروبية أو الهولندية الدائمة؟</h3>'
+RULE('<p>بالاستمارة 6009، IND بتفحص أولاً الإقامة الأوروبية. إذا ما انطبقت، بتفحص الإقامة الهولندية الدائمة ('+nl('regulier onbepaalde tijd')+')، وإذا ما انطبقت كمان، بتفحص تمديد إقامتك الحالية. يعني طلب واحد بيغطي التلاتة. الفرق المهم: الدراسة بتنحسب بالنص للأوروبية وكاملة للهولندية، وإعفاءات الدخل (مثل 10 سنين إقامة) للهولندية بس.</p>')
+SRCL('صفحة IND للإقامة الأوروبية (آخر تحديث 11 نوفمبر 2026)؛ الاستمارة 6009-2026/3 الصفحات 1–3؛ ملحق الاندماج 7116')

# ---------- 2 income
+H(2,'income','الدخل: قديش، ومن وين، وقديش لازم يدوم؟')
+'<p>IND بتطلب دخل <strong>مستقل</strong> (مش من المساعدات الاجتماعية)، و<strong>مستدام</strong> (بيضل موجود)، و<strong>كافٍ</strong> (ما بينزل تحت المبلغ). وبتقارن الـ'+nl('sv-loon')+'، يعني الراتب الإجمالي اللي مكتوب على قسيمة الراتب، مش الصافي.</p>'
+T([['أنت لحالك بتظهر الدخل','€ 1.635,90','€ 1.766,77'],
    ['زوجك أو شريكك المسجّل أو اللي ساكن معك بيظهر الدخل (لحاله أو معك)','€ 2.337,00','€ 2.523,96'],
    ['واحد من العيلة بيظهر الدخل، وهو أب أو أم لحاله','€ 1.635,90','€ 1.766,77']],
   ['مين بيظهر الدخل؟','بدون بدل العطلة','إذا بدل العطلة بينزل كل شهر'])
+RULE('<p>هالمبالغ إجمالية بالشهر، وسارية من <strong>1 يوليو حتى 31 ديسمبر 2026</strong>، وبتتغير كل 1 يناير و1 يوليو. إذا بدل العطلة ('+nl('vakantiegeld')+') بيوصلك مرة بالسنة، قارن مع العمود الأول. وإذا بيوصلك جزء كل شهر مع الراتب، قارن مع التاني. ولما IND بتفحص السنين الماضية، بتستعمل مبالغ هديك السنين.</p>')
+RULE('<p><strong>دخل الزوج أو الأهل بينحسب</strong> للإقامة الأوروبية إذا: كنتوا متزوجين أو شراكة مسجّلة وساكنين سوا بهولندا (أو ساكن مع أهلك)، وهو هولندي أو معه إقامة هولندية. كل دخل لازم يكون مستقل ومستدام، والمجموع ما ينزل عن المبلغ المطلوب.</p>')
+'<h3>عقد الشغل: قديش باقي منه يوم بتستلم IND طلبك؟</h3>'
+T([['سنة أو أكتر، أو عقد دائم','مقبول. فترة التجربة بتنحسب.'],
    ['من 6 أشهر لأقل من سنة','لازم يكون دخلك كافي بالمتوسط آخر 12 شهر من الشغل أو من WW أو ZW، <strong>أو</strong> آخر 3 سنين.'],
    ['أقل من 6 أشهر، أو عقد مرن','لازم يكون دخلك كافي بالمتوسط آخر 3 سنين، وبدون أي '+nl('bijstand')+' أو مساعدة من المال العام فيها.'],
    ['عقد وكالة '+nl('Fase A'),'مقبول إذا باقي منه 12 شهر أو أكتر، ومكتوب فيه إنو بند الوكالة ('+nl('uitzendbeding')+') مستبعد، يعني الوكالة بتضل تدفع راتبك إذا خلص المشروع أو مرضت.']],
   ['المدة الباقية','شو بتطلب IND'])
+'<p>العقد المرن يعني مثلاً: عقد وكالة عادي، عقد '+nl('oproep')+'، صفر ساعات ('+nl('nuluren')+')، عقد موسمي، أو عقد '+nl('min-max')+'.</p>'
+T([['شغل حر ('+nl('zzp')+')','الدخل موجود من 18 شهر على الأقل، ومتوسط الربح الشهري بكل سنة مالية لا يقل عن 1.766,77 يورو.'],
    ['إعانة '+nl('WW')+' أو '+nl('ZW')+' أو '+nl('WIA')+'، أو '+nl('AOW')+' أو تقاعد','دخل مستقل. الإعانة لازم تضل 12 شهر على الأقل كمان.'],
    [nl('bijstand')+'، '+nl('Participatiewet')+'، '+nl('Wajong'),'<strong>ما بتنحسب</strong>، لأنها من المال العام.']],
   ['مصدر الدخل','القاعدة'])
+FIG('permres-contract','ar','إنفوغرافيك: أنواع عقود العمل وما يطلبه IND لكل منها للإقامة الأوروبية الدائمة، مع مبالغ الدخل','هل عقدك كافٍ للإقامة الأوروبية الدائمة؟')
+'<h3>مثال حساب <small class="muted">(أمثلة توضيحية وليست حالات أشخاص حقيقيين)</small></h3>'
+'<p>زوجين ساكنين سوا. هو بيشتغل بعقد دائم وراتبه الإجمالي 1.400 يورو، وهي بتشتغل بعقد باقي منه 14 شهر وراتبها 1.000 يورو. المجموع 2.400 يورو، وهو أكتر من 2.337,00. والعقدين مستدامين، فشرط الدخل بيمشي للاتنين. لو عقدها باقي منه 4 أشهر بس، لازم يكون معها سجل دخل لآخر 3 سنين.</p>'
+'<h3>إذا عقدك جديد وما عندك قسائم راتب بعد</h3>'
+RULE('<p>ملحق إثبات الدخل بيقول: إذا ما عندك قسائم راتب لأن العقد <strong>لسا ما بلّش</strong>، ابعتها لـ IND بعدين بأسرع وقت. ومدة العقد بتنحسب من <strong>اليوم اللي بتستلم فيه IND الطلب</strong>.</p>')
+OPEN('<p>النص ما بيوضّح إذا «لسا ما بلّش» بيتقاس بيوم الإرسال أو يوم الوصول. وإذا العقد بلّش وعندك أقل من 3 قسائم، ما في استثناء مكتوب. ابعت العقد و'+nl('Werkgeversverklaring')+' والقسائم الموجودة، وابعت كل قسيمة جديدة أول ما تطلع. أو استنى القسيمة التالتة إذا وقت إقامتك بيسمح. IND ممكن تطلب الناقص ويتأخر القرار.</p>')
+TIP('<p>إذا دخلك لحالك ما بيكفي للإقامة الدائمة، تذكّر إنو <strong>التجنيس ما فيه شرط دخل</strong>. شوف <a href="/calculators/permanent-residence-check.html">الفاحص</a> حتى تعرف أي طريق أقرب إلك.</p>')
+SRCL('صفحة IND لشروط الدخل (تحديث 1 يوليو 2026)؛ صفحة IND للمبالغ المطلوبة (1 يوليو حتى 31 ديسمبر 2026)؛ ملحق 7111')

# ---------- 3 documents
+H(3,'documents','الأوراق: شو بتبعت حسب حالتك؟')
+'<p>في أوراق بيبعتها الكل، وأوراق حسب مصدر دخلك. القائمة الرسمية مكتوبة بالاستمارة تحت السبب اللي بتختاره، وبملحق إثبات الدخل.</p>'
+T([['الاستمارة كاملة وموقّعة، مع صفحة الغلاف','✅ الكل'],
    [nl('Antecedentenverklaring')+' (أسئلة السوابق)','✅ كل شخص عمره 12 أو أكتر'],
    ['ملحق الاندماج مع الإثبات','✅ الكل (إلا إذا معفى بسبب العمر، بتعلّم على هالخيار)'],
    [nl('Werkgeversverklaring')+' من كل صاحب شغل، عمرها ما بيزيد عن 3 أشهر','الشغل بأجر (ومن صاحب شغل الزوج إذا دخله بينحسب)'],
    ['عقد الشغل والقسائم حسب مدة العقد (الجدول التالي)','الشغل بأجر'],
    [nl('Verklaring inkomen zelfstandig ondernemer')+'، معبّاية من محاسب معتمد أو إداري عنده رقم '+nl('BECON'),'الشغل الحر'],
    ['قرار الإعانة وآخر بيان إلها','إعانة '+nl('WW')+'، '+nl('ZW')+'، '+nl('WIA')+' أو تقاعد'],
    ['إقرار ضريبي للسنة الماضية، آخر تقدير ضريبي، وإثبات رأس المال','دخل من رأس مال'],
    ['أوراق دخل الزوج أو الشريك','إذا انحسب دخله'],
    ['رسالة الظروف الخاصة مع إثباتاتها','إذا في شي لازم IND تعرفه'],
    ['الوثائق الأجنبية الرسمية مصدّقة ومترجمة للهولندي أو الإنجليزي أو الفرنسي أو الألماني','إذا عندك']],
   ['الورقة','مين بيبعتها؟'])
+'<h3>الشغل بأجر: شو بتبعت حسب مدة عقدك؟</h3>'
+T([['سنة أو أكتر','العقد + قسائم آخر 3 أشهر (وآخر 12 شهر إذا راتبك أعلى من العقد بسبب ساعات إضافية).'],
    ['من 6 أشهر لأقل من سنة','العقد أو إفادة من صاحب الشغل إنو الشغل باقي 6 أشهر + لآخر 12 شهر: كل القسائم والـ'+nl('jaaropgave')+' والعقود، أو بيانات '+nl('WW')+'/'+nl('ZW')+'.'],
    ['أقل من سنة، أو عقد مرن أو وكالة','العقد + لآخر 3 سنين: كل الـ'+nl('jaaropgaven')+' والعقود وقرارات الإعانة وبياناتها.']],
   ['مدة العقد الباقية','الأوراق'])
+RULE('<p>ابعت <strong>نسخ على ورق A4</strong>، ولا تبعت الأصول أبداً. اكتب رقم الـ V أو بياناتك على كل نسخة. نسخ الوثائق الرسمية ('+nl('aktes')+') لازم تكون ملوّنة. ولا تبعت أغراض مثل USB أو ألبومات صور.</p>')
+SRCL('الاستمارة 6009-2026/3 (الصفحات 2–3 والقسم 2)؛ ملحق إثبات الدخل 7111؛ ملحق الاندماج 7116؛ صفحة IND للإقامة الأوروبية')

# ---------- 4 form
+H(4,'form','الاستمارة: 6009 أو 6011؟')
+'<p>نوع إقامتك الحالية هو اللي بيحدد الاستمارة وطريقة التقديم:</p>'
+'<div class="st-flow"><div><h3>إقامة عادية (regulier)</h3><p>النوع I بغرض غير مؤقت، أو النوع II، أو إقامة '+nl('Chavez')+' أو '+nl('Blue Card')+'.</p><p><span class="st-form">6009</span></p>'
'<p>✅ <strong>أونلاين</strong> عبر ind.nl إذا عندك '+nl('DigiD')+' وعشت 5 سنين بهولندا، وبتدفع فوراً بـ'+nl('iDEAL | Wero')+'.<br>✅ أو <strong>بالبريد</strong>: استمارة ورقية من 30 صفحة.</p></div>'
'<div><h3>إقامة لجوء (asiel)</h3><p>النوع III، ومنها الإقامة المشتقة لأفراد العيلة.</p><p><span class="st-form">6011</span></p>'
'<p>📮 <strong>بالبريد فقط</strong>: استمارة من 26 صفحة.<br>⏱️ بتقدّم بأبكر شي <strong>3 أشهر قبل</strong> ما تكمّل 5 سنين إقامة متواصلة.</p></div></div>'
+TIP('<p>رقم إصدار الاستمارة مكتوب أسفل كل صفحة (مثلاً '+nl('6009-2026/3')+'). قبل ما تطبع، قارنه مع الموجود على '+nl('ind.nl/formulieren')+' حتى تكون معك آخر نسخة.</p>')
+'<h3>الاستمارة 6009 قسماً قسماً</h3>'
+T([['التعليمات والشرح','اقرأها: لمين الاستمارة، النسخ، الـ'+nl('BRP')+'، الرسوم، البصمات','بتقراها'],
    ['1 · بياناتك','الاسم متل الجواز بالضبط، بأحرف كبيرة، والعنوان والحالة المدنية','بتعبّيها'],
    ['2 · سبب الطلب','علّم على <strong>سبب واحد بس</strong>. الأكتر شيوعاً: «5 سنين أو أكتر بإقامة محددة المدة» ('+nl('310 - 503')+'). تحت السبب مكتوبة الأوراق المطلوبة','بتعلّم'],
    ['3 · السوابق','بترفق ملحق '+nl('Antecedentenverklaring')+' معبّى وموقّع','بتعبّي الملحق'],
    ['4 · الجواز (4.1)','جوازك ساري؟ نعم أو لا مع الشرح. بيلزم إذا IND فحصت تمديد إقامتك','بتعبّيها'],
    ['5 · ظروف خاصة','إذا في شي مهم ما انذكر، بتكتب رسالة مع إثباتاتها','عند الحاجة'],
    ['6 · التوقيع','الاسم، المكان والتاريخ، <strong>عدد المرفقات</strong>، والتوقيع','بتوقّع'],
    ['7 · الإرسال','قائمة فحص أخيرة وعنوان IND','بتقراها']],
   ['القسم','شو فيه','شو بتعمل'])
+'<p><strong>الملاحق جوّا الاستمارة 6009:</strong></p>'
+T([[nl('Antecedentenverklaring'),'أسئلة السوابق','أنت (من عمر 12)','✅'],
    [nl('Werkgeversverklaring'),'بيانات الشغل والراتب، مع توقيع وختم','صاحب الشغل','✅ إذا بتشتغل بأجر'],
    [nl('Bewijsmiddelen inkomen'),'دليل الأوراق حسب حالتك','بتقراه بس','❌ لا تبعته'],
    [nl('Zelfstandig ondernemer'),'أرباح الشغل الحر وإفادة المحاسب','أنت والمحاسب','✅ إذا شغلك حر'],
    [nl('Inburgeringsvereiste'),'حالتك بالاندماج مع الإثبات','أنت','✅']],
   ['الملحق','شو فيه','مين بيعبّيه','بينبعت؟'])
+RULE('<p>ملحق إثبات الدخل مكتوب عليه: «'+nl('Stuur deze bijlage niet mee met de aanvraag')+'»، يعني لا تبعته مع الطلب. وصفحة الغلاف مكتوب عليها إنك لازم تبعتها مع الطلب.</p>')
+OPEN('<p>ما في نص واضح إذا لازم تبعت صفحات الشرح، أو الملاحق اللي ما بتنطبق عليك. الأسلم: لا تقطع أي صفحة من الاستمارة إلا بعد ما تسأل IND.</p>')
+'<h3>الاستمارة 6011 (اللجوء) قسماً قسماً</h3>'
+T([['التعليمات والشرح','الشروط، متى بتقدّم، الـ'+nl('BRP')+'، النسخ، وشو بيصير بعد الطلب','بتقراها'],
    ['1 · بياناتك','رقم الـ V موجود برسائل IND','بتعبّيها'],
    ['2 · الإقامة المطلوبة','بتعلّم على الإقامة الأوروبية ('+nl('513')+')','بتعلّم'],
    ['3 · السوابق','الملحق للي عمره 12 أو أكتر','بتعبّي الملحق'],
    ['4 · الاندماج','ملحق الاندماج مع الإثبات','بترفقه'],
    ['5 · الدخل',''+nl('Werkgeversverklaring')+' عمرها ما بيزيد عن 3 أشهر، أو إثبات دخل آخر','بترفقه'],
    ['6 · الإقامة الأساسية ('+nl('hoofdverblijf')+')','بتعلّم على وحدة: غبت أكتر من 6 أشهر ورا بعض من وقت بدأت إقامتك الحالية، أو أكتر من 10 أشهر مجموعاً بآخر 5 سنين، أو ولا وحدة منهم. وإذا غبت، بتكتب البلد والفترة والسبب','بتعبّيها'],
    ['7 · مكان استلام البطاقة','أمستردام، لاهاي، خوس، ماستريخت، دن بوس، نايميخن، أو زفوله','بتختار'],
    ['8 · التوقيع','الاسم، المكان والتاريخ، عدد المرفقات، والتوقيع','بتوقّع'],
    ['9 · الإرسال','قائمة فحص أخيرة وعنوان IND','بتقراها']],
   ['القسم','شو فيه','شو بتعمل'])
+RULE('<p>استمارة لكل شخص، والطلب بينبعت كامل مرة وحدة مش على دفعات. الولد من عمر 12 بيوقّع بنفسه، وعن الأصغر بيوقّع الأب أو الأم، واللي أقل من 12 ما بيعبّي ملحق السوابق. وإذا انرفض طلب الـ6011 بسبب الدخل أو الاندماج، IND بتفحص إذا بتقدر تجدد وثيقة إقامة اللجوء.</p>')
+SRCL('الاستمارة 6009-2026/3 (30 صفحة، الأقسام 1–7)؛ الاستمارة 6011-2026/5 (26 صفحة، الأقسام 1–9)؛ صفحة IND للإقامة الأوروبية')

# ---------- 5 send
+H(5,'send','التوقيت والإرسال والرسوم')
+RULE('<p>المهم هو <strong>تاريخ وصول الطلب لـ IND</strong>، مش تاريخ إرساله. الاستمارة 6009 بتقول: تأكد إنو الطلب وصل لـ IND قبل ما تنتهي إقامتك، حتى ما يصير عندك انقطاع بالإقامة ('+nl('verblijfsgat')+')، لأنه بيأثر على طلبات بعدين مثل التجنيس. وبتقدر تقدّم من <strong>3 أشهر قبل انتهاء</strong> إقامتك، وإذا صرلك أكتر من 5 سنين بإقامة، بتختار الوقت اللي بدك ياه.</p>')
+OPEN('<p>ما لقينا نص رسمي بيقول إنو تاريخ إيصال البريد بيعتبر تاريخ التقديم. فلا تستنى للأسبوع الأخير قبل ما تنتهي إقامتك.</p>')
+TIP('<p>1 يناير مش موعد نهائي للتقديم. بس الرسوم بتتغير بـ1 يناير، ومبالغ الدخل بتتغير بـ1 يناير و1 يوليو، فتأكد من الأرقام إذا طلبك قريب من هالتواريخ.</p>')
+'<h3>الإرسال بالبريد بـ9 خطوات</h3><ol class="st-steps">'
'<li><strong>اطبع</strong> الاستمارة على ورق A4 بالحجم الحقيقي، والأوراق نسخ.</li>'
'<li><strong>راجع التواقيع</strong>: الاستمارة، ملحق السوابق، صاحب الشغل، وعدد المرفقات.</li>'
'<li><strong>العنوان</strong>: '+nl('Immigratie- en Naturalisatiedienst, Postbus 9, 9560 AA Ter Apel')+'.</li>'
'<li><strong>رتّب الظرف</strong> بدون دبابيس ولا مشابك، واحتفظ بنسخة كاملة عندك.</li>'
'<li><strong>ابعته مسجّل</strong> ('+nl('aangetekend')+') من نقطة '+nl('PostNL')+'. هاد اختياري بس بيعطيك إثبات، مش شرط من IND.</li>'
'<li><strong>صوّر إيصال الإرسال</strong> اللي عليه رمز التتبع ('+nl('Track &amp; Trace')+').</li>'
'<li><strong>تابع الظرف</strong> بالرمز. البريد المسجّل لصندوق بريد ممكن يتأخر شوي بالتسليم.</li>'
'<li><strong>احفظ إثبات التسليم</strong> من حسابك بـ'+nl('PostNL')+'.</li>'
'<li><strong>استنى رسالة الاستلام</strong> من IND ('+nl('ontvangstbevestiging')+')، وفيها رقم الملف ('+nl('zaaknummer')+').</li></ol>'
+'<h3>الرسوم 2026</h3>'
+T([['بالغ','€ 254'],['قاصر تحت 18','€ 85'],['مواطن تركي بالغ','€ 85'],['مواطن تركي قاصر','€ 46'],['تجديد البطاقة كل 5 سنين','€ 85 (الطفل € 46)']],['مين','الرسوم'])
+'<p>كل شخص بيقدّم استمارته وبيدفع رسوم طلبه، وما في خصم للعيلة، والزوج أو الولاد ما بياخدوا الإقامة الأوروبية تلقائياً. <small class="muted">(أمثلة توضيحية محسوبة من التعرفة الرسمية)</small></p>'
+T([['بالغ لحاله','€ 254'],['زوجين، كل واحد بطلب','€ 508'],['أب أو أم مع ولد قاصر','€ 339'],['زوجين مع ولدين','€ 678'],['زوجين مع 3 ولاد','€ 763'],['مواطن تركي مع ولدين','€ 177']],['الحالة','المجموع'])
+RULE('<p>أونلاين بتدفع فوراً بـ'+nl('iDEAL | Wero')+'. بالبريد بتوصلك رسالة فيها المبلغ وطريقة الدفع. والرسوم <strong>ما بترجع</strong> إذا انرفض الطلب.</p>')
+TIP('<p>بتقدر تجهّز طلبات العيلة وتبعتها سوا، بشرط كل طلب يكون كامل مع مرفقاته واسم صاحبه. وانتبه: هالدليل عن حصول كل فرد على الإقامة الأوروبية بنفسه. لمّ الشمل وإقامة الزوج أو الولد عند صاحب إقامة إجراءات تانية باستمارات ورسوم مختلفة.</p>')
+SRCL('الاستمارة 6009-2026/3 (الصفحات 1–3 والقسم 7)؛ صفحة IND للإقامة الأوروبية؛ صفحة IND «Leges: kosten van een aanvraag» (تعرفة 2026)')

# ---------- 6 after
+H(6,'after','شو بيصير بعد ما تقدّم؟')
+'<ol class="st-steps">'
'<li><strong>رسالة الاستلام</strong> ('+nl('ontvangstbevestiging')+'): بتأكد إنو IND استلمت طلبك، وفيها رقم الملف. هي مش قرار. وممكن تذكر إنو IND بحاجة لصورتك وتوقيعك وبصماتك.</li>'
'<li><strong>رسالة الدفع</strong> (للطلب الورقي): فيها المبلغ وطريقة الدفع. التأخير بالدفع بيأخر المعالجة.</li>'
'<li><strong>موعد البصمات</strong> ('+nl('biometrie')+'): بتحجزه بس بعد ما توصلك رسالة من IND. البصمات من عمر 6، والتوقيع من عمر 12.</li>'
'<li><strong>خلال المعالجة</strong>: تابع طلبك بـ'+nl('Mijn IND')+'. إذا ناقص شي، IND بتطلبه. وخبّرها بأي تغيير بوضعك.</li>'
'<li><strong>القرار</strong>: خلال <strong>6 أشهر</strong>، وممكن تطول مثلاً إذا الملف ناقص. بتستنى القرار بهولندا، وإذا انرفض بتقدر تعترض ('+nl('bezwaar')+').</li>'
'<li><strong>البطاقة</strong>: إذا انقبل، بتوصلك رسالة، وبتستلم البطاقة بموعد. البطاقة من النوع V وصالحة 5 سنين.</li></ol>'
+'<h3>بعت أوراق بعد التقديم</h3>'
+T([[nl('Mijn IND'),'مع '+nl('DigiD')+' ورمز SMS ورقم الملف. ملفات PDF بدون كلمة سر أو JPG، كل ملف أقل من 8 ميغا، والمجموع لحد 40 ميغا.'],
    ['بريد آمن','للي ما عنده '+nl('DigiD')+'، من صفحة IND «'+nl('Uw stukken opsturen')+'»، وبتكتب رقم الملف بموضوع الرسالة.'],
    ['البريد العادي','على عنوان البريد المذكور بصفحة IND، ورقم الـ V ورقم الملف على كل نسخة.']],
   ['الطريقة','التفاصيل'])
+RULE('<p>إذا قدّمت قبل ما تنتهي إقامتك، بتضل محتفظ بحق الشغل المكتوب على بطاقتك الحالية خلال المعالجة. وإذا انتهت البطاقة وما طلع القرار، بتقدر تحجز موعد لملصق إقامة مؤقت ('+nl('sticker verblijfsaantekening')+').</p>')
+'<h2 id="checklist">قائمة المراجعة الأخيرة</h2><p>علّم على كل بند قبل ما تسكّر الظرف. العلامات بتنحفظ بمتصفحك بس.</p>'
+'<h3>الاستمارة</h3>'+CHK('eu-ar-form',['آخر إصدار، مطبوع على A4 بالحجم الحقيقي، مع صفحة الغلاف.','القسم 1 بأحرف كبيرة، والاسم متل الجواز.','سبب واحد بس بالقسم 2 (6009)، أو قسم الغياب 6 معبّى (6011).','الجواز (4.1 بالـ6009) معبّى.','التوقيع والتاريخ وعدد المرفقات.','استمارة منفصلة لكل فرد من العيلة.'])
+'<h3>المرفقات والإثباتات</h3>'+CHK('eu-ar-docs',[nl('Antecedentenverklaring')+' بصفحتيها (من عمر 12).','ملحق الاندماج مع الإثبات (دبلوم الاندماج نسخة عادية، والشهادات نسخة مصدّقة).',nl('Werkgeversverklaring')+' من كل صاحب شغل، موقّعة ومختومة، وعمرها أقل من 3 أشهر.','إذا شغلك حر: ملحق '+nl('Zelfstandig ondernemer')+' مع إفادة المحاسب.','ما حطيت ملحق '+nl('Bewijsmiddelen inkomen')+' بالظرف.','أوراق الدخل حسب حالتك وحسب مدة العقد.','أوراق دخل الشريك، إذا انحسب.','نسخ A4 مش أصول، ورقم الـ V أو بياناتي على كل نسخة.'])
+'<h3>الإرسال وبعده</h3>'+CHK('eu-ar-send',['بدون دبابيس ولا مشابك، وعلى عنوان '+nl('Postbus 9, 9560 AA Ter Apel')+'.','إقامتي سارية، والطلب رح يوصل قبل ما تنتهي بوقت كافي.','عندي نسخة كاملة، وإيصال الإرسال محفوظ.','إثبات التسليم ورسالة الاستلام محفوظين.','دفعت بعد رسالة الدفع، وحجزت البصمات بعد رسالة IND.'])
+'<p>عندك سؤال مش موجود هون؟ هاتف IND: '+nl('088 043 04 30')+' (من برا هولندا '+nl('+31 88 043 04 30')+').</p>'
+SRCL('صفحة IND للإقامة الأوروبية؛ الاستمارة 6009-2026/3 الصفحة 4؛ الاستمارة 6011-2026/5 الصفحة 2؛ صفحات IND «Documenten uploaden» (24 فبراير 2026) و«Uw stukken opsturen» (6 يوليو 2026)')
),
faq=[('هل لازم يكون عقدي دائم؟','لا. العقد المؤقت بيكفي إذا باقي منه سنة أو أكتر يوم بتستلم IND طلبك. والعقد الأقصر بيمشي مع سجل دخل كافي لآخر 12 شهر أو 3 سنين حسب المدة الباقية.'),
('هل بيكفي راتب الحد الأدنى للأجور؟','بدوام كامل غالباً نعم، لأن المطلوب 1.635,90 يورو إجمالي بالشهر بدون بدل العطلة. بس لازم يكون العقد مستدام كمان.'),
('هل بينحسب دخل زوجي أو زوجتي؟','نعم، إذا كنتوا متزوجين أو شراكة مسجّلة وساكنين سوا بهولندا، والشريك هولندي أو معه إقامة هولندية، وكل دخل مستقل ومستدام. المجموع لازم ما ينزل عن 2.337,00 يورو.'),
('عشت 10 سنين بهولندا، هل أنا معفى من شرط الدخل؟','للإقامة الأوروبية لا. إعفاء العشر سنين للإقامة الهولندية الدائمة بس (regulier onbepaalde tijd)، والاستمارة 6009 بتفحصها تلقائياً إذا ما انطبقت الأوروبية.'),
('بقدر أقدّم وأنا على المساعدة (bijstand)؟','بتقدر تقدّم، بس الـ bijstand ما بينحسب دخل، فرح ينرفض شرط الدخل إلا إذا دخل شريكك بيكفي. والتجنيس ما فيه شرط دخل.'),
('هل شهادة NT2 بتعفيني من الاندماج؟','لـ IND، شهادة NT2 لحالها ما بتكفي بالعادة. بتحتاج دبلوم الاندماج أو قرار إعفاء، أو واحدة من الشهادات المذكورة بملحق الاندماج.'),
('بقدر أقدّم أونلاين؟','إذا معك إقامة عادية وعندك DigiD وعشت 5 سنين بهولندا، نعم، عبر ind.nl بالاستمارة 6009، وبتدفع فوراً. أصحاب إقامة اللجوء بيقدّموا 6011 بالبريد بس.'),
('متى بقدر أقدّم إذا معي إقامة لجوء؟','بأبكر شي 3 أشهر قبل ما تكمّل 5 سنين إقامة متواصلة وقانونية.'),
('هل ببعت الأصول؟','لا. نسخ على A4 بس، ورقم الـ V على كل نسخة. والشهادات المدرسية نسخة مصدّقة من المدرسة.'),
('هل بترجعلي الرسوم إذا انرفض الطلب؟','لا، الرسوم ما بترجع.'),
('أولادي بياخدوا الإقامة تلقائياً؟','لا. كل ولد إله استمارته ورسومه (85 يورو للقاصر). اللي عمره 12 أو أكتر بيوقّع بنفسه.'),
('قديش بياخد القرار؟','IND عندها 6 أشهر للقرار، وممكن تطوّل إذا الملف ناقص. وبتستنى القرار بهولندا.')],
src_note='راجعنا صفحات IND (الإقامة الأوروبية بتحديث 11 نوفمبر 2026، شروط الدخل، المبالغ، الرسوم، رفع الأوراق) والاستمارتين 6009-2026/3 و6011-2026/5 والملحقين 7111 و7116 في 26 نوفمبر 2026. المبالغ سارية حتى 31 ديسمبر 2026، والرسوم بتتغير كل 1 يناير.')

import re as _re
AR['body']=_re.sub(r'€ ?[\d.,]+(?: \(الطفل € \d+\))?', lambda m:'<span dir="ltr" class="eur">'+m.group(0)+'</span>', AR['body'])

# ---------------------------------------------------------------- NL
NL=dict(title='EU-langdurig ingezetene aanvragen in 2026: praktische gids in 6 stappen, van voorwaarden tot beslissing',
seo_title='EU-langdurig ingezetene 2026: stap voor stap',
crumb='EU-langdurig ingezetene',
desc='Praktische gids EU-langdurig ingezetene in 6 stappen: voorwaarden, inkomen € 1.635,90, documenten per situatie, formulier 6009 of 6011 per onderdeel, versturen, leges € 254 en wat er daarna gebeurt.',
summary='<ol><li><strong>EU-langdurig ingezetene</strong> is een vergunning zonder einddatum (type V). Het document is 5 jaar geldig, vernieuwen kost € 85, en je mag vrij werken zonder TWV.</li>'
'<li>Je hebt nodig: <strong>5 jaar onafgebroken</strong> geldig verblijf, niet langer dan <strong>6 maanden aaneen en 10 maanden in totaal</strong> weg, zelfstandig, duurzaam en voldoende inkomen, inburgering of vrijstelling, en inschrijving in de BRP.</li>'
'<li>Inkomen van 1 juli t/m 31 december 2026: <strong>€ 1.635,90</strong> bruto sv-loon per maand zonder vakantiegeld, of <strong>€ 2.337,00</strong> als het inkomen van je partner meetelt.</li>'
'<li>Asielvergunning: formulier <strong>6011, alleen per post</strong>. Reguliere vergunning: formulier <strong>6009</strong> per post of online met DigiD.</li>'
'<li>Leges 2026: <strong>€ 254</strong> voor een volwassene en € 85 voor een minderjarige; ieder gezinslid betaalt apart en bij afwijzing krijg je niets terug.</li></ol>',
body=(
'<p class="notice"><strong>Eerst even checken?</strong> Met de <a href="/nl/calculators/permanent-residence-check.html">snelle check verblijf en naturalisatie</a> zie je in een paar tikken of je nu kunt aanvragen, of vanaf welke datum, en wat er nog ontbreekt.</p>'
+'<p>Deze gids is voor iedereen die met een verblijfsvergunning in Nederland woont en de aanvraag EU-langdurig ingezetene zelf wil voorbereiden. Hij volgt <strong>6 stappen</strong> in de volgorde waarin je ze echt doorloopt. Elke informatie heeft een kleur:</p>'
+'<div class="st-legend"><span><b style="color:#1b5fa8">■ Officiële regel</b> tekst van de IND of uit het formulier; de bron staat onder het onderdeel.</span>'
'<span><b style="color:#16803c">■ Praktische tip</b> ervaring die het makkelijker maakt, geen officiële voorwaarde.</span>'
'<span><b style="color:#8a5200">■ Niet zeker</b> geen duidelijke officiële tekst gevonden; vraag het de IND.</span></div>'
+ROUTE(ST_NL)
+'<p>Per type vergunning is er een aparte gids: <a href="/nl/articles/permanent-residence-asylum-route.html">van asielvergunning naar permanent verblijf</a> en <a href="/nl/articles/permanent-residence-regular-route.html">permanent verblijf met een reguliere vergunning</a>.</p>'

+H(1,'conditions','Voorwaarden: wie mag aanvragen?','nl')
+'<p>Op de dag dat je aanvraag binnenkomt, moet je aan al deze voorwaarden voldoen:</p>'
+T([['<strong>Huidige vergunning</strong>','Onbepaalde tijd (type II of IV), asiel (type III), of regulier bepaalde tijd (type I) met een <strong>niet-tijdelijk</strong> verblijfsdoel.'],
    ['<strong>Duur</strong>','Minimaal 5 jaar onafgebroken in Nederland met een geldige Nederlandse verblijfsvergunning, direct vóór de aanvraag.'],
    ['<strong>Afwezigheid</strong>','In die 5 jaar nooit langer dan <strong>6 maanden aaneen</strong> en in totaal niet langer dan <strong>10 maanden</strong> buiten Nederland.'],
    ['<strong>Inkomen</strong>','Zelfstandig, duurzaam en voldoende (stap 2).'],
    ['<strong>Inburgering</strong>','Inburgeringsdiploma of vrijstelling (zie hieronder).'],
    ['<strong>BRP en gedrag</strong>','Ingeschreven in de BRP, geen gevaar voor de openbare orde, en altijd voldaan aan de voorwaarden van je vergunning.']],
   ['Voorwaarde','Wat betekent dat'])
+RULE('<p>Een verblijfssticker in je paspoort is geen verblijfsvergunning. Jaren met een vergunning voor <strong>studie</strong> tellen voor de <strong>helft</strong>: twee jaar studie = één jaar. Andere tijdelijke vergunningen (zoals seizoenarbeid of medische behandeling) tellen niet mee.</p>','nl')
+'<h3>Voorbeelden afwezigheid <small class="muted">(illustratief, geen echte personen)</small></h3>'
+T([['Twee reizen: 2 maanden en daarna 3 maanden','Totaal 5, langste 3','✅ Binnen de grenzen'],
    ['Eén reis van 7 maanden aaneen','Langer dan 6 maanden aaneen','❌ Over de grens'],
    ['Vijf reizen van elk tweeënhalve maand','Totaal twaalfenhalve maand','❌ Meer dan 10 maanden in totaal']],
   ['Reizen in de laatste 5 jaar','Berekening','Uitkomst'])
+TIP('<p>Verzamel vóór het invullen je reisdata uit tickets en paspoortstempels en zet ze in een tabelletje. Formulier 6011 vraagt hier direct naar.</p>','nl')
+'<h3>Inburgeringsvereiste</h3><p>Ben je 18 of ouder, dan heb je een van deze nodig:</p><ul>'
'<li>het <strong>inburgeringsdiploma</strong>;</li><li>het <strong>certificaat inburgering</strong> (alleen als de Wet inburgering 2021 voor jou geldt);</li>'
'<li>een <strong>vrijstelling</strong>, bijvoorbeeld omdat je minstens 8 jaar tijdens de leerplichtige leeftijd in Nederland woonde en in de BRP stond (niet per se aaneengesloten), of omdat je een Nederlands diploma hebt dat je in het Nederlands volgde, zoals MBO vanaf niveau 2, HAVO, VWO, MAVO, VMBO of universiteit, of een officieel vrijstellingsbesluit.</li></ul>'
+RULE('<p>Ben je jonger dan 18 of heb je de AOW-leeftijd bereikt, dan hoef je geen inburgeringsexamen te doen. Je stuurt de <strong>Bijlage Inburgeringsvereiste</strong> mee, kruist je situatie aan en voegt het bewijs bij. Een kopie van het inburgeringsdiploma hoeft niet gewaarmerkt te zijn; schooldiploma’s wel, door de school zelf.</p>','nl')
+'<h3>Wat geeft deze vergunning je?</h3><ul><li>Verblijf <strong>zonder einddatum</strong> (type V); het document is 5 jaar geldig en wordt vernieuwd.</li>'
'<li>Dezelfde rechten als regulier onbepaalde tijd, en vrij werken (‘Arbeid vrij toegestaan, TWV niet vereist’).</li>'
'<li>De mogelijkheid om langer dan 3 maanden in een andere EU-lidstaat te wonen, onder de voorwaarden van dat land.</li><li>Je moet wijzigingen doorgeven aan de IND (informatieplicht).</li></ul>'
+'<h3>EU-langdurig of regulier onbepaalde tijd?</h3>'
+RULE('<p>Met formulier 6009 kijkt de IND eerst naar EU-langdurig ingezetene, daarna naar regulier onbepaalde tijd, en daarna naar verlenging van je huidige vergunning. Eén aanvraag dekt dus alle drie. Belangrijk verschil: studie telt half voor EU-langdurig en volledig voor regulier; vrijstellingen van de inkomenseisen (zoals 10 jaar verblijf) gelden alleen voor regulier.</p>','nl')
+SRCL('IND-pagina EU-langdurig ingezetene (laatste update 11 november 2026); formulier 6009-2026/3 p. 1–3; Bijlage Inburgeringsvereiste 7116','nl')

+H(2,'income','Inkomen: hoeveel, waarvandaan, en hoe lang?','nl')
+'<p>De IND vraagt inkomen dat <strong>zelfstandig</strong> is (niet uit bijstand), <strong>duurzaam</strong> (het blijft) en <strong>voldoende</strong> (niet onder de norm). De IND kijkt naar het sv-loon: het brutoloon op je loonstrook, niet het nettobedrag.</p>'
+T([['Je toont zelf inkomen aan','€ 1.635,90','€ 1.766,77'],['Je echtgeno(o)t(e), geregistreerd of samenwonend partner toont inkomen aan (alleen of samen met jou)','€ 2.337,00','€ 2.523,96'],['Een gezinslid dat alleenstaande ouder is toont inkomen aan','€ 1.635,90','€ 1.766,77']],
   ['Wie toont het inkomen aan?','Zonder vakantiegeld','Met maandelijks vakantiegeld'])
+RULE('<p>Bruto per maand, geldig van <strong>1 juli t/m 31 december 2026</strong>; de bedragen veranderen op 1 januari en 1 juli. Krijg je vakantiegeld één keer per jaar, vergelijk dan met de eerste kolom; krijg je het maandelijks, met de tweede. Voor eerdere jaren gebruikt de IND de normbedragen van die jaren.</p>','nl')
+RULE('<p><strong>Inkomen van je partner of ouders telt mee</strong> voor EU-langdurig als je getrouwd of geregistreerd partner bent en samen in Nederland woont (of bij je ouders woont), en je partner of ouder Nederlander is of een Nederlandse verblijfsvergunning heeft. Elk inkomen moet zelfstandig en duurzaam zijn, en samen minstens gelijk aan het normbedrag.</p>','nl')
+'<h3>Arbeidscontract: hoe lang loopt het nog op de dag dat de IND je aanvraag ontvangt?</h3>'
+T([['12 maanden of langer, of vast','Goed; de proeftijd telt mee.'],['6 tot 12 maanden','Voldoende gemiddeld inkomen in de laatste 12 maanden uit werk of WW/ZW, <strong>of</strong> in de laatste 3 jaar.'],['Korter dan 6 maanden, of flexibel','Voldoende gemiddeld inkomen in de laatste 3 jaar, zonder bijstand of andere uitkering uit publieke middelen.'],['Fase A-uitzendcontract','Goed als het nog minstens 12 maanden loopt en het uitzendbeding is uitgesloten, zodat het bureau doorbetaalt als de opdracht stopt of je ziek wordt (Fase A duurt maximaal 78 weken).']],
   ['Resterende duur','Wat de IND vraagt'])
+'<p>Flexibel is bijvoorbeeld een gewoon uitzendcontract, oproep-, nuluren-, seizoens- of min-maxcontract.</p>'
+T([['Zelfstandige (zzp)','Je hebt dit inkomen al 18 maanden, en je gemiddelde fiscale winst per maand was in elk boekjaar minstens € 1.766,77.'],['WW, ZW, WIA, AOW of pensioen','Zelfstandig inkomen; de uitkering loopt nog minstens 12 maanden.'],['Bijstand, Participatiewet, Wajong','<strong>Telt niet</strong>: uitkering uit publieke middelen.']],['Bron van inkomen','Regel'])
+FIG('permres-contract','nl','Infographic: soorten arbeidscontracten en wat de IND per contract vraagt voor EU-langdurig ingezetene, met normbedragen 2026','Infographic: is jouw contract goed genoeg?')
+'<h3>Rekenvoorbeeld <small class="muted">(illustratief, geen echte personen)</small></h3>'
+'<p>Een stel woont samen. Hij werkt vast voor € 1.400 bruto, zij heeft een contract dat nog 14 maanden loopt voor € 1.000. Samen € 2.400, meer dan € 2.337,00, en beide contracten zijn duurzaam: het inkomen is goed voor allebei. Loopt haar contract nog maar 4 maanden, dan heeft zij een inkomensgeschiedenis van 3 jaar nodig.</p>'
+'<h3>Nieuw contract en nog geen loonstroken</h3>'
+RULE('<p>De bijlage bewijsmiddelen inkomen zegt: heb je nog geen loonstroken omdat je contract <strong>nog niet is ingegaan</strong>, stuur ze dan later zo snel mogelijk naar de IND. De duur van het contract telt vanaf <strong>de dag dat de IND de aanvraag ontvangt</strong>.</p>','nl')
+OPEN('<p>De tekst zegt niet of ‘nog niet ingegaan’ geldt op de dag van verzenden of van ontvangst. En is je contract al begonnen met minder dan 3 loonstroken, dan staat er geen uitzondering. Stuur contract, werkgeversverklaring en de loonstroken die je hebt, en daarna elke nieuwe loonstrook. Of wacht op de derde loonstrook als je vergunning dat toelaat. De IND kan ontbrekende stukken opvragen; dat kan vertraging geven.</p>','nl')
+TIP('<p>Is je eigen inkomen te laag voor permanent verblijf? <strong>Naturalisatie heeft geen inkomenseis.</strong> Kijk met de <a href="/nl/calculators/permanent-residence-check.html">check</a> welke route voor jou het dichtst bij is.</p>','nl')
+SRCL('IND-pagina’s inkomenseisen (update 1 juli 2026) en normbedragen (1 juli t/m 31 december 2026); bijlage 7111','nl')

+H(3,'documents','Documenten: wat stuur je mee in jouw situatie?','nl')
+'<p>Sommige stukken stuurt iedereen mee, andere hangen af van je inkomen. De officiële lijst staat in het formulier onder de reden die je kiest, en in de bijlage bewijsmiddelen inkomen.</p>'
+T([['Volledig formulier met voorblad, ondertekend','✅ Iedereen'],['Antecedentenverklaring','✅ Iedereen vanaf 12 jaar'],['Bijlage Inburgeringsvereiste met bewijs','✅ Iedereen (bij vrijstelling door leeftijd kruis je die situatie aan)'],['Werkgeversverklaring van elke werkgever, niet ouder dan 3 maanden','Loondienst (ook van de werkgever van je partner als dat inkomen meetelt)'],['Arbeidscontract en loonstroken afhankelijk van de contractduur (zie hierna)','Loondienst'],['Verklaring inkomen zelfstandig ondernemer, ingevuld door een (register)accountant of administrateur met BECON-nummer','Zelfstandige'],['Toekenningsbesluit en meest recente uitkeringsspecificatie','WW, ZW, WIA of pensioen'],['Belastingopgaaf vorig jaar, laatste aanslag en bewijs van vermogen','Inkomen uit vermogen'],['Inkomensstukken van je partner','Als dat inkomen meetelt'],['Brief over bijzondere omstandigheden met bewijs','Als de IND iets moet weten'],['Officiële buitenlandse documenten gelegaliseerd en vertaald naar NL, EN, FR of DE','Als je die hebt']],['Document','Wie stuurt het mee?'])
+'<h3>Loondienst: wat stuur je mee per contractduur?</h3>'
+T([['1 jaar of langer','Contract + loonstroken van de laatste 3 maanden (en 12 maanden als je door overwerk structureel meer verdient).'],['6 maanden tot 1 jaar','Contract of verklaring van de werkgever dat het werk nog 6 maanden loopt + over de laatste 12 maanden: alle loonstroken, jaaropgave en contracten, of alle WW/ZW-specificaties.'],['Korter dan 1 jaar, flexibel of uitzend','Contract + over de laatste 3 jaar: alle jaaropgaven, contracten en toekenningsbesluiten en specificaties.']],['Resterende contractduur','Documenten'])
+RULE('<p>Stuur <strong>kopieën op A4</strong>, nooit originelen. Zet je V-nummer of gegevens op elke kopie. Kopieën van aktes in kleur. Stuur geen voorwerpen zoals USB-sticks of fotoalbums.</p>','nl')
+SRCL('formulier 6009-2026/3 (p. 2–3 en onderdeel 2); bijlage 7111; bijlage 7116; IND-pagina EU-langdurig ingezetene','nl')

+H(4,'form','Formulier: 6009 of 6011?','nl')
+'<p>Je huidige vergunning bepaalt het formulier en de manier van aanvragen:</p>'
+'<div class="st-flow"><div><h3>Regulier</h3><p>Type I met een niet-tijdelijk doel, type II, Chavez of Blue Card.</p><p><span class="st-form">6009</span></p><p>✅ <strong>Online</strong> via ind.nl met DigiD als je 5 jaar in Nederland woont; je betaalt direct met iDEAL | Wero.<br>✅ Of <strong>per post</strong>: papieren formulier van 30 pagina’s.</p></div>'
'<div><h3>Asiel</h3><p>Type III, ook een afgeleide asielvergunning.</p><p><span class="st-form">6011</span></p><p>📮 <strong>Alleen per post</strong>: formulier van 26 pagina’s.<br>⏱️ Op zijn vroegst <strong>3 maanden vóór</strong> je 5 jaar onafgebroken verblijf haalt.</p></div></div>'
+TIP('<p>Het versienummer staat onderaan elke pagina (bijvoorbeeld 6009-2026/3). Vergelijk het vóór het printen met ind.nl/formulieren.</p>','nl')
+'<h3>Formulier 6009 per onderdeel</h3>'
+T([['Toelichting','Voor wie, kopieën, BRP, leges, biometrie','Lezen'],['1 · Gegevens','Naam zoals in het paspoort, in blokletters; adres en burgerlijke staat','Invullen'],['2 · Doel van het verblijf','Kruis <strong>één reden</strong> aan. Meest gebruikt: ‘vijf jaar of langer … met een verblijfsvergunning voor bepaalde tijd’ (310 - 503). Daaronder staan de documenten','Aankruisen'],['3 · Antecedenten','Bijlage Antecedentenverklaring ingevuld en ondertekend meesturen','Bijlage invullen'],['4 · Paspoort (4.1)','Geldig paspoort? Ja of nee met toelichting; nodig als de IND naar verlenging kijkt','Invullen'],['5 · Bijzondere situaties','Brief met bewijs als iets belangrijks nog niet gevraagd is','Indien nodig'],['6 · Ondertekening','Naam, plaats en datum, <strong>aantal bijlagen</strong>, handtekening','Ondertekenen'],['7 · Versturen','Controlelijst en adres van de IND','Lezen']],['Onderdeel','Inhoud','Wat doe je'])
+'<p><strong>Bijlagen in formulier 6009:</strong></p>'
+T([['Antecedentenverklaring','Vragen over antecedenten','Jij (vanaf 12)','✅'],['Werkgeversverklaring','Dienstverband en loon, met handtekening en stempel','Werkgever','✅ bij loondienst'],['Bewijsmiddelen inkomen','Uitleg welke stukken per situatie','Alleen lezen','❌ niet meesturen'],['Zelfstandig ondernemer','Winst en verklaring accountant','Jij en accountant','✅ als zelfstandige'],['Inburgeringsvereiste','Je situatie en het bewijs','Jij','✅']],['Bijlage','Inhoud','Wie vult in','Meesturen?'])
+RULE('<p>Op de bijlage bewijsmiddelen inkomen staat: ‘Stuur deze bijlage niet mee met de aanvraag’. Op het voorblad staat dat je dat wél meestuurt.</p>','nl')
+OPEN('<p>Er staat niet duidelijk of je de toelichtingspagina’s of bijlagen die niet voor jou gelden moet meesturen. Haal geen pagina’s uit het formulier zonder het de IND te vragen.</p>','nl')
+'<h3>Formulier 6011 (asiel) per onderdeel</h3>'
+T([['Toelichting','Voorwaarden, wanneer aanvragen, BRP, kopieën, wat er daarna gebeurt','Lezen'],['1 · Gegevens','Je V-nummer staat in brieven van de IND','Invullen'],['2 · Gevraagde vergunning','EU-verblijfsvergunning langdurig ingezetene (513)','Aankruisen'],['3 · Antecedenten','Bijlage vanaf 12 jaar','Bijlage invullen'],['4 · Inburgering','Bijlage Inburgeringsvereiste met bewijs','Meesturen'],['5 · Inkomen','Werkgeversverklaring niet ouder dan 3 maanden, of ander bewijs van inkomen','Meesturen'],['6 · Hoofdverblijf','Kruis één aan: langer dan 6 maanden aaneen weg sinds je huidige vergunning, meer dan 10 maanden in totaal in de laatste 5 jaar, of geen van beide. Was je weg: land, periode en reden','Invullen'],['7 · Plaats ophalen','Amsterdam, Den Haag, Goes, Maastricht, ’s-Hertogenbosch, Nijmegen of Zwolle','Kiezen'],['8 · Ondertekening','Naam, plaats en datum, aantal bijlagen, handtekening','Ondertekenen'],['9 · Versturen','Controlelijst en adres van de IND','Lezen']],['Onderdeel','Inhoud','Wat doe je'])
+RULE('<p>Eén formulier per persoon, en de aanvraag in één keer volledig, niet in delen. Een kind vanaf 12 ondertekent zelf; voor een jonger kind tekent de ouder, en onder de 12 hoeft de antecedentenverklaring niet. Wijst de IND 6011 af omdat je niet aan de inkomens- of inburgeringseis voldoet, dan beoordeelt de IND of je verblijfsdocument asiel vernieuwd kan worden.</p>','nl')
+SRCL('formulier 6009-2026/3 (30 pagina’s, onderdelen 1–7); formulier 6011-2026/5 (26 pagina’s, onderdelen 1–9); IND-pagina EU-langdurig ingezetene','nl')

+H(5,'send','Timing, versturen en leges','nl')
+RULE('<p>Het gaat om de datum waarop de IND de aanvraag <strong>ontvangt</strong>, niet de verzenddatum. Formulier 6009: zorg dat de aanvraag door de IND is ontvangen voordat je vergunning verloopt, om een verblijfsgat te voorkomen; dat heeft gevolgen voor latere aanvragen zoals naturalisatie. Je kunt aanvragen vanaf <strong>3 maanden vóór het verlopen</strong>; woon je al langer dan 5 jaar met een vergunning in Nederland, dan kies je zelf het moment.</p>','nl')
+OPEN('<p>We vonden geen officiële tekst die de datum op je PostNL-bewijs als aanvraagdatum telt. Wacht dus niet tot de laatste week vóór je vergunning verloopt.</p>','nl')
+TIP('<p>1 januari is geen uiterste aanvraagdatum. Wel veranderen de leges op 1 januari en de normbedragen op 1 januari en 1 juli; controleer de bedragen als je rond die data aanvraagt.</p>','nl')
+'<h3>Per post versturen in 9 stappen</h3><ol class="st-steps"><li><strong>Print</strong> het formulier op A4 en ware grootte; documenten als kopie.</li><li><strong>Controleer de handtekeningen</strong>: formulier, antecedentenverklaring, werkgever en aantal bijlagen.</li><li><strong>Adres</strong>: Immigratie- en Naturalisatiedienst, Postbus 9, 9560 AA Ter Apel.</li><li><strong>Envelop</strong> zonder nietjes of paperclips; bewaar zelf een volledige kopie.</li><li><strong>Aangetekend versturen</strong> bij een PostNL-punt: optioneel, voor bewijs; geen eis van de IND.</li><li><strong>Fotografeer het verzendbewijs</strong> met de Track &amp; Trace-code.</li><li><strong>Volg de envelop</strong>; aangetekende post naar een postbus kan iets later worden afgeleverd.</li><li><strong>Bewaar het afleverbewijs</strong> uit je PostNL-account.</li><li><strong>Wacht op de ontvangstbevestiging</strong> van de IND met het zaaknummer.</li></ol>'
+'<h3>Leges 2026</h3>'
+T([['Volwassene','€ 254'],['Minderjarige','€ 85'],['Turkse burger','€ 85'],['Turkse burger jonger dan 18','€ 46'],['Vijfjaarlijkse vernieuwing document','€ 85 (kind € 46)']],['Wie','Leges'])
+'<p>Iedereen dient een eigen formulier in en betaalt eigen leges; er is geen gezinskorting en partner of kinderen krijgen de status niet automatisch. <small class="muted">(illustratieve voorbeelden, berekend uit de officiële tarieven)</small></p>'
+T([['Volwassene alleen','€ 254'],['Stel, ieder een aanvraag','€ 508'],['Ouder met één minderjarig kind','€ 339'],['Stel met twee kinderen','€ 678'],['Stel met drie kinderen','€ 763'],['Turkse burger met twee kinderen','€ 177']],['Situatie','Totaal'])
+RULE('<p>Online betaal je direct met iDEAL | Wero; per post krijg je een brief met het bedrag en hoe je betaalt. Bij afwijzing krijg je de leges <strong>niet terug</strong>.</p>','nl')
+TIP('<p>Je kunt de aanvragen van het gezin samen voorbereiden en versturen, zolang elke aanvraag compleet is met eigen bijlagen en naam. Let op: deze gids gaat over de eigen EU-status van elk gezinslid. Gezinshereniging of verblijf bij een vergunninghouder zijn andere procedures met andere formulieren en leges.</p>','nl')
+SRCL('formulier 6009-2026/3 (p. 1–3 en onderdeel 7); IND-pagina EU-langdurig ingezetene; IND-pagina Leges (tarieven 2026)','nl')

+H(6,'after','Wat gebeurt er na de aanvraag?','nl')
+'<ol class="st-steps"><li><strong>Ontvangstbevestiging</strong>: bevestigt dat de IND je aanvraag heeft, met zaaknummer. Geen beslissing. Kan vermelden dat de IND je foto, handtekening en vingerafdrukken nodig heeft.</li><li><strong>Betaalbrief</strong> (papieren aanvraag): bedrag en manier van betalen; te laat betalen vertraagt de behandeling.</li><li><strong>Afspraak biometrie</strong>: pas te maken nadat je de brief van de IND hebt; vingerafdrukken vanaf 6 jaar, handtekening vanaf 12.</li><li><strong>Tijdens de behandeling</strong>: volg je aanvraag in Mijn IND; ontbreekt er iets, dan vraagt de IND erom. Geef wijzigingen door.</li><li><strong>Beslissing</strong>: binnen <strong>6 maanden</strong>, soms langer, bijvoorbeeld als de aanvraag niet compleet is. Je wacht in Nederland; tegen een afwijzing kun je bezwaar maken.</li><li><strong>Document</strong>: bij toekenning krijg je een brief en haal je het document op afspraak op; type V, 5 jaar geldig.</li></ol>'
+'<h3>Documenten nasturen</h3>'
+T([['Mijn IND','Met DigiD met sms-code en je zaaknummer. Pdf zonder wachtwoord of jpg, elk bestand kleiner dan 8 MB, samen maximaal 40 MB.'],['Veilig mailen','Zonder DigiD, via de IND-pagina ‘Uw stukken opsturen’, met het zaaknummer in het onderwerp.'],['Per post','Naar het postadres op de IND-site, met V-nummer en zaaknummer op elke kopie.']],['Manier','Details'])
+RULE('<p>Heb je aangevraagd vóór de einddatum van je vergunning, dan houd je tijdens de behandeling de arbeidsmarktaantekening van je huidige document. Is je document verlopen zonder beslissing, dan kun je een afspraak maken voor een sticker verblijfsaantekening.</p>','nl')
+'<h2 id="checklist">Laatste controlelijst</h2><p>Vink alles af voordat je de envelop dichtplakt. De vinkjes worden alleen in je eigen browser bewaard.</p>'
+'<h3>Formulier</h3>'+CHK('eu-nl-form',['Nieuwste versie, op A4 en ware grootte, met voorblad.','Onderdeel 1 in blokletters, naam zoals in het paspoort.','Eén reden in onderdeel 2 (6009) of onderdeel 6 afwezigheid ingevuld (6011).','Paspoortvraag 4.1 (6009) ingevuld.','Handtekening, datum en aantal bijlagen.','Een apart formulier per gezinslid.'])
+'<h3>Bijlagen en bewijs</h3>'+CHK('eu-nl-docs',['Antecedentenverklaring, beide pagina’s (vanaf 12).','Bijlage Inburgeringsvereiste met bewijs (inburgeringsdiploma gewone kopie, schooldiploma’s gewaarmerkt).','Werkgeversverklaring van elke werkgever, ondertekend en gestempeld, niet ouder dan 3 maanden.','Zelfstandige: bijlage Zelfstandig ondernemer met verklaring accountant.','De bijlage Bewijsmiddelen inkomen zit niet in de envelop.','Inkomensstukken voor mijn situatie en contractduur.','Inkomensstukken van mijn partner, als die meetellen.','Kopieën op A4, geen originelen, met V-nummer of gegevens op elke kopie.'])
+'<h3>Versturen en daarna</h3>'+CHK('eu-nl-send',['Zonder nietjes of paperclips, naar Postbus 9, 9560 AA Ter Apel.','Mijn vergunning is geldig en de aanvraag komt ruim vóór het verlopen aan.','Volledige kopie en verzendbewijs bewaard.','Afleverbewijs en ontvangstbevestiging bewaard.','Betaald na de betaalbrief, biometrie geboekt na de brief van de IND.'])
+'<p>Staat je vraag hier niet? IND-telefoon: 088 043 04 30 (vanuit het buitenland +31 88 043 04 30).</p>'
+SRCL('IND-pagina EU-langdurig ingezetene; formulier 6009-2026/3 p. 4; formulier 6011-2026/5 p. 2; IND-pagina’s Documenten uploaden (24 februari 2026) en Uw stukken opsturen (6 juli 2026)','nl')
),
faq=[('Moet mijn contract vast zijn?','Nee. Een tijdelijk contract is genoeg als het nog minstens een jaar loopt op de dag dat de IND je aanvraag ontvangt. Een korter contract kan met voldoende inkomen in de laatste 12 maanden of 3 jaar, afhankelijk van de resterende duur.'),
('Is het minimumloon genoeg?','Bij een volledige baan meestal wel: de norm is € 1.635,90 bruto per maand zonder vakantiegeld. Het contract moet ook duurzaam zijn.'),
('Telt het inkomen van mijn partner mee?','Ja, als jullie getrouwd of geregistreerd partner zijn en samen in Nederland wonen, je partner Nederlander is of een Nederlandse vergunning heeft, en elk inkomen zelfstandig en duurzaam is. Samen minstens € 2.337,00.'),
('Ik woon 10 jaar in Nederland. Ben ik vrijgesteld van de inkomenseis?','Niet voor EU-langdurig. Die vrijstelling geldt alleen voor regulier onbepaalde tijd; met formulier 6009 kijkt de IND daar automatisch naar als EU-langdurig niet lukt.'),
('Kan ik aanvragen met bijstand?','Aanvragen kan, maar bijstand telt niet als inkomen; de inkomenseis lukt dan alleen als het inkomen van je partner genoeg is. Naturalisatie heeft geen inkomenseis.'),
('Ben ik met een NT2-diploma vrijgesteld van inburgering?','Voor de IND is een NT2-diploma alleen meestal niet genoeg. Je hebt het inburgeringsdiploma, een vrijstellingsbesluit of een van de diploma’s uit de Bijlage Inburgeringsvereiste nodig.'),
('Kan ik online aanvragen?','Met een reguliere vergunning, DigiD en 5 jaar wonen in Nederland: ja, via ind.nl met formulier 6009, en je betaalt direct. Met een asielvergunning vraag je 6011 alleen per post aan.'),
('Wanneer kan ik aanvragen met een asielvergunning?','Op zijn vroegst 3 maanden voordat je 5 jaar onafgebroken en rechtmatig verblijf haalt.'),
('Stuur ik originelen mee?','Nee. Alleen kopieën op A4 met je V-nummer erop. Schooldiploma’s als gewaarmerkte kopie van de school.'),
('Krijg ik de leges terug bij afwijzing?','Nee.'),
('Krijgen mijn kinderen de status automatisch?','Nee. Elk kind heeft een eigen formulier en eigen leges (€ 85 voor een minderjarige). Vanaf 12 jaar tekent het kind zelf.'),
('Hoe lang duurt de beslissing?','De IND heeft 6 maanden, soms langer als de aanvraag niet compleet is. Je wacht de beslissing in Nederland af.')],
src_note='We lazen de IND-pagina’s (EU-langdurig ingezetene, update 11 november 2026; inkomenseisen; normbedragen; leges; documenten uploaden), de formulieren 6009-2026/3 en 6011-2026/5 en de bijlagen 7111 en 7116 op 26 november 2026. De bedragen gelden t/m 31 december 2026; de leges veranderen elk jaar op 1 januari.')
