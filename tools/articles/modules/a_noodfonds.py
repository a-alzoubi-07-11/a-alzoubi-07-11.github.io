from a_student_finance import T
SLUG='energy-emergency-fund-2027'
SRC=[('Rijksoverheid · Noodfonds Energie gaat open (29-09-2026)','https://www.rijksoverheid.nl/actueel/nieuws/2026/09/29/noodfonds-energie-gaat-open'),
('Rijksoverheid · Hoe krijg ik geld terug uit het Noodfonds Energie?','https://www.rijksoverheid.nl/vraag-en-antwoord/koopkracht/hoe-krijg-ik-geld-terug-uit-het-noodfonds-energie'),
('Noodfonds Energie · officiële website','https://www.noodfondsenergie.nl/')]
AR=dict(title='صندوق الطوارئ للطاقة (Noodfonds Energie) 2027: من يستحق، كيف تُحسب المساعدة، مواعيد التقديم — مع أمثلة محسوبة',
seo_title='صندوق الطاقة Noodfonds Energie 2027',
crumb='صندوق الطوارئ للطاقة',
desc='صندوق الطوارئ للطاقة Noodfonds Energie 2027: التقديم من 4 يناير حتى 7 مايو 2027، والمساعدة نصف الزيادة فوق 8% أو 10% من دخلك، بين 120 و1,800 يورو.',
summary='<ol><li>التقديم من <strong>4 يناير حتى 7 مايو 2027</strong> عبر noodfondsenergie.nl (التحضير والتواصل من 1 ديسمبر 2026).</li><li>تستحق إن كان دخلك الإجمالي حتى <strong>130%</strong> من الحد الأدنى الاجتماعي وتكاليف الطاقة ≥ <strong>8%</strong> من دخلك، أو بين <strong>130% و200%</strong> وتكاليفها ≥ <strong>10%</strong>.</li><li>المساعدة = <strong>نصف</strong> ما يزيد عن حد 8% أو 10%، بين <strong>120 و1,800 يورو</strong>، تُدفع غالباً عبر مزود الطاقة على 12 شهراً.</li><li>ليس بنظام «من يسبق»؛ متوقع نحو 500,000 أسرة.</li></ol>',
body=(
'<h2 id="what">ما هو صندوق الطوارئ للطاقة؟</h2><p>صندوق تموّله الحكومة مع شركات الطاقة لمساعدة الأسر ذات الدخل المنخفض أو المتوسط-المنخفض التي تدفع جزءاً كبيراً من دخلها على الكهرباء والغاز أو التدفئة. يُفتح للفترة 2027 وفق إعلان Rijksoverheid في 29 سبتمبر 2026. يشمل أيضاً من لديه تدفئة مركزية للمبنى (blokverwarming)، شبكة تدفئة (warmtenet)، البروبان، والطلاب.</p>'
'<h2 id="dates">المواعيد المهمة</h2>'
+T([['من 1 ديسمبر 2026','التحضير: جمع الأوراق والتواصل مع الصندوق'],['4 يناير 2027','بدء التقديم'],['7 مايو 2027','آخر يوم للتقديم'],['بعد نحو 4–6 أسابيع من القبول','بدء الدفع']],['التاريخ','ماذا يحدث'])
+'<h2 id="conditions">الشروط</h2>'
+T([['دخل إجمالي حتى 130% من الحد الأدنى الاجتماعي','تكاليف الطاقة 8% أو أكثر من الدخل'],['دخل بين 130% و200%','تكاليف الطاقة 10% أو أكثر من الدخل']],['فئة الدخل','شرط تكاليف الطاقة'])
+'<p>الأرقام التقريبية في أسئلة الحكومة الشهرية (غير نهائية — تأكد في موقع الصندوق): الفئة الأولى حتى نحو <strong>1,720 يورو</strong> شهرياً لشخص وحيد و<strong>2,400</strong> لزوجين؛ الفئة الثانية نحو <strong>2,230–3,430</strong> لشخص وحيد و<strong>3,120–4,800</strong> لزوجين. الحدود الدقيقة يحددها الصندوق.</p>'
'<h2 id="calc">كيف تُحسب المساعدة؟</h2><ol><li>احسب دخلك الإجمالي السنوي للأسرة.</li><li>اضربه في 8% (أو 10% للفئة الثانية) = «الحد».</li><li>اطرح الحد من تكاليف الطاقة السنوية = الزيادة.</li><li>المساعدة = نصف الزيادة، بحد أدنى 120 وأقصى 1,800 يورو.</li></ol>'
'<h2 id="examples">أمثلة محسوبة (توضيحية)</h2>'
+T([['نادية، وحيدة، دخل 1,600 يورو/شهر (19,200/سنة)، طاقة 200/شهر (2,400/سنة)','الحد 8% = 1,536؛ الزيادة 864؛ المساعدة ≈ <strong>432 يورو</strong> سنوياً (≈36/شهر)'],
['سمير وهبة، زوجان، دخل 3,000/شهر (36,000) في الفئة الثانية، طاقة 350/شهر (4,200)','الحد 10% = 3,600؛ الزيادة 600؛ المساعدة ≈ <strong>300 يورو</strong>'],
['جمال، وحيد، دخل 20,000/سنة، بيت قديم معزول بشكل سيئ، طاقة 6,500/سنة','الحد 1,600؛ الزيادة 4,900؛ النصف 2,450 ← يُقيَّد بالحد الأقصى <strong>1,800 يورو</strong>'],
['ليلى، دخلها فوق 200% من الحد الأدنى','<strong>لا تستحق</strong> مهما كانت تكاليف الطاقة']],['الحالة','النتيجة'])
+'<p>الأسماء والأرقام أمثلة توضيحية مبنية على القواعد المعلنة، وليست حالات أشخاص حقيقيين. الحساب الرسمي يتم في أداة الصندوق.</p>'
'<h2 id="how">خطوات التقديم</h2><ol><li>اجمع: آخر كشوف الدخل لكل أفراد الأسرة، فاتورة الطاقة السنوية أو مبلغ الدفعة الشهرية، رقم العميل لدى المزود.</li><li>قدّم رقمياً عبر <strong>noodfondsenergie.nl</strong> (عادة بـ<a href="/articles/digid-registration-guide.html">DigiD</a>)، أو اطلب نموذجاً ورقياً من مركز خدمة الصندوق.</li><li>تحصل على قرار؛ الدفع غالباً عبر مزود الطاقة كخصم على الدفعات لمدة 12 شهراً.</li><li>مع blokverwarming قد يُدفع بطريقة مختلفة (عبر المؤجر أو مباشرة) — اتبع تعليمات الصندوق.</li></ol>'
'<h2 id="combine">ادمجه مع دعم آخر</h2><ul><li><a href="/articles/energy-contracts-saving-2026.html">وفّر في عقد الطاقة</a> أولاً.</li><li>دخل منخفض؟ <a href="/articles/special-assistance-bijzondere-bijstand.html">المساعدة الخاصة</a> و<a href="/articles/municipal-taxes-exemption-kwijtschelding.html">الإعفاء من ضرائب البلدية</a>.</li><li>ديون طاقة؟ <a href="/articles/debt-help-schuldhulp.html">مساعدة الديون</a> من البلدية فوراً.</li></ul>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>انتظار آخر يوم — ليس بنظام من يسبق، لكن التأخر بعد 7 مايو يعني لا شيء.</li><li>إدخال الدخل الصافي بدل الإجمالي.</li><li>نسيان دخل أحد أفراد الأسرة.</li><li>الاعتقاد بأن المستأجر مع تدفئة مركزية مستثنى — هو مشمول.</li></ol>'),
faq=[('متى أقدّم على Noodfonds Energie 2027؟','من 4 يناير حتى 7 مايو 2027؛ التحضير من 1 ديسمبر 2026.'),
('كم المبلغ؟','نصف ما تزيد به تكاليف الطاقة عن 8% أو 10% من دخلك، بين 120 و1,800 يورو.'),
('هل هو أول من يقدّم يأخذ؟','لا، كل من يستوفي الشروط ويقدّم في الموعد يُدرس طلبه.'),
('هل الطلاب مشمولون؟','نعم، حسب الإعلان الرسمي الطلاب مشمولون إن استوفوا الشروط.'),
('عندي تدفئة مركزية للمبنى، هل أستحق؟','نعم، blokverwarming وwarmtenet والبروبان مشمولة.'),
('كيف يُدفع؟','غالباً عبر مزود الطاقة على 12 شهراً، بعد نحو 4–6 أسابيع من القبول.')],
src_note='راجعنا Rijksoverheid وموقع الصندوق في 5 أكتوبر 2026. حدود الدخل الشهرية تقريبية وقد تتغير؛ الأمثلة توضيحية.')
NL=dict(title='Noodfonds Energie 2027: wie komt in aanmerking, hoe wordt de steun berekend, aanvraagperiode — met rekenvoorbeelden',
seo_title='Noodfonds Energie 2027: voorwaarden en aanvragen',
crumb='Noodfonds Energie',
desc='Noodfonds Energie 2027: aanvragen van 4 januari t/m 7 mei 2027. Steun: de helft van je energiekosten boven 8% of 10% van je inkomen, € 120 tot € 1.800.',
summary='<ol><li>Aanvragen van <strong>4 januari t/m 7 mei 2027</strong> via noodfondsenergie.nl (voorbereiden vanaf 1 december 2026).</li><li>Recht bij bruto-inkomen tot <strong>130%</strong> van het sociaal minimum en energiekosten ≥ <strong>8%</strong>, of <strong>130–200%</strong> en ≥ <strong>10%</strong>.</li><li>Steun = <strong>de helft</strong> boven de 8%/10%-grens, tussen <strong>€ 120 en € 1.800</strong>, meestal via de energieleverancier over 12 maanden.</li><li>Geen «wie het eerst komt»; ca. 500.000 huishoudens verwacht.</li></ol>',
body=(
'<h2 id="what">Wat is het Noodfonds Energie?</h2><p>Een fonds van overheid en energiebedrijven voor huishoudens met een laag of lager middeninkomen die een groot deel van hun inkomen aan energie kwijt zijn. Opent voor 2027 volgens Rijksoverheid (29 september 2026). Ook voor blokverwarming, warmtenet, propaan en studenten.</p>'
'<h2 id="dates">Belangrijke data</h2>'
+T([['Vanaf 1 december 2026','Voorbereiden en contact'],['4 januari 2027','Start aanvragen'],['7 mei 2027','Laatste dag'],['Ca. 4–6 weken na toekenning','Eerste betaling']],['Datum','Wat'])
+'<h2 id="conditions">Voorwaarden</h2>'
+T([['Bruto-inkomen tot 130% sociaal minimum','Energiekosten 8% of meer van inkomen'],['Inkomen 130–200%','Energiekosten 10% of meer']],['Inkomensgroep','Energiekostenvoorwaarde'])
+'<p>Indicatieve maandbedragen uit de Rijksoverheid-Q&amp;A (niet definitief, check de website van het fonds): groep 1 tot ca. <strong>€ 1.720</strong> alleenstaand en <strong>€ 2.400</strong> samen; groep 2 ca. <strong>€ 2.230–3.430</strong> alleenstaand en <strong>€ 3.120–4.800</strong> samen.</p>'
'<h2 id="calc">Berekening</h2><ol><li>Bruto jaarinkomen huishouden.</li><li>× 8% (of 10%) = grens.</li><li>Energiekosten per jaar − grens = meerdere.</li><li>Steun = helft daarvan, min. € 120, max. € 1.800.</li></ol>'
'<h2 id="examples">Rekenvoorbeelden (illustratief)</h2>'
+T([['Nadia, alleenstaand, € 1.600/mnd (€ 19.200/jr), energie € 2.400/jr','Grens 8% = € 1.536; meerdere € 864; steun ≈ <strong>€ 432</strong>'],
['Samir en Hiba, samen € 36.000/jr (groep 2), energie € 4.200','Grens 10% = € 3.600; meerdere € 600; steun ≈ <strong>€ 300</strong>'],
['Jamal, alleenstaand, € 20.000/jr, slecht geïsoleerd huis, energie € 6.500','Grens € 1.600; meerdere € 4.900; helft € 2.450 → maximum <strong>€ 1.800</strong>'],
['Leila, inkomen boven 200%','<strong>Geen recht</strong>']],['Situatie','Uitkomst'])
+'<p>Namen en bedragen zijn illustratieve voorbeelden op basis van de aangekondigde regels, geen echte personen. De officiële berekening gebeurt in de tool van het fonds.</p>'
'<h2 id="how">Aanvragen</h2><ol><li>Verzamel loonstroken/uitkeringsspecificaties van alle gezinsleden, jaarafrekening of termijnbedrag, klantnummer energieleverancier.</li><li>Vraag digitaal aan op <strong>noodfondsenergie.nl</strong> (meestal met <a href="/nl/articles/digid-registration-guide.html">DigiD</a>) of vraag een papieren formulier aan bij het klantcontactcentrum.</li><li>Uitbetaling meestal via de leverancier, verrekend over 12 maanden.</li><li>Bij blokverwarming kan de route anders zijn; volg de instructies van het fonds.</li></ol>'
'<h2 id="combine">Combineer met andere steun</h2><ul><li><a href="/nl/articles/energy-contracts-saving-2026.html">Bespaar op je energiecontract</a>.</li><li><a href="/nl/articles/special-assistance-bijzondere-bijstand.html">Bijzondere bijstand</a> en <a href="/nl/articles/municipal-taxes-exemption-kwijtschelding.html">kwijtschelding</a>.</li><li>Energieschuld? <a href="/nl/articles/debt-help-schuldhulp.html">Schuldhulp</a>.</li></ul>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Na 7 mei aanvragen.</li><li>Netto in plaats van bruto invullen.</li><li>Inkomen van een gezinslid vergeten.</li><li>Denken dat blokverwarming is uitgesloten.</li></ol>'),
faq=[('Wanneer kan ik aanvragen?','Van 4 januari t/m 7 mei 2027; voorbereiden vanaf 1 december 2026.'),
('Hoeveel steun?','De helft van wat je energiekosten boven 8% of 10% van je inkomen uitkomen, tussen € 120 en € 1.800.'),
('Is het wie het eerst komt?','Nee.'),
('Kunnen studenten aanvragen?','Ja, als ze aan de voorwaarden voldoen.'),
('Blokverwarming?','Ja, ook blokverwarming, warmtenet en propaan.'),
('Hoe wordt uitbetaald?','Meestal via de energieleverancier over 12 maanden, na ca. 4–6 weken.')],
src_note='Gecontroleerd bij Rijksoverheid en het Noodfonds op 5 oktober 2026. Maandgrenzen indicatief; voorbeelden illustratief.')
