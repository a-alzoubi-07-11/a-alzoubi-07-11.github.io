from a_student_finance import T
SLUG='diploma-evaluation-sbb'
SRC=[('IDW · Diplomawaardering voor studeren','https://www.idw.nl/studeren/'),
('IDW · Diplomawaardering voor inburgering','https://idw.nl/inburgering/'),
('IDW · Verplichte documenten','https://www.idw.nl/verplichte-documenten/'),
('Nuffic · Diplomawaardering','https://www.nuffic.nl/onderwerpen/diploma/diplomawaardering'),
('Nuffic · Credential evaluation for refugees','https://www.nuffic.nl/en/studeren-en-werken-in-nederland/diplomawaardering/credential-evaluation-for-refugees'),
('BIG-register · Nederlandse taalvaardigheid (buitenlands diploma)','https://www.bigregister.nl/buitenlands-diploma/procedures/verklaring-vakbekwaamheid/nederlandse-taalvaardigheid')]

AR=dict(title='معادلة الشهادة الأجنبية في هولندا 2026 (IDW: Nuffic وSBB): مجانية للاجئين، السعر 148.83 يورو لغيرهم، المدة، «مؤشر المستوى» لمن فقد وثائقه، والمهن المسجلة',
crumb='معادلة الشهادة',
desc='دليل عميق لمعادلة الشهادات: ماذا تعني المعادلة وما لا تعنيه، Nuffic للجامعي والعالي وSBB للمهني عبر بوابة IDW، المعادلة المجانية للاجئين ولمن يندمج، السعر 148.83 يورو للآخرين، المدة (6 أسابيع للاجئين، 10 أسابيع عادة)، «مؤشر مستوى التعليم» دون وثائق، والطريق المنفصل للمهن الصحية (BIG).',
summary='<ol><li><strong>المعادلة</strong> تقارن شهادتك بشهادة هولندية (مثلاً «تعادل HBO بكالوريوس»). <strong>لا تضمن قبولاً</strong> في الدراسة ولا حق ممارسة مهنة مسجلة.</li><li>تقدّم عبر <strong>IDW</strong>: <strong>SBB</strong> للشهادات المهنية (MBO)، و<strong>Nuffic</strong> للعليا والجامعية.</li><li><strong>مجانية للاجئين</strong> (إقامة لجوء + رسالة DUO للاندماج)، ولمن بدأ الاندماج منذ 2015 لأغراض الاندماج أو الجنسية أو الإقامة الدائمة؛ لم تعد مجانية بعد حصولك على شهادة الاندماج.</li><li><strong>لغير ذلك:</strong> 148.83 يورو للدراسة، صالحة 3 سنوات في حسابك.</li><li><strong>فقدت وثائقك؟</strong> اطلب «مؤشر مستوى التعليم» (Indicatie Onderwijsniveau).</li></ol>',
body=(
'<h2 id="what">ما هي المعادلة وما فائدتها؟</h2><ul><li>تقرير يقارن شهادتك بالنظام الهولندي (وفق اتفاقية لشبونة للاعتراف).</li><li>تفيد في: التقديم للعمل (صاحب العمل يفهم مستواك)، التسجيل في MBO أو HBO أو الجامعة، الاندماج، وأحياناً تقليل مدة الدراسة.</li><li><strong>ليست ملزمة قانونياً</strong>: المدرسة أو الجامعة تقرر القبول، والمهن المسجلة لها طريق آخر.</li></ul>'
'<h2 id="who">من يقيّم ماذا؟</h2>'
+T([['SBB','الشهادات المهنية والثانوية المهنية (مستوى MBO)'],['Nuffic','الشهادات العليا والجامعية (HBO وWO) والثانوية العامة'],['IDW','البوابة المشتركة لتقديم الطلب لكليهما']],['الجهة','تختص بـ'])
+'<h2 id="free">من يحصل عليها مجاناً؟</h2>'
+T([['لاجئ بإقامة لجوء','مجاناً، بشرط إقامة اللجوء من IND ورسالة DUO عن واجب الاندماج. المدة عادة 6 أسابيع على الأقل.'],
    ['من بدأ الاندماج منذ 1 يناير 2015','مجاناً لأغراض الاندماج أو الجنسية أو طلب الإقامة الدائمة (برسالة DUO).'],
    ['بعد حصولك على شهادة الاندماج','لم تعد مجانية.'],
    ['غير ذلك (للدراسة)','148.83 يورو، صالحة 3 سنوات في حسابك.']],
   ['الحالة','التكلفة'])
+'<p>المدة لغير اللاجئين عادة <strong>10 أسابيع عمل على الأقل</strong> بعد اكتمال الطلب. فحص الوثائق نفسه يستغرق نحو 5 أيام عمل. وفي IDW فيديوهات شرح بعدة لغات منها <strong>العربية</strong>.</p>'
'<h2 id="steps">الطلب خطوة بخطوة</h2><ol><li>أنشئ حساباً في <strong>Mijn IDW</strong>.</li><li>اختر الغرض: الاندماج أم الدراسة أم العمل.</li><li>ارفع صور الشهادات و<strong>كشوف الدرجات</strong> (قائمة المواد والدرجات) لكل شهادة؛ القائمة الإلزامية على صفحة IDW للوثائق.</li><li>للاجئين: ارفع بطاقة إقامة اللجوء ورسالة DUO.</li><li>ادفع إن لم تكن معفى.</li><li>انتظر النتيجة في حسابك واحفظها PDF.</li></ol>'
'<h2 id="no-docs">لا توجد لديك وثائق؟</h2><p>للاجئين الذين لا يستطيعون الحصول على وثائق من بلدهم: <strong>«مؤشر مستوى التعليم» (Indicatie Onderwijsniveau)</strong>، وهو تقدير مبني على إجاباتك عن دراستك، وليس معادلة رسمية. ولمن لم يكمل دراسته: يمكن تقييم سنة دراسية مكتملة واحدة على الأقل.</p>'
'<h2 id="regulated">المهن المسجلة (الطب والتمريض وغيرها)</h2><p>المعادلة <strong>لا تكفي</strong> لممارسة مهنة مسجلة. في الرعاية الصحية تحتاج <strong>تسجيل BIG</strong> مع شهادة هولندية: <strong>B1</strong> لمهن MBO (ممرض، Verzorgende IG)، <strong>B2</strong> لـHBO (معالج فيزيائي، قابلة)، <strong>B2+</strong> للجامعي (طبيب، طبيب أسنان، صيدلي)، عبر امتحان الدولة NT2، مع إثبات إنجليزية (إلا Verzorgende IG). الشهادة يجب ألا يتجاوز عمرها سنتين وأن تشمل الأجزاء الأربعة (<a href="/articles/nt2-b1-exam-guide.html">NT2</a>).</p>'
'<h2 id="use">كيف تستخدم نتيجة المعادلة؟</h2><ul><li><strong>للعمل:</strong> أرفقها مع سيرتك الذاتية واذكر «مستوى مكافئ لـ…» (<a href="/articles/trending-jobs-2026.html">المهن المطلوبة</a>).</li><li><strong>للدراسة:</strong> أرسلها للمدرسة أو الجامعة مع طلب القبول (<a href="/articles/mbo-dutch-language-options.html">اللغة وMBO</a>، <a href="/articles/mbo-hbo-wo-comparison.html">MBO وHBO وWO</a>).</li><li><strong>للاندماج:</strong> قد تساعد في تحديد مسارك في خطة PIP (<a href="/articles/inburgering-integration-law-2026.html">الاندماج</a>).</li></ul>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>تأجيل المعادلة رغم أنها مجانية للاجئين قبل شهادة الاندماج.</li><li>إرسال الشهادة دون كشف الدرجات.</li><li>الظن أن المعادلة تمنحك حق ممارسة الطب أو التمريض.</li><li>دفع مكاتب خاصة لخدمة تقدمها IDW مجاناً.</li></ol>'),
faq=[('هل المعادلة مجانية للاجئين؟','نعم، بإقامة لجوء ورسالة DUO للاندماج، وقبل حصولك على شهادة الاندماج.'),
('كم تكلف لغير اللاجئين؟','148.83 يورو للدراسة، صالحة 3 سنوات في حسابك.'),
('كم تستغرق؟','للاجئين عادة 6 أسابيع على الأقل؛ لغيرهم نحو 10 أسابيع عمل على الأقل.'),
('فقدت شهاداتي، ماذا أفعل؟','اطلب «مؤشر مستوى التعليم» عبر IDW.'),
('هل تكفي المعادلة للعمل كطبيب أو ممرض؟','لا، تحتاج تسجيل BIG مع مستوى لغة B1 أو B2 أو B2+ حسب المهنة.')],
src_note='راجعنا IDW وNuffic وسجل BIG في 5 أكتوبر 2026. أسعار التقييم لأغراض العمل قد تختلف عن الدراسة؛ تحقق في IDW.')

NL=dict(title='Buitenlands diploma laten waarderen in 2026 (IDW: Nuffic en SBB): gratis voor vluchtelingen, € 148,83 voor anderen, doorlooptijd, Indicatie Onderwijsniveau en gereglementeerde beroepen',
crumb='Diplomawaardering',
desc='Uitgebreide gids diplomawaardering: wat een waardering wel en niet doet, SBB voor mbo en Nuffic voor hbo/wo via IDW, gratis voor vluchtelingen en inburgeraars, € 148,83 voor anderen, doorlooptijd (6 weken voor vluchtelingen, meestal 10 weken), Indicatie Onderwijsniveau zonder documenten en de aparte route voor BIG-beroepen.',
summary='<ol><li>Een <strong>diplomawaardering</strong> vergelijkt je diploma met een Nederlands diploma; <strong>geen recht op toelating</strong> of op een gereglementeerd beroep.</li><li>Aanvragen via <strong>IDW</strong>: <strong>SBB</strong> (mbo) en <strong>Nuffic</strong> (hbo/wo).</li><li><strong>Gratis voor vluchtelingen</strong> (asielvergunning + DUO-brief) en voor inburgeraars sinds 2015; niet meer na het inburgeringsdiploma.</li><li><strong>Anders:</strong> € 148,83 voor studeren, 3 jaar geldig in je account.</li><li><strong>Geen documenten?</strong> Vraag een Indicatie Onderwijsniveau.</li></ol>',
body=(
'<h2 id="what">Wat is een diplomawaardering?</h2><ul><li>Een rapport dat je diploma vergelijkt met het Nederlandse systeem (Lisbon Recognition Convention).</li><li>Handig bij solliciteren, aanmelden voor mbo/hbo/wo, inburgering en soms vrijstellingen.</li><li><strong>Niet juridisch bindend</strong>: de school beslist over toelating; gereglementeerde beroepen hebben een eigen route.</li></ul>'
'<h2 id="who">Wie beoordeelt wat?</h2>'
+T([['SBB','Beroepsgerichte diploma’s (mbo-niveau)'],['Nuffic','Hoger onderwijs (hbo/wo) en voortgezet onderwijs'],['IDW','Gezamenlijk aanvraagloket']],['Organisatie','Voor'])
+'<h2 id="free">Wie betaalt niets?</h2>'
+T([['Vluchteling met asielvergunning','Gratis met asielvergunning en DUO-brief inburgeringsplicht; meestal minimaal 6 weken.'],['Inburgeraar sinds 1 januari 2015','Gratis voor inburgering, naturalisatie of permanente verblijfsvergunning.'],['Na het inburgeringsdiploma','Niet meer gratis.'],['Overig (studeren)','€ 148,83; 3 jaar geldig in je account.']],['Situatie','Kosten'])
+'<p>Doorlooptijd voor anderen meestal <strong>minimaal 10 werkweken</strong> na een volledige aanvraag; documentcontrole circa 5 werkdagen. IDW heeft instructievideo’s in o.a. het <strong>Arabisch</strong>.</p>'
'<h2 id="steps">Aanvragen in stappen</h2><ol><li>Account aanmaken in <strong>Mijn IDW</strong>.</li><li>Doel kiezen: inburgering, studeren of werken.</li><li>Diploma’s en <strong>cijferlijsten</strong> uploaden (zie de lijst verplichte documenten).</li><li>Vluchtelingen: asielvergunning en DUO-brief uploaden.</li><li>Betalen als je niet bent vrijgesteld.</li><li>Uitslag in je account; bewaar de pdf.</li></ol>'
'<h2 id="no-docs">Geen documenten?</h2><p>Vluchtelingen zonder documenten kunnen een <strong>Indicatie Onderwijsniveau</strong> krijgen: een inschatting op basis van je antwoorden, geen formele waardering. Bij een onafgemaakte opleiding kan minimaal 1 afgerond jaar worden beoordeeld.</p>'
'<h2 id="regulated">Gereglementeerde beroepen</h2><p>Voor zorgberoepen heb je <strong>BIG-registratie</strong> nodig met Nederlands <strong>B1</strong> (mbo, bijv. verpleegkundige, verzorgende IG), <strong>B2</strong> (hbo, bijv. fysiotherapeut, verloskundige) of <strong>B2+</strong> (wo, bijv. arts, tandarts, apotheker) via het staatsexamen Nt2, plus Engels (niet voor verzorgende IG). Certificaat maximaal 2 jaar oud en alle vier onderdelen (<a href="/nl/articles/nt2-b1-exam-guide.html">Nt2</a>).</p>'
'<h2 id="use">De waardering gebruiken</h2><ul><li><strong>Werk:</strong> voeg toe aan je cv (<a href="/nl/articles/trending-jobs-2026.html">kansrijke beroepen</a>).</li><li><strong>Studie:</strong> stuur mee met je aanmelding (<a href="/nl/articles/mbo-dutch-language-options.html">taal en mbo</a>, <a href="/nl/articles/mbo-hbo-wo-comparison.html">mbo, hbo, wo</a>).</li><li><strong>Inburgering:</strong> helpt bij je PIP (<a href="/nl/articles/inburgering-integration-law-2026.html">inburgeren</a>).</li></ul>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Wachten terwijl het voor vluchtelingen gratis is.</li><li>Geen cijferlijst meesturen.</li><li>Denken dat een waardering een beroepsbevoegdheid geeft.</li><li>Betalen aan bureaus voor wat IDW gratis doet.</li></ol>'),
faq=[('Is diplomawaardering gratis voor vluchtelingen?','Ja, met asielvergunning en DUO-brief, zolang je nog geen inburgeringsdiploma hebt.'),
('Wat kost het voor anderen?','€ 148,83 voor studeren, 3 jaar geldig.'),
('Hoe lang duurt het?','Voor vluchtelingen meestal minimaal 6 weken; anders minimaal 10 werkweken.'),
('Ik heb geen diploma’s meer.','Vraag een Indicatie Onderwijsniveau via IDW aan.'),
('Mag ik met een waardering als arts of verpleegkundige werken?','Nee, daarvoor is BIG-registratie met B1, B2 of B2+ nodig.')],
src_note='Gecontroleerd bij IDW, Nuffic en het BIG-register op 5 oktober 2026. Tarieven voor werken kunnen afwijken van die voor studeren; check IDW.')
