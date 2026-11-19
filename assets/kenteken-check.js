/* Kentekencheck / فحص السيارة من رقم اللوحة (AR/NL).
 * Reads RDW Open Data (public domain, no key, CORS) directly in the browser:
 *   m9d7-ebf2 Gekentekende_voertuigen, 8ys7-d773 brandstof, t49b-isb7 terugroep status, j9yg-7rg9 terugroep actie,
 *   sgfe-77wx meldingen keuringsinstantie (APK), a34c-vvps geconstateerde gebreken, hx2c-gt7k gebreken (omschrijving),
 *   jqs4-4kvw tellerstandoordeel toelichting.
 * Nothing is stored. The plate is only sent to opendata.rdw.nl.
 */
(function () {
  'use strict';
  var API = 'https://opendata.rdw.nl/resource/';
  var LANG = (document.documentElement.lang || 'ar').slice(0, 2) === 'nl' ? 'nl' : 'ar';

  var T = {
    ar: {
      bad: 'اكتب رقم لوحة هولندي صحيح، مثل 12-ABC-3 أو GX-232-F.', nf: 'لم نجد سيارة بهذا الرقم في سجل RDW. تأكد من الأحرف والأرقام.',
      neterr: 'تعذّر الاتصال بموقع RDW. تحقق من الإنترنت وحاول مرة أخرى.', loading: 'جاري الفحص في سجل RDW…',
      summary: 'الخلاصة', ok: 'لا توجد ملاحظات مقلقة في البيانات العامة.', warn_n: 'نقاط تحتاج انتباهك',
      basics: 'معلومات السيارة', kind: 'النوع', brand: 'الماركة والموديل', color: 'اللون', fuel: 'الوقود', euro: 'فئة الانبعاثات', first: 'أول تسجيل في العالم',
      firstnl: 'أول تسجيل في هولندا', age: 'العمر', years: 'سنة', seats: 'المقاعد', weight: 'الوزن الفارغ', engine: 'المحرك', power: 'القوة', price: 'السعر الجديد (كاتالوج)',
      label: 'تصنيف استهلاك الوقود', owner_since: 'آخر تغيير مالك',
      apk: 'الفحص الدوري APK', apk_until: 'صالح حتى', apk_expired: 'منتهي! لا يجوز القيادة بدون APK صالح.', apk_soon: 'ينتهي خلال أقل من شهرين.',
      ins: 'التأمين الإلزامي (WAM)', ins_yes: 'مؤمّنة حالياً', ins_no: 'غير مؤمّنة حالياً: لا تقُدها قبل أن تؤمّنها باسمك.',
      odo: 'عدّاد الكيلومترات', odo_ok: 'منطقي', odo_bad: 'غير منطقي: ربما تم التلاعب بالعداد', odo_none: 'لا يوجد حكم', odo_year: 'آخر تسجيل للعداد',
      recall: 'استدعاء من الشركة المصنّعة', recall_open: 'يوجد استدعاء مفتوح: عيب لم يُصلح بعد. اطلب من البائع إصلاحه عند الوكيل مجاناً.', recall_none: 'لا يوجد استدعاء مفتوح',
      recall_fixed: 'استدعاءات قديمة تم إصلاحها',
      imp: 'سيارة مستوردة', imp_txt: 'سُجّلت أول مرة خارج هولندا، وتاريخ العداد قبل الاستيراد غير معروف.',
      taxi: 'استُخدمت كتاكسي', taxi_txt: 'هذه السيارة مسجّلة كتاكسي حالياً أو سابقاً: عادة كيلومترات كثيرة.',
      exp: 'معروضة للتصدير', exp_txt: 'السيارة مسجّلة للتصدير؛ قد لا يمكن تسجيلها باسمك في هولندا.',
      noreg: 'لا يمكن نقل الملكية', noreg_txt: 'RDW لا تسمح حالياً بتسجيل هذه السيارة باسم مالك جديد. لا تشترِها قبل توضيح السبب.',
      history: 'سجل الفحوصات APK', defects: 'عيب', no_hist: 'لا يوجد سجل فحوصات منشور.', nl_note: 'وصف العيوب من RDW باللغة الهولندية.',
      milieu: 'المناطق البيئية (milieuzone)', milieu_txt: 'بعض المدن تمنع سيارات الديزل القديمة. تحقق من فئة الانبعاثات على موقع milieuzones.nl قبل الشراء.',
      tax: 'ضريبة الطريق', tax_txt: 'تُحسب حسب الوزن والوقود والمقاطعة. احسبها على موقع Belastingdienst.',
      buy_h: 'قبل أن تشتري: 5 خطوات', official: 'افتح الفحص الرسمي على موقع RDW', share: 'شارك النتيجة', copied: 'تم نسخ الرابط',
      src: 'المصدر: بيانات RDW المفتوحة. المعلومات عامة ولا تُظهر الأضرار أو الحوادث أو الديون على السيارة.',
      kinds: { 'Personenauto': 'سيارة ركاب', 'Bedrijfsauto': 'سيارة تجارية (فان)', 'Motorfiets': 'دراجة نارية', 'Bromfiets': 'دراجة آلية (سكوتر)', 'Aanhangwagen': 'مقطورة', 'Oplegger': 'نصف مقطورة', 'Driewielig motorrijtuig': 'مركبة بثلاث عجلات', 'Bus': 'باص', 'Land- of bosb tractor': 'جرار زراعي' },
      colors: { GRIJS: 'رمادي', ZWART: 'أسود', WIT: 'أبيض', BLAUW: 'أزرق', ROOD: 'أحمر', GROEN: 'أخضر', BRUIN: 'بني', GEEL: 'أصفر', ORANJE: 'برتقالي', BEIGE: 'بيج', PAARS: 'بنفسجي', CREME: 'كريمي', ROSE: 'وردي', DIVERSEN: 'متعدد الألوان' },
      fuels: { Benzine: 'بنزين', Diesel: 'ديزل', Elektriciteit: 'كهرباء', LPG: 'غاز LPG', CNG: 'غاز CNG', Alcohol: 'كحول', LNG: 'غاز LNG', Waterstof: 'هيدروجين' },
      odoTxt: {
        '00': 'كل قراءة للعداد أعلى من التي قبلها، فالعداد منطقي.', '03': 'كل قراءة للعداد أعلى من التي قبلها، فالعداد منطقي.',
        '01': 'العداد وصل لحده الأقصى ورجع للصفر، أو لا يعدّ حتى 999,999، فلا حكم.', '02': 'تم تبديل العداد أو إصلاحه، فالمسافة الحقيقية غير واضحة.',
        '04': 'سُجّلت قراءة أقل من التي قبلها: ربما رُجّع العداد أو حصل خطأ في التسجيل. اطلب من البائع إثباتات.',
        '05': 'السيارة كانت مسجّلة خارج هولندا أو لا توجد قراءات كافية، فلا حكم.', '06': 'توجد أقل من قراءتين للعداد، فلا حكم.',
        '07': 'مؤسسة NAP حكمت سابقاً أن العداد غير منطقي.', 'NG': 'غير مسجّل.'
      },
      steps: [
        'افحص نفس السيارة: رقم الهيكل (VIN) يطابق الأوراق، واطلب تجربة قيادة.',
        'اطلب فواتير الصيانة، وقارن الكيلومترات مع حكم العداد أعلاه.',
        'انقل الملكية فوراً في مكتب البريد أو عند تاجر معتمد (يحتاج الطرفان التواجد والهوية)، وخذ إثبات نقل الملكية (vrijwaringsbewijs).',
        'أمّن السيارة باسمك قبل أول قيادة. ضريبة الطريق تبدأ تلقائياً بعد نقل الملكية.',
        'لا تدفع نقداً كبيراً بدون إيصال، ولا تحوّل مالاً قبل رؤية السيارة.'
      ]
    },
    nl: {
      bad: 'Vul een geldig Nederlands kenteken in, zoals 12-ABC-3 of GX-232-F.', nf: 'Geen voertuig met dit kenteken in het RDW-register. Controleer letters en cijfers.',
      neterr: 'De RDW-gegevens zijn niet bereikbaar. Controleer uw internet en probeer opnieuw.', loading: 'Bezig met controleren in het RDW-register…',
      summary: 'Samenvatting', ok: 'Geen zorgwekkende punten in de openbare gegevens.', warn_n: 'Punten om op te letten',
      basics: 'Voertuiggegevens', kind: 'Soort', brand: 'Merk en type', color: 'Kleur', fuel: 'Brandstof', euro: 'Emissieklasse', first: 'Eerste toelating',
      firstnl: 'Eerste tenaamstelling in NL', age: 'Leeftijd', years: 'jaar', seats: 'Zitplaatsen', weight: 'Leeg gewicht', engine: 'Motor', power: 'Vermogen', price: 'Catalogusprijs',
      label: 'Zuinigheidslabel', owner_since: 'Laatste tenaamstelling',
      apk: 'APK', apk_until: 'Geldig tot', apk_expired: 'Verlopen! Rijden zonder geldige APK mag niet.', apk_soon: 'Verloopt binnen 2 maanden.',
      ins: 'WAM-verzekering', ins_yes: 'Nu verzekerd', ins_no: 'Nu niet verzekerd: rijd pas als u hem op uw naam hebt verzekerd.',
      odo: 'Tellerstand', odo_ok: 'Logisch', odo_bad: 'Onlogisch: mogelijk teruggedraaid', odo_none: 'Geen oordeel', odo_year: 'Laatste registratie tellerstand',
      recall: 'Terugroepactie', recall_open: 'Er staat een terugroepactie open: een defect is nog niet hersteld. Laat de verkoper dit gratis bij de dealer herstellen.', recall_none: 'Geen openstaande terugroepactie',
      recall_fixed: 'Eerdere terugroepacties, hersteld',
      imp: 'Geïmporteerd', imp_txt: 'Eerst buiten Nederland geregistreerd; de tellerstand van vóór de import is onbekend.',
      taxi: 'Taxi', taxi_txt: 'Dit voertuig staat (of stond) geregistreerd als taxi: meestal veel kilometers.',
      exp: 'Export', exp_txt: 'Het voertuig staat geregistreerd voor export; tenaamstellen in Nederland kan dan niet.',
      noreg: 'Tenaamstellen niet mogelijk', noreg_txt: 'De RDW staat tenaamstelling op een nieuwe eigenaar nu niet toe. Koop pas als de reden duidelijk is.',
      history: 'APK-historie', defects: 'gebrek(en)', no_hist: 'Geen keuringshistorie gepubliceerd.', nl_note: '',
      milieu: 'Milieuzones', milieu_txt: 'Sommige steden weren oudere diesels. Controleer de emissieklasse op milieuzones.nl voordat u koopt.',
      tax: 'Motorrijtuigenbelasting', tax_txt: 'Hangt af van gewicht, brandstof en provincie. Bereken het bij de Belastingdienst.',
      buy_h: 'Voordat u koopt: 5 stappen', official: 'Open de officiële kentekencheck van de RDW', share: 'Deel de uitkomst', copied: 'Link gekopieerd',
      src: 'Bron: RDW Open Data. Dit zijn openbare gegevens; schade, ongelukken of schulden op het voertuig ziet u hier niet.',
      kinds: {}, colors: {}, fuels: {}, odoTxt: {},
      steps: [
        'Controleer het voertuig zelf: het chassisnummer (VIN) klopt met de papieren, en maak een proefrit.',
        'Vraag onderhoudsfacturen en vergelijk de kilometers met het telleroordeel hierboven.',
        'Zet het voertuig direct over op het postkantoor of bij een erkend bedrijf (beide partijen aanwezig met ID) en bewaar het vrijwaringsbewijs.',
        'Verzeker het voertuig op uw naam vóór de eerste rit. De motorrijtuigenbelasting start automatisch na de overschrijving.',
        'Betaal geen groot bedrag contant zonder bewijs en maak geen geld over voordat u het voertuig hebt gezien.'
      ]
    }
  }[LANG];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function ltr(s) { return '<span dir="ltr">' + esc(s) + '</span>'; }
  function norm(p) { return String(p || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  // Display with dashes following the Dutch sidecodes (letter/digit groups).
  function pretty(k) {
    var g = k.match(/[A-Z]+|[0-9]+/g) || [k];
    if (g.length === 3) return g.join('-');
    if (g.length === 2 && k.length === 6) { var a = g[0], b = g[1]; return a.length === 4 ? a.slice(0, 2) + '-' + a.slice(2) + '-' + b : b.length === 4 ? a + '-' + b.slice(0, 2) + '-' + b.slice(2) : a + '-' + b; }
    if (k.length === 6) return k.slice(0, 2) + '-' + k.slice(2, 4) + '-' + k.slice(4);
    return k;
  }
  function d8(s) { return s && /^\d{8}$/.test(s) ? new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)) : null; }
  function fmtDate(s) { var d = d8(s); return d ? ltr(s.slice(6, 8) + '-' + s.slice(4, 6) + '-' + s.slice(0, 4)) : '—'; }
  function num(n) { return String(Math.round(+n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function tr(map, v) { return (map && map[v]) || v; }
  function get(ds, params) {
    var q = Object.keys(params).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
    return fetch(API + ds + '.json?' + q).then(function (r) { if (!r.ok) throw new Error('net'); return r.json(); });
  }
  function soqlList(arr) { return arr.map(function (x) { return "'" + String(x).replace(/'/g, "''") + "'"; }).join(','); }

  function check(k) {
    return get('m9d7-ebf2', { kenteken: k }).then(function (v) {
      if (!v.length) throw new Error('nf');
      var car = v[0];
      return Promise.all([
        get('8ys7-d773', { kenteken: k }).catch(function () { return []; }),
        get('t49b-isb7', { kenteken: k }).catch(function () { return []; }),
        get('sgfe-77wx', { kenteken: k, '$order': 'meld_datum_door_keuringsinstantie DESC', '$limit': 12 }).catch(function () { return []; }),
        get('a34c-vvps', { kenteken: k, '$limit': 200 }).catch(function () { return []; })
      ]).then(function (r) {
        var res = { car: car, fuel: r[0], recalls: r[1], insp: r[2], defects: r[3], defectText: {}, recallText: {} };
        var codes = res.defects.map(function (d) { return d.gebrek_identificatie; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }).slice(0, 40);
        var open = res.recalls.filter(function (x) { return x.code_status === 'O'; }).map(function (x) { return x.referentiecode_rdw; }).slice(0, 10);
        var more = [];
        if (codes.length) more.push(get('hx2c-gt7k', { '$where': 'gebrek_identificatie in(' + soqlList(codes) + ')', '$limit': 200 }).then(function (l) {
          l.forEach(function (x) { if (!res.defectText[x.gebrek_identificatie] || (x.einddatum_gebrek || '') > (res.defectText[x.gebrek_identificatie].e || '')) res.defectText[x.gebrek_identificatie] = { t: x.gebrek_omschrijving, e: x.einddatum_gebrek }; });
        }).catch(function () {}));
        if (open.length) more.push(get('j9yg-7rg9', { '$where': 'referentiecode_rdw in(' + soqlList(open) + ')', '$limit': 10 }).then(function (l) {
          l.forEach(function (x) { res.recallText[x.referentiecode_rdw] = x.omschrijving_defect; });
        }).catch(function () {}));
        return Promise.all(more).then(function () { return res; });
      });
    });
  }

  function row(label, value) { return '<div class="kc-row"><dt>' + label + '</dt><dd>' + value + '</dd></div>'; }

  function render(k, res) {
    var c = res.car, warns = [], now = new Date(), html = '';
    var apk = d8(c.vervaldatum_apk), first = d8(c.datum_eerste_toelating), firstNl = d8(c.datum_eerste_tenaamstelling_in_nederland);
    var openRecalls = res.recalls.filter(function (x) { return x.code_status === 'O'; });
    var fixedRecalls = res.recalls.filter(function (x) { return x.code_status !== 'O'; });
    var imported = first && firstNl && (firstNl - first) > 1000 * 3600 * 24 * 90;
    var odo = c.tellerstandoordeel || '';

    if (apk && apk < now) warns.push(['bad', T.apk + ': ' + T.apk_expired]);
    else if (apk && apk - now < 1000 * 3600 * 24 * 61) warns.push(['warn', T.apk + ': ' + T.apk_soon]);
    if (c.wam_verzekerd === 'Nee') warns.push(['warn', T.ins_no]);
    if (odo === 'Onlogisch') warns.push(['bad', T.odo + ': ' + T.odo_bad]);
    if (openRecalls.length || c.openstaande_terugroepactie_indicator === 'Ja') warns.push(['bad', T.recall_open]);
    if (c.tenaamstellen_mogelijk === 'Nee') warns.push(['bad', T.noreg + ': ' + T.noreg_txt]);
    if (c.export_indicator === 'Ja') warns.push(['bad', T.exp + ': ' + T.exp_txt]);
    if (c.taxi_indicator === 'Ja') warns.push(['warn', T.taxi + ': ' + T.taxi_txt]);
    if (imported) warns.push(['info', T.imp + ': ' + T.imp_txt]);

    html += '<div class="kc-plate" dir="ltr"><span class="kc-nl">NL</span><b>' + esc(pretty(k)) + '</b></div>';
    html += '<p class="kc-title">' + esc((c.merk || '') + ' ' + (c.handelsbenaming || '')) + (first ? ' · ' + ltr(first.getFullYear()) : '') + '</p>';
    html += '<div class="kc-card"><h3>' + T.summary + '</h3>';
    if (!warns.filter(function (w) { return w[0] !== 'info'; }).length) html += '<p class="kc-good">✅ ' + T.ok + '</p>';
    if (warns.length) html += '<ul class="kc-warns">' + warns.map(function (w) { return '<li class="kc-' + w[0] + '">' + (w[0] === 'bad' ? '⛔ ' : w[0] === 'warn' ? '⚠️ ' : 'ℹ️ ') + w[1] + '</li>'; }).join('') + '</ul>';
    html += '</div>';

    // key checks
    var odoTxt = (T.odoTxt[c.code_toelichting_tellerstandoordeel] || '');
    html += '<div class="kc-grid">'
      + '<div class="kc-tile ' + (apk && apk < now ? 'kc-t-bad' : 'kc-t-ok') + '"><span>' + T.apk + '</span><b>' + fmtDate(c.vervaldatum_apk) + '</b></div>'
      + '<div class="kc-tile ' + (c.wam_verzekerd === 'Ja' ? 'kc-t-ok' : 'kc-t-warn') + '"><span>' + T.ins + '</span><b>' + (c.wam_verzekerd === 'Ja' ? T.ins_yes : c.wam_verzekerd === 'Nee' ? T.ins_no.split(':')[0] : '—') + '</b></div>'
      + '<div class="kc-tile ' + (odo === 'Logisch' ? 'kc-t-ok' : odo === 'Onlogisch' ? 'kc-t-bad' : 'kc-t-warn') + '"><span>' + T.odo + '</span><b>' + (odo === 'Logisch' ? T.odo_ok : odo === 'Onlogisch' ? T.odo_bad.split(':')[0] : T.odo_none) + '</b></div>'
      + '<div class="kc-tile ' + (openRecalls.length || c.openstaande_terugroepactie_indicator === 'Ja' ? 'kc-t-bad' : 'kc-t-ok') + '"><span>' + T.recall + '</span><b>' + (openRecalls.length || c.openstaande_terugroepactie_indicator === 'Ja' ? '⛔ ' + (LANG === 'ar' ? 'مفتوح' : 'Open') : T.recall_none) + '</b></div>'
      + '</div>';
    if (odoTxt || c.jaar_laatste_registratie_tellerstand) html += '<p class="muted">' + T.odo + ': ' + esc(odoTxt) + (c.jaar_laatste_registratie_tellerstand ? ' ' + T.odo_year + ': ' + ltr(c.jaar_laatste_registratie_tellerstand) + '.' : '') + '</p>';
    if (openRecalls.length) {
      html += '<div class="kc-card kc-recall"><h3>⛔ ' + T.recall + '</h3><ul>' + openRecalls.map(function (r) {
        return '<li dir="ltr" lang="nl">' + esc(r.referentiecode_rdw) + (res.recallText[r.referentiecode_rdw] ? ': ' + esc(res.recallText[r.referentiecode_rdw]) : '') + '</li>';
      }).join('') + '</ul>' + (T.nl_note ? '<p class="muted">' + T.nl_note + '</p>' : '') + '</div>';
    }

    // basics
    var fuel = res.fuel.map(function (f) { return tr(T.fuels, f.brandstof_omschrijving); }).filter(Boolean).join(' + ');
    var euro = res.fuel.map(function (f) { return f.uitlaatemissieniveau; }).filter(Boolean)[0];
    var kw = res.fuel.map(function (f) { return f.nettomaximumvermogen; }).filter(Boolean)[0];
    var ageY = first ? Math.floor((now - first) / (365.25 * 24 * 3600 * 1000)) : null;
    html += '<div class="kc-card"><h3>' + T.basics + '</h3><dl class="kc-dl">'
      + row(T.brand, esc((c.merk || '') + ' ' + (c.handelsbenaming || '')))
      + row(T.kind, esc(tr(T.kinds, c.voertuigsoort)) + (c.inrichting ? ' · ' + ltr(c.inrichting) : ''))
      + (c.eerste_kleur && c.eerste_kleur !== 'N.v.t.' ? row(T.color, esc(tr(T.colors, c.eerste_kleur))) : '')
      + (fuel ? row(T.fuel, fuel) : '')
      + (euro ? row(T.euro, ltr(euro)) : '')
      + row(T.first, fmtDate(c.datum_eerste_toelating) + (ageY != null ? ' (' + ltr(ageY) + ' ' + T.years + ')' : ''))
      + row(T.firstnl, fmtDate(c.datum_eerste_tenaamstelling_in_nederland))
      + (c.datum_tenaamstelling ? row(T.owner_since, fmtDate(c.datum_tenaamstelling)) : '')
      + (c.cilinderinhoud ? row(T.engine, ltr(num(c.cilinderinhoud) + ' cc')) : '')
      + (kw ? row(T.power, ltr(Math.round(+kw) + ' kW (' + Math.round(+kw * 1.36) + ' pk)')) : '')
      + (c.massa_ledig_voertuig ? row(T.weight, ltr(num(c.massa_ledig_voertuig) + ' kg')) : '')
      + (c.aantal_zitplaatsen ? row(T.seats, ltr(c.aantal_zitplaatsen)) : '')
      + (c.zuinigheidsclassificatie ? row(T.label, ltr(c.zuinigheidsclassificatie)) : '')
      + (c.catalogusprijs ? row(T.price, ltr('€ ' + num(c.catalogusprijs))) : '')
      + '</dl></div>';

    // APK history
    var byDate = {};
    res.defects.forEach(function (d) { (byDate[d.meld_datum_door_keuringsinstantie] = byDate[d.meld_datum_door_keuringsinstantie] || []).push(d); });
    html += '<div class="kc-card"><h3>' + T.history + '</h3>';
    if (!res.insp.length && !res.defects.length) html += '<p>' + T.no_hist + '</p>';
    else {
      var dates = res.insp.map(function (i) { return i.meld_datum_door_keuringsinstantie; });
      Object.keys(byDate).forEach(function (d) { if (dates.indexOf(d) < 0) dates.push(d); });
      dates.sort().reverse();
      html += '<ul class="kc-hist">' + dates.slice(0, 12).map(function (d) {
        var list = byDate[d] || [];
        var n = list.reduce(function (s, x) { return s + (+x.aantal_gebreken_geconstateerd || 1); }, 0);
        return '<li><b>' + fmtDate(d) + '</b> · ' + (n ? '⚠️ ' + ltr(n) + ' ' + T.defects : '✅') + (list.length ? '<ul>' + list.map(function (x) {
          var t = res.defectText[x.gebrek_identificatie];
          return '<li dir="ltr" lang="nl">' + esc(x.gebrek_identificatie) + (t ? ' — ' + esc(t.t) : '') + '</li>';
        }).join('') + '</ul>' : '') + '</li>';
      }).join('') + '</ul>';
      if (res.defects.length && T.nl_note) html += '<p class="muted">' + T.nl_note + '</p>';
    }
    if (fixedRecalls.length) html += '<p class="muted">' + T.recall_fixed + ': ' + ltr(fixedRecalls.length) + '</p>';
    html += '</div>';

    // more
    html += '<div class="kc-card"><h3>' + T.milieu + '</h3><p>' + T.milieu_txt + '</p><h3>' + T.tax + '</h3><p>' + T.tax_txt + '</p>'
      + '<div class="tool-actions"><a class="tool-button" rel="noopener nofollow" target="_blank" href="https://www.milieuzones.nl/">milieuzones.nl</a>'
      + '<a class="tool-button" rel="noopener nofollow" target="_blank" href="https://www.belastingdienst.nl/mrb-berekenen">Belastingdienst</a></div></div>';
    html += '<div class="kc-card"><h3>🛒 ' + T.buy_h + '</h3><ol>' + T.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
    html += '<div class="tool-actions"><a class="tool-button" rel="noopener nofollow" target="_blank" href="https://ovi.rdw.nl/">' + T.official + '</a>'
      + '<button class="tool-button primary kc-share" type="button">📤 ' + T.share + '</button></div>';
    html += '<p class="muted">' + T.src + '</p>';
    return html;
  }

  function init() {
    var root = document.getElementById('kenteken-check');
    if (!root) return;
    var form = root.querySelector('form'), input = form.elements.plate, out = root.querySelector('.tool-result');
    input.addEventListener('input', function () {
      var pos = input.selectionStart, v = input.value.toUpperCase();
      if (v !== input.value) { input.value = v; try { input.setSelectionRange(pos, pos); } catch (e) { /* ignore */ } }
    });
    function run() {
      var k = norm(input.value);
      if (k.length < 4 || k.length > 8) { out.innerHTML = '<p class="notice">' + T.bad + '</p>'; return; }
      out.innerHTML = '<p>' + T.loading + '</p>';
      check(k).then(function (res) {
        out.innerHTML = render(k, res);
        input.value = pretty(k);
        try { history.replaceState(null, '', location.pathname + '?k=' + encodeURIComponent(k) + '#kenteken-check'); } catch (e) { /* ignore */ }
        var sh = out.querySelector('.kc-share');
        if (sh) sh.addEventListener('click', function () {
          var url = location.href;
          if (navigator.share) { navigator.share({ title: document.title, url: url }).catch(function () {}); return; }
          (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { sh.textContent = '✅ ' + T.copied; }).catch(function () { window.prompt(T.share, url); });
        });
        if (window.gtag) window.gtag('event', 'kenteken_check_result');
      }).catch(function (e) {
        out.innerHTML = '<p class="notice">' + (e && e.message === 'nf' ? T.nf : T.neterr) + '</p>';
      });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    try {
      var k0 = new URLSearchParams(location.search).get('k');
      if (k0 && /^[A-Za-z0-9-]{4,10}$/.test(k0)) { input.value = k0; run(); }
    } catch (e) { /* ignore */ }
  }

  window.KentekenCheck = { norm: norm, pretty: pretty, check: check };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
