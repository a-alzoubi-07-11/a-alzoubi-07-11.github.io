/* «ما وضعك الآن؟» + «خطتي في هولندا» — branching paths on the homepage (AR + NL).
   - A path can ask one question first (e.g. which residence permit you have); every answer has its own steps.
   - The next step is shown in full: what to do, which documents, which office, and the guide.
   - Optional items ("if this applies to you") are links, not tasks.
   - «My plan» keeps the chosen paths and ticks in this browser only (localStorage). It can be printed or wiped.
   Every link points to an existing guide or tool. No data leaves the device. */
(function () {
  'use strict';
  var box = document.getElementById('sit');
  if (!box) return;
  var nl = (document.documentElement.lang || '').slice(0, 2) === 'nl';
  var A = function (s) { return (nl ? '/nl/articles/' : '/articles/') + s + '.html'; };
  var C = function (s) { return (nl ? '/nl/calculators/' : '/calculators/') + s + '.html'; };
  var P = function (s) { return (nl ? '/nl/' : '/') + s; };
  var t = function (ar, n) { return nl ? n : ar; };

  var L = {
    next: t('خطوتك التالية', 'Je volgende stap'), docs: t('ما تحتاجه', 'Wat je nodig hebt'), who: t('الجهة', 'Instantie'),
    open: t('افتح الدليل', 'Open de gids'), done: t('أنجزت', 'klaar'), steps: t('خطوات', 'stappen'), all: t('كل الخطوات', 'Alle stappen'),
    mark: t('علّمها كمنجزة', 'Markeer als gedaan'), other: t('اختر وضعاً آخر', 'Andere situatie kiezen'), tip: t('نصيحة', 'Tip'),
    maybe: t('إن كان ينطبق عليك', 'Als het voor jou geldt'), tool: t('أداة تساعدك', 'Handig hulpmiddel'), change: t('غيّر الإجابة', 'Antwoord wijzigen'),
    allDone: t('أنجزت كل الخطوات. راجع «إن كان ينطبق عليك» أدناه.', 'Alle stappen klaar. Kijk ook bij «Als het voor jou geldt».'),
    plan: t('خطتي في هولندا', 'Mijn plan in Nederland'), planSub: t('محفوظة على هذا الجهاز فقط، لا تُرسل لأي جهة.', 'Alleen op dit apparaat bewaard, niets wordt verstuurd.'),
    planEmpty: t('اختر وضعاً أعلاه ثم علّم خطواتك؛ تظهر هنا تلقائياً.', 'Kies hierboven een situatie en vink stappen af; ze verschijnen hier vanzelf.'),
    print: t('اطبع خطتي', 'Plan afdrukken'), wipe: t('امسح بياناتي', 'Mijn gegevens wissen'),
    wipeQ: t('هل تريد مسح خطتك وكل العلامات من هذا الجهاز؟', 'Wil je je plan en alle vinkjes van dit apparaat wissen?'),
    wiped: t('تم مسح بياناتك من هذا الجهاز.', 'Je gegevens zijn van dit apparaat gewist.'),
    remove: t('احذف من خطتي', 'Uit mijn plan halen'), resume: t('تابع', 'Verder'), printed: t('طُبعت من gidsnederland.nl في', 'Afgedrukt van gidsnederland.nl op')
  };
  // step = [title, why, docs[], who, link]
  function S(ti, why, docs, who, u) { return { t: ti, d: why, docs: docs || [], who: who || '', u: u }; }

  var IND = 'IND', GEM = t('البلدية (gemeente)', 'Gemeente'), DUO = 'DUO';
  var PATHS = [
    { id: 'new', ico: 'compass', tone: 'blue', t: t('وصلت جديداً', 'Net aangekomen'), s: t('التسجيل والتأمين والبدلات', 'BSN, DigiD, zorg en geld'),
      tip: t('ابدأ بالتسجيل في البلدية: بدون BSN لا يمكنك فعل أي شيء تقريباً.', 'Begin bij de gemeente: zonder BSN lukt bijna niets.'),
      steps: [
        S(t('سجّل في البلدية واحصل على BSN', 'Inschrijven bij de gemeente en BSN'), t('عنوانك في سجل BRP أساس كل المعاملات.', 'Je adres in de BRP is de basis voor alles.'),
          [t('جواز السفر أو وثيقة السفر', 'Paspoort of reisdocument'), t('بطاقة الإقامة أو قرار IND', 'Verblijfsdocument of IND-besluit'), t('عقد الإيجار أو موافقة صاحب السكن', 'Huurcontract of toestemming hoofdbewoner')], GEM, A('bsn-municipality-registration')),
        S(t('اطلب DigiD', 'DigiD aanvragen'), t('مفتاحك الرقمي للحكومة والبدلات والصحة.', 'Je digitale sleutel voor overheid, toeslagen en zorg.'),
          [t('رقم BSN', 'BSN'), t('عنوان مسجّل (يصلك رمز التفعيل بالبريد)', 'Ingeschreven adres (activeringscode per post)')], 'DigiD (Logius)', A('digid-registration-guide')),
        S(t('اشترك في التأمين الصحي', 'Zorgverzekering afsluiten'), t('إلزامي؛ إن تأخرت قد تُفرض غرامة.', 'Verplicht; te laat kan een boete opleveren.'),
          ['BSN', t('رقم حساب بنكي IBAN', 'IBAN-rekeningnummer')], t('شركة التأمين الصحي', 'Zorgverzekeraar'), A('health-insurance-newcomers')),
        S(t('سجّل عند طبيب العائلة', 'Inschrijven bij een huisarts'), t('بوابتك لكل الخدمات الصحية.', 'Je eerste stap voor alle zorg.'),
          [t('بيانات التأمين الصحي', 'Gegevens zorgverzekering'), t('وثيقة هوية', 'Identiteitsbewijs')], t('عيادة طبيب العائلة', 'Huisartsenpraktijk'), A('huisarts-registration')),
        S(t('افحص البدلات', 'Toeslagen checken'), t('بدل التأمين الصحي وبدل السكن قد يوفران كثيراً.', 'Zorgtoeslag en huurtoeslag kunnen veel schelen.'),
          ['DigiD', t('تقدير دخلك السنوي', 'Schatting van je jaarinkomen'), 'IBAN'], 'Dienst Toeslagen', A('zorgtoeslag-guide'))
      ],
      maybe: [[t('حساب بنكي وتطبيق البنك', 'Bankrekening en bank-app'), A('ing-bank-app-card-guide')], [t('المواصلات وبطاقة OV', 'Reizen met de ov-chipkaart'), A('ns-train-ov-chipkaart-ovpay')]],
      tool: [t('حاسبة zorgtoeslag', 'Zorgtoeslag berekenen'), C('zorgtoeslag')] },

    { id: 'asiel', ico: 'shield', tone: 'green', t: t('عندي إقامة لجوء', 'Ik heb een asielvergunning'), s: t('التجديد، الاندماج، الوثائق', 'Verlengen, inburgering, documenten'),
      tip: t('منذ 12 يونيو 2026 تُمنح الإقامة لمدة 3 سنوات. اطلب التجديد دائماً قبل انتهائها.', 'Sinds 12 juni 2026 is de vergunning 3 jaar. Vraag altijd op tijd verlenging aan.'),
      steps: [
        S(t('افهم نوع إقامتك ومدتها', 'Begrijp je vergunning en de looptijd'), t('نظام الحالتين وما يعنيه لتجديدك.', 'Het tweestatusstelsel en wat het betekent voor verlengen.'),
          [t('بطاقة الإقامة وقرار IND', 'Verblijfspas en IND-besluit')], IND, A('asylum-two-status-system-2026')),
        S(t('أنهِ الاندماج', 'Inburgering afronden'), t('شرط للإقامة الدائمة والجنسية.', 'Nodig voor permanent verblijf en naturalisatie.'),
          [t('خطة الاندماج (PIP) من البلدية', 'Je PIP van de gemeente'), t('حساب DigiD', 'DigiD')], GEM + ' / ' + DUO, A('inburgering-integration-law-2026')),
        S(t('جهّز وثائقك الشخصية', 'Je documenten regelen'), t('التصديق والترجمة المحلّفة تفيدك لاحقاً.', 'Legaliseren en beëdigd vertalen helpt je later.'),
          [t('شهادة الميلاد والزواج إن وُجدت', 'Geboorte- en huwelijksakte als je die hebt')], t('السفارة ومترجم محلّف', 'Ambassade en beëdigd vertaler'), A('syrian-documents-legalisation-translation'))
      ],
      maybe: [[t('تدرّب على أسئلة KNM', 'Oefen KNM-vragen'), P('knm-oefenen.html')], [t('لمّ شمل العائلة (nareis)', 'Gezin laten overkomen (nareis)'), A('asylum-family-reunification')], [t('الإقامة الدائمة ← افتح مسار «أريد الإقامة الدائمة»', 'Permanent verblijf → kies «Ik wil permanent verblijf»'), '#sit:perm'], [t('الجنسية ← افتح مسار «أريد الجنسية»', 'Naturalisatie → kies «Ik wil Nederlander worden»'), '#sit:nat']],
      tool: [t('فاحص الإقامة والجنسية', 'Check permanent verblijf'), C('permanent-residence-check')] },

    { id: 'perm', ico: 'home', tone: 'orange', t: t('أريد الإقامة الدائمة', 'Ik wil permanent verblijf'), s: t('حسب نوع إقامتك الحالية', 'Per soort verblijfsvergunning'),
      tip: t('افحص وضعك أولاً: الأداة تعرض ما تحقق وما ينقص من الشروط.', 'Doe eerst de check: je ziet welke voorwaarden voldaan zijn en welke nog niet.'),
      q: t('ما نوع إقامتك الآن؟', 'Welke vergunning heb je nu?'),
      opts: [
        { id: 'asiel', label: t('إقامة لجوء', 'Asielvergunning'), steps: [
          S(t('افحص وضعك', 'Doe de check'), t('ما تحقق وما ينقص وأقرب تاريخ ممكن.', 'Wat voldaan is, wat ontbreekt en de vroegste datum.'), [], t('أداة على هذا الموقع', 'Hulpmiddel op deze site'), C('permanent-residence-check')),
          S(t('اقرأ طريق اللجوء إلى الإقامة الدائمة', 'Lees de asielroute naar permanent verblijf'), t('الإقامة الأوروبية EU-langdurig ingezetene بعد 5 سنوات وشروطها.', 'EU-langdurig ingezetene na 5 jaar en de voorwaarden.'),
            [t('شهادة الاندماج أو إعفاء', 'Inburgeringsdiploma of ontheffing'), t('إثبات دخل كافٍ ومستمر', 'Bewijs van voldoende en duurzaam inkomen'), t('جواز أو وثيقة سفر', 'Paspoort of reisdocument')], IND, A('permanent-residence-asylum-route')),
          S(t('قدّم الطلب بالاستمارة الصحيحة', 'Dien de aanvraag in met het juiste formulier'), t('الاستمارة والرسوم مذكورة في الدليل ونتيجة الأداة.', 'Formulier en leges staan in de gids en in de uitslag van de check.'), [], IND, A('eu-permanent-residence-netherlands'))]},
        { id: 'reg', label: t('إقامة عادية (regulier)', 'Reguliere vergunning'), steps: [
          S(t('افحص وضعك', 'Doe de check'), t('ما تحقق وما ينقص وأقرب تاريخ ممكن.', 'Wat voldaan is, wat ontbreekt en de vroegste datum.'), [], t('أداة على هذا الموقع', 'Hulpmiddel op deze site'), C('permanent-residence-check')),
          S(t('اختر: الأوروبية أم العادية الدائمة', 'Kies: EU-langdurig of regulier onbepaalde tijd'), t('الشروط تختلف في الدخل والاندماج.', 'De voorwaarden verschillen voor inkomen en inburgering.'),
            [t('عقد العمل وقسائم الراتب', 'Arbeidscontract en loonstroken'), t('شهادة الاندماج أو إعفاء', 'Inburgeringsdiploma of ontheffing')], IND, A('permanent-residence-regular-route')),
          S(t('قدّم الطلب', 'Dien de aanvraag in'), t('تحقق من الاستمارة والرسوم في الدليل.', 'Controleer formulier en leges in de gids.'), [], IND, A('eu-permanent-residence-netherlands'))]},
        { id: 'unk', label: t('لا أعرف', 'Weet ik niet'), steps: [
          S(t('اعرف نوع إقامتك', 'Zoek uit welke vergunning je hebt'), t('انظر إلى «الغرض» المكتوب على بطاقة الإقامة أو في قرار IND.', 'Kijk naar het verblijfsdoel op je pas of in het IND-besluit.'), [t('بطاقة الإقامة', 'Verblijfspas')], IND, A('eu-permanent-residence-netherlands')),
          S(t('افحص وضعك', 'Doe de check'), t('الأداة تسألك عن نوع إقامتك وتشرح الفرق.', 'De check vraagt naar je vergunning en legt het verschil uit.'), [], t('أداة على هذا الموقع', 'Hulpmiddel op deze site'), C('permanent-residence-check'))]}
      ],
      maybe: [[t('تريد الجنسية بدلاً منها؟ افتح مسار «أريد الجنسية»', 'Liever Nederlander worden? Kies «Ik wil Nederlander worden»'), '#sit:nat']],
      tool: [t('فاحص الإقامة والجنسية', 'Check permanent verblijf'), C('permanent-residence-check')] },

    { id: 'nat', ico: 'id', tone: 'blue', t: t('أريد الجنسية الهولندية', 'Ik wil Nederlander worden'), s: t('التجنس: الشروط والرسوم', 'Naturalisatie: voorwaarden en kosten'),
      tip: t('حافظ على إقامة سارية وجدّدها في وقتها حتى يوم حفل التجنس.', 'Houd je vergunning geldig en verleng op tijd, tot en met de ceremonie.'),
      q: t('ما نوع إقامتك الآن؟', 'Welke vergunning heb je nu?'),
      opts: [
        { id: 'asiel', label: t('إقامة لجوء', 'Asielvergunning'), steps: [
          S(t('افحص المدة والشروط', 'Check termijn en voorwaarden'), t('عادة 5 سنوات متواصلة؛ لا يُطلب منك التخلي عن جنسيتك مع إقامة لجوء.', 'Meestal 5 jaar onafgebroken; met een asielvergunning hoef je geen afstand te doen.'), [], t('أداة على هذا الموقع', 'Hulpmiddel op deze site'), C('permanent-residence-check')),
          S(t('جهّز شهادة الاندماج', 'Inburgering klaar'), t('A2 في امتحان الاندماج أو NT2؛ مسار Z لا يكفي.', 'A2 inburgeringsexamen of Nt2; de Z-route volstaat niet.'), [t('شهادة الاندماج أو NT2', 'Inburgeringsdiploma of Nt2-diploma')], DUO, A('inburgering-integration-law-2026')),
          S(t('احجز موعداً في البلدية وقدّم الطلب', 'Afspraak bij de gemeente en aanvragen'), t('رسوم 2026 لحامل إقامة لجوء: 847 يورو (1,163 مع الشريك).', 'Leges 2026 met asielvergunning: € 847 (€ 1.163 met partner).'),
            [t('وثيقة السفر', 'Reisdocument'), t('بطاقة الإقامة', 'Verblijfspas'), t('شهادة الاندماج', 'Inburgeringsdiploma'), t('شهادة الميلاد إن أمكن', 'Geboorteakte als dat kan')], GEM, A('dutch-naturalisation-guide'))]},
        { id: 'reg', label: t('إقامة عادية أو أوروبية دائمة', 'Regulier of EU-langdurig'), steps: [
          S(t('افحص المدة والشروط', 'Check termijn en voorwaarden'), t('5 سنوات، أو 3 مع شريك هولندي، أو سنتان بعد 10 سنوات إقامة.', '5 jaar, 3 jaar met Nederlandse partner, of 2 jaar na 10 jaar verblijf.'), [], t('أداة على هذا الموقع', 'Hulpmiddel op deze site'), C('permanent-residence-check')),
          S(t('افهم قاعدة التخلي عن الجنسية', 'Begrijp de afstandsplicht'), t('عادة تتخلى عن جنسيتك بعد التجنس، مع استثناءات (مثل الزواج من هولندي).', 'Meestal doe je na naturalisatie afstand, met uitzonderingen (zoals huwelijk met een Nederlander).'), [], IND, A('dutch-naturalisation-guide')),
          S(t('جهّز شهادة الاندماج', 'Inburgering klaar'), t('A2 في امتحان الاندماج أو NT2.', 'A2 inburgeringsexamen of Nt2.'), [t('شهادة الاندماج أو NT2', 'Inburgeringsdiploma of Nt2-diploma')], DUO, A('inburgering-integration-law-2026')),
          S(t('احجز موعداً في البلدية وقدّم الطلب', 'Afspraak bij de gemeente en aanvragen'), t('رسوم 2026: 1,139 يورو، أو 1,454 مع الشريك.', 'Leges 2026: € 1.139, of € 1.454 met partner.'),
            [t('جواز السفر', 'Paspoort'), t('بطاقة الإقامة', 'Verblijfspas'), t('شهادة الاندماج', 'Inburgeringsdiploma'), t('شهادة ميلاد مصدّقة ومترجمة', 'Gelegaliseerde en vertaalde geboorteakte')], GEM, A('dutch-naturalisation-guide'))]}
      ],
      maybe: [[t('تدرّب على أسئلة KNM', 'Oefen KNM-vragen'), P('knm-oefenen.html')], [t('تحتاج وثائق من بلدك؟', 'Documenten uit je land nodig?'), A('syrian-documents-legalisation-translation')], [t('امتحان NT2', 'Staatsexamen Nt2'), A('nt2-b1-exam-guide')]],
      tool: [t('فاحص الإقامة والجنسية', 'Check naturalisatie'), C('permanent-residence-check')] },

    { id: 'letter', ico: 'mail', tone: 'red', t: t('وصلتني رسالة', 'Ik kreeg een brief'), s: t('قرار، غرامة، أو دين', 'Besluit, boete of schuld'),
      tip: t('انتبه للتاريخ: الاعتراض على قرار حكومي يكون عادة خلال 6 أسابيع.', 'Let op de datum: bezwaar tegen een besluit kan meestal binnen 6 weken.'),
      q: t('ما نوع الرسالة؟', 'Wat voor brief is het?'),
      opts: [
        { id: 'besluit', label: t('قرار من جهة حكومية', 'Besluit van de overheid'), steps: [
          S(t('افهم كلمات الرسالة', 'Begrijp de woorden'), t('مسرد لأهم المصطلحات الحكومية.', 'Lijst met belangrijke overheidswoorden.'), [t('الرسالة نفسها', 'De brief zelf')], '', A('dutch-government-terms-glossary')),
          S(t('غير موافق؟ اعترض في الوقت', 'Niet eens? Op tijd bezwaar maken'), t('المهلة مكتوبة في القرار؛ يوجد نموذج رسالة.', 'De termijn staat in het besluit; er is een voorbeeldbrief.'), [t('القرار وتاريخه', 'Het besluit en de datum'), t('أدلتك', 'Je bewijs')], t('الجهة التي أصدرت القرار', 'De instantie die besliste'), A('bezwaar-objection-letter')),
          S(t('اطلب مساعدة قانونية إن احتجت', 'Juridische hulp als dat nodig is'), t('محامٍ بمساهمة مخفضة حسب دخلك.', 'Advocaat met lagere eigen bijdrage, afhankelijk van je inkomen.'), [t('القرار', 'Het besluit'), t('إثبات الدخل', 'Inkomensgegevens')], 'Juridisch Loket', A('legal-aid-lawyer-toevoeging'))]},
        { id: 'boete', label: t('غرامة (CJIB)', 'Boete (CJIB)'), steps: [
          S(t('افهم الغرامة والمهلة', 'Begrijp de boete en de termijn'), t('الغرامة تزيد إن تأخرت في الدفع.', 'De boete wordt hoger als je te laat betaalt.'), [t('رقم الغرامة', 'Beschikkingsnummer')], 'CJIB', A('traffic-fines-cjib')),
          S(t('لا تستطيع الدفع؟ اطلب تقسيطاً', 'Kun je niet betalen? Vraag een betalingsregeling'), t('الشروط في الدليل.', 'De voorwaarden staan in de gids.'), [], 'CJIB', A('traffic-fines-cjib'))]},
        { id: 'schuld', label: t('دين أو مطالبة دفع', 'Schuld of betalingsherinnering'), steps: [
          S(t('تأكد أن الرسالة حقيقية', 'Controleer of de brief echt is'), t('لا تدفع لرابط في رسالة قبل التحقق.', 'Betaal niet via een link voordat je het hebt gecontroleerd.'), [], '', A('scams-phishing-netherlands')),
          S(t('اطلب مساعدة الديون المجانية', 'Vraag gratis schuldhulp'), t('البلدية تساعدك بخطة دفع.', 'De gemeente helpt met een plan.'), [t('كل رسائل الديون', 'Alle brieven over schulden'), t('دخلك ومصاريفك', 'Inkomen en vaste lasten')], GEM, A('debt-help-schuldhulp'))]}
      ],
      maybe: [[t('ضرائب البلدية: هل تستحق الإعفاء؟', 'Gemeentelijke belastingen: kwijtschelding?'), A('municipal-taxes-exemption-kwijtschelding')]],
      tool: [t('محامٍ بمساعدة قانونية', 'Gratis advocaat (toevoeging)'), A('legal-aid-lawyer-toevoeging')] },

    { id: 'work', ico: 'briefcase', tone: 'blue', t: t('أبحث عن عمل', 'Werk zoeken of werken'), s: t('السيرة، العقد، الراتب', 'Cv, contract en salaris'),
      tip: t('افحص قسيمة راتبك كل شهر: الأخطاء تظهر فيها أولاً.', 'Controleer je loonstrook elke maand: fouten zie je daar eerst.'),
      steps: [
        S(t('اصنع سيرتك الذاتية', 'Maak je Nederlandse cv'), t('ست خطوات مجاناً، مع رسالة تحفيز.', 'Zes stappen, gratis, met een motivatiebrief.'), [t('خبراتك وشهاداتك', 'Je werkervaring en diploma’s')], '', P('cv.html')),
        S(t('ابحث في المهن المطلوبة', 'Kijk naar kansrijke beroepen'), t('أين العمل في 2026–2027؟', 'Waar is werk in 2026–2027?'), [], 'UWV', A('trending-jobs-2026')),
        S(t('افهم عقد عملك قبل التوقيع', 'Begrijp je contract vóór je tekent'), t('الحقوق وفترة التجربة والإنهاء.', 'Rechten, proeftijd en opzegging.'), [t('مسودة العقد', 'Het conceptcontract')], t('صاحب العمل', 'Werkgever'), A('employment-contracts-labor-law-2026')),
        S(t('اقرأ قسيمة راتبك', 'Lees je loonstrook'), t('الإجمالي والصافي والاقتطاعات.', 'Bruto, netto en inhoudingen.'), [t('قسيمة الراتب', 'Loonstrook')], t('صاحب العمل', 'Werkgever'), A('dutch-payslip-explained'))
      ],
      maybe: [[t('عمل عبر وكالة توظيف', 'Werken via een uitzendbureau'), A('temporary-agency-work-rights')], [t('عقد صفر ساعات', 'Nulurencontract'), A('zero-hours-contract')], [t('الحد الأدنى للأجور', 'Minimumloon'), A('minimum-wage-netherlands')]],
      tool: [t('أنشئ سيرتك الذاتية', 'Maak je cv'), P('cv.html')] },

    { id: 'kids', ico: 'child', tone: 'green', t: t('عندي طفل', 'Ik heb (of krijg) een kind'), s: t('البدلات، الحضانة، المدرسة', 'Toeslagen, opvang en school'),
      tip: t('kinderbijslag وkindgebonden budget بدلان مختلفان.', 'Kinderbijslag en kindgebonden budget zijn twee verschillende regelingen.'),
      steps: [
        S(t('بدل الأطفال kinderbijslag', 'Kinderbijslag'), t('يُدفع كل ثلاثة أشهر من SVB.', 'Per kwartaal van de SVB.'), ['DigiD', t('BSN الطفل', 'BSN van je kind')], 'SVB', A('kinderbijslag-guide')),
        S(t('kindgebonden budget', 'Kindgebonden budget'), t('مبلغ شهري إضافي حسب الدخل.', 'Extra per maand, afhankelijk van je inkomen.'), ['DigiD', t('تقدير الدخل', 'Inkomensschatting')], 'Dienst Toeslagen', A('kindgebonden-budget-guide')),
        S(t('سجّل طفلك في المدرسة الابتدائية', 'Kind inschrijven op de basisschool'), t('من عمر 4 سنوات؛ إلزامية من 5.', 'Vanaf 4 jaar; leerplichtig vanaf 5.'), [t('BSN الطفل', 'BSN van je kind')], t('المدرسة', 'School'), A('dutch-school-system-basisschool'))
      ],
      maybe: [[t('الحمل والولادة', 'Zwanger en bevallen'), A('pregnancy-newborn-care')], [t('بدل الحضانة إن كنت تعمل أو تدرس', 'Kinderopvangtoeslag als je werkt of studeert'), A('childcare-allowance-kinderopvangtoeslag')], [t('والد وحيد', 'Alleenstaande ouder'), A('single-parent-support')]],
      tool: [t('حاسبة kindgebonden budget', 'Kindgebonden budget berekenen'), C('kindgebonden-budget')] },

    { id: 'study', ico: 'grad', tone: 'orange', t: t('أريد الدراسة', 'Ik wil studeren'), s: t('الشهادة، اللغة، التمويل', 'Diploma, taal en DUO'),
      tip: t('قيّم شهادتك الأجنبية أولاً؛ فهي تحدد مستواك.', 'Laat je buitenlandse diploma eerst waarderen; dat bepaalt je niveau.'),
      steps: [
        S(t('قيّم شهادتك', 'Laat je diploma waarderen'), t('ما تعادله شهادتك حسب مستواها.', 'Wat je diploma waard is per niveau.'), [t('الشهادة وكشف العلامات مع الترجمة', 'Diploma en cijferlijst met vertaling')], 'IDW / SBB', A('diploma-recognition-by-education-level')),
        S(t('اختر المسار: MBO أم HBO أم الجامعة', 'Kies: mbo, hbo of wo'), t('الفروق بوضوح.', 'De verschillen op een rij.'), [], t('المؤسسة التعليمية', 'Onderwijsinstelling'), A('mbo-hbo-wo-comparison')),
        S(t('مستوى اللغة', 'Je taalniveau'), t('غالباً B1 أو B2 حسب الدراسة.', 'Vaak B1 of B2, afhankelijk van de opleiding.'), [], DUO, A('nt2-b1-exam-guide')),
        S(t('تمويل الدراسة', 'Studiefinanciering'), t('من يستحق وكم.', 'Wie krijgt wat.'), ['DigiD'], DUO, A('student-finance'))
      ],
      maybe: [[t('الدراسة بعد سن 30', 'Studeren na je 30e'), A('adult-learning-finance')], [t('الدراسة مع العمل BOL/BBL', 'Leren en werken: bol of bbl'), A('bol-bbl-comparison')]],
      tool: [t('قارن مسارات التعليم', 'Onderwijsroutes vergelijken'), P('tools.html#routes')] },

    { id: 'home', ico: 'key', tone: 'red', t: t('السكن والإيجار', 'Wonen en huur'), s: t('السكن الاجتماعي والحقوق', 'Huurwoning, rechten en toeslag'),
      tip: t('سجّل مبكراً للسكن الاجتماعي: مدة الانتظار هي ما يُحسب.', 'Schrijf je zo vroeg mogelijk in: de wachttijd telt.'),
      steps: [
        S(t('سجّل للسكن الاجتماعي', 'Inschrijven voor een sociale huurwoning'), t('التسجيل ومدة الانتظار في منطقتك.', 'Inschrijven en wachttijd in jouw regio.'), [t('وثيقة هوية', 'Identiteitsbewijs'), t('إثبات الدخل', 'Inkomensgegevens')], t('موقع السكن في منطقتك', 'Woningsite in je regio'), A('social-housing-sociale-huurwoning')),
        S(t('اعرف حقوقك كمستأجر', 'Ken je rechten als huurder'), t('الإيجار والصيانة والإنهاء.', 'Huurprijs, onderhoud en opzegging.'), [t('عقد الإيجار', 'Huurcontract')], 'Huurcommissie', A('tenant-rights-netherlands')),
        S(t('افحص بدل السكن', 'Huurtoeslag checken'), t('كم يمكن أن تسترد من الإيجار.', 'Hoeveel je terug kunt krijgen.'), ['DigiD', t('عقد الإيجار', 'Huurcontract')], 'Dienst Toeslagen', A('housing-rent-allowance-2026'))
      ],
      maybe: [[t('انتقلت؟ غيّر عنوانك', 'Verhuisd? Adres wijzigen'), A('change-address-netherlands')], [t('عقد الكهرباء والغاز', 'Energiecontract'), A('energy-contracts-saving-2026')]],
      tool: [t('ميزانية الشهر', 'Maandbudget'), P('tools.html#budget')] }
  ];

  /* ---------- storage: {v:2, paths:{key:{ticks:[], at:'YYYY-MM-DD'}}, last:key} ---------- */
  var KEY = 'gn-plan-v2';
  var state = { v: 2, paths: {}, last: null };
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.paths) state = s;
      else {               // carry over ticks from the first version of the picker
        var old = JSON.parse(localStorage.getItem('gn-sit-v1') || 'null');
        if (old) { Object.keys(old).forEach(function (k) { if (k !== '_last' && Array.isArray(old[k]) && old[k].some(Boolean)) state.paths[k] = { ticks: old[k], at: today() }; }); }
      }
    } catch (e) { /* private mode: works without saving */ }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); localStorage.removeItem('gn-sit-v1'); } catch (e) { } }
  function today() { return new Date().toISOString().slice(0, 10); }
  load();

  var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ico = function (n) { return '<i class="gi gi-' + n + '" aria-hidden="true"></i>'; };
  function byId(id) { return PATHS.filter(function (p) { return p.id === id; })[0]; }
  function resolve(key) {            // 'perm:asiel' -> {path, opt, steps, title}
    var parts = String(key).split(':'), p = byId(parts[0]);
    if (!p) return null;
    if (p.opts) {
      var o = p.opts.filter(function (x) { return x.id === parts[1]; })[0];
      return o ? { key: key, path: p, opt: o, steps: o.steps, title: p.t + ' — ' + o.label } : { key: p.id, path: p, opt: null, steps: null, title: p.t };
    }
    return { key: p.id, path: p, opt: null, steps: p.steps, title: p.t };
  }
  function ticksOf(key) { return (state.paths[key] && state.paths[key].ticks) || []; }
  function doneCount(r) { var tk = ticksOf(r.key); return r.steps.filter(function (_, i) { return tk[i]; }).length; }

  var grid = box.querySelector('.sit-grid');
  var panel = box.querySelector('.sit-path');
  var planBox = document.createElement('section');
  planBox.className = 'sit-plan'; planBox.id = 'my-plan'; planBox.setAttribute('aria-labelledby', 'my-plan-h');
  panel.after(planBox);

  grid.innerHTML = PATHS.map(function (x) {
    return '<button type="button" class="sit-card t-' + x.tone + '" data-id="' + x.id + '" aria-expanded="false" aria-controls="sit-path">'
      + '<span class="sit-ico">' + ico(x.ico) + '</span><strong>' + esc(x.t) + '</strong><span>' + esc(x.s) + '</span></button>';
  }).join('');

  function stepCard(st) {
    return '<div class="sit-next"><p class="sit-kicker">' + L.next + '</p><h4>' + esc(st.t) + '</h4><p>' + esc(st.d) + '</p>'
      + (st.docs.length ? '<p class="sit-lbl">' + L.docs + '</p><ul class="sit-docs">' + st.docs.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' : '')
      + (st.who ? '<p class="sit-who"><span class="sit-lbl">' + L.who + ':</span> ' + esc(st.who) + '</p>' : '')
      + '<a class="sit-tool" href="' + st.u + '">' + L.open + '</a></div>';
  }

  function render(key, scroll) {
    var r = resolve(key); if (!r) return;
    var x = r.path;
    [].forEach.call(grid.children, function (b) { var on = b.getAttribute('data-id') === x.id; b.classList.toggle('on', on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); });
    panel.className = 'sit-path t-' + x.tone;
    var h = '<div class="sit-head"><span class="sit-ico big">' + ico(x.ico) + '</span><div><h3 tabindex="-1">' + esc(x.t) + '</h3>'
      + (r.opt ? '<p class="sit-meta">' + esc(r.opt.label) + ' · <button type="button" class="sit-link sit-change">' + L.change + '</button></p>' : '') + '</div></div>';
    if (!r.steps) {                   // ask the question first
      h += '<fieldset class="sit-q"><legend>' + esc(x.q) + '</legend><div class="sit-opts">'
        + x.opts.map(function (o) { return '<button type="button" class="sit-opt" data-opt="' + o.id + '">' + esc(o.label) + '</button>'; }).join('') + '</div></fieldset>';
    } else {
      var tk = ticksOf(r.key), n = r.steps.length, d = doneCount(r);
      var next = -1; for (var i = 0; i < n; i++) { if (!tk[i]) { next = i; break; } }
      h += '<p class="sit-meta"><b class="sit-count">' + d + '</b>/' + n + ' ' + L.done + '</p><div class="sit-bar" aria-hidden="true"><span style="width:' + Math.round(d / n * 100) + '%"></span></div>';
      h += next >= 0 ? stepCard(r.steps[next]) : '<p class="sit-tip">' + L.allDone + '</p>';
      h += '<h4 class="sit-sub">' + L.all + '</h4><ol class="sit-steps">' + r.steps.map(function (st, i) {
        return '<li class="' + (tk[i] ? 'ok' : '') + (i === next ? ' now' : '') + '"><label class="sit-tick"><input type="checkbox" data-i="' + i + '"' + (tk[i] ? ' checked' : '') + '><span class="sr">' + L.mark + ': ' + esc(st.t) + '</span></label>'
          + '<a href="' + st.u + '"><span class="sit-n">' + (i + 1) + '</span><span class="sit-txt"><strong>' + esc(st.t) + '</strong><small>' + esc(st.d) + '</small></span><span class="sit-go" aria-hidden="true">' + (nl ? '→' : '←') + '</span></a></li>';
      }).join('') + '</ol>';
    }
    if (x.maybe && x.maybe.length) h += '<h4 class="sit-sub">' + L.maybe + '</h4><ul class="sit-maybe">' + x.maybe.map(function (m) { return '<li><a href="' + m[1] + '">' + esc(m[0]) + '</a></li>'; }).join('') + '</ul>';
    h += '<p class="sit-tip"><b>' + ico('bulb') + ' ' + L.tip + ':</b> ' + esc(x.tip) + '</p>'
      + '<div class="sit-actions"><a class="sit-tool sit-tool-2" href="' + x.tool[1] + '">' + ico('tool') + ' ' + L.tool + ': <b>' + esc(x.tool[0]) + '</b></a>'
      + '<button type="button" class="sit-link sit-other">' + L.other + '</button></div>';
    panel.innerHTML = h; panel.hidden = false;
    state.last = r.key; save();
    if (scroll) { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); var h3 = panel.querySelector('h3'); h3 && h3.focus({ preventScroll: true }); }
  }

  panel.addEventListener('click', function (e) {
    var o = e.target.closest('.sit-opt');
    if (o) { var id = state.last.split(':')[0]; render(id + ':' + o.getAttribute('data-opt'), false); var f = panel.querySelector('.sit-next h4, .sit-tip'); f && panel.querySelector('h3').focus({ preventScroll: true }); return; }
    if (e.target.closest('.sit-change')) { render(state.last.split(':')[0], false); var b = panel.querySelector('.sit-opt'); b && b.focus(); return; }
    if (e.target.closest('.sit-other')) {
      panel.hidden = true; var on = grid.querySelector('.on');
      [].forEach.call(grid.children, function (b) { b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); });
      box.scrollIntoView({ behavior: 'smooth', block: 'start' }); on && on.focus({ preventScroll: true }); return;
    }
    var a = e.target.closest('a[href^="#sit:"]');
    if (a) { e.preventDefault(); render(a.getAttribute('href').slice(5), true); }
  });
  panel.addEventListener('change', function (e) {
    var cb = e.target.closest('.sit-steps input'); if (!cb) return;
    var key = state.last, entry = state.paths[key] || { ticks: [], at: today() };
    entry.ticks[+cb.getAttribute('data-i')] = cb.checked; entry.at = today(); state.paths[key] = entry;
    if (!entry.ticks.some(Boolean)) delete state.paths[key];
    save(); render(key, false); renderPlan();
    var again = panel.querySelector('.sit-steps input[data-i="' + cb.getAttribute('data-i') + '"]'); again && again.focus();
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.sit-card'); if (!b) return;
    var id = b.getAttribute('data-id'), saved = Object.keys(state.paths).filter(function (k) { return k.split(':')[0] === id; })[0];
    render(saved || id, true);
  });

  /* ---------- My plan ---------- */
  function renderPlan() {
    var keys = Object.keys(state.paths).filter(function (k) { var r = resolve(k); return r && r.steps; });
    var h = '<div class="sit-plan-head"><div><h3 id="my-plan-h">' + ico('list') + ' ' + L.plan + '</h3><p class="sit-meta">' + L.planSub + '</p></div>';
    if (keys.length) h += '<div class="sit-plan-btns"><button type="button" class="sit-btn sit-print">' + ico('printer') + ' ' + L.print + '</button><button type="button" class="sit-btn sit-wipe">' + L.wipe + '</button></div>';
    h += '</div>';
    if (!keys.length) h += '<p class="sit-plan-empty">' + L.planEmpty + '</p>';
    else h += '<ul class="sit-plan-list">' + keys.map(function (k) {
      var r = resolve(k), d = doneCount(r), n = r.steps.length, tk = ticksOf(k), next = r.steps.filter(function (_, i) { return !tk[i]; })[0];
      return '<li class="t-' + r.path.tone + '"><div><strong>' + esc(r.title) + '</strong><span class="sit-meta">' + d + '/' + n + ' ' + L.done + (next ? ' · ' + L.next + ': ' + esc(next.t) : '') + '</span></div>'
        + '<div class="sit-plan-acts"><button type="button" class="sit-btn" data-resume="' + esc(k) + '">' + L.resume + '</button><button type="button" class="sit-link" data-remove="' + esc(k) + '">' + L.remove + '</button></div></li>';
    }).join('') + '</ul>';
    h += '<p class="sr" role="status" aria-live="polite"></p>';
    planBox.innerHTML = h;
  }
  planBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-resume]'); if (b) { render(b.getAttribute('data-resume'), true); return; }
    var rm = e.target.closest('[data-remove]'); if (rm) { delete state.paths[rm.getAttribute('data-remove')]; save(); renderPlan(); if (state.last === rm.getAttribute('data-remove')) render(state.last, false); planBox.querySelector('h3').focus && planBox.querySelector('h3').setAttribute('tabindex', '-1'); planBox.querySelector('h3').focus(); return; }
    if (e.target.closest('.sit-wipe')) {
      if (!window.confirm(L.wipeQ)) return;
      try { localStorage.removeItem(KEY); localStorage.removeItem('gn-sit-v1'); } catch (_) { }
      state = { v: 2, paths: {}, last: null }; panel.hidden = true;
      [].forEach.call(grid.children, function (c) { c.classList.remove('on'); c.setAttribute('aria-expanded', 'false'); });
      renderPlan(); planBox.querySelector('[role=status]').textContent = L.wiped; return;
    }
    if (e.target.closest('.sit-print')) printPlan();
  });
  function printPlan() {
    var keys = Object.keys(state.paths).filter(function (k) { var r = resolve(k); return r && r.steps; });
    var out = document.getElementById('sit-print') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'sit-print' }));
    out.setAttribute('dir', nl ? 'ltr' : 'rtl'); out.setAttribute('lang', nl ? 'nl' : 'ar');
    out.innerHTML = '<h1>' + L.plan + '</h1><p>' + L.printed + ' ' + new Date().toLocaleDateString(nl ? 'nl-NL' : 'ar-NL') + '</p>' + keys.map(function (k) {
      var r = resolve(k), tk = ticksOf(k);
      return '<h2>' + esc(r.title) + '</h2><ol>' + r.steps.map(function (st, i) {
        return '<li><b>' + (tk[i] ? '☑' : '☐') + ' ' + esc(st.t) + '</b> — ' + esc(st.d)
          + (st.docs.length ? '<br>' + L.docs + ': ' + st.docs.map(esc).join('، '.replace('، ', nl ? ', ' : '، ')) : '') + (st.who ? '<br>' + L.who + ': ' + esc(st.who) : '')
          + '<br><small>https://gidsnederland.nl' + st.u + '</small></li>';
      }).join('') + '</ol>';
    }).join('');
    document.documentElement.classList.add('printing-plan');
    var done = function () { document.documentElement.classList.remove('printing-plan'); removeEventListener('afterprint', done); };
    addEventListener('afterprint', done); window.print(); setTimeout(done, 1500);
  }

  renderPlan();
  if (/^#sit:/.test(location.hash)) render(location.hash.slice(5), true);
  else if (state.last && resolve(state.last)) render(state.last, false);
})();
