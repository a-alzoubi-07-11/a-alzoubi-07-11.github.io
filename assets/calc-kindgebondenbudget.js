/* Kindgebonden budget 2026 — estimate calculator (AR/NL). No libraries, no network calls.
 * Pure function: calcKindgebondenbudget(input) -> {amountMonth, amountYear, eligible, reasons[], warnings[], ...}
 * All 2026 parameters live in P. Primary source for every amount below:
 *   Dienst Toeslagen, "Berekening kindgebonden budget 2026" (TG 081 - 1Z61FD), stap 1-5 + rekenvoorbeelden
 *   https://download.belastingdienst.nl/toeslagen/docs/berekening_kindgebonden_budget_tg0811z61fd.pdf
 *   (listed on https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/berekening-kindgebonden-budget)
 */
(function (root) {
  'use strict';

  var P = {
    year: 2026,
    // Basisbedrag per kind — 2026 is a flat amount per child (1st, 2nd, 3rd … all € 2.580).
    // Source: berekening_kindgebonden_budget_tg0811z61fd.pdf, stap 1 ("1 kind € 2.580; 2 kinderen € 5.160; verhoging vanaf 3e kind € 2.580")
    perChild: 2580,
    // Verhoging alleenstaande ouder (ALO-kop): table shows 1 kind alleenstaande € 5.996 vs met partner € 2.580 → € 3.416
    // (2 kinderen: € 8.576 − € 5.160 = € 3.416). Source: same PDF, stap 1.
    aloKop: 3416,
    // Verhoging per kind 12 t/m 15 jaar en per kind van 16 en 17 jaar. Source: same PDF, stap 2.
    supp12to15: 724,
    supp16to17: 964,
    // Drempelinkomen (toetsingsinkomen t/m dit bedrag = maximale toeslag). Source: same PDF, stap 4.
    thresholdSingle: 29736,
    thresholdPartner: 39141,
    // Afbouw: 7,6% van het (gezamenlijke) toetsingsinkomen boven de drempel. Source: same PDF, stap 4.
    taperRate: 0.076,
    // Vermogensgrens op 1 januari 2026 (hoger = het hele jaar geen recht). Source: same PDF, "Vermogen mag niet te hoog zijn";
    // also https://www.belastingdienst.nl/wps/wcm/connect/nl/kindgebonden-budget/content/maximaal-vermogen-kindgebonden-budget
    assetLimitSingle: 146011,
    assetLimitPartner: 184633,
    maxChildAge: 17
  };

  function num(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    if (v == null) return 0;
    var s = String(v).trim().replace(/\s|€/g, '');
    // accept "45.000", "45,000", "45000,50"
    if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '');
    else s = s.replace(',', '.');
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }
  function cnt(v) { var n = Math.floor(num(v)); return n > 0 ? Math.min(n, 20) : 0; }
  function r2(x) { return Math.round(x * 100) / 100; }

  /**
   * input: {partner:bool, income:number (gezamenlijk toetsingsinkomen 2026), assets:number (1 jan 2026, incl. partner + minderjarige kinderen),
   *         kids0to11, kids12to15, kids16to17, kinderbijslag:bool, childrenAbroad:bool (outside EU/EER/CH)}
   */
  function calcKindgebondenbudget(input) {
    input = input || {};
    var partner = !!input.partner;
    var income = Math.max(0, num(input.income));
    var assets = num(input.assets);
    var a = cnt(input.kids0to11), b = cnt(input.kids12to15), c = cnt(input.kids16to17);
    var kids = a + b + c;
    var reasons = [], warnings = [];

    var maxBase = kids * P.perChild + (partner || kids === 0 ? 0 : P.aloKop);
    var supp = b * P.supp12to15 + c * P.supp16to17;
    var maxYear = maxBase + supp;
    var threshold = partner ? P.thresholdPartner : P.thresholdSingle;
    var reduction = r2(Math.max(0, income - threshold) * P.taperRate);
    var assetLimit = partner ? P.assetLimitPartner : P.assetLimitSingle;

    if (kids === 0) reasons.push('noChildren');
    if (input.kinderbijslag === false) reasons.push('noKinderbijslag');
    if (assets > assetLimit) reasons.push('assets');
    var year = r2(Math.max(0, maxYear - reduction));
    if (kids > 0 && year <= 0) reasons.push('income');
    if (input.childrenAbroad) warnings.push('abroad');

    var eligible = reasons.length === 0;
    if (!eligible) year = 0;
    return {
      eligible: eligible,
      reasons: reasons,
      warnings: warnings,
      amountYear: year,
      // Toeslagen pays whole euros per month; the official examples round the monthly amount down (€ 392,89 → € 392).
      amountMonth: Math.floor(year / 12),
      amountMonthExact: r2(year / 12),
      maxYear: maxYear,
      reduction: eligible ? Math.min(reduction, maxYear) : reduction,
      threshold: threshold,
      assetLimit: assetLimit,
      // income at which the amount reaches € 0 for this household
      incomeLimit: kids ? Math.round(threshold + maxYear / P.taperRate) : 0
    };
  }

  root.calcKindgebondenbudget = calcKindgebondenbudget;
  root.KGB_P = P;
  if (typeof module !== 'undefined' && module.exports) module.exports = { calcKindgebondenbudget: calcKindgebondenbudget, P: P };

  // ---------------- UI binder ----------------
  if (typeof document === 'undefined') return;

  var PROEF = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/hulpmiddel-proefberekening-toeslagen';
  var T = {
    ar: {
      month: 'تقدير شهري (يُدفع بالأورو الكامل)', year: 'تقدير سنوي 2026',
      max: 'الحد الأقصى لأسرتك قبل التخفيض', red: 'التخفيض بسبب الدخل (7.6% فوق ', limit: 'يصبح المبلغ صفراً تقريباً عند دخل مشترك قدره',
      notEl: 'على الأرجح لا تستحق kindgebonden budget لعام 2026',
      r: {
        noChildren: 'أدخل طفلاً واحداً على الأقل دون 18 سنة.',
        noKinderbijslag: 'يُشترط أن تُدفع لك (أو لشريكك) kinderbijslag عن الطفل.',
        assets: 'أصولكم في 1 يناير 2026 أعلى من الحد ({x}).',
        income: 'الدخل مرتفع: التخفيض (7.6% من الدخل فوق {t}) يساوي المبلغ الأقصى أو يزيد عليه.'
      },
      w: { abroad: 'طفل يعيش خارج الاتحاد الأوروبي/EER/سويسرا: يُطبَّق «معامل بلد الإقامة» (woonlandfactor) فيقلّ المبلغ أو يصبح صفراً؛ لم نحسبه هنا.' },
      ages: 'افترضنا أن عمر كل طفل ثابت طوال 2026؛ الزيادة عند 12 و16 تبدأ في الشهر التالي لعيد الميلاد.',
      disc: 'هذا تقدير فقط وليس قراراً رسمياً. تأكد عبر الحساب التجريبي الرسمي من Belastingdienst:',
      proef: 'Proefberekening toeslagen',
      err: 'أدخل الدخل وعدد الأطفال بأرقام صحيحة.'
    },
    nl: {
      month: 'Schatting per maand (uitbetaald in hele euro’s)', year: 'Schatting per jaar 2026',
      max: 'Maximaal bedrag voor uw gezin vóór vermindering', red: 'Vermindering door inkomen (7,6% boven ', limit: 'Het bedrag wordt ongeveer € 0 bij een gezamenlijk inkomen van',
      notEl: 'Waarschijnlijk geen recht op kindgebonden budget in 2026',
      r: {
        noChildren: 'Vul minstens één kind jonger dan 18 jaar in.',
        noKinderbijslag: 'U (of uw toeslagpartner) moet kinderbijslag voor het kind krijgen.',
        assets: 'Uw vermogen op 1 januari 2026 is hoger dan de grens ({x}).',
        income: 'Inkomen te hoog: de vermindering (7,6% van het inkomen boven {t}) is even groot als of groter dan het maximale bedrag.'
      },
      w: { abroad: 'Kind woont buiten de EU/EER/Zwitserland: de woonlandfactor verlaagt het bedrag (soms tot € 0). Dat is hier niet berekend.' },
      ages: 'We gaan uit van dezelfde leeftijd het hele jaar; de verhoging bij 12 en 16 jaar gaat in ná de maand van de verjaardag.',
      disc: 'Dit is alleen een schatting, geen officieel besluit. Controleer het met de officiële proefberekening van de Belastingdienst:',
      proef: 'Proefberekening toeslagen',
      err: 'Vul inkomen en aantal kinderen in met geldige getallen.'
    }
  };

  var fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
  var fmt0 = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function money(x, whole) { return '<span dir="ltr">' + esc((whole ? fmt0 : fmt).format(x)) + '</span>'; }

  function bind() {
    var box = document.getElementById('calc-kindgebondenbudget');
    if (!box) return;
    var form = box.querySelector('form');
    var out = box.querySelector('.tool-result');
    if (!form || !out) return;
    var lang = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
    var L = T[lang];
    function val(name) { var el = form.elements[name]; return el ? el.value : ''; }
    function chk(name) { var el = form.elements[name]; return el ? !!el.checked : false; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var incomeRaw = val('income');
      if (String(incomeRaw).trim() === '' || num(incomeRaw) < 0) { out.innerHTML = '<p>' + esc(L.err) + '</p>'; return; }
      var res = calcKindgebondenbudget({
        partner: chk('partner'),
        income: incomeRaw,
        assets: val('assets'),
        kids0to11: val('kids0to11'),
        kids12to15: val('kids12to15'),
        kids16to17: val('kids16to17'),
        kinderbijslag: chk('kinderbijslag'),
        childrenAbroad: chk('abroad')
      });
      var h = '';
      if (res.eligible) {
        h += '<p>' + esc(L.month) + '</p><strong dir="ltr">' + esc(fmt0.format(res.amountMonth)) + '</strong>';
        h += '<p>' + esc(L.year) + ': ' + money(res.amountYear) + '</p>';
        h += '<p>' + esc(L.max) + ': ' + money(res.maxYear, true) + '</p>';
        if (res.reduction > 0) h += '<p>' + esc(L.red) + money(res.threshold, true) + '): −' + money(res.reduction) + '</p>';
        h += '<p>' + esc(L.limit) + ' ' + money(res.incomeLimit, true) + '.</p>';
      } else {
        h += '<p><b>' + esc(L.notEl) + '</b></p><ul>';
        res.reasons.forEach(function (r) {
          var t = L.r[r].replace('{x}', fmt0.format(res.assetLimit)).replace('{t}', fmt0.format(res.threshold));
          h += '<li>' + esc(t).replace(/(€\s?[\d.,]+)/g, '<span dir="ltr">$1</span>') + '</li>';
        });
        h += '</ul>';
      }
      res.warnings.forEach(function (w) { h += '<p class="notice">' + esc(L.w[w]) + '</p>'; });
      if (res.eligible && (num(val('kids12to15')) > 0 || num(val('kids16to17')) > 0)) h += '<p>' + esc(L.ages) + '</p>';
      h += '<p class="notice">' + esc(L.disc) + ' <a href="' + PROEF + '" target="_blank" rel="noopener">' + esc(L.proef) + '</a></p>';
      out.innerHTML = h;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})(typeof window !== 'undefined' ? window : globalThis);
