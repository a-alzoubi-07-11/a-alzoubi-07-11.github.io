from a_student_finance import T
SLUG='eu-permanent-residence-netherlands'
SRC=[('IND · Asiel onbepaalde tijd in Nederland aanvragen','https://ind.nl/nl/verblijfsvergunningen/asiel/asiel-onbepaalde-tijd-in-nederland-aanvragen'),
('IND · Nieuwe wetten en regels asiel en nareis','https://ind.nl/nl/nieuwe-wetten-en-regels-asiel-en-nareis'),
('IND · Verblijfsvergunning onbepaalde tijd aanvragen (regulier)','https://ind.nl/nl/verlengen-vernieuwen-en-wijzigen/onbepaalde-tijd/verblijfsvergunning-onbepaalde-tijd-aanvragen'),
('IND · Civic integration for a more secure residence permit','https://ind.nl/en/living-in-the-netherlands-with-a-residence-permit/civic-integration-for-more-secure-residence-permit'),
('IND · Leges: kosten van een aanvraag','https://ind.nl/nl/leges-kosten-van-een-aanvraag'),
('IND · Leges en normbedragen 2026 bekend','https://ind.nl/nl/nieuws/leges-en-normbedragen-2026-bekend'),
('Eerste Kamer · Wet invoering tweestatusstelsel (36 703)','https://www.eerstekamer.nl/wetsvoorstel/36703_wet_invoering')]

AR=dict(title='الإقامة الدائمة في هولندا 2026: ماذا تغيّر للاجئين منذ 12 يونيو، الإقامة غير المحددة العادية، والإقامة الأوروبية طويلة الأمد',
seo_title='الإقامة الدائمة في هولندا 2026',
crumb='الإقامة الدائمة',
desc='الإقامة الدائمة في هولندا: منذ 12 يونيو 2026 لا يمكن طلب إقامة لجوء غير محددة، والتصاريح الجديدة 3 سنوات. البديل: EU-langdurig بعد 5 سنوات.',
summary='<ol><li><strong>تغيير كبير منذ 12 يونيو 2026:</strong> لم يعد ممكناً <strong>طلب</strong> إقامة لجوء غير محددة المدة. من لديه واحدة يحتفظ بها.</li><li>تصاريح اللجوء الجديدة أو المجددة صالحة <strong>3 سنوات</strong> (كانت 5).</li><li>بعد <strong>5 سنوات</strong> إقامة قانونية بتصريح لجوء قد يكون لك حق في <strong>إقامة «مقيم أوروبي طويل الأمد» (EU-langdurig ingezetene)</strong>.</li><li><strong>الإقامة غير المحددة العادية</strong> (لم الشمل، العمل…): 5 سنوات متتالية، دخل مستقل ودائم وكافٍ، اندماج بمستوى A2 على الأقل، وتسجيل في البلدية.</li><li>طلبات إقامة اللجوء الدائمة المقدمة قبل 12 يونيو بلا قرار تُعامل كتجديد، وتُرد الرسوم في حالات محددة.</li></ol>',
body=(
'<h2 id="change">ما الذي تغيّر في 12 يونيو 2026؟</h2><p>دخلت قوانين تطبيق «ميثاق الهجرة واللجوء الأوروبي» و<strong>نظام الحالتين (tweestatusstelsel)</strong> حيز التنفيذ في 12 يونيو 2026. حسب IND:</p>'
+T([['إقامة لجوء غير محددة المدة','<strong>لا يمكن طلبها بعد الآن</strong>. من حصل عليها سابقاً يحتفظ بها.'],
    ['مدة تصريح اللجوء الجديد','<strong>3 سنوات</strong> بدل 5. عند التجديد يأخذ المستند تاريخ بدء 12 يونيو 2026 رسمياً.'],
    ['طلبات قُدّمت قبل 12 يونيو ولم يُبت فيها','تُعامل كطلب تجديد؛ وتُعاد الرسوم عند انتهاء المستند الحالي إن كان صالحاً لأكثر من 3 أشهر.'],
    ['بعد 5 سنوات إقامة قانونية بتصريح لجوء','«ربما يكون لك حق» في إقامة EU-langdurig ingezetene (صياغة IND).']],
   ['البند','الوضع الآن'])
+'<p><strong>انتبه:</strong> كثير من الفيديوهات والمنشورات القديمة تتحدث عن «الإقامة الدائمة بعد 5 سنوات لجوء». هذا المسار لم يعد متاحاً للطلبات الجديدة. اعتمد على صفحة IND المذكورة في المصادر.</p>'
'<h2 id="eu-lt">الإقامة الأوروبية طويلة الأمد (EU-langdurig ingezetene)</h2><ul><li>هي الطريق الأساسي الآن لحاملي إقامة اللجوء بعد 5 سنوات.</li><li>تتطلب عادة: 5 سنوات إقامة قانونية متواصلة، ودخلاً كافياً، و<strong>شهادة الاندماج</strong> أو إعفاء منها.</li><li>تتيح، حسب القواعد الأوروبية، تسهيلات للانتقال للإقامة في دولة أوروبية أخرى.</li><li>تفاصيل الدخل ومدد الغياب المسموح بها تختلف حسب حالتك: اقرأ صفحة IND الخاصة بطلبك قبل التقديم. لم نتمكن من تأكيد كل الشروط التفصيلية من صفحة رسمية واحدة، لذلك لا نذكر أرقاماً غير مؤكدة.</li></ul>'
'<h2 id="regular">الإقامة غير المحددة العادية (ليست لجوءاً)</h2><p>لمن يقيم بتصريح عادي «غير مؤقت الغرض» مثل لم الشمل مع شريك أو العمل:</p>'
+T([['مدة الإقامة','5 سنوات متتالية بتصريح ساري (السنوات تُحسب من سن 8؛ للطفل 13 سنة على الأقل)'],
    ['مكان الحياة الأساسي','هولندا'],
    ['الدخل','مستقل ودائم وكافٍ'],
    ['التسجيل','مسجل في البلدية (BRP)'],
    ['الاندماج','امتحان الاندماج بمستوى <strong>A2</strong> على الأقل، أو إعفاء'],
    ['صلاحية البطاقة','5 سنوات (تُجدد البطاقة، والحق دائم)']],
   ['الشرط','التفاصيل'])
+'<h2 id="integration">الاندماج شرط أساسي</h2><p>لا إقامة دائمة أو أوروبية طويلة الأمد عادة دون شهادة الاندماج، مع إمكان الإعفاء في حالات (مثل شهادة مسار Z). لذلك اجعل الاندماج أولويتك في السنوات الأولى (<a href="/articles/inburgering-integration-law-2026.html">دليل الاندماج 2026</a>، <a href="/articles/nt2-b1-exam-guide.html">امتحان NT2</a>).</p>'
'<h2 id="fees">الرسوم</h2><p>رسوم IND لطلبات الإقامة تتراوح بين 0 و1,406 يورو حسب نوع الطلب، وارتفعت في 1 يناير 2026 بنسبة 4.4%. انظر جدول IND الرسمي لنوع طلبك قبل الدفع؛ لم نجد رقماً منفصلاً مؤكداً لكل نوع إقامة دائمة في المصادر التي قرأناها.</p>'
'<h2 id="plan">خطتك العملية حسب وضعك</h2>'
+T([['لديك إقامة لجوء غير محددة (قبل 12 يونيو)','تبقى لك. جدد البطاقة فقط عند انتهائها، وفكّر في الجنسية إن استوفيت الشروط.'],
    ['لديك إقامة لجوء محددة','جدّدها في وقتها (قبل الانتهاء). اعمل على الاندماج والدخل. بعد 5 سنوات افحص إقامة EU-langdurig أو الجنسية.'],
    ['قدّمت طلب إقامة لجوء دائمة قبل 12 يونيو','سيُعامل كتجديد؛ تابع رسائل IND بخصوص رد الرسوم.'],
    ['لديك إقامة لم شمل أو عمل','الإقامة غير المحددة العادية بعد 5 سنوات بالشروط أعلاه.'],
    ['تفكر بالجنسية','غالباً بعد 5 سنوات إقامة متواصلة؛ الجنسية لا تتأثر بإلغاء إقامة اللجوء الدائمة (<a href="/articles/dutch-naturalisation-guide.html">دليل الجنسية</a>).']],
   ['وضعك','ماذا تفعل'])
+'<h2 id="tips">نصائح تحميك</h2><ol><li><strong>لا تدع تصريحك ينتهي.</strong> فجوة في الإقامة القانونية قد تكسر عدّ السنوات الخمس.</li><li><strong>احتفظ بنسخ</strong> من كل بطاقات الإقامة ورسائل IND وشهادات الاندماج.</li><li><strong>السفر الطويل</strong> خارج هولندا قد يؤثر على «مكان الحياة الأساسي» وعلى عدّ السنوات؛ اسأل قبل السفر الطويل.</li><li><strong>الدخل:</strong> عقد عمل مستقر يساعدك في الإقامة الأوروبية والعادية (<a href="/articles/employment-contracts-labor-law-2026.html">عقد العمل</a>).</li><li>للحالات المعقدة: VluchtelingenWerk أو محامٍ مختص بالهجرة (<a href="/articles/legal-aid-lawyer-toevoeging.html">المحامي بمساعدة قانونية toevoeging</a>).</li></ol>'),
faq=[('هل يمكنني طلب إقامة لجوء دائمة بعد 5 سنوات؟','لا، منذ 12 يونيو 2026 لم يعد ممكناً طلب إقامة لجوء غير محددة. من لديه واحدة يحتفظ بها. البديل بعد 5 سنوات قد يكون إقامة EU-langdurig ingezetene.'),
('كم مدة تصريح اللجوء الجديد؟','3 سنوات بدل 5، منذ 12 يونيو 2026.'),
('ماذا عن طلبي المقدم قبل 12 يونيو؟','يُعامل كطلب تجديد، وتُرد الرسوم إن كان مستندك الحالي صالحاً لأكثر من 3 أشهر عند انتهائه.'),
('ما شروط الإقامة غير المحددة العادية؟','5 سنوات متتالية بتصريح غير مؤقت الغرض، دخل مستقل ودائم وكافٍ، تسجيل في البلدية، واندماج A2 على الأقل أو إعفاء.'),
('هل يؤثر هذا على الجنسية؟','لا مباشرة؛ الجنسية لها شروطها الخاصة، وأهمها غالباً 5 سنوات إقامة متواصلة واندماج.')],
src_note='راجعنا صفحات IND وملف مجلس الشيوخ في 5 أكتوبر 2026. القواعد الجديدة دخلت حيز التنفيذ في 12 يونيو 2026 وقد تتغير تفاصيل تطبيقها؛ اعتمد على صفحة IND لحالتك أو استشر VluchtelingenWerk.')

NL=dict(title='Permanent verblijf in Nederland 2026: wat veranderde op 12 juni voor asielstatushouders, onbepaalde tijd regulier en EU-langdurig ingezetene',
seo_title='Permanent verblijf in Nederland 2026',
crumb='Permanent verblijf',
desc='Permanent verblijf in Nederland: sinds 12 juni 2026 geen asielvergunning voor onbepaalde tijd meer en nieuwe vergunningen 3 jaar. Na 5 jaar: EU-langdurig.',
summary='<ol><li><strong>Sinds 12 juni 2026</strong> kun je geen asielvergunning voor onbepaalde tijd meer <strong>aanvragen</strong>; wie er een heeft, houdt die.</li><li>Nieuwe of verlengde asielvergunningen zijn <strong>3 jaar</strong> geldig (was 5).</li><li>Na <strong>5 jaar</strong> rechtmatig verblijf met een asielvergunning heb je mogelijk recht op <strong>EU-langdurig ingezetene</strong>.</li><li><strong>Onbepaalde tijd regulier:</strong> 5 jaar, zelfstandig, duurzaam en voldoende inkomen, inburgering minimaal A2, BRP-inschrijving.</li><li>Aanvragen asiel onbepaalde tijd van vóór 12 juni zonder besluit worden als verlenging behandeld.</li></ol>',
body=(
'<h2 id="change">Wat veranderde op 12 juni 2026?</h2><p>De wetten ter uitvoering van het EU-Migratiepact en het <strong>tweestatusstelsel</strong> zijn op 12 juni 2026 in werking getreden. Volgens de IND:</p>'
+T([['Asielvergunning onbepaalde tijd','<strong>Niet meer aan te vragen</strong>. Wie er al een heeft, houdt die.'],['Geldigheid nieuwe asielvergunning','<strong>3 jaar</strong> in plaats van 5; bij verlenging formeel ingangsdatum 12 juni 2026.'],['Aanvragen van vóór 12 juni zonder besluit','Behandeld als verlenging; leges terug als het huidige document bij afloop nog meer dan 3 maanden geldig was.'],['Na 5 jaar rechtmatig verblijf met asielvergunning','«Mogelijk recht op» EU-langdurig ingezetene.']],['Onderdeel','Nu'])
+'<p><strong>Let op:</strong> oudere video’s en berichten over «permanent verblijf na 5 jaar asiel» kloppen niet meer voor nieuwe aanvragen.</p>'
'<h2 id="eu-lt">EU-langdurig ingezetene</h2><ul><li>Nu de belangrijkste route voor asielstatushouders na 5 jaar.</li><li>Vraagt meestal 5 jaar onafgebroken rechtmatig verblijf, voldoende inkomen en een <strong>inburgeringsdiploma</strong> of vrijstelling.</li><li>Geeft volgens de Europese regels makkelijker toegang tot verblijf in een ander EU-land.</li><li>Inkomens- en afwezigheidsregels hangen af van je situatie; lees de IND-pagina voor jouw aanvraag. We noemen geen bedragen die we niet officieel konden bevestigen.</li></ul>'
'<h2 id="regular">Onbepaalde tijd regulier</h2>'
+T([['Verblijfsduur','5 jaar achtereen met geldige vergunning (jaren vanaf 8 jaar tellen; kind minimaal 13)'],['Hoofdverblijf','In Nederland'],['Inkomen','Zelfstandig, duurzaam en voldoende'],['Inschrijving','BRP'],['Inburgering','Minimaal <strong>A2</strong> of vrijstelling'],['Document','5 jaar geldig']],['Voorwaarde','Toelichting'])
+'<h2 id="integration">Inburgering is de sleutel</h2><p>Zonder inburgeringsdiploma meestal geen permanent of EU-langdurig verblijf (vrijstellingen mogelijk, bijv. Z-routecertificaat). Zie <a href="/nl/articles/inburgering-integration-law-2026.html">inburgeren 2026</a> en <a href="/nl/articles/nt2-b1-exam-guide.html">staatsexamen Nt2</a>.</p>'
'<h2 id="fees">Leges</h2><p>De IND-leges voor verblijfsvergunningen liggen tussen € 0 en € 1.406 en stegen op 1 januari 2026 met 4,4%. Controleer het bedrag voor jouw aanvraag in het officiële IND-overzicht.</p>'
'<h2 id="plan">Wat doe je in jouw situatie?</h2>'
+T([['Asiel onbepaalde tijd (van vóór 12 juni)','Je houdt die; verleng alleen het pasje en kijk naar naturalisatie.'],['Asiel bepaalde tijd','Op tijd verlengen; werk aan inburgering en inkomen; na 5 jaar EU-langdurig of naturalisatie bekijken.'],['Aanvraag onbepaalde tijd vóór 12 juni','Wordt als verlenging behandeld; let op IND-post over terugbetaling leges.'],['Gezinsmigrant of arbeidsmigrant','Onbepaalde tijd regulier na 5 jaar.'],['Naturalisatie','Meestal na 5 jaar; niet geraakt door het einde van asiel onbepaalde tijd (<a href="/nl/articles/dutch-naturalisation-guide.html">naturalisatie</a>).']],['Situatie','Actie'])
+'<h2 id="tips">Tips</h2><ol><li>Laat je vergunning nooit verlopen; een gat kan de 5 jaar breken.</li><li>Bewaar alle pasjes, IND-brieven en diploma’s.</li><li>Lang verblijf in het buitenland kan je hoofdverblijf raken.</li><li>Stabiel werk helpt (<a href="/nl/articles/employment-contracts-labor-law-2026.html">arbeidscontract</a>).</li><li>Complexe situatie: VluchtelingenWerk of een immigratieadvocaat (<a href="/nl/articles/legal-aid-lawyer-toevoeging.html">advocaat met toevoeging</a>).</li></ol>'),
faq=[('Kan ik na 5 jaar asiel onbepaalde tijd aanvragen?','Nee, sinds 12 juni 2026 niet meer. Wie er een heeft, houdt die. Mogelijk alternatief: EU-langdurig ingezetene.'),
('Hoe lang is een nieuwe asielvergunning geldig?','3 jaar, sinds 12 juni 2026.'),
('Wat gebeurt met mijn aanvraag van vóór 12 juni?','Die wordt als verlenging behandeld; leges terug als je document nog meer dan 3 maanden geldig was.'),
('Wat zijn de voorwaarden voor onbepaalde tijd regulier?','5 jaar, niet-tijdelijk doel, zelfstandig duurzaam voldoende inkomen, BRP en inburgering A2 of vrijstelling.'),
('Verandert er iets voor naturalisatie?','Niet direct; naturalisatie heeft eigen voorwaarden.')],
src_note='Gecontroleerd op IND-pagina’s en het dossier van de Eerste Kamer op 5 oktober 2026. De nieuwe regels gelden sinds 12 juni 2026; uitvoeringsdetails kunnen nog wijzigen.')
