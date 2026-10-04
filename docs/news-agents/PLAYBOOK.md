# Daily news agents: playbook for the news ticker

This file tells the daily AI run how to update `assets/news-ticker.json`. The file
drives the "موجز هولندا للمهاجرين" ticker on the home page. Follow it exactly.

## Goal

Every day, check the sources below for news that matters to Arabic-speaking
newcomers in the Netherlands. Add what is new and keep what is still current. When
nothing new is found, keep the existing items and only refresh the check timestamps.

## Sources and the five agents

There are two kinds of sources:

- **official** (government bodies): statuses `confirmed`, `announced` or `proposed`.
- **media** (fast news outlets that usually report first): status is always `reported`.
  The ticker then shows "حسب وسائل الإعلام / Volgens media".

| Code | Tier | Source | Where to look first |
|---|---|---|---|
| BZK | official | Ministerie van Binnenlandse Zaken en Koninkrijksrelaties | https://www.rijksoverheid.nl/ministeries/ministerie-van-binnenlandse-zaken-en-koninkrijksrelaties ("Nieuws" block + "Meer nieuws", which filters rijksoverheid.nl/actueel/nieuws by ministry) |
| SZW | official | Ministerie van Sociale Zaken en Werkgelegenheid | https://www.rijksoverheid.nl/ministeries/ministerie-van-sociale-zaken-en-werkgelegenheid (same pattern) |
| IND | official | Immigratie- en Naturalisatiedienst | https://ind.nl/nl/nieuws |
| DUO | official | Dienst Uitvoering Onderwijs | https://duo.nl/particulier/ (items under `/particulier/home/actueel/...`); search `site:duo.nl nieuws`. Often "no-change" |
| UWV | official | Uitvoeringsinstituut Werknemersverzekeringen | https://www.uwv.nl/nl/actueel |
| SVB | official | Sociale Verzekeringsbank (kinderbijslag, AOW) | https://www.svb.nl/nl/pers-en-nieuws/nieuws |
| TOESLAGEN | official | Dienst Toeslagen / Belastingdienst | https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/berichten/nieuws |
| TK | official | Tweede Kamer (votes, adopted motions and bills) | https://www.tweedekamer.nl/nieuws |
| STAB | official | Officiële bekendmakingen (Staatsblad/Staatscourant: when a law or rule is formally published) | https://zoek.officielebekendmakingen.nl (search recent Staatsblad items on the topics below) |
| NOS | media | NOS | RSS https://feeds.nos.nl/nosnieuwspolitiek and https://feeds.nos.nl/nosnieuwsbinnenland |
| NU | media | NU.nl | https://www.nu.nl/politiek (or its RSS feed) |
| RTL | media | RTL Nieuws | https://www.rtl.nl/nieuws/politiek |

Run five agents in parallel (Agent tool), one per group:

1. **Ministries:** BZK, SZW.
2. **Migration and education:** IND, DUO.
3. **Money and benefits:** UWV, SVB, TOESLAGEN.
4. **Parliament and law gazette:** TK, STAB.
5. **Fast media:** NOS, NU, RTL. These usually report first, for example on budget deals,
   votes and leaked plans.

Each agent returns **candidates**: source code, title, publication date (YYYY-MM-DD), URL,
and 2–3 sentences of facts read on the item page itself.

Official sites change their URLs. If a listing URL returns 404, find the new one with a
search, use it, and update the table above in the same commit.

Use Firecrawl (`firecrawl_scrape` / `firecrawl_search` with `includeDomains`) when it is
available, otherwise WebFetch/WebSearch. The shell usually cannot reach these sites.

## Selection rules (editor step)

1. **Known sources only.** The URL must be on the host of the item's source code (the
   validator enforces this). Never use blogs, social media posts or other outlets.
   **Media items:** only about rules, money, deadlines or procedures that affect
   residents (not party politics or gossip); the summary starts with "وفق NOS:" /
   "Volgens NOS:" (or NU.nl / RTL) and says what is not official yet. As soon as an
   official source publishes the same news, replace the media item with the official one.
2. **Recent.** Published within the last 60 days. The validator removes older items.
3. **Relevant for newcomers.** Prefer residence, asylum, family reunification,
   naturalisation, civic integration, study finance, work, wages, benefits, allowances,
   housing and rent, healthcare costs, energy support, and deadlines. Skip appointments of
   officials, items only for the Caribbean Netherlands, internal reports, and business
   newsletters with no effect on individuals.
4. **At most 2 per source, 3 media items, 10 in total.** The newest relevant items win.
5. **Never invent.** Every date, amount and deadline in a summary must appear on the
   source page you opened. If you cannot open the page, do not add the item.
6. **Status (official sources):** `confirmed` = a decision or law that is in force or adopted with a fixed
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
python3 .github/scripts/site_guard.py                     # must exit 0 (protects the whole site)
git add assets/news-ticker.json docs/news-agents/PLAYBOOK.md
git commit -m "News ticker: daily official check YYYY-MM-DD (new: N)"
git push origin main
```

Commit even when no item changed: the new `updatedAt` shows readers that the check ran.
Do not touch any other file. If a push is rejected, pull with rebase and push again.
