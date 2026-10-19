from a_student_finance import T
from infog import FIG
SLUG='permanent-residence-regular-route'
SRC=[('IND · Verblijfsvergunning onbepaalde tijd aanvragen (regulier)','https://ind.nl/nl/vervangen-verlengen-vernieuwen-en-wijzigen/onbepaalde-tijd/verblijfsvergunning-onbepaalde-tijd-aanvragen'),
('IND · Verblijfsvergunning EU-langdurig ingezetene','https://ind.nl/nl/verblijfsvergunningen/langdurig-ingezetene-eu/verblijfsvergunning-eu-langdurig-ingezetene'),
('IND · Tijdelijke en niet-tijdelijke verblijfsdoelen','https://ind.nl/nl/tijdelijke-en-niet-tijdelijke-verblijfsdoelen'),
('IND · Uitzonderingen 5 jaar verblijf bij onbepaalde tijd','https://ind.nl/nl/uitzonderingen-5-jaar-verblijf-bij-onbepaalde-tijd'),
('IND · Inkomenseisen: zelfstandig, duurzaam en voldoende inkomen','https://ind.nl/nl/zelfstandig-duurzaam-en-voldoende-inkomen'),
('IND · Inkomenseisen normbedragen','https://ind.nl/nl/inkomenseisen-normbedragen'),
('IND · Aanvraagformulier 6009 (EU-langdurig of regulier onbepaalde tijd)','https://ind.nl/nl/formulieren/6009.pdf'),
('IND · Inburgering bij sterkere verblijfsvergunning','https://ind.nl/nl/met-een-verblijfsvergunning-wonen-in-nederland/inburgering-bij-sterkere-verblijfsvergunning'),
('IND · Leges: kosten van een aanvraag','https://ind.nl/nl/leges-kosten-van-een-aanvraag')]

AR=dict(title='الإقامة الدائمة لأصحاب الإقامة العادية (regulier) 2026: الأوروبية أم regulier onbepaalde tijd؟',
seo_title='الإقامة الدائمة لأصحاب إقامة regulier 2026',
crumb='الإقامة الدائمة: regulier',
desc='لأصحاب إقامة الشريك أو العمل أو kennismigrant: الفرق بين EU-langdurig ingezetene وregulier onbepaalde tijd، الإعفاءات من شرط الدخل، الاستمارة 6009 وملاحقها.',
summary='<ol><li>إن كان غرض إقامتك <strong>غير مؤقت</strong> (شريك، عائلة، عمل، kennismigrant، عمل حر، Chavez…) فلك مساران بعد <strong>5 سنوات</strong>: <strong>EU-langdurig ingezetene</strong> (النوع V) أو <strong>regulier onbepaalde tijd</strong> (النوع II).</li><li>لا تختار بنفسك: بالاستمارة <strong>6009</strong> يفحص IND الإقامة الأوروبية <strong>أولاً</strong>، ثم العادية الدائمة، ثم تمديد إقامتك الحالية.</li><li>الفرق الأهم: سنوات <strong>الدراسة</strong> تُحسب بالنصف للأوروبية وكاملة للعادية، و<strong>إعفاءات شرط الدخل</strong> (10 سنوات إقامة، الولادة في هولندا…) للعادية فقط.</li><li>الاندماج: مستوى <strong>A2</strong> على الأقل أو إعفاء. الدخل: <strong>1.635,90 يورو</strong> sv-loon شهرياً (أو 2.337 يورو مع الشريك).</li><li>الأغراض المؤقتة (دراسة، zoekjaar، au pair، عمل موسمي…) <strong>لا تؤهل</strong> للتقديم.</li></ol>',
body=(
'<h2 id="check">افحص وضعك في دقيقتين</h2><p>جرّب <a href="/calculators/permanent-residence-check.html">فاحص الإقامة الدائمة</a>: يحدد نوع إقامتك، ويقيّم عقد عملك من 5، ويعطيك مؤشر جاهزية لكل مسار والاستمارة الصحيحة.</p>'
'<h2 id="purpose">هل غرض إقامتك مؤقت أم غير مؤقت؟</h2><p>هذا أول ما يحدد إن كان يمكنك التقديم. انظر خانة الملاحظات على بطاقة إقامتك:</p>'
+T([['<span lang="nl" dir="ltr">verblijf bij partner of gezinslid</span> (غالباً)، <span lang="nl" dir="ltr">arbeid in loondienst</span>، <span lang="nl" dir="ltr">kennismigrant</span>، <span lang="nl" dir="ltr">arbeid als zelfstandige</span>، <span lang="nl" dir="ltr">Europese blauwe kaart</span>، <span lang="nl" dir="ltr">onderzoek</span>، <span lang="nl" dir="ltr">humanitair niet-tijdelijk</span>، <span lang="nl" dir="ltr">Chavez</span>','غير مؤقت: <strong>يمكنك التقديم</strong> على المسارين.'],
    ['<span lang="nl" dir="ltr">studie</span>، <span lang="nl" dir="ltr">zoekjaar hoogopgeleiden</span>، <span lang="nl" dir="ltr">au pair</span>، <span lang="nl" dir="ltr">seizoenarbeid</span>، <span lang="nl" dir="ltr">stage/praktikant</span>، <span lang="nl" dir="ltr">overplaatsing binnen een onderneming</span>، <span lang="nl" dir="ltr">uitwisseling</span>، <span lang="nl" dir="ltr">medische behandeling</span>، <span lang="nl" dir="ltr">tijdelijke humanitaire gronden</span>','مؤقت: <strong>لا يمكنك التقديم</strong> بهذا الغرض. غيّر الغرض أولاً (مثلاً من zoekjaar إلى kennismigrant).']],
   ['الغرض على بطاقتك','النتيجة'])
+'<p>الإقامة مع الشريك أو العائلة قد تكون مؤقتة أو غير مؤقتة حسب وضع الشريك المقيم (مثلاً إن كان الشريك طالباً فإقامتك مؤقتة). القرار المكتوب على بطاقتك هو المرجع.</p>'
'<h2 id="compare">المساران جنباً إلى جنب</h2>'
+FIG('permres-regular-route','ar','إنفوغرافيك: شجرة قرار لأصحاب الإقامة العادية بين EU-langdurig ingezetene وregulier onbepaalde tijd','إنفوغرافيك: أي إقامة دائمة تناسبك؟')
+T([['المدة','5 سنوات متواصلة','5 سنوات متواصلة'],
    ['سنوات الدراسة','تُحسب بالنصف','تُحسب كاملة (حسب استمارة 6009)'],
    ['سنوات الطفولة','—','لا تُحسب السنوات قبل سن 8؛ الطفل يقدّم من سن 13'],
    ['الغياب','حتى 6 أشهر متتالية و10 أشهر إجمالاً','مركز الحياة (<span lang="nl" dir="ltr">hoofdverblijf</span>) في هولندا طوال المدة'],
    ['التجديد في الوقت','لا فجوة في الإقامة','يجب أنك جدّدت دائماً في الوقت'],
    ['الدخل','دائماً مطلوب، بلا إعفاء','مطلوب، مع إعفاءات (انظر أدناه)'],
    ['الاندماج','شهادة أو إعفاء','<strong>A2</strong> على الأقل أو إعفاء'],
    ['الحقوق','إقامة دائمة + تسهيلات للإقامة في دولة أوروبية أخرى','إقامة دائمة في هولندا'],
    ['الرسوم 2026','254 يورو','254 يورو']],
   ['البند','EU-langdurig ingezetene (V)','regulier onbepaalde tijd (II)'])
+'<h2 id="exempt">من يُعفى من شرط الدخل في الإقامة العادية؟</h2><p>تنطبق هذه الإعفاءات على <span lang="nl" dir="ltr">regulier onbepaalde tijd</span> فقط، ولمن عمره 18 سنة أو أكثر:</p><ul><li>لديك إقامة متواصلة منذ <strong>10 سنوات أو أكثر</strong> (وسنوات الجنسية الهولندية السابقة تُحسب).</li><li>حصلت كقاصر على إقامة للعيش مع والديك، وبقيت في هولندا، ولم تستقل أو تتزوج خلال سنة من حصولك عليها.</li><li><strong>وُلدت في هولندا</strong> وعشت فيها دائماً.</li><li>وصلت إلى هولندا <strong>قبل سن 3</strong> وعشت فيها دائماً.</li></ul><p>ومن وُلد في هولندا أو وصلها قبل سن 3 لا يُرفض طلبه إلا لأسباب النظام العام أو الأمن الوطني.</p>'
'<h2 id="five">استثناءات من شرط الخمس سنوات</h2><ul><li>الجنسية <strong>البلجيكية أو اللوكسمبورغية</strong>.</li><li>المتمتعون بامتيازات دبلوماسية سابقاً وأفراد عائلاتهم.</li><li>حاملو الجنسية الهولندية سابقاً، ومن عاش في هولندا كطفل بشروط محددة (<span lang="nl" dir="ltr">remigratie</span>).</li></ul><p>حامل البطاقة الزرقاء له قواعد أخف للإقامة الأوروبية: سنتان في هولندا بعد 12 شهراً ببطاقة زرقاء في دولة أوروبية أخرى.</p>'
'<h2 id="income">الدخل وعقد العمل</h2>'
+T([['تثبت الدخل بنفسك','1.635,90 يورو','1.766,77 يورو'],['مع الشريك (متزوجان أو شراكة مسجلة، تسكنان معاً)','2.337,00 يورو','2.523,96 يورو']],['الحالة (1 يوليو – 31 ديسمبر 2026)','بدون vakantiegeld','مع vakantiegeld'])
+'<p>العقد الدائم أو المؤقت المتبقي منه 12 شهراً كافٍ. العقد الأقصر أو المرن يحتاج سجل دخل كافٍ لآخر 12 شهراً أو 3 سنوات. كل الحالات والأوراق في <a href="/articles/eu-permanent-residence-netherlands.html">دليل الإقامة الأوروبية الدائمة</a>.</p>'
'<h2 id="form">الاستمارة 6009 وملاحقها</h2>'
+T([['6009','الطلب نفسه، عبر الإنترنت بـ <span lang="nl" dir="ltr">DigiD</span> (بعد 5 سنوات إقامة) أو ورقياً إلى <span lang="nl" dir="ltr">IND, Postbus 9, 9560 AA Ter Apel</span>.'],
    ['7101 Antecedentenverklaring','إلزامي لكل من عمره 12 سنة أو أكثر.'],
    ['7110 Werkgeversverklaring','واحدة لكل صاحب عمل (ولصاحب عمل الشريك)، لا يزيد عمرها عن 3 أشهر.'],
    ['7112 Verklaring inkomen zelfstandig ondernemer','للعمل الحر فقط، بتوقيع محاسب أو إداري برقم <span lang="nl" dir="ltr">BECON</span>.'],
    ['7116 Bijlage inburgeringsvereiste','لإثبات الاندماج أو الإعفاء، بنسخ مصدّقة (إلا نسخة شهادة الاندماج).'],
    ['7111 Bewijsmiddelen inkomen','قائمة إرشادية بأوراق الدخل حسب حالتك. <strong>لا ترسلها</strong>.']],
   ['الوثيقة','متى ولماذا'])
+'<ul><li><strong>ترتيب الفحص:</strong> IND يفحص الأوروبية أولاً، ثم العادية الدائمة، ثم تمديد إقامتك الحالية. لا تحتاج طلبين.</li><li>إن كانت لديك <span lang="nl" dir="ltr">regulier onbepaalde tijd</span> وتريد الأوروبية، اختر المسار 503 في القسم 2؛ وإن لم تستوفِ الشروط يُرفض الطلب دون فحص آخر.</li><li>تأكد أن IND يستلم طلبك <strong>قبل انتهاء إقامتك الحالية</strong>، وإلا تنشأ فجوة (<span lang="nl" dir="ltr">verblijfsgat</span>) تضر بالإقامة الدائمة والتجنّس لاحقاً.</li><li>القرار يستغرق عادة حتى 6 أشهر. الرسوم لا تُعاد عند الرفض.</li></ul>'
'<h2 id="examples">أمثلة</h2><p><em>أمثلة توضيحية وليست حالات أشخاص حقيقيين.</em></p>'
+T([['ليلى: إقامة شريك منذ 6 سنوات، شهادة اندماج، عقد مؤقت متبقٍّ منه 14 شهراً براتب 2.000 يورو','تستوفي الأوروبية. IND يمنحها EU-langdurig.'],
    ['عمر: kennismigrant منذ 5 سنوات بعد 4 سنوات دراسة، شهادة اندماج','9 سنوات متواصلة: تُحسب منها 7 للأوروبية (الدراسة بالنصف) و9 للعادية. يستوفي المسارين.'],
    ['سارة: إقامة منذ 11 سنة، دخلها من bijstand، شهادة اندماج','الأوروبية: لا (الدخل). العادية: نعم، لأنها معفاة من شرط الدخل بعد 10 سنوات.'],
    ['أحمد: zoekjaar منذ سنة بعد 4 سنوات دراسة','غرضه مؤقت، لا يمكنه التقديم. يحتاج أولاً إقامة kennismigrant أو عمل.']],
   ['الحالة','النتيجة'])
+'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>التقديم بغرض مؤقت (دراسة أو zoekjaar).</li><li>التجديد المتأخر وترك فجوة في الإقامة.</li><li>الاعتقاد بأن إعفاء الـ 10 سنوات ينطبق على الأوروبية.</li><li><span lang="nl" dir="ltr">Werkgeversverklaring</span> أقدم من 3 أشهر.</li><li>نسيان ملحق 7101 لأفراد العائلة من عمر 12 فأكثر.</li></ol><p>وبعدها قد تكون الخطوة التالية <a href="/articles/dutch-naturalisation-guide.html">التجنّس</a>.</p>'),
faq=[('هل أختار بين الأوروبية والعادية؟','لا. بالاستمارة 6009 يفحص IND الأوروبية أولاً ثم العادية الدائمة.'),
('هل تُحسب سنوات الدراسة؟','للأوروبية بالنصف، وللعادية الدائمة كاملة، بشرط أن تكون إقامتك الحالية غير مؤقتة.'),
('أقيم منذ 10 سنوات ودخلي ضعيف، هل لي فرصة؟','نعم للإقامة العادية الدائمة، لأنك معفى من شرط الدخل. ليس للأوروبية.'),
('ما مستوى الاندماج المطلوب؟','A2 على الأقل للإقامة العادية الدائمة، أو إعفاء موثّق بالملحق 7116.'),
('كم الرسوم؟','254 يورو للبالغ و85 يورو دون 18 في 2026.')],
src_note='راجعنا صفحات IND والاستمارة 6009 في 19 أكتوبر 2026. المبالغ سارية حتى 31 ديسمبر 2026. تحقق من صفحة IND لحالتك قبل التقديم.')

NL=dict(title='Permanent verblijf met een reguliere vergunning 2026: EU-langdurig of regulier onbepaalde tijd?',
seo_title='Permanent verblijf met een reguliere vergunning 2026',
crumb='Permanent verblijf: regulier',
desc='Voor partner, gezin, werk of kennismigrant: het verschil tussen EU-langdurig ingezetene en regulier onbepaalde tijd, vrijstellingen van de inkomenseis en formulier 6009.',
summary='<ol><li>Met een <strong>niet-tijdelijk</strong> verblijfsdoel (partner, gezin, werk, kennismigrant, zelfstandige, Chavez…) heb je na <strong>5 jaar</strong> twee routes: <strong>EU-langdurig ingezetene</strong> (type V) of <strong>regulier onbepaalde tijd</strong> (type II).</li><li>Je kiest niet zelf: met formulier <strong>6009</strong> toetst de IND <strong>eerst</strong> EU-langdurig, dan regulier onbepaalde tijd, dan verlenging.</li><li>Belangrijkste verschil: <strong>studiejaren</strong> tellen half voor EU-langdurig en volledig voor regulier; <strong>vrijstellingen van de inkomenseis</strong> (10 jaar verblijf, geboren in NL…) gelden alleen voor regulier.</li><li>Inburgering minimaal <strong>A2</strong> of vrijstelling. Inkomen: <strong>€ 1.635,90</strong> sv-loon per maand (of € 2.337 met partner).</li><li>Tijdelijke doelen (studie, zoekjaar, au pair, seizoenarbeid…) geven <strong>geen recht</strong>.</li></ol>',
body=(
'<h2 id="check">Check je situatie in twee minuten</h2><p>Probeer de <a href="/nl/calculators/permanent-residence-check.html">check permanent verblijf</a>: die bepaalt je vergunning, geeft je contract een score van 5 en toont per route je gereedheid en het juiste formulier.</p>'
'<h2 id="purpose">Tijdelijk of niet-tijdelijk verblijfsdoel?</h2>'
+T([['Verblijf bij partner of gezinslid (meestal), arbeid in loondienst, kennismigrant, arbeid als zelfstandige, Europese blauwe kaart, onderzoek, humanitair niet-tijdelijk, Chavez','Niet-tijdelijk: <strong>je kunt aanvragen</strong>.'],
    ['Studie, zoekjaar hoogopgeleiden, au pair, seizoenarbeid, stagiair/praktikant, overplaatsing binnen een onderneming, uitwisseling, medische behandeling, tijdelijke humanitaire gronden','Tijdelijk: <strong>geen aanvraag mogelijk</strong>. Wijzig eerst je doel (bijv. zoekjaar → kennismigrant).']],
   ['Doel op je pas','Gevolg'])
+'<p>Verblijf bij een gezinslid kan tijdelijk of niet-tijdelijk zijn, afhankelijk van de vergunning van je referent (studeert je partner, dan is jouw verblijf tijdelijk). Wat op je pas staat, is leidend.</p>'
'<h2 id="compare">De twee routes naast elkaar</h2>'
+FIG('permres-regular-route','nl','Infographic: beslisboom voor reguliere vergunninghouders tussen EU-langdurig ingezetene en regulier onbepaalde tijd','Infographic: welk permanent verblijf past bij jou?')
+T([['Duur','5 jaar onafgebroken','5 jaar onafgebroken'],['Studiejaren','Tellen voor de helft','Tellen volledig (volgens formulier 6009)'],['Kinderjaren','—','Jaren vóór je 8e tellen niet; kinderen vanaf 13 jaar'],['Afwezigheid','Max. 6 maanden achter elkaar, 10 maanden totaal','Hoofdverblijf de hele periode in Nederland'],['Op tijd verlengen','Geen verblijfsgat','Altijd op tijd verlengd'],['Inkomen','Altijd, geen vrijstelling','Ja, met vrijstellingen'],['Inburgering','Diploma of vrijstelling','Minimaal <strong>A2</strong> of vrijstelling'],['Rechten','Permanent + makkelijker naar ander EU-land','Permanent in Nederland'],['Leges 2026','€ 254','€ 254']],['Onderdeel','EU-langdurig ingezetene (V)','Regulier onbepaalde tijd (II)'])
+'<h2 id="exempt">Vrijstelling van de inkomenseis (alleen regulier)</h2><p>Voor regulier onbepaalde tijd, als je 18 jaar of ouder bent en:</p><ul><li>je <strong>10 jaar of langer</strong> achter elkaar een vergunning hebt (jaren als Nederlander tellen mee);</li><li>je als minderjarige een vergunning bij je ouders kreeg, hier bleef en niet binnen een jaar zelfstandig ging wonen of trouwde;</li><li>je <strong>in Nederland geboren</strong> bent en hier altijd woonde;</li><li>je <strong>vóór je 3e</strong> naar Nederland kwam en hier altijd woonde.</li></ul><p>Ben je hier geboren of vóór je 3e gekomen, dan kan de IND alleen weigeren om redenen van openbare orde of nationale veiligheid.</p>'
'<h2 id="five">Uitzonderingen op de 5 jaar</h2><ul><li>Belgische of Luxemburgse nationaliteit.</li><li>(Oud-)geprivilegieerden en hun gezinsleden.</li><li>Oud-Nederlanders en wie als kind hier woonde, onder voorwaarden (remigratie).</li></ul><p>Voor houders van een Europese blauwe kaart gelden ruimere regels voor EU-langdurig: 2 jaar in Nederland na 12 maanden blauwe kaart in een ander EU-land.</p>'
'<h2 id="income">Inkomen en contract</h2>'
+T([['Eigen inkomen','€ 1.635,90','€ 1.766,77'],['Met partner (getrouwd of geregistreerd, samenwonend)','€ 2.337,00','€ 2.523,96']],['Situatie (1 juli – 31 december 2026)','Zonder vakantiegeld','Met vakantiegeld'])
+'<p>Een vast contract of tijdelijk contract met nog 12 maanden is genoeg. Korter of flexibel: voldoende inkomen in de laatste 12 maanden of 3 jaar. Alle situaties en documenten in de <a href="/nl/articles/eu-permanent-residence-netherlands.html">gids EU-langdurig ingezetene</a>.</p>'
'<h2 id="form">Formulier 6009 en bijlagen</h2>'
+T([['6009','De aanvraag zelf: online met DigiD (na 5 jaar verblijf) of schriftelijk naar IND, Postbus 9, 9560 AA Ter Apel.'],['7101 Antecedentenverklaring','Verplicht vanaf 12 jaar.'],['7110 Werkgeversverklaring','Eén per werkgever (ook van je partner), niet ouder dan 3 maanden.'],['7112 Verklaring inkomen zelfstandig ondernemer','Alleen voor zelfstandigen, ondertekend door accountant of administrateur met BECON-nummer.'],['7116 Bijlage inburgeringsvereiste','Bewijs van inburgering of vrijstelling, met gewaarmerkte kopieën (behalve het inburgeringsdiploma).'],['7111 Bewijsmiddelen inkomen','Lijst met inkomensbewijzen per situatie. <strong>Niet meesturen</strong>.']],['Document','Wanneer en waarom'])
+'<ul><li><strong>Volgorde van toetsing:</strong> eerst EU-langdurig, dan regulier onbepaalde tijd, dan verlenging. Eén aanvraag is genoeg.</li><li>Heb je al regulier onbepaalde tijd en wil je EU-langdurig? Kies route 503 in deel 2; voldoe je niet, dan volgt afwijzing zonder verdere toets.</li><li>Zorg dat de IND je aanvraag heeft <strong>vóór je vergunning verloopt</strong>; een verblijfsgat schaadt later permanent verblijf en naturalisatie.</li><li>De beslistermijn is meestal tot 6 maanden. Leges krijg je bij afwijzing niet terug.</li></ul>'
'<h2 id="examples">Voorbeelden</h2><p><em>Illustratief, geen echte personen.</em></p>'
+T([['Laila: 6 jaar verblijf bij partner, inburgeringsdiploma, tijdelijk contract nog 14 maanden, € 2.000','Voldoet aan EU-langdurig; de IND verleent EU-langdurig ingezetene.'],['Omar: 5 jaar kennismigrant na 4 jaar studie, inburgeringsdiploma','9 jaar onafgebroken: telt als 7 voor EU-langdurig en 9 voor regulier. Voldoet aan beide.'],['Sara: 11 jaar verblijf, inkomen uit bijstand, inburgeringsdiploma','EU-langdurig: nee (inkomen). Regulier onbepaalde tijd: ja, vrijgesteld van de inkomenseis na 10 jaar.'],['Ahmed: 1 jaar zoekjaar na 4 jaar studie','Tijdelijk doel, geen aanvraag mogelijk. Eerst kennismigrant of arbeid.']],['Situatie','Uitkomst'])
+'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Aanvragen met een tijdelijk doel (studie, zoekjaar).</li><li>Te laat verlengen en een verblijfsgat laten ontstaan.</li><li>Denken dat de 10-jaarsvrijstelling ook voor EU-langdurig geldt.</li><li>Een Werkgeversverklaring ouder dan 3 maanden.</li><li>Bijlage 7101 vergeten voor gezinsleden vanaf 12 jaar.</li></ol><p>Daarna is <a href="/nl/articles/dutch-naturalisation-guide.html">naturalisatie</a> misschien de volgende stap.</p>'),
faq=[('Moet ik kiezen tussen EU-langdurig en regulier?','Nee. Met formulier 6009 toetst de IND eerst EU-langdurig en dan regulier onbepaalde tijd.'),
('Tellen studiejaren mee?','Voor de helft bij EU-langdurig en volledig bij regulier onbepaalde tijd, als je huidige vergunning een niet-tijdelijk doel heeft.'),
('Ik woon hier 10 jaar met een laag inkomen. Kan dat?','Ja voor regulier onbepaalde tijd, want dan geldt vrijstelling van de inkomenseis. Niet voor EU-langdurig.'),
('Welk inburgeringsniveau is nodig?','Minimaal A2 voor regulier onbepaalde tijd, of een onderbouwde vrijstelling met bijlage 7116.'),
('Wat kost het?','€ 254 voor volwassenen en € 85 onder 18 in 2026.')],
src_note='Gecontroleerd op IND-pagina’s en formulier 6009 op 19 oktober 2026. Bedragen gelden tot en met 31 december 2026. Controleer de IND-pagina voor jouw situatie.')
