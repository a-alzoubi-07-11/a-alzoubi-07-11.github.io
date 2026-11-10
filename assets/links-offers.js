/* Offers block on the link-in-bio pages (/links/ and /nl/links/). Same data as the partners bar: /assets/partners.json.
   Shows only active offers whose dates include today and that are meant for this page (topics include "links", or no topics).
   Clearly labelled as advertising; a discount code can be copied with one tap. No tracking of its own. */
(()=>{"use strict";
const box=document.getElementById("lk-offers");if(!box)return;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{h:"Aanbiedingen en kortingscodes",ad:"Advertentie",code:"Code",copy:"Kopieer code",copied:"Gekopieerd",until:"Geldig t/m",auto:"Korting automatisch in het winkelmandje",all:"Alle aanbiedingen en uitleg",note:"Affiliate-links: wij kunnen een kleine commissie krijgen, jij betaalt hetzelfde. De actuele prijs en voorwaarden staan altijd op de site van de winkel.",wa:"App via WhatsApp"}
            :{h:"عروض وأكواد خصم",ad:"إعلان",code:"الكود",copy:"انسخ الكود",copied:"تم النسخ",until:"صالح حتى",auto:"الخصم بيطلع تلقائياً بالسلة",all:"كل العروض والتفاصيل",note:"روابط إعلانية: قد نحصل على عمولة صغيرة، والسعر عليك ما بيتغير. السعر والشروط النهائية دائماً على موقع المتجر.",wa:"راسلهم واتساب"};
const today=new Date().toISOString().slice(0,10);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
const fmt=d=>{try{return new Date(d+"T12:00:00").toLocaleDateString(nl?"nl-NL":"ar-u-nu-latn",{day:"numeric",month:"long"})}catch(_){return d}};
const TAG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/></svg>';
const GO='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
function live(items){return (items||[]).filter(o=>o&&o.active===true&&okUrl(o.url)&&(!o.start||o.start<=today)&&(!o.end||o.end>=today)
  &&(!Array.isArray(o.topics)||!o.topics.length||o.topics.map(String).includes("links")))
  .sort((a,b)=>(!!b.code-!!a.code)||((a.end||"9999")<(b.end||"9999")?-1:1));} // codes first, then the soonest to expire
function card(o){
  const name=nl&&o.partner_nl?o.partner_nl:o.partner,title=(o.title&&(o.title[nl?"nl":"ar"]||o.title.ar))||"",kind=(o.kind&&(o.kind[nl?"nl":"ar"]||o.kind.ar))||"";
  const wa=o.strip_link==="whatsapp"&&/^\d{8,15}$/.test(o.whatsapp||"");
  const msg=nl?`Hallo, ik kom via Gids Nederland (gidsnederland.nl)${o.code?` en wil graag de korting met code ${o.code}`:""}.`
              :`مرحباً، وصلت إليكم من موقع دليل هولندا بالعربية (gidsnederland.nl)${o.code?` وأريد الاستفادة من الخصم بالكود ${o.code}`:""}.`;
  const href=wa?`https://wa.me/${o.whatsapp}?text=${encodeURIComponent(msg)}`:o.url;
  const meta=[kind,o.end?`${T.until} ${fmt(o.end)}`:""].filter(Boolean).join(" · ");
  return `<li class="lk-offer"><a class="lk-a" href="${esc(href)}" target="_blank" rel="sponsored noopener">`
    +`<span class="lk-ic">${TAG}</span><span class="lk-t"><strong>${esc(name)}</strong><span><bdi>${esc(title)}</bdi></span>`
    +(meta?`<span class="lk-meta"><bdi>${esc(meta)}</bdi></span>`:"")+`</span><span class="lk-go">${GO}</span></a>`
    +(o.code?`<button type="button" class="lk-code" data-code="${esc(o.code)}" aria-label="${T.copy}: ${esc(o.code)}"><span>${T.code}</span><code>${esc(o.code)}</code><em>${T.copy}</em></button>`:"")
    +`</li>`;
}
function copy(btn){const c=btn.dataset.code,em=btn.querySelector("em");
  const done=()=>{em.textContent=T.copied;btn.classList.add("ok");setTimeout(()=>{em.textContent=T.copy;btn.classList.remove("ok")},1800)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(c).then(done,()=>sel(btn));else sel(btn);
  function sel(b){const r=document.createRange();r.selectNodeContents(b.querySelector("code"));const s=getSelection();s.removeAllRanges();s.addRange(r);}
}
fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(!items.length)return;
  box.innerHTML=`<h2 class="lk-sec">${T.h} <span class="lk-ad">${T.ad}</span></h2><ul class="lk-list">${items.map(card).join("")}</ul>`
    +`<p class="lk-note">${T.note} <a href="${nl?"/nl/partners.html":"/partners.html"}">${T.all}</a></p>`;
  box.hidden=false;
  box.addEventListener("click",e=>{const b=e.target.closest(".lk-code");if(b)copy(b)});
}).catch(()=>{});
})();
