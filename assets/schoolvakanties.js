/* العطل المدرسية / Schoolvakanties — next school holiday, countdown, full year and calendar file per region (AR/NL).
 * Data: assets/schoolvakanties.json (Rijksoverheid open data, CC0; region table rijksoverheid.nl).
 * Optional: PDOK Locatieserver reverse geocoding when the visitor taps "my location". The chosen region is
 * remembered only in this browser (localStorage).
 */
(function () {
  'use strict';
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse';
  var KEY = 'gn_sv_choice';
  var T = {
    ar: {
      reg: { noord: 'الشمال', midden: 'الوسط', zuid: 'الجنوب' },
      name: { herfst: 'عطلة الخريف', kerst: 'عطلة الميلاد ورأس السنة', voorjaar: 'عطلة الربيع', mei: 'عطلة أيار', zomer: 'العطلة الصيفية' },
      nl: { herfst: 'herfstvakantie', kerst: 'kerstvakantie', voorjaar: 'voorjaarsvakantie', mei: 'meivakantie', zomer: 'zomervakantie' },
      region: 'منطقة', next: 'العطلة الجاية', now: 'أنت هلق بالعطلة', days: function (n) { return n === 1 ? 'بكرا' : n === 2 ? 'بعد يومين' : 'بعد ' + n + ' يوم'; },
      left: function (n) { return n === 0 ? 'آخر يوم اليوم' : 'باقي ' + n + (n === 1 ? ' يوم' : ' يوم'); },
      from: 'من', to: 'حتى', year: 'السنة الدراسية', fixed: 'ملزم لكل المدارس', fix_s: 'ملزم', adv_s: 'مُوصى به', advice: 'موعد مُوصى به، اسأل مدرستك',
      th: ['العطلة', 'التاريخ', 'نوع الموعد'], ics: '📅 أضف العطل لتقويم موبايلك', share: 'شارك', copied: 'انتسخ الرابط',
      gem: 'بلديتك', split: function (o, part) { return 'تنبيه: بلديتك مقسومة. منطقة ' + part + ' تتبع ' + o + '، والباقي يتبع المنطقة الظاهرة هون.'; },
      nf: 'ما لقينا هالبلدية. اكتب اسمها بالهولندي، مثل Utrecht أو Den Haag.', locerr: 'ما قدرنا نعرف موقعك. اختر منطقتك أو اكتب اسم بلديتك.',
      locating: 'عم نحدد بلديتك…', change: 'غيّر', past: 'خلصت', none: 'ما في مواعيد منشورة بعد هالتاريخ.',
      share_msg: function (r, n) { return 'العطلة المدرسية الجاية بمنطقة ' + r + ': ' + n + ' — شوف كل المواعيد هون'; },
      cal: 'العطل المدرسية'
    },
    nl: {
      reg: { noord: 'Noord', midden: 'Midden', zuid: 'Zuid' },
      name: { herfst: 'Herfstvakantie', kerst: 'Kerstvakantie', voorjaar: 'Voorjaarsvakantie', mei: 'Meivakantie', zomer: 'Zomervakantie' },
      nl: null,
      region: 'Regio', next: 'Volgende vakantie', now: 'Nu vakantie', days: function (n) { return n === 1 ? 'morgen' : 'over ' + n + ' dagen'; },
      left: function (n) { return n === 0 ? 'laatste dag vandaag' : 'nog ' + n + (n === 1 ? ' dag' : ' dagen'); },
      from: 'van', to: 't/m', year: 'Schooljaar', fixed: 'Verplicht voor alle scholen', fix_s: 'Verplicht', adv_s: 'Advies', advice: 'Adviesdatum, vraag je school',
      th: ['Vakantie', 'Datum', 'Soort datum'], ics: '📅 Zet de vakanties in je agenda', share: 'Delen', copied: 'Link gekopieerd',
      gem: 'Je gemeente', split: function (o, part) { return 'Let op: je gemeente is verdeeld. ' + part + ' valt onder regio ' + o + '; de rest onder de regio hieronder.'; },
      nf: 'Gemeente niet gevonden. Typ de naam, bijvoorbeeld Utrecht of Den Haag.', locerr: 'Je locatie is niet gevonden. Kies je regio of typ je gemeente.',
      locating: 'Je gemeente zoeken…', change: 'Wijzig', past: 'voorbij', none: 'Na deze datum zijn nog geen data gepubliceerd.',
      share_msg: function (r, n) { return 'De volgende schoolvakantie in regio ' + r + ': ' + n + ' — alle data staan hier'; },
      cal: 'Schoolvakanties'
    }
  }[LANG];
  var LOC = LANG === 'nl' ? 'nl-NL' : 'ar-u-nu-latn';
  var DATA = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function d(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function diff(a, b) { return Math.round((b - a) / 864e5); }
  function fmt(dt, withYear) {
    var o = { weekday: 'long', day: 'numeric', month: 'long' };
    if (withYear) o.year = 'numeric';
    try { return new Intl.DateTimeFormat(LOC, o).format(dt); } catch (e) { return dt.toISOString().slice(0, 10); }
  }
  function short(dt) { try { return new Intl.DateTimeFormat(LOC, { day: 'numeric', month: 'short', year: 'numeric' }).format(dt); } catch (e) { return dt.toISOString().slice(0, 10); } }
  function label(t) { return T.name[t] + (T.nl ? ' <span class="muted" dir="ltr">(' + T.nl[t] + ')</span>' : ''); }
  function range(v, r) { return v.r[r] || v.r.all; }

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('/assets/schoolvakanties.json?v=1').then(function (r) { if (!r.ok) throw new Error('net'); return r.json(); }).then(function (j) { DATA = j; return j; });
  }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* ignore */ } }
  function saved() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }

  // all holidays for a region, flattened and sorted
  function list(region) {
    var out = [];
    DATA.years.forEach(function (y) {
      y.v.forEach(function (v) { var rg = range(v, region); if (rg) out.push({ y: y.y, t: v.t, c: v.c, s: d(rg[0]), e: d(rg[1]) }); });
    });
    return out.sort(function (a, b) { return a.s - b.s; });
  }
  function currentYear(all, t0) {
    var z = all.filter(function (h) { return h.t === 'zomer' && h.e >= t0; })[0];
    return z ? z.y : DATA.years[DATA.years.length - 1].y;
  }

  function ics(region, all) {
    function ymd(dt) { return dt.getFullYear() + ('0' + (dt.getMonth() + 1)).slice(-2) + ('0' + dt.getDate()).slice(-2); }
    var stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//gidsnederland.nl//schoolvakanties//' + LANG.toUpperCase(), 'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:' + T.cal + ' ' + T.reg[region]];
    all.forEach(function (h) {
      var end = new Date(h.e); end.setDate(end.getDate() + 1);
      L.push('BEGIN:VEVENT', 'UID:' + h.t + '-' + ymd(h.s) + '-' + region + '@gidsnederland.nl', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + ymd(h.s), 'DTEND;VALUE=DATE:' + ymd(end),
        'SUMMARY:' + T.name[h.t] + (T.nl ? ' (' + T.nl[h.t] + ')' : ''), 'DESCRIPTION:' + (h.c ? T.fixed : T.advice) + ' — https://gidsnederland.nl', 'TRANSP:TRANSPARENT', 'END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return L.join('\r\n');
  }

  function render(root, choice) {
    var out = root.querySelector('.tool-result'), region = choice.r;
    var all = list(region), t0 = today();
    var cur = all.filter(function (h) { return h.s <= t0 && h.e >= t0; })[0];
    var nxt = all.filter(function (h) { return h.s > t0; })[0];
    var yr = choice.y || currentYear(all, t0);
    var cy = currentYear(all, t0), years = DATA.years.map(function (y) { return y.y; }).filter(function (y) { return y >= cy; });
    var h = '<div class="sv-head"><span class="sv-pill">' + (choice.g ? esc(choice.g) + ' · ' : '') + T.region + ' ' + T.reg[region] + '</span>'
      + '<button type="button" class="sv-change">' + T.change + '</button></div>';
    if (choice.split) h += '<p class="notice">' + esc(T.split(T.reg[choice.split[0]], choice.split[1])) + '</p>';
    if (cur) {
      h += '<div class="sv-big sv-now"><p class="sv-k">🎉 ' + T.now + '</p><p class="sv-n">' + label(cur.t) + '</p>'
        + '<p>' + T.from + ' ' + fmt(cur.s) + ' ' + T.to + ' ' + fmt(cur.e, true) + '</p><p class="sv-c">' + T.left(diff(t0, cur.e)) + '</p></div>';
    }
    if (nxt) {
      h += '<div class="sv-big"><p class="sv-k">⏳ ' + T.next + '</p><p class="sv-n">' + label(nxt.t) + '</p>'
        + '<p>' + T.from + ' ' + fmt(nxt.s) + ' ' + T.to + ' ' + fmt(nxt.e, true) + '</p><p class="sv-c">' + T.days(diff(t0, nxt.s)) + '</p>'
        + '<p class="muted">' + (nxt.c ? T.fixed : T.advice) + '</p></div>';
    } else if (!cur) h += '<p class="notice">' + T.none + '</p>';
    h += '<div class="sv-years" role="tablist">' + years.map(function (y) {
      return '<button type="button" role="tab" data-y="' + y + '" aria-selected="' + (y === yr) + '" class="sv-y' + (y === yr ? ' on' : '') + '" dir="ltr">' + y + '</button>';
    }).join('') + '</div>';
    h += '<h3 class="sv-cap">' + T.year + ' <span dir="ltr">' + yr + '</span> · ' + T.region + ' ' + T.reg[region] + '</h3><ul class="sv-list">'
      + all.filter(function (x) { return x.y === yr; }).map(function (x) {
        var past = x.e < t0;
        return '<li' + (past ? ' class="sv-past"' : '') + '><p class="sv-ln">' + label(x.t) + (past ? ' <small class="muted">· ' + T.past + '</small>' : '') + '</p>'
          + '<p class="sv-dt">' + short(x.s) + ' – ' + short(x.e) + '</p><p class="sv-bd ' + (x.c ? 'fix' : 'adv') + '">' + (x.c ? '✅ ' + T.fixed : 'ℹ️ ' + T.advice) + '</p></li>';
      }).join('') + '</ul>';
    h += '<p class="tool-actions"><a class="tool-button sv-ics" download="schoolvakanties-' + region + '.ics" href="#">' + T.ics + '</a> '
      + '<button type="button" class="tool-button secondary sv-share">' + T.share + '</button></p>';
    out.innerHTML = h;
    root.querySelector('.sv-pick').hidden = true;

    var blob = new Blob([ics(region, all.filter(function (x) { return x.e >= t0; }))], { type: 'text/calendar;charset=utf-8' });
    out.querySelector('.sv-ics').href = URL.createObjectURL(blob);
    out.querySelector('.sv-change').addEventListener('click', function () { root.querySelector('.sv-pick').hidden = false; out.innerHTML = ''; root.querySelector('.sv-r').focus(); });
    Array.prototype.forEach.call(out.querySelectorAll('.sv-y'), function (b) {
      b.addEventListener('click', function () { var c = Object.assign({}, choice, { y: b.getAttribute('data-y') }); render(root, c); });
    });
    var url = location.origin + location.pathname + '?regio=' + region;
    var msg = T.share_msg(T.reg[region], nxt ? T.name[nxt.t] + ' (' + short(nxt.s) + ')' : '');
    if (window.gnShare) window.gnShare.set(msg, url);
    var sh = out.querySelector('.sv-share');
    sh.addEventListener('click', function () {
      if (navigator.share) { navigator.share({ title: document.title, text: msg, url: url }).catch(function () {}); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(msg + '\n' + url) : Promise.reject()).then(function () { sh.textContent = '✅ ' + T.copied; }).catch(function () { window.prompt(T.share, url); });
    });
    try { history.replaceState(null, '', location.pathname + '?regio=' + region + (choice.code ? '&g=' + choice.code : '') + '#schoolvakanties'); } catch (e) { /* ignore */ }
    if (window.gtag) window.gtag('event', 'schoolvakanties_result', { region: region });
  }

  function byCode(code) {
    var g = DATA.g[code];
    if (!g) return null;
    var c = { r: g[1], g: g[0], code: code };
    if (g[2]) c.split = [g[2], g[3]];
    return c;
  }
  function byName(q) {
    var n = q.toLowerCase().replace(/^gemeente\s+/, '').replace(/[-']/g, ' ').replace(/\s+/g, ' ').trim();
    if (n === 'the hague' || n === "'s gravenhage" || n === 's gravenhage') n = 'den haag';
    if (n === 'den bosch') n = 's hertogenbosch';
    var best = null;
    Object.keys(DATA.g).forEach(function (k) {
      var m = DATA.g[k][0].toLowerCase().replace(/[-']/g, ' ').replace(/\s+/g, ' ').trim();
      if (m === n || m === n.replace(/^s /, "'s ")) best = k;
      else if (!best && n.length >= 3 && m.indexOf(n) === 0) best = k;
    });
    return best ? byCode(best) : null;
  }

  function init() {
    var root = document.getElementById('schoolvakanties');
    if (!root) return;
    var pick = root.querySelector('.sv-pick'), out = root.querySelector('.tool-result'), form = root.querySelector('form'), inp = form.elements.g;
    function go(c) { if (c) { save({ r: c.r, code: c.code }); render(root, c); } }
    function fail(msg) { out.innerHTML = '<p class="notice">' + msg + '</p>'; }
    load().then(function () {
      var dl = document.getElementById('sv-gem');
      if (dl) dl.innerHTML = Object.keys(DATA.g).map(function (k) { return '<option value="' + esc(DATA.g[k][0]) + '">'; }).join('');
      Array.prototype.forEach.call(root.querySelectorAll('.sv-r'), function (b) {
        b.addEventListener('click', function () { go({ r: b.getAttribute('data-r') }); });
      });
      form.addEventListener('submit', function (e) { e.preventDefault(); var c = byName(inp.value); if (c) go(c); else fail(T.nf); });
      inp.addEventListener('change', function () { var c = byName(inp.value); if (c && c.g.toLowerCase() === inp.value.trim().toLowerCase()) go(c); });
      var loc = root.querySelector('.sv-loc');
      if (loc && navigator.geolocation) {
        loc.addEventListener('click', function () {
          out.innerHTML = '<p>' + T.locating + '</p>';
          navigator.geolocation.getCurrentPosition(function (p) {
            fetch(PDOK + '?rows=1&type=adres&fl=gemeentecode&lat=' + p.coords.latitude.toFixed(5) + '&lon=' + p.coords.longitude.toFixed(5))
              .then(function (r) { return r.json(); })
              .then(function (j) { var doc = j.response && j.response.docs && j.response.docs[0]; var c = doc && byCode(String(doc.gemeentecode).replace(/^GM/, '').padStart(4, '0')); if (c) go(c); else fail(T.locerr); })
              .catch(function () { fail(T.locerr); });
          }, function () { fail(T.locerr); }, { timeout: 10000, maximumAge: 600000 });
        });
      } else if (loc) loc.hidden = true;
      // zero clicks: link with ?regio= / ?g=, or the region chosen last time
      var qs = new URLSearchParams(location.search), c0 = null;
      if (qs.get('g')) c0 = byCode(qs.get('g'));
      if (!c0 && /^(noord|midden|zuid)$/.test(qs.get('regio') || '')) c0 = { r: qs.get('regio') };
      if (!c0) { var s = saved(); if (s && s.r) c0 = (s.code && byCode(s.code)) || { r: s.r }; }
      if (c0) render(root, c0); else pick.hidden = false;
    }).catch(function () { pick.hidden = false; fail(LANG === 'nl' ? 'De gegevens konden niet worden geladen. Probeer het opnieuw.' : 'تعذّر تحميل البيانات. حاول مرة أخرى.'); });
  }
  window.SchoolVakanties = { list: function (r) { return list(r); }, load: load, byName: function (q) { return byName(q); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
