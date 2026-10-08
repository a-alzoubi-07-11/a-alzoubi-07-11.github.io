"""Build a standalone (non-article) page in the site's shell, AR or NL.

Usage from Python:
    from build_page import page
    page(lang='ar', path='calculators/zorgtoeslag.html', twin='nl/calculators/zorgtoeslag.html',
         title='...', desc='...', main='<main id="content" ...>...</main>',
         head_extra='<link rel="stylesheet" href="/assets/calc.css?v=1"><script src="/assets/x.js?v=1" defer></script>',
         jsonld={...} or [..])

The shell (consent, AdSense, header, footer, site-chrome) is copied from tools.html / nl/tools.html
so new pages always match the live design. Paths are repo-relative without a leading slash.
"""
import json, os, re

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://gidsnederland.nl'


def _url(p):
    return SITE + '/' + p


def page(lang, path, twin, title, desc, main, head_extra='', jsonld=None, og_type='website'):
    src = 'tools.html' if lang == 'ar' else 'nl/tools.html'
    s = open(os.path.join(REPO, src), encoding='utf-8').read()
    brand = 'دليل هولندا بالعربية' if lang == 'ar' else 'Nederlandsgids'
    m = re.search(r'<title>[^<]*\| ([^<]+)</title>', s)
    if m:
        brand = m.group(1)
    full = f'{title} | {brand}'
    esc = lambda x: x.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
    s = re.sub(r'<title>[^<]*</title>', f'<title>{esc(full)}</title>', s, 1)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(desc)}">', s, 1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(full)}">', s, 1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{esc(desc)}">', s, 1)
    s = re.sub(r'<meta property="og:type" content="[^"]*">', f'<meta property="og:type" content="{og_type}">', s, 1)
    s = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{_url(path)}">', s, 1)
    ar_p, nl_p = (path, twin) if lang == 'ar' else (twin, path)
    links = (f'<link rel="canonical" href="{_url(path)}"><link rel="alternate" hreflang="ar" href="{_url(ar_p)}">'
             f'<link rel="alternate" hreflang="nl" href="{_url(nl_p)}"><link rel="alternate" hreflang="x-default" href="{_url(ar_p)}">')
    s = re.sub(r'<link rel="canonical"[^>]*>(<link rel="alternate"[^>]*>)*', links, s, 1)
    # drop tool-page-only assets, add the page's own
    s = re.sub(r'<link rel="stylesheet" href="/assets/tools\.css[^"]*">', '', s)
    s = re.sub(r'<script src="/assets/(salary-model|tools)\.js[^"]*"[^>]*></script>', '', s)
    if jsonld:
        head_extra += '<script type="application/ld+json">' + json.dumps(jsonld, ensure_ascii=False) + '</script>'
    s = s.replace('</head>', head_extra + '\n</head>', 1)
    # language switch button → twin
    s = re.sub(r'(<a class="lang-button" href=")[^"]*(")', lambda m_: m_.group(1) + _url(twin) + m_.group(2), s, 1)
    i, j = s.index('<main'), s.index('</main>') + len('</main>')
    s = s[:i] + main + s[j:]
    out = os.path.join(REPO, path)
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    open(out, 'w', encoding='utf-8').write(s)
    return out
