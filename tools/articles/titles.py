"""Short H1 for long guide titles: the part before the first colon becomes the H1,
the rest becomes a one-line subtitle under it (the table of contents and description carry the details).
The full title stays in the module (and in <title>/og via seo_title as before).

Run alone to apply to all existing guides:  python3 titles.py
"""
import glob, json, os, re, html as H

MAX = 80


def split_title(title):
    """('short', 'rest') when the title is long and has a colon, else (title, '')."""
    if len(title) <= MAX:
        return title, ''
    m = re.match(r'^(.{10,70}?)\s*[:：]\s*(.{12,})$', title)
    if not m:
        return title, ''
    rest = m.group(2).strip()
    return m.group(1).strip(), rest[:1].upper() + rest[1:]


H1 = re.compile(r'<h1><span>(.*?)</span></h1>(?:<p class="article-sub"><span>.*?</span></p>)?', re.S)


def apply(page, full_title):
    short, rest = split_title(full_title)
    esc = lambda s: H.escape(s, quote=False)
    new = f'<h1><span>{esc(short)}</span></h1>' + (f'<p class="article-sub"><span>{esc(rest)}</span></p>' if rest else '')
    page = H1.sub(lambda _: new, page, count=1)
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    if m:
        try:
            j = json.loads(m.group(1))
            for n in j.get('@graph', []):
                if n.get('@type') == 'Article':
                    n['headline'] = short       # structured data matches the visible H1
            page = page[:m.start(1)] + json.dumps(j, ensure_ascii=False) + page[m.end(1):]
        except ValueError:
            pass
    return page


if __name__ == '__main__':
    repo = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    n = 0
    for p in glob.glob(f'{repo}/articles/*.html') + glob.glob(f'{repo}/nl/articles/*.html'):
        t = open(p, encoding='utf-8').read()
        m = H1.search(t)
        if not m:
            continue
        full = H.unescape(m.group(1))
        sub = re.search(r'<p class="article-sub"><span>(.*?)</span></p>', m.group(0), re.S)
        if sub:
            full = full + ': ' + H.unescape(sub.group(1))
        new = apply(t, full)
        if new != t:
            open(p, 'w', encoding='utf-8').write(new); n += 1
    print('shortened', n, 'titles')
