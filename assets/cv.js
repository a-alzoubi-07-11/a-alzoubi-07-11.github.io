/* CV builder v2: structured entries, live preview, three templates, Dutch or English output.
   The draft stays on this device; only Arabic text fields go to the translation service. */
(() => {
  'use strict';
  const S = window.CvSuggestions, T = window.CvTranslate;
  const ui = (document.documentElement.dataset.fixedLanguage || document.documentElement.lang) === 'nl' ? 'nl' : 'ar';
  const LEVELS = ['native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];
  const LEVEL_BARS = { native: 5, C2: 5, C1: 4, B2: 4, B1: 3, A2: 2, A1: 1 };
  const TEMPLATES = ['modern', 'classic', 'compact'];
  const ACCENTS = ['#1f4e8c', '#147d64', '#9b3d2e', '#3a434b', '#5b3a6b'];
  const STATUS = ['done', 'ongoing', 'none'];
  const CAT_IDS = S.categories.map(c => c[0]);
  const SKILL_IDS = S.skills.map(s => s[0]);
  const STEP_COUNT = 6;

  const COPY = {
    ar: {
      title: 'أنشئ سيرتك الذاتية CV', intro: 'اكتب بالعربية أو اختر من الاقتراحات. سيرتك تجهز بالهولندية أو الإنجليزية، وتشاهدها وهي تتكوّن أمامك.',
      privacy: 'المسودة والصورة على جهازك فقط. النصوص العربية تُرسل تلقائياً لخدمة الترجمة؛ الاسم والهاتف والبريد والصورة لا تُرسل. التفاصيل في سياسة الخصوصية.', privacyLink: 'سياسة الخصوصية',
      steps: ['بياناتك', 'الملخص', 'الخبرة', 'الدراسة', 'المهارات واللغات', 'التصميم والتحميل'],
      next: 'التالي', previous: 'السابق', optional: 'اختياري', add: 'إضافة', remove: 'حذف', moveUp: 'تحريك للأعلى', moveDown: 'تحريك للأسفل', edit: 'تعديل', done: 'تم',
      name: 'الاسم الكامل بالأحرف اللاتينية', nameHint: 'اكتب اسمك كما يظهر في وثائقك.', jobTitle: 'الوظيفة التي تبحث عنها', city: 'مكان السكن', phone: 'الهاتف', email: 'البريد الإلكتروني', linkedin: 'رابط LinkedIn', license: 'رخصة القيادة',
      photo: 'صورة شخصية', photoTip: 'في هولندا الصورة اختيارية. إذا أضفتها، اختر صورة واضحة بخلفية هادئة.', choosePhoto: 'إضافة صورة', changePhoto: 'تغيير الصورة', removePhoto: 'حذف الصورة', photoAlt: 'صورة السيرة الذاتية', photoLoading: 'جارٍ تجهيز الصورة…', photoError: 'اختر صورة JPG أو PNG أو WebP، أقل من 10 ميغابايت.', photoReady: 'تمت إضافة الصورة.',
      profile: 'نبذة قصيرة عنك', profileHint: 'من 3 إلى 5 جمل: من أنت، خبرتك، نقاط قوتك، ونوع العمل الذي تبحث عنه.', profilePlaceholder: 'مثال: عامل مستودع لديّ خبرة سنتين في تجهيز الطلبات. أعمل بدقة وألتزم بالمواعيد وأبحث عن عمل بدوام كامل في روتردام.',
      generate: 'اكتب لي ملخصاً تلقائياً', generateHint: 'يعتمد على الوظيفة والخبرة والمهارات واللغات التي أدخلتها. عدّل النص بعدها ليشبهك.', words: 'كلمة', replaceProfile: 'سيستبدل هذا النص الحالي. يمكنك الضغط على «استعادة» للتراجع.', restoreProfile: 'استعادة النص السابق',
      workEmpty: 'لا خبرة بعد؟ لا مشكلة. أضف التطوع أو التدريب العملي، أو انتقل للخطوة التالية.', addWork: 'إضافة عمل', newWork: 'عمل جديد', role: 'الوظيفة', company: 'اسم الشركة أو الجهة', companyHint: 'اكتب اسم الشركة كما هو بالأحرف اللاتينية.', place: 'المدينة', from: 'من', to: 'إلى', current: 'أعمل هنا حالياً', month: 'الشهر', year: 'السنة',
      tasks: 'المهام والإنجازات', tasksHint: 'مهمة واحدة في كل سطر. ابدأ بفعل: رتّبت، ساعدت، قدت…', taskIdeas: 'أفكار للمهام', field: 'المجال',
      eduEmpty: 'أضف دراستك أو دورات اللغة. الدراسة في بلدك مهمة أيضاً.', addEdu: 'إضافة دراسة', newEdu: 'دراسة جديدة', programme: 'الدراسة أو الشهادة', school: 'المدرسة أو الجامعة', schoolHint: 'اكتب الاسم بالأحرف اللاتينية إن أمكن.', status: 'الحالة', statuses: { done: 'حصلت على الشهادة', ongoing: 'ما زلت أدرس', none: 'لم أكملها' },
      certs: 'الشهادات والدورات', certPlaceholder: 'مثال: شهادة VCA', examples: 'أمثلة',
      skills: 'المهارات', skillsHint: 'اختر من 4 إلى 8 مهارات تناسب الوظيفة.', customSkill: 'مهارة أخرى', customSkillPlaceholder: 'مثال: اللحام بالقوس',
      languages: 'اللغات', addLang: 'إضافة لغة', langName: 'اللغة', level: 'المستوى', chooseLevel: 'اختر المستوى', levels: { native: 'لغة أم', C2: 'C2 — ممتاز', C1: 'C1 — متقدم', B2: 'B2 — جيد جداً', B1: 'B1 — جيد', A2: 'A2 — أساسي', A1: 'A1 — مبتدئ' }, quickLangs: 'إضافة سريعة',
      interests: 'الهوايات والاهتمامات', interestsHint: 'اختياري. افصل بينها بفاصلة.', references: 'إضافة جملة «المراجع متوفرة عند الطلب»',
      design: 'شكل السيرة', templates: { modern: ['عصري', 'عمود جانبي ملون للبيانات والمهارات'], classic: ['كلاسيكي', 'هادئ ورسمي، مناسب للمكاتب والرعاية'], compact: ['مختصر', 'يتسع لمعلومات كثيرة في صفحة واحدة'] },
      color: 'لون التصميم', accents: ['أزرق دلفت', 'أخضر البولدر', 'أحمر الطوب', 'رمادي', 'بنفسجي'], outLang: 'لغة السيرة', outNames: { nl: 'الهولندية', en: 'الإنجليزية' },
      quality: 'فحص الجودة', ready: 'جاهزة', checks: {
        contact: ['الاسم ووسيلة تواصل', 'أضف اسمك بالأحرف اللاتينية وهاتفاً أو بريداً.', 0],
        title: ['الوظيفة المطلوبة', 'اكتب الوظيفة التي تبحث عنها.', 0],
        profile: ['ملخص بطول مناسب', 'الملخص الجيد بين 25 و110 كلمات.', 1],
        history: ['خبرة أو دراسة', 'أضف عملاً واحداً أو دراسة واحدة على الأقل.', 2],
        dates: ['التواريخ مكتملة', 'أضف تاريخ البداية لكل عمل ودراسة.', 2],
        tasks: ['مهام لكل عمل', 'اكتب مهمتين أو ثلاثاً لكل عمل.', 2],
        skills: ['3 مهارات أو أكثر', 'اختر 3 مهارات على الأقل.', 4],
        dutch: ['مستوى اللغة الهولندية', 'أصحاب العمل يسألون عنه دائماً. أضف الهولندية ومستواك.', 4],
        translated: ['الترجمة مكتملة', 'انتظر الترجمة أو عدّلها يدوياً.', null]
      },
      fix: 'إصلاح', print: 'تحميل CV بصيغة PDF', printHint: 'اختر «حفظ كـ PDF» في نافذة الطباعة. على iPhone شارك معاينة الطباعة إلى «الملفات».',
      backup: 'حفظ نسخة احتياطية', importBackup: 'فتح نسخة احتياطية', backupHint: 'النسخة الاحتياطية ملف صغير على جهازك. افتحه لاحقاً لمتابعة التعديل على أي جهاز.', importError: 'هذا الملف ليس نسخة احتياطية صالحة لسيرة ذاتية.', importDone: 'تم فتح النسخة الاحتياطية.',
      preview: 'معاينة السيرة', closePreview: 'إغلاق المعاينة', livePreview: 'معاينة مباشرة',
      translatedTo: { nl: 'بالهولندية', en: 'بالإنجليزية' }, translating: 'جارٍ الترجمة…', translationError: 'تعذّرت الترجمة. أعد المحاولة أو اكتب الترجمة يدوياً.', retry: 'إعادة المحاولة', manual: 'كتابة الترجمة', pendingSummary: 'جارٍ تجهيز الترجمة… يمكنك متابعة العمل.', errorSummary: 'توجد ترجمة غير مكتملة. أعد المحاولة أو عدّل النص قبل تحميل PDF.',
      saved: 'محفوظة على جهازك تلقائياً', saveError: 'تعذّر الحفظ على الجهاز. احفظ نسخة احتياطية أو PDF قبل إغلاق الصفحة.', clear: 'مسح البيانات', undo: 'استعادة البيانات', restore: 'استعادة المسودة المحفوظة', emptyHint: 'الأمثلة الباهتة للتوضيح فقط؛ اكتب بياناتك للبدء.',
      required: 'أدخل اسمك بالأحرف اللاتينية كما في وثائقك.', emailInvalid: 'تحقق من البريد الإلكتروني.', needName: 'أضف اسمك في الخطوة الأولى قبل تحميل PDF.',
      placeholders: { name: 'Jan de Vries', title: 'مثال: عامل مستودع', city: 'روتردام / Rotterdam', phone: '06 00000000', email: 'naam@example.com', linkedin: 'linkedin.com/in/…', role: 'مثال: كاشير', company: 'Albert Heijn', place: 'Utrecht', tasks: 'مثال: ساعدت الزبائن عند الصندوق\nرتّبت الرفوف', programme: 'مثال: بكالوريوس محاسبة', school: 'Universiteit van Damascus', langName: 'مثال: العربية', interests: 'مثال: كرة القدم، الطبخ' }
    },
    nl: {
      title: 'Maak je cv', intro: 'Schrijf in het Arabisch of kies suggesties. Je cv is klaar in het Nederlands of Engels, en je ziet het meteen ontstaan.',
      privacy: 'Je concept en foto blijven op dit apparaat. Arabische tekst gaat automatisch naar een vertaaldienst; naam, telefoon, e-mail en foto niet. Zie het privacybeleid.', privacyLink: 'Privacybeleid',
      steps: ['Je gegevens', 'Profiel', 'Werkervaring', 'Opleiding', 'Vaardigheden en talen', 'Ontwerp en download'],
      next: 'Volgende', previous: 'Vorige', optional: 'optioneel', add: 'Toevoegen', remove: 'Verwijderen', moveUp: 'Omhoog', moveDown: 'Omlaag', edit: 'Bewerken', done: 'Klaar',
      name: 'Volledige naam in Latijnse letters', nameHint: 'Schrijf je naam zoals op je documenten.', jobTitle: 'Gewenste functie', city: 'Woonplaats', phone: 'Telefoon', email: 'E-mail', linkedin: 'LinkedIn-profiel', license: 'Rijbewijs',
      photo: 'Profielfoto', photoTip: 'Een foto is in Nederland niet verplicht. Kies een duidelijke foto met een rustige achtergrond.', choosePhoto: 'Foto toevoegen', changePhoto: 'Foto wijzigen', removePhoto: 'Foto verwijderen', photoAlt: 'Profielfoto voor het cv', photoLoading: 'Foto voorbereiden…', photoError: 'Kies JPG, PNG of WebP, kleiner dan 10 MB.', photoReady: 'Foto toegevoegd.',
      profile: 'Korte beschrijving van jezelf', profileHint: '3 tot 5 zinnen: wie je bent, je ervaring, je sterke punten en welk werk je zoekt.', profilePlaceholder: 'Bijvoorbeeld: magazijnmedewerker met twee jaar ervaring als orderpicker. Ik werk nauwkeurig, ben punctueel en zoek een fulltime baan in Rotterdam.',
      generate: 'Schrijf een profiel voor mij', generateHint: 'Gebaseerd op je functie, ervaring, vaardigheden en talen. Pas de tekst daarna aan zodat hij bij je past.', words: 'woorden', replaceProfile: 'Dit vervangt je huidige tekst. Met “Herstellen” zet je hem terug.', restoreProfile: 'Vorige tekst herstellen',
      workEmpty: 'Nog geen werkervaring? Geen probleem. Voeg vrijwilligerswerk of een stage toe, of ga door naar de volgende stap.', addWork: 'Werk toevoegen', newWork: 'Nieuwe functie', role: 'Functie', company: 'Bedrijf of organisatie', companyHint: 'Schrijf de bedrijfsnaam zoals hij is.', place: 'Plaats', from: 'Van', to: 'Tot', current: 'Ik werk hier nu', month: 'Maand', year: 'Jaar',
      tasks: 'Taken en resultaten', tasksHint: 'Eén taak per regel. Begin met een werkwoord: geholpen, geregeld, bestuurd…', taskIdeas: 'Ideeën voor taken', field: 'Vakgebied',
      eduEmpty: 'Voeg je opleiding of taalcursus toe. Ook een opleiding uit je land van herkomst telt.', addEdu: 'Opleiding toevoegen', newEdu: 'Nieuwe opleiding', programme: 'Opleiding of diploma', school: 'School of universiteit', schoolHint: 'Schrijf de naam in Latijnse letters als dat kan.', status: 'Status', statuses: { done: 'Diploma behaald', ongoing: 'Ik studeer nog', none: 'Niet afgerond' },
      certs: 'Certificaten en cursussen', certPlaceholder: 'Bijvoorbeeld: VCA-certificaat', examples: 'Voorbeelden',
      skills: 'Vaardigheden', skillsHint: 'Kies 4 tot 8 vaardigheden die bij de functie passen.', customSkill: 'Andere vaardigheid', customSkillPlaceholder: 'Bijvoorbeeld: MIG-lassen',
      languages: 'Talen', addLang: 'Taal toevoegen', langName: 'Taal', level: 'Niveau', chooseLevel: 'Kies niveau', levels: { native: 'Moedertaal', C2: 'C2 – uitstekend', C1: 'C1 – zeer goed', B2: 'B2 – goed', B1: 'B1 – voldoende', A2: 'A2 – basis', A1: 'A1 – beginner' }, quickLangs: 'Snel toevoegen',
      interests: 'Hobby’s en interesses', interestsHint: 'Optioneel. Scheid met komma’s.', references: 'Zin “Referenties op aanvraag” toevoegen',
      design: 'Ontwerp', templates: { modern: ['Modern', 'Gekleurde zijkolom voor contact en vaardigheden'], classic: ['Klassiek', 'Rustig en formeel, voor kantoor en zorg'], compact: ['Compact', 'Veel informatie op één pagina'] },
      color: 'Kleur', accents: ['Delfts blauw', 'Poldergroen', 'Baksteenrood', 'Grijs', 'Paars'], outLang: 'Taal van het cv', outNames: { nl: 'Nederlands', en: 'Engels' },
      quality: 'Kwaliteitscheck', ready: 'klaar', checks: {
        contact: ['Naam en contact', 'Vul je naam in Latijnse letters en een telefoon of e-mail in.', 0],
        title: ['Gewenste functie', 'Schrijf welke functie je zoekt.', 0],
        profile: ['Profiel met goede lengte', 'Een goed profiel heeft 25 tot 110 woorden.', 1],
        history: ['Werk of opleiding', 'Voeg minstens één functie of opleiding toe.', 2],
        dates: ['Data compleet', 'Vul bij elke functie en opleiding een begindatum in.', 2],
        tasks: ['Taken per functie', 'Schrijf twee of drie taken per functie.', 2],
        skills: ['3 of meer vaardigheden', 'Kies minstens 3 vaardigheden.', 4],
        dutch: ['Niveau Nederlands', 'Werkgevers vragen hier altijd naar. Voeg Nederlands en je niveau toe.', 4],
        translated: ['Vertaling compleet', 'Wacht op de vertaling of pas hem zelf aan.', null]
      },
      fix: 'Aanpassen', print: 'Cv downloaden als pdf', printHint: 'Kies “Opslaan als pdf” in het afdrukvenster. Op een iPhone deel je het afdrukvoorbeeld naar Bestanden.',
      backup: 'Back-up opslaan', importBackup: 'Back-up openen', backupHint: 'De back-up is een klein bestand op je apparaat. Open het later om verder te werken, ook op een ander apparaat.', importError: 'Dit bestand is geen geldige cv-back-up.', importDone: 'Back-up geopend.',
      preview: 'Cv bekijken', closePreview: 'Voorbeeld sluiten', livePreview: 'Live voorbeeld',
      translatedTo: { nl: 'In het Nederlands', en: 'In het Engels' }, translating: 'Vertalen…', translationError: 'Vertalen lukt niet. Probeer opnieuw of vul de vertaling zelf in.', retry: 'Opnieuw proberen', manual: 'Vertaling invullen', pendingSummary: 'De vertaling wordt voorbereid… Je kunt verder werken.', errorSummary: 'Een vertaling is nog niet klaar. Probeer opnieuw of bewerk de tekst voordat je de pdf downloadt.',
      saved: 'Automatisch op dit apparaat bewaard', saveError: 'Opslaan lukt niet. Bewaar een back-up of pdf voordat je deze pagina sluit.', clear: 'Gegevens wissen', undo: 'Gegevens herstellen', restore: 'Opgeslagen concept herstellen', emptyHint: 'De lichte voorbeelden zijn alleen ter uitleg. Vul je eigen gegevens in.',
      required: 'Vul je naam in Latijnse letters in zoals op je documenten.', emailInvalid: 'Controleer je e-mailadres.', needName: 'Vul eerst je naam in bij stap 1.',
      placeholders: { name: 'Jan de Vries', title: 'Bijvoorbeeld: magazijnmedewerker', city: 'Rotterdam', phone: '06 00000000', email: 'naam@example.com', linkedin: 'linkedin.com/in/…', role: 'Bijvoorbeeld: kassamedewerker', company: 'Albert Heijn', place: 'Utrecht', tasks: 'Bijvoorbeeld: Klanten geholpen aan de kassa\nSchappen aangevuld', programme: 'Bijvoorbeeld: Bachelor boekhouding', school: 'Universiteit van Damascus', langName: 'Bijvoorbeeld: Arabisch', interests: 'Bijvoorbeeld: voetbal, koken' }
    }
  };
  const OUT = {
    nl: { profile: 'Profiel', work: 'Werkervaring', education: 'Opleiding', certs: 'Certificaten en cursussen', skills: 'Vaardigheden', languages: 'Talen', interests: 'Interesses', references: 'Referenties', refText: 'Referenties zijn op aanvraag beschikbaar.', contact: 'Contact', license: 'Rijbewijs', present: 'heden', name: 'Je naam',
      months: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'], pending: 'vertaling volgt…',
      levels: { native: 'Moedertaal', C2: 'C2 – uitstekend', C1: 'C1 – zeer goed', B2: 'B2 – goed', B1: 'B1 – voldoende', A2: 'A2 – basis', A1: 'A1 – beginner' }, status: { done: '', ongoing: 'lopend', none: 'niet afgerond' } },
    en: { profile: 'Profile', work: 'Work experience', education: 'Education', certs: 'Certificates and courses', skills: 'Skills', languages: 'Languages', interests: 'Interests', references: 'References', refText: 'References available on request.', contact: 'Contact', license: 'Driving licence', present: 'present', name: 'Your name',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], pending: 'translation pending…',
      levels: { native: 'Native', C2: 'C2 – proficient', C1: 'C1 – advanced', B2: 'B2 – upper intermediate', B1: 'B1 – intermediate', A2: 'A2 – elementary', A1: 'A1 – beginner' }, status: { done: '', ongoing: 'in progress', none: 'not completed' } }
  };
  const x = COPY[ui];
  const MONTHS_UI = ui === 'ar' ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  /* ---------- helpers ---------- */
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const str = (v, max = 160) => typeof v === 'string' ? v.slice(0, max) : '';
  const okId = v => typeof v === 'string' && /^[a-z0-9]{3,12}$/.test(v) ? v : uid();
  const okDate = v => typeof v === 'string' && /^\d{4}(-(0[1-9]|1[0-2]))?$/.test(v) ? v : '';
  const pid = p => p.replace(/[^a-z0-9]/gi, '-');
  const words = v => String(v || '').trim().split(/\s+/).filter(Boolean).length;
  const lowerFirst = v => /^[A-Z]{2}/.test(v) ? v : v.charAt(0).toLocaleLowerCase() + v.slice(1);
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function blank() {
    return { version: 2, name: '', title: '', city: '', phone: '', email: '', linkedin: '', license: [], photo: '', profile: '', experience: [], education: [], certificates: [], skills: [], customSkills: [], languages: [], interests: '', references: true, profileAuto: false, template: 'modern', accent: ACCENTS[0], outLang: 'nl', translations: {} };
  }
  function migrate(r) { // v1 drafts: single free-text fields
    const d = blank(), s = k => str(r[k], 1600).trim();
    d.name = str(r.nameLatin || r.name); d.title = s('role'); d.city = s('city'); d.phone = s('phone'); d.email = s('email'); d.photo = r.photo;
    if (s('experience')) d.experience = [{ id: uid(), role: '', company: '', city: '', start: '', end: '', current: false, category: 'all', tasks: s('experience') }];
    d.education = s('education').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 10).map(programme => ({ id: uid(), programme: programme.slice(0, 160), school: '', city: '', start: '', end: '', status: 'done' }));
    d.languages = s('languages').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 10).map(line => {
      const level = /moedertaal|native|لغة أم/i.test(line) ? 'native' : ((line.match(/\b([ABC][12])\b/i) || [])[1] || '').toUpperCase();
      const name = line.split(/\s+[—–-]\s+|:/)[0].replace(/\b[ABC][12]\b/ig, '').replace(/لغة أم|مبتدئ|أساسي|متوسط|فوق المتوسط|متقدم|جيد|بطلاقة/g, '').trim() || line;
      return { id: uid(), name: name.slice(0, 80), level: LEVELS.includes(level) ? level : '' };
    });
    d.skills = Array.isArray(r.skills) ? r.skills : [];
    return d;
  }
  function sanitize(raw) {
    let r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    if (r.version !== 2) r = migrate(r);
    const d = blank();
    for (const k of ['name', 'title', 'city', 'phone', 'email', 'linkedin']) d[k] = str(r[k]);
    d.profile = str(r.profile, 1600); d.interests = str(r.interests, 300);
    const list = (v, n) => Array.isArray(v) ? v.filter(e => e && typeof e === 'object').slice(0, n) : [];
    d.experience = list(r.experience, 20).map(e => ({ id: okId(e.id), role: str(e.role), company: str(e.company), city: str(e.city), start: okDate(e.start), end: okDate(e.end), current: Boolean(e.current), category: CAT_IDS.includes(e.category) ? e.category : 'all', tasks: str(e.tasks, 1600) }));
    d.education = list(r.education, 15).map(e => ({ id: okId(e.id), programme: str(e.programme), school: str(e.school), city: str(e.city), start: okDate(e.start), end: okDate(e.end), status: STATUS.includes(e.status) ? e.status : 'done' }));
    d.certificates = list(r.certificates, 20).map(c => ({ id: okId(c.id), text: str(c.text) })).filter(c => c.text.trim());
    d.customSkills = list(r.customSkills, 12).map(c => ({ id: okId(c.id), text: str(c.text, 80) })).filter(c => c.text.trim());
    d.languages = list(r.languages, 12).map(l => ({ id: okId(l.id), name: str(l.name, 80), level: LEVELS.includes(l.level) ? l.level : '' }));
    d.skills = Array.isArray(r.skills) ? [...new Set(r.skills.filter(k => SKILL_IDS.includes(k)))] : [];
    d.license = Array.isArray(r.license) ? S.licenses.filter(l => r.license.includes(l)) : [];
    d.photo = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.photo || '') ? r.photo : '';
    d.references = r.references !== false; d.profileAuto = Boolean(r.profileAuto);
    d.template = TEMPLATES.includes(r.template) ? r.template : 'modern';
    d.accent = ACCENTS.includes(r.accent) ? r.accent : ACCENTS[0];
    d.outLang = r.outLang === 'en' ? 'en' : 'nl';
    if (r.translations && typeof r.translations === 'object' && !Array.isArray(r.translations)) {
      for (const [k, t] of Object.entries(r.translations)) if (/^[\w.-]+@(nl|en)$/.test(k) && t && typeof t.source === 'string' && typeof t.value === 'string') d.translations[k] = { source: t.source.slice(0, 1600), value: t.value.slice(0, 4000) };
    }
    return d;
  }
  const hasContent = d => Boolean(d.name.trim() || d.title.trim() || d.profile.trim() || d.phone.trim() || d.email.trim() || d.experience.length || d.education.length || d.languages.length || d.skills.length || d.photo);

  /* ---------- state ---------- */
  const storedDraft = sanitize(window.MboData.readCvDraft());
  let draftAvailable = hasContent(storedDraft); // a new page starts blank; a stored CV is restored only on request
  let draftStarted = false, saveFailed = false, undoDraft = null, previousProfile = null;
  let data = sanitize({ version: 2 }), step = 0, photoVersion = 0, openSugg = null, previewTimer = 0;
  const timers = new Map(), requests = new Map(), states = new Map();

  /* ---------- text paths & translation ---------- */
  const LISTS = { exp: 'experience', edu: 'education', cert: 'certificates', skill: 'customSkills', lang: 'languages' };
  function ref(path) {
    const [a, id, f] = path.split('.');
    if (!LISTS[a]) return a in data ? { obj: data, key: a } : null;
    const item = data[LISTS[a]].find(e => e.id === id);
    return item ? { obj: item, key: f || (a === 'lang' ? 'name' : 'text') } : null;
  }
  const getVal = p => { const r = ref(p); return r ? String(r.obj[r.key] ?? '') : ''; };
  const setVal = (p, v) => { const r = ref(p); if (r) r.obj[r.key] = v; };
  function fieldOf(p) {
    const [a, , f] = p.split('.');
    if (a === 'exp') return f === 'role' ? 'role' : f === 'city' ? 'city' : 'tasks';
    if (a === 'edu') return f === 'city' ? 'city' : 'education';
    return { cert: 'cert', skill: 'skills', lang: 'langName', title: 'role', city: 'city', interests: 'interest' }[a] || '';
  }
  function textPaths() {
    const out = ['title', 'city', 'profile', 'interests'];
    data.experience.forEach(e => out.push(`exp.${e.id}.role`, `exp.${e.id}.city`, `exp.${e.id}.tasks`));
    data.education.forEach(e => out.push(`edu.${e.id}.programme`, `edu.${e.id}.city`));
    data.certificates.forEach(c => out.push(`cert.${c.id}`));
    data.customSkills.forEach(c => out.push(`skill.${c.id}`));
    data.languages.forEach(l => out.push(`lang.${l.id}`));
    return out;
  }
  const tkey = (p, lang = data.outLang) => p + '@' + lang;
  function translated(p) {
    const t = data.translations[tkey(p)], src = getVal(p);
    return t && t.source === src && t.value.trim() && !T.hasArabic(t.value) ? t.value : null;
  }
  function output(p) { const src = getVal(p); return src.trim() ? (translated(p) ?? T.known(fieldOf(p), src, data.outLang)) : ''; }
  const unresolved = () => textPaths().filter(p => T.hasArabic(output(p)));
  function cancel(k) {
    clearTimeout(timers.get(k)); timers.delete(k);
    const r = requests.get(k); if (r) { r.abort(); requests.delete(k); }
    states.delete(k);
  }
  function schedule(p, delay = 1300) {
    const k = tkey(p);
    clearTimeout(timers.get(k)); timers.delete(k);
    if (!T.hasArabic(output(p))) { states.delete(k); paintSlot(p); queuePreview(); return; }
    if (requests.has(k) || (states.get(k) === 'error' && delay > 0)) { paintSlot(p); return; }
    states.set(k, 'waiting'); paintSlot(p); queuePreview();
    timers.set(k, setTimeout(() => { timers.delete(k); run(p); }, delay));
  }
  async function run(p) {
    const k = tkey(p), target = data.outLang;
    if (!T.hasArabic(output(p)) || requests.has(k)) return;
    const source = getVal(p), ctrl = new AbortController();
    requests.set(k, ctrl); states.set(k, 'pending'); paintSlot(p);
    const stop = setTimeout(() => ctrl.abort(), 45000);
    try {
      const value = await T.translate(fieldOf(p), source, ctrl.signal, target);
      if (requests.get(k) !== ctrl || getVal(p) !== source) return;
      data.translations[k] = { source, value }; states.delete(k); save();
    } catch {
      if (requests.get(k) === ctrl && getVal(p) === source) states.set(k, 'error');
    } finally {
      clearTimeout(stop);
      if (requests.get(k) === ctrl) { requests.delete(k); paintSlot(p); queuePreview(); refreshFinish(); }
    }
  }
  const scheduleAll = (delay = 300) => textPaths().forEach(p => { if (T.hasArabic(output(p)) && !states.has(tkey(p))) schedule(p, delay); });

  /* ---------- persistence ---------- */
  function save() {
    draftStarted = true; draftAvailable = false;
    document.getElementById('restore-draft')?.remove();
    const live = new Set(textPaths());
    for (const k of Object.keys(data.translations)) if (!live.has(k.split('@')[0])) delete data.translations[k];
    saveFailed = !window.MboData.writeCvDraft(data);
    const el = document.getElementById('save-state');
    if (el) { el.textContent = x[saveFailed ? 'saveError' : 'saved']; el.className = saveFailed ? 'warning' : 'hint'; }
  }

  /* ---------- form building blocks ---------- */
  function input(path, opts = {}) {
    const id = 'f-' + pid(path), val = getVal(path), ph = opts.placeholder ?? x.placeholders[path] ?? '';
    const common = `id="${id}" data-path="${esc(path)}" dir="${opts.dir || 'auto'}" autocomplete="${opts.autocomplete || 'off'}" ${opts.suggest ? `data-suggest="${opts.suggest}" aria-controls="s-${id}" aria-expanded="false" aria-autocomplete="list"` : ''} placeholder="${esc(ph)}"`;
    return opts.multiline
      ? `<textarea ${common} rows="${opts.rows || 4}" maxlength="1600">${esc(val)}</textarea>`
      : `<input ${common} type="${opts.type || 'text'}" maxlength="${opts.max || 160}" value="${esc(val)}" ${opts.type === 'tel' ? 'inputmode="tel"' : opts.type === 'email' ? 'inputmode="email" autocapitalize="none"' : ''} ${opts.spell === false ? 'spellcheck="false" autocorrect="off"' : ''}>`;
  }
  function field(path, label, opts = {}) {
    const id = 'f-' + pid(path), translatable = opts.translate !== false && textPaths().includes(path);
    return `<div class="field-group${opts.cls ? ' ' + opts.cls : ''}"><label class="question" for="${id}"><strong>${label}${opts.optional ? ` <small>(${x.optional})</small>` : ''}</strong>${input(path, opts)}</label>${opts.hint ? `<p class="hint">${opts.hint}</p>` : ''}${opts.suggest ? `<div class="sugg" id="s-${id}" role="listbox" aria-label="${esc(label)}" hidden></div>` : ''}${translatable ? `<div class="translation-slot" id="tr-${pid(path)}" aria-live="polite"></div>` : ''}${opts.after || ''}</div>`;
  }
  function datePick(path, label, disabled = false) {
    const v = getVal(path), [y, m] = v.split('-'), now = new Date().getFullYear(), id = 'f-' + pid(path);
    const years = Array.from({ length: now - 1959 + 2 }, (_, i) => now + 1 - i);
    return `<fieldset class="date-pick"${disabled ? ' disabled' : ''}><legend>${label}</legend><div class="date-row"><select id="${id}-m" data-date="${esc(path)}" data-part="m" aria-label="${label}: ${x.month}"><option value="">${x.month}</option>${MONTHS_UI.map((n, i) => { const mm = String(i + 1).padStart(2, '0'); return `<option value="${mm}" ${m === mm ? 'selected' : ''}>${n}</option>`; }).join('')}</select><select id="${id}-y" data-date="${esc(path)}" data-part="y" aria-label="${label}: ${x.year}"><option value="">${x.year}</option>${years.map(n => `<option value="${n}" ${y === String(n) ? 'selected' : ''}>${n}</option>`).join('')}</select></div></fieldset>`;
  }
  const entryTools = (list, id, i, n) => `<div class="entry-tools"><button type="button" class="icon-button" data-action="move" data-list="${list}" data-id="${id}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="${x.moveUp}" title="${x.moveUp}">↑</button><button type="button" class="icon-button" data-action="move" data-list="${list}" data-id="${id}" data-dir="1" ${i === n - 1 ? 'disabled' : ''} aria-label="${x.moveDown}" title="${x.moveDown}">↓</button><button type="button" class="text-button danger" data-action="remove" data-list="${list}" data-id="${id}">${x.remove}</button></div>`;
  const uiLabel = r => ui === 'ar' ? r[0] : r[1];
  const guessCategory = v => { const n = T.normalize(v); if (!n) return ''; const r = S.role.find(row => [row[0], row[1], row[2]].some(c => T.normalize(c) === n)); return r ? r[3] : ''; };

  function stepPersonal() {
    return field('name', x.name, { dir: 'ltr', spell: false, hint: x.nameHint, autocomplete: 'name' })
      + field('title', x.jobTitle, { suggest: 'role' })
      + `<div class="grid-3">${field('city', x.city, { suggest: 'city' })}${field('phone', x.phone, { type: 'tel', dir: 'ltr', autocomplete: 'tel' })}${field('email', x.email, { type: 'email', dir: 'ltr', autocomplete: 'email' })}</div>`
      + field('linkedin', x.linkedin, { dir: 'ltr', optional: true, type: 'url', spell: false })
      + `<fieldset class="chips-set"><legend>${x.license} <small>(${x.optional})</small></legend><div class="chips">${S.licenses.map(l => `<label class="chip"><input type="checkbox" data-license="${l}" ${data.license.includes(l) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>`
      + `<section class="photo-section"><div class="photo-frame">${data.photo ? `<img src="${data.photo}" alt="${x.photoAlt}" width="72" height="96">` : '<span aria-hidden="true">＋</span>'}</div><div class="photo-body"><strong>${x.photo} <small>(${x.optional})</small></strong><p class="hint">${x.photoTip}</p><div class="photo-controls"><label class="upload-button" for="photo-input">${data.photo ? x.changePhoto : x.choosePhoto}<input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"></label>${data.photo ? `<button type="button" class="small" data-action="remove-photo">${x.removePhoto}</button>` : ''}</div><p id="photo-status" role="status"></p></div></section>`;
  }
  function stepProfile() {
    return field('profile', x.profile, { multiline: true, rows: 7, hint: x.profileHint, placeholder: x.profilePlaceholder, after: `<p class="hint word-count" id="profile-count">${words(data.profile)} ${x.words}</p>` })
      + `<div class="generate-box"><button type="button" class="secondary" data-action="generate">✦ ${x.generate}</button><p class="hint">${x.generateHint}</p>${previousProfile !== null ? `<button type="button" class="text-button" data-action="restore-profile">${x.restoreProfile}</button>` : ''}</div>`;
  }
  function stepWork() {
    const n = data.experience.length;
    return (n ? '' : `<p class="empty-state">${x.workEmpty}</p>`) + data.experience.map((e, i) => {
      const cat = e.category !== 'all' ? e.category : guessCategory(e.role) || guessCategory(data.title) || 'all';
      const tasks = S.tasks.filter(t => cat === 'all' || t[3] === cat || t[3] === 'all');
      return `<article class="entry" id="entry-${e.id}"><header class="entry-head"><h3 class="entry-title" id="title-${e.id}">${esc(e.role) || x.newWork}</h3>${entryTools('experience', e.id, i, n)}</header>
        <div class="grid-2">${field(`exp.${e.id}.role`, x.role, { suggest: 'role', placeholder: x.placeholders.role })}${field(`exp.${e.id}.company`, x.company, { placeholder: x.placeholders.company, hint: x.companyHint, dir: 'ltr' })}</div>
        <div class="grid-3 dates">${field(`exp.${e.id}.city`, x.place, { suggest: 'city', placeholder: x.placeholders.place })}${datePick(`exp.${e.id}.start`, x.from)}${datePick(`exp.${e.id}.end`, x.to, e.current)}</div>
        <label class="check"><input type="checkbox" data-current="${e.id}" ${e.current ? 'checked' : ''}><span>${x.current}</span></label>
        ${field(`exp.${e.id}.tasks`, x.tasks, { multiline: true, rows: 4, suggest: 'tasks', hint: x.tasksHint, placeholder: x.placeholders.tasks })}
        <details class="ideas"><summary>${x.taskIdeas}</summary><label class="question compact"><span>${x.field}</span><select data-category="${e.id}">${S.categories.map(c => `<option value="${c[0]}" ${cat === c[0] ? 'selected' : ''}>${esc(ui === 'ar' ? c[1] : c[2])}</option>`).join('')}</select></label><div class="chips">${tasks.map(t => `<button type="button" class="chip add-chip" data-action="add-task" data-id="${e.id}" data-value="${esc(data.outLang === 'en' ? t[2] : t[1])}">＋ ${esc(uiLabel(t))}</button>`).join('')}</div></details></article>`;
    }).join('') + `<button type="button" class="add-entry" data-action="add-work">＋ ${x.addWork}</button>`;
  }
  function stepEducation() {
    const n = data.education.length;
    return (n ? '' : `<p class="empty-state">${x.eduEmpty}</p>`) + data.education.map((e, i) => `<article class="entry" id="entry-${e.id}"><header class="entry-head"><h3 class="entry-title" id="title-${e.id}">${esc(e.programme) || x.newEdu}</h3>${entryTools('education', e.id, i, n)}</header>
        <div class="grid-2">${field(`edu.${e.id}.programme`, x.programme, { suggest: 'education', placeholder: x.placeholders.programme })}${field(`edu.${e.id}.school`, x.school, { placeholder: x.placeholders.school, hint: x.schoolHint, dir: 'ltr' })}</div>
        <div class="grid-3 dates">${field(`edu.${e.id}.city`, x.place, { suggest: 'city', placeholder: x.placeholders.place })}${datePick(`edu.${e.id}.start`, x.from)}${datePick(`edu.${e.id}.end`, x.to, e.status === 'ongoing')}</div>
        <label class="question compact"><strong>${x.status}</strong><select data-status="${e.id}">${STATUS.map(s => `<option value="${s}" ${e.status === s ? 'selected' : ''}>${x.statuses[s]}</option>`).join('')}</select></label></article>`).join('')
      + `<button type="button" class="add-entry" data-action="add-edu">＋ ${x.addEdu}</button>`
      + `<section class="subsection"><h3>${x.certs} <small>(${x.optional})</small></h3>${data.certificates.map(c => field(`cert.${c.id}`, x.certs, { suggest: 'cert', cls: 'inline-item', after: `<button type="button" class="text-button danger" data-action="remove" data-list="certificates" data-id="${c.id}">${x.remove}</button>` })).join('')}
        <div class="field-group add-wrap"><div class="add-row"><input id="new-cert" dir="auto" maxlength="160" autocomplete="off" data-suggest="cert" aria-controls="s-new-cert" aria-expanded="false" aria-autocomplete="list" placeholder="${esc(x.certPlaceholder)}" aria-label="${x.certs}"><button type="button" class="small" data-action="add-cert">${x.add}</button></div><div class="sugg" id="s-new-cert" role="listbox" aria-label="${esc(x.certs)}" hidden></div></div>
        <p class="hint">${x.examples}</p><div class="chips">${S.cert.filter(r => !data.certificates.some(c => T.normalize(c.text) === T.normalize(r[1]) || T.normalize(c.text) === T.normalize(r[2]))).map(r => `<button type="button" class="chip add-chip" data-action="quick-cert" data-value="${esc(data.outLang === 'en' ? r[2] : r[1])}">＋ ${esc(uiLabel(r))}</button>`).join('')}</div></section>`;
  }
  function stepSkills() {
    const groups = S.skillGroups.map(g => `<div class="skill-group"><h4>${esc(ui === 'ar' ? g[1] : g[2])}</h4><div class="chips">${S.skills.filter(s => s[4] === g[0]).map(s => `<label class="chip"><input type="checkbox" data-skill="${s[0]}" ${data.skills.includes(s[0]) ? 'checked' : ''}><span>${esc(ui === 'ar' ? s[1] : s[2])}</span></label>`).join('')}</div></div>`).join('');
    const quick = S.langName.slice(0, 3).filter(r => !data.languages.some(l => [r[0], r[1], r[2]].some(c => T.normalize(c) === T.normalize(l.name))));
    return `<fieldset class="chips-set"><legend>${x.skills} <span class="skill-count" id="skill-count">${data.skills.length + data.customSkills.length}</span></legend><p class="hint">${x.skillsHint}</p>${groups}</fieldset>
      <section class="subsection"><h3>${x.customSkill} <small>(${x.optional})</small></h3>${data.customSkills.map(c => field(`skill.${c.id}`, x.customSkill, { suggest: 'skills', cls: 'inline-item', after: `<button type="button" class="text-button danger" data-action="remove" data-list="customSkills" data-id="${c.id}">${x.remove}</button>` })).join('')}
      <div class="field-group add-wrap"><div class="add-row"><input id="new-skill" dir="auto" maxlength="80" autocomplete="off" data-suggest="skills" aria-controls="s-new-skill" aria-expanded="false" aria-autocomplete="list" placeholder="${esc(x.customSkillPlaceholder)}" aria-label="${x.customSkill}"><button type="button" class="small" data-action="add-skill">${x.add}</button></div><div class="sugg" id="s-new-skill" role="listbox" aria-label="${esc(x.customSkill)}" hidden></div></div></section>
      <section class="subsection"><h3>${x.languages}</h3>${data.languages.map(l => `<div class="lang-row">${field(`lang.${l.id}`, x.langName, { suggest: 'langName', placeholder: x.placeholders.langName })}<label class="question"><strong>${x.level}</strong><select data-level="${l.id}"><option value="">${x.chooseLevel}</option>${LEVELS.map(v => `<option value="${v}" ${l.level === v ? 'selected' : ''}>${x.levels[v]}</option>`).join('')}</select></label><button type="button" class="text-button danger" data-action="remove" data-list="languages" data-id="${l.id}">${x.remove}</button></div>`).join('')}
      ${quick.length ? `<p class="hint">${x.quickLangs}</p><div class="chips">${quick.map(r => `<button type="button" class="chip add-chip" data-action="quick-lang" data-value="${esc(data.outLang === 'en' ? r[2] : r[1])}">＋ ${esc(uiLabel(r))}</button>`).join('')}</div>` : ''}
      <button type="button" class="add-entry" data-action="add-lang">＋ ${x.addLang}</button></section>
      <section class="subsection">${field('interests', x.interests, { suggest: 'interest', hint: x.interestsHint, placeholder: x.placeholders.interests, optional: true })}
      <label class="check"><input type="checkbox" data-references ${data.references ? 'checked' : ''}><span>${x.references}</span></label></section>`;
  }
  function stepFinish() {
    return `<fieldset class="design-set"><legend>${x.design}</legend><div class="template-grid">${TEMPLATES.map(t => `<label class="template-card"><input type="radio" name="template" value="${t}" data-template ${data.template === t ? 'checked' : ''}><span class="thumb thumb-${t}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>${x.templates[t][0]}</strong><small>${x.templates[t][1]}</small></label>`).join('')}</div></fieldset>
      <div class="design-row"><fieldset class="design-set"><legend>${x.color}</legend><div class="swatches">${ACCENTS.map((c, i) => `<label class="swatch" style="--sw:${c}" title="${x.accents[i]}"><input type="radio" name="accent" value="${c}" data-accent ${data.accent === c ? 'checked' : ''}><span class="sr-only">${x.accents[i]}</span></label>`).join('')}</div></fieldset>
      <fieldset class="design-set"><legend>${x.outLang}</legend><div class="segmented">${['nl', 'en'].map(l => `<label><input type="radio" name="outlang" value="${l}" data-outlang ${data.outLang === l ? 'checked' : ''}><span>${x.outNames[l]}</span></label>`).join('')}</div></fieldset></div>
      <section class="quality" aria-labelledby="quality-title"><div class="quality-head"><h3 id="quality-title">${x.quality}</h3><span id="quality-score"></span></div><div class="quality-bar"><span id="quality-fill"></span></div><ul id="quality-list" class="quality-list"></ul></section>
      <div id="translation-summary" role="status"></div>
      <div class="finish-preview"><div class="sheet-wrap" data-sheet-wrap><div class="sheet" id="finish-sheet"></div></div></div>
      <div class="download-box"><button type="button" class="primary-large" id="print" data-action="print">${x.print}</button><p class="hint">${x.printHint}</p>
      <div class="backup-row"><button type="button" class="small" data-action="export">${x.backup}</button><label class="upload-button small" for="import-input">${x.importBackup}<input id="import-input" type="file" accept="application/json,.json"></label></div><p class="hint">${x.backupHint}</p><p id="import-status" role="status"></p></div>`;
  }
  const STEPS = [stepPersonal, stepProfile, stepWork, stepEducation, stepSkills, stepFinish];

  /* ---------- page shell ---------- */
  function shell() {
    for (const id of ['title', 'intro', 'privacy', 'privacyLink']) { const el = document.getElementById(id); if (el) el.textContent = x[id]; }
    document.body.classList.add('cv-builder');
    if (!document.getElementById('cv-print-root')) { const root = document.createElement('div'); root.id = 'cv-print-root'; root.setAttribute('aria-hidden', 'true'); document.body.appendChild(root); }
    render();
  }
  function render() {
    photoVersion++; closeSugg();
    const host = document.getElementById('wizard');
    host.innerHTML = `<nav class="step-list" aria-label="${x.title}">${x.steps.map((s, i) => `<button type="button" class="step${i === step ? ' current' : i < step ? ' completed' : ''}" data-goto="${i}" ${i === step ? 'aria-current="step"' : ''}><span class="step-number">${i + 1}</span><span class="step-name">${s}</span></button>`).join('')}</nav>
      <div class="builder"><div class="builder-form"><div class="form-card"><div class="step-head"><h2 id="step-heading" tabindex="-1">${x.steps[step]}</h2><span class="step-count">${step + 1} / ${STEP_COUNT}</span></div>
      ${draftAvailable ? `<button type="button" id="restore-draft" class="small restore-draft" data-action="restore-draft">${x.restore}</button>` : ''}
      <div class="step-body">${STEPS[step]()}</div><p id="error" role="alert"></p>
      <div class="actions">${step ? `<button type="button" class="secondary" data-goto="${step - 1}">${x.previous}</button>` : ''}${step < STEP_COUNT - 1 ? `<button type="button" data-action="next">${x.next}</button>` : ''}</div></div>
      <div class="draft-footer"><p id="save-state" class="${saveFailed ? 'warning' : 'hint'}" role="status">${x[saveFailed ? 'saveError' : draftStarted ? 'saved' : 'emptyHint']}</p><button type="button" class="text-button" data-action="clear">${x[undoDraft ? 'undo' : 'clear']}</button></div></div>
      <aside class="live-panel" aria-label="${x.livePreview}"><div class="live-head"><span>${x.livePreview}</span><span class="live-meta">${x.templates[data.template][0]} · ${x.outNames[data.outLang]}</span></div><div class="sheet-wrap" data-sheet-wrap><div class="sheet" id="live-sheet"></div></div></aside></div>
      <button type="button" class="preview-fab" data-action="open-preview">${x.preview}</button>
      <div class="preview-overlay" id="preview-overlay" role="dialog" aria-modal="true" aria-label="${x.preview}" hidden><div class="overlay-bar"><strong>${x.preview}</strong><button type="button" class="small" data-action="close-preview">${x.closePreview}</button></div><div class="sheet-wrap" data-sheet-wrap><div class="sheet" id="overlay-sheet"></div></div></div>`;
    textPaths().forEach(p => { paintSlot(p); if (T.hasArabic(output(p)) && !states.has(tkey(p))) schedule(p); });
    updatePreview(); refreshFinish();
  }
  function changeStep(next) {
    if (next === step) return;
    if (next > step && step === 0 && !validPersonal()) return;
    step = Math.max(0, Math.min(STEP_COUNT - 1, next)); render();
    document.getElementById('step-heading')?.focus({ preventScroll: true });
    document.getElementById('wizard').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }
  function validPersonal() {
    const error = document.getElementById('error');
    if (data.name.trim() && T.hasArabic(data.name)) { error.textContent = x.required; document.getElementById('f-name')?.focus(); return false; }
    const email = document.getElementById('f-email');
    if (data.email && email && !email.checkValidity()) { error.textContent = x.emailInvalid; email.focus(); return false; }
    return true;
  }

  /* ---------- translation slots ---------- */
  function paintSlot(p) {
    const box = document.getElementById('tr-' + pid(p)); if (!box) return;
    if (box.dataset.editing === '1') return;
    if (!T.hasArabic(getVal(p))) { box.innerHTML = ''; return; }
    const value = output(p), k = tkey(p);
    if (!T.hasArabic(value)) box.innerHTML = `<div class="translation-caption"><span>${x.translatedTo[data.outLang]}</span><button type="button" class="text-button" data-action="tr-edit" data-target="${esc(p)}">${x.edit}</button></div><p lang="${data.outLang}" dir="ltr">${esc(value)}</p>`;
    else if (states.get(k) === 'error') box.innerHTML = `<p class="warning">${x.translationError}</p><button type="button" class="small" data-action="tr-retry" data-target="${esc(p)}">${x.retry}</button> <button type="button" class="text-button" data-action="tr-edit" data-target="${esc(p)}">${x.manual}</button>`;
    else box.innerHTML = `<p class="hint pulse">${x.translating}</p>`;
  }
  function editTranslation(p) {
    cancel(tkey(p));
    const box = document.getElementById('tr-' + pid(p)); if (!box) return;
    const value = translated(p) || (T.hasArabic(output(p)) ? '' : output(p));
    box.dataset.editing = '1';
    box.innerHTML = `<label class="question"><strong>${x.translatedTo[data.outLang]}</strong><textarea data-trpath="${esc(p)}" lang="${data.outLang}" dir="ltr" rows="3" maxlength="4000">${esc(value)}</textarea></label><button type="button" class="small" data-action="tr-done" data-target="${esc(p)}">${x.done}</button>`;
    box.querySelector('textarea').focus();
  }

  /* ---------- suggestions ---------- */
  const suggLabel = (kind, r) => kind === 'city' ? r[1] : (data.outLang === 'en' ? (r[2] || r[1]) : r[1]);
  // Rows normalised to [ar, nl, en, extra]; skills carry their id as extra.
  function suggRows(kind, el) {
    if (kind === 'skills') {
      const taken = el.id === 'new-skill' ? data.skills : [];
      return S.skills.filter(r => !taken.includes(r[0])).map(r => [r[1], r[2], r[3], r[0]]);
    }
    if (kind === 'cert' && el.id === 'new-cert') return S.cert.filter(r => !data.certificates.some(c => [r[1], r[2]].some(v => T.normalize(v) === T.normalize(c.text))));
    if (kind === 'tasks') {
      const id = el.dataset.path.split('.')[1], e = data.experience.find(i => i.id === id) || {};
      const cat = e.category && e.category !== 'all' ? e.category : guessCategory(e.role) || '';
      const have = new Set(String(e.tasks || '').split('\n').map(l => T.normalize(l.replace(/^\s*[-•·*]\s*/, ''))));
      const rows = S.tasks.filter(r => !have.has(T.normalize(r[1])) && !have.has(T.normalize(r[2])));
      return cat ? [...rows.filter(r => r[3] === cat), ...rows.filter(r => r[3] !== cat)] : rows;
    }
    return S[kind] || [];
  }
  const suggQuery = (kind, el) => kind === 'interest' ? el.value.split(/[,،]/).at(-1)
    : kind === 'tasks' ? el.value.split('\n').at(-1).replace(/^\s*[-•·*]\s*/, '') : el.value;
  function showSugg(el) {
    const kind = el.dataset.suggest, box = document.getElementById('s-' + el.id); if (!box) return;
    const q = T.normalize(suggQuery(kind, el));
    if (kind === 'tasks' && q.length < 2) { if (openSugg === el) closeSugg(); return; }
    const rows = suggRows(kind, el).filter(r => !q || [r[0], r[1], r[2]].some(c => typeof c === 'string' && T.normalize(c).includes(q))).slice(0, q ? 6 : 8);
    if (!rows.length || (rows.length === 1 && T.normalize(suggLabel(kind, rows[0])) === q)) { if (openSugg === el) closeSugg(); return; }
    if (openSugg && openSugg !== el) closeSugg();
    box.innerHTML = rows.map((r, i) => `<button type="button" role="option" tabindex="-1" id="${el.id}-o${i}" data-pick="${esc(suggLabel(kind, r))}"${kind === 'skills' ? ` data-skill-id="${esc(r[3])}"` : ''}><strong dir="ltr">${esc(suggLabel(kind, r))}</strong>${ui === 'ar' ? `<span>${esc(r[0])}</span>` : ''}</button>`).join('');
    box.hidden = false; el.setAttribute('aria-expanded', 'true'); openSugg = el;
  }
  function closeSugg() {
    if (!openSugg) return;
    const box = document.getElementById('s-' + openSugg.id); if (box) box.hidden = true;
    openSugg.setAttribute('aria-expanded', 'false'); openSugg = null;
  }
  function pick(el, value, skillId) {
    if (el.id === 'new-cert' || el.id === 'new-skill') {
      closeSugg();
      if (el.id === 'new-skill' && skillId) { if (!data.skills.includes(skillId)) data.skills.push(skillId); }
      else { const list = el.id === 'new-cert' ? 'certificates' : 'customSkills'; if (data[list].length >= (list === 'certificates' ? 20 : 12)) return; data[list].push({ id: uid(), text: value }); }
      structural(); document.getElementById(el.id)?.focus(); return;
    }
    let v = value, stored;
    if (el.dataset.suggest === 'interest') { const parts = el.value.split(/[,،]/); parts[parts.length - 1] = ' ' + value; v = parts.join(',').replace(/^\s+/, '') + ', '; stored = v.replace(/,\s*$/, ''); }
    else if (el.dataset.suggest === 'tasks') { const lines = el.value.split('\n'); lines[lines.length - 1] = value; stored = lines.join('\n'); v = stored + '\n'; }
    else stored = v;
    el.value = v; updateText(el.dataset.path, stored, true); closeSugg(); el.focus();
    if (el.setSelectionRange) el.setSelectionRange(v.length, v.length);
  }

  /* ---------- updates ---------- */
  function updateText(p, value, immediate = false) {
    for (const l of ['nl', 'en']) { cancel(tkey(p, l)); delete data.translations[tkey(p, l)]; }
    setVal(p, value); save();
    const slot = document.getElementById('tr-' + pid(p)); if (slot) delete slot.dataset.editing;
    if (textPaths().includes(p)) schedule(p, immediate ? 0 : 1300); else queuePreview();
    const [a, id, f] = p.split('.');
    if ((a === 'exp' && f === 'role') || (a === 'edu' && f === 'programme')) { const t = document.getElementById('title-' + id); if (t) t.textContent = value || (a === 'exp' ? x.newWork : x.newEdu); }
    if (p === 'profile') { data.profileAuto = false; const c = document.getElementById('profile-count'); if (c) c.textContent = `${words(value)} ${x.words}`; }
  }
  function structural() { save(); const y = window.scrollY; render(); window.scrollTo(0, y); }
  function addItem(list, item, focusPath) {
    data[list].push(item); structural();
    const el = document.getElementById('f-' + pid(focusPath)); if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' }); }
  }

  /* ---------- profile generator ---------- */
  function monthsOf(e) {
    if (!e.start) return 0;
    const [sy, sm = '01'] = e.start.split('-'), now = new Date();
    const end = e.current || !e.end ? (e.current ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` : e.start) : e.end;
    const [ey, em = '12'] = end.split('-');
    return Math.max(0, (Number(ey) - Number(sy)) * 12 + Number(em) - Number(sm) + 1);
  }
  function generateProfile() {
    const en = data.outLang === 'en', clean = v => T.hasArabic(v) ? '' : v.trim();
    const title = clean(output('title')), city = clean(output('city'));
    const months = data.experience.reduce((n, e) => n + monthsOf(e), 0), years = Math.floor(months / 12);
    const span = months >= 18 ? (en ? `${years} years of` : `${years} jaar`) : months >= 6 ? (en ? `${months} months of` : `${months} maanden`) : '';
    const skillNames = [...data.skills.map(id => S.skills.find(s => s[0] === id)?.[en ? 3 : 2]), ...data.customSkills.map(c => clean(output(`skill.${c.id}`)))].filter(Boolean).slice(0, 3).map(lowerFirst);
    const langs = data.languages.map(l => ({ n: clean(output(`lang.${l.id}`)), lv: l.level })).filter(l => l.n).map(l => l.lv && l.lv !== 'native' ? `${l.n} (${l.lv})` : l.n);
    const list = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + (en ? ' and ' : ' en ') + arr.at(-1) : arr[0] || '';
    const t = title ? (en ? title : lowerFirst(title)) : '';
    const s = [];
    if (en) {
      s.push(t ? (span ? `${title} with ${span} work experience.` : `Motivated ${lowerFirst(title)} eager to start working in the Netherlands.`) : (span ? `Motivated professional with ${span} work experience.` : 'Motivated and eager-to-learn starter.'));
      if (skillNames.length) s.push(`My strengths: ${list(skillNames)}.`);
      if (langs.length) s.push(`I speak ${list(langs)}.`);
      if (data.license.length) s.push(`I hold a driving licence (${data.license.join(', ')}).`);
      s.push(`I am looking for a job${t ? ` as ${lowerFirst(title)}` : ''}${city ? ` in the ${city} area` : ''}.`);
    } else {
      s.push(t ? (span ? `${title.charAt(0).toLocaleUpperCase() + title.slice(1)} met ${span} werkervaring.` : `Gemotiveerde ${t} die graag aan de slag wil in Nederland.`) : (span ? `Gemotiveerde professional met ${span} werkervaring.` : 'Gemotiveerde en leergierige starter.'));
      if (skillNames.length) s.push(`Mijn sterke punten: ${list(skillNames)}.`);
      if (langs.length) s.push(`Ik spreek ${list(langs)}.`);
      if (data.license.length) s.push(`In bezit van rijbewijs ${data.license.join(', ')}.`);
      s.push(`Ik zoek een baan${t ? ` als ${t}` : ''}${city ? ` in de regio ${city}` : ''}.`);
    }
    return s.join(' ');
  }

  /* ---------- CV rendering ---------- */
  const ICONS = {
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    car: '<path d="M5 11l2-5h10l2 5"/><rect x="3" y="11" width="18" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>'
  };
  const icon = n => `<svg class="cv-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  function cvData() {
    const o = OUT[data.outLang];
    const v = p => { const val = output(p); return T.hasArabic(val) ? `<span class="cv-pending">${o.pending}</span>` : esc(val); };
    const fmt = d => { if (!d) return ''; const [y, m] = d.split('-'); return m ? `${o.months[Number(m) - 1]} ${y}` : y; };
    const range = (s, e, cur) => { const a = fmt(s), b = cur ? o.present : fmt(e); return a && b && a !== b ? `${a} – ${b}` : a || b; };
    const lines = p => { const val = output(p); if (T.hasArabic(val)) return `<p><span class="cv-pending">${o.pending}</span></p>`; const ls = val.split('\n').map(l => l.replace(/^\s*[-•·*]\s*/, '').trim()).filter(Boolean); return ls.length ? `<ul class="cv-bullets">${ls.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''; };
    const contact = [
      data.city.trim() && ['pin', v('city')], data.phone.trim() && ['phone', esc(data.phone)], data.email.trim() && ['mail', esc(data.email)],
      data.linkedin.trim() && ['link', esc(data.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))], data.license.length && ['car', `${o.license} ${esc(data.license.join(', '))}`]
    ].filter(Boolean);
    const skills = [...data.skills.map(id => { const s = S.skills.find(r => r[0] === id); return s ? esc(s[data.outLang === 'en' ? 3 : 2]) : ''; }), ...data.customSkills.map(c => v(`skill.${c.id}`))].filter(Boolean);
    const langs = data.languages.filter(l => l.name.trim()).map(l => ({ name: v(`lang.${l.id}`), level: l.level ? o.levels[l.level] : '', bars: LEVEL_BARS[l.level] || 0 }));
    const work = data.experience.filter(e => e.role.trim() || e.company.trim() || e.tasks.trim()).map(e => ({ title: v(`exp.${e.id}.role`), org: [esc(e.company.trim()), e.city.trim() ? v(`exp.${e.id}.city`) : ''].filter(Boolean).join(', '), date: range(e.start, e.end, e.current), body: lines(`exp.${e.id}.tasks`) }));
    const edu = data.education.filter(e => e.programme.trim() || e.school.trim()).map(e => ({ title: v(`edu.${e.id}.programme`), org: [esc(e.school.trim()), e.city.trim() ? v(`edu.${e.id}.city`) : ''].filter(Boolean).join(', '), date: range(e.start, e.end, e.status === 'ongoing'), body: o.status[e.status] ? `<p class="cv-note">${o.status[e.status]}</p>` : '' }));
    const certs = data.certificates.map(c => v(`cert.${c.id}`));
    const profile = output('profile').trim() ? (T.hasArabic(output('profile')) ? `<p><span class="cv-pending">${o.pending}</span></p>` : `<p>${esc(output('profile')).replace(/\n/g, '<br>')}</p>`) : '';
    return { o, name: esc(data.name.trim()) || `<span class="cv-placeholder">${o.name}</span>`, title: data.title.trim() ? v('title') : '', contact, skills, langs, work, edu, certs, profile, interests: data.interests.trim() ? v('interests') : '', refs: data.references ? `<p>${o.refText}</p>` : '' };
  }
  function cvHtml() {
    const c = cvData(), o = c.o;
    const sec = (cls, title, body) => body ? `<section class="cv-sec ${cls}"><h2>${title}</h2>${body}</section>` : '';
    const items = list => list.map(i => `<div class="cv-item"><div class="cv-item-head"><div class="cv-item-what"><strong>${i.title}</strong>${i.org ? `<span class="cv-org">${i.org}</span>` : ''}</div>${i.date ? `<span class="cv-date">${i.date}</span>` : ''}</div>${i.body}</div>`).join('');
    const contactList = c.contact.length ? `<ul class="cv-contact">${c.contact.map(([ic, t]) => `<li>${icon(ic)}<span>${t}</span></li>`).join('')}</ul>` : '';
    const skillList = c.skills.length ? `<ul class="cv-tags">${c.skills.map(s => `<li>${s}</li>`).join('')}</ul>` : '';
    const langList = c.langs.length ? `<ul class="cv-langs">${c.langs.map(l => `<li><span class="cv-lang-name">${l.name}</span>${l.level ? `<span class="cv-lang-level">${l.level}</span>` : ''}${l.bars ? `<span class="cv-meter" style="--l:${l.bars}" aria-hidden="true"></span>` : ''}</li>`).join('')}</ul>` : '';
    const certList = c.certs.length ? `<ul class="cv-bullets">${c.certs.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
    const photo = data.photo ? `<img class="cv-photo" src="${data.photo}" alt="">` : '';
    const head = `<h1>${c.name}</h1>${c.title ? `<p class="cv-title">${c.title}</p>` : ''}`;
    const main = sec('cv-profile', o.profile, c.profile) + sec('', o.work, items(c.work)) + sec('', o.education, items(c.edu));
    let inner;
    if (data.template === 'classic') {
      inner = `<header class="cv-head"><div class="cv-head-text">${head}${contactList}</div>${photo}</header>${main}${sec('', o.certs, certList)}${sec('', o.skills, skillList)}${sec('', o.languages, langList)}${sec('', o.interests, c.interests ? `<p>${c.interests}</p>` : '')}${sec('', o.references, c.refs)}`;
    } else if (data.template === 'compact') {
      inner = `<header class="cv-band"><div class="cv-band-text">${head}</div>${contactList}${photo}</header><div class="cv-cols"><div class="cv-col-main">${main}</div><div class="cv-col-side">${sec('', o.skills, skillList)}${sec('', o.languages, langList)}${sec('', o.certs, certList)}${sec('', o.interests, c.interests ? `<p>${c.interests}</p>` : '')}${sec('', o.references, c.refs)}</div></div>`;
    } else {
      inner = `<aside class="cv-side">${photo}${sec('', o.contact, contactList)}${sec('', o.skills, skillList)}${sec('', o.languages, langList)}${sec('', o.interests, c.interests ? `<p>${c.interests}</p>` : '')}</aside><div class="cv-main"><header class="cv-head">${head}</header>${main}${sec('', o.certs, certList)}${sec('', o.references, c.refs)}</div>`;
    }
    return `<div class="cv cv-${data.template}" lang="${data.outLang}" dir="ltr" style="--a:${data.accent}">${inner}</div>`;
  }

  /* ---------- preview ---------- */
  function queuePreview() { clearTimeout(previewTimer); previewTimer = setTimeout(() => { updatePreview(); refreshFinish(); }, 140); }
  function fitSheets() {
    document.querySelectorAll('[data-sheet-wrap]').forEach(wrap => {
      const sheet = wrap.firstElementChild; if (!sheet || !wrap.clientWidth) return;
      const s = Math.min(1, wrap.clientWidth / 794);
      sheet.style.transform = `scale(${s})`; wrap.style.height = Math.ceil(sheet.offsetHeight * s) + 'px';
    });
  }
  function updatePreview() {
    const html = cvHtml();
    for (const id of ['live-sheet', 'finish-sheet', 'overlay-sheet']) { const el = document.getElementById(id); if (el && (id !== 'overlay-sheet' || !document.getElementById('preview-overlay').hidden)) el.innerHTML = html; }
    fitSheets();
  }
  function qualityChecks() {
    const all = [...data.experience, ...data.education];
    const prof = words(output('profile'));
    return {
      contact: Boolean(data.name.trim() && !T.hasArabic(data.name) && (data.phone.trim() || data.email.trim())),
      title: Boolean(data.title.trim()),
      profile: prof >= 25 && prof <= 110,
      history: all.length > 0,
      dates: all.length > 0 && all.every(e => e.start),
      tasks: data.experience.length > 0 && data.experience.every(e => e.tasks.trim()),
      skills: data.skills.length + data.customSkills.length >= 3,
      dutch: data.languages.some(l => l.level && /nederlands|dutch|هولند/i.test(l.name)),
      translated: unresolved().length === 0
    };
  }
  function refreshFinish() {
    const list = document.getElementById('quality-list');
    if (list) {
      const checks = qualityChecks(), keys = Object.keys(checks), ok = keys.filter(k => checks[k]).length, pct = Math.round(ok / keys.length * 100);
      document.getElementById('quality-score').textContent = `${pct}%`;
      document.getElementById('quality-fill').style.width = pct + '%';
      list.innerHTML = keys.map(k => { const [label, tip, target] = x.checks[k]; return `<li class="${checks[k] ? 'ok' : 'todo'}"><span class="mark" aria-hidden="true">${checks[k] ? '✓' : '○'}</span><span><strong>${label}</strong>${checks[k] ? '' : `<small>${tip}</small>`}</span>${!checks[k] && target !== null ? `<button type="button" class="text-button" data-goto="${target}">${x.fix}</button>` : ''}</li>`; }).join('');
    }
    const status = document.getElementById('translation-summary'), button = document.getElementById('print');
    if (status && button) {
      const missing = unresolved(), failed = missing.some(p => states.get(tkey(p)) === 'error');
      button.disabled = missing.length > 0;
      status.innerHTML = missing.length ? `<p class="${failed ? 'warning' : 'hint'}">${failed ? x.errorSummary : x.pendingSummary}</p>${failed ? `<button type="button" class="small" data-action="retry-all">${x.retry}</button>` : ''}` : '';
    }
    const skillCount = document.getElementById('skill-count'); if (skillCount) skillCount.textContent = data.skills.length + data.customSkills.length;
  }
  function openPreview() {
    const ov = document.getElementById('preview-overlay'); ov.hidden = false; document.body.classList.add('overlay-open');
    updatePreview(); ov.querySelector('button').focus();
  }
  function closePreview() {
    const ov = document.getElementById('preview-overlay'); if (ov.hidden) return;
    ov.hidden = true; document.body.classList.remove('overlay-open'); document.querySelector('.preview-fab')?.focus();
  }

  /* ---------- photo, backup ---------- */
  async function uploadPhoto(file) {
    if (!file) return;
    const version = ++photoVersion, status = document.getElementById('photo-status');
    if (file.size > 10 * 1024 * 1024 || !/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) { status.textContent = x.photoError; return; }
    status.textContent = x.photoLoading; const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url; await img.decode(); if (version !== photoVersion) return;
      const w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) throw Error('Invalid photo');
      const ratio = 3 / 4; let sw = w, sh = h, sx = 0, sy = 0; // centre crop to a 3:4 portrait
      if (w / h > ratio) { sw = h * ratio; sx = (w - sw) / 2; } else { sh = w / ratio; sy = Math.max(0, (h - sh) * 0.3); }
      const canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 640;
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 480, 640); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 480, 640);
      data.photo = canvas.toDataURL('image/jpeg', .86); save(); render();
      document.getElementById('photo-status').textContent = x[saveFailed ? 'saveError' : 'photoReady'];
    } catch { if (status.isConnected) status.textContent = x.photoError; }
    finally { URL.revokeObjectURL(url); }
  }
  function exportBackup() {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `cv-${(data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'concept')}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function importBackup(file) {
    const status = document.getElementById('import-status');
    try {
      if (!file || file.size > 5 * 1024 * 1024) throw Error('size');
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || (parsed.version !== 2 && !('role' in parsed || 'experience' in parsed))) throw Error('shape');
      const d = sanitize(parsed); if (!hasContent(d)) throw Error('empty');
      [...timers.keys(), ...requests.keys()].forEach(cancel); undoDraft = data; data = d; save(); render();
      document.getElementById('import-status').textContent = x.importDone;
    } catch { if (status) status.textContent = x.importError; }
  }
  function doPrint() {
    if (!data.name.trim() || T.hasArabic(data.name)) { const e = document.getElementById('error'); if (e) e.textContent = x.needName; return; }
    if (unresolved().length) { refreshFinish(); return; }
    document.getElementById('cv-print-root').innerHTML = cvHtml();
    window.print();
  }

  /* ---------- events ---------- */
  const host = document.getElementById('wizard');
  host.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('[data-trpath]')) {
      const p = el.dataset.trpath, k = tkey(p);
      data.translations[k] = { source: getVal(p), value: el.value };
      states.set(k, T.hasArabic(el.value) || !el.value.trim() ? 'error' : 'edited'); save(); queuePreview(); return;
    }
    if (el.matches('input[data-path], textarea[data-path]')) {
      updateText(el.dataset.path, el.value);
      if (el.dataset.suggest) showSugg(el);
    } else if (el.id === 'new-cert' || el.id === 'new-skill') showSugg(el);
  });
  host.addEventListener('focusin', e => { const el = e.target; if (el.matches('[data-suggest]')) showSugg(el); else if (openSugg && !e.target.closest('.sugg')) closeSugg(); });
  host.addEventListener('focusout', e => { const el = e.target; if (el.matches('[data-path]') && textPaths().includes(el.dataset.path) && timers.has(tkey(el.dataset.path))) schedule(el.dataset.path, 250); });
  host.addEventListener('keydown', e => {
    const el = e.target;
    if (el.matches('[data-suggest]') && openSugg === el) {
      const box = document.getElementById('s-' + el.id), first = box?.querySelector('[data-pick]');
      if (e.key === 'ArrowDown' && first) { e.preventDefault(); first.focus(); }
      else if (e.key === 'Escape') closeSugg();
      else if (e.key === 'Enter' && (el.id === 'new-cert' || el.id === 'new-skill')) { e.preventDefault(); closeSugg(); host.querySelector(`[data-action="${el.id === 'new-cert' ? 'add-cert' : 'add-skill'}"]`).click(); }
    } else if (el.matches('.sugg [data-pick]')) {
      const opts = [...el.parentElement.children], i = opts.indexOf(el), input = document.getElementById(el.parentElement.id.slice(2));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = i + (e.key === 'ArrowDown' ? 1 : -1); if (n < 0) input.focus(); else opts[Math.min(n, opts.length - 1)].focus(); }
      else if (e.key === 'Escape') { input.focus(); closeSugg(); }
    } else if (e.key === 'Enter' && (el.id === 'new-cert' || el.id === 'new-skill')) { e.preventDefault(); host.querySelector(`[data-action="${el.id === 'new-cert' ? 'add-cert' : 'add-skill'}"]`).click(); }
  });
  host.addEventListener('pointerdown', e => { if (e.target.closest('.sugg')) e.preventDefault(); });
  host.addEventListener('change', e => {
    const el = e.target;
    if (el.matches('[data-date]')) {
      const wrap = el.closest('.date-row'), m = wrap.querySelector('[data-part="m"]').value, y = wrap.querySelector('[data-part="y"]').value;
      setVal(el.dataset.date, y ? (m ? `${y}-${m}` : y) : ''); save(); queuePreview();
    } else if (el.matches('[data-current]')) {
      const item = data.experience.find(i => i.id === el.dataset.current); item.current = el.checked; if (el.checked) item.end = ''; structural();
    } else if (el.matches('[data-status]')) {
      const item = data.education.find(i => i.id === el.dataset.status); item.status = el.value; if (el.value === 'ongoing') item.end = ''; structural();
    } else if (el.matches('[data-category]')) {
      data.experience.find(i => i.id === el.dataset.category).category = el.value; save(); const y = window.scrollY; render(); window.scrollTo(0, y);
      document.querySelector(`#entry-${el.dataset.category} details`)?.setAttribute('open', '');
    } else if (el.matches('[data-level]')) {
      data.languages.find(i => i.id === el.dataset.level).level = el.value; save(); queuePreview();
    } else if (el.matches('[data-skill]')) {
      data.skills = SKILL_IDS.filter(k => k === el.dataset.skill ? el.checked : data.skills.includes(k)); save(); queuePreview();
    } else if (el.matches('[data-license]')) {
      data.license = S.licenses.filter(l => l === el.dataset.license ? el.checked : data.license.includes(l)); save(); queuePreview();
    } else if (el.matches('[data-references]')) { data.references = el.checked; save(); queuePreview(); }
    else if (el.matches('[data-template]')) { data.template = el.value; save(); queuePreview(); const meta = document.querySelector('.live-meta'); if (meta) meta.textContent = `${x.templates[data.template][0]} · ${x.outNames[data.outLang]}`; }
    else if (el.matches('[data-accent]')) { data.accent = el.value; save(); queuePreview(); }
    else if (el.matches('[data-outlang]')) { data.outLang = el.value; if (data.profileAuto) { data.profile = generateProfile(); } save(); render(); scheduleAll(0); }
    else if (el.id === 'photo-input') uploadPhoto(el.files[0]);
    else if (el.id === 'import-input') importBackup(el.files[0]);
  });
  host.addEventListener('click', e => {
    const pickBtn = e.target.closest('[data-pick]');
    if (pickBtn) { pick(document.getElementById(pickBtn.parentElement.id.slice(2)), pickBtn.dataset.pick, pickBtn.dataset.skillId); return; }
    const go = e.target.closest('[data-goto]');
    if (go) { closePreview(); changeStep(Number(go.dataset.goto)); return; }
    const b = e.target.closest('[data-action]'); if (!b) { if (openSugg && !e.target.closest('.field-group')) closeSugg(); return; }
    const a = b.dataset.action, id = b.dataset.id;
    if (a === 'next') changeStep(step + 1);
    else if (a === 'add-work') { const nid = uid(); addItem('experience', { id: nid, role: '', company: '', city: '', start: '', end: '', current: false, category: 'all', tasks: '' }, `exp.${nid}.role`); }
    else if (a === 'add-edu') { const nid = uid(); addItem('education', { id: nid, programme: '', school: '', city: '', start: '', end: '', status: 'done' }, `edu.${nid}.programme`); }
    else if (a === 'add-lang') { const nid = uid(); addItem('languages', { id: nid, name: '', level: '' }, `lang.${nid}`); }
    else if (a === 'quick-lang') { data.languages.push({ id: uid(), name: b.dataset.value, level: /^(Arabisch|Arabic)$/.test(b.dataset.value) ? 'native' : '' }); structural(); }
    else if (a === 'add-cert' || a === 'add-skill') {
      const inp = document.getElementById(a === 'add-cert' ? 'new-cert' : 'new-skill'), text = inp.value.trim(); if (!text) { inp.focus(); return; }
      const match = a === 'add-skill' && S.skills.find(r => [r[1], r[2], r[3]].some(c => T.normalize(c) === T.normalize(text)));
      if (match) { if (!data.skills.includes(match[0])) data.skills.push(match[0]); structural(); document.getElementById('new-skill')?.focus(); return; }
      const list = a === 'add-cert' ? 'certificates' : 'customSkills', max = a === 'add-cert' ? 20 : 12; if (data[list].length >= max) return;
      data[list].push({ id: uid(), text }); structural(); document.getElementById(a === 'add-cert' ? 'new-cert' : 'new-skill')?.focus();
    }
    else if (a === 'quick-cert') { data.certificates.push({ id: uid(), text: b.dataset.value }); structural(); }
    else if (a === 'add-task') {
      const item = data.experience.find(i => i.id === id); if (!item) return;
      const cur = item.tasks.trim(); if (cur.split('\n').includes(b.dataset.value)) return;
      const v = cur ? cur + '\n' + b.dataset.value : b.dataset.value, ta = document.getElementById('f-' + pid(`exp.${id}.tasks`));
      if (ta) ta.value = v; updateText(`exp.${id}.tasks`, v, true); b.disabled = true;
    }
    else if (a === 'remove') { const list = b.dataset.list; data[list] = data[list].filter(i => i.id !== id); structural(); }
    else if (a === 'move') {
      const list = data[b.dataset.list], i = list.findIndex(it => it.id === id), j = i + Number(b.dataset.dir);
      if (i < 0 || j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; structural();
      document.querySelector(`#entry-${id} [data-action="move"][data-dir="${b.dataset.dir}"]:not(:disabled)`)?.focus();
    }
    else if (a === 'generate') {
      const text = generateProfile(); if (data.profile.trim() && data.profile !== text) previousProfile = data.profile;
      updateText('profile', text, true); data.profileAuto = true; save(); const y = window.scrollY; render(); window.scrollTo(0, y); document.getElementById('f-profile')?.focus();
    }
    else if (a === 'restore-profile') { if (previousProfile !== null) { const v = previousProfile; previousProfile = null; updateText('profile', v, true); render(); } }
    else if (a === 'remove-photo') { data.photo = ''; save(); render(); }
    else if (a === 'tr-edit') editTranslation(b.dataset.target);
    else if (a === 'tr-retry') { states.delete(tkey(b.dataset.target)); schedule(b.dataset.target, 0); }
    else if (a === 'tr-done') { const box = document.getElementById('tr-' + pid(b.dataset.target)); if (box) delete box.dataset.editing; if (T.hasArabic(output(b.dataset.target))) states.set(tkey(b.dataset.target), 'error'); paintSlot(b.dataset.target); refreshFinish(); }
    else if (a === 'retry-all') unresolved().forEach(p => { states.delete(tkey(p)); schedule(p, 0); });
    else if (a === 'print') doPrint();
    else if (a === 'export') exportBackup();
    else if (a === 'open-preview') openPreview();
    else if (a === 'close-preview') closePreview();
    else if (a === 'restore-draft') { if (!draftAvailable) return; data = sanitize(storedDraft); draftAvailable = false; draftStarted = true; step = 0; render(); }
    else if (a === 'clear') { [...timers.keys(), ...requests.keys()].forEach(cancel); if (undoDraft) { data = undoDraft; undoDraft = null; } else { undoDraft = data; data = sanitize({ version: 2 }); } previousProfile = null; step = 0; save(); render(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePreview(); });
  document.addEventListener('click', e => { if (openSugg && !host.contains(e.target)) closeSugg(); });
  let resizeTimer = 0; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitSheets, 100); });
  window.addEventListener('afterprint', () => { document.getElementById('cv-print-root').innerHTML = ''; });
  shell();
})();
