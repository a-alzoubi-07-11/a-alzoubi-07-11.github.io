#!/usr/bin/env python3
"""Builds Atom feeds of the newest/updated guides: /feed.xml (Arabic) and /nl/feed.xml (Dutch).
Used by Google News Publisher Center, Google Discover "follow", feed readers and other search engines.
Data: assets/search-index.json (title, description, url) + datePublished/dateModified in each page's JSON-LD."""
import json, pathlib, re
from xml.sax.saxutils import escape
ROOT = pathlib.Path(__file__).resolve().parents[2]
SITE = 'https://gidsnederland.nl'
items = json.loads((ROOT / 'assets/search-index.json').read_text(encoding='utf-8'))['items']
META = {'ar': ('دليل هولندا بالعربية — أحدث الأدلة', 'أدلة عملية بالعربية عن الحياة في هولندا مع المصادر الرسمية.', '/', '/feed.xml'),
        'nl': ('Gids Nederland — nieuwste gidsen', 'Praktische gidsen over leven in Nederland, met officiële bronnen.', '/nl/', '/nl/feed.xml')}
def dates(u):
    p = ROOT / u.lstrip('/')
    if not p.exists(): return None, None
    s = p.read_text(encoding='utf-8', errors='ignore')
    pub = re.search(r'"datePublished":\s*"([0-9-]{10})', s); mod = re.search(r'"dateModified":\s*"([0-9-]{10})', s)
    pub = pub.group(1) if pub else None
    return pub, (mod.group(1) if mod else pub)
for lang, (title, sub, home, path) in META.items():
    rows = []
    for e in items:
        if e['l'] != lang or e['y'] != 'guide': continue
        pub, mod = dates(e['u'])
        if pub: rows.append((mod, pub, e))
    rows.sort(key=lambda r: (r[0], r[1]), reverse=True)
    rows = rows[:40]
    updated = rows[0][0] if rows else '2026-01-01'
    out = ['<?xml version="1.0" encoding="utf-8"?>',
           f'<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="{lang}">',
           f'<title>{escape(title)}</title><subtitle>{escape(sub)}</subtitle>',
           f'<link href="{SITE}{home}"/><link rel="self" type="application/atom+xml" href="{SITE}{path}"/>',
           f'<id>{SITE}{path}</id><updated>{updated}T08:00:00+01:00</updated>',
           '<author><name>Ahmad Alzoubi</name><uri>https://gidsnederland.nl/about.html</uri></author>',
           f'<icon>{SITE}/assets/apple-touch-icon.png</icon><logo>{SITE}/assets/og-home.png</logo>']
    for mod, pub, e in rows:
        url = SITE + e['u']
        out.append(f'<entry><title>{escape(e["t"])}</title><link href="{url}"/><id>{url}</id>'
                   f'<published>{pub}T08:00:00+01:00</published><updated>{mod}T08:00:00+01:00</updated>'
                   + (f'<category term="{escape(e["c"])}"/>' if e.get('c') else '')
                   + f'<summary>{escape(e["d"])}</summary></entry>')
    out.append('</feed>')
    txt = '\n'.join(out) + '\n'
    p = ROOT / path.lstrip('/')
    if not p.exists() or p.read_text(encoding='utf-8') != txt:
        p.write_text(txt, encoding='utf-8'); print('wrote', p.relative_to(ROOT), len(rows), 'entries')
