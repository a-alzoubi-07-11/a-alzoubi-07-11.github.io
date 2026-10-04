# Freshness agent — playbook

The site is only worth something if its facts are current. The freshness agent keeps
every guide true **after** it was published: amounts change on 1 January and 1 July,
laws take effect, deadlines pass, official pages move.

It has two parts:

| Part | What it does | When |
|---|---|---|
| Scanner — `.github/scripts/freshness_agent.py` (GitHub Actions, `Freshness agent` workflow) | Ranks pages that may be out of date and checks official source links. Never edits articles. Writes `docs/freshness/queue.json`, `reports/freshness.md`, and keeps one open GitHub issue (label `freshness`). | Every Monday, or on demand |
| Editor — Claude scheduled task "Freshness agent monthly" | Takes the top of the queue, re-verifies each fact on the official source, rewrites what changed in **both languages**, restamps the page and publishes. | 1st of every month |

## Signals the scanner uses

- **Age**: `dateModified` older than 90 days → review; older than 180 days → stale. No date → verify and restamp.
- **Milestones**: a date in a forward-looking sentence ("from 1 January 2027", "vóór 1 juli", "حتى 31 ديسمبر")
  that just passed (≤120 days ago) or is coming (≤45 days ahead). A passed milestone means the sentence is now in the
  wrong tense *and* the new rule must be checked. Historical sentences ("the Senate voted on 7 July") are ignored.
- **Year in title**: the title only mentions a year that is over.
- **Broken official links**: 404/410 on a `.nl`/`.eu` source (403/timeouts count as unknown, not broken).
- High-stakes topics (money, residence, legal deadlines) are weighted ×1.3.

## Editor rules (the monthly Claude run)

1. `python3 .github/scripts/freshness_agent.py --today YYYY-MM-DD` (add `--links` if the network allows) and read
   `docs/freshness/queue.json`. Work on **at most 3 articles** (an AR page and its NL twin count as one), highest score first.
   Skip pages already in the "rewrite backlog" of the content plan unless the issue is a wrong fact.
2. For each article, open every reason and verify on the **official source** (Rijksoverheid, Belastingdienst/Dienst
   Toeslagen, UWV, SVB, DUO, IND, CBR, KVK, Officiële bekendmakingen, wetten.overheid.nl). Use Firecrawl when available,
   otherwise WebFetch/WebSearch. News sites may point you to a change but are never the source for a number.
3. Change only what the source proves:
   - rewrite passed milestones in the present/past tense ("since 1 January 2027 …") and add the new rule if it is official;
   - update amounts, limits and dates; if a figure cannot be verified, remove or hedge it — never guess;
   - replace a broken source link with the new official URL (same institution);
   - keep the structure, the AI-assistance disclosure, the editorial-policy link and the byline exactly as they are.
     Never invent authors, reviewers, reviews or quotes.
4. Make the **same factual change in the Arabic and Dutch page**.
5. Restamp both pages: `dateModified` in JSON-LD, `article:modified_time`, the visible "last checked" date, and the
   page's `<lastmod>` in `sitemap.xml`. Add a one-line correction note when a fact was wrong (not when it simply aged).
6. `python3 .github/scripts/build_search_index.py` then `python3 .github/scripts/site_guard.py` — **must exit 0**.
   If the guard fails, fix it or drop that change. Never push a red guard.
7. Commit only the touched article pages, `sitemap.xml`, `assets/search-index.json` and `docs/freshness/queue.json`:
   `Freshness agent: re-verified <slugs> (YYYY-MM-DD)` and push to `main` (pull --rebase and retry if rejected).
8. Report per article: what was checked, what changed (old → new, with the source URL), what could not be verified.

## What the editor must never do

- Touch design files, scripts, workflows, the ticker, `ads.txt`, `robots.txt` or pages outside the chosen articles.
- Delete an article or change its URL.
- Publish a figure that is only "expected" without labelling it as expected and naming who expects it.
