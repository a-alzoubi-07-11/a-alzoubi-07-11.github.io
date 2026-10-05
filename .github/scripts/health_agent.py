#!/usr/bin/env python3
"""Site health agent: external links, live buttons/menus, and Google/Bing index status.
Writes docs/health/report.json + docs/health/REPORT.md. Exit 1 when something is broken."""
import concurrent.futures as cf, glob, json, os, re, sys, time, datetime, urllib.parse
import requests

SITE = os.environ.get('HEALTH_SITE', 'https://gidsnederland.nl')
UA = {'User-Agent': 'Mozilla/5.0 (compatible; GidsNederlandHealthBot/1.0; +https://gidsnederland.nl/)',
      'Accept-Language': 'nl,en;q=0.8'}
BOT_BLOCK = (401, 403, 405, 406, 429, 999)          # site refuses bots; not treated as broken
SKIP_HOSTS = ('instagram.com', 'tiktok.com', 'facebook.com', 'linkedin.com', 'x.com', 'twitter.com')
out = {'checked_at': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')}

def pages():
    return [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith(('.git', 'node_modules', 'docs/'))]

# ---------- 1. external links ----------
def external_links():
    where = {}
    for f in pages():
        for u in re.findall(r'href="(https?://[^"]+)"', open(f, encoding='utf-8').read()):
            u = u.replace('&amp;', '&')
            if 'gidsnederland.nl' in u or any(h in u for h in SKIP_HOSTS):
                continue
            where.setdefault(u, set()).add(f)
    return where

def probe(u):
    for attempt in range(2):
        try:
            r = requests.head(u, headers=UA, timeout=20, allow_redirects=True)
            if r.status_code in (405, 404, 403) or r.status_code >= 500:
                r = requests.get(u, headers=UA, timeout=25, allow_redirects=True, stream=True)
            final = r.url
            code = r.status_code
            soft404 = False
            if code == 200 and 'text/html' in r.headers.get('content-type', ''):
                try:
                    body = r.raw.read(60000, decode_content=True).decode('utf-8', 'ignore').lower() if not r.request.method == 'HEAD' else ''
                except Exception:
                    body = ''
                soft404 = bool(re.search(r'<title>[^<]*(pagina niet gevonden|page not found|404)[^<]*</title>', body))
            return {'url': u, 'code': code, 'final': final, 'soft404': soft404}
        except Exception as e:
            err = type(e).__name__
            time.sleep(3)
    return {'url': u, 'code': 0, 'final': None, 'error': err}

def check_external():
    where = external_links()
    with cf.ThreadPoolExecutor(12) as ex:
        res = list(ex.map(probe, sorted(where)))
    broken, blocked, moved = [], [], []
    for r in res:
        r['pages'] = sorted(where[r['url']])[:6]
        if r['code'] in BOT_BLOCK:
            blocked.append(r)
        elif r['code'] == 0:
            blocked.append(r)          # connection refused from CI IPs (e.g. cbr.nl); not proof of a dead page
        elif r['code'] >= 400 or r.get('soft404'):
            broken.append(r)
        elif r['final'] and r['final'].rstrip('/') != r['url'].rstrip('/') and urllib.parse.urlsplit(r['final']).path != urllib.parse.urlsplit(r['url']).path:
            moved.append(r)
    out['external'] = {'total': len(res), 'broken': broken, 'blocked': blocked, 'redirected': moved}

# ---------- 2. live buttons / menus / scripts ----------
BUTTON_JS = r'''
async (args) => {
  const res = {missing: [], errors: []};
  const need = args.need;
  for (const sel of need) if (!document.querySelector(sel)) res.missing.push(sel);
  // every link/button must have a target or a handler-ish attribute
  for (const a of document.querySelectorAll('a')) {
    const h = a.getAttribute('href');
    if (h === null || h === '' || h === '#') { if (!a.hasAttribute('data-cookie-settings') && !a.getAttribute('role')) res.errors.push('empty href: ' + (a.textContent||'').trim().slice(0,40)); }
  }
  for (const b of document.querySelectorAll('button')) {
    const r = b.getBoundingClientRect();
    if (b.offsetParent !== null && (r.width < 1 || r.height < 1)) res.errors.push('invisible button: ' + (b.textContent||'').trim().slice(0,40));
  }
  return res;
}'''

def check_buttons():
    from playwright.sync_api import sync_playwright
    targets = ['/', '/nl/', '/articles.html', '/nl/articles.html', '/tools.html', '/categories/benefits.html']
    arts = sorted(glob.glob('articles/*.html'))
    targets += ['/' + arts[i] for i in range(0, len(arts), max(1, len(arts) // 6))][:6]
    problems, internal_bad = [], set()
    with sync_playwright() as p:
        b = p.chromium.launch()
        for vp in ({'width': 390, 'height': 844}, {'width': 1280, 'height': 800}):
            ctx = b.new_context(viewport=vp)
            page = ctx.new_page()
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:160]))
            for t in targets:
                errs.clear()
                try:
                    r = page.goto(SITE + t, wait_until='load', timeout=45000)
                    page.wait_for_timeout(1200)
                    if not r or r.status >= 400:
                        problems.append({'page': t, 'viewport': vp['width'], 'issue': f'HTTP {r.status if r else "none"}'}); continue
                    sw = page.evaluate('document.documentElement.scrollWidth')
                    if sw > vp['width'] + 2:
                        problems.append({'page': t, 'viewport': vp['width'], 'issue': f'horizontal overflow {sw}px'})
                    rep = page.evaluate(BUTTON_JS, {'need': ['header', 'main', 'footer']})
                    for m in rep['missing']: problems.append({'page': t, 'viewport': vp['width'], 'issue': 'missing ' + m})
                    for e in rep['errors'][:5]: problems.append({'page': t, 'viewport': vp['width'], 'issue': e})
                    # search box works?
                    sb = page.query_selector('input[type=search]')
                    if sb and sb.is_visible():
                        sb.fill('toeslag'); page.wait_for_timeout(900)
                    # click every visible internal nav link once (HEAD on the live site)
                    for h in page.eval_on_selector_all('header a[href], nav a[href], footer a[href]', 'els=>els.map(e=>e.href)'):
                        if h.startswith(SITE): internal_bad.add(h.split('#')[0])
                except Exception as e:
                    problems.append({'page': t, 'viewport': vp['width'], 'issue': 'load failed: ' + type(e).__name__})
                for e in list(errs): problems.append({'page': t, 'viewport': vp['width'], 'issue': 'JS error: ' + e})
            ctx.close()
        b.close()
    dead = []
    for h in sorted(internal_bad):
        try:
            c = requests.head(h, headers=UA, timeout=20, allow_redirects=True).status_code
            if c >= 400: dead.append({'url': h, 'code': c})
        except Exception as e:
            dead.append({'url': h, 'code': 0})
    out['buttons'] = {'pages_tested': len(targets) * 2, 'problems': problems, 'dead_menu_links': dead}

# ---------- 3. Google / Bing index status ----------
def sitemap_urls():
    return re.findall(r'<loc>([^<]+)</loc>', open('sitemap.xml', encoding='utf-8').read())

def check_google(urls):
    raw = os.environ.get('GSC_SERVICE_ACCOUNT_JSON', '').strip()
    if not raw:
        return {'status': 'not_configured', 'how': 'Add repo secret GSC_SERVICE_ACCOUNT_JSON (service account added as user in Search Console).'}
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    creds = service_account.Credentials.from_service_account_info(json.loads(raw), scopes=['https://www.googleapis.com/auth/webmasters.readonly'])
    s = AuthorizedSession(creds)
    prop = os.environ.get('GSC_PROPERTY', 'sc-domain:gidsnederland.nl')
    res, not_indexed = {}, []
    for u in urls[:int(os.environ.get('GSC_LIMIT', '200'))]:     # API quota ~2000/day
        r = s.post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', json={'inspectionUrl': u, 'siteUrl': prop})
        if r.status_code != 200:
            res[u] = f'error {r.status_code}'; continue
        st = r.json().get('inspectionResult', {}).get('indexStatusResult', {})
        res[u] = st.get('coverageState', '?')
        if st.get('verdict') != 'PASS': not_indexed.append({'url': u, 'state': st.get('coverageState'), 'last_crawl': st.get('lastCrawlTime')})
    return {'status': 'ok', 'checked': len(res), 'indexed': len(res) - len(not_indexed), 'not_indexed': not_indexed}

def check_bing(urls):
    key = os.environ.get('BING_WEBMASTER_API_KEY', '').strip()
    if not key:
        return {'status': 'not_configured', 'how': 'Add repo secret BING_WEBMASTER_API_KEY (Bing Webmaster Tools > Settings > API access).'}
    not_indexed, n = [], 0
    for u in urls:
        r = requests.get('https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo', params={'apikey': key, 'siteUrl': SITE + '/', 'url': u}, timeout=30)
        n += 1
        if r.status_code != 200:
            not_indexed.append({'url': u, 'state': f'error {r.status_code}'}); continue
        d = r.json().get('d') or {}
        if not d.get('IsPage') and not d.get('LastCrawledDate'):
            not_indexed.append({'url': u, 'state': 'not crawled'})
    return {'status': 'ok', 'checked': n, 'indexed': n - len(not_indexed), 'not_indexed': not_indexed}

def check_index():
    urls = sitemap_urls()
    out['index'] = {'sitemap_urls': len(urls)}
    for name, fn in (('google', check_google), ('bing', check_bing)):
        try: out['index'][name] = fn(urls)
        except Exception as e: out['index'][name] = {'status': 'error', 'error': str(e)[:300]}

# ---------- report ----------
def report():
    e, b, i = out.get('external', {}), out.get('buttons', {}), out.get('index', {})
    L = [f"# Site health report — {out['checked_at']}", '',
         f"## External links: {e.get('total',0)} checked · {len(e.get('broken',[]))} broken · {len(e.get('redirected',[]))} redirected · {len(e.get('blocked',[]))} bot-blocked"]
    for r in e.get('broken', []): L.append(f"- BROKEN {r['code'] or r.get('error')} {r['url']}  (in {', '.join(r['pages'][:3])})")
    for r in e.get('redirected', []): L.append(f"- MOVED {r['url']} → {r['final']}")
    L += ['', f"## Buttons & menus: {b.get('pages_tested',0)} page views · {len(b.get('problems',[]))} problems · {len(b.get('dead_menu_links',[]))} dead menu links"]
    for p in b.get('problems', []): L.append(f"- {p['page']} @{p['viewport']}px: {p['issue']}")
    for d in b.get('dead_menu_links', []): L.append(f"- dead menu link {d['code']} {d['url']}")
    L += ['', f"## Index status ({i.get('sitemap_urls',0)} URLs in sitemap)"]
    for n in ('google', 'bing'):
        g = i.get(n, {})
        if g.get('status') == 'ok':
            L.append(f"- {n}: {g['indexed']}/{g['checked']} indexed")
            for x in g['not_indexed'][:40]: L.append(f"  - not indexed: {x['url']} ({x.get('state')})")
        else: L.append(f"- {n}: {g.get('status')} — {g.get('how') or g.get('error','')}")
    open('docs/health/REPORT.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    json.dump(out, open('docs/health/report.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1, default=list)
    print('\n'.join(L))
    bad = e.get('broken') or b.get('problems') or b.get('dead_menu_links')
    return 1 if bad else 0

# ---------- auto-fix (run with: health_agent.py fix) ----------
MANUAL = {  # known replacements for dead official pages
 'https://www.uwv.nl/particulieren/ontslag/ik-word-ontslagen/detail/ontslag-met-wederzijds-goedvinden-of-instemming/ontslag-met-wederzijds-goedvinden': 'https://www.uwv.nl/nl/ww/ww-na-ontslag',
 'https://www.rijksoverheid.nl/vraag-en-antwoord/mag-ik-met-mijn-buitenlandse-rijbewijs-in-nederland-aan-het-verkeer-deelnemen':
 'https://www.rijksoverheid.nl/vraag-en-antwoord/rijbewijs/mag-ik-met-mijn-buitenlandse-rijbewijs-in-nederland-aan-het-verkeer-deelnemen',
}
def safe_target(old, new):
    o, n = urllib.parse.urlsplit(old), urllib.parse.urlsplit(new)
    if not new or o.netloc.replace('www.', '') != n.netloc.replace('www.', ''): return False
    if re.search(r'not-supported|/home(/|$)|login|inloggen|error|404', n.path, re.I): return False
    if n.path.count('/') < 2 or (o.path.count('/') >= 3 and n.path.rstrip('/').count('/') < 2): return False
    if re.search(r'/\d{4}-\d{2}-\d{2}$', n.path): return False          # wetten.overheid dated versions
    return True

def autofix():
    rep = json.load(open('docs/health/report.json', encoding='utf-8'))
    pairs = dict(MANUAL)
    for r in rep.get('external', {}).get('redirected', []):
        if r['url'] not in pairs and safe_target(r['url'], r['final']): pairs[r['url']] = r['final']
    changed = set()
    for f in pages():
        s = open(f, encoding='utf-8').read(); t = s
        for a, b in pairs.items():
            t = t.replace(f'"{a}"', f'"{b}"')
        if t != s: open(f, 'w', encoding='utf-8').write(t); changed.add(f)
    print(f'autofix: {len(pairs)} replacements, {len(changed)} files changed')
    return changed

if __name__ == '__main__':
    if sys.argv[1:] == ['fix']:
        autofix(); sys.exit(0)
    parts = sys.argv[1:] or ['links', 'buttons', 'index']
    if 'links' in parts: check_external()
    if 'buttons' in parts: check_buttons()
    if 'index' in parts: check_index()
    sys.exit(report())


