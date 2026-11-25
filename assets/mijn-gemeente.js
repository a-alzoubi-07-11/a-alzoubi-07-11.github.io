/* بلديتي / Mijn gemeente — from a postcode or address to your municipality, nearest stations and a first-30-days plan (AR/NL).
 * Data: PDOK Locatieserver (address -> gemeentecode, live), assets/gemeenten.json (Organisaties.overheid.nl, CC0),
 *       assets/ov/rail.json (stations from the OVapi GTFS feed, CC0). Nothing is stored.
 */
(function () {
  'use strict';
  var PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/';
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';
  var PRE = LANG === 'nl' ? '/nl' : '';

  var T = {
    ar: {
      bad: 'اكتب رمزك البريدي (مثل 3511 AB) أو عنوانك.', nf: 'ما لقينا هالعنوان بهولندا. جرّب الرمز البريدي مع رقم البيت.',
      neterr: 'تعذّر الاتصال بخدمة العناوين الحكومية. تحقق من الإنترنت وحاول مرة أخرى.', loading: 'جاري البحث…',
      your: 'بلديتك', prov: 'المقاطعة', visit: 'عنوان البلدية', phone: 'التلفون', mail: 'الإيميل', site: 'موقع البلدية',
      call: 'اتصل', map: 'افتح على الخريطة', open: 'افتح الموقع', nodata: 'ما عندنا تفاصيل التواصل لهالبلدية. افتح موقعها الرسمي من دليل الحكومة:',
      phone_note: 'الرقم 14 مع رمز المنطقة هو الرقم العام للبلدية، بتتصل فيه من أي تلفون بهولندا.',
      stations: 'أقرب محطات قطار', km: 'كم', plan: 'احسب رحلتك وسعرها',
      plan_h: 'خطتك لأول 30 يوم', plan_note: 'رتّبناها حسب الأولوية. اضغط على كل خطوة لتقرأ الشرح الكامل بالعربي.',
      help_h: 'مساعدات اسأل عنها بلديتك', help_note: 'كل بلدية إلها قواعدها ومبالغها. الأزرار بتبحث بموقع بلديتك مباشرة.',
      share_msg: 'وصلت جديد على هولندا أو انتقلت لبيت جديد؟ اكتب رمزك البريدي واعرف بلديتك وأقرب محطة ومدرسة، وخطة أول 30 يوم. أداة مجانية بالعربي:', share_note: 'رابط المشاركة فيه الرمز البريدي اللي كتبته.',
      free_h: 'مساعدة مجانية بشرية', share: 'شارك', copied: 'تم نسخ الرابط',
      src: 'المصادر: خدمة العناوين الحكومية PDOK، ودليل الجهات الحكومية Organisaties.overheid.nl، وبيانات المواصلات المفتوحة. تأكد دائماً من موقع بلديتك.',
      steps: [
        ['bsn-municipality-registration', 'سجّل بالبلدية وخذ رقم المواطن (BSN)', 'أول خطوة لكل شي: الشغل والبنك والتأمين.'],
        ['digid-registration-guide', 'اطلب DigiD وفعّل التطبيق', 'مفتاحك لكل مواقع الحكومة.'],
        ['health-insurance-newcomers', 'اعمل التأمين الصحي', 'إلزامي، والمهلة عادة 4 أشهر حسب وضعك.'],
        ['zorgtoeslag-guide', 'اطلب بدل التأمين الصحي (zorgtoeslag)', 'احسب أولاً بالحاسبة.', '/calculators/zorgtoeslag.html'],
        ['huisarts-registration', 'سجّل عند طبيب العائلة', 'قبل ما تحتاجه.'],
        ['ing-bank-app-card-guide', 'افتح حساب بنكي وفعّل التطبيق', 'لاستلام الراتب والبدلات.'],
        ['housing-rent-allowance-2026', 'إذا بتدفع إيجار: بدل الإيجار (huurtoeslag)', 'تحقق من الشروط.'],
        ['kinderbijslag-guide', 'إذا عندك ولاد: kinderbijslag والمدرسة', 'سجّل الولاد بالمدرسة كمان.', null, 'dutch-school-system-basisschool'],
        ['inburgering-integration-law-2026', 'الاندماج (inburgering)', 'البلدية بتعمللك خطة اندماج.'],
        ['essential-apps-netherlands', 'نزّل التطبيقات الأساسية', 'DigiD و9292 والتأمين والبنك.']
      ],
      second: 'ومدرسة الولاد',
      schools_h: 'مدارس قريبة منك', po: 'مدارس ابتدائية (basisschool)', vo: 'مدارس ثانوية (vmbo / havo / vwo)', more: 'شوف كل المدارس على الخريطة وقارن بينها',
      schools_note: 'مرتبة حسب قرب الرمز البريدي، داخل بلديتك. سجّل ولدك بالمدرسة مباشرة؛ الابتدائية من عمر 4 سنين، والدوام إلزامي من 5.', school_guide: 'شرح نظام المدارس',
      school_src: 'بيانات المدارس: DUO (وزارة التعليم)، العنوان الرئيسي لكل مدرسة ابتدائية.',
      help: [['bijzondere bijstand', 'مساعدة خاصة لمصاريف ضرورية', 'special-assistance-bijzondere-bijstand'], ['kwijtschelding', 'إعفاء من ضرائب البلدية', 'municipal-taxes-exemption-kwijtschelding'],
        ['bijstand', 'مساعدة الدخل الأساسية', 'social-assistance-bijstand'], ['schuldhulp', 'مساعدة بالديون مجاناً', 'debt-help-schuldhulp'],
        ['minimaregeling', 'مساعدات أصحاب الدخل القليل (بطاقة المدينة، نشاطات الولاد)', null], ['wmo', 'مساعدة بالبيت والتنقل (Wmo)', 'wmo-home-support']],
      search: 'ابحث بموقع البلدية', guide: 'الشرح',
      free: [['Juridisch Loket', 'نصيحة قانونية مجانية: 0800-8020', 'https://www.juridischloket.nl/'], ['VluchtelingenWerk', 'مساعدة للاجئين والقادمين الجدد', 'https://www.vluchtelingenwerk.nl/'],
        ['', 'كل أدلة اللجوء والإقامة بمكان واحد', '/articles/asylum-residence-hub.html']]
    },
    nl: {
      bad: 'Vul je postcode (zoals 3511 AB) of je adres in.', nf: 'We vinden dit adres niet in Nederland. Probeer postcode en huisnummer.',
      neterr: 'De adresservice van de overheid is niet bereikbaar. Controleer je internet en probeer opnieuw.', loading: 'Bezig met zoeken…',
      your: 'Jouw gemeente', prov: 'Provincie', visit: 'Bezoekadres', phone: 'Telefoon', mail: 'E-mail', site: 'Website',
      call: 'Bellen', map: 'Op de kaart', open: 'Open website', nodata: 'We hebben geen contactgegevens voor deze gemeente. Open de officiële gegevens via de overheidsgids:',
      phone_note: '14 plus het netnummer is het algemene nummer van de gemeente; je belt het vanaf elke telefoon in Nederland.',
      stations: 'Dichtstbijzijnde treinstations', km: 'km', plan: 'Bereken je reis en de prijs',
      plan_h: 'Jouw plan voor de eerste 30 dagen', plan_note: 'Op volgorde van belangrijkheid. Klik op een stap voor de volledige uitleg.',
      help_h: 'Regelingen om bij je gemeente naar te vragen', help_note: 'Elke gemeente heeft eigen regels en bedragen. De knoppen zoeken direct op de website van jouw gemeente.',
      share_msg: 'Nieuw in Nederland of net verhuisd? Vul je postcode in en zie je gemeente, het dichtstbijzijnde station en scholen, en een plan voor de eerste 30 dagen. Gratis hulpmiddel:', share_note: 'De deellink bevat de postcode die je invulde.',
      free_h: 'Gratis hulp van mensen', share: 'Delen', copied: 'Link gekopieerd',
      src: 'Bronnen: PDOK Locatieserver, Organisaties.overheid.nl en open ov-dienstregelingsdata. Controleer altijd de website van je gemeente.',
      steps: [
        ['bsn-municipality-registration', 'Inschrijven bij de gemeente en BSN', 'De eerste stap voor werk, bank en verzekering.'],
        ['digid-registration-guide', 'DigiD aanvragen en de app activeren', 'Je sleutel voor alle overheidssites.'],
        ['health-insurance-newcomers', 'Zorgverzekering afsluiten', 'Verplicht; de termijn is meestal 4 maanden, afhankelijk van je situatie.'],
        ['zorgtoeslag-guide', 'Zorgtoeslag aanvragen', 'Reken het eerst uit.', '/nl/calculators/zorgtoeslag.html'],
        ['huisarts-registration', 'Inschrijven bij een huisarts', 'Voordat je hem nodig hebt.'],
        ['ing-bank-app-card-guide', 'Bankrekening en bank-app', 'Voor salaris en toeslagen.'],
        ['housing-rent-allowance-2026', 'Huur je? Huurtoeslag', 'Controleer de voorwaarden.'],
        ['kinderbijslag-guide', 'Kinderen? Kinderbijslag en school', 'Schrijf je kinderen ook in op school.', null, 'dutch-school-system-basisschool'],
        ['inburgering-integration-law-2026', 'Inburgering', 'De gemeente maakt een inburgeringsplan met je.'],
        ['essential-apps-netherlands', 'De belangrijkste apps', 'DigiD, 9292, verzekeraar en bank.']
      ],
      second: 'en school',
      schools_h: 'Scholen in de buurt', po: 'Basisscholen', vo: 'Middelbare scholen (vmbo / havo / vwo)', more: 'Bekijk alle scholen op de kaart en vergelijk',
      schools_note: 'Gesorteerd op afstand van de postcode, binnen je gemeente. Je schrijft je kind rechtstreeks in bij de school; de basisschool vanaf 4 jaar, leerplichtig vanaf 5.', school_guide: 'Uitleg schoolsysteem',
      school_src: 'Schoolgegevens: DUO, hoofdvestiging van elke basisschool.',
      help: [['bijzondere bijstand', 'Bijzondere bijstand voor noodzakelijke kosten', 'special-assistance-bijzondere-bijstand'], ['kwijtschelding', 'Kwijtschelding gemeentelijke belastingen', 'municipal-taxes-exemption-kwijtschelding'],
        ['bijstand', 'Bijstandsuitkering', 'social-assistance-bijstand'], ['schuldhulp', 'Gratis schuldhulp', 'debt-help-schuldhulp'],
        ['minimaregeling', 'Minimaregelingen (stadspas, kindpakket)', null], ['wmo', 'Wmo: hulp thuis en vervoer', 'wmo-home-support']],
      search: 'Zoek op gemeentesite', guide: 'Uitleg',
      free: [['Juridisch Loket', 'Gratis juridisch advies: 0800-8020', 'https://www.juridischloket.nl/'], ['VluchtelingenWerk', 'Hulp voor vluchtelingen en nieuwkomers', 'https://www.vluchtelingenwerk.nl/'],
        ['', 'Alle gidsen over asiel en verblijf op één plek', '/nl/articles/asylum-residence-hub.html']]
    }
  }[LANG];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function ltr(s) { return '<span dir="ltr">' + esc(s) + '</span>'; }
  function hav(a, b) {
    var R = 6371, d = Math.PI / 180, x = (b[0] - a[0]) * d, y = (b[1] - a[1]) * d;
    var h = Math.sin(x / 2) * Math.sin(x / 2) + Math.cos(a[0] * d) * Math.cos(b[0] * d) * Math.sin(y / 2) * Math.sin(y / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('net'); return r.json(); }); }

  var DATA = null;
  function loadData() {
    if (DATA) return Promise.resolve(DATA);
    return Promise.all([getJSON('/assets/gemeenten.json?v=1'), getJSON('/assets/ov/rail.json?v=1').catch(function () { return null; })])
      .then(function (r) { DATA = { g: r[0].g, rail: r[1] }; return DATA; });
  }

  // postcode like 3511AB or 3511 AB 10
  function pcQuery(q) {
    var m = q.replace(/\s+/g, ' ').trim().match(/^(\d{4})\s?([A-Za-z]{2})(?:\s*(\d+))?/);
    return m ? { pc: m[1] + m[2].toUpperCase(), nr: m[3] } : null;
  }
  function lookup(q) {
    var fl = 'weergavenaam,gemeentecode,gemeentenaam,provincienaam,centroide_ll,type';
    var p = pcQuery(q), url;
    if (p) url = PDOK + 'free?rows=1&fl=' + fl + '&q=' + encodeURIComponent('postcode:' + p.pc + (p.nr ? ' AND huisnummer:' + p.nr : '')) + '&fq=' + encodeURIComponent(p.nr ? 'type:adres' : 'type:postcode');
    else url = PDOK + 'free?rows=1&fl=' + fl + '&fq=' + encodeURIComponent('type:(adres OR postcode OR woonplaats OR weg OR gemeente)') + '&q=' + encodeURIComponent(q);
    return getJSON(url).then(function (j) {
      var d = j.response && j.response.docs && j.response.docs[0];
      if (!d && p && p.nr) return lookup(p.pc);
      if (!d) throw new Error('nf');
      var m = /POINT\(([-\d.]+) ([-\d.]+)\)/.exec(d.centroide_ll || '');
      return { label: d.weergavenaam, code: d.gemeentecode, name: d.gemeentenaam, prov: d.provincienaam, pt: m ? [parseFloat(m[2]), parseFloat(m[1])] : null };
    });
  }

  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

  function pc4(pc) { var m = /^(\d{4})\s?([A-Z]{2})?/i.exec(pc || ''); return m ? [parseInt(m[1], 10), (m[2] || '').toUpperCase()] : null; }
  function schoolsHtml(place) {
    var me = pc4((place.label.match(/\d{4}\s?[A-Z]{2}/i) || [''])[0]);
    function near(list, n) {
      return list.map(function (s) { var p = pc4(s[2]); var d = me && p ? Math.abs(p[0] - me[0]) * 10 + (p[1] === me[1] ? 0 : p[1].slice(0, 1) === me[1].slice(0, 1) ? 1 : 3) : 999; return [d, s]; })
        .sort(function (a, b) { return a[0] - b[0]; }).slice(0, n).map(function (x) { return x[1]; });
    }
    function li(s, extra) {
      var name = s[5] ? '<a href="' + esc(s[5]) + '" rel="noopener nofollow" target="_blank">' + esc(s[0]) + '</a>' : esc(s[0]);
      return '<li><b dir="ltr">' + name + '</b><br><small dir="ltr">' + esc(s[1] + ', ' + s[2] + ' ' + s[3]) + (extra ? ' · ' + esc(extra) : '') + '</small></li>';
    }
    var S = place.schools, h = '<div class="mg-card"><h3>🏫 ' + T.schools_h + '</h3><p class="muted">' + T.schools_note + '</p>';
    if (S.po.length) h += '<h4>' + T.po + '</h4><ul class="mg-list">' + near(S.po, 6).map(function (s) { return li(s, s[4]); }).join('') + '</ul>';
    if (S.vo.length) {
      var seen = {}, vo = near(S.vo, 12).filter(function (s) { var k = s[0] + s[1]; if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 4);
      h += '<h4>' + T.vo + '</h4><ul class="mg-list">' + vo.map(function (s) { return li(s, s[4]); }).join('') + '</ul>';
    }
    h += '<div class="tool-actions"><a class="tool-button" rel="noopener" target="_blank" href="https://scholenopdekaart.nl/">🗺️ ' + T.more + '</a>'
      + '<a class="tool-button" href="' + PRE + '/articles/dutch-school-system-basisschool.html">📖 ' + T.school_guide + '</a></div>'
      + '<p class="muted">' + T.school_src + '</p></div>';
    return h;
  }

  function render(place, D) {
    var g = D.g[place.code], html = '';
    html += '<div class="mg-card mg-main"><p class="mg-kicker">📍 ' + T.your + '</p><h3>' + esc(g ? g.n : place.name) + '</h3>'
      + '<p class="muted">' + esc(place.label) + (place.prov ? ' · ' + T.prov + ': ' + esc(place.prov) : '') + '</p>';
    if (g) {
      html += '<dl class="mg-dl">';
      if (g.a) {
        var addr = g.a.s + ', ' + g.a.pc + ' ' + g.a.c;
        html += '<div><dt>' + T.visit + '</dt><dd>' + ltr(addr) + '</dd></div>';
      }
      if (g.t) html += '<div><dt>' + T.phone + '</dt><dd>' + ltr(g.t) + '</dd></div>';
      if (g.e) html += '<div><dt>' + T.mail + '</dt><dd><a href="mailto:' + esc(g.e) + '">' + ltr(g.e) + '</a></dd></div>';
      if (g.w) html += '<div><dt>' + T.site + '</dt><dd><a href="' + esc(g.w) + '" rel="noopener" target="_blank">' + ltr(host(g.w)) + '</a></dd></div>';
      html += '</dl><div class="tool-actions">'
        + (g.t ? '<a class="tool-button primary" href="tel:' + esc(g.t.replace(/[^\d+]/g, '')) + '">📞 ' + T.call + '</a>' : '')
        + (g.w ? '<a class="tool-button" href="' + esc(g.w) + '" rel="noopener" target="_blank">🌐 ' + T.open + '</a>' : '')
        + (g.a ? '<a class="tool-button" rel="noopener nofollow" target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(g.n + ', ' + g.a.s + ', ' + g.a.pc + ' ' + g.a.c) + '">🗺️ ' + T.map + '</a>' : '')
        + '</div>';
      if (/^14 /.test(g.t)) html += '<p class="muted">' + T.phone_note + '</p>';
    } else {
      html += '<p>' + T.nodata + ' <a href="https://organisaties.overheid.nl/Gemeenten/" rel="noopener" target="_blank">organisaties.overheid.nl</a></p>';
    }
    html += '</div>';

    // stations
    if (D.rail && place.pt) {
      var near = D.rail.st.map(function (s) { return [hav(place.pt, [s[1], s[2]]), s]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 2);
      html += '<div class="mg-card"><h3>🚆 ' + T.stations + '</h3><ul class="mg-list">' + near.map(function (x) {
        var ops = x[1][3].map(function (i) { return D.rail.ops[i][0]; }).join(LANG === 'ar' ? '، ' : ', ');
        return '<li><b>' + esc(x[1][0]) + '</b> · ' + ltr('~' + x[0].toFixed(1) + ' ' + T.km) + ' · <small dir="ltr">' + esc(ops) + '</small></li>';
      }).join('') + '</ul>';
      var q = new URLSearchParams({ f: place.label, fx: place.pt[0].toFixed(5) + ',' + place.pt[1].toFixed(5) });
      html += '<a class="tool-button" href="' + PRE + '/calculators/ov-reiskosten.html?' + q.toString() + '#ov-planner">🧮 ' + T.plan + '</a></div>';
    }

    // schools
    if (place.schools) html += schoolsHtml(place);

    // plan
    html += '<div class="mg-card"><h3>✅ ' + T.plan_h + '</h3><p class="muted">' + T.plan_note + '</p><ol class="mg-steps">' + T.steps.map(function (s) {
      var href = s[3] || (PRE + '/articles/' + s[0] + '.html');
      var extra = s[4] ? ' <a href="' + PRE + '/articles/' + s[4] + '.html">' + T.second + '</a>' : '';
      return '<li><a href="' + href + '"><b>' + esc(s[1]) + '</b></a>' + extra + '<br><small>' + esc(s[2]) + '</small></li>';
    }).join('') + '</ol></div>';

    // municipal help
    if (g && g.w) {
      var h = host(g.w);
      html += '<div class="mg-card"><h3>💶 ' + T.help_h + '</h3><p class="muted">' + T.help_note + '</p><ul class="mg-help">' + T.help.map(function (x) {
        return '<li><span>' + esc(x[1]) + ' <small dir="ltr">(' + esc(x[0]) + ')</small></span><span class="mg-help-a">'
          + '<a rel="noopener nofollow" target="_blank" href="https://www.google.com/search?q=' + encodeURIComponent('site:' + h + ' ' + x[0]) + '">🔎 ' + T.search + '</a>'
          + (x[2] ? ' <a href="' + PRE + '/articles/' + x[2] + '.html">📖 ' + T.guide + '</a>' : '') + '</span></li>';
      }).join('') + '</ul></div>';
    }

    // free help
    html += '<div class="mg-card"><h3>🤝 ' + T.free_h + '</h3><ul class="mg-list">' + T.free.map(function (x) {
      return '<li><a href="' + esc(x[2]) + '"' + (/^https?:/.test(x[2]) ? ' rel="noopener" target="_blank"' : '') + '>' + (x[0] ? '<b dir="ltr">' + esc(x[0]) + '</b>: ' : '') + esc(x[1]) + '</a></li>';
    }).join('') + '</ul></div>';

    html += '<div class="tool-actions"><button class="tool-button primary mg-share" type="button">📤 ' + T.share + '</button></div>';
    html += '<p class="muted">' + T.src + '</p>';
    return html;
  }


  // share a result: WhatsApp + native share/copy, with a result-specific message (also used by the page share bar)
  function shareResult(out, sel, text, note) {
    var url = location.href, sh = out.querySelector(sel);
    if (window.gnShare) window.gnShare.set(text, url);
    if (!sh) return;
    var wa = document.createElement('a');
    wa.className = 'tool-button'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + url);
    wa.textContent = LANG === 'nl' ? 'WhatsApp' : 'واتساب';
    sh.parentNode.insertBefore(wa, sh);
    if (note) { var p = document.createElement('p'); p.className = 'muted'; p.textContent = note; sh.parentNode.parentNode.insertBefore(p, sh.parentNode.nextSibling); }
    sh.addEventListener('click', function () {
      if (navigator.share) { navigator.share({ title: document.title, text: text, url: url }).catch(function () {}); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(text + '\n' + url) : Promise.reject()).then(function () { sh.textContent = '✅ ' + T.copied; }).catch(function () { window.prompt(T.share, url); });
    });
  }
  function init() {
    var root = document.getElementById('mijn-gemeente');
    if (!root) return;
    var form = root.querySelector('form'), input = form.elements.q, out = root.querySelector('.tool-result');
    function run() {
      var q = input.value.trim();
      if (q.length < 3) { out.innerHTML = '<p class="notice">' + T.bad + '</p>'; return; }
      out.innerHTML = '<p>' + T.loading + '</p>';
      Promise.all([lookup(q), loadData()]).then(function (r) {
        return getJSON('/assets/scholen/' + r[0].code + '.json?v=1').catch(function () { return null; }).then(function (sc) { r[0].schools = sc; return r; });
      }).then(function (r) {
        out.innerHTML = render(r[0], r[1]);
        try { history.replaceState(null, '', location.pathname + '?q=' + encodeURIComponent(q) + '#mijn-gemeente'); } catch (e) { /* ignore */ }
        shareResult(out, '.mg-share', T.share_msg, T.share_note);
        if (window.gtag) window.gtag('event', 'mijn_gemeente_result');
      }).catch(function (e) {
        out.innerHTML = '<p class="notice">' + (e && e.message === 'nf' ? T.nf : T.neterr) + '</p>';
      });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    try { var q0 = new URLSearchParams(location.search).get('q'); if (q0) { input.value = q0.slice(0, 100); run(); } } catch (e) { /* ignore */ }
  }
  window.MijnGemeente = { pcQuery: pcQuery, lookup: lookup };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
