/* Site chrome: sticky header that hides while reading down and returns on scroll up
   (phones and small tablets), plus a "back to top" button on long pages.
   Self-contained: injects its own small stylesheet and works with every page template. */
(()=>{"use strict";
const header=["header.topbar","header.site-header","header.top","header.site-head","body > nav","body > header"].map(s=>document.querySelector(s)).find(Boolean);
const rtl=(document.documentElement.dir||getComputedStyle(document.documentElement).direction)==="rtl";
const lang=(document.documentElement.lang||"ar").slice(0,2);
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
const small=matchMedia("(max-width: 820px)");

const css=`
.sc-sticky{position:sticky!important;top:0;z-index:300;transition:transform .28s ease, box-shadow .28s ease;will-change:transform}
.sc-sticky.sc-scrolled{box-shadow:none}
.sc-sticky.sc-hidden{transform:translateY(-100%);box-shadow:none}
.sc-top{position:fixed;z-index:310;inset-inline-start:16px;bottom:calc(24px + env(safe-area-inset-bottom,0px));
  width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;
  background:rgba(29,29,31,.82);color:#fff;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 6px 20px rgba(0,0,0,.18);
  opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .25s ease, transform .25s ease}
.sc-top.sc-show{opacity:1;transform:none;pointer-events:auto}
.sc-top:hover{background:#1d1d1f}
.sc-top:focus-visible{outline:3px solid rgba(0,113,227,.55);outline-offset:3px}
.sc-top svg{width:20px;height:20px}
@media (max-width:820px){.sc-top{bottom:calc(88px + env(safe-area-inset-bottom,0px));width:44px;height:44px}}
@media (prefers-reduced-motion: reduce){.sc-sticky,.sc-top{transition:none}}
@media print{.sc-top{display:none}}
.sc-search-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;min-height:34px!important;border:0;border-radius:50%;background:transparent;color:#1d1d1f;cursor:pointer;flex:none;padding:0!important;opacity:.85}
.sc-search-btn:hover{background:rgba(0,0,0,.05);opacity:1}
.sc-search-btn svg{width:18px;height:18px}
.sc-ov{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.28);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;justify-content:center;align-items:flex-start;padding:max(10vh,24px) 16px 16px;opacity:0;transition:opacity .2s}
.sc-ov.sc-open{opacity:1}
.sc-panel{width:min(640px,100%);background:#fff;border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.25);padding:14px;font-family:var(--ap-font,system-ui)}
.sc-row{display:flex;align-items:center;gap:8px}
.sc-row .ss-wrap{flex:1}
.sc-row input{width:100%;font:inherit;font-size:18px;border:0!important;background:#f5f5f7!important;border-radius:12px!important;padding:14px 44px 14px 14px!important;color:#1d1d1f;outline:0;box-shadow:none!important}
[dir="rtl"] .sc-row input{padding:14px 14px 14px 44px!important}
.sc-close{font:inherit;font-size:15px;border:0;background:none;color:#0066cc;cursor:pointer;padding:8px 6px;min-height:40px}
.sc-panel .ss-list{position:static!important;box-shadow:none!important;padding:6px 0 0!important;max-height:60vh}
@media(max-width:600px){.sc-ov{padding:10px}.sc-panel{border-radius:16px}}
@media (prefers-reduced-motion: reduce){.sc-ov{transition:none}}`;
const style=document.createElement("style");style.id="site-chrome-css";style.textContent=css;document.head.append(style);

/* ---- header ---- */
if(header){
  header.classList.add("sc-sticky");
  const setPad=()=>document.documentElement.style.scrollPaddingTop=(header.offsetHeight+12)+"px";
  setPad();addEventListener("resize",setPad,{passive:true});
  let lastY=scrollY,ticking=false;
  const busy=()=>header.contains(document.activeElement)||header.querySelector(".open,[aria-expanded='true']")||
    (document.getElementById("searchResults")&&!document.getElementById("searchResults").hidden&&header.contains(document.getElementById("searchResults")));
  const update=()=>{ticking=false;const y=scrollY,dy=y-lastY;
    header.classList.toggle("sc-scrolled",y>4);
    if(!small.matches||y<header.offsetHeight+40||busy()){header.classList.remove("sc-hidden")}
    else if(dy>6){header.classList.add("sc-hidden")}
    else if(dy<-6){header.classList.remove("sc-hidden")}
    lastY=y};
  addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  header.addEventListener("focusin",()=>header.classList.remove("sc-hidden"));
  small.addEventListener?.("change",()=>header.classList.remove("sc-hidden"));
}


/* ---- site search: a magnifier in every header opens the forgiving search ---- */
const L=lang==="nl"?{btn:"Zoeken",close:"Sluiten",label:"Zoek op de website"}:{btn:"بحث",close:"إغلاق",label:"ابحث في الموقع"};
function loadSearch(){return window.SiteSearch?Promise.resolve():new Promise((ok,fail)=>{const s=document.createElement("script");s.src="/assets/site-search.js?v=1";s.onload=ok;s.onerror=fail;document.head.append(s)})}
let ov=null,lastFocus=null;
function openSearch(){
  const inline=document.getElementById("siteSearchInput");
  if(inline){scrollTo({top:0,behavior:reduce.matches?"auto":"smooth"});setTimeout(()=>inline.focus(),reduce.matches?0:300);return}
  lastFocus=document.activeElement;
  if(!ov){
    ov=document.createElement("div");ov.className="sc-ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label",L.label);
    ov.innerHTML='<div class="sc-panel"><div class="sc-row"><div class="ss-wrap"><input type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" aria-label="'+L.label+'"></div><button type="button" class="sc-close">'+L.close+'</button></div></div>';
    document.body.append(ov);
    ov.addEventListener("click",e=>{if(e.target===ov)closeSearch()});
    ov.querySelector(".sc-close").addEventListener("click",closeSearch);
    ov.addEventListener("keydown",e=>{if(e.key==="Escape")closeSearch();if(e.key==="Tab"){const f=[...ov.querySelectorAll("input,button,a[href]")].filter(x=>x.offsetParent);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    loadSearch().then(()=>window.SiteSearch.attach(ov.querySelector("input"),{keepOpen:true,onEscape:closeSearch,container:ov.querySelector(".sc-panel")})).catch(()=>{});
  }
  ov.hidden=false;document.documentElement.style.overflow="hidden";
  requestAnimationFrame(()=>{ov.classList.add("sc-open");ov.querySelector("input").focus()});
}
function closeSearch(){if(!ov)return;ov.classList.remove("sc-open");ov.hidden=true;document.documentElement.style.overflow="";lastFocus&&lastFocus.focus&&lastFocus.focus()}
if(header){
  const b=document.createElement("button");b.type="button";b.className="sc-search-btn";b.setAttribute("aria-label",L.label);b.title=L.btn;
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  b.addEventListener("click",openSearch);
  const anchor=header.querySelector(".lang-button, .lang-btn, .tl-right, a[hreflang]");
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(b,anchor);else header.append(b);
}
addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea|select/i.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();openSearch()}});

/* ---- mark the current topic in chip navigation ---- */
document.querySelectorAll(".topic-nav a").forEach(a=>{try{if(new URL(a.href).pathname===location.pathname)a.setAttribute("aria-current","page")}catch(_){}});

/* ---- back to top ---- */
const btn=document.createElement("button");
btn.type="button";btn.className="sc-top";
btn.setAttribute("aria-label",lang==="nl"?"Terug naar boven":"العودة إلى أعلى الصفحة");
btn.title=btn.getAttribute("aria-label");
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
btn.addEventListener("click",()=>{scrollTo({top:0,behavior:reduce.matches?"auto":"smooth"});
  const target=document.querySelector("main h1, h1")||document.body;setTimeout(()=>{target.setAttribute("tabindex","-1");target.focus({preventScroll:true})},reduce.matches?0:450)});
document.body.append(btn);
let t2=false;
const check=()=>{t2=false;const doc=document.documentElement;const long=doc.scrollHeight>innerHeight*2.5;
  const past=scrollY>(doc.scrollHeight-innerHeight)*0.5;btn.classList.toggle("sc-show",long&&past)};
addEventListener("scroll",()=>{if(!t2){t2=true;requestAnimationFrame(check)}},{passive:true});
check();
void rtl;
})();
