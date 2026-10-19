/* Residence & citizenship checker (EU-langdurig ingezetene / regulier onbepaalde tijd / naturalisatie).
   Rules: IND pages, forms 6009 / 6011 / bijlage 7111 and naturalisation pages, checked 19-10-2026.
   Independent tool — not from the IND. Everything runs in the browser; nothing is stored or sent. */
(function () {
  'use strict';
  var root = document.getElementById('prc');
  if (!root) return;
  var lang = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var pre = lang === 'nl' ? '/nl' : '';
  var AR = lang === 'ar';

  // ---------- official figures (normbedragen 1 juli – 31 december 2026; leges 2026)
  var N = { single: 1635.90, singleVg: 1766.77, couple: 2337.00, coupleVg: 2523.96, zzp: 1766.77 };
  var LEGES = { adult: 254, minor: 85, tr: 85, trMinor: 46, nat: 1139, natPartner: 1454, natAsiel: 847, natAsielPartner: 1163 };
  var TEMP = ['studie', 'zoekjaar', 'aupair', 'seizoen', 'stage', 'ict', 'uitwisseling', 'medisch', 'humanitair_t', 'other_t'];
  var MONTHS = AR ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  function eur(x) { var p = x.toFixed(2).split('.'); return '<bdi dir="ltr">€ ' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + '</bdi>'; }
  function yr(x) { var s = (Math.round(x * 10) / 10).toFixed(1); return AR ? s : s.replace('.', ','); }
  function nl(s) { return '<span lang="nl" dir="ltr">' + s + '</span>'; }
  var NOW = new Date(); var NOWM = NOW.getFullYear() * 12 + NOW.getMonth();
  function mdate(abs) { return MONTHS[abs % 12] + ' ' + Math.floor(abs / 12); }

  // ---------- texts
  var T = AR ? {
    next: 'التالي', back: 'السابق', again: 'ابدأ من جديد', print: 'اطبع أو احفظ PDF', req: 'أجب عن الأسئلة المطلوبة في هذه الخطوة.',
    step: 'الخطوة', of: 'من',
    fileH: 'ملفك كما يقرؤه موظف الملفات', fileSub: 'تقييم تقديري مستقل من دليل هولندا بالعربية، وليس من IND',
    checkH: 'تنبيهات على إجاباتك', routeH: 'الإقامة الدائمة: المساران', mapH: 'خريطة طريقك إلى الجنسية',
    adviceH: 'نصيحتنا لك', natH: 'التجنّس: فحص الشروط', contractH: 'تقييم عقد العمل', formH: 'الاستمارة والملاحق الصحيحة',
    docsH: 'الأوراق التي تجهّزها', todoH: 'ما المطلوب منك الآن، بالترتيب', rightsH: 'ما لك وما عليك',
    disclaimer: 'هذا مؤشر جاهزية تقديري مبني على شروط IND المنشورة، وليس احتمال قبول رسمياً ولا قراراً، والأداة ليست تابعة لـ IND. IND وحده يقرر بعد فحص أوراقك.',
    ok: 'متحقق', warn: 'يحتاج انتباهاً', fail: 'غير متحقق', na: 'لا ينطبق', done: 'لديك',
    ready: 'جاهز تقريباً للتقديم', close: 'قريب: عالج النقاط الصفراء', notyet: 'ليس بعد: عالج النقاط الحمراء أولاً',
    eu: 'الإقامة الأوروبية الدائمة', euSub: 'EU-langdurig ingezetene · النوع V',
    reg: 'الإقامة الدائمة العادية', regSub: 'regulier onbepaalde tijd · النوع II',
    nat: 'الجنسية الهولندية', natSub: 'naturalisatie',
    stars: 'من 5', today: 'اليوم', now: 'متاح الآن', from: 'من', closed: 'ليس بعد', unavail: 'غير متاح', have: 'لديك بالفعل',
    upgrade: 'تستوفي شروط الإقامة الأوروبية: يمكنك ترقية إقامتك الدائمة إليها (254 يورو) لتحصل على حقوق إضافية داخل الاتحاد الأوروبي. هذا اختياري.',
    years: 'سنوات محسوبة', ref: 'رقم المرجع', date: 'التاريخ',
    permit: {
      asiel_bt: { t: 'إقامة لجوء محددة المدة', code: 'verblijfsvergunning asiel bepaalde tijd · النوع III', d: 'إقامة على أساس الحماية. منذ 12 يونيو 2026 تُمنح وتُجدَّد لـ 3 سنوات، والتجديد مجاني. لم يعد ممكناً طلب asiel onbepaalde tijd، فطريقك إلى الإقامة الدائمة هو الإقامة الأوروبية (6011)، وإلى الجنسية هو التجنّس.', work: 'العمل حر دون تصريح عمل (TWV).' },
      asiel_ot: { t: 'إقامة لجوء غير محددة المدة', code: 'asiel onbepaalde tijd · النوع IV', d: 'إقامتك دائمة ولا تحتاج تجديداً للحق نفسه، فقط البطاقة كل 5 سنوات. الخطوة الكبيرة التالية هي التجنّس، أو الإقامة الأوروبية إن أردت حقوق الاتحاد الأوروبي.', work: 'العمل حر دون TWV.' },
      reg_bt: { t: 'إقامة عادية محددة المدة', code: 'verblijfsvergunning regulier bepaalde tijd · النوع I', d: 'إقامة مرتبطة بغرض (شريك، عمل، دراسة…). كل شيء يتوقف على هذا الغرض: إن كان غير مؤقت فطريقك مفتوح إلى الإقامة الدائمة والجنسية، وإن كان مؤقتاً فالطريق مغلق حتى تغيّره.', work: 'حق العمل مكتوب على ظهر البطاقة ويختلف حسب الغرض.' },
      reg_ot: { t: 'إقامة عادية غير محددة المدة', code: 'regulier onbepaalde tijd · النوع II', d: 'إقامتك دائمة. يمكنك ترقيتها إلى الإقامة الأوروبية إن استوفيت شرط الدخل، والخطوة الكبيرة التالية هي التجنّس.', work: 'العمل حر دون TWV.' },
      eu_lt: { t: 'إقامة أوروبية دائمة', code: 'EU-langdurig ingezetene · النوع V', d: 'لديك أقوى إقامة لغير المواطنين: دائمة، ومعها تسهيلات داخل الاتحاد الأوروبي. الخطوة الوحيدة الباقية هي التجنّس.', work: 'العمل حر دون TWV.' },
      bluecard: { t: 'البطاقة الزرقاء الأوروبية', code: 'Europese blauwe kaart', d: 'غرضها غير مؤقت. لك قواعد أخف في حساب المدة للإقامة الأوروبية إن عشت ببطاقة زرقاء في دولة أوروبية أخرى.', work: 'العمل عند صاحب العمل وبالشروط المذكورة في إقامتك.' },
      chavez: { t: 'إقامة مع طفل هولندي قاصر', code: 'Chavez · verblijf bij minderjarig Nederlands kind', d: 'غرضها غير مؤقت، فطريقك مفتوح إلى الإقامة الدائمة والتجنّس.', work: 'العمل حر.' },
      eu_citizen: { t: 'مواطن من الاتحاد الأوروبي أو EER أو سويسرا', code: 'EU/EER-burger', d: 'لا تحتاج إقامة دائمة من هذا النوع: بعد 5 سنوات تطلب duurzaam verblijf برسوم 85 يورو. ويمكنك التجنّس بعد 5 سنوات، مع التخلي عن جنسيتك إلا في الاستثناءات.', work: 'العمل حر.' },
      none: { t: 'لا توجد إقامة سارية', code: '—', d: 'الإقامة الدائمة والتجنّس يحتاجان سنوات من الإقامة القانونية المتواصلة. ابدأ بتسوية إقامتك؛ استشر VluchtelingenWerk أو محامياً.', work: '' }
    },
    purposeTemp: 'غرض إقامتك <b>مؤقت</b> (' + nl('tijdelijk verblijfsdoel') + '): لا يمكنك بهذا الغرض طلب أي إقامة دائمة، ولا التجنّس.',
    purposeNonTemp: 'غرض إقامتك <b>غير مؤقت</b> (' + nl('niet-tijdelijk verblijfsdoel') + '): الطريق مفتوح أمامك.',
    groundRef: 'أنت <b>لاجئ</b> وفق قرارك: عند التجنّس تُعفى عادة من التخلي عن جنسيتك.',
    groundSub: 'لديك <b>حماية ثانوية</b>: عند التجنّس قد يُطلب منك التخلي عن جنسيتك، إلا إن كان ذلك مستحيلاً أو مكلفاً بشكل غير معقول.',
    groundUnk: 'افتح قرار IND (' + nl('beschikking') + ') وانظر إن كنت «vluchteling» أو «subsidiair beschermd»؛ هذا يحدد إن كنت ستتخلى عن جنسيتك عند التجنّس.',
    inc: {
      future: 'تاريخ بدء الإقامة في المستقبل. صحّح التاريخ.',
      beforeBirth: 'تاريخ بدء الإقامة قبل ولادتك حسب العمر الذي أدخلته. صحّح العمر أو التاريخ.',
      study: 'سنوات الدراسة أكثر من مدة إقامتك؛ اعتبرناها تساوي المدة كلها.',
      abs: 'أطول غياب أكبر من مجموع الغياب؛ اعتبرنا المجموع يساوي أطول غياب على الأقل.',
      otShort: 'لديك إقامة غير محددة المدة لكن مدة إقامتك أقل من 5 سنوات. هذه الإقامة تُمنح عادة بعد 5 سنوات؛ تحقق من تاريخ البدء.',
      asielOt: 'إقامة لجوء غير محددة المدة تُمنح بعد 5 سنوات على الأقل؛ تحقق من تاريخ البدء.',
      total: 'مجموع سنواتك في هولندا أقل من مدة الإقامة المتواصلة؛ تجاهلنا المجموع.',
      dp: 'سنوات السكن مع الشريك أكثر من مدة إقامتك؛ احتسبنا مدة إقامتك فقط.',
      minor: 'عمرك أقل من 18: الإقامة الدائمة والتجنّس يطلبهما عادة والداك معك. النتائج هنا للإرشاد فقط.',
      crimeNote: 'السوابق أو القضايا الجارية تؤثر على كل الطلبات، وفترات الانتظار بعدها قد تمتد سنوات.'
    },
    c: { permit: 'نوع الإقامة وغرضها', years: 'مدة الإقامة المتواصلة', absence: 'الغياب عن هولندا', gap: 'لا فجوة في الإقامة', brp: 'التسجيل في BRP', order: 'النظام العام والسوابق', inb: 'شرط الاندماج', zelf: 'دخل مستقل (zelfstandig)', duur: 'دخل مستدام (duurzaam)', vold: 'دخل كافٍ (voldoende)', age: 'العمر 18 أو أكثر', renounce: 'التخلي عن الجنسية الأصلية', income: 'شرط الدخل' },
    n: {
      permitAsielReg: 'غير متاحة لحاملي إقامة اللجوء: IND يفحص الاستمارة 6011 للإقامة الأوروبية فقط، وإن رُفضت يُفحص تجديد إقامة اللجوء.',
      permitHasReg: 'لديك هذه الإقامة بالفعل.',
      permitHasEU: 'لديك الإقامة الأوروبية بالفعل، وهي أقوى.',
      permitTemp: 'الغرض المؤقت لا يؤهل. غيّر غرض إقامتك (مثلاً إلى عمل أو kennismigrant).',
      yearsEU: function (e, d) { return 'المحسوب للإقامة الأوروبية: <b>' + yr(e) + '</b> من 5 سنوات (الدراسة بالنصف)' + (d ? '. تكتمل في <b>' + d + '</b>.' : '.'); },
      yearsREG: function (e, d) { return 'المحسوب للإقامة العادية: <b>' + yr(e) + '</b> من 5 سنوات (الدراسة كاملة، وما قبل سن 8 لا يُحسب)' + (d ? '. تكتمل في <b>' + d + '</b>.' : '.'); },
      yearsSoon: 'ينقصك أقل من 3 أشهر: يمكنك التقديم قبل اكتمال المدة بثلاثة أشهر كحد أقصى.',
      yearsBeLu: 'الجنسية البلجيكية أو اللوكسمبورغية معفاة من شرط الخمس سنوات في الإقامة العادية الدائمة.',
      child: 'الأطفال يقدّمون على الإقامة العادية الدائمة من سن 13 فقط.',
      absLong: 'غياب واحد أطول من 6 أشهر متتالية يقطع الإقامة المتواصلة، وتبدأ المدة غالباً من جديد بعد عودتك.',
      absTotalEU: 'أكثر من 10 أشهر غياب إجمالاً خلال 5 سنوات يُسقط شرط الإقامة الأوروبية.',
      absTotalREG: 'غياب طويل متكرر قد يعني أن مركز حياتك ليس في هولندا.',
      absOk: 'غيابك ضمن الحدود.',
      gap: 'فجوة في الإقامة (تجديد متأخر) قد تبدأ عدّ السنوات من جديد بعد الفجوة.',
      brpNo: 'سجّل عنوانك في البلدية (BRP) قبل التقديم.',
      crime: 'السوابق قد تؤدي للرفض. استشر محامياً قبل التقديم.',
      inbOk: 'شهادتك تكفي.', inbExempt: 'الإعفاء ممكن، لكن يجب إثباته بالملحق 7116 مع وثائق مصدّقة، وIND يقرر.',
      inbAge: 'معفى بسبب العمر (دون 18 أو سن AOW).', inbBeLu: 'معفى بالجنسية البلجيكية أو اللوكسمبورغية.',
      inbBusy: 'أكمل الاندماج أولاً؛ دون الشهادة أو إعفاء يُرفض الطلب.',
      inbRegOt: 'حامل الإقامة العادية الدائمة لا يحتاج شرط الاندماج للأوروبية (إلا إن حصل عليها قبل 2007).',
      bijstand: 'bijstand وParticipatiewet وWajong ليست دخلاً مستقلاً.',
      noIncome: 'لا يوجد دخل يُحسب.',
      exemptREG: 'معفى من شرط الدخل هنا (10 سنوات إقامة، أو وُلدت في هولندا، أو وصلت قبل سن 3، أو إقامة قاصر عند الوالدين).',
      durOk: 'عقدك أو دخلك مستدام وفق قواعد IND.',
      durT6: 'عقد 6–12 شهراً مقبول لأن دخلك كان كافياً في آخر 12 شهراً أو 3 سنوات.',
      durFlex: 'عقد مرن أو قصير مقبول بسجل دخل كافٍ لآخر 3 سنوات دون bijstand.',
      durFail: 'العقد لا يُعتبر مستداماً: تحتاج عقداً متبقياً منه 12 شهراً، أو سجل دخل كافٍ لآخر 12 شهراً (لعقد 6–12 شهراً) أو 3 سنوات.',
      faseA: 'عقد Fase A لا يُعامل كعقد مؤقت إلا إذا بقي منه 12 شهراً، وuitzendbeding مستثنى صراحةً، وفيه loondoorbetalingsverplichting.',
      zzpShort: 'العمل الحر يُحسب فقط بعد 18 شهراً من الدخل.',
      benShort: 'الإعانة تُحسب فقط إذا بقي منها 12 شهراً على الأقل.',
      dga: 'مدير الشركة (DGA) يحتاج عقد عمل مع الـ BV.',
      sufOwn: function (a, n) { return 'دخلك ' + a + ' والمطلوب ' + n + '.'; },
      sufCouple: function (a, n) { return 'دخلكما معاً ' + a + ' والمطلوب للزوجين ' + n + '.'; },
      sufLow: 'الدخل أقل من المطلوب.',
      partnerNot: 'دخل الشريك يُحسب فقط إذا كان مستداماً.',
      natNoIncome: 'التجنّس لا يشترط أي دخل.',
      natYears: function (rule, d) { return 'القاعدة التي تنطبق عليك: <b>' + rule + '</b>' + (d ? '. تستوفيها في <b>' + d + '</b>.' : '.'); },
      rule5: '5 سنوات إقامة متواصلة', rule3p: '3 سنوات سكن مع شريك هولندي + 3 سنوات إقامة', rule2: 'سنتان إقامة متواصلة + 10 سنوات إجمالاً', rule3s: '3 سنوات (بلا جنسية)',
      natPermitTemp: 'التجنّس يحتاج يوم التقديم إقامة دائمة أو بغرض غير مؤقت. غيّر غرضك أولاً.',
      natAge: 'التجنّس للبالغين؛ القاصر يتجنّس مع والديه (مجاناً تقريباً: 168 يورو لكل طفل).',
      renRef: 'معفى غالباً: أنت لاجئ.', renMarried: 'معفى: متزوج من هولندي أو بشراكة مسجلة.', renBorn: 'معفى غالباً: وُلدت في هولندا وتسكن فيها.',
      renSub: 'قد يُطلب منك التخلي عن جنسيتك (حماية ثانوية). الاستثناء ممكن إن كان التخلي مستحيلاً أو مكلفاً بشكل غير معقول، مع إثبات.',
      renUnk: 'تحقق من قرارك: اللاجئ معفى، وصاحب الحماية الثانوية قد يُطلب منه التخلي.',
      renDefault: 'يجب عادة التخلي عن جنسيتك الأصلية، إلا إن كان قانون بلدك يمنع ذلك أو كان مكلفاً بشكل غير معقول.',
      renStateless: 'لا جنسية لديك لتتخلى عنها.',
      renEU: 'يجب عادة التخلي عن جنسيتك الأوروبية، إلا في الاستثناءات (مثل الزواج من هولندي).'
    },
    adv: {
      natBetter: function (d) { return '<b>طريقك الأذكى قد يكون الجنسية مباشرة:</b> دخلك لا يكفي للإقامة الدائمة، لكن التجنّس لا يشترط دخلاً. ركّز على الاندماج (A2) وقدّم للتجنّس عبر البلدية' + (d ? ' من <b>' + d + '</b>' : '') + '.'; },
      both: 'تستوفي شروط الإقامة الدائمة، فاطلبها الآن: هي أرخص وأسرع، وتحميك إن طالت إجراءات التجنّس أو تغيّرت قواعدها.',
      asielRenew: function (d) { return 'جدّد إقامة اللجوء قبل انتهائها دائماً' + (d ? '؛ أقرب موعد مهم لك: <b>' + d + '</b>' : '') + '. فجوة واحدة قد تعيد عدّ السنوات من الصفر.'; },
      partner: function (d) { return '<b>شريكك هولندي:</b> يمكنك التجنّس بعد 3 سنوات سكن معاً' + (d ? '، أي من <b>' + d + '</b>' : '') + '، دون انتظار 5 سنوات.'; },
      contract: 'عقدك هو نقطة الضعف: اطلب من صاحب العمل تمديده إلى 12 شهراً أو عقداً دائماً قبل التقديم، فيصبح ملفك قوياً.',
      inb: 'الاندماج هو المفتاح: بدونه لا إقامة دائمة ولا جنسية. اجعله أولويتك الأولى.',
      temp: 'غرضك المؤقت يغلق كل الأبواب. أول خطوة: غيّر الغرض (مثلاً من zoekjaar إلى kennismigrant، أو من الدراسة إلى عمل).',
      absence: 'سفرك الطويل قطع المدة على الأرجح. احسب السنوات من تاريخ عودتك، وتجنّب أي غياب أطول من 6 أشهر.',
      haveOT: 'إقامتك دائمة بالفعل، فلا تدفع رسوماً لطلب إقامة دائمة أخرى إلا إن أردت حقوق الاتحاد الأوروبي. الخطوة المنطقية التالية هي التجنّس.',
      wait: function (d) { return 'لم تكتمل المدة بعد. واصل التجديد في وقته، وجهّز الاندماج والعقد الآن، لتقدّم مباشرة في <b>' + d + '</b>.'; },
      tenYears: 'عشت 10 سنوات أو أكثر: أنت معفى من شرط الدخل في الإقامة العادية الدائمة، حتى لو لم يكفِ دخلك للأوروبية.'
    },
    map: {
      now: function (t) { return 'اليوم: ' + t; },
      eu: 'الإقامة الأوروبية الدائمة', reg: 'الإقامة الدائمة العادية', nat: 'الجنسية الهولندية',
      euNote: 'الدخل + الاندماج + 5 سنوات', regNote: 'الدخل (أو إعفاء) + A2 + 5 سنوات', natNote: 'A2 + لا شرط دخل',
      renew: 'جدّد الإقامة في وقتها', change: 'غيّر غرض الإقامة إلى غير مؤقت', closed: 'غير متاح لنوع إقامتك',
      missing: 'ينقصك: ', inb: 'الاندماج', income: 'الدخل', years: 'المدة', absence: 'الغياب', brp: 'BRP', permit: 'الغرض'
    },
    contract: {
      vast: 'عقد دائم (vast)', t12: 'عقد مؤقت متبقٍّ منه 12 شهراً أو أكثر', t6: 'عقد متبقٍّ منه 6–12 شهراً',
      t0: 'عقد متبقٍّ منه أقل من 6 أشهر', faseA: 'عقد uitzend Fase A', flex: 'عقد مرن (uitzend/oproep/nuluren/min-max)',
      tip5: 'عقد قوي، لا يحتاج سجل دخل سابق.', tip4: 'مقبول بشرط سجل الدخل. الأفضل تمديد العقد إلى 12 شهراً قبل التقديم.',
      tip3: 'مقبول فقط بسجل 3 سنوات كامل؛ أي انقطاع أو bijstand يُسقطه.', tip1: 'ضعيف: بهذا العقد سيُرفض الطلب على الأرجح. اطلب تمديداً إلى 12 شهراً أو عقداً دائماً.',
      low: 'الراتب أقل من المطلوب، فخُصم من التقييم.'
    },
    form: {
      f6011: '<b>للإقامة الدائمة: الاستمارة 6011</b> (' + nl('Aanvraag EU verblijfsvergunning langdurig ingezetene, asiel') + '). <b>ورقياً فقط</b> بالبريد إلى ' + nl('IND, Postbus 9, 9560 AA Ter Apel') + '.',
      f6009: '<b>للإقامة الدائمة: الاستمارة 6009</b> (' + nl('EU langdurig ingezetene of regulier onbepaalde tijd') + '). <b>عبر الإنترنت بـ DigiD</b> (iDEAL | Wero)، أو ورقياً إلى ' + nl('IND, Postbus 9, 9560 AA Ter Apel') + '.',
      f6009check: 'استمارة واحدة للمسارين: IND يفحص الأوروبية أولاً، ثم العادية الدائمة، ثم تمديد إقامتك الحالية.',
      f503: 'اختر في القسم 2 المسار 503 («لديّ إقامة دائمة وأريد الأوروبية»). إن لم تستوفِ الشروط يُرفض دون فحص آخر.',
      f6011after: 'إن رُفض الطلب بسبب الدخل أو الاندماج، يفحص IND تلقائياً تجديد إقامة اللجوء.',
      natForm: '<b>للجنسية:</b> لا استمارة تحمّلها؛ تحجز موعداً في <b>البلدية</b>، والموظف يملأ الطلب معك ويرسله إلى IND. تدفع عند التقديم، والقرار خلال 12 شهراً، ثم حفل التجنّس خلال سنة.',
      a7101: '<b>7101 Antecedentenverklaring</b>: إلزامي لكل من عمره 12 فأكثر.',
      a7110: '<b>7110 Werkgeversverklaring</b>: واحدة لكل صاحب عمل، لا يزيد عمرها عن 3 أشهر.',
      a7112: '<b>7112 Verklaring inkomen zelfstandig ondernemer</b>: يوقّعها محاسب برقم BECON.',
      a7116: '<b>7116 Bijlage inburgeringsvereiste</b>: إثبات الاندماج أو الإعفاء (نسخ مصدّقة، إلا نسخة شهادة الاندماج).',
      a7111: '<b>7111 Bewijsmiddelen inkomen</b>: قائمة إرشادية بأوراق الدخل. <b>لا ترسلها</b>.',
      cover: 'ورقة الغلاف (voorblad) بحجم A4، ونسخ واضحة فقط دون دبابيس، ورقم V على كل نسخة.',
      leges: function (x) { return 'رسوم الإقامة الدائمة 2026: <b>' + x + ' يورو</b>، ولا تُعاد عند الرفض.'; },
      natLeges: function (x, y) { return 'رسوم التجنّس 2026: <b>' + x + ' يورو</b> وحدك، أو <b>' + y + ' يورو</b> مع الشريك.'; },
      timing: 'قدّم <b>قبل انتهاء إقامتك الحالية</b>، ولا تقدّم قبل اكتمال الخمس سنوات بأكثر من 3 أشهر. القرار عادة خلال 6 أشهر.'
    },
    docs: {
      vast: 'العقد الحالي + Werkgeversverklaring + قسائم آخر 3 أشهر (12 شهراً إن كان لديك ساعات إضافية).',
      t6: 'العقد أو تصريح بأن العمل مستمر 6 أشهر + Werkgeversverklaring + عن آخر 12 شهراً: كل القسائم وjaaropgave وكل العقود.',
      flex: 'العقد الحالي + Werkgeversverklaring + عن آخر 3 سنوات: كل jaaropgaven وكل عقود العمل والـ uitzend وقرارات الإعانات.',
      dga: 'إثبات نسبة الملكية + عقد العمل مع الـ BV + Werkgeversverklaring مختومة + إثبات دفع الراتب لآخر 3 أشهر + إثبات تحويل ضريبة الأجور.',
      zzp: 'الملحق 7112 مع بيانات الربح والوثائق الضريبية.', ben: 'قرار منح الإعانة + أحدث كشف لها.', aow: 'كشف AOW أو التقاعد الأحدث.',
      partner: 'أوراق دخل الشريك بالطريقة نفسها + عقد الزواج أو الشراكة المسجلة.',
      id: 'نسخة جواز السفر أو وثيقة السفر، وبطاقة الإقامة الحالية؛ وإن لم يكن لديك جواز ساري: شرح السبب.',
      inb: 'شهادة الاندماج أو إثبات الإعفاء مع الملحق 7116.',
      nat: 'للتجنّس: جواز سفر ساري أو وثيقة سفر، شهادة الميلاد (مصدّقة ومترجمة إن طُلبت)، شهادة الاندماج، وإثبات التخلي عن الجنسية أو الإعفاء منه.'
    },
    rights: [
      'لك مع الإقامة الدائمة: إقامة بلا تاريخ انتهاء، والعمل بحرية دون TWV.',
      'لك مع الجنسية: جواز سفر هولندي، وحق التصويت، والسفر بحرية، ولا تحتاج إقامة بعد ذلك.',
      'عليك: إبلاغ IND بأي تغيير في وضعك (informatieplicht)، وإلا قد تُفرض غرامة.',
      'عليك: تجديد بطاقة الإقامة الدائمة كل 5 سنوات (85 يورو).',
      'انتبه: الإقامة الأوروبية قد تسقط بعد غياب 12 شهراً متتالية خارج الاتحاد الأوروبي.'
    ],
    todo: {
      permitTemp: 'غيّر غرض إقامتك إلى غرض غير مؤقت؛ السنوات بالغرض المؤقت لا تفتح لك الإقامة الدائمة.',
      years: function (d) { return 'انتظر حتى تكتمل المدة في <b>' + d + '</b>. واصل تجديد إقامتك في وقتها.'; },
      absence: 'لا تسافر أكثر من 6 أشهر متتالية.', gap: 'اجمع كل بطاقاتك وقرارات IND القديمة، واسأل عن تاريخ بدء العدّ بعد الفجوة.',
      brp: 'سجّل عنوانك في BRP لدى بلديتك.', crime: 'استشر محامياً (يمكن بمساعدة قانونية toevoeging) قبل التقديم.',
      inb: 'أكمل الاندماج (شهادة أو certificaat أو Z-route) أو جهّز إثبات الإعفاء.',
      income: 'ارفع دخلك إلى المبلغ المطلوب: ساعات أكثر، أو احسب دخل الشريك المتزوج الساكن معك.',
      dur: 'اطلب تمديد العقد إلى 12 شهراً أو عقداً دائماً قبل التقديم.', bijstand: 'يجب أن يأتي الدخل من عمل أو WW/ZW، لا من bijstand.',
      asylumKeep: 'جدّد إقامة اللجوء في وقتها (مجاناً) لتبقى إقامتك قانونية.', regKeep: 'جدّد إقامتك الحالية قبل انتهائها.',
      ready: 'جهّز الأوراق وقدّم بالاستمارة الصحيحة أدناه.', natReady: 'احجز موعداً في البلدية لطلب التجنّس.'
    }
  } : {
    next: 'Volgende', back: 'Vorige', again: 'Opnieuw beginnen', print: 'Afdrukken of opslaan als pdf', req: 'Beantwoord de verplichte vragen in deze stap.',
    step: 'Stap', of: 'van',
    fileH: 'Je dossier zoals een behandelaar het leest', fileSub: 'Onafhankelijke indicatieve beoordeling door Nederlandsgids, niet door de IND',
    checkH: 'Opmerkingen bij je antwoorden', routeH: 'Permanent verblijf: de twee routes', mapH: 'Je routekaart naar het Nederlanderschap',
    adviceH: 'Ons advies', natH: 'Naturalisatie: de voorwaarden', contractH: 'Beoordeling arbeidscontract', formH: 'Het juiste formulier en de bijlagen',
    docsH: 'Documenten die je klaarlegt', todoH: 'Wat je nu moet doen, op volgorde', rightsH: 'Rechten en plichten',
    disclaimer: 'Dit is een indicatieve gereedheidsscore op basis van de gepubliceerde IND-voorwaarden, geen officiële slagingskans en geen besluit, en deze hulp is niet van de IND. Alleen de IND beslist na beoordeling van je documenten.',
    ok: 'Voldaan', warn: 'Let op', fail: 'Niet voldaan', na: 'N.v.t.', done: 'Heb je al',
    ready: 'Bijna klaar om aan te vragen', close: 'Dichtbij: los de gele punten op', notyet: 'Nog niet: los eerst de rode punten op',
    eu: 'EU-langdurig ingezetene', euSub: 'type V', reg: 'Regulier onbepaalde tijd', regSub: 'type II', nat: 'Nederlanderschap', natSub: 'naturalisatie',
    stars: 'van 5', today: 'Vandaag', now: 'Nu mogelijk', from: 'Vanaf', closed: 'Nog niet', unavail: 'Niet mogelijk', have: 'Heb je al',
    upgrade: 'Je voldoet aan EU-langdurig: je kunt je permanente vergunning daarnaar omzetten (€ 254) voor extra EU-rechten. Dat is optioneel.',
    years: 'jaar telt', ref: 'Kenmerk', date: 'Datum',
    permit: {
      asiel_bt: { t: 'Asiel bepaalde tijd', code: 'type III', d: 'Verblijf op grond van bescherming. Sinds 12 juni 2026 voor 3 jaar verleend en verlengd, gratis. Asiel onbepaalde tijd aanvragen kan niet meer; je route naar permanent verblijf is EU-langdurig (6011), naar het Nederlanderschap naturalisatie.', work: 'Arbeid vrij toegestaan, geen TWV nodig.' },
      asiel_ot: { t: 'Asiel onbepaalde tijd', code: 'type IV', d: 'Je verblijf is permanent; alleen het document vernieuw je elke 5 jaar. De volgende grote stap is naturalisatie, of EU-langdurig voor extra EU-rechten.', work: 'Arbeid vrij, geen TWV.' },
      reg_bt: { t: 'Regulier bepaalde tijd', code: 'type I', d: 'Verblijf gekoppeld aan een doel (partner, werk, studie…). Alles hangt van dat doel af: niet-tijdelijk opent de weg naar permanent verblijf en naturalisatie, tijdelijk sluit hem tot je het doel wijzigt.', work: 'Je arbeidsrecht staat op de achterkant van je pas en hangt van het doel af.' },
      reg_ot: { t: 'Regulier onbepaalde tijd', code: 'type II', d: 'Je verblijf is permanent. Je kunt EU-langdurig aanvragen als je aan de inkomenseis voldoet; de volgende grote stap is naturalisatie.', work: 'Arbeid vrij, geen TWV.' },
      eu_lt: { t: 'EU-langdurig ingezetene', code: 'type V', d: 'De sterkste vergunning voor niet-Nederlanders: permanent en met EU-voordelen. Alleen naturalisatie is nog een stap verder.', work: 'Arbeid vrij, geen TWV.' },
      bluecard: { t: 'Europese blauwe kaart', code: 'blue card', d: 'Niet-tijdelijk doel, met ruimere termijnen voor EU-langdurig als je met een blauwe kaart in een ander EU-land woonde.', work: 'Werk volgens de voorwaarden van je vergunning.' },
      chavez: { t: 'Verblijf bij minderjarig Nederlands kind', code: 'Chavez', d: 'Niet-tijdelijk doel: de weg naar permanent verblijf en naturalisatie ligt open.', work: 'Arbeid vrij.' },
      eu_citizen: { t: 'EU/EER-burger of Zwitser', code: 'EU-recht', d: 'Je hebt dit permanente verblijf niet nodig: na 5 jaar vraag je duurzaam verblijf aan (€ 85). Naturaliseren kan na 5 jaar, met afstand van je nationaliteit behalve bij uitzonderingen.', work: 'Arbeid vrij.' },
      none: { t: 'Geen geldige vergunning', code: '—', d: 'Permanent verblijf en naturalisatie vragen jaren onafgebroken rechtmatig verblijf. Regel eerst je verblijf; vraag VluchtelingenWerk of een advocaat.', work: '' }
    },
    purposeTemp: 'Je verblijfsdoel is <b>tijdelijk</b>: daarmee kun je geen permanent verblijf aanvragen en niet naturaliseren.',
    purposeNonTemp: 'Je verblijfsdoel is <b>niet-tijdelijk</b>: de weg ligt open.',
    groundRef: 'Je bent <b>vluchteling</b> volgens je beschikking: bij naturalisatie hoef je meestal geen afstand te doen van je nationaliteit.',
    groundSub: 'Je hebt <b>subsidiaire bescherming</b>: bij naturalisatie kan afstand doen nodig zijn, tenzij dat onmogelijk of onredelijk duur is.',
    groundUnk: 'Kijk in je IND-beschikking of je «vluchteling» of «subsidiair beschermd» bent; dat bepaalt of je bij naturalisatie afstand moet doen.',
    inc: {
      future: 'De startdatum ligt in de toekomst. Pas de datum aan.', beforeBirth: 'De startdatum ligt vóór je geboorte volgens je leeftijd. Pas leeftijd of datum aan.',
      study: 'Meer studiejaren dan verblijfsjaren; we nemen de hele periode als studie.', abs: 'Langste afwezigheid is groter dan het totaal; we nemen het totaal minimaal gelijk.',
      otShort: 'Je hebt onbepaalde tijd maar minder dan 5 jaar verblijf. Die vergunning komt meestal na 5 jaar; controleer de startdatum.',
      asielOt: 'Asiel onbepaalde tijd komt na minstens 5 jaar; controleer de startdatum.',
      total: 'Totaal aantal jaren is lager dan je onafgebroken verblijf; we negeren het totaal.',
      dp: 'Meer jaren samenwonen dan verblijfsjaren; we rekenen met je verblijfsduur.',
      minor: 'Je bent jonger dan 18: permanent verblijf en naturalisatie vragen je ouders meestal mee aan. De uitkomst is indicatief.',
      crimeNote: 'Strafbare feiten raken alle aanvragen; wachttijden daarna kunnen jaren duren.'
    },
    c: { permit: 'Vergunning en verblijfsdoel', years: 'Onafgebroken verblijfsduur', absence: 'Afwezigheid uit Nederland', gap: 'Geen verblijfsgat', brp: 'Inschrijving in de BRP', order: 'Openbare orde', inb: 'Inburgeringsvereiste', zelf: 'Zelfstandig inkomen', duur: 'Duurzaam inkomen', vold: 'Voldoende inkomen', age: '18 jaar of ouder', renounce: 'Afstand van oude nationaliteit', income: 'Inkomenseis' },
    n: {
      permitAsielReg: 'Niet mogelijk met een asielvergunning: formulier 6011 toetst alleen EU-langdurig en bij afwijzing verlenging van je asielvergunning.',
      permitHasReg: 'Deze vergunning heb je al.', permitHasEU: 'Je hebt EU-langdurig al; die is sterker.',
      permitTemp: 'Een tijdelijk doel geeft geen recht. Wijzig je verblijfsdoel (bijv. arbeid of kennismigrant).',
      yearsEU: function (e, d) { return 'Telt voor EU-langdurig: <b>' + yr(e) + '</b> van 5 jaar (studie half)' + (d ? '. Vol in <b>' + d + '</b>.' : '.'); },
      yearsREG: function (e, d) { return 'Telt voor regulier: <b>' + yr(e) + '</b> van 5 jaar (studie volledig, vóór je 8e niet)' + (d ? '. Vol in <b>' + d + '</b>.' : '.'); },
      yearsSoon: 'Je mist minder dan 3 maanden: je mag tot 3 maanden vóór de termijn aanvragen.',
      yearsBeLu: 'Met de Belgische of Luxemburgse nationaliteit geldt de 5-jaarseis niet voor regulier onbepaalde tijd.',
      child: 'Kinderen vragen regulier onbepaalde tijd pas vanaf 13 jaar aan.',
      absLong: 'Eén afwezigheid van meer dan 6 maanden onderbreekt het verblijf; de termijn begint dan vaak opnieuw.',
      absTotalEU: 'Meer dan 10 maanden weg in totaal in 5 jaar: niet voldaan voor EU-langdurig.',
      absTotalREG: 'Herhaald lang weg kan betekenen dat je hoofdverblijf niet in Nederland ligt.', absOk: 'Je afwezigheid valt binnen de grenzen.',
      gap: 'Een verblijfsgat (te laat verlengd) kan de termijn opnieuw laten beginnen.', brpNo: 'Schrijf je in bij de gemeente (BRP) vóór je aanvraag.',
      crime: 'Strafbare feiten kunnen tot afwijzing leiden. Vraag een advocaat.',
      inbOk: 'Je diploma of certificaat is voldoende.', inbExempt: 'Vrijstelling is mogelijk, maar bewijs het met bijlage 7116 en gewaarmerkte kopieën; de IND beslist.',
      inbAge: 'Vrijgesteld door je leeftijd (onder 18 of AOW-leeftijd).', inbBeLu: 'Vrijgesteld door de Belgische of Luxemburgse nationaliteit.',
      inbBusy: 'Rond eerst je inburgering af; anders wordt je aanvraag afgewezen.',
      inbRegOt: 'Met regulier onbepaalde tijd geldt de inburgeringseis niet voor EU-langdurig (behalve als je die vóór 2007 kreeg).',
      bijstand: 'Bijstand, Participatiewet en Wajong zijn geen zelfstandig inkomen.', noIncome: 'Er is geen inkomen dat meetelt.',
      exemptREG: 'Hier vrijgesteld van de inkomenseis (10 jaar verblijf, geboren in NL, vóór je 3e gekomen, of als minderjarige bij je ouders).',
      durOk: 'Je contract of inkomen is duurzaam volgens de IND.', durT6: 'Contract 6–12 maanden: duurzaam omdat je inkomen de laatste 12 maanden of 3 jaar voldoende was.',
      durFlex: 'Flexibel of kort contract: duurzaam met voldoende inkomen in de laatste 3 jaar zonder bijstand.',
      durFail: 'Niet duurzaam: je hebt een contract met nog 12 maanden nodig, of voldoende inkomen in de laatste 12 maanden (contract 6–12 maanden) of 3 jaar.',
      faseA: 'Fase A telt alleen als tijdelijk contract als het nog 12 maanden loopt, het uitzendbeding is uitgesloten en er een loondoorbetalingsverplichting is.',
      zzpShort: 'Zzp-inkomen telt pas na 18 maanden.', benShort: 'Een uitkering telt alleen als je die nog 12 maanden krijgt.', dga: 'Een DGA heeft een arbeidsovereenkomst met de bv nodig.',
      sufOwn: function (a, n) { return 'Jouw inkomen ' + a + ', nodig ' + n + '.'; }, sufCouple: function (a, n) { return 'Samen ' + a + ', nodig voor een stel ' + n + '.'; },
      sufLow: 'Het inkomen ligt onder het normbedrag.', partnerNot: 'Inkomen van je partner telt alleen als het duurzaam is.',
      natNoIncome: 'Naturalisatie heeft geen inkomenseis.',
      natYears: function (rule, d) { return 'De regel die voor jou geldt: <b>' + rule + '</b>' + (d ? '. Je haalt die in <b>' + d + '</b>.' : '.'); },
      rule5: '5 jaar onafgebroken verblijf', rule3p: '3 jaar samenwonen met een Nederlandse partner + 3 jaar verblijf', rule2: '2 jaar onafgebroken + 10 jaar in totaal', rule3s: '3 jaar (staatloos)',
      natPermitTemp: 'Bij naturalisatie heb je op de aanvraagdatum een permanente of niet-tijdelijke vergunning nodig. Wijzig eerst je doel.',
      natAge: 'Naturalisatie is voor volwassenen; een kind naturaliseert mee met een ouder (€ 168 per kind).',
      renRef: 'Meestal vrijgesteld: je bent vluchteling.', renMarried: 'Vrijgesteld: getrouwd of geregistreerd met een Nederlander.', renBorn: 'Meestal vrijgesteld: in Nederland geboren en hier wonend.',
      renSub: 'Afstand doen kan nodig zijn (subsidiaire bescherming). Uitzondering mogelijk als afstand onmogelijk of onredelijk duur is, met bewijs.',
      renUnk: 'Controleer je beschikking: een vluchteling is vrijgesteld, bij subsidiaire bescherming kan afstand nodig zijn.',
      renDefault: 'Meestal moet je afstand doen van je nationaliteit, tenzij je land dat niet toestaat of het onredelijk duur is.',
      renStateless: 'Je hebt geen nationaliteit om afstand van te doen.', renEU: 'Meestal afstand van je EU-nationaliteit, behalve bij uitzonderingen (zoals huwelijk met een Nederlander).'
    },
    adv: {
      natBetter: function (d) { return '<b>Je slimste route is misschien direct naturalisatie:</b> je inkomen is te laag voor permanent verblijf, maar naturalisatie heeft geen inkomenseis. Focus op inburgering (A2) en vraag aan via de gemeente' + (d ? ' vanaf <b>' + d + '</b>' : '') + '.'; },
      both: 'Je voldoet aan permanent verblijf: vraag dat nu aan. Het is goedkoper en sneller, en beschermt je als naturalisatie lang duurt of de regels veranderen.',
      asielRenew: function (d) { return 'Verleng je asielvergunning altijd vóór de vervaldatum' + (d ? '; belangrijkste datum: <b>' + d + '</b>' : '') + '. Eén gat kan de termijn opnieuw laten beginnen.'; },
      partner: function (d) { return '<b>Je partner is Nederlander:</b> je kunt na 3 jaar samenwonen naturaliseren' + (d ? ', dus vanaf <b>' + d + '</b>' : '') + ', zonder 5 jaar te wachten.'; },
      contract: 'Je contract is het zwakke punt: vraag verlenging tot 12 maanden of een vast contract vóór je aanvraag.',
      inb: 'Inburgering is de sleutel: zonder geen permanent verblijf en geen naturalisatie. Maak het je eerste prioriteit.',
      temp: 'Je tijdelijke doel sluit alle deuren. Eerste stap: wijzig het doel (bijv. zoekjaar → kennismigrant, studie → arbeid).',
      absence: 'Je lange afwezigheid heeft de termijn waarschijnlijk onderbroken. Reken vanaf je terugkeer en blijf nooit langer dan 6 maanden weg.',
      haveOT: 'Je verblijf is al permanent; betaal niet voor nog een permanente vergunning tenzij je de EU-rechten wilt. De logische volgende stap is naturalisatie.',
      wait: function (d) { return 'De termijn is nog niet vol. Blijf op tijd verlengen en regel nu inburgering en contract, zodat je direct in <b>' + d + '</b> kunt aanvragen.'; },
      tenYears: 'Je woont hier 10 jaar of langer: vrijgesteld van de inkomenseis voor regulier onbepaalde tijd, ook als je inkomen te laag is voor EU-langdurig.'
    },
    map: {
      now: function (t) { return 'Vandaag: ' + t; }, eu: 'EU-langdurig ingezetene', reg: 'Regulier onbepaalde tijd', nat: 'Nederlanderschap',
      euNote: 'inkomen + inburgering + 5 jaar', regNote: 'inkomen (of vrijstelling) + A2 + 5 jaar', natNote: 'A2 + geen inkomenseis',
      renew: 'Verleng op tijd', change: 'Wijzig naar een niet-tijdelijk doel', closed: 'Niet mogelijk met jouw vergunning',
      missing: 'Je mist: ', inb: 'inburgering', income: 'inkomen', years: 'duur', absence: 'afwezigheid', brp: 'BRP', permit: 'doel'
    },
    contract: {
      vast: 'Vast contract', t12: 'Tijdelijk, nog 12 maanden of langer', t6: 'Contract nog 6–12 maanden', t0: 'Contract korter dan 6 maanden', faseA: 'Fase A-uitzendcontract', flex: 'Flexibel contract',
      tip5: 'Sterk contract; geen inkomensverleden nodig.', tip4: 'Duurzaam met voldoende inkomensverleden. Beter: eerst verlengen tot 12 maanden.',
      tip3: 'Alleen duurzaam met 3 volledige jaren inkomen; elke onderbreking of bijstand breekt het.', tip1: 'Zwak: met dit contract volgt waarschijnlijk afwijzing. Vraag verlenging tot 12 maanden of een vast contract.',
      low: 'Het salaris ligt onder het normbedrag; daarom lager beoordeeld.'
    },
    form: {
      f6011: '<b>Permanent verblijf: formulier 6011</b> (EU langdurig ingezetene, asiel). <b>Alleen schriftelijk</b> naar IND, Postbus 9, 9560 AA Ter Apel.',
      f6009: '<b>Permanent verblijf: formulier 6009</b> (EU langdurig ingezetene of regulier onbepaalde tijd). <b>Online met DigiD</b> (iDEAL | Wero) of schriftelijk naar IND, Postbus 9, 9560 AA Ter Apel.',
      f6009check: 'Eén formulier voor beide routes: eerst EU-langdurig, dan regulier onbepaalde tijd, anders verlenging.',
      f503: 'Kies in deel 2 route 503 («ik heb onbepaalde tijd en wil EU-langdurig»). Voldoe je niet, dan volgt afwijzing zonder verdere toets.',
      f6011after: 'Bij afwijzing op inkomen of inburgering beoordeelt de IND verlenging van je asielvergunning.',
      natForm: '<b>Nederlanderschap:</b> geen formulier om te downloaden; je maakt een afspraak bij de <b>gemeente</b>, die het verzoek met je invult en naar de IND stuurt. Je betaalt bij de aanvraag; besluit binnen 12 maanden, daarna de ceremonie binnen een jaar.',
      a7101: '<b>7101 Antecedentenverklaring</b>: verplicht vanaf 12 jaar.', a7110: '<b>7110 Werkgeversverklaring</b>: één per werkgever, niet ouder dan 3 maanden.',
      a7112: '<b>7112 Verklaring inkomen zelfstandig ondernemer</b>: ondertekend door een accountant met BECON-nummer.',
      a7116: '<b>7116 Bijlage inburgeringsvereiste</b>: bewijs van inburgering of vrijstelling (gewaarmerkte kopieën, behalve het diploma).',
      a7111: '<b>7111 Bewijsmiddelen inkomen</b>: lijst met inkomensbewijzen. <b>Niet meesturen</b>.', cover: 'Voorblad op A4, duidelijke kopieën zonder nietjes, V-nummer op elke kopie.',
      leges: function (x) { return 'Leges permanent verblijf 2026: <b>€ ' + x + '</b>; geen terugbetaling bij afwijzing.'; },
      natLeges: function (x, y) { return 'Leges naturalisatie 2026: <b>€ ' + x + '</b> alleen of <b>€ ' + y + '</b> met partner.'; },
      timing: 'Zorg dat de IND je aanvraag heeft <b>vóór je vergunning verloopt</b>, en niet eerder dan 3 maanden vóór je 5 jaar haalt. Beslissing meestal binnen 6 maanden.'
    },
    docs: {
      vast: 'Huidig contract + Werkgeversverklaring + loonstroken van 3 maanden (12 bij overwerk).', t6: 'Contract of verklaring dat het werk nog 6 maanden doorloopt + Werkgeversverklaring + over 12 maanden: loonstroken, jaaropgave en contracten.',
      flex: 'Huidig contract + Werkgeversverklaring + over 3 jaar: alle jaaropgaven, contracten en uitkeringsbesluiten.',
      dga: 'Bewijs aandelenbelang + arbeidsovereenkomst met de bv + Werkgeversverklaring met firmastempel + bewijs salarisbetaling 3 maanden + afdracht loonbelasting.',
      zzp: 'Bijlage 7112 met winstcijfers en belastingstukken.', ben: 'Toekenningsbesluit + recente uitkeringsspecificatie.', aow: 'Recente AOW- of pensioenspecificatie.',
      partner: 'Inkomensbewijzen van je partner + huwelijksakte of bewijs geregistreerd partnerschap.', id: 'Kopie paspoort of reisdocument en verblijfspas; geen geldig paspoort? Leg uit waarom.',
      inb: 'Inburgeringsdiploma of bewijs van vrijstelling met bijlage 7116.',
      nat: 'Naturalisatie: geldig paspoort of reisdocument, geboorteakte (gelegaliseerd en vertaald als dat nodig is), inburgeringsdiploma, en bewijs van afstand of vrijstelling.'
    },
    rights: [
      'Met permanent verblijf: geen einddatum en vrij werken zonder TWV.', 'Met het Nederlanderschap: Nederlands paspoort, stemrecht, vrij reizen en geen verblijfsvergunning meer nodig.',
      'Plicht: wijzigingen doorgeven aan de IND (informatieplicht), anders riskeer je een boete.', 'Plicht: je permanente verblijfsdocument elke 5 jaar vernieuwen (€ 85).',
      'Let op: EU-langdurig kan vervallen na 12 maanden achter elkaar buiten de EU.'
    ],
    todo: {
      permitTemp: 'Wijzig je verblijfsdoel naar een niet-tijdelijk doel.', years: function (d) { return 'Wacht tot de termijn vol is in <b>' + d + '</b>. Blijf op tijd verlengen.'; },
      absence: 'Ga niet langer dan 6 maanden achter elkaar weg.', gap: 'Verzamel oude pasjes en IND-besluiten en vraag vanaf wanneer de termijn na het gat telt.',
      brp: 'Schrijf je in bij je gemeente (BRP).', crime: 'Vraag een advocaat (eventueel met toevoeging) vóór je aanvraag.',
      inb: 'Rond je inburgering af of verzamel bewijs voor vrijstelling.', income: 'Verhoog je inkomen tot het normbedrag of tel het inkomen van je partner mee.',
      dur: 'Vraag verlenging tot minimaal 12 maanden of een vast contract.', bijstand: 'Je inkomen moet uit werk of WW/ZW komen, niet uit bijstand.',
      asylumKeep: 'Verleng je asielvergunning op tijd (gratis).', regKeep: 'Verleng je huidige vergunning vóór die verloopt.',
      ready: 'Verzamel de documenten en dien in met het juiste formulier hieronder.', natReady: 'Maak een afspraak bij de gemeente voor naturalisatie.'
    }
  };

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
    var reg = p === 'reg_bt' || p === 'reg_ot' || p === 'bluecard' || p === 'chavez' || p === 'eu_lt';
    var show = {
      ground: p === 'asiel_bt' || p === 'asiel_ot', purpose: p === 'reg_bt', studyYears: reg,
      origin: p !== 'none' && p !== '', dpartner: p !== 'none' && p !== '', dpyears: val('dpartner') === 'married' || val('dpartner') === 'cohab',
      contract: src === 'loon' || src === 'uitzend' || src === 'dga',
      fasea: (src === 'loon' || src === 'uitzend') && ct === 'faseA',
      hist: (src === 'loon' || src === 'uitzend' || src === 'dga') && (ct === 't6' || ct === 't0' || ct === 'flex' || ct === 'faseA'),
      salary: ['loon', 'uitzend', 'dga', 'ww_zw', 'wia', 'aow'].indexOf(src) >= 0, zzp: src === 'zzp', ben: src === 'ww_zw' || src === 'wia',
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
  }
  function stepValid() {
    var bad = null;
    [].forEach.call(steps[cur].querySelectorAll('[required]'), function (el) {
      if (el.disabled || bad) return;
      if (el.type === 'radio') { if (!val(el.name)) bad = el; } else if (!String(el.value).trim()) bad = el;
    });
    root.querySelector('.prc-msg').textContent = bad ? T.req : '';
    if (bad) bad.focus();
    return !bad;
  }
  function top() { root.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  form.addEventListener('change', refresh);
  form.addEventListener('input', refresh);
  root.querySelector('.prc-next').addEventListener('click', function () { if (stepValid()) { go(cur + 1); top(); } });
  root.querySelector('.prc-back').addEventListener('click', function () { go(cur - 1); top(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!stepValid()) return;
    out.innerHTML = render(evaluate());
    out.hidden = false; form.hidden = true; root.querySelector('.prc-nav').hidden = true;
    root.querySelector('.prc-head').hidden = true; root.querySelector('.prc-progress').hidden = true;
    out.querySelector('.prc-again').addEventListener('click', function () {
      out.hidden = true; out.innerHTML = ''; form.hidden = false; root.querySelector('.prc-nav').hidden = false;
      root.querySelector('.prc-head').hidden = false; root.querySelector('.prc-progress').hidden = false; go(0); top();
    });
    out.querySelector('.prc-print').addEventListener('click', function () { window.print(); });
    top();
  });

  // ---------- engine
  function crit(id, st, note) { return { id: id, st: st, note: note || '' }; }

  function evaluate() {
    var R = { alerts: [], advice: [] };
    var p = val('permit'), purpose = val('purpose'), nat = val('nat') || 'other', ground = val('ground');
    var age = num('age'); if (age === null) age = 30;
    var origin = val('origin') || 'adult', dpart = val('dpartner') || 'no';
    var sm = parseInt(val('startMonth'), 10) - 1, sy = parseInt(val('startYear'), 10);
    var startAbs = sy * 12 + sm;
    var lived = NOWM - startAbs;
    if (lived < 0) { R.alerts.push(T.inc.future); lived = 0; startAbs = NOWM; }
    var years = lived / 12;
    if (age - years < -0.1) R.alerts.push(T.inc.beforeBirth);
    var study = Math.max(0, num('studyYears') || 0);
    if (study > years) { R.alerts.push(T.inc.study); study = years; }
    var total = num('totalYears');
    if (total !== null && total < years - 0.1) { R.alerts.push(T.inc.total); total = null; }
    var absLong = num('absLong') || 0, absTotal = num('absTotal') || 0;
    if (absLong > absTotal) { R.alerts.push(T.inc.abs); absTotal = absLong; }
    var dpYears = (dpart !== 'no') ? (num('dpYears') || 0) : 0;
    if (dpYears > years + 0.01 && p !== 'eu_citizen') { R.alerts.push(T.inc.dp); dpYears = years; }
    if ((p === 'reg_ot') && years < 4.75) R.alerts.push(T.inc.otShort);
    if (p === 'asiel_ot' && years < 4.75) R.alerts.push(T.inc.asielOt);
    if (age < 18) R.alerts.push(T.inc.minor);
    var gap = val('gap') === 'yes', brp = val('brp') !== 'no', crime = val('crime') === 'yes', inb = val('inb');
    if (crime) R.alerts.push(T.inc.crimeNote);
    var src = val('src'), ct = val('contract'), sal = num('salary') || 0, vgm = val('vg') === 'monthly';
    var h12 = val('hist12') === 'yes', h36 = val('hist36') === 'yes', bij3 = val('bij3') === 'yes';
    var fa = val('fa1') && val('fa2') && val('fa3');
    var zzpM = num('zzpMonths') || 0, zzpP = num('zzpProfit') || 0, benM = num('benMonths') || 0;
    var partner = val('partner') === 'yes', pDur = val('pDur') !== 'no', pInc = partner && pDur ? (num('pIncome') || 0) : 0;
    var asylum = p === 'asiel_bt' || p === 'asiel_ot';
    var tempPurpose = p === 'reg_bt' && TEMP.indexOf(purpose) >= 0;
    var permanent = p === 'reg_ot' || p === 'asiel_ot' || p === 'eu_lt';
    R.p = p; R.asylum = asylum; R.age = age; R.nat = nat; R.src = src; R.partner = partner; R.tempPurpose = tempPurpose; R.ground = ground;
    R.permanent = permanent; R.startAbs = startAbs; R.years = years;
    if (absLong > 6) R.restart = true;
    if (p === 'eu_citizen' || p === 'none') { R.stop = p === 'none'; }

    // --- years & dates
    var ageAtStart = age - years;
    var regM = lived - Math.max(0, (8 - ageAtStart) * 12);
    var euM = lived - study * 6;
    var euDue = NOWM + Math.max(0, Math.ceil(60 - euM));
    var regDue = NOWM + Math.max(0, Math.ceil(60 - regM));
    R.euDue = euDue; R.regDue = regDue;
    function yearsCrit(m, route, due) {
      if (route === 'reg' && nat === 'be_lu') return crit('years', 'ok', T.n.yearsBeLu);
      var e = m / 12, note = route === 'eu' ? T.n.yearsEU(e, e < 5 ? mdate(due) : '') : T.n.yearsREG(e, e < 5 ? mdate(due) : '');
      if (route === 'reg' && age < 13) return crit('years', 'fail', note + ' ' + T.n.child);
      if (e >= 5) return crit('years', 'ok', note);
      if (e >= 4.75) return crit('years', 'warn', note + ' ' + T.n.yearsSoon);
      return crit('years', 'fail', note);
    }
    function absCrit(route) {
      if (absLong > 6) return crit('absence', 'fail', T.n.absLong);
      if (absTotal > 10) return crit('absence', route === 'eu' ? 'fail' : 'warn', route === 'eu' ? T.n.absTotalEU : T.n.absTotalREG);
      return crit('absence', 'ok', T.n.absOk);
    }
    function inbCrit(route) {
      if (route === 'eu' && p === 'reg_ot') return crit('inb', 'ok', T.n.inbRegOt);
      if (age < 18 || age >= 67) return crit('inb', 'ok', T.n.inbAge);
      if (nat === 'be_lu' && route !== 'nat') return crit('inb', 'ok', T.n.inbBeLu);
      if (inb === 'diploma' || inb === 'cert2021' || inb === 'zroute') return crit('inb', 'ok', T.n.inbOk);
      if (inb.indexOf('exempt') === 0) return crit('inb', 'warn', T.n.inbExempt);
      return crit('inb', 'fail', T.n.inbBusy);
    }

    // --- income
    var regExempt = (total !== null ? total : years) >= 10 || ((origin === 'born' || origin === 'before3' || origin === 'minor') && age >= 18);
    var own = { zelf: 'ok', duur: 'ok', notes: [], amount: 0, durNote: '' }, cscore = null;
    if (src === 'bijstand') { own.zelf = 'fail'; own.duur = 'fail'; own.notes.push(T.n.bijstand); }
    else if (src === 'none') { own.zelf = 'fail'; own.duur = 'fail'; own.notes.push(T.n.noIncome); }
    else if (src === 'zzp') { own.amount = zzpP; if (zzpM < 18) { own.duur = 'fail'; own.notes.push(T.n.zzpShort); } else own.durNote = T.n.durOk; }
    else if (src === 'ww_zw' || src === 'wia') { own.amount = sal; if (benM < 12) { own.duur = 'fail'; own.notes.push(T.n.benShort); } else own.durNote = T.n.durOk; }
    else if (src === 'aow') { own.amount = sal; own.durNote = T.n.durOk; }
    else {
      own.amount = sal; var c = ct;
      if (c === 'faseA' && !fa) { own.notes.push(T.n.faseA); c = 'flex'; }
      if (src === 'dga') own.notes.push(T.n.dga);
      if (c === 'vast' || c === 't12' || c === 'faseA') { own.durNote = T.n.durOk; cscore = 5; }
      else if (c === 't6') { if (h12 || h36) { own.durNote = T.n.durT6; cscore = 4; } else { own.duur = 'fail'; own.notes.push(T.n.durFail); cscore = 1; } }
      else { if (h36 && !bij3) { own.durNote = T.n.durFlex; cscore = 3; } else { own.duur = 'fail'; own.notes.push(T.n.durFail); cscore = 1; } }
    }
    var normOwn = src === 'zzp' ? N.zzp : (vgm ? N.singleVg : N.single), normCpl = vgm ? N.coupleVg : N.couple;
    var ownCounts = own.zelf === 'ok' && own.duur === 'ok', ownAmt = ownCounts ? own.amount : 0;
    var sufOwn = own.amount >= normOwn && own.zelf === 'ok';
    var sufCpl = partner && pDur && (ownAmt + pInc) >= normCpl;
    var vold, voldNote;
    if (sufOwn) { vold = 'ok'; voldNote = T.n.sufOwn(eur(own.amount), eur(normOwn)); }
    else if (sufCpl) { vold = 'ok'; voldNote = T.n.sufCouple(eur(ownAmt + pInc), eur(normCpl)); }
    else {
      vold = 'fail';
      voldNote = (partner ? T.n.sufCouple(eur(ownAmt + pInc), eur(normCpl)) : T.n.sufOwn(eur(own.amount), eur(normOwn))) + ' ' + T.n.sufLow;
      if (partner && !pDur) voldNote += ' ' + T.n.partnerNot;
    }
    var zelfSt = own.zelf, duurSt = own.duur;
    if ((zelfSt === 'fail' || duurSt === 'fail') && sufCpl) { if (zelfSt === 'fail') zelfSt = 'warn'; if (duurSt === 'fail') duurSt = 'warn'; }
    if (cscore !== null && own.amount < normOwn && !sufCpl) cscore = Math.max(1, cscore - 1);
    R.contract = cscore === null ? null : { score: cscore, type: ct === 'faseA' && !fa ? 'flex' : ct, low: own.amount < normOwn };
    function incomeCrits(route) {
      if (route === 'reg' && regExempt) return [crit('zelf', 'ok', T.n.exemptREG), crit('duur', 'ok', T.n.exemptREG), crit('vold', 'ok', T.n.exemptREG)];
      return [crit('zelf', zelfSt, own.zelf === 'fail' ? own.notes.join(' ') : ''),
        crit('duur', duurSt, own.duur === 'fail' ? own.notes.join(' ') : (own.durNote + (own.notes.length ? ' ' + own.notes.join(' ') : ''))),
        crit('vold', vold, voldNote)];
    }
    function common(route) {
      return [crit('gap', gap ? 'warn' : 'ok', gap ? T.n.gap : ''), crit('brp', brp ? 'ok' : 'fail', brp ? '' : T.n.brpNo),
        crit('order', crime ? 'warn' : 'ok', crime ? T.n.crime : ''), inbCrit(route)];
    }
    function score(r) {
      var W = { permit: 15, years: 15, absence: 10, gap: 5, brp: 5, order: 5, inb: 15, zelf: 10, duur: 10, vold: 10, age: 5, renounce: 5, income: 5 };
      var tot = 0, got = 0, fails = 0, warns = 0;
      r.list.forEach(function (c) { var w = W[c.id] || 5; tot += w; got += c.st === 'ok' ? w : c.st === 'warn' ? w * 0.6 : 0; if (c.st === 'fail') fails++; if (c.st === 'warn') warns++; });
      var pct = Math.round(got / tot * 100);
      if (fails) pct = Math.min(pct, 40 - Math.min(30, (fails - 1) * 10)); else if (warns) pct = Math.min(pct, 85);
      r.pct = pct; r.fails = fails; r.warns = warns; r.stars = Math.round(pct / 10) / 2; r.avail = true;
      return r;
    }

    // --- EU route
    if (p === 'eu_lt') R.eu = { avail: false, have: true, why: T.n.permitHasEU };
    else if (p === 'eu_citizen' || p === 'none') R.eu = { avail: false, why: T.permit[p].d };
    else {
      var eu = { list: [] };
      eu.list.push(crit('permit', tempPurpose ? 'fail' : 'ok', tempPurpose ? T.n.permitTemp : ''));
      eu.list.push(permanent ? crit('years', 'ok', '') : yearsCrit(euM, 'eu', euDue));
      eu.list.push(absCrit('eu'));
      eu.list = eu.list.concat(common('eu'), incomeCrits('eu'));
      R.eu = score(eu);
    }
    // --- REG route
    if (asylum) R.reg = { avail: false, why: T.n.permitAsielReg };
    else if (p === 'reg_ot') R.reg = { avail: false, have: true, why: T.n.permitHasReg };
    else if (p === 'eu_lt') R.reg = { avail: false, why: T.n.permitHasEU };
    else if (p === 'eu_citizen' || p === 'none') R.reg = { avail: false, why: T.permit[p].d };
    else {
      var reg = { list: [] };
      reg.list.push(crit('permit', tempPurpose ? 'fail' : 'ok', tempPurpose ? T.n.permitTemp : ''));
      reg.list.push(yearsCrit(regM, 'reg', regDue));
      reg.list.push(absCrit('reg'));
      reg.list = reg.list.concat(common('reg'), incomeCrits('reg'));
      R.reg = score(reg);
    }

    // --- naturalisation
    if (p === 'none') R.nat = { avail: false, why: T.permit.none.d };
    else {
      var cands = [{ m: Math.max(0, 60 - lived), rule: T.n.rule5 }];
      if (dpart !== 'no') cands.push({ m: Math.max(0, 36 - lived, Math.ceil(36 - dpYears * 12)), rule: T.n.rule3p });
      if (total !== null && total >= 10) cands.push({ m: Math.max(0, 24 - lived), rule: T.n.rule2 });
      else if (total !== null) cands.push({ m: Math.max(0, 24 - lived, Math.ceil((10 - total) * 12)), rule: T.n.rule2 });
      if (nat === 'stateless') cands.push({ m: Math.max(0, 36 - lived), rule: T.n.rule3s });
      cands.sort(function (a, b) { return a.m - b.m; });
      var best = cands[0]; R.natDue = NOWM + best.m; R.natRule = best.rule;
      var nl1 = [];
      nl1.push(crit('age', age >= 18 ? 'ok' : 'fail', age >= 18 ? '' : T.n.natAge));
      nl1.push(crit('permit', tempPurpose ? 'fail' : 'ok', tempPurpose ? T.n.natPermitTemp : ''));
      nl1.push(crit('years', best.m === 0 ? 'ok' : (best.m <= 3 ? 'warn' : 'fail'), T.n.natYears(best.rule, best.m ? mdate(R.natDue) : '')));
      nl1.push(absCrit('nat'));
      nl1.push(crit('gap', gap ? 'warn' : 'ok', gap ? T.n.gap : ''));
      nl1.push(crit('brp', brp ? 'ok' : 'fail', brp ? '' : T.n.brpNo));
      nl1.push(crit('order', crime ? 'warn' : 'ok', crime ? T.n.crime : ''));
      nl1.push(inbCrit('nat'));
      nl1.push(crit('income', 'ok', T.n.natNoIncome));
      var ren;
      if (nat === 'stateless') ren = crit('renounce', 'ok', T.n.renStateless);
      else if (dpart === 'married') ren = crit('renounce', 'ok', T.n.renMarried);
      else if (origin === 'born') ren = crit('renounce', 'ok', T.n.renBorn);
      else if (asylum && ground === 'refugee') ren = crit('renounce', 'ok', T.n.renRef);
      else if (asylum && ground === 'subsidiary') ren = crit('renounce', 'warn', T.n.renSub);
      else if (asylum) ren = crit('renounce', 'warn', T.n.renUnk);
      else if (p === 'eu_citizen') ren = crit('renounce', 'warn', T.n.renEU);
      else ren = crit('renounce', 'warn', T.n.renDefault);
      nl1.push(ren);
      R.nat = score({ list: nl1 });
    }
    R.best = R.eu.avail && !R.eu.fails ? 'eu' : (R.reg.avail && !R.reg.fails ? 'reg' : null);

    // --- advice (most important first)
    var permFailsOnlyIncome = function (r) { return r.avail && r.fails && r.list.every(function (c) { return c.st !== 'fail' || ['zelf', 'duur', 'vold'].indexOf(c.id) >= 0; }); };
    if (tempPurpose) R.advice.push(T.adv.temp);
    if (R.restart) R.advice.push(T.adv.absence);
    if (permanent && p !== 'eu_lt') R.advice.push(T.adv.haveOT);
    if (inbCrit('nat').st === 'fail') R.advice.push(T.adv.inb);
    if (dpart !== 'no' && R.nat.avail !== false && R.natRule === T.n.rule3p && !tempPurpose) R.advice.push(T.adv.partner(R.natDue > NOWM ? mdate(R.natDue) : ''));
    if ((permFailsOnlyIncome(R.eu) || (asylum && R.eu.avail && R.eu.fails)) && !(R.reg.avail && !R.reg.fails) && R.nat.avail !== false && !tempPurpose && age >= 18)
      R.advice.push(T.adv.natBetter(R.natDue > NOWM ? mdate(R.natDue) : ''));
    if (R.best && !tempPurpose && !permanent) R.advice.push(T.adv.both);
    if (p === 'reg_ot' && R.best === 'eu') R.advice.push(T.upgrade);
    if (regExempt && !asylum && R.eu.avail && R.eu.fails && R.reg.avail && !R.reg.fails) R.advice.push(T.adv.tenYears);
    if (R.contract && R.contract.score <= 3) R.advice.push(T.adv.contract);
    var wait = Math.min(R.eu.avail ? euDue : 9e9, R.reg.avail ? regDue : 9e9);
    if (!permanent && wait > NOWM + 3 && wait < 9e9 && !tempPurpose) R.advice.push(T.adv.wait(mdate(wait)));
    if (p === 'asiel_bt') R.advice.push(T.adv.asielRenew(''));
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
  function card(r, name, sub, best) {
    if (!r.avail) return '<div class="prc-route ' + (r.have ? 'ok have' : 'na') + '"><h4>' + name + ' <small lang="nl" dir="ltr">' + sub + '</small></h4><p>' + badge(r.have ? 'ok' : 'na') + ' ' + (r.have ? T.done + '. ' : '') + r.why + '</p></div>';
    var cl = r.fails ? 'fail' : r.warns ? 'warn' : 'ok';
    return '<div class="prc-route ' + cl + (best ? ' best' : '') + '"><h4>' + name + ' <small lang="nl" dir="ltr">' + sub + '</small></h4>'
      + '<div class="prc-score"><b dir="ltr">' + r.pct + '%</b>' + stars(r.stars) + '<span>' + r.stars + ' ' + T.stars + '</span></div>'
      + '<p class="prc-verdict">' + verdict(r) + '</p><ul class="prc-crit">' + r.list.map(function (c) {
        return '<li class="' + c.st + '">' + badge(c.st) + ' <b>' + T.c[c.id] + '</b>' + (c.note ? '<br><span>' + c.note + '</span>' : '') + '</li>';
      }).join('') + '</ul></div>';
  }
  function list(a) { return '<ul class="prc-list">' + a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
  function missing(r) {
    if (!r.avail || !r.list) return '';
    var map = { permit: T.map.permit, years: T.map.years, absence: T.map.absence, brp: T.map.brp, inb: T.map.inb, zelf: T.map.income, duur: T.map.income, vold: T.map.income, age: '18+' };
    var m = []; r.list.forEach(function (c) { if (c.st === 'fail' && map[c.id] && m.indexOf(map[c.id]) < 0) m.push(map[c.id]); });
    return m.length ? T.map.missing + m.join('، '.replace('، ', AR ? '، ' : ', ')) : '';
  }

  function node(cls, title, when, note) {
    return '<li class="prc-node ' + cls + '"><span class="dot" aria-hidden="true"></span><div><b>' + title + '</b>'
      + (when ? '<span class="when">' + when + '</span>' : '') + (note ? '<small>' + note + '</small>' : '') + '</div></li>';
  }
  function roadmap(R) {
    var P = T.permit[R.p];
    var h = '<ol class="prc-map">';
    h += node('start', T.map.now(P.t), '', R.tempPurpose ? T.map.change : (R.permanent ? T.have : T.map.renew));
    function stepFor(r, name, note, due) {
      if (!r.avail) return node(r.have ? 'have' : 'closed', name, r.have ? T.have : T.unavail, r.have ? '' : T.map.closed);
      var ready = !r.fails && due <= NOWM + 3;
      var onlyYears = r.fails && r.list.every(function (c) { return c.st !== 'fail' || c.id === 'years'; });
      var when = ready ? T.now : (onlyYears && due > NOWM ? T.from + ' ' + mdate(due) : (r.fails ? T.closed : T.from + ' ' + mdate(Math.max(due, NOWM))));
      var miss = missing(r);
      return node(ready ? 'ready' : (r.fails ? 'blocked' : 'later'), name, when, note + (miss ? ' · ' + miss : ''));
    }
    if (R.p !== 'eu_citizen') {
      h += '<li class="prc-fork"><ol>' + stepFor(R.eu, T.map.eu, T.map.euNote, R.permanent ? NOWM : R.euDue) + stepFor(R.reg, T.map.reg, T.map.regNote, R.regDue) + '</ol></li>';
    }
    h += stepFor(R.nat, T.map.nat, T.map.natNote, R.natDue);
    return h + '</ol>';
  }

  function render(R) {
    var P = T.permit[R.p];
    var ref = 'GN-' + (R.p || 'x').toUpperCase().replace('_', '') + '-' + (NOW.getFullYear()) + ('0' + (NOW.getMonth() + 1)).slice(-2);
    var h = '<div class="prc-out" tabindex="-1">';
    // dossier header
    h += '<section class="prc-file"><div class="prc-file-top"><div><p class="prc-file-sub">' + T.fileSub + '</p><h3>' + T.fileH + '</h3></div>'
      + '<dl><div><dt>' + T.ref + '</dt><dd dir="ltr">' + ref + '</dd></div><div><dt>' + T.date + '</dt><dd>' + NOW.getDate() + ' ' + MONTHS[NOW.getMonth()] + ' ' + NOW.getFullYear() + '</dd></div></dl></div>'
      + '<div class="prc-permit"><b>' + P.t + '</b><span>' + P.code + '</span></div><p>' + P.d + '</p>'
      + (P.work ? '<p class="prc-small">💼 ' + P.work + '</p>' : '')
      + (R.p === 'reg_bt' ? '<p>' + (R.tempPurpose ? T.purposeTemp : T.purposeNonTemp) + '</p>' : '')
      + (R.asylum ? '<p>' + (R.ground === 'refugee' ? T.groundRef : R.ground === 'subsidiary' ? T.groundSub : T.groundUnk) + '</p>' : '')
      + (R.p !== 'none' ? '<p class="prc-small">🗓️ ' + (AR ? 'بدأت إقامتك المتواصلة في ' : 'Onafgebroken verblijf sinds ') + '<b>' + mdate(R.startAbs) + '</b> · ' + yr(R.years) + ' ' + (AR ? 'سنة' : 'jaar') + '</p>' : '')
      + '</section>';
    if (R.alerts.length) h += '<section class="prc-alerts"><h3>⚠️ ' + T.checkH + '</h3>' + list(R.alerts) + '</section>';
    if (R.p === 'none') return h + '<p class="prc-note">' + T.disclaimer + '</p>' + actions() + '</div>';

    // roadmap + advice
    h += '<section><h3>🧭 ' + T.mapH + '</h3>' + roadmap(R) + '</section>';
    if (R.advice.length) h += '<section class="prc-advice"><h3>💡 ' + T.adviceH + '</h3>' + list(R.advice) + '</section>';

    // routes
    if (R.p !== 'eu_citizen') h += '<section><h3>' + T.routeH + '</h3><div class="prc-routes">' + card(R.eu, T.eu, T.euSub, R.best === 'eu') + card(R.reg, T.reg, T.regSub, R.best === 'reg') + '</div></section>';
    if (R.nat.avail) h += '<section><h3>🇳🇱 ' + T.natH + '</h3><div class="prc-routes one">' + card(R.nat, T.nat, T.natSub, false) + '</div></section>';
    h += '<p class="prc-note">' + T.disclaimer + '</p>';

    // contract
    if (R.contract) {
      var cs = R.contract.score, tip = cs >= 5 ? T.contract.tip5 : cs === 4 ? T.contract.tip4 : cs === 3 ? T.contract.tip3 : T.contract.tip1;
      h += '<section><h3>' + T.contractH + '</h3><div class="prc-contract"><b>' + T.contract[R.contract.type] + '</b><div class="prc-score">' + stars(cs) + '<span>' + cs + ' ' + T.stars + '</span></div><p>' + tip + (R.contract.low ? ' ' + T.contract.low : '') + '</p></div></section>';
    }

    // todo
    var todo = [], main = R.best ? R[R.best] : (R.eu.avail ? R.eu : (R.reg.avail ? R.reg : R.nat));
    if (main && main.list) main.list.forEach(function (c) {
      if (c.st === 'ok') return;
      var map = { permit: T.todo.permitTemp, years: T.todo.years(mdate(main === R.reg ? R.regDue : main === R.eu ? R.euDue : R.natDue)), absence: T.todo.absence, gap: T.todo.gap, brp: T.todo.brp, order: T.todo.crime, inb: T.todo.inb,
        zelf: R.src === 'bijstand' ? T.todo.bijstand : T.todo.income, duur: T.todo.dur, vold: T.todo.income };
      if (map[c.id] && todo.indexOf(map[c.id]) < 0) todo.push(map[c.id]);
    });
    if (R.best) todo.push(T.todo.ready);
    else if (!R.permanent) todo.push(R.asylum ? T.todo.asylumKeep : T.todo.regKeep);
    if (R.nat.avail && !R.nat.fails) todo.push(T.todo.natReady);
    if (!todo.length) todo.push(T.todo.ready);
    h += '<section><h3>✅ ' + T.todoH + '</h3><ol class="prc-todo">' + todo.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol></section>';

    // forms
    var f = [];
    if (R.p !== 'eu_citizen' && R.p !== 'eu_lt') {
      if (R.asylum) { f.push(T.form.f6011); f.push(T.form.f6011after); } else { f.push(T.form.f6009); f.push(R.p === 'reg_ot' ? T.form.f503 : T.form.f6009check); }
      if (R.age >= 12) f.push(T.form.a7101);
      if (['loon', 'uitzend', 'dga'].indexOf(R.src) >= 0 || R.partner) f.push(T.form.a7110);
      if (R.src === 'zzp') f.push(T.form.a7112);
      if (R.p !== 'reg_ot') f.push(T.form.a7116);
      f.push(T.form.a7111); f.push(T.form.cover);
      f.push(T.form.leges(R.nat === 'tr' ? (R.age < 18 ? LEGES.trMinor : LEGES.tr) : (R.age < 18 ? LEGES.minor : LEGES.adult)));
      f.push(T.form.timing);
    }
    f.push(T.form.natForm);
    f.push(R.asylum ? T.form.natLeges(LEGES.natAsiel, LEGES.natAsielPartner) : T.form.natLeges(LEGES.nat, LEGES.natPartner));
    h += '<section><h3>📄 ' + T.formH + '</h3>' + list(f) + '</section>';

    // docs
    var d = [T.docs.id], ctp = R.contract ? R.contract.type : '';
    if (R.p !== 'eu_citizen' && R.p !== 'eu_lt') {
      if (R.src === 'dga') d.push(T.docs.dga);
      else if (['loon', 'uitzend'].indexOf(R.src) >= 0) d.push(ctp === 'vast' || ctp === 't12' || ctp === 'faseA' ? T.docs.vast : ctp === 't6' ? T.docs.t6 : T.docs.flex);
      if (R.src === 'zzp') d.push(T.docs.zzp);
      if (R.src === 'ww_zw' || R.src === 'wia') d.push(T.docs.ben);
      if (R.src === 'aow') d.push(T.docs.aow);
      if (R.partner) d.push(T.docs.partner);
      if (R.p !== 'reg_ot') d.push(T.docs.inb);
    }
    d.push(T.docs.nat);
    h += '<section><h3>🗂️ ' + T.docsH + '</h3>' + list(d) + '</section>';
    h += '<section><h3>⚖️ ' + T.rightsH + '</h3>' + list(T.rights) + '</section>';
    return h + actions() + '</div>';
  }
  function actions() { return '<div class="tool-actions"><button type="button" class="tool-button prc-again">' + T.again + '</button><button type="button" class="tool-button primary prc-print">' + T.print + '</button></div>'; }

  refresh(); go(0);
  root.querySelector('.prc-nav').hidden = false; form.hidden = false;
})();
