# Daily news agents: playbook for the news ticker

This file tells the daily AI run how to update `assets/news-ticker.json`. The file
drives the "موجز هولندا للمهاجرين" ticker on the home page. Follow it exactly.

## Goal

Every day, check five official Dutch sources for news that matters to Arabic-speaking
newcomers in the Netherlands. Add what is new and keep what is still current. When
nothing new is found, keep the existing items and only refresh the check timestamps.

## The five source agents

Run one check per source. When the Agent tool is available, run them as five parallel
subagents. Each returns zero or more **candidates**: title, publication date (YYYY-MM-DD)
and URL, plus 2–3 sentences of facts taken from the page itself.

| Code | Source | Where to look first | Fallback |
|---|---|---|---|
| BZK | Ministerie van Binnenlandse Zaken en Koninkrijksrelaties | https://www.rijksoverheid.nl/ministeries/ministerie-van-binnenlandse-zaken-en-koninkrijksrelaties (the "Nieuws" block and its "Meer nieuws" link, which filters rijksoverheid.nl/actueel/nieuws by ministry) | search `site:rijksoverheid.nl` + "Binnenlandse Zaken" |
| IND | Immigratie- en Naturalisatiedienst | https://ind.nl/nl/nieuws | search `site:ind.nl nieuws` |
| DUO | Dienst Uitvoering Onderwijs | https://duo.nl/particulier/ (news block; items live under `/particulier/home/actueel/...`) and the DUO press pages under `duo.nl/organisatie/pers/...` | search `site:duo.nl nieuws` for the last 30 days. DUO often has no new item; that is a valid "no-change" result |
| SZW | Ministerie van Sociale Zaken en Werkgelegenheid | https://www.rijksoverheid.nl/ministeries/ministerie-van-sociale-zaken-en-werkgelegenheid (the "Nieuws" block and "Meer nieuws") | search `site:rijksoverheid.nl` + "Sociale Zaken" |
| UWV | Uitvoeringsinstituut Werknemersverzekeringen | https://www.uwv.nl/nl/actueel | search `site:uwv.nl actueel` |

Official sites change their URLs. If a listing URL returns 404, find the new one with a
search, use it, and update the table above in the same commit.

Use Firecrawl (`firecrawl_scrape` / `firecrawl_search` with `includeDomains`) when it is
available, otherwise WebFetch/WebSearch. The shell usually cannot reach these sites.

## Selection rules (editor step)

1. **Official only.** The item URL must be on rijksoverheid.nl, government.nl, ind.nl,
   duo.nl or uwv.nl. Never use news media, blogs or social posts.
2. **Recent.** Published within the last 60 days. The validator removes older items.
3. **Relevant for newcomers.** Prefer residence, asylum, family reunification,
   naturalisation, civic integration, study finance, work, wages, benefits, allowances,
   housing and rent, healthcare costs, energy support, and deadlines. Skip appointments of
   officials, items only for the Caribbean Netherlands, internal reports, and business
   newsletters with no effect on individuals.
4. **At most 2 per source and 8 in total.** The newest relevant items win.
5. **Never invent.** Every date, amount and deadline in a summary must appear on the
   source page you opened. If you cannot open the page, do not add the item.
6. **Status:** `confirmed` = a decision or law that is in force or adopted with a fixed
   date; `announced` = officially announced plan or scheme with dates; `proposed` = a bill
   in consultation or a plan that is not yet adopted. When unsure, use the weaker status.
7. **Keep existing items** that still pass the rules. Do not rewrite them unless the
   source page changed. An item keeps its original `firstSeen`.

## Item format

```json
{
  "source": "SZW",
  "publishedAt": "2026-09-29",
  "firstSeen": "2026-10-04",
  "category": {"ar": "طاقة ودخل", "nl": "Energie"},
  "status": "announced",
  "title": {"ar": "...", "nl": "..."},
  "summary": {"ar": "...", "nl": "..."},
  "url": "https://www.rijksoverheid.nl/actueel/nieuws/..."
}
```

- Title is at most 140 characters, summary at most 220, category at most 30.
- Arabic must be plain Modern Standard Arabic. Keep Dutch official terms in Latin script
  where readers need them (for example Huurcommissie, Noodfonds Energie, WIA).
- The Dutch text is a faithful short rewrite of the source, not a copy of a paragraph.
- `sourceName` and `id` are filled in by the validator.

Also update `checkedSources`: one entry per source with `checkedAt` (today, YYYY-MM-DD),
the `listingUrl` you used, and `result` set to `new`, `no-change` or `error`.

## Validate, then publish

```bash
python3 .github/scripts/news_ticker_validate.py --write   # cleans, caps, stamps updatedAt/validUntil (+48h)
python3 .github/scripts/news_ticker_validate.py           # must exit 0
git add assets/news-ticker.json docs/news-agents/PLAYBOOK.md
git commit -m "News ticker: daily official check YYYY-MM-DD (new: N)"
git push origin main
```

Commit even when no item changed: the new `updatedAt` shows readers that the check ran.
Do not touch any other file. If a push is rejected, pull with rebase and push again.
