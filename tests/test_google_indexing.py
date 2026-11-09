import csv
import datetime as dt
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.github/scripts'))
import google_indexing as g

URL = g.SITE + '/articles/example.html'
XML = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + URL + '</loc><lastmod>2026-11-01</lastmod></url></urlset>'


def response(code=200, verdict='PASS'):
    return Mock(status_code=code, json=Mock(return_value={'inspectionResult': {
        'indexStatusResult': {'verdict': verdict, 'coverageState': 'state'},
        'inspectionResultLink': 'https://search.google.com/search-console/inspect'}}))


class InspectionTests(unittest.TestCase):
    def test_http_failures_are_never_counted_as_indexed(self):
        session = Mock()
        session.post.side_effect = [response(), response(verdict='NEUTRAL'), response(403)]
        result = g.inspect_urls(session, [URL + str(i) for i in range(4)], g.SITE + '/')
        self.assertEqual(result['indexed'], 1)
        self.assertEqual(len(result['not_indexed']), 1)
        self.assertEqual(len(result['errors']), 2)
        self.assertEqual(result['status'], 'partial')
        self.assertEqual(session.post.call_count, 3)  # no repeated unauthorized calls

    def test_empty_success_body_is_unknown(self):
        session = Mock()
        session.post.return_value = Mock(status_code=200, json=Mock(return_value={}))
        self.assertEqual(g.inspect_one(session, URL, g.SITE)['status'], 'unknown')

    def test_limit_does_not_hide_unchecked_pages(self):
        session = Mock()
        session.post.return_value = response()
        result = g.inspect_urls(session, [URL, URL + '2'], g.SITE, limit=1)
        self.assertEqual(result['indexed'], 1)
        self.assertEqual(result['total'], 2)
        self.assertEqual(len(result['errors']), 1)

    @patch.object(g.time, 'sleep')
    def test_temporary_errors_retry_without_logging_response_body(self, sleep):
        session = Mock()
        session.post.side_effect = [response(503), response()]
        self.assertEqual(g.inspect_one(session, URL, g.SITE)['status'], 'indexed')
        self.assertEqual(session.post.call_count, 2)
        self.assertIn('timeout', session.post.call_args.kwargs)

    @patch.object(g.time, 'sleep')
    def test_transport_error_hides_private_exception_text(self, sleep):
        session = Mock()
        session.post.side_effect = RuntimeError('private credential response')
        result = g.inspect_one(session, URL, g.SITE)
        self.assertEqual(result['status'], 'unknown')
        self.assertNotIn('private credential', json.dumps(result))


class SitemapTests(unittest.TestCase):
    def test_sitemap_is_parsed_and_other_hosts_are_rejected(self):
        self.assertEqual(g.sitemap_entries(XML), {URL: '2026-11-01'})
        with self.assertRaises(ValueError):
            g.sitemap_entries(XML.replace('gidsnederland.nl', 'other.example'))

    @patch.object(g, 'request_text', return_value=(200, g.SITEMAP, {}, XML))
    def test_accepted_submission_is_not_an_indexing_claim(self, live):
        session = Mock()
        session.put.return_value = Mock(status_code=204)
        result = g.submit_sitemap(session, g.SITE + '/', g.sitemap_entries(XML), {}, '2026-11-09T00:00:00+00:00')
        self.assertEqual(result['status'], 'submitted')
        self.assertNotIn('indexed', result['last_success'])
        self.assertIn('https%3A%2F%2Fgidsnederland.nl%2F', session.put.call_args.args[0])
        again = g.submit_sitemap(session, g.SITE + '/', g.sitemap_entries(XML), result['last_success'], '2026-11-10T00:00:00+00:00')
        self.assertEqual(again['status'], 'cooldown')
        self.assertEqual(session.put.call_count, 1)
        week = g.submit_sitemap(session, g.SITE + '/', g.sitemap_entries(XML), result['last_success'], '2026-11-16T00:00:00+00:00')
        self.assertEqual(week['status'], 'submitted')
        changed = g.submit_sitemap(session, g.SITE + '/', g.sitemap_entries(XML.replace('2026-11-01', '2026-11-02')), result['last_success'], '2026-11-10T00:00:00+00:00')
        self.assertEqual(changed['status'], 'waiting_for_deploy')

    @patch.object(g, 'request_text', return_value=(200, g.SITEMAP, {}, XML))
    def test_forbidden_submission_does_not_claim_success_or_reset_cooldown(self, live):
        session = Mock()
        session.put.return_value = Mock(status_code=403)
        result = g.submit_sitemap(session, g.SITE, g.sitemap_entries(XML), {})
        self.assertEqual(result['status'], 'error')
        self.assertNotIn('last_success', result)

    def test_noindex_and_wrong_canonical_are_preserved_as_diagnostics(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'articles').mkdir()
            (root / 'articles/example.html').write_text('<title>Example</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="https://gidsnederland.nl/">')
            result = g.local_metadata(URL, root)
            self.assertTrue(result['excluded'])
            self.assertIn('canonical points to another URL', result['local_issues'])
            self.assertEqual(result['title'], 'Example')

    def test_report_keeps_every_pending_url_and_unknown(self):
        rows = [{'url': URL + str(i), 'title': 'Example', 'status': 'not_indexed', 'state': 'Discovered'} for i in range(47)]
        rows.append({'url': URL + 'unknown', 'status': 'unknown', 'error': 'HTTP 403'})
        report = {'checked_at': '2026-11-09T00:00:00+00:00', 'total': 48, 'indexed': 0,
                  'pending': 47, 'unknown': 1, 'excluded': 0, 'all_indexed': False, 'records': rows,
                  'submission': {'status': 'submitted'}, 'newly_indexed': [], 'lost_indexing': []}
        with tempfile.TemporaryDirectory() as directory, patch.dict('os.environ', {'GITHUB_STEP_SUMMARY': ''}), patch('builtins.print'):
            root = Path(directory)
            g.write_reports(report, {}, root)
            with (root / 'pending.csv').open() as handle:
                self.assertEqual(len(list(csv.DictReader(handle))), 48)
            self.assertIn(URL + '46', (root / 'REPORT.md').read_text())
            self.assertFalse(json.loads((root / 'report.json').read_text())['all_indexed'])


if __name__ == '__main__':
    unittest.main()
