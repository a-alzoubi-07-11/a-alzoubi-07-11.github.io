#!/usr/bin/env python3
"""Fetch Dutch day-ahead electricity prices (today + tomorrow) for the «أرخص ساعات الكهرباء» tool.

Source: Energy-Charts API by Fraunhofer ISE, https://api.energy-charts.info/price?bzn=NL
        licence CC BY 4.0, data from Bundesnetzagentur | SMARD.de (ENTSO-E day-ahead market).
The API does not allow browser calls from our domain (CORS), so this script writes a static file:
    assets/energy/nl-prices.json  ->  {"updated", "source", "license", "unit", "p": [[unix_seconds, eur_per_mwh], ...]}
Tomorrow's prices are published around 13:00 Amsterdam time; the workflow runs several times a day.
Exit code 0 also when the API is down (the old file stays), so the site never breaks.
"""
import datetime as dt, json, os, sys, urllib.request
from zoneinfo import ZoneInfo

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'energy', 'nl-prices.json')
AMS = ZoneInfo('Europe/Amsterdam')


def fetch(start, end):
    url = f'https://api.energy-charts.info/price?bzn=NL&start={start}&end={end}'
    req = urllib.request.Request(url, headers={'User-Agent': 'gidsnederland-energy/1.0 (+https://gidsnederland.nl/contact.html)'})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def main():
    today = dt.datetime.now(AMS).date()
    tomorrow = today + dt.timedelta(days=1)
    try:
        d = fetch(today.isoformat(), tomorrow.isoformat())
    except Exception as e:  # keep the previous file
        print('fetch failed:', e)
        return 0
    ts, pr = d.get('unix_seconds') or [], d.get('price') or []
    start = int(dt.datetime.combine(today, dt.time(0), AMS).timestamp())
    end = int(dt.datetime.combine(tomorrow + dt.timedelta(days=1), dt.time(0), AMS).timestamp())
    pts = [[int(t), round(float(p), 2)] for t, p in zip(ts, pr) if p is not None and start <= int(t) < end]
    if len(pts) < 20:
        print('too few points, keeping the old file:', len(pts))
        return 0
    data = {
        'updated': dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        'source': 'Energy-Charts (Fraunhofer ISE), data Bundesnetzagentur | SMARD.de',
        'license': d.get('license_info') or 'CC BY 4.0',
        'unit': 'EUR/MWh',
        'p': pts,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    old = None
    if os.path.exists(OUT):
        try:
            old = json.load(open(OUT, encoding='utf-8')).get('p')
        except Exception:
            old = None
    if old == pts:
        print('no change')
        return 0
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, separators=(',', ':'))
    print(f'wrote {len(pts)} points, last {dt.datetime.fromtimestamp(pts[-1][0], AMS)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
