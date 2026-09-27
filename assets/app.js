/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const el = (tag, attrs={}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) n.setAttribute(k, v);
  }
  kids.flat().forEach(k => n.append(k?.nodeType ? k : document.createTextNode(k ?? '')));
  return n;
};
const nl = s => `<span class="nl">${s}</span>`;
const num = s => `<span class="num">${s}</span>`;

/* ═══════════════════════════════════════════════════════════
   I18N DICTIONARY
═══════════════════════════════════════════════════════════ */
const I18N = {
  ar: {
    "topbar.tag": "دليل التعليم الهولندي","brand.title":"دليل التعليم الهولندي","brand.updated":"محدَّث 2026",
    "nav.articles":"📰 المقالات","nav.about":"ℹ️ من نحن","nav.privacy":"🔒 الخصوصية","nav.contact":"✉️ تواصل",
    "smart.kicker":"أدوات ذكية","smart.title":"كل شيء في مكان واحد","smart.sub":"واجهة واحدة للبحث، المقارنة، حساب الراتب، واستكشاف مسارات التعليم.","smart.search":"🔎 بحث","smart.theme":"◐ المظهر","smart.share":"↗ مشاركة",
    "newcomers.kicker":"أحمد الزعبي · هولندا","newcomers.title":"دليل العرب الجدد في هولندا","newcomers.open":"فتح الدليل ←","newcomers.sub":"من الدراسة والعمل إلى السكن والضرائب والإقامة: محتوى عربي عملي، مرتب ومترابط، يساعدك على فهم النظام الهولندي خطوة بخطوة.",
    "newcomers.education.title":"التعليم والدراسة","newcomers.education.text":"فهم MBO وHBO والجامعة، اختيار التخصص، مستويات اللغة والانتقال بين المسارات.","newcomers.work.title":"العمل والراتب","newcomers.work.text":"عقود العمل، الراتب، vakantiegeld، التدريب، البحث عن وظيفة وبناء المسار المهني.","newcomers.life.title":"الحياة اليومية","newcomers.life.text":"السكن، التأمين، المواصلات، الخدمات الحكومية والقرارات التي تؤثر على الحياة اليومية.","newcomers.money.title":"المال والضرائب","newcomers.money.text":"Belastingdienst، aangifte، toeslagen، Kinderbijslag وKindgebonden budget بأسلوب مبسط.",
    "gids.sources":"مصادر رسمية مرتبطة بالدليل","source.rijksoverheid":"Rijksoverheid","source.digid":"DigiD","source.belastingdienst":"Belastingdienst","source.kiesmbo":"KiesMBO","source.duo":"DUO","source.studiekeuze123":"Studiekeuze123","source.uwv":"UWV","source.mijnbelastingdienst":"Mijn Belastingdienst","source.toeslagen":"Dienst Toeslagen","source.svb":"SVB · Kinderbijslag","source.permanent":"دليل الإقامة الدائمة","gids.01.label":"الدليل 01","gids.02.label":"الدليل 02","gids.03.label":"الدليل 03","gids.04.label":"الدليل 04","gids.05.label":"الدليل 05","gids.06.label":"الدليل 06","gids.06.permits":"🛂 IND · الإقامات ↗","gids.01.title":"كيف تبدأ حياتك في هولندا؟","gids.01.text":"خريطة عملية للخطوات الأولى: البلدية، BSN، DigiD، التأمين، السكن، العمل والتعليم، وما الذي يجب ترتيبه أولاً.","gids.01.guide":"📘 دليل DigiD ←",
    "gids.02.title":"فهم نظام التعليم الهولندي","gids.02.text":"من التعليم الأساسي إلى MBO ثم HBO والجامعة، مع شرح مبسط للانتقالات والاختيارات المهنية.","gids.02.guide":"📘 دليل MBO ←",
    "gids.03.title":"دليل العمل لأول مرة","gids.03.text":"ما الفرق بين أنواع العقود؟ ما معنى bruto وnetto؟ وكيف تقرأ قسيمة الراتب الهولندية؟","gids.03.guide":"📘 دليل عقود العمل ←",
    "gids.04.title":"الضرائب والإقرار السنوي","gids.04.text":"شرح مبسط للمفاهيم الأساسية حول inkomstenbelasting وaangifte، مع روابط للمصادر الرسمية.","gids.04.guide":"📘 دليل الإقرار الضريبي ←",
    "gids.05.title":"البدلات والمساعدات","gids.05.text":"كيف تفهم Kinderbijslag وKindgebonden budget وغيرها من الخدمات دون الاعتماد على منشورات غير موثوقة.","gids.05.guide":"📘 دليل البدلات ←","gids.05.calc":"🧮 حاسبة Toeslagen ↗",
    "gids.06.title":"الإقامة ولمّ الشمل","gids.06.text":"معلومات توعوية عن IND والإقامة ونقل الأسرة، مع التأكيد دائماً على مراجعة الشروط الرسمية الحالية.","gids.06.guide":"📘 دليل لمّ الشمل ←","gids.06.family":"🛂 IND · لمّ الشمل ↗","gids.06.permanent":"📘 دليل الإقامة الدائمة ↗",
    "hero.eyebrow": "دليل شامل · 2025–2026",
    "hero.title.pre": "دليل النظام التعليمي",
    "hero.title.em": "الهولندي",
    "hero.title.post": "الشامل",
    "hero.sub": "من الحضانة إلى الجامعة: كل المسارات، الشروط، الرواتب والانتقالات — بلغتك.",
    "hero.s1": "جامعة بحثية", "hero.s2": "جامعة تطبيقية", "hero.s3": "معدل التخرج", "hero.s4": "مستويات تعليمية",
    "hero.b1": "🇳🇱 رسمي", "hero.b2": "📚 مصادر موثوقة", "hero.b3": "🔄 انتقالات كاملة",
    "modal.close": "إغلاق", "modal.goto": "عرض الصفحة الكاملة ←",
    "footer.logo": "دليل التعليم",
    "footer.tag": "الدليل الأشمل والأدق باللغة العربية للنظام التعليمي في هولندا.",
    "footer.follow": "تابعنا للجديد:",
    "footer.levels": "المستويات", "footer.tools": "الأدوات", "footer.official": "مصادر رسمية",
    "footer.compare": "⚖️ مقارنة المسارات", "footer.calc": "🧮 حاسبة الراتب", "footer.sources": "🔗 المصادر الرسمية",
    "footer.editorial": "سياسة المحتوى والمصادر", "footer.copy": "كل الحقوق محفوظة",
    "footer.note": "للأغراض التعليمية فقط — تحقق دائماً من المصادر الرسمية",
    "col.level": "المستوى", "col.age": "العمر", "col.duration": "المدة", "col.outcome": "النتيجة",
    "col.from": "من", "col.to": "إلى", "col.req": "الشرط", "col.notes": "ملاحظات",
    "col.field": "المجال", "col.salary": "الراتب الشهري", "col.growth": "معدل النمو",
    "tbl.title.levels": "جدول المستويات التعليمية",
    "tbl.title.trans": "جدول الانتقالات الرسمية",
    "tbl.title.salary": "متوسط الرواتب الشهرية (إجمالي) 2026",
    "pathway.title": "المخطط التفاعلي للمسار التعليمي",
    "pathway.hint": "👆 اضغط أو مرّر الماوس على أي عنصر لعرض التفاصيل",
    "sec.summary": "نظرة موجزة", "sec.details": "التفاصيل الكاملة", "sec.next": "ماذا بعد؟",
    "calc.title": "🧮 حاسبة الراتب الصافي (هولندا 2026)",
    "calc.gross": "الراتب الإجمالي الشهري (€)",
    "calc.age": "الفئة العمرية",
    "calc.age.under": "أقل من 67", "calc.age.over": "67 فأكثر",
    "calc.run": "احسب الصافي",
    "calc.net": "الراتب الصافي", "calc.tax": "ضريبة الدخل", "calc.yearly": "الراتب السنوي",
    "cmp.title": "⚖️ مقارنة بين مسارات التعليم",
    "cmp.pick": "اختر مسارين للمقارنة:",
    "cmp.a": "المسار الأول", "cmp.b": "المسار الثاني", "cmp.go": "قارن الآن",
    "cmp.criterion": "المعيار",
    "search.ph": "ابحث عن أي معلومة…",
    "search.empty": "لا توجد نتائج — جرّب كلمة مختلفة",
    "search.hint.k1": "للتنقّل", "search.hint.k2": "لاختيار", "search.hint.k3": "للإغلاق",
    "search.cat.level": "المستويات التعليمية",
    "search.cat.page": "الصفحات",
    "search.cat.sector": "قطاعات MBO",
    "search.cat.profession": "المهن والتخصصات",
    "search.cat.subject": "المواد الدراسية",
    "search.cat.transition": "الانتقالات والتحويلات",
    "search.cat.salary": "الرواتب والوظائف",
    "search.type.level": "مستوى",
    "search.type.sector": "قطاع",
    "search.type.profession": "مهنة",
    "search.type.page": "صفحة",
    "search.type.transition": "انتقال",
    "search.type.salary": "راتب",
    "search.type.subject": "مادة",
    "search.empty.head": "لم نجد نتائج تطابق بحثك",
    "search.empty.sub": "جرّب كلمة أخرى أو اختر من الاقتراحات",
    "search.trending": "البحث الشائع",
    "search.live.count": "{n} نتيجة",
    "search.results.total": "إجمالي {n} نتيجة",
  },
  nl: {
    "topbar.tag": "Gids Nederlands Onderwijs","brand.title":"Nederlandse Onderwijsgids","brand.updated":"Bijgewerkt 2026",
    "nav.articles":"📰 Artikelen","nav.about":"ℹ️ Over ons","nav.privacy":"🔒 Privacy","nav.contact":"✉️ Contact",
    "smart.kicker":"Slimme tools","smart.title":"Alles op één plek","smart.sub":"Eén interface om te zoeken, vergelijken, salaris te berekenen en onderwijsroutes te ontdekken.","smart.search":"🔎 Zoeken","smart.theme":"◐ Weergave","smart.share":"↗ Delen",
    "newcomers.kicker":"Ahmad Alzoubi · Nederland","newcomers.title":"Gids voor Arabischtalige nieuwkomers in Nederland","newcomers.open":"Gids openen →","newcomers.sub":"Van studie en werk tot wonen, belastingen en verblijf: praktische, verbonden informatie om het Nederlandse systeem stap voor stap te begrijpen.",
    "newcomers.education.title":"Onderwijs & studie","newcomers.education.text":"MBO, HBO en universiteit begrijpen, een opleiding kiezen, taalniveaus en overstappen tussen routes.","newcomers.work.title":"Werk & salaris","newcomers.work.text":"Arbeidscontracten, salaris, vakantiegeld, stages, werk zoeken en je loopbaan opbouwen.","newcomers.life.title":"Dagelijks leven","newcomers.life.text":"Wonen, verzekering, vervoer, overheidsdiensten en beslissingen die het dagelijks leven beïnvloeden.","newcomers.money.title":"Geld & belastingen","newcomers.money.text":"Belastingdienst, aangifte, toeslagen, Kinderbijslag en Kindgebonden budget eenvoudig uitgelegd.",
    "gids.sources":"Gekoppelde officiële bronnen","source.rijksoverheid":"Rijksoverheid","source.digid":"DigiD","source.belastingdienst":"Belastingdienst","source.kiesmbo":"KiesMBO","source.duo":"DUO","source.studiekeuze123":"Studiekeuze123","source.uwv":"UWV","source.mijnbelastingdienst":"Mijn Belastingdienst","source.toeslagen":"Dienst Toeslagen","source.svb":"SVB · Kinderbijslag","source.permanent":"Gids permanent verblijf","gids.01.label":"Gids 01","gids.02.label":"Gids 02","gids.03.label":"Gids 03","gids.04.label":"Gids 04","gids.05.label":"Gids 05","gids.06.label":"Gids 06","gids.06.permits":"🛂 IND · Verblijfsvergunningen ↗","gids.01.title":"Hoe begin je je leven in Nederland?","gids.01.text":"Een praktische routekaart voor de eerste stappen: gemeente, BSN, DigiD, verzekering, wonen, werk en onderwijs.","gids.01.guide":"📘 DigiD-gids →",
    "gids.02.title":"Het Nederlandse onderwijssysteem begrijpen","gids.02.text":"Van basisonderwijs naar MBO, HBO en universiteit, met uitleg over overstappen en studiekeuzes.","gids.02.guide":"📘 MBO-gids →",
    "gids.03.title":"Gids voor je eerste baan","gids.03.text":"Wat is het verschil tussen contracten? Wat betekenen bruto en netto? En hoe lees je een Nederlandse loonstrook?","gids.03.guide":"📘 Gids arbeidscontracten →",
    "gids.04.title":"Belastingen en de jaarlijkse aangifte","gids.04.text":"Een eenvoudige uitleg van inkomstenbelasting en aangifte, met links naar officiële bronnen.","gids.04.guide":"📘 Gids belastingaangifte →",
    "gids.05.title":"Toeslagen en tegemoetkomingen","gids.05.text":"Kinderbijslag, Kindgebonden budget en andere regelingen begrijpen zonder te vertrouwen op verouderde berichten.","gids.05.guide":"📘 Gids toeslagen →","gids.05.calc":"🧮 Toeslagen →",
    "gids.06.title":"Verblijf en gezinshereniging","gids.06.text":"Praktische informatie over IND, verblijfsvergunningen en gezinshereniging. Controleer altijd de actuele officiële voorwaarden.","gids.06.guide":"📘 Gids gezinshereniging →","gids.06.family":"🛂 IND · Gezinshereniging ↗","gids.06.permanent":"📘 Gids permanent verblijf ↗",
    "hero.eyebrow": "Complete Gids · 2025–2026",
    "hero.title.pre": "Gids van het",
    "hero.title.em": "Nederlandse",
    "hero.title.post": "Onderwijssysteem",
    "hero.sub": "Van kinderopvang tot universiteit: alle routes, voorwaarden, salarissen en overgangen — in jouw taal.",
    "hero.s1": "Onderzoeksuniversiteiten", "hero.s2": "Hogescholen", "hero.s3": "Slagingspercentage", "hero.s4": "Onderwijsniveaus",
    "hero.b1": "🇳🇱 Officieel", "hero.b2": "📚 Betrouwbare bronnen", "hero.b3": "🔄 Volledige overgangen",
    "modal.close": "Sluiten", "modal.goto": "Volledige pagina bekijken →",
    "footer.logo": "Onderwijsgids",
    "footer.tag": "De meest complete Arabischtalige gids voor het Nederlandse onderwijssysteem.",
    "footer.follow": "Volg ons voor updates:",
    "footer.levels": "Niveaus", "footer.tools": "Tools", "footer.official": "Officiële bronnen",
    "footer.compare": "⚖️ Routes vergelijken", "footer.calc": "🧮 Salariscalculator", "footer.sources": "🔗 Officiële bronnen",
    "footer.editorial": "Redactioneel beleid", "footer.copy": "Alle rechten voorbehouden",
    "footer.note": "Alleen voor educatieve doeleinden — controleer altijd officiële bronnen",
    "col.level": "Niveau", "col.age": "Leeftijd", "col.duration": "Duur", "col.outcome": "Uitkomst",
    "col.from": "Van", "col.to": "Naar", "col.req": "Voorwaarde", "col.notes": "Opmerkingen",
    "col.field": "Sector", "col.salary": "Maandsalaris", "col.growth": "Groeipercentage",
    "tbl.title.levels": "Tabel van onderwijsniveaus",
    "tbl.title.trans": "Tabel van officiële overgangen",
    "tbl.title.salary": "Gemiddeld brutomaandsalaris 2026",
    "pathway.title": "Interactief overzicht van de onderwijsroute",
    "pathway.hint": "👆 Klik of beweeg over een element voor details",
    "sec.summary": "Samenvatting", "sec.details": "Volledige details", "sec.next": "Wat nu?",
    "calc.title": "🧮 Nettosalariscalculator (Nederland 2026)",
    "calc.gross": "Brutomaandsalaris (€)",
    "calc.age": "Leeftijdsgroep",
    "calc.age.under": "Jonger dan 67", "calc.age.over": "67 of ouder",
    "calc.run": "Bereken netto",
    "calc.net": "Nettosalaris", "calc.tax": "Inkomstenbelasting", "calc.yearly": "Jaarsalaris",
    "cmp.title": "⚖️ Vergelijking onderwijsroutes",
    "cmp.pick": "Kies twee routes om te vergelijken:",
    "cmp.a": "Route A", "cmp.b": "Route B", "cmp.go": "Vergelijk nu",
    "cmp.criterion": "Criterium",
    "search.ph": "Zoek naar alles…",
    "search.empty": "Geen resultaten — probeer andere zoekwoorden",
    "search.hint.k1": "om te navigeren", "search.hint.k2": "om te kiezen", "search.hint.k3": "om te sluiten",
    "search.cat.level": "Onderwijsniveaus",
    "search.cat.page": "Pagina's",
    "search.cat.sector": "MBO-domeinen",
    "search.cat.profession": "Beroepen",
    "search.cat.subject": "Vakken",
    "search.cat.transition": "Overgangen",
    "search.cat.salary": "Salarissen",
    "search.type.level": "niveau",
    "search.type.sector": "sector",
    "search.type.profession": "beroep",
    "search.type.page": "pagina",
    "search.type.transition": "overgang",
    "search.type.salary": "salaris",
    "search.type.subject": "vak",
    "search.empty.head": "Geen resultaten gevonden",
    "search.empty.sub": "Probeer andere zoekwoorden of kies uit de suggesties",
    "search.trending": "Populaire zoekopdrachten",
    "search.live.count": "{n} resultaten",
    "search.results.total": "{n} resultaten totaal",
  }
};

/* ═══════════════════════════════════════════════════════════
   EDUCATION LEVELS (source of truth for modal + pages)
═══════════════════════════════════════════════════════════ */
const LEVELS = [
  {
    id:"kinderopvang", icon:"👶", color:"en-ey",
    name:{ ar:"الحضانة", nl:"Kinderopvang" },
    ageRange:"0–4", duration:{ ar:"اختياري", nl:"Optioneel" },
    short:{
      ar:`رعاية نهارية اختيارية قبل المدرسة (${nl("Kinderopvang")}). تُقدَّم في مراكز معتمدة أو عبر مربيات.`,
      nl:`Optionele opvang voor kinderen van 0 tot 4 jaar — bij geregistreerde centra of gastouders.`
    },
    body:{
      ar:`<p>${nl("Kinderopvang")} هي خدمة رعاية الأطفال قبل سن المدرسة الإلزامية. تشمل مراكز الرعاية النهارية (${nl("kinderdagverblijf")})، والاستقبال قبل/بعد المدرسة (${nl("buitenschoolse opvang")})، ومربيات الأطفال في المنزل (${nl("gastouders")}).</p>
      <p>الحكومة تدعم العائلات العاملة عبر علاوة رعاية الأطفال (${nl("kinderopvangtoeslag")}) من ${nl("Belastingdienst")}.</p>`,
      nl:`<p>Kinderopvang omvat kinderdagverblijven, buitenschoolse opvang en gastouders. De overheid biedt kinderopvangtoeslag voor werkende ouders via de Belastingdienst.</p>`
    }
  },
  {
    id:"basisschool", icon:"🏫", color:"en-basis",
    name:{ ar:"المدرسة الابتدائية", nl:"Basisschool" },
    ageRange:"4–12", duration:{ ar:"8 سنوات (Groep 1–8)", nl:"8 jaar (Groep 1–8)" },
    short:{
      ar:`التعليم الابتدائي الإلزامي من ${nl("Groep 1")} إلى ${nl("Groep 8")}. ينتهي باختبار ${nl("Doorstroomtoets")} وتوصية المعلم.`,
      nl:`Verplicht basisonderwijs van Groep 1 tot 8, afgesloten met Doorstroomtoets en schooladvies.`
    },
    body:{
      ar:`<p>المدرسة الابتدائية (${nl("Basisschool")}) تدوم 8 سنوات وتُقسَّم إلى مجموعات (${nl("Groep 1")} حتى ${nl("Groep 8")}). يصبح التعليم إلزامياً من سن الخامسة (${nl("leerplicht")}).</p>
      <p>في ${nl("Groep 8")} يُجرى اختبار ${nl("Doorstroomtoets")}، ويحصل الطالب على توصية المعلم (${nl("schooladvies")}) التي تحدد الالتحاق بـ ${nl("VMBO")} أو ${nl("HAVO")} أو ${nl("VWO")}.</p>`,
      nl:`<p>Basisschool duurt 8 jaar (Groep 1–8). Leerplicht start op 5 jaar. In Groep 8 maakt de leerling de Doorstroomtoets en ontvangt een schooladvies (VMBO / HAVO / VWO).</p>`
    }
  },
  {
    id:"groep8", icon:"📝", color:"en-basis",
    name:{ ar:"المجموعة الثامنة", nl:"Groep 8" },
    ageRange:"11–12", duration:{ ar:"سنة", nl:"1 jaar" },
    short:{
      ar:`السنة الأخيرة من الابتدائية. اختبار ${nl("Doorstroomtoets")} + ${nl("schooladvies")} يحدد المسار التالي.`,
      nl:`Laatste jaar basisschool. Doorstroomtoets + schooladvies bepalen het vervolg.`
    },
    body:{
      ar:`<p>${nl("Groep 8")} هي سنة التوجيه. في يناير/فبراير يصدر ${nl("voorlopig schooladvies")} مبدئي، ثم يُجرى ${nl("Doorstroomtoets")} في فبراير. إن كان نتيجة الاختبار أعلى من التوصية المبدئية يُعاد تقييم التوصية (${nl("definitief schooladvies")}).</p>`,
      nl:`<p>In Groep 8 ontvangt de leerling eerst een voorlopig schooladvies. Daarna wordt de Doorstroomtoets gemaakt. Bij een hogere score wordt het advies heroverwogen (definitief schooladvies).</p>`
    }
  },
  {
    id:"vmbo", icon:"🔧", color:"en-vmbo",
    name:{ ar:"التعليم المهني الثانوي التحضيري", nl:"VMBO" },
    ageRange:"12–16", duration:{ ar:"4 سنوات", nl:"4 jaar" },
    short:{
      ar:`${nl("VMBO")} = ${nl("Voorbereidend Middelbaar Beroepsonderwijs")}. 4 مسارات: ${nl("BB")}, ${nl("KB")}, ${nl("GL")}, ${nl("TL")}.`,
      nl:`VMBO = Voorbereidend Middelbaar Beroepsonderwijs. Vier leerwegen: BB, KB, GL, TL.`
    },
    body:{
      ar:`<p>${nl("VMBO")} يدوم 4 سنوات ويضم أربع مسارات:</p>
      <ul><li>${nl("BB")} — ${nl("Basisberoepsgerichte leerweg")} — مهني أساسي → ${nl("MBO")} مستوى 2.</li>
      <li>${nl("KB")} — ${nl("Kaderberoepsgerichte leerweg")} — إطاري → ${nl("MBO")} مستوى 3/4.</li>
      <li>${nl("GL")} — ${nl("Gemengde leerweg")} — مختلط → ${nl("MBO")} مستوى 4.</li>
      <li>${nl("TL")} — ${nl("Theoretische leerweg")} — نظري → ${nl("MBO")} مستوى 4 أو ${nl("HAVO")} 4.</li></ul>`,
      nl:`<p>VMBO duurt 4 jaar met vier leerwegen: BB → MBO 2, KB → MBO 3/4, GL → MBO 4, TL → MBO 4 of HAVO 4.</p>`
    }
  },
  {
    id:"havo", icon:"🎓", color:"en-havo",
    name:{ ar:"التعليم العام الثانوي العالي", nl:"HAVO" },
    ageRange:"12–17", duration:{ ar:"5 سنوات", nl:"5 jaar" },
    short:{
      ar:`${nl("HAVO")} = ${nl("Hoger Algemeen Voortgezet Onderwijs")}. يؤهل لـ ${nl("HBO")}.`,
      nl:`HAVO = Hoger Algemeen Voortgezet Onderwijs. Geeft toegang tot HBO.`
    },
    body:{
      ar:`<p>${nl("HAVO")} يدوم 5 سنوات. في السنة 3 يختار الطالب أحد ${nl("4 profielen")}: ${nl("N&T")} (طبيعة وتكنولوجيا)، ${nl("N&G")} (طبيعة وصحة)، ${nl("E&M")} (اقتصاد ومجتمع)، ${nl("C&M")} (ثقافة ومجتمع). ينتهي بامتحان ${nl("eindexamen HAVO")} ثم ${nl("HBO")}.</p>`,
      nl:`<p>HAVO duurt 5 jaar. In klas 3 kiest de leerling uit vier profielen: N&T, N&G, E&M, C&M. Eindigt met centraal eindexamen → HBO.</p>`
    }
  },
  {
    id:"vwo", icon:"🏛️", color:"en-vwo",
    name:{ ar:"التعليم ما قبل الجامعي", nl:"VWO" },
    ageRange:"12–18", duration:{ ar:"6 سنوات", nl:"6 jaar" },
    short:{
      ar:`${nl("VWO")} = ${nl("Voorbereidend Wetenschappelijk Onderwijs")}. مساران: ${nl("Atheneum")} و${nl("Gymnasium")}. يؤهل لـ ${nl("WO")}.`,
      nl:`VWO = Voorbereidend Wetenschappelijk Onderwijs (Atheneum / Gymnasium). Geeft toegang tot WO.`
    },
    body:{
      ar:`<p>${nl("VWO")} أعلى مستوى ثانوي ويدوم 6 سنوات. ${nl("Gymnasium")} يضيف اللاتينية (${nl("Latijn")}) واليونانية (${nl("Grieks")}). نفس الأربعة ${nl("profielen")}. يؤهل مباشرة للجامعات البحثية (${nl("WO")}).</p>`,
      nl:`<p>VWO is het hoogste middelbare niveau (6 jaar). Atheneum of Gymnasium (met Latijn/Grieks). Geeft directe toegang tot WO.</p>`
    }
  },
  {
    id:"vavo", icon:"🔄", color:"en-vavo",
    name:{ ar:"التعليم الثانوي للكبار", nl:"VAVO" },
    ageRange:"18+", duration:{ ar:"1–2 سنة", nl:"1–2 jaar" },
    short:{
      ar:`${nl("VAVO")} = ${nl("Voortgezet Algemeen Volwassenen Onderwijs")}. فرصة ثانية لإكمال ${nl("VMBO-TL")} أو ${nl("HAVO")} أو ${nl("VWO")}.`,
      nl:`VAVO = tweede kans om VMBO-TL, HAVO of VWO alsnog te halen.`
    },
    body:{
      ar:`<p>${nl("VAVO")} مخصص للبالغين أو لمن لم يُكمل المدرسة. يقدّم برامج تحضير لامتحانات ${nl("VMBO-TL")}/${nl("HAVO")}/${nl("VWO")} خلال 1–2 سنة. مجاني غالباً لمن هم أقل من 18 عبر ${nl("RMC")}.</p>`,
      nl:`<p>VAVO is voor volwassenen of jongeren die hun diploma alsnog willen halen. Duur 1–2 jaar. Vaak gratis onder 18 via RMC.</p>`
    }
  },
  {
    id:"isk", icon:"🌍", color:"en-isk",
    name:{ ar:"الفصول الدولية للوافدين", nl:"ISK" },
    ageRange:"12–18", duration:{ ar:"1–2 سنة", nl:"1–2 jaar" },
    short:{
      ar:`${nl("ISK")} = ${nl("Internationale Schakelklas")}. فصل تحضيري لتعلّم الهولندية قبل الدخول إلى المسار الثانوي.`,
      nl:`ISK = Internationale Schakelklas. Voorbereidend op regulier voortgezet onderwijs.`
    },
    body:{
      ar:`<p>${nl("ISK")} للطلاب الجدد في هولندا (سنّ 12–18) الذين لا يتقنون الهولندية. يدوم 1–2 سنة، ثم يُوجَّه الطالب إلى ${nl("VMBO")}/${nl("HAVO")}/${nl("VWO")}/${nl("MBO")} حسب المستوى.</p>`,
      nl:`<p>ISK is voor anderstalige leerlingen (12–18). Na 1–2 jaar stromen ze door naar VMBO, HAVO, VWO of MBO.</p>`
    }
  },
  {
    id:"mbo", icon:"🛠️", color:"en-mbo",
    name:{ ar:"التعليم المهني الثانوي", nl:"MBO" },
    ageRange:"16+", duration:{ ar:"1–4 سنوات", nl:"1–4 jaar" },
    short:{
      ar:`${nl("MBO")} = ${nl("Middelbaar Beroepsonderwijs")}. 4 مستويات (1–4). ${nl("MBO 4")} يفتح باب ${nl("HBO")}.`,
      nl:`MBO = Middelbaar Beroepsonderwijs (niveau 1–4). MBO 4 geeft toegang tot HBO.`
    },
    body:{
      ar:`<p>${nl("MBO")} يُقدَّم في ${nl("ROC")} أو ${nl("AOC")} أو ${nl("vakschool")}. يشمل 4 مستويات:</p>
      <ul><li>${nl("Niveau 1")} — مساعد (${nl("Entreeopleiding")})، سنة واحدة.</li>
      <li>${nl("Niveau 2")} — عامل أساسي، 2–3 سنوات.</li>
      <li>${nl("Niveau 3")} — عامل مستقل، 2–4 سنوات.</li>
      <li>${nl("Niveau 4")} — عامل متخصص/مشرف، 3–4 سنوات → يؤهل لـ ${nl("HBO")}.</li></ul>
      <p>مسارَا التعلّم: ${nl("BOL")} (دراسة كاملة + تدريب) و${nl("BBL")} (عمل + يوم دراسة أسبوعياً).</p>`,
      nl:`<p>MBO wordt aangeboden bij ROC, AOC of vakschool. Vier niveaus, van Entree tot specialist. BOL = voltijd met stage; BBL = werken + 1 schooldag per week.</p>`
    }
  },
  {
    id:"hbo", icon:"🏢", color:"en-hbo",
    name:{ ar:"التعليم العالي التطبيقي", nl:"HBO" },
    ageRange:"17+", duration:{ ar:"4 سنوات (بكالوريوس)", nl:"4 jaar (Bachelor)" },
    short:{
      ar:`${nl("HBO")} = ${nl("Hoger Beroepsonderwijs")}. جامعات تطبيقية (${nl("hogeschool")}). يمنح ${nl("HBO-Bachelor")} (4 سنوات).`,
      nl:`HBO = Hoger Beroepsonderwijs bij hogescholen. HBO-Bachelor in 4 jaar.`
    },
    body:{
      ar:`<p>${nl("HBO")} في الجامعات التطبيقية (${nl("hogescholen")}) يركّز على التطبيق العملي. البكالوريوس يدوم 4 سنوات (240 ${nl("ECTS")}). الماجستير (${nl("HBO-Master")}) يدوم 1–2 سنة. القبول من ${nl("HAVO")} أو ${nl("MBO 4")} أو ${nl("VWO")}.</p>`,
      nl:`<p>HBO bij hogescholen is praktijkgericht. Bachelor 4 jaar (240 ECTS), Master 1–2 jaar. Toegang: HAVO, MBO 4 of VWO.</p>`
    }
  },
  {
    id:"wo", icon:"🎓", color:"en-wo",
    name:{ ar:"التعليم العلمي الأكاديمي", nl:"WO" },
    ageRange:"18+", duration:{ ar:"3 سنوات (بكالوريوس)", nl:"3 jaar (Bachelor)" },
    short:{
      ar:`${nl("WO")} = ${nl("Wetenschappelijk Onderwijs")}. جامعات بحثية (${nl("universiteit")}). ${nl("WO-Bachelor")} 3 سنوات + ${nl("WO-Master")} 1–3.`,
      nl:`WO = Wetenschappelijk Onderwijs aan onderzoeksuniversiteiten. Bachelor 3 jaar, Master 1–3 jaar.`
    },
    body:{
      ar:`<p>${nl("WO")} في الجامعات البحثية (13 جامعة). البكالوريوس 3 سنوات (180 ${nl("ECTS")})، الماجستير 1–3 سنة. القبول من ${nl("VWO")} مباشرة، أو من ${nl("HBO-Bachelor")} بعد ${nl("pre-master")}.</p>`,
      nl:`<p>WO aan 13 onderzoeksuniversiteiten. Bachelor 3 jaar (180 ECTS), Master 1–3 jaar. Toegang via VWO of via HBO-Bachelor + pre-master.</p>`
    }
  },
  {
    id:"phd", icon:"🔬", color:"en-phd",
    name:{ ar:"الدكتوراه", nl:"PhD / Promotie" },
    ageRange:"22+", duration:{ ar:"4 سنوات", nl:"4 jaar" },
    short:{
      ar:`${nl("PhD")} / ${nl("Promotie")} في جامعة بحثية. راتب موظف ${nl("promovendus")} حوالي ${nl("€2.900–€3.700")} شهرياً.`,
      nl:`PhD (promotie) aan een universiteit. Salaris promovendus ± €2.900–€3.700 bruto/maand.`
    },
    body:{
      ar:`<p>بعد ${nl("WO-Master")}، يمكن التسجيل في ${nl("PhD")} (${nl("Promotietraject")}) 4 سنوات. الطالب موظف بدوام كامل برسالة دكتوراه (${nl("proefschrift")}) ودفاع علني (${nl("promotie")}) يمنحه لقب ${nl("dr.")}.</p>`,
      nl:`<p>Na een WO-Master kan een PhD-traject (4 jaar, betaalde baan) leiden tot proefschrift en openbare verdediging — titel dr.</p>`
    }
  },
  {
    id:"werk", icon:"💼", color:"en-work",
    name:{ ar:"سوق العمل", nl:"Arbeidsmarkt" },
    ageRange:"16+", duration:{ ar:"—", nl:"—" },
    short:{
      ar:`الحد الأدنى للأجور (${nl("minimumloon")}) محدد بالساعة في هولندا منذ 2024.`,
      nl:`Sinds 2024 geldt een wettelijk minimumuurloon in Nederland.`
    },
    body:{
      ar:`<p>منذ 1 يناير 2024 يطبَّق الحد الأدنى بالساعة (${nl("minimumuurloon")}) بدل الشهري. في يناير 2026 بلغ ${num("€14.71")} للساعة لمن هم 21 فأكثر. توجد رواتب خاصة للشباب (${nl("minimumjeugdloon")}) من سن 15.</p>`,
      nl:`<p>Sinds 1-1-2024 geldt een minimumuurloon. Per januari 2026: ± €14,71/uur voor 21+. Voor jongeren (15–20) geldt minimumjeugdloon.</p>`
    }
  }
];

const LEVEL_BY_ID = Object.fromEntries(LEVELS.map(l => [l.id, l]));

/* ═══════════════════════════════════════════════════════════
   PATHWAY DIAGRAM STRUCTURE
═══════════════════════════════════════════════════════════ */
const PATHWAY = [
  { tier:"0–4",   nodes:[{id:"kinderopvang"}] },
  { tier:"4–12",  nodes:[{id:"basisschool"}] },
  { tier:"11–12", nodes:[{id:"groep8"}] },
  { tier:"12–18", nodes:[{id:"vmbo"},{id:"havo"},{id:"vwo"},{id:"isk"}] },
  { tier:"18+",   nodes:[{id:"vavo"},{id:"mbo"},{id:"hbo"},{id:"wo"}] },
  { tier:"22+",   nodes:[{id:"phd"},{id:"werk"}] },
];

/* ═══════════════════════════════════════════════════════════
   TRANSITIONS (data rows for main table)
═══════════════════════════════════════════════════════════ */
const TRANSITIONS = [
  { from:"Basisschool", to:"VMBO / HAVO / VWO", req:{ar:`${nl("Doorstroomtoets")} + ${nl("schooladvies")}`, nl:`Doorstroomtoets + schooladvies`}, notes:{ar:`توصية المعلم حاسمة`, nl:`Leerlingadvies is doorslaggevend`} },
  { from:"VMBO-BB",    to:"MBO 2",          req:{ar:`شهادة ${nl("VMBO-BB")}`,          nl:`Diploma VMBO-BB`},          notes:{ar:`مسار مهني أساسي`, nl:`Basisberoepsroute`} },
  { from:"VMBO-KB",    to:"MBO 3 / 4",      req:{ar:`شهادة ${nl("VMBO-KB")}`,          nl:`Diploma VMBO-KB`},          notes:{ar:`—`, nl:`—`} },
  { from:"VMBO-GL/TL", to:"MBO 4 أو HAVO 4",req:{ar:`شهادة + مواد صحيحة`,              nl:`Diploma + juiste vakken`}, notes:{ar:`إلى ${nl("HAVO")} بحد أدنى 6,8`, nl:`Naar HAVO met gem. ≥ 6,8`} },
  { from:"HAVO",       to:"HBO",            req:{ar:`شهادة ${nl("HAVO")} + ${nl("profiel")} مطابق`, nl:`HAVO-diploma + passend profiel`}, notes:{ar:`—`, nl:`—`} },
  { from:"HAVO 5",     to:"VWO 5",          req:{ar:`معدل ≥ 7,0 + موافقة المدرسة`,     nl:`Gemiddelde ≥ 7,0 + toestemming`}, notes:{ar:`مساران إضافيان`, nl:`Extra vakken vereist`} },
  { from:"VWO",        to:"WO",             req:{ar:`شهادة ${nl("VWO")} + ${nl("profiel")} مطابق`, nl:`VWO-diploma + passend profiel`}, notes:{ar:`قبول مباشر`, nl:`Directe toegang`} },
  { from:"MBO 4",      to:"HBO",            req:{ar:`شهادة ${nl("MBO 4")}`,            nl:`Diploma MBO 4`},            notes:{ar:`قد تُطلب مواد إضافية`, nl:`Soms extra vakken`} },
  { from:"HBO-Bachelor",to:"WO-Master",     req:{ar:`${nl("Pre-master")} (1 سنة)`,     nl:`Pre-master (1 jaar)`},      notes:{ar:`حسب تخصص الجامعة`, nl:`Afhankelijk van studie`} },
  { from:"WO-Master",  to:"PhD",            req:{ar:`عرض مشروع + قبول مشرف`,            nl:`Onderzoeksvoorstel + promotor`}, notes:{ar:`منصب موظف مدفوع`, nl:`Betaalde positie`} },
];

/* ═══════════════════════════════════════════════════════════
   SALARY DATA (2026 gross estimates)
═══════════════════════════════════════════════════════════ */
const SALARIES = [
  { field:{ar:"عامل مساعد (بلا شهادة)", nl:"Ongeschoolde arbeid"},                gross:"€2.200", growth:"1–2%" },
  { field:{ar:"خريج MBO 2–3", nl:"MBO 2–3 afgestudeerd"},                           gross:"€2.600", growth:"2–3%" },
  { field:{ar:"خريج MBO 4 (تقني)", nl:"MBO 4 (technisch)"},                         gross:"€3.200", growth:"3–4%" },
  { field:{ar:"خريج HBO (بكالوريوس)", nl:"HBO-Bachelor"},                           gross:"€3.800", growth:"4–5%" },
  { field:{ar:"خريج WO (بكالوريوس)", nl:"WO-Bachelor"},                             gross:"€4.000", growth:"4–5%" },
  { field:{ar:"خريج WO ماجستير (هندسة/IT)", nl:"WO-Master (engineering/IT)"},       gross:"€4.600", growth:"5–7%" },
  { field:{ar:"طبيب (بعد التخصص)", nl:"Arts (na specialisatie)"},                   gross:"€6.500", growth:"3–4%" },
  { field:{ar:"باحث PhD (Promovendus)", nl:"Promovendus"},                          gross:"€2.900–€3.700", growth:"—" },
];

/* ═══════════════════════════════════════════════════════════
   ENTRANCE EXAMS / VOORTENTAMENS (CCVX, VASVU, Boswell-Bèta, Colloquium Doctum, Staatsexamen)
═══════════════════════════════════════════════════════════ */
const EXAMS = [
  {
    id:"ccvx", icon:"🧪", color:"blue",
    name:{ar:"CCVX — لجنة التحضير للامتحانات الجامعية", nl:"CCVX (Centrale Commissie Voortentamen)"},
    organizer:{ar:"تنظمها UvA / VU / UU / RUG / Erasmus / TU Delft / TU/e", nl:"Universiteit van Amsterdam, VU, UU, RUG, EUR, TUD, TU/e"},
    purpose:{
      ar:"امتحان قبول لمن يفتقد مادة محددة من الـ VWO (مثل الفيزياء أو الرياضيات أو الكيمياء أو علم الأحياء) ويريد التسجيل في دراسة جامعية WO تتطلبها — مثل الطب وطب الأسنان والصيدلة والهندسة وعلوم الكمبيوتر.",
      nl:"Toelatingsexamen voor wie een specifiek VWO-vak mist (natuurkunde, wiskunde, scheikunde of biologie) en zich wil inschrijven voor een WO-studie die dat vak vereist — geneeskunde, tandheelkunde, farmacie, technische studies, informatica."
    },
    subjects:{
      ar:["رياضيات A (Wiskunde A)","رياضيات B (Wiskunde B)","رياضيات C (Wiskunde C)","رياضيات D (Wiskunde D)","فيزياء (Natuurkunde)","كيمياء (Scheikunde)","علم الأحياء (Biologie)"],
      nl:["Wiskunde A","Wiskunde B","Wiskunde C","Wiskunde D","Natuurkunde","Scheikunde","Biologie"]
    },
    duration:{ar:"3 ساعات للامتحان · التحضير 3–9 أشهر بدوام جزئي", nl:"3 uur examen · voorbereiding 3–9 maanden parttime"},
    fee:{ar:"≈ €170 لكل مادة (2026)", nl:"≈ €170 per vak (2026)"},
    whoFor:{
      ar:"خريج HBO أو HAVO أو ثانوية أجنبية يفتقد مادة، أو من يريد تغيير دراسته إلى تخصص علمي.",
      nl:"HBO/HAVO-afgestudeerden of houders van een buitenlands diploma die één vak missen, of switchers naar een bèta-studie."
    },
    howToRegister:{
      ar:"التسجيل عبر ccvx.nl قبل الامتحان بشهر على الأقل. الامتحانات تُعقد 3 مرات سنويًا: يناير، يونيو/يوليو، أغسطس.",
      nl:"Inschrijven via ccvx.nl, minimaal 4 weken voor de examendatum. Drie tentamenrondes per jaar: januari, juni/juli, augustus."
    },
    tips:{
      ar:["ابدأ التحضير قبل 6 أشهر على الأقل","استخدم كتاب Getal & Ruimte للرياضيات","شراء امتحانات قديمة (oude tentamens) من ccvx.nl","النتيجة 5.5/10 = ناجح"],
      nl:["Begin minstens 6 maanden van tevoren","Gebruik Getal & Ruimte voor wiskunde","Koop oude tentamens via ccvx.nl","Cijfer ≥ 5.5/10 = geslaagd"]
    },
    link:"https://www.ccvx.nl"
  },
  {
    id:"boswell", icon:"🧬", color:"purple",
    name:{ar:"Boswell-Bèta — معهد بوزويل للعلوم", nl:"Boswell-Bèta (Voortentamens bèta-vakken)"},
    organizer:{ar:"معهد Boswell-Bèta المستقل (معتمد من جميع الجامعات الهولندية)", nl:"Onafhankelijk instituut Boswell-Bèta (erkend door alle universiteiten)"},
    purpose:{
      ar:"بديل لـ CCVX — يقدم نفس امتحانات المواد العلمية المفقودة من VWO، مع دورات تحضيرية مكثفة.",
      nl:"Alternatief voor CCVX — biedt dezelfde voortentamens voor ontbrekende VWO-bètavakken, plus intensieve voorbereidende cursussen."
    },
    subjects:{
      ar:["رياضيات A/B/C/D","فيزياء","كيمياء","علم الأحياء","NLT (طبيعة وحياة وتكنولوجيا)"],
      nl:["Wiskunde A/B/C/D","Natuurkunde","Scheikunde","Biologie","NLT"]
    },
    duration:{ar:"3 ساعات · دورات Boswell من 8 إلى 24 أسبوعًا", nl:"3 uur examen · Boswell-cursussen 8 tot 24 weken"},
    fee:{ar:"≈ €175 للامتحان · €600–€1.800 للدورة", nl:"≈ €175 per examen · €600–€1.800 per cursus"},
    whoFor:{
      ar:"من يفضّل التحضير المنظَّم في فصول دراسية بدل الدراسة الذاتية. مناسب لمن يريد التركيز على الطب أو الصيدلة.",
      nl:"Wie liever klassikaal studeert dan zelfstandig. Geschikt voor switchers naar geneeskunde, farmacie of tandheelkunde."
    },
    howToRegister:{
      ar:"التسجيل عبر boswell-beta.nl. الامتحانات شهرية تقريبًا في Utrecht.",
      nl:"Inschrijving via boswell-beta.nl. Tentamens vrijwel maandelijks in Utrecht."
    },
    tips:{
      ar:["الدورات المكثفة الصيفية ممتازة قبل بدء العام الجامعي","يمكن دمج الدورة مع أوقات العمل الجزئي","النتيجة معترف بها لمدة سنتين"],
      nl:["Intensieve zomercursussen ideaal vóór studiestart","Combineerbaar met parttime werk","Resultaat 2 jaar geldig"]
    },
    link:"https://www.boswell-beta.nl"
  },
  {
    id:"vasvu", icon:"📐", color:"orange",
    name:{ar:"VASVU — امتحانات قبول جامعة VU أمستردام", nl:"VASVU (Voortentamens VU Amsterdam)"},
    organizer:{ar:"جامعة Vrije Universiteit Amsterdam", nl:"Vrije Universiteit Amsterdam"},
    purpose:{
      ar:"امتحان قبول مماثل لـ CCVX لكنه مرتبط بـ VU. يُقبل في عدة جامعات هولندية لتعويض المواد المفقودة من VWO.",
      nl:"Toelatingsexamen vergelijkbaar met CCVX, georganiseerd door VU. Geaccepteerd bij diverse Nederlandse universiteiten om ontbrekende VWO-vakken te compenseren."
    },
    subjects:{
      ar:["رياضيات A","رياضيات B","فيزياء","كيمياء","علم الأحياء","الاقتصاد (Economie)"],
      nl:["Wiskunde A","Wiskunde B","Natuurkunde","Scheikunde","Biologie","Economie"]
    },
    duration:{ar:"3 ساعات · دورات VU التحضيرية 12–20 أسبوعًا", nl:"3 uur examen · VU voorbereidingscursussen 12–20 weken"},
    fee:{ar:"≈ €175 للامتحان · €700–€1.500 للدورة", nl:"≈ €175 examen · €700–€1.500 cursus"},
    whoFor:{
      ar:"خريجو HBO الذين يريدون الانتقال إلى ماجستير WO ويفتقدون مادة VWO. الاقتصاد مهم لكليات إدارة الأعمال.",
      nl:"HBO-afgestudeerden die instromen in WO-master en VWO-vak missen. Economie nuttig voor bedrijfskundige opleidingen."
    },
    howToRegister:{
      ar:"عبر vu.nl/voortentamens — التسجيل قبل 4 أسابيع. الامتحانات: يناير، يونيو، أغسطس.",
      nl:"Via vu.nl/voortentamens — minimaal 4 weken vooraf. Tentamens: januari, juni, augustus."
    },
    tips:{
      ar:["النتيجة معترف بها في معظم الجامعات (تحقق من جامعتك)","دورة Economie متاحة فقط عبر VASVU","نتيجة ≥ 5.5 = ناجح"],
      nl:["Resultaat geldt bij meeste universiteiten (check je universiteit)","Economie alleen via VASVU","≥ 5.5 = geslaagd"]
    },
    link:"https://vu.nl/nl/onderwijs/voortentamen"
  },
  {
    id:"colloquium", icon:"🎓", color:"green",
    name:{ar:"Colloquium Doctum — امتحان الكولوكويوم للبالغين", nl:"Colloquium Doctum (toelatingsonderzoek 21+)"},
    organizer:{ar:"كل جامعة (WO) أو HBO تنظمه بشكل مستقل", nl:"Per universiteit (WO) of hogeschool (HBO) afzonderlijk"},
    purpose:{
      ar:"امتحان قبول للأشخاص الذين تجاوزوا 21 عامًا ولا يملكون شهادة VWO أو HAVO أو MBO-4. يُثبت الجاهزية الأكاديمية.",
      nl:"Toelatingsonderzoek voor 21+ zonder VWO/HAVO/MBO-4 diploma. Toont aan dat kandidaat academisch klaar is."
    },
    subjects:{
      ar:["اللغة الهولندية (Nederlands)","الإنجليزية (Engels)","الرياضيات (Wiskunde A أو B حسب الدراسة)","مادة تخصصية (مثل علم الأحياء للطب أو الفيزياء للهندسة)"],
      nl:["Nederlands","Engels","Wiskunde (A of B, afhankelijk van studie)","Vakspecifiek (bv. biologie voor geneeskunde, natuurkunde voor techniek)"]
    },
    duration:{ar:"كل امتحان 2–3 ساعات · يستغرق التحضير 6–18 شهرًا", nl:"Per vak 2–3 uur · voorbereiding 6–18 maanden"},
    fee:{ar:"€200–€500 حسب الجامعة والمواد", nl:"€200–€500 afhankelijk van universiteit en vakken"},
    whoFor:{
      ar:"الكبار (≥21 سنة) بدون دبلوم معترف به يريدون دخول جامعة هولندية. شائع للقادمين من خارج النظام التعليمي الهولندي.",
      nl:"Volwassenen (≥21 jaar) zonder geldig diploma die toegang willen tot een NL-universiteit. Vaak voor wie buiten het NL-onderwijssysteem valt."
    },
    howToRegister:{
      ar:"اتصل مباشرة بمكتب القبول (Toelatingscommissie) في الجامعة المستهدفة قبل 6 أشهر على الأقل.",
      nl:"Direct contact opnemen met de Toelatingscommissie van de gewenste universiteit, minstens 6 maanden vooraf."
    },
    tips:{
      ar:["كل جامعة لها متطلبات مختلفة — استفسر مبكرًا","عادة يتطلب رسالة دافع (motivatiebrief)","قد يطلب لقاء شخصي مع لجنة القبول"],
      nl:["Elke universiteit stelt eigen eisen — vraag vroeg","Meestal motivatiebrief vereist","Mogelijk persoonlijk gesprek met commissie"]
    },
    link:"https://www.studiekeuze123.nl/zonder-vwo"
  },
  {
    id:"staatsexamen", icon:"🏛️", color:"red",
    name:{ar:"Staatsexamen VWO/HAVO — امتحان الدولة", nl:"Staatsexamen VWO/HAVO"},
    organizer:{ar:"DUO (Dienst Uitvoering Onderwijs) نيابةً عن وزارة التعليم", nl:"DUO (Dienst Uitvoering Onderwijs) namens het Ministerie van OCW"},
    purpose:{
      ar:"للحصول على دبلوم VWO أو HAVO معترف به رسميًا بدون حضور مدرسة ثانوية كاملة. يفتح الباب لجميع الجامعات الهولندية مباشرة.",
      nl:"Om officieel een VWO- of HAVO-diploma te behalen zonder een complete middelbare school te doorlopen. Geeft directe toegang tot universiteit/hogeschool."
    },
    subjects:{
      ar:["باقة كاملة (مع التحضير الذاتي أو دورات VAVO/ISK)","حد أدنى 7 مواد لـ VWO شامل: هولندي، إنجليزي، رياضيات، +profiel (NT/NG/EM/CM)","الأدب، الجغرافيا، التاريخ، الفلسفة، اللغات الإضافية متاحة"],
      nl:["Volledig vakkenpakket (zelfstandig of via VAVO/ISK)","Minimaal 7 vakken voor VWO: Nederlands, Engels, Wiskunde + profielvakken (NT/NG/EM/CM)","Literatuur, aardrijkskunde, geschiedenis, filosofie en extra talen mogelijk"]
    },
    duration:{ar:"الامتحانات بين مايو ويوليو سنويًا · التحضير 1–3 سنوات", nl:"Examens tussen mei en juli jaarlijks · voorbereiding 1–3 jaar"},
    fee:{ar:"≈ €60 لكل مادة (2026)", nl:"≈ €60 per vak (2026)"},
    whoFor:{
      ar:"الكبار، التعليم المنزلي، القادمون الجدد إلى هولندا، طلاب VAVO/ISK، أو من يريد ترقية شهادته من HAVO إلى VWO.",
      nl:"Volwassenen, thuisonderwijs, nieuwkomers, VAVO/ISK-leerlingen, of wie HAVO wil opwaarderen naar VWO."
    },
    howToRegister:{
      ar:"عبر duo.nl قبل 1 يناير من السنة التي تريد الامتحان فيها. لا يمكن التسجيل بعد الموعد النهائي.",
      nl:"Via duo.nl vóór 1 januari van het examenjaar. Te late aanmelding wordt niet geaccepteerd."
    },
    tips:{
      ar:["متاح بمستوى VWO أو HAVO أو VMBO-TL","يُحتسب على مدى عدة سنوات (يمكن جمع المواد تدريجيًا)","ادرس عبر VAVO الحكومي بدوام جزئي/كامل (مجاني للأعمار ≤21)","نتيجة المواد ≥ 5.5/10 = ناجح"],
      nl:["Beschikbaar op VWO, HAVO of VMBO-TL niveau","Vakken kunnen over meerdere jaren gespreid worden","Studeer parttime/voltijds via VAVO (gratis tot 21 jaar)","Cijfer ≥ 5.5/10 = geslaagd"]
    },
    link:"https://www.duo.nl/particulier/staatsexamen-nt2/hoe-het-staatsexamen-nt2-werkt.jsp"
  },
  {
    id:"staatsexamen-nt2", icon:"🗣️", color:"teal",
    name:{ar:"Staatsexamen NT2 — امتحان الهولندية كلغة ثانية", nl:"Staatsexamen NT2 (Nederlands als 2e taal)"},
    organizer:{ar:"DUO / College voor Toetsen en Examens", nl:"DUO / College voor Toetsen en Examens"},
    purpose:{
      ar:"شهادة الكفاءة في اللغة الهولندية. شرط لجميع الدراسات الجامعية الهولندية للأجانب. مستويان: NT2-I (B1) للـ MBO، NT2-II (B2) للـ HBO/WO.",
      nl:"Bewijs van Nederlands taalvaardigheid. Vereist voor alle Nederlandstalige opleidingen voor buitenlandse studenten. Twee niveaus: NT2-I (B1) voor MBO, NT2-II (B2) voor HBO/WO."
    },
    subjects:{
      ar:["القراءة (Lezen)","الاستماع (Luisteren)","الكتابة (Schrijven)","المحادثة (Spreken)"],
      nl:["Lezen","Luisteren","Schrijven","Spreken"]
    },
    duration:{ar:"كل جزء 100–110 دقيقة · مواعيد طوال السنة", nl:"Per onderdeel 100–110 minuten · jaarrond mogelijk"},
    fee:{ar:"€90 لكل جزء (€360 للكامل)", nl:"€90 per onderdeel (€360 totaal)"},
    whoFor:{
      ar:"كل ناطق غير أصلي بالهولندية يريد الدراسة أو العمل المهني في هولندا. شرط أساسي للتجنُّس (Inburgering).",
      nl:"Iedere niet-moedertaalspreker die in NL wil studeren of professioneel werken. Basisvereiste voor inburgering."
    },
    howToRegister:{
      ar:"عبر duo.nl. مراكز الامتحانات في Amsterdam وRotterdam وZwolle وEindhoven وArnhem.",
      nl:"Via duo.nl. Examencentra in Amsterdam, Rotterdam, Zwolle, Eindhoven, Arnhem."
    },
    tips:{
      ar:["NT2-II (B2) إلزامي للقبول في WO/HBO الهولندية","ادرس عبر ROC أو دورات خاصة","ابدأ بالتحضير قبل 6–12 شهرًا"],
      nl:["NT2-II (B2) verplicht voor toelating tot WO/HBO","Voorbereiding via ROC of taalschool","Begin 6–12 maanden van tevoren"]
    },
    link:"https://www.duo.nl/particulier/staatsexamen-nt2/"
  },
  {
    id:"ielts-toefl", icon:"🌍", color:"navy",
    name:{ar:"IELTS / TOEFL — اللغة الإنجليزية", nl:"IELTS / TOEFL (Engelstalige programma's)"},
    organizer:{ar:"British Council / IDP / ETS", nl:"British Council / IDP / ETS"},
    purpose:{
      ar:"شرط للدراسات الإنجليزية في هولندا (Bachelor و Master). الحد الأدنى يختلف حسب الدراسة.",
      nl:"Vereist voor Engelstalige bachelors en masters in NL. Minimumscores variëren per opleiding."
    },
    subjects:{
      ar:["IELTS Academic: 6.0 إلى 7.0 (حسب الدراسة)","TOEFL iBT: 80 إلى 100","Cambridge CAE / CPE: مقبول كذلك"],
      nl:["IELTS Academic: 6.0 tot 7.0 (afhankelijk)","TOEFL iBT: 80 tot 100","Cambridge CAE/CPE: ook geaccepteerd"]
    },
    duration:{ar:"IELTS: ~3 ساعات · TOEFL: ~3 ساعات · النتائج بعد 5–13 يومًا", nl:"IELTS: ~3 uur · TOEFL: ~3 uur · uitslag na 5–13 dagen"},
    fee:{ar:"€225–€260 (IELTS) · €245 (TOEFL)", nl:"€225–€260 (IELTS) · €245 (TOEFL)"},
    whoFor:{
      ar:"كل طالب أجنبي يتقدم لدراسة بالإنجليزية. خريجو HAVO/VWO الهولنديون عادةً معفون.",
      nl:"Alle buitenlandse studenten in Engelstalige programma's. NL HAVO/VWO-afgestudeerden meestal vrijgesteld."
    },
    howToRegister:{
      ar:"عبر ielts.org أو ets.org/toefl. مواعيد متعددة شهريًا في أمستردام وروتردام ولاهاي.",
      nl:"Via ielts.org of ets.org/toefl. Meerdere data per maand in Amsterdam, Rotterdam, Den Haag."
    },
    tips:{
      ar:["النتيجة صالحة لمدة سنتين فقط","استخدم اختبارات تجريبية مجانية على ielts.org","قد تُقبل شهادة Duolingo English Test في بعض الجامعات (تحقق)"],
      nl:["Resultaat 2 jaar geldig","Gratis oefenexamens op ielts.org","Sommige universiteiten accepteren Duolingo English Test (check)"]
    },
    link:"https://www.studyfinder.nl/admission-requirements"
  },
  {
    id:"tudelft-ompt", icon:"🔧", color:"blue",
    name:{ar:"TU Delft OMPT / Matching — امتحانات التقنية", nl:"TU Delft OMPT & Matching"},
    organizer:{ar:"TU Delft، TU/e، University of Twente (4TU)", nl:"TU Delft, TU/e, Universiteit Twente (4TU)"},
    purpose:{
      ar:"OMPT (Online Mathematics Placement Test) يقيس مستوى Wiskunde B للدراسات التقنية. Matching امتحان إلزامي لكل متقدم لـ bachelor تقني — لا يُسبّب رفضًا لكنه يبيّن ما إذا كنت جاهزًا.",
      nl:"OMPT (Online Mathematics Placement Test) toetst Wiskunde B-niveau voor technische studies. Matching is een verplicht onderzoek voor elke aanmelder van een technische bachelor — wijst geen af, maar toont studiegeschiktheid."
    },
    subjects:{
      ar:["Wiskunde B (الجبر، الدوال، التفاضل والتكامل، المتجهات)","Natuurkunde (اختياري في بعض البرامج)","اختبار شخصية + مقابلة (matching)"],
      nl:["Wiskunde B (algebra, functies, differentiëren, integreren, vectoren)","Natuurkunde (optioneel in sommige programma's)","Persoonlijkheidstest + intakegesprek (matching)"]
    },
    duration:{ar:"OMPT: 3 ساعات · Matching: يوم كامل", nl:"OMPT: 3 uur · Matching: hele dag"},
    fee:{ar:"OMPT: €95 · Matching: مجاني", nl:"OMPT: €95 · Matching: gratis"},
    whoFor:{
      ar:"كل متقدم لدراسة Werktuigbouwkunde أو Civiele Techniek أو Lucht- & Ruimtevaart أو Informatica في الجامعات التقنية. OMPT مفيد لمن درس خارج هولندا ويحتاج إثبات Wiskunde B.",
      nl:"Alle aanmelders voor Werktuigbouwkunde, Civiele Techniek, Lucht- & Ruimtevaart, Informatica aan TU's. OMPT vooral voor internationale studenten die Wiskunde B moeten aantonen."
    },
    howToRegister:{
      ar:"عبر ompt.nl (الرياضيات) + studielink.nl للـ matching. تسجل قبل 1 مايو.",
      nl:"Via ompt.nl (wiskunde) + studielink.nl voor matching. Aanmelden vóór 1 mei."
    },
    tips:{
      ar:["النتيجة ≥ 60% لاجتياز OMPT-WB1","OMPT مقبولة أيضًا لمحاسبة Wiskunde B في جامعات أخرى","Matching لا يُرفض، لكنه يوصي بدراسة مختلفة إذا لم تكن جاهزًا","ابدأ التحضير قبل 3 أشهر"],
      nl:["Score ≥ 60% om OMPT-WB1 te halen","OMPT geldt ook als bewijs Wiskunde B bij andere universiteiten","Matching kan niet weigeren maar kan ander advies geven","Begin minimaal 3 maanden vooraf"]
    },
    link:"https://ompt.nl"
  },
  {
    id:"schakeljaar", icon:"🔗", color:"purple",
    name:{ar:"Schakeljaar / Premaster — السنة التحضيرية", nl:"Schakeljaar / Premaster"},
    organizer:{ar:"كل جامعة هولندية تنظمه مستقلًا (WO & HBO)", nl:"Elke NL-universiteit organiseert dit afzonderlijk (WO & HBO)"},
    purpose:{
      ar:"برنامج تحضيري (30–60 ECTS) للانتقال من HBO Bachelor إلى WO Master، أو بين تخصصات مختلفة. بديل عن CCVX للمواد الأكاديمية المفقودة، يشمل منهجيات البحث + مواد تخصصية.",
      nl:"Voorbereidend programma (30–60 ECTS) voor doorstroom van HBO-Bachelor naar WO-Master, of tussen vakgebieden. Alternatief voor CCVX op academisch niveau, met onderzoeksmethoden + vakinhoudelijke modules."
    },
    subjects:{
      ar:["منهجية البحث (Onderzoeksmethoden)","إحصاء (Statistiek)","الكتابة الأكاديمية (Academisch schrijven)","مواد تخصصية (مثل Microeconomie، Biochemie)","الإنجليزية الأكاديمية (Academic English)"],
      nl:["Onderzoeksmethoden","Statistiek","Academisch schrijven","Vakinhoudelijke modules (bv. Microeconomie, Biochemie)","Academic English"]
    },
    duration:{ar:"6 أشهر إلى سنة كاملة (30–60 ECTS)", nl:"6 maanden tot 1 jaar (30–60 ECTS)"},
    fee:{ar:"رسوم دراسية عادية (€2.530 للسنة) + أحيانًا رسوم إضافية", nl:"Collegegeld regulier (€2.530/jaar) + soms extra bijdrage"},
    whoFor:{
      ar:"خريج HBO يريد master أكاديمي WO، أو خريج bachelor WO في تخصص يريد التحول إلى master آخر (مثلا من Biologie إلى Geneeskunde — Zij-instroom).",
      nl:"HBO-afgestudeerde richting WO-master, of WO-bachelor die overstapt naar master in ander vakgebied (bv. Biologie naar Geneeskunde — zij-instroom)."
    },
    howToRegister:{
      ar:"عبر موقع الجامعة نفسها (ليس studielink). المواعيد: سبتمبر أو فبراير.",
      nl:"Via website van universiteit (niet studielink). Start: september of februari."
    },
    tips:{
      ar:["Studiefinanciering متاح (DUO) — اسأل مكتب DUO قبل البدء","المعدل المطلوب من HBO Bachelor = 7.0 عادةً","بعض الجامعات تطلب رسالة دافع + CV","الطب البشري (Zij-instroom Geneeskunde) صعب جدًا — 60 مقعدًا فقط وطنيًا"],
      nl:["Studiefinanciering mogelijk (DUO) — check vooraf","HBO-eindcijfer meestal ≥ 7.0 vereist","Sommige unis vragen motivatiebrief + CV","Zij-instroom Geneeskunde zeer selectief — slechts ~60 plekken landelijk"]
    },
    link:"https://www.studielink.nl"
  },
  {
    id:"decentrale-selectie", icon:"🎯", color:"red",
    name:{ar:"Decentrale Selectie — الاختيار اللامركزي", nl:"Decentrale Selectie (Numerus Fixus)"},
    organizer:{ar:"كل جامعة مستقلة (للدراسات ذات numerus fixus)", nl:"Per universiteit (studies met numerus fixus)"},
    purpose:{
      ar:"إجراء القبول للدراسات المحدودة (numerus fixus) مثل الطب وطب الأسنان والفيزياء والنفس. منذ 2017، لا توجد قرعة (loting) — كل الجامعات تستخدم التقييم المتعدد.",
      nl:"Selectieprocedure voor studies met numerus fixus zoals geneeskunde, tandheelkunde, psychologie. Sinds 2017 géén loting meer — alle universiteiten gebruiken meervoudige selectie."
    },
    subjects:{
      ar:["معدل VWO (Cijferlijst) — الوزن 30–50%","اختبار المعرفة (Kennistoets) — Biologie, Scheikunde","اختبار الحكم السياقي (Situational Judgement Test)","مقابلات شخصية (Interviews)","خبرة طبية أو اجتماعية (CV / motivatie)"],
      nl:["VWO-cijferlijst — weging 30–50%","Kennistoets (Biologie, Scheikunde)","Situational Judgement Test (SJT)","Persoonlijke interviews","Medische/maatschappelijke ervaring (CV/motivatie)"]
    },
    duration:{ar:"عملية 3–4 أشهر (يناير → أبريل)، اختبارات في مارس", nl:"Proces 3–4 maanden (januari → april), toetsen in maart"},
    fee:{ar:"مجانية أو €50–€150 حسب الجامعة", nl:"Gratis of €50–€150 per universiteit"},
    whoFor:{
      ar:"كل متقدم لدراسة ذات numerus fixus. يُلزَم 2 محاولات قصوى لكل دراسة (lifetime cap).",
      nl:"Iedereen die zich aanmeldt voor een studie met numerus fixus. Maximaal 3 pogingen per studie over hele leven."
    },
    howToRegister:{
      ar:"التسجيل الأساسي عبر studielink.nl قبل 15 يناير (بدون استثناء)، ثم إكمال ملف الاختيار في موقع الجامعة قبل 1 فبراير.",
      nl:"Inschrijving via studielink.nl vóór 15 januari (géén uitstel), dan selectiedossier indienen bij universiteit vóór 1 februari."
    },
    tips:{
      ar:["ابدأ بإعداد CV + رسالة دافع قبل سبتمبر","اقرأ مقالات Nature / NRC عن الطب لرفع ثقافتك","Oefentests متوفرة على studielink.nl","رتبة 1-800 = مقبول، 801-1200 = قائمة انتظار","يمكن التقديم لـ 2 دراسة numerus fixus في نفس العام"],
      nl:["Begin CV + motivatiebrief vóór september","Lees Nature / NRC over geneeskunde voor bredere kennis","Oefentests op studielink.nl","Rang 1-800 = toegelaten, 801-1200 = wachtlijst","Max. 2 numerus fixus-studies per jaar aanmelden"]
    },
    link:"https://www.studielink.nl/s/numerus-fixus"
  },
];

/* ═══════════════════════════════════════════════════════════
   STUDY REQUIREMENTS — Toelatingseisen voor populaire studies
═══════════════════════════════════════════════════════════ */
const STUDY_REQUIREMENTS = [
  {
    id:"geneeskunde", icon:"⚕️", level:"WO",
    name:{ar:"الطب البشري (Geneeskunde)", nl:"Geneeskunde"},
    duration:{ar:"3 سنوات بكالوريوس + 3 سنوات ماجستير + 3–6 سنوات تخصص", nl:"3 jaar Bachelor + 3 jaar Master + 3–6 jaar specialisatie"},
    profile:{ar:"VWO شعبة Natuur & Gezondheid أو Natuur & Techniek", nl:"VWO Natuur & Gezondheid of Natuur & Techniek"},
    requiredSubjects:{
      ar:["Wiskunde A أو B","Scheikunde (إجباري)","Biologie (مفضّل بقوة، وإجباري في بعض الجامعات مثل Leiden / Utrecht)","Natuurkunde (مطلوب أحيانًا — تحقق من الجامعة)"],
      nl:["Wiskunde A of B","Scheikunde (verplicht)","Biologie (sterk aanbevolen, verplicht bij Leiden / Utrecht)","Natuurkunde (soms vereist — check universiteit)"]
    },
    selection:{
      ar:"اختيار غير مركزي (decentrale selectie) في كل الجامعات. لا يوجد yوكنة عشوائية بعد 2017. التقييم: المعدل + اختبارات شخصية + مقابلات + خبرة طبية.",
      nl:"Decentrale selectie bij alle universiteiten. Geen loting meer na 2017. Beoordeeld op: cijfers + persoonlijke testen + interviews + medische ervaring."
    },
    universities:{
      ar:["Universiteit van Amsterdam (AMC)","Vrije Universiteit (VUmc)","Universiteit Leiden (LUMC)","Universiteit Utrecht (UMC Utrecht)","Erasmus Universiteit Rotterdam","Radboud Universiteit Nijmegen","Rijksuniversiteit Groningen","Maastricht University"],
      nl:["UvA (AMC)","VU (VUmc)","UL (LUMC)","UU (UMC Utrecht)","EUR (Erasmus MC)","RU (Radboudumc)","RUG (UMCG)","UM"]
    },
    deadline:{ar:"15 يناير سنويًا عبر Studielink", nl:"15 januari jaarlijks via Studielink"},
    tips:{
      ar:["معدل VWO ≥ 7.5 يزيد فرصك بقوة","تطوع في مستشفى أو دار رعاية لكسب نقاط الخبرة","استعد لاختبارات BMAT / situational judgement في كل جامعة","فرصة قبول ~30% في أول محاولة"],
      nl:["VWO-gemiddelde ≥ 7.5 verhoogt kansen sterk","Vrijwilligerswerk in ziekenhuis of zorginstelling helpt","Bereid je voor op BMAT / situational judgement tests","Toelatingskans ~30% bij eerste poging"]
    }
  },
  {
    id:"tandheelkunde", icon:"🦷", level:"WO",
    name:{ar:"طب الأسنان (Tandheelkunde)", nl:"Tandheelkunde"},
    duration:{ar:"3 سنوات بكالوريوس + 3 سنوات ماجستير + تخصص اختياري 3–4 سنوات", nl:"3 jaar Bachelor + 3 jaar Master + specialisatie 3–4 jaar (optioneel)"},
    profile:{ar:"VWO N&G أو N&T", nl:"VWO N&G of N&T"},
    requiredSubjects:{
      ar:["Wiskunde A أو B","Scheikunde","Biologie","Natuurkunde (مفضّل)"],
      nl:["Wiskunde A of B","Scheikunde","Biologie","Natuurkunde (aanbevolen)"]
    },
    selection:{
      ar:"اختيار غير مركزي + اختبار الكفاءة اليدوية (handvaardigheid) في بعض الجامعات.",
      nl:"Decentrale selectie + handvaardigheidstest bij enkele universiteiten."
    },
    universities:{
      ar:["ACTA (UvA + VU، أمستردام)","Radboud Universiteit Nijmegen","Rijksuniversiteit Groningen"],
      nl:["ACTA (UvA + VU)","RU Nijmegen","RUG Groningen"]
    },
    deadline:{ar:"15 يناير عبر Studielink", nl:"15 januari via Studielink"},
    tips:{
      ar:["المهارة اليدوية مهمة (رسم، نحت، عمل دقيق)","المنافسة شديدة جدًا — حوالي 1500 متقدم لـ 240 مقعد","ادرس بمعدل 7.5+ لتعزيز فرصك"],
      nl:["Handvaardigheid belangrijk (tekenen, beeldhouwen, fijn werk)","Zeer competitief — ~1500 aanmeldingen voor 240 plekken","VWO ≥ 7.5 verhoogt kansen"]
    }
  },
  {
    id:"diergeneeskunde", icon:"🐾", level:"WO",
    name:{ar:"الطب البيطري (Diergeneeskunde)", nl:"Diergeneeskunde"},
    duration:{ar:"3 سنوات بكالوريوس + 3 سنوات ماجستير", nl:"3 jaar Bachelor + 3 jaar Master"},
    profile:{ar:"VWO N&G أو N&T", nl:"VWO N&G of N&T"},
    requiredSubjects:{
      ar:["Wiskunde A أو B","Scheikunde","Biologie","Natuurkunde (مفضّل)"],
      nl:["Wiskunde A of B","Scheikunde","Biologie","Natuurkunde (aanbevolen)"]
    },
    selection:{
      ar:"اختيار غير مركزي. خبرة عملية مع الحيوانات (مزرعة، عيادة بيطرية، حديقة حيوان) إجبارية.",
      nl:"Decentrale selectie. Werkervaring met dieren (boerderij, dierenkliniek, dierentuin) verplicht."
    },
    universities:{
      ar:["Universiteit Utrecht (الوحيدة في هولندا)"],
      nl:["Universiteit Utrecht (enige in NL)"]
    },
    deadline:{ar:"15 يناير عبر Studielink", nl:"15 januari via Studielink"},
    tips:{
      ar:["جمّع خبرة 80+ ساعة مع الحيوانات قبل التقديم","225 مقعدًا فقط سنويًا — منافسة قوية","تخصصات: حيوانات أليفة، مزرعة، خيول، حياة برية"],
      nl:["Verzamel 80+ uur werkervaring met dieren","Slechts 225 plekken per jaar — sterke concurrentie","Differentiaties: gezelschapsdieren, landbouwhuisdieren, paard, wildlife"]
    }
  },
  {
    id:"farmacie", icon:"💊", level:"WO",
    name:{ar:"الصيدلة (Farmacie)", nl:"Farmacie"},
    duration:{ar:"3 سنوات بكالوريوس + 3 سنوات ماجستير", nl:"3 jaar Bachelor + 3 jaar Master"},
    profile:{ar:"VWO N&G أو N&T", nl:"VWO N&G of N&T"},
    requiredSubjects:{
      ar:["Wiskunde A أو B","Scheikunde (إجباري)","Biologie","Natuurkunde (مفضّل)"],
      nl:["Wiskunde A of B","Scheikunde (verplicht)","Biologie","Natuurkunde (aanbevolen)"]
    },
    selection:{
      ar:"بدون اختيار — قبول مفتوح إذا توفرت المتطلبات.",
      nl:"Geen selectie — open inschrijving bij voldoen aan eisen."
    },
    universities:{
      ar:["Universiteit Utrecht","Rijksuniversiteit Groningen","Universiteit Leiden (Bio-Pharmaceutical Sciences)"],
      nl:["Universiteit Utrecht","RU Groningen","Leiden (Bio-Pharmaceutical Sciences)"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["لا اختيار — لكن المعدل المنخفض يؤدي للرسوب في السنة الأولى","التدريب في صيدلية إلزامي (apotheekstage)","تخصص apotheker بعد الماجستير = سنتان إضافيتان"],
      nl:["Geen selectie — maar laag cijfer = vaak BSA in jaar 1","Apotheekstage verplicht","Specialisatie tot apotheker = 2 jaar extra"]
    }
  },
  {
    id:"psychologie", icon:"🧠", level:"WO",
    name:{ar:"علم النفس (Psychologie)", nl:"Psychologie"},
    duration:{ar:"3 سنوات بكالوريوس + 1 سنة ماجستير (research master = 2 سنة)", nl:"3 jaar Bachelor + 1 jaar Master (research master = 2 jaar)"},
    profile:{ar:"VWO جميع الشعب", nl:"VWO alle profielen"},
    requiredSubjects:{
      ar:["Wiskunde A أو B (إجباري في كل الجامعات تقريبًا)","الإنجليزية بمستوى VWO","لا توجد متطلبات علمية صارمة أخرى"],
      nl:["Wiskunde A of B (vrijwel overal verplicht)","Engels op VWO-niveau","Geen verdere bèta-eisen"]
    },
    selection:{
      ar:"معظم الجامعات: اختيار غير مركزي + numerus fixus. UvA / Leiden / Utrecht تطلب اختبارات تحضيرية.",
      nl:"Meeste universiteiten: decentrale selectie + numerus fixus. UvA / Leiden / Utrecht hanteren toelatingstoetsen."
    },
    universities:{
      ar:["UvA","VU","Leiden","Utrecht","Erasmus","Groningen","Nijmegen","Tilburg","Maastricht","Twente"],
      nl:["UvA","VU","Leiden","Utrecht","EUR","RUG","RU","Tilburg","UM","UT"]
    },
    deadline:{ar:"15 يناير (للدراسات ذات الاختيار) / 1 مايو (المفتوحة)", nl:"15 januari (selectie) / 1 mei (open)"},
    tips:{
      ar:["تخصصات شائعة: عيادي، تربوي، اجتماعي، وظيفي، عصبي","الـ Klinisch psycholoog يتطلب post-master + GZ-opleiding (سنتان)","الإحصاء والمنهج (Statistics & Methods) يشكلان 30% من البكالوريوس"],
      nl:["Specialisaties: klinisch, ontwikkelings, sociaal, A&O, neuro","Klinisch psycholoog vereist post-master + GZ-opleiding (2 jaar)","Statistiek/Methoden = 30% van de bachelor"]
    }
  },
  {
    id:"rechten", icon:"⚖️", level:"WO",
    name:{ar:"القانون (Rechten / Rechtsgeleerdheid)", nl:"Rechtsgeleerdheid"},
    duration:{ar:"3 سنوات بكالوريوس + 1 سنة ماجستير", nl:"3 jaar Bachelor + 1 jaar Master"},
    profile:{ar:"VWO جميع الشعب (مع شرط Wiskunde A للاقتصاد القانوني)", nl:"VWO alle profielen (Wiskunde A voor Notarieel/Fiscaal recht)"},
    requiredSubjects:{
      ar:["لا متطلبات صارمة — VWO فقط","Wiskunde A لـ Fiscaal/Notarieel","الهولندية ضرورية (NT2-II على الأقل)"],
      nl:["Geen specifieke eisen — VWO volstaat","Wiskunde A voor Fiscaal/Notarieel recht","Nederlands op hoog niveau (minimaal NT2-II)"]
    },
    selection:{
      ar:"بدون اختيار في معظم الجامعات.",
      nl:"Geen selectie bij de meeste universiteiten."
    },
    universities:{
      ar:["Leiden","UvA","VU","Utrecht","Erasmus","RUG","RU","Tilburg","Maastricht","Open Universiteit"],
      nl:["Leiden","UvA","VU","UU","EUR","RUG","RU","Tilburg","UM","OU"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["تخصصات: مدني، جنائي، إداري، أوروبي، دولي، ضريبي","المحاماة تتطلب beroepsopleiding في NOvA (3 سنوات)","القاضي = 6 سنوات تدريب إضافي بعد الماجستير"],
      nl:["Specialisaties: civiel, straf, bestuurs, Europees, internationaal, fiscaal","Advocatuur: beroepsopleiding NOvA (3 jaar)","Rechter: 6 jaar opleiding na master"]
    }
  },
  {
    id:"informatica", icon:"💻", level:"WO",
    name:{ar:"علوم الكمبيوتر (Informatica / Computer Science)", nl:"Informatica / Computer Science"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO N&T أو N&G مع Wiskunde B", nl:"VWO N&T of N&G met Wiskunde B"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Natuurkunde (مفضّل في TU Delft / TU/e)","الإنجليزية ≥ B2 (معظم البرامج بالإنجليزية)"],
      nl:["Wiskunde B (verplicht)","Natuurkunde (aanbevolen bij TU Delft / TU/e)","Engels ≥ B2 (meeste programma's in Engels)"]
    },
    selection:{
      ar:"بدون numerus fixus عادةً، لكن TU Delft و TU/e لديهما اختبارات matching يجب اجتيازها.",
      nl:"Geen numerus fixus meestal, maar TU Delft en TU/e hebben verplichte matching."
    },
    universities:{
      ar:["TU Delft","TU/e Eindhoven","University of Twente","UvA","VU","Leiden","Utrecht","RUG","RU","Maastricht (Data Science)"],
      nl:["TU Delft","TU/e","UT","UvA","VU","Leiden","UU","RUG","RU","UM"]
    },
    deadline:{ar:"1 مايو · TU Delft = 15 يناير لبعض البرامج", nl:"1 mei · TU Delft = 15 januari voor sommige programma's"},
    tips:{
      ar:["تعلّم Python / Java قبل البدء","Wiskunde B ضروري بقوة — الجبر الخطي والاحتمالات تشكّل الأساس","تخصصات: AI، Cybersecurity، Software Engineering، Game Tech"],
      nl:["Leer Python / Java vooraf","Wiskunde B essentieel — lineaire algebra en kansrekening centraal","Tracks: AI, Cybersecurity, Software Engineering, Game Tech"]
    }
  },
  {
    id:"engineering", icon:"⚙️", level:"WO",
    name:{ar:"الهندسة (Werktuigbouwkunde / Civiele Techniek / Lucht- & Ruimtevaart)", nl:"Werktuigbouwkunde / Civiele Techniek / Lucht- & Ruimtevaart"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO N&T (إجباري)", nl:"VWO N&T (verplicht)"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Natuurkunde (إجباري)","Scheikunde (مفضّل لبعض التخصصات)"],
      nl:["Wiskunde B (verplicht)","Natuurkunde (verplicht)","Scheikunde (aanbevolen)"]
    },
    selection:{
      ar:"اختبار matching إلزامي في معظم برامج الهندسة (لكن ليس selectie تنافسي).",
      nl:"Matchingtest verplicht in meeste programma's (geen selectie, wel verplicht)."
    },
    universities:{
      ar:["TU Delft (Werktuigbouw، Civiel، Lucht- & Ruimte، Bouwkunde)","TU/e Eindhoven (Werktuigbouw، Elektrotechniek)","University of Twente (Industrial Design، Mechanical Eng)"],
      nl:["TU Delft (Werktuigbouw, Civiel, Lucht- & Ruimte, Bouwkunde)","TU/e (Werktuigbouw, Elektrotechniek)","UT (Industrial Design, Mechanical)"]
    },
    deadline:{ar:"1 مايو · TU Delft Architecture = 15 يناير", nl:"1 mei · TU Delft Bouwkunde = 15 januari"},
    tips:{
      ar:["BSA صارم: ≥ 45 ECTS في السنة الأولى عادة","ابتعاثات Erasmus متاحة في السنة 3","تخصصات الماجستير: Aerospace، Robotics، Energy، Biomedical Eng"],
      nl:["Streng BSA: ≥ 45 ECTS in jaar 1","Erasmus-uitwisseling mogelijk in jaar 3","Mastertracks: Aerospace, Robotics, Energy, Biomedical Eng"]
    }
  },
  {
    id:"biomedische", icon:"🧬", level:"WO",
    name:{ar:"العلوم الحيوية الطبية (Biomedische Wetenschappen)", nl:"Biomedische Wetenschappen"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO N&G أو N&T", nl:"VWO N&G of N&T"},
    requiredSubjects:{
      ar:["Wiskunde A أو B","Scheikunde (إجباري)","Biologie (إجباري)","Natuurkunde (مفضّل في Radboud / UvA)"],
      nl:["Wiskunde A of B","Scheikunde (verplicht)","Biologie (verplicht)","Natuurkunde (aanbevolen bij RU / UvA)"]
    },
    selection:{
      ar:"معظم الجامعات بدون numerus fixus — قبول مفتوح. UvA وUU يطبّقان matching إلزامي.",
      nl:"Bij meeste universiteiten geen numerus fixus — open inschrijving. UvA en UU: matching verplicht."
    },
    universities:{
      ar:["UvA","VU","UU","Radboud Nijmegen","Leiden","Maastricht","Groningen"],
      nl:["UvA","VU","UU","RU Nijmegen","Leiden","UM","RUG"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["بديل ممتاز للطب — نفس المواد العلمية","التخصصات: Genetica, Neurowetenschappen, Immunologie, Oncologie","خريجوها يدخلون Zij-instroom Geneeskunde بعد الماجستير","مناسب للبحث الأكاديمي والصناعة الدوائية"],
      nl:["Sterk alternatief voor geneeskunde — vergelijkbare bètavakken","Tracks: Genetica, Neurowetenschap, Immunologie, Oncologie","Zij-instroom Geneeskunde mogelijk na master","Geschikt voor academisch onderzoek & farma-industrie"]
    }
  },
  {
    id:"econometrie", icon:"📈", level:"WO",
    name:{ar:"الاقتصاد القياسي (Econometrie & Operations Research)", nl:"Econometrie & Operations Research"},
    duration:{ar:"3 سنوات بكالوريوس + 1–2 سنة ماجستير", nl:"3 jaar Bachelor + 1–2 jaar Master"},
    profile:{ar:"VWO مع Wiskunde B (إجباري)", nl:"VWO met Wiskunde B (verplicht)"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Natuurkunde (مفضّل)","لا يتطلب Economie على مستوى VWO"],
      nl:["Wiskunde B (verplicht)","Natuurkunde (aanbevolen)","Economie VWO niet vereist"]
    },
    selection:{
      ar:"بدون اختيار لكن BSA صارم. Tilburg و EUR يعرضان مسارات مزدوجة (double degree).",
      nl:"Geen selectie maar streng BSA. Tilburg en EUR bieden double-degree tracks."
    },
    universities:{
      ar:["Erasmus Rotterdam (EUR)","Tilburg University","UvA","VU","RUG","Maastricht"],
      nl:["EUR Rotterdam","Tilburg","UvA","VU","RUG","UM"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["فرص توظيف ممتازة: بنوك، تأمين، استشارات، شركات تقنية","راتب البداية €45.000–€55.000 سنويًا","تخصصات: Quantitative Finance, Actuariële Wetenschappen, Econometrie","اتقن Python / R / MATLAB مبكرًا"],
      nl:["Top arbeidsmarkt: banken, verzekeraars, consultancy, tech","Startsalaris €45.000–€55.000 per jaar","Tracks: Quantitative Finance, Actuariaat, Econometrie","Leer Python / R / MATLAB vooraf"]
    }
  },
  {
    id:"wiskunde", icon:"🔢", level:"WO",
    name:{ar:"الرياضيات (Wiskunde / Mathematics)", nl:"Wiskunde / Mathematics"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO مع Wiskunde B أو D", nl:"VWO met Wiskunde B of D"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Wiskunde D (مفضّل بقوة)","Natuurkunde (مفضّل للفيزياء الرياضية)"],
      nl:["Wiskunde B (verplicht)","Wiskunde D (sterk aanbevolen)","Natuurkunde (aanbevolen voor mathematische fysica)"]
    },
    selection:{
      ar:"بدون numerus fixus. المعدل المرتفع في Wiskunde مهم للنجاح.",
      nl:"Geen numerus fixus. Hoog cijfer Wiskunde belangrijk voor studiesucces."
    },
    universities:{
      ar:["Leiden","UvA","VU","UU","RUG","RU","TU Delft (Applied Math)","TU/e","Maastricht"],
      nl:["Leiden","UvA","VU","UU","RUG","RU","TU Delft (Applied Math)","TU/e","UM"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["التخصصات: Pure Math, Applied Math, Statistics, Financial Math, Data Science","خريجوها يعملون في AI, Finance, Research, Teaching","اقرأ كتاب 'How to Prove It' قبل البدء","جامعة Leiden قوية في الجبر، Utrecht في الهندسة الرياضية"],
      nl:["Tracks: Zuivere, Toegepaste, Statistiek, Financiële, Data Science","Werkveld: AI, finance, onderzoek, onderwijs","Lees 'How to Prove It' vóór aanvang","Leiden sterk in algebra, Utrecht in meetkunde"]
    }
  },
  {
    id:"natuurkunde", icon:"⚛️", level:"WO",
    name:{ar:"الفيزياء (Natuurkunde / Physics)", nl:"Natuurkunde / Physics"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO N&T (إجباري)", nl:"VWO N&T (verplicht)"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Natuurkunde (إجباري)","Scheikunde (مفضّل)","Wiskunde D (مفضّل للفيزياء النظرية)"],
      nl:["Wiskunde B (verplicht)","Natuurkunde (verplicht)","Scheikunde (aanbevolen)","Wiskunde D (aanbevolen voor theoretische fysica)"]
    },
    selection:{
      ar:"بدون numerus fixus. TU Delft و TU/e يطلبان matching.",
      nl:"Geen numerus fixus. TU Delft en TU/e: matching verplicht."
    },
    universities:{
      ar:["Leiden","UvA/VU (مشترك)","UU","RU","RUG","TU Delft","TU/e","UTwente"],
      nl:["Leiden","UvA/VU (joint)","UU","RU","RUG","TU Delft","TU/e","UT"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["التخصصات: Quantum, Astrophysics, Nanoscience, Medical Physics","خريجوها في CERN, ESA, ASML, TNO","اقرأ Feynman Lectures قبل البدء","Leiden أكبر عدد من علماء نوبل في الفيزياء"],
      nl:["Tracks: Quantum, Astrofysica, Nanoscience, Medische fysica","Werkveld: CERN, ESA, ASML, TNO","Lees Feynman Lectures vooraf","Leiden: meeste Nobelprijzen fysica"]
    }
  },
  {
    id:"scheikunde", icon:"⚗️", level:"WO",
    name:{ar:"الكيمياء (Scheikunde / Chemistry)", nl:"Scheikunde / Chemistry"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO N&T أو N&G", nl:"VWO N&T of N&G"},
    requiredSubjects:{
      ar:["Wiskunde B (مفضّل، بعض الجامعات تقبل A)","Scheikunde (إجباري)","Natuurkunde (إجباري في معظم الجامعات)","Biologie (مفضّل للكيمياء الحيوية)"],
      nl:["Wiskunde B (aanbevolen, sommige accepteren A)","Scheikunde (verplicht)","Natuurkunde (meestal verplicht)","Biologie (aanbevolen voor biochemie)"]
    },
    selection:{
      ar:"بدون numerus fixus. قبول مفتوح.",
      nl:"Geen numerus fixus. Open toelating."
    },
    universities:{
      ar:["UvA/VU (مشترك)","Leiden","UU","RUG","RU","TU/e","UTwente"],
      nl:["UvA/VU (joint)","Leiden","UU","RUG","RU","TU/e","UT"]
    },
    deadline:{ar:"1 مايو عبر Studielink", nl:"1 mei via Studielink"},
    tips:{
      ar:["التخصصات: Organische, Anorganische, Biochemie, Nanochemie, Green Chemistry","خريجوها في DSM, Shell, Unilever, Philips, مراكز البحث","مختبرات يومية من السنة الأولى — احبّ الأيدي الملطخة!","فرص بحثية ممتازة في هولندا"],
      nl:["Tracks: Organisch, Anorganisch, Biochemie, Nanochemie, Green Chemistry","Werkveld: DSM, Shell, Unilever, Philips, onderzoekscentra","Dagelijks lab vanaf jaar 1 — hands-on work!","Uitstekende onderzoekskansen in NL"]
    }
  },
  {
    id:"ai", icon:"🤖", level:"WO",
    name:{ar:"الذكاء الاصطناعي (Kunstmatige Intelligentie / AI)", nl:"Kunstmatige Intelligentie (AI)"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير", nl:"3 jaar Bachelor + 2 jaar Master"},
    profile:{ar:"VWO مع Wiskunde B (إجباري)", nl:"VWO met Wiskunde B (verplicht)"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","الإنجليزية ≥ B2 (كل البرامج بالإنجليزية)","Natuurkunde (مفضّل)","خبرة برمجية (ليست إلزامية لكنها مفيدة)"],
      nl:["Wiskunde B (verplicht)","Engels ≥ B2 (alle programma's Engelstalig)","Natuurkunde (aanbevolen)","Programmeerervaring (niet verplicht, wel nuttig)"]
    },
    selection:{
      ar:"numerus fixus في UU و UvA و RU. اختبار matching إلزامي.",
      nl:"Numerus fixus bij UU, UvA, RU. Matching verplicht."
    },
    universities:{
      ar:["UvA (AI Bachelor — numerus fixus 210)","VU","Utrecht","RU Nijmegen","RUG","Maastricht","Tilburg (Cognitive Science)","TU/e (Data Science + AI)"],
      nl:["UvA (AI Bachelor — NF 210)","VU","UU","RU Nijmegen","RUG","UM","Tilburg (Cognitive Science)","TU/e (Data Science + AI)"]
    },
    deadline:{ar:"15 يناير (numerus fixus) أو 1 مايو", nl:"15 januari (NF) of 1 mei"},
    tips:{
      ar:["تعلم Python + Linear Algebra قبل البدء","المواد الأساسية: Machine Learning, Neural Networks, NLP, Computer Vision, Robotics","فرص عمل ضخمة — راتب بداية €60.000+","التركيز البحثي: UvA = Deep Learning، RU = Cognitive AI"],
      nl:["Leer Python + Lineaire Algebra vooraf","Kernvakken: Machine Learning, Neural Networks, NLP, Computer Vision, Robotica","Top arbeidsmarkt — startsalaris €60.000+","Focus: UvA = Deep Learning, RU = Cognitive AI"]
    }
  },
  {
    id:"bouwkunde", icon:"🏗️", level:"WO",
    name:{ar:"الهندسة المعمارية (Bouwkunde / Architecture)", nl:"Bouwkunde / Architecture"},
    duration:{ar:"3 سنوات بكالوريوس + 2 سنة ماجستير + تدريب إلزامي", nl:"3 jaar Bachelor + 2 jaar Master + verplichte stage"},
    profile:{ar:"VWO N&T أو N&G مع Wiskunde B", nl:"VWO N&T of N&G met Wiskunde B"},
    requiredSubjects:{
      ar:["Wiskunde B (إجباري)","Natuurkunde (إجباري في TU Delft)","ملف رسم/تصميم (portfolio)","إبداع مكاني (spatial thinking)"],
      nl:["Wiskunde B (verplicht)","Natuurkunde (verplicht bij TU Delft)","Tekenportfolio","Ruimtelijk inzicht"]
    },
    selection:{
      ar:"numerus fixus في TU Delft (300 مقعد). الاختيار: CV + portfolio + اختبار مكاني.",
      nl:"Numerus fixus TU Delft (300 plekken). Selectie: CV + portfolio + ruimtelijk-inzicht test."
    },
    universities:{
      ar:["TU Delft (الأقوى في أوروبا)","TU/e Eindhoven","Academie van Bouwkunst (Amsterdam/Rotterdam — بالتوازي مع العمل)"],
      nl:["TU Delft (top in Europa)","TU/e Eindhoven","Academies van Bouwkunst (Amsterdam/Rotterdam — parallel aan werk)"]
    },
    deadline:{ar:"15 يناير عبر Studielink (TU Delft numerus fixus)", nl:"15 januari via Studielink (TU Delft NF)"},
    tips:{
      ar:["جهّز portfolio بـ 10–15 رسمة/تصميم","استخدم AutoCAD + Rhino + Adobe Suite","التدريب (stage) إلزامي — سنة كاملة","حصول لقب 'architect' يتطلب 2 سنة عمل + اختبار NAV"],
      nl:["Bereid portfolio voor met 10–15 tekeningen/ontwerpen","Leer AutoCAD + Rhino + Adobe Suite","Stage verplicht — meestal 1 jaar","Titel 'architect' vereist 2 jaar werkervaring + NAV-examen"]
    }
  },
  {
    id:"bedrijfskunde", icon:"💼", level:"WO",
    name:{ar:"إدارة الأعمال (Bedrijfskunde / Business Administration)", nl:"Bedrijfskunde / Business Administration"},
    duration:{ar:"3 سنوات بكالوريوس + 1 سنة ماجستير", nl:"3 jaar Bachelor + 1 jaar Master"},
    profile:{ar:"VWO جميع الشعب (مع Wiskunde A كحد أدنى)", nl:"VWO alle profielen (minimaal Wiskunde A)"},
    requiredSubjects:{
      ar:["Wiskunde A أو B (إجباري)","Economie (مفضّل، ليس إجباري في كل الجامعات)","الإنجليزية ≥ B2","إدارة & تنظيم M&O (مفضّل)"],
      nl:["Wiskunde A of B (verplicht)","Economie (aanbevolen, niet overal verplicht)","Engels ≥ B2","M&O / Bedrijfseconomie (aanbevolen)"]
    },
    selection:{
      ar:"بعض الجامعات لديها numerus fixus (مثل RSM Erasmus). الاختيار: GPA + مقابلة + motivatie.",
      nl:"Sommige unis hebben NF (bv. RSM Erasmus). Selectie: GPA + intake + motivatie."
    },
    universities:{
      ar:["RSM Erasmus (الأعلى تصنيفًا)","Tilburg","VU","RUG","Maastricht","Nyenrode","Utrecht School of Economics"],
      nl:["RSM Erasmus (hoogst gerankt)","Tilburg","VU","RUG","UM","Nyenrode","Utrecht SE"]
    },
    deadline:{ar:"15 يناير (NF) أو 1 مايو عبر Studielink", nl:"15 januari (NF) of 1 mei via Studielink"},
    tips:{
      ar:["التخصصات: Marketing, Finance, HRM, Strategy, Supply Chain, Entrepreneurship","International Business (IB) بالإنجليزية فقط","RSM من أفضل 10 كليات أوروبية — تنافسية شديدة","MBA بعد التخرج ممكن في INSEAD/Wharton"],
      nl:["Tracks: Marketing, Finance, HRM, Strategy, Supply Chain, Entrepreneurship","International Business (IB) alleen Engelstalig","RSM top 10 Europa — zeer competitief","MBA na werkervaring (INSEAD/Wharton)"]
    }
  },
];

/* ═══════════════════════════════════════════════════════════
   STUDY GUIDANCE — Recommended materials & preparation timeline
═══════════════════════════════════════════════════════════ */
const STUDY_GUIDANCE = [
  {
    id:"guide-wiskunde", icon:"➗", color:"blue",
    subject:{ar:"الرياضيات (Wiskunde A/B)", nl:"Wiskunde A/B"},
    level:{ar:"VWO 5/6 مستوى", nl:"VWO-5/6 niveau"},
    duration:{ar:"4–9 أشهر للتحضير الكامل", nl:"4–9 maanden totale voorbereiding"},
    textbooks:{
      ar:["📘 Getal & Ruimte VWO 5/6 (الكتاب الرسمي الهولندي للثانوية)","📘 Moderne Wiskunde (بديل)","📘 Noordhoff Getal & Ruimte Oefenboek (كتاب تمارين)","📗 Wiskunde Makkelijk Gemaakt — سلسلة مبسّطة للمبتدئين"],
      nl:["📘 Getal & Ruimte VWO 5/6 (standaard schoolboek)","📘 Moderne Wiskunde (alternatief)","📘 Noordhoff Oefenboek (oefenopgaven)","📗 Wiskunde Makkelijk Gemaakt"]
    },
    websites:{
      ar:["🌐 wiskundeacademie.nl (فيديوهات شرح بالهولندية — مجاني)","🌐 wiskunde.net (نصائح وامتحانات سابقة)","🌐 khanacademy.org/math (بالإنجليزية — ممتاز للجبر والتفاضل)","🌐 examenoverzicht.nl (امتحانات VWO سابقة مع الحلول)","🌐 ccvx.nl/oude-tentamens (امتحانات CCVX السابقة)"],
      nl:["🌐 wiskundeacademie.nl (gratis uitlegvideo's)","🌐 wiskunde.net (tips + oude examens)","🌐 khanacademy.org/math (Engels — algebra, calculus)","🌐 examenoverzicht.nl (oude VWO-examens + antwoorden)","🌐 ccvx.nl/oude-tentamens"]
    },
    topics:{
      ar:["الجبر والمعادلات (Algebra & vergelijkingen)","الدوال والرسوم البيانية (Functies & grafieken)","التفاضل والتكامل (Differentiëren & integreren) — مهم جدًا للطب والهندسة","الإحصاء والاحتمالات (Statistiek & kansrekening) — ضروري لـ Wiskunde A","المثلثات والمتجهات (Goniometrie & vectoren)","المتتاليات والمتسلسلات (Rijen & reeksen)"],
      nl:["Algebra & vergelijkingen","Functies & grafieken","Differentiëren & integreren (essentieel voor geneeskunde/techniek)","Statistiek & kansrekening (kernonderdeel Wiskunde A)","Goniometrie & vectoren","Rijen & reeksen"]
    },
    weeklyHours:{ar:"8–12 ساعة أسبوعيًا", nl:"8–12 uur per week"},
    tips:{
      ar:["ابدأ بأساسيات Wiskunde 3 VWO إذا نسيت القواعد","حل امتحان CCVX قديم كل أسبوع من الشهر 3","لا تحفظ — افهم الأنماط","استخدم GeoGebra لتصور الدوال"],
      nl:["Start met VWO-3 basis als grondregels zijn weggezakt","Los elke week oude CCVX-tentamen vanaf maand 3","Niet uit het hoofd leren — begrijp patronen","Gebruik GeoGebra voor functievisualisatie"]
    }
  },
  {
    id:"guide-scheikunde", icon:"⚗️", color:"purple",
    subject:{ar:"الكيمياء (Scheikunde)", nl:"Scheikunde"},
    level:{ar:"VWO 5/6 — إجباري للطب والصيدلة والبيطرة", nl:"VWO-5/6 — verplicht voor geneeskunde, farmacie, diergeneeskunde"},
    duration:{ar:"5–8 أشهر للتحضير الكامل", nl:"5–8 maanden totale voorbereiding"},
    textbooks:{
      ar:["📘 Chemie Overal VWO 5/6","📘 Pulsar Chemie (بديل شامل)","📘 Nova Scheikunde","📗 BINAS — كتاب الجداول العلمية (إلزامي في كل امتحان)","📗 Chemie in Context (للتعمق)"],
      nl:["📘 Chemie Overal VWO 5/6","📘 Pulsar Chemie","📘 Nova Scheikunde","📗 BINAS — tabellenboek (verplicht bij elk tentamen)","📗 Chemie in Context"]
    },
    websites:{
      ar:["🌐 scheikundeinbeeld.nl (فيديوهات مجانية)","🌐 scheikunde.net","🌐 chemistryguru.com (بالإنجليزية)","🌐 ccvx.nl — امتحانات Scheikunde سابقة","🌐 youtube.com/@scheikundelessen — قناة هولندية ممتازة"],
      nl:["🌐 scheikundeinbeeld.nl","🌐 scheikunde.net","🌐 chemistryguru.com (Engels)","🌐 ccvx.nl — oude Scheikunde-examens","🌐 youtube.com/@scheikundelessen"]
    },
    topics:{
      ar:["البنية الذرية والجدول الدوري (Atoomstructuur & periodiek systeem)","الروابط الكيميائية (Chemische binding)","التفاعلات وتوازنها (Reacties & evenwichten)","الكيمياء العضوية (Organische chemie) — كربوهيدرات، بروتينات، دهون","الأحماض والقواعد والـ pH (Zuur-base & pH)","الكيمياء التحليلية (Analytische chemie)","الكيمياء الخضراء (Groene chemie)"],
      nl:["Atoomstructuur & periodiek systeem","Chemische binding","Reacties & evenwichten","Organische chemie — suikers, eiwitten, vetten","Zuur-base & pH","Analytische chemie","Groene chemie"]
    },
    weeklyHours:{ar:"6–10 ساعات أسبوعيًا", nl:"6–10 uur per week"},
    tips:{
      ar:["احفظ BINAS — ستستخدمه في كل امتحان","الكيمياء العضوية هي 40% من امتحان CCVX","مارس كتابة معادلات التفاعل يوميًا","اربط كل مفهوم بمثال طبي/حياتي"],
      nl:["Ken BINAS goed — je gebruikt hem bij elk tentamen","Organische chemie = 40% van CCVX-examen","Oefen dagelijks reactievergelijkingen","Koppel theorie aan medische/praktische voorbeelden"]
    }
  },
  {
    id:"guide-biologie", icon:"🧬", color:"green",
    subject:{ar:"علم الأحياء (Biologie)", nl:"Biologie"},
    level:{ar:"VWO 5/6 — مفضّل بقوة للطب والبيطرة", nl:"VWO-5/6 — sterk aanbevolen voor geneeskunde/diergeneeskunde"},
    duration:{ar:"4–7 أشهر", nl:"4–7 maanden"},
    textbooks:{
      ar:["📘 Biologie voor Jou VWO 5/6 (الأشهر)","📘 Nectar Biologie","📘 Biologie-Sesam","📗 Campbell Biology (الإنجليزي — المرجع الجامعي)","📗 BINAS (للأحياء أيضًا)"],
      nl:["📘 Biologie voor Jou VWO 5/6","📘 Nectar Biologie","📘 Biologie-Sesam","📗 Campbell Biology (Engels — universitaire referentie)","📗 BINAS"]
    },
    websites:{
      ar:["🌐 biologiepagina.nl (شرح شامل بالهولندية)","🌐 bioplek.org (أشهر مصدر هولندي)","🌐 biodoen.nl","🌐 khanacademy.org/science/biology","🌐 ccvx.nl — امتحانات Biologie سابقة"],
      nl:["🌐 biologiepagina.nl","🌐 bioplek.org (bekende Nederlandse bron)","🌐 biodoen.nl","🌐 khanacademy.org/science/biology","🌐 ccvx.nl — oude Biologie-examens"]
    },
    topics:{
      ar:["الخلية والـ DNA (Cel & DNA)","الوراثة والتطور (Erfelijkheid & evolutie)","علم وظائف الأعضاء البشرية (Humane fysiologie) — الجهاز العصبي، القلب، الغدد","علم البيئة (Ecologie)","علم النباتات (Plantenbiologie)","المناعة والأمراض (Immuniteit & ziekten)","التكاثر والتطور الجنيني (Voortplanting & embryologie)"],
      nl:["Cel & DNA","Erfelijkheid & evolutie","Humane fysiologie — zenuwstelsel, hart, hormonen","Ecologie","Plantenbiologie","Immuniteit & ziekten","Voortplanting & embryologie"]
    },
    weeklyHours:{ar:"5–8 ساعات أسبوعيًا", nl:"5–8 uur per week"},
    tips:{
      ar:["ارسم كل عملية بيولوجية (دورة كلفن، دورة كريبس...)","Bioplek.org له فيديوهات شاملة مجانية","امتحان CCVX يركز على الفسيولوجيا البشرية","اقرأ National Geographic لتوسيع ثقافتك"],
      nl:["Teken elk biologisch proces (Calvin-cyclus, Krebs...)","Bioplek.org heeft gratis uitlegvideo's","CCVX focust op humane fysiologie","Lees National Geographic voor brede kennis"]
    }
  },
  {
    id:"guide-natuurkunde", icon:"⚡", color:"orange",
    subject:{ar:"الفيزياء (Natuurkunde)", nl:"Natuurkunde"},
    level:{ar:"VWO 5/6 — إجباري للهندسة وبعض كليات الطب", nl:"VWO-5/6 — verplicht voor techniek & soms geneeskunde"},
    duration:{ar:"5–8 أشهر", nl:"5–8 maanden"},
    textbooks:{
      ar:["📘 Overal Natuurkunde VWO 5/6","📘 Pulsar Natuurkunde","📘 Systematische Natuurkunde","📗 BINAS (جداول القوانين)","📗 Giancoli Physics (الإنجليزي — مرجع جامعي)"],
      nl:["📘 Overal Natuurkunde VWO 5/6","📘 Pulsar Natuurkunde","📘 Systematische Natuurkunde","📗 BINAS (formulebladen)","📗 Giancoli Physics (Engels)"]
    },
    websites:{
      ar:["🌐 natuurkunde.nl (شرح شامل)","🌐 natuurkundeuitgelegd.nl","🌐 roelhendriks.eu (ممتاز جدًا للـ VWO)","🌐 physicsclassroom.com (بالإنجليزية)","🌐 ccvx.nl — امتحانات Natuurkunde"],
      nl:["🌐 natuurkunde.nl","🌐 natuurkundeuitgelegd.nl","🌐 roelhendriks.eu","🌐 physicsclassroom.com (Engels)","🌐 ccvx.nl — oude Natuurkunde-examens"]
    },
    topics:{
      ar:["الحركة والقوى (Kinematica & dynamica)","الطاقة والشغل (Energie & arbeid)","الكهرباء والمغناطيسية (Elektriciteit & magnetisme)","الموجات والصوت والضوء (Golven, geluid, licht)","الفيزياء الحديثة (Quantumfysica & relativiteit)","الفيزياء الطبية (Medische fysica) — الأشعة السينية، MRI","النووية (Kernfysica)"],
      nl:["Kinematica & dynamica","Energie & arbeid","Elektriciteit & magnetisme","Golven, geluid, licht","Quantumfysica & relativiteit","Medische fysica — röntgen, MRI","Kernfysica"]
    },
    weeklyHours:{ar:"7–10 ساعات أسبوعيًا", nl:"7–10 uur per week"},
    tips:{
      ar:["ارسم مخططات القوى دائمًا قبل الحل (FBD)","احفظ BINAS جيدًا — كل القوانين فيه","Roel Hendriks قناة ذهبية","مارس تحليل الوحدات (dimensional analysis)"],
      nl:["Teken altijd krachtschema's (FBD) vóór oplossen","Ken BINAS — alle formules staan daar","Roel Hendriks YouTube = gouden kanaal","Oefen dimensieanalyse"]
    }
  },
  {
    id:"guide-nederlands", icon:"🇳🇱", color:"teal",
    subject:{ar:"الهولندية (Nederlands / NT2)", nl:"Nederlands / NT2"},
    level:{ar:"B2 (NT2-II) — إجباري للدراسة في WO/HBO الهولندية", nl:"B2 (NT2-II) — verplicht voor WO/HBO"},
    duration:{ar:"6–18 شهرًا (حسب مستواك الابتدائي)", nl:"6–18 maanden (afhankelijk van beginniveau)"},
    textbooks:{
      ar:["📘 Nederlands in Gang (A1–A2)","📘 Nederlands in Actie (B1)","📘 Nederlands op Niveau (B2)","📘 Vooruit! — كتاب CITO للـ NT2","📗 Taalriedel / Het Grote Oefenboek NT2","📗 Van Dale woordenboek Nederlands-Arabisch"],
      nl:["📘 Nederlands in Gang (A1–A2)","📘 Nederlands in Actie (B1)","📘 Nederlands op Niveau (B2)","📘 Vooruit! — CITO NT2","📗 Het Grote Oefenboek NT2","📗 Van Dale woordenboek"]
    },
    websites:{
      ar:["🌐 nt2school.nl (دورات مجانية)","🌐 oefenen.nl (تدريبات تفاعلية مجانية)","🌐 taalthuis.com","🌐 duo.nl/nt2 (امتحانات تجريبية رسمية)","🌐 nos.nl/jeugdjournaal (للاستماع بسرعة بطيئة)","🌐 duolingo.com/nl (للمبتدئين)"],
      nl:["🌐 nt2school.nl","🌐 oefenen.nl","🌐 taalthuis.com","🌐 duo.nl/nt2 (oefenexamens)","🌐 nos.nl/jeugdjournaal","🌐 duolingo.com/nl"]
    },
    topics:{
      ar:["القراءة (Lezen) — مقالات نيوز، قصص قصيرة، نصوص أكاديمية","الاستماع (Luisteren) — NOS Journaal, podcasts، محاضرات","الكتابة (Schrijven) — مقالات 200–400 كلمة، رسائل رسمية","المحادثة (Spreken) — موضوعات أكاديمية، عروض تقديمية","القواعد (Grammatica) — زمن الفعل، ترتيب الجملة الفرعية، modale werkwoorden","المفردات الأكاديمية (Academisch taalgebruik)"],
      nl:["Lezen — nieuwsartikelen, korte verhalen, academische teksten","Luisteren — NOS Journaal, podcasts, colleges","Schrijven — essays 200–400 woorden, formele brieven","Spreken — academische onderwerpen, presentaties","Grammatica — werkwoordstijden, bijzinvolgorde, modale werkwoorden","Academisch taalgebruik"]
    },
    weeklyHours:{ar:"10–15 ساعة (دراسة + ممارسة يومية)", nl:"10–15 uur (studie + dagelijkse praktijk)"},
    tips:{
      ar:["تحدث الهولندية يوميًا — حتى 15 دقيقة","شاهد NOS Jeugdjournaal (أبطأ من العادي)","انضم لـ Taalmaatje (شريك لغة) في مكتبتك المحلية","اقرأ كتب Jip & Janneke للمبتدئين، ثم Harry Mulisch للمتقدمين","ISK مجاني للأقل من 18 — استخدمه!"],
      nl:["Spreek dagelijks Nederlands — al is het 15 min","Kijk NOS Jeugdjournaal (langzamer dan gewoon)","Zoek een Taalmaatje in je bibliotheek","Lees Jip & Janneke (beginner), dan Harry Mulisch (gevorderd)","ISK gratis onder 18 — benut dit!"]
    }
  },
  {
    id:"guide-engels", icon:"🇬🇧", color:"navy",
    subject:{ar:"الإنجليزية (Engels — IELTS/TOEFL)", nl:"Engels (IELTS/TOEFL)"},
    level:{ar:"B2–C1 (IELTS 6.5–7.0 / TOEFL 90–100)", nl:"B2–C1 (IELTS 6.5–7.0 / TOEFL 90–100)"},
    duration:{ar:"3–6 أشهر تحضير مكثف", nl:"3–6 maanden intensieve voorbereiding"},
    textbooks:{
      ar:["📘 Cambridge IELTS 17–19 (كتب الامتحانات الرسمية)","📘 The Official Guide to the TOEFL iBT Test","📘 Barron's IELTS Superpack","📗 English Grammar in Use (Raymond Murphy) — الكتاب الذهبي","📗 1100 Words You Need to Know"],
      nl:["📘 Cambridge IELTS 17–19 (officiële examenboeken)","📘 Official Guide to the TOEFL iBT Test","📘 Barron's IELTS Superpack","📗 English Grammar in Use (Raymond Murphy)","📗 1100 Words You Need to Know"]
    },
    websites:{
      ar:["🌐 ielts.org (امتحانات تجريبية مجانية)","🌐 ets.org/toefl (TOEFL الرسمي)","🌐 magoosh.com (دورات عالية الجودة)","🌐 bbc.co.uk/learningenglish (مجاني وممتاز)","🌐 engvid.com (فيديوهات مجانية)","🌐 youtube.com/@EnglishAddictWithMrDuncan"],
      nl:["🌐 ielts.org (gratis oefenexamens)","🌐 ets.org/toefl","🌐 magoosh.com","🌐 bbc.co.uk/learningenglish","🌐 engvid.com","🌐 youtube.com/@EnglishAddictWithMrDuncan"]
    },
    topics:{
      ar:["Reading — نصوص أكاديمية 700–900 كلمة","Listening — محاضرات + محادثات (4 أقسام في IELTS)","Writing — Task 1 (رسم بياني/رسالة) + Task 2 (مقالة 250 كلمة)","Speaking — مقابلة 11–14 دقيقة (IELTS) أو تسجيل (TOEFL)","Grammar — الأزمنة، الشرط، المبني للمجهول، الجمل الوصفية","Academic vocabulary — استخدم Academic Word List (AWL)"],
      nl:["Reading — academische teksten 700–900 woorden","Listening — colleges + gesprekken","Writing — Task 1 (grafiek/brief) + Task 2 (essay 250 woorden)","Speaking — interview 11–14 min (IELTS) of opnames (TOEFL)","Grammar — tijden, conditionals, passief, bijvoeglijke bijzinnen","Academic Word List (AWL)"]
    },
    weeklyHours:{ar:"8–12 ساعة أسبوعيًا", nl:"8–12 uur per week"},
    tips:{
      ar:["النتيجة صالحة سنتين فقط — خطّط وقت الامتحان بدقة","اكتب مقالة Task 2 يوميًا في آخر شهر","شاهد TED Talks مع ترجمة إنجليزية","تمرن على Speaking مع native speaker (italki.com)","Writing هو الأصعب — ركّز عليه"],
      nl:["Score 2 jaar geldig — plan examendatum zorgvuldig","Schrijf laatste maand dagelijks Task 2-essay","Kijk TED Talks met Engelse ondertitels","Oefen Speaking met native speaker (italki.com)","Writing is het lastigst — focus daar op"]
    }
  },
];

/* ═══════════════════════════════════════════════════════════
   MEDICINE ROADMAP — 9-maanden voorbereidingsplan voor Geneeskunde
═══════════════════════════════════════════════════════════ */
const MEDICINE_ROADMAP = {
  ar:[
    { month:"الشهر 1–2 (سبتمبر–أكتوبر)", title:"تأسيس وتقييم المستوى",
      tasks:["قم بتقييم ذاتي: ما المواد الناقصة (Scheikunde / Biologie / Wiskunde / Natuurkunde)؟","سجل في دورة CCVX أو Boswell-Bèta إذا احتجت (ابدأ مبكرًا!)","اشتر الكتب: Chemie Overal, Biologie voor Jou, Getal & Ruimte","افتح حسابًا في wiskundeacademie.nl + bioplek.org","احسب معدل VWO المتوقع — هل يحتاج تحسين؟"] },
    { month:"الشهر 3–4 (نوفمبر–ديسمبر)", title:"تعميق المواد العلمية",
      tasks:["ادرس 10–12 ساعة أسبوعيًا للمواد الناقصة","ابدأ بحلّ امتحانات CCVX السابقة (3 سنوات أخيرة)","ابدأ بإعداد CV + رسالة دافع (motivatiebrief)","تطوع في مستشفى أو دار رعاية — 4 ساعات أسبوعيًا","اقرأ 3 مقالات طبية أسبوعيًا (NRC، de Volkskrant، Nature)"] },
    { month:"الشهر 5 (يناير) — ⚠️ حاسم", title:"التسجيل الرسمي + اختبارات العينة",
      tasks:["📅 التسجيل في Studielink قبل 15 يناير (لا تمديد!)","قدّم ملف الاختيار قبل 1 فبراير (CV + motivatiebrief + شهادات)","مارس Situational Judgement Tests (SJT) على studielink.nl","حل امتحان CCVX تجريبي كامل كل أسبوع","ابدأ تمارين المقابلات الشخصية (مع صديق/معلم)"] },
    { month:"الشهر 6–7 (فبراير–مارس)", title:"اختبارات الاختيار (Decentrale Selectie)",
      tasks:["حضر اختبارات الـ kennistoets في مارس (كل جامعة موعد مختلف)","حضر مقابلات الاختيار (Interview Day)","إذا كنت تقدم لـ CCVX: الامتحان في يونيو/يوليو","راجع الملاحظات من كل اختبار وتعلم من الأخطاء","احتفظ بهدوئك — التوتر الزائد يقلل الأداء"] },
    { month:"الشهر 8 (أبريل)", title:"النتائج وقرار القبول",
      tasks:["📩 15 أبريل: نتائج Decentrale Selectie (قبول أو قائمة انتظار)","إذا رُفضت: راجع خياراتك — Biomedische Wetenschappen أو طب في بلجيكا","إذا قُبلت: ابدأ إجراءات السكن في مدينة الجامعة","سجّل في DUO للتمويل الطلابي (studiefinanciering)"] },
    { month:"الشهر 9 (مايو–يوليو)", title:"إعداد نهائي + دبلوم VWO",
      tasks:["امتحانات VWO النهائية (مايو)","استلام دبلوم VWO (يوليو)","إكمال متطلبات NT2-II إذا أجنبي (قبل 31 أغسطس)","احضر introduction week (مثل ASW أو AID) في أغسطس","ابدأ دراستك في سبتمبر! 🎉"] },
  ],
  nl:[
    { month:"Maand 1–2 (sep–okt)", title:"Fundament leggen + niveaubepaling",
      tasks:["Zelfbeoordeling: welke vakken ontbreken (Scheikunde / Biologie / Wiskunde / Natuurkunde)?","Meld je aan voor CCVX- of Boswell-Bèta-cursus (begin vroeg!)","Koop boeken: Chemie Overal, Biologie voor Jou, Getal & Ruimte","Maak account op wiskundeacademie.nl + bioplek.org","Bereken verwacht VWO-gemiddelde — moet dit omhoog?"] },
    { month:"Maand 3–4 (nov–dec)", title:"Verdieping bètavakken",
      tasks:["Studeer 10–12 uur per week voor missende vakken","Los oude CCVX-examens op (laatste 3 jaar)","Begin met CV + motivatiebrief","Vrijwilligerswerk ziekenhuis of zorginstelling — 4 uur/week","Lees wekelijks 3 medische artikelen (NRC, Volkskrant, Nature)"] },
    { month:"Maand 5 (januari) — ⚠️ kritiek", title:"Officiële aanmelding + oefentests",
      tasks:["📅 Aanmelden in Studielink vóór 15 januari (géén uitstel!)","Selectiedossier indienen vóór 1 februari (CV + motivatie + diploma)","Oefen SJT (Situational Judgement Tests) op studielink.nl","Wekelijks volledig CCVX-proefexamen maken","Begin met interview-training (met vriend/docent)"] },
    { month:"Maand 6–7 (feb–mrt)", title:"Selectie-examens (Decentrale Selectie)",
      tasks:["Kennistoetsen in maart (elke universiteit eigen datum)","Interviews bijwonen (Interview Day)","CCVX-examen: juni/juli","Reflecteer na elke test — leer van fouten","Blijf kalm — stress vermindert prestaties"] },
    { month:"Maand 8 (april)", title:"Uitslag + toelatingsbesluit",
      tasks:["📩 15 april: uitslag Decentrale Selectie (toegelaten of wachtlijst)","Bij afwijzing: overweeg Biomedische Wetenschappen of geneeskunde in België","Bij toelating: regel huisvesting in studentenstad","Meld je aan bij DUO voor studiefinanciering"] },
    { month:"Maand 9 (mei–jul)", title:"Eindexamens + VWO-diploma",
      tasks:["VWO-eindexamens (mei)","VWO-diploma ontvangen (juli)","NT2-II afronden indien buitenlander (vóór 31 augustus)","Introductieweek bijwonen (ASW / AID) in augustus","Start studie in september! 🎉"] },
  ]
};

/* ═══════════════════════════════════════════════════════════
   PAGES DEFINITION (tabs)
═══════════════════════════════════════════════════════════ */
// 8 primary tabs in top nav. Level detail pages (vmbo/havovwo/mbo/hbo/wo/vavo) are routed but accessed
// via cards on "levels" page, nodes on "pathway", or modal "full page" button.
const PAGES = [
  { id:"overview",     icon:"🏠", group:"main",  label:{ar:"نظرة عامة",   nl:"Overzicht"} },
  { id:"pathway",      icon:"🧭", group:"main",  label:{ar:"المخطط",      nl:"Route"} },
  { id:"levels",       icon:"📚", group:"main",  label:{ar:"المستويات",   nl:"Niveaus"} },
  { id:"mbo-beroepen", icon:"👷", group:"main",  label:{ar:"مهن MBO",     nl:"MBO-beroepen"} },
  { id:"transitions",  icon:"🔄", group:"ref",   label:{ar:"الانتقالات",  nl:"Overgangen"} },
  { id:"exams",        icon:"📝", group:"ref",   label:{ar:"امتحانات القبول", nl:"Toelatingsexamens"} },
  { id:"salaries",     icon:"💶", group:"ref",   label:{ar:"الرواتب",     nl:"Salarissen"} },
  { id:"compare",      icon:"⚖️", group:"tool",  label:{ar:"مقارنة",      nl:"Vergelijken"} },
  { id:"calculator",   icon:"🧮", group:"tool",  label:{ar:"حاسبة",       nl:"Calculator"} },
  { id:"sources",      icon:"🔗", group:"ref",   label:{ar:"مصادر",       nl:"Bronnen"} },
];
// Secondary pages — reachable via routing but not shown in top nav
const SECONDARY_PAGES = [
  { id:"vmbo",     icon:"🔧",  label:{ar:"VMBO",     nl:"VMBO"} },
  { id:"havovwo",  icon:"🎓",  label:{ar:"HAVO/VWO", nl:"HAVO/VWO"} },
  { id:"mbo",      icon:"🛠️", label:{ar:"MBO",      nl:"MBO"} },
  { id:"hbo",      icon:"🏢",  label:{ar:"HBO",      nl:"HBO"} },
  { id:"wo",       icon:"🏛️", label:{ar:"WO",       nl:"WO"} },
  { id:"vavo",     icon:"🔁",  label:{ar:"VAVO",     nl:"VAVO"} },
];
const ALL_PAGE_IDS = [...PAGES, ...SECONDARY_PAGES].map(p => p.id);

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const safeStore = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch(e){} },
};
const state = {
  lang: (safeStore.get("mbo_site_lang") || "ar"),
  page: "overview",
};

/* ═══════════════════════════════════════════════════════════
   I18N APPLICATION
═══════════════════════════════════════════════════════════ */
function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
}
function applyI18n() {
  $$("[data-i18n]").forEach(n => {
    const k = n.getAttribute("data-i18n");
    const v = I18N[state.lang] && I18N[state.lang][k];
    if (v !== undefined) n.textContent = v;
  });
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  $$(".lang-opt").forEach(b => b.setAttribute("aria-current", b.dataset.lang === state.lang));
  const label = $("#langLabel");
  const flag = $("#langFlag");
  if (label) label.textContent = state.lang === "ar" ? "العربية" : "Nederlands";
  if (flag) flag.textContent = state.lang === "ar" ? "🇸🇦" : "🇳🇱";
  const si = $("#searchInput");
  if (si) si.placeholder = t("search.ph");
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION TABS
═══════════════════════════════════════════════════════════ */
function renderNav() {
  const wrap = $("#navTabs");
  wrap.innerHTML = "";
  let lastGroup = null;
  // If we're on a secondary page, highlight "المستويات" as active
  const activeId = PAGES.find(p => p.id === state.page) ? state.page :
                   SECONDARY_PAGES.find(p => p.id === state.page) ? "levels" : state.page;
  PAGES.forEach(p => {
    if (lastGroup && lastGroup !== p.group) {
      wrap.append(el("span", { class:"nav-divider", "aria-hidden":"true" }));
    }
    lastGroup = p.group;
    const isActive = activeId === p.id;
    const b = el("button", {
      class:"nav-tab" + (isActive ? " active" : ""),
      "data-page": p.id,
      role:"tab",
      "aria-current": isActive ? "page" : "false",
      onclick: () => setPage(p.id),
    });
    // bdi wrap ensures icon+label stay in correct visual order in RTL + LTR
    b.innerHTML = `<bdi class="nav-ico" aria-hidden="true">${p.icon}</bdi><bdi class="nav-label">${p.label[state.lang]}</bdi>`;
    wrap.append(b);
  });
}

function renderFooterLinks() {
  const ul = $("#footerLinks");
  ul.innerHTML = "";
  const allPages = [...PAGES, ...SECONDARY_PAGES];
  ["overview","vmbo","havovwo","mbo","mbo-beroepen","hbo","wo"].forEach(id => {
    const page = allPages.find(p => p.id === id);
    if (!page) return;
    const li = el("li");
    const btn = el("button", { "data-page": id, onclick: () => setPage(id) });
    btn.innerHTML = `${page.icon} ${page.label[state.lang]}`;
    li.append(btn);
    ul.append(li);
  });
}

/* ═══════════════════════════════════════════════════════════
   PAGE ROUTER
═══════════════════════════════════════════════════════════ */
function setPage(id) {
  if (!ALL_PAGE_IDS.includes(id)) id = "overview";
  state.page = id;
  try { history.replaceState(null, "", "#" + id); } catch (_) {}
  renderNav();
  renderMain();
  try { window.scrollTo({ top: ($("nav.navbar")?.offsetTop || 0) - 8, behavior: "smooth" }); } catch (_) {}
}

function renderMain() {
  const main = $("#mainContent");
  if (!main) return;
  main.innerHTML = "";
  const renderer = RENDERERS[state.page] || RENDERERS.overview;
  try {
    main.append(renderer());
  } catch (err) {
    // Error boundary: log and show fallback rather than white-screen
    try { console.error("[renderMain]", state.page, err); } catch (_) {}
    const fallback = el("div", { class:"note danger" });
    fallback.innerHTML =
      '<strong>' + escapeHtml(t("app.error.title") || "حدث خطأ في عرض هذه الصفحة") + '</strong><br>' +
      '<span style="font-size:12.5px">' + escapeHtml((err && err.message) || String(err)) + '</span>';
    main.append(fallback);
  }
  try { observeReveal(); } catch (_) {}
  window.dispatchEvent(new Event("mbo:pagechange"));
}

/* ═══════════════════════════════════════════════════════════
   TABLE BUILDER HELPER
═══════════════════════════════════════════════════════════ */
function buildTable(title, headers, rows) {
  const wrap = el("div", { class:"tt-wrap reveal" });
  if (title) wrap.append(el("h3", { class:"tt-title" }, title));
  const tbl = el("table", { class:"tt" });
  const thead = el("thead");
  const tr = el("tr");
  headers.forEach(h => tr.append(el("th", {}, h)));
  thead.append(tr); tbl.append(thead);
  const tbody = el("tbody");
  rows.forEach(r => {
    const row = el("tr");
    r.forEach(c => {
      const td = el("td");
      td.innerHTML = c;
      row.append(td);
    });
    tbody.append(row);
  });
  tbl.append(tbody);
  wrap.append(tbl);
  return wrap;
}


/* ═══════════════════════════════════════════════════════════
   MBO SECTORS & PROFESSIONS (16 sectors, 50+ professions)
   Each sector: id, icon, name{ar,nl}, professions[]
   Each profession: id, name{ar,nl}, levels[] (1-4), duration{ar,nl},
                    subjects{ar,nl}[], entry{ar,nl}, cert{ar,nl}, next{ar,nl}[]
═══════════════════════════════════════════════════════════ */
const MBO_SECTORS = [
  {
    id:"techniek", icon:"⚙️", name:{ar:"التقنية والهندسة", nl:"Techniek & Engineering"},
    professions:[
      { id:"monteur", name:{ar:"فنّي ميكانيكي", nl:"Machinebankwerker / Monteur"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["رسم تقني","قراءة مخططات","لحام (TIG/MIG)","CNC","الهيدروليك","السلامة (VCA)","الرياضيات التقنية"],
          nl:["Technisch tekenen","Schema's lezen","Lassen (TIG/MIG)","CNC","Hydrauliek","Veiligheid (VCA)","Technische wiskunde"]
        },
        entry:{ar:"VMBO-BB لمستوى 2 / VMBO-KB أو TL لمستوى 3-4", nl:"VMBO-BB (niv 2) / VMBO-KB of -TL (niv 3-4)"},
        cert:{ar:"شهادة MBO + VCA (سلامة) + رخصة لحام NIL", nl:"MBO-diploma + VCA + NIL-lascertificaat"},
        next:{ar:["HBO Werktuigbouwkunde","سوق العمل"], nl:["HBO Werktuigbouwkunde","Arbeidsmarkt"]}
      },
      { id:"electricien", name:{ar:"كهربائي", nl:"Elektromonteur / Eerste monteur elektrotechniek"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["الكهرباء الأساسية","NEN 1010 / NEN 3140","التركيبات المنزلية والصناعية","PLC","الطاقة الشمسية","السلامة"],
          nl:["Elektrotechniek basis","NEN 1010 / NEN 3140","Huis- en industriële installaties","PLC","Zonnepanelen","Veiligheid"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + NEN 3140 VP/VOP + VCA", nl:"MBO + NEN 3140 VP/VOP + VCA"},
        next:{ar:["HBO Elektrotechniek","الاستقلال الذاتي (ZZP)"], nl:["HBO Elektrotechniek","ZZP'er"]}
      },
      { id:"loodgieter", name:{ar:"سبّاك ومركّب تدفئة", nl:"Installateur (loodgieter/cv)"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["أنظمة المياه","الغاز (شهادة Gastechniek)","التدفئة المركزية","المضخات الحرارية","المرحاض والحمام","اللحام والنحاس"],
          nl:["Waterinstallaties","Gas (Gastechniek-certificaat)","CV-ketels","Warmtepompen","Sanitair","Soldeer- en laswerk"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + KvINL (CO-vrij) + VCA", nl:"MBO + KvINL-certificaat (CO-vrij) + VCA"},
        next:{ar:["HBO Installatietechniek","مقاول مستقل"], nl:["HBO Installatietechniek","Eigen bedrijf"]}
      },
      { id:"werktuigbouw-tekenaar", name:{ar:"راسم تقني", nl:"Werktuigbouwkundig tekenaar/constructeur"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["AutoCAD","SolidWorks / Inventor","الميكانيكا","قوة المواد","مواد الإنتاج","الإدارة المشاريع"],
          nl:["AutoCAD","SolidWorks / Inventor","Mechanica","Sterkteleer","Productiematerialen","Projectbeheer"]
        },
        entry:{ar:"VMBO-KB/TL أو HAVO", nl:"VMBO-KB/-TL of HAVO"},
        cert:{ar:"MBO مستوى 4 — يمنح الدخول المباشر إلى HBO", nl:"MBO niveau 4 — directe toegang HBO"},
        next:{ar:["HBO Werktuigbouwkunde / Industrieel Ontwerpen"], nl:["HBO Werktuigbouwkunde / Industrieel Ontwerpen"]}
      }
    ]
  },
  {
    id:"bouw", icon:"🏗️", name:{ar:"البناء والعمارة", nl:"Bouw & Infra"},
    professions:[
      { id:"timmerman", name:{ar:"نجّار بناء", nl:"Timmerman (bouwplaats/werkplaats)"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["قراءة المخططات","النجارة الخشبية","الأطر والسقوف","العزل","الرياضيات التطبيقية","السلامة VCA"],
          nl:["Bouwtekeningen lezen","Houtbewerking","Kappen & daken","Isolatie","Toegepaste wiskunde","VCA-veiligheid"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
        next:{ar:["HBO Bouwkunde","مقاول مستقل"], nl:["HBO Bouwkunde","Zelfstandig aannemer"]}
      },
      { id:"metselaar", name:{ar:"بنّاء حجر/طوب", nl:"Metselaar"},
        levels:[2,3],
        duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
        subjects:{
          ar:["أنواع الطوب والحجر","الملاط","أساسات الجدران","السلالم الحجرية","العزل والرطوبة","VCA"],
          nl:["Steen- en blokken","Specie","Funderingsmetselwerk","Trappen","Isolatie en vocht","VCA"]
        },
        entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
        cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
        next:{ar:["voorman metselaar","MBO niveau 4","سوق العمل"], nl:["Voorman metselaar","MBO-4","Arbeidsmarkt"]}
      },
      { id:"bouwkundig-tekenaar", name:{ar:"راسم معماري", nl:"Bouwkundig tekenaar"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["Revit / AutoCAD","BIM","اللوائح البنائية (Bouwbesluit)","حسابات المنشآت","المواد","التواصل مع المقاول"],
          nl:["Revit / AutoCAD","BIM","Bouwbesluit","Constructieberekeningen","Materialen","Communicatie met aannemer"]
        },
        entry:{ar:"VMBO-KB/TL أو HAVO", nl:"VMBO-KB/-TL of HAVO"},
        cert:{ar:"MBO niveau 4 — دخول HBO Bouwkunde", nl:"MBO-4 — toegang HBO Bouwkunde"},
        next:{ar:["HBO Bouwkunde / Architectuur"], nl:["HBO Bouwkunde / Architectuur"]}
      },
      { id:"straatmaker", name:{ar:"عامل تبليط الشوارع", nl:"Straatmaker"},
        levels:[2,3],
        duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{
          ar:["أنواع الرصف","قراءة الخرائط","تنسيق الحدائق الصلبة","الآلات الخفيفة","السلامة على الطريق","VCA"],
          nl:["Bestratingssoorten","Kaarten lezen","Hardscape","Lichte machines","Verkeersveiligheid","VCA"]
        },
        entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
        cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
        next:{ar:["voorman straatmakers","سوق العمل"], nl:["Voorman straatmakers","Arbeidsmarkt"]}
      }
    ]
  },
  {
    id:"ict", icon:"💻", name:{ar:"تكنولوجيا المعلومات", nl:"ICT"},
    professions:[
      { id:"ict-support", name:{ar:"فنّي دعم IT", nl:"ICT-beheerder / Servicedesk"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["Windows/Linux","الشبكات (TCP/IP)","Active Directory","أمن المعلومات","دعم المستخدمين","ITIL"],
          nl:["Windows/Linux","Netwerken (TCP/IP)","Active Directory","Informatiebeveiliging","Gebruikersondersteuning","ITIL"]
        },
        entry:{ar:"VMBO-BB/KB/TL", nl:"VMBO-BB/KB/TL"},
        cert:{ar:"MBO + CompTIA A+/Network+", nl:"MBO + CompTIA A+/Network+"},
        next:{ar:["HBO HBO-ICT","ZZP","sysadmin"], nl:["HBO HBO-ICT","ZZP","Systeembeheerder"]}
      },
      { id:"software-developer", name:{ar:"مطوّر برامج", nl:"Software developer / Applicatieontwikkelaar"},
        levels:[4],
        duration:{ar:"4 سنوات", nl:"4 jaar"},
        subjects:{
          ar:["البرمجة (C#/Java/Python)","HTML/CSS/JS","SQL وقواعد البيانات","Git/GitHub","Agile/Scrum","الاختبار (TDD)","UX أساسيات"],
          nl:["Programmeren (C#/Java/Python)","HTML/CSS/JS","SQL & databases","Git/GitHub","Agile/Scrum","Testen (TDD)","UX-basis"]
        },
        entry:{ar:"VMBO-TL أو HAVO (محبّذ)", nl:"VMBO-TL of HAVO (aanbevolen)"},
        cert:{ar:"MBO niveau 4 — دخول مباشر إلى HBO", nl:"MBO-4 — directe toegang HBO"},
        next:{ar:["HBO HBO-ICT / Informatica","junior developer"], nl:["HBO HBO-ICT / Informatica","Junior developer"]}
      },
      { id:"cyber", name:{ar:"خبير أمن سيبراني", nl:"ICT-specialist Cybersecurity"},
        levels:[4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["أساسيات الشبكات","Linux CLI","أمن التطبيقات","اختبار الاختراق (ethisch hacken)","SOC","GDPR/AVG"],
          nl:["Netwerkbasis","Linux CLI","Applicatiebeveiliging","Ethisch hacken","SOC","AVG/GDPR"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"MBO-4 + CompTIA Security+", nl:"MBO-4 + CompTIA Security+"},
        next:{ar:["HBO Cyber Security","SOC-analyst"], nl:["HBO Cyber Security","SOC-analist"]}
      }
    ]
  },
  {
    id:"media", icon:"🎨", name:{ar:"الإعلام والتصميم", nl:"Media, Vormgeving & Design"},
    professions:[
      { id:"grafisch-vormgever", name:{ar:"مصمم جرافيك", nl:"Mediavormgever / Grafisch vormgever"},
        levels:[4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["Adobe (Photoshop/Illustrator/InDesign)","نظرية الألوان","التيبوغرافي","تصميم الهوية","UX/UI","إدارة مشاريع"],
          nl:["Adobe (Photoshop/Illustrator/InDesign)","Kleurtheorie","Typografie","Identiteitsontwerp","UX/UI","Projectmanagement"]
        },
        entry:{ar:"VMBO-TL أو HAVO + ملف أعمال", nl:"VMBO-TL of HAVO + portfolio"},
        cert:{ar:"MBO-4 + Adobe Certified Professional (اختياري)", nl:"MBO-4 + Adobe Certified Professional (optioneel)"},
        next:{ar:["HBO Communication & Multimedia Design","مصمم مستقل"], nl:["HBO Communication & Multimedia Design","Zelfstandig ontwerper"]}
      },
      { id:"av-specialist", name:{ar:"فنّي صوتي/بصري", nl:"AV-specialist / Geluid & Beeld"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["Adobe Premiere / DaVinci","التصوير والإضاءة","هندسة الصوت","المونتاج","البث المباشر","إدارة الإنتاج"],
          nl:["Adobe Premiere / DaVinci","Camera & licht","Geluidstechniek","Editing","Livestreaming","Productiemanagement"]
        },
        entry:{ar:"VMBO-KB/TL + اهتمام بالإعلام", nl:"VMBO-KB/-TL + interesse in media"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO Media & Entertainment Management"], nl:["HBO Media & Entertainment Management"]}
      },
      { id:"game-artist", name:{ar:"مصمم ألعاب", nl:"Gamedeveloper / Gameartist"},
        levels:[4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["Unity / Unreal","C# / C++","3D Modeling (Blender)","تصميم الشخصيات","اختبار الألعاب","عمل جماعي"],
          nl:["Unity / Unreal","C# / C++","3D Modeling (Blender)","Character design","Gametesten","Teamwork"]
        },
        entry:{ar:"VMBO-TL أو HAVO + ملف أعمال", nl:"VMBO-TL of HAVO + portfolio"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO Game Design / HBO-ICT"], nl:["HBO Game Design / HBO-ICT"]}
      }
    ]
  },
  {
    id:"zorg", icon:"🏥", name:{ar:"الرعاية الصحية والخدمات", nl:"Zorg & Welzijn"},
    professions:[
      { id:"verzorgende", name:{ar:"مساعد تمريض (IG)", nl:"Verzorgende IG"},
        levels:[3],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["علم التشريح","الرعاية اليومية","الأدوية الأساسية","الأخلاق والتواصل","الإسعافات الأولية","الصحة النفسية"],
          nl:["Anatomie","ADL-zorg","Medicatie basis","Ethiek & communicatie","EHBO","Psychische gezondheid"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"BIG-registratie (Verzorgende IG)", nl:"BIG-registratie (Verzorgende IG)"},
        next:{ar:["MBO-Verpleegkunde niveau 4","HBO-V"], nl:["MBO-Verpleegkunde niveau 4","HBO-V"]}
      },
      { id:"mbo-verpleegkundige", name:{ar:"ممرّض MBO", nl:"MBO-Verpleegkundige"},
        levels:[4],
        duration:{ar:"4 سنوات", nl:"4 jaar"},
        subjects:{
          ar:["علم الأمراض","الرعاية المتخصصة","الأدوية","الأخلاق الطبية","إدارة الحالات","رعاية كبار السن/الأطفال"],
          nl:["Pathologie","Specialistische zorg","Farmacologie","Medische ethiek","Casemanagement","Ouderen-/kinderzorg"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"BIG-registratie (Verpleegkundige) + MBO-4", nl:"BIG-registratie (Verpleegkundige) + MBO-4"},
        next:{ar:["HBO-V (Verpleegkunde)","تخصص (IC/SEH)"], nl:["HBO-V","Specialisatie (IC/SEH)"]}
      },
      { id:"pedagogisch-medewerker", name:{ar:"مربّي أطفال", nl:"Pedagogisch medewerker kinderopvang"},
        levels:[3,4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["تطور الطفل","علم النفس","التواصل مع الأهل","الصحة والسلامة","التعليم اللعبي","VOG شهادة سلوك حسن"],
          nl:["Kinderontwikkeling","Psychologie","Oudercommunicatie","Veiligheid & hygiëne","Spelend leren","VOG"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO-3/4 + VOG + EHBO للأطفال", nl:"MBO-3/4 + VOG + Kinder-EHBO"},
        next:{ar:["HBO Pedagogiek","Social Work"], nl:["HBO Pedagogiek","Social Work"]}
      },
      { id:"sociaal-werk", name:{ar:"أخصائي اجتماعي مساعد", nl:"Sociaal werk / Maatschappelijke zorg"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["علم النفس الاجتماعي","دعم المعوقين","الإدمان والصحة النفسية","القوانين الاجتماعية","التواصل المهني"],
          nl:["Sociale psychologie","Begeleiding LVB","Verslaving & GGZ","Sociale wetgeving","Professionele communicatie"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO-4 + VOG", nl:"MBO-4 + VOG"},
        next:{ar:["HBO Social Work"], nl:["HBO Social Work"]}
      }
    ]
  },
  {
    id:"economie", icon:"💼", name:{ar:"الاقتصاد والإدارة", nl:"Economie & Administratie"},
    professions:[
      { id:"boekhouder", name:{ar:"مُحاسب", nl:"Financieel administratief medewerker"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["المحاسبة الأساسية","ضريبة القيمة المضافة (BTW)","Excel متقدم","برامج Exact/AFAS","التقارير المالية","القوانين المالية"],
          nl:["Boekhouden","BTW-aangifte","Excel gevorderd","Exact/AFAS","Financiële rapportage","Financiële wetgeving"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO-4 (Praktijkdiploma Boekhouden اختياري)", nl:"MBO-4 (Praktijkdiploma Boekhouden optioneel)"},
        next:{ar:["HBO Finance & Control","HBO Accountancy"], nl:["HBO Finance & Control","HBO Accountancy"]}
      },
      { id:"management-assistent", name:{ar:"مساعد إداري/سكرتير تنفيذي", nl:"Management/Directie-assistent"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["إدارة المكتب","التواصل التجاري","اللغة الإنجليزية عمل","Office 365","تنظيم الاجتماعات","الخصوصية (AVG)"],
          nl:["Office management","Zakelijke communicatie","Business English","Office 365","Vergaderen organiseren","AVG/Privacy"]
        },
        entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO Office Management","HBO Bedrijfskunde"], nl:["HBO Office Management","HBO Bedrijfskunde"]}
      },
      { id:"juridisch-medewerker", name:{ar:"مساعد قانوني", nl:"Juridisch medewerker"},
        levels:[4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["القانون المدني والإداري","العقود","قانون العمل","كتابة الرسائل الرسمية","GDPR/AVG","المكاتبات القانونية"],
          nl:["Civiel/bestuursrecht","Contracten","Arbeidsrecht","Zakelijk schrijven","AVG/GDPR","Juridische correspondentie"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO HBO-Rechten","HBO Sociaal Juridische Dienstverlening"], nl:["HBO-Rechten","HBO SJD"]}
      }
    ]
  },
  {
    id:"handel", icon:"🛒", name:{ar:"التجارة والمبيعات", nl:"Handel & Retail"},
    professions:[
      { id:"verkoper", name:{ar:"بائع/مستشار مبيعات", nl:"Verkoper / Verkoopspecialist"},
        levels:[2,3],
        duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
        subjects:{
          ar:["خدمة العملاء","تقنيات البيع","إدارة المخزون","التسويق","الرياضيات التجارية","الإنجليزية"],
          nl:["Klantenservice","Verkooptechnieken","Voorraadbeheer","Marketing","Commerciële rekenen","Engels"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO-2/3", nl:"MBO-2/3"},
        next:{ar:["MBO-4 Manager Retail","HBO Commerciële Economie"], nl:["MBO-4 Manager Retail","HBO Commerciële Economie"]}
      },
      { id:"retailmanager", name:{ar:"مدير متجر", nl:"Manager Retail"},
        levels:[4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["إدارة الفريق","المحاسبة","KPI","إدارة المخزون","التسويق الرقمي","HRM أساسيات"],
          nl:["Teammanagement","Bedrijfseconomie","KPI's","Voorraadbeheer","Digitale marketing","HRM basis"]
        },
        entry:{ar:"VMBO-TL أو MBO-3", nl:"VMBO-TL of MBO-3"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO Commerciële Economie / Retail Management"], nl:["HBO CE / Retail Management"]}
      },
      { id:"marketing-medewerker", name:{ar:"مسؤول تسويق رقمي", nl:"Medewerker Marketing & Communicatie"},
        levels:[4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["Google Ads","SEO","السوشيال ميديا","كتابة المحتوى","Analytics","التصميم الأساسي"],
          nl:["Google Ads","SEO","Social media","Contentschrijven","Analytics","Grafische basis"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"MBO-4 + Google Analytics (اختياري)", nl:"MBO-4 + Google Analytics (optioneel)"},
        next:{ar:["HBO Communication / CE"], nl:["HBO Communicatie / CE"]}
      }
    ]
  },
  {
    id:"horeca", icon:"🍳", name:{ar:"الضيافة والمطاعم", nl:"Horeca"},
    professions:[
      { id:"kok", name:{ar:"طبّاخ/شيف", nl:"Kok / Zelfstandig werkend kok"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["تقنيات الطبخ","النظافة HACCP","قراءة الوصفات","إدارة التكلفة","المطبخ الهولندي والعالمي","السلامة"],
          nl:["Kooktechnieken","HACCP-hygiëne","Recepten lezen","Costing","Internationale keuken","Veiligheid"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + شهادة HACCP + Sociale Hygiëne (لإدارة مطعم)", nl:"MBO + HACCP + Sociale Hygiëne"},
        next:{ar:["MBO-4 Leidinggevende Keuken","HBO Hotel Management"], nl:["MBO-4 Leidinggevende Keuken","HBO Hotel Management"]}
      },
      { id:"gastheer", name:{ar:"مضيف/نادل", nl:"Gastheer/Gastvrouw (zelfstandig werkend)"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["خدمة العملاء","بيع المشروبات والنبيذ","لغات (EN/DE)","ترتيب الطاولات","الدفع والتسجيل","إدارة الشكاوى"],
          nl:["Gastvrijheid","Drank- en wijnkennis","Talen (EN/DE)","Tafeldekken","Kassa","Klachtenafhandeling"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + Sociale Hygiëne", nl:"MBO + Sociale Hygiëne"},
        next:{ar:["MBO-4 Manager Horeca","HBO Hotel Management"], nl:["MBO-4 Manager Horeca","HBO Hotel Management"]}
      },
      { id:"hotel-manager", name:{ar:"مدير فندق/مطعم", nl:"Manager Horeca"},
        levels:[4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["إدارة الفريق","Yield Management","المحاسبة","التسويق الفندقي","HACCP","الضيافة المتقدمة"],
          nl:["Teamleiderschap","Yield management","Bedrijfseconomie","Hotelmarketing","HACCP","Gevorderde gastvrijheid"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"MBO-4 + Sociale Hygiëne", nl:"MBO-4 + Sociale Hygiëne"},
        next:{ar:["HBO Hotel Management / HBO International Hospitality"], nl:["HBO Hotel Management / International Hospitality"]}
      }
    ]
  },
  {
    id:"mobiliteit", icon:"🚗", name:{ar:"المركبات والنقل", nl:"Mobiliteit & Transport"},
    professions:[
      { id:"automonteur", name:{ar:"ميكانيكي سيارات", nl:"Autotechnicus / Eerste Autotechnicus"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["المحركات","الفرامل والتعليق","الإلكترونيات","السيارات الكهربائية (EV)","التشخيص الحاسوبي","APK"],
          nl:["Motortechniek","Remmen & ophanging","Elektronica","Elektrische voertuigen","Computerdiagnose","APK"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + APK-keurmeester (اختياري) + شهادة HV (EV) للمستوى 4", nl:"MBO + APK-keurmeester (optioneel) + HV-certificaat (EV) op niv 4"},
        next:{ar:["HBO Automotive","ZZP-garage"], nl:["HBO Automotive","Eigen garage"]}
      },
      { id:"vrachtwagenchauffeur", name:{ar:"سائق شاحنة", nl:"Chauffeur goederenvervoer"},
        levels:[2,3],
        duration:{ar:"1–3 سنوات", nl:"1–3 jaar"},
        subjects:{
          ar:["رخصة C/CE","Code 95","قوانين المرور","أوقات القيادة والراحة","تسليم البضائع","ADR (للمواد الخطرة)"],
          nl:["Rijbewijs C/CE","Code 95","Verkeersregels","Rij- en rusttijden","Leveringen","ADR (gevaarlijke stoffen)"]
        },
        entry:{ar:"VMBO-BB + 18 عاماً", nl:"VMBO-BB + 18 jaar"},
        cert:{ar:"MBO + Rijbewijs C/CE + Code 95", nl:"MBO + Rijbewijs C/CE + Code 95"},
        next:{ar:["MBO-4 Planner","سوق العمل"], nl:["MBO-4 Planner","Arbeidsmarkt"]}
      },
      { id:"logistiek-medewerker", name:{ar:"موظف لوجستيات/مخزن", nl:"Logistiek medewerker / Warehouseman"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["WMS","إدارة المخزون","الرافعة الشوكية (heftruck)","إدارة السلسلة","الأمان","الإنجليزية"],
          nl:["WMS","Voorraadbeheer","Heftruckcertificaat","Supply chain","Veiligheid","Engels"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + Heftruckcertificaat + VCA", nl:"MBO + Heftruckcertificaat + VCA"},
        next:{ar:["MBO-4 Logistiek Supervisor","HBO Logistics Management"], nl:["MBO-4 Logistiek Supervisor","HBO Logistiek"]}
      }
    ]
  },
  {
    id:"onderwijs", icon:"🧑‍🏫", name:{ar:"التعليم والتدريب", nl:"Onderwijs & Opleiden"},
    professions:[
      { id:"onderwijsassistent", name:{ar:"مساعد معلم", nl:"Onderwijsassistent"},
        levels:[4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["علم التربية","تطور الطفل","دعم القراءة والحساب","التنوع الثقافي","إدارة الصف","VOG"],
          nl:["Pedagogiek","Kinderontwikkeling","Taal & rekenondersteuning","Culturele diversiteit","Klassenmanagement","VOG"]
        },
        entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
        cert:{ar:"MBO-4 + VOG", nl:"MBO-4 + VOG"},
        next:{ar:["PABO (HBO) لمعلم ابتدائي","HBO Pedagogiek"], nl:["PABO (HBO)","HBO Pedagogiek"]}
      }
    ]
  },
  {
    id:"sport", icon:"⚽", name:{ar:"الرياضة والترفيه", nl:"Sport & Bewegen"},
    professions:[
      { id:"sport-bewegingsleider", name:{ar:"مدرب رياضة", nl:"Sport- en bewegingsleider / Trainer/Coach"},
        levels:[3,4],
        duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
        subjects:{
          ar:["علم التشريح","التدريب","الإصابات والإسعافات","علم النفس الرياضي","التنظيم والفعاليات","تدريس الأطفال"],
          nl:["Anatomie","Trainingsleer","Blessures & EHBO","Sportpsychologie","Evenementen","Jeugd lesgeven"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO-4 + EHBO + VOG", nl:"MBO-4 + EHBO + VOG"},
        next:{ar:["HBO ALO (معلم رياضة)","Sportkunde"], nl:["HBO ALO","Sportkunde"]}
      }
    ]
  },
  {
    id:"uiterlijk", icon:"💄", name:{ar:"العناية الشخصية والتجميل", nl:"Uiterlijke Verzorging"},
    professions:[
      { id:"kapper", name:{ar:"مصفف شعر", nl:"Kapper / Allround kapper"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["قص الشعر","الصبغة","التسريح","استشارة العملاء","النظافة","إدارة صالون (مستوى 4)"],
          nl:["Knippen","Kleuren","Stylen","Klantadvies","Hygiëne","Salonmanagement (niv 4)"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + AKI (لفتح صالون)", nl:"MBO + AKI-diploma (voor eigen salon)"},
        next:{ar:["MBO-4 Salonmanager","ZZP-kapsalon"], nl:["MBO-4 Salonmanager","Eigen salon"]}
      },
      { id:"schoonheidsspecialist", name:{ar:"أخصائي تجميل", nl:"Schoonheidsspecialist"},
        levels:[3,4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["علم الجلد","علاجات الوجه","إزالة الشعر","الماكياج","نظافة وتعقيم","استشارة العملاء"],
          nl:["Huidkunde","Gezichtsbehandelingen","Ontharing","Make-up","Hygiëne","Klantadvies"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO + ANBOS (اختياري)", nl:"MBO + ANBOS-lid (optioneel)"},
        next:{ar:["ZZP salon","MBO-4 Salonmanager"], nl:["ZZP salon","MBO-4 Salonmanager"]}
      }
    ]
  },
  {
    id:"veiligheid", icon:"🚓", name:{ar:"الأمن والسلامة", nl:"Veiligheid & Defensie"},
    professions:[
      { id:"beveiliger", name:{ar:"عون أمن", nl:"Beveiliger 2"},
        levels:[2,3],
        duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
        subjects:{
          ar:["القانون الأمني","حقوق الإنسان","مكافحة الحرائق","الإسعافات الأولية","التقارير الأمنية","التواصل"],
          nl:["Veiligheidswetgeving","Mensenrechten","BHV","EHBO","Rapportage","Communicatie"]
        },
        entry:{ar:"VMBO-BB + VOG + 18 عاماً", nl:"VMBO-BB + VOG + 18 jaar"},
        cert:{ar:"MBO-2 + VOG + ND-nummer (Justitie)", nl:"MBO-2 + VOG + ND-nummer (Justitie)"},
        next:{ar:["MBO-3/4 Coördinator Beveiliging","Politie/Marechaussee"], nl:["MBO-3/4 Coördinator Beveiliging","Politie/Marechaussee"]}
      },
      { id:"handhaver", name:{ar:"موظف إنفاذ (BOA)", nl:"Handhaver Toezicht & Veiligheid (BOA)"},
        levels:[3],
        duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{
          ar:["قانون العقوبات","حقوق المواطن","الدفاع عن النفس","التقارير الرسمية","القانون الإداري","التواصل في النزاع"],
          nl:["Strafrecht","Burgerrechten","Zelfverdediging","Proces-verbaal","Bestuursrecht","Gespreksvaardigheid"]
        },
        entry:{ar:"VMBO-KB/TL + VOG", nl:"VMBO-KB/-TL + VOG"},
        cert:{ar:"MBO-3 + BOA-examen + VOG", nl:"MBO-3 + BOA-examen + VOG"},
        next:{ar:["Politie","HBO Integrale Veiligheidskunde"], nl:["Politie","HBO Integrale Veiligheidskunde"]}
      }
    ]
  },
  {
    id:"toerisme", icon:"✈️", name:{ar:"السياحة والترفيه", nl:"Toerisme & Recreatie"},
    professions:[
      { id:"travel-specialist", name:{ar:"مستشار سفر", nl:"Medewerker Toerisme & Recreatie"},
        levels:[3,4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["الجغرافيا السياحية","حجز الطيران (GDS)","البيع","خدمة العملاء","لغتان أجنبيتان","التسويق السياحي"],
          nl:["Toeristische geografie","Reserveringssystemen (GDS)","Verkoop","Klantenservice","Twee vreemde talen","Toeristische marketing"]
        },
        entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/-TL"},
        cert:{ar:"MBO-4", nl:"MBO-4"},
        next:{ar:["HBO Tourism Management","مستشار سفر مستقل"], nl:["HBO Tourism Management","Zelfstandig reisadviseur"]}
      }
    ]
  },
  {
    id:"voedsel", icon:"🌱", name:{ar:"الغذاء والطبيعة والزراعة", nl:"Voedsel, Natuur & Landbouw"},
    professions:[
      { id:"hovenier", name:{ar:"بستاني/مُنسّق حدائق", nl:"Hovenier / Vakbekwaam hovenier"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["النباتات والأشجار","تصميم الحدائق","الصيانة","الآلات","الري والتربة","VCA"],
          nl:["Planten- en bomenkennis","Tuinontwerp","Onderhoud","Machines","Irrigatie & bodem","VCA"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + VCA + Spuitlicentie (مبيدات)", nl:"MBO + VCA + Spuitlicentie"},
        next:{ar:["HBO Tuin- en Landschapsinrichting","ZZP hovenier"], nl:["HBO Tuin- en Landschap","Eigen tuinbedrijf"]}
      },
      { id:"dierverzorger", name:{ar:"عامل رعاية حيوانات", nl:"Dierverzorger"},
        levels:[2,3,4],
        duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
        subjects:{
          ar:["تغذية الحيوان","الصحة البيطرية","تربية الماشية/الحيوانات الأليفة","النظافة","قوانين الرفق بالحيوان"],
          nl:["Diervoeding","Diergezondheid","Veehouderij / Gezelschapsdieren","Hygiëne","Dierenwelzijnswet"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
        next:{ar:["HBO Diermanagement","Dierenarts-assistent"], nl:["HBO Diermanagement","Dierenartsassistent"]}
      },
      { id:"voedingsassistent", name:{ar:"فنّي غذاء وتغذية", nl:"Voedingsassistent / Medewerker voeding"},
        levels:[2,3],
        duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
        subjects:{
          ar:["علم الأغذية","HACCP","إعداد الوجبات","التغذية الصحية","النظافة","الخدمة"],
          nl:["Voedingsleer","HACCP","Maaltijdbereiding","Gezonde voeding","Hygiëne","Service"]
        },
        entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
        cert:{ar:"MBO + HACCP", nl:"MBO + HACCP"},
        next:{ar:["MBO-4 Gastronoom","HBO Voeding & Diëtetiek"], nl:["MBO-4 Gastronoom","HBO Voeding & Diëtetiek"]}
      }
    ]
  },
  {
    id:"luchtvaart", icon:"🛫", name:{ar:"الطيران والبحرية", nl:"Luchtvaart & Scheepvaart"},
    professions:[
      { id:"luchtvaartdienstverlener", name:{ar:"موظف خدمات جوية", nl:"Luchtvaartdienstverlener (grondpersoneel)"},
        levels:[4],
        duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{
          ar:["خدمة العملاء","اللغة الإنجليزية ICAO","قوانين الطيران","أمن المطار","تسجيل الوصول والبضائع","السلامة"],
          nl:["Klantenservice","ICAO-Engels","Luchtvaartregelgeving","Airport security","Check-in & vracht","Veiligheid"]
        },
        entry:{ar:"VMBO-TL أو HAVO + إنجليزية جيدة", nl:"VMBO-TL of HAVO + goed Engels"},
        cert:{ar:"MBO-4 + VOG + شهادة أمن مطار", nl:"MBO-4 + VOG + Luchtvaartbeveiliging"},
        next:{ar:["HBO Aviation","مضيف/مضيفة طيران"], nl:["HBO Aviation","Cabin crew"]}
      }
    ]
  }
];
let MBO_SECTOR_BY_ID = Object.fromEntries(MBO_SECTORS.map(s => [s.id, s]));

/* ═══════════════════════════════════════════════════════════
   EXTRA PROFESSIONS & SECTORS — expansion pack
═══════════════════════════════════════════════════════════ */
(function expandProfessions(){
  function p(obj){ return obj; } // identity helper for readability

  const ADD = {
    techniek: [
      p({ id:"lasser", name:{ar:"لحّام معتمد", nl:"Allround lasser"}, levels:[2,3],
          duration:{ar:"2 سنة", nl:"2 jaar"},
          subjects:{ar:["لحام MIG/MAG","لحام TIG","قراءة المخططات","معالجة المعادن","السلامة VCA","اختبار اللحام"],
                    nl:["MIG/MAG-lassen","TIG-lassen","Tekeningen lezen","Metaalbewerking","VCA","Laskeuring"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + NIL-شهادة لحام + VCA", nl:"MBO + NIL-lascertificaat + VCA"},
          next:{ar:["ميكانيكي","مقاول مستقل"], nl:["Monteur","ZZP-lasser"]} }),
      p({ id:"cnc-operator", name:{ar:"مُشغّل CNC", nl:"CNC-verspaner / Operator"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["برمجة CNC (G-code)","قياسات CMM","مواد الإنتاج","التخطيط","صيانة أولية","VCA"],
                    nl:["CNC-programmeren (G-code)","CMM-meten","Materialen","Werkvoorbereiding","Eerstelijns onderhoud","VCA"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["HBO Werktuigbouw","مبرمج CNC"], nl:["HBO Werktuigbouw","CNC-programmeur"]} }),
      p({ id:"mechatronicus", name:{ar:"فنّي ميكاترونيكس", nl:"Mechatronicus / Service-technicus"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["الميكانيكا","الإلكترونيات","PLC و IoT","الأنظمة الهيدروليكية","التشخيص","الروبوتات"],
                    nl:["Mechanica","Elektronica","PLC & IoT","Hydrauliek","Diagnose","Robotica"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4 + VCA", nl:"MBO-4 + VCA"},
          next:{ar:["HBO Mechatronica","Service engineer"], nl:["HBO Mechatronica","Service engineer"]} }),
      p({ id:"dakdekker", name:{ar:"عامل تسقيف (بيتومين/معدن)", nl:"Dakdekker bitumen/metaal"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["أنواع الأسقف","العزل","السلامة على الارتفاع","الحرارة والصفائح","الصرف","VCA"],
                    nl:["Daksystemen","Isolatie","Hoogtewerk-veiligheid","Bitumen/metaal","Afvoeren","VCA"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA + شهادة سلامة مرتفعات", nl:"MBO + VCA + Hoogwerker-cert"},
          next:{ar:["voorman dakdekker","مقاول مستقل"], nl:["Voorman dakdekker","Eigen bedrijf"]} })
    ],
    bouw: [
      p({ id:"stukadoor", name:{ar:"مُلبّس جدران (قصّار)", nl:"Stukadoor"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["التلبيس الجبسي","القصّ والقوالب","الديكور","القياس","المواد","VCA"],
                    nl:["Gipsstucwerk","Sierpleister","Decoratie","Meten","Materialen","VCA"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["ZZP-stukadoor","MBO-3 voorman"], nl:["ZZP-stukadoor","MBO-3 voorman"]} }),
      p({ id:"schilder", name:{ar:"دهّان/مُزخرف", nl:"Schilder / Afwerker"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["تقنيات الدهان","الأصباغ والألوان","تحضير السطح","ورق الجدران","السلامة","العمل على السقالات"],
                    nl:["Schildertechnieken","Kleur & pigmenten","Ondergrond","Behang","Veiligheid","Steigergebruik"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["ZZP-schilder","MBO-3 voorman"], nl:["ZZP-schilder","MBO-3 voorman"]} }),
      p({ id:"kraanmachinist", name:{ar:"مُشغّل رافعة (كرين)", nl:"Machinist mobiele kraan / Torenkraan"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["تقنية الرفع","قراءة الخرائط","حساب الأحمال","السلامة","صيانة الآلة","TCVT"],
                    nl:["Hijstechniek","Tekeningen lezen","Lastberekeningen","Veiligheid","Onderhoud","TCVT-register"]},
          entry:{ar:"VMBO-KB + 18 سنة", nl:"VMBO-KB + 18 jaar"},
          cert:{ar:"MBO + TCVT + VCA", nl:"MBO + TCVT + VCA"},
          next:{ar:["voorman","ZZP"], nl:["Voorman","ZZP"]} })
    ],
    ict: [
      p({ id:"data-analist", name:{ar:"مُحلّل بيانات", nl:"Data-analist / BI-medewerker"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["SQL","Python/R أساسي","Excel/Power BI","الإحصاء التطبيقي","تصوّر البيانات","GDPR"],
                    nl:["SQL","Python/R basis","Excel/Power BI","Toegepaste statistiek","Datavisualisatie","AVG"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + Microsoft DA-100 (اختياري)", nl:"MBO-4 + DA-100 (optioneel)"},
          next:{ar:["HBO Business IT & Management","HBO Data Science"], nl:["HBO BIM","HBO Data Science"]} }),
      p({ id:"netwerkbeheerder", name:{ar:"مدير شبكات", nl:"Netwerkbeheerder"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Cisco / Routing","VLAN و VPN","الجدران النارية","Wi-Fi المتقدم","VoIP","مراقبة الشبكة"],
                    nl:["Cisco / Routing","VLAN & VPN","Firewalls","Advanced Wi-Fi","VoIP","Netwerkmonitoring"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + CCNA (اختياري)", nl:"MBO-4 + CCNA (optioneel)"},
          next:{ar:["HBO Network Engineering","ZZP-sysadmin"], nl:["HBO Network Engineering","ZZP"]} }),
      p({ id:"applicatiebeheerder", name:{ar:"مدير تطبيقات", nl:"Applicatiebeheerder"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["إدارة قواعد البيانات","ITIL 4","صيانة ERP","CI/CD أساسي","SQL","دعم المستخدمين"],
                    nl:["Databasebeheer","ITIL 4","ERP-onderhoud","CI/CD basis","SQL","Gebruikerssupport"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + ITIL Foundation", nl:"MBO-4 + ITIL Foundation"},
          next:{ar:["HBO Business IT","Product Owner junior"], nl:["HBO Business IT","Junior PO"]} }),
      p({ id:"cloud-engineer", name:{ar:"مهندس سحابة (Cloud)", nl:"Cloud Engineer / DevOps junior"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["AWS/Azure أساسيات","Docker و Kubernetes","Terraform","Linux CLI","Git","Monitoring"],
                    nl:["AWS/Azure-basis","Docker & Kubernetes","Terraform","Linux CLI","Git","Monitoring"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + AWS Cloud Practitioner (اختياري)", nl:"MBO-4 + AWS CLP (optioneel)"},
          next:{ar:["HBO HBO-ICT / Cloud","DevOps engineer"], nl:["HBO-ICT / Cloud","DevOps engineer"]} }),
      p({ id:"ui-ux-designer", name:{ar:"مصمم واجهات UI/UX", nl:"UI/UX Designer (MBO)"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Figma","بحث المستخدم","رسم الخرائط التفاعلية","تصميم الحركة","إمكانية الوصول (WCAG)","اختبار المستخدم"],
                    nl:["Figma","Gebruikersonderzoek","Wireframing","Motion design","Toegankelijkheid (WCAG)","User testing"]},
          entry:{ar:"VMBO-TL أو HAVO + ملف أعمال", nl:"VMBO-TL of HAVO + portfolio"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["HBO CMD","مصمم مستقل"], nl:["HBO CMD","Zelfstandig ontwerper"]} })
    ],
    media: [
      p({ id:"fotograaf", name:{ar:"مصوّر محترف", nl:"Fotograaf / Mediaproducer"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["تقنيات الكاميرا","الإضاءة الاستوديو","Lightroom / Photoshop","تصوير المنتجات","البورتريه","ريادة الأعمال"],
                    nl:["Cameratechniek","Studiobelichting","Lightroom / Photoshop","Productfotografie","Portret","Ondernemerschap"]},
          entry:{ar:"VMBO-KB/TL + ملف أعمال", nl:"VMBO-KB/TL + portfolio"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["HBO Fotografie","ZZP"], nl:["HBO Fotografie","ZZP"]} }),
      p({ id:"podiumtechnicus", name:{ar:"فنّي مسرح (إضاءة/صوت)", nl:"Podium- en evenemententechnicus"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["مدّ الكابلات","وحدات الإضاءة DMX","أنظمة الصوت الحيّة","السلامة على المسرح","الرفع والتعليق","إدارة الوقت"],
                    nl:["Bekabeling","DMX-lichttechniek","Live-geluid","Podiumveiligheid","Rigging","Planning"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4 + VCA", nl:"MBO-4 + VCA"},
          next:{ar:["HBO Podium & Evenemententechniek"], nl:["HBO Podium & Evenemententechniek"]} })
    ],
    zorg: [
      p({ id:"tandartsassistent", name:{ar:"مساعد طبيب أسنان", nl:"Tandartsassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["علم الأسنان","التعقيم","الأشعّة","التواصل مع المريض","الإدارة","الوقاية"],
                    nl:["Tandheelkunde","Sterilisatie","Röntgen","Patiëntcommunicatie","Administratie","Preventie"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + VOG", nl:"MBO-4 + VOG"},
          next:{ar:["Mondhygiënist (HBO)","Praktijkmanager"], nl:["HBO Mondzorgkunde","Praktijkmanager"]} }),
      p({ id:"apothekersassistent", name:{ar:"مساعد صيدلي", nl:"Apothekersassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["علم الأدوية","صرف الوصفات","التواصل مع المريض","المخزون","القوانين الدوائية","VOG"],
                    nl:["Farmacologie","Receptverwerking","Patiëntcommunicatie","Voorraadbeheer","Geneesmiddelenwet","VOG"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + VOG + BIG (اختياري)", nl:"MBO-4 + VOG + BIG (optioneel)"},
          next:{ar:["HBO Farmakunde","Apotheker (WO)"], nl:["HBO Farmakunde","Apotheker (WO)"]} }),
      p({ id:"doktersassistent", name:{ar:"مساعد طبيب", nl:"Doktersassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["الإسعافات الأولية","أخذ العينات","تخطيط القلب ECG","إدارة العيادة","التواصل","الخصوصية (AVG)"],
                    nl:["EHBO","Bloedafname","ECG","Praktijkorganisatie","Communicatie","AVG"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + VOG", nl:"MBO-4 + VOG"},
          next:{ar:["HBO-V","Praktijkmanager"], nl:["HBO-V","Praktijkmanager"]} }),
      p({ id:"ambulance", name:{ar:"مُسعف طارئ", nl:"Ambulancemedewerker (meldkamer/chauffeur)"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["ALS/BLS","القيادة الطارئة","الاتصالات C2000","الصدمة","القوانين الصحية","VOG"],
                    nl:["ALS/BLS","Optische/geluidssignalen","C2000-communicatie","Trauma","Zorgwetgeving","VOG"]},
          entry:{ar:"VMBO-TL + رخصة قيادة + 21 سنة", nl:"VMBO-TL + rijbewijs + 21 jaar"},
          cert:{ar:"MBO-4 + BIG + VOG", nl:"MBO-4 + BIG + VOG"},
          next:{ar:["HBO-V","ambulanceverpleegkundige"], nl:["HBO-V","Ambulanceverpleegkundige"]} })
    ],
    economie: [
      p({ id:"hr-medewerker", name:{ar:"موظف موارد بشرية", nl:"HR-medewerker / Personeelsadministrateur"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["قانون العمل","التوظيف","كشوف الرواتب","الإجازات والمرض","AVG","الاتصالات المهنية"],
                    nl:["Arbeidsrecht","Werving & selectie","Salarisadministratie","Verzuim","AVG","Bedrijfscommunicatie"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["HBO HRM","Bedrijfskunde"], nl:["HBO HRM","HBO Bedrijfskunde"]} }),
      p({ id:"salarisadmin", name:{ar:"مُختص كشوف الرواتب", nl:"Salarisadministrateur"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["ضريبة الدخل","التأمينات الاجتماعية","AFAS/Nmbrs","المحاسبة","CAO","Excel"],
                    nl:["Loonheffing","Sociale verzekeringen","AFAS/Nmbrs","Boekhouden","CAO-kennis","Excel"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + PDL (Praktijkdiploma Loonadministratie)", nl:"MBO-4 + PDL"},
          next:{ar:["HBO F&C","VPS (Vakopleiding Payroll Services)"], nl:["HBO F&C","VPS"]} })
    ],
    handel: [
      p({ id:"ecommerce", name:{ar:"مختص التجارة الإلكترونية", nl:"E-commerce specialist"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Shopify / WooCommerce","SEA (Google Ads)","SEO","تحليل البيانات","إدارة المنتج","الخدمات اللوجستية"],
                    nl:["Shopify / WooCommerce","SEA (Google Ads)","SEO","Data-analyse","Productbeheer","Fulfilment"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + Google Analytics", nl:"MBO-4 + Google Analytics"},
          next:{ar:["HBO CE","E-commerce manager"], nl:["HBO CE","E-commerce manager"]} }),
      p({ id:"inkoper", name:{ar:"مسؤول مشتريات", nl:"Inkoopmedewerker / Junior inkoper"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["تقنيات التفاوض","المحاسبة","SAP/Exact","السلسلة اللوجستية","قانون العقود","الإنجليزية التجارية"],
                    nl:["Onderhandelen","Bedrijfseconomie","SAP/Exact","Supply chain","Contractrecht","Business English"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + NEVI 1 (اختياري)", nl:"MBO-4 + NEVI 1 (optioneel)"},
          next:{ar:["HBO CE / Logistiek","Senior inkoper"], nl:["HBO CE / Logistiek","Senior inkoper"]} })
    ],
    horeca: [
      p({ id:"banketbakker", name:{ar:"خبّاز حلويات", nl:"Banketbakker / Patissier"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["المعجّنات","الشوكولا","الكريمات","تصميم الكيك","HACCP","إدارة المخبز"],
                    nl:["Patisserie","Chocolade","Room-techniek","Taartdecoratie","HACCP","Bakkerijmanagement"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + HACCP", nl:"MBO + HACCP"},
          next:{ar:["ZZP-bakker","MBO-4 Manager Horeca"], nl:["ZZP-bakker","MBO-4 Manager Horeca"]} }),
      p({ id:"barista", name:{ar:"باريستا", nl:"Barista / Koffiespecialist"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["أنواع القهوة","آلات الإسبريسو","Latte Art","استشارة العملاء","النظافة","إدارة الكاونتر"],
                    nl:["Koffiesoorten","Espressomachines","Latte Art","Klantadvies","Hygiëne","Toogbeheer"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO-2/3 + SCA Barista (اختياري)", nl:"MBO-2/3 + SCA Barista (optioneel)"},
          next:{ar:["مدير مقهى","ZZP"], nl:["Cafémanager","ZZP"]} })
    ],
    mobiliteit: [
      p({ id:"bedrijfsautomonteur", name:{ar:"ميكانيكي شاحنات", nl:"Bedrijfsautotechnicus"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["محركات ديزل كبيرة","أنظمة الفرامل (EBS)","الهيدروليك","تشخيص الشاحنات","APK","EV/هجين"],
                    nl:["Grote dieselmotoren","EBS","Hydrauliek","Diagnose trucks","APK","EV/hybride"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + APK + VCA + HV (EV)", nl:"MBO + APK + VCA + HV (EV)"},
          next:{ar:["HBO Automotive","Eigen werkplaats"], nl:["HBO Automotive","Eigen werkplaats"]} }),
      p({ id:"fietsenmaker", name:{ar:"ميكانيكي دراجات", nl:"Fietstechnicus / E-bike specialist"}, levels:[2,3],
          duration:{ar:"2 سنة", nl:"2 jaar"},
          subjects:{ar:["الدراجات التقليدية والكهربائية","التشخيص","البيع والاستشارة","الإلكترونيات","التخزين","السلامة"],
                    nl:["Fietsen & E-bikes","Diagnose","Verkoop & advies","Elektronica","Voorraad","Veiligheid"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO-2/3", nl:"MBO-2/3"},
          next:{ar:["ZZP","MBO-4 Technisch specialist"], nl:["ZZP","MBO-4 Technisch specialist"]} })
    ],
    onderwijs: [
      p({ id:"kinderopvang-leid", name:{ar:"قائد رعاية أطفال", nl:"Gespecialiseerd pedagogisch medewerker"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["علم النفس الطفولي المتقدم","الحاجات الخاصة","القيادة","تخطيط البرامج","التربية الإيجابية","VOG"],
                    nl:["Ontwikkelingspsychologie","Speciale behoeften","Teamleiderschap","Programmaontwikkeling","Positieve pedagogiek","VOG"]},
          entry:{ar:"MBO-3 Pedagogisch", nl:"MBO-3 Pedagogisch"},
          cert:{ar:"MBO-4 + VOG + EHBO kind", nl:"MBO-4 + VOG + Kinder-EHBO"},
          next:{ar:["HBO Pedagogiek","PABO"], nl:["HBO Pedagogiek","PABO"]} })
    ],
    sport: [
      p({ id:"zweminstructeur", name:{ar:"مدرّب سباحة", nl:"Zwembadmedewerker / Zweminstructeur"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["تقنيات السباحة","الإنقاذ (Reddend Zwemmen)","تعليم الأطفال","نظافة المسابح","الإسعافات","VOG"],
                    nl:["Zwemtechniek","Reddend Zwemmen","Jeugdles","Zwembadhygiëne","EHBO","VOG"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO-3/4 + ENVOZ + VOG", nl:"MBO-3/4 + ENVOZ + VOG"},
          next:{ar:["HBO ALO","Sportcoördinator"], nl:["HBO ALO","Sportcoördinator"]} })
    ],
    uiterlijk: [
      p({ id:"barbier", name:{ar:"حلاّق رجال (باربر)", nl:"Barbier / Herenkapper"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["قصّ الرجال","اللحية","الموسى الكلاسيكية","Fade تقنيات","النظافة","خدمة العملاء"],
                    nl:["Herenknippen","Baardverzorging","Klassiek scheren","Fade-technieken","Hygiëne","Klantenservice"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + AKI", nl:"MBO + AKI"},
          next:{ar:["ZZP-barbier","eigen salon"], nl:["ZZP-barbier","Eigen salon"]} }),
      p({ id:"nagelstyliste", name:{ar:"أخصائية عناية بالأظافر", nl:"Nagelstyliste"}, levels:[3],
          duration:{ar:"2 سنة", nl:"2 jaar"},
          subjects:{ar:["تقنيات الأظافر","الجل والأكريليك","Nail art","تعقيم وسلامة","علم البشرة","استشارة العملاء"],
                    nl:["Naageltechniek","Gel & acryl","Nail art","Hygiëne","Huidkunde","Klantadvies"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3 + ANBOS-lid (اختياري)", nl:"MBO-3 + ANBOS-lid (optioneel)"},
          next:{ar:["ZZP salon","MBO-4 Salonmanager"], nl:["ZZP salon","MBO-4 Salonmanager"]} })
    ],
    voedsel: [
      p({ id:"bakker", name:{ar:"خبّاز", nl:"Brood- en banketbakker"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["تقنيات العجن","أنواع الخبز","الصباحات","HACCP","إدارة المخبز","المشتريات"],
                    nl:["Deegtechniek","Broodsoorten","Viennoiserie","HACCP","Bakkerijmanagement","Inkoop"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + HACCP", nl:"MBO + HACCP"},
          next:{ar:["ZZP-bakker","MBO-4 Ondernemer"], nl:["ZZP-bakker","MBO-4 Ondernemer"]} }),
      p({ id:"slager", name:{ar:"جزّار", nl:"Slager / Vleesspecialist"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["تقطيع اللحوم","الحلال والصحة","تحضير النقانق","HACCP","خدمة العملاء","البرد والتخزين"],
                    nl:["Uitbenen","Vleeshygiëne","Worstbereiding","HACCP","Klantenservice","Koeling & opslag"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + HACCP", nl:"MBO + HACCP"},
          next:{ar:["ZZP","MBO-4 Ondernemer"], nl:["ZZP","MBO-4 Ondernemer"]} })
    ],
    luchtvaart: [
      p({ id:"cabincrew", name:{ar:"مضيف/مضيفة طيران", nl:"Cabin Crew / Stewardess"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["السلامة في الطيران","الإسعافات","لغة ICAO-إنجليزية","خدمة الركاب","إدارة الأزمات","VOG"],
                    nl:["Luchtvaartveiligheid","EHBO","ICAO-Engels","Passagiersservice","Crisismanagement","VOG"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + Cabin Crew Attestation (EASA) + VOG", nl:"MBO-4 + Cabin Crew Attestation (EASA) + VOG"},
          next:{ar:["HBO Aviation","Purser"], nl:["HBO Aviation","Purser"]} })
    ],
    veiligheid: [
      p({ id:"brandwacht", name:{ar:"حارس مكافحة الحرائق", nl:"Brandwacht / BHV-specialist"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["مكافحة الحرائق","الأجهزة التنفسية","إخلاء المباني","الإسعافات","التواصل","VCA"],
                    nl:["Brandbestrijding","Adembescherming","Evacuatie","EHBO","Communicatie","VCA"]},
          entry:{ar:"VMBO-BB + VOG + 18 سنة", nl:"VMBO-BB + VOG + 18 jaar"},
          cert:{ar:"MBO-2/3 + VCA + VOG", nl:"MBO-2/3 + VCA + VOG"},
          next:{ar:["Brandweer","MBO-3 Beveiliger"], nl:["Brandweer","MBO-3 Beveiliger"]} })
    ],
    toerisme: [
      p({ id:"evenementen", name:{ar:"منظّم فعاليات", nl:"Evenementenorganisator"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["إدارة المشاريع","الميزانية","السلامة في الفعاليات","اللوجستيات","التسويق","التواصل"],
                    nl:["Projectmanagement","Budgetteren","Evenementveiligheid","Logistiek","Marketing","Communicatie"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["HBO Leisure & Events","ZZP"], nl:["HBO Leisure & Events","ZZP"]} })
    ]
  };

  for (const [sectorId, pros] of Object.entries(ADD)) {
    const s = MBO_SECTOR_BY_ID[sectorId];
    if (s && Array.isArray(pros)) s.professions.push(...pros);
  }

  // Two new sectors
  const NEW_SECTORS = [
    {
      id:"procestechniek", icon:"🧪", name:{ar:"العمليات الصناعية والكيمياء", nl:"Procestechniek & Chemie"},
      professions:[
        p({ id:"procesoperator", name:{ar:"مُشغّل عمليات صناعية", nl:"Procesoperator A/B/C"}, levels:[2,3,4],
            duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
            subjects:{ar:["العمليات الكيميائية","المضخات والصمامات","DCS / SCADA","سلامة الغاز","VCA-VOL","الجودة"],
                      nl:["Chemische processen","Pompen & appendages","DCS / SCADA","Gasveiligheid","VCA-VOL","Kwaliteit"]},
            entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
            cert:{ar:"MBO + VCA-VOL", nl:"MBO + VCA-VOL"},
            next:{ar:["HBO Chemische Technologie","Supervisor"], nl:["HBO Chemische Technologie","Supervisor"]} }),
        p({ id:"labanalist", name:{ar:"فنّي مختبر كيميائي/حيوي", nl:"Laboratoriumanalist (MLO/BML)"}, levels:[4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["تحليل كيميائي","الميكروبيولوجيا","HPLC و GC","PCR","ضبط الجودة","السلامة"],
                      nl:["Chemische analyse","Microbiologie","HPLC & GC","PCR","Kwaliteitsborging","Veiligheid"]},
            entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
            cert:{ar:"MBO-4 MLO/BML", nl:"MBO-4 MLO/BML"},
            next:{ar:["HBO Biologie/Chemie","Onderzoeker junior"], nl:["HBO Biologie/Chemie","Junior onderzoeker"]} }),
        p({ id:"allround-operator", name:{ar:"مشغّل آلات إنتاج", nl:"Allround Operator Productie"}, levels:[2,3],
            duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
            subjects:{ar:["خطوط الإنتاج","TPM","صيانة أولية","جودة ISO","السلامة","Lean"],
                      nl:["Productielijnen","TPM","Eerstelijns onderhoud","ISO-kwaliteit","Veiligheid","Lean"]},
            entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
            cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
            next:{ar:["MBO-4 Technicus","Operator A"], nl:["MBO-4 Technicus","Operator A"]} })
      ]
    },
    {
      id:"energie", icon:"⚡", name:{ar:"الطاقة والاستدامة", nl:"Energie & Duurzaamheid"},
      professions:[
        p({ id:"zonnepanelen", name:{ar:"فنّي ألواح شمسية", nl:"Zonnepanelen-monteur (PV-installateur)"}, levels:[2,3],
            duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
            subjects:{ar:["تقنية PV","الكهرباء NEN 1010","التركيب على الأسطح","التيار المستمر (DC)","السلامة على المرتفعات","VCA"],
                      nl:["PV-techniek","Elektra NEN 1010","Dakmontage","Gelijkstroom (DC)","Hoogtewerk-veiligheid","VCA"]},
            entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
            cert:{ar:"MBO + NEN 3140 + VCA", nl:"MBO + NEN 3140 + VCA"},
            next:{ar:["HBO Elektrotechniek","ZZP-installateur"], nl:["HBO Elektrotechniek","ZZP-installateur"]} }),
        p({ id:"warmtepomp", name:{ar:"فنّي مضخات حرارية", nl:"Warmtepomp-installateur"}, levels:[3,4],
            duration:{ar:"3 سنوات", nl:"3 jaar"},
            subjects:{ar:["الديناميكا الحرارية","CO2 و R32","التكييف والتدفئة","Sanitair","تقنية العزل","F-gassen"],
                      nl:["Thermodynamica","CO2 & R32","Klimaat & verwarming","Sanitair","Isolatietechniek","F-gassen"]},
            entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
            cert:{ar:"MBO + F-gassen + VCA", nl:"MBO + F-gassen + VCA"},
            next:{ar:["HBO Installatietechniek","Eigen bedrijf"], nl:["HBO Installatietechniek","Eigen bedrijf"]} }),
        p({ id:"windtechnicus", name:{ar:"فنّي توربينات الرياح", nl:"Windturbine-technicus (on/offshore)"}, levels:[4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["الإلكترونيات الكهربائية","الهيدروليك","السلامة على المرتفعات","الغوص/السفن (offshore)","GWO Basic","الصيانة الوقائية"],
                      nl:["Elektrotechniek","Hydrauliek","Hoogtewerk","Offshore veiligheid","GWO Basic","Preventief onderhoud"]},
            entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
            cert:{ar:"MBO-4 + GWO Basic Safety", nl:"MBO-4 + GWO Basic Safety"},
            next:{ar:["HBO Energy","Lead technicus"], nl:["HBO Energy","Lead technicus"]} })
      ]
    }
  ];
  for (const ns of NEW_SECTORS) {
    MBO_SECTORS.push(ns);
    MBO_SECTOR_BY_ID[ns.id] = ns;
  }
})();

/* ═══════════════════════════════════════════════════════════
   EXPANSION PACK V3 — comprehensive MBO professions reference
   Adds ~90 more professions across 18 sectors (+2 new sectors)
═══════════════════════════════════════════════════════════ */
(function expandProfessionsV3(){
  const p = (o) => o;

  const ADD2 = {
    techniek: [
      p({ id:"cnc-operator", name:{ar:"مشغّل CNC", nl:"CNC-verspaner"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["برمجة G-code","HAAS / Fanuc","قراءة الرسومات","قياسات دقيقة","Fraisen/Draaien","VCA"],
                    nl:["G-code programmeren","HAAS / Fanuc","Tekeninglezen","Precisiemeten","Frezen/Draaien","VCA"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3/4 + VCA", nl:"MBO-3/4 + VCA"},
          next:{ar:["HBO Werktuigbouwkunde","CAM-programmeur"], nl:["HBO Werktuigbouwkunde","CAM-programmeur"]} }),
      p({ id:"mechatronica", name:{ar:"فنّي ميكاترونيكس", nl:"Mechatronica-technicus"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Elektronica","PLC-برمجة","Pneumatiek/Hydrauliek","Robotica","قياس المجسّات","Lean Maintenance"],
                    nl:["Elektronica","PLC-programmeren","Pneumatiek/Hydrauliek","Robotica","Sensorik","Lean Maintenance"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4 + NEN 3140", nl:"MBO-4 + NEN 3140"},
          next:{ar:["HBO Elektro/Mechatronica","Service Engineer"], nl:["HBO Elektro/Mechatronica","Service Engineer"]} }),
      p({ id:"robotica-tech", name:{ar:"فنّي أنظمة روبوتية", nl:"Robotica-technicus / ROV"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["روبوتات صناعية ABB/KUKA","أنظمة الرؤية","Python/ROS","الأمان الوظيفي","Cobots","تكامل الأنظمة"],
                    nl:["Industriële robots ABB/KUKA","Vision systems","Python/ROS","Functionele veiligheid","Cobots","Systeemintegratie"]},
          entry:{ar:"VMBO-TL أو MBO-3 تقني", nl:"VMBO-TL of MBO-3 technisch"},
          cert:{ar:"MBO-4 Mechatronica", nl:"MBO-4 Mechatronica"},
          next:{ar:["HBO Robotica/Automotive","Robot-integrator"], nl:["HBO Robotica/Automotive","Robot-integrator"]} }),
      p({ id:"onderhoudsmonteur", name:{ar:"فنّي صيانة صناعية", nl:"Onderhoudsmonteur Installatietechniek"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["الصيانة الوقائية","تشخيص الأعطال","مضخات ومحركات","RCM","LOTO السلامة","إدارة قطع الغيار"],
                    nl:["Preventief onderhoud","Storingzoeken","Pompen & motoren","RCM","LOTO-veiligheid","Voorraadbeheer"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + VCA + NEN 3140", nl:"MBO + VCA + NEN 3140"},
          next:{ar:["MBO-4 Werkvoorbereider","Teamleider onderhoud"], nl:["MBO-4 Werkvoorbereider","Teamleider onderhoud"]} }),
      p({ id:"industrieel-ontwerp", name:{ar:"راسم ومُنفّذ تصميم صناعي", nl:"Industrieel Product Ontwerpen (IPO)"}, levels:[4],
          duration:{ar:"4 سنوات", nl:"4 jaar"},
          subjects:{ar:["SolidWorks/Fusion 360","طباعة ثلاثية الأبعاد","نماذج أولية","Mechanica","Design Thinking","مواد ومعالجات"],
                    nl:["SolidWorks/Fusion 360","3D-printen","Prototyping","Mechanica","Design Thinking","Materiaalkunde"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 IPO", nl:"MBO-4 IPO"},
          next:{ar:["HBO Industrieel Ontwerp","Eigen studio"], nl:["HBO Industrieel Ontwerp","Eigen studio"]} })
    ],
    bouw: [
      p({ id:"metselaar", name:{ar:"بنّاء طوب", nl:"Metselaar"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["التجصيص","قراءة الرسومات","تقنيات الطوب","Isolatie","السلامة في المواقع","VCA"],
                    nl:["Voegwerk","Tekeninglezen","Metseltechnieken","Isolatie","Bouwplaatsveiligheid","VCA"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["Uitvoerder","ZZP-metselaar"], nl:["Uitvoerder","ZZP-metselaar"]} }),
      p({ id:"tegelzetter", name:{ar:"مُركّب بلاط", nl:"Tegelzetter"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["أنواع البلاط","تحضير الأسطح","العزل المائي","Voegen","الحساب والقياس","السلامة"],
                    nl:["Tegelsoorten","Voorbewerking","Waterdicht maken","Voegen","Inmeten","Veiligheid"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["ZZP","MBO-3 Uitvoerder"], nl:["ZZP","MBO-3 Uitvoerder"]} }),
      p({ id:"stukadoor", name:{ar:"قصّار/جصّاص", nl:"Stukadoor"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["القصّ والطلاء","الجص الطبيعي","التجصيص الزخرفي","Sierpleister","السلامة","إدارة الوقت"],
                    nl:["Stukadoren & pleisteren","Kalkstuc","Sierpleisterwerk","Spackspuiten","Veiligheid","Tijdsplanning"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["ZZP-stukadoor","Uitvoerder afbouw"], nl:["ZZP-stukadoor","Uitvoerder afbouw"]} }),
      p({ id:"dakdekker", name:{ar:"سقّاف", nl:"Dakdekker (plat/schuin)"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["أغشية EPDM/Bitumen","قرميد السقف","السلامة على المرتفعات","العزل","الزنك والنحاس","التسرب"],
                    nl:["EPDM/Bitumen","Pannendaken","Hoogtewerk-veiligheid","Isolatie","Zinkwerk","Lekdetectie"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA + Werken op hoogte", nl:"MBO + VCA + Werken op hoogte"},
          next:{ar:["Uitvoerder","ZZP"], nl:["Uitvoerder","ZZP"]} }),
      p({ id:"schilder", name:{ar:"نقّاش/دهّان", nl:"Schilder & Onderhoud"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["أنواع الطلاء","تحضير الأسطح","Kleurenleer","الطلاء الصناعي","الطلاء على الخشب","Resystore"],
                    nl:["Verfsoorten","Ondergrondbehandeling","Kleurenleer","Industrieel schilderen","Houtbescherming","Restauratie"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["Meesterschilder","ZZP"], nl:["Meesterschilder","ZZP"]} }),
      p({ id:"grondwerker", name:{ar:"عامل حفر وبنية تحتية", nl:"Grondwerker / Infrawerker"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["الحفر والدمك","أنابيب الصرف","GPS-machine","Kabels & leidingen","السلامة في الشارع","VCA"],
                    nl:["Grondverzet & verdichten","Rioolbuizen","GPS-machine","Kabels & leidingen","Wegenverkeer-veiligheid","VCA"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA + Rijbewijs B/C", nl:"MBO + VCA + Rijbewijs B/C"},
          next:{ar:["Machinist GWW","Uitvoerder"], nl:["Machinist GWW","Uitvoerder"]} }),
      p({ id:"kraanmachinist", name:{ar:"مُشغّل رافعة", nl:"Kraanmachinist / Hijsmachinist"}, levels:[3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["الرفع الآمن","Lastberekening","Signalering","GPS-machine","VCA","الصيانة الأساسية"],
                    nl:["Veilig hijsen","Lastberekening","Signalering","GPS-besturing","VCA","Basisonderhoud"]},
          entry:{ar:"VMBO-KB + 18 سنة", nl:"VMBO-KB + 18 jaar"},
          cert:{ar:"MBO + TCVT + VCA + Rijbewijs", nl:"MBO + TCVT + VCA + Rijbewijs"},
          next:{ar:["Machinist torenkraan","Coördinator hijsen"], nl:["Machinist torenkraan","Coördinator hijsen"]} }),
      p({ id:"uitvoerder-bouw", name:{ar:"منفّذ عمليات البناء", nl:"Uitvoerder Bouw & Infra"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["إدارة الموقع","قيادة الفرق","جدولة المشاريع","الجودة","السلامة VCA-VOL","التواصل مع الزبون"],
                    nl:["Bouwplaatsorganisatie","Leidinggeven","Planning","Kwaliteit","VCA-VOL","Klantcommunicatie"]},
          entry:{ar:"MBO-3 تقني", nl:"MBO-3 technisch"},
          cert:{ar:"MBO-4 + VCA-VOL", nl:"MBO-4 + VCA-VOL"},
          next:{ar:["HBO Bouwkunde","Projectleider"], nl:["HBO Bouwkunde","Projectleider"]} })
    ],
    ict: [
      p({ id:"fullstack-dev", name:{ar:"مطوّر Full-Stack", nl:"Fullstack Developer MBO"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["HTML/CSS/JS","React/Vue","Node.js","قواعد البيانات SQL","Git/GitHub","Agile/Scrum"],
                    nl:["HTML/CSS/JS","React/Vue","Node.js","SQL-databases","Git/GitHub","Agile/Scrum"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Software Developer", nl:"MBO-4 Software Developer"},
          next:{ar:["HBO Informatica","Junior Developer"], nl:["HBO Informatica","Junior Developer"]} }),
      p({ id:"data-analist", name:{ar:"محلّل بيانات", nl:"Data-analist MBO"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["SQL","Python Pandas","Power BI/Tableau","إحصاء تطبيقي","تنظيف البيانات","Storytelling"],
                    nl:["SQL","Python Pandas","Power BI/Tableau","Toegepaste statistiek","Data cleansing","Storytelling"]},
          entry:{ar:"HAVO أو VMBO-TL", nl:"HAVO of VMBO-TL"},
          cert:{ar:"MBO-4 Data Analist", nl:"MBO-4 Data-analist"},
          next:{ar:["HBO Data Science","Junior BI-consultant"], nl:["HBO Data Science","Junior BI-consultant"]} }),
      p({ id:"ict-beheer", name:{ar:"مسؤول أنظمة ICT", nl:"ICT-beheerder / Systeembeheerder"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Windows Server","Linux","Active Directory","PowerShell","ITIL","Ticket-systeem"],
                    nl:["Windows Server","Linux","Active Directory","PowerShell","ITIL","Ticketing"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4 + MS-fundamentals", nl:"MBO-4 + MS-fundamentals"},
          next:{ar:["HBO ICT","Cloud Administrator"], nl:["HBO ICT","Cloud Administrator"]} }),
      p({ id:"cybersec-analist", name:{ar:"محلّل أمن سيبراني", nl:"Cybersecurity-analist (junior SOC)"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Netwerken","Linux/Windows","SIEM","Ethical Hacking","ISO 27001","حوادث أمنية"],
                    nl:["Netwerken","Linux/Windows","SIEM","Ethical Hacking","ISO 27001","Incident response"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Cyber + CompTIA Security+ (اختياري)", nl:"MBO-4 Cyber + CompTIA Security+ (optioneel)"},
          next:{ar:["HBO Cybersecurity","SOC-analist"], nl:["HBO Cybersecurity","SOC-analist"]} }),
      p({ id:"cloud-admin", name:{ar:"مسؤول سحابة", nl:"Cloud Administrator (Azure/AWS)"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Azure/AWS basis","Networking","IaC (Terraform)","Monitoring","السلامة","CI/CD"],
                    nl:["Azure/AWS basis","Networking","IaC (Terraform)","Monitoring","Security","CI/CD"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + AZ-104 / AWS SysOps (اختياري)", nl:"MBO-4 + AZ-104 / AWS SysOps (optioneel)"},
          next:{ar:["HBO Cloud","DevOps Engineer"], nl:["HBO Cloud","DevOps Engineer"]} }),
      p({ id:"game-dev", name:{ar:"مطوّر ألعاب", nl:"Gameontwikkelaar (GameDev)"}, levels:[4],
          duration:{ar:"4 سنوات", nl:"4 jaar"},
          subjects:{ar:["Unity/Unreal","C#/C++","Gamedesign","Animation","تجربة اللاعب","النشر"],
                    nl:["Unity/Unreal","C#/C++","Gamedesign","Animation","Player UX","Publishing"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Gamedeveloper", nl:"MBO-4 Gamedeveloper"},
          next:{ar:["HBO Game Design","Indie-studio"], nl:["HBO Game Design","Indie-studio"]} }),
      p({ id:"ux-ui-mbo", name:{ar:"مصمّم UX/UI", nl:"UX/UI-ontwerper (MBO)"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Figma","Design System","User Research","Prototyping","Accessibility (WCAG)","Motion"],
                    nl:["Figma","Design System","User Research","Prototyping","Toegankelijkheid (WCAG)","Motion"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Media Design / UX", nl:"MBO-4 Media Design / UX"},
          next:{ar:["HBO CMD/IDE","Junior Designer"], nl:["HBO CMD/IDE","Junior Designer"]} })
    ],
    media: [
      p({ id:"grafisch-vormgever", name:{ar:"مصمّم جرافيك", nl:"Grafisch Vormgever"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Adobe Illustrator/InDesign/Photoshop","Typografie","Branding","Print vs Digitaal","Design history","إدارة عملاء"],
                    nl:["Adobe Illustrator/InDesign/Photoshop","Typografie","Branding","Print vs Digitaal","Designgeschiedenis","Klantbeheer"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["HBO CMD","ZZP-designer"], nl:["HBO CMD","ZZP-designer"]} }),
      p({ id:"video-editor", name:{ar:"مونتير فيديو", nl:"Video-editor / Motion designer"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Premiere / DaVinci","After Effects","Kleur-grading","Audio-mixing","Storytelling","Delivery codecs"],
                    nl:["Premiere / DaVinci","After Effects","Colour grading","Audio-mixing","Storytelling","Delivery codecs"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Mediavormgever AV", nl:"MBO-4 Mediavormgever AV"},
          next:{ar:["HBO Film","Freelance editor"], nl:["HBO Film","Freelance editor"]} }),
      p({ id:"fotograaf", name:{ar:"مصوّر فوتوغرافي", nl:"Fotograaf"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["التكوين والإضاءة","Studio-lighting","Lightroom","التصوير الصحفي","التصوير التجاري","محفظة أعمال"],
                    nl:["Compositie & licht","Studio-lighting","Lightroom","Fotojournalistiek","Commercieel werk","Portfolio"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4", nl:"MBO-4"},
          next:{ar:["Eigen studio","Freelance"], nl:["Eigen studio","Freelance"]} }),
      p({ id:"geluidstechnicus", name:{ar:"فنّي صوت", nl:"Geluidstechnicus / Podiumtechniek"}, levels:[3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Mixing","Live sound","Microfoontechniek","Akoestiek","DAW","السلامة على المسرح"],
                    nl:["Mixing","Live sound","Microfoontechniek","Akoestiek","DAW","Podiumveiligheid"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO + VCA + Rigging", nl:"MBO + VCA + Rigging"},
          next:{ar:["HBO Audio","FOH-engineer"], nl:["HBO Audio","FOH-engineer"]} }),
      p({ id:"animator", name:{ar:"رسّام متحرّك", nl:"Animator 2D / 3D"}, levels:[4],
          duration:{ar:"4 سنوات", nl:"4 jaar"},
          subjects:{ar:["Blender/Maya","Character rigging","Storyboarding","Lipsync","Rendering","محفظة"],
                    nl:["Blender/Maya","Character rigging","Storyboarding","Lipsync","Rendering","Portfolio"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Animator", nl:"MBO-4 Animator"},
          next:{ar:["HBO Animation","Studio-artiest"], nl:["HBO Animation","Studio-artiest"]} })
    ],
    zorg: [
      p({ id:"verzorgende-ig", name:{ar:"ممرض رعاية فردية (VZ-IG)", nl:"Verzorgende-IG"}, levels:[3],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["الرعاية الأساسية","الأدوية","الاتصال","علم الأعراض","Ethiek","VOG"],
                    nl:["Basiszorg","Medicatie","Communicatie","Symptomenleer","Ethiek","VOG"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO-3 + BIG-register (bekwaamheid) + VOG", nl:"MBO-3 + bekwaamheid BIG + VOG"},
          next:{ar:["MBO-4 Verpleegkundige","HBO-V"], nl:["MBO-4 Verpleegkundige","HBO-V"]} }),
      p({ id:"doktersassistent", name:{ar:"مساعد طبيب عام", nl:"Doktersassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["فرز شكاوى المريض","EHBO","تخطيط القلب","سحب الدم","Praktijk-software","VOG"],
                    nl:["Triage","EHBO","ECG","Bloedprikken","Praktijksoftware","VOG"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Doktersassistent + VOG", nl:"MBO-4 Doktersassistent + VOG"},
          next:{ar:["HBO-V","Praktijkmanager"], nl:["HBO-V","Praktijkmanager"]} }),
      p({ id:"tandartsassistent", name:{ar:"مساعد طبيب أسنان", nl:"Tandartsassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["تعقيم الأدوات","الأشعة السنية","مساعدة رباعية اليدين","الوقاية","Administratie","VOG"],
                    nl:["Sterilisatie","Röntgen","4-handen assisteren","Preventie","Administratie","VOG"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Tandartsassistent", nl:"MBO-4 Tandartsassistent"},
          next:{ar:["HBO Mondzorgkunde","Preventieassistent"], nl:["HBO Mondzorgkunde","Preventieassistent"]} }),
      p({ id:"apothekersassistent", name:{ar:"مساعد صيدلي", nl:"Apothekersassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["علم الأدوية","FNA","Recepten","التفاعلات","Voorlichting","VOG"],
                    nl:["Farmacologie","FNA","Recepten","Interacties","Voorlichting","VOG"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Apothekersassistent", nl:"MBO-4 Apothekersassistent"},
          next:{ar:["HBO Farmakunde","Apotheker-in-opleiding"], nl:["HBO Farmakunde","Apotheker i.o."]} }),
      p({ id:"operatie-assistent", name:{ar:"مساعد غرفة عمليات", nl:"Operatieassistent (in-service vaak)"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["التشريح","الأدوات الجراحية","التعقيم","تقنيات التخدير","السلامة","VOG"],
                    nl:["Anatomie","Chirurgische instrumenten","Sterilisatie","Anesthesietechnieken","Veiligheid","VOG"]},
          entry:{ar:"MBO-4 Verpleegkundige أو HAVO", nl:"MBO-4 Verpleegkundige of HAVO"},
          cert:{ar:"Operatieassistent (in-service) + VOG", nl:"Operatieassistent (in-service) + VOG"},
          next:{ar:["HBO-V","OK-leidinggevende"], nl:["HBO-V","OK-leidinggevende"]} }),
      p({ id:"maatschappelijke-zorg", name:{ar:"مقدم رعاية اجتماعية", nl:"Medewerker Maatschappelijke Zorg (MMZ)"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["الدعم الاجتماعي","الإعاقات","الإدمان","القانون الاجتماعي","الاتصال","VOG"],
                    nl:["Begeleiding","Verstandelijke beperking","Verslavingszorg","Sociale wetgeving","Communicatie","VOG"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3/4 MMZ + VOG", nl:"MBO-3/4 MMZ + VOG"},
          next:{ar:["HBO Social Work","Persoonlijk begeleider"], nl:["HBO Social Work","Persoonlijk begeleider"]} }),
      p({ id:"sociaal-werk", name:{ar:"عامل اجتماعي", nl:"Sociaal Werk (MBO-4)"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["جماعات الأحياء","Coaching","Wet- en regelgeving","مهارات التواصل","الشباب المعرّضون للخطر","VOG"],
                    nl:["Buurtwerk","Coaching","Wet- & regelgeving","Gespreksvaardigheden","Risicojongeren","VOG"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Sociaal Werk + VOG", nl:"MBO-4 Sociaal Werk + VOG"},
          next:{ar:["HBO Social Work","Jongerenwerker"], nl:["HBO Social Work","Jongerenwerker"]} })
    ],
    economie: [
      p({ id:"fin-admin", name:{ar:"مُساعد مالي إداري", nl:"Financieel-administratief medewerker"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Debiteuren/Crediteuren","BTW","Excel","ERP (Exact/AFAS)","Rapportage","Belastingen"],
                    nl:["Debiteuren/Crediteuren","BTW","Excel","ERP (Exact/AFAS)","Rapportage","Belastingen"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Financieel", nl:"MBO-4 Financieel"},
          next:{ar:["HBO Accountancy","Boekhouder"], nl:["HBO Accountancy","Boekhouder"]} }),
      p({ id:"management-assist", name:{ar:"مساعد إداري تنفيذي", nl:"Management Assistant / Directie-assistent"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Office 365","جدولة الاجتماعات","الإنجليزية التجارية","Minute-taking","إدارة الوقت","الاتصال الرسمي"],
                    nl:["Office 365","Agendabeheer","Zakelijk Engels","Notuleren","Timemanagement","Zakelijke correspondentie"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 SMA", nl:"MBO-4 SMA"},
          next:{ar:["HBO HRM","Executive Assistant"], nl:["HBO HRM","Executive Assistant"]} }),
      p({ id:"hr-medewerker", name:{ar:"مساعد موارد بشرية", nl:"HR-medewerker"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Recruitment","Verzuim","Payroll","CAO","Arbeidsrecht","HR-systemen"],
                    nl:["Recruitment","Verzuim","Payroll","CAO","Arbeidsrecht","HR-systemen"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 HRM-assistent", nl:"MBO-4 HR-medewerker"},
          next:{ar:["HBO HRM","HR-adviseur"], nl:["HBO HRM","HR-adviseur"]} }),
      p({ id:"juridisch-mbo", name:{ar:"مساعد قانوني", nl:"Juridisch medewerker (MBO-4)"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["القانون المدني","القانون الجنائي","البحث القانوني","Dossieren","GDPR","Rapportage"],
                    nl:["Burgerlijk recht","Strafrecht","Juridisch onderzoek","Dossiers","AVG/GDPR","Rapportage"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Juridisch medewerker", nl:"MBO-4 Juridisch medewerker"},
          next:{ar:["HBO Recht","Paralegal"], nl:["HBO Recht","Paralegal"]} }),
      p({ id:"bank-verz", name:{ar:"موظف بنك أو تأمين", nl:"Bank- en verzekeringsmedewerker"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Hypotheken","WFT","Beleggen basis","Klantadvies","KYC/AML","Fraude-detectie"],
                    nl:["Hypotheken","WFT","Beleggingsbasis","Klantadvies","KYC/AML","Fraudedetectie"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + WFT Basis", nl:"MBO-4 + WFT Basis"},
          next:{ar:["HBO Financieel","Adviseur"], nl:["HBO Financieel","Adviseur"]} })
    ],
    handel: [
      p({ id:"winkelmanager", name:{ar:"مدير متجر", nl:"Winkelmanager / Filiaalmanager"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["إدارة الفريق","خطط الموظفين","KPI / Omzetstures","Merchandising","الشكاوى","التوظيف"],
                    nl:["Teamleiderschap","Personeelsplanning","KPI / Omzetsturing","Merchandising","Klachten","Werving"]},
          entry:{ar:"MBO-3 Retail", nl:"MBO-3 Retail"},
          cert:{ar:"MBO-4 Retailmanager", nl:"MBO-4 Retailmanager"},
          next:{ar:["HBO Commerciële Economie","Districtmanager"], nl:["HBO Commerciële Economie","Districtmanager"]} }),
      p({ id:"visual-merch", name:{ar:"مصمّم واجهات عرض", nl:"Visual Merchandiser"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["تصميم الواجهات","الإضاءة","الألوان","Styling","Trendwatch","Campagneplanning"],
                    nl:["Etalagedesign","Verlichting","Kleurgebruik","Styling","Trendwatching","Campagneplanning"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3/4 Visual Merchandiser", nl:"MBO-3/4 Visual Merchandiser"},
          next:{ar:["HBO Fashion & Design","ZZP-stylist"], nl:["HBO Fashion & Design","ZZP-stylist"]} }),
      p({ id:"ecommerce-med", name:{ar:"أخصائي تجارة إلكترونية", nl:"E-commerce medewerker"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Shopify/Magento","SEO/SEA","Google Analytics","Content marketing","Social ads","UX e-shop"],
                    nl:["Shopify/Magento","SEO/SEA","Google Analytics","Content marketing","Social ads","UX e-shop"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 E-commerce", nl:"MBO-4 E-commerce"},
          next:{ar:["HBO Commerciële Economie","Growth marketer"], nl:["HBO Commerciële Economie","Growth marketer"]} }),
      p({ id:"inkoop-med", name:{ar:"موظف مشتريات", nl:"Inkoopmedewerker / Junior inkoper"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["التفاوض","عقود","Leveranciersmanagement","Supply Chain","ERP","Incoterms"],
                    nl:["Onderhandelen","Contracten","Leveranciersmanagement","Supply Chain","ERP","Incoterms"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Junior Inkoper", nl:"MBO-4 Junior Inkoper"},
          next:{ar:["HBO Inkoopmanagement","Senior buyer"], nl:["HBO Inkoopmanagement","Senior buyer"]} }),
      p({ id:"accountmanager-jr", name:{ar:"مدير حسابات مبتدئ", nl:"Junior accountmanager / Vertegenwoordiger"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["B2B sales","CRM (Salesforce/HubSpot)","Pitchen","Funnel-management","Onderhandelen","KPI's"],
                    nl:["B2B sales","CRM (Salesforce/HubSpot)","Pitchen","Funnelbeheer","Onderhandelen","KPI's"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Commercieel", nl:"MBO-4 Commercieel"},
          next:{ar:["HBO CE","Key Account Manager"], nl:["HBO CE","Key Account Manager"]} })
    ],
    horeca: [
      p({ id:"gastheer", name:{ar:"مضيف/نادل", nl:"Gastheer / Gastvrouw"}, levels:[2,3],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["الخدمة الفرنسية","Wijnkennis","HACCP","POS","Tafelzetten","الضيافة"],
                    nl:["Franse bediening","Wijnkennis","HACCP","POS","Tafelzetten","Gastvrijheid"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + HACCP", nl:"MBO + HACCP"},
          next:{ar:["MBO-4 Manager Horeca","Sommelier"], nl:["MBO-4 Manager Horeca","Sommelier"]} }),
      p({ id:"barista", name:{ar:"باريستا", nl:"Barista"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["استخراج القهوة","الحليب والـ Latte Art","الأنواع والأصول","تنظيف الآلات","خدمة العملاء","HACCP"],
                    nl:["Koffie-extractie","Melk & Latte Art","Herkomst & soorten","Machine-onderhoud","Klantenservice","HACCP"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + SCA Barista (اختياري)", nl:"MBO + SCA Barista (optioneel)"},
          next:{ar:["Eigen koffiezaak","Hoofd barista"], nl:["Eigen koffiezaak","Hoofd barista"]} }),
      p({ id:"hotel-receptie", name:{ar:"موظف استقبال فندق", nl:"Hotel Receptionist / Front Office"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["PMS (Opera)","اللغات (EN/DE/FR)","إدارة الحجوزات","الشكاوى","Upselling","Check-in/out"],
                    nl:["PMS (Opera)","Talen (EN/DE/FR)","Reserveringen","Klachten","Upselling","Check-in/out"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3/4 Hospitality", nl:"MBO-3/4 Hospitality"},
          next:{ar:["HBO Hospitality","Duty manager"], nl:["HBO Hospitality","Duty manager"]} }),
      p({ id:"allround-kok", name:{ar:"طبّاخ محترف", nl:"Zelfstandig werkend kok"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["تقنيات الطبخ","Menu-engineering","Foodcost","HACCP","إدارة المطبخ","النكهات الدولية"],
                    nl:["Kooktechnieken","Menu-engineering","Foodcost","HACCP","Keukenleiding","Internationale keukens"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO-3/4 Kok + HACCP", nl:"MBO-3/4 Kok + HACCP"},
          next:{ar:["Sous-chef","Eigen restaurant"], nl:["Sous-chef","Eigen restaurant"]} })
    ],
    mobiliteit: [
      p({ id:"autotechnicus", name:{ar:"فنّي سيارات", nl:"Autotechnicus / Allround monteur"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["محركات بنزين/ديزل","السيارات الكهربائية (HV)","تشخيص OBD","الفرامل والتعليق","Airco","APK-keuring"],
                    nl:["Benzine/Diesel","Elektrisch aangedreven (HV)","OBD-diagnose","Rem & vering","Airco","APK-keuring"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + HV-certificaat + APK-keurmeester", nl:"MBO + HV-certificaat + APK-keurmeester"},
          next:{ar:["Technisch specialist","Eigen garage"], nl:["Technisch specialist","Eigen garage"]} }),
      p({ id:"bedrijfsauto", name:{ar:"فنّي شاحنات", nl:"Bedrijfsautotechnicus (truck & bus)"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["محركات ثقيلة","ADR","Hydrauliek","Luchtrem","Telematica","VCA"],
                    nl:["Zware motoren","ADR","Hydrauliek","Luchtremmen","Telematica","VCA"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["Servicemanager","Techniek specialist"], nl:["Servicemanager","Techniek specialist"]} }),
      p({ id:"schadehersteller", name:{ar:"فنّي إصلاح الصدمات", nl:"Autoschadehersteller"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Plaatwerken","Uitdeuken","Lassen auto","Richtbank","ADAS","Spuitwerk"],
                    nl:["Plaatwerken","Uitdeuken","Autolassen","Richtbank","ADAS","Spuitwerk"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + FOCWA", nl:"MBO + FOCWA"},
          next:{ar:["Spuiter","ZZP"], nl:["Spuiter","ZZP"]} }),
      p({ id:"chauffeur-goederen", name:{ar:"سائق شحن", nl:"Chauffeur Goederenvervoer (C/CE)"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["رخصة C/CE","Code 95","ADR","Tachograaf","Digitale rittenadmin","السلامة على الطرق"],
                    nl:["Rijbewijs C/CE","Code 95","ADR","Tachograaf","Digitale rittenadmin","Verkeersveiligheid"]},
          entry:{ar:"18 سنة + VMBO-BB", nl:"18 jaar + VMBO-BB"},
          cert:{ar:"MBO + Rijbewijs C/CE + Code 95", nl:"MBO + Rijbewijs C/CE + Code 95"},
          next:{ar:["Internationaal chauffeur","Planner"], nl:["Internationaal chauffeur","Planner"]} }),
      p({ id:"logistiek-med", name:{ar:"موظف لوجستي/مخزن", nl:"Logistiek medewerker / Magazijnmeester"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["WMS (SAP/Exact)","Heftruckrijbewijs","Voorraadbeheer","Order picking","Supply Chain","VCA"],
                    nl:["WMS (SAP/Exact)","Heftruckrijbewijs","Voorraadbeheer","Orderpicken","Supply Chain","VCA"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + Heftruckcertificaat + VCA", nl:"MBO + Heftruckcertificaat + VCA"},
          next:{ar:["Logistiek supervisor","HBO Logistiek"], nl:["Logistiek supervisor","HBO Logistiek"]} }),
      p({ id:"binnenvaart-matroos", name:{ar:"بحّار داخلي", nl:"Binnenvaart Matroos / Stuurman"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["الملاحة الداخلية","ADN","AIS","حمولة السفن","السلامة على الماء","Dienstboekje"],
                    nl:["Binnenvaart-navigatie","ADN","AIS","Lading","Veiligheid op het water","Dienstboekje"]},
          entry:{ar:"VMBO-BB + 16 سنة", nl:"VMBO-BB + 16 jaar"},
          cert:{ar:"MBO + Vaarbewijs + ADN", nl:"MBO + Vaarbewijs + ADN"},
          next:{ar:["Stuurman","Kapitein"], nl:["Stuurman","Kapitein"]} })
    ],
    onderwijs: [
      p({ id:"onderwijsassistent", name:{ar:"مساعد تعليمي", nl:"Onderwijsassistent"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Didactiek","علم نفس الطفل","NT2","التعلّم المتمايز","Klassenmanagement","VOG"],
                    nl:["Didactiek","Kinderpsychologie","NT2","Differentiëren","Klassenmanagement","VOG"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 Onderwijsassistent + VOG", nl:"MBO-4 Onderwijsassistent + VOG"},
          next:{ar:["PABO","HBO Pedagogiek"], nl:["PABO","HBO Pedagogiek"]} }),
      p({ id:"peuter-leidster", name:{ar:"مربية حضانة", nl:"Pedagogisch medewerker Kinderopvang (Niv 3)"}, levels:[3],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["نمو الأطفال 0-4","اللعب التعليمي","السلامة والصحة","التواصل مع الأهل","VOG","EHBO kind"],
                    nl:["Ontwikkeling 0-4","Speels leren","Veiligheid & hygiëne","Oudercommunicatie","VOG","Kinder-EHBO"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO-3 PW + VOG + Kinder-EHBO", nl:"MBO-3 PW + VOG + Kinder-EHBO"},
          next:{ar:["MBO-4 Gespecialiseerd PW","HBO Pedagogiek"], nl:["MBO-4 Gespecialiseerd PW","HBO Pedagogiek"]} })
    ],
    sport: [
      p({ id:"fitness-trainer", name:{ar:"مدرّب لياقة بدنية", nl:"Fitness-trainer (Sportinstructeur)"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["Anatomie & fysiologie","Trainingsleer","Voeding","Klantbegeleiding","Groepslessen","EHBO"],
                    nl:["Anatomie & fysiologie","Trainingsleer","Voeding","Klantbegeleiding","Groepslessen","EHBO"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO-3/4 + Fitness-A", nl:"MBO-3/4 + Fitness-A"},
          next:{ar:["HBO ALO","Personal Trainer"], nl:["HBO ALO","Personal Trainer"]} }),
      p({ id:"sport-bewegen", name:{ar:"قائد الرياضة والحركة", nl:"Sport- en Bewegingsleider"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Bewegingsleer","Jeugdsport","Aangepast sporten","Spelregels","EHBO","Organisatie"],
                    nl:["Bewegingsleer","Jeugdsport","Aangepast sporten","Spelregels","EHBO","Organisatie"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-3/4 + VOG + EHBO", nl:"MBO-3/4 + VOG + EHBO"},
          next:{ar:["HBO ALO","Combifunctionaris"], nl:["HBO ALO","Combifunctionaris"]} }),
      p({ id:"outdoor-instructeur", name:{ar:"مدرّب أنشطة في الهواء الطلق", nl:"Outdoor-instructeur / Survival"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Bergredder","Kajakken","Klimmen","First-aid Outdoor","Weer en navigatie","Groeps-safety"],
                    nl:["Bergredding","Kajakken","Klimmen","Outdoor-EHBO","Weer & navigatie","Groepssafety"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 + Outdoor-brevetten", nl:"MBO-4 + Outdoor-brevetten"},
          next:{ar:["HBO Sportkunde","Eigen bedrijf"], nl:["HBO Sportkunde","Eigen bedrijf"]} })
    ],
    uiterlijk: [
      p({ id:"kapper", name:{ar:"حلاق/مصفّف شعر", nl:"Allround Kapper"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Knippen","Kleurtechnieken","Highlights/Balayage","Kapsalonhygiëne","Klantadvies","Ondernemerschap"],
                    nl:["Knippen","Kleurtechnieken","Highlights/Balayage","Kapsalonhygiëne","Klantadvies","Ondernemerschap"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + AKI", nl:"MBO + AKI"},
          next:{ar:["Eigen salon","Master-kapper"], nl:["Eigen salon","Meester-kapper"]} }),
      p({ id:"schoonheidsspec", name:{ar:"أخصائية تجميل (Schoonheid)", nl:"Schoonheidsspecialist(e)"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Huidverzorging","Massage","Make-up","Apparatieve behandelingen","Hygiëne","Klantadvies"],
                    nl:["Huidverzorging","Massage","Make-up","Apparatieve behandelingen","Hygiëne","Klantadvies"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO-3/4 + ANBOS (optioneel)", nl:"MBO-3/4 + ANBOS (optioneel)"},
          next:{ar:["Eigen salon","HBO Huidtherapie"], nl:["Eigen salon","HBO Huidtherapie"]} }),
      p({ id:"pedicure", name:{ar:"أخصائية باديكير", nl:"Medisch Pedicure"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["Voetverzorging","Diabetische/reumatische voet","Nagelpathologie","Hygiëne","Klantdossier","Anatomie"],
                    nl:["Voetverzorging","Diabetische/reumatische voet","Nagelpathologie","Hygiëne","Klantdossier","Anatomie"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO + ProCert Medisch Pedicure", nl:"MBO + ProCert Medisch Pedicure"},
          next:{ar:["Eigen praktijk","Specialisatie"], nl:["Eigen praktijk","Specialisatie"]} })
    ],
    veiligheid: [
      p({ id:"beveiliger", name:{ar:"حارس أمن معتمد", nl:"Beveiliger (Niv 2/3)"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["قانون الأمن Wpbr","Surveillance","Rapportage","Conflicthantering","EHBO","VOG"],
                    nl:["Wpbr-wetgeving","Surveillance","Rapportage","Conflicthantering","EHBO","VOG"]},
          entry:{ar:"VMBO-BB + 18 + VOG", nl:"VMBO-BB + 18 + VOG"},
          cert:{ar:"MBO-2/3 + Grondslag beveiliging + VOG", nl:"MBO-2/3 + Grondslag beveiliging + VOG"},
          next:{ar:["MBO-4 Coördinator","BOA"], nl:["MBO-4 Coördinator","BOA"]} }),
      p({ id:"boa", name:{ar:"مفتش بلدي (BOA)", nl:"Buitengewoon Opsporingsambtenaar (BOA)"}, levels:[3,4],
          duration:{ar:"1–2 سنة + BOA-opleiding", nl:"1–2 jaar + BOA-opleiding"},
          subjects:{ar:["القانون الجنائي","Handhaving","Rapportage","Conflictbeheersing","Self-defense","VOG/screening"],
                    nl:["Strafrecht","Handhaving","Rapportage","Conflictbeheersing","Zelfverdediging","VOG/screening"]},
          entry:{ar:"MBO-3 Beveiliging + VOG", nl:"MBO-3 Beveiliging + VOG"},
          cert:{ar:"BOA-examen + VOG", nl:"BOA-examen + VOG"},
          next:{ar:["Politie AA","HBO Integrale Veiligheid"], nl:["Politie AA","HBO Integrale Veiligheid"]} }),
      p({ id:"militair", name:{ar:"جندي محترف (KL/KMar)", nl:"Militair (Koninklijke Landmacht/Marine/KLu/KMar)"}, levels:[2,3,4],
          duration:{ar:"متغيّر (1–4 سنوات)", nl:"Varieert (1–4 jaar)"},
          subjects:{ar:["اللياقة البدنية","تكتيكات القتال","Wapenhantering","Teamwork","الإسعافات","Defensie-specialisatie"],
                    nl:["Fysieke conditie","Gevechtstactiek","Wapenhantering","Teamwork","EHBO","Defensie-specialisatie"]},
          entry:{ar:"VMBO-BB + ≥17 + medische keuring", nl:"VMBO-BB + ≥17 + medische keuring"},
          cert:{ar:"MBO Veiligheid & Vakmanschap + dienstverband", nl:"MBO Veiligheid & Vakmanschap + dienstverband"},
          next:{ar:["Onderofficier","HBO Defensie"], nl:["Onderofficier","HBO Defensie"]} })
    ],
    toerisme: [
      p({ id:"reisleider", name:{ar:"مرشد سياحي", nl:"Reisleider / Touroperator assistant"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Geografie","Talen (EN/DE/ES)","Interculturele communicatie","EHBO","Reisrecht","Klantenservice"],
                    nl:["Geografie","Talen (EN/DE/ES)","Interculturele communicatie","EHBO","Reisrecht","Klantenservice"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-3/4 Reis & Toerisme", nl:"MBO-3/4 Reis & Toerisme"},
          next:{ar:["HBO Tourism","Product manager reizen"], nl:["HBO Tourism","Productmanager reizen"]} }),
      p({ id:"parkmedewerker", name:{ar:"موظف حديقة ترفيهية", nl:"Medewerker attractiepark"}, levels:[2,3],
          duration:{ar:"2 سنة", nl:"2 jaar"},
          subjects:{ar:["Gastvrijheid","Veiligheid attracties","EHBO","Communicatie","Operations","Engels"],
                    nl:["Gastvrijheid","Attractieveiligheid","EHBO","Communicatie","Operations","Engels"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA + EHBO", nl:"MBO + VCA + EHBO"},
          next:{ar:["Teamleider park","HBO Hospitality"], nl:["Teamleider park","HBO Hospitality"]} })
    ],
    voedsel: [
      p({ id:"bloemist", name:{ar:"بائع أزهار", nl:"Bloemist / Bloemsierkunst"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Bloembinden","Botanica","Stijlen","Klantadvies","Verkoop","Ondernemerschap"],
                    nl:["Bloembinden","Botanica","Stijlen","Klantadvies","Verkoop","Ondernemerschap"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO", nl:"MBO"},
          next:{ar:["Eigen winkel","HBO Tuin & Landschap"], nl:["Eigen winkel","HBO Tuin & Landschap"]} }),
      p({ id:"hovenier", name:{ar:"مصمم حدائق", nl:"Hovenier / Vakbekwaam hovenier"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Tuinaanleg","Plantenkennis","Grondwerk","Bestrating","Onderhoud","Ondernemen"],
                    nl:["Tuinaanleg","Plantenkennis","Grondwerk","Bestrating","Onderhoud","Ondernemen"]},
          entry:{ar:"VMBO-BB", nl:"VMBO-BB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["Eigen hoveniersbedrijf","HBO Tuin & Landschap"], nl:["Eigen hoveniersbedrijf","HBO Tuin & Landschap"]} }),
      p({ id:"dierenverzorger", name:{ar:"مربي حيوانات", nl:"Dierverzorger"}, levels:[2,3,4],
          duration:{ar:"2–4 سنوات", nl:"2–4 jaar"},
          subjects:{ar:["Dierengedrag","Gezondheid","Voeding","Hygiëne","Dierenwelzijn","Wetgeving"],
                    nl:["Dierengedrag","Gezondheid","Voeding","Hygiëne","Dierenwelzijn","Wetgeving"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO + vak-certificaten", nl:"MBO + vakcertificaten"},
          next:{ar:["Dierenarts-assistent","HBO Diermanagement"], nl:["Dierenarts-assistent","HBO Diermanagement"]} }),
      p({ id:"boomverzorger", name:{ar:"خبير أشجار (European Tree Worker)", nl:"European Tree Worker / Boomverzorger"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["Boomsoortenkennis","Klimwerk","VTA-inspectie","Motorzaag","Kroonverzorging","VCA"],
                    nl:["Boomsoortenkennis","Klimwerk","VTA-inspectie","Motorzaag","Kroonverzorging","VCA"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO + ETW-diploma + VCA", nl:"MBO + ETW-diploma + VCA"},
          next:{ar:["European Tree Technician","Eigen bedrijf"], nl:["European Tree Technician","Eigen bedrijf"]} }),
      p({ id:"melkveehouder", name:{ar:"مربي أبقار حلوب", nl:"Melkveehouder / Veehouder"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Dierziekte","Melktechniek","Stalinrichting","Voeding","Ondernemen","Duurzaamheid"],
                    nl:["Dierziekten","Melktechniek","Stalinrichting","Voeding","Ondernemen","Duurzaamheid"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO", nl:"MBO"},
          next:{ar:["Bedrijfsovername","HBO Dier & Veehouderij"], nl:["Bedrijfsovername","HBO Dier & Veehouderij"]} })
    ],
    luchtvaart: [
      p({ id:"aircraft-tech", name:{ar:"فنّي صيانة طائرات", nl:"Aircraft Maintenance Technician (AMT)"}, levels:[4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Avionica","Aerodynamica","EASA Part-66","Turbinemotoren","Composieten","Engels technisch"],
                    nl:["Avionica","Aerodynamica","EASA Part-66","Turbinemotoren","Composieten","Technisch Engels"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + EASA Part-66 A/B", nl:"MBO-4 + EASA Part-66 A/B"},
          next:{ar:["HBO Aviation Engineering","Line Engineer"], nl:["HBO Aviation Engineering","Line Engineer"]} }),
      p({ id:"ground-handler", name:{ar:"خدمات أرضية للطيران", nl:"Ground Handler (Ramp/Passenger services)"}, levels:[2,3],
          duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
          subjects:{ar:["Turnaround","Veiligheid platform","Bagageverwerking","Talen (EN)","Push-back","Gevaarlijke stoffen"],
                    nl:["Turnaround","Platformveiligheid","Bagageverwerking","Talen (EN)","Push-back","Gevaarlijke stoffen"]},
          entry:{ar:"VMBO-BB + VOG", nl:"VMBO-BB + VOG"},
          cert:{ar:"MBO + IATA Dangerous Goods", nl:"MBO + IATA Dangerous Goods"},
          next:{ar:["Teamleider platform","HBO Aviation"], nl:["Teamleider platform","HBO Aviation"]} }),
      p({ id:"jachtbouwer", name:{ar:"بنّاء يخوت", nl:"Jachtbouwer / Scheepsbouwer"}, levels:[3,4],
          duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
          subjects:{ar:["Scheepslassen","Composieten","Afbouw","Installatietechniek aan boord","Tekeninglezen","VCA"],
                    nl:["Scheepslassen","Composieten","Afbouw","Installatietechniek aan boord","Tekeninglezen","VCA"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + VCA", nl:"MBO + VCA"},
          next:{ar:["HBO Maritiem","Refit-specialist"], nl:["HBO Maritiem","Refit-specialist"]} })
    ],
    procestechniek: [
      p({ id:"kwaliteitscontroleur", name:{ar:"مفتش جودة صناعية", nl:"Kwaliteitscontroleur (QC)"}, levels:[3,4],
          duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
          subjects:{ar:["ISO 9001","Meettechniek","SPC","Statistiek","Rapportage","Interne audits"],
                    nl:["ISO 9001","Meettechniek","SPC","Statistiek","Rapportage","Interne audits"]},
          entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
          cert:{ar:"MBO-4 Kwaliteitscoördinator", nl:"MBO-4 Kwaliteitscoördinator"},
          next:{ar:["HBO Quality Engineering","QA-specialist"], nl:["HBO Quality Engineering","QA-specialist"]} }),
      p({ id:"farma-operator", name:{ar:"مُشغّل صناعة دوائية", nl:"Farmaceutisch operator (GMP)"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["GMP/GxP","Cleanroom","Batchdocumentatie","Validation","Materiaalkunde","VCA"],
                    nl:["GMP/GxP","Cleanroom","Batchdocumentatie","Validatie","Materiaalkunde","VCA"]},
          entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
          cert:{ar:"MBO-4 + GMP", nl:"MBO-4 + GMP"},
          next:{ar:["Supervisor","HBO Life Sciences"], nl:["Supervisor","HBO Life Sciences"]} })
    ],
    energie: [
      p({ id:"laadpaal-inst", name:{ar:"فنّي محطات شحن سيارات", nl:"Laadpaal-installateur (EV-infra)"}, levels:[2,3],
          duration:{ar:"2 سنة", nl:"2 jaar"},
          subjects:{ar:["Elektra","NEN 1010","DC-laad","Communicatieprotocollen OCPP","Veiligheid","Certificering"],
                    nl:["Elektra","NEN 1010","DC-laden","OCPP-protocollen","Veiligheid","Certificering"]},
          entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
          cert:{ar:"MBO + NEN 3140", nl:"MBO + NEN 3140"},
          next:{ar:["ZZP","HBO Elektrotechniek"], nl:["ZZP","HBO Elektrotechniek"]} }),
      p({ id:"energie-adviseur", name:{ar:"مستشار طاقة (BENG)", nl:"Energie-adviseur / BENG-coach"}, levels:[4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["Isolatie","BENG-berekeningen","Subsidies","Warmtepompen","Zonnepanelen","Klantadvies"],
                    nl:["Isolatie","BENG-berekeningen","Subsidies","Warmtepompen","Zonnepanelen","Klantadvies"]},
          entry:{ar:"VMBO-TL أو HAVO", nl:"VMBO-TL of HAVO"},
          cert:{ar:"MBO-4 + BRL 9500 (optioneel)", nl:"MBO-4 + BRL 9500 (optioneel)"},
          next:{ar:["HBO Bouwkunde/Installatie","ZZP"], nl:["HBO Bouwkunde/Installatie","ZZP"]} }),
      p({ id:"koeltechnicus", name:{ar:"فنّي تبريد وتكييف", nl:"Koel- en klimaattechnicus"}, levels:[3,4],
          duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:["F-gassen","Koeltechniek","HVAC","Elektronica","NEN-installatie","Veiligheid"],
                    nl:["F-gassen","Koeltechniek","HVAC","Elektronica","NEN-installatie","Veiligheid"]},
          entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
          cert:{ar:"MBO + F-gassen + NEN 3140", nl:"MBO + F-gassen + NEN 3140"},
          next:{ar:["HBO Installatietechniek","ZZP"], nl:["HBO Installatietechniek","ZZP"]} })
    ]
  };

  for (const [sid, pros] of Object.entries(ADD2)) {
    const s = MBO_SECTOR_BY_ID[sid];
    if (s && Array.isArray(pros)) s.professions.push(...pros);
  }

  // Two additional brand-new sectors for comprehensive coverage
  const MORE_SECTORS = [
    {
      id:"maritiem", icon:"⚓", name:{ar:"البحرية والصيد", nl:"Maritiem & Visserij"},
      professions:[
        p({ id:"zeevaart-matroos", name:{ar:"بحّار سفن", nl:"Zeevaart Matroos / Stuurman kleine zeevaart"}, levels:[3,4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["Navigatie","STCW","Brugdienst","Ladingbehandeling","Marcom","Engels"],
                      nl:["Navigatie","STCW","Brugdienst","Ladingbehandeling","Marcom","Engels"]},
            entry:{ar:"VMBO-KB + keuring", nl:"VMBO-KB + keuring"},
            cert:{ar:"MBO-4 + STCW Basic", nl:"MBO-4 + STCW Basic"},
            next:{ar:["HBO Maritiem Officier","Kapitein"], nl:["HBO Maritiem Officier","Kapitein"]} }),
        p({ id:"visser", name:{ar:"صيّاد محترف", nl:"Visser / Bemanningslid viskotter"}, levels:[2,3],
            duration:{ar:"1–2 سنة", nl:"1–2 jaar"},
            subjects:{ar:["Vistechniek","Netten","Navigatie basis","Veiligheid op zee","Visverwerking","STCW-Basic"],
                      nl:["Vistechniek","Netten","Basisnavigatie","Zeesafety","Visverwerking","STCW-Basic"]},
            entry:{ar:"VMBO-BB + 16 + keuring", nl:"VMBO-BB + 16 + keuring"},
            cert:{ar:"MBO + STCW Basic Safety", nl:"MBO + STCW Basic Safety"},
            next:{ar:["Schipper kustvisserij","Zeevaart"], nl:["Schipper kustvisserij","Zeevaart"]} }),
        p({ id:"duiker", name:{ar:"غوّاص محترف", nl:"Beroepsduiker (Certified SCUBA)"}, levels:[4],
            duration:{ar:"2–3 سنوات", nl:"2–3 jaar"},
            subjects:{ar:["Duikfysiologie","Onderwater-lassen","Inspecties","Hyperbarisch","Salvage","Veiligheid"],
                      nl:["Duikfysiologie","Onderwater-lassen","Inspecties","Hyperbarisch","Salvage","Veiligheid"]},
            entry:{ar:"VMBO-KB + medische keuring", nl:"VMBO-KB + medische keuring"},
            cert:{ar:"MBO + IMCA Diver (international)", nl:"MBO + IMCA Diver (internationaal)"},
            next:{ar:["Offshore-duiker","Duik-inspecteur"], nl:["Offshore-duiker","Duik-inspecteur"]} })
      ]
    },
    {
      id:"creatief-ambacht", icon:"🎭", name:{ar:"الحرف والفنون التطبيقية", nl:"Creatief Ambacht"},
      professions:[
        p({ id:"goudsmid", name:{ar:"صائغ مجوهرات", nl:"Goudsmid / Juwelier"}, levels:[3,4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["Soldeertechniek","Edelstenen","Zetwerk","Gieten","Ondernemen","Design"],
                      nl:["Soldeertechniek","Edelstenen","Zetwerk","Gieten","Ondernemen","Design"]},
            entry:{ar:"VMBO-KB", nl:"VMBO-KB"},
            cert:{ar:"MBO-4 Goud- en zilversmid", nl:"MBO-4 Goud- en zilversmid"},
            next:{ar:["Eigen atelier","Restauratie"], nl:["Eigen atelier","Restauratie"]} }),
        p({ id:"meubelmaker", name:{ar:"صانع أثاث يدوي", nl:"Meubelmaker / Restaurator"}, levels:[3,4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["Houtbewerking","Verbindingen","CNC-hout","Stijlen & geschiedenis","Oppervlakteafwerking","Ontwerp"],
                      nl:["Houtbewerking","Verbindingen","CNC-hout","Stijlen & geschiedenis","Oppervlakteafwerking","Ontwerp"]},
            entry:{ar:"VMBO-BB/KB", nl:"VMBO-BB/KB"},
            cert:{ar:"MBO-4 Meubelmaken/Restauratie", nl:"MBO-4 Meubelmaken/Restauratie"},
            next:{ar:["Eigen werkplaats","Restauratie-specialist"], nl:["Eigen werkplaats","Restauratie-specialist"]} }),
        p({ id:"mode-ontwerper", name:{ar:"مصمّم أزياء ومنفّذ", nl:"Mode-ontwerper & kleermaker (MBO)"}, levels:[3,4],
            duration:{ar:"3–4 سنوات", nl:"3–4 jaar"},
            subjects:{ar:["Patroontekenen","Sustainable fashion","Kostuumgeschiedenis","Stoffenkennis","Portfolio","Ondernemerschap"],
                      nl:["Patroontekenen","Duurzame mode","Kostuumgeschiedenis","Stoffenkennis","Portfolio","Ondernemen"]},
            entry:{ar:"VMBO-TL", nl:"VMBO-TL"},
            cert:{ar:"MBO-4 Modevakopleiding", nl:"MBO-4 Modevakopleiding"},
            next:{ar:["HBO Fashion","Eigen label"], nl:["HBO Fashion","Eigen label"]} }),
        p({ id:"glazenier", name:{ar:"صانع زجاج ملوّن", nl:"Glazenier / Glaskunstenaar"}, levels:[3,4],
            duration:{ar:"3 سنوات", nl:"3 jaar"},
            subjects:{ar:["Loodglas","Gebrandschilderd glas","Fusing","Restauratie","Ontwerp","Atelier-praktijk"],
                      nl:["Loodglas","Gebrandschilderd glas","Fusing","Restauratie","Ontwerp","Atelierpraktijk"]},
            entry:{ar:"VMBO-KB/TL", nl:"VMBO-KB/TL"},
            cert:{ar:"MBO-4 Restauratie/Glas", nl:"MBO-4 Restauratie/Glas"},
            next:{ar:["Restauratie-atelier","Kunstenaar"], nl:["Restauratie-atelier","Kunstenaar"]} })
      ]
    }
  ];
  for (const ns of MORE_SECTORS) {
    MBO_SECTORS.push(ns);
    MBO_SECTOR_BY_ID[ns.id] = ns;
  }
})();


/* ═══════════════════════════════════════════════════════════
   EXPANSION PACK V4 — MASSIVE comprehensive MBO reference
   Adds ~100 more professions across existing sectors
   + 3 new sectors: dier, muziek-podium, drukwerk
═══════════════════════════════════════════════════════════ */
(function expandProfessionsV4(){

  const ADD3 = {
    techniek: [
      { id:"lasser", name:{ar:"لحّام صناعي", nl:"Lasser"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"لحام MIG/MAG/TIG، قراءة مخططات، معادن", nl:"MIG/MAG/TIG-lassen, tekeninglezen, metaalkunde"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"شهادات لحام NIL", nl:"NIL-lascertificaten"},
        next:{ar:"كبير لحامين، مفتش لحام", nl:"Hoofdlasser, lasinspecteur"} },
      { id:"plaatwerker", name:{ar:"عامل تشكيل صفائح", nl:"Plaatwerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"قص، ثني، تشكيل صفائح المعدن", nl:"Knippen, buigen, vormen van plaatmetaal"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"شهادة عامل تشكيل", nl:"Diploma plaatwerker"},
        next:{ar:"صانع هياكل، صائغ سيارات", nl:"Constructiebankwerker, autoschadehersteller"} },
      { id:"instrumentmaker", name:{ar:"صانع أجهزة دقيقة", nl:"Fijnmechanisch verspaner / Instrumentmaker"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"دقة الميكرومتر، أجهزة قياس، صناعة قوالب", nl:"Micrometernauwkeurigheid, meetinstrumenten, matrijzenbouw"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"شهادة Fijnmechanisch", nl:"Diploma fijnmechanica"},
        next:{ar:"تقني R&D، تطوير منتج", nl:"R&D-technicus, productontwikkelaar"} },
      { id:"werktuigbouw-tech", name:{ar:"فني هندسة ميكانيكية", nl:"Werktuigbouwkundig technicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تصميم ميكانيكي، تحليل قوى، AutoCAD", nl:"Werktuigbouwontwerp, krachtenanalyse, AutoCAD"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"Werktuigbouw MBO 4", nl:"Werktuigbouwkundige MBO 4"},
        next:{ar:"HBO هندسة ميكانيكية", nl:"HBO Werktuigbouwkunde"} },
      { id:"smid", name:{ar:"حدّاد", nl:"Smid"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تشكيل المعدن الساخن، حرف يدوية", nl:"Smeden, vormgeven van warm metaal"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"شهادة حدّاد", nl:"Diploma smid"},
        next:{ar:"حدّاد فني، صانع تماثيل معدنية", nl:"Sierhandsmid, kunstsmid"} },
      { id:"fietsenmaker", name:{ar:"فني دراجات", nl:"Fietsenmaker / Fietstechnicus"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"صيانة دراجات، إصلاح دراجات كهربائية، إلكترونيات", nl:"Fietsonderhoud, e-bike reparatie, elektronica"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"شهادة Fietstechnicus", nl:"Diploma Fietstechnicus"},
        next:{ar:"مشرف ورشة دراجات، مالك متجر", nl:"Werkplaatschef, eigen winkel"} },
      { id:"machinebankwerker", name:{ar:"فني تجميع آلات", nl:"Machinebankwerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تجميع، ضبط، تشغيل آلات إنتاج", nl:"Assemblage, afstellen en bedrijfsklaar maken van machines"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Machinebankwerker", nl:"Diploma machinebankwerker"},
        next:{ar:"فني تركيب صناعي", nl:"Industrieel monteur"} }
    ],

    bouw: [
      { id:"rietdekker", name:{ar:"عامل تسقيف بالقصب", nl:"Rietdekker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تسقيف تقليدي، عزل، أعمال السقف", nl:"Traditioneel rietdekken, isolatie, dakwerk"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Rietdekker", nl:"Diploma rietdekker"},
        next:{ar:"مالك شركة تسقيف", nl:"Eigen bedrijf"} },
      { id:"voeger", name:{ar:"عامل تجصيص الفراغات", nl:"Voeger"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تجصيص الفراغات بين الطوب، ترميم", nl:"Voegwerk tussen metselwerk, restauratie"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Voeger niveau 2/3", nl:"Diploma voeger"},
        next:{ar:"أعمال ترميم تراثية", nl:"Restauratievoeger"} },
      { id:"glaszetter", name:{ar:"تركيب زجاج", nl:"Glaszetter"}, levels:[2,3], duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{ar:"تركيب زجاج النوافذ، عزل حراري، سلامة", nl:"Plaatsen van ramen, isolatieglas, veiligheid"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Glaszetter", nl:"Diploma Glaszetter"},
        next:{ar:"فني واجهات زجاجية", nl:"Gevelmonteur glas"} },
      { id:"bouwkundig-tekenaar", name:{ar:"رسام معماري", nl:"Bouwkundig tekenaar"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"AutoCAD، Revit، رسم معماري، قراءة مخططات", nl:"AutoCAD, Revit, bouwkundig tekenen, plannen lezen"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Bouwkundig tekenaar MBO 4", nl:"Bouwkundig tekenaar MBO 4"},
        next:{ar:"HBO Bouwkunde", nl:"HBO Bouwkunde"} },
      { id:"bim-modelleur", name:{ar:"خبير نمذجة BIM", nl:"BIM-modelleur"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"Revit، Navisworks، نمذجة 3D، تنسيق المشاريع", nl:"Revit, Navisworks, 3D-modelleren, projectcoördinatie"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"BIM-modelleur MBO 4", nl:"BIM-specialist MBO 4"},
        next:{ar:"BIM Coordinator، HBO", nl:"BIM Coördinator, HBO"} },
      { id:"sloper", name:{ar:"عامل هدم وتفكيك", nl:"Sloper"}, levels:[2,3], duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{ar:"هدم آمن، فرز نفايات، إزالة الأسبستوس", nl:"Veilig slopen, afvalscheiding, asbestverwijdering"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Sloper / Asbestcertificaat", nl:"Sloper / DIA-certificaat"},
        next:{ar:"مشرف موقع هدم", nl:"Voorman sloop"} },
      { id:"isoleerder", name:{ar:"فني عزل حراري", nl:"Isoleerder"}, levels:[2,3], duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{ar:"عزل أنابيب، عزل صوتي، عوازل بيئية", nl:"Pijpisolatie, akoestische isolatie, duurzame isolatie"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Isoleerder", nl:"Diploma isoleerder"},
        next:{ar:"مفتش طاقة سكنية", nl:"Energie-inspecteur"} },
      { id:"calculator-bouw", name:{ar:"حاسب تكاليف بناء", nl:"Calculator bouw"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"حساب تكلفة المشروع، عروض الأسعار، Excel", nl:"Projectcalculatie, offertes, Excel"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Calculator MBO 4", nl:"Diploma calculator MBO 4"},
        next:{ar:"HBO Bouwmanagement", nl:"HBO Bouwmanagement"} }
    ],

    ict: [
      { id:"helpdesk-medewerker", name:{ar:"موظف مكتب مساعدة", nl:"Helpdeskmedewerker / IT Support"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"دعم تقني، Windows، Active Directory، خدمة عملاء", nl:"IT-support, Windows, Active Directory, klantservice"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Medewerker ICT support", nl:"Diploma Medewerker ICT-support"},
        next:{ar:"Netwerkbeheerder، Systeembeheer", nl:"Netwerkbeheerder, systeembeheer"} },
      { id:"netwerkbeheerder", name:{ar:"مدير شبكات", nl:"Netwerkbeheerder"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"Cisco، TCP/IP، VLAN، أمن الشبكات", nl:"Cisco, TCP/IP, VLAN, netwerkbeveiliging"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Netwerk- en mediabeheerder + CCNA", nl:"Netwerk- en mediabeheerder + CCNA"},
        next:{ar:"Network Engineer HBO", nl:"HBO Netwerk Engineer"} },
      { id:"mobile-dev", name:{ar:"مطور تطبيقات الجوال", nl:"Mobile App Developer"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"Android Kotlin، iOS Swift، React Native، Firebase", nl:"Android Kotlin, iOS Swift, React Native, Firebase"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"Software Developer MBO 4", nl:"Software Developer MBO 4"},
        next:{ar:"HBO Informatica", nl:"HBO Informatica"} },
      { id:"devops-mbo", name:{ar:"DevOps مساعد", nl:"DevOps medewerker"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"Docker، Linux، Git، CI/CD", nl:"Docker, Linux, Git, CI/CD pipelines"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Expert IT Systems and Devices", nl:"Expert IT Systems and Devices"},
        next:{ar:"DevOps Engineer HBO", nl:"DevOps Engineer HBO"} },
      { id:"dba-mbo", name:{ar:"مساعد قاعدة بيانات", nl:"Database-medewerker"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"SQL، MySQL، PostgreSQL، نسخ احتياطي", nl:"SQL, MySQL, PostgreSQL, back-ups en herstel"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Application & Media Developer", nl:"Application & Media Developer"},
        next:{ar:"Database Administrator HBO", nl:"Database Administrator HBO"} }
    ],

    media: [
      { id:"social-media-mbo", name:{ar:"موظف وسائل تواصل اجتماعي", nl:"Social Media Medewerker"}, levels:[3,4], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"Instagram، TikTok، تسويق محتوى، إعلانات", nl:"Instagram, TikTok, contentmarketing, ads"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Marketing/Communicatie MBO 4", nl:"Marketing/Communicatie MBO 4"},
        next:{ar:"HBO Communicatie", nl:"HBO Communicatie"} },
      { id:"content-creator", name:{ar:"صانع محتوى رقمي", nl:"Content Creator"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تصوير، تحرير فيديو، كتابة، استراتيجية محتوى", nl:"Videografie, videomontage, copywriting, contentstrategie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Mediavormgever MBO 4", nl:"Mediavormgever MBO 4"},
        next:{ar:"HBO Creative Media", nl:"HBO Creative Media and Game Technologies"} },
      { id:"podcast-producer", name:{ar:"منتج بودكاست", nl:"Podcastproducent"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تسجيل صوتي، تحرير، استضافة، توزيع", nl:"Audio-opname, montage, hosting, distributie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"AV-specialist MBO 4", nl:"AV-specialist MBO 4"},
        next:{ar:"مالك استوديو، صحفي صوتي", nl:"Eigen studio, audiojournalist"} },
      { id:"illustrator-mbo", name:{ar:"رسام تجاري", nl:"Illustrator"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"رسم رقمي، Procreate، Photoshop، تصميم شخصيات", nl:"Digitaal tekenen, Procreate, Photoshop, character design"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Mediavormgever – Illustration", nl:"Mediavormgever – Illustration"},
        next:{ar:"HBO Illustration", nl:"HBO Illustration / Kunstacademie"} }
    ],

    zorg: [
      { id:"kraamverzorgende", name:{ar:"مساعدة ولادة منزلية", nl:"Kraamverzorgende"}, levels:[3], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"رعاية الأم والطفل بعد الولادة، صحة المواليد", nl:"Zorg voor moeder en pasgeborene, neonatale zorg"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Kraamverzorgende niveau 3", nl:"Diploma Kraamverzorgende"},
        next:{ar:"Verpleegkundige، قابلة (HBO)", nl:"Verpleegkundige, verloskundige (HBO)"} },
      { id:"thuiszorg", name:{ar:"مقدم رعاية منزلية", nl:"Medewerker Thuiszorg"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"رعاية كبار السن في المنزل، الأدوية، الاستقلالية", nl:"Ouderenzorg thuis, medicatie, zelfstandigheid"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Helpende Zorg & Welzijn / Verzorgende-IG", nl:"Helpende Zorg & Welzijn / Verzorgende-IG"},
        next:{ar:"Wijkverpleegkundige (HBO)", nl:"Wijkverpleegkundige (HBO)"} },
      { id:"prothese-tech", name:{ar:"فني أطراف صناعية", nl:"Orthopedisch technicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تركيب أطراف صناعية، أحذية طبية، قياس", nl:"Prothesen, orthopedisch schoeisel, aanmeten"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Orthopedisch technicus MBO 4", nl:"Orthopedisch technicus MBO 4"},
        next:{ar:"HBO Bewegingstechnologie", nl:"HBO Bewegingstechnologie"} },
      { id:"diet-assistent", name:{ar:"مساعد تغذية", nl:"Diëtetiek assistent"}, levels:[4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تغذية، خطط غذائية، صحة عامة", nl:"Voedingsleer, dieetplannen, volksgezondheid"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Voedingsassistent MBO 4", nl:"Voedingsassistent MBO 4"},
        next:{ar:"HBO Voeding & Diëtetiek", nl:"HBO Voeding & Diëtetiek"} }
    ],

    economie: [
      { id:"salarisadm", name:{ar:"موظف رواتب", nl:"Salarisadministrateur"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"حساب الرواتب، الضرائب، التأمينات، AFAS/Loket", nl:"Loonberekening, belastingen, sociale verzekeringen, AFAS/Loket"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"PDL (Praktijkdiploma Loonadministratie)", nl:"PDL (Praktijkdiploma Loonadministratie)"},
        next:{ar:"VPS، HBO HRM", nl:"VPS-certificaat, HBO HRM"} },
      { id:"accountant-assist", name:{ar:"مساعد محاسب", nl:"Assistent accountant"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"محاسبة، إعداد التقارير المالية، ضرائب", nl:"Boekhouding, jaarrekeningen, fiscale aangifte"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Junior Assistent Accountant MBO 4", nl:"Junior Assistent Accountant MBO 4"},
        next:{ar:"HBO Accountancy", nl:"HBO Accountancy"} },
      { id:"debiteurenbeheerder", name:{ar:"موظف تحصيل ديون", nl:"Debiteurenbeheerder"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"متابعة الفواتير، التواصل مع العملاء، تحصيل", nl:"Factuuropvolging, klantcontact, incasso"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Financieel Administratief Medewerker", nl:"Financieel Administratief Medewerker"},
        next:{ar:"Credit Manager", nl:"Credit Manager"} }
    ],

    handel: [
      { id:"importeur-mbo", name:{ar:"مساعد استيراد وتصدير", nl:"Medewerker import-export"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"وثائق الجمارك، Incoterms، التصدير، اللغات", nl:"Douanedocumenten, Incoterms, export, talen"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Internationaal medewerker", nl:"Diploma Internationaal Medewerker"},
        next:{ar:"HBO International Business", nl:"HBO International Business"} },
      { id:"verkoper-detail", name:{ar:"بائع تجزئة", nl:"Verkoper detailhandel"}, levels:[2], duration:{ar:"2 سنة", nl:"2 jaar"},
        subjects:{ar:"خدمة العملاء، الكاشير، عرض البضائع", nl:"Klantenservice, kassa, schappen vullen"},
        entry:{ar:"بدون VMBO إلزامي", nl:"Geen VMBO verplicht"}, cert:{ar:"Verkoper niveau 2", nl:"Diploma Verkoper niveau 2"},
        next:{ar:"Eerste verkoper, filiaalleider", nl:"Eerste verkoper, filiaalleider"} }
    ],

    horeca: [
      { id:"patissier", name:{ar:"شيف حلويات", nl:"Patissier"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"حلويات فرنسية، شوكولاتة، فن التزيين", nl:"Franse patisserie, chocolade, decoratietechnieken"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Patissier MBO 3/4", nl:"Patissier MBO 3/4"},
        next:{ar:"كبير شيفات حلويات، مالك مخبز", nl:"Chef-patissier, eigen patisserie"} },
      { id:"banketbakker", name:{ar:"خبّاز معجنات", nl:"Banketbakker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"معجنات هولندية، كرواسون، معجنات تقليدية", nl:"Nederlandse banket, croissants, traditionele patisserie"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Banketbakker", nl:"Diploma Banketbakker"},
        next:{ar:"Patissier MBO 4", nl:"Patissier MBO 4"} },
      { id:"broodbakker", name:{ar:"خبّاز خبز", nl:"Broodbakker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تقنيات التخمير، أنواع الخبز، تشغيل الفرن", nl:"Fermentatie, broodsoorten, ovenbeheer"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Broodbakker", nl:"Diploma Broodbakker"},
        next:{ar:"Bakkerijmanager، مالك مخبز", nl:"Bakkerijmanager, eigen bakkerij"} },
      { id:"slager", name:{ar:"جزّار", nl:"Slager"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تقطيع اللحوم، السلامة الغذائية، البيع", nl:"Vleesbewerking, voedselveiligheid, verkoop"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Slager / Specialist Vlees", nl:"Slager / Specialist Vlees"},
        next:{ar:"Slagerijmanager، مالك متجر", nl:"Slagerijmanager, eigen slagerij"} },
      { id:"sommelier-mbo", name:{ar:"خبير نبيذ مبتدئ", nl:"Wijnkenner / Assistent sommelier"}, levels:[3,4], duration:{ar:"خاصة", nl:"Specialisatie"},
        subjects:{ar:"تذوّق النبيذ، التوازن مع الطعام، إدارة قائمة النبيذ", nl:"Wijnproeven, food pairing, wijnkaartbeheer"},
        entry:{ar:"Gastheer/Kok niveau 3", nl:"Gastheer/Kok niveau 3"}, cert:{ar:"Wijncertificaat (SVH)", nl:"SVH Wijncertificaat"},
        next:{ar:"Sommelier (Master SVH)", nl:"Master Sommelier SVH"} }
    ],

    mobiliteit: [
      { id:"motorfiets-tech", name:{ar:"فني دراجات نارية", nl:"Motorfietstechnicus"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"محركات الدراجات النارية، إلكترونيات، فحوصات", nl:"Motorblokken, elektronica, APK-keuringen"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Motorfietstechnicus", nl:"Diploma Motorfietstechnicus"},
        next:{ar:"مالك ورشة دراجات نارية", nl:"Eigen motorfietswerkplaats"} },
      { id:"machinist-trein", name:{ar:"سائق قطار", nl:"Treinmachinist"}, levels:[3,4], duration:{ar:"تدريب داخلي 1-2 سنة", nl:"Interne opleiding 1-2 jaar"},
        subjects:{ar:"قيادة القطارات، أنظمة السلامة، الجداول الزمنية", nl:"Treinbesturing, veiligheidssystemen, dienstregeling"},
        entry:{ar:"MBO 4 + 18+", nl:"MBO 4 + 18+ jaar"}, cert:{ar:"Machinistenvergunning", nl:"Machinistenvergunning"},
        next:{ar:"Instructeur، Train dispatcher", nl:"Instructeur, treindienstleider"} },
      { id:"taxi-chauffeur", name:{ar:"سائق تاكسي", nl:"Taxichauffeur"}, levels:[2], duration:{ar:"6-12 شهر", nl:"6-12 maanden"},
        subjects:{ar:"رخصة تاكسي، خدمة العملاء، GPS", nl:"Taxipas, klantenservice, GPS-routes"},
        entry:{ar:"رخصة B + 21+", nl:"Rijbewijs B + 21+ jaar"}, cert:{ar:"Chauffeurspas (Kiwa)", nl:"Chauffeurspas (Kiwa)"},
        next:{ar:"مالك أسطول تاكسي", nl:"Eigen taxibedrijf"} }
    ],

    onderwijs: [
      { id:"bso-medewerker", name:{ar:"موظف رعاية بعد المدرسة", nl:"Medewerker BSO (Buitenschoolse Opvang)"}, levels:[3,4], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"أنشطة ترفيهية للأطفال 4-12 سنة، تربية", nl:"Activiteiten voor kinderen 4-12 jaar, pedagogiek"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Pedagogisch Medewerker", nl:"Pedagogisch Medewerker Kinderopvang"},
        next:{ar:"HBO Pedagogiek", nl:"HBO Pedagogiek"} }
    ],

    sport: [
      { id:"zwem-instructeur", name:{ar:"مدرّب سباحة", nl:"Zweminstructeur / Lifeguard"}, levels:[2,3], duration:{ar:"دورة 6 أشهر إلى سنة", nl:"6 maanden tot 1 jaar"},
        subjects:{ar:"تعليم السباحة، الإنقاذ، أمان حمامات السباحة", nl:"Zwemles geven, reddend zwemmen, zwembadveiligheid"},
        entry:{ar:"شهادة EHBO + سباحة جيدة", nl:"EHBO + zwemvaardigheid"}, cert:{ar:"KNZB licentie + EHBO", nl:"KNZB-licentie + EHBO"},
        next:{ar:"مدير حمام سباحة", nl:"Zwembadmanager"} },
      { id:"paardrij-instr", name:{ar:"مدرّب فروسية", nl:"Paardrij-instructeur (ORUN)"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تعليم الفروسية، رعاية الخيول، سلامة", nl:"Paardrijles, paardenverzorging, veiligheid"},
        entry:{ar:"VMBO + خبرة فروسية", nl:"VMBO + paardenervaring"}, cert:{ar:"ORUN-instructeur licentie", nl:"ORUN/FNRS-licentie"},
        next:{ar:"Manegehouder، مدرّب اتحاد", nl:"Manegehouder, bondscoach"} }
    ],

    uiterlijk: [
      { id:"barbier", name:{ar:"حلّاق رجالي (باربر)", nl:"Barbier / Herenkapper"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"قص شعر رجالي، حلاقة لحية تقليدية، تشذيب", nl:"Herenknippen, baardscheren, baardverzorging"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Barbier / Allround Kapper", nl:"Diploma Barbier / Allround Kapper"},
        next:{ar:"مالك صالون باربر", nl:"Eigen barbershop"} },
      { id:"visagist", name:{ar:"خبيرة مكياج", nl:"Visagist / Make-up Artist"}, levels:[3,4], duration:{ar:"خاصة", nl:"Specialisatie"},
        subjects:{ar:"مكياج عرائس، فن المسرح، أزياء، تصوير", nl:"Bruidsmake-up, theater, fashion, fotografie"},
        entry:{ar:"VMBO أو خبرة كابر", nl:"VMBO of kappersdiploma"}, cert:{ar:"Visagist (ANBOS)", nl:"Diploma Visagist (ANBOS)"},
        next:{ar:"خبير مؤثرات خاصة، فري لانس", nl:"SFX make-up, freelancer"} },
      { id:"nail-tech", name:{ar:"فنية أظافر", nl:"Nagelstyliste"}, levels:[2,3], duration:{ar:"دورة 3-9 أشهر", nl:"3-9 maanden cursus"},
        subjects:{ar:"مانيكير، باديكير، أظافر اصطناعية، Nail Art", nl:"Manicure, pedicure, kunstnagels, nail art"},
        entry:{ar:"بدون شروط", nl:"Geen vaste eisen"}, cert:{ar:"Nagelstyliste ANBOS", nl:"ANBOS Nagelstyliste"},
        next:{ar:"مالكة استوديو، مدرّبة", nl:"Eigen studio, docent"} }
    ],

    veiligheid: [
      { id:"brandwacht", name:{ar:"مساعد إطفاء صناعي", nl:"Brandwacht (industrie)"}, levels:[2,3], duration:{ar:"دورة 1-3 أسابيع", nl:"Korte cursus"},
        subjects:{ar:"الوقاية من الحرائق، الإطفاء الأولي، إخلاء", nl:"Brandpreventie, eerste brandbestrijding, ontruiming"},
        entry:{ar:"18+ + VCA", nl:"18+ + VCA"}, cert:{ar:"Brandwacht VCA + B", nl:"Brandwacht VCA + B"},
        next:{ar:"Beroepsbrandweer", nl:"Beroepsbrandweer"} },
      { id:"hondengeleider", name:{ar:"مدرّب كلاب أمن", nl:"Hondengeleider Beveiliging"}, levels:[3,4], duration:{ar:"تخصص 1-2 سنة", nl:"Specialisatie 1-2 jaar"},
        subjects:{ar:"تدريب كلاب الحراسة، تتبع، طاعة", nl:"Bewakingshonden trainen, sporen, gehoorzaamheid"},
        entry:{ar:"Beveiliger 2", nl:"Beveiliger 2"}, cert:{ar:"Hondengeleider SVPB", nl:"SVPB Hondengeleider"},
        next:{ar:"K9 Politie/Defensie", nl:"K9 Politie of Defensie"} },
      { id:"particulier-onderzoeker", name:{ar:"محقق خاص", nl:"Particulier Onderzoeker"}, levels:[4], duration:{ar:"دورة 6-12 شهر", nl:"6-12 maanden"},
        subjects:{ar:"تحقيقات خاصة، احتيال، قانون الخصوصية", nl:"Particulier onderzoek, fraude, privacywetgeving"},
        entry:{ar:"MBO 4 + خلفية أمنية", nl:"MBO 4 + beveiligingsachtergrond"}, cert:{ar:"SVPB-PO + POB-vergunning", nl:"SVPB-PO + POB-vergunning"},
        next:{ar:"وكالة تحقيقات خاصة", nl:"Eigen recherchebureau"} }
    ],

    toerisme: [
      { id:"reisadviseur", name:{ar:"مستشار سفر", nl:"Reisadviseur"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"حجز رحلات، Amadeus/Galileo، جغرافيا سياحية", nl:"Reizen boeken, Amadeus/Galileo, toeristische geografie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Reisadviseur MBO 4", nl:"Reisadviseur MBO 4"},
        next:{ar:"HBO Tourism Management", nl:"HBO Tourism Management"} },
      { id:"event-host", name:{ar:"منظّم فعاليات", nl:"Eventmedewerker / Host"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تنظيم الفعاليات، تنسيق الموردين، استقبال الضيوف", nl:"Eventorganisatie, leverancierscoördinatie, gastontvangst"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Eventmanager assistent MBO 4", nl:"Eventmanager assistent MBO 4"},
        next:{ar:"HBO Event Management", nl:"HBO Event Management"} }
    ],

    voedsel: [
      { id:"akkerbouw", name:{ar:"عامل زراعة حقلية", nl:"Akkerbouwer"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"زراعة الحبوب والبطاطس، تشغيل الجرّار، التربة", nl:"Granen en aardappelteelt, trekkers, bodembeheer"},
        entry:{ar:"VMBO Groen", nl:"VMBO Groen"}, cert:{ar:"Vakbekwaam akkerbouwer", nl:"Vakbekwaam akkerbouwer"},
        next:{ar:"مالك مزرعة، HBO Agribusiness", nl:"Eigen bedrijf, HBO Agribusiness"} },
      { id:"glastuinbouw", name:{ar:"عامل بيوت زجاجية", nl:"Medewerker Glastuinbouw"}, levels:[2,3,4], duration:{ar:"2-4 سنوات", nl:"2-4 jaar"},
        subjects:{ar:"زراعة محمية، طماطم وخيار، تكنولوجيا الزراعة", nl:"Kasteelt, tomaten en komkommer, kastechnologie"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Vakbekwaam medewerker teelt", nl:"Vakbekwaam medewerker teelt"},
        next:{ar:"مدير بيت زراعي", nl:"Bedrijfsleider kas"} },
      { id:"imker", name:{ar:"مربي نحل", nl:"Imker"}, levels:[3,4], duration:{ar:"خاصة", nl:"Specialisatie"},
        subjects:{ar:"تربية النحل، إنتاج العسل، صحة المستعمرات", nl:"Bijenhouderij, honingproductie, kolonie-gezondheid"},
        entry:{ar:"خلفية زراعية", nl:"Groene achtergrond"}, cert:{ar:"NBV Imker", nl:"NBV Imker certificaat"},
        next:{ar:"مالك منحل تجاري", nl:"Eigen imkerij"} }
    ],

    luchtvaart: [
      { id:"drone-piloot", name:{ar:"طيار طائرات بدون طيار", nl:"Dronepiloot (commercieel)"}, levels:[3,4], duration:{ar:"دورة 1-3 أشهر", nl:"1-3 maanden cursus"},
        subjects:{ar:"قواعد ILT، التصوير الجوي، السلامة", nl:"ILT-regelgeving, luchtfotografie, veiligheid"},
        entry:{ar:"18+ + VOG", nl:"18+ + VOG"}, cert:{ar:"EU-A1/A3 of A2 + ROC-light", nl:"EU-A1/A3 of A2 + ROC-light"},
        next:{ar:"Drone-operator، مفتش جوي", nl:"Drone-operator, luchtinspecteur"} }
    ],

    procestechniek: [
      { id:"chemisch-analist", name:{ar:"محلل كيميائي", nl:"Chemisch Analist"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تحليل مختبري، GC/HPLC، تقارير علمية", nl:"Laboratoriumanalyse, GC/HPLC, wetenschappelijke rapportage"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"Chemisch-fysisch analist MBO 4", nl:"Chemisch-fysisch analist MBO 4"},
        next:{ar:"HBO Chemie", nl:"HBO Chemie"} },
      { id:"biotech-laborant", name:{ar:"فني بيوتكنولوجيا", nl:"Biotechnologisch Laborant"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"PCR، زراعة الخلايا، الميكروبيولوجيا", nl:"PCR, celkweek, microbiologie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Biotechnologisch analist", nl:"Biotechnologisch analist MBO 4"},
        next:{ar:"HBO Biotechnologie", nl:"HBO Biotechnologie"} }
    ],

    energie: [
      { id:"zonnepaneel-inst", name:{ar:"فني تركيب الألواح الشمسية", nl:"Monteur Zonnepanelen"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تركيب PV، Inverter، السقف الآمن", nl:"PV-installatie, omvormers, veilig dakwerk"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Zonnestroom monteur + VCA", nl:"Zonnestroommonteur + VCA"},
        next:{ar:"Solar Engineer، مالك شركة", nl:"Solar engineer, eigen bedrijf"} },
      { id:"windturbine-tech", name:{ar:"فني توربينات الرياح", nl:"Windturbinetechnicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"صيانة التوربينات، تسلق آمن، إلكترونيات قوة", nl:"Turbineonderhoud, veilig klimmen, vermogenselektronica"},
        entry:{ar:"VMBO TL + GWO", nl:"VMBO TL + GWO certificaat"}, cert:{ar:"Wind Technician GWO", nl:"Wind Technician GWO"},
        next:{ar:"Lead Technician، Offshore", nl:"Lead Technician, Offshore wind"} },
      { id:"warmtepomp-inst", name:{ar:"فني مضخات حرارية", nl:"Monteur Warmtepompen"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"مضخات حرارية، تبريد، عوازل", nl:"Warmtepompen, koeltechniek, isolatie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Erkend installateur Warmtepomp", nl:"ISSO Erkend Warmtepompinstallateur"},
        next:{ar:"Energie-adviseur HBO", nl:"Energie-adviseur HBO"} }
    ],

    maritiem: [
      { id:"scheepswerktuigkundige", name:{ar:"مهندس ميكانيكي بحري", nl:"Scheepswerktuigkundige"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"محركات السفن، أنظمة هيدروليكية، صيانة", nl:"Scheepsmotoren, hydrauliek, onderhoud"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"STCW + Maritiem Officier MBO 4", nl:"STCW + Maritiem Officier MBO 4"},
        next:{ar:"HBO Maritime Officer", nl:"HBO Maritime Officer"} },
      { id:"havenmedewerker", name:{ar:"موظف ميناء", nl:"Havenmedewerker / Stuwadoor"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"شحن وتفريغ الحاويات، رافعات، لوجستيات", nl:"Containers laden/lossen, kranen, logistiek"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Logistiek medewerker haven", nl:"Logistiek medewerker haven"},
        next:{ar:"Voorman terminal", nl:"Voorman/teamleider terminal"} }
    ],

    "creatief-ambacht": [
      { id:"leerbewerker", name:{ar:"مشغّل جلد", nl:"Leerbewerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"حقائب، أحذية، أحزمة، صباغة الجلد", nl:"Tassen, schoenen, riemen, leerverven"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Leerbewerker", nl:"Diploma Leerbewerker"},
        next:{ar:"مالك ورشة جلد", nl:"Eigen leeratelier"} },
      { id:"pottenbakker", name:{ar:"خزّاف (فخار)", nl:"Pottenbakker / Keramist"}, levels:[2,3,4], duration:{ar:"خاصة", nl:"Specialisatie"},
        subjects:{ar:"تشكيل الفخار، التزجيج، الفرن", nl:"Drechselen, glazuren, ovenbeheer"},
        entry:{ar:"بدون شروط رسمية", nl:"Geen vaste eisen"}, cert:{ar:"Keramist (vakopleiding)", nl:"Keramist (vakopleiding)"},
        next:{ar:"معرض شخصي، فنان", nl:"Eigen galerie, kunstenaar"} },
      { id:"instrumentenbouwer", name:{ar:"صانع آلات موسيقية", nl:"Instrumentenbouwer / Vioolbouwer"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"بناء وإصلاح آلات وترية ونفخ، نجارة دقيقة", nl:"Bouwen en reparatie van strijk-/blaasinstrumenten, fijn houtwerk"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Instrumentenbouwer", nl:"Diploma Instrumentenbouwer"},
        next:{ar:"Restaurateur klassieke instrumenten", nl:"Restaurateur klassieke instrumenten"} },
      { id:"restaurator-kunst", name:{ar:"مرمّم فنون", nl:"Restaurator kunstwerken"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"ترميم لوحات وأثاث، كيمياء، تاريخ الفن", nl:"Restauratie schilderijen/meubels, chemie, kunstgeschiedenis"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"Restauratievak MBO 4", nl:"Restauratievak MBO 4"},
        next:{ar:"HBO Restauratie/Conservering", nl:"HBO Restauratie/Conservering"} },
      { id:"kleermaker", name:{ar:"خيّاط", nl:"Coupeur / Maatkleermaker"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تصميم وتفصيل، أنماط، خياطة دقيقة", nl:"Patroontekenen, modelleren, hoogwaardig naaiwerk"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Couture / Coupeur MBO 4", nl:"Couture / Coupeur MBO 4"},
        next:{ar:"دار أزياء خاصة، HBO Fashion", nl:"Eigen atelier, HBO Fashion & Design"} }
    ]
  };

  // 3 NEW SECTORS
  const MORE_SECTORS_V4 = [
    { id:"dier", icon:"🐾", name:{ar:"الحيوانات والبيطرة", nl:"Dier & Diergeneeskunde"},
      professions: [
        { id:"dierenarts-assist", name:{ar:"مساعد طبيب بيطري", nl:"Dierenartsassistent"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تشريح الحيوانات، أدوية، مساعدة في العمليات", nl:"Anatomie dieren, medicatie, OK-assistentie"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Dierenartsassistent paraveterinair MBO 4", nl:"Dierenartsassistent paraveterinair MBO 4"},
          next:{ar:"HBO Diergeneeskunde", nl:"HBO Diermanagement"} },
        { id:"hondentrimmer", name:{ar:"مزيّن الكلاب", nl:"Hondentrimmer / Trimster"}, levels:[2,3], duration:{ar:"دورة 9-12 شهر", nl:"9-12 maanden cursus"},
          subjects:{ar:"تنظيف وقص شعر الكلاب حسب السلالة، شامبو", nl:"Trimmen per ras, vacht- en huidverzorging"},
          entry:{ar:"بدون شروط رسمية", nl:"Geen vaste eisen"}, cert:{ar:"Allround Trimster (Vakgroep)", nl:"Allround Trimster (Vakgroep Trimmers)"},
          next:{ar:"مالكة صالون كلاب", nl:"Eigen trimsalon"} },
        { id:"hoefsmid", name:{ar:"حدّاد حوافر", nl:"Hoefsmid"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"تركيب الحدوات، تشريح حوافر الخيل، صحة", nl:"Beslaan van paarden, anatomie hoeven, hoefverzorging"},
          entry:{ar:"VMBO + خبرة خيول", nl:"VMBO + paardenervaring"}, cert:{ar:"Hoefsmid (SVGB)", nl:"Erkend Hoefsmid (SVGB)"},
          next:{ar:"Specialist orthopedische beslag", nl:"Orthopedisch hoefsmid"} },
        { id:"paardenverzorger", name:{ar:"مربّي خيول", nl:"Paardenverzorger / Stalmedewerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
          subjects:{ar:"رعاية يومية للخيول، تنظيف الإسطبلات، تغذية", nl:"Dagelijkse paardenverzorging, stalwerk, voeding"},
          entry:{ar:"VMBO Groen", nl:"VMBO Groen"}, cert:{ar:"Bedrijfsleider Paardenhouderij", nl:"Bedrijfsleider Paardenhouderij"},
          next:{ar:"Manegehouder، instructeur", nl:"Manegehouder, instructeur"} },
        { id:"dierenpark-medewerker", name:{ar:"موظف حديقة حيوانات", nl:"Dierenparkverzorger"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"رعاية الحيوانات البرية، إثراء بيئي، تثقيف الزوار", nl:"Verzorging wilde dieren, environmental enrichment, publiekseducatie"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Dierverzorging Wildlife MBO 4", nl:"Dierverzorging Wildlife MBO 4"},
          next:{ar:"Manager dierenpark", nl:"Hoofdverzorger dierenpark"} },
        { id:"viskweker", name:{ar:"مربي أسماك", nl:"Aquacultuurmedewerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
          subjects:{ar:"تربية الأسماك، جودة المياه، تغذية", nl:"Visteelt, waterkwaliteit, voeding"},
          entry:{ar:"VMBO Groen", nl:"VMBO Groen"}, cert:{ar:"Aquacultuur MBO 3", nl:"Aquacultuur MBO 3"},
          next:{ar:"مالك مزرعة سمكية", nl:"Eigen viskwekerij"} }
      ]
    },

    { id:"muziek-podium", icon:"🎵", name:{ar:"الموسيقى والفنون المسرحية", nl:"Muziek & Podiumkunsten"},
      professions: [
        { id:"licht-tech", name:{ar:"فني إضاءة مسرحية", nl:"Lichttechnicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تصميم الإضاءة، DMX، Grand MA، عروض حية", nl:"Lichtontwerp, DMX, Grand MA, live shows"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"AV-specialist Licht MBO 4", nl:"AV-specialist Licht MBO 4"},
          next:{ar:"Lichtontwerper، HBO Theatertechniek", nl:"Lichtontwerper, HBO Theatertechniek"} },
        { id:"podium-tech", name:{ar:"فني تركيب مسارح", nl:"Podiumtechnicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تركيب رافعات، رفع آمن، أنظمة معلّقة", nl:"Trekkenwand, veilig hijsen, riggingsystemen"},
          entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Podiumtechnicus + Rigging cert.", nl:"Podiumtechnicus + Rigger cert."},
          next:{ar:"Stagemanager", nl:"Stagemanager"} },
        { id:"event-tech", name:{ar:"فني فعاليات", nl:"Eventtechnicus"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"الصوت + الإضاءة + الفيديو لفعاليات", nl:"Geluid + licht + video voor evenementen"},
          entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"AV-Eventtechnicus MBO 4", nl:"AV-Eventtechnicus MBO 4"},
          next:{ar:"Technisch productieleider", nl:"Technisch productieleider"} },
        { id:"musical-performer", name:{ar:"ممثل مسرحي/موسيقي", nl:"Musical Performer (vooropleiding)"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"غناء، رقص، تمثيل، أداء مسرحي", nl:"Zang, dans, acteren, performance"},
          entry:{ar:"اختبار قبول + شغف", nl:"Toelatingsaudities"}, cert:{ar:"Musicaltheater MBO 4", nl:"Musicaltheater MBO 4"},
          next:{ar:"HBO Musical/Theaterschool", nl:"HBO Musicalopleiding/Theaterschool"} },
        { id:"dansdocent-mbo", name:{ar:"مدرّس رقص", nl:"Dansdocent (vakopleiding)"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تقنيات الرقص، تدريس، تشريح حركي", nl:"Danstechnieken, didactiek, bewegingsanatomie"},
          entry:{ar:"اختبار قبول", nl:"Auditie"}, cert:{ar:"Dans MBO 4", nl:"Dans MBO 4"},
          next:{ar:"HBO Dansdocent", nl:"HBO Dansdocent"} },
        { id:"theatermaker", name:{ar:"صانع مسرح", nl:"Theatermaker"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"كتابة، إخراج، إنتاج عرض", nl:"Schrijven, regie, voorstellingproductie"},
          entry:{ar:"اختبار + بورتفوليو", nl:"Auditie + portfolio"}, cert:{ar:"Theatermaker MBO 4", nl:"Theatermaker MBO 4"},
          next:{ar:"HBO Theaterschool", nl:"HBO Theaterschool"} },
        { id:"music-producer", name:{ar:"منتج موسيقي", nl:"Music Producer / Sound Engineer"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"DAW (Ableton/Logic/Pro Tools)، ميكس وماستر، إنتاج", nl:"DAW (Ableton/Logic/Pro Tools), mixing, mastering, productie"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Music Producer MBO 4", nl:"Music Producer MBO 4"},
          next:{ar:"HBO Music Production", nl:"HBO Music Production"} }
      ]
    },

    { id:"drukwerk", icon:"🖨️", name:{ar:"الطباعة والورق", nl:"Drukwerk & Papier"},
      professions: [
        { id:"drukker", name:{ar:"طبّاع صناعي", nl:"Drukker (offset/digitaal)"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
          subjects:{ar:"طباعة أوفست، رقمية، إدارة الألوان", nl:"Offsetdruk, digitale druk, kleurbeheer"},
          entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Drukker", nl:"Diploma Drukker"},
          next:{ar:"Mediaproductie MBO 4", nl:"Mediaproductie MBO 4"} },
        { id:"prepress-operator", name:{ar:"فني ما قبل الطباعة", nl:"Prepress / DTP operator"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"InDesign، تجهيز ملفات للطباعة، تدقيق ألوان", nl:"InDesign, drukbestanden voorbereiden, kleurproef"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Prepress operator MBO 4", nl:"Prepress operator MBO 4"},
          next:{ar:"DTP Specialist، Mediavormgever", nl:"DTP-specialist, Mediavormgever"} },
        { id:"signmaker", name:{ar:"صانع لافتات", nl:"Signmaker / Signspecialist"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
          subjects:{ar:"طباعة لافتات، ملصقات سيارات، ستيكر، Plotter", nl:"Signing, autobelettering, stickers, plotter"},
          entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Signmaker MBO 3", nl:"Signmaker MBO 3"},
          next:{ar:"Allround signspecialist MBO 4", nl:"Allround signspecialist MBO 4"} },
        { id:"verpakkingsontwerp", name:{ar:"مصمم تغليف", nl:"Verpakkingsspecialist"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تصميم العبوات، الكرتون، الاستدامة", nl:"Verpakkingsdesign, karton, duurzaamheid"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Verpakkingsspecialist MBO 4", nl:"Verpakkingsspecialist MBO 4"},
          next:{ar:"HBO Packaging Design", nl:"HBO Packaging Design"} },
        { id:"boekbinder", name:{ar:"مجلّد كتب", nl:"Boekbinder"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
          subjects:{ar:"تجليد يدوي وآلي، ترميم كتب", nl:"Handmatig en machinaal binden, boekrestauratie"},
          entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Boekbinder", nl:"Diploma Boekbinder"},
          next:{ar:"Restaurator boeken", nl:"Restaurator boeken"} }
      ]
    }
  ];

  // Merge ADD3 into existing sectors
  for (const [sid, pros] of Object.entries(ADD3)) {
    const s = MBO_SECTOR_BY_ID[sid];
    if (s && Array.isArray(pros)) s.professions.push(...pros);
  }
  // Add new sectors
  for (const ns of MORE_SECTORS_V4) {
    if (!MBO_SECTOR_BY_ID[ns.id]) {
      MBO_SECTORS.push(ns);
      MBO_SECTOR_BY_ID[ns.id] = ns;
    }
  }
})();

/* ═══════════════════════════════════════════════════════════
   EXPANSION PACK V5 — extra specialty MBO professions
   Adds ~60 more professions, plus 2 new sectors (water, preventie)
═══════════════════════════════════════════════════════════ */
(function expandProfessionsV5(){
  const ADD4 = {
    techniek: [
      { id:"automation-eng-mbo", name:{ar:"فني أتمتة صناعية", nl:"Automatiseringstechnicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"PLC، SCADA، أتمتة خطوط إنتاج", nl:"PLC, SCADA, lijn-automatisering"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Mechatronica MBO 4", nl:"Mechatronica MBO 4"},
        next:{ar:"HBO Elektrotechniek", nl:"HBO Elektrotechniek"} },
      { id:"3d-print-operator", name:{ar:"مشغّل طابعة 3D", nl:"3D-printoperator"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"FDM/SLA، مواد متقدمة، CAD slicing", nl:"FDM/SLA, materialen, CAD/slicing"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Allround Verspaner / 3D Print MBO 3", nl:"Allround Verspaner / 3D Print MBO 3"},
        next:{ar:"R&D-tech، إنتاج إضافي", nl:"R&D, additive manufacturing"} },
      { id:"pcb-monteur", name:{ar:"مونتيير لوحات PCB", nl:"PCB-monteur"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"لحام SMD، مخططات إلكترونية، اختبار", nl:"SMD-solderen, schema's, testen"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Mediatechnologie/Elektro MBO 3", nl:"Mediatechnologie/Elektro MBO 3"},
        next:{ar:"Embedded technicus MBO 4", nl:"Embedded technicus MBO 4"} },
      { id:"scheepsbouw-mbo", name:{ar:"عامل بناء سفن", nl:"Scheepsbouwer"}, levels:[2,3,4], duration:{ar:"2-4 سنوات", nl:"2-4 jaar"},
        subjects:{ar:"بناء بدن السفن، لحام بحري، تركيب", nl:"Casco-bouw, scheepslassen, montage"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Scheepsbouw MBO 3/4", nl:"Scheepsbouw MBO 3/4"},
        next:{ar:"Scheepswerktuigkundige", nl:"Scheepswerktuigkundige"} }
    ],

    bouw: [
      { id:"betonwerker", name:{ar:"عامل خرسانة", nl:"Betonwerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"صب الخرسانة، تشحين، تسوية", nl:"Beton storten, vlechten, afwerken"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Betonwerker", nl:"Diploma Betonwerker"},
        next:{ar:"Bouwkundig opzichter", nl:"Bouwkundig opzichter"} },
      { id:"straatmaker", name:{ar:"عامل رصف الطرق", nl:"Straatmaker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"رصف، أسس الطرق، أرصفة، نظافة", nl:"Bestraten, fundering, trottoirs"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Straatmaker", nl:"Diploma Straatmaker"},
        next:{ar:"Voorman GWW", nl:"Voorman GWW"} },
      { id:"heier", name:{ar:"عامل دق الأوتاد", nl:"Heier"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تشغيل آلات الدق، أساسات", nl:"Heimachines bedienen, funderingen"},
        entry:{ar:"VMBO + 18+", nl:"VMBO + 18+"}, cert:{ar:"Heimachinist NEN", nl:"Heimachinist (NEN)"},
        next:{ar:"Funderingsspecialist", nl:"Funderingsspecialist"} },
      { id:"groenvoorziening", name:{ar:"عامل تنسيق الحدائق", nl:"Hovenier / Groenmedewerker"}, levels:[2,3,4], duration:{ar:"2-4 سنوات", nl:"2-4 jaar"},
        subjects:{ar:"تصميم الحدائق، زراعة، صيانة المساحات الخضراء", nl:"Tuinontwerp, beplanting, groenonderhoud"},
        entry:{ar:"VMBO Groen", nl:"VMBO Groen"}, cert:{ar:"Hovenier MBO 2/3/4", nl:"Hovenier MBO 2/3/4"},
        next:{ar:"HBO Tuin- en Landschapsinrichting", nl:"HBO Tuin- en Landschapsinrichting"} }
    ],

    ict: [
      { id:"embedded-dev", name:{ar:"مبرمج أنظمة مدمجة", nl:"Embedded Developer"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"C/C++، Microcontrollers، RTOS، IoT", nl:"C/C++, microcontrollers, RTOS, IoT"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Software Developer Embedded", nl:"Software Developer Embedded"},
        next:{ar:"HBO Embedded Systems", nl:"HBO Embedded Systems"} },
      { id:"crm-admin", name:{ar:"مسؤول CRM", nl:"CRM-beheerder"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"Salesforce، HubSpot، إعداد التقارير، أتمتة", nl:"Salesforce, HubSpot, rapportages, automatisering"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Application Manager MBO 4", nl:"Application Manager MBO 4"},
        next:{ar:"Salesforce Administrator", nl:"Salesforce Administrator"} },
      { id:"saas-support", name:{ar:"دعم تطبيقات سحابية", nl:"SaaS Application Support"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"دعم العملاء، استكشاف أخطاء سحابية، APIs", nl:"Klantenservice, cloud troubleshooting, APIs"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"ICT-medewerker MBO 4", nl:"ICT-medewerker MBO 4"},
        next:{ar:"Customer Success، DevOps", nl:"Customer Success, DevOps"} }
    ],

    media: [
      { id:"3d-modelleur", name:{ar:"مصمم نماذج 3D", nl:"3D Modelleur"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"Blender، Maya، Texturing، Render", nl:"Blender, Maya, texturing, render"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Mediavormgever 3D Animation", nl:"Mediavormgever 3D Animation"},
        next:{ar:"HBO Game Design / Animation", nl:"HBO Game Design / Animation"} },
      { id:"motion-designer", name:{ar:"مصمم رسوم متحركة", nl:"Motion Designer"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"After Effects، Cinema 4D، Storyboarding", nl:"After Effects, Cinema 4D, storyboarding"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Mediavormgever Motion", nl:"Mediavormgever Motion"},
        next:{ar:"HBO Animation/Motion", nl:"HBO Animation/Motion"} },
      { id:"social-influencer-mbo", name:{ar:"مؤثر إعلامي رقمي", nl:"Influencer / Vlogger (vakopleiding)"}, levels:[3,4], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"بناء العلامة الشخصية، تصوير الفيديو، تحرير", nl:"Persoonlijk merk, video, montage"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Marketing/Communicatie", nl:"Marketing/Communicatie"},
        next:{ar:"Eigen onderneming", nl:"Eigen onderneming"} }
    ],

    zorg: [
      { id:"apotheekmedewerker", name:{ar:"موظف صيدلية", nl:"Apothekersassistent"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"الأدوية، التحضير، إرشاد المرضى", nl:"Medicatie, bereidingen, patiëntenvoorlichting"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Apothekersassistent MBO 4", nl:"Apothekersassistent MBO 4"},
        next:{ar:"HBO Farmakunde", nl:"HBO Farmakunde"} },
      { id:"radiologisch-assist", name:{ar:"مساعد أشعة", nl:"Radiologisch laborant assistent"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"أشعة سينية، CT، السلامة الإشعاعية", nl:"Röntgen, CT, stralingsveiligheid"},
        entry:{ar:"VMBO TL/HAVO", nl:"VMBO TL/HAVO"}, cert:{ar:"Doktersassistent + specialisatie", nl:"Doktersassistent + specialisatie"},
        next:{ar:"HBO Medisch Beeldvormende", nl:"HBO Medisch Beeldvormende Technieken"} },
      { id:"tandtechnicus", name:{ar:"فني أسنان", nl:"Tandtechnicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"صنع أطقم الأسنان، تيجان، CAD/CAM طبي", nl:"Vervaardigen prothesen, kronen, dentale CAD/CAM"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Tandtechnicus MBO 4", nl:"Tandtechnicus MBO 4"},
        next:{ar:"HBO Tandprothetiek", nl:"HBO Tandprothetiek"} },
      { id:"ergo-assist", name:{ar:"مساعد علاج وظيفي", nl:"Ergotherapie-assistent"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"إعادة التأهيل اليومي، أدوات تكيفية", nl:"Dagelijkse activiteiten, hulpmiddelen"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Begeleider Specifieke Doelgroepen", nl:"Begeleider Specifieke Doelgroepen"},
        next:{ar:"HBO Ergotherapie", nl:"HBO Ergotherapie"} }
    ],

    horeca: [
      { id:"restaurantmanager-jr", name:{ar:"مدير مطعم مساعد", nl:"Restaurantmanager (junior)"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"إدارة فريق، تكلفة، خدمة فاخرة", nl:"Teamleiding, kostprijs, fine dining service"},
        entry:{ar:"MBO 3 Gastheer", nl:"MBO 3 Gastheer"}, cert:{ar:"Manager/Ondernemer Horeca MBO 4", nl:"Manager/Ondernemer Horeca MBO 4"},
        next:{ar:"HBO Hotel/Hospitality Management", nl:"HBO Hotel/Hospitality Management"} },
      { id:"barman-mixoloog", name:{ar:"بارمان (ميكسولوجست)", nl:"Bartender / Mixoloog"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"كوكتيلات كلاسيكية، تقنية الخلط، طباعة الكاشير", nl:"Klassieke cocktails, mixtechnieken, kassasystemen"},
        entry:{ar:"VMBO + 18+ for alcohol", nl:"VMBO + 18+ voor alcohol"}, cert:{ar:"Gastheer + Bartending cert.", nl:"Gastheer + Bartending cert."},
        next:{ar:"Head Bartender", nl:"Head Bartender"} },
      { id:"cateringmedewerker", name:{ar:"موظف تقديم الطعام (كيترينغ)", nl:"Cateringmedewerker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تجهيز الحفلات، خدمة بوفيه، خدمة كبيرة", nl:"Eventcatering, buffet, grootkeuken"},
        entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Cateringmedewerker / Gastheer 2/3", nl:"Cateringmedewerker / Gastheer 2/3"},
        next:{ar:"Eventmanager horeca", nl:"Eventmanager horeca"} }
    ],

    mobiliteit: [
      { id:"auto-elektronica", name:{ar:"فني إلكترونيات سيارات", nl:"Auto-elektronica technicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"CAN-bus، تشخيص ADAS، أنظمة infotainment", nl:"CAN-bus, ADAS-diagnose, infotainment"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Eerste Autotechnicus MBO 4", nl:"Eerste Autotechnicus MBO 4"},
        next:{ar:"HBO Automotive", nl:"HBO Automotive"} },
      { id:"hybrid-ev-tech", name:{ar:"فني سيارات هجينة وكهربائية", nl:"Hybride/EV-technicus"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"بطاريات HV، السلامة الكهربائية، شاحنات", nl:"HV-batterijen, elektrische veiligheid, laadtech"},
        entry:{ar:"MBO 3 Auto", nl:"MBO 3 Auto"}, cert:{ar:"NEN 9140 + Specialist EV", nl:"NEN 9140 + Specialist EV"},
        next:{ar:"Master Technician EV", nl:"Master Technician EV"} },
      { id:"pijpmonteur", name:{ar:"فني تركيب أنابيب", nl:"Pijpfitter / Pijpmonteur"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"قراءة isometric، لحام أنابيب، صناعي", nl:"Isometrisch lezen, pijplassen, industrieel"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Pijpfitter VCA", nl:"Pijpfitter VCA"},
        next:{ar:"Procesoperator", nl:"Procesoperator"} }
    ],

    onderwijs: [
      { id:"sportcoach-school", name:{ar:"مدرّب رياضة في المدرسة", nl:"Sport- en bewegingscoach (school)"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"التربية الحركية، الألعاب، التغذية الرياضية", nl:"Bewegingsonderwijs, spelvormen, sportvoeding"},
        entry:{ar:"VMBO + sportieve achtergrond", nl:"VMBO + sportachtergrond"}, cert:{ar:"Sport en Bewegen MBO 4", nl:"Sport en Bewegen MBO 4"},
        next:{ar:"HBO ALO (Sportleraar)", nl:"HBO ALO (Sportleraar)"} }
    ],

    sport: [
      { id:"personal-trainer-mbo", name:{ar:"مدرّب شخصي للياقة", nl:"Personal Trainer"}, levels:[4], duration:{ar:"دورة 6-12 شهر + MBO", nl:"6-12 maanden cursus + MBO"},
        subjects:{ar:"تشريح، تدريب القوة، التغذية، علم النفس الرياضي", nl:"Anatomie, krachttraining, voeding, sportpsychologie"},
        entry:{ar:"MBO 3 Sport", nl:"MBO 3 Sport en Bewegen"}, cert:{ar:"NL Actief Personal Trainer", nl:"NL Actief Personal Trainer A/B"},
        next:{ar:"مالك studio، coach", nl:"Eigen studio, coach"} },
      { id:"yogadocent-mbo", name:{ar:"مدرّب يوغا", nl:"Yogadocent"}, levels:[3,4], duration:{ar:"تدريب 200-500 ساعة", nl:"200-500u opleiding"},
        subjects:{ar:"وضعيات اليوغا، التنفس، التشريح", nl:"Asana's, pranayama, anatomie"},
        entry:{ar:"بدون شروط رسمية", nl:"Geen vaste eisen"}, cert:{ar:"Yoga Alliance RYT 200/500", nl:"Yoga Alliance RYT 200/500"},
        next:{ar:"مالك استوديو، تخصصات (yin/vinyasa)", nl:"Eigen studio, specialisaties"} }
    ],

    uiterlijk: [
      { id:"laser-ontharing", name:{ar:"فني إزالة الشعر بالليزر", nl:"Laserontharingsspecialist"}, levels:[4], duration:{ar:"دورة 6-9 شهر", nl:"6-9 maanden cursus"},
        subjects:{ar:"فيزياء الليزر، أنواع البشرة، السلامة", nl:"Laserfysica, huidtypen, veiligheid"},
        entry:{ar:"Schoonheidsspecialiste niveau 4", nl:"Schoonheidsspecialiste niveau 4"}, cert:{ar:"Specialisatie laser ANBOS", nl:"Specialisatie Laser ANBOS"},
        next:{ar:"Eigen kliniek", nl:"Eigen kliniek"} },
      { id:"tattoo-artist", name:{ar:"فنان وشم", nl:"Tattoo Artist"}, levels:[3,4], duration:{ar:"تدريب مهني 1-3 سنوات", nl:"Beroepsopleiding 1-3 jaar"},
        subjects:{ar:"السلامة، التعقيم، أساليب الرسم", nl:"Hygiëne, sterilisatie, tekentechnieken"},
        entry:{ar:"بدون شروط + portfolio", nl:"Geen vaste eisen + portfolio"}, cert:{ar:"Hygiëne Code Tattoo (GGD)", nl:"Hygiënecode Tatoeëren (GGD)"},
        next:{ar:"مالك Tattoo studio", nl:"Eigen tattoostudio"} }
    ],

    veiligheid: [
      { id:"handhaver-straat", name:{ar:"مفتش إنفاذ بلدي", nl:"Handhaver Toezicht & Veiligheid (HTV)"}, levels:[3], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"قانون APV، التواصل، تطبيق المخالفات", nl:"APV, communicatie, handhaving"},
        entry:{ar:"VMBO TL + VOG", nl:"VMBO TL + VOG"}, cert:{ar:"HTV niveau 3", nl:"HTV niveau 3"},
        next:{ar:"Boa، politie", nl:"Boa, politie"} },
      { id:"douane-medewerker", name:{ar:"موظف جمارك", nl:"Douanemedewerker"}, levels:[3,4], duration:{ar:"تدريب داخلي 1-2 سنة", nl:"Interne opleiding 1-2 jaar"},
        subjects:{ar:"تشريعات الجمارك، فحص الحاويات، تحقيقات", nl:"Douanewetgeving, containercontrole, opsporing"},
        entry:{ar:"MBO 4 + procedure", nl:"MBO 4 + selectieprocedure"}, cert:{ar:"Diploma Douane", nl:"Diploma Douane"},
        next:{ar:"Inspecteur Douane", nl:"Inspecteur Douane"} }
    ],

    voedsel: [
      { id:"kaasmaker", name:{ar:"صانع جبن", nl:"Kaasmaker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تخمر الحليب، تصنيف الأجبان، صحة غذائية", nl:"Zuivelfermentatie, kaassoorten, voedselveiligheid"},
        entry:{ar:"VMBO Groen", nl:"VMBO Groen"}, cert:{ar:"Vakbekwaam Kaasmaker", nl:"Vakbekwaam Kaasmaker"},
        next:{ar:"Master Kaasmaker", nl:"Master Kaasmaker"} },
      { id:"bloemenbinder", name:{ar:"منسّق زهور", nl:"Bloembinder / Floral Designer"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تنسيق الباقات، نظرية الألوان، تصميم", nl:"Boeketten, kleurenleer, design"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Vakbekwaam Medewerker Bloem", nl:"Vakbekwaam Medewerker Bloem & Design"},
        next:{ar:"Master Florist، مالكة محل", nl:"Master Florist, eigen winkel"} }
    ],

    procestechniek: [
      { id:"bier-brouwer", name:{ar:"صانع بيرة", nl:"Brouwer (bier)"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"تخمر، شعير، تنظيف خزانات", nl:"Brouwprocessen, mout, tankreiniging"},
        entry:{ar:"VMBO TL + 18+", nl:"VMBO TL + 18+"}, cert:{ar:"Brouwer (Brouwacademie)", nl:"Brouwer Brouwacademie"},
        next:{ar:"Master Brouwer", nl:"Master Brouwer"} },
      { id:"zuivel-tech", name:{ar:"فني صناعة الألبان", nl:"Zuiveltechnoloog"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"بسترة، تجميد، إنتاج زبادي وحليب", nl:"Pasteurisatie, fermentatie, zuivelproductie"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Procesoperator A/B Zuivel", nl:"Procesoperator A/B Zuivel"},
        next:{ar:"HBO Levensmiddelentechnologie", nl:"HBO Levensmiddelentechnologie"} }
    ],

    energie: [
      { id:"batterij-tech", name:{ar:"فني بطاريات تخزين", nl:"Battery Storage Technicus"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"بطاريات Li-ion، BMS، السلامة الكهربائية", nl:"Li-ion batterijen, BMS, elektrische veiligheid"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Eerste Monteur Energie", nl:"Eerste Monteur Energie"},
        next:{ar:"HBO Elektrotechniek", nl:"HBO Elektrotechniek"} }
    ],

    handel: [
      { id:"category-manager-jr", name:{ar:"مساعد مدير فئات", nl:"Junior Categorymanager"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تحليل المبيعات، Excel، تخطيط البضائع", nl:"Verkoopanalyse, Excel, assortimentsplanning"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Manager Retail MBO 4", nl:"Manager Retail MBO 4"},
        next:{ar:"HBO Commerciële Economie", nl:"HBO Commerciële Economie"} }
    ],

    economie: [
      { id:"controller-assist", name:{ar:"مساعد محاسب رقابي", nl:"Assistent Controller"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تحليل ميزانية، KPI، Excel متقدم، ERP", nl:"Budgetanalyse, KPI, Excel-advanced, ERP"},
        entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Bedrijfsadministrateur MBO 4", nl:"Bedrijfsadministrateur MBO 4"},
        next:{ar:"HBO Bedrijfseconomie", nl:"HBO Bedrijfseconomie"} }
    ],

    "creatief-ambacht": [
      { id:"glasblazer", name:{ar:"نافخ زجاج", nl:"Glasblazer"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تشكيل الزجاج، التصميم، أفران الزجاج", nl:"Glasvormgeving, design, glasovens"},
        entry:{ar:"بدون شروط رسمية", nl:"Geen vaste eisen"}, cert:{ar:"Glasblazer (vakopleiding)", nl:"Glasblazer (vakopleiding)"},
        next:{ar:"فنّان، استوديو شخصي", nl:"Eigen atelier, kunstenaar"} },
      { id:"schoenmaker", name:{ar:"إسكافي", nl:"Schoenmaker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"تصليح أحذية، صناعة جلدية، تصميم", nl:"Schoenreparatie, leerbewerking, design"},
        entry:{ar:"VMBO BB", nl:"VMBO BB"}, cert:{ar:"Schoenhersteller", nl:"Diploma Schoenhersteller"},
        next:{ar:"مالك ورشة، orthopedische schoenmaker", nl:"Eigen werkplaats, orthopedisch schoenmaker"} }
    ],

    "muziek-podium": [
      { id:"theater-kostuummaker", name:{ar:"خياط أزياء مسرحية", nl:"Theaterkostuummaker"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
        subjects:{ar:"تصميم أزياء تاريخية، تفصيل، إصلاح", nl:"Historisch kostuumontwerp, naaien, restauratie"},
        entry:{ar:"VMBO + portfolio", nl:"VMBO + portfolio"}, cert:{ar:"Kostuummaker (vakopleiding)", nl:"Kostuummaker (vakopleiding)"},
        next:{ar:"HBO Costume Design", nl:"HBO Costume Design"} },
      { id:"theater-decorbouwer", name:{ar:"بناء مناظر مسرحية", nl:"Decorbouwer"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
        subjects:{ar:"بناء مناظر، نجارة مسرحية، طلاء", nl:"Decorbouw, theatertechniek, schilderen"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Decorbouwer MBO 3", nl:"Decorbouwer MBO 3"},
        next:{ar:"Theaterproductie", nl:"Theaterproductie"} }
    ],

    drukwerk: [
      { id:"textielbedrukker", name:{ar:"طبّاع منسوجات", nl:"Textielbedrukker"}, levels:[2,3], duration:{ar:"2-3 سنوات", nl:"2-3 jaar"},
        subjects:{ar:"طباعة قمصان، sublimation، DTF", nl:"Shirtdruk, sublimatie, DTF"},
        entry:{ar:"VMBO", nl:"VMBO"}, cert:{ar:"Mediaproductie MBO 3", nl:"Mediaproductie MBO 3"},
        next:{ar:"مالك ورشة طباعة", nl:"Eigen drukkerij"} }
    ]
  };

  const MORE_SECTORS_V5 = [
    { id:"water", icon:"💧", name:{ar:"المياه والبيئة المائية", nl:"Water & Watermanagement"},
      professions: [
        { id:"watermanagement-med", name:{ar:"موظف إدارة مياه", nl:"Medewerker Watermanagement"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"إدارة المياه، السدود، الفيضانات، GIS", nl:"Waterbeheer, dijken, overstromingen, GIS"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Waterbeheer MBO 4", nl:"Waterbeheer MBO 4"},
          next:{ar:"HBO Watermanagement / Civiele Techniek", nl:"HBO Watermanagement / Civiele Techniek"} },
        { id:"waterzuivering", name:{ar:"فني محطة معالجة المياه", nl:"Operator Waterzuivering"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"كيمياء المياه، أنظمة المعالجة، مختبر", nl:"Waterchemie, zuiveringssystemen, laboratorium"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Procesoperator Waterzuivering", nl:"Procesoperator Waterzuivering"},
          next:{ar:"HBO Milieukunde", nl:"HBO Milieukunde"} },
        { id:"duiker-prof", name:{ar:"غطّاس صناعي/مدني", nl:"Beroepsduiker (Civiel)"}, levels:[3,4], duration:{ar:"تدريب 6-12 شهر + MBO", nl:"6-12 maanden + MBO"},
          subjects:{ar:"غوص صناعي، لحام تحت الماء، فحص", nl:"Industrieel duiken, onderwaterlassen, inspectie"},
          entry:{ar:"VMBO + اللياقة البدنية", nl:"VMBO + medische keuring"}, cert:{ar:"Beroepsduiker A/B (NDC)", nl:"Beroepsduiker A/B (NDC)"},
          next:{ar:"Inspectieduiker، Saturatieduiker", nl:"Inspectieduiker, Saturatieduiker"} },
        { id:"waterbouwer", name:{ar:"عامل إنشاءات مائية", nl:"Waterbouwer"}, levels:[2,3,4], duration:{ar:"2-4 سنوات", nl:"2-4 jaar"},
          subjects:{ar:"بناء سدود، أرصفة، أعمال GWW المائية", nl:"Dijken, kades, natte GWW"},
          entry:{ar:"VMBO BB/KB", nl:"VMBO BB/KB"}, cert:{ar:"Waterbouwer MBO 2/3/4", nl:"Waterbouwer MBO 2/3/4"},
          next:{ar:"HBO Civiele Techniek", nl:"HBO Civiele Techniek"} },
        { id:"baggeraar", name:{ar:"مشغّل آلة تجريف", nl:"Baggeraar / Operator dredger"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تشغيل سفن التجريف، التحكم في القاع البحري", nl:"Baggerschepen bedienen, bodembeheer"},
          entry:{ar:"VMBO + STCW", nl:"VMBO + STCW"}, cert:{ar:"Bagger Operator + STCW", nl:"Bagger Operator + STCW"},
          next:{ar:"Officier Bagger", nl:"Officier Bagger"} }
      ]
    },

    { id:"preventie-zorg", icon:"💊", name:{ar:"الرعاية الوقائية والصحة العامة", nl:"Preventieve Zorg & Volksgezondheid"},
      professions: [
        { id:"jeugdwerk", name:{ar:"عامل مع الشباب", nl:"Jongerenwerker"}, levels:[3,4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"تربية الشباب، حلّ النزاعات، الإدمان والتوعية", nl:"Jongerenwerk, conflicthantering, verslavingspreventie"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"Sociaal werker Jeugd MBO 4", nl:"Sociaal werker Jeugd MBO 4"},
          next:{ar:"HBO Social Work", nl:"HBO Social Work"} },
        { id:"verslavingszorg", name:{ar:"مساعد رعاية إدمان", nl:"Begeleider Verslavingszorg"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"الإدمان، علم النفس، إعادة التأهيل", nl:"Verslavingen, psychologie, rehabilitatie"},
          entry:{ar:"VMBO TL", nl:"VMBO TL"}, cert:{ar:"BSD MBO 4", nl:"Begeleider Specifieke Doelgroepen MBO 4"},
          next:{ar:"HBO Social Work", nl:"HBO Social Work"} },
        { id:"ggd-medewerker", name:{ar:"موظف صحة عامة (GGD)", nl:"Medewerker Publieke Gezondheid (GGD)"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"تطعيمات، رعاية الطفل، صحة المهاجرين", nl:"Vaccinaties, kinderzorg, reizigersgezondheid"},
          entry:{ar:"MBO 4 Verpleging", nl:"MBO 4 Verpleging"}, cert:{ar:"Specialisatie Publieke Gezondheid", nl:"Specialisatie Publieke Gezondheid"},
          next:{ar:"HBO Verpleegkunde", nl:"HBO Verpleegkunde"} },
        { id:"gezondheidscoach", name:{ar:"مدرّب صحة وأسلوب حياة", nl:"Gezondheids- en Leefstijlcoach"}, levels:[4], duration:{ar:"3-4 سنوات", nl:"3-4 jaar"},
          subjects:{ar:"التغذية، الحركة، علم النفس الإيجابي", nl:"Voeding, beweging, positieve psychologie"},
          entry:{ar:"MBO 3 Sport/Zorg", nl:"MBO 3 Sport/Zorg"}, cert:{ar:"BLCN-erkend Leefstijlcoach", nl:"BLCN-erkend Leefstijlcoach"},
          next:{ar:"HBO Gezondheidswetenschappen", nl:"HBO Gezondheidswetenschappen"} },
        { id:"mantelzorg-coordinator", name:{ar:"منسّق رعاية ذوي الاحتياجات", nl:"Mantelzorg Coördinator"}, levels:[3,4], duration:{ar:"3 سنوات", nl:"3 jaar"},
          subjects:{ar:"تنسيق الرعاية المنزلية، إرشاد الأسر", nl:"Coördinatie thuiszorg, gezinsbegeleiding"},
          entry:{ar:"MBO 3 Welzijn", nl:"MBO 3 Welzijn"}, cert:{ar:"Begeleider Welzijn MBO 4", nl:"Begeleider Welzijn MBO 4"},
          next:{ar:"HBO Maatschappelijk Werk", nl:"HBO Maatschappelijk Werk"} }
      ]
    }
  ];

  for (const [sid, pros] of Object.entries(ADD4)) {
    const s = MBO_SECTOR_BY_ID[sid];
    if (s && Array.isArray(pros)) s.professions.push(...pros);
  }
  for (const ns of MORE_SECTORS_V5) {
    if (!MBO_SECTOR_BY_ID[ns.id]) {
      MBO_SECTORS.push(ns);
      MBO_SECTOR_BY_ID[ns.id] = ns;
    }
  }
})();


/* ═══════════════════════════════════════════════════════════
   PAGE RENDERERS
═══════════════════════════════════════════════════════════ */
const RENDERERS = {
  overview() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, state.lang === "ar" ? "نظرة عامة على النظام" : "Overzicht van het systeem"));
    const intro = el("div", { class:"card reveal" });
    intro.innerHTML = state.lang === "ar"
      ? `<p>النظام التعليمي في هولندا يُدار من ${nl("Ministerie van Onderwijs, Cultuur en Wetenschap (OCW)")} وينقسم إلى خمسة مستويات رئيسية: رياض الأطفال (${nl("Kinderopvang")})، الابتدائية (${nl("Basisschool")})، الثانوية (${nl("VO")}: ${nl("VMBO")}/${nl("HAVO")}/${nl("VWO")})، التعليم المهني (${nl("MBO")})، والتعليم العالي (${nl("HBO")}/${nl("WO")}).</p><p>الإلزام يمتد من سن 5 حتى 16 سنة (${nl("leerplicht")}) ثم إلزام التأهيل (${nl("kwalificatieplicht")}) حتى 18 أو حتى الحصول على شهادة ${nl("startkwalificatie")}.</p>`
      : `<p>Het Nederlandse onderwijssysteem valt onder OCW en kent vijf hoofdniveaus: Kinderopvang, Basisschool, Voortgezet Onderwijs (VMBO/HAVO/VWO), MBO en HO (HBO/WO).</p><p>Leerplicht geldt van 5 tot 16 jaar, daarna kwalificatieplicht tot 18 jaar of startkwalificatie.</p>`;
    frag.append(intro);
    frag.append(buildTable(
      t("tbl.title.levels"),
      [t("col.level"), t("col.age"), t("col.duration"), t("col.outcome")],
      LEVELS.filter(l => ["basisschool","vmbo","havo","vwo","mbo","hbo","wo","phd"].includes(l.id)).map(l => [
        `<button class="tt-link" onclick="openModal('${l.id}')">${l.icon} ${l.name[state.lang]}</button>`,
        `<span class="num">${l.ageRange}</span>`,
        l.duration[state.lang],
        l.short[state.lang].replace(/<[^>]*>/g, m => m).slice(0, 140) + "…"
      ])
    ));
    return frag;
  },

  pathway() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, t("pathway.title")));
    const hint = el("p", { class:"page-hint reveal" }, t("pathway.hint"));
    frag.append(hint);
    const diag = el("div", { class:"pathway reveal" });
    PAGES; // no-op
    PATHWAY.forEach((tier, i) => {
      const row = el("div", { class:"pathway-tier" });
      row.append(el("div", { class:"pathway-age num" }, tier.tier));
      const nodes = el("div", { class:"pathway-nodes" });
      tier.nodes.forEach(n => {
        const lv = LEVEL_BY_ID[n.id];
        if (!lv) return;
        const btn = el("button", {
          class: "pnode " + lv.color,
          "data-id": lv.id,
          onclick: () => openModal(lv.id),
          onmouseenter: (e) => showTooltip(e, lv),
          onmouseleave: hideTooltip,
          onfocus: (e) => showTooltip(e, lv),
          onblur: hideTooltip,
        });
        btn.innerHTML = `<span class="pnode-ico">${lv.icon}</span><span class="pnode-name">${lv.name[state.lang]}</span><span class="pnode-age num">${lv.ageRange}</span>`;
        nodes.append(btn);
      });
      row.append(nodes);
      diag.append(row);
      if (i < PATHWAY.length - 1) diag.append(el("div", { class:"pathway-arrow" }, "↓"));
    });
    frag.append(diag);
    return frag;
  },

  levels() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, state.lang === "ar" ? "كل المستويات التعليمية" : "Alle onderwijsniveaus"));
    const grid = el("div", { class:"grid-3 reveal" });
    LEVELS.forEach(l => {
      const c = el("button", { class:"level-card " + l.color, onclick: () => openModal(l.id) });
      c.innerHTML = `<div class="lc-top"><span class="lc-ico">${l.icon}</span><span class="lc-age num">${l.ageRange}</span></div>
        <div class="lc-name">${l.name[state.lang]}</div>
        <div class="lc-name-sub nl">${l.name.nl}</div>
        <div class="lc-desc">${l.short[state.lang]}</div>
        <div class="lc-cta">${state.lang === "ar" ? "التفاصيل ←" : "Details →"}</div>`;
      grid.append(c);
    });
    frag.append(grid);
    return frag;
  },

  transitions() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, t("tbl.title.trans")));
    frag.append(buildTable("", [t("col.from"), t("col.to"), t("col.req"), t("col.notes")],
      TRANSITIONS.map(r => [nl(r.from), nl(r.to), r.req[state.lang], r.notes[state.lang]])
    ));
    return frag;
  },

  vmbo()     { return levelPage("vmbo"); },
  havovwo()  { return comboPage(["havo","vwo"], state.lang==="ar"?"HAVO و VWO":"HAVO en VWO"); },
  mbo()      { return levelPage("mbo"); },
  hbo()      { return levelPage("hbo"); },
  wo()       { return levelPage("wo"); },
  vavo()     { return levelPage("vavo"); },

  "mbo-beroepen"() {
    const frag = document.createDocumentFragment();
    const ar = state.lang === "ar";
    frag.append(el("h2", { class:"page-title reveal" }, ar ? "كل مهن وفروع MBO" : "Alle MBO-sectoren en beroepen"));

    // Intro card
    const intro = el("div", { class:"card reveal mbo-intro" });
    intro.innerHTML = ar
      ? `<p>يضم التعليم المهني (${nl("MBO")}) ستة عشر قطاعاً رئيسياً (${nl("domeinen")}) تغطي أكثر من 480 مهنة. في كل مهنة: المتطلبات، المواد الدراسية، مدة الدراسة، والشهادات المطلوبة. توجد أربعة مستويات (${nl("niveau 1–4")}): 1 إعدادي (${nl("entreeopleiding")}) · 2 عامل منفّذ · 3 عامل مستقل · 4 عامل متخصص/مشرف يمنح الدخول إلى ${nl("HBO")}.</p>
<p>مسارا التعلم: <b>${nl("BOL")}</b> (دراسة بدوام كامل + تدريب) و <b>${nl("BBL")}</b> (عمل 4 أيام + مدرسة يوماً واحداً). المتطلبات الأساسية العامة: شهادة ${nl("VMBO")} المناسبة + نسخة عن الهوية + شهادة حسن سلوك (${nl("VOG")}) للبعض + عقد تدريب (${nl("stageovereenkomst")}).</p>
<p class="mbo-hint">👇 اختر قطاعاً للانتقال إليه مباشرة.</p>`
      : `<p>Het MBO kent 16 domeinen met in totaal 480+ beroepen. Per beroep vind je: instroomeisen, vakken, studieduur en certificaten. Vier niveaus: 1 entree · 2 basisberoeps · 3 zelfstandig · 4 specialist/middenkader (geeft doorstroomrecht naar HBO).</p>
<p>Leerwegen: <b>BOL</b> (fulltime school + stage) en <b>BBL</b> (4 dagen werk + 1 dag school). Algemene eisen: passend VMBO-diploma + ID + soms VOG + stageovereenkomst.</p>
<p class="mbo-hint">👇 Kies een sector om direct te springen.</p>`;
    frag.append(intro);

    // Sector chips navigation
    const chips = el("div", { class:"mbo-sector-chips reveal" });
    MBO_SECTORS.forEach(s => {
      const a = el("a", { class:"mbo-chip", href:"#mbo-sector-"+s.id });
      a.innerHTML = `<span class="mbo-chip-ico">${s.icon}</span><span>${s.name[state.lang]}</span><span class="mbo-chip-count num">${s.professions.length}</span>`;
      chips.append(a);
    });
    frag.append(chips);

    // Each sector
    MBO_SECTORS.forEach(s => {
      const section = el("section", { class:"mbo-sector reveal", id:"mbo-sector-"+s.id });
      const head = el("div", { class:"mbo-sector-head" });
      head.innerHTML = `<span class="mbo-sector-ico">${s.icon}</span>
        <div class="mbo-sector-titles">
          <h3>${s.name[state.lang]}</h3>
          <p class="nl">${s.name.nl}</p>
        </div>
        <span class="mbo-sector-badge num">${s.professions.length} ${ar?"مهنة":"beroepen"}</span>`;
      section.append(head);

      const grid = el("div", { class:"mbo-grid" });
      s.professions.forEach(p => {
        const card = el("article", { class:"mbo-card", id:"mbo-prof-"+s.id+"-"+p.id });
        const _asArr = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v.length ? v.split(/[،,]\s*/).map(x=>x.trim()).filter(Boolean) : []);
        const subjects = _asArr(p.subjects && p.subjects[state.lang]);
        const nexts = _asArr(p.next && p.next[state.lang]);
        const lvls = (p.levels || []).map(n => `<span class="mbo-lvl num">N${n}</span>`).join("");
        card.innerHTML = `
          <header class="mbo-card-head">
            <h4>${p.name[state.lang]}</h4>
            <p class="nl">${p.name.nl}</p>
            <div class="mbo-lvl-row">${lvls}<span class="mbo-dur">⏱ <bdi>${p.duration[state.lang]}</bdi></span></div>
          </header>
          <div class="mbo-row">
            <span class="mbo-k">${ar?"📥 المتطلبات":"📥 Instroomeisen"}</span>
            <span class="mbo-v"><bdi>${p.entry[state.lang]}</bdi></span>
          </div>
          <div class="mbo-row mbo-row-subjects">
            <span class="mbo-k">${ar?"📚 المواد":"📚 Vakken"}</span>
            <div class="mbo-tags">${subjects.map(s => `<span class="mbo-tag"><bdi>${s}</bdi></span>`).join("")}</div>
          </div>
          <div class="mbo-row">
            <span class="mbo-k">${ar?"📜 الشهادات":"📜 Certificaten"}</span>
            <span class="mbo-v"><bdi>${p.cert[state.lang]}</bdi></span>
          </div>
          <div class="mbo-row mbo-row-next">
            <span class="mbo-k">${ar?"➡️ ماذا بعد":"➡️ Vervolg"}</span>
            <div class="mbo-tags">${nexts.map(n => `<span class="mbo-tag mbo-tag-next"><bdi>${n}</bdi></span>`).join("")}</div>
          </div>`;
        grid.append(card);
      });
      section.append(grid);
      frag.append(section);
    });

    // Footer note
    const foot = el("div", { class:"card reveal mbo-foot" });
    foot.innerHTML = ar
      ? `<p>📌 ملاحظة: الأعداد والأسماء مستندة إلى تصنيف ${nl("SBB")} / ${nl("DUO")}. المناهج الدقيقة تختلف من مدرسة إلى أخرى — راجع دائماً موقع المدرسة.</p><p>🔗 مصادر: <a href="https://www.s-bb.nl" target="_blank" rel="noopener">s-bb.nl</a> · <a href="https://www.mbostad.nl" target="_blank" rel="noopener">mbostad.nl</a> · <a href="https://www.kiesmbo.nl" target="_blank" rel="noopener">kiesmbo.nl</a></p>`
      : `<p>📌 Let op: beroepsnamen en aantallen zijn gebaseerd op SBB/DUO-classificaties. Exacte vakken verschillen per school — raadpleeg de schoolsite.</p><p>🔗 Bronnen: <a href="https://www.s-bb.nl" target="_blank" rel="noopener">s-bb.nl</a> · <a href="https://www.mbostad.nl" target="_blank" rel="noopener">mbostad.nl</a> · <a href="https://www.kiesmbo.nl" target="_blank" rel="noopener">kiesmbo.nl</a></p>`;
    frag.append(foot);

    return frag;
  },

  salaries() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, t("tbl.title.salary")));
    const note = el("p", { class:"page-hint reveal" },
      state.lang === "ar" ? "أرقام إجمالية تقريبية شهرية (قبل الضريبة). تتغير حسب القطاع والخبرة."
                          : "Bruto maandbedragen (indicatief). Verschilt per sector en ervaring.");
    frag.append(note);
    frag.append(buildTable("", [t("col.field"), t("col.salary"), t("col.growth")],
      SALARIES.map(s => [s.field[state.lang], `<span class="num">${s.gross}</span>`, `<span class="num">${s.growth}</span>`])
    ));
    return frag;
  },

  exams() {
    const ar = state.lang === "ar";
    const frag = document.createDocumentFragment();

    // Page title
    frag.append(el("h2", { class:"page-title reveal" },
      ar ? "📝 امتحانات القبول والتحضير الجامعي" : "📝 Toelatingsexamens & Voortentamens"));

    // Intro
    const intro = el("div", { class:"card reveal exam-intro" });
    intro.innerHTML = ar
      ? `<p><strong>هل ينقصك مادة من VWO؟</strong> هل تريد دراسة الطب أو طب الأسنان أو الصيدلة أو الهندسة لكنك لم تدرس Scheikunde أو Wiskunde B في الثانوية؟ هل أنت قادم جديد إلى هولندا؟</p>
         <p>لا تقلق — يوجد <strong>عدة طرق رسمية</strong> لتعويض المواد المفقودة والوصول إلى الجامعة الهولندية. هذه الصفحة تشرحها بالتفصيل.</p>
         <p class="exam-quick">⚡ <strong>دليل سريع:</strong> فقدت مادة واحدة → CCVX/Boswell · بدون VWO/HAVO + ≥21 سنة → Colloquium Doctum · بدون أي دبلوم → Staatsexamen VWO · أجنبي تعلم الهولندية → Staatsexamen NT2 · دراسة بالإنجليزية → IELTS/TOEFL.</p>`
      : `<p><strong>Mis je een VWO-vak?</strong> Wil je geneeskunde, tandheelkunde, farmacie of techniek studeren maar heb je geen Scheikunde of Wiskunde B gehad? Of ben je nieuwkomer in Nederland?</p>
         <p>Geen zorgen — er zijn <strong>meerdere officiële routes</strong> om ontbrekende vakken in te halen en toelating tot een Nederlandse universiteit te krijgen. Deze pagina legt ze uit.</p>
         <p class="exam-quick">⚡ <strong>Snelgids:</strong> Eén vak ontbreekt → CCVX/Boswell · Geen VWO/HAVO + ≥21 → Colloquium Doctum · Geen diploma → Staatsexamen VWO · Buitenlander leert NL → Staatsexamen NT2 · Engelstalige studie → IELTS/TOEFL.</p>`;
    frag.append(intro);

    // Exam cards section
    frag.append(el("h3", { class:"exam-section-title reveal" },
      ar ? "🧪 الامتحانات المتاحة" : "🧪 Beschikbare examens"));

    const grid = el("div", { class:"exam-grid reveal" });
    EXAMS.forEach(ex => {
      const card = el("article", {
        class:"exam-card exam-color-" + ex.color,
        id:"exam-" + ex.id,
        tabindex:"0",
      });
      const subjects = ex.subjects[state.lang].map(s =>
        `<li>${s}</li>`).join("");
      const tips = ex.tips[state.lang].map(t =>
        `<li>${t}</li>`).join("");
      card.innerHTML = `
        <div class="exam-head">
          <div class="exam-icon" aria-hidden="true">${ex.icon}</div>
          <div class="exam-titles">
            <h4 class="exam-name"><bdi>${ex.name[state.lang]}</bdi></h4>
            <p class="exam-organizer"><bdi>${ex.organizer[state.lang] || ex.organizer}</bdi></p>
          </div>
        </div>
        <div class="exam-body">
          <div class="exam-row">
            <span class="exam-k">${ar?"🎯 الهدف":"🎯 Doel"}</span>
            <p class="exam-v"><bdi>${ex.purpose[state.lang]}</bdi></p>
          </div>
          <div class="exam-row">
            <span class="exam-k">${ar?"📚 المواد":"📚 Vakken"}</span>
            <ul class="exam-list">${subjects}</ul>
          </div>
          <div class="exam-grid-meta">
            <div class="exam-meta-cell">
              <span class="exam-meta-k">${ar?"⏱️ المدة":"⏱️ Duur"}</span>
              <span class="exam-meta-v"><bdi>${ex.duration[state.lang]}</bdi></span>
            </div>
            <div class="exam-meta-cell">
              <span class="exam-meta-k">${ar?"💶 الرسوم":"💶 Kosten"}</span>
              <span class="exam-meta-v num"><bdi>${ex.fee[state.lang] || ex.fee}</bdi></span>
            </div>
          </div>
          <div class="exam-row">
            <span class="exam-k">${ar?"👥 لمن":"👥 Voor wie"}</span>
            <p class="exam-v"><bdi>${ex.whoFor[state.lang]}</bdi></p>
          </div>
          <div class="exam-row">
            <span class="exam-k">${ar?"📝 التسجيل":"📝 Aanmelden"}</span>
            <p class="exam-v"><bdi>${ex.howToRegister[state.lang]}</bdi></p>
          </div>
          <div class="exam-row exam-tips-row">
            <span class="exam-k">${ar?"💡 نصائح":"💡 Tips"}</span>
            <ul class="exam-list exam-tips">${tips}</ul>
          </div>
          <a class="exam-link" href="${ex.link}" target="_blank" rel="noopener">
            🔗 ${ar?"الموقع الرسمي":"Officiële site"} → <span class="num">${ex.link.replace("https://","")}</span>
          </a>
        </div>`;
      grid.append(card);
    });
    frag.append(grid);

    // ── STUDY REQUIREMENTS section ──
    frag.append(el("h3", { class:"exam-section-title reveal", style:"margin-top:2.5rem" },
      ar ? "🎓 متطلبات الدراسات الجامعية الشائعة (WO)" : "🎓 Toelatingseisen populaire WO-studies"));

    const studyIntro = el("p", { class:"page-hint reveal" },
      ar ? "كل دراسة جامعية لها مواد VWO إجبارية. إذا كانت ينقصك واحدة، استخدم CCVX أو Boswell-Bèta أو VASVU لتعويضها."
         : "Elke WO-studie heeft verplichte VWO-vakken. Mis je er één, gebruik dan CCVX, Boswell-Bèta of VASVU om in te halen.");
    frag.append(studyIntro);

    const studyGrid = el("div", { class:"study-grid reveal" });
    STUDY_REQUIREMENTS.forEach(st => {
      const reqs = st.requiredSubjects[state.lang].map(r => `<li>${r}</li>`).join("");
      const unis = st.universities[state.lang].map(u => `<span class="uni-chip"><bdi>${u}</bdi></span>`).join("");
      const tips = st.tips[state.lang].map(tt => `<li>${tt}</li>`).join("");
      const card = el("article", {
        class:"study-card",
        id:"study-" + st.id,
        tabindex:"0",
      });
      card.innerHTML = `
        <header class="study-head">
          <div class="study-ico">${st.icon}</div>
          <div class="study-headtxt">
            <h4 class="study-name"><bdi>${st.name[state.lang]}</bdi></h4>
            <span class="study-level-badge">${st.level}</span>
          </div>
        </header>
        <div class="study-body">
          <div class="study-row">
            <span class="study-k">${ar?"⏳ المدة":"⏳ Duur"}</span>
            <span class="study-v"><bdi>${st.duration[state.lang]}</bdi></span>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"📊 الشعبة (Profiel)":"📊 Profiel"}</span>
            <span class="study-v"><bdi>${st.profile[state.lang]}</bdi></span>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"📖 المواد المطلوبة":"📖 Vereiste vakken"}</span>
            <ul class="study-list">${reqs}</ul>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"🎯 الاختيار":"🎯 Selectie"}</span>
            <p class="study-v"><bdi>${st.selection[state.lang]}</bdi></p>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"🏛️ الجامعات":"🏛️ Universiteiten"}</span>
            <div class="uni-chips">${unis}</div>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"📅 الموعد النهائي":"📅 Deadline"}</span>
            <span class="study-v num"><bdi>${st.deadline[state.lang]}</bdi></span>
          </div>
          <div class="study-row">
            <span class="study-k">${ar?"💡 نصائح":"💡 Tips"}</span>
            <ul class="study-list">${tips}</ul>
          </div>
        </div>`;
      studyGrid.append(card);
    });
    frag.append(studyGrid);

    // ── STUDY GUIDANCE / MATERIALS section ──
    frag.append(el("h3", { class:"exam-section-title reveal", style:"margin-top:2.5rem" },
      ar ? "📖 إرشادات الدراسة والمواد التعليمية" : "📖 Studiegids & Aanbevolen lesmateriaal"));

    const guideIntro = el("p", { class:"page-hint reveal" },
      ar ? "لكل مادة من VWO، إليك أفضل الكتب والمواقع وعدد ساعات الدراسة الأسبوعية + المواضيع التي ستراها في الامتحان."
         : "Per VWO-vak: beste boeken, websites, weekuren én onderwerpen die je in het examen tegenkomt.");
    frag.append(guideIntro);

    const guideGrid = el("div", { class:"guide-grid reveal" });
    STUDY_GUIDANCE.forEach(g => {
      const books = g.textbooks[state.lang].map(b => `<li>${b}</li>`).join("");
      const sites = g.websites[state.lang].map(s => `<li>${s}</li>`).join("");
      const topics = g.topics[state.lang].map(t => `<li>${t}</li>`).join("");
      const tips = g.tips[state.lang].map(t => `<li>${t}</li>`).join("");
      const card = el("article", {
        class:"guide-card guide-color-" + g.color,
        id:g.id,
        tabindex:"0",
      });
      card.innerHTML = `
        <header class="guide-head">
          <div class="guide-ico">${g.icon}</div>
          <div class="guide-headtxt">
            <h4 class="guide-name"><bdi>${g.subject[state.lang]}</bdi></h4>
            <span class="guide-level"><bdi>${g.level[state.lang]}</bdi></span>
          </div>
        </header>
        <div class="guide-body">
          <div class="guide-meta">
            <div class="guide-meta-cell">
              <span class="guide-meta-k">${ar?"⏱️ المدة":"⏱️ Duur"}</span>
              <span class="guide-meta-v"><bdi>${g.duration[state.lang]}</bdi></span>
            </div>
            <div class="guide-meta-cell">
              <span class="guide-meta-k">${ar?"📊 ساعات/أسبوع":"📊 Uren/week"}</span>
              <span class="guide-meta-v num"><bdi>${g.weeklyHours[state.lang]}</bdi></span>
            </div>
          </div>
          <div class="guide-row">
            <span class="guide-k">${ar?"📚 الكتب الموصى بها":"📚 Aanbevolen boeken"}</span>
            <ul class="guide-list">${books}</ul>
          </div>
          <div class="guide-row">
            <span class="guide-k">${ar?"🌐 المواقع المجانية":"🌐 Gratis websites"}</span>
            <ul class="guide-list">${sites}</ul>
          </div>
          <div class="guide-row">
            <span class="guide-k">${ar?"🎯 المواضيع الأساسية":"🎯 Kernonderwerpen"}</span>
            <ul class="guide-list">${topics}</ul>
          </div>
          <div class="guide-row guide-tips-row">
            <span class="guide-k">${ar?"💡 نصائح ذهبية":"💡 Gouden tips"}</span>
            <ul class="guide-list guide-tips">${tips}</ul>
          </div>
        </div>`;
      guideGrid.append(card);
    });
    frag.append(guideGrid);

    // ── MEDICINE 9-MONTH ROADMAP ──
    frag.append(el("h3", { class:"exam-section-title reveal", style:"margin-top:2.5rem" },
      ar ? "🗺️ خارطة طريق 9 أشهر — الطريق إلى دراسة الطب" : "🗺️ 9-maanden routekaart — naar Geneeskunde"));

    const roadIntro = el("p", { class:"page-hint reveal" },
      ar ? "خطة عمل شهرية تبدأ في سبتمبر وتنتهي بقبولك في الجامعة في سبتمبر التالي. تنطبق أيضًا على طب الأسنان والبيطرة والصيدلة (مع تعديل بسيط)."
         : "Maandplan dat start in september en eindigt met je toelating in september erna. Geldt ook voor tandheelkunde, diergeneeskunde, farmacie (kleine aanpassingen)."
    );
    frag.append(roadIntro);

    const roadmap = el("div", { class:"roadmap reveal" });
    MEDICINE_ROADMAP[state.lang].forEach((stage, i) => {
      const tasksHtml = stage.tasks.map(t => `<li><bdi>${t}</bdi></li>`).join("");
      const stageEl = el("div", { class:"roadmap-stage" });
      stageEl.innerHTML = `
        <div class="roadmap-marker">${i+1}</div>
        <div class="roadmap-content">
          <div class="roadmap-month"><bdi>${stage.month}</bdi></div>
          <div class="roadmap-title"><bdi>${stage.title}</bdi></div>
          <ul class="roadmap-tasks">${tasksHtml}</ul>
        </div>`;
      roadmap.append(stageEl);
    });
    frag.append(roadmap);

    // ── Pre-Decision tree quick block ──
    const cheatsheet = el("div", { class:"card reveal cheatsheet" });
    cheatsheet.innerHTML = ar
      ? `<h3>📌 ورقة الغش السريعة — ما الذي أحتاجه لأي دراسة؟</h3>
         <table class="cheat-table">
           <thead><tr><th>الدراسة</th><th>المواد الإجبارية</th><th>numerus fixus؟</th><th>الموعد النهائي</th></tr></thead>
           <tbody>
             <tr><td>الطب البشري</td><td>Wisk A/B + Sk + Bi</td><td>✅ نعم</td><td>15 يناير</td></tr>
             <tr><td>طب الأسنان</td><td>Wisk A/B + Sk + Bi</td><td>✅ نعم</td><td>15 يناير</td></tr>
             <tr><td>الطب البيطري</td><td>Wisk A/B + Sk + Bi</td><td>✅ نعم</td><td>15 يناير</td></tr>
             <tr><td>الصيدلة</td><td>Wisk A/B + Sk + Bi</td><td>❌ لا</td><td>1 مايو</td></tr>
             <tr><td>علم الأحياء الطبية</td><td>Wisk A/B + Sk + Bi</td><td>❌ لا</td><td>1 مايو</td></tr>
             <tr><td>الهندسة</td><td>Wisk B + Nat</td><td>غالبًا لا (matching)</td><td>1 مايو</td></tr>
             <tr><td>علوم الكمبيوتر</td><td>Wisk B</td><td>أحيانًا</td><td>1 مايو</td></tr>
             <tr><td>الذكاء الاصطناعي</td><td>Wisk B</td><td>✅ نعم (UvA, RU)</td><td>15 يناير</td></tr>
             <tr><td>علم النفس</td><td>Wisk A/B</td><td>✅ نعم (معظم)</td><td>15 يناير</td></tr>
             <tr><td>الاقتصاد القياسي</td><td>Wisk B</td><td>❌ لا</td><td>1 مايو</td></tr>
             <tr><td>القانون</td><td>VWO فقط</td><td>❌ لا</td><td>1 مايو</td></tr>
             <tr><td>إدارة الأعمال</td><td>Wisk A/B</td><td>RSM فقط</td><td>15 يناير / 1 مايو</td></tr>
           </tbody>
         </table>`
      : `<h3>📌 Cheatsheet — wat heb ik nodig per studie?</h3>
         <table class="cheat-table">
           <thead><tr><th>Studie</th><th>Verplichte vakken</th><th>Numerus fixus?</th><th>Deadline</th></tr></thead>
           <tbody>
             <tr><td>Geneeskunde</td><td>Wisk A/B + Sk + Bi</td><td>✅ ja</td><td>15 jan</td></tr>
             <tr><td>Tandheelkunde</td><td>Wisk A/B + Sk + Bi</td><td>✅ ja</td><td>15 jan</td></tr>
             <tr><td>Diergeneeskunde</td><td>Wisk A/B + Sk + Bi</td><td>✅ ja</td><td>15 jan</td></tr>
             <tr><td>Farmacie</td><td>Wisk A/B + Sk + Bi</td><td>❌ nee</td><td>1 mei</td></tr>
             <tr><td>Biomedische W.</td><td>Wisk A/B + Sk + Bi</td><td>❌ nee</td><td>1 mei</td></tr>
             <tr><td>Techniek</td><td>Wisk B + Nat</td><td>meestal niet (matching)</td><td>1 mei</td></tr>
             <tr><td>Informatica</td><td>Wisk B</td><td>soms</td><td>1 mei</td></tr>
             <tr><td>AI</td><td>Wisk B</td><td>✅ ja (UvA, RU)</td><td>15 jan</td></tr>
             <tr><td>Psychologie</td><td>Wisk A/B</td><td>✅ ja (meeste)</td><td>15 jan</td></tr>
             <tr><td>Econometrie</td><td>Wisk B</td><td>❌ nee</td><td>1 mei</td></tr>
             <tr><td>Rechten</td><td>VWO volstaat</td><td>❌ nee</td><td>1 mei</td></tr>
             <tr><td>Bedrijfskunde</td><td>Wisk A/B</td><td>alleen RSM</td><td>15 jan / 1 mei</td></tr>
           </tbody>
         </table>`;
    frag.append(cheatsheet);

    // ── Decision tree / Pathway helper ──
    const tree = el("div", { class:"card reveal exam-tree" });
    tree.innerHTML = ar
      ? `<h3>🧭 شجرة القرار: أيّ امتحان أحتاج؟</h3>
         <ol class="exam-tree-list">
           <li><strong>هل لديك دبلوم VWO ولكن ينقصك مادة واحدة (مثل Scheikunde)؟</strong><br>→ استخدم <a href="#exam-ccvx" onclick="setPage('exams');return true;">CCVX</a> أو <a href="#exam-boswell" onclick="setPage('exams');return true;">Boswell-Bèta</a> أو <a href="#exam-vasvu" onclick="setPage('exams');return true;">VASVU</a> لتعويض هذه المادة فقط.</li>
           <li><strong>هل لديك HBO Bachelor وتريد الانتقال إلى ماجستير WO؟</strong><br>→ في الغالب تحتاج <a href="#exam-ccvx" onclick="setPage('exams');return true;">CCVX</a> أو premaster (سنة تحضيرية).</li>
           <li><strong>هل لديك ≥ 21 سنة بدون VWO/HAVO/MBO-4؟</strong><br>→ <a href="#exam-colloquium" onclick="setPage('exams');return true;">Colloquium Doctum</a> هو طريقك.</li>
           <li><strong>هل لديك أقل من 21 سنة وبدون دبلوم هولندي؟</strong><br>→ ادرس في <a href="#vavo" onclick="setPage('vavo');return true;">VAVO</a> للحصول على VWO أو HAVO، أو قدّم لـ <a href="#exam-staatsexamen" onclick="setPage('exams');return true;">Staatsexamen VWO</a>.</li>
           <li><strong>هل أنت قادم جديد إلى هولندا (لاجئ، مهاجر)؟</strong><br>→ ابدأ بدورة <strong>ISK</strong> أو <strong>Schakeljaar</strong> في الجامعة، ثم <a href="#exam-staatsexamen-nt2" onclick="setPage('exams');return true;">Staatsexamen NT2</a> لإثبات الهولندية.</li>
           <li><strong>هل تريد دراسة برنامج بالإنجليزية؟</strong><br>→ <a href="#exam-ielts-toefl" onclick="setPage('exams');return true;">IELTS أو TOEFL</a> (الحد الأدنى يعتمد على الدراسة).</li>
         </ol>`
      : `<h3>🧭 Beslisboom: welk examen heb ik nodig?</h3>
         <ol class="exam-tree-list">
           <li><strong>Heb je een VWO-diploma maar mis je één vak (bv. Scheikunde)?</strong><br>→ Gebruik <a href="#exam-ccvx" onclick="setPage('exams');return true;">CCVX</a>, <a href="#exam-boswell" onclick="setPage('exams');return true;">Boswell-Bèta</a> of <a href="#exam-vasvu" onclick="setPage('exams');return true;">VASVU</a> om dat ene vak in te halen.</li>
           <li><strong>Heb je een HBO Bachelor en wil je doorstromen naar een WO-master?</strong><br>→ Meestal <a href="#exam-ccvx" onclick="setPage('exams');return true;">CCVX</a> of een premaster nodig.</li>
           <li><strong>Ben je ≥ 21 jaar zonder VWO/HAVO/MBO-4?</strong><br>→ <a href="#exam-colloquium" onclick="setPage('exams');return true;">Colloquium Doctum</a> is jouw route.</li>
           <li><strong>Ben je < 21 zonder Nederlands diploma?</strong><br>→ Studeer aan <a href="#vavo" onclick="setPage('vavo');return true;">VAVO</a> voor VWO/HAVO, of doe <a href="#exam-staatsexamen" onclick="setPage('exams');return true;">Staatsexamen VWO</a>.</li>
           <li><strong>Ben je nieuwkomer (vluchteling, migrant)?</strong><br>→ Start met <strong>ISK</strong> of <strong>Schakeljaar</strong> aan een universiteit, dan <a href="#exam-staatsexamen-nt2" onclick="setPage('exams');return true;">Staatsexamen NT2</a> voor Nederlands.</li>
           <li><strong>Wil je een Engelstalige studie?</strong><br>→ <a href="#exam-ielts-toefl" onclick="setPage('exams');return true;">IELTS of TOEFL</a> (minimumscore varieert).</li>
         </ol>`;
    frag.append(tree);

    // Footer with sources
    const foot = el("div", { class:"card reveal exam-foot" });
    foot.innerHTML = ar
      ? `<h4>📚 موارد مفيدة إضافية</h4>
         <ul>
           <li><a href="https://www.studielink.nl" target="_blank" rel="noopener">Studielink</a> — منصة التسجيل الموحدة لجميع الدراسات.</li>
           <li><a href="https://www.studiekeuze123.nl" target="_blank" rel="noopener">Studiekeuze123</a> — مقارنة الدراسات والشروط.</li>
           <li><a href="https://www.nuffic.nl" target="_blank" rel="noopener">Nuffic</a> — معادلة الشهادات الأجنبية.</li>
           <li><a href="https://www.duo.nl" target="_blank" rel="noopener">DUO</a> — التمويل الطلابي والامتحانات الرسمية.</li>
           <li><a href="https://www.numerusfixusopleidingen.nl" target="_blank" rel="noopener">Numerus Fixus</a> — قائمة الدراسات ذات العدد المحدود.</li>
         </ul>
         <p class="exam-disclaimer">⚠️ المعلومات محدّثة لعام 2026 لكن قد تتغير الرسوم والمواعيد سنويًا — تحقق دائمًا من الموقع الرسمي للجامعة أو DUO قبل التسجيل.</p>`
      : `<h4>📚 Aanvullende bronnen</h4>
         <ul>
           <li><a href="https://www.studielink.nl" target="_blank" rel="noopener">Studielink</a> — landelijk inschrijfportaal.</li>
           <li><a href="https://www.studiekeuze123.nl" target="_blank" rel="noopener">Studiekeuze123</a> — studies en eisen vergelijken.</li>
           <li><a href="https://www.nuffic.nl" target="_blank" rel="noopener">Nuffic</a> — diplomawaardering buitenland.</li>
           <li><a href="https://www.duo.nl" target="_blank" rel="noopener">DUO</a> — studiefinanciering en officiële examens.</li>
           <li><a href="https://www.numerusfixusopleidingen.nl" target="_blank" rel="noopener">Numerus Fixus</a> — overzicht studies met loting/selectie.</li>
         </ul>
         <p class="exam-disclaimer">⚠️ Informatie geldt voor 2026 maar kosten en data wijzigen jaarlijks — controleer altijd de officiële site van de universiteit of DUO voor inschrijving.</p>`;
    frag.append(foot);

    // Deep-link scroll
    setTimeout(() => {
      const h = location.hash;
      if (h && (h.startsWith("#exam-") || h.startsWith("#study-") || h.startsWith("#guide-"))) {
        const target = document.querySelector(h);
        if (target) {
          target.scrollIntoView({behavior:"smooth", block:"center"});
          target.classList.add("flash");
          setTimeout(() => target.classList.remove("flash"), 1600);
        }
      }
    }, 60);

    return frag;
  },

  compare() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, t("cmp.title")));
    frag.append(el("p", { class:"page-hint reveal" }, t("cmp.pick")));
    const ids = LEVELS.filter(l => !["kinderopvang","werk","phd"].includes(l.id)).map(l => l.id);
    const form = el("div", { class:"cmp-form reveal" });
    const mk = (lbl, selId, def) => {
      const wrapS = el("div", { class:"cmp-field" });
      wrapS.append(el("label", {}, lbl));
      const sel = el("select", { id: selId });
      ids.forEach(id => {
        const lv = LEVEL_BY_ID[id];
        const opt = el("option", { value: id }, `${lv.icon} ${lv.name[state.lang]}`);
        if (id === def) opt.selected = true;
        sel.append(opt);
      });
      wrapS.append(sel);
      return wrapS;
    };
    form.append(mk(t("cmp.a"), "cmpA", "mbo"));
    form.append(mk(t("cmp.b"), "cmpB", "hbo"));
    const btn = el("button", { class:"btn btn-primary", onclick: runCompare }, t("cmp.go"));
    form.append(btn);
    frag.append(form);
    frag.append(el("div", { id:"cmpOut", class:"reveal" }));
    return frag;
  },

  calculator() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, t("calc.title")));
    const box = el("div", { class:"calc reveal" });
    box.innerHTML = `
      <div class="calc-row">
        <label for="calcGross">${t("calc.gross")}</label>
        <input type="number" id="calcGross" min="0" step="100" value="3500" class="num">
      </div>
      <div class="calc-row">
        <label for="calcAge">${t("calc.age")}</label>
        <select id="calcAge">
          <option value="under">${t("calc.age.under")}</option>
          <option value="over">${t("calc.age.over")}</option>
        </select>
      </div>
      <button class="btn btn-primary" id="calcRun">${t("calc.run")}</button>
      <div class="calc-out" id="calcOut" aria-live="polite"></div>`;
    frag.append(box);
    setTimeout(() => {
      $("#calcRun").addEventListener("click", calcSalary);
      calcSalary();
    }, 0);
    return frag;
  },

  sources() {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { class:"page-title reveal" }, state.lang === "ar" ? "المصادر الرسمية" : "Officiële bronnen"));
    const grid = el("div", { class:"grid-2 reveal" });
    [
      { name:"Rijksoverheid",     url:"https://www.rijksoverheid.nl",     desc:{ar:"الحكومة الهولندية", nl:"De Rijksoverheid"} },
      { name:"DUO",               url:"https://www.duo.nl",               desc:{ar:"قروض ومِنح الدراسة", nl:"Studiefinanciering"} },
      { name:"Nuffic",            url:"https://www.nuffic.nl",            desc:{ar:"معادلة الشهادات الأجنبية", nl:"Diplomawaardering"} },
      { name:"Studiekeuze123",    url:"https://www.studiekeuze123.nl",    desc:{ar:"مقارنة الدراسات", nl:"Studies vergelijken"} },
      { name:"S-BB",              url:"https://www.s-bb.nl",              desc:{ar:"اعتماد المهن في MBO", nl:"Kwalificaties MBO"} },
      { name:"OCW",               url:"https://www.onderwijsinspectie.nl",desc:{ar:"تفتيش التعليم", nl:"Onderwijsinspectie"} },
      { name:"Belastingdienst",   url:"https://www.belastingdienst.nl",   desc:{ar:"مصلحة الضرائب", nl:"Belastingdienst"} },
      { name:"UWV",               url:"https://www.uwv.nl",               desc:{ar:"العمل والبطالة", nl:"Werk en uitkering"} },
    ].forEach(s => {
      const a = el("a", { class:"src-card", href:s.url, target:"_blank", rel:"noopener" });
      a.innerHTML = `<div class="src-title nl">${s.name}</div><div class="src-desc">${s.desc[state.lang]}</div><div class="src-url num">${s.url.replace("https://","")}</div>`;
      grid.append(a);
    });
    frag.append(grid);
    return frag;
  },
};

function levelPage(id) {
  const lv = LEVEL_BY_ID[id];
  const frag = document.createDocumentFragment();
  const head = el("div", { class:"lvl-head reveal " + lv.color });
  head.innerHTML = `<div class="lvl-ico">${lv.icon}</div>
    <div class="lvl-heads">
      <h2>${lv.name[state.lang]}</h2>
      <p class="nl">${lv.name.nl}</p>
    </div>
    <div class="lvl-meta">
      <span class="lvl-chip">${state.lang==="ar"?"العمر":"Leeftijd"}: <span class="num">${lv.ageRange}</span></span>
      <span class="lvl-chip">${state.lang==="ar"?"المدة":"Duur"}: ${lv.duration[state.lang]}</span>
    </div>`;
  frag.append(head);
  const body = el("div", { class:"card reveal" });
  body.innerHTML = `<h3>${t("sec.details")}</h3>${lv.body[state.lang]}`;
  frag.append(body);

  const next = el("div", { class:"card reveal" });
  const nextRows = TRANSITIONS.filter(r => r.from.toLowerCase().includes(id) || r.to.toLowerCase().includes(id.toUpperCase()));
  next.append(el("h3", {}, t("sec.next")));
  next.append(buildTable("", [t("col.from"), t("col.to"), t("col.req"), t("col.notes")],
    (nextRows.length ? nextRows : TRANSITIONS).map(r => [nl(r.from), nl(r.to), r.req[state.lang], r.notes[state.lang]])
  ));
  frag.append(next);
  return frag;
}

function comboPage(ids, title) {
  const frag = document.createDocumentFragment();
  frag.append(el("h2", { class:"page-title reveal" }, title));
  ids.forEach(id => {
    const lv = LEVEL_BY_ID[id];
    const sec = el("div", { class:"card reveal " + lv.color + " lvl-combo" });
    sec.innerHTML = `<div class="lvl-head-inline"><span class="lvl-ico">${lv.icon}</span>
      <h3>${lv.name[state.lang]} <span class="nl">(${lv.name.nl})</span></h3>
      <span class="lvl-chip num">${lv.ageRange}</span></div>
      ${lv.body[state.lang]}
      <button class="btn btn-ghost" onclick="openModal('${id}')">${state.lang==="ar"?"تفاصيل مختصرة":"Korte details"}</button>`;
    frag.append(sec);
  });
  return frag;
}

/* ═══════════════════════════════════════════════════════════
   TOOLTIPS ON PATHWAY
═══════════════════════════════════════════════════════════ */
let tipEl = null;
function showTooltip(e, lv) {
  hideTooltip();
  tipEl = el("div", { class:"ptooltip" });
  tipEl.innerHTML = `<div class="ptip-head"><span>${lv.icon}</span><strong>${lv.name[state.lang]}</strong></div>
    <div class="ptip-sub nl">${lv.name.nl}</div>
    <div class="ptip-body">${lv.short[state.lang]}</div>`;
  document.body.append(tipEl);
  const r = e.currentTarget.getBoundingClientRect();
  const top = r.top + window.scrollY - tipEl.offsetHeight - 12;
  const left = r.left + r.width/2 - tipEl.offsetWidth/2;
  tipEl.style.top = Math.max(8, top) + "px";
  tipEl.style.left = Math.max(8, Math.min(window.innerWidth - tipEl.offsetWidth - 8, left)) + "px";
  requestAnimationFrame(() => tipEl.classList.add("show"));
}
function hideTooltip() { if (tipEl) { tipEl.remove(); tipEl = null; } }

/* ═══════════════════════════════════════════════════════════
   MODAL CONTROLLER
═══════════════════════════════════════════════════════════ */
let lastFocus = null;
function openModal(id) {
  const lv = LEVEL_BY_ID[id];
  if (!lv) return;
  lastFocus = document.activeElement;
  $("#modalIcon").textContent = lv.icon;
  $("#modalTitle").textContent = lv.name[state.lang];
  $("#modalSub").innerHTML = `<span class="nl">${lv.name.nl}</span> · <span class="num">${lv.ageRange}</span> · ${lv.duration[state.lang]}`;
  const body = $("#modalBody");
  body.innerHTML = `<div class="modal-summary"><h4>${t("sec.summary")}</h4><p>${lv.short[state.lang]}</p></div>
    <div class="modal-detail"><h4>${t("sec.details")}</h4>${lv.body[state.lang]}</div>`;
  const goto = $("#modalGoto");
  goto.onclick = () => {
    closeModal();
    // havo & vwo share a combined page; otherwise use the level's own page if it exists, else levels listing
    const havoVwoMap = { havo:"havovwo", vwo:"havovwo" };
    const target = havoVwoMap[id] || (ALL_PAGE_IDS.includes(id) ? id : "levels");
    setPage(target);
  };
  const backdrop = $("#modal");
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add("open"));
  document.body.classList.add("no-scroll");
  $(".modal").focus();
}
function closeModal() {
  const b = $("#modal");
  b.classList.remove("open");
  setTimeout(() => { b.hidden = true; document.body.classList.remove("no-scroll"); if (lastFocus) lastFocus.focus(); }, 180);
}
window.openModal = openModal;

/* ═══════════════════════════════════════════════════════════
   CALCULATOR (NL 2026 simplified two-bracket tax)
═══════════════════════════════════════════════════════════ */
function calcSalary() {
  const grossEl = $("#calcGross");
  const ageEl = $("#calcAge");
  const out = $("#calcOut");
  if (!grossEl || !ageEl || !out) return;

  const g = Math.max(0, parseFloat(grossEl.value || "0"));
  const age = ageEl.value;
  const annualGross = g * 12;

  // Indicative 2026 simplified calculation used by this educational tool.
  // It is intentionally presented as an estimate, not an official payslip calculation.
  const b1 = age === "over" ? 0.1901 : 0.3707;
  const cutoff = 76817;
  let tax = 0;
  if (annualGross <= cutoff) tax = annualGross * b1;
  else tax = cutoff * b1 + (annualGross - cutoff) * 0.495;

  const annualNet = Math.max(0, annualGross - tax);
  const monthlyNet = annualNet / 12;
  const monthlyTax = tax / 12;
  const fmt = v => "€" + Math.round(v).toLocaleString("nl-NL");

  out.innerHTML = `
    <div class="calc-result-row big">
      <span>${t("calc.net")}</span>
      <strong>${fmt(monthlyNet)}</strong>
    </div>
    <div class="calc-result-row">
      <span>${t("calc.tax")}</span>
      <strong>${fmt(monthlyTax)}</strong>
    </div>
    <div class="calc-result-row">
      <span>${t("calc.yearly")}</span>
      <strong>${fmt(annualNet)}</strong>
    </div>
    <div class="calc-disclaimer">
      ${state.lang === "ar"
        ? "تقديري للتوضيح فقط؛ الصافي الفعلي قد يختلف حسب الإعفاءات، الخصومات، التأمينات وظروف العمل."
        : "Indicatie voor uitleg; het werkelijke nettoloon kan verschillen door heffingskortingen, premies en persoonlijke omstandigheden."}
    </div>`;
}
window.calcSalary = calcSalary;

/* ═══════════════════════════════════════════════════════════
   COMPARE TOOL — VISUAL DIAGRAM
═══════════════════════════════════════════════════════════ */
const NEXT_BY_ID = {
  kinderopvang:["basisschool"], basisschool:["vmbo","havo","vwo"],
  groep8:["vmbo","havo","vwo"], vmbo:["mbo","havo"],
  havo:["hbo","vwo"], vwo:["wo","hbo"], mbo:["hbo","werk"],
  hbo:["wo","werk"], wo:["phd","werk"],
  vavo:["mbo","hbo","wo"], isk:["vmbo","havo","vwo","mbo"],
  phd:["werk"], werk:[],
};
function parseAgeRange(r) {
  if (!r) return { min:0, max:25 };
  const s = String(r).trim();
  if (s.endsWith("+")) { const n = parseInt(s, 10); return { min:isNaN(n)?16:n, max:25 }; }
  const parts = s.split("-");
  if (parts.length === 2) return { min:parseInt(parts[0],10), max:parseInt(parts[1],10) };
  const n = parseInt(s, 10);
  return isNaN(n) ? { min:0, max:1 } : { min:n, max:n+1 };
}
function parseDurationYears(obj) {
  const s = (obj && (obj.nl || obj.ar)) || "";
  const nums = s.match(/\d+(?:[.,]\d+)?/g);
  if (!nums) return { min:1, max:1 };
  if (nums.length >= 2) return { min:+nums[0], max:+nums[1] };
  return { min:+nums[0], max:+nums[0] };
}
function runCompare() {
  const a = LEVEL_BY_ID[$("#cmpA").value];
  const b = LEVEL_BY_ID[$("#cmpB").value];
  if (!a || !b) return;
  const out = $("#cmpOut");
  out.innerHTML = "";
  out.classList.add("in");
  out.append(buildCompareDiagram(a, b));
}
window.runCompare = runCompare;
function buildCompareDiagram(a, b) {
  const ar = state.lang === "ar";
  const wrap = el("div", { class:"cmp-viz" });

  // 1. Card row
  const grid = el("div", { class:"cmp-grid" });
  [a, b].forEach((lv, i) => {
    const card = el("div", { class:"cmp-card", "data-side": i === 0 ? "a" : "b" });
    card.innerHTML = `<div class="cmp-card-ico">${lv.icon}</div>
      <div class="cmp-card-name">${lv.name[state.lang]}</div>
      <div class="cmp-card-nl nl">${lv.name.nl}</div>
      <div class="cmp-card-age"><bdi>${lv.ageRange}</bdi> · <bdi>${lv.duration[state.lang]}</bdi></div>`;
    grid.append(card);
  });
  wrap.append(grid);

  // 2. Age axis chart
  const ageA = parseAgeRange(a.ageRange), ageB = parseAgeRange(b.ageRange);
  const MIN_AGE = 0, MAX_AGE = 25;
  const pct = (v) => Math.max(0, Math.min(100, ((v - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100));
  const ageChart = el("div", { class:"cmp-chart" });
  ageChart.innerHTML = `<div class="cmp-chart-title">${ar ? "العمر" : "Leeftijd"}</div>
    <div class="cmp-axis-track">
      <div class="cmp-bar a" style="inset-inline-start:${pct(ageA.min)}%;width:${pct(ageA.max)-pct(ageA.min)}%"><bdi>${ageA.min}–${ageA.max}</bdi></div>
      <div class="cmp-bar b" style="inset-inline-start:${pct(ageB.min)}%;width:${pct(ageB.max)-pct(ageB.min)}%"><bdi>${ageB.min}–${ageB.max}</bdi></div>
    </div>
    <div class="cmp-axis-ticks"><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span></div>`;
  wrap.append(ageChart);

  // 3. Duration chart
  const durA = parseDurationYears(a.duration), durB = parseDurationYears(b.duration);
  const MAX_D = Math.max(6, durA.max, durB.max);
  const pctD = (v) => Math.min(100, (v / MAX_D) * 100);
  const dChart = el("div", { class:"cmp-chart" });
  dChart.innerHTML = `<div class="cmp-chart-title">${ar ? "المدة (سنوات)" : "Studieduur (jaren)"}</div>
    <div class="cmp-drow"><span class="cmp-dname">${a.name[state.lang]}</span><div class="cmp-dtrack"><div class="cmp-dbar a" style="width:${pctD(durA.max)}%"></div></div><span class="cmp-dval num"><bdi>${a.duration[state.lang]}</bdi></span></div>
    <div class="cmp-drow"><span class="cmp-dname">${b.name[state.lang]}</span><div class="cmp-dtrack"><div class="cmp-dbar b" style="width:${pctD(durB.max)}%"></div></div><span class="cmp-dval num"><bdi>${b.duration[state.lang]}</bdi></span></div>`;
  wrap.append(dChart);

  // 4. Next-step chips
  const nChart = el("div", { class:"cmp-chart" });
  nChart.append(el("div", { class:"cmp-chart-title" }, ar ? "الخطوات التالية" : "Vervolgstappen"));
  [a, b].forEach((lv, i) => {
    const row = el("div", { class:"cmp-nrow" });
    row.append(el("span", { class:"cmp-dname" }, lv.name[state.lang]));
    const chips = el("div", { class:"cmp-chips" });
    const nxt = NEXT_BY_ID[lv.id] || [];
    if (!nxt.length) chips.append(el("span", { class:"cmp-chip cmp-chip-none" }, ar ? "—" : "—"));
    nxt.forEach(nid => {
      const nlv = LEVEL_BY_ID[nid];
      if (!nlv) return;
      const chip = el("button", { class:"cmp-chip", "data-side": i === 0 ? "a" : "b", onclick: () => openModal(nid) });
      chip.innerHTML = `<span>${nlv.icon}</span><bdi>${nlv.name[state.lang]}</bdi>`;
      chips.append(chip);
    });
    row.append(chips);
    nChart.append(row);
  });
  wrap.append(nChart);

  return wrap;
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL SEARCH — index, query, UI (v2: fuzzy + synonyms + highlight)
═══════════════════════════════════════════════════════════ */
const stripTags = s => String(s || "").replace(/<[^>]+>/g, " ");

const _normCache = new Map();
function normalize(s) {
  if (s == null) return "";
  const k = typeof s === "string" ? s : String(s);
  if (_normCache.has(k)) return _normCache.get(k);
  const out = k.toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")               // combining diacritics (Latin)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")   // Arabic tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (_normCache.size < 5000) _normCache.set(k, out);
  return out;
}

/* ── Synonym groups: Arabic ↔ Dutch ↔ English (all normalized at load) ── */
const SYNONYM_GROUPS = [
  ["كهربائي","كهرباء","كهرباءي","elektromonteur","elektricien","elektro","elektrotechniek","electrician"],
  ["ممرض","ممرضة","تمريض","رعاية","verpleegkundige","verpleger","verpleeg","nurse","zorg"],
  ["طبخ","طباخ","شيف","كوك","kok","chef","cook"],
  ["محاسب","محاسبة","محاسبه","boekhouder","boekhouden","accountant","financieel"],
  ["سباك","سباكة","loodgieter","installateur","plumber"],
  ["نجار","نجارة","timmerman","carpenter"],
  ["ميكانيكي","ميكانيك","monteur","machinebankwerker","autotechnicus","mechanic"],
  ["مبرمج","مطور","برمجة","برمجه","developer","programmeur","software","programmer","coder"],
  ["أمن","امن","امني","beveiliger","politie","security"],
  ["سائق","chauffeur","driver"],
  ["مصمم","تصميم","designer","ontwerper","vormgever"],
  ["مصور","تصوير","fotograaf","photographer","camera"],
  ["مساعد","assistent","assistant"],
  ["مدرس","معلم","معلمه","leraar","docent","teacher","onderwijsassistent"],
  ["بائع","مبيعات","verkoper","sales"],
  ["تسويق","marketing","commercieel","ce"],
  ["بستاني","حديقة","hovenier","tuin","gardener"],
  ["فندق","مطعم","hotel","horeca","restaurant"],
  ["مخبز","خباز","bakker","banketbakker","baker","bakery"],
  ["جزار","لحم","slager","butcher"],
  ["أطفال","اطفال","طفولة","kinderopvang","pedagogisch","kinder"],
  ["صيدلية","صيدلي","apotheker","apotheek","pharmacy"],
  ["أسنان","اسنان","tandarts","dentaal","dentist"],
  ["طبيب","دكتور","dokter","arts","doctor"],
  ["مسعف","إسعاف","اسعاف","ambulance","ehbo","paramedic"],
  ["شرطة","politie","police"],
  ["إطفاء","اطفاء","brandweer","brandwacht","firefighter"],
  ["رسام","رسامه","tekenaar","illustrator"],
  ["ui","ux","واجهات","ontwerper","designer"],
  ["سيبراني","cyber","cybersecurity","security"],
  ["بيانات","data","analyse","analist","analyst"],
  ["شبكات","شبكه","netwerk","netwerkbeheerder","network"],
  ["نادل","مضيف","مضيفة","gastheer","gastvrouw","waiter","ober"],
  ["تجميل","تزيين","schoonheid","kapper","kapsalon"],
  ["سيارات","auto","voertuig","car"],
  ["شاحنة","شاحنات","chauffeur","goederen","truck"],
  ["مخزن","لوجستي","logistiek","warehouse","magazijn","logistics"],
  ["طيار","طيران","مضيف طيران","vlieg","luchtvaart","aviation","cabin","stewardess"],
  ["محامي","قانوني","قانون","juridisch","rechten","jurist","lawyer"],
  ["رياضة","sport","trainer","coach","fitness","zwem"],
  ["سفر","سياحة","toerisme","travel","tourism","reis"],
  ["لحام","لحّام","lasser","welder"],
  ["ألواح شمسية","الواح شمسية","طاقة شمسية","zonnepaneel","zonnepanelen","solar","pv"],
  ["مضخة حرارية","warmtepomp","heatpump"],
  ["رياح","wind","windturbine"],
  ["كيمياء","chemie","chemical"],
  ["مختبر","labor","laboratorium","lab"],
  ["فلك","سماء","astronomy"],
  ["موارد بشرية","hr","hrm","personeel","human resources"],
  ["مشتريات","inkoop","inkoper","procurement"],
  ["تجارة إلكترونية","تجارة الكترونية","ecommerce","e-commerce","webshop","online"],
  ["سكرتير","management assistent","directie-assistent","office","secretary"],
  ["عقارات","makelaar","real estate"],
  ["روبوتات","robotica","robotics","mechatronica","mechatronics"],
  ["lucht","aviation"],
  ["hbo","hoger","hoog","college","عالي"],
  ["mbo","middelbaar","middel"],
  ["vmbo","تحضيري","voorbereidend"],
  ["havo","اعدادي","havo"],
  ["vwo","ثانوي متقدم","voorbereidend wetenschappelijk"],
  ["انتقال","تحويل","overstap","overstappen","overgang","transition"],
  ["راتب","أجر","اجر","salaris","loon","salary","pay"],
  ["رخصة","شهادة","diploma","certificaat","license","cert"],
  ["دبلوم","diploma"],
  ["lasser","lassen","welding","لحام"],
  ["stukadoor","plaster","pleister","قصار"],
  ["barista","قهوة","espresso"],
  ["barbier","حلاق","حلاقة","barber"]
];
const SYN_MAP = (function(){
  const map = new Map();
  SYNONYM_GROUPS.forEach(group => {
    const norm = group.map(g => normalize(g)).filter(x => x);
    norm.forEach(w => {
      if (!map.has(w)) map.set(w, new Set());
      norm.forEach(o => { if (o !== w) map.get(w).add(o); });
    });
  });
  return map;
})();

function expandSynonyms(w) {
  if (!w) return [w];
  const out = [w];
  const s = SYN_MAP.get(w);
  if (s) for (const t of s) out.push(t);
  // prefix-based synonym boost: if w starts with a key or a key starts with w (len >= 4)
  if (w.length >= 4) {
    for (const [key, set] of SYN_MAP) {
      if (key === w) continue;
      if ((w.startsWith(key) || key.startsWith(w)) && Math.abs(key.length - w.length) <= 3) {
        out.push(key);
        for (const t of set) out.push(t);
      }
    }
  }
  return Array.from(new Set(out));
}

/* ── Damerau-Levenshtein distance with early exit ── */
function editDistMax(a, b, max) {
  if (a === b) return 0;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  if (la === 0) return lb;
  if (lb === 0) return la;
  let prev = new Array(lb + 1);
  let cur  = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= lb; j++) {
      const cost = a.charCodeAt(i-1) === b.charCodeAt(j-1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + cost);
      // transposition
      if (i > 1 && j > 1 &&
          a.charCodeAt(i-1) === b.charCodeAt(j-2) &&
          a.charCodeAt(i-2) === b.charCodeAt(j-1)) {
        cur[j] = Math.min(cur[j], prev[j-2] !== undefined ? prev[j-2] + 1 : cur[j]);
      }
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    const tmp = prev; prev = cur; cur = tmp;
  }
  return prev[lb];
}

let SEARCH_INDEX = null;
function buildSearchIndex() {
  const items = [];
  const pushItem = (o) => {
    o.tokens = o.haystack ? Array.from(new Set(o.haystack.split(" ").filter(t => t.length >= 2))) : [];
    o.titleHay = normalize((o.title?.ar || "") + " " + (o.title?.nl || ""));
    items.push(o);
  };

  // Primary + secondary pages
  [...PAGES, ...SECONDARY_PAGES].forEach(p => {
    pushItem({
      type:"page", icon: p.icon,
      title: p.label,
      subtitle: null,
      action: { kind:"page", id: p.id },
      haystack: normalize([p.label.ar, p.label.nl, p.id].join(" ")),
      boost: 5,
    });
  });
  // Education levels
  LEVELS.forEach(lv => {
    const bodyAr = stripTags(lv.body?.ar), bodyNl = stripTags(lv.body?.nl);
    const shortAr = stripTags(lv.short?.ar), shortNl = stripTags(lv.short?.nl);
    pushItem({
      type:"level", icon: lv.icon,
      title: lv.name,
      subtitle: { ar: shortAr.slice(0, 110), nl: shortNl.slice(0, 110) },
      action: { kind:"modal", id: lv.id },
      haystack: normalize([lv.name.ar, lv.name.nl, lv.id, shortAr, shortNl, bodyAr, bodyNl, lv.ageRange, lv.duration?.ar, lv.duration?.nl].join(" ")),
      boost: 10,
    });
  });
  // MBO sectors + professions
  MBO_SECTORS.forEach(s => {
    pushItem({
      type:"sector", icon: s.icon,
      title: s.name,
      subtitle: { ar: `${s.professions.length} مهنة`, nl: `${s.professions.length} beroepen` },
      action: { kind:"sector", id: s.id },
      haystack: normalize([s.name.ar, s.name.nl, s.id].join(" ")),
      boost: 6,
    });
    s.professions.forEach(pr => {
      const _j = (v) => Array.isArray(v) ? v.join(" ") : (v || "");
      const subAr = _j(pr.subjects?.ar);
      const subNl = _j(pr.subjects?.nl);
      const nextAr = _j(pr.next?.ar);
      const nextNl = _j(pr.next?.nl);
      pushItem({
        type:"profession", icon:"👷",
        title: pr.name,
        subtitle: s.name,
        action: { kind:"profession", sectorId: s.id, professionId: pr.id },
        haystack: normalize([pr.name.ar, pr.name.nl, pr.id, subAr, subNl, pr.entry?.ar, pr.entry?.nl, pr.cert?.ar, pr.cert?.nl, nextAr, nextNl, s.name.ar, s.name.nl].join(" ")),
        boost: 4,
      });
    });
  });
  // Transitions
  TRANSITIONS.forEach(tr => {
    pushItem({
      type:"transition", icon:"🔄",
      title: { ar: tr.from + " → " + tr.to, nl: tr.from + " → " + tr.to },
      subtitle: tr.req,
      action: { kind:"page", id:"transitions" },
      haystack: normalize([tr.from, tr.to, tr.req.ar, tr.req.nl, tr.notes.ar, tr.notes.nl].join(" ")),
      boost: 2,
    });
  });
  // Salaries
  SALARIES.forEach(sa => {
    pushItem({
      type:"salary", icon:"💶",
      title: sa.field,
      subtitle: { ar: sa.gross + " / شهر", nl: sa.gross + " / maand" },
      action: { kind:"page", id:"salaries" },
      haystack: normalize([sa.field.ar, sa.field.nl, sa.gross].join(" ")),
      boost: 1,
    });
  });
  // Exams / voortentamens
  if (typeof EXAMS !== "undefined" && Array.isArray(EXAMS)) {
    EXAMS.forEach(ex => {
      const _j = (v) => Array.isArray(v) ? v.join(" ") : (v || "");
      const subAr = _j(ex.subjects?.ar);
      const subNl = _j(ex.subjects?.nl);
      const tipAr = _j(ex.tips?.ar);
      const tipNl = _j(ex.tips?.nl);
      pushItem({
        type:"exam", icon: ex.icon || "📝",
        title: ex.name,
        subtitle: { ar: ex.duration?.ar || "", nl: ex.duration?.nl || "" },
        action: { kind:"exam", examId: ex.id },
        haystack: normalize([
          ex.id, ex.name.ar, ex.name.nl,
          ex.organizer?.ar, ex.organizer?.nl,
          ex.purpose?.ar, ex.purpose?.nl,
          subAr, subNl, tipAr, tipNl,
          ex.duration?.ar, ex.duration?.nl,
          ex.whoFor?.ar, ex.whoFor?.nl,
          ex.howToRegister?.ar, ex.howToRegister?.nl,
          "ccvx vasvu boswell colloquium doctum staatsexamen nt2 ielts toefl voortentamen toelatingsexamen",
          "امتحان قبول تحضيري امتحانات voortentamen"
        ].filter(Boolean).join(" ")),
        boost: 7,
      });
    });
  }
  // Study requirements
  if (typeof STUDY_REQUIREMENTS !== "undefined" && Array.isArray(STUDY_REQUIREMENTS)) {
    STUDY_REQUIREMENTS.forEach(st => {
      const _j = (v) => Array.isArray(v) ? v.join(" ") : (v || "");
      const reqAr = _j(st.requiredSubjects?.ar);
      const reqNl = _j(st.requiredSubjects?.nl);
      const uniAr = _j(st.universities?.ar);
      const uniNl = _j(st.universities?.nl);
      const tipAr = _j(st.tips?.ar);
      const tipNl = _j(st.tips?.nl);
      pushItem({
        type:"study", icon: st.icon || "🎓",
        title: st.name,
        subtitle: { ar: `دراسة ${st.level}`, nl: `${st.level}-studie` },
        action: { kind:"study", studyId: st.id },
        haystack: normalize([
          st.id, st.name.ar, st.name.nl,
          st.profile?.ar, st.profile?.nl,
          reqAr, reqNl, uniAr, uniNl, tipAr, tipNl,
          st.selection?.ar, st.selection?.nl,
          st.duration?.ar, st.duration?.nl,
          st.deadline?.ar, st.deadline?.nl,
          st.level,
          "geneeskunde tandheelkunde farmacie psychologie rechten informatica econometrie wiskunde natuurkunde scheikunde biomedische ai bouwkunde bedrijfskunde",
          "طب صيدلة قانون هندسة اسنان بيطري رياضيات فيزياء كيمياء ذكاء اصطناعي معمار اعمال"
        ].filter(Boolean).join(" ")),
        boost: 6,
      });
    });
  }
  // Study guidance / materials
  if (typeof STUDY_GUIDANCE !== "undefined" && Array.isArray(STUDY_GUIDANCE)) {
    STUDY_GUIDANCE.forEach(g => {
      const _j = (v) => Array.isArray(v) ? v.join(" ") : (v || "");
      const bookAr = _j(g.textbooks?.ar); const bookNl = _j(g.textbooks?.nl);
      const siteAr = _j(g.websites?.ar); const siteNl = _j(g.websites?.nl);
      const topAr  = _j(g.topics?.ar);   const topNl  = _j(g.topics?.nl);
      const tipAr  = _j(g.tips?.ar);     const tipNl  = _j(g.tips?.nl);
      pushItem({
        type:"guide", icon: g.icon || "📖",
        title: g.subject,
        subtitle: { ar: "دليل دراسة", nl: "Studiegids" },
        action: { kind:"guide", guideId: g.id },
        haystack: normalize([
          g.id, g.subject.ar, g.subject.nl,
          g.level?.ar, g.level?.nl,
          g.duration?.ar, g.duration?.nl,
          g.weeklyHours?.ar, g.weeklyHours?.nl,
          bookAr, bookNl, siteAr, siteNl, topAr, topNl, tipAr, tipNl,
          "wiskunde scheikunde biologie natuurkunde nederlands engels ielts toefl nt2",
          "رياضيات كيمياء أحياء فيزياء هولندي إنجليزي كتاب موقع"
        ].filter(Boolean).join(" ")),
        boost: 5,
      });
    });
  }
  SEARCH_INDEX = items;
}

/* LRU-ish cache for queries (bounded to 60 entries) */
const _searchCache = new Map();
function _cacheSet(k, v) {
  _searchCache.set(k, v);
  if (_searchCache.size > 60) {
    const firstKey = _searchCache.keys().next().value;
    _searchCache.delete(firstKey);
  }
}

function runSearch(q) {
  if (!SEARCH_INDEX) buildSearchIndex();
  const nq = normalize(q);
  if (!nq) return [];
  if (_searchCache.has(nq)) return _searchCache.get(nq);

  const words = nq.split(" ").filter(w => w.length > 0);
  if (!words.length) return [];

  // Per-word: list of variants to try (word + synonyms)
  const wordVariants = words.map(expandSynonyms);
  // remember original query words (normalized, unique) for highlighting
  searchState.queryWords = Array.from(new Set(wordVariants.flat())).filter(x => x);

  const scored = [];
  const prio = { level: 6, page: 5, sector: 4, profession: 3, transition: 2, salary: 1 };

  for (let i = 0; i < SEARCH_INDEX.length; i++) {
    const item = SEARCH_INDEX[i];
    let score = 0;
    let missed = false;
    let fuzzyPenalty = 0;

    for (let wi = 0; wi < wordVariants.length; wi++) {
      const variants = wordVariants[wi];
      const origW = words[wi];
      let bestHit = 0;
      let hitExact = false;
      let hitSyn = false;
      let hitFuzz = false;
      let hitAt = -1;

      for (const v of variants) {
        if (!v) continue;
        const idx = item.haystack.indexOf(v);
        if (idx >= 0) {
          if (v === origW) { hitExact = true; hitAt = idx; }
          else { hitSyn = true; hitAt = idx; }
          break;
        }
      }

      // Fuzzy fallback: try edit-distance against tokens (only for long-ish words)
      if (!hitExact && !hitSyn && origW.length >= 4) {
        const maxDist = origW.length <= 6 ? 1 : 2;
        for (const tok of item.tokens) {
          if (Math.abs(tok.length - origW.length) > maxDist) continue;
          if (editDistMax(tok, origW, maxDist) <= maxDist) {
            hitFuzz = true;
            hitAt = item.haystack.indexOf(tok);
            break;
          }
        }
      }

      if (!hitExact && !hitSyn && !hitFuzz) { missed = true; break; }

      // scoring
      if (hitExact) bestHit = 8;
      else if (hitSyn) bestHit = 6;
      else if (hitFuzz) { bestHit = 3; fuzzyPenalty += 2; }
      score += bestHit;

      // title bonuses (use original word; also check synonyms in title)
      const titleHay = item.titleHay;
      let inTitle = false;
      for (const v of variants) {
        if (v && titleHay.indexOf(v) >= 0) { inTitle = true; break; }
      }
      if (inTitle) {
        score += 25;
        const startsExact = titleHay.startsWith(origW);
        if (startsExact) score += 15;
      }
      if (hitAt === 0) score += 4;
    }

    if (missed) continue;
    score += (prio[item.type] || 0);
    score += (item.boost || 0);
    score -= fuzzyPenalty;
    scored.push({ item, score });
  }

  scored.sort((a,b) => b.score - a.score);
  const result = scored.slice(0, 40).map(x => x.item);
  _cacheSet(nq, result);
  return result;
}

/* Highlight matched parts in visible text (non-normalized) */
function highlightText(text, words) {
  if (!text) return "";
  if (!words || !words.length) return escapeHtml(text);
  // Tokenize visible text by whitespace, keep separators
  const parts = String(text).split(/(\s+)/);
  return parts.map(part => {
    if (/^\s+$/.test(part) || !part) return part;
    const normPart = normalize(part);
    let hit = false;
    for (const w of words) {
      if (!w) continue;
      if (normPart.indexOf(w) >= 0) { hit = true; break; }
      if (w.length >= 4) {
        const maxDist = w.length <= 6 ? 1 : 2;
        if (normPart.length > 0 && Math.abs(normPart.length - w.length) <= maxDist &&
            editDistMax(normPart, w, maxDist) <= maxDist) { hit = true; break; }
      }
    }
    return hit ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part);
  }).join("");
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
}

const searchState = { open:false, query:"", items:[], highlight:0, flatMap:[], queryWords:[] };

const TRENDING_QUERIES = {
  ar: ["HBO","MBO","كهربائي","ممرض","برمجة","لحام","راتب","VMBO","طاقة شمسية"],
  nl: ["HBO","MBO","elektromonteur","verpleeg","software","lasser","salaris","VMBO","zonnepanelen"]
};

function renderSearchResults() {
  const box = $("#searchResults");
  const input = $("#searchInput");
  const live = $("#searchLive");
  if (!box || !input) return;

  if (!searchState.open) {
    box.hidden = true;
    input.setAttribute("aria-expanded", "false");
    if (live) live.textContent = "";
    return;
  }

  box.hidden = false;
  input.setAttribute("aria-expanded", "true");
  box.innerHTML = "";

  const ar = state.lang === "ar";

  // Empty state — trending chips
  if (!searchState.query) {
    const wrap = el("div", { class:"search-empty-rich" });
    const head = el("div", { class:"search-empty-head" }, ar ? "ابدأ الكتابة للبحث عن أي شيء…" : "Typ om alles te zoeken…");
    const hint = el("div", { class:"search-empty-sub" }, ar ? "أو جرّب أحد المقترحات الشائعة:" : "Of probeer een populaire zoekopdracht:");
    wrap.append(head, hint);
    const chips = el("div", { class:"search-chips" });
    (TRENDING_QUERIES[state.lang] || TRENDING_QUERIES.ar).forEach(q => {
      const b = el("button", { type:"button", class:"search-chip",
        onclick: (e) => {
          e.preventDefault();
          input.value = q;
          input.dispatchEvent(new Event("input", { bubbles:true }));
          input.focus();
        } }, q);
      chips.append(b);
    });
    wrap.append(chips);
    box.append(wrap);
    if (live) live.textContent = "";
    return;
  }

  if (!searchState.items.length) {
    const empty = el("div", { class:"search-empty" }, t("search.empty"));
    box.append(empty);
    if (live) live.textContent = ar ? "لا توجد نتائج" : "Geen resultaten";
    return;
  }

  // Group by type and preserve score order
  const order = ["level", "page", "sector", "profession", "transition", "salary"];
  const groups = {};
  order.forEach(k => groups[k] = []);
  searchState.items.forEach(it => { (groups[it.type] || (groups[it.type] = [])).push(it); });

  const words = searchState.queryWords;
  const flat = [];
  order.forEach(key => {
    const list = groups[key];
    if (!list || !list.length) return;
    const count = list.length;
    const h = el("div", { class:"search-cat" });
    h.innerHTML = `<span>${escapeHtml(t("search.cat." + key))}</span><span class="search-cat-count">${count}</span>`;
    box.append(h);
    list.slice(0, 8).forEach(it => {
      const idx = flat.length;
      flat.push(it);
      const btn = el("button", {
        type:"button",
        class: "search-result" + (idx === searchState.highlight ? " hl" : ""),
        "data-idx": idx,
        role:"option",
        "aria-selected": idx === searchState.highlight ? "true" : "false",
        onclick: (e) => { e.preventDefault(); activateSearch(it); },
      });
      const titleText = it.title[state.lang] || "";
      const subText = it.subtitle ? (it.subtitle[state.lang] || "") : "";
      const titleH = highlightText(titleText, words);
      const subH = subText ? highlightText(subText, words) : "";
      btn.innerHTML = `<span class="search-ico2" aria-hidden="true">${escapeHtml(it.icon || "•")}</span>
        <div class="search-texts">
          <div class="search-t"><bdi>${titleH}</bdi></div>
          ${subH ? `<div class="search-s"><bdi>${subH}</bdi></div>` : ""}
        </div>
        <span class="search-type-pill type-${it.type}">${escapeHtml(t("search.type." + it.type) || it.type)}</span>`;
      box.append(btn);
    });
  });
  searchState.flatMap = flat;

  const hint = el("div", { class:"search-hint" });
  hint.innerHTML = `<span><kbd>↑</kbd><kbd>↓</kbd> ${escapeHtml(t("search.hint.k1"))}</span>
                    <span><kbd>Enter</kbd> ${escapeHtml(t("search.hint.k2"))}</span>
                    <span><kbd>Esc</kbd> ${escapeHtml(t("search.hint.k3"))}</span>
                    <span class="search-count-total">${searchState.items.length} ${ar ? "نتيجة" : "resultaten"}</span>`;
  box.append(hint);

  if (live) {
    live.textContent = ar
      ? `${searchState.items.length} نتيجة`
      : `${searchState.items.length} resultaten`;
  }
}

function activateSearch(it) {
  if (!it) return;
  closeSearch();
  if (it.action.kind === "modal") {
    openModal(it.action.id);
  } else if (it.action.kind === "page") {
    setPage(it.action.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (it.action.kind === "sector") {
    scrollToSector(it.action.id);
  } else if (it.action.kind === "profession") {
    scrollToProfession(it.action.sectorId, it.action.professionId);
  } else if (it.action.kind === "exam") {
    scrollToExam(it.action.examId);
  } else if (it.action.kind === "study") {
    scrollToStudy(it.action.studyId);
  } else if (it.action.kind === "guide") {
    scrollToGuide(it.action.guideId);
  }
}

function scrollToGuide(guideId) {
  if (state.page !== "exams") setPage("exams");
  setTimeout(() => {
    const target = document.getElementById(guideId);
    if (target) {
      target.scrollIntoView({ behavior:"smooth", block:"center" });
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 1600);
      try { history.replaceState(null, "", "#" + guideId); } catch(_){}
    }
  }, 180);
}

function scrollToExam(examId) {
  if (state.page !== "exams") setPage("exams");
  setTimeout(() => {
    const target = document.getElementById("exam-" + examId);
    if (target) {
      target.scrollIntoView({ behavior:"smooth", block:"center" });
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 1600);
      try { history.replaceState(null, "", "#exam-" + examId); } catch(_){}
    }
  }, 180);
}
function scrollToStudy(studyId) {
  if (state.page !== "exams") setPage("exams");
  setTimeout(() => {
    const target = document.getElementById("study-" + studyId);
    if (target) {
      target.scrollIntoView({ behavior:"smooth", block:"center" });
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 1600);
      try { history.replaceState(null, "", "#study-" + studyId); } catch(_){}
    }
  }, 180);
}

function scrollToSector(sectorId) {
  if (state.page !== "mbo-beroepen") setPage("mbo-beroepen");
  setTimeout(() => {
    const target = document.getElementById("mbo-sector-" + sectorId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("mbo-sector-flash");
      setTimeout(() => target.classList.remove("mbo-sector-flash"), 1500);
      try { history.replaceState(null, "", "#sector-" + sectorId); } catch(_){}
    }
  }, 180);
}
function scrollToProfession(sectorId, professionId) {
  if (state.page !== "mbo-beroepen") setPage("mbo-beroepen");
  setTimeout(() => {
    const target = document.getElementById("mbo-prof-" + sectorId + "-" + professionId)
                || document.getElementById("mbo-sector-" + sectorId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("mbo-sector-flash");
      setTimeout(() => target.classList.remove("mbo-sector-flash"), 1500);
      try { history.replaceState(null, "", "#prof-" + sectorId + "-" + professionId); } catch(_){}
    }
  }, 180);
}

function openSearch() { searchState.open = true; renderSearchResults(); }
function closeSearch() {
  searchState.open = false;
  searchState.highlight = 0;
  renderSearchResults();
}

function wireSearch() {
  const input = $("#searchInput");
  const clear = $("#searchClear");
  if (!input || !clear) return;

  input.placeholder = t("search.ph");

  // Debounced search: 80ms feels instant but avoids running per keystroke
  let _searchTimer = null;
  const runSearchDebounced = (q) => {
    if (_searchTimer) clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      searchState.items = q ? runSearch(q) : [];
      searchState.highlight = 0;
      searchState.open = true;
      renderSearchResults();
    }, 80);
  };

  input.addEventListener("input", () => {
    const q = input.value.trim();
    clear.hidden = !q;
    searchState.query = q;
    // For empty query, update immediately (show trending chips)
    if (!q) {
      if (_searchTimer) clearTimeout(_searchTimer);
      searchState.items = [];
      searchState.highlight = 0;
      searchState.open = true;
      renderSearchResults();
      return;
    }
    runSearchDebounced(q);
  });

  input.addEventListener("focus", () => {
    searchState.open = true;
    renderSearchResults();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (searchState.open) { closeSearch(); } else { input.blur(); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = searchState.flatMap.length;
      if (!n) return;
      searchState.highlight = (searchState.highlight + 1) % n;
      renderSearchResults();
      const el2 = document.querySelector(`.search-result[data-idx="${searchState.highlight}"]`);
      if (el2) el2.scrollIntoView({ block:"nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = searchState.flatMap.length;
      if (!n) return;
      searchState.highlight = (searchState.highlight - 1 + n) % n;
      renderSearchResults();
      const el2 = document.querySelector(`.search-result[data-idx="${searchState.highlight}"]`);
      if (el2) el2.scrollIntoView({ block:"nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = searchState.flatMap[searchState.highlight];
      if (it) activateSearch(it);
    }
  });

  clear.addEventListener("click", () => {
    input.value = "";
    searchState.query = "";
    searchState.items = [];
    searchState.highlight = 0;
    clear.hidden = true;
    input.focus();
    searchState.open = true;
    renderSearchResults();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchWrap")) closeSearch();
  });

  // Global "/" shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        input.focus();
        input.select();
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   LANGUAGE SWITCHER
═══════════════════════════════════════════════════════════ */
function setLang(code) {
  if (!I18N[code]) return;
  state.lang = code;
  safeStore.set("mbo_site_lang", code);
  applyI18n();
  renderNav();
  renderFooterLinks();
  renderMain();
  // refresh search placeholder + rerender open results in new language
  const si = $("#searchInput");
  if (si) si.placeholder = t("search.ph");
  if (searchState.open) renderSearchResults();
}

/* ═══════════════════════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════════════════════ */
let revealObs = null;
function observeReveal() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(n => n.classList.add("in")); return; }
  if (!revealObs) {
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  }
  $$(".reveal:not(.in)").forEach(n => revealObs.observe(n));
}

/* ═══════════════════════════════════════════════════════════
   INITIALIZATION
═══════════════════════════════════════════════════════════ */
function init() {
  const savedLang = safeStore.get("lang");
  if (savedLang && I18N[savedLang]) state.lang = savedLang;
  const hash = (location.hash || "").replace(/^#/, "");
  if (hash && ALL_PAGE_IDS.includes(hash)) state.page = hash;

  applyI18n();
  renderNav();
  renderFooterLinks();
  renderMain();
  observeReveal();
  buildSearchIndex();
  wireSearch();

  const langBtn = $("#langBtn");
  const langWrap = $("#langWrap");
  if (langBtn && langWrap) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = langWrap.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!langWrap.contains(e.target)) {
        langWrap.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
  $$(".lang-opt").forEach(b => b.addEventListener("click", () => {
    setLang(b.dataset.lang);
    if (langWrap) langWrap.classList.remove("open");
    if (langBtn) langBtn.setAttribute("aria-expanded", "false");
  }));

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-page]");
    if (t && t.dataset.page) {
      e.preventDefault();
      setPage(t.dataset.page);
    }
  });

  const mc = $("#modalClose");
  const mcb = $("#modalCloseBtn");
  const mb = $("#modal");
  if (mc) mc.addEventListener("click", closeModal);
  if (mcb) mcb.addEventListener("click", closeModal);
  if (mb) mb.addEventListener("click", (e) => { if (e.target === mb) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (mb && mb.classList.contains("open")) closeModal();
      if (langWrap && langWrap.classList.contains("open")) {
        langWrap.classList.remove("open");
        if (langBtn) langBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  window.addEventListener("hashchange", () => {
    const h = (location.hash || "").replace(/^#/, "");
    if (!h) return;
    // Deep-link: #prof-<sectorId>-<professionId>
    const pm = h.match(/^prof-([^-]+)-(.+)$/);
    if (pm) {
      const sectorId = pm[1], professionId = pm[2];
      if (typeof scrollToProfession === "function") {
        scrollToProfession(sectorId, professionId);
        return;
      }
    }
    // Deep-link: #sector-<sectorId>
    const sm = h.match(/^sector-(.+)$/);
    if (sm) {
      const sectorId = sm[1];
      if (typeof scrollToSector === "function") {
        scrollToSector(sectorId);
        return;
      }
    }
    if (ALL_PAGE_IDS.includes(h) && h !== state.page) setPage(h);
  });

  const progress = $(".scroll-progress");
  if (progress) {
    const onScroll = () => {
      const h = document.documentElement;
      const sc = h.scrollTop || document.body.scrollTop;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      progress.style.width = Math.min(100, (sc / max) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* V3 marker — 2026-09-26 */
