from a_student_finance import T
SLUG='bsn-municipality-registration'
SRC=[('Rijksoverheid · Wanneer moet ik mij inschrijven in de BRP?','https://www.rijksoverheid.nl/vraag-en-antwoord/privacy-en-persoonsgegevens/wanneer-in-brp-inschrijven'),
('Rijksoverheid · Hoe kom ik aan een burgerservicenummer (BSN)?','https://www.rijksoverheid.nl/onderwerpen/privacy-en-persoonsgegevens/vraag-en-antwoord/hoe-kom-ik-aan-een-burgerservicenummer-bsn'),
('RvIG · Als je in Nederland wilt komen wonen','https://www.rvig.nl/als-je-nederland-wilt-komen-wonen'),
('RvIG · Veelgestelde vragen BRP','https://www.rvig.nl/veelgestelde-vragen-brp'),
('Nederland Wereldwijd · Wat is de RNI?','https://www.nederlandwereldwijd.nl/wonen-werken/registratie-niet-ingezetenen/over-de-rni/wat-is-de-rni'),
('Rijksoverheid · Uittreksel bevolkingsregister aanvragen','https://www.rijksoverheid.nl/vraag-en-antwoord/privacy-en-persoonsgegevens/uittreksel-bevolkingsregister-aanvragen'),
('Gemeente Den Haag · Eerste inschrijving vanuit het buitenland (voorbeeld)','https://www.denhaag.nl/nl/verhuizen-en-migratie/verhuizen-vanuit-het-buitenland/inschrijven-vanuit-het-buitenland-u-heeft-nog-geen-bsn/1e-inschrijving-brp-vanuit-het-buitenland-met-verblijfsvergunning-u-heeft-nog-geen-bsn.htm')]

AR=dict(title='التسجيل في البلدية والحصول على BSN في هولندا 2026: متى وكيف، الوثائق، تسجيل RNI لأقل من 4 أشهر، تصحيح البيانات، ومستخرج السجل',
crumb='BSN والتسجيل في البلدية',
desc='دليل عميق للتسجيل في سجل السكان BRP والحصول على رقم BSN: من يجب عليه التسجيل (أكثر من 4 أشهر) وخلال 5 أيام من الوصول، الوثائق، الإقامة القانونية، تسجيل RNI للإقامات القصيرة، احتيال العناوين، تصحيح البيانات خلال شهر، حماية بياناتك، ومستخرج BRP.',
summary='<ol><li><strong>إن كنت ستسكن في هولندا أكثر من 4 أشهر</strong> فسجّل في البلدية (BRP) <strong>خلال 5 أيام</strong> من وصولك. التسجيل مجاني.</li><li>تحصل على <strong>رقم BSN</strong> (9 أرقام، صالح مدى الحياة) عند تسجيلك.</li><li>تحتاج: هوية سارية، وإثبات إقامة قانونية، وإثبات سكن، ووثائق الأحوال المدنية الأجنبية إن وُجدت.</li><li><strong>للإقامة أقل من 4 أشهر</strong>: تسجيل RNI في أحد 19 مكتباً، ويمنحك BSN أيضاً.</li><li><strong>لا تشترِ عنوان سكن أو بريد</strong> من مواقع أو شركات: هذا احتيال عناوين.</li></ol>',
body=(
'<h2 id="what">ما هو BRP وما هو BSN؟</h2><ul><li><strong>BRP</strong> هو سجل السكان الهولندي لدى البلديات: اسمك وعنوانك وتاريخ ميلادك وحالتك المدنية.</li><li><strong>BSN</strong> رقم شخصي من 9 أرقام، تحصل عليه عند تسجيلك في BRP، ويبقى صالحاً دون حد. تستخدمه في التعامل مع الحكومة والضرائب والتأمين الصحي والطبيب والبنك والعمل.</li><li>بدون BSN لا تستطيع عملياً: العمل رسمياً، فتح حساب بنكي، التأمين الصحي، البدلات، أو DigiD (<a href="/articles/digid-registration-guide.html">دليل DigiD</a>).</li></ul>'
'<h2 id="who">من يجب أن يسجّل ومتى؟</h2>'
+T([['ستسكن في هولندا أكثر من 4 أشهر','سجّل في BRP كمقيم، <strong>خلال 5 أيام</strong> من الوصول (RvIG يذكر «5 أيام عمل»). عملياً: سجّل بأسرع وقت.'],
    ['ستبقى أقل من 4 أشهر (عمل موسمي، دراسة قصيرة)','تسجيل «غير مقيم» في <strong>RNI</strong> في أحد 19 بلدية بمكاتب RNI. غير إلزامي، لكنه ضروري إن احتجت BSN.'],
    ['طالب لجوء في مركز الاستقبال','التسجيل والـBSN يتمان عادة عبر إجراءات الاستقبال؛ بعد الحصول على الإقامة والسكن تسجل في بلديتك الجديدة.']],
   ['وضعك','ما تفعله'])
+'<p><strong>شرط الإقامة القانونية:</strong> جنسية هولندية أو أوروبية، أو تصريح إقامة ساري. قد يُؤجل التسجيل إن كان طلب إقامتك قيد المعالجة أو كانت هويتك قيد التحقق.</p>'
'<h2 id="documents">الوثائق المطلوبة</h2>'
+T([['هوية سارية','جواز سفر أو بطاقة هوية (رخصة القيادة لا تكفي في كثير من البلديات)'],
    ['إثبات الإقامة القانونية','بطاقة الإقامة، أو رسالة IND، أو تأشيرة MVV'],
    ['إثبات السكن','عقد إيجار، أو عقد شراء، أو <strong>إذن مكتوب من الساكن الرئيسي</strong> مع نسخة من هويته'],
    ['وثائق مدنية أجنبية','شهادة الميلاد، عقد الزواج أو الطلاق، إن وُجدت؛ قد تطلب البلدية تصديقاً أو ترجمة محلفة حسب البلد']],
   ['الوثيقة','التفاصيل'])
+'<p>مثال من بلدية لاهاي: التسجيل الأول مجاني، ويصلك BSN بالبريد خلال 4 أسابيع. كل بلدية لها طريقة حجز موعد خاصة؛ ابحث في موقع بلديتك عن «eerste inschrijving vanuit het buitenland».</p>'
'<h2 id="fraud">احذر: احتيال العناوين</h2><p>يحذّر RvIG من <strong>شراء عنوان سكن أو بريد</strong> عبر مواقع أو شركات. هذا احتيال عناوين قد يؤدي إلى مشاكل جدية: إلغاء تسجيلك، استرداد البدلات، وغرامات. إن عرض عليك أحد «عنواناً مقابل مال» فلا تقبل، ويمكنك الإبلاغ لدى مركز بلاغات الاحتيال (CMI).</p>'
'<h2 id="correct">بياناتك خاطئة في BRP؟</h2><ul><li>تواصل مع بلديتك وأحضر الإثبات (مثلاً وثيقة ميلاد صحيحة).</li><li>تقرر البلدية <strong>خلال شهر</strong>.</li><li>الأخطاء الشائعة: الاسم بالحروف اللاتينية، تاريخ الميلاد (01-01)، الحالة المدنية. صححها مبكراً، لأنها تنتقل إلى IND وBelastingdienst وDUO ووثائقك المستقبلية.</li></ul>'
'<h2 id="privacy">حماية بياناتك</h2><ul><li>اطّلع على بياناتك مجاناً في <strong>MijnOverheid</strong> (MijnGegevens) بـDigiD.</li><li>يمكنك طلب <strong>تقييد تزويد البيانات</strong> (verstrekkingsbeperking) من البلدية، حتى لا تُعطى بياناتك لبعض المنظمات غير الحكومية.</li></ul>'
'<h2 id="extract">مستخرج BRP (uittreksel)</h2><p>تطلبه من بلديتك؛ المستخرج العادي فيه الاسم والعنوان وتاريخ الميلاد، وهناك أنواع موسعة. اذكر دائماً لماذا تحتاجه. حسب RvIG: مجاني عند التسجيل الأول أو العودة، والنسخة الورقية مدفوعة غالباً (السعر حسب البلدية).</p>'
'<h2 id="after">بعد الحصول على BSN: الخطوات التالية</h2><ol><li>فعّل <a href="/articles/digid-registration-guide.html">DigiD</a>.</li><li>اشترك في <a href="/articles/health-insurance-newcomers.html">التأمين الصحي</a> (إلزامي).</li><li>سجّل عند <a href="/articles/huisarts-registration.html">طبيب عام</a>.</li><li>افتح حساباً بنكياً واطلب البدلات المستحقة (<a href="/articles/zorgtoeslag-guide.html">بدل الرعاية</a>).</li><li>عند الانتقال لاحقاً، أبلغ البلدية (<a href="/articles/change-address-netherlands.html">دليل تغيير العنوان</a>).</li></ol>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>تأخير التسجيل أسابيع: يؤخر كل شيء (العمل، التأمين، البدلات).</li><li>السكن عند شخص دون إذن مكتوب منه.</li><li>قبول «عنوان مدفوع».</li><li>ترك أخطاء الاسم أو التاريخ دون تصحيح.</li><li>إعطاء BSN لكل من يطلبه؛ أعطه فقط لجهات رسمية وصاحب العمل والطبيب والبنك.</li></ol>'),
faq=[('متى يجب أن أسجل في البلدية؟','خلال 5 أيام من وصولك إن كنت ستسكن في هولندا أكثر من 4 أشهر.'),
('كم يكلف التسجيل؟','التسجيل في BRP مجاني.'),
('كيف أحصل على BSN؟','تلقائياً عند تسجيلك في BRP، أو عبر تسجيل RNI إن كانت إقامتك أقل من 4 أشهر.'),
('أسكن عند صديق، هل يمكنني التسجيل على عنوانه؟','نعم، بإذن مكتوب من الساكن الرئيسي ونسخة من هويته، وحسب قواعد البلدية.'),
('اسمي مكتوب خطأ في BRP، ماذا أفعل؟','تواصل مع البلدية بالإثبات؛ القرار خلال شهر.'),
('هل يمكن شراء عنوان للتسجيل؟','لا. هذا احتيال عناوين يحذر منه RvIG وقد يكلفك غالياً.')],
src_note='راجعنا Rijksoverheid وRvIG وNederland Wereldwijd وبلدية لاهاي (مثالاً) في 5 أكتوبر 2026. الوثائق وطريقة الحجز تختلف قليلاً بين البلديات؛ راجع موقع بلديتك.')

NL=dict(title='Inschrijven bij de gemeente en een BSN krijgen in 2026: wanneer en hoe, documenten, RNI bij korter dan 4 maanden, gegevens corrigeren en een BRP-uittreksel',
crumb='BSN en inschrijving',
desc='Uitgebreide gids BRP-inschrijving en BSN: wie zich moet inschrijven (langer dan 4 maanden) en binnen 5 dagen, documenten, rechtmatig verblijf, RNI voor kort verblijf, adresfraude, gegevens corrigeren binnen een maand, verstrekkingsbeperking en uittreksel.',
summary='<ol><li><strong>Woon je langer dan 4 maanden in Nederland</strong>, schrijf je dan <strong>binnen 5 dagen</strong> na aankomst in bij de gemeente (BRP). Gratis.</li><li>Je krijgt een <strong>BSN</strong> (9 cijfers, onbeperkt geldig).</li><li>Nodig: geldig ID, bewijs van rechtmatig verblijf, bewijs van bewoning en eventueel buitenlandse akten.</li><li><strong>Korter dan 4 maanden</strong>: inschrijving in de RNI bij een van de 19 RNI-loketten, ook met BSN.</li><li><strong>Koop geen woon- of postadres</strong>: dat is adresfraude.</li></ol>',
body=(
'<h2 id="what">Wat zijn de BRP en het BSN?</h2><ul><li><strong>BRP</strong>: de basisregistratie personen bij de gemeente (naam, adres, geboortedatum, burgerlijke staat).</li><li><strong>BSN</strong>: persoonlijk nummer van 9 cijfers, onbeperkt geldig, voor contact met overheid, belastingen, zorg, werk en bank.</li><li>Zonder BSN geen officieel werk, bankrekening, zorgverzekering, toeslagen of <a href="/nl/articles/digid-registration-guide.html">DigiD</a>.</li></ul>'
'<h2 id="who">Wie moet zich inschrijven en wanneer?</h2>'
+T([['Langer dan 4 maanden in Nederland','Inschrijven als ingezetene <strong>binnen 5 dagen</strong> (RvIG: 5 werkdagen). Doe het zo snel mogelijk.'],['Korter dan 4 maanden','Inschrijving als niet-ingezetene in de <strong>RNI</strong> (19 gemeenten met RNI-loket); niet verplicht, wel nodig voor een BSN.'],['Asielzoeker in de opvang','Inschrijving verloopt via de opvang; na vergunning en woning schrijf je je in bij je nieuwe gemeente.']],['Situatie','Actie'])
+'<p><strong>Rechtmatig verblijf:</strong> Nederlandse of EU-nationaliteit of een geldige verblijfsvergunning. Inschrijving kan worden uitgesteld als je aanvraag nog loopt of je identiteit wordt onderzocht.</p>'
'<h2 id="documents">Documenten</h2>'
+T([['Geldig ID','Paspoort of ID-kaart (geen rijbewijs bij veel gemeenten)'],['Rechtmatig verblijf','Verblijfsdocument, IND-brief of mvv'],['Bewijs van bewoning','Huurcontract, koopakte of <strong>toestemming van de hoofdbewoner</strong> met kopie ID'],['Buitenlandse akten','Geboorte-, huwelijks- of scheidingsakte; soms gelegaliseerd of beëdigd vertaald']],['Document','Toelichting'])
+'<p>Voorbeeld Den Haag: eerste inschrijving gratis, BSN binnen 4 weken per post. Zoek op de site van je gemeente naar «eerste inschrijving vanuit het buitenland».</p>'
'<h2 id="fraud">Pas op voor adresfraude</h2><p>De RvIG waarschuwt: <strong>koop geen woon- of postadres</strong> via websites of bedrijven. Dat leidt tot uitschrijving, terugvordering van toeslagen en boetes. Melden kan bij het CMI.</p>'
'<h2 id="correct">Gegevens fout in de BRP?</h2><ul><li>Neem contact op met je gemeente met bewijsstukken.</li><li>De gemeente beslist <strong>binnen een maand</strong>.</li><li>Corrigeer fouten in naam, geboortedatum of burgerlijke staat snel: ze gaan door naar IND, Belastingdienst en DUO.</li></ul>'
'<h2 id="privacy">Je gegevens beschermen</h2><ul><li>Bekijk je gegevens gratis via <strong>MijnOverheid</strong> (MijnGegevens) met DigiD.</li><li>Vraag een <strong>verstrekkingsbeperking</strong> aan bij de gemeente.</li></ul>'
'<h2 id="extract">Uittreksel BRP</h2><p>Aanvragen bij je woongemeente; standaard met naam, adres en geboortedatum, uitgebreid mogelijk. Gratis bij eerste inschrijving of terugkeer; papieren uittreksel meestal betaald (prijs per gemeente).</p>'
'<h2 id="after">Daarna</h2><ol><li><a href="/nl/articles/digid-registration-guide.html">DigiD</a> aanvragen.</li><li><a href="/nl/articles/health-insurance-newcomers.html">Zorgverzekering</a> afsluiten.</li><li>Inschrijven bij een <a href="/nl/articles/huisarts-registration.html">huisarts</a>.</li><li>Bankrekening en <a href="/nl/articles/zorgtoeslag-guide.html">zorgtoeslag</a>.</li><li>Verhuizing later doorgeven (<a href="/nl/articles/change-address-netherlands.html">adreswijziging</a>).</li></ol>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Weken wachten met inschrijven.</li><li>Inwonen zonder schriftelijke toestemming.</li><li>Een «betaald adres» accepteren.</li><li>Fouten in naam of datum laten staan.</li><li>Je BSN aan iedereen geven.</li></ol>'),
faq=[('Wanneer moet ik me inschrijven?','Binnen 5 dagen na aankomst als je langer dan 4 maanden blijft.'),
('Wat kost inschrijven?','Inschrijving in de BRP is gratis.'),
('Hoe krijg ik een BSN?','Automatisch bij inschrijving in de BRP, of via de RNI bij verblijf korter dan 4 maanden.'),
('Ik woon bij een vriend. Kan ik me daar inschrijven?','Ja, met schriftelijke toestemming van de hoofdbewoner en kopie van zijn ID.'),
('Mijn naam staat fout in de BRP.','Neem contact op met de gemeente met bewijs; besluit binnen een maand.'),
('Mag ik een adres kopen om me in te schrijven?','Nee, dat is adresfraude.')],
src_note='Gecontroleerd bij Rijksoverheid, RvIG, Nederland Wereldwijd en (als voorbeeld) gemeente Den Haag op 5 oktober 2026. Documenten en afspraakroute verschillen per gemeente.')
