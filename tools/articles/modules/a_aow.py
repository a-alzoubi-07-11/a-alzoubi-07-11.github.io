from a_student_finance import T
SLUG='aow-aio-pension'
SRC=[('Rijksoverheid · AOW-leeftijd','https://www.rijksoverheid.nl/onderwerpen/algemene-ouderdomswet-aow/aow-leeftijd'),
('Rijksoverheid · Hoe hoog is mijn AOW?','https://www.rijksoverheid.nl/vraag-en-antwoord/algemene-ouderdomswet-aow/hoe-hoog-is-mijn-aow'),
('SVB · Uw AOW-leeftijd','https://www.svb.nl/nl/aow/aow-leeftijd/uw-aow-leeftijd'),
('SVB · AOW-bedragen','https://www.svb.nl/nl/aow/bedragen-aow/aow-bedragen'),
('SVB · Kijk of u een AIO-aanvulling krijgt','https://www.svb.nl/nl/aio/kijk-of-u-een-aio-aanvulling-krijgt'),
('Rijksoverheid · Hoe hoog is mijn bijstandsuitkering? (normen vanaf AOW-leeftijd)','https://www.rijksoverheid.nl/vraag-en-antwoord/bijstand/hoe-hoog-is-mijn-bijstandsuitkering')]

AR=dict(title='التقاعد الحكومي AOW والتكملة AIO للمهاجرين 2026: سن التقاعد، لماذا تكون AOW ناقصة (2% عن كل سنة)، وكيف ترفع AIO دخلك إلى الحد الاجتماعي',
crumb='AOW وAIO',
seo_title='التقاعد AOW وتكملة AIO للمهاجرين 2026',
desc='سن التقاعد AOW هو 67 سنة في 2026، وتُبنى AOW بنسبة 2% عن كل سنة في هولندا. اعرف لماذا تكون ناقصة وكيف ترفع تكملة AIO من SVB دخلك.',
summary='<ol><li><strong>سن التقاعد (AOW):</strong> 67 سنة في 2026 و2027، و<strong>67 سنة و3 أشهر في 2028</strong>. احسب تاريخك الشخصي بأداة SVB.</li><li><strong>AOW تُبنى بنسبة 2% عن كل سنة</strong> سكنت أو عملت فيها في هولندا قبل سن التقاعد. من وصل لهولندا متأخراً يحصل على AOW <strong>ناقصة</strong>.</li><li>AOW الكاملة: 70% من صافي الحد الأدنى للأجر للشخص الوحيد، و50% لكل شخص من الزوجين.</li><li><strong>التكملة AIO</strong> من SVB ترفع دخلك حتى الحد الاجتماعي إن كانت AOW ناقصة ودخلك ومالك قليلين وتسكن في هولندا.</li><li>حدود المساعدة لمن بلغ سن التقاعد (1 يوليو 2026): <strong>1,587.34</strong> يورو للشخص الوحيد، <strong>2,176.10</strong> للزوجين شهرياً.</li></ol>',
body=(
'<h2 id="age">سن التقاعد</h2>'
+T([['2026','67 سنة'],['2027','67 سنة'],['2028','67 سنة و3 أشهر']],['السنة','سن AOW'])
+'<p>يُحدَّد السن قبل 5 سنوات حسب متوسط العمر المتوقع. أعلنت الحكومة في Prinsjesdag 2026 إلغاء الربط الكامل (واحد مقابل واحد) بين سن التقاعد ومتوسط العمر (<a href="/articles/prinsjesdag-2026-changes.html">التفاصيل</a>). تاريخك الدقيق في أداة SVB.</p>'
'<h2 id="build">كيف تُبنى AOW ولماذا هي ناقصة عند المهاجرين؟</h2><ul><li>تبني <strong>2% من AOW الكاملة</strong> عن كل سنة سكنت فيها في هولندا (أو عملت فيها وأنت مؤمّن) في الفترة المحددة قبل سن التقاعد.</li><li>كل سنة لم تكن فيها في هولندا تعني <strong>2% أقل</strong>.</li><li><strong>مثال:</strong> من وصل إلى هولندا قبل 20 سنة من سن التقاعد يحصل تقريباً على 40% من AOW الكاملة (20 سنة × 2%).</li><li>لذلك يحتاج كثير من المهاجرين كبار السن إلى <strong>AIO</strong>.</li></ul>'
'<h2 id="amount">كم AOW؟</h2><ul><li>AOW الكاملة تتبع الحد الأدنى للأجر وتُعدَّل كل نصف سنة.</li><li><strong>شخص وحيد:</strong> 70% من صافي الحد الأدنى للأجر.</li><li><strong>الزوجان أو الساكنان معاً:</strong> 50% لكل شخص.</li><li>المبالغ الحالية بالضبط على صفحة SVB «AOW-bedragen» (لم نتمكن من قراءتها مباشرة عند كتابة الدليل، فلا نذكر رقماً غير مؤكد).</li></ul>'
'<h2 id="aio">التكملة AIO: الشروط</h2>'
+T([['السن','بلغت سن AOW'],['السكن','تسكن في هولندا'],['AOW','لا AOW أو AOW ناقصة'],['الدخل','دخل آخر قليل أو لا دخل'],['المال','مدخرات تحت الحد'],['الشريك الأصغر','ممكنة أيضاً إن كان لشريكك AOW كاملة لكنه لم يبلغ السن، إن كان دخل الأسرة ومالها منخفضين']],['الشرط','التفاصيل'])
+'<p><strong>كيف تعمل؟</strong> تُكمل AIO دخلك حتى الحد الاجتماعي لمن بلغ سن التقاعد. للمقارنة، حدود المساعدة من سن التقاعد (1 يوليو 2026): <strong>1,587.34</strong> يورو للشخص الوحيد و<strong>2,176.10</strong> للزوجين شهرياً، شاملة بدل العطلة. المبلغ الدقيق لـAIO يحسبه SVB حسب وضعك.</p>'
'<h2 id="apply">كيف تطلب؟</h2><ol><li>يرسل SVB عادة رسالة قبل بلوغك سن التقاعد لطلب AOW؛ إن لم تصلك فتواصل مع SVB.</li><li>جرّب <strong>«AIO-check»</strong> على موقع SVB لترى هل تستحق.</li><li>اطلب AIO من SVB (وليس من البلدية).</li><li>جهّز: الهوية، كشوف البنك، إثبات الدخل والمعاش من الخارج إن وُجد.</li></ol>'
'<h2 id="abroad">السكن أو السفر الطويل خارج هولندا</h2><ul><li><strong>AIO تتطلب السكن في هولندا.</strong> الإقامة الطويلة في الخارج قد توقفها؛ أبلغ SVB قبل السفر الطويل.</li><li>قواعد تصدير AOW للخارج تختلف حسب البلد؛ اسأل SVB لحالتك.</li></ul>'
'<h2 id="other">دعم إضافي لكبار السن</h2><ul><li><a href="/articles/zorgtoeslag-guide.html">بدل الرعاية الصحية</a> و<a href="/articles/housing-rent-allowance-2026.html">بدل الإيجار</a>.</li><li><a href="/articles/municipal-taxes-exemption-kwijtschelding.html">إعفاء ضرائب البلدية</a>: بعض البلديات تحسب حد المتقاعدين على صافي المعاش.</li><li><a href="/articles/wmo-home-support.html">دعم البلدية في البيت (Wmo)</a>: مساعدة منزلية وأجهزة.</li><li><a href="/articles/special-assistance-bijzondere-bijstand.html">المساعدة الخاصة</a> للتكاليف الضرورية.</li></ul>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>عدم طلب AIO ظناً أنها «Bijstand» عادية؛ هي حق عبر SVB.</li><li>عدم إبلاغ SVB عن معاش من بلد آخر.</li><li>السفر الطويل دون إبلاغ.</li><li>نسيان طلب بدل الرعاية والإيجار بعد التقاعد.</li></ol>'),
faq=[('ما سن التقاعد في هولندا؟','67 سنة في 2026 و2027، و67 سنة و3 أشهر في 2028.'),
('لماذا AOW الخاصة بي ناقصة؟','لأن AOW تُبنى بنسبة 2% عن كل سنة سكنت أو عملت فيها في هولندا؛ كل سنة خارجها تعني 2% أقل.'),
('ما هي AIO؟','تكملة من SVB ترفع دخلك حتى الحد الاجتماعي إن كانت AOW ناقصة ودخلك ومالك قليلين وتسكن في هولندا.'),
('أين أطلب AIO؟','من SVB، وجرّب أولاً AIO-check على موقعها.'),
('هل أفقد AIO إن سافرت؟','AIO تتطلب السكن في هولندا؛ أبلغ SVB قبل أي سفر طويل.')],
src_note='راجعنا Rijksoverheid وصفحات SVB المتاحة في 5 أكتوبر 2026. صفحات مبالغ AOW وAIO الحالية على SVB لم تكن متاحة لنا عند الكتابة، فلم نذكر مبالغها؛ اطلع عليها على svb.nl.')

NL=dict(title='AOW en AIO-aanvulling voor migranten in 2026: AOW-leeftijd, waarom je AOW onvolledig is (2% per jaar) en hoe de AIO je aanvult tot het sociaal minimum',
crumb='AOW en AIO',
seo_title='AOW en AIO-aanvulling voor migranten 2026',
desc='AOW-leeftijd 67 in 2026 en opbouw 2% per jaar in Nederland: waarom je AOW onvolledig is en hoe de AIO van de SVB aanvult tot het sociaal minimum.',
summary='<ol><li><strong>AOW-leeftijd:</strong> 67 in 2026 en 2027, <strong>67 jaar en 3 maanden in 2028</strong>. Bekijk je eigen datum bij de SVB.</li><li>Je bouwt <strong>2% AOW per jaar</strong> op dat je in Nederland woont of werkt; wie later kwam, krijgt een <strong>onvolledige</strong> AOW.</li><li>Volledige AOW: 70% van het netto minimumloon (alleenstaand), 50% per persoon (samenwonend).</li><li>De <strong>AIO-aanvulling</strong> van de SVB vult aan tot het sociaal minimum bij onvolledige AOW, laag inkomen en vermogen, en wonen in Nederland.</li><li>Bijstandsnormen vanaf AOW-leeftijd (1 juli 2026): <strong>€ 1.587,34</strong> alleenstaand, <strong>€ 2.176,10</strong> gehuwd per maand.</li></ol>',
body=(
'<h2 id="age">AOW-leeftijd</h2>'
+T([['2026','67 jaar'],['2027','67 jaar'],['2028','67 jaar en 3 maanden']],['Jaar','AOW-leeftijd'])
+'<p>Vastgesteld 5 jaar vooruit op basis van de levensverwachting. Op Prinsjesdag 2026 kondigde het kabinet aan de één-op-één koppeling te laten vallen (<a href="/nl/articles/prinsjesdag-2026-changes.html">Prinsjesdag</a>).</p>'
'<h2 id="build">Opbouw en onvolledige AOW</h2><ul><li>Per jaar wonen in Nederland (of verzekerd werken) bouw je <strong>2%</strong> op.</li><li>Elk jaar buiten Nederland is <strong>2% minder</strong>.</li><li><strong>Voorbeeld:</strong> wie 20 jaar vóór de AOW-leeftijd naar Nederland kwam, krijgt ongeveer 40% van een volledige AOW.</li><li>Veel oudere migranten hebben daarom een <strong>AIO</strong> nodig.</li></ul>'
'<h2 id="amount">Hoogte AOW</h2><ul><li>De volledige AOW volgt het minimumloon en wordt elk halfjaar aangepast.</li><li><strong>Alleenstaand:</strong> 70% van het netto minimumloon.</li><li><strong>Samenwonend:</strong> 50% per persoon.</li><li>Actuele bedragen staan op de SVB-pagina «AOW-bedragen»; die konden we bij het schrijven niet direct lezen, daarom noemen we geen onbevestigd bedrag.</li></ul>'
'<h2 id="aio">AIO: voorwaarden</h2>'
+T([['Leeftijd','AOW-leeftijd bereikt'],['Wonen','In Nederland'],['AOW','Geen of onvolledige AOW'],['Inkomen','Weinig of geen ander inkomen'],['Vermogen','Onder de grens'],['Jongere partner','Ook mogelijk als je partner een volledige AOW heeft maar de AOW-leeftijd nog niet, bij laag gezinsinkomen en vermogen']],['Voorwaarde','Toelichting'])
+'<p>De AIO vult aan tot het sociaal minimum vanaf AOW-leeftijd. Ter vergelijking: de bijstandsnormen vanaf AOW-leeftijd (1 juli 2026) zijn <strong>€ 1.587,34</strong> alleenstaand en <strong>€ 2.176,10</strong> gehuwd per maand, inclusief vakantiegeld. De SVB berekent jouw AIO.</p>'
'<h2 id="apply">Aanvragen</h2><ol><li>De SVB stuurt meestal vóór je AOW-leeftijd een brief; anders neem je contact op.</li><li>Doe de <strong>AIO-check</strong> op svb.nl.</li><li>Vraag de AIO aan bij de <strong>SVB</strong> (niet bij de gemeente).</li><li>Neem mee: ID, bankafschriften, inkomen en buitenlands pensioen.</li></ol>'
'<h2 id="abroad">Buitenland</h2><ul><li><strong>Voor de AIO moet je in Nederland wonen.</strong> Lang verblijf in het buitenland kan de AIO stoppen; meld reizen vooraf.</li><li>Export van AOW verschilt per land; vraag de SVB.</li></ul>'
'<h2 id="other">Meer hulp</h2><ul><li><a href="/nl/articles/zorgtoeslag-guide.html">Zorgtoeslag</a> en <a href="/nl/articles/housing-rent-allowance-2026.html">huurtoeslag</a>.</li><li><a href="/nl/articles/municipal-taxes-exemption-kwijtschelding.html">Kwijtschelding</a>.</li><li><a href="/nl/articles/wmo-home-support.html">Wmo</a>: hulp thuis en hulpmiddelen.</li><li><a href="/nl/articles/special-assistance-bijzondere-bijstand.html">Bijzondere bijstand</a>.</li></ul>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Geen AIO aanvragen omdat je denkt dat het «gewone bijstand» is.</li><li>Buitenlands pensioen niet melden.</li><li>Lang op reis zonder melding.</li><li>Zorg- en huurtoeslag vergeten na pensionering.</li></ol>'),
faq=[('Wat is de AOW-leeftijd?','67 in 2026 en 2027; 67 jaar en 3 maanden in 2028.'),
('Waarom is mijn AOW onvolledig?','Je bouwt 2% per jaar wonen of werken in Nederland op; elk jaar buiten Nederland is 2% minder.'),
('Wat is de AIO?','Een aanvulling van de SVB tot het sociaal minimum bij onvolledige AOW, laag inkomen en vermogen en wonen in Nederland.'),
('Waar vraag ik AIO aan?','Bij de SVB; doe eerst de AIO-check.'),
('Verlies ik AIO als ik reis?','Je moet in Nederland wonen; meld lang verblijf vooraf bij de SVB.')],
src_note='Gecontroleerd bij Rijksoverheid en bereikbare SVB-pagina’s op 5 oktober 2026. Actuele AOW- en AIO-bedragen op svb.nl konden we niet lezen; die noemen we daarom niet.')
