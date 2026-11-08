/* Motivation letter (motivatiebrief) draft from the visitor's own CV.
   - Uses only what is in the CV (name, contact, chosen experience, skills, languages) plus what the visitor types.
   - Never invents experience or diplomas. Nothing is sent anywhere: no translation service, no server.
     Text the visitor types in Arabic is flagged, not translated (they write the Dutch sentence themselves).
   - window.GNMotivation.build(facts, input) is pure, for tests. */
(function () {
  'use strict';
  var AR = /[\u0600-\u06FF]/, KEEP = {};
  function list(a) { a = a.filter(Boolean); return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' en ' + a[a.length - 1]; }
  function sentence(s) { s = String(s || '').trim(); if (!s) return ''; s = s[0].toUpperCase() + s.slice(1); return /[.!?]$/.test(s) ? s : s + '.'; }
  function build(f, inp) {
    f = f || {}; inp = inp || {};
    var job = (inp.job || '').trim() || '[functie]', co = (inp.company || '').trim() || '[bedrijf]';
    var exp = (f.experience || []).filter(function (e) { return inp.pick ? inp.pick.indexOf(e.id) >= 0 : true; }).slice(0, 3);
    var p = [];
    p.push('Met veel interesse heb ik de vacature voor ' + job + ' bij ' + co + ' gelezen. Graag solliciteer ik naar deze functie.');
    if (inp.why && inp.why.trim()) p.push(sentence(inp.why));
    if (exp.length) {
      var parts = exp.map(function (e) { return e.role + (e.company ? ' bij ' + e.company : '') + (e.years ? ' (' + e.years + ')' : ''); });
      p.push('Ik heb ervaring als ' + list(parts) + '.' + (inp.bring && inp.bring.trim() ? ' ' + sentence(inp.bring) : ''));
    } else if (inp.bring && inp.bring.trim()) p.push(sentence(inp.bring));
    var sk = (f.skills || []).slice(0, 4), lg = (f.languages || []).filter(Boolean).slice(0, 4);
    if (sk.length) p.push('Mijn sterke punten zijn onder andere ' + list(sk.map(function (s) { return s.toLowerCase(); })) + '.');
    if (lg.length) p.push('Ik spreek ' + list(lg) + '.');
    p.push('Graag vertel ik u in een gesprek meer over mijn motivatie. Mijn cv vindt u in de bijlage.');
    var contact = [f.phone, f.email].filter(Boolean).join(' · ');
    return 'Onderwerp: Sollicitatie ' + job + '\n\nGeachte heer/mevrouw,\n\n' + p.join('\n\n') + '\n\nMet vriendelijke groet,\n\n' + (f.name || '[naam]') + (contact ? '\n' + contact : '');
  }
  function arabicIn(inp) { return ['job', 'company', 'why', 'bring'].filter(function (k) { return AR.test(inp[k] || ''); }); }

  function mount(host, facts, ui) {
    if (!host) return;
    var ar = ui !== 'nl';
    var L = ar ? { h: 'رسالة تحفيز (motivatiebrief)', intro: 'مسودة من سيرتك أنت فقط: لا نضيف خبرات أو شهادات غير موجودة. اكتب الحقول بالهولندية؛ لا يُرسل أي شيء لأي خدمة.', job: 'الوظيفة (بالهولندية)', co: 'الشركة', why: 'لماذا هذه الشركة أو الوظيفة؟ جملة أو جملتان بالهولندية', bring: 'ما الذي تقدمه؟ (اختياري، بالهولندية)', pick: 'الخبرات التي تذكرها', none: 'لا توجد خبرات في سيرتك بعد؛ أضفها في خطوة «الخبرة» أو اكتب ما تقدمه أعلاه.', prev: 'المعاينة', copy: 'انسخ الرسالة', copied: 'تم النسخ', ar: 'هذا الحقل مكتوب بالعربية. الرسالة بالهولندية، فاكتب هذه الجملة بالهولندية (لا نترجمها تلقائياً): ', check: 'راجع الرسالة وعدّلها قبل الإرسال؛ هي مسودة.' }
                 : { h: 'Motivatiebrief', intro: 'Een concept uit je eigen cv: we voegen geen ervaring of diploma’s toe die er niet in staan. Er wordt niets verstuurd.', job: 'Functie', co: 'Bedrijf', why: 'Waarom dit bedrijf of deze functie? Eén of twee zinnen', bring: 'Wat breng je mee? (optioneel)', pick: 'Welke ervaring noem je?', none: 'Nog geen werkervaring in je cv; voeg die toe bij «Werkervaring» of schrijf hierboven wat je meebrengt.', prev: 'Voorbeeld', copy: 'Brief kopiëren', copied: 'Gekopieerd', ar: 'Dit veld bevat Arabisch. De brief is in het Nederlands; schrijf deze zin in het Nederlands (we vertalen niet automatisch): ', check: 'Lees de brief na en pas hem aan voordat je hem verstuurt; het is een concept.' };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var inp = KEEP.inp || { job: '', company: '', why: '', bring: '', pick: (facts.experience || []).slice(0, 2).map(function (e) { return e.id; }) };
    KEEP.inp = inp;   // survives re-renders of the CV builder (memory only, never stored)
    var exp = facts.experience || [];
    host.innerHTML = '<h3>' + L.h + '</h3><p class="hint">' + L.intro + '</p><div class="mot-grid"><div class="mot-form">'
      + [['job', L.job, false], ['company', L.co, false], ['why', L.why, true], ['bring', L.bring, true]].map(function (f) {
        return '<label for="mot-' + f[0] + '">' + f[1] + '</label>' + (f[2] ? '<textarea id="mot-' + f[0] + '" data-k="' + f[0] + '" rows="3" dir="ltr">' + esc(inp[f[0]]) + '</textarea>' : '<input id="mot-' + f[0] + '" data-k="' + f[0] + '" dir="ltr" value="' + esc(inp[f[0]]) + '">');
      }).join('')
      + '<fieldset class="mot-pick"><legend>' + L.pick + '</legend>' + (exp.length ? exp.map(function (e) {
        return '<label><input type="checkbox" data-pick="' + esc(e.id) + '"' + (inp.pick.indexOf(e.id) >= 0 ? ' checked' : '') + '> <span dir="auto">' + esc(e.role + (e.company ? ' — ' + e.company : '')) + '</span></label>';
      }).join('') : '<p class="hint">' + L.none + '</p>') + '</fieldset><p class="mot-warn warning" role="status" aria-live="polite"></p></div>'
      + '<div class="mot-out"><h4>' + L.prev + '</h4><pre class="mot-pre" lang="nl" dir="ltr" tabindex="0"></pre><button type="button" class="primary-large mot-copy">' + L.copy + '</button><p class="hint mot-status" role="status" aria-live="polite"></p><p class="hint">' + L.check + '</p></div></div>';
    var pre = host.querySelector('.mot-pre'), warn = host.querySelector('.mot-warn');
    function upd() {
      pre.textContent = build(facts, inp);
      var bad = arabicIn(inp);
      warn.textContent = bad.length ? L.ar + bad.map(function (k) { return { job: L.job, company: L.co, why: L.why, bring: L.bring }[k]; }).join('، ') : '';
    }
    host.oninput = function (e) {
      var k = e.target.getAttribute('data-k'); if (k) { inp[k] = e.target.value; upd(); return; }
      var pk = e.target.getAttribute('data-pick');
      if (pk) { inp.pick = inp.pick.filter(function (x) { return x !== pk; }); if (e.target.checked) inp.pick.push(pk); upd(); }
    };
    host.onclick = function (e) {
      if (!e.target.closest('.mot-copy')) return;
      var st = host.querySelector('.mot-status');
      (navigator.clipboard ? navigator.clipboard.writeText(pre.textContent) : Promise.reject()).then(function () { st.textContent = L.copied; }, function () {
        var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); });
    };
    upd();
  }
  window.GNMotivation = { build: build, mount: mount, arabicIn: arabicIn };
})();
