/* Site chrome: sticky header that hides while reading down and returns on scroll up
   (phones and small tablets), plus a "back to top" button on long pages.
   Self-contained: injects its own small stylesheet and works with every page template. */
(()=>{"use strict";
const header=document.querySelector("header.topbar, header.site-header, body > header");
const rtl=(document.documentElement.dir||getComputedStyle(document.documentElement).direction)==="rtl";
const lang=(document.documentElement.lang||"ar").slice(0,2);
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
const small=matchMedia("(max-width: 820px)");

const css=`
.sc-sticky{position:sticky!important;top:0;z-index:300;transition:transform .28s ease, box-shadow .28s ease;will-change:transform}
.sc-sticky.sc-scrolled{box-shadow:0 6px 18px rgba(19,33,58,.10)}
.sc-sticky.sc-hidden{transform:translateY(-100%);box-shadow:none}
.sc-top{position:fixed;z-index:310;inset-inline-start:16px;bottom:calc(24px + env(safe-area-inset-bottom,0px));
  width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;
  background:#13213A;color:#fff;box-shadow:0 6px 18px rgba(19,33,58,.25);
  opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .25s ease, transform .25s ease}
.sc-top.sc-show{opacity:1;transform:none;pointer-events:auto}
.sc-top:hover{background:#1d3157}
.sc-top:focus-visible{outline:3px solid #FF8A2B;outline-offset:3px}
.sc-top svg{width:20px;height:20px}
@media (max-width:820px){.sc-top{bottom:calc(88px + env(safe-area-inset-bottom,0px));width:44px;height:44px}}
@media (prefers-reduced-motion: reduce){.sc-sticky,.sc-top{transition:none}}
@media print{.sc-top{display:none}}`;
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
