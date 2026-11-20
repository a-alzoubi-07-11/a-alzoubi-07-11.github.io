#!/usr/bin/env python3
"""Build assets/scholen/<gemeentecode>.json (primary and secondary schools per municipality) for «بلديتي / Mijn gemeente».

Source: DUO Open Onderwijsdata (CC0 / CC-BY 4.0, attribution «Bron: DUO»):
    https://duo.nl/open_onderwijsdata/images/01.-hoofdvestigingen-basisonderwijs.csv
    https://duo.nl/open_onderwijsdata/images/02.-alle-vestigingen-vo.csv
Usage:  python3 tools/pages/make_school_data.py po.csv vo.csv
Files are keyed by the 4-digit municipality code (same as PDOK `gemeentecode`). Re-run yearly (new school year).
"""
import csv, io, json, os, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(REPO, 'assets', 'scholen')


def rows(path):
    raw = open(path, 'rb').read()
    for enc in ('utf-8-sig', 'cp1252', 'latin-1'):
        try:
            text = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    return list(csv.DictReader(io.StringIO(text), delimiter=';'))


def clean(s):
    return ' '.join((s or '').split())


def web(u):
    u = clean(u)
    if not u or u in ('-',):
        return ''
    return u if u.startswith('http') else 'https://' + u


def main(po_path, vo_path):
    data = {}
    for r in rows(po_path):
        code = clean(r.get('GEMEENTENUMMER')).zfill(4)
        if not code.strip('0'):
            continue
        data.setdefault(code, {'po': [], 'vo': []})['po'].append([
            clean(r['INSTELLINGSNAAM']), (clean(r['STRAATNAAM']) + ' ' + clean(r['HUISNUMMER-TOEVOEGING'])).strip(),
            clean(r['POSTCODE']), clean(r['PLAATSNAAM']).title(), clean(r['DENOMINATIE']), web(r.get('INTERNETADRES'))])
    for r in rows(vo_path):
        code = clean(r.get('GEMEENTENUMMER')).zfill(4)
        if not code.strip('0'):
            continue
        data.setdefault(code, {'po': [], 'vo': []})['vo'].append([
            clean(r['VESTIGINGSNAAM']), (clean(r['STRAATNAAM']) + ' ' + clean(r['HUISNUMMER-TOEVOEGING'])).strip(),
            clean(r['POSTCODE']), clean(r['PLAATSNAAM']).title(), clean(r['ONDERWIJSSTRUCTUUR']), web(r.get('INTERNETADRES'))])
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith('.json'):
            os.remove(os.path.join(OUT, f))
    for code, d in data.items():
        d['src'] = 'DUO Open Onderwijsdata'
        with open(os.path.join(OUT, code + '.json'), 'w', encoding='utf-8') as fh:
            json.dump(d, fh, ensure_ascii=False, separators=(',', ':'))
    print(f"municipalities {len(data)}, primary {sum(len(d['po']) for d in data.values())}, secondary {sum(len(d['vo']) for d in data.values())}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
