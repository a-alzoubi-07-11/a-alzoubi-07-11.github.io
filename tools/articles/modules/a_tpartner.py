from a_student_finance import T
SLUG='toeslagpartner-guide'
B='https://www.belastingdienst.nl/wps/wcm/connect/'
SRC=[('Dienst Toeslagen · Toeslagpartner',B+'nl/toeslagen/content/toeslagpartner'),
('Dienst Toeslagen · Toeslagpartners als partner op ander adres woont',B+'nl/toeslagen/content/toeslagpartners-als-partner-op-ander-adres-woont'),
('Dienst Toeslagen · Wij gaan uit elkaar',B+'nl/toeslagen/content/wij-gaan-uit-elkaar'),
('Dienst Toeslagen · Zorgtoeslag met een andere nationaliteit',B+'nl/zorgtoeslag/content/zorgtoeslag-andere-nationaliteit'),
('Dienst Toeslagen · Huurtoeslag als ik geen Nederlander ben',B+'nl/huurtoeslag/content/kan-ik-huurtoeslag-krijgen-als-ik-geen-nederlander-ben'),
('Dienst Toeslagen · In het buitenland wonen',B+'bldcontentnl/belastingdienst/prive/toeslagen/hoe_werken_toeslagen/in_het_buitenland_wonen_of_werken/ik_woon_in_het_buitenland/'),
('Dienst Toeslagen · Wijzigingen doorgeven',B+'bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/wijzigingen_doorgeven')]

AR=dict(title='شريك البدلات (Toeslagpartner) في هولندا 2026: من هو شريكك، الزوج في الخارج أو بلا إقامة، الانفصال، ولماذا يغيّر بدلاتك',
crumb='شريك البدلات',
desc='دليل عميق لمفهوم «شريك البدلات»: الزوج أو الشريك المسجل دائماً شريك، ومتى يصبح المساكن شريكاً (6 حالات)، الأبناء والوالدان ليسوا شركاء منذ 2025، الزوج على عنوان آخر أو في الخارج، الشريك بلا إقامة أو بلا تأمين صحي، الانفصال، ومهلة 4 أسابيع للإبلاغ.',
summary='<ol><li><strong>زوجك أو شريكك المسجل هو دائماً شريك البدلات</strong>، حتى لو كان يسكن على عنوان آخر.</li><li><strong>المساكن غير المتزوج</strong> يصبح شريكاً إن كنتما على العنوان نفسه وتحقق شرط واحد من 6 (منها طفل مشترك، أو عقد مساكنة، أو كنتما شريكين العام الماضي).</li><li><strong>منذ يناير 2025</strong> ابنك أو والدك لم يعد شريك بدلات.</li><li><strong>دخل الشريك يُجمع مع دخلك</strong>؛ لذلك تغيّر الشريك يغيّر البدلات، وقد يسبب استرداداً كبيراً.</li><li><strong>أبلغ عن أي تغيير خلال 4 أسابيع</strong> عبر Mijn toeslagen.</li></ol>',
body=(
'<h2 id="who">من هو شريك البدلات؟</h2>'
+T([['متزوج أو شراكة مسجلة','<strong>دائماً</strong> شريك بدلات.'],
    ['تسكنان معاً (نفس العنوان في BRP) ولديكما عقد مساكنة عند كاتب العدل','شريك'],
    ['تسكنان معاً ولديكما طفل مشترك أو اعترف أحدكما بطفل الآخر','شريك'],
    ['تسكنان معاً وأحدكما شريك في نظام تقاعد الآخر','شريك'],
    ['تسكنان معاً وتملكان بيتاً معاً وتعيشان فيه','شريك'],
    ['تسكنان معاً ولأحدكما طفل تحت 18 مسجل على العنوان','شريك'],
    ['كنتما شريكي بدلات العام الماضي','شريك'],
    ['ابنك أو والدك يسكن معك','<strong>ليس شريكاً منذ يناير 2025</strong> (لكن قد يُحسب دخله كـ«ساكن مشارك» في بدل الإيجار)']],
   ['الحالة','شريك بدلات؟'])
+'<h2 id="why">لماذا يهم؟</h2><ul><li>البدلات (بدل الرعاية، الإيجار، الأطفال، الحضانة) تُحسب على <strong>مجموع</strong> دخلكما وأصولكما.</li><li>شريك بدخل جيد قد يقلل البدل أو يلغيه.</li><li>إن لم تُبلغ عن شريك جديد، قد تُطالَب بإعادة كل البدلات عن الفترة كلها (<a href="/articles/toeslagen-income-update.html">تحديث الدخل</a>).</li></ul>'
'<h2 id="address">الزوج على عنوان آخر داخل هولندا</h2>'
+T([['متزوج/شراكة مسجلة، عنوانان مختلفان','تبقيان شريكين. الشريك يُحسب في بدل الرعاية وبدل الحضانة وميزانية الأطفال، لكن <strong>لا يُحسب في بدل الإيجار</strong> لأنه ليس على عنوانك.'],
    ['غير متزوجين وعنوانان مختلفان','لستما شريكين.']],
   ['الحالة','النتيجة'])
+'<h2 id="abroad">الزوج في الخارج أو بلا إقامة</h2><ul><li><strong>بدل الإيجار:</strong> الشريك غير المسجل على عنوانك لا يُحسب؛ لا يُحسب دخله وأصوله.</li><li><strong>بدل الرعاية:</strong> إن كان الشريك ينتظر قراراً في طلب إقامة، أو في اعتراض أو استئناف على الرفض، يمكنك الاحتفاظ ببدل الرعاية. وإن لم يكن لشريكك تأمين صحي هولندي، تحصل على <strong>نصف</strong> البدل المشترك، ويُحسب دخله.</li><li><strong>غير الأوروبيين</strong> يحتاجون إقامة سارية تعطي حق البدلات.</li><li><strong>زوج يعيش في سوريا أو بلد آخر:</strong> القواعد التفصيلية لكل بدل (خاصة ميزانية الأطفال) لم نستطع تأكيدها من صفحة رسمية مفتوحة. اتصل بـDienst Toeslagen أو اذهب لنقطة خدمة البدلات قبل تعبئة الطلب. (<a href="/articles/asylum-family-reunification.html">لم شمل الزوج</a>)</li></ul>'
'<h2 id="housemate">الساكن المشارك (medebewoner)</h2><p>في بدل الإيجار، شخص بالغ يسكن معك (مثل ابن بالغ أو صديق) قد يُحسب دخله كـ«ساكن مشارك» حتى لو لم يكن شريك بدلات. إن كان الساكن المشارك غير أوروبي بلا إقامة سارية، قد يبقى لك حق إن كان ينتظر قراراً أو يحق له انتظار نتيجة الاستئناف في هولندا (<a href="/articles/housing-rent-allowance-2026.html">بدل الإيجار</a>).</p>'
'<h2 id="split">الانفصال</h2>'
+T([['متزوجان','لم يعد شريكاً من أول الشهر التالي لتغيير العنوان <strong>و</strong>تقديم طلب الطلاق للمحكمة.'],
    ['مساكنان','لم يعد شريكاً من أول الشهر التالي لعدم تسجيلكما على العنوان نفسه.']],
   ['الحالة','متى ينتهي'])
+'<p>أبلغ بسرعة؛ بعد الانفصال قد يحق لك بدل أعلى بدخلك وحدك.</p>'
'<h2 id="report">ماذا تفعل عند أي تغيير؟</h2><ol><li>ادخل Mijn toeslagen أو تطبيق Toeslagen.</li><li>أضف الشريك أو احذفه مع التاريخ الصحيح.</li><li>أدخل تقدير دخله السنوي.</li><li>افعل ذلك <strong>خلال 4 أسابيع</strong> من التغيير.</li><li>احتفظ بالتأكيد.</li></ol>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>تسجيل صديق أو قريب على عنوانك دون فهم أثره على بدل الإيجار.</li><li>الظن أن الزوج على عنوان آخر ليس شريكاً.</li><li>تأخير الإبلاغ بعد الزواج أو ولادة طفل مشترك.</li><li>نسيان أن الشريك العام الماضي يبقى شريكاً هذا العام.</li></ol>'),
faq=[('هل زوجي شريك بدلات حتى لو يسكن في مدينة أخرى؟','نعم، الزوج دائماً شريك؛ لكنه لا يُحسب في بدل الإيجار إن لم يكن على عنوانك.'),
('صديقي يسكن معي، هل هو شريك؟','فقط إن تحقق أحد الشروط (عقد مساكنة، طفل مشترك، بيت مشترك…). وقد يُحسب دخله كساكن مشارك في بدل الإيجار.'),
('ابني البالغ يسكن معي، هل هو شريك؟','لا، منذ يناير 2025 لم يعد الابن أو الوالد شريك بدلات.'),
('زوجي بلا تأمين صحي هولندي، ماذا يحدث لبدل الرعاية؟','تحصل على نصف البدل المشترك، ويُحسب دخله.'),
('متى أبلغ عن التغيير؟','خلال 4 أسابيع عبر Mijn toeslagen.')],
src_note='راجعنا صفحات Dienst Toeslagen في 5 أكتوبر 2026. قواعد الزوج المقيم خارج هولندا معقدة وتختلف بين البدلات؛ اسأل Dienst Toeslagen لحالتك.')

NL=dict(title='Toeslagpartner in 2026: wie je partner is, partner op ander adres, in het buitenland of zonder verblijfsvergunning, uit elkaar gaan en de gevolgen voor je toeslagen',
crumb='Toeslagpartner',
desc='Uitgebreide gids toeslagpartner: echtgenoot en geregistreerd partner altijd, wanneer samenwoners toeslagpartner zijn (6 situaties), kind of ouder niet meer sinds 2025, partner op ander adres of in het buitenland, partner zonder verblijfsvergunning of zorgverzekering, uit elkaar gaan en de meldplicht van 4 weken.',
summary='<ol><li><strong>Echtgenoot of geregistreerd partner is altijd toeslagpartner</strong>, ook op een ander adres.</li><li><strong>Samenwoners</strong> op hetzelfde adres zijn toeslagpartner bij één van 6 situaties (o.a. samen een kind, samenlevingscontract, vorig jaar al toeslagpartners).</li><li><strong>Sinds januari 2025</strong> zijn je kind of ouder geen toeslagpartner meer.</li><li><strong>Het inkomen van je partner telt mee</strong>; een nieuwe partner kan je toeslagen sterk veranderen.</li><li><strong>Wijzigingen binnen 4 weken</strong> doorgeven.</li></ol>',
body=(
'<h2 id="who">Wie is je toeslagpartner?</h2>'
+T([['Gehuwd of geregistreerd partner','<strong>Altijd</strong>'],['Samenwonend + notarieel samenlevingscontract','Ja'],['Samenwonend + samen een kind of erkend kind van de ander','Ja'],['Samenwonend + partner in elkaars pensioenregeling','Ja'],['Samenwonend + samen een koopwoning waar jullie wonen','Ja'],['Samenwonend + kind jonger dan 18 van een van beiden ingeschreven op het adres','Ja'],['Vorig jaar al toeslagpartners','Ja'],['Je kind of ouder woont bij je','<strong>Nee, sinds januari 2025</strong> (wel mogelijk medebewoner voor huurtoeslag)']],['Situatie','Toeslagpartner?'])
+'<h2 id="why">Waarom dit telt</h2><ul><li>Toeslagen worden berekend met <strong>jullie samen</strong> inkomen en vermogen.</li><li>Een partner met inkomen kan je toeslag verlagen of laten vervallen.</li><li>Niet doorgeven kan leiden tot terugbetalen over de hele periode (<a href="/nl/articles/toeslagen-income-update.html">inkomen doorgeven</a>).</li></ul>'
'<h2 id="address">Partner op ander adres in Nederland</h2>'
+T([['Gehuwd/geregistreerd, verschillende adressen','Blijven toeslagpartners. Telt mee voor zorgtoeslag, kinderopvangtoeslag en kindgebonden budget, <strong>niet voor huurtoeslag</strong>.'],['Niet gehuwd, verschillende adressen','Geen toeslagpartners.']],['Situatie','Gevolg'])
+'<h2 id="abroad">Partner in het buitenland of zonder vergunning</h2><ul><li><strong>Huurtoeslag:</strong> een partner die niet op je adres staat, telt niet mee.</li><li><strong>Zorgtoeslag:</strong> wacht je partner op een besluit over een verblijfsvergunning of loopt bezwaar/beroep, dan kun je zorgtoeslag houden. Heeft je partner geen Nederlandse zorgverzekering, dan krijg je de <strong>helft</strong> van de gezamenlijke toeslag; het partnerinkomen telt mee.</li><li><strong>Niet-EU</strong>: een geldige verblijfsvergunning die recht geeft op toeslagen is nodig.</li><li><strong>Partner in Syrië of elders:</strong> de details per toeslag (vooral kindgebonden budget) konden we niet officieel bevestigen; vraag Dienst Toeslagen of een toeslagenservicepunt (<a href="/nl/articles/asylum-family-reunification.html">nareis</a>).</li></ul>'
'<h2 id="housemate">Medebewoner</h2><p>Voor huurtoeslag kan het inkomen van een volwassen medebewoner meetellen, ook als die geen toeslagpartner is. Voor een niet-EU-medebewoner zonder vergunning kun je toch recht hebben als die op een besluit wacht of de uitspraak in Nederland mag afwachten (<a href="/nl/articles/housing-rent-allowance-2026.html">huurtoeslag</a>).</p>'
'<h2 id="split">Uit elkaar</h2>'
+T([['Gehuwd','Geen partner meer vanaf de 1e van de maand na de adreswijziging <strong>én</strong> het indienen van de scheiding bij de rechtbank.'],['Samenwonend','Vanaf de 1e van de maand nadat jullie niet meer op hetzelfde adres staan.']],['Situatie','Einde partnerschap'])
+'<h2 id="report">Wijziging doorgeven</h2><ol><li>Mijn toeslagen of app Toeslagen.</li><li>Partner toevoegen of verwijderen met juiste datum.</li><li>Jaarinkomen van de partner invullen.</li><li><strong>Binnen 4 weken</strong>.</li><li>Bevestiging bewaren.</li></ol>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Iemand op je adres inschrijven zonder het effect op huurtoeslag te kennen.</li><li>Denken dat een echtgenoot op een ander adres geen partner is.</li><li>Huwelijk of geboorte van een gezamenlijk kind te laat doorgeven.</li><li>Vergeten dat je vorig-jaar-partner dit jaar partner blijft.</li></ol>'),
faq=[('Is mijn echtgenoot toeslagpartner als hij elders woont?','Ja, maar hij telt niet mee voor huurtoeslag als hij niet op jouw adres staat.'),
('Mijn vriend woont bij mij. Is hij toeslagpartner?','Alleen bij een van de situaties (samenlevingscontract, kind, koopwoning…); mogelijk wel medebewoner voor huurtoeslag.'),
('Is mijn volwassen kind toeslagpartner?','Nee, sinds januari 2025 niet meer.'),
('Mijn partner heeft geen Nederlandse zorgverzekering.','Je krijgt de helft van de gezamenlijke zorgtoeslag; het inkomen van je partner telt mee.'),
('Wanneer geef ik het door?','Binnen 4 weken via Mijn toeslagen.')],
src_note='Gecontroleerd op pagina’s van Dienst Toeslagen op 5 oktober 2026. Regels voor een partner in het buitenland verschillen per toeslag; vraag Dienst Toeslagen naar jouw situatie.')
