# Article pipeline (used by the AI agents)

Every guide is written as a Python module in `modules/a_<name>.py` with `SLUG`, `SRC` (list of (label, url) official sources) and `AR` / `NL` dicts (`title, crumb, desc, summary, body, faq, src_note`). `T(rows, head)` from `a_student_finance` renders a table. Look at `modules/a_tenant.py` as the reference.

Rules: official sources only; verify every figure; hedge anything not final; illustrative examples must be labelled
("أمثلة توضيحية وليست حالات أشخاص حقيقيين" / "illustratief, geen echte personen"); never invent people, reviews or quotes; always both languages.

## Publish a NEW guide
1. Write `modules/a_x.py`. Then fix missing `+` before headings:
   `python3 -c "import re,sys;p=sys.argv[1];s=open(p).read();open(p,'w').write(re.sub(r'(\]\)\n)(\'<h2)',r'\1+\2',s))" modules/a_x.py`
2. Add an entry to `NEW.update({...})` in `scaffold.py` (template slug, category: benefits|work|money|housing|education|residence, listing: family|life|work|education, ar/nl short title + teaser, related slugs).
3. `cd tools/articles && python3 scaffold.py <slug> && python3 run_batch.py a_x` ("MISSING ...?v=" lines are false positives).
4. Add colloquial AR/NL search words to `ALIASES` in `.github/scripts/build_search_index.py`, then `python3 .github/scripts/build_search_index.py`.
5. `git add -A && python3 .github/scripts/site_guard.py` (must print 0 problems) → commit → `git pull --rebase` → push.

## UPDATE an existing guide
Edit its module, run `python3 run_batch.py a_x` (date = today, or set ARTICLE_DATE=YYYY-MM-DD), update `<lastmod>` in sitemap.xml, then steps 4–5.
- Every content run ends by giving the owner the new URLs: python3 tools/indexing_list.py (see tools/indexing_list.py).
