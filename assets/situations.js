/* «ما وضعك الآن؟» — personal path picker on the homepage (AR + NL).
   Every link points to an existing guide or tool. Ticked steps are kept only in this browser. */
(function () {
  'use strict';
  var box = document.getElementById('sit');
  if (!box) return;
  var nl = (document.documentElement.lang || '').slice(0, 2) === 'nl';
  var A = function (s) { return (nl ? '/nl/articles/' : '/articles/') + s + '.html'; };
  var C = function (s) { return (nl ? '/nl/calculators/' : '/calculators/') + s + '.html'; };
  var P = function (s) { return (nl ? '/nl/' : '/') + s; };

  var L = nl ? {
    yourPath: 'Jouw route', steps: 'stappen', done: 'klaar', tool: 'Handig hulpmiddel', open: 'Open de gids',
    mark: 'Markeer als gedaan', reset: 'Opnieuw', other: 'Andere situatie kiezen', tip: 'Tip'
  } : {
    yourPath: 'طريقك', steps: 'خطوات', done: 'أنجزت', tool: 'أداة تساعدك', open: 'افتح الدليل',
    mark: 'علّمها كمنجزة', reset: 'ابدأ من جديد', other: 'اختر وضعاً آخر', tip: 'نصيحة'
  };

  var S = [
    { id: 'new', ico: '🧳', tone: 'blue',
      t: nl ? 'Net aangekomen' : 'وصلت جديداً', s: nl ? 'BSN, DigiD, zorg en geld' : 'التسجيل والتأمين والبدلات',
      tip: nl ? 'Doe stap 1 eerst: zonder BSN lukt bijna niets anders.' : 'ابدأ بالخطوة 1: بدون BSN لا يمكنك فعل أي شيء تقريباً.',
      steps: [
        [nl ? 'Inschrijven bij de gemeente en BSN' : 'سجّل في البلدية واحصل على BSN', nl ? 'Je adres in de BRP is de basis voor alles.' : 'عنوانك في BRP أساس كل المعاملات.', A('bsn-municipality-registration')],
        [nl ? 'DigiD aanvragen' : 'اطلب DigiD', nl ? 'Je digitale sleutel voor overheid, toeslagen en zorg.' : 'مفتاحك الرقمي للحكومة والبدلات والصحة.', A('digid-registration-guide')],
        [nl ? 'Zorgverzekering afsluiten' : 'اشترك في التأمين الصحي', nl ? 'Verplicht binnen 4 maanden, anders boete.' : 'إلزامي خلال 4 أشهر وإلا تُفرض غرامة.', A('health-insurance-newcomers')],
        [nl ? 'Huisarts kiezen' : 'سجّل عند طبيب العائلة', nl ? 'Je eerste stap voor alle zorg.' : 'بوابتك لكل الخدمات الصحية.', A('huisarts-registration')],
        [nl ? 'Toeslagen checken' : 'افحص البدلات', nl ? 'Zorgtoeslag en huurtoeslag kunnen veel schelen.' : 'بدل التأمين والسكن يوفران كثيراً.', A('zorgtoeslag-guide')]
      ], tool: [nl ? 'Zorgtoeslag berekenen' : 'حاسبة zorgtoeslag', C('zorgtoeslag')] },

    { id: 'asiel', ico: '🛡️', tone: 'green',
      t: nl ? 'Ik heb een asielvergunning' : 'عندي إقامة لجوء', s: nl ? 'Inburgering, gezin, permanent' : 'الاندماج، لمّ الشمل، الدائمة',
      tip: nl ? 'Sinds 12 juni 2026 is de vergunning 3 jaar. Verleng altijd op tijd.' : 'منذ 12 يونيو 2026 الإقامة 3 سنوات. جدّدها دائماً في وقتها.',
      steps: [
        [nl ? 'Wat veranderde op 12 juni 2026' : 'ماذا تغيّر في 12 يونيو 2026', nl ? 'Tweestatusstelsel en vergunning van 3 jaar.' : 'نظام الحالتين وإقامة 3 سنوات.', A('asylum-two-status-system-2026')],
        [nl ? 'Gezin laten overkomen (nareis)' : 'لمّ شمل العائلة', nl ? 'Termijnen en voorwaarden per status.' : 'المهل والشروط حسب نوع الحماية.', A('asylum-family-reunification')],
        [nl ? 'Inburgeren' : 'أنهِ الاندماج', nl ? 'Nodig voor permanent verblijf en naturalisatie.' : 'شرط للإقامة الدائمة والجنسية.', A('inburgering-integration-law-2026')],
        [nl ? 'Syrische documenten regelen' : 'جهّز وثائقك السورية', nl ? 'Legaliseren en beëdigd vertalen.' : 'التصديق والترجمة المحلّفة.', A('syrian-documents-legalisation-translation')],
        [nl ? 'Route naar permanent verblijf' : 'الطريق إلى الإقامة الدائمة', nl ? 'EU-langdurig ingezetene na 5 jaar.' : 'EU-langdurig ingezetene بعد 5 سنوات.', A('permanent-residence-asylum-route')]
      ], tool: [nl ? 'Check permanent verblijf' : 'فاحص الإقامة الدائمة', C('permanent-residence-check')] },

    { id: 'perm', ico: '🏡', tone: 'orange',
      t: nl ? 'Ik wil permanent verblijf' : 'أريد الإقامة الدائمة', s: nl ? 'Of Nederlander worden' : 'أو الجنسية الهولندية',
      tip: nl ? 'Een tijdelijk contract is genoeg als het nog 12 maanden loopt.' : 'العقد المؤقت يكفي إذا بقي منه 12 شهراً.',
      steps: [
        [nl ? 'Doe eerst de check' : 'افحص وضعك أولاً', nl ? 'Score van 5 en het juiste formulier.' : 'تقييم من 5 والاستمارة الصحيحة.', C('permanent-residence-check')],
        [nl ? 'EU-langdurig: contract en inkomen' : 'الإقامة الأوروبية: العقد والدخل', nl ? 'Alle contractsituaties en documenten.' : 'كل حالات العقود والأوراق.', A('eu-permanent-residence-netherlands')],
        [nl ? 'Reguliere vergunning?' : 'إقامتك عادية (regulier)؟', nl ? 'EU-langdurig of onbepaalde tijd.' : 'الأوروبية أم العادية الدائمة.', A('permanent-residence-regular-route')],
        [nl ? 'Asielvergunning?' : 'إقامتك لجوء؟', nl ? 'Formulier 6011 en de 5 stappen.' : 'الاستمارة 6011 والخطوات الخمس.', A('permanent-residence-asylum-route')],
        [nl ? 'Naturalisatie' : 'التجنّس', nl ? 'Voorwaarden en kosten.' : 'الشروط والتكاليف.', A('dutch-naturalisation-guide')]
      ], tool: [nl ? 'Check permanent verblijf' : 'فاحص الإقامة الدائمة', C('permanent-residence-check')] },

    { id: 'letter', ico: '✉️', tone: 'red',
      t: nl ? 'Ik kreeg een brief' : 'وصلتني رسالة', s: nl ? 'Boete, schuld of besluit' : 'غرامة، دين، أو قرار',
      tip: nl ? 'Let op de datum: bezwaar maken kan meestal binnen 6 weken.' : 'انتبه للتاريخ: الاعتراض عادة خلال 6 أسابيع فقط.',
      steps: [
        [nl ? 'Begrijp de woorden' : 'افهم كلمات الرسالة', nl ? '141 overheidswoorden uitgelegd.' : '141 مصطلحاً حكومياً مشروحاً.', A('dutch-government-terms-glossary')],
        [nl ? 'Is het echt?' : 'هل الرسالة حقيقية؟', nl ? 'Herken phishing en oplichting.' : 'اكشف الاحتيال والرسائل المزيفة.', A('scams-phishing-netherlands')],
        [nl ? 'Niet eens? Bezwaar maken' : 'غير موافق؟ اعترض', nl ? 'Met voorbeeldbrief.' : 'مع نموذج رسالة جاهز.', A('bezwaar-objection-letter')],
        [nl ? 'Boete van het CJIB' : 'غرامة من CJIB', nl ? 'Betalen, termijnen en verhogingen.' : 'الدفع والمهل والزيادات.', A('traffic-fines-cjib')],
        [nl ? 'Schulden? Gratis hulp' : 'ديون؟ مساعدة مجانية', nl ? 'Schuldhulp van de gemeente.' : 'مساعدة الديون من البلدية.', A('debt-help-schuldhulp')]
      ], tool: [nl ? 'Gratis advocaat (toevoeging)' : 'محامٍ بمساعدة قانونية', A('legal-aid-lawyer-toevoeging')] },

    { id: 'work', ico: '💼', tone: 'blue',
      t: nl ? 'Werk zoeken of werken' : 'أبحث عن عمل', s: nl ? 'Cv, contract en salaris' : 'السيرة، العقد، الراتب',
      tip: nl ? 'Controleer je loonstrook elke maand: fouten zie je daar eerst.' : 'افحص قسيمة راتبك كل شهر: الأخطاء تظهر فيها أولاً.',
      steps: [
        [nl ? 'Kansrijke beroepen' : 'المهن المطلوبة', nl ? 'Waar is werk in 2026–2027?' : 'أين العمل في 2026–2027؟', A('trending-jobs-2026')],
        [nl ? 'Maak je Nederlandse cv' : 'اصنع سيرتك الذاتية', nl ? 'In vier stappen, gratis.' : 'بأربع خطوات ومجاناً.', P('cv.html')],
        [nl ? 'Je arbeidscontract' : 'افهم عقد عملك', nl ? 'Rechten, proeftijd en opzegging.' : 'الحقوق وفترة التجربة والإنهاء.', A('employment-contracts-labor-law-2026')],
        [nl ? 'Je loonstrook' : 'اقرأ قسيمة راتبك', nl ? 'Bruto, netto en inhoudingen.' : 'الإجمالي والصافي والاقتطاعات.', A('dutch-payslip-explained')],
        [nl ? 'Minimumloon 2026' : 'الحد الأدنى للأجور 2026', nl ? 'Krijg je genoeg?' : 'هل تحصل على حقك؟', A('minimum-wage-netherlands')]
      ], tool: [nl ? 'Maak je cv' : 'أنشئ سيرتك الذاتية', P('cv.html')] },

    { id: 'kids', ico: '👶', tone: 'green',
      t: nl ? 'Ik heb (of krijg) een kind' : 'عندي طفل', s: nl ? 'Toeslagen, opvang en school' : 'البدلات، الحضانة، المدرسة',
      tip: nl ? 'Kinderbijslag en kindgebonden budget zijn twee verschillende regelingen.' : 'kinderbijslag وkindgebonden budget بدلان مختلفان: اطلب الاثنين.',
      steps: [
        [nl ? 'Zwanger en bevallen' : 'الحمل والولادة', nl ? 'Verloskundige, kraamzorg en aangifte.' : 'القابلة والرعاية وتسجيل المولود.', A('pregnancy-newborn-care')],
        [nl ? 'Kinderbijslag' : 'بدل الأطفال kinderbijslag', nl ? 'Per kwartaal van de SVB.' : 'كل ثلاثة أشهر من SVB.', A('kinderbijslag-guide')],
        [nl ? 'Kindgebonden budget' : 'kindgebonden budget', nl ? 'Extra per maand naast kinderbijslag.' : 'مبلغ شهري إضافي حسب الدخل.', A('kindgebonden-budget-guide')],
        [nl ? 'Kinderopvangtoeslag' : 'بدل الحضانة', nl ? 'Als je werkt of studeert.' : 'إن كنت تعمل أو تدرس.', A('childcare-allowance-kinderopvangtoeslag')],
        [nl ? 'De basisschool' : 'المدرسة الابتدائية', nl ? 'Inschrijven en hoe het werkt.' : 'التسجيل وكيف تعمل.', A('dutch-school-system-basisschool')]
      ], tool: [nl ? 'Kindgebonden budget berekenen' : 'حاسبة kindgebonden budget', C('kindgebonden-budget')] },

    { id: 'study', ico: '🎓', tone: 'orange',
      t: nl ? 'Ik wil studeren' : 'أريد الدراسة', s: nl ? 'Diploma, taal en DUO' : 'الشهادة، اللغة، التمويل',
      tip: nl ? 'Laat je buitenlandse diploma eerst waarderen; dat bepaalt je niveau.' : 'قيّم شهادتك الأجنبية أولاً؛ فهي تحدد مستواك.',
      steps: [
        [nl ? 'Wat is mijn diploma waard?' : 'شهادتي تعادل ماذا؟', nl ? 'Per niveau uitgelegd.' : 'حسب كل مستوى دراسي.', A('diploma-recognition-by-education-level')],
        [nl ? 'Mbo, hbo of wo?' : 'MBO أم HBO أم الجامعة؟', nl ? 'De verschillen op een rij.' : 'الفروق بوضوح.', A('mbo-hbo-wo-comparison')],
        [nl ? 'Taal: staatsexamen Nt2' : 'اللغة: امتحان NT2', nl ? 'Niveau B1 of B2.' : 'المستوى B1 أو B2.', A('nt2-b1-exam-guide')],
        [nl ? 'Studiefinanciering' : 'تمويل الدراسة DUO', nl ? 'Wie krijgt wat?' : 'من يستحق وكم؟', A('student-finance')]
      ], tool: [nl ? 'Onderwijsroutes vergelijken' : 'قارن مسارات التعليم', P('tools.html#routes')] },

    { id: 'home', ico: '🔑', tone: 'red',
      t: nl ? 'Wonen en huur' : 'السكن والإيجار', s: nl ? 'Huurwoning, rechten en toeslag' : 'السكن الاجتماعي والحقوق',
      tip: nl ? 'Schrijf je zo vroeg mogelijk in voor een sociale huurwoning: de wachttijd telt.' : 'سجّل مبكراً للسكن الاجتماعي: مدة الانتظار هي ما يُحسب.',
      steps: [
        [nl ? 'Sociale huurwoning zoeken' : 'ابحث عن سكن اجتماعي', nl ? 'Inschrijven en wachttijd.' : 'التسجيل ومدة الانتظار.', A('social-housing-sociale-huurwoning')],
        [nl ? 'Je rechten als huurder' : 'حقوقك كمستأجر', nl ? 'Huurprijs, onderhoud en opzegging.' : 'الإيجار والصيانة والإنهاء.', A('tenant-rights-netherlands')],
        [nl ? 'Huurtoeslag' : 'بدل السكن', nl ? 'Hoeveel krijg je terug?' : 'كم تسترد من الإيجار؟', A('housing-rent-allowance-2026')],
        [nl ? 'Verhuizen: adres wijzigen' : 'انتقلت؟ غيّر عنوانك', nl ? 'Binnen 5 dagen doorgeven.' : 'أبلغ خلال 5 أيام.', A('change-address-netherlands')],
        [nl ? 'Energiecontract' : 'عقد الكهرباء والغاز', nl ? 'Kiezen en besparen.' : 'اختر ووفّر.', A('energy-contracts-saving-2026')]
      ], tool: [nl ? 'Maandbudget' : 'ميزانية الشهر', P('tools.html#budget')] }
  ];

  var KEY = 'gn-sit-v1';
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ } }

  var grid = box.querySelector('.sit-grid');
  var panel = box.querySelector('.sit-path');
  var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  grid.innerHTML = S.map(function (x) {
    return '<button type="button" class="sit-card t-' + x.tone + '" data-id="' + x.id + '" aria-expanded="false" aria-controls="sit-path">'
      + '<span class="sit-ico" aria-hidden="true">' + x.ico + '</span><strong>' + esc(x.t) + '</strong><span>' + esc(x.s) + '</span></button>';
  }).join('');

  function doneOf(x) { return (state[x.id] || []).filter(Boolean).length; }

  function show(id, scroll) {
    var x = S.filter(function (s) { return s.id === id; })[0];
    if (!x) return;
    [].forEach.call(grid.children, function (b) {
      var on = b.getAttribute('data-id') === id;
      b.classList.toggle('on', on); b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    var ticks = state[x.id] || [];
    var n = x.steps.length, d = doneOf(x);
    panel.className = 'sit-path t-' + x.tone;
    panel.innerHTML =
      '<div class="sit-head"><span class="sit-ico big" aria-hidden="true">' + x.ico + '</span><div><p class="sit-kicker">' + L.yourPath + '</p>'
      + '<h3 tabindex="-1">' + esc(x.t) + '</h3><p class="sit-meta">' + n + ' ' + L.steps + ' · <b class="sit-count">' + d + '</b>/' + n + ' ' + L.done + '</p></div></div>'
      + '<div class="sit-bar" aria-hidden="true"><span style="width:' + Math.round(d / n * 100) + '%"></span></div>'
      + '<ol class="sit-steps">' + x.steps.map(function (st, i) {
        return '<li class="' + (ticks[i] ? 'ok' : '') + '"><label class="sit-tick"><input type="checkbox" data-i="' + i + '"' + (ticks[i] ? ' checked' : '') + '><span class="sr">' + L.mark + '</span></label>'
          + '<a href="' + st[2] + '"><span class="sit-n">' + (i + 1) + '</span><span class="sit-txt"><strong>' + esc(st[0]) + '</strong><small>' + esc(st[1]) + '</small></span><span class="sit-go" aria-hidden="true">' + (nl ? '→' : '←') + '</span></a></li>';
      }).join('') + '</ol>'
      + '<p class="sit-tip"><b>💡 ' + L.tip + ':</b> ' + esc(x.tip) + '</p>'
      + '<div class="sit-actions"><a class="sit-tool" href="' + x.tool[1] + '">🧰 ' + L.tool + ': <b>' + esc(x.tool[0]) + '</b></a>'
      + '<button type="button" class="sit-other">' + L.other + '</button></div>';
    panel.hidden = false;
    panel.querySelectorAll('.sit-steps input').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var arr = state[x.id] || []; arr[+cb.getAttribute('data-i')] = cb.checked; state[x.id] = arr; save();
        cb.closest('li').classList.toggle('ok', cb.checked);
        var dd = doneOf(x);
        panel.querySelector('.sit-count').textContent = dd;
        panel.querySelector('.sit-bar span').style.width = Math.round(dd / n * 100) + '%';
      });
    });
    panel.querySelector('.sit-other').addEventListener('click', function () {
      panel.hidden = true; grid.querySelector('.on') && grid.querySelector('.on').focus();
      [].forEach.call(grid.children, function (b) { b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); });
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    state._last = id; save();
    if (scroll) { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); panel.querySelector('h3').focus({ preventScroll: true }); }
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.sit-card'); if (!b) return;
    show(b.getAttribute('data-id'), true);
  });
  if (state._last) show(state._last, false);
})();
