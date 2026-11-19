#!/usr/bin/env python3
"""Build the static data for the OV route-cost tool (assets/ov/*.json) from the Dutch GTFS feed.

Source: https://gtfs.ovapi.nl/nl/gtfs-nl.zip (OVapi, converted from NDOV open data).
licenses.txt in the feed: core tables CC0-1.0, shapes ODbL. We only use CC0 tables
(agency, routes, trips, stops, stop_times) and never shapes.txt.

Usage:
    curl -A "gidsnederland-build/1.0 (+https://gidsnederland.nl/contact.html)" -o gtfs-nl.zip https://gtfs.ovapi.nl/nl/gtfs-nl.zip
    python3 tools/pages/make_ov_data.py gtfs-nl.zip

Writes:
    assets/ov/rail.json   train stations (name, lat, lon, operators) + track edges (km, operator)
    assets/ov/local.json  ~1 km grid cells -> bus/tram/metro/ferry operators that stop there
Re-run after a timetable change (December) and bump ?v= in assets/ov-planner.js.
"""
import collections, csv, io, json, math, os, sys, zipfile

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(REPO, 'assets', 'ov')

# Netherlands bounding box (small margin for border stations).
LAT0, LAT1, LON0, LON1 = 50.70, 53.60, 3.30, 7.25
# Grid: ~1.1 km x ~1.0 km at Dutch latitudes.
DLAT, DLON = 0.01, 0.015

# International, museum and heritage services: not part of a normal OV-chipkaart/OVpay trip.
SKIP_AGENCIES = {
    'IFF:NS_INT', 'IFF:EU_SLEEPER', 'IFF:DB', 'IFF:NMBS', 'IFF:VIAS', 'IFF:EUROBAHN', 'IFF:BEA', 'DELIJN',
    'NL:MLN:Operator:9f1641fb-e08a-41b9-bdaa-204918901704',     # Miljoenenlijn (museum)
    'NL:OVCN:Operator:21a33b6a-7389-4c5d-99ea-904f7551694a',    # Electrische Museumtramlijn
}
# Ferries that do not accept OVpay / OV-chipkaart: separate ticket.
OWN_TICKET = {'DOEKSEN', 'WPD', 'TESO', 'WATERSHUTTLE'}
# Display names: merge brand variants and the IFF (rail) prefixes.
NAME = {
    'IFF:NS': 'NS', 'IFF:R-NET_NS': 'NS (R-net)', 'IFF:ARRIVA': 'Arriva', 'ARR': 'Arriva',
    'IFF:BLAUWNET_A': 'Arriva (Blauwnet)', 'IFF:BLAUWNET_K': 'Keolis (Blauwnet)',
    'IFF:RRREIS_A': 'Arriva (RRReis)', 'IFF:RRREIS_K': 'Keolis (RRReis)', 'IFF:R-NET_QB': 'Qbuzz (R-net)',
    'IFF:GV': 'GoVolta', 'BRAVO:ARR': 'Arriva (Bravo)', 'BRAVO:CXX': 'Hermes (Bravo)', 'BRAVO': 'Bravo',
    'ALLGO': 'allGo (Keolis)', 'CXX': 'Connexxion', 'UOV': 'U-OV', 'NL:ZTM:Branding:7152632d-eda5-41c1-b7d7-7db3dc447824': 'De Opstap',
}
MODE = {0: 't', 1: 'm', 2: 'r', 3: 'b', 4: 'f'}   # tram, metro, rail, bus, ferry


def hav(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 6371.0 * 2 * math.asin(math.sqrt(h))


def main(zpath):
    Z = zipfile.ZipFile(zpath)
    rd = lambda n: csv.DictReader(io.TextIOWrapper(Z.open(n), encoding='utf-8-sig'))
    agencies = {a['agency_id']: a for a in rd('agency.txt')}
    routes = {}
    for r in rd('routes.txt'):
        try:
            routes[r['route_id']] = (r['agency_id'], int(r['route_type']))
        except ValueError:
            continue
    trip_route = {t['trip_id']: t['route_id'] for t in rd('trips.txt')}
    stops = {s['stop_id']: s for s in rd('stops.txt')}

    stop_ops = collections.defaultdict(set)
    edges = {}
    f = io.TextIOWrapper(Z.open('stop_times.txt'), encoding='utf-8-sig')
    h = f.readline().strip().split(',')
    iT, iS, iD = h.index('trip_id'), h.index('stop_id'), h.index('shape_dist_traveled')
    prev = None
    for line in f:
        p = line.rstrip('\n').split(',')
        rid = trip_route.get(p[iT])
        if rid is None or rid not in routes:
            prev = None
            continue
        ag, ty = routes[rid]
        if ag in SKIP_AGENCIES or ty not in MODE:
            prev = None
            continue
        stop_ops[p[iS]].add((ag, ty))
        if ty == 2:
            cur = (p[iT], p[iS], p[iD])
            if prev and prev[0] == cur[0]:
                try:
                    d = (float(cur[2] or 0) - float(prev[2] or 0)) / 1000.0
                except ValueError:
                    d = 0.0
                k = (prev[1], cur[1], ag)
                if d > 0 and (k not in edges or d < edges[k]):
                    edges[k] = d
                elif k not in edges:
                    edges[k] = 0.0
            prev = cur
        else:
            prev = None

    def ll(sid):
        s = stops[sid]
        return float(s['stop_lat']), float(s['stop_lon'])

    def inside(lat, lon):
        return LAT0 <= lat <= LAT1 and LON0 <= lon <= LON1

    # ---- rail: group platforms into stations (parent_station) ----
    def station_of(sid):
        par = stops[sid].get('parent_station') or ''
        return par if par in stops else sid

    st = {}
    for sid, ops in stop_ops.items():
        if sid not in stops:
            continue
        rail_ops = {a for a, t in ops if t == 2}
        if not rail_ops:
            continue
        key = station_of(sid)
        lat, lon = ll(key)
        if not inside(lat, lon):
            continue
        e = st.setdefault(key, {'n': stops[key]['stop_name'], 'lat': lat, 'lon': lon, 'o': set()})
        e['o'] |= rail_ops
    keys = sorted(st, key=lambda k: st[k]['n'])
    idx = {k: i for i, k in enumerate(keys)}
    ag_list = []
    ag_idx = {}

    def agi(a):
        # one entry per display name (e.g. IFF:ARRIVA and ARR are both "Arriva")
        nm = NAME.get(a, agencies.get(a, {}).get('agency_name', a))
        if nm not in ag_idx:
            ag_idx[nm] = len(ag_list)
            ag_list.append(a)
        return ag_idx[nm]

    E = {}
    for (a, b, ag), d in edges.items():
        sa, sb = station_of(a), station_of(b)
        if sa not in idx or sb not in idx or sa == sb:
            continue
        if d <= 0:
            d = hav((st[sa]['lat'], st[sa]['lon']), (st[sb]['lat'], st[sb]['lon'])) * 1.15
        u, v = sorted((idx[sa], idx[sb]))
        k = (u, v, agi(ag))
        if k not in E or d < E[k]:
            E[k] = d
    rail = {
        'v': 1,
        'source': 'OVapi GTFS (NDOV open data, CC0)',
        'feed_version': next(rd('feed_info.txt'))['feed_version'],
        'ops': [],
        'st': [[st[k]['n'], round(st[k]['lat'], 5), round(st[k]['lon'], 5), sorted(agi(a) for a in st[k]['o'])] for k in keys],
        'e': [[u, v, round(d, 2), a] for (u, v, a), d in sorted(E.items())],
    }

    # ---- local: grid of bus/tram/metro/ferry operators ----
    cells = collections.defaultdict(dict)
    for sid, ops in stop_ops.items():
        if sid not in stops:
            continue
        lat, lon = ll(sid)
        if not inside(lat, lon):
            continue
        key = f'{int((lat - LAT0) / DLAT)}_{int((lon - LON0) / DLON)}'
        for a, t in ops:
            if t == 2:
                continue
            i = agi(a)
            cells[key][i] = cells[key].get(i, '') + ('' if MODE[t] in cells[key].get(i, '') else MODE[t])
    local = {
        'v': 1, 'lat0': LAT0, 'lon0': LON0, 'dlat': DLAT, 'dlon': DLON,
        'c': {k: [[i, m] for i, m in sorted(v.items())] for k, v in sorted(cells.items())},
    }

    ops = []
    for a in ag_list:
        g = agencies.get(a, {})
        url = g.get('agency_url', '')
        if 'example.com' in url:
            url = ''
        ops.append([NAME.get(a, g.get('agency_name', a)), url, 1 if a in OWN_TICKET else 0, 1 if a in ('IFF:NS', 'IFF:R-NET_NS') else 0])
    rail['ops'] = ops
    local['ops'] = ops

    os.makedirs(OUT, exist_ok=True)
    for name, obj in (('rail.json', rail), ('local.json', local)):
        with open(os.path.join(OUT, name), 'w', encoding='utf-8') as fh:
            json.dump(obj, fh, ensure_ascii=False, separators=(',', ':'))
    print(f"stations {len(rail['st'])}, edges {len(rail['e'])}, cells {len(local['c'])}, operators {len(ops)}")


if __name__ == '__main__':
    main(sys.argv[1])
