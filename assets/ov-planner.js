/* OV-reiskosten / حاسبة المواصلات — route-cost estimator for Dutch public transport (AR/NL).
 *
 * What it does, all in the browser:
 *  1. Finds the two places with PDOK Locatieserver (Dutch government, free, CORS) or our station list.
 *  2. Picks the nearest train stations and the shortest rail route over real track distances
 *     (assets/ov/rail.json, built by tools/pages/make_ov_data.py from the OVapi GTFS feed, CC0).
 *  3. Names the bus/tram/metro operators that stop near each end (assets/ov/local.json, same source).
 *  4. Estimates fares with the official 2026 tariffs and compares NS subscriptions.
 * No route-planning API is called and nothing is stored. Sources for every number are in P.src.
 */
(function () {
  'use strict';

  var P = {
    year: 2026,
    // NS "Tarieven Consumenten, geldig per 1 januari 2026", p. 6-10: vol tarief 2e klas per tariefeenheid (index = TE, 0..200; above 200 = max).
    nsSingle: [3,3,3,3,3,3,3,3,3,3.3,3.5,3.7,4,4.2,4.4,4.6,4.9,5.1,5.3,5.5,5.8,6,6.2,6.4,6.6,6.9,7.1,7.3,7.5,7.8,8,8.2,8.4,8.7,8.9,9.1,9.3,9.6,9.8,10,10.2,10.5,10.7,10.9,11.1,11.3,11.6,11.8,12,12.2,12.4,12.7,12.9,13.1,13.3,13.6,13.8,14,14.2,14.4,14.7,14.9,15.1,15.3,15.7,15.9,16.2,16.4,16.6,16.8,16.9,17.1,17.3,17.5,17.8,18,18.2,18.4,18.7,18.9,19.1,19.3,19.5,19.7,19.8,20,20.2,20.4,20.6,20.8,21,21.1,21.3,21.5,21.6,21.8,22,22.1,22.3,22.5,22.7,22.8,23,23.1,23.3,23.4,23.6,23.8,23.9,24.1,24.2,24.4,24.5,24.7,24.8,25,25.2,25.3,25.5,25.6,25.8,25.9,26,26.1,26.2,26.3,26.4,26.5,26.6,26.7,26.8,26.9,27,27.1,27.2,27.3,27.4,27.5,27.6,27.7,27.8,27.9,28,28.1,28.2,28.3,28.4,28.5,28.6,28.7,28.8,28.9,29,29.1,29.2,29.3,29.3,29.4,29.5,29.6,29.7,29.8,29.9,30,30.1,30.2,30.2,30.3,30.4,30.5,30.6,30.7,30.8,30.9,31,31,31.1,31.2,31.3,31.4,31.5,31.6,31.7,31.8,31.9,31.9,32,32.1,32.2,32.3,32.4,32.5,32.6,32.7,32.8,32.8,32.9,33,33.1,33.2,33.3],
    // Same document p. 17-18: Traject Vrij, NS Flex, 2e klas, per maand (index = TE, 0..80; above 80 = max).
    nsTraject: [68.3,68.3,68.3,68.3,68.3,68.3,68.3,68.3,68.3,75.3,80,85.7,89.3,93.8,100.8,106.5,112.4,117.1,124,129.7,137.8,143.6,149.4,153,157.4,163.3,171.4,176.1,181.8,187.6,192.4,199.3,203.8,207.3,213.1,217.7,223.6,229.4,235.1,242,246.8,250.2,257.1,261.8,265.2,271,275.8,279.1,285,290.8,294.3,300,305.8,310.5,315,320.8,324.4,330.1,333.5,339.4,344.1,347.6,353.3,357.8,361.4,367.3,374,374,380,385.8,389.1,395,395,395,397.2,399.7,399.7,399.7,399.95,399.95,399.95],
    // Same document p. 4 (NS Flex, 2e klas, per maand).
    dalVoordeel: 6.35, dalVoordeelDiscount: 0.40, dalVrij: 127.95, altijdVrij: 399.95, weekendVrij: 39.50,
    // Regional bus/tram/metro 2026: national basistarief € 1,16; kilometertarief per concession, e.g. U-OV and HTM € 0,201,
    // allGo € 0,192, EBS Waterland € 0,215. We use € 0,20 and show it as an estimate.
    busBase: 1.16, busKm: 0.20,
    ns2027: 0.047,           // NS: average +4,7% from 1 January 2027 (announced 20 October 2026)
    roadFactor: 1.3,         // road/route distance vs straight line
    walkMaxKm: 1.2,          // up to this straight-line distance we assume walking to/from the station
    weeksPerMonth: 4.33,
    src: {
      ns: 'https://ocp.ns.nl/caas/v1/media/92530/data/fa92c1f442da6fc8e87bd9b6773ddfbc/ns-prijslijst-2026-nl.pdf',
      uov: 'https://www.u-ov.nl/tarieven',
      htm: 'https://www.htm.nl/reisproducten/producten-tarieven/',
      gtfs: 'https://gtfs.ovapi.nl/',
      pdok: 'https://www.pdok.nl/introductie/-/article/pdok-locatieserver'
    }
  };

  var PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/';
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';

  var T = {
    ar: {
      from: 'من أين تنطلق؟', to: 'إلى أين تذهب؟', ph_from: 'عنوان البيت، رمز بريدي أو محطة', ph_to: 'المدرسة، العمل، المدينة أو المحطة',
      station: 'محطة', loading: 'جاري الحساب…', pick: 'اختر مكاناً من القائمة أو اكتب عنواناً أوضح.', notfound: 'لم نجد هذا المكان في هولندا. جرّب الرمز البريدي ورقم البيت مثل 3511 AB 10.',
      neterr: 'تعذّر الاتصال بخدمة العناوين الحكومية (PDOK). تحقق من الإنترنت وحاول مرة أخرى.', same: 'نقطة الانطلاق والوصول متقاربتان جداً: المشي أو الدراجة أسرع وأرخص.',
      walk: 'مشي', bus: 'باص', tram: 'ترام', metro: 'مترو', ferry: 'عبّارة', train: 'قطار', local: 'باص/ترام/مترو',
      to_station: 'إلى محطة', from_station: 'من محطة', to_dest: 'إلى وجهتك', home_to: 'من نقطة الانطلاق',
      km: 'كم', min: 'دقيقة', approx: 'تقريباً', operators: 'الشركة', likely: 'الشركات العاملة قرب هذه النقطة', change: 'تبديل بين شركتين',
      single: 'رحلة ذهاب', ret: 'ذهاب وعودة', month: 'شهرياً بدون اشتراك', best: 'أفضل خيار لك', save: 'توفّر تقريباً', per_month: 'في الشهر', per_year: 'في السنة',
      one_card: 'بطاقة واحدة تكفي لكل الشركات', one_card_txt: 'لا تحتاج اشتراكاً عند كل شركة. ادفع بـ OVpay (بطاقتك البنكية أو هاتفك) أو بـ OV-chipkaart في القطار والباص والترام والمترو. سجّل الدخول عند الصعود والخروج عند النزول في كل وسيلة.',
      own_ticket: 'هذه العبّارة لا تقبل OVpay أو OV-chipkaart: تحتاج تذكرة منفصلة.',
      sub_h: 'هل الاشتراك أرخص لك؟', sub_none: 'بعدد رحلاتك الحالي الدفع لكل رحلة (بدون اشتراك) هو الأرخص.',
      dal: 'NS Dal Voordeel: خصم 40% خارج أوقات الذروة وفي العطلة', traject: 'NS Traject Vrij: سفر غير محدود على مسار القطار هذا', dalvrij: 'NS Dal Vrij: كل القطارات مجاناً خارج الذروة', altijd: 'NS Altijd Vrij: كل القطارات بلا حدود',
      local_sub: 'رحلات الباص/الترام تكلّفك نحو {x} شهرياً. اسأل {ops} عن الاشتراك الشهري للمنطقة (abonnement): قد يكون أرخص.',
      student: 'أنت طالب؟ مع studentenreisproduct من DUO تسافر مجاناً بالقطار والباص في أيام الأسبوع (أو في العطلة، حسب اختيارك). هذا أكبر توفير ممكن.',
      youth: 'عمرك بين 12 و18 سنة؟ اشتراك NS Dal Voordeel مجاني للشباب (خصم 40% خارج الذروة)، وكثير من شركات الباص لديها خصم للشباب.',
      kid: 'الأطفال من 4 إلى 11 سنة يسافرون مجاناً بالقطار مع بالغ يدفع (Kids Vrij)، ويدفعون أقل في الباص والترام. تحت 4 سنوات مجاناً.',
      senior: '65 سنة فأكثر؟ أغلب شركات الباص تعطي خصماً للمتقاعدين، ولدى NS اشتراكات أرخص لهذه الفئة.',
      note2027: 'أسعار NS ترتفع بمتوسط 4.7% من 1 يناير 2027؛ ارتفاع الباص والترام لعام 2027 لم يُنشر بعد.',
      exact: 'افتح المسار الدقيق مع المواعيد', gmaps: 'خرائط Google', ns: 'مخطط رحلات NS', n9292: '9292',
      share: 'شارك النتيجة', copied: 'تم نسخ الرابط', est: 'الأسعار تقديرية بتعرفة 2026 الرسمية. السعر الدقيق يظهر في تطبيق NS أو 9292 أو عند تسجيل الخروج.',
      peak_warn: 'خصم Dal Voordeel لا ينطبق في أوقات الذروة (أيام العمل 06:30–09:00 و16:00–18:30).',
      none_rail: 'لا توجد محطة قطار قريبة مفيدة لهذه الرحلة؛ الأفضل باص أو ترام مباشرة.',
      long_access: 'المحطة الأقرب بعيدة عن نقطة الانطلاق؛ قد تكون الدراجة أو سيارة الأقارب للوصول إلى المحطة أوفر.',
      bike: 'دراجة أو مشي', trips_label: 'رحلاتك', rail_month: 'القطار فقط، بدون اشتراك'
    },
    nl: {
      from: 'Waar vertrekt u?', to: 'Waar gaat u naartoe?', ph_from: 'Adres, postcode of station', ph_to: 'School, werk, plaats of station',
      station: 'Station', loading: 'Bezig met berekenen…', pick: 'Kies een plaats uit de lijst of typ een duidelijker adres.', notfound: 'We vinden deze plaats niet in Nederland. Probeer postcode en huisnummer, zoals 3511 AB 10.',
      neterr: 'De adresservice van de overheid (PDOK) is niet bereikbaar. Controleer uw internet en probeer opnieuw.', same: 'Vertrek en bestemming liggen heel dicht bij elkaar: lopen of fietsen is sneller en goedkoper.',
      walk: 'Lopen', bus: 'Bus', tram: 'Tram', metro: 'Metro', ferry: 'Veerboot', train: 'Trein', local: 'Bus/tram/metro',
      to_station: 'naar station', from_station: 'vanaf station', to_dest: 'naar uw bestemming', home_to: 'vanaf vertrekpunt',
      km: 'km', min: 'min', approx: 'ongeveer', operators: 'Vervoerder', likely: 'Vervoerders bij dit punt', change: 'overstap tussen vervoerders',
      single: 'Enkele reis', ret: 'Retour', month: 'Per maand zonder abonnement', best: 'Beste keuze voor u', save: 'U bespaart ongeveer', per_month: 'per maand', per_year: 'per jaar',
      one_card: 'Eén kaart voor alle vervoerders', one_card_txt: 'U hebt geen abonnement per vervoerder nodig. Betaal met OVpay (bankpas of telefoon) of met de OV-chipkaart in trein, bus, tram en metro. Check in bij het instappen en check uit bij het uitstappen, in elk vervoermiddel.',
      own_ticket: 'Deze veerboot accepteert geen OVpay of OV-chipkaart: u hebt een apart kaartje nodig.',
      sub_h: 'Is een abonnement goedkoper?', sub_none: 'Met uw aantal reizen is betalen per reis (zonder abonnement) het goedkoopst.',
      dal: 'NS Dal Voordeel: 40% korting buiten de spits en in het weekend', traject: 'NS Traject Vrij: onbeperkt reizen op dit treintraject', dalvrij: 'NS Dal Vrij: gratis met alle treinen buiten de spits', altijd: 'NS Altijd Vrij: onbeperkt met alle treinen',
      local_sub: 'Bus/tram kost u ongeveer {x} per maand. Vraag {ops} naar een maand- of regioabonnement: dat kan goedkoper zijn.',
      student: 'Student? Met het studentenreisproduct van DUO reist u doordeweeks (of in het weekend, naar keuze) gratis met trein en bus. Dat is de grootste besparing.',
      youth: '12 t/m 18 jaar? Het NS Dal Voordeel-abonnement is gratis voor jongeren (40% korting buiten de spits) en veel busvervoerders hebben jongerenkorting.',
      kid: 'Kinderen van 4 t/m 11 reizen gratis met de trein met een betalende volwassene (Kids Vrij) en betalen minder in bus en tram. Onder de 4 jaar gratis.',
      senior: '65 of ouder? De meeste busvervoerders geven ouderenkorting, en NS heeft goedkopere abonnementen voor 65-plussers.',
      note2027: 'NS-tarieven stijgen per 1 januari 2027 gemiddeld 4,7%; de busverhoging voor 2027 is nog niet bekend.',
      exact: 'Bekijk de exacte reis met vertrektijden', gmaps: 'Google Maps', ns: 'NS Reisplanner', n9292: '9292',
      share: 'Deel de uitkomst', copied: 'Link gekopieerd', est: 'Prijzen zijn schattingen met de officiële tarieven van 2026. De exacte prijs ziet u in de NS-app, bij 9292 of bij het uitchecken.',
      peak_warn: 'Dal Voordeel-korting geldt niet in de spits (werkdagen 06:30–09:00 en 16:00–18:30).',
      none_rail: 'Er is geen nuttig treinstation in de buurt voor deze reis; bus of tram is de beste keuze.',
      long_access: 'Het dichtstbijzijnde station ligt ver van uw vertrekpunt; met de fiets naar het station is vaak voordeliger.',
      bike: 'Fiets of lopen', trips_label: 'Uw reizen', rail_month: 'Alleen trein, zonder abonnement'
    }
  }[LANG];

  // ---------- helpers ----------
  function hav(a, b) {
    var R = 6371, d2r = Math.PI / 180;
    var dLa = (b[0] - a[0]) * d2r, dLo = (b[1] - a[1]) * d2r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[0] * d2r) * Math.cos(b[0] * d2r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function eur(x) {
    var s = (Math.round(x * 100) / 100).toFixed(2).split('.');
    return '\u20ac\u00a0' + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1];
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function ltr(s) { return '<span dir="ltr">' + s + '</span>'; }
  function nsFare(km) { var te = Math.max(0, Math.round(km)); return P.nsSingle[Math.min(te, P.nsSingle.length - 1)]; }
  function trajectPrice(km) { var te = Math.max(0, Math.round(km)); return P.nsTraject[Math.min(te, P.nsTraject.length - 1)]; }
  function busFare(roadKm) { return P.busBase + P.busKm * roadKm; }
  function fold(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }

  // ---------- data ----------
  var DATA = { rail: null, local: null, adj: null };
  var loading = null;
  function loadData() {
    if (loading) return loading;
    var v = '?v=1';
    loading = Promise.all([
      fetch('/assets/ov/rail.json' + v).then(function (r) { if (!r.ok) throw new Error('rail'); return r.json(); }),
      fetch('/assets/ov/local.json' + v).then(function (r) { if (!r.ok) throw new Error('local'); return r.json(); })
    ]).then(function (res) {
      DATA.rail = res[0]; DATA.local = res[1];
      var adj = [];
      DATA.rail.st.forEach(function () { adj.push([]); });
      DATA.rail.e.forEach(function (e) {
        // prefer NS on parallel tracks (same km, same price table) so the operator list stays simple
        var w = e[2] * (DATA.rail.ops[e[3]][3] ? 1 : 1.03);
        adj[e[0]].push([e[1], w, e[2], e[3]]);
        adj[e[1]].push([e[0], w, e[2], e[3]]);
      });
      DATA.adj = adj;
      DATA.stFold = DATA.rail.st.map(function (s) { return fold(s[0]); });
    });
    loading.catch(function () { loading = null; });
    return loading;
  }

  // Dijkstra from one station; returns {dist, prev:[station, edgeOperator, km]}
  function dijkstra(src) {
    var n = DATA.adj.length, dist = new Array(n).fill(Infinity), prev = new Array(n).fill(null), done = new Array(n).fill(false);
    dist[src] = 0;
    for (;;) {
      var u = -1, best = Infinity;
      for (var i = 0; i < n; i++) if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
      if (u < 0) break;
      done[u] = true;
      var ed = DATA.adj[u];
      for (var j = 0; j < ed.length; j++) {
        var v = ed[j][0], nd = best + ed[j][1];
        if (nd < dist[v]) { dist[v] = nd; prev[v] = [u, ed[j][3], ed[j][2]]; }
      }
    }
    return { dist: dist, prev: prev };
  }
  function railPath(tree, src, dst) {
    var segs = [], x = dst, km = 0, guard = 0;
    while (x !== src && tree.prev[x] && guard++ < 500) {
      var p = tree.prev[x];
      km += p[2];
      if (segs.length && segs[0].op === p[1]) { segs[0].km += p[2]; segs[0].from = p[0]; }
      else segs.unshift({ op: p[1], km: p[2], from: p[0], to: x });
      x = p[0];
    }
    if (x !== src) return null;
    var merged = [];
    segs.forEach(function (sg) {
      var last = merged[merged.length - 1];
      if (last && (last.op === sg.op || sg.km < 5)) { last.km += sg.km; last.to = sg.to; }
      else if (last && last.km < 5) { sg.km += last.km; sg.from = last.from; merged[merged.length - 1] = sg; }
      else merged.push({ op: sg.op, km: sg.km, from: sg.from, to: sg.to });
    });
    for (var i = merged.length - 1; i > 0; i--) if (merged[i].op === merged[i - 1].op) { merged[i - 1].km += merged[i].km; merged[i - 1].to = merged[i].to; merged.splice(i, 1); }
    return { km: km, segs: merged };
  }
  function nearestStations(pt, k) {
    var arr = DATA.rail.st.map(function (s, i) { return [hav(pt, [s[1], s[2]]), i]; });
    arr.sort(function (a, b) { return a[0] - b[0]; });
    return arr.slice(0, k).filter(function (x, i) { return i === 0 || x[0] < 15; });
  }

  // operators of bus/tram/metro/ferry within ~1 km of a point, most widespread first
  function opsNear(pt, ring) {
    var L = DATA.local, r = ring == null ? 1 : ring;
    var a = Math.floor((pt[0] - L.lat0) / L.dlat), b = Math.floor((pt[1] - L.lon0) / L.dlon);
    var score = {}, modes = {};
    for (var i = -r; i <= r; i++) for (var j = -r; j <= r; j++) {
      var cell = L.c[(a + i) + '_' + (b + j)];
      if (!cell) continue;
      var wgt = (i === 0 && j === 0) ? 3 : 1;
      cell.forEach(function (c) { score[c[0]] = (score[c[0]] || 0) + wgt; modes[c[0]] = (modes[c[0]] || '') + c[1]; });
    }
    return Object.keys(score).map(Number).sort(function (x, y) { return score[y] - score[x]; })
      .map(function (i) { return { i: i, m: modes[i], s: score[i] }; });
  }
  function opsBetween(p, q) {
    var A = opsNear(p, 1), B = opsNear(q, 1);
    if (!A.length) A = opsNear(p, 3);
    if (!B.length) B = opsNear(q, 3);
    var bset = {}; B.forEach(function (o) { bset[o.i] = o; });
    var both = A.filter(function (o) { return bset[o.i]; }).map(function (o) { return { i: o.i, m: o.m + bset[o.i].m, s: o.s + bset[o.i].s }; })
      .sort(function (x, y) { return y.s - x.s; });
    var strong = function (l) { return l.filter(function (o, k) { return k === 0 || o.s >= l[0].s * 0.5; }).slice(0, 3); };
    return { both: strong(both), near: strong(A), far: strong(B) };
  }

  // ---------- planning ----------
  function localLeg(p, q, kind) {
    var straight = hav(p, q);
    if (straight <= P.walkMaxKm) return { type: 'walk', km: straight * 1.25, min: straight * 1.25 / 4.8 * 60, fare: 0, kind: kind };
    var road = straight * P.roadFactor, ops = opsBetween(p, q);
    var list = ops.both.length ? ops.both : ops.near.concat(ops.far.filter(function (o) { return !ops.near.some(function (n) { return n.i === o.i; }); }));
    return {
      type: 'local', km: road, min: 7 + road / 20 * 60 + (ops.both.length ? 0 : 6), fare: busFare(road),
      ops: list.slice(0, 4), transfer: !ops.both.length, kind: kind
    };
  }

  function plan(A, B) {
    var direct = hav(A, B), out = { direct: direct, options: [] };
    if (direct < 0.8) { out.tooClose = true; }
    // local-only option
    if (direct <= 35) {
      var lo = localLeg(A, B, 'direct');
      out.options.push({ kind: 'local', legs: [lo], min: lo.min, fare: lo.fare, rail: null });
    }
    // rail options
    var oc = nearestStations(A, 4), dc = nearestStations(B, 4);
    oc.forEach(function (o) {
      var tree = dijkstra(o[1]);
      dc.forEach(function (d) {
        if (o[1] === d[1]) return;
        var path = railPath(tree, o[1], d[1]);
        if (!path || path.km <= 0) return;
        if (path.km + o[0] + d[0] > direct * 2.6 + 10) return;   // silly detours
        var sA = DATA.rail.st[o[1]], sB = DATA.rail.st[d[1]];
        var acc = localLeg(A, [sA[1], sA[2]], 'access'), egr = localLeg([sB[1], sB[2]], B, 'egress');
        var nOps = path.segs.length, distinct = {};
        path.segs.forEach(function (sg) { distinct[DATA.rail.ops[sg.op][0].split(' ')[0]] = 1; });
        var extra = Math.min(2, Object.keys(distinct).length - 1);
        var railMin = 5 + path.km / 80 * 60 + (nOps - 1) * 6;
        var railFare = nsFare(path.km) + extra * P.busBase;   // a new start fare when you change to another rail company
        var min = acc.min + railMin + egr.min + (acc.type === 'walk' ? 3 : 6) + (egr.type === 'walk' ? 2 : 5);
        out.options.push({
          kind: 'rail', legs: [acc, { type: 'rail', km: path.km, min: railMin, fare: railFare, segs: path.segs, from: o[1], to: d[1] }, egr],
          min: min, fare: acc.fare + railFare + egr.fare, rail: { km: path.km, fare: railFare, ns: path.segs.every(function (s) { return DATA.rail.ops[s.op][3]; }) },
          accessKm: o[0]
        });
      });
    });
    out.options.sort(function (x, y) { return (x.min + x.fare * 1.5) - (y.min + y.fare * 1.5); });
    out.best = out.options[0] || null;
    return out;
  }

  // monthly costs and subscription advice
  function advise(best, tripsPerWeek, offpeak) {
    var trips = tripsPerWeek * P.weeksPerMonth;
    var res = { trips: trips, monthly: best.fare * trips, options: [] };
    if (best.rail) {
      var railM = best.rail.fare * trips, localM = (best.fare - best.rail.fare) * trips;
      res.railMonthly = railM; res.localMonthly = localM;
      var c = [];
      if (offpeak) c.push({ k: 'dal', cost: P.dalVoordeel + railM * (1 - P.dalVoordeelDiscount) });
      if (best.rail.ns) c.push({ k: 'traject', cost: trajectPrice(best.rail.km) });
      if (offpeak) c.push({ k: 'dalvrij', cost: P.dalVrij });
      c.push({ k: 'altijd', cost: P.altijdVrij });
      c.sort(function (a, b) { return a.cost - b.cost; });
      if (c[0].cost < railM - 1) res.best = { k: c[0].k, cost: c[0].cost, save: railM - c[0].cost };
      res.options = c;
    } else {
      res.localMonthly = best.fare * trips;
    }
    return res;
  }

  // ---------- geocoding ----------
  function stationMatches(q) {
    if (!DATA.rail) return [];
    var f = fold(q).replace(/^station /, '');
    if (f.length < 2) return [];
    var out = [];
    DATA.stFold.forEach(function (s, i) {
      var pos = s.indexOf(f);
      if (pos === 0 || (pos > 0 && s[pos - 1] === ' ')) out.push([pos === 0 ? 0 : 1, s.length, i]);
    });
    out.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return out.slice(0, 3).map(function (x) {
      var s = DATA.rail.st[x[2]];
      return { label: T.station + ' ' + s[0], pt: [s[1], s[2]], station: true };
    });
  }
  function pdokSuggest(q) {
    var url = PDOK + 'suggest?rows=6&fq=' + encodeURIComponent('type:(adres OR postcode OR woonplaats OR weg)') + '&q=' + encodeURIComponent(q);
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('pdok'); return r.json(); }).then(function (j) {
      return (j.response && j.response.docs || []).map(function (d) { return { label: d.weergavenaam, id: d.id }; });
    });
  }
  function pdokLookup(id) {
    return fetch(PDOK + 'lookup?fl=centroide_ll,weergavenaam&id=' + encodeURIComponent(id)).then(function (r) { if (!r.ok) throw new Error('pdok'); return r.json(); })
      .then(function (j) {
        var d = j.response && j.response.docs && j.response.docs[0];
        var m = d && /POINT\(([-\d.]+) ([-\d.]+)\)/.exec(d.centroide_ll || '');
        if (!m) throw new Error('nf');
        return [parseFloat(m[2]), parseFloat(m[1])];
      });
  }
  function resolve(field) {
    if (field.pt) return Promise.resolve(field.pt);
    var q = field.input.value.trim();
    if (q.length < 2) return Promise.reject(new Error('nf'));
    var st = stationMatches(q.replace(new RegExp('^' + T.station + '\\s+'), ''));
    // "Station Utrecht Centraal", "Utrecht Centraal", "محطة Zwolle": use the station itself
    if (st.length && (/station|centraal|^محطة/i.test(q) || fold(st[0].label) === fold(T.station + ' ' + q))) {
      field.pt = st[0].pt; field.input.value = st[0].label; return Promise.resolve(st[0].pt);
    }
    var tries = [q, q.replace(/\d+\s*[a-z]?\b/gi, ' ').replace(/\s+/g, ' ').trim(), q.split(/[\s,]+/).filter(function (w) { return !/\d/.test(w); }).slice(-1)[0] || ''];
    function attempt(i) {
      if (i >= tries.length) return Promise.resolve([]);
      if (tries[i].length < 2 || (i && tries[i] === tries[i - 1])) return attempt(i + 1);
      return pdokSuggest(tries[i]).then(function (l) { return l.length ? l : attempt(i + 1); });
    }
    return attempt(0).then(function (list) {
      if (!list.length) { if (st.length) { field.pt = st[0].pt; return st[0].pt; } throw new Error('nf'); }
      field.input.value = list[0].label;
      return pdokLookup(list[0].id).then(function (pt) { field.pt = pt; return pt; });
    });
  }

  // ---------- autocomplete ----------
  function attach(input, list) {
    var field = { input: input, pt: null }, timer = null, items = [], active = -1, seq = 0;
    function close() { list.hidden = true; list.innerHTML = ''; items = []; active = -1; input.setAttribute('aria-expanded', 'false'); }
    function choose(it) {
      input.value = it.label; close();
      if (it.pt) { field.pt = it.pt; return; }
      field.pt = null; field.pending = pdokLookup(it.id).then(function (pt) { field.pt = pt; return pt; }).catch(function () { field.pt = null; });
    }
    function render() {
      list.innerHTML = '';
      items.forEach(function (it, i) {
        var li = document.createElement('li');
        li.id = input.id + '-opt-' + i; li.setAttribute('role', 'option'); li.textContent = (it.station ? '🚉 ' : '📍 ') + it.label;
        if (i === active) { li.setAttribute('aria-selected', 'true'); input.setAttribute('aria-activedescendant', li.id); }
        li.addEventListener('mousedown', function (e) { e.preventDefault(); choose(it); });
        list.appendChild(li);
      });
      list.hidden = !items.length; input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
    }
    input.addEventListener('input', function () {
      field.pt = null; field.pending = null;
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 2) { close(); return; }
      timer = setTimeout(function () {
        var my = ++seq, st = stationMatches(q);
        items = st; active = -1; render();
        pdokSuggest(q).then(function (l) { if (my !== seq) return; items = st.concat(l).slice(0, 8); render(); }).catch(function () {});
      }, 220);
    });
    input.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { active = Math.min(items.length - 1, active + 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); render(); e.preventDefault(); }
      else if (e.key === 'Enter' && active >= 0) { choose(items[active]); e.preventDefault(); }
      else if (e.key === 'Escape') close();
    });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
    return field;
  }

  // ---------- rendering ----------
  var ICON = { walk: '🚶', b: '🚌', t: '🚋', m: '🚇', f: '⛴️', r: '🚆' };
  function modeWord(m) {
    var w = [];
    if (m.indexOf('t') >= 0) w.push(T.tram);
    if (m.indexOf('m') >= 0) w.push(T.metro);
    if (m.indexOf('b') >= 0) w.push(T.bus);
    if (m.indexOf('f') >= 0) w.push(T.ferry);
    return w.join(' / ');
  }
  function opChip(o) {
    var op = DATA.local.ops[o.i], name = esc(op[0]);
    var m = o.m || 'b';
    if (/[tmb]/.test(m)) m = m.replace(/f/g, '');
    var ico = ['t', 'm', 'b', 'f'].filter(function (k) { return m.indexOf(k) >= 0; }).map(function (k) { return ICON[k]; }).join('');
    var inner = '<span class="ovp-chip-ico" aria-hidden="true">' + ico + '</span><span dir="ltr">' + name + '</span><small>' + esc(modeWord(m)) + '</small>';
    return (op[1] ? '<a class="ovp-chip" href="' + esc(op[1]) + '" rel="noopener nofollow" target="_blank">' + inner + '</a>' : '<span class="ovp-chip">' + inner + '</span>')
      + (op[2] ? '<p class="ovp-warn">' + T.own_ticket + '</p>' : '');
  }
  function railChip(seg) {
    var op = DATA.rail.ops[seg.op];
    var inner = '<span class="ovp-chip-ico" aria-hidden="true">🚆</span><span dir="ltr">' + esc(op[0]) + '</span><small>' + ltr(Math.round(seg.km) + ' ' + T.km) + '</small>';
    return op[1] ? '<a class="ovp-chip ovp-chip-rail" href="' + esc(op[1]) + '" rel="noopener nofollow" target="_blank">' + inner + '</a>' : '<span class="ovp-chip ovp-chip-rail">' + inner + '</span>';
  }
  function legHtml(leg, ctx) {
    var head, body = '', icon;
    if (leg.type === 'walk') {
      icon = ICON.walk;
      head = T.walk + ' ' + (leg.kind === 'access' ? T.to_station + ' ' + esc(ctx.sA) : leg.kind === 'egress' ? T.to_dest : '');
    } else if (leg.type === 'local') {
      var m = (leg.ops[0] && leg.ops[0].m) || 'b';
      if (/[tmb]/.test(m)) m = m.replace(/f/g, '');
      icon = m.indexOf('t') >= 0 ? ICON.t : m.indexOf('m') >= 0 ? ICON.m : ICON.b;
      head = (modeWord(m) || T.local) + ' ' + (leg.kind === 'access' ? T.to_station + ' ' + esc(ctx.sA) : leg.kind === 'egress' ? T.from_station + ' ' + esc(ctx.sB) + ' ' + T.to_dest : '');
      body = '<div class="ovp-chips">' + leg.ops.map(opChip).join('') + '</div>' + (leg.transfer ? '<p class="muted">' + T.likely + ' · ' + T.change + '</p>' : '');
    } else {
      icon = ICON.r;
      head = T.train + ': ' + esc(DATA.rail.st[leg.from][0]) + ' ← ' + esc(DATA.rail.st[leg.to][0]);
      if (LANG === 'nl') head = T.train + ': ' + esc(DATA.rail.st[leg.from][0]) + ' → ' + esc(DATA.rail.st[leg.to][0]);
      body = '<div class="ovp-chips">' + leg.segs.map(railChip).join('') + '</div>';
    }
    var meta = ltr('~' + (leg.km < 10 ? leg.km.toFixed(1) : Math.round(leg.km)) + ' ' + T.km) + ' · ' + ltr('~' + Math.round(leg.min) + ' ' + T.min) + (leg.fare ? ' · <b>' + ltr(eur(leg.fare)) + '</b>' : '');
    return '<li class="ovp-leg ovp-' + leg.type + '"><span class="ovp-leg-ico" aria-hidden="true">' + icon + '</span><div><p class="ovp-leg-h">' + head + '</p><p class="ovp-leg-m">' + meta + '</p>' + body + '</div></li>';
  }
  function subName(k) { return T[k === 'dalvrij' ? 'dalvrij' : k]; }

  function render(out, res, inp) {
    var best = out.best, html = '';
    if (out.tooClose) html += '<p class="notice">🚲 ' + T.same + '</p>';
    if (!best) { return '<p class="notice">' + T.notfound + '</p>'; }
    var ctx = {};
    if (best.kind === 'rail') { ctx.sA = DATA.rail.st[best.legs[1].from][0]; ctx.sB = DATA.rail.st[best.legs[1].to][0]; }
    else if (out.options.every(function (o) { return o.kind !== 'rail'; }) && out.direct > 8) html += '<p class="muted">' + T.none_rail + '</p>';
    html += '<ol class="ovp-legs">' + best.legs.filter(function (l) { return !(l.type === 'walk' && l.km < 0.1); }).map(function (l) { return legHtml(l, ctx); }).join('') + '</ol>';
    if (best.kind === 'rail' && best.accessKm > 6) html += '<p class="muted">🚲 ' + T.long_access + '</p>';
    html += '<div class="ovp-totals">'
      + '<div><span>' + T.single + '</span><strong>' + ltr(eur(best.fare)) + '</strong></div>'
      + '<div><span>' + T.ret + '</span><strong>' + ltr(eur(best.fare * 2)) + '</strong></div>'
      + '<div><span>' + T.month + ' (' + ltr(Math.round(res.trips)) + '×)</span><strong>' + ltr(eur(res.monthly)) + '</strong></div></div>';
    // one card
    html += '<div class="ovp-card"><h3>💳 ' + T.one_card + '</h3><p>' + T.one_card_txt + '</p></div>';
    // subscriptions
    html += '<div class="ovp-card"><h3>💡 ' + T.sub_h + '</h3>';
    if (inp.age === 'student') html += '<p class="ovp-best">🎓 ' + T.student + '</p>';
    if (res.best && inp.age !== 'student') {
      html += '<p class="ovp-best">✅ ' + T.best + ': <b>' + subName(res.best.k) + '</b> — ' + ltr(eur(res.best.cost)) + ' ' + T.per_month
        + '<br>' + T.save + ' <b>' + ltr(eur(res.best.save)) + '</b> ' + T.per_month + ' (' + ltr(eur(res.best.save * 12)) + ' ' + T.per_year + ')</p>';
    } else if (inp.age !== 'student') html += '<p>' + T.sub_none + '</p>';
    if (best.rail && res.options.length) {
      html += '<ul class="ovp-subs">' + res.options.map(function (o) { return '<li><span>' + subName(o.k) + '</span><b>' + ltr(eur(o.cost)) + '</b></li>'; }).join('')
        + '<li><span>' + T.rail_month + '</span><b>' + ltr(eur(res.railMonthly)) + '</b></li></ul>';
      if (!inp.offpeak) html += '<p class="muted">' + T.peak_warn + '</p>';
    }
    var lm = res.localMonthly || 0, lops = [];
    best.legs.forEach(function (l) { if (l.type === 'local') l.ops.forEach(function (o) { var n = DATA.local.ops[o.i][0]; if (lops.indexOf(n) < 0) lops.push(n); }); });
    if (lm > 45 && lops.length) html += '<p>' + T.local_sub.replace('{x}', ltr(eur(lm))).replace('{ops}', lops.map(function (n) { return '<span dir="ltr">' + esc(n) + '</span>'; }).join(LANG === 'ar' ? '، ' : ', ')) + '</p>';
    if (inp.age === 'youth') html += '<p>🧒 ' + T.youth + '</p>';
    if (inp.age === 'kid') html += '<p>👧 ' + T.kid + '</p>';
    if (inp.age === 'senior') html += '<p>👴 ' + T.senior + '</p>';
    html += '</div>';
    // links
    var o = encodeURIComponent(inp.fromLabel), d = encodeURIComponent(inp.toLabel);
    html += '<p class="ovp-links-h">' + T.exact + ':</p><div class="tool-actions">'
      + '<a class="tool-button" rel="noopener nofollow" target="_blank" href="https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=' + o + '&destination=' + d + '">' + T.gmaps + '</a>'
      + '<a class="tool-button" rel="noopener nofollow" target="_blank" href="https://9292.nl/">' + T.n9292 + '</a>'
      + '<a class="tool-button" rel="noopener nofollow" target="_blank" href="https://www.ns.nl/reisplanner">' + T.ns + '</a>'
      + '<button class="tool-button primary ovp-share" type="button">📤 ' + T.share + '</button></div>';
    html += '<p class="muted">' + T.est + ' ' + T.note2027 + '</p>';
    return html;
  }

  // ---------- wiring ----------
  function init() {
    var root = document.getElementById('ov-planner');
    if (!root) return;
    var form = root.querySelector('form'), out = root.querySelector('.tool-result');
    var fFrom = attach(form.elements.from, root.querySelector('#ovp-from-list'));
    var fTo = attach(form.elements.to, root.querySelector('#ovp-to-list'));
    var swap = root.querySelector('.ovp-swap');
    if (swap) swap.addEventListener('click', function () {
      var v = fFrom.input.value, p = fFrom.pt; fFrom.input.value = fTo.input.value; fFrom.pt = fTo.pt; fTo.input.value = v; fTo.pt = p;
    });
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 600); };
    idle(function () { loadData().catch(function () {}); });

    function run() {
      out.innerHTML = '<p>' + T.loading + '</p>';
      var inp = {
        trips: Math.max(1, Math.min(28, parseInt(form.elements.trips.value, 10) || 10)),
        offpeak: form.elements.when.value === 'offpeak', age: form.elements.age.value
      };
      Promise.all([loadData(), fFrom.pending || null, fTo.pending || null]).then(function () {
        return Promise.all([resolve(fFrom), resolve(fTo)]);
      }).then(function (pts) {
        inp.fromLabel = fFrom.input.value; inp.toLabel = fTo.input.value;
        var p = plan(pts[0], pts[1]);
        if (!p.best) { out.innerHTML = '<p class="notice">' + T.notfound + '</p>'; return; }
        var res = advise(p.best, inp.trips, inp.offpeak);
        out.innerHTML = render(p, res, inp);
        try {
          var q = new URLSearchParams({ f: inp.fromLabel, fx: pts[0].map(function (x) { return x.toFixed(5); }).join(','), t: inp.toLabel, tx: pts[1].map(function (x) { return x.toFixed(5); }).join(','), n: inp.trips, w: inp.offpeak ? 'o' : 'p', a: inp.age });
          history.replaceState(null, '', location.pathname + '?' + q.toString() + '#ov-planner');
        } catch (e) { /* ignore */ }
        var sh = out.querySelector('.ovp-share');
        if (sh) sh.addEventListener('click', function () {
          var url = location.href, title = document.title;
          if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
          (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { sh.textContent = '✅ ' + T.copied; }).catch(function () { window.prompt(T.share, url); });
        });
        if (window.gtag) window.gtag('event', 'ov_planner_result', { mode: p.best.kind });
      }).catch(function (e) {
        var msg = e && e.message === 'nf' ? T.notfound : (e && e.message === 'pdok' || e instanceof TypeError) ? T.neterr : T.pick;
        out.innerHTML = '<p class="notice">' + msg + '</p>';
      });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });

    // restore a shared link
    try {
      var q = new URLSearchParams(location.search);
      var pt = function (s) { var a = (s || '').split(',').map(parseFloat); return a.length === 2 && isFinite(a[0]) && isFinite(a[1]) && a[0] > 50 && a[0] < 54 && a[1] > 3 && a[1] < 8 ? a : null; };
      if (q.get('f') && q.get('t')) {
        fFrom.input.value = q.get('f').slice(0, 120); fFrom.pt = pt(q.get('fx'));
        fTo.input.value = q.get('t').slice(0, 120); fTo.pt = pt(q.get('tx'));
        if (q.get('n')) form.elements.trips.value = Math.max(1, Math.min(28, parseInt(q.get('n'), 10) || 10));
        if (q.get('w') === 'o') form.elements.when.value = 'offpeak';
        if (['adult', 'student', 'youth', 'kid', 'senior'].indexOf(q.get('a')) >= 0) form.elements.age.value = q.get('a');
        run();
      }
    } catch (e) { /* ignore */ }
  }

  // exposed for tests
  window.OVPlanner = { P: P, nsFare: nsFare, trajectPrice: trajectPrice, busFare: busFare, hav: hav, plan: plan, advise: advise, loadData: loadData, _data: DATA };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
