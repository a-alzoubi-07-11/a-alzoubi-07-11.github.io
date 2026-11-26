"""Build assets/schoolvakanties.json for the «العطل المدرسية / Schoolvakanties» tool.

Data:
- Holidays: Rijksoverheid open data, infotype schoolholidays (CC0 1.0), all school years published.
  https://opendata.rijksoverheid.nl/v1/infotypes/schoolholidays?output=json
- Region per municipality: the official table on rijksoverheid.nl/onderwerpen/schoolvakanties/regios-schoolvakantie
  (rules below), with the province of each municipality from the DUO address list of primary schools (CC0).

Run: python3 tools/pages/make_holiday_data.py [path/to/po.csv]
"""
import csv, json, os, re, sys, urllib.request, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
URL = 'https://opendata.rijksoverheid.nl/v1/infotypes/schoolholidays?output=json&rows=50'
PO_URL = 'https://duo.nl/open_onderwijsdata/images/02.-alle-schoolvestigingen-basisonderwijs.csv'

TYPES = {'herfstvakantie': 'herfst', 'kerstvakantie': 'kerst', 'voorjaarsvakantie': 'voorjaar', 'meivakantie': 'mei', 'zomervakantie': 'zomer'}

# Official region table (rijksoverheid.nl, regios-schoolvakantie)
PROV = {'Drenthe': 'noord', 'Friesland': 'noord', 'Fryslân': 'noord', 'Groningen': 'noord', 'Noord-Holland': 'noord', 'Overijssel': 'noord',
        'Flevoland': 'noord', 'Utrecht': 'midden', 'Zuid-Holland': 'midden', 'Limburg': 'zuid', 'Noord-Brabant': 'zuid', 'Zeeland': 'zuid'}
EXCEPT = {'Zeewolde': 'midden', 'Eemnes': 'noord'}
GELD_NOORD = ['Hattem']
GELD_MIDDEN = ['Aalten', 'Apeldoorn', 'Barneveld', 'Berkelland', 'Bronckhorst', 'Brummen', 'Buren', 'Culemborg', 'Doetinchem', 'Ede', 'Elburg', 'Epe',
               'Ermelo', 'Harderwijk', 'Heerde', 'Lochem', 'Nijkerk', 'Nunspeet', 'Oldebroek', 'Oost Gelre', 'Oude IJsselstreek', 'Putten',
               'Scherpenzeel', 'Tiel', 'Voorst', 'Wageningen', 'West Betuwe', 'Winterswijk', 'Zutphen']
GELD_ZUID = ['Arnhem', 'Berg en Dal', 'Beuningen', 'Doesburg', 'Druten', 'Duiven', 'Heumen', 'Lingewaard', 'Maasdriel', 'Nijmegen', 'Overbetuwe',
             'Renkum', 'Rheden', 'Rozendaal', 'Westervoort', 'West Maas en Waal', 'Wijchen', 'Zaltbommel', 'Zevenaar']
# municipalities split between two regions: [main region, other region, part in the other region]
SPLIT = {
    'Montferland': ['midden', 'zuid', 'Didam'],
    'Neder-Betuwe': ['midden', 'zuid', 'Dodewaard'],
    'Altena': ['zuid', 'midden', 'Woudrichem, Sleeuwijk, Nieuwendijk, Werkendam'],
    'De Ronde Venen': ['midden', 'noord', 'Abcoude'],
}


def norm(n):
    return re.sub(r'^Gemeente\s+', '', n).replace('-', ' ').lower().strip()


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'gidsnederland-build/1.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    po_path = sys.argv[1] if len(sys.argv) > 1 else None
    raw = open(po_path, 'rb').read() if po_path else get(PO_URL)
    prov = {}
    for r in csv.DictReader(raw.decode('latin-1').splitlines(), delimiter=';'):
        prov[r['GEMEENTENUMMER'].zfill(4)] = r['PROVINCIE']
    gem = json.load(open(os.path.join(ROOT, 'assets/gemeenten.json'), encoding='utf-8'))['g']
    gl = {norm(x): r for lst, r in ((GELD_NOORD, 'noord'), (GELD_MIDDEN, 'midden'), (GELD_ZUID, 'zuid')) for x in lst}
    ex = {norm(k): v for k, v in EXCEPT.items()}
    sp = {norm(k): v for k, v in SPLIT.items()}
    out, problems = {}, []
    for code, g in gem.items():
        name = re.sub(r'^Gemeente\s+', '', g['n']).strip()
        n = norm(name)
        p = prov.get(code, '')
        if n in sp:
            out[code] = [name, sp[n][0], sp[n][1], sp[n][2]]
            continue
        r = ex.get(n) or (gl.get(n) if p == 'Gelderland' else PROV.get(p))
        if not r:
            problems.append((code, name, p))
            continue
        out[code] = [name, r]
    if problems:
        sys.exit('No region for: %r' % problems)

    data = json.loads(get(URL))
    years = []
    for item in data:
        c = item['content'][0]
        vs = []
        for v in c['vacations']:
            t = TYPES[v['type'].strip().lower()]
            reg = {}
            for r in v['regions']:
                k = r['region'].strip().lower()
                k = 'all' if 'heel' in k else k
                reg[k] = [r['startdate'][:10], r['enddate'][:10]]
            vs.append({'t': t, 'c': 1 if v['compulsorydates'] == 'true' else 0, 'r': reg})
        years.append({'y': c['schoolyear'].strip(), 'v': vs, 'u': item['canonical']})
    years.sort(key=lambda y: y['y'])
    res = {'v': 1, 'built': datetime.date.today().isoformat(),
           'src': 'Rijksoverheid open data (schoolholidays, CC0 1.0); regio-indeling rijksoverheid.nl',
           'years': years, 'g': dict(sorted(out.items()))}
    path = os.path.join(ROOT, 'assets/schoolvakanties.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, separators=(',', ':'))
    cnt = {}
    for v in out.values():
        cnt[v[1]] = cnt.get(v[1], 0) + 1
    print(path, len(years), 'years,', len(out), 'gemeenten', cnt)


if __name__ == '__main__':
    main()
