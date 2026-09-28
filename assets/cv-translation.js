/* Small automatic Arabic → Dutch translator. Requests contain only one text field. */
(() => {
  'use strict';
  const hasArabic = value => /[\u0620-\u064a\u066e-\u06d3\u0750-\u077f\u08a0-\u08c9]/.test(value);
  const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
  const latinDigits = value => value.replace(/[٠-٩۰-۹]/g, char => String('٠١٢٣٤٥٦٧٨٩'.includes(char) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(char) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(char)));
  function known(field, value) {
    return String(value || '').split('\n').map(line => {
      const row = (window.CvSuggestions[field] || []).find(r => normalize(r[0]) === normalize(line) || normalize(r[1]) === normalize(line));
      return row ? row[1] : latinDigits(line);
    }).join('\n');
  }
  function chunks(line) {
    const out = [], encoder = new TextEncoder();
    let chunk = '';
    for (const token of line.split(/(\s+)/)) {
      if (encoder.encode(chunk + token).length <= 480) { chunk += token; continue; }
      if (chunk.trim()) out.push(chunk.trim());
      chunk = '';
      for (const char of token) {
        if (encoder.encode(chunk + char).length > 480) { out.push(chunk); chunk = ''; }
        chunk += char;
      }
    }
    if (chunk.trim()) out.push(chunk.trim());
    return out;
  }
  const cache = new Map();
  let queue = Promise.resolve();
  async function translate(field, source, signal) {
    const local = known(field, source);
    if (!hasArabic(local)) return local;
    const key = field + '\0' + source;
    if (cache.has(key)) return cache.get(key);
    const job = queue.catch(() => {}).then(async () => {
      const lines = [];
      for (const line of local.split('\n')) {
        const parts = [];
        for (const part of chunks(line)) {
          if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
          if (!hasArabic(part)) { parts.push(part); continue; }
          const url = new URL('https://api.mymemory.translated.net/get');
          url.search = new URLSearchParams({ q: part, langpair: 'ar|nl' }).toString();
          const response = await fetch(url, { signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
          const body = await response.json();
          const value = body.responseData?.translatedText;
          if (!response.ok || Number(body.responseStatus) !== 200 || body.quotaFinished || typeof value !== 'string' || !value.trim() || hasArabic(value) || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE/i.test(value)) throw new Error('Translation unavailable');
          parts.push(value.trim());
        }
        lines.push(parts.join(' '));
      }
      const result = lines.join('\n');
      if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      cache.set(key, result);
      if (cache.size > 60) cache.delete(cache.keys().next().value);
      return result;
    });
    queue = job;
    return job;
  }
  window.CvTranslate = Object.freeze({ hasArabic, normalize, known, chunks, translate });
})();
