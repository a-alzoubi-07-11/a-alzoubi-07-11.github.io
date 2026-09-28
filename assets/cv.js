(() => {
  'use strict';
  const S = window.CvSuggestions, T = window.CvTranslate;
  const fields = ['city', 'role', 'experience', 'education', 'languages'];
  const skillIds = ['safety', 'team', 'punctual', 'cleaning', 'logistics', 'service', 'computer', 'driving'];
  const nlSkills = ['Veilig werken', 'Samenwerken', 'Op tijd komen', 'Schoonmaken', 'Magazijn en bezorgen', 'Klanten helpen', 'Computer gebruiken', 'Autorijden'];
  const copy = {
    ar: {
      back: 'الرئيسية', language: 'Nederlands', title: 'أنشئ سيرتك الذاتية CV',
      intro: 'اكتب بالعربية أو اختر من الاقتراحات. سيرتك جاهزة بالهولندية في 4 خطوات.',
      privacy: 'المسودة والصورة على جهازك. النصوص العربية تُرسل تلقائياً لخدمة الترجمة؛ التفاصيل في سياسة الخصوصية.', privacyLink: 'سياسة الخصوصية',
      steps: ['بياناتك', 'الخبرة والدراسة', 'المهارات واللغات', 'السيرة جاهزة'],
      name: 'الاسم الكامل بالأحرف اللاتينية', nameHint: 'اكتب اسمك كما يظهر في وثائقك.', city: 'المدينة', phone: 'الهاتف', email: 'البريد الإلكتروني',
      category: 'مجال العمل', role: 'الوظيفة المطلوبة', experience: 'الخبرة العملية', education: 'الدراسة والدورات', languages: 'اللغات ومستواك', skills: 'المهارات',
      workHint: 'أضف العمل والمدة والمهام. اترك الحقل فارغاً إذا لم تكن لديك خبرة.',
      optional: 'اختياري', browse: 'اقتراحات', noResults: 'يمكنك متابعة الكتابة؛ الترجمة تلقائية.', next: 'التالي', previous: 'السابق', print: 'حفظ CV بصيغة PDF',
      step: 'الخطوة', of: 'من', translated: 'بالهولندية', edit: 'تعديل', done: 'تم', translating: 'جارٍ الترجمة إلى الهولندية…',
      translationError: 'تعذّرت الترجمة. أعد المحاولة أو اكتب الترجمة يدوياً.', retry: 'إعادة المحاولة', manual: 'كتابة الترجمة',
      review: 'راجع معلوماتك ثم احفظ السيرة.', reviewPending: 'جارٍ تجهيز الترجمة… يمكنك متابعة المعاينة.', reviewError: 'توجد ترجمة غير مكتملة. أعد المحاولة أو عدّل النص قبل حفظ PDF.',
      contactHint: 'أضف هاتفاً أو بريداً إلكترونياً للتواصل.', required: 'أدخل اسمك بالأحرف اللاتينية كما في وثائقك.', emailInvalid: 'تحقق من البريد الإلكتروني.',
      photo: 'صورة شخصية', choosePhoto: 'إضافة صورة', removePhoto: 'حذف الصورة', photoAlt: 'صورة السيرة الذاتية', photoLoading: 'جارٍ تجهيز الصورة…',
      photoError: 'اختر صورة JPG أو PNG أو WebP، أقل من 10 ميغابايت.', photoReady: 'تمت إضافة الصورة.',
      saved: 'محفوظة على جهازك تلقائياً', saveError: 'تعذّر الحفظ على الجهاز. احفظ PDF قبل إغلاق الصفحة.', clear: 'مسح البيانات', undo: 'استعادة البيانات', restore: 'استعادة المسودة المحفوظة', emptyHint: 'الأمثلة الباهتة للتوضيح فقط؛ اكتب بياناتك للبدء.',
      printHint: 'اختر «حفظ كـ PDF» في نافذة الطباعة. على iPhone يمكنك مشاركة معاينة الطباعة إلى «الملفات».',
      skillNames: ['العمل بأمان', 'العمل الجماعي', 'الالتزام بالمواعيد', 'التنظيف', 'المستودعات والتوصيل', 'خدمة الزبائن', 'الكمبيوتر', 'القيادة'],
      placeholders: { name: 'Jan de Vries', city: 'روتردام / Rotterdam', phone: '06 00000000', email: 'naam@example.com', role: 'مثال: كهربائي', experience: 'مثال: عملت سنة في متجر، وساعدت الزبائن ورتبت المنتجات.', education: 'مثال: دورة لغة هولندية — 2025', languages: 'مثال: العربية لغة أم، الهولندية A2' }
    },
    nl: {
      back: 'Home', language: 'العربية', title: 'Maak je cv',
      intro: 'Schrijf in het Arabisch of kies suggesties. Je Nederlandse cv in 4 stappen.',
      privacy: 'Je concept en foto blijven op dit apparaat. Arabische tekst gaat automatisch naar een vertaaldienst; zie het privacybeleid.', privacyLink: 'Privacybeleid',
      steps: ['Je gegevens', 'Werk en opleiding', 'Vaardigheden en talen', 'Je cv'],
      name: 'Volledige naam in Latijnse letters', nameHint: 'Schrijf je naam zoals op je documenten.', city: 'Woonplaats', phone: 'Telefoon', email: 'E-mail',
      category: 'Vakgebied', role: 'Gewenste functie', experience: 'Werkervaring', education: 'Opleiding en cursussen', languages: 'Talen en niveau', skills: 'Vaardigheden',
      workHint: 'Vermeld werk, periode en taken. Laat dit leeg als je nog geen ervaring hebt.',
      optional: 'Optioneel', browse: 'Suggesties', noResults: 'Schrijf gerust verder; vertalen gaat automatisch.', next: 'Volgende', previous: 'Vorige', print: 'Cv opslaan als pdf',
      step: 'Stap', of: 'van', translated: 'In het Nederlands', edit: 'Bewerken', done: 'Klaar', translating: 'Vertalen naar het Nederlands…',
      translationError: 'Vertalen lukt niet. Probeer opnieuw of vul de vertaling zelf in.', retry: 'Opnieuw proberen', manual: 'Vertaling invullen',
      review: 'Controleer je gegevens en sla je cv op.', reviewPending: 'De vertaling wordt voorbereid… Je kunt je cv alvast bekijken.', reviewError: 'Een vertaling is nog niet klaar. Probeer opnieuw of bewerk de tekst voordat je de pdf bewaart.',
      contactHint: 'Voeg een telefoonnummer of e-mailadres toe.', required: 'Vul je naam in Latijnse letters in zoals op je documenten.', emailInvalid: 'Controleer je e-mailadres.',
      photo: 'Profielfoto', choosePhoto: 'Foto toevoegen', removePhoto: 'Foto verwijderen', photoAlt: 'Profielfoto voor het cv', photoLoading: 'Foto voorbereiden…',
      photoError: 'Kies JPG, PNG of WebP, kleiner dan 10 MB.', photoReady: 'Foto toegevoegd.',
      saved: 'Automatisch op dit apparaat bewaard', saveError: 'Opslaan lukt niet. Bewaar een pdf voordat je deze pagina sluit.', clear: 'Gegevens wissen', undo: 'Gegevens herstellen', restore: 'Opgeslagen concept herstellen', emptyHint: 'De lichte voorbeelden zijn alleen ter uitleg. Vul je eigen gegevens in.',
      printHint: 'Kies “Opslaan als pdf” in het afdrukvenster. Op een iPhone kun je het afdrukvoorbeeld delen naar Bestanden.',
      skillNames: nlSkills,
      placeholders: { name: 'Jan de Vries', city: 'Rotterdam', phone: '06 00000000', email: 'naam@example.com', role: 'Bijvoorbeeld: elektricien', experience: 'Bijvoorbeeld: een jaar in een winkel gewerkt, klanten geholpen en producten aangevuld.', education: 'Bijvoorbeeld: cursus Nederlands — 2025', languages: 'Bijvoorbeeld: Arabisch — moedertaal, Nederlands — A2' }
    }
  };
  let lang = 'ar'; try { lang = localStorage.getItem('mbo_site_lang') === 'nl' ? 'nl' : 'ar'; } catch {}
  function sanitize(draft) {
    const d = { ...draft };
    for (const k of ['name', 'nameLatin', 'city', 'phone', 'email', 'role', 'experience', 'education', 'languages']) d[k] = typeof d[k] === 'string' ? d[k] : '';
    d.name = d.nameLatin || d.name;
    d.skills = Array.isArray(d.skills) ? d.skills.filter(k => skillIds.includes(k)) : [];
    d.translations = d.translations && typeof d.translations === 'object' && !Array.isArray(d.translations) ? d.translations : {};
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d.photo || '')) delete d.photo;
    return d;
  }
  // A new page always starts blank. A stored CV is restored only by an explicit click.
  const storedDraft = sanitize(window.MboData.readCvDraft());
  let draftAvailable = ['name', ...fields, 'phone', 'email'].some(k => Boolean(storedDraft[k].trim())) || storedDraft.skills.length > 0 || Boolean(storedDraft.photo);
  let draftStarted = false;
  let data = sanitize({}), step = 0, category = 'all', photoVersion = 0, saveFailed = false, undoDraft = null;
  const timers = new Map(), requests = new Map(), states = new Map();
  const text = () => copy[lang];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function translated(k) { const v = data.translations[k]; return v && v.source === data[k] && typeof v.value === 'string' && v.value.trim() && !T.hasArabic(v.value) ? v.value : null; }
  function output(k) { return translated(k) ?? T.known(k, data[k]); }
  function unresolved() { return fields.filter(k => T.hasArabic(output(k))); }
  function save() {
    draftStarted = true; draftAvailable = false;
    document.getElementById('restore-draft')?.remove();
    saveFailed = !window.MboData.writeCvDraft(data);
    const el = document.getElementById('save-state');
    if (el) { el.textContent = text()[saveFailed ? 'saveError' : 'saved']; el.className = saveFailed ? 'warning' : 'hint'; }
  }
  function cancel(k) {
    clearTimeout(timers.get(k)); timers.delete(k);
    const request = requests.get(k); if (request) { request.abort(); requests.delete(k); }
    states.delete(k);
  }
  function updateField(k, value, immediate = false) {
    cancel(k); data[k] = value; if (k === 'name') data.nameLatin = value;
    delete data.translations[k]; save();
    if (fields.includes(k)) schedule(k, immediate ? 0 : 1400);
  }
  function schedule(k, delay = 1400) {
    clearTimeout(timers.get(k)); timers.delete(k);
    if (!fields.includes(k) || !T.hasArabic(output(k))) { paintTranslation(k); refreshPreview(); return; }
    if (requests.has(k)) return;
    states.set(k, 'waiting'); paintTranslation(k); refreshPreview();
    timers.set(k, setTimeout(() => { timers.delete(k); runTranslation(k); }, delay));
  }
  async function runTranslation(k) {
    if (!fields.includes(k) || !T.hasArabic(output(k)) || requests.has(k)) return;
    const source = data[k], controller = new AbortController(); requests.set(k, controller); states.set(k, 'pending');
    paintTranslation(k); refreshPreview();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const value = await T.translate(k, source, controller.signal);
      if (requests.get(k) !== controller || data[k] !== source) return;
      data.translations[k] = { source, value }; states.delete(k); save();
    } catch {
      if (requests.get(k) === controller && data[k] === source) states.set(k, 'error');
    } finally {
      clearTimeout(timeout);
      if (requests.get(k) === controller) { requests.delete(k); paintTranslation(k); refreshPreview(); }
    }
  }
  function shell() {
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    for (const id of ['back', 'language', 'title', 'intro', 'privacy', 'privacyLink']) document.getElementById(id).textContent = text()[id];
    document.title = text().title; render();
  }
  function field(k, type = 'text', multiline = false) {
    const x = text(), suggest = Boolean(S[k]);
    const attrs = `id="field-${k}" data-field="${k}" dir="${['name','email','phone'].includes(k) ? 'ltr' : 'auto'}" maxlength="${multiline ? 1600 : 160}" autocomplete="off" ${suggest ? `aria-controls="suggest-${k}" aria-expanded="false" aria-autocomplete="list" ${multiline ? '' : 'role="combobox"'}` : ''}`;
    return `<div class="field-group"><label class="question" for="field-${k}"><strong>${x[k]}</strong>${multiline ? `<textarea ${attrs} rows="3" placeholder="${esc(x.placeholders[k])}">${esc(data[k])}</textarea>` : `<input ${attrs} type="${type}" ${type === 'tel' ? 'inputmode="tel"' : type === 'email' ? 'inputmode="email" autocapitalize="none"' : ''} value="${esc(data[k])}" placeholder="${esc(x.placeholders[k])}">`}</label>${suggest ? `<button type="button" class="suggest-toggle" data-browse="${k}" aria-expanded="false" aria-controls="suggest-${k}">${x.browse} ▾</button><div id="suggest-${k}" class="suggestions" role="listbox" aria-label="${x.browse}: ${x[k]}" hidden></div>` : ''}${fields.includes(k) ? `<div id="translation-${k}" class="translation-slot" aria-live="polite"></div>` : ''}</div>`;
  }
  function photoSection() {
    const x = text(); return `<section class="photo-section"><div>${data.photo ? `<img class="photo-thumb" src="${data.photo}" alt="${x.photoAlt}">` : '<span class="photo-placeholder" aria-hidden="true">＋</span>'}</div><div><strong>${x.photo} <small>(${x.optional})</small></strong><div class="photo-controls"><label class="upload-button" for="photo-input">${data.photo ? x.edit : x.choosePhoto}<input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"></label>${data.photo ? `<button type="button" class="small" id="remove-photo">${x.removePhoto}</button>` : ''}</div></div><p id="photo-status" role="status"></p></section>`;
  }
  function section() {
    const x = text();
    if (step === 0) return field('name') + `<p class="hint name-hint">${x.nameHint}</p>` + `<div class="contact-grid">${field('city')}${field('phone', 'tel')}${field('email', 'email')}</div>` + photoSection();
    if (step === 1) return `<label class="question" for="job-category"><strong>${x.category}</strong><select id="job-category">${S.categories.map(r => `<option value="${r[0]}" ${category === r[0] ? 'selected' : ''}>${esc(r[lang === 'ar' ? 1 : 2])}</option>`).join('')}</select></label>` + field('role') + field('experience', 'text', true) + `<p class="hint">${x.workHint}</p>` + field('education', 'text', true);
    if (step === 2) return `<fieldset><legend>${x.skills}</legend><div class="choices">${skillIds.map((s, i) => `<label class="choice"><input type="checkbox" data-skill="${s}" ${data.skills.includes(s) ? 'checked' : ''}><span>${x.skillNames[i]}</span></label>`).join('')}</div></fieldset>` + field('languages', 'text', true);
    return `<p class="hint">${x.review}</p><div id="translation-summary" role="status"></div>${data.phone || data.email ? '' : `<p class="hint">${x.contactHint}</p>`}<div class="review-edit">${x.steps.slice(0, 3).map((s, i) => `<button type="button" class="small" data-step="${i}">${x.edit}: ${s}</button>`).join('')}</div><article id="cv-preview" class="paper" lang="nl" dir="ltr">${preview()}</article><p class="hint">${x.printHint}</p>`;
  }
  function line(label, value) { return value ? `<section class="cv-block"><h3>${label}</h3><p>${esc(value).replace(/\n/g, '<br>')}</p></section>` : ''; }
  function preview() {
    const value = k => T.hasArabic(output(k)) ? 'Vertaling wordt voorbereid…' : output(k);
    const chosen = skillIds.filter(s => data.skills.includes(s)).map(s => nlSkills[skillIds.indexOf(s)]);
    return `<header class="cv-heading"><div><h2>${esc(data.name) || 'Naam'}</h2><p class="contact">${[value('city'), data.phone, data.email].filter(Boolean).map(esc).join(' · ')}</p></div>${data.photo ? `<img class="cv-photo" src="${data.photo}" alt="Profielfoto">` : ''}</header>${line('Gewenste functie', value('role'))}${line('Werkervaring', value('experience'))}${line('Opleiding en cursussen', value('education'))}${line('Vaardigheden', chosen.join(' · '))}${line('Talen', value('languages'))}`;
  }
  function refreshPreview() {
    if (step !== 3) return;
    const paper = document.getElementById('cv-preview'), status = document.getElementById('translation-summary'), button = document.getElementById('print');
    if (!paper || !status || !button) return;
    paper.innerHTML = preview();
    const missing = unresolved(), failed = missing.some(k => states.get(k) === 'error');
    button.disabled = missing.length > 0;
    document.body.classList.toggle('translation-incomplete', missing.length > 0);
    status.innerHTML = missing.length ? `<p class="${failed ? 'warning' : 'hint'}">${text()[failed ? 'reviewError' : 'reviewPending']}</p>${failed ? `<button type="button" class="small" id="retry-all">${text().retry}</button>` : ''}` : '';
    document.getElementById('retry-all')?.addEventListener('click', () => missing.forEach(k => schedule(k, 0)));
  }
  function validStep() {
    if (step !== 0) return true;
    const error = document.getElementById('error');
    if (!data.name.trim() || T.hasArabic(data.name)) { error.textContent = text().required; document.getElementById('field-name').focus(); return false; }
    if (data.email && !document.getElementById('field-email').checkValidity()) { error.textContent = text().emailInvalid; document.getElementById('field-email').focus(); return false; }
    return true;
  }
  function changeStep(next) {
    if (next > step && !validStep()) return;
    fields.forEach(k => { if (timers.has(k)) schedule(k, 0); });
    step = next; render();
    document.getElementById('step-heading').focus({ preventScroll: true });
    document.getElementById('wizard').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  function restoreDraft() {
    if (!draftAvailable) return;
    fields.forEach(cancel);
    data = sanitize(storedDraft); draftAvailable = false; draftStarted = true; step = 0;
    render();
  }
  function render() {
    photoVersion++; document.body.classList.remove('translation-incomplete');
    const x = text(), host = document.getElementById('wizard');
    host.innerHTML = `<nav class="step-list" aria-label="${x.title}">${x.steps.map((s, i) => `<span class="step ${i === step ? 'current' : ''}" ${i === step ? 'aria-current="step"' : ''}><span class="step-number">${i + 1}</span><span>${s}</span></span>`).join('')}</nav><div class="form-card"><div class="step-head"><h2 id="step-heading" tabindex="-1">${x.steps[step]}</h2><span class="step-count">${step + 1} / 4</span></div>${draftAvailable ? `<button type="button" id="restore-draft" class="small restore-draft">${x.restore}</button>` : ''}${section()}<p id="error" role="alert"></p><div class="actions">${step ? `<button id="prev" type="button" class="secondary">${x.previous}</button>` : ''}${step < 3 ? `<button id="next" type="button">${x.next}</button>` : `<button id="print" type="button">${x.print}</button>`}</div></div><div class="draft-footer"><p id="save-state" class="${saveFailed ? 'warning' : 'hint'}" role="status">${x[saveFailed ? 'saveError' : draftStarted ? 'saved' : 'emptyHint']}</p><button type="button" id="clear" class="text-button">${x[undoDraft ? 'undo' : 'clear']}</button></div>`;
    host.querySelector('#restore-draft')?.addEventListener('click', restoreDraft);
    host.querySelectorAll('[data-field]').forEach(el => {
      const k = el.dataset.field;
      el.addEventListener('input', () => { updateField(k, el.value); if (S[k]) showSuggestions(k, false); });
      el.addEventListener('blur', () => { if (timers.has(k)) schedule(k, 250); });
      if (S[k]) { el.addEventListener('focus', () => { if (el.value.trim()) showSuggestions(k, false); }); el.addEventListener('keydown', e => suggestionKeys(e, k)); }
    });
    host.querySelectorAll('[data-browse]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.browse; if (document.getElementById('suggest-' + k).hidden) showSuggestions(k, true); else hideSuggestions(k); }));
    host.querySelectorAll('[data-skill]').forEach(el => el.addEventListener('change', () => { data.skills = skillIds.filter(k => host.querySelector(`[data-skill="${k}"]`).checked); save(); }));
    host.querySelector('#job-category')?.addEventListener('change', e => { category = e.target.value; showSuggestions('role', true); });
    host.querySelector('#next')?.addEventListener('click', () => changeStep(step + 1));
    host.querySelector('#prev')?.addEventListener('click', () => changeStep(step - 1));
    host.querySelector('#print')?.addEventListener('click', () => { if (!unresolved().length) window.print(); });
    host.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => changeStep(Number(b.dataset.step))));
    host.querySelector('#clear').addEventListener('click', () => { fields.forEach(cancel); if (undoDraft) { data = undoDraft; undoDraft = null; } else { undoDraft = data; data = sanitize({}); } step = 0; save(); render(); });
    host.querySelector('#photo-input')?.addEventListener('change', uploadPhoto);
    host.querySelector('#remove-photo')?.addEventListener('click', () => { delete data.photo; save(); render(); });
    fields.forEach(k => { paintTranslation(k); if (T.hasArabic(output(k)) && !states.has(k)) schedule(k); });
    refreshPreview();
  }
  function hideSuggestions(k) {
    const el = document.getElementById('field-' + k), box = document.getElementById('suggest-' + k);
    if (!box) return;
    box.hidden = true; el.setAttribute('aria-expanded', 'false'); el.removeAttribute('aria-activedescendant');
    document.querySelector(`[data-browse="${k}"]`).setAttribute('aria-expanded', 'false');
  }
  function showSuggestions(k, all) {
    const el = document.getElementById('field-' + k), box = document.getElementById('suggest-' + k), q = all ? '' : T.normalize(el.value.split('\n').at(-1));
    const rows = S[k].filter(r => (k !== 'role' || category === 'all' || r[2] === category) && (!q || T.normalize(r[0] + ' ' + r[1]).includes(q))).slice(0, all ? 80 : 6);
    if (!rows.length && !all) { hideSuggestions(k); return; }
    box.innerHTML = rows.length ? rows.map((r, i) => `<button type="button" role="option" aria-selected="false" id="suggest-${k}-${i}" data-suggestion="${esc(r[1])}"><strong lang="nl" dir="ltr">${esc(r[1])}</strong>${lang === 'ar' ? `<span lang="ar" dir="rtl">${esc(r[0])}</span>` : ''}</button>`).join('') : `<p>${text().noResults}</p>`;
    box.hidden = false; el.setAttribute('aria-expanded', 'true'); el.removeAttribute('aria-activedescendant'); document.querySelector(`[data-browse="${k}"]`).setAttribute('aria-expanded', 'true');
    box.querySelectorAll('[data-suggestion]').forEach(b => {
      b.addEventListener('click', () => {
        const value = b.dataset.suggestion; let current = data[k].trim();
        if (['experience', 'education', 'languages'].includes(k) && current) {
          if (all) { if (!current.split('\n').includes(value)) current += '\n' + value; }
          else { const lines = current.split('\n'); lines[lines.length - 1] = value; current = lines.join('\n'); }
        } else current = value;
        el.value = current; updateField(k, current, true); hideSuggestions(k);
      });
      b.addEventListener('keydown', e => {
        if (e.key === 'Escape') { el.focus(); hideSuggestions(k); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const options = [...box.querySelectorAll('[data-suggestion]')], i = options.indexOf(b); options[(i + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length].focus(); }
      });
    });
  }
  function suggestionKeys(e, k) {
    const box = document.getElementById('suggest-' + k);
    if (e.key === 'Escape') { hideSuggestions(k); return; }
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
    if (box.hidden) { if (e.key === 'Enter') return; showSuggestions(k, false); }
    const options = [...box.querySelectorAll('[data-suggestion]')]; if (!options.length) return;
    let i = options.findIndex(x => x.getAttribute('aria-selected') === 'true');
    if (e.key === 'Enter') { if (i >= 0) { e.preventDefault(); options[i].click(); } return; }
    e.preventDefault(); i = i < 0 ? (e.key === 'ArrowDown' ? 0 : options.length - 1) : (i + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length;
    options.forEach((b, j) => b.setAttribute('aria-selected', String(i === j))); e.target.setAttribute('aria-activedescendant', options[i].id); options[i].scrollIntoView({ block: 'nearest' });
  }
  function paintTranslation(k) {
    const box = document.getElementById('translation-' + k); if (!box) return;
    const x = text(), value = output(k), sourceArabic = T.hasArabic(data[k]);
    if (!sourceArabic) { box.innerHTML = ''; return; }
    if (!T.hasArabic(value)) {
      box.innerHTML = `<div class="translation-caption"><span>${x.translated}</span><button type="button" class="text-button" data-edit>${x.edit}</button></div><p lang="nl" dir="ltr">${esc(value)}</p>`;
      box.querySelector('[data-edit]').addEventListener('click', () => editTranslation(k));
    } else if (states.get(k) === 'error') {
      box.innerHTML = `<p class="warning">${x.translationError}</p><button type="button" class="small" data-retry>${x.retry}</button> <button type="button" class="text-button" data-edit>${x.manual}</button>`;
      box.querySelector('[data-retry]').addEventListener('click', () => schedule(k, 0)); box.querySelector('[data-edit]').addEventListener('click', () => editTranslation(k));
    } else box.innerHTML = `<p class="hint">${x.translating}</p>`;
  }
  function editTranslation(k) {
    cancel(k);
    const source = data[k], box = document.getElementById('translation-' + k), value = translated(k) || (T.hasArabic(output(k)) ? '' : output(k));
    box.innerHTML = `<label class="question" for="translated-${k}"><strong>${text().translated}</strong><textarea id="translated-${k}" lang="nl" dir="ltr" rows="3" maxlength="4000">${esc(value)}</textarea></label><button type="button" class="small" data-done>${text().done}</button>`;
    box.querySelector('textarea').addEventListener('input', e => { if (data[k] !== source) return; data.translations[k] = { source, value: e.target.value }; states.set(k, T.hasArabic(e.target.value) || !e.target.value.trim() ? 'error' : 'edited'); save(); refreshPreview(); });
    box.querySelector('[data-done]').addEventListener('click', () => { if (T.hasArabic(output(k))) states.set(k, 'error'); paintTranslation(k); });
  }
  async function uploadPhoto(event) {
    const file = event.target.files[0]; if (!file) return;
    const version = ++photoVersion, status = document.getElementById('photo-status');
    if (file.size > 10 * 1024 * 1024 || !/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) { status.textContent = text().photoError; return; }
    status.textContent = text().photoLoading; const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url; await img.decode(); if (version !== photoVersion) return;
      if (!img.naturalWidth || !img.naturalHeight) throw Error('Invalid photo');
      const scale = Math.min(1, 600 / Math.max(img.naturalWidth, img.naturalHeight)), canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      data.photo = canvas.toDataURL('image/jpeg', .85); save(); render(); document.getElementById('photo-status').textContent = text()[saveFailed ? 'saveError' : 'photoReady'];
    } catch { if (status.isConnected) status.textContent = text().photoError; }
    finally { URL.revokeObjectURL(url); }
  }
  document.addEventListener('click', e => fields.forEach(k => { const el = document.getElementById('field-' + k); if (el && !el.closest('.field-group').contains(e.target)) hideSuggestions(k); }));
  document.getElementById('language').addEventListener('click', () => { lang = lang === 'ar' ? 'nl' : 'ar'; try { localStorage.setItem('mbo_site_lang', lang); } catch {} shell(); });
  shell();
})();
