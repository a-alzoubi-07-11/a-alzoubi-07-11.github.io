const CACHE="mbo-netherlands-v37";
const CORE=["./assets/site-config.js?v=2","./assets/consent.js?v=7","./assets/style.css","./assets/site-config.js","./assets/ad-runtime.js","./data/rates.json","./","./index.html","./articles.html","./about.html","./privacy.html","./editorial-policy.html","./assets/policy.css","./contact.html","./cv.html","./refresh.html","./manifest.webmanifest","./assets/consent.css","./assets/consent.js","./assets/data-store.js","./assets/phase1.css","./assets/phase1.js","./assets/news-ticker.css","./assets/news-ticker.js","./assets/news-ticker.json","./assets/chatbot.js","./assets/visitor-counter.js","./assets/cv.css","./assets/cv.js","./assets/cv-suggestions.js","./assets/cv-translation.js","./assets/guide.css","./assets/guide.js","./nl/index.html","./nl/articles.html","./nl/tools.html","./nl/cv.html","./nl/about.html","./nl/privacy.html","./nl/contact.html","./nl/editorial-policy.html","./assets/contact-static.js","./tools.html","./assets/tools.css","./assets/tools.js","./assets/salary-model.js","./assets/tools-home.js","./assets/video-embed.js","./assets/article.css","./assets/article.js","./assets/article-bilingual.js"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("mbo-netherlands-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok&&response.type==="basic"){
   const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));
  }
  return response;
 }).catch(()=>caches.match(request).then(cached=>cached||Response.error())));
});



