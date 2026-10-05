#!/usr/bin/env python3
"""Builds /llms.txt (https://llmstxt.org) from assets/search-index.json so AI assistants can find and cite our guides."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
SITE = 'https://gidsnederland.nl'
items = json.loads((ROOT / 'assets/search-index.json').read_text(encoding='utf-8'))['items']
def section(lang, kind):
    rows = {}
    for e in items:
        if e['l'] == lang and e['y'] == kind:
            rows.setdefault(e.get('c') or ('أخرى' if lang == 'ar' else 'Overig'), []).append(e)
    out = []
    for cat in sorted(rows):
        out.append(f'\n### {cat}\n')
        for e in sorted(rows[cat], key=lambda x: x['t']):
            d = e['d'].replace('\n', ' ').strip()
            out.append(f"- [{e['t']}]({SITE}{e['u']}): {d[:220]}")
    return '\n'.join(out)
txt = f"""# Gids Nederland — دليل هولندا بالعربية

> Independent bilingual (Arabic / Dutch) guides to life in the Netherlands: benefits and allowances (toeslagen), work and sick pay, residence and family reunification (IND), housing and tenant rights, taxes, education and integration. Every guide links to the official Dutch government sources (Rijksoverheid, Belastingdienst, UWV, SVB, IND, DUO) and shows the date it was last checked. Figures that are proposals or not yet final are marked as such. Worked examples are illustrative, not real people.

Publisher: Ahmad Alzoubi (independent, not a government body). Content is informational, not legal or financial advice; always verify with the official source. Each Arabic page has a Dutch twin under /nl/.

## Arabic guides (العربية)
{section('ar', 'guide')}

## Dutch guides (Nederlands)
{section('nl', 'guide')}

## Optional
- [All articles (AR)]({SITE}/articles.html)
- [Alle artikelen (NL)]({SITE}/nl/articles.html)
- [Calculators / Rekentools]({SITE}/tools.html)
- [Editorial policy]({SITE}/editorial-policy.html)
- [About]({SITE}/about.html)
- [Sitemap]({SITE}/sitemap.xml)
"""
p = ROOT / 'llms.txt'
if not p.exists() or p.read_text(encoding='utf-8') != txt:
    p.write_text(txt, encoding='utf-8'); print('wrote llms.txt')
