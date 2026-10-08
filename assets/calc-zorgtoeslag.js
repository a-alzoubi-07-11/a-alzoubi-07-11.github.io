/* Zorgtoeslag 2026 calculator — estimate only. Vanilla JS, no network calls.
 * Pure function: calcZorgtoeslag(input) -> {amountMonth, amountYear, eligible, reasons[], ...}
 * UI binder: reads the form inside #calc-zorgtoeslag and writes into .tool-result.
 */
(function () {
  'use strict';

  /* ALL 2026 parameters. Main source: Dienst Toeslagen, "Berekening zorgtoeslag 2026" (TG 082 - 1Z61FD, januari 2026):
   * https://download.belastingdienst.nl/toeslagen/docs/berekening_zorgtoeslag_tg0821z61fd.pdf */
  var P = {
    year: 2026,
    // Standaardpremie 2026 per verzekerde (×2 with a toeslagpartner). Source: PDF above, stap 1.
    standaardpremie: 2119,
    // Drempelinkomen 2026. Source: PDF above, stap 3.
    drempelinkomen: 29736,
    // Normpercentage of the drempelinkomen. Source: PDF above, stap 3, and Besluit percentages drempel- en
    // toetsingsinkomen zorgtoeslag (wijziging 2026): https://zoek.officielebekendmakingen.nl/stcrt-2025-42977.html
    pctDrempelSingle: 0.01912,
    pctDrempelPartner: 0.04289,
    // Afbouwpercentage on the toetsingsinkomen above the drempelinkomen (single and partner). Same sources.
    pctAfbouw: 0.1373,
    // Income limits (toetsingsinkomen, combined with partner). Sources: PDF above, stap 2, and
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/kan-ik-zorgtoeslag-krijgen
    incomeLimitSingle: 40857,
    incomeLimitPartner: 51142,
    // Vermogensgrens on 1 January 2026 (combined with partner). Sources: PDF above and
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/maximaal-vermogen-zorgtoeslag
    assetLimitSingle: 146011,
    assetLimitPartner: 184633,
    // Partner without a Dutch zorgverzekering: 50% of the calculated toeslag. Sources: PDF above, stap 4, and
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/zorgtoeslag-andere-nationaliteit
    partnerUninsuredFactor: 0.5
    // Maximum for checking (PDF, stap 3): € 1.550 single / € 2.963 with partner per year.
    // Monthly advance: yearly / 12, rounded DOWN to whole euros — matches the official table on
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/hoeveel-zorgtoeslag
  };

  function num(v) {
    var n = typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }
  function cents(x) { return Math.round(x * 100) / 100; }

  /* input: {partner:boolean, partnerInsured:boolean(default true), income:number (yearly toetsingsinkomen,
   *         combined if partner), assets:number (1 Jan 2026, combined), age18:boolean, insured:boolean, legalStay:boolean} */
  function calcZorgtoeslag(input) {
    input = input || {};
    var partner = !!input.partner;
    var partnerInsured = input.partnerInsured !== false;
    var income = num(input.income);
    var assets = num(input.assets);
    if (!isFinite(assets) || assets < 0) assets = 0;
    var reasons = [];

    if (input.age18 === false) reasons.push('age');
    if (input.insured === false) reasons.push('insurance');
    if (input.legalStay === false) reasons.push('residence');
    if (!isFinite(income)) reasons.push('income_missing');

    var incomeLimit = partner ? P.incomeLimitPartner : P.incomeLimitSingle;
    var assetLimit = partner ? P.assetLimitPartner : P.assetLimitSingle;
    if (assets > assetLimit) reasons.push('assets');
    if (isFinite(income) && income > incomeLimit) reasons.push('income');

    var inc = isFinite(income) ? Math.max(0, income) : 0;
    var premie = P.standaardpremie * (partner ? 2 : 1);
    var normpremie = cents((partner ? P.pctDrempelPartner : P.pctDrempelSingle) * P.drempelinkomen +
      P.pctAfbouw * Math.max(0, inc - P.drempelinkomen));
    var year = Math.max(0, cents(premie - normpremie));
    if (partner && !partnerInsured) year = cents(year * P.partnerUninsuredFactor);
    if (year <= 0 && reasons.indexOf('income') < 0 && reasons.indexOf('income_missing') < 0) reasons.push('normpremie');

    var eligible = reasons.length === 0 && year > 0;
    if (!eligible) year = 0;
    return {
      eligible: eligible,
      amountYear: year,
      amountMonth: eligible ? Math.floor(year / 12) : 0,
      amountMonthExact: eligible ? cents(year / 12) : 0,
      standaardpremie: premie,
      normpremie: normpremie,
      incomeLimit: incomeLimit,
      assetLimit: assetLimit,
      reasons: reasons
    };
  }

  var PROEF = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/hulpmiddel-proefberekening-toeslagen';
  var T = {
    ar: {
      fill: 'أدخل الدخل السنوي المتوقع لعام 2026 (رقماً، ويمكن أن يكون 0).',
      month: 'تقدير بدل الرعاية الصحية شهرياً',
      year: 'المبلغ السنوي لعام 2026',
      exact: 'المتوسط الدقيق شهرياً',
      calc: 'طريقة الحساب',
      premie: 'القسط المعياري (standaardpremie)',
      norm: 'القسط المفترض أن تدفعه (normpremie)',
      half: 'شريكك بلا تأمين صحي هولندي: تحصل على نصف المبلغ المحسوب.',
      no: 'على الأرجح لا تستحق بدل الرعاية الصحية في 2026',
      why: 'السبب:',
      r: {
        age: 'يجب أن يكون عمرك 18 سنة أو أكثر؛ من هم دون 18 لا يدفعون قسط التأمين ولا يحصلون على البدل.',
        insurance: 'يجب أن يكون لديك تأمين صحي هولندي أساسي (zorgverzekering).',
        residence: 'يجب أن تكون إقامتك في هولندا قانونية (إقامة سارية أو طلب إقامة قيد الدراسة)، وكذلك شريكك.',
        income_missing: 'لم تُدخل الدخل.',
        assets: 'الأصول في 1 يناير 2026 أعلى من الحد المسموح ({lim}).',
        income: 'الدخل الخاضع للاحتساب (toetsingsinkomen) أعلى من الحد المسموح ({lim}).',
        normpremie: 'القسط المفترض أن تدفعه وفق دخلك أعلى من القسط المعياري، فلا يبقى مبلغ.'
      },
      disc: 'هذا تقدير فقط وليس قراراً رسمياً. المبلغ النهائي تحدده Dienst Toeslagen بعد معرفة دخلك الفعلي. تحقّق عبر ',
      proef: 'الحساب التجريبي الرسمي (proefberekening)'
    },
    nl: {
      fill: 'Vul je verwachte jaarinkomen 2026 in (een getal, 0 mag ook).',
      month: 'Geschatte zorgtoeslag per maand',
      year: 'Bedrag over heel 2026',
      exact: 'Exact maandgemiddelde',
      calc: 'Berekening',
      premie: 'Standaardpremie',
      norm: 'Normpremie',
      half: 'Je partner heeft geen Nederlandse zorgverzekering: je krijgt de helft van het berekende bedrag.',
      no: 'Waarschijnlijk geen recht op zorgtoeslag in 2026',
      why: 'Reden:',
      r: {
        age: 'Je moet 18 jaar of ouder zijn; onder de 18 betaal je geen premie en krijg je geen zorgtoeslag.',
        insurance: 'Je moet een Nederlandse zorgverzekering (basisverzekering) hebben.',
        residence: 'Je moet rechtmatig in Nederland verblijven (geldige verblijfsvergunning of aanvraag in behandeling); je toeslagpartner ook.',
        income_missing: 'Je hebt geen inkomen ingevuld.',
        assets: 'Je vermogen op 1 januari 2026 is hoger dan de grens ({lim}).',
        income: 'Je toetsingsinkomen is hoger dan de grens ({lim}).',
        normpremie: 'De normpremie bij jouw inkomen is hoger dan de standaardpremie, dus er blijft niets over.'
      },
      disc: 'Dit is een schatting, geen officieel besluit. Dienst Toeslagen stelt het definitieve bedrag vast op basis van je werkelijke inkomen. Controleer het met de ',
      proef: 'officiële proefberekening'
    }
  };

  function eur(x, whole) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR',
      minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(x);
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function ltr(s) { return '<span dir="ltr">' + esc(s) + '</span>'; }

  function render(res, t) {
    var h = '';
    if (res.reasons.indexOf('income_missing') >= 0) {
      return '<p>' + esc(t.fill) + '</p>';
    }
    if (res.eligible) {
      h += '<p>' + esc(t.month) + '</p><strong dir="ltr">' + esc(eur(res.amountMonth, true)) + '</strong>';
      h += '<p>' + esc(t.year) + ': ' + ltr(eur(res.amountYear)) + ' · ' + esc(t.exact) + ': ' + ltr(eur(res.amountMonthExact)) + '</p>';
      h += '<p>' + esc(t.calc) + ': ' + esc(t.premie) + ' ' + ltr(eur(res.standaardpremie)) + ' − ' + esc(t.norm) + ' ' + ltr(eur(res.normpremie)) + '</p>';
      if (res.half) h += '<p>' + esc(t.half) + '</p>';
    } else {
      h += '<p><b>' + esc(t.no) + '</b></p><p>' + esc(t.why) + '</p><ul>';
      res.reasons.forEach(function (r) {
        var lim = r === 'assets' ? res.assetLimit : res.incomeLimit;
        var parts = t.r[r].split('{lim}');
        h += '<li>' + esc(parts[0]) + (parts.length > 1 ? ltr(eur(lim, true)) + esc(parts[1]) : '') + '</li>';
      });
      h += '</ul>';
    }
    h += '<p class="notice">' + esc(t.disc) + '<a href="' + PROEF + '" target="_blank" rel="noopener">' + esc(t.proef) + '</a>.</p>';
    return h;
  }

  function bind() {
    var root = document.getElementById('calc-zorgtoeslag');
    if (!root) return;
    var form = root.querySelector('form');
    var out = root.querySelector('.tool-result');
    if (!form || !out) return;
    var lang = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
    var t = T[lang];
    var q = function (n) { return form.querySelector('[name="' + n + '"]'); };
    var partnerSel = q('partner');
    var pIns = root.querySelector('.zt-partner-only');
    function syncPartner() { if (pIns) pIns.hidden = partnerSel.value !== 'yes'; }
    if (partnerSel) { partnerSel.addEventListener('change', syncPartner); syncPartner(); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var partner = partnerSel && partnerSel.value === 'yes';
      var partnerInsured = !(partner && q('partnerInsured') && !q('partnerInsured').checked);
      var res = calcZorgtoeslag({
        partner: partner,
        partnerInsured: partnerInsured,
        income: q('income').value,
        assets: q('assets').value,
        age18: q('age18').checked,
        insured: q('insured').checked,
        legalStay: q('legalStay').checked
      });
      res.half = partner && !partnerInsured;
      out.innerHTML = render(res, t);
      if (out.scrollIntoView) out.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { calcZorgtoeslag: calcZorgtoeslag, P: P };
  if (typeof window !== 'undefined') {
    window.calcZorgtoeslag = calcZorgtoeslag;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
  }
})();
