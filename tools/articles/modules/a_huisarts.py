from a_student_finance import T
SLUG='huisarts-registration'
SRC=[('Thuisarts.nl (NHG) · Inschrijven bij een huisarts','https://www.thuisarts.nl/inschrijven-bij-huisarts'),
('Rijksoverheid · Ben ik vrij om zelf een huisarts te kiezen?','https://www.rijksoverheid.nl/onderwerpen/eerstelijnszorg/vraag-en-antwoord/ben-ik-vrij-om-zelf-een-huisarts-te-kiezen-en-hoe-verander-ik-van-huisarts'),
('Rijksoverheid · Huisartskosten op de zorgnota','https://www.rijksoverheid.nl/onderwerpen/eerstelijnszorg/vraag-en-antwoord/huisartskosten-op-zorgnota'),
('Rijksoverheid · Huisartsenpost en spoedeisende hulp','https://www.rijksoverheid.nl/onderwerpen/eerstelijnszorg/vraag-en-antwoord/huisartsenpost-spoedeisende-hulp'),
('Rijksoverheid · Gezondheidszorg asielzoekers','https://rijksoverheid.nl/onderwerpen/asielbeleid/vraag-en-antwoord/gezondheidszorg-asielzoekers'),
('Rijksoverheid · Eigen risico zorgverzekering','https://www.rijksoverheid.nl/vraag-en-antwoord/zorgverzekering/eigen-risico-zorgverzekering')]

AR=dict(title='الطبيب العام (Huisarts) في هولندا 2026: كيف تسجّل، إن رفضك الطبيب، الطوارئ ومركز الأطباء الليلي، التكاليف، وكيف تستفيد من الموعد',
crumb='الطبيب العام',
desc='دليل عميق للطبيب العام في هولندا: لماذا هو بوابة كل العلاج، كيف تسجّل، متى يحق له رفضك وماذا تفعل (شركة التأمين تساعدك)، الطوارئ: 112 ومركز الأطباء خارج الدوام والطوارئ بالمستشفى، التكاليف (لا مخاطرة ذاتية على زيارة الطبيب العام)، تغيير الطبيب ونقل الملف، ونصائح للموعد.',
summary='<ol><li><strong>الطبيب العام هو بوابة العلاج</strong> في هولندا: لا تذهب للمختص أو المستشفى عادة دون تحويل منه.</li><li><strong>التسجيل غير إلزامي لكنه ضروري عملياً</strong>؛ سجّل فور حصولك على عنوان وتأمين صحي.</li><li>يحق للطبيب رفضك إن كانت عيادته ممتلئة أو كنت بعيداً. إن لم تجد طبيباً: <strong>شركة تأمينك تساعدك</strong> في البحث.</li><li><strong>زيارة الطبيب العام لا تُخصم من المخاطرة الذاتية</strong>؛ لكن التحاليل والأدوية التي يطلبها قد تُخصم.</li><li><strong>الطوارئ:</strong> خطر على الحياة 112؛ مساءً وفي العطل اتصل بمركز الأطباء (huisartsenpost) قبل الذهاب للمستشفى.</li></ol>',
body=(
'<h2 id="role">لماذا الطبيب العام مهم جداً؟</h2><ul><li>هو أول من تراجعه في كل مشكلة صحية غير طارئة: جسدية أو نفسية.</li><li>يقرر هل تحتاج مختصاً أو علاجاً طبيعياً أو مستشفى، ويكتب <strong>التحويل</strong> (verwijzing). بدونه قد لا يدفع التأمين.</li><li>يحتفظ بملفك الطبي ويعرف تاريخك؛ لذلك من المهم أن يكون لك طبيب ثابت.</li><li>للأطفال تحت 4 سنوات هناك أيضاً مركز رعاية الطفل (consultatiebureau) للتطعيمات والنمو.</li></ul>'
'<h2 id="register">كيف تسجّل؟ خطوة بخطوة</h2><ol><li>ابحث عن «huisarts» واسم مدينتك أو حيّك، أو اسأل الجيران.</li><li>اتصل بالعيادة أو املأ نموذج التسجيل على موقعها.</li><li>جهّز: BSN، بطاقة التأمين الصحي، الهوية، وعنوانك.</li><li>كثير من العيادات تطلب «موعد تعارف» قصيراً.</li><li>إن كان لديك طبيب سابق (في مركز اللجوء أو مدينة أخرى)، اطلب <strong>نقل ملفك</strong> إلى الطبيب الجديد.</li></ol><p>تحتاج أولاً <a href="/articles/bsn-municipality-registration.html">التسجيل في البلدية</a> و<a href="/articles/health-insurance-newcomers.html">التأمين الصحي</a>.</p>'
'<h2 id="refusal">إن رفضك الطبيب</h2>'
+T([['العيادة ممتلئة','سبب مقبول للرفض. جرّب عيادات أخرى قريبة، أو ضع اسمك على قائمة الانتظار.'],
    ['تسكن بعيداً','سبب مقبول؛ الطبيب يحتاج أن يصلك بسرعة عند الزيارة المنزلية.'],
    ['أسباب مبدئية','ممكنة في حالات محددة.'],
    ['رفض بلا سبب مقبول','تواصل مع <strong>شركة تأمينك الصحي</strong> أو مركز Zorgbelang الإقليمي.'],
    ['لا تجد أي طبيب','<strong>شركة التأمين تساعدك في البحث والوساطة</strong>؛ اتصل بها.']],
   ['الحالة','ماذا تفعل'])
+'<h2 id="urgent">الطوارئ وخارج الدوام</h2>'
+T([['خطر على الحياة (ألم صدر شديد، فقدان وعي، نزيف قوي)','<strong>112</strong> فوراً'],
    ['مشكلة عاجلة في وقت الدوام','اتصل بطبيبك العام؛ قل إنها عاجلة'],
    ['مساءً، ليلاً، عطلة نهاية الأسبوع','<strong>مركز الأطباء (huisartsenpost)</strong> في منطقتك؛ رقمه على موقع طبيبك'],
    ['الطوارئ بالمستشفى (SEH)','عادة بعد اتصالك بمركز الأطباء أو بتحويل']],
   ['الحالة','لمن تتصل'])
+'<p><strong>التكلفة:</strong> زيارة مركز الأطباء لا تُخصم من المخاطرة الذاتية، أما الطوارئ بالمستشفى فتُخصم. لهذا اتصل بمركز الأطباء أولاً إلا في الخطر على الحياة.</p>'
'<h2 id="costs">كم يكلف؟</h2><ul><li><strong>زيارة الطبيب العام</strong> لا تُخصم من المخاطرة الذاتية (385 يورو في 2026).</li><li>التحاليل (مثل الدم) والأدوية بوصفة والتحويل للمستشفى قد تُخصم (<a href="/articles/health-insurance-2027.html">المخاطرة الذاتية وتغييرات 2027</a>).</li><li>طالبو اللجوء في مراكز COA يحصلون على الرعاية عبر نظام خاص دون مساهمة أو مخاطرة ذاتية، مع خط هاتفي على مدار الساعة؛ هذا ينتهي عادة بعد السكن في البلدية والاشتراك في تأمين هولندي.</li></ul>'
'<h2 id="change">تغيير الطبيب</h2><ol><li>سجّل عند الطبيب الجديد واحصل على التأكيد.</li><li>أبلغ الطبيب القديم.</li><li>اطلب نقل ملفك الطبي.</li></ol><p>يحق لك اختيار طبيبك بحرية.</p>'
'<h2 id="visit">كيف تستفيد من الموعد؟</h2><ul><li>الموعد العادي قصير (غالباً نحو 10 دقائق): اكتب أعراضك وأسئلتك مسبقاً.</li><li>لموضوعين أو أكثر اطلب موعداً أطول.</li><li>كثير من العيادات تتيح «استشارة إلكترونية» أو تطبيقاً لطلب الوصفات.</li><li><strong>اللغة:</strong> إن لم تتقن الهولندية فاطلب التحدث بالإنجليزية، أو أحضر من يترجم لك. تكلفة المترجم المحترف في الرعاية العامة غير مضمونة التغطية؛ اسأل العيادة أو بلديتك عن الخيارات.</li><li>موقع <strong>Thuisarts.nl</strong> من جمعية الأطباء العامين يشرح الأمراض بلغة بسيطة.</li></ul>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>انتظار المرض للبحث عن طبيب.</li><li>الذهاب للطوارئ مباشرة لمشكلة غير خطيرة، ثم دفع المخاطرة الذاتية.</li><li>عدم نقل الملف من مركز اللجوء.</li><li>الذهاب لمختص دون تحويل.</li></ol>'),
faq=[('هل التسجيل عند طبيب عام إلزامي؟','ليس إلزامياً لكنه ضروري عملياً، لأن الطبيب العام بوابة كل العلاج.'),
('هل يمكن للطبيب رفضي؟','نعم إن كانت العيادة ممتلئة أو كنت بعيداً. إن لم تجد طبيباً فشركة التأمين تساعدك.'),
('كم تكلف زيارة الطبيب العام؟','لا تُخصم من المخاطرة الذاتية؛ التحاليل والأدوية قد تُخصم.'),
('ماذا أفعل ليلاً؟','اتصل بمركز الأطباء (huisartsenpost)؛ في الخطر على الحياة 112.'),
('كيف أغيّر طبيبي؟','سجّل عند الجديد، أبلغ القديم، واطلب نقل الملف.')],
src_note='راجعنا Thuisarts.nl (جمعية الأطباء العامين NHG) وRijksoverheid في 5 أكتوبر 2026. لم نجد مصدراً رسمياً حديثاً حول تمويل المترجمين في الرعاية العامة، لذلك لا نجزم به.')

NL=dict(title='Huisarts in Nederland 2026: inschrijven, wat als de praktijk vol is, huisartsenpost en spoed, kosten, en meer uit je afspraak halen',
crumb='Huisarts',
desc='Uitgebreide gids huisarts: waarom de huisarts de poortwachter is, inschrijven, wanneer een huisarts mag weigeren (zorgverzekeraar helpt), spoed: 112, huisartsenpost en SEH, kosten (geen eigen risico voor de huisarts), wisselen en dossier overdragen, en tips voor het consult.',
summary='<ol><li><strong>De huisarts is de poortwachter</strong>: zonder verwijzing meestal geen specialist of ziekenhuis.</li><li><strong>Inschrijven is niet verplicht maar wel nodig</strong>; doe het zodra je een adres en zorgverzekering hebt.</li><li>Een huisarts mag weigeren bij een volle praktijk of te grote afstand. Lukt het niet: <strong>je zorgverzekeraar helpt</strong>.</li><li><strong>Huisartsbezoek valt niet onder het eigen risico</strong>; onderzoeken en medicijnen soms wel.</li><li><strong>Spoed:</strong> levensgevaar 112; ’s avonds en in het weekend eerst de huisartsenpost bellen.</li></ol>',
body=(
'<h2 id="role">Waarom de huisarts zo belangrijk is</h2><ul><li>Eerste aanspreekpunt bij niet-spoedeisende klachten, lichamelijk of psychisch.</li><li>Bepaalt of je een specialist nodig hebt en schrijft de <strong>verwijzing</strong>.</li><li>Beheert je dossier.</li><li>Voor kinderen onder 4 is er ook het consultatiebureau.</li></ul>'
'<h2 id="register">Inschrijven in stappen</h2><ol><li>Zoek op «huisarts» en je woonplaats of wijk.</li><li>Bel of vul het inschrijfformulier in.</li><li>Houd BSN, zorgpas, ID en adres bij de hand.</li><li>Soms volgt een kennismakingsgesprek.</li><li>Vraag je vorige huisarts (ook in de opvang) je <strong>dossier over te dragen</strong>.</li></ol><p>Eerst nodig: <a href="/nl/articles/bsn-municipality-registration.html">inschrijving bij de gemeente</a> en <a href="/nl/articles/health-insurance-newcomers.html">zorgverzekering</a>.</p>'
'<h2 id="refusal">Geweigerd?</h2>'
+T([['Praktijk vol','Geldige reden; probeer andere praktijken of een wachtlijst.'],['Te ver weg','Geldige reden.'],['Principiële redenen','Mogelijk in bepaalde gevallen.'],['Zonder geldige reden','Neem contact op met je <strong>zorgverzekeraar</strong> of het regionale Adviespunt Zorgbelang.'],['Geen huisarts te vinden','De <strong>zorgverzekeraar helpt zoeken en bemiddelt</strong>.']],['Situatie','Actie'])
+'<h2 id="urgent">Spoed en buiten kantoortijd</h2>'
+T([['Levensgevaar','<strong>112</strong>'],['Spoed overdag','Je eigen huisarts, zeg dat het spoed is'],['Avond, nacht, weekend','<strong>Huisartsenpost</strong> in je regio (nummer op de site van je huisarts)'],['Spoedeisende hulp (SEH)','Meestal na contact met de huisartsenpost of op verwijzing']],['Situatie','Bel'])
+'<p>De huisartsenpost valt niet onder het eigen risico, de SEH wel. Bel dus eerst de huisartsenpost, behalve bij levensgevaar.</p>'
'<h2 id="costs">Kosten</h2><ul><li><strong>Huisartsbezoek</strong> gaat niet van je eigen risico af (€ 385 in 2026).</li><li>Bloedonderzoek, medicijnen en ziekenhuiszorg op verwijzing soms wel (<a href="/nl/articles/health-insurance-2027.html">eigen risico en 2027</a>).</li><li>Asielzoekers in de COA-opvang krijgen zorg via een aparte regeling zonder eigen bijdrage, met een 24/7 hulplijn.</li></ul>'
'<h2 id="change">Wisselen</h2><ol><li>Inschrijven bij de nieuwe praktijk.</li><li>Oude huisarts informeren.</li><li>Dossier laten overdragen.</li></ol><p>Je bent vrij in je keuze.</p>'
'<h2 id="visit">Haal meer uit je consult</h2><ul><li>Een consult duurt vaak kort (ongeveer 10 minuten): schrijf klachten en vragen op.</li><li>Meerdere onderwerpen? Vraag een dubbel consult.</li><li>Veel praktijken bieden e-consult en een app voor herhaalrecepten.</li><li>Taal: vraag om Engels of neem iemand mee; vergoeding van een professionele tolk in de huisartsenzorg is niet gegarandeerd, vraag de praktijk of gemeente.</li><li><strong>Thuisarts.nl</strong> (NHG) legt klachten eenvoudig uit.</li></ul>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Pas een huisarts zoeken als je ziek bent.</li><li>Direct naar de SEH bij niet-ernstige klachten.</li><li>Dossier uit de opvang niet laten overdragen.</li><li>Zonder verwijzing naar een specialist.</li></ol>'),
faq=[('Is inschrijven bij een huisarts verplicht?','Niet verplicht, maar wel nodig: de huisarts is de poortwachter.'),
('Mag een huisarts mij weigeren?','Ja, bij een volle praktijk of te grote afstand. De zorgverzekeraar helpt je zoeken.'),
('Wat kost de huisarts?','Het bezoek valt niet onder het eigen risico; onderzoeken en medicijnen soms wel.'),
('Wat doe ik ’s nachts?','Bel de huisartsenpost; bij levensgevaar 112.'),
('Hoe wissel ik van huisarts?','Inschrijven bij de nieuwe, oude informeren, dossier laten overdragen.')],
src_note='Gecontroleerd bij Thuisarts.nl (NHG) en Rijksoverheid op 5 oktober 2026. Over vergoeding van tolken in de huisartsenzorg vonden we geen actuele officiële bron.')
