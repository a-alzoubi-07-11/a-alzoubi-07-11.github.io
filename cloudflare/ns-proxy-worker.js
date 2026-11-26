// Cloudflare Worker: small read-only proxy to the NS Reisinformatie API for gidsnederland.nl.
// Keeps the NS subscription key secret (it never reaches the browser) and caches answers briefly.
//
// Deploy (Cloudflare dashboard → Workers & Pages → Create → "Hello World" → paste this file → Deploy):
//   Settings → Variables and Secrets → add Secret  NS_KEY = <Primary key from apiportal.ns.nl, product "Ns-App">
// Then give the worker URL (https://<name>.<account>.workers.dev) to the site: assets/ns-live.js → API_BASE.
//
// Allowed calls (GET only, origin https://gidsnederland.nl):
//   /trips?fromStation=UT&toStation=RTD[&dateTime=ISO][&searchForArrival=true]
//   /departures?station=UT
//   /disruptions            (active disruptions and works)
//   /stations               (station list, cached 1 day)
const ALLOWED_ORIGINS = ["https://gidsnederland.nl"];
const NS = "https://gateway.apiportal.ns.nl/reisinformatie-api/api";
const ROUTES = {
  "/trips":       { path: "/v3/trips",       params: ["fromStation", "toStation", "originUicCode", "destinationUicCode", "dateTime", "searchForArrival", "lang"], ttl: 30 },
  "/departures":  { path: "/v2/departures",  params: ["station", "uicCode", "lang", "maxJourneys"], ttl: 30 },
  "/disruptions": { path: "/v3/disruptions", params: ["isActive", "lang"], ttl: 120, defaults: { isActive: "true" } },
  "/stations":    { path: "/v2/stations",    params: [], ttl: 86400 },
};

function cors(origin) {
  const h = { "Vary": "Origin" };
  if (ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}
function json(body, status, origin, extra) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin), ...(extra || {}) } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "Origin not allowed" }, 403, "");
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, origin);
    const route = ROUTES[url.pathname];
    if (!route) return json({ error: "Not found" }, 404, origin);
    if (!env.NS_KEY) return json({ error: "NS_KEY secret is not configured" }, 503, origin);

    const q = new URLSearchParams(route.defaults || {});
    for (const p of route.params) {
      const v = url.searchParams.get(p);
      if (v !== null && v.length <= 64 && /^[\w:+.\-]*$/.test(v)) q.set(p, v);
    }
    const target = `${NS}${route.path}${q.toString() ? "?" + q.toString() : ""}`;

    const cache = caches.default;
    const cacheKey = new Request(target, { method: "GET" });
    let res = await cache.match(cacheKey);
    if (!res) {
      const upstream = await fetch(target, { headers: { "Ocp-Apim-Subscription-Key": env.NS_KEY, "Accept": "application/json" } });
      const body = await upstream.text();
      res = new Response(body, { status: upstream.status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": `public, max-age=${route.ttl}` } });
      if (upstream.ok) ctx.waitUntil(cache.put(cacheKey, res.clone()));
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors(origin))) out.headers.set(k, v);
    return out;
  },
};
