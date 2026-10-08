#!/usr/bin/env python3
"""Print a ready-to-paste list of NEW public URLs (AR + NL) for manual indexing requests.

Usage: python3 tools/indexing_list.py [since]    # since = git date/ref, default "3 days ago"
Lists html files ADDED since then (not edits), as full https://gidsnederland.nl URLs, plus the sitemap URL.
Every content run must end by giving this list to the owner (he forwards it to ChatGPT for Search Console / Bing).
"""
import subprocess, sys
since = sys.argv[1] if len(sys.argv) > 1 else '3 days ago'
out = subprocess.run(['git', 'log', f'--since={since}', '--diff-filter=A', '--name-only', '--pretty=format:'],
                     capture_output=True, text=True).stdout.split()
SKIP = ('categories/', 'docs/', 'tools/', 'google', '404.html', 'refresh.html')
seen, urls = set(), []
for f in out:
    if not f.endswith('.html') or f.startswith(SKIP) or f.startswith('nl/categories') or f in seen:
        continue
    seen.add(f)
    urls.append('https://gidsnederland.nl/' + f[:-10] if f.endswith('index.html') else 'https://gidsnederland.nl/' + f)
urls.sort(key=lambda u: ('/nl/' in u, u))
print('\n'.join(urls))
print('\nSitemap: https://gidsnederland.nl/sitemap.xml')
