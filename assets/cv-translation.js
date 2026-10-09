/* Small automatic Arabic → Dutch/English translator. Requests contain only one text field. */
(() => {
  'use strict';
  const hasArabic = value => /[ؠ-يٮ-ۓݐ-ݿࢠ-ࣉ]/.test(String(value || ''));
  const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFKD')
    .replace(/[̀-ًͯ-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
  const latinDigits = value => value.replace(/[٠-٩۰-۹]/g, char => String('٠١٢٣٤٥٦٧٨٩'.includes(char) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(char) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(char)));
  // Suggestion rows are [ar, nl, en?, ...]. Any column matches; the target column is returned.
  function knownLine(field, line, target) {
    const rows = (window.CvSuggestions && window.CvSuggestions[field]) || [];
    const col = field === 'skills' ? { nl: 2, en: 3 } : { nl: 1, en: 2 }, first = field === 'skills' ? 1 : 0;
    const n = normalize(line.replace(/^\s*[-•·*]\s*/, ''));
    if (!n) return line;
    const row = rows.find(r => [r[first], r[col.nl], r[col.en]].some(c => typeof c === 'string' && normalize(c) === n));
    if (!row) return latinDigits(line);
    return (target === 'en' ? row[col.en] : null) || row[col.nl];
  }
  // Suggestion rows are [ar, nl, en?, ...]. Any column matches; the target column is returned.
  function known(field, value, target = 'nl') {
    return String(value || '').split('\n').map(line => field === 'interest'
      ? line.split(/[,،]/).map(part => part.trim()).filter(Boolean).map(part => knownLine(field, part, target)).join(', ')
      : knownLine(field, line, target)).join('\n');
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
  async function translate(field, source, signal, target = 'nl') {
    target = target === 'en' ? 'en' : 'nl';
    const local = known(field, source, target);
    if (!hasArabic(local)) return local;
    const key = target + '\0' + field + '\0' + source;
    if (cache.has(key)) return cache.get(key);
    const job = queue.catch(() => {}).then(async () => {
      const lines = [];
      for (const line of local.split('\n')) {
        const parts = [];
        for (const part of chunks(line)) {
          if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
          if (!hasArabic(part)) { parts.push(part); continue; }
          const url = new URL('https://api.mymemory.translated.net/get');
          url.search = new URLSearchParams({ q: part, langpair: 'ar|' + target }).toString();
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
      if (cache.size > 120) cache.delete(cache.keys().next().value);
      return result;
    });
    queue = job;
    return job;
  }
  window.CvTranslate = Object.freeze({ hasArabic, normalize, known, chunks, translate });
})();
