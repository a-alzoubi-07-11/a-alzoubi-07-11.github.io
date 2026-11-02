/* Homepage "updates" strip: official news only (assets/news-ticker.json), in ONE quiet, rotating card.
   Partner offers are NOT mixed in here: they live in a separate, labelled "partner offers" box
   further down the page (partners-bar.js), so news and advertising stay clearly apart.
   - One item visible at a time, soft cross-fade; all items share one grid cell, so the height never jumps.
   - Pauses on hover/focus, when the tab is hidden, and for prefers-reduced-motion (manual arrows only).
   - Buttons never move, so every tap works the first time. No cookies, no tracking. */
(()=>{"use strict";
const script=document.currentScript;
const base=new URL(".",script.src).href;
const fixedLanguage=script.dataset.language;
const ROTATE_MS=7000;
const T={
 ar:{title:"المستجدات",region:"آخر المستجدات الرسمية",news:"خبر رسمي",ad:"إعلان",confirmed:"قرار نافذ",announced:"إعلان رسمي",proposed:"مقترح",reported:"حسب وسائل الإعلام",read:"اقرأ في المصدر",code:"كود الخصم",copy:"انسخ الكود",copied:"تم النسخ",visit:"زيارة الموقع",wa:"واتساب",all:"كل العروض",prev:"السابق",next:"التالي",pause:"إيقاف التقليب",play:"تشغيل التقليب",note:"تعاون مدفوع. لا نضمن خدمات الشركاء."},
 nl:{title:"Updates",region:"Laatste officiële updates",news:"Officieel nieuws",ad:"Advertentie",confirmed:"Besluit van kracht",announced:"Officieel aangekondigd",proposed:"Voorstel",reported:"Volgens media",read:"Lees bij de bron",code:"Kortingscode",copy:"Kopieer code",copied:"Gekopieerd",visit:"Naar de website",wa:"WhatsApp",all:"Alle aanbiedingen",prev:"Vorige",next:"Volgende",pause:"Wisselen pauzeren",play:"Wisselen hervatten",note:"Betaalde samenwerking. Wij garanderen de diensten van partners niet."}
};
const ICON={
 prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
 next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
 pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>',
 play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
 copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15"/></svg>',
 ext:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};
const lang=()=>{if(fixedLanguage)return fixedLanguage==="nl"?"nl":"ar";return (document.documentElement.lang||"ar").slice(0,2)==="nl"?"nl":"ar"};
const pair=(v,l)=>typeof v==="string"?v:(v&&typeof v[l]==="string"?v[l]:"");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
const today=new Date().toISOString().slice(0,10);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let timer=null,current=0,paused=reduce,hovering=false;

function newsItems(data,l){
 const t=T[l];
 return (Array.isArray(data&&data.items)?data.items:[]).filter(i=>i&&pair(i.title,l)&&okUrl(i.url)).slice(0,6).map(i=>{
  let date="";if(/^\d{4}-\d{2}-\d{2}$/.test(i.publishedAt||"")){const d=new Date(i.publishedAt+"T12:00:00");date=`<time datetime="${i.publishedAt}">${esc(new Intl.DateTimeFormat(l==="ar"?"ar-NL":"nl-NL",{day:"numeric",month:"long"}).format(d))}</time>`}
  const status=t[i.status]||t.announced,src=pair(i.sourceName,l),sum=pair(i.summary,l),title=pair(i.title,l);
  return `<p class="us-meta"><span class="us-label">${t.news}</span><span>${esc(status)}</span>${date?`<span>${date}</span>`:""}</p>`
   +`<a class="us-title" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>`
   +(sum?`<p class="us-sum">${esc(sum)}</p>`:"")
   +`<p class="us-foot">${src?`<span class="us-src">${esc(src)}</span>`:""}<a class="us-link" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${t.read}${ICON.ext}</a></p>`;
 });
}
function render(news){
 const root=document.getElementById("news-ticker");if(!root)return;clearInterval(timer);
 const l=lang(),t=T[l];
 const items=newsItems(news,l).map(h=>({k:"news",h})); // official news only; offers have their own box
 if(!items.length){root.hidden=true;return}
 root.className="us";root.hidden=false;root.lang=l;root.dir=l==="ar"?"rtl":"ltr";root.setAttribute("aria-label",t.region);root.removeAttribute("aria-live");
 const multi=items.length>1;
 root.innerHTML=`<div class="us-wrap"><div class="us-card"><div class="us-top"><h2 class="us-h">${t.title}</h2>`
  +(multi?`<div class="us-ctl"><span class="us-count" aria-live="polite"></span><button type="button" class="us-ic us-prev" aria-label="${t.prev}">${l==="ar"?ICON.next:ICON.prev}</button><button type="button" class="us-ic us-next" aria-label="${t.next}">${l==="ar"?ICON.prev:ICON.next}</button><button type="button" class="us-ic us-pause" aria-pressed="${paused}" aria-label="${paused?t.play:t.pause}">${paused?ICON.play:ICON.pause}</button></div>`:"")
  +`</div><ul class="us-list">${items.map(x=>`<li class="us-item us-${x.k}">${x.h}</li>`).join("")}</ul>`
  +(multi?`<div class="us-dots" aria-hidden="true">${items.map(()=>"<i></i>").join("")}</div>`:"")+`</div></div>`;
 const lis=[...root.querySelectorAll(".us-item")],dots=[...root.querySelectorAll(".us-dots i")],count=root.querySelector(".us-count");
 function show(i){current=((i%lis.length)+lis.length)%lis.length;lis.forEach((li,k)=>{const on=k===current;li.classList.toggle("on",on);li.setAttribute("aria-hidden",String(!on));li.inert=!on});dots.forEach((d,k)=>d.classList.toggle("on",k===current));if(count)count.textContent=`${current+1} / ${lis.length}`}
 function restart(){clearInterval(timer);if(!multi)return;timer=setInterval(()=>{if(!paused&&!hovering&&!document.hidden)show(current+1)},ROTATE_MS)}
 const card=root.querySelector(".us-card");
 card.addEventListener("mouseenter",()=>{hovering=true});card.addEventListener("mouseleave",()=>{hovering=false});
 card.addEventListener("focusin",()=>{hovering=true});card.addEventListener("focusout",()=>{hovering=false});
 card.addEventListener("click",async e=>{
  if(e.target.closest(".us-prev")){show(current-1);restart();return}
  if(e.target.closest(".us-next")){show(current+1);restart();return}
  const p=e.target.closest(".us-pause");if(p){paused=!paused;p.setAttribute("aria-pressed",String(paused));p.setAttribute("aria-label",paused?t.play:t.pause);p.innerHTML=paused?ICON.play:ICON.pause;if(!paused)restart();return}
  const c=e.target.closest(".us-code");if(c){let ok=false;try{await navigator.clipboard.writeText(c.dataset.code);ok=true}catch(_){}
   const v=c.querySelector(".us-code-l"),old=v.textContent;v.textContent=ok?t.copied:t.code;c.classList.toggle("done",ok);setTimeout(()=>{v.textContent=old;c.classList.remove("done")},2000)}
 });
 // swipe on touch screens
 let sx=null;card.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});
 card.addEventListener("touchend",e=>{if(sx==null||!multi)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)<50)return;const fwd=(dx<0)!==(l==="ar");show(current+(fwd?1:-1));restart()},{passive:true});
 show(Math.min(current,lis.length-1));restart();
}
const get=f=>fetch(base+f,{cache:"no-cache"}).then(r=>r.ok?r.json():null).catch(()=>null);
let cache=[null];
async function load(){cache=[await get("news-ticker.json")];render(cache[0])}
function init(){
 let root=document.getElementById("news-ticker");
 if(!root){root=document.createElement("section");root.id="news-ticker";root.hidden=true;const hero=document.querySelector("main .hm-hero");if(hero)hero.after(root);else return}
 load();
 setInterval(()=>{if(!document.hidden)get("news-ticker.json").then(d=>{if(d&&JSON.stringify(d)!==JSON.stringify(cache[0])){cache[0]=d;render(cache[0])}})},600000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
