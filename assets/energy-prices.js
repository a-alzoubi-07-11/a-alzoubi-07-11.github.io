/* أرخص ساعات الكهرباء / Stroomprijs vandaag — Dutch day-ahead electricity prices (AR/NL).
 * Data: assets/energy/nl-prices.json, refreshed by .github/workflows/energy-prices.yml from Energy-Charts
 * (Fraunhofer ISE; CC BY 4.0, data Bundesnetzagentur | SMARD.de). Prices are wholesale EUR/MWh per 15 minutes.
 * The «with taxes» estimate adds the 2026 energy tax on electricity (9.161 ct/kWh excl. VAT, first bracket)
 * and 21% VAT, as in our guide energy-contracts-saving-2026; supplier fees are not included.
 */
(function () {
  'use strict';
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var TAX = { 2026: 0.09161, 2027: 0.0880 }, VAT = 0.21; // 2027: proposed in the tax plan
  var TZ = 'Europe/Amsterdam';
  var T = {
    ar: { loading: 'جاري تحميل الأسعار…', err: 'تعذّر تحميل الأسعار الآن. حاول بعد قليل.', now: 'السعر الآن', market: 'سعر السوق', incl: 'تقريباً مع ضريبة الطاقة وضريبة القيمة المضافة',
      ct: 'سنت/كيلوواط ساعة', best: 'أفضل وقت للتشغيل', dur: 'كم ساعة يحتاج الجهاز؟', h1: 'ساعة واحدة (غسالة صحون، شحن)', h2: 'ساعتان (غسالة ملابس)', h3: '3 ساعات (نشافة، سيارة كهربائية)',
      start: 'ابدأ الساعة', until: 'حتى', avg: 'متوسط السعر', cheap: 'الأرخص', exp: 'الأغلى', today: 'اليوم', tomorrow: 'بكرا', todayIn: 'اليوم', tomorrowIn: 'بكرا', notyet: 'أسعار بكرا بتنزل عادةً بعد الساعة 1 الظهر.',
      saving: 'مقارنة بأغلى وقت بنفس المدة، بتوفّر تقريباً', per: 'لكل كيلوواط ساعة', chart: 'سعر كل ساعة (سنت/كيلوواط ساعة، سعر السوق)', updated: 'آخر تحديث',
      note: 'هذه أسعار سوق الجملة (day-ahead). إذا عندك عقد كهرباء ديناميكي بتدفع هالسعر مع ضريبة الطاقة وضريبة القيمة المضافة ورسوم شركتك. إذا عقدك ثابت أو متغير، سعرك ما بيتغير كل ساعة.',
      neg: 'سعر سالب: المنتجين عم يدفعوا لحتى حدا يستهلك.', proposed: '(ضريبة 2027 مقترحة)' },
    nl: { loading: 'Prijzen laden…', err: 'De prijzen kunnen nu niet worden geladen. Probeer het zo opnieuw.', now: 'Prijs nu', market: 'Marktprijs', incl: 'ongeveer met energiebelasting en btw',
      ct: 'ct/kWh', best: 'Beste starttijd', dur: 'Hoe lang draait het apparaat?', h1: '1 uur (vaatwasser, laden)', h2: '2 uur (wasmachine)', h3: '3 uur (droger, elektrische auto)',
      start: 'Start om', until: 'tot', avg: 'Gemiddelde prijs', cheap: 'Goedkoopst', exp: 'Duurst', today: 'vandaag', tomorrow: 'morgen', todayIn: 'vandaag', tomorrowIn: 'morgen', notyet: 'De prijzen van morgen verschijnen meestal na 13.00 uur.',
      saving: 'Vergeleken met het duurste moment van dezelfde duur bespaar je ongeveer', per: 'per kWh', chart: 'Prijs per uur (ct/kWh, marktprijs)', updated: 'Laatst bijgewerkt',
      note: 'Dit zijn groothandelsprijzen (day-ahead). Met een dynamisch energiecontract betaal je deze prijs plus energiebelasting, btw en de vergoeding van je leverancier. Met een vast of variabel contract verandert je prijs niet per uur.',
      neg: 'Negatieve prijs: producenten betalen om stroom kwijt te raken.', proposed: '(belasting 2027 voorgesteld)' }
  }[LANG];

  function parts(unix) {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    var o = {}; f.formatToParts(new Date(unix * 1000)).forEach(function (p) { o[p.type] = p.value; });
    return { day: o.year + '-' + o.month + '-' + o.day, y: +o.year, h: +o.hour, m: +o.minute, hm: o.hour + ':' + o.minute };
  }
  function ctMarket(eurMwh) { return eurMwh / 10; }
  function ctIncl(eurMwh, year) { var tax = TAX[year] || TAX[2026]; return (eurMwh / 1000 + tax) * (1 + VAT) * 100; }
  function fmt(ct) { return (Math.round(ct * 10) / 10).toFixed(1).replace('.', LANG === 'nl' ? ',' : '.'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }

  function bestWindow(pts, fromUnix, slots) { // pts at 15-min resolution
    var best = null, worst = null;
    for (var i = 0; i + slots <= pts.length; i++) {
      if (pts[i][0] < fromUnix - 899) continue;
      var ok = true, sum = 0;
      for (var k = 0; k < slots; k++) { if (k && pts[i + k][0] - pts[i + k - 1][0] !== 900) { ok = false; break; } sum += pts[i + k][1]; }
      if (!ok) continue;
      var avg = sum / slots;
      if (!best || avg < best.avg) best = { i: i, avg: avg };
      if (!worst || avg > worst.avg) worst = { i: i, avg: avg };
    }
    return { best: best, worst: worst };
  }
  function hourly(pts) {
    var map = {}, order = [];
    pts.forEach(function (p) { var q = parts(p[0]), k = q.day + ' ' + (q.h < 10 ? '0' : '') + q.h; if (!map[k]) { map[k] = { k: k, day: q.day, h: q.h, s: 0, n: 0, t: p[0] }; order.push(k); } map[k].s += p[1]; map[k].n++; });
    return order.map(function (k) { var x = map[k]; x.avg = x.s / x.n; return x; });
  }

  function chart(hours, win, nowUnix) {
    if (!hours.length) return '';
    var W = 720, H = 220, pad = 26, bw = (W - pad * 2) / hours.length;
    var vals = hours.map(function (h) { return ctMarket(h.avg); });
    var max = Math.max.apply(null, vals.concat([1])), min = Math.min.apply(null, vals.concat([0]));
    var span = max - min || 1, y0 = H - pad - (0 - min) / span * (H - pad * 2);
    var bars = hours.map(function (h, i) {
      var v = vals[i], y = H - pad - (v - min) / span * (H - pad * 2), top = Math.min(y, y0), hh = Math.max(1.5, Math.abs(y0 - y));
      var inWin = win && h.t >= win.from - 3599 && h.t < win.to;
      var isNow = nowUnix >= h.t && nowUnix < h.t + 3600;
      var cls = inWin ? 'ep-b ep-best' : (v < 0 ? 'ep-b ep-neg' : 'ep-b');
      var lab = (i % 3 === 0) ? '<text x="' + (pad + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" class="ep-ax">' + h.h + '</text>' : '';
      return '<rect class="' + cls + (isNow ? ' ep-now' : '') + '" x="' + (pad + i * bw + 1).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + Math.max(1, bw - 2).toFixed(1) + '" height="' + hh.toFixed(1) + '"><title>' + esc(h.day + ' ' + h.h + ':00 — ' + fmt(v) + ' ' + T.ct) + '</title></rect>' + lab;
    }).join('');
    var dayStarts = hours.map(function (h, i) { return h.h === 0 && i ? '<line class="ep-day" x1="' + (pad + i * bw).toFixed(1) + '" x2="' + (pad + i * bw).toFixed(1) + '" y1="' + pad / 2 + '" y2="' + (H - pad) + '"/>' : ''; }).join('');
    return '<figure class="ep-fig"><figcaption>' + T.chart + '</figcaption><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(T.chart) + '" dir="ltr">'
      + '<line class="ep-zero" x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y0.toFixed(1) + '" y2="' + y0.toFixed(1) + '"/>' + dayStarts + bars
      + '<text x="4" y="' + (pad - 6) + '" class="ep-ax">' + fmt(max) + '</text></svg></figure>';
  }

  function render(root, data, slots) {
    var out = root.querySelector('.ep-out'), pts = data.p, nowUnix = Math.floor(Date.now() / 1000);
    var cur = null; for (var i = 0; i < pts.length; i++) if (pts[i][0] <= nowUnix && nowUnix < pts[i][0] + 900) cur = pts[i];
    var today = parts(nowUnix).day, hasTomorrow = pts.some(function (p) { return parts(p[0]).day > today; });
    var w = bestWindow(pts, cur ? cur[0] : nowUnix, slots);
    var html = '';
    if (cur) {
      var y = parts(cur[0]).y;
      html += '<div class="ep-now-box"><span>' + T.now + ' (' + parts(cur[0]).hm + ')</span><strong dir="ltr">' + fmt(ctIncl(cur[1], y)) + ' <small>' + T.ct + '</small></strong>'
        + '<span class="muted">' + T.incl + (y >= 2027 ? ' ' + T.proposed : '') + ' · ' + T.market + ': <b dir="ltr">' + fmt(ctMarket(cur[1])) + '</b></span>'
        + (cur[1] < 0 ? '<span class="ep-negnote">' + T.neg + '</span>' : '') + '</div>';
    }
    if (w.best) {
      var a = pts[w.best.i], b = pts[w.best.i + slots - 1], end = b[0] + 900;
      var sameDay = parts(a[0]).day === today;
      html += '<div class="ep-best-box"><h3>✅ ' + T.best + '</h3><p class="ep-big">' + T.start + ' <b dir="ltr">' + parts(a[0]).hm + '</b> ' + (sameDay ? T.today : T.tomorrow)
        + ' — ' + T.until + ' <b dir="ltr">' + parts(end).hm + '</b></p><p>' + T.avg + ': <b dir="ltr">' + fmt(ctMarket(w.best.avg)) + '</b> ' + T.ct + ' (' + T.market + ')</p>';
      if (w.worst && w.worst.avg - w.best.avg > 0.5) html += '<p class="muted">' + T.saving + ' <b dir="ltr">' + fmt(ctMarket(w.worst.avg - w.best.avg) * (1 + VAT)) + '</b> ' + T.ct + '.</p>';
      html += '</div>';
      var win = { from: a[0], to: end };
    }
    if (!hasTomorrow) html += '<p class="muted">ℹ️ ' + T.notyet + '</p>';
    var hours = hourly(pts.filter(function (p) { return p[0] + 3600 > nowUnix - 3 * 3600; }));
    html += chart(hours, win, nowUnix);
    var hs = hourly(pts.filter(function (p) { return parts(p[0]).day === today; }));
    if (hs.length) {
      var lo = hs.reduce(function (m, h) { return h.avg < m.avg ? h : m; }), hi = hs.reduce(function (m, h) { return h.avg > m.avg ? h : m; });
      html += '<ul class="ep-sum"><li>' + T.cheap + ' ' + T.today + ': <b dir="ltr">' + lo.h + ':00</b> (' + fmt(ctMarket(lo.avg)) + ')</li><li>' + T.exp + ' ' + T.today + ': <b dir="ltr">' + hi.h + ':00</b> (' + fmt(ctMarket(hi.avg)) + ')</li></ul>';
    }
    html += '<p class="muted">' + T.note + '</p><p class="muted">' + T.updated + ': <span dir="ltr">' + esc(new Date(data.updated).toLocaleString('nl-NL', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })) + '</span> · Energy-Charts (CC BY 4.0, Bundesnetzagentur | SMARD.de)</p>';
    out.innerHTML = html;
  }

  function init() {
    var root = document.getElementById('energy-prices');
    if (!root) return;
    var out = root.querySelector('.ep-out'), sel = root.querySelector('select[name=dur]');
    out.innerHTML = '<p>' + T.loading + '</p>';
    fetch('/assets/energy/nl-prices.json?t=' + Math.floor(Date.now() / 600000)).then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (data) {
      var go = function () { render(root, data, parseInt(sel.value, 10) * 4); };
      sel.addEventListener('change', go); go();
      setInterval(go, 5 * 60 * 1000);
    }).catch(function () { out.innerHTML = '<p class="notice">' + T.err + '</p>'; });
  }
  window.EnergyPrices = { ctIncl: ctIncl, bestWindow: bestWindow };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
