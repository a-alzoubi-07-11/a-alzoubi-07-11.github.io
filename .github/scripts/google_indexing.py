#!/usr/bin/env python3
"""Inspect ordinary pages and submit their sitemap through Search Console.

The URL Inspection API is read-only. Sitemap acceptance is never reported as
page indexing. API failures and unchecked pages remain unknown, never indexed.
"""
import concurrent.futures
import csv
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

SITE = 'https://gidsnederland.nl'
SITEMAP = SITE + '/sitemap.xml'
INSPECT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'docs/indexing'


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def sitemap_entries(text):
    root = ET.fromstring(text)
    if root.tag.rsplit('}', 1)[-1] != 'urlset':
        raise ValueError('Expected a URL sitemap, not a sitemap index')
    result = {}
    for node in root:
        fields = {x.tag.rsplit('}', 1)[-1]: (x.text or '').strip() for x in node}
        url = fields.get('loc', '')
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme != 'https' or parsed.netloc != 'gidsnederland.nl' or parsed.query or parsed.fragment:
            raise ValueError('Sitemap contains an unexpected URL')
        result[url] = fields.get('lastmod', '')
    return result


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.in_title = False
        self.robots = ''
        self.canonical = ''

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if tag == 'meta' and (a.get('name') or '').lower() in ('robots', 'googlebot'):
            self.robots += ',' + (a.get('content') or '').lower()
        if tag == 'link' and 'canonical' in (a.get('rel') or '').lower().split():
            self.canonical = a.get('href') or ''

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def local_metadata(url, root=ROOT):
    relative = urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip('/')
    path = (root / (relative + 'index.html' if not relative or relative.endswith('/') else relative)).resolve()
    if not path.is_relative_to(root.resolve()) or not path.is_file():
        return {'title': '', 'local_issues': ['missing local page'], 'excluded': False}
    m = Metadata()
    m.feed(path.read_text(encoding='utf-8'))
    issues = []
    excluded = 'noindex' in m.robots.split(',') or any(x.strip() == 'noindex' for x in m.robots.split(','))
    if excluded:
        issues.append('intentional noindex: do not request indexing')
    if not m.canonical:
        issues.append('missing canonical')
    elif urllib.parse.urljoin(url, m.canonical) != url:
        issues.append('canonical points to another URL')
    return {'title': m.title.strip(), 'local_issues': issues, 'excluded': excluded}


def inspect_one(session, url, prop):
    base = {'url': url, 'status': 'unknown', 'checked_at': now()}
    for attempt in range(3):
        try:
            response = session.post(INSPECT, json={'inspectionUrl': url, 'siteUrl': prop}, timeout=(10, 45))
            code = response.status_code
            if code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(min(20, 2 ** (attempt + 1)))
                continue
            if code != 200:
                return {**base, 'error': f'HTTP {code}', 'http_status': code}
            inspection = response.json().get('inspectionResult', {})
            state = inspection.get('indexStatusResult', {})
            verdict = state.get('verdict')
            status = 'indexed' if verdict == 'PASS' else 'not_indexed' if verdict in ('FAIL', 'NEUTRAL') else 'unknown'
            row = {**base, 'status': status, 'verdict': verdict, 'state': state.get('coverageState'),
                   'last_crawl': state.get('lastCrawlTime'), 'google_canonical': state.get('googleCanonical'),
                   'user_canonical': state.get('userCanonical'), 'robots_state': state.get('robotsTxtState'),
                   'indexing_state': state.get('indexingState'), 'fetch_state': state.get('pageFetchState'),
                   'inspection_link': inspection.get('inspectionResultLink')}
            if status == 'unknown':
                row['error'] = 'Inspection returned no conclusive verdict'
            return row
        except Exception as exc:
            if attempt == 2:
                return {**base, 'error': type(exc).__name__}
            time.sleep(2 ** (attempt + 1))


def inspect_urls(session, urls, prop, limit=400):
    rows = []
    halted = False
    for i, url in enumerate(urls):
        if halted or i >= min(max(limit, 0), 1800):
            rows.append({'url': url, 'status': 'unknown', 'error': 'Authorization/quota stopped inspection' if halted else 'Inspection limit reached'})
            continue
        row = inspect_one(session, url, prop)
        rows.append(row)
        halted = row.get('http_status') in (401, 403, 429)
    pending = [r for r in rows if r['status'] == 'not_indexed']
    errors = [r for r in rows if r['status'] == 'unknown']
    return {'status': 'partial' if errors else 'ok', 'checked': sum('checked_at' in r for r in rows),
            'total': len(rows), 'indexed': sum(r['status'] == 'indexed' for r in rows),
            'not_indexed': pending, 'errors': errors, 'records': rows}


def request_text(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'GidsNederlandIndexMonitor/1.0 (+https://gidsnederland.nl/)'})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.status, response.geturl(), response.headers, response.read(4_000_000).decode('utf-8', 'replace')


def live_audit(url):
    issues = []
    try:
        code, final, headers, text = request_text(url)
        if code != 200:
            issues.append(f'HTTP {code}')
        if final != url:
            issues.append('redirects to ' + final)
        if 'noindex' in headers.get('X-Robots-Tag', '').lower():
            issues.append('HTTP X-Robots-Tag noindex')
        m = Metadata()
        m.feed(text)
        if 'noindex' in m.robots:
            issues.append('live meta noindex')
        if not m.canonical or urllib.parse.urljoin(url, m.canonical) != url:
            issues.append('live canonical missing or different')
    except Exception as exc:
        issues.append('Live check failed: ' + type(exc).__name__)
    return url, issues


def submit_sitemap(session, prop, entries, previous, current_time=None):
    timestamp = current_time or now()
    digest = hashlib.sha256(json.dumps(sorted(entries.items()), ensure_ascii=False).encode()).hexdigest()
    last = previous.get('submitted_at')
    recent = False
    if last:
        try:
            recent = dt.datetime.fromisoformat(timestamp) - dt.datetime.fromisoformat(last) < dt.timedelta(days=7)
        except ValueError:
            pass
    if previous.get('digest') == digest and recent:
        return {'status': 'cooldown', 'last_success': previous, 'note': 'Unchanged sitemap already accepted; no repeated submission needed.'}
    try:
        code, _, _, live = request_text(SITEMAP)
        if code != 200 or sitemap_entries(live) != entries:
            return {'status': 'waiting_for_deploy', 'note': 'Live sitemap differs from the checked repository version.'}
        endpoint = ('https://www.googleapis.com/webmasters/v3/sites/' + urllib.parse.quote(prop, safe='') +
                    '/sitemaps/' + urllib.parse.quote(SITEMAP, safe=''))
        response = session.put(endpoint, timeout=(10, 45))
        if response.status_code not in (200, 204):
            return {'status': 'error', 'error': f'HTTP {response.status_code}',
                    'note': 'Check that the service account has full-user/owner access to this Search Console property.'}
        return {'status': 'submitted', 'last_success': {'digest': digest, 'submitted_at': timestamp, 'url': SITEMAP},
                'note': 'Google accepted the sitemap submission. This does not confirm page indexing.'}
    except Exception as exc:
        return {'status': 'error', 'error': type(exc).__name__}


def load_json(path, default):
    return json.loads(path.read_text(encoding='utf-8')) if path.is_file() else default


def write_reports(report, state, output=OUTPUT):
    output.mkdir(parents=True, exist_ok=True)
    for name, data in [('report.json', report), ('state.json', state)]:
        (output / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    history = load_json(output / 'history.json', [])
    history = [h for h in history if h['checked_at'][:10] != report['checked_at'][:10]]
    history.append({k: report[k] for k in ('checked_at', 'total', 'indexed', 'pending', 'unknown', 'all_indexed')})
    (output / 'history.json').write_text(json.dumps(history[-90:], indent=2) + '\n', encoding='utf-8')
    with (output / 'pending.csv').open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['url', 'title', 'status', 'state', 'last_crawl', 'checked_at', 'issues', 'inspection_link'])
        writer.writeheader()
        for r in report['records']:
            if r['status'] == 'indexed' or r.get('excluded'):
                continue
            writer.writerow({**{k: r.get(k, '') for k in writer.fieldnames}, 'issues': '; '.join(r.get('local_issues', []) + r.get('live_issues', [])) + ('; ' + r['error'] if r.get('error') else '')})
    lines = [f"# Google indexing follow-up — {report['checked_at']}", '',
             f"- Eligible URLs: {report['total']}", f"- Confirmed indexed: {report['indexed']}",
             f"- Confirmed not indexed: {report['pending']}", f"- Unknown / API failures / unchecked: {report['unknown']}",
             f"- Intentionally excluded (noindex): {report['excluded']}",
             f"- All eligible URLs confirmed indexed: {report['all_indexed']}",
             f"- Sitemap submission: {report['submission']['status']}",
             f"- Newly indexed: {len(report['newly_indexed'])}; lost indexing: {len(report['lost_indexing'])}", '',
             'Sitemap submission is discovery, not a guarantee of indexing. Ordinary articles cannot use the Google Indexing API.',
             'No dates, page content, appeal-letter tools, or intentional noindex directives are changed by this workflow.', '',
             '## Remaining URLs (complete list)', '', '| Page | Google state / error | Technical issues |', '|---|---|---|']
    for r in report['records']:
        if r['status'] != 'indexed' and not r.get('excluded'):
            issues = '; '.join(r.get('local_issues', []) + r.get('live_issues', [])) or 'No obvious HTTP/meta/canonical blocker; review content and internal links.'
            label = (r.get('title') or r['url']).replace('|', ' ')
            reason = str(r.get('state') or r.get('error') or 'unknown').replace('|', ' ')
            lines.append(f"| [{label}]({r['url']}) | {reason} | {issues.replace('|', ' ')} |")
    if report.get('error'):
        lines += ['', 'Configuration/API error: ' + report['error']]
    if report['submission'].get('error'):
        lines += ['', 'Sitemap submission error: ' + report['submission']['error']]
    text = '\n'.join(lines) + '\n'
    (output / 'REPORT.md').write_text(text, encoding='utf-8')
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf-8') as handle:
            handle.write(text)
    print(text)


def main():
    entries = sitemap_entries((ROOT / 'sitemap.xml').read_text(encoding='utf-8'))
    previous = load_json(OUTPUT / 'state.json', {})
    metadata = {url: local_metadata(url) for url in entries}
    urls = [url for url in entries if not metadata[url]['excluded']]
    report = {'checked_at': now(), 'total': len(urls), 'excluded': len(entries) - len(urls), 'error': None}
    submission = {'status': 'not_attempted'}
    try:
        raw = os.environ.get('GSC_SERVICE_ACCOUNT_JSON', '').strip()
        if not raw:
            raise ValueError('GSC_SERVICE_ACCOUNT_JSON is not configured')
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
        credentials = service_account.Credentials.from_service_account_info(json.loads(raw), scopes=['https://www.googleapis.com/auth/webmasters'])
        session = AuthorizedSession(credentials)
        prop = os.environ.get('GSC_PROPERTY', SITE + '/')
        result = inspect_urls(session, urls, prop, int(os.environ.get('GSC_LIMIT', '400')))
        # Never submit a sitemap containing intentionally non-indexable pages.
        submission = submit_sitemap(session, prop, entries, previous.get('submission', {})) if not report['excluded'] else {'status': 'blocked', 'note': 'Remove intentional noindex URLs from sitemap first.'}
    except Exception as exc:
        report['error'] = 'GSC_SERVICE_ACCOUNT_JSON is not configured' if not os.environ.get('GSC_SERVICE_ACCOUNT_JSON', '').strip() else type(exc).__name__
        result = {'records': [{'url': url, 'status': 'unknown', 'error': report['error']} for url in urls]}
    records = [{**r, **metadata[r['url']]} for r in result['records']]
    pending = [r['url'] for r in records if r['status'] == 'not_indexed']
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        live = dict(pool.map(live_audit, pending))
    for row in records:
        row['live_issues'] = live.get(row['url'], [])
    current = {r['url']: r['status'] for r in records}
    before = previous.get('statuses', {})
    report.update(indexed=sum(r['status'] == 'indexed' for r in records), pending=len(pending),
                  unknown=sum(r['status'] == 'unknown' for r in records), records=records, submission=submission,
                  newly_indexed=[u for u, s in current.items() if s == 'indexed' and before.get(u) == 'not_indexed'],
                  lost_indexing=[u for u, s in current.items() if s == 'not_indexed' and before.get(u) == 'indexed'])
    report['all_indexed'] = bool(urls) and report['indexed'] == len(urls) and report['unknown'] == 0 and report['excluded'] == 0
    state = {'submission': submission.get('last_success', previous.get('submission', {})), 'statuses': current}
    write_reports(report, state)
    return int(bool(report['unknown'] or report['error'] or submission['status'] in ('error', 'blocked', 'waiting_for_deploy')))


if __name__ == '__main__':
    raise SystemExit(main())
