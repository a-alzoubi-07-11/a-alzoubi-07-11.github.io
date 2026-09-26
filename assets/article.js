(() => {
  const root = document.querySelector('.container');
  if (!root) return;
  const title = root.querySelector(':scope > h1');
  const headings = [...root.querySelectorAll('h2')].filter(h => !h.closest('.official-sources'));
  if (title) {
    const crumb = document.createElement('nav');
    crumb.className = 'breadcrumbs';
    crumb.setAttribute('aria-label','مسار الصفحة');
    crumb.innerHTML = '<a href="../index.html">الرئيسية</a><span>›</span><a href="../index.html#articles">المقالات</a><span>›</span><span aria-current="page"></span>';
    crumb.lastElementChild.textContent = title.textContent.trim();
    title.before(crumb);
  }
  if (headings.length > 2 && !root.querySelector('.article-toc')) {
    const toc = document.createElement('aside');
    toc.className = 'article-toc';
    toc.innerHTML = '<strong>📚 في هذا الدليل</strong><ul></ul>';
    const list = toc.querySelector('ul');
    headings.forEach((h,i) => {
      if (!h.id) h.id = 'section-' + (i+1);
      const li=document.createElement('li');
      li.innerHTML='<a href="#'+h.id+'"></a>';
      li.firstElementChild.textContent=h.textContent.trim();
      list.appendChild(li);
    });
    const answer = root.querySelector('.direct-answer');
    (answer || title).after(toc);
  }
  root.querySelectorAll('.direct-answer').forEach(el=>el.classList.add('ai-answer'));
})();