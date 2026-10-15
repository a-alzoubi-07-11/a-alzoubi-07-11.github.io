#!/usr/bin/env python3
"""Merge in-article "أدلة مرتبطة" / "Gerelateerde gidsen" lists into the closing
"اقرأ أيضاً" / "Lees ook" box (section.related-guides), so a guide shows ONE related list.

Usage: python3 tools/articles/dedupe_related.py [page.html ...]   (default: all articles)
Idempotent. Called by run_batch.py after building pages.
"""
import glob, os, re, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HEAD = r'(?:أدلة مرتبطة|Gerelateerde gidsen)'
# template form: <section><h2><span>أدلة مرتبطة</span></h2><ul>…</ul></section>
TPL = re.compile(r'<section><h2><span>' + HEAD + r'</span></h2>(<ul>.*?</ul>)</section>', re.S)
# module form: <h2 id="related">أدلة مرتبطة</h2><ul>…</ul>
MOD = re.compile(r'<h2 id="related">' + HEAD + r'</h2>\s*(<ul>.*?</ul>)', re.S)
LI = re.compile(r'<li><a href="([^"]+)">(.*?)</a>.*?</li>', re.S)
BOX = re.compile(r'(<section class="related-guides"><h2>[^<]*</h2><ul>)(.*?)(</ul>)', re.S)
MAX = 6


def clean(label):
    return re.sub(r'</?span>', '', label).strip()


def fix(path):
    s = open(path, encoding='utf-8').read()
    box = BOX.search(s)
    if not box:
        return False
    extra = []
    for rx in (TPL, MOD):
        for m in rx.finditer(s):
            extra += LI.findall(m.group(1))
    if not extra:
        return False
    s = TPL.sub('', s)
    s = MOD.sub('', s)
    s = re.sub(r'<li><a href="#related">[^<]*</a></li>', '', s)  # drop TOC entry pointing at removed heading
    box = BOX.search(s)
    have = LI.findall(box.group(2))
    hrefs = {h for h, _ in have}
    me = '/' + os.path.relpath(path, REPO).replace(os.sep, '/')
    items = list(have)
    for h, t in extra:
        if h not in hrefs and h != me and len(items) < MAX:
            items.append((h, clean(t))); hrefs.add(h)
    ul = ''.join(f'<li><a href="{h}">{clean(t)}</a></li>' for h, t in items)
    s = s[:box.start(2)] + ul + s[box.end(2):]
    open(path, 'w', encoding='utf-8').write(s)
    return True


if __name__ == '__main__':
    files = sys.argv[1:] or glob.glob(f'{REPO}/articles/*.html') + glob.glob(f'{REPO}/nl/articles/*.html')
    n = sum(fix(f) for f in files)
    print(f'related lists merged in {n} page(s)')
