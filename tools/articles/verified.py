"""Two separate dates on every guide: when the official sources were last checked (from src_note)
and when the page was last edited (dateModified). A rebuild never moves the 'checked' date.

Run alone to relabel all existing guides without touching their content:
    python3 verified.py
"""
import importlib, json, os, re, sys
AR_M = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
NL_M = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
LBL = {'ar': ('آخر تحقق من المصادر الرسمية:', 'آخر تعديل للصفحة:'),
       'nl': ('Officiële bronnen laatst gecontroleerd:', 'Pagina laatst bewerkt:')}
LINE = re.compile(r'<p(?: class="article-dates")?><span>[^<]*</span> <time datetime="[^"]*"><span>[^<]*</span></time>'
                  r'(?: · <span>[^<]*</span> <time datetime="[^"]*"><span>[^<]*</span></time>)?</p>')


def verified_from_note(note):
    """Latest date written in a src_note ('8 نوفمبر 2026' / '8 november 2026'), as ISO, or None."""
    found = []
    for d, mo, y in re.findall(r'(\d{1,2})\s+([^\s\d،,.]+)\s+(\d{4})', note or ''):
        m = mo.lower()
        idx = AR_M.index(m) + 1 if m in AR_M else NL_M.index(m) + 1 if m in NL_M else 0
        if idx:
            found.append(f'{int(y):04d}-{idx:02d}-{int(d):02d}')
    return max(found) if found else None


def text(iso, lang):
    y, m, d = (int(x) for x in iso.split('-'))
    return f'{d} {(AR_M if lang == "ar" else NL_M)[m - 1]} {y}'


def label(html, lang, verified, modified):
    a, b = LBL[lang]
    parts = []
    if verified:
        parts.append(f'<span>{a}</span> <time datetime="{verified}"><span>{text(verified, lang)}</span></time>')
    parts.append(f'<span>{b}</span> <time datetime="{modified}"><span>{text(modified, lang)}</span></time>')
    new = '<p class="article-dates">' + ' · '.join(parts) + '</p>'
    return LINE.sub(lambda _: new, html, count=1)


if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, os.path.join(here, 'modules'))
    repo = os.path.abspath(os.path.join(here, '..', '..'))
    n = 0
    for f in sorted(os.listdir(os.path.join(here, 'modules'))):
        if not (f.startswith('a_') and f.endswith('.py')):
            continue
        m = importlib.import_module(f[:-3])
        if not hasattr(m, 'SLUG'):
            continue
        for lang, spec, rel in (('ar', m.AR, f'articles/{m.SLUG}.html'), ('nl', m.NL, f'nl/articles/{m.SLUG}.html')):
            p = os.path.join(repo, rel)
            if not os.path.exists(p):
                continue
            t = open(p, encoding='utf-8').read()
            mod = re.search(r'"dateModified":\s*"([0-9-]{10})"', t)
            if not mod:
                continue
            new = label(t, lang, verified_from_note(spec.get('src_note', '')), mod.group(1))
            if new != t:
                open(p, 'w', encoding='utf-8').write(new); n += 1
    print('relabelled', n, 'pages')
