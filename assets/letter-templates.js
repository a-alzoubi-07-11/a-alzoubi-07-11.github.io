/* Dutch letter templates (Arabic explanation, editable fields, live preview, copy).
   Pure functions (window.GNLetters.build) so tests can check every template without a browser.
   Nothing is saved or sent: the text stays in this page until the visitor copies it. */
(function () {
  'use strict';
  var NOW = function () { var d = new Date(); return d.getDate() + ' ' + ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'][d.getMonth()] + ' ' + d.getFullYear(); };
  // common fields first; each template adds its own
  var BASE = [
    { k: 'name', ar: 'اسمك الكامل', nl: 'Je volledige naam', ph: 'Sara Ahmadi' },
    { k: 'address', ar: 'عنوانك (الشارع والرقم، الرمز البريدي والمدينة)', nl: 'Je adres', ph: 'Voorbeeldstraat 1, 1234 AB Utrecht', area: true },
    { k: 'contact', ar: 'هاتفك أو بريدك الإلكتروني', nl: 'Telefoon of e-mail', ph: '06 12345678' },
    { k: 'to', ar: 'إلى (اسم الجهة أو الشخص)', nl: 'Aan (organisatie of persoon)', ph: 'Gemeente Utrecht' }
  ];
  var T = [
    { id: 'afspraak', ar: 'طلب موعد', nl: 'Afspraak aanvragen',
      whyNl: 'Om een afspraak te vragen bij een organisatie (gemeente, school, kantoor) als online plannen niet lukt. Noem kort de reden en wanneer je kunt.',
      why: 'لتطلب موعداً من جهة (بلدية، مدرسة، مكتب) عندما لا يوجد نظام حجز على الإنترنت أو لم تجد موعداً مناسباً. اذكر سبب الموعد بجملة قصيرة والأيام التي تناسبك.',
      fields: [{ k: 'reason', ar: 'سبب الموعد (بالهولندية إن أمكن)', nl: 'Reden van de afspraak', ph: 'het aanvragen van een nieuw paspoort' },
               { k: 'when', ar: 'الأيام أو الأوقات المناسبة لك', nl: 'Wanneer kun je?', ph: 'maandag of woensdag in de ochtend' },
               { k: 'ref', ar: 'رقم ملف أو مرجع (اختياري)', nl: 'Dossier- of klantnummer (optioneel)', ph: '', opt: true }],
      subject: function (v) { return 'Verzoek om een afspraak' + (v.ref ? ' (kenmerk ' + v.ref + ')' : ''); },
      body: function (v) { return 'Graag wil ik een afspraak maken voor ' + v.reason + '.\n\nIk kan het best op ' + v.when + '. Als die momenten niet mogelijk zijn, hoor ik graag welke andere momenten er zijn.\n\nU kunt mij bereiken via ' + v.contact + '.'; } },
    { id: 'documenten', ar: 'طلب وثائق', nl: 'Documenten opvragen',
      whyNl: 'Om een document of kopie op te vragen, zoals een contract, loonstrook of jaaropgaaf. Noem precies welk document en over welke periode.',
      why: 'لتطلب وثيقة أو نسخة من ملفك، مثل نسخة عقد أو قسيمة راتب أو بيان سنوي (jaaropgaaf) أو نسخة من بياناتك. اذكر الوثيقة بدقة والفترة التي تخصها.',
      fields: [{ k: 'doc', ar: 'الوثيقة التي تطلبها (بالهولندية إن أمكن)', nl: 'Welk document?', ph: 'een kopie van mijn arbeidscontract' },
               { k: 'period', ar: 'الفترة أو التاريخ (اختياري)', nl: 'Periode (optioneel)', ph: '2025', opt: true },
               { k: 'how', ar: 'كيف تريد استلامها', nl: 'Hoe wil je het ontvangen?', ph: 'per e-mail' },
               { k: 'ref', ar: 'رقم ملف أو مرجع (اختياري)', nl: 'Dossier- of klantnummer (optioneel)', ph: '', opt: true }],
      subject: function (v) { return 'Verzoek om ' + v.doc + (v.ref ? ' (kenmerk ' + v.ref + ')' : ''); },
      body: function (v) { return 'Hierbij vraag ik u om ' + v.doc + (v.period ? ' over ' + v.period : '') + '.\n\nIk ontvang het graag ' + v.how + '. Als u hiervoor nog iets van mij nodig hebt, laat het mij dan weten via ' + v.contact + '.'; } },
    { id: 'gemeente', ar: 'سؤال إلى البلدية', nl: 'Vraag aan de gemeente',
      whyNl: 'Om de gemeente een duidelijke vraag te stellen over een dienst of een brief. Noem het kenmerk van de brief als je dat hebt.',
      why: 'لتسأل البلدية سؤالاً واضحاً عن خدمة أو رسالة وصلتك. اكتب السؤال في جملة أو جملتين، وأرفق رقم الرسالة إن وجد.',
      fields: [{ k: 'topic', ar: 'الموضوع باختصار', nl: 'Onderwerp', ph: 'mijn aanvraag voor kwijtschelding' },
               { k: 'question', ar: 'سؤالك (بالهولندية البسيطة)', nl: 'Je vraag', ph: 'Wat is de status van mijn aanvraag en wanneer kan ik een besluit verwachten?', area: true },
               { k: 'ref', ar: 'رقم الرسالة أو الملف (اختياري)', nl: 'Kenmerk van de brief (optioneel)', ph: '', opt: true }],
      subject: function (v) { return 'Vraag over ' + v.topic + (v.ref ? ' (kenmerk ' + v.ref + ')' : ''); },
      body: function (v) { return 'Ik heb een vraag over ' + v.topic + '.\n\n' + v.question + '\n\nAlvast bedankt voor uw antwoord. U kunt mij bereiken via ' + v.contact + '.'; } },
    { id: 'opzeggen', ar: 'إلغاء اشتراك', nl: 'Abonnement opzeggen',
      whyNl: 'Om een abonnement op te zeggen. Noem je klantnummer en vraag om een schriftelijke bevestiging. De opzegtermijn verschilt per contract: kijk in je voorwaarden.',
      why: 'لإلغاء اشتراك (هاتف، إنترنت، نادٍ رياضي، مجلة…). اذكر رقم العميل والتاريخ الذي تريد الإلغاء منه، واطلب تأكيداً مكتوباً. مدة الإشعار تختلف حسب العقد؛ تحقق منها في شروط اشتراكك.',
      fields: [{ k: 'sub', ar: 'نوع الاشتراك', nl: 'Welk abonnement?', ph: 'mijn mobiele abonnement' },
               { k: 'ref', ar: 'رقم العميل أو العقد', nl: 'Klant- of contractnummer', ph: '123456789' },
               { k: 'date', ar: 'تاريخ الإلغاء المطلوب (أو اتركه: أقرب تاريخ ممكن)', nl: 'Per wanneer? (leeg = zo snel mogelijk)', ph: '', opt: true }],
      subject: function (v) { return 'Opzegging van ' + v.sub + ' (klantnummer ' + v.ref + ')'; },
      body: function (v) { return 'Hierbij zeg ik ' + v.sub + ' met klantnummer ' + v.ref + ' op ' + (v.date ? 'per ' + v.date : 'per de eerst mogelijke datum') + '.\n\nWilt u mij de opzegging en de einddatum schriftelijk bevestigen? Eventuele apparatuur stuur ik terug volgens uw instructies.'; } },
    { id: 'werkgever', ar: 'رسالة إلى صاحب العمل', nl: 'Bericht aan mijn werkgever',
      whyNl: 'Om je werkgever iets te vragen over loon, verlof, uren of een fout. Wees concreet en noem data.',
      why: 'لتسأل صاحب العمل أو مدير الموارد البشرية عن أمر عملي: قسيمة الراتب، الإجازة، ساعات العمل، أو تصحيح خطأ. كن محدداً واذكر التواريخ.',
      fields: [{ k: 'topic', ar: 'الموضوع باختصار', nl: 'Onderwerp', ph: 'mijn loonstrook van oktober' },
               { k: 'detail', ar: 'ما الذي تطلبه أو تسأل عنه (بالهولندية البسيطة)', nl: 'Wat vraag je?', ph: 'Op mijn loonstrook staan 120 uur, maar ik heb 136 uur gewerkt. Kunt u dit controleren?', area: true }],
      subject: function (v) { return 'Vraag over ' + v.topic; },
      body: function (v) { return 'Ik heb een vraag over ' + v.topic + '.\n\n' + v.detail + '\n\nIk hoor graag van u. Ik ben bereikbaar via ' + v.contact + '.'; } }
  ];
  function fieldsOf(tpl) { return BASE.concat(tpl.fields); }
  function build(id, v) {
    var tpl = T.filter(function (x) { return x.id === id; })[0];
    if (!tpl) throw new Error('unknown template ' + id);
    var val = {};
    fieldsOf(tpl).forEach(function (f) { var x = (v && v[f.k] != null ? String(v[f.k]) : '').trim(); val[f.k] = x || (f.opt ? '' : '[' + f.nl + ']'); });
    var opening = 'Geachte heer/mevrouw,';
    return 'Aan: ' + val.to + '\n' + 'Datum: ' + NOW() + '\n' + 'Onderwerp: ' + tpl.subject(val) + '\n\n' + opening + '\n\n' + tpl.body(val)
      + '\n\nMet vriendelijke groet,\n\n' + val.name + '\n' + val.address.replace(/\s*\n\s*/g, '\n') + '\n' + val.contact;
  }
  window.GNLetters = { list: T, fieldsOf: fieldsOf, build: build };

  /* ---------- UI (only when the page has #letters) ---------- */
  if (typeof document === 'undefined' || !document.getElementById) return;
  function ui() {
    var root = document.getElementById('letters'); if (!root) return;
    var nl = (document.documentElement.lang || '').slice(0, 2) === 'nl';
    var L = nl ? { pick: 'Kies een voorbeeldbrief', fields: 'Vul in', preview: 'Voorbeeld (Nederlands)', copy: 'Brief kopiëren', copied: 'Gekopieerd', fail: 'Kopiëren lukt niet: selecteer de tekst en kopieer zelf.', note: 'Controleer de brief voordat je hem verstuurt. Er wordt niets opgeslagen of verstuurd.', opt: '(optioneel)' }
                 : { pick: 'اختر نموذجاً', fields: 'املأ البيانات', preview: 'المعاينة (بالهولندية)', copy: 'انسخ الرسالة', copied: 'تم النسخ', fail: 'تعذّر النسخ: حدّد النص وانسخه يدوياً.', note: 'راجع الرسالة قبل إرسالها. لا يُحفظ أي شيء ولا يُرسل.', opt: '(اختياري)' };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var cur = T[0].id, values = {};
    root.innerHTML = '<div class="lt-tabs" role="tablist" aria-label="' + L.pick + '">' + T.map(function (t, i) {
      return '<button type="button" role="tab" id="lt-tab-' + t.id + '" aria-controls="lt-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-id="' + t.id + '">' + esc(nl ? t.nl : t.ar) + '</button>';
    }).join('') + '</div><div id="lt-panel" role="tabpanel" class="lt-panel"></div>';
    var panel = root.querySelector('#lt-panel');
    function draw() {
      var tpl = T.filter(function (x) { return x.id === cur; })[0];
      panel.setAttribute('aria-labelledby', 'lt-tab-' + cur);
      panel.innerHTML = (nl ? '<p class="lt-why">' + esc(tpl.whyNl) + '</p>' : '<p class="lt-why">' + esc(tpl.why) + '</p>') + '<div class="lt-grid"><form class="lt-form" novalidate><h3>' + L.fields + '</h3>'
        + fieldsOf(tpl).map(function (f) {
          var id = 'lt-' + f.k, lab = esc(nl ? f.nl : f.ar) + (f.opt ? ' <small>' + L.opt + '</small>' : '');
          var v = esc(values[f.k] || '');
          return '<label for="' + id + '">' + lab + '</label>' + (f.area ? '<textarea id="' + id + '" data-k="' + f.k + '" rows="3" dir="ltr" placeholder="' + esc(f.ph) + '">' + v + '</textarea>'
            : '<input id="' + id + '" data-k="' + f.k + '" dir="ltr" autocomplete="off" placeholder="' + esc(f.ph) + '" value="' + v + '">');
        }).join('') + '</form><div class="lt-out"><h3>' + L.preview + '</h3><pre class="lt-pre" lang="nl" dir="ltr" tabindex="0"></pre>'
        + '<button type="button" class="lt-copy">' + L.copy + '</button><p class="lt-status" role="status" aria-live="polite"></p><p class="lt-note">' + L.note + '</p></div></div>';
      var pre = panel.querySelector('.lt-pre');
      var upd = function () { pre.textContent = build(cur, values); };
      panel.querySelector('.lt-form').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k) { values[k] = e.target.value; upd(); } });
      panel.querySelector('.lt-copy').addEventListener('click', function () {
        var st = panel.querySelector('.lt-status'), txt = pre.textContent;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { st.textContent = L.copied; }, function () {
          var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); st.textContent = L.fail; });
      });
      upd();
    }
    var tabs = root.querySelector('.lt-tabs');
    function select(btn, focus) {
      tabs.querySelectorAll('[role=tab]').forEach(function (b) { var on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      cur = btn.getAttribute('data-id'); draw(); if (focus) btn.focus();
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[role=tab]'); if (b) select(b); });
    tabs.addEventListener('keydown', function (e) {
      var all = [].slice.call(tabs.querySelectorAll('[role=tab]')), i = all.indexOf(document.activeElement); if (i < 0) return;
      var fwd = (e.key === 'ArrowRight') !== (getComputedStyle(tabs).direction === 'rtl');
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(all[(i + (fwd ? 1 : -1) + all.length) % all.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(all[0], true); } if (e.key === 'End') { e.preventDefault(); select(all[all.length - 1], true); }
    });
    var start = location.hash.slice(1), first = start && tabs.querySelector('[data-id="' + start + '"]');
    first ? select(first) : draw();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();
