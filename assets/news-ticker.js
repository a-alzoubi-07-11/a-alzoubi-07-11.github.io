(()=>{"use strict";
const script=document.currentScript;
const file=new URL("news-ticker.json",script.src).href;
const fixedLanguage=script.dataset.language;
let cachedData=null,loading=false;
const text={
 ar:{title:"موجز هولندا للمهاجرين",updated:"آخر تحقق",empty:"لا توجد مستجدات رسمية مؤكدة في هذه النشرة الآن.",pending:"سيظهر الموجز الأول عند موعد التحديث المجدول.",stale:"انتهت صلاحية هذه النشرة؛ ننتظر التحديث المجدول التالي.",pause:"إيقاف الحركة",resume:"تشغيل الحركة",confirmed:"قرار نافذ",announced:"إعلان رسمي",proposed:"مقترح",source:"المصدر الرسمي"},
 nl:{title:"Nederland in het kort voor nieuwkomers",updated:"Laatst gecontroleerd",empty:"Er zijn nu geen bevestigde officiële updates in dit overzicht.",pending:"De eerste briefing verschijnt bij de geplande update.",stale:"Dit overzicht is verlopen; de volgende geplande controle volgt.",pause:"Beweging pauzeren",resume:"Beweging hervatten",confirmed:"Besluit van kracht",announced:"Officieel aangekondigd",proposed:"Voorstel",source:"Officiële bron"}
};
const lang=()=>{if(fixedLanguage)return fixedLanguage==="nl"?"nl":"ar";try{return localStorage.getItem("mbo_site_lang")==="nl"?"nl":"ar"}catch{return document.documentElement.lang==="nl"?"nl":"ar"}};
const pair=(value,l)=>typeof value==="string"?value:(value&&typeof value[l]==="string"?value[l]:"");
function node(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;if(value)el.textContent=value;return el}
function render(data){const root=document.getElementById("news-ticker");if(!root)return;const l=lang(),t=text[l];root.hidden=false;root.lang=l;root.dir=l==="ar"?"rtl":"ltr";root.dataset.dir=root.dir;root.replaceChildren();
 const head=node("div","nt-head");head.append(node("h2","nt-title",t.title));
 const last=Date.parse(data?.updatedAt||"");const until=Date.parse(data?.validUntil||"");const started=Number.isFinite(last);const stale=started&&(!Number.isFinite(until)||until<Date.now());
 if(Number.isFinite(last)){const stamp=new Intl.DateTimeFormat(l==="ar"?"ar-NL":"nl-NL",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Amsterdam"}).format(last);head.append(node("span","nt-updated",`${t.updated}: ${stamp}`))}
 root.append(head);
 const items=Array.isArray(data?.items)?data.items.slice(0,6).filter(item=>item&&pair(item.title,l)&&/^https:\/\//i.test(item.url||"")):[];
 if(stale||!items.length){root.append(node("p","nt-empty",!started?t.pending:stale?t.stale:t.empty));return}
 const toggle=node("button","nt-control",root.dataset.paused==="true"?t.resume:t.pause);toggle.type="button";toggle.setAttribute("aria-pressed",String(root.dataset.paused==="true"));toggle.addEventListener("click",()=>{const paused=root.dataset.paused!=="true";root.dataset.paused=String(paused);toggle.textContent=paused?t.resume:t.pause;toggle.setAttribute("aria-pressed",String(paused))});head.append(toggle);
 const viewport=node("div","nt-viewport");viewport.setAttribute("aria-label",t.title);const track=node("div","nt-track");
 function list(hidden){const ul=node("ul","nt-list");if(hidden){ul.setAttribute("aria-hidden","true");ul.setAttribute("inert","");}for(const item of items){const li=node("li","nt-item"),category=pair(item.category,l),title=pair(item.title,l),summary=pair(item.summary,l),source=pair(item.sourceName,l),status=text[l][item.status]||text[l].announced;if(category)li.append(node("span","nt-category",category));li.append(node("span","nt-status",status));const a=node("a","",title);if(hidden)a.tabIndex=-1;a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",`${title} — ${t.source}`);li.append(a);if(summary)li.append(node("span","nt-summary",summary));if(source)li.append(node("span","nt-updated",source));ul.append(li)}return ul}
 track.append(list(false),list(true));viewport.append(track);root.append(viewport);
}
async function load(){if(loading)return;loading=true;try{const response=await fetch(file,{cache:"no-store"});if(!response.ok)throw new Error(`Ticker data: ${response.status}`);cachedData=await response.json();render(cachedData)}catch(error){console.warn("News ticker unavailable",error);render(cachedData||{items:[],validUntil:null})}finally{loading=false}}
function init(){let root=document.getElementById("news-ticker");if(!root){root=document.createElement("section");root.id="news-ticker";root.className="news-ticker";root.setAttribute("aria-live","off");const anchor=document.querySelector("header,.topbar");if(anchor)anchor.insertAdjacentElement("afterend",root);else document.body.prepend(root)}load();setInterval(()=>{if(!document.hidden)load()},300000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)load()});new MutationObserver(()=>render(cachedData)).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});window.addEventListener("storage",event=>{if(event.key==="mbo_site_lang")load()})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
