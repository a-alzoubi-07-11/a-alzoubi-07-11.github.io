(()=>{"use strict";
const script=document.currentScript;
const file=new URL("news-ticker.json",script.src).href;
const fixedLanguage=script.dataset.language;
let cachedData=null,loading=false,current=0,timer=null,hovering=false;const ROTATE_MS=6000;
const text={
 ar:{title:"موجز هولندا للمهاجرين",updated:"آخر تحقق",empty:"لا توجد مستجدات رسمية مؤكدة في هذه النشرة الآن.",pending:"سيظهر الموجز الأول عند موعد التحديث المجدول.",stale:"لم يكتمل آخر فحص مجدول؛ هذه آخر المستجدات المؤكدة.",pause:"إيقاف الحركة",resume:"تشغيل الحركة",confirmed:"قرار نافذ",announced:"إعلان رسمي",proposed:"مقترح",reported:"حسب وسائل الإعلام",source:"المصدر الرسمي",prev:"الخبر السابق",next:"الخبر التالي",carousel:"شريط أخبار متقلب"},
 nl:{title:"Nederland in het kort voor nieuwkomers",updated:"Laatst gecontroleerd",empty:"Er zijn nu geen bevestigde officiële updates in dit overzicht.",pending:"De eerste briefing verschijnt bij de geplande update.",stale:"De laatste geplande controle is niet voltooid; dit zijn de laatste bevestigde updates.",pause:"Beweging pauzeren",resume:"Beweging hervatten",confirmed:"Besluit van kracht",announced:"Officieel aangekondigd",proposed:"Voorstel",reported:"Volgens media",source:"Officiële bron",prev:"Vorig bericht",next:"Volgend bericht",carousel:"Wisselende nieuwsbalk"}
};
const lang=()=>{if(fixedLanguage)return fixedLanguage==="nl"?"nl":"ar";try{return localStorage.getItem("mbo_site_lang")==="nl"?"nl":"ar"}catch{return document.documentElement.lang==="nl"?"nl":"ar"}};
const pair=(value,l)=>typeof value==="string"?value:(value&&typeof value[l]==="string"?value[l]:"");
function node(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;if(value)el.textContent=value;return el}
function render(data){const root=document.getElementById("news-ticker");if(!root)return;clearInterval(timer);const l=lang(),t=text[l];root.hidden=false;root.lang=l;root.dir=l==="ar"?"rtl":"ltr";root.dataset.dir=root.dir;root.replaceChildren();
 const head=node("div","nt-head");head.append(node("h2","nt-title",t.title));
 const last=Date.parse(data?.updatedAt||"");const until=Date.parse(data?.validUntil||"");const started=Number.isFinite(last);const stale=started&&(!Number.isFinite(until)||until<Date.now());
 if(Number.isFinite(last)){const stamp=new Intl.DateTimeFormat(l==="ar"?"ar-NL":"nl-NL",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Amsterdam"}).format(last);head.append(node("span","nt-updated",`${t.updated}: ${stamp}`))}
 root.append(head);
 const items=Array.isArray(data?.items)?data.items.slice(0,8).filter(item=>item&&pair(item.title,l)&&/^https:\/\//i.test(item.url||"")):[];
 if(!items.length){root.append(node("p","nt-empty",!started?t.pending:stale?t.stale:t.empty));return}
 if(stale)head.append(node("span","nt-updated",t.stale));
 const isPaused=()=>root.dataset.paused==="true";
 const toggle=node("button","nt-control",isPaused()?t.resume:t.pause);toggle.type="button";toggle.setAttribute("aria-pressed",String(isPaused()));toggle.addEventListener("click",()=>{const paused=!isPaused();root.dataset.paused=String(paused);toggle.textContent=paused?t.resume:t.pause;toggle.setAttribute("aria-pressed",String(paused));if(!paused)restart()});
 const viewport=node("div","nt-viewport nt-rotator");viewport.setAttribute("aria-label",t.title);viewport.setAttribute("aria-roledescription",t.carousel);
 const ul=node("ul","nt-list");const lis=[];
 for(const item of items){const li=node("li","nt-item"),category=pair(item.category,l),title=pair(item.title,l),summary=pair(item.summary,l),source=pair(item.sourceName,l),status=text[l][item.status]||text[l].announced;if(category)li.append(node("span","nt-category",category));li.append(node("span","nt-status",status));if(/^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt||"")){const d=new Date(item.publishedAt+"T12:00:00");const tm=node("time","nt-updated",new Intl.DateTimeFormat(l==="ar"?"ar-NL":"nl-NL",{day:"numeric",month:"short"}).format(d));tm.dateTime=item.publishedAt;li.append(tm)}const a=node("a","",title);a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",`${title} — ${t.source}`);li.append(a);if(summary)li.append(node("span","nt-summary",summary));if(source)li.append(node("span","nt-updated nt-source",source));ul.append(li);lis.push(li)}
 const counter=node("span","nt-counter");counter.setAttribute("aria-live","polite");
 function show(i){current=((i%lis.length)+lis.length)%lis.length;lis.forEach((li,k)=>{const on=k===current;li.classList.toggle("is-active",on);li.setAttribute("aria-hidden",String(!on));li.inert=!on});counter.textContent=`${current+1} / ${lis.length}`}
 function restart(){clearInterval(timer);if(lis.length<2)return;timer=setInterval(()=>{if(!isPaused()&&!hovering&&!document.hidden)show(current+1)},ROTATE_MS)}
 const nav=node("div","nt-nav");
 if(lis.length>1){const prev=node("button","nt-control nt-arrow",l==="ar"?"›":"‹"),next=node("button","nt-control nt-arrow",l==="ar"?"‹":"›");prev.type=next.type="button";prev.setAttribute("aria-label",t.prev);next.setAttribute("aria-label",t.next);prev.addEventListener("click",()=>{show(current-1);restart()});next.addEventListener("click",()=>{show(current+1);restart()});nav.append(prev,counter,next,toggle)}
 head.append(nav);
 viewport.addEventListener("mouseenter",()=>{hovering=true});viewport.addEventListener("mouseleave",()=>{hovering=false});viewport.addEventListener("focusin",()=>{hovering=true});viewport.addEventListener("focusout",()=>{hovering=false});
 viewport.append(ul);root.append(viewport);show(current);restart();
}
async function load(){if(loading)return;loading=true;try{const response=await fetch(file,{cache:"no-store"});if(!response.ok)throw new Error(`Ticker data: ${response.status}`);cachedData=await response.json();render(cachedData)}catch(error){console.warn("News ticker unavailable",error);render(cachedData||{items:[],validUntil:null})}finally{loading=false}}
function init(){let root=document.getElementById("news-ticker");if(!root){root=document.createElement("section");root.id="news-ticker";root.className="news-ticker";root.setAttribute("aria-live","off");const anchor=document.querySelector("header,.topbar");if(anchor)anchor.insertAdjacentElement("afterend",root);else document.body.prepend(root)}load();setInterval(()=>{if(!document.hidden)load()},300000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)load()});new MutationObserver(()=>render(cachedData)).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});window.addEventListener("storage",event=>{if(event.key==="mbo_site_lang")load()})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
