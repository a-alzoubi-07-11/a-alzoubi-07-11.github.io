/* مواعيد القطارات المباشرة / Treintijden live — NS Reisinformatie API through our Cloudflare worker (AR/NL).
 * The worker (cloudflare/ns-proxy-worker.js) holds the NS key; set API_BASE to its URL.
 * Tabs: journey (trips with live times, platform, transfers, crowding, exact NS price), departures, disruptions.
 * Source: NS (Nederlandse Spoorwegen). Free text from NS (messages, causes) stays in Dutch.
 */
(function () {
  'use strict';
  var API_BASE = (window.GN_NS_API || '').replace(/\/$/, '');
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var T = {
    ar: { tabs: ['رحلة', 'المغادرة من محطة', 'الأعطال الآن'], from: 'من محطة', to: 'إلى محطة', station: 'المحطة', ph: 'اكتب اسم المحطة', go: 'اعرض المواعيد', dep: 'اعرض القطارات المغادرة', loading: 'جاري التحميل…',
      err: 'تعذّر الاتصال بمعلومات NS الآن. حاول بعد قليل.', soon: 'الأداة قيد التفعيل وستعمل قريباً.', pick: 'اختر المحطتين من القائمة.', nf: 'ما في رحلات لهالمسار بهالوقت.',
      track: 'رصيف', transfers: 'تبديل', direct: 'مباشر', min: 'دقيقة', delay: 'تأخير', cancelled: 'ملغى', price: 'السعر (درجة ثانية)', crowd: { LOW: 'ازدحام قليل', MEDIUM: 'ازدحام متوسط', HIGH: 'ازدحام كبير', UNKNOWN: '' },
      to2: 'إلى', via: 'محطات', disr: { DISRUPTION: 'عطل', MAINTENANCE: 'أعمال على السكة', CALAMITY: 'حالة طارئة' }, none: 'لا توجد أعطال معلنة الآن 🎉', until: 'المدة المتوقعة', nlnote: 'تفاصيل NS مكتوبة بالهولندية.',
      planner: 'افتح بمخطط رحلات NS', src: 'المصدر: NS (معلومات السفر المباشرة). المواعيد قد تتغير؛ تحقق من الشاشات بالمحطة.', board: 'المغادرة من', when: 'الوقت', dest: 'الوجهة', type: 'القطار' },
    nl: { tabs: ['Reis', 'Vertrektijden', 'Storingen nu'], from: 'Van station', to: 'Naar station', station: 'Station', ph: 'Typ een stationsnaam', go: 'Toon reizen', dep: 'Toon vertrekkende treinen', loading: 'Laden…',
      err: 'De reisinformatie van NS is nu niet bereikbaar. Probeer het zo opnieuw.', soon: 'Deze tool wordt geactiveerd en werkt binnenkort.', pick: 'Kies beide stations uit de lijst.', nf: 'Geen reizen gevonden voor dit traject op dit moment.',
      track: 'spoor', transfers: 'overstap', direct: 'direct', min: 'min', delay: 'vertraging', cancelled: 'rijdt niet', price: 'Prijs (2e klas)', crowd: { LOW: 'rustig', MEDIUM: 'gemiddeld druk', HIGH: 'druk', UNKNOWN: '' },
      to2: 'naar', via: 'stations', disr: { DISRUPTION: 'Storing', MAINTENANCE: 'Werkzaamheden', CALAMITY: 'Calamiteit' }, none: 'Er zijn nu geen storingen gemeld 🎉', until: 'Verwachte duur', nlnote: '',
      planner: 'Open in de NS Reisplanner', src: 'Bron: NS (actuele reisinformatie). Tijden kunnen wijzigen; let op de borden op het station.', board: 'Vertrek vanaf', when: 'Tijd', dest: 'Bestemming', type: 'Trein' }
  }[LANG];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function api(path) { return fetch(API_BASE + path).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }); }
  function hm(iso) { return iso ? iso.slice(11, 16) : ''; }
  function delayMin(p, a) { if (!p || !a) return 0; return Math.round((Date.parse(a.replace(/(\+\d\d)(\d\d)$/, '$1:$2')) - Date.parse(p.replace(/(\+\d\d)(\d\d)$/, '$1:$2'))) / 60000); }
  function eur(c) { return '€ ' + (c / 100).toFixed(2).replace('.', ','); }
  function fold(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }

  var STATIONS = null;
  function loadStations() {
    if (STATIONS) return Promise.resolve(STATIONS);
    return api('/stations').then(function (d) {
      STATIONS = (d.payload || []).filter(function (s) { return s.land === 'NL' || ['D', 'B'].indexOf(s.land) >= 0 && /Amsterdam|Antwerpen|Brussel|Köln|Aachen|Emmerich|Oberhausen|Duisburg|Düsseldorf/.test(s.namen.lang); })
        .map(function (s) { return { code: s.code, name: s.namen.lang, f: fold(s.namen.lang + ' ' + (s.synoniemen || []).join(' ') + ' ' + s.code) }; });
      return STATIONS;
    });
  }
  function attach(input, list) {
    var field = { input: input, code: null }, active = -1, items = [];
    function close() { list.hidden = true; list.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); }
    function choose(s) { input.value = s.name; field.code = s.code; close(); }
    function render() {
      list.innerHTML = items.map(function (s, i) { return '<li role="option" id="' + input.id + '-o' + i + '"' + (i === active ? ' aria-selected="true"' : '') + ' data-i="' + i + '">🚉 ' + esc(s.name) + '</li>'; }).join('');
      list.hidden = !items.length; input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
    }
    list.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (li) { e.preventDefault(); choose(items[+li.dataset.i]); } });
    input.addEventListener('input', function () {
      field.code = null; var q = fold(input.value); if (q.length < 2) { close(); return; }
      loadStations().then(function (st) {
        items = st.filter(function (s) { return s.f.indexOf(q) === 0 || s.f.indexOf(' ' + q) >= 0; }).sort(function (a, b) { return (a.f.indexOf(q) === 0 ? 0 : 1) - (b.f.indexOf(q) === 0 ? 0 : 1) || a.name.length - b.name.length; }).slice(0, 8);
        active = -1; render();
      }).catch(function () {});
    });
    input.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { active = Math.min(items.length - 1, active + 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); render(); e.preventDefault(); }
      else if (e.key === 'Enter' && active >= 0) { choose(items[active]); e.preventDefault(); }
      else if (e.key === 'Escape') close();
    });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
    field.resolve = function () { // exact name typed without picking
      if (field.code) return Promise.resolve(field.code);
      return loadStations().then(function (st) { var q = fold(input.value); var m = st.filter(function (s) { return fold(s.name) === q; })[0] || st.filter(function (s) { return s.f.indexOf(q) === 0; })[0]; if (m) { input.value = m.name; field.code = m.code; } return field.code; });
    };
    return field;
  }

  function timeCell(p, a, cancelled) {
    var d = delayMin(p, a);
    return '<b dir="ltr">' + hm(p) + '</b>' + (cancelled ? ' <span class="ns-bad">' + T.cancelled + '</span>' : d > 0 ? ' <span class="ns-late" dir="ltr">+' + d + '</span>' : '');
  }
  function renderTrips(d) {
    var trips = (d.trips || []).slice(0, 6);
    if (!trips.length) return '<p class="notice">' + T.nf + '</p>';
    return '<ol class="ns-trips">' + trips.map(function (t) {
      var first = t.legs[0], last = t.legs[t.legs.length - 1], cancelled = t.status === 'CANCELLED' || t.legs.some(function (l) { return l.cancelled; });
      var fare = t.productFare && t.productFare.priceInCents;
      var legs = t.legs.map(function (l) {
        return '<li dir="ltr"><span>' + hm(l.origin.plannedDateTime) + '</span> ' + esc(l.origin.name) + (l.origin.actualTrack || l.origin.plannedTrack ? ' · 🛤 <b>' + esc(l.origin.actualTrack || l.origin.plannedTrack) + '</b>' : '')
          + ' → <span>' + hm(l.destination.plannedDateTime) + '</span> ' + esc(l.destination.name) + ' <small>(' + esc((l.product && (l.product.displayName || l.product.shortCategoryName)) || '') + (l.product && l.product.operatorName && l.product.operatorName !== 'NS' ? ', ' + esc(l.product.operatorName) : '') + ')</small></li>';
      }).join('');
      return '<li class="ns-trip' + (cancelled ? ' ns-cx' : '') + '"><div class="ns-trip-h"><span class="ns-time" dir="ltr">' + timeCell(first.origin.plannedDateTime, first.origin.actualDateTime, cancelled) + ' → ' + timeCell(last.destination.plannedDateTime, last.destination.actualDateTime, false) + '</span>'
        + '<span class="ns-meta">' + (t.actualDurationInMinutes || t.plannedDurationInMinutes) + ' ' + T.min + ' · ' + (t.transfers ? t.transfers + ' ' + T.transfers : T.direct)
        + (T.crowd[t.crowdForecast] ? ' · ' + T.crowd[t.crowdForecast] : '') + '</span>' + (fare ? '<span class="ns-fare">' + T.price + ': <b dir="ltr">' + eur(fare) + '</b></span>' : '') + '</div>'
        + '<ul class="ns-legs">' + legs + '</ul></li>';
    }).join('') + '</ol>';
  }
  function renderDepartures(d, name) {
    var deps = ((d.payload || {}).departures || []).slice(0, 15);
    if (!deps.length) return '<p class="notice">' + T.nf + '</p>';
    return '<h3>' + T.board + ' ' + esc(name) + '</h3><table class="ns-board"><thead><tr><th>' + T.when + '</th><th>' + T.dest + '</th><th>' + T.track + '</th><th>' + T.type + '</th></tr></thead><tbody>' + deps.map(function (x) {
      var tr = x.actualTrack || x.plannedTrack || '';
      return '<tr' + (x.cancelled ? ' class="ns-cx"' : '') + '><td>' + timeCell(x.plannedDateTime, x.actualDateTime, x.cancelled) + '</td><td dir="ltr">' + esc(x.direction) + '</td><td dir="ltr"><b>' + esc(tr) + '</b>' + (x.actualTrack && x.plannedTrack && x.actualTrack !== x.plannedTrack ? ' ⚠️' : '') + '</td><td dir="ltr"><small>' + esc((x.product || {}).shortCategoryName || '') + '</small></td></tr>'
        + ((x.messages || []).length ? '<tr class="ns-msg"><td colspan="4" dir="ltr" lang="nl">ℹ️ ' + esc(x.messages.map(function (m) { return m.message; }).join(' · ')) + '</td></tr>' : '');
    }).join('') + '</tbody></table>';
  }
  function renderDisruptions(d) {
    var list = (Array.isArray(d) ? d : []).filter(function (x) { return x.isActive; });
    if (!list.length) return '<p class="notice">' + T.none + '</p>';
    var order = { CALAMITY: 0, DISRUPTION: 1, MAINTENANCE: 2 };
    list.sort(function (a, b) { return (order[a.type] - order[b.type]) || ((b.impact || {}).value || 0) - ((a.impact || {}).value || 0); });
    return '<ul class="ns-dis">' + list.slice(0, 30).map(function (x) {
      var ts = (x.timespans || [])[0] || {}, cause = ts.cause && ts.cause.label, period = ts.period, dur = x.expectedDuration && x.expectedDuration.description;
      return '<li class="ns-d-' + esc(x.type.toLowerCase()) + '"><p><span class="ns-tag">' + esc(T.disr[x.type] || x.type) + '</span> <b dir="ltr">' + esc(x.title) + '</b></p>'
        + (cause ? '<p dir="ltr" lang="nl"><small>' + esc(cause) + '</small></p>' : '')
        + (dur ? '<p><small>' + T.until + ': <span dir="ltr" lang="nl">' + esc(dur) + '</span></small></p>' : period ? '<p><small dir="ltr" lang="nl">' + esc(period) + '</small></p>' : '') + '</li>';
    }).join('') + '</ul>' + (T.nlnote ? '<p class="muted">' + T.nlnote + '</p>' : '');
  }

  function init() {
    var root = document.getElementById('ns-live');
    if (!root) return;
    var tabs = root.querySelectorAll('[role=tab]'), panels = root.querySelectorAll('[role=tabpanel]');
    function show(i) { tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); panels[k].hidden = k !== i; }); if (i === 2) loadDis(); }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
    if (!API_BASE) { root.querySelectorAll('.ns-out').forEach(function (o) { o.innerHTML = '<p class="notice">' + T.soon + '</p>'; }); return; }
    var fFrom = attach(root.querySelector('#ns-from'), root.querySelector('#ns-from-list'));
    var fTo = attach(root.querySelector('#ns-to'), root.querySelector('#ns-to-list'));
    var fSt = attach(root.querySelector('#ns-st'), root.querySelector('#ns-st-list'));
    var outT = root.querySelector('#ns-out-trip'), outD = root.querySelector('#ns-out-dep'), outX = root.querySelector('#ns-out-dis');
    root.querySelector('#ns-form-trip').addEventListener('submit', function (e) {
      e.preventDefault(); outT.innerHTML = '<p>' + T.loading + '</p>';
      Promise.all([fFrom.resolve(), fTo.resolve()]).then(function (c) {
        if (!c[0] || !c[1]) { outT.innerHTML = '<p class="notice">' + T.pick + '</p>'; return; }
        return api('/trips?fromStation=' + encodeURIComponent(c[0]) + '&toStation=' + encodeURIComponent(c[1])).then(function (d) {
          outT.innerHTML = renderTrips(d) + '<p class="muted">' + T.src + '</p>';
          try { history.replaceState(null, '', location.pathname + '?van=' + c[0] + '&naar=' + c[1] + '#ns-live'); } catch (_) { /* ignore */ }
          if (window.gnShare) window.gnShare.set(document.title + ': ' + fFrom.input.value + ' → ' + fTo.input.value, location.href);
        });
      }).catch(function () { outT.innerHTML = '<p class="notice">' + T.err + '</p>'; });
    });
    root.querySelector('#ns-form-dep').addEventListener('submit', function (e) {
      e.preventDefault(); outD.innerHTML = '<p>' + T.loading + '</p>';
      fSt.resolve().then(function (c) {
        if (!c) { outD.innerHTML = '<p class="notice">' + T.pick + '</p>'; return; }
        return api('/departures?station=' + encodeURIComponent(c)).then(function (d) { outD.innerHTML = renderDepartures(d, fSt.input.value) + '<p class="muted">' + T.src + '</p>'; });
      }).catch(function () { outD.innerHTML = '<p class="notice">' + T.err + '</p>'; });
    });
    var disLoaded = 0;
    function loadDis() {
      if (Date.now() - disLoaded < 60000) return; disLoaded = Date.now();
      outX.innerHTML = '<p>' + T.loading + '</p>';
      api('/disruptions').then(function (d) { outX.innerHTML = renderDisruptions(d) + '<p class="muted">' + T.src + '</p>'; }).catch(function () { disLoaded = 0; outX.innerHTML = '<p class="notice">' + T.err + '</p>'; });
    }
    try { // shared link ?van=UT&naar=RTD
      var q = new URLSearchParams(location.search), van = q.get('van'), naar = q.get('naar');
      if (van && naar && /^[A-Za-z]{2,6}$/.test(van) && /^[A-Za-z]{2,6}$/.test(naar)) {
        loadStations().then(function (st) {
          var a = st.filter(function (s) { return s.code === van.toUpperCase(); })[0], b = st.filter(function (s) { return s.code === naar.toUpperCase(); })[0];
          if (a && b) { fFrom.input.value = a.name; fFrom.code = a.code; fTo.input.value = b.name; fTo.code = b.code; root.querySelector('#ns-form-trip').requestSubmit(); }
        });
      }
    } catch (_) { /* ignore */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
