from a_student_finance import T
SLUG='change-address-netherlands'
SRC=[('Rijksoverheid · Hoe kan ik mijn verhuizing doorgeven aan de gemeente?','https://www.rijksoverheid.nl/vraag-en-antwoord/gemeenten/hoe-kan-ik-mijn-verhuizing-doorgeven-aan-de-gemeente'),
('RvIG · Verhuizing binnen Nederland','https://www.rvig.nl/verhuizing-binnen-nederland'),
('Rijksoverheid · Uitschrijven uit de BRP (emigratie)','https://www.rijksoverheid.nl/onderwerpen/privacy-en-persoonsgegevens/vraag-en-antwoord/uitschrijven-basisregistratie-personen'),
('Rijksoverheid · Moet ik als vreemdeling mijn verhuizing doorgeven aan de IND?','https://www.rijksoverheid.nl/onderwerpen/immigratie-naar-nederland/vraag-en-antwoord/moet-ik-als-vreemdeling-mijn-verhuizing-doorgeven-aan-de-immigratie--en-naturalisatiedienst'),
('Dienst Toeslagen · Wijzigingen doorgeven','https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/wijzigingen_doorgeven'),
('RvIG · Als je in Nederland wilt komen wonen (adresfraude)','https://www.rvig.nl/als-je-nederland-wilt-komen-wonen')]

AR=dict(title='تغيير العنوان والانتقال في هولندا 2026: الإبلاغ للبلدية (من 4 أسابيع قبل حتى 5 أيام بعد)، الغرامة 325 يورو، الوثائق، ومن تبلغه بنفسك',
crumb='تغيير العنوان',
seo_title='تغيير العنوان في هولندا verhuizen 2026',
desc='تغيير العنوان في هولندا: أبلغ البلدية الجديدة من 4 أسابيع قبل الانتقال حتى 5 أيام بعده، وإلا فقد تُغرَّم حتى 325 يورو. الوثائق ومن تبلغه بنفسك.',
summary='<ol><li><strong>أبلغ البلدية الجديدة</strong> من <strong>4 أسابيع قبل</strong> الانتقال حتى <strong>5 أيام بعده</strong>، عبر الإنترنت أو البريد أو الشباك.</li><li>إن تأخرت تعتبر البلدية تاريخ إبلاغك هو تاريخ الانتقال، وقد تُغرَّم حتى <strong>325 يورو</strong>.</li><li>تحتاج <strong>هوية سارية</strong> و<strong>إثبات سكن</strong>: عقد إيجار أو شراء أو إذن الساكن الرئيسي.</li><li>البلدية القديمة تحصل على بياناتك تلقائياً. لكن جهات خاصة كثيرة (البنك، التأمين، الطاقة) <strong>تبلغها بنفسك</strong>.</li><li>إن كنت ستعيش في الخارج أكثر من 8 أشهر في السنة فأبلغ عن الهجرة.</li></ol>',
body=(
'<h2 id="when">متى وكيف تبلغ عن الانتقال؟</h2>'
+T([['متى','من 4 أسابيع قبل تاريخ الانتقال حتى 5 أيام بعده'],['إلى من','البلدية <strong>الجديدة</strong> (التي تنتقل إليها)'],['كيف','عبر الإنترنت (غالباً بـDigiD)، أو بالبريد، أو في الشباك'],['من يبلغ','كل شخص من 16 سنة بنفسه، أو بتوكيل؛ والأهل عن أطفالهم تحت 18'],['إن تأخرت','تأخذ البلدية تاريخ الإبلاغ كتاريخ انتقال، وقد تُفرض غرامة حتى <strong>325 يورو</strong>']],['السؤال','الجواب'])
+'<h2 id="documents">الوثائق</h2><ul><li>هوية سارية.</li><li><strong>إثبات سكن:</strong> عقد إيجار، أو عقد شراء، أو <strong>إذن مكتوب من الساكن الرئيسي</strong> إن كنت تسكن عند أحد.</li><li>قد تجري البلدية «تحقيق عنوان» إن شكت أن أحداً لا يسكن فعلاً حيث سُجّل. التسجيل الصحيح يحميك من استرداد البدلات والغرامات.</li><li><strong>لا تقبل عنواناً مدفوعاً</strong>؛ هذا احتيال يحذر منه RvIG.</li></ul>'
'<h2 id="automatic">من يعرف تلقائياً، ومن تبلغه بنفسك؟</h2><p>عند الانتقال لبلدية أخرى، ترسل البلدية القديمة بياناتك تلقائياً للجديدة، والجهات الحكومية التي تستخدم سجل BRP تحصل على العنوان الجديد منه. لكن لا تعتمد على ذلك وحده:</p>'
+T([['Toeslagen (البدلات)','افحص بياناتك في Mijn toeslagen خلال 4 أسابيع؛ الانتقال قد يغيّر بدل الإيجار أو شريك البدلات (<a href="/articles/housing-rent-allowance-2026.html">بدل الإيجار</a>).'],
    ['IND (لغير الأوروبيين)','يوجد سؤال رسمي حول إبلاغ IND بالانتقال؛ اقرأ صفحة Rijksoverheid في المصادر وتحقق من بريدك لدى IND.'],
    ['البنك','بنفسك، عبر التطبيق.'],
    ['شركة التأمين الصحي','بنفسك.'],
    ['الطاقة والماء والإنترنت','بنفسك؛ عقد الطاقة يمكن نقله للعنوان الجديد (<a href="/articles/energy-contracts-saving-2026.html">دليل الطاقة</a>).'],
    ['صاحب العمل والمدرسة والطبيب','بنفسك؛ وقد تحتاج طبيباً عاماً جديداً (<a href="/articles/huisarts-registration.html">التسجيل عند طبيب</a>).'],
    ['البريد','خدمة تحويل البريد من PostNL اختيارية ومدفوعة.']],
   ['الجهة','ماذا تفعل'])
+'<h2 id="checklist">قائمة الانتقال</h2><ol><li>قبل 4 أسابيع: أبلغ البلدية الجديدة، وأبلغ مالك السكن القديم كتابياً حسب عقدك. وإن كنت تنتقل إلى سكن من مؤسسة إسكان فراجع <a href="/articles/social-housing-sociale-huurwoning.html">دليل السكن الاجتماعي</a>.</li><li>اطلب نقل عقد الطاقة أو إنهاءه، وسجّل قراءات العدادات بالصور.</li><li>غيّر عنوانك لدى البنك والتأمين وصاحب العمل والمدرسة.</li><li>افحص Mijn toeslagen بعد الانتقال.</li><li>إن كنت تسكن عند أحد، احصل على إذنه المكتوب.</li><li>احتفظ بنسخة من تأكيد الإبلاغ.</li></ol>'
'<h2 id="abroad">الانتقال إلى خارج هولندا</h2><p>أبلغ البلدية إن كنت ستقيم في الخارج <strong>أكثر من 8 أشهر خلال سنة</strong>؛ تصبح «غير مقيم». هذا يؤثر على التأمين الصحي والبدلات والإقامة لغير الأوروبيين؛ اسأل قبل السفر الطويل (<a href="/articles/eu-permanent-residence-netherlands.html">الإقامة</a>).</p>'
'<h2 id="mistakes">أخطاء شائعة</h2><ol><li>الانتقال دون إبلاغ ثم غرامة أو مشاكل في البدلات.</li><li>البقاء مسجلاً عند أحد بعد مغادرتك.</li><li>نسيان أن الشريك الجديد في العنوان قد يصبح «شريك بدلات» (<a href="/articles/toeslagpartner-guide.html">من هو شريك البدلات</a>).</li><li>عدم نقل عقد الطاقة.</li></ol>'),
faq=[('متى أبلغ البلدية عن انتقالي؟','من 4 أسابيع قبل الانتقال حتى 5 أيام بعده، للبلدية الجديدة.'),
('ما الغرامة إن لم أبلغ؟','قد تفرض البلدية غرامة حتى 325 يورو، وتأخذ تاريخ إبلاغك كتاريخ انتقال.'),
('ماذا أحتاج؟','هوية سارية وإثبات سكن: عقد إيجار أو شراء أو إذن الساكن الرئيسي.'),
('هل تُبلَّغ البدلات تلقائياً؟','البيانات تنتقل عبر سجل BRP، لكن افحص Mijn toeslagen لأن الانتقال قد يغيّر حقك.'),
('متى أبلغ عن الهجرة؟','إن كنت ستقيم في الخارج أكثر من 8 أشهر خلال سنة.')],
src_note='راجعنا Rijksoverheid وRvIG وDienst Toeslagen في 5 أكتوبر 2026. طريقة الإبلاغ تختلف قليلاً حسب البلدية.')

NL=dict(title='Verhuizen en adres wijzigen in 2026: doorgeven aan de gemeente (4 weken vóór tot 5 dagen na), boete tot € 325, documenten en wat je zelf regelt',
crumb='Adreswijziging',
seo_title='Verhuizing doorgeven en adres wijzigen 2026',
desc='Verhuizing doorgeven aan de nieuwe gemeente: van 4 weken vóór tot 5 dagen na de verhuisdatum, anders een boete tot € 325. Documenten en wat je zelf regelt.',
summary='<ol><li><strong>Geef je verhuizing door</strong> aan de nieuwe gemeente van <strong>4 weken vóór</strong> tot <strong>5 dagen na</strong> de verhuisdatum.</li><li>Te laat: de aangiftedatum wordt je verhuisdatum en een boete tot <strong>€ 325</strong> is mogelijk.</li><li>Nodig: <strong>geldig ID</strong> en <strong>bewijs van bewoning</strong> (huurcontract, koopakte of toestemming hoofdbewoner).</li><li>De oude gemeente krijgt je gegevens automatisch; bank, zorgverzekeraar en energie regel je <strong>zelf</strong>.</li><li>Meer dan 8 maanden per jaar in het buitenland: emigratie melden.</li></ol>',
body=(
'<h2 id="when">Wanneer en hoe?</h2>'
+T([['Wanneer','Van 4 weken vóór tot 5 dagen na de verhuisdatum'],['Bij wie','De <strong>nieuwe</strong> gemeente'],['Hoe','Online, per post of aan de balie'],['Wie','Iedereen vanaf 16 zelf (of gemachtigde); ouders voor kinderen onder 18'],['Te laat','Aangiftedatum wordt verhuisdatum; boete tot <strong>€ 325</strong> mogelijk']],['Vraag','Antwoord'])
+'<h2 id="documents">Documenten</h2><ul><li>Geldig ID.</li><li><strong>Bewijs van bewoning:</strong> huurcontract, koopakte of <strong>toestemmingsverklaring van de hoofdbewoner</strong>.</li><li>De gemeente kan een adresonderzoek doen. Een juiste inschrijving beschermt je tegen terugvordering van toeslagen en boetes.</li><li><strong>Koop geen adres</strong>: adresfraude.</li></ul>'
'<h2 id="automatic">Wat gaat automatisch en wat regel je zelf?</h2>'
+T([['Toeslagen','Controleer binnen 4 weken Mijn toeslagen; verhuizen kan huurtoeslag of toeslagpartner veranderen (<a href="/nl/articles/housing-rent-allowance-2026.html">huurtoeslag</a>).'],['IND (niet-EU)','Lees de Rijksoverheid-pagina over het doorgeven aan de IND en let op IND-post.'],['Bank','Zelf, via de app.'],['Zorgverzekeraar','Zelf.'],['Energie, water, internet','Zelf; energiecontract kan mee (<a href="/nl/articles/energy-contracts-saving-2026.html">energie</a>).'],['Werkgever, school, huisarts','Zelf; mogelijk een nieuwe huisarts (<a href="/nl/articles/huisarts-registration.html">huisarts</a>).'],['Post','PostNL-verhuisservice is optioneel en betaald.']],['Organisatie','Actie'])
+'<h2 id="checklist">Verhuischecklist</h2><ol><li>4 weken vooraf: gemeente informeren, oude verhuurder schriftelijk opzeggen. Verhuis je naar een woning van een corporatie, zie dan onze <a href="/nl/articles/social-housing-sociale-huurwoning.html">gids over de sociale huurwoning</a>.</li><li>Energiecontract verhuizen, meterstanden fotograferen.</li><li>Adres wijzigen bij bank, verzekeraar, werkgever, school.</li><li>Mijn toeslagen controleren.</li><li>Toestemming hoofdbewoner bij inwonen.</li><li>Bevestiging bewaren.</li></ol>'
'<h2 id="abroad">Naar het buitenland</h2><p>Meld vertrek bij de gemeente als je <strong>meer dan 8 maanden binnen een jaar</strong> in het buitenland verblijft; je wordt niet-ingezetene. Dit raakt zorgverzekering, toeslagen en verblijf (<a href="/nl/articles/eu-permanent-residence-netherlands.html">verblijf</a>).</p>'
'<h2 id="mistakes">Veelgemaakte fouten</h2><ol><li>Verhuizen zonder doorgeven.</li><li>Ingeschreven blijven bij iemand na vertrek.</li><li>Vergeten dat een nieuwe huisgenoot toeslagpartner kan worden (<a href="/nl/articles/toeslagpartner-guide.html">toeslagpartner</a>).</li><li>Energiecontract niet verhuizen.</li></ol>'),
faq=[('Wanneer geef ik mijn verhuizing door?','Van 4 weken vóór tot 5 dagen na, aan de nieuwe gemeente.'),
('Wat is de boete?','Gemeenten mogen een boete tot € 325 geven.'),
('Wat heb ik nodig?','Geldig ID en bewijs van bewoning.'),
('Gaat Toeslagen automatisch mee?','De gegevens komen via de BRP, maar controleer Mijn toeslagen.'),
('Wanneer meld ik emigratie?','Bij meer dan 8 maanden binnen een jaar in het buitenland.')],
src_note='Gecontroleerd bij Rijksoverheid, RvIG en Dienst Toeslagen op 5 oktober 2026. De manier van doorgeven verschilt per gemeente.')
