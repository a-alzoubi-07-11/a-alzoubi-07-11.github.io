from a_student_finance import T
SLUG='toeslagen-income-update'
B='https://www.belastingdienst.nl/wps/wcm/connect/'
SRC=[('Dienst Toeslagen · Met welk inkomen berekenen jullie mijn toeslag voor 2026?',B+'nl/toeslagen/content/hoe-wordt-inkomen-toeslagen-nieuwe-jaar-geschat'),
('Dienst Toeslagen · Wijzigingen doorgeven voor uw toeslag',B+'bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/wijzigingen_doorgeven'),
('Dienst Toeslagen · Ik wil een wijziging doorgeven',B+'bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/ik_wil_een_wijziging_doorgeven/ik-wil-een-wijziging-doorgeven'),
('Belastingdienst · Mijn inkomen verandert – moet ik dat doorgeven?',B+'nl/werk-en-inkomen/content/mijn-inkomen-verandert-moet-ik-dat-doorgeven'),
('Dienst Toeslagen · Wat is mijn toetsingsinkomen?',B+'nl/toeslagen/content/wat-is-mijn-toetsingsinkomen'),
('Dienst Toeslagen · Veranderingen toeslagen 2026',B+'nl/toeslagen-2026/topics/veranderingen-toeslagen-2026'),
('Dienst Toeslagen · Kan ik een betalingsregeling krijgen?',B+'nl/toeslag-terugbetalen/content/kan-ik-een-betalingsregeling-krijgen'),
('Dienst Toeslagen · Persoonlijke betalingsregeling toeslagen',B+'nl/toeslag-terugbetalen/content/persoonlijke-betalingsregeling-toeslagen'),
('Dienst Toeslagen · Hoe kan ik toeslag terugbetalen?',B+'nl/toeslag-terugbetalen/content/hoe-kan-ik-toeslag-terugbetalen'),
('Dienst Toeslagen · Proefberekening toeslagen',B+'nl/toeslagen/content/hulpmiddel-proefberekening-toeslagen'),
('Dienst Toeslagen · Toeslagenservicepunten',B+'nl/contact-met-dienst-toeslagen/content/hulpmiddel-adressen-toeslagenservicepunten')]

AR=dict(title='تحديث دخلك في Toeslagen 2026: متى وكيف تغيّر تقدير الدخل لتتجنب استرداد آلاف اليوروهات',
crumb='تحديث الدخل في Toeslagen',
desc='دليل عميق لتحديث الدخل لدى Dienst Toeslagen: ما هو toetsingsinkomen وكيف تحسبه من قسيمة الراتب، متى يجب الإبلاغ (خلال 4 أسابيع)، حالات الزيادة والعمل الحر والشريك، ماذا يحدث بعد التحديث، الاسترداد وحد 121 يورو، خطة السداد حتى 24 شهراً، وأين تجد مساعدة مجانية.',
summary='<ol><li><strong>البدلات تُحسب على تقدير دخلك السنوي</strong> (toetsingsinkomen)، وليس على الصافي. أبلغ دائماً الدخل الإجمالي الخاضع للتقييم.</li><li><strong>أي تغيير يؤثر على البدل يجب إبلاغه خلال 4 أسابيع</strong> عبر Mijn toeslagen أو تطبيق Toeslagen: زيادة راتب، عمل جديد، توقف عمل، دخل الشريك، وغيرها.</li><li>بعد التحديث ترى المبلغ الجديد مباشرة، وتصلك حسبة جديدة خلال 5 أسابيع.</li><li><strong>قدّر دخلك أعلى قليلاً</strong> لا أقل: إن حصلت على بدل أقل من حقك يُدفع لك الفرق لاحقاً؛ وإن حصلت على أكثر تُطالَب بالاسترداد.</li><li><strong>عند الاسترداد</strong>: خطة سداد حتى <strong>24 شهراً</strong>، أو خطة شخصية إن لم تستطع.</li><li><strong>بدل 2025</strong> يمكن طلبه حتى <strong>31 ديسمبر 2026</strong>.</li></ol>',
body=(
'<h2 id="why">لماذا هذا مهم إلى هذه الدرجة؟</h2><p>البدلات (zorgtoeslag، huurtoeslag، kinderopvangtoeslag، kindgebonden budget) تُدفع <strong>مقدماً</strong> كل شهر على أساس <strong>تقدير</strong> دخلك للسنة كلها. بعد انتهاء السنة تعرف Belastingdienst دخلك الحقيقي وتُجري «الحسبة النهائية» (definitieve berekening). إن كان الدخل الحقيقي أعلى من التقدير فعليك <strong>إعادة</strong> جزء من البدل — وقد يكون آلاف اليوروهات إن تراكمت الأشهر. لهذا فإن تحديث الدخل في وقته هو أهم شيء تفعله لحماية ميزانيتك.</p>'
'<h2 id="toetsingsinkomen">ما هو toetsingsinkomen؟ (لا تُبلغ الصافي أبداً)</h2><p>هو الدخل الذي تستخدمه Toeslagen. للموظف العادي هو قريب جداً من <strong>مجموع الأجر الخاضع للضريبة في السنة</strong>، وليس ما يصل حسابك.</p>'
+T([['موظف براتب ثابت','خذ «Loon voor de loonheffing» من القسيمة × 12 (أو × 13 فترة إن كان الدفع كل 4 أسابيع)، وأضف بدل العطلة والشهر الثالث عشر إن وُجدا.'],
    ['دخل متغير (استدعاء، وكالة)','استخدم سطر «cumulatief» في آخر قسيمة، اقسمه على عدد الأشهر المنقضية، واضربه في 12. ثم أضف هامشاً.'],
    ['عمل حر (zzp)','الربح المتوقع بعد الخصومات الضريبية. راجعه مع كل إقرار btw.'],
    ['إعانة (WW، bijstand…)','المبلغ الإجمالي السنوي للإعانة من بيان الجهة.'],
    ['أكثر من مصدر','اجمع كل المصادر.']],
   ['حالتك','كيف تقدّر'])
+'<p>تساعدك Belastingdienst بأداة حساب toetsingsinkomen، وبأداة «الحسبة التجريبية» (proefberekening) لتعرف كم يتغير البدل. الرابطان في المصادر.</p>'
'<h2 id="when">متى يجب أن تحدّث الدخل؟</h2><p>القاعدة الرسمية: <strong>كل تغيير يؤثر على قيمة البدل</strong> يُبلَّغ <strong>خلال 4 أسابيع</strong>. من أهم الحالات:</p>'
+T([['زيادة راتب أو ترقية','حدّث التقدير السنوي فوراً.'],
    ['عمل جديد أو عمل ثانٍ','أضف الدخل الجديد عن بقية السنة.'],
    ['توقف العمل أو قلة الساعات','حدّث لتحصل على البدل الأعلى المستحق.'],
    ['transitievergoeding أو دفعة كبيرة','تُضاف إلى دخل تلك السنة.'],
    ['عمل حر','حدّث مع كل إقرار btw حين يتغير الربح المتوقع.'],
    ['دخل الشريك تغيّر','دخل شريك البدلات (toeslagpartner) يُحسب أيضاً (<a href="/articles/toeslagpartner-guide.html">من هو شريك البدلات؟</a>).'],
    ['بداية السنة','افحص تقدير Toeslagen للسنة الجديدة في يناير بعد أول قسيمة.']],
   ['التغيير','ماذا تفعل'])
+'<p>بعض التغييرات تصل Toeslagen تلقائياً عبر البلدية (مثل الانتقال)، لكن <strong>تغير الدخل لا يصل تلقائياً في وقته</strong>؛ أنت المسؤول عن تحديثه.</p>'
'<h2 id="how">كيف تحدّث خطوة بخطوة</h2><ol><li>ادخل إلى <strong>Mijn toeslagen</strong> بـDigiD (<a href="/articles/digid-registration-guide.html">دليل DigiD</a>)، أو افتح <strong>تطبيق Toeslagen</strong>.</li><li>اختر تغيير الدخل (inkomen wijzigen) للسنة الصحيحة.</li><li>أدخل التقدير السنوي الجديد للدخل الخاضع للتقييم (ليس الشهري، وليس الصافي).</li><li>إن كان لديك شريك بدلات، حدّث دخله أيضاً.</li><li>راجع المبلغ الجديد الذي يظهر فوراً، واحفظ لقطة شاشة أو تأكيد الإرسال.</li><li>انتظر الحسبة الجديدة (خلال 5 أسابيع)، وقارنها بما توقعت.</li></ol>'
'<h2 id="after">ماذا يحدث بعد التحديث؟</h2><ul><li><strong>البدل يصبح أقل:</strong> قد تكون حصلت على أكثر من حقك في الأشهر الماضية. يُخصم الفرق غالباً من الدفعات القادمة، أو تصلك رسالة بالمبلغ الواجب ردّه.</li><li><strong>البدل يصبح أعلى:</strong> يُدفع لك الفرق.</li><li><strong>موعد الدفع:</strong> تُدفع البدلات شهرياً مقدماً، عادة حول يوم 20 من الشهر السابق. التغيير الذي يُعالَج بعد إعداد دفعة الشهر يظهر في الدفعة التالية.</li></ul>'
'<h2 id="final">الحسبة النهائية والاسترداد</h2><ul><li>بعد معرفة دخلك الحقيقي (غالباً بعد الإقرار الضريبي) تصلك <strong>definitieve berekening</strong>.</li><li>يمكنك إبلاغ تغييرات عن سنة ما <strong>حتى تصلك الحسبة النهائية لتلك السنة</strong>.</li><li>Belastingdienst أعلنت ضمن تغييرات 2026 حداً لا تسترد تحته المبالغ الصغيرة في <strong>الحسبة النهائية</strong> (121 يورو لكل بدل حسب صفحة تغييرات 2026). <strong>تصحيحات الدفعات المقدمة خلال السنة تُسترد دائماً</strong>. اقرأ الصفحة الرسمية في المصادر لأن الحد قد يتغير.</li></ul>'
'<h2 id="repay">إن طُلب منك الرد: خطة السداد</h2>'
+T([['خطة السداد العادية','تقسيط على <strong>24 شهراً كحد أقصى</strong>. مثال رسمي: 1,200 يورو = 50 يورو شهرياً. تبدأ عادة بدفع أول قسط قبل التاريخ المذكور في الرسالة.'],
    ['السداد أسرع','يمكنك دفع أكثر شهرياً.'],
    ['الخصم من بدل آخر','اتصل بـToeslagen لطلب خصم المبلغ من بدل آخر تحصل عليه.'],
    ['خطة سداد شخصية','إن لم يبق لك ما يكفي للعيش مع 24 قسطاً، اطلب <strong>persoonlijke betalingsregeling</strong> بالنموذج المخصص؛ ينظرون في وضعك ويحددون مبلغاً أقل.'],
    ['رسالة قديمة','إن كانت الرسالة قديمة يمكنك طلب خطة 24 شهراً بالهاتف.']],
   ['الخيار','كيف يعمل'])
+'<p><strong>الفائدة:</strong> قد تُحسب فائدة تحصيل على المبالغ المؤجلة؛ النسبة تُحدَّث دورياً، فراجع الرسالة والصفحة الرسمية. <strong>لا تتجاهل الرسائل</strong>: التأخير قد يؤدي إلى إجراءات تحصيل وتكاليف إضافية.</p>'
'<h2 id="mistakes">أخطاء تكلّف غالياً</h2><ol><li><strong>إبلاغ الصافي بدل الإجمالي الخاضع للتقييم.</strong></li><li><strong>نسيان دخل الشريك</strong> أو بدء عمله.</li><li><strong>تقدير متفائل منخفض</strong> «حتى أحصل على بدل أكبر الآن».</li><li><strong>نسيان الدفعات الخاصة</strong>: بدل العطلة، الشهر الثالث عشر، المكافآت، تعويض الفصل.</li><li><strong>عدم تحديث التقدير في يناير</strong> بعد أول قسيمة للسنة الجديدة.</li><li><strong>تجاهل رسائل Toeslagen</strong> أو صندوق Berichtenbox في MijnOverheid.</li></ol>'
'<h2 id="calendar">تقويم سنوي مقترح</h2>'
+T([['يناير','بعد أول قسيمة: راجع تقدير Toeslagen للسنة الجديدة وصحّحه.'],
    ['مارس – مايو','قدّم الإقرار الضريبي للسنة الماضية (<a href="/articles/annual-tax-return-2026.html">الدليل</a>).'],
    ['مايو/يونيو','بعد دفع بدل العطلة: تأكد أنه داخل في تقديرك.'],
    ['كل تغيير عمل','حدّث خلال 4 أسابيع.'],
    ['سبتمبر/أكتوبر','افحص «cumulatief» واضبط التقدير لبقية السنة.'],
    ['ديسمبر','آخر فرصة لطلب بدل السنة الماضية (بدل 2025 حتى 31 ديسمبر 2026).']],
   ['الشهر','ماذا تفعل'])
+'<h2 id="help">مساعدة مجانية</h2><ul><li><strong>Toeslagenservicepunt</strong>: نقاط مساعدة مجانية في بلديات ومكتبات لمساعدتك في تحديث البدلات (ابحث عن الأقرب في رابط المصادر).</li><li>يمكنك حجز «موعد اتصال» (belafspraak) مع Dienst Toeslagen.</li><li>المكتبات وكثير من البلديات تقدم مساعدة رقمية مجانية (Informatiepunt Digitale Overheid).</li><li>إن كانت لديك ديون أو صعوبة في السداد: اطلب من بلديتك مساعدة الديون (schuldhulpverlening).</li></ul>'),
faq=[('هل أبلغ الراتب الصافي أم الإجمالي؟','لا الصافي ولا الإجمالي حرفياً: أبلغ toetsingsinkomen، وهو للموظف قريب من مجموع «Loon voor de loonheffing» السنوي.'),
('كم لدي من الوقت لإبلاغ زيادة الراتب؟','4 أسابيع من التغيير، عبر Mijn toeslagen أو تطبيق Toeslagen.'),
('هل من الأفضل أن أقدّر دخلي أعلى؟','نعم، توصي Toeslagen بالتقدير الأعلى قليلاً. إن حصلت على أقل من حقك يُدفع لك الفرق بعد الحسبة النهائية.'),
('يجب أن أعيد 1,200 يورو ولا أستطيع دفعها مرة واحدة، ماذا أفعل؟','خطة سداد حتى 24 شهراً (مثلاً 50 يورو شهرياً)، أو خطة شخصية بمبلغ أقل إن لم يكفِك الباقي للعيش.'),
('هل يُحسب دخل شريكي؟','نعم، دخل شريك البدلات يُجمع مع دخلك في الحساب.'),
('نسيت طلب بدل عن 2025، هل فات الأوان؟','يمكنك طلبه حتى 31 ديسمبر 2026.')],
src_note='راجعنا كل القواعد في صفحات Dienst Toeslagen (Belastingdienst) في 4 أكتوبر 2026. المبالغ والحدود قد تتغير؛ اعتمد دائماً على رسالتك الرسمية وMijn toeslagen.')

NL=dict(title='Inkomen doorgeven bij Toeslagen in 2026: wanneer en hoe je je schatting aanpast om terugbetalen te voorkomen',
crumb='Inkomen doorgeven Toeslagen',
desc='Uitgebreide gids voor het doorgeven van je inkomen aan Dienst Toeslagen: wat het toetsingsinkomen is en hoe je het uit je loonstrook haalt, wanneer je moet doorgeven (binnen 4 weken), loonsverhoging, zzp en toeslagpartner, wat er daarna gebeurt, terugvorderen, betalingsregeling tot 24 maanden en gratis hulp.',
summary='<ol><li><strong>Toeslagen worden berekend met een schatting van je jaarinkomen</strong> (toetsingsinkomen), niet met je netto loon.</li><li><strong>Wijzigingen die je toeslag beïnvloeden geef je binnen 4 weken door</strong> via Mijn toeslagen of de app Toeslagen.</li><li>Je ziet direct het nieuwe bedrag; binnen 5 weken krijg je een nieuwe berekening.</li><li><strong>Schat je inkomen liever iets hoger</strong>: te weinig ontvangen krijg je later alsnog.</li><li><strong>Terugbetalen:</strong> betalingsregeling tot <strong>24 maanden</strong>, of een persoonlijke betalingsregeling.</li><li><strong>Toeslag over 2025</strong> kun je aanvragen tot <strong>31 december 2026</strong>.</li></ol>',
body=(
'<h2 id="why">Waarom dit zo belangrijk is</h2><p>Toeslagen (zorgtoeslag, huurtoeslag, kinderopvangtoeslag, kindgebonden budget) krijg je als <strong>voorschot</strong> op basis van een <strong>schatting</strong> van je jaarinkomen. Na afloop van het jaar volgt de <strong>definitieve berekening</strong>. Was je inkomen hoger, dan moet je terugbetalen, soms duizenden euro’s. Je inkomen op tijd aanpassen is dus de beste bescherming.</p>'
'<h2 id="toetsingsinkomen">Wat is het toetsingsinkomen? (nooit netto)</h2>'
+T([['Vast loon','«Loon voor de loonheffing» × 12 (of × 13 bij 4-wekelijkse betaling), plus vakantiegeld en 13e maand.'],
    ['Wisselend inkomen','Cumulatief bedrag van de laatste loonstrook ÷ verstreken maanden × 12, plus een marge.'],
    ['Zzp','Verwachte winst na fiscale aftrekposten; check bij elke btw-aangifte.'],
    ['Uitkering','Bruto jaarbedrag volgens de uitkeringsinstantie.'],
    ['Meerdere bronnen','Tel alles op.']],['Situatie','Zo schat je'])
+'<p>Gebruik de rekenhulp toetsingsinkomen en de proefberekening van de Belastingdienst (zie bronnen).</p>'
'<h2 id="when">Wanneer doorgeven?</h2><p>Alle wijzigingen die invloed hebben op je toeslag geef je <strong>binnen 4 weken</strong> door, bijvoorbeeld:</p>'
+T([['Loonsverhoging of promotie','Pas je jaarschatting direct aan.'],['Nieuwe of tweede baan','Tel het nieuwe inkomen voor de rest van het jaar mee.'],['Minder werk of werkloos','Doorgeven: je kunt recht hebben op meer toeslag.'],['Transitievergoeding of eenmalige uitbetaling','Telt mee in het inkomen van dat jaar.'],['Zzp','Bij elke btw-aangifte opnieuw schatten.'],['Inkomen toeslagpartner verandert','Ook dat inkomen telt mee (<a href="/nl/articles/toeslagpartner-guide.html">wie is je toeslagpartner?</a>).'],['Begin van het jaar','Controleer in januari de schatting voor het nieuwe jaar.']],['Wijziging','Actie'])
+'<p>Wijzigingen die je aan de gemeente doorgeeft (zoals verhuizen) hoef je niet apart door te geven, maar <strong>een inkomenswijziging wel</strong>.</p>'
'<h2 id="how">Stap voor stap</h2><ol><li>Log in op <strong>Mijn toeslagen</strong> met DigiD (<a href="/nl/articles/digid-registration-guide.html">DigiD-gids</a>) of open de <strong>app Toeslagen</strong>.</li><li>Kies inkomen wijzigen voor het juiste jaar.</li><li>Vul je nieuwe <strong>jaar</strong>schatting van het toetsingsinkomen in.</li><li>Pas ook het inkomen van je toeslagpartner aan als dat verandert.</li><li>Controleer het nieuwe bedrag en bewaar een bevestiging.</li><li>Binnen 5 weken volgt een nieuwe berekening.</li></ol>'
'<h2 id="after">Wat gebeurt er daarna?</h2><ul><li><strong>Lagere toeslag:</strong> het te veel ontvangen bedrag wordt meestal verrekend met toekomstige betalingen, of je krijgt een brief.</li><li><strong>Hogere toeslag:</strong> je krijgt het verschil uitbetaald.</li><li><strong>Uitbetaling:</strong> toeslagen worden maandelijks vooruit betaald, meestal rond de 20e van de maand ervoor. Een wijziging die na het klaarzetten van een betaling wordt verwerkt, zie je in de volgende betaling.</li></ul>'
'<h2 id="final">Definitieve berekening en terugvordering</h2><ul><li>Na de aangifte inkomstenbelasting volgt de <strong>definitieve berekening</strong>.</li><li>Je kunt wijzigingen doorgeven tot je de definitieve berekening over dat jaar hebt.</li><li>Volgens de pagina Veranderingen toeslagen 2026 geldt een grens (€121 per toeslag) waaronder een terugvordering bij de <strong>definitieve berekening</strong> niet wordt geïnd. <strong>Correcties op het voorschot worden altijd teruggevorderd.</strong> Controleer de officiële pagina, want grenzen kunnen wijzigen.</li></ul>'
'<h2 id="repay">Terugbetalen: betalingsregeling</h2>'
+T([['Standaard betalingsregeling','Maximaal <strong>24 maanden</strong>. Officieel voorbeeld: €1.200 = €50 per maand.'],['Sneller terugbetalen','Meer per maand overmaken mag.'],['Verrekenen met andere toeslag','Bel Dienst Toeslagen.'],['Persoonlijke betalingsregeling','Houd je te weinig over om van te leven, vraag dan met het formulier een lager maandbedrag aan.'],['Oude brief','Je kunt telefonisch een regeling van maximaal 24 maanden krijgen.']],['Mogelijkheid','Zo werkt het'])
+'<p>Over uitgestelde bedragen kan invorderingsrente gelden; controleer je brief. <strong>Negeer brieven nooit</strong>: dat leidt tot extra invorderingskosten.</p>'
'<h2 id="mistakes">Dure fouten</h2><ol><li>Netto inkomen doorgeven.</li><li>Inkomen van de toeslagpartner vergeten.</li><li>Expres te laag schatten.</li><li>Vakantiegeld, 13e maand, bonus of transitievergoeding vergeten.</li><li>In januari de schatting niet controleren.</li><li>Berichten in Mijn toeslagen of de Berichtenbox negeren.</li></ol>'
'<h2 id="calendar">Jaarkalender</h2>'
+T([['Januari','Na de eerste loonstrook: schatting nieuw jaar controleren.'],['Maart – mei','Aangifte over vorig jaar (<a href="/nl/articles/annual-tax-return-2026.html">gids</a>).'],['Mei/juni','Na vakantiegeld: zit het in je schatting?'],['Bij elke werkwijziging','Binnen 4 weken doorgeven.'],['September/oktober','Cumulatief checken en schatting bijstellen.'],['December','Laatste kans voor toeslag over vorig jaar (2025: tot 31 december 2026).']],['Maand','Actie'])
+'<h2 id="help">Gratis hulp</h2><ul><li><strong>Toeslagenservicepunt</strong>: gratis hulp op locaties in gemeenten en bibliotheken.</li><li>Maak een belafspraak met Dienst Toeslagen.</li><li>Informatiepunt Digitale Overheid in de bibliotheek.</li><li>Schulden of betalingsproblemen: vraag schuldhulpverlening bij je gemeente.</li></ul>'),
faq=[('Geef ik netto of bruto inkomen door?','Je toetsingsinkomen; voor werknemers ligt dat dicht bij het jaarlijkse loon voor de loonheffing.'),
('Hoe snel moet ik een loonsverhoging doorgeven?','Binnen 4 weken via Mijn toeslagen of de app Toeslagen.'),
('Kan ik mijn inkomen beter hoger schatten?','Ja, dat adviseert Dienst Toeslagen. Te weinig ontvangen krijg je later alsnog.'),
('Ik moet €1.200 terugbetalen en kan dat niet in één keer.','Vraag een betalingsregeling van maximaal 24 maanden (bijv. €50 per maand) of een persoonlijke betalingsregeling.'),
('Telt het inkomen van mijn partner mee?','Ja, het inkomen van je toeslagpartner telt mee.'),
('Kan ik nog toeslag over 2025 aanvragen?','Ja, tot 31 december 2026.')],
src_note='Alle regels gecontroleerd op de pagina’s van Dienst Toeslagen (Belastingdienst) op 4 oktober 2026. Bedragen en grenzen kunnen wijzigen; ga altijd uit van je eigen brief en Mijn toeslagen.')
