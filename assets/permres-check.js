/* Permanent residence checker (EU-langdurig ingezetene / regulier onbepaalde tijd).
   Rules: IND pages + forms 6009 / 6011 / bijlage 7111, checked 19-10-2026.
   Everything runs in the browser; nothing is stored or sent. */
(function () {
  'use strict';
  var root = document.getElementById('prc');
  if (!root) return;
  var lang = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var pre = lang === 'nl' ? '/nl' : '';

  // ---------- official figures (1 juli – 31 december 2026; leges 2026)
  var N = { single: 1635.90, singleVg: 1766.77, couple: 2337.00, coupleVg: 2523.96, zzp: 1766.77 };
  var LEGES = { adult: 254, minor: 85, tr: 85, trMinor: 46 };

  function eur(x) { var p = x.toFixed(2).split('.'); return '<bdi dir="ltr">€\u00a0' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + '</bdi>'; }
  function yr(x) { return lang === 'nl' ? x.toFixed(1).replace('.', ',') : x.toFixed(1); }
  var TEMP = ['studie', 'zoekjaar', 'aupair', 'seizoen', 'stage', 'ict', 'uitwisseling', 'medisch', 'humanitair_t', 'other_t'];

  // ---------- texts
  var T = {
    ar: {
      eur: eur,
      next: 'التالي', back: 'السابق', show: 'اعرض تقييمي', again: 'ابدأ من جديد', print: 'اطبع أو احفظ PDF',
      req: 'أجب عن الأسئلة المطلوبة في هذه الخطوة.',
      step: 'الخطوة', of: 'من',
      statusH: 'وضعك القانوني الآن', routeH: 'المسار المناسب لك', scoreH: 'مؤشر الجاهزية',
      contractH: 'تقييم عقد العمل', formH: 'الاستمارة والملاحق الصحيحة', docsH: 'الأوراق التي تجهّزها',
      todoH: 'ما المطلوب منك الآن', critH: 'الشروط شرطاً شرطاً', rightsH: 'ما لك وما عليك',
      disclaimer: 'هذا مؤشر جاهزية تقديري مبني على شروط IND المنشورة، وليس احتمال قبول رسمياً ولا قراراً. IND وحده يقرر بعد فحص أوراقك.',
      ok: 'متحقق', warn: 'يحتاج انتباهاً', fail: 'غير متحقق', na: 'لا ينطبق',
      ready: 'جاهز تقريباً للتقديم', close: 'قريب: عالج النقاط الصفراء', notyet: 'ليس بعد: عالج النقاط الحمراء أولاً',
      eu: 'الإقامة الأوروبية الدائمة', euNl: 'EU-langdurig ingezetene',
      reg: 'الإقامة الدائمة العادية', regNl: 'regulier onbepaalde tijd',
      none: 'لم يتحقق أي مسار بعد',
      stars: 'من 5',
      permit: {
        asiel_bt: 'لديك <b>إقامة لجوء محددة المدة</b> (<span lang="nl" dir="ltr">verblijfsvergunning asiel bepaalde tijd</span>، النوع III). منذ 12 يونيو 2026 لا يمكن طلب <span lang="nl" dir="ltr">asiel onbepaalde tijd</span>، فطريقك إلى الإقامة الدائمة هو <b>EU-langdurig ingezetene</b> بالاستمارة 6011.',
        asiel_ot: 'لديك <b>إقامة لجوء غير محددة المدة</b> (النوع IV، حصلت عليها قبل 12 يونيو 2026). إقامتك دائمة وتبقى لك؛ تجدّد البطاقة فقط كل 5 سنوات. يمكنك اختيارياً طلب <b>EU-langdurig ingezetene</b> للحصول على حقوق إضافية داخل الاتحاد الأوروبي.',
        reg_bt: 'لديك <b>إقامة عادية محددة المدة</b> (<span lang="nl" dir="ltr">verblijfsvergunning regulier bepaalde tijd</span>، النوع I).',
        reg_ot: 'لديك <b>إقامة عادية غير محددة المدة</b> (<span lang="nl" dir="ltr">regulier onbepaalde tijd</span>، النوع II). إقامتك دائمة. يمكنك طلب <b>EU-langdurig ingezetene</b> (النوع V) إن استوفيت شرط الدخل.',
        bluecard: 'لديك <b>البطاقة الزرقاء الأوروبية</b> (<span lang="nl" dir="ltr">Europese blauwe kaart</span>). غرضها غير مؤقت، ولك قواعد أخف في حساب المدة للإقامة الأوروبية.',
        chavez: 'لديك إقامة للعيش مع <b>طفل هولندي قاصر</b> (<span lang="nl" dir="ltr">Chavez</span>). غرضها غير مؤقت، ويمكنك التقديم على الإقامة الدائمة بشروطها.',
        eu_citizen: 'أنت <b>مواطن من الاتحاد الأوروبي أو EER أو سويسرا</b>. هذه الأداة ليست لك: بعد 5 سنوات تطلب <span lang="nl" dir="ltr">duurzaam verblijf</span> برسوم 85 يورو.',
        none: 'لا تملك الآن إقامة سارية في هولندا. الإقامة الدائمة تحتاج 5 سنوات إقامة قانونية متواصلة، فلا يمكن التقديم الآن.'
      },
      purposeTemp: 'غرض إقامتك الحالي <b>مؤقت</b> (<span lang="nl" dir="ltr">tijdelijk verblijfsdoel</span>). بهذا الغرض لا يمكن التقديم على الإقامة الدائمة بأي نوع.',
      purposeNonTemp: 'غرض إقامتك الحالي <b>غير مؤقت</b> (<span lang="nl" dir="ltr">niet-tijdelijk verblijfsdoel</span>)، فيمكنك التقديم على المسارين.',
      c: {
        permit: 'نوع الإقامة وغرضها', years: 'مدة الإقامة المتواصلة', absence: 'الغياب عن هولندا', gap: 'لا فجوة في الإقامة',
        brp: 'التسجيل في BRP', order: 'النظام العام والسوابق', inb: 'شرط الاندماج',
        zelf: 'دخل مستقل (zelfstandig)', duur: 'دخل مستدام (duurzaam)', vold: 'دخل كافٍ (voldoende)'
      },
      n: {
        permitAsielReg: 'الإقامة العادية الدائمة غير متاحة لحاملي إقامة اللجوء؛ IND يفحص طلب 6011 للإقامة الأوروبية فقط، وإن رُفض يُفحص تجديد إقامة اللجوء.',
        permitHasReg: 'لديك الإقامة الدائمة العادية أصلاً.',
        permitTemp: 'الغرض المؤقت لا يؤهل. غيّر غرض إقامتك (مثلاً إلى عمل أو kennismigrant) قبل أن تبدأ السنوات بالعدّ.',
        yearsEU: function (e) { return 'السنوات المحسوبة للإقامة الأوروبية: <b>' + e + '</b> من 5 (سنوات الدراسة تُحسب بالنصف).'; },
        yearsREG: function (e) { return 'السنوات المحسوبة للإقامة العادية: <b>' + e + '</b> من 5 (سنوات الدراسة تُحسب كاملة، والسنوات قبل سن 8 لا تُحسب).'; },
        yearsSoon: 'ينقصك أقل من 3 أشهر. قدّم الطلب قبل اكتمال المدة بثلاثة أشهر كحد أقصى، لا قبل ذلك.',
        yearsBeLu: 'الجنسية البلجيكية أو اللوكسمبورغية معفاة من شرط الخمس سنوات في الإقامة العادية الدائمة.',
        child: 'الأطفال يقدّمون على الإقامة العادية الدائمة من سن 13 فقط.',
        absLong: 'غياب واحد أطول من 6 أشهر متتالية يقطع الإقامة المتواصلة.',
        absTotalEU: 'أكثر من 10 أشهر غياب إجمالاً خلال 5 سنوات يُسقط شرط الإقامة الأوروبية.',
        absTotalREG: 'غياب طويل متكرر (مثلاً أكثر من 4 أشهر سنوياً لثلاث سنوات) قد يعني أن مركز حياتك ليس في هولندا.',
        absOk: 'غيابك ضمن الحدود.',
        gap: 'فجوة في الإقامة (تجديد متأخر) قد تبدأ عدّ السنوات الخمس من جديد بعد الفجوة. اسأل IND أو VluchtelingenWerk.',
        brpNo: 'سجّل عنوانك في البلدية (BRP) قبل التقديم.',
        crime: 'السوابق أو القضايا الجارية قد تؤدي للرفض. IND يزنها حسب نوعها؛ استشر محامياً قبل التقديم.',
        inbOk: 'شهادتك تكفي.', inbExempt: 'الإعفاء ممكن، لكن يجب إثباته بالملحق 7116 مع وثائق مصدّقة، وIND يقرر.',
        inbAge: 'معفى بسبب العمر (دون 18 أو سن AOW).', inbBeLu: 'معفى بالجنسية البلجيكية أو اللوكسمبورغية.',
        inbBusy: 'أكمل الاندماج أولاً؛ دون الشهادة أو إعفاء يُرفض الطلب.',
        inbRegOt: 'حامل الإقامة العادية الدائمة لا يحتاج شرط الاندماج للأوروبية (إلا إن حصل عليها قبل 2007).',
        bijstand: 'bijstand وParticipatiewet وWajong ليست دخلاً مستقلاً.',
        noIncome: 'لا يوجد دخل يُحسب.',
        exemptREG: 'معفى من شرط الدخل في الإقامة العادية الدائمة (10 سنوات إقامة، أو وُلدت في هولندا، أو وصلت قبل سن 3، أو إقامة قاصر عند الوالدين).',
        durOk: 'عقدك أو دخلك مستدام وفق قواعد IND.',
        durT6: 'عقد بين 6 و12 شهراً: مقبول لأن دخلك كان كافياً في آخر 12 شهراً أو 3 سنوات.',
        durFlex: 'عقد مرن أو قصير: مقبول بسجل دخل كافٍ لآخر 3 سنوات دون bijstand.',
        durFail: 'العقد لا يُعتبر مستداماً: تحتاج عقداً متبقياً منه 12 شهراً، أو سجل دخل كافٍ لآخر 12 شهراً (لعقد 6–12 شهراً) أو 3 سنوات.',
        faseA: 'عقد Fase A لا يُعامل كعقد مؤقت إلا إذا: بقي منه 12 شهراً، وuitzendbeding مستثنى صراحةً، وفيه loondoorbetalingsverplichting.',
        zzpShort: 'العمل الحر يُحسب فقط بعد 18 شهراً من الدخل.',
        benShort: 'الإعانة تُحسب فقط إذا بقي منها 12 شهراً على الأقل.',
        dga: 'مدير الشركة (DGA) يحتاج عقد عمل مع الـ BV، وإلا يُعامل كعامل مستقل.',
        sufOwn: function (a, n) { return 'دخلك ' + a + ' والمطلوب ' + n + '.'; },
        sufCouple: function (a, n) { return 'دخلكما معاً ' + a + ' والمطلوب للزوجين ' + n + '.'; },
        sufLow: 'الدخل أقل من المطلوب.',
        partnerNot: 'دخل الشريك يُحسب فقط إذا كنتما متزوجين أو بشراكة مسجلة وتسكنان معاً، وكان دخله مستداماً.'
      },
      contract: {
        vast: 'عقد دائم (vast)', t12: 'عقد مؤقت متبقٍّ منه 12 شهراً أو أكثر', t6: 'عقد متبقٍّ منه 6–12 شهراً',
        t0: 'عقد متبقٍّ منه أقل من 6 أشهر', faseA: 'عقد uitzend Fase A', flex: 'عقد مرن (uitzend/oproep/nuluren/min-max)',
        tip5: 'عقد قوي، لا يحتاج سجل دخل سابق.', tip4: 'مقبول بشرط سجل الدخل. الأفضل تمديد العقد إلى 12 شهراً قبل التقديم.',
        tip3: 'مقبول فقط بسجل 3 سنوات كامل؛ أي انقطاع أو bijstand يُسقطه.', tip1: 'ضعيف: بهذا العقد سيُرفض الطلب على الأرجح. اطلب تمديداً إلى 12 شهراً أو عقداً دائماً.',
        low: 'الراتب أقل من المطلوب، فخُصم من التقييم.'
      },
      form: {
        f6011: '<b>الاستمارة 6011</b>: <span lang="nl" dir="ltr">Aanvraag EU verblijfsvergunning langdurig ingezetene (asiel)</span>. <b>ورقياً فقط</b> بالبريد إلى: <span lang="nl" dir="ltr">IND, Postbus 9, 9560 AA Ter Apel</span>.',
        f6009: '<b>الاستمارة 6009</b>: <span lang="nl" dir="ltr">Aanvraag verblijfsvergunning EU langdurig ingezetene of regulier onbepaalde tijd</span>. <b>عبر الإنترنت بـ DigiD</b> (الدفع بـ iDEAL | Wero)، أو ورقياً بالبريد إلى <span lang="nl" dir="ltr">IND, Postbus 9, 9560 AA Ter Apel</span>.',
        f6009check: 'استمارة واحدة للمسارين: IND يفحص الإقامة الأوروبية أولاً، ثم العادية الدائمة، ثم تمديد إقامتك الحالية إن لم تستوفِ أياً منهما.',
        f503: 'اختر في القسم 2 مسار «لديّ إقامة عادية دائمة وأريد الإقامة الأوروبية» (503). إن لم تستوفِ الشروط يُرفض الطلب دون فحص آخر.',
        f6011after: 'إن رُفض الطلب بسبب الدخل أو الاندماج، يفحص IND تلقائياً تجديد إقامة اللجوء.',
        a7101: '<b>7101 Antecedentenverklaring</b>: إلزامي لكل من عمره 12 سنة أو أكثر (صفحتان، موقّعتان).',
        a7110: '<b>7110 Werkgeversverklaring</b>: واحدة لكل صاحب عمل (ولصاحب عمل الشريك)، لا يزيد عمرها عن 3 أشهر.',
        a7112: '<b>7112 Verklaring inkomen zelfstandig ondernemer</b>: يوقّعها محاسب أو إداري برقم BECON.',
        a7116: '<b>7116 Bijlage inburgeringsvereiste</b>: اختر حالتك وأرفق الإثبات (نسخ مصدّقة، إلا نسخة شهادة الاندماج).',
        a7111: '<b>7111 Bewijsmiddelen inkomen</b>: قائمة إرشادية تحدد أوراق الدخل. <b>لا ترسلها</b>.',
        cover: 'ورقة الغلاف (voorblad) مطبوعة بحجم A4، ونسخ واضحة فقط دون دبابيس، ورقم V على كل نسخة.',
        leges: function (x) { return 'الرسوم 2026: <b>' + x + ' يورو</b>. تصلك رسالة بطريقة الدفع (أو تدفع فوراً عند التقديم الإلكتروني)، ولا تُعاد عند الرفض.'; },
        timing: 'قدّم <b>قبل انتهاء إقامتك الحالية</b>، ولا تقدّم قبل اكتمال الخمس سنوات بأكثر من 3 أشهر. مهلة القرار عادة حتى 6 أشهر.'
      },
      docs: {
        vast: 'العقد الحالي + Werkgeversverklaring + قسائم آخر 3 أشهر (12 شهراً إن كان لديك ساعات إضافية).',
        t6: 'العقد أو تصريح بأن العمل مستمر 6 أشهر + Werkgeversverklaring + عن آخر 12 شهراً: كل القسائم وjaaropgave وكل العقود.',
        flex: 'العقد الحالي + Werkgeversverklaring + عن آخر 3 سنوات: كل jaaropgaven وكل عقود العمل والـ uitzend وقرارات الإعانات.',
        dga: 'إثبات نسبة الملكية + عقد العمل مع الـ BV + Werkgeversverklaring مختومة + إثبات دفع الراتب لآخر 3 أشهر + إثبات تحويل ضريبة الأجور.',
        zzp: 'الملحق 7112 مع بيانات الربح والوثائق الضريبية.',
        ben: 'قرار منح الإعانة + أحدث كشف لها.',
        aow: 'كشف AOW أو التقاعد الأحدث.',
        partner: 'أوراق دخل الشريك بالطريقة نفسها + عقد الزواج أو الشراكة المسجلة.',
        id: 'نسخة جواز السفر أو وثيقة السفر، وبطاقة الإقامة الحالية، وإن لم يكن لديك جواز ساري: شرح السبب (verklaring paspoortvereiste).',
        inb: 'شهادة الاندماج أو إثبات الإعفاء مع الملحق 7116.'
      },
      rights: [
        'لك: إقامة بلا تاريخ انتهاء، والعمل بحرية دون TWV («Arbeid vrij toegestaan, TWV niet vereist»).',
        'لك في الإقامة الأوروبية: تسهيلات للإقامة في دولة أوروبية أخرى إن استوفيت شروطها.',
        'عليك: إبلاغ IND بأي تغيير في وضعك (informatieplicht)، وإلا قد تُفرض غرامة.',
        'عليك: تجديد البطاقة كل 5 سنوات (85 يورو).',
        'انتبه: الإقامة الأوروبية قد تسقط بعد غياب 12 شهراً متتالية خارج الاتحاد الأوروبي.'
      ],
      todo: {
        permitTemp: 'غيّر غرض إقامتك إلى غرض غير مؤقت (مثلاً arbeid in loondienst أو kennismigrant)، فالسنوات بالغرض المؤقت لا تُحسب.',
        years: function (m) { return 'انتظر حتى تكتمل المدة: ينقصك نحو ' + m + ' شهراً. واصل تجديد إقامتك في وقتها.'; },
        absence: 'لا تسافر أكثر من 6 أشهر متتالية. إن تجاوزت ذلك تبدأ المدة من جديد غالباً؛ اسأل IND.',
        gap: 'اجمع كل بطاقاتك وقرارات IND القديمة، واسأل عن تاريخ بدء العدّ بعد الفجوة.',
        brp: 'سجّل عنوانك في BRP لدى بلديتك.',
        crime: 'استشر محامياً (يمكن بمساعدة قانونية toevoeging) قبل التقديم.',
        inb: 'أكمل الاندماج (شهادة أو certificaat أو Z-route) أو جهّز إثبات الإعفاء.',
        income: 'ارفع دخلك إلى المبلغ المطلوب: ساعات أكثر، أو احسب دخل الشريك المتزوج الساكن معك.',
        dur: 'اطلب من صاحب العمل تمديد العقد إلى 12 شهراً أو عقداً دائماً قبل التقديم.',
        bijstand: 'أوقف الاعتماد على bijstand؛ يجب أن يأتي الدخل من عمل أو WW/ZW أو مصدر مستقل.',
        asylumKeep: 'إلى أن تستوفي الشروط: جدّد إقامة اللجوء في وقتها (مجاناً) لتبقى إقامتك قانونية.',
        regKeep: 'إلى أن تستوفي الشروط: جدّد إقامتك الحالية قبل انتهائها.',
        natur: 'افحص أيضاً شروط التجنّس، فلها شروطها الخاصة.',
        ready: 'جهّز الأوراق وقدّم بالاستمارة الصحيحة أدناه.'
      }
    },
    nl: {
      eur: eur,
      next: 'Volgende', back: 'Vorige', show: 'Toon mijn beoordeling', again: 'Opnieuw beginnen', print: 'Afdrukken of opslaan als pdf',
      req: 'Beantwoord de verplichte vragen in deze stap.',
      step: 'Stap', of: 'van',
      statusH: 'Je verblijfssituatie nu', routeH: 'De route die bij je past', scoreH: 'Gereedheidsscore',
      contractH: 'Beoordeling arbeidscontract', formH: 'Het juiste formulier en de bijlagen', docsH: 'Documenten die je klaarlegt',
      todoH: 'Wat je nu moet doen', critH: 'De voorwaarden één voor één', rightsH: 'Rechten en plichten',
      disclaimer: 'Dit is een indicatieve gereedheidsscore op basis van de gepubliceerde IND-voorwaarden, geen officiële slagingskans en geen besluit. Alleen de IND beslist na beoordeling van je documenten.',
      ok: 'Voldaan', warn: 'Let op', fail: 'Niet voldaan', na: 'Niet van toepassing',
      ready: 'Bijna klaar om aan te vragen', close: 'Dichtbij: los de gele punten op', notyet: 'Nog niet: los eerst de rode punten op',
      eu: 'EU-langdurig ingezetene', euNl: 'type V',
      reg: 'Regulier onbepaalde tijd', regNl: 'type II',
      none: 'Nog geen route voldaan',
      stars: 'van 5',
      permit: {
        asiel_bt: 'Je hebt een <b>verblijfsvergunning asiel bepaalde tijd</b> (type III). Sinds 12 juni 2026 kun je geen asiel onbepaalde tijd meer aanvragen; je route naar permanent verblijf is <b>EU-langdurig ingezetene</b> met formulier 6011.',
        asiel_ot: 'Je hebt een <b>verblijfsvergunning asiel onbepaalde tijd</b> (type IV, gekregen vóór 12 juni 2026). Je verblijf is permanent; je vernieuwt alleen het document elke 5 jaar. Optioneel kun je <b>EU-langdurig ingezetene</b> aanvragen voor extra EU-rechten.',
        reg_bt: 'Je hebt een <b>verblijfsvergunning regulier bepaalde tijd</b> (type I).',
        reg_ot: 'Je hebt een <b>verblijfsvergunning regulier onbepaalde tijd</b> (type II). Je verblijf is permanent. Je kunt <b>EU-langdurig ingezetene</b> (type V) aanvragen als je aan de inkomenseis voldoet.',
        bluecard: 'Je hebt een <b>Europese blauwe kaart</b>. Dat is een niet-tijdelijk doel, met ruimere regels voor de verblijfsduur bij EU-langdurig.',
        chavez: 'Je hebt verblijf bij een <b>minderjarig Nederlands kind</b> (Chavez). Dat is een niet-tijdelijk doel; je kunt permanent verblijf aanvragen.',
        eu_citizen: 'Je bent <b>EU/EER-burger of Zwitser</b>. Deze hulp is niet voor jou: na 5 jaar vraag je <b>duurzaam verblijf</b> aan (leges € 85).',
        none: 'Je hebt nu geen geldige verblijfsvergunning in Nederland. Permanent verblijf vraagt 5 jaar onafgebroken rechtmatig verblijf; aanvragen kan nu niet.'
      },
      purposeTemp: 'Je huidige verblijfsdoel is <b>tijdelijk</b>. Daarmee kun je geen permanent verblijf aanvragen.',
      purposeNonTemp: 'Je huidige verblijfsdoel is <b>niet-tijdelijk</b>, dus je kunt beide routes aanvragen.',
      c: {
        permit: 'Vergunning en verblijfsdoel', years: 'Onafgebroken verblijfsduur', absence: 'Afwezigheid uit Nederland', gap: 'Geen verblijfsgat',
        brp: 'Inschrijving in de BRP', order: 'Openbare orde', inb: 'Inburgeringsvereiste',
        zelf: 'Zelfstandig inkomen', duur: 'Duurzaam inkomen', vold: 'Voldoende inkomen'
      },
      n: {
        permitAsielReg: 'Regulier onbepaalde tijd is niet mogelijk met een asielvergunning; de IND toetst formulier 6011 alleen aan EU-langdurig en bij afwijzing aan verlenging van je asielvergunning.',
        permitHasReg: 'Je hebt al regulier onbepaalde tijd.',
        permitTemp: 'Een tijdelijk doel geeft geen recht. Wijzig je verblijfsdoel (bijvoorbeeld naar arbeid of kennismigrant) zodat de jaren gaan tellen.',
        yearsEU: function (e) { return 'Jaren die tellen voor EU-langdurig: <b>' + e + '</b> van 5 (studiejaren tellen voor de helft).'; },
        yearsREG: function (e) { return 'Jaren die tellen voor regulier onbepaalde tijd: <b>' + e + '</b> van 5 (studiejaren tellen volledig, jaren vóór je 8e niet).'; },
        yearsSoon: 'Je mist minder dan 3 maanden. Dien niet eerder in dan 3 maanden vóór je de termijn haalt.',
        yearsBeLu: 'Met de Belgische of Luxemburgse nationaliteit geldt de 5-jaarseis niet voor regulier onbepaalde tijd.',
        child: 'Kinderen kunnen regulier onbepaalde tijd pas vanaf 13 jaar aanvragen.',
        absLong: 'Eén afwezigheid van meer dan 6 maanden achter elkaar onderbreekt het verblijf.',
        absTotalEU: 'Meer dan 10 maanden afwezig in totaal in 5 jaar: niet voldaan voor EU-langdurig.',
        absTotalREG: 'Herhaald lang weg (bijvoorbeeld meer dan 4 maanden per jaar, 3 jaar achter elkaar) kan betekenen dat je hoofdverblijf niet in Nederland ligt.',
        absOk: 'Je afwezigheid valt binnen de grenzen.',
        gap: 'Een verblijfsgat (te laat verlengd) kan de 5 jaar opnieuw laten beginnen. Vraag de IND of VluchtelingenWerk.',
        brpNo: 'Schrijf je in bij de gemeente (BRP) vóór je aanvraag.',
        crime: 'Strafbare feiten of lopende zaken kunnen tot afwijzing leiden. De IND weegt dit af; vraag een advocaat vóór je aanvraag.',
        inbOk: 'Je diploma of certificaat is voldoende.', inbExempt: 'Vrijstelling of ontheffing is mogelijk, maar bewijs het met bijlage 7116 en gewaarmerkte kopieën; de IND beslist.',
        inbAge: 'Vrijgesteld door je leeftijd (onder 18 of AOW-leeftijd).', inbBeLu: 'Vrijgesteld door de Belgische of Luxemburgse nationaliteit.',
        inbBusy: 'Rond eerst je inburgering af; zonder diploma of vrijstelling wordt je aanvraag afgewezen.',
        inbRegOt: 'Met regulier onbepaalde tijd geldt de inburgeringseis niet voor EU-langdurig (behalve als je die vóór 2007 kreeg).',
        bijstand: 'Bijstand, Participatiewet en Wajong zijn geen zelfstandig inkomen.',
        noIncome: 'Er is geen inkomen dat meetelt.',
        exemptREG: 'Vrijgesteld van de inkomenseis voor regulier onbepaalde tijd (10 jaar verblijf, in Nederland geboren, vóór je 3e gekomen, of als minderjarige bij je ouders).',
        durOk: 'Je contract of inkomen is duurzaam volgens de IND.',
        durT6: 'Contract van 6–12 maanden: duurzaam omdat je inkomen in de laatste 12 maanden of 3 jaar voldoende was.',
        durFlex: 'Flexibel of kort contract: duurzaam met voldoende inkomen in de laatste 3 jaar zonder bijstand.',
        durFail: 'Het contract is niet duurzaam: je hebt een contract met nog 12 maanden looptijd nodig, of voldoende inkomen in de laatste 12 maanden (contract 6–12 maanden) of 3 jaar.',
        faseA: 'Een fase A-contract telt alleen als tijdelijk contract als het nog 12 maanden loopt, het uitzendbeding is uitgesloten en er een loondoorbetalingsverplichting is.',
        zzpShort: 'Zzp-inkomen telt pas na 18 maanden.',
        benShort: 'Een uitkering telt alleen als je die nog minimaal 12 maanden krijgt.',
        dga: 'Een DGA heeft een arbeidsovereenkomst met de bv nodig, anders telt hij als zelfstandige.',
        sufOwn: function (a, n) { return 'Jouw inkomen ' + a + ', nodig ' + n + '.'; },
        sufCouple: function (a, n) { return 'Jullie inkomen samen ' + a + ', nodig voor een stel ' + n + '.'; },
        sufLow: 'Het inkomen ligt onder het normbedrag.',
        partnerNot: 'Inkomen van je partner telt alleen als jullie getrouwd of geregistreerd partner zijn en samenwonen, en het inkomen duurzaam is.'
      },
      contract: {
        vast: 'Vast contract', t12: 'Tijdelijk contract, nog 12 maanden of langer', t6: 'Contract nog 6–12 maanden',
        t0: 'Contract korter dan 6 maanden', faseA: 'Fase A-uitzendcontract', flex: 'Flexibel contract (uitzend/oproep/nuluren/min-max)',
        tip5: 'Sterk contract; geen inkomensverleden nodig.', tip4: 'Duurzaam met voldoende inkomensverleden. Beter: laat het contract eerst tot 12 maanden verlengen.',
        tip3: 'Alleen duurzaam met 3 volledige jaren inkomen; elke onderbreking of bijstand breekt het.', tip1: 'Zwak: met dit contract wordt de aanvraag waarschijnlijk afgewezen. Vraag verlenging tot 12 maanden of een vast contract.',
        low: 'Het salaris ligt onder het normbedrag; daarom lager beoordeeld.'
      },
      form: {
        f6011: '<b>Formulier 6011</b>: Aanvraag EU verblijfsvergunning langdurig ingezetene (asiel). <b>Alleen schriftelijk</b> per post naar: IND, Postbus 9, 9560 AA Ter Apel.',
        f6009: '<b>Formulier 6009</b>: Aanvraag verblijfsvergunning EU langdurig ingezetene of regulier onbepaalde tijd. <b>Online met DigiD</b> (betalen met iDEAL | Wero), of schriftelijk naar IND, Postbus 9, 9560 AA Ter Apel.',
        f6009check: 'Eén formulier voor beide routes: de IND toetst eerst EU-langdurig, dan regulier onbepaalde tijd, en anders verlenging van je huidige vergunning.',
        f503: 'Kies in deel 2 de route «ik heb regulier onbepaalde tijd en wil EU-langdurig» (503). Voldoe je niet, dan volgt afwijzing zonder verdere toets.',
        f6011after: 'Wordt je aanvraag afgewezen op inkomen of inburgering, dan beoordeelt de IND of je asielvergunning verlengd kan worden.',
        a7101: '<b>7101 Antecedentenverklaring</b>: verplicht voor iedereen vanaf 12 jaar (2 pagina’s, ondertekend).',
        a7110: '<b>7110 Werkgeversverklaring</b>: één per werkgever (ook van je partner), niet ouder dan 3 maanden.',
        a7112: '<b>7112 Verklaring inkomen zelfstandig ondernemer</b>: ondertekend door een accountant of administrateur met BECON-nummer.',
        a7116: '<b>7116 Bijlage inburgeringsvereiste</b>: kies je situatie en voeg bewijs toe (gewaarmerkte kopieën, behalve het inburgeringsdiploma).',
        a7111: '<b>7111 Bewijsmiddelen inkomen</b>: lijst die zegt welke inkomensbewijzen je nodig hebt. <b>Niet meesturen</b>.',
        cover: 'Voorblad op A4 ware grootte, alleen duidelijke kopieën zonder nietjes, met je V-nummer op elke kopie.',
        leges: function (x) { return 'Leges 2026: <b>€ ' + x + '</b>. Je krijgt een brief over betalen (of betaalt direct bij online aanvragen); bij afwijzing geen terugbetaling.'; },
        timing: 'Zorg dat de IND je aanvraag <b>vóór het verlopen van je huidige vergunning</b> heeft, en dien niet eerder in dan 3 maanden vóór je 5 jaar haalt. De beslistermijn is meestal tot 6 maanden.'
      },
      docs: {
        vast: 'Huidig contract + Werkgeversverklaring + loonstroken van 3 maanden (12 bij overwerk).',
        t6: 'Contract of verklaring dat het werk nog 6 maanden doorloopt + Werkgeversverklaring + over 12 maanden: alle loonstroken, jaaropgave en contracten.',
        flex: 'Huidig contract + Werkgeversverklaring + over 3 jaar: alle jaaropgaven, arbeids- en uitzendovereenkomsten en uitkeringsbesluiten.',
        dga: 'Bewijs aandelenbelang + arbeidsovereenkomst met de bv + Werkgeversverklaring met firmastempel + bewijs salarisbetaling 3 maanden + bewijs afdracht loonbelasting.',
        zzp: 'Bijlage 7112 met winstcijfers en belastingstukken.',
        ben: 'Toekenningsbesluit + meest recente uitkeringsspecificatie.',
        aow: 'Meest recente AOW- of pensioenspecificatie.',
        partner: 'Inkomensbewijzen van je partner op dezelfde manier + huwelijksakte of bewijs geregistreerd partnerschap.',
        id: 'Kopie paspoort of reisdocument en huidige verblijfspas; geen geldig paspoort? Leg uit waarom (verklaring paspoortvereiste).',
        inb: 'Inburgeringsdiploma of bewijs van vrijstelling met bijlage 7116.'
      },
      rights: [
        'Recht: verblijf zonder einddatum en vrij werken zonder TWV («Arbeid vrij toegestaan, TWV niet vereist»).',
        'Recht bij EU-langdurig: makkelijker verblijf in een ander EU-land als je aan de voorwaarden daar voldoet.',
        'Plicht: wijzigingen doorgeven aan de IND (informatieplicht), anders riskeer je een boete.',
        'Plicht: je document elke 5 jaar vernieuwen (€ 85).',
        'Let op: EU-langdurig kan vervallen na 12 maanden achter elkaar buiten de EU.'
      ],
      todo: {
        permitTemp: 'Wijzig je verblijfsdoel naar een niet-tijdelijk doel (bijvoorbeeld arbeid in loondienst of kennismigrant); jaren met een tijdelijk doel tellen niet.',
        years: function (m) { return 'Wacht tot je de termijn haalt: je mist nog ongeveer ' + m + ' maanden. Verleng je vergunning steeds op tijd.'; },
        absence: 'Ga niet langer dan 6 maanden achter elkaar weg. Ben je langer weg geweest, dan begint de termijn vaak opnieuw; vraag de IND.',
        gap: 'Verzamel al je oude pasjes en IND-besluiten en vraag vanaf wanneer de termijn na het gat telt.',
        brp: 'Schrijf je in bij je gemeente (BRP).',
        crime: 'Vraag vóór je aanvraag een advocaat (eventueel met toevoeging).',
        inb: 'Rond je inburgering af (diploma, certificaat of Z-route) of verzamel bewijs voor vrijstelling.',
        income: 'Verhoog je inkomen tot het normbedrag: meer uren, of tel het inkomen van je getrouwde, samenwonende partner mee.',
        dur: 'Vraag je werkgever om verlenging tot minimaal 12 maanden of een vast contract vóór je aanvraag.',
        bijstand: 'Je inkomen moet uit werk, WW/ZW of een andere zelfstandige bron komen, niet uit bijstand.',
        asylumKeep: 'Tot je voldoet: verleng je asielvergunning op tijd (gratis), zodat je rechtmatig blijft.',
        regKeep: 'Tot je voldoet: verleng je huidige vergunning vóór die verloopt.',
        natur: 'Bekijk ook de voorwaarden voor naturalisatie; die heeft eigen eisen.',
        ready: 'Verzamel de documenten en dien in met het juiste formulier hieronder.'
      }
    }
  }[lang];

  // ---------- wizard
  var form = root.querySelector('form');
  var steps = [].slice.call(form.querySelectorAll('fieldset[data-step]'));
  var out = root.querySelector('.prc-result');
  var bar = root.querySelector('.prc-progress span');
  var lbl = root.querySelector('.prc-steplabel');
  var cur = 0;

  function val(n) {
    var el = form.elements[n];
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    if (el.length && !el.tagName) { for (var i = 0; i < el.length; i++) if (el[i].checked) return el[i].value; return ''; }
    return el.value;
  }
  function num(n) { var v = parseFloat(String(val(n)).replace(',', '.')); return isNaN(v) ? null : v; }

  function refresh() {
    var p = val('permit'), src = val('src'), ct = val('contract');
    var show = {
      purpose: p === 'reg_bt',
      studyYears: p === 'reg_bt' || p === 'reg_ot' || p === 'bluecard' || p === 'chavez',
      origin: p === 'reg_bt' || p === 'chavez' || p === 'bluecard',
      contract: src === 'loon' || src === 'uitzend' || src === 'dga',
      fasea: (src === 'loon' || src === 'uitzend') && ct === 'faseA',
      hist: (src === 'loon' || src === 'uitzend' || src === 'dga') && (ct === 't6' || ct === 't0' || ct === 'flex' || ct === 'faseA'),
      salary: src === 'loon' || src === 'uitzend' || src === 'dga' || src === 'ww_zw' || src === 'wia' || src === 'aow',
      zzp: src === 'zzp',
      ben: src === 'ww_zw' || src === 'wia',
      partnerinc: val('partner') === 'yes'
    };
    [].forEach.call(form.querySelectorAll('[data-show]'), function (el) {
      var on = !!show[el.getAttribute('data-show')];
      el.hidden = !on;
      [].forEach.call(el.querySelectorAll('input,select'), function (i) { i.disabled = !on; });
    });
  }

  function go(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (s, k) { s.hidden = k !== cur; });
    bar.style.width = ((cur + 1) / steps.length * 100) + '%';
    lbl.textContent = T.step + ' ' + (cur + 1) + ' ' + T.of + ' ' + steps.length;
    root.querySelector('.prc-back').hidden = cur === 0;
    root.querySelector('.prc-next').hidden = cur === steps.length - 1;
    root.querySelector('.prc-go').hidden = cur !== steps.length - 1;
    var h = steps[cur].querySelector('legend');
    if (h && document.activeElement && root.contains(document.activeElement)) h.focus && h.setAttribute('tabindex', '-1');
  }

  function stepValid() {
    var bad = null;
    [].forEach.call(steps[cur].querySelectorAll('[required]'), function (el) {
      if (el.disabled || bad) return;
      if (el.type === 'radio') { if (!val(el.name)) bad = el; }
      else if (!String(el.value).trim()) bad = el;
    });
    var msg = root.querySelector('.prc-msg');
    msg.textContent = bad ? T.req : '';
    if (bad) bad.focus();
    return !bad;
  }

  form.addEventListener('change', refresh);
  form.addEventListener('input', refresh);
  root.querySelector('.prc-next').addEventListener('click', function () { if (stepValid()) { go(cur + 1); root.scrollIntoView({ block: 'start' }); } });
  root.querySelector('.prc-back').addEventListener('click', function () { go(cur - 1); root.scrollIntoView({ block: 'start' }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!stepValid()) return;
    out.innerHTML = render(evaluate());
    out.hidden = false;
    form.hidden = true;
    root.querySelector('.prc-nav').hidden = true;
    out.querySelector('.prc-again').addEventListener('click', function () { out.hidden = true; out.innerHTML = ''; form.hidden = false; root.querySelector('.prc-nav').hidden = false; go(0); root.scrollIntoView({ block: 'start' }); });
    out.querySelector('.prc-print').addEventListener('click', function () { window.print(); });
    out.focus();
    root.scrollIntoView({ block: 'start' });
  });

  // ---------- rules
  function crit(id, st, note) { return { id: id, st: st, note: note || '' }; }

  function evaluate() {
    var R = {};
    var p = val('permit'), purpose = val('purpose'), nat = val('nat');
    var age = num('age') || 30, years = num('years') || 0, study = Math.min(num('studyYears') || 0, years);
    var origin = val('origin') || 'none', gap = val('gap') === 'yes', absLong = num('absLong') || 0, absTotal = num('absTotal') || 0;
    var brp = val('brp') !== 'no', crime = val('crime') === 'yes', inb = val('inb');
    var src = val('src'), ct = val('contract'), sal = num('salary') || 0, vgm = val('vg') === 'monthly';
    var h12 = val('hist12') === 'yes', h36 = val('hist36') === 'yes', bij3 = val('bij3') === 'yes';
    var fa = val('fa1') && val('fa2') && val('fa3');
    var zzpM = num('zzpMonths') || 0, zzpP = num('zzpProfit') || 0, benM = num('benMonths') || 0;
    var partner = val('partner') === 'yes', pDur = val('pDur') === 'yes', pInc = partner && pDur ? (num('pIncome') || 0) : 0;
    var asylum = p === 'asiel_bt' || p === 'asiel_ot';
    var tempPurpose = p === 'reg_bt' && TEMP.indexOf(purpose) >= 0;
    R.p = p; R.asylum = asylum; R.age = age; R.nat = nat; R.src = src; R.ct = ct; R.partner = partner; R.tempPurpose = tempPurpose;

    if (p === 'eu_citizen' || p === 'none') { R.stop = true; return R; }

    // years
    var regYears = Math.max(0, years - Math.max(0, 8 - (age - years)));
    var euYears = years - study / 2;
    function yearsCrit(eff, route) {
      if (route === 'reg' && nat === 'be_lu') return crit('years', 'ok', T.n.yearsBeLu);
      var note = route === 'eu' ? T.n.yearsEU(yr(eff)) : T.n.yearsREG(yr(eff));
      if (route === 'reg' && age < 13) return crit('years', 'fail', note + ' ' + T.n.child);
      if (eff >= 5) return crit('years', 'ok', note);
      if (eff >= 4.75) return crit('years', 'warn', note + ' ' + T.n.yearsSoon);
      return crit('years', 'fail', note);
    }
    R.missingMonths = Math.max(0, Math.ceil((5 - euYears) * 12));

    function absCrit(route) {
      if (absLong > 6) return crit('absence', 'fail', T.n.absLong);
      if (absTotal > 10) return crit('absence', route === 'eu' ? 'fail' : 'warn', route === 'eu' ? T.n.absTotalEU : T.n.absTotalREG);
      return crit('absence', 'ok', T.n.absOk);
    }

    // inburgering
    function inbCrit(route) {
      if (route === 'eu' && p === 'reg_ot') return crit('inb', 'ok', T.n.inbRegOt);
      if (age < 18 || age >= 67) return crit('inb', 'ok', T.n.inbAge);
      if (nat === 'be_lu') return crit('inb', 'ok', T.n.inbBeLu);
      if (inb === 'diploma' || inb === 'cert2021' || inb === 'zroute') return crit('inb', 'ok', T.n.inbOk);
      if (inb === 'exempt_edu' || inb === 'exempt_med' || inb === 'exempt_other') return crit('inb', 'warn', T.n.inbExempt);
      return crit('inb', 'fail', T.n.inbBusy);
    }

    // income
    var regExempt = years >= 10 || ((origin === 'born' || origin === 'before3' || origin === 'minor') && age >= 18);
    var own = { zelf: 'ok', duur: 'ok', notes: [], amount: 0, durNote: '' };
    var cscore = null;
    if (src === 'bijstand') { own.zelf = 'fail'; own.duur = 'fail'; own.notes.push(T.n.bijstand); }
    else if (src === 'none') { own.zelf = 'fail'; own.duur = 'fail'; own.notes.push(T.n.noIncome); }
    else if (src === 'zzp') {
      own.amount = zzpP;
      if (zzpM < 18) { own.duur = 'fail'; own.notes.push(T.n.zzpShort); } else own.durNote = T.n.durOk;
    } else if (src === 'ww_zw' || src === 'wia') {
      own.amount = sal;
      if (benM < 12) { own.duur = 'fail'; own.notes.push(T.n.benShort); } else own.durNote = T.n.durOk;
    } else if (src === 'aow') { own.amount = sal; own.durNote = T.n.durOk; }
    else { // employment
      own.amount = sal;
      var c = ct;
      if (c === 'faseA' && !fa) { own.notes.push(T.n.faseA); c = 'flex'; }
      if (src === 'dga') own.notes.push(T.n.dga);
      if (c === 'vast' || c === 't12' || c === 'faseA') { own.durNote = T.n.durOk; cscore = 5; }
      else if (c === 't6') {
        if (h12 || h36) { own.durNote = T.n.durT6; cscore = 4; } else { own.duur = 'fail'; own.notes.push(T.n.durFail); cscore = 1; }
      } else {
        if (h36 && !bij3) { own.durNote = T.n.durFlex; cscore = 3; } else { own.duur = 'fail'; own.notes.push(T.n.durFail); cscore = 1; }
      }
    }
    var normOwn = vgm ? N.singleVg : N.single, normCpl = vgm ? N.coupleVg : N.couple;
    if (src === 'zzp') normOwn = N.zzp;
    var ownCounts = own.zelf === 'ok' && own.duur === 'ok';
    var ownAmt = ownCounts ? own.amount : 0;
    var sufOwn = own.amount >= normOwn && own.zelf === 'ok';
    var sufCpl = partner && pDur && (ownAmt + pInc) >= normCpl;
    var vold, voldNote;
    if (sufOwn) { vold = 'ok'; voldNote = T.n.sufOwn(T.eur(own.amount), T.eur(normOwn)); }
    else if (sufCpl) { vold = 'ok'; voldNote = T.n.sufCouple(T.eur(ownAmt + pInc), T.eur(normCpl)); }
    else {
      vold = 'fail';
      voldNote = (partner ? T.n.sufCouple(T.eur(ownAmt + pInc), T.eur(normCpl)) : T.n.sufOwn(T.eur(own.amount), T.eur(normOwn))) + ' ' + T.n.sufLow;
      if (partner && !pDur) voldNote += ' ' + T.n.partnerNot;
    }
    // partner can carry the whole income test even if own income does not count
    var zelfSt = own.zelf, duurSt = own.duur;
    if ((zelfSt === 'fail' || duurSt === 'fail') && sufCpl) { zelfSt = zelfSt === 'fail' ? 'warn' : zelfSt; duurSt = duurSt === 'fail' ? 'warn' : duurSt; }
    if (cscore !== null && own.amount < normOwn && !sufCpl) cscore = Math.max(1, cscore - 1);
    R.contract = cscore === null ? null : { score: cscore, type: ct === 'faseA' && !fa ? 'flex' : ct, low: own.amount < normOwn };

    function incomeCrits(route) {
      if (route === 'reg' && regExempt) {
        return [crit('zelf', 'ok', T.n.exemptREG), crit('duur', 'ok', T.n.exemptREG), crit('vold', 'ok', T.n.exemptREG)];
      }
      return [crit('zelf', zelfSt, own.zelf === 'fail' ? own.notes.join(' ') : ''),
              crit('duur', duurSt, own.duur === 'fail' ? own.notes.join(' ') : (own.durNote + (own.notes.length ? ' ' + own.notes.join(' ') : ''))),
              crit('vold', vold, voldNote)];
    }

    function common(route) {
      var list = [];
      list.push(crit('gap', gap ? 'warn' : 'ok', gap ? T.n.gap : ''));
      list.push(crit('brp', brp ? 'ok' : 'fail', brp ? '' : T.n.brpNo));
      list.push(crit('order', crime ? 'warn' : 'ok', crime ? T.n.crime : ''));
      list.push(inbCrit(route));
      return list;
    }

    // EU route
    var eu = { avail: true, list: [] };
    if (tempPurpose) eu.list.push(crit('permit', 'fail', T.n.permitTemp));
    else eu.list.push(crit('permit', 'ok', ''));
    eu.list.push(p === 'reg_ot' || p === 'asiel_ot' ? crit('years', 'ok', '') : yearsCrit(euYears, 'eu'));
    eu.list.push(absCrit('eu'));
    eu.list = eu.list.concat(common('eu'), incomeCrits('eu'));

    // REG route
    var reg = { avail: !(asylum || p === 'reg_ot'), list: [] };
    if (reg.avail) {
      reg.list.push(crit('permit', tempPurpose ? 'fail' : 'ok', tempPurpose ? T.n.permitTemp : ''));
      reg.list.push(yearsCrit(regYears, 'reg'));
      reg.list.push(absCrit('reg'));
      reg.list = reg.list.concat(common('reg'), incomeCrits('reg'));
    } else reg.why = asylum ? T.n.permitAsielReg : T.n.permitHasReg;

    function score(r) {
      var W = { permit: 15, years: 15, absence: 10, gap: 5, brp: 5, order: 5, inb: 15, zelf: 10, duur: 10, vold: 10 };
      var tot = 0, got = 0, fails = 0, warns = 0;
      r.list.forEach(function (c) { var w = W[c.id] || 5; tot += w; got += c.st === 'ok' ? w : c.st === 'warn' ? w * 0.6 : 0; if (c.st === 'fail') fails++; if (c.st === 'warn') warns++; });
      var pct = Math.round(got / tot * 100);
      if (fails) pct = Math.min(pct, 40 - Math.min(30, (fails - 1) * 10));
      else if (warns) pct = Math.min(pct, 85);
      r.pct = pct; r.fails = fails; r.warns = warns; r.stars = Math.round(pct / 10) / 2;
      return r;
    }
    R.eu = score(eu); if (reg.avail) R.reg = score(reg); else R.reg = reg;
    R.best = !R.eu.fails ? 'eu' : (reg.avail && !R.reg.fails ? 'reg' : null);
    R.inbOk = inbCrit('reg').st !== 'fail';
    R.yearsOk = euYears >= 5 || regYears >= 5;
    return R;
  }

  // ---------- render
  function stars(s) {
    var h = '';
    for (var i = 1; i <= 5; i++) h += '<span class="' + (s >= i ? 'on' : s >= i - 0.5 ? 'half' : '') + '">★</span>';
    return '<span class="prc-stars" aria-hidden="true">' + h + '</span>';
  }
  function badge(st) { return '<span class="prc-badge ' + st + '">' + T[st] + '</span>'; }
  function verdict(r) { return r.fails ? T.notyet : r.warns ? T.close : T.ready; }

  function routeCard(r, name, sub, best) {
    if (!r.avail) return '<div class="prc-route na"><h4>' + name + ' <small lang="nl" dir="ltr">' + sub + '</small></h4><p>' + badge('na') + ' ' + r.why + '</p></div>';
    var cl = r.fails ? 'fail' : r.warns ? 'warn' : 'ok';
    return '<div class="prc-route ' + cl + (best ? ' best' : '') + '"><h4>' + name + ' <small lang="nl" dir="ltr">' + sub + '</small></h4>'
      + '<div class="prc-score"><b dir="ltr">' + r.pct + '%</b>' + stars(r.stars) + '<span>' + r.stars + ' ' + T.stars + '</span></div>'
      + '<p class="prc-verdict">' + verdict(r) + '</p>'
      + '<ul class="prc-crit">' + r.list.map(function (c) {
        return '<li class="' + c.st + '">' + badge(c.st) + ' <b>' + T.c[c.id] + '</b>' + (c.note ? '<br><span>' + c.note + '</span>' : '') + '</li>';
      }).join('') + '</ul></div>';
  }

  function render(R) {
    var h = '<div class="prc-out" tabindex="-1">';
    // status
    h += '<section><h3>' + T.statusH + '</h3><p>' + T.permit[R.p] + '</p>';
    if (R.p === 'reg_bt') h += '<p>' + (R.tempPurpose ? T.purposeTemp : T.purposeNonTemp) + '</p>';
    h += '</section>';
    if (R.stop) {
      h += '<p class="prc-note">' + T.disclaimer + '</p><div class="tool-actions"><button type="button" class="tool-button prc-again">' + T.again + '</button><button type="button" class="tool-button prc-print">' + T.print + '</button></div></div>';
      return h;
    }
    // route
    h += '<section><h3>' + T.routeH + '</h3><div class="prc-routes">'
      + routeCard(R.eu, T.eu, T.euNl, R.best === 'eu')
      + routeCard(R.reg, T.reg, T.regNl, R.best === 'reg')
      + '</div><p class="prc-note">' + T.disclaimer + '</p></section>';

    // contract
    if (R.contract) {
      var cs = R.contract.score, tip = cs >= 5 ? T.contract.tip5 : cs === 4 ? T.contract.tip4 : cs === 3 ? T.contract.tip3 : T.contract.tip1;
      h += '<section><h3>' + T.contractH + '</h3><div class="prc-contract"><b>' + T.contract[R.contract.type] + '</b>'
        + '<div class="prc-score">' + stars(cs) + '<span>' + cs + ' ' + T.stars + '</span></div><p>' + tip + (R.contract.low ? ' ' + T.contract.low : '') + '</p></div></section>';
    }

    // todo
    var todo = [], main = R.best ? R[R.best] : (R.reg.list && R.reg.fails < R.eu.fails ? R.reg : R.eu);
    main.list.forEach(function (c) {
      if (c.st === 'ok') return;
      var map = { permit: T.todo.permitTemp, years: T.todo.years(R.missingMonths), absence: T.todo.absence, gap: T.todo.gap, brp: T.todo.brp, order: T.todo.crime, inb: T.todo.inb,
        zelf: R.src === 'bijstand' ? T.todo.bijstand : T.todo.income, duur: T.todo.dur, vold: T.todo.income };
      if (map[c.id] && todo.indexOf(map[c.id]) < 0) todo.push(map[c.id]);
    });
    if (!todo.length) todo.push(T.todo.ready);
    if (!R.best) todo.push(R.asylum ? T.todo.asylumKeep : T.todo.regKeep);
    if (R.yearsOk && R.inbOk) todo.push(T.todo.natur + ' <a href="' + pre + '/articles/dutch-naturalisation-guide.html">↗</a>');
    h += '<section><h3>' + T.todoH + '</h3><ol class="prc-todo">' + todo.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol></section>';

    // form
    var f = [];
    if (R.asylum) { f.push(T.form.f6011); f.push(T.form.f6011after); }
    else { f.push(T.form.f6009); f.push(R.p === 'reg_ot' ? T.form.f503 : T.form.f6009check); }
    if (R.age >= 12) f.push(T.form.a7101);
    if (['loon', 'uitzend', 'dga'].indexOf(R.src) >= 0 || R.partner) f.push(T.form.a7110);
    if (R.src === 'zzp') f.push(T.form.a7112);
    if (!(R.p === 'reg_ot')) f.push(T.form.a7116);
    f.push(T.form.a7111);
    f.push(T.form.cover);
    var leg = R.nat === 'tr' ? (R.age < 18 ? LEGES.trMinor : LEGES.tr) : (R.age < 18 ? LEGES.minor : LEGES.adult);
    f.push(T.form.leges(leg));
    f.push(T.form.timing);
    h += '<section><h3>' + T.formH + '</h3><ul class="prc-list">' + f.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></section>';

    // docs
    var d = [T.docs.id];
    var ct = R.contract ? R.contract.type : '';
    if (R.src === 'dga') d.push(T.docs.dga);
    else if (['loon', 'uitzend'].indexOf(R.src) >= 0) d.push(ct === 'vast' || ct === 't12' || ct === 'faseA' ? T.docs.vast : ct === 't6' ? T.docs.t6 : T.docs.flex);
    if (R.src === 'zzp') d.push(T.docs.zzp);
    if (R.src === 'ww_zw' || R.src === 'wia') d.push(T.docs.ben);
    if (R.src === 'aow') d.push(T.docs.aow);
    if (R.partner) d.push(T.docs.partner);
    if (R.p !== 'reg_ot') d.push(T.docs.inb);
    h += '<section><h3>' + T.docsH + '</h3><ul class="prc-list">' + d.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></section>';

    // rights
    h += '<section><h3>' + T.rightsH + '</h3><ul class="prc-list">' + T.rights.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></section>';

    h += '<div class="tool-actions"><button type="button" class="tool-button prc-again">' + T.again + '</button><button type="button" class="tool-button primary prc-print">' + T.print + '</button></div></div>';
    return h;
  }

  refresh();
  go(0);
  root.querySelector('.prc-nav').hidden = false;
  form.hidden = false;
})();
