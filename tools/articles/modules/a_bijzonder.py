from a_student_finance import T
SLUG='special-assistance-bijzondere-bijstand'
SRC=[('Rijksoverheid · Wanneer heb ik recht op bijzondere bijstand?','https://www.rijksoverheid.nl/onderwerpen/bijstand/vraag-en-antwoord/wanneer-heb-ik-recht-op-bijzondere-bijstand'),
('Rijksoverheid · Ondersteuning bij een laag inkomen','https://www.rijksoverheid.nl/vraag-en-antwoord/armoedebestrijding/kan-ik-ondersteuning-krijgen-bij-een-laag-inkomen'),
('Gemeente Enschede · Bijzondere bijstand','https://www.enschede.nl/bijzondere-bijstand'),
('Gemeente Enschede · Individuele inkomenstoeslag','https://www.enschede.nl/individuele-inkomenstoeslag'),
('Rijksoverheid · Hoe hoog is mijn bijstandsuitkering?','https://www.rijksoverheid.nl/vraag-en-antwoord/bijstand/hoe-hoog-is-mijn-bijstandsuitkering')]

AR=dict(title='المساعدة الخاصة (Bijzondere bijstand) وبدل الدخل الفردي من البلدية 2026: لمن، لأي تكاليف، كيف تطلب، ومثال إنسخيدة بالأرقام',
crumb='المساعدة الخاصة',
seo_title='المساعدة الخاصة bijzondere bijstand 2026',
desc='المساعدة الخاصة (bijzondere bijstand) للتكاليف الضرورية المفاجئة، وبدل الدخل الفردي السنوي (إنسخيدة: 114 يورو للشخص الوحيد)، والقرار خلال 8 أسابيع.',
summary='<ol><li><strong>المساعدة الخاصة (bijzondere bijstand)</strong> للتكاليف الإضافية <strong>الضرورية وغير المتوقعة</strong> التي لا تستطيع دفعها ولا تغطيها جهة أخرى، وليست فقط لمن يتلقى Bijstand.</li><li>البلدية تقرر هل تعطيها <strong>هبة أو قرضاً</strong>. <strong>اطلبها قبل أن تدفع</strong> (في إنسخيدة شرط).</li><li><strong>بدل الدخل الفردي (individuele inkomenstoeslag)</strong> مبلغ سنوي لمن عاش سنوات طويلة بدخل عند حد المساعدة. في إنسخيدة: 114 يورو للشخص الوحيد، 162 للزوجين، و65 لكل طفل تحت 12 و130 لكل طفل 12–18.</li><li>القرار في إنسخيدة خلال <strong>8 أسابيع</strong> بعد اكتمال الوثائق.</li><li>كل بلدية لها لائحتها ومبالغها؛ هذا الدليل يشرح المبدأ ويعطيك مثالاً واقعياً.</li></ol>',
body=(
'<h2 id="what">ما الفرق بين الدعمين؟</h2>'
+T([['المساعدة الخاصة (bijzondere bijstand)','لتكلفة محددة ضرورية وغير متوقعة','مثلاً غسالة تعطلت، أثاث أساسي، إصلاح طارئ في البيت','هبة أو قرض، حسب البلدية'],
    ['بدل الدخل الفردي (individuele inkomenstoeslag)','مبلغ سنوي حر الاستعمال','لمن عاش سنوات طويلة بدخل منخفض دون أمل قريب في التحسن','هبة، مرة كل 12 شهراً']],
   ['الدعم','لماذا','مثال','الشكل'])
+'<h2 id="special">المساعدة الخاصة: الشروط</h2><ul><li>18 سنة فأكثر، إقامة قانونية.</li><li>دخل ومال غير كافيين (ليس شرطاً أن تتلقى Bijstand؛ أصحاب الدخل المنخفض بعمل أيضاً قد يستحقون).</li><li>التكلفة <strong>ضرورية</strong> و<strong>غير متوقعة</strong> ويمكن إثباتها.</li><li>لا تُغطى من جهة أخرى (التأمين الصحي، التأمين المنزلي، <a href="/articles/wmo-home-support.html">دعم Wmo</a>…).</li><li>في إنسخيدة: <strong>التكاليف الطبية مستثناة</strong> (لها طرق أخرى)، ويجب الطلب <strong>قبل الدفع</strong>.</li></ul>'
'<h2 id="examples">أمثلة شائعة</h2><ul><li>تعطل ثلاجة أو غسالة ولا مال لإصلاحها.</li><li>أثاث أساسي عند السكن الأول (لحاملي الإقامة غالباً عبر ترتيب خاص بالبلدية).</li><li>تكاليف طارئة في البيت.</li><li>تكاليف إدارة الأموال أو المساعدة القانونية في بعض الحالات.</li></ul><p>البلدية تقرر في كل حالة؛ الأمثلة ليست وعداً بالموافقة.</p>'
'<h2 id="iit">بدل الدخل الفردي: مثال إنسخيدة</h2>'
+T([['شخص وحيد','114 يورو'],['متزوجان أو ساكنان معاً','162 يورو'],['لكل طفل تحت 12 سنة (في 1 يناير)','65 يورو'],['لكل طفل من 12 حتى 18','130 يورو']],['الحالة','المبلغ (إنسخيدة)'])
+'<p><strong>شروط إنسخيدة:</strong> مسجل في إنسخيدة، 21 سنة فأكثر، دون سن التقاعد، 5 سنوات إقامة قانونية في هولندا، <strong>5 سنوات</strong> بدخل عند حد المساعدة أو أقل، بلا تمويل دراسة، مال تحت الحد، ودون خفض للمساعدة في 5 سنوات بسبب عدم الالتزام بالعمل. الطلب مرة كل 12 شهراً، دون أثر رجعي. بلديات أخرى قد تشترط 3 سنوات وتعطي مبالغ مختلفة.</p>'
'<h2 id="apply">كيف تطلب؟ (مثال إنسخيدة)</h2><ol><li>اطلب <strong>عبر الإنترنت بـDigiD</strong>؛ الشريكان يدخلان كلاهما.</li><li>للمساعدة الخاصة: أرفق <strong>عرض السعر</strong> (offerte) قبل الشراء.</li><li>أرفق كشوف البنك وإثبات الدخل لآخر 3 أشهر.</li><li>القرار خلال <strong>8 أسابيع</strong> بعد اكتمال الوثائق.</li><li>للسؤال: هاتف البلدية <strong>14 053</strong>.</li></ol>'
'<h2 id="other">دعم آخر من البلدية لذوي الدخل المنخفض</h2><ul><li><strong>إعفاء ضرائب البلدية</strong> (<a href="/articles/municipal-taxes-exemption-kwijtschelding.html">الدليل</a>).</li><li><strong>دعم الأطفال</strong>: كثير من البلديات لديها «حزمة أطفال» أو صناديق للرياضة والثقافة والرحلات المدرسية.</li><li><strong>تأمين صحي جماعي</strong> للدخل المنخفض في بعض البلديات (<a href="/articles/health-insurance-2027.html">التأمين الصحي 2027</a>).</li><li><strong>مساعدة الديون المجانية</strong> (<a href="/articles/debt-help-schuldhulp.html">الدليل</a>).</li><li><strong>فاتورة طاقة مرتفعة؟</strong> راجع <a href="/articles/energy-emergency-fund-2027.html">صندوق الطوارئ للطاقة 2027</a> (ليس من البلدية).</li></ul><p>ابحث في موقع بلديتك عن «minimaregelingen» أو «rondkomen».</p>'
'<h2 id="tips">نصائح للحصول على الموافقة</h2><ol><li>اطلب <strong>قبل</strong> الشراء أو الدفع.</li><li>اشرح لماذا التكلفة ضرورية ولماذا لم تكن تتوقعها.</li><li>أرفق عرض سعر رخيصاً ومعقولاً.</li><li>بيّن أنك لا تملك مدخرات تكفي.</li><li>إن رُفض طلبك فلك حق <strong>الاعتراض</strong> خلال المهلة المكتوبة في القرار.</li></ol>'),
faq=[('هل يجب أن أتلقى Bijstand لأحصل على المساعدة الخاصة؟','لا. أصحاب الدخل المنخفض من عمل أو إعانة أخرى قد يستحقونها أيضاً.'),
('هل أطلب بعد الشراء؟','لا، في إنسخيدة يجب الطلب قبل الدفع، وهذا الأفضل في كل البلديات.'),
('كم بدل الدخل الفردي؟','في إنسخيدة: 114 يورو للشخص الوحيد، 162 للزوجين، 65 لكل طفل تحت 12 و130 لكل طفل 12–18.'),
('متى يصدر القرار؟','في إنسخيدة خلال 8 أسابيع بعد اكتمال الوثائق.'),
('هل المساعدة الخاصة هبة؟','قد تكون هبة أو قرضاً، والبلدية تقرر.')],
src_note='راجعنا Rijksoverheid وصفحات بلدية إنسخيدة في 5 أكتوبر 2026. صفحة إنسخيدة لا تذكر سنة المبالغ؛ وكل بلدية لها شروطها ومبالغها.')

NL=dict(title='Bijzondere bijstand en individuele inkomenstoeslag in 2026: voor wie, voor welke kosten, aanvragen en het voorbeeld Enschede in bedragen',
crumb='Bijzondere bijstand',
seo_title='Bijzondere bijstand en inkomenstoeslag 2026',
desc='Bijzondere bijstand voor onvoorziene noodzakelijke kosten en de individuele inkomenstoeslag (Enschede: € 114 alleenstaand), met besluit binnen 8 weken.',
summary='<ol><li><strong>Bijzondere bijstand</strong> is voor <strong>noodzakelijke, onvoorziene</strong> extra kosten die je niet kunt betalen en die niet elders worden vergoed; niet alleen voor mensen in de bijstand.</li><li>De gemeente kiest <strong>gift of lening</strong>. <strong>Vraag aan vóór je betaalt</strong>.</li><li><strong>Individuele inkomenstoeslag</strong> is een jaarbedrag bij langdurig laag inkomen. Enschede: € 114 alleenstaand, € 162 samen, € 65 per kind onder 12 en € 130 per kind 12–18.</li><li>Enschede beslist binnen <strong>8 weken</strong> na een volledige aanvraag.</li><li>Elke gemeente heeft eigen regels en bedragen.</li></ol>',
body=(
'<h2 id="what">Het verschil</h2>'
+T([['Bijzondere bijstand','Voor een concrete noodzakelijke, onvoorziene kost','Kapotte koelkast, basismeubels, spoedreparatie','Gift of lening'],['Individuele inkomenstoeslag','Vrij besteedbaar jaarbedrag','Langdurig laag inkomen zonder uitzicht op verbetering','Gift, 1× per 12 maanden']],['Regeling','Waarvoor','Voorbeeld','Vorm'])
+'<h2 id="special">Bijzondere bijstand: voorwaarden</h2><ul><li>18+, rechtmatig verblijf.</li><li>Onvoldoende inkomen en vermogen (ook met werk of een andere uitkering mogelijk).</li><li>Kosten zijn <strong>noodzakelijk</strong>, <strong>onvoorzien</strong> en aantoonbaar.</li><li>Niet via een andere voorziening vergoed (zorgverzekering, inboedelverzekering, <a href="/nl/articles/wmo-home-support.html">Wmo</a>).</li><li>Enschede: <strong>medische kosten uitgesloten</strong>; aanvragen <strong>vóór betaling</strong>.</li></ul>'
'<h2 id="examples">Voorbeelden</h2><ul><li>Kapotte koelkast of wasmachine.</li><li>Basisinrichting bij een eerste woning.</li><li>Spoedreparatie in huis.</li><li>Soms kosten van bewindvoering of rechtsbijstand.</li></ul><p>De gemeente beslist per situatie.</p>'
'<h2 id="iit">Individuele inkomenstoeslag: voorbeeld Enschede</h2>'
+T([['Alleenstaande','€ 114'],['Gehuwd/samenwonend','€ 162'],['Per kind jonger dan 12 (op 1 januari)','€ 65'],['Per kind 12 t/m 18','€ 130']],['Situatie','Bedrag (Enschede)'])
+'<p><strong>Voorwaarden Enschede:</strong> ingeschreven in Enschede, 21+, geen AOW, 5 jaar rechtmatig in Nederland, <strong>5 jaar</strong> inkomen op of onder bijstandsniveau, geen studiefinanciering, vermogen binnen de grens, geen verlaging in 5 jaar wegens niet nakomen van arbeidsverplichtingen. 1× per 12 maanden, niet met terugwerkende kracht. Andere gemeenten hanteren soms 3 jaar en andere bedragen.</p>'
'<h2 id="apply">Aanvragen (voorbeeld Enschede)</h2><ol><li><strong>Online met DigiD</strong>; partners loggen allebei in.</li><li>Bijzondere bijstand: voeg een <strong>offerte</strong> toe, vóór aankoop.</li><li>Bankafschriften en inkomen van 3 maanden.</li><li>Besluit binnen <strong>8 weken</strong> na volledige aanvraag.</li><li>Vragen: <strong>14 053</strong>.</li></ol>'
'<h2 id="other">Andere minimaregelingen</h2><ul><li><a href="/nl/articles/municipal-taxes-exemption-kwijtschelding.html">Kwijtschelding</a>.</li><li>Kindpakket of fondsen voor sport, cultuur en schoolreisjes.</li><li>Gemeentelijke collectieve zorgverzekering (<a href="/nl/articles/health-insurance-2027.html">zorgverzekering 2027</a>).</li><li>Gratis <a href="/nl/articles/debt-help-schuldhulp.html">schuldhulp</a>.</li><li>Hoge energierekening? Zie het <a href="/nl/articles/energy-emergency-fund-2027.html">Noodfonds Energie 2027</a> (geen gemeentelijke regeling).</li></ul><p>Zoek op de site van je gemeente naar «minimaregelingen» of «rondkomen».</p>'
'<h2 id="tips">Tips</h2><ol><li>Aanvragen vóór aankoop.</li><li>Leg uit waarom de kost noodzakelijk en onvoorzien is.</li><li>Een redelijke, goedkope offerte.</li><li>Laat zien dat je geen spaargeld hebt.</li><li>Afgewezen? Maak <strong>bezwaar</strong> binnen de termijn in het besluit.</li></ol>'),
faq=[('Moet ik in de bijstand zitten voor bijzondere bijstand?','Nee, ook met een laag inkomen uit werk of een andere uitkering kan het.'),
('Kan ik achteraf aanvragen?','In Enschede niet: aanvragen vóór betaling. Dat is overal verstandig.'),
('Hoe hoog is de individuele inkomenstoeslag?','Enschede: € 114 alleenstaand, € 162 samen, € 65 per kind onder 12, € 130 per kind 12–18.'),
('Wanneer krijg ik een besluit?','In Enschede binnen 8 weken na een volledige aanvraag.'),
('Is bijzondere bijstand een gift?','Gift of lening; de gemeente beslist.')],
src_note='Gecontroleerd bij Rijksoverheid en gemeente Enschede op 5 oktober 2026. De Enschede-pagina noemt geen jaartal bij de bedragen; elke gemeente heeft eigen voorwaarden en bedragen.')
