#!/usr/bin/env python3
"""Build assets/gemeenten.json (contact details of every Dutch municipality) for the «بلديتي / Mijn gemeente» tool.

Source: Organisaties.overheid.nl export (CC0 1.0), https://organisaties.overheid.nl/archive/exportOO_gemeenten.xml
Usage:
    curl -A "gidsnederland-build/1.0 (+https://gidsnederland.nl/contact.html)" -o gem.xml https://organisaties.overheid.nl/archive/exportOO_gemeenten.xml
    python3 tools/pages/make_gemeente_data.py gem.xml
Keys are the 4-digit CBS municipality code that PDOK Locatieserver returns as `gemeentecode` (e.g. "0344" Utrecht).
Re-run after municipal mergers (1 January) and bump ?v= in assets/mijn-gemeente.js.
"""
import json, os, re, sys
import xml.etree.ElementTree as ET

NS = {'p': 'https://organisaties.overheid.nl/static/schema/oo/export/2.6.13'}
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def txt(el, path):
    x = el.find(path, NS)
    return (x.text or '').strip() if x is not None and x.text else ''


def main(path):
    root = ET.parse(path).getroot()
    ns_uri = root.tag.split('}')[0].strip('{')
    NS['p'] = ns_uri
    A = '{%s}' % ns_uri
    out = {}
    for org in root.iter(A + 'organisatie'):
        tooi = org.get(A + 'resourceIdentifierTOOI') or ''
        m = re.search(r'/gemeente/gm(\d{4})$', tooi)
        types = [t.text for t in org.findall('p:types/p:type', NS)]
        if not m or 'Gemeente' not in types:
            continue
        code = m.group(1)
        if code in out:
            continue
        name = txt(org, 'p:naam')
        if org.find('p:eindDatum', NS) is not None and txt(org, 'p:eindDatum'):
            continue
        visit = None
        for a in org.findall('p:adressen/p:adres', NS):
            if txt(a, 'p:adresType') == 'Bezoekadres':
                visit = {
                    's': (txt(a, 'p:openbareRuimte') + ' ' + txt(a, 'p:huisnummer') + txt(a, 'p:huisletter')
                          + (('-' + txt(a, 'p:huisnummertoevoeging')) if txt(a, 'p:huisnummertoevoeging') else '')).strip(),
                    'pc': txt(a, 'p:postcode'), 'c': txt(a, 'p:woonplaats').title().replace("'S-", "'s-"),
                }
                break
        tel = ''
        for t in org.findall('p:contact/p:telefoonnummers/p:telefoonnummer', NS):
            if not tel or txt(t, 'p:label').lower() in ('algemeen', 'algemeen telefoonnummer'):
                tel = txt(t, 'p:nummer')
                if txt(t, 'p:label').lower().startswith('algemeen'):
                    break
        mail = ''
        for e in org.findall('p:contact/p:emailadressen/p:emailadres', NS):
            if not mail or txt(e, 'p:label').lower() == 'algemeen':
                mail = txt(e, 'p:email')
                if txt(e, 'p:label').lower() == 'algemeen':
                    break
        web = ''
        for w in org.findall('p:contact/p:internetadressen/p:internetadres', NS):
            if not web or txt(w, 'p:label').lower() == 'algemeen':
                web = txt(w, 'p:url')
                if txt(w, 'p:label').lower() == 'algemeen':
                    break
        tel = re.sub(r'^\(?0?14\)?\s*', '14 ', tel) if re.match(r'^\(?0?14\)?\s*\d', tel) else tel
        out[code] = {'n': name, 'a': visit, 't': tel, 'e': mail, 'w': web}
    data = {'v': 1, 'source': 'Organisaties.overheid.nl (CC0 1.0)', 'exported': root.get(A + 'timestamp', ''), 'g': dict(sorted(out.items()))}
    dst = os.path.join(REPO, 'assets', 'gemeenten.json')
    with open(dst, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))
    missing = [c for c, v in out.items() if not v['w'] or not v['t']]
    print(f'municipalities {len(out)}, without phone or website: {len(missing)} {missing[:10]}')


if __name__ == '__main__':
    main(sys.argv[1])
