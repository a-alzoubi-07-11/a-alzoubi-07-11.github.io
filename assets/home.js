/* Home page behaviour: topic tabs, tools switch, and the stage where the interactive
   study tools (rendered by app.js into #mainContent) open. Works without app.js too. */
(()=>{"use strict";
const body=document.body;body.classList.remove("no-js");
const TOOL_IDS=["pathway","levels","mbo-beroepen","transitions","exams","salaries","compare","calculator","sources","vmbo","havovwo","mbo","hbo","wo","vavo"];
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Accessible tabs: arrow keys, Home/End; one panel visible. */
function tabs(list,onChange){
  const tabsEls=[...list.querySelectorAll('[role="tab"]')];
  const select=(tab,focus)=>{tabsEls.forEach(t=>{const on=t===tab;t.setAttribute("aria-selected",String(on));t.tabIndex=on?0:-1;const p=document.getElementById(t.getAttribute("aria-controls"));if(p)p.hidden=!on});if(focus)tab.focus();onChange&&onChange(tab)};
  tabsEls.forEach((t,i)=>{t.addEventListener("click",()=>select(t));t.addEventListener("keydown",e=>{const rtl=getComputedStyle(list).direction==="rtl";let j=null;if(e.key==="ArrowRight")j=rtl?i-1:i+1;if(e.key==="ArrowLeft")j=rtl?i+1:i-1;if(e.key==="Home")j=0;if(e.key==="End")j=tabsEls.length-1;if(j===null)return;e.preventDefault();select(tabsEls[(j+tabsEls.length)%tabsEls.length],true)})});
  const start=tabsEls.find(t=>t.getAttribute("aria-selected")==="true")||tabsEls[0];if(start)select(start);
}
document.querySelectorAll(".hm-tabs,.hm-switch").forEach(l=>tabs(l));
/* Section headings draw their orange mark once, when the section comes into view. */
if("IntersectionObserver" in window){body.classList.add("js-reveal");const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("hm-in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -15% 0px"});document.querySelectorAll(".hm-section,.hm-about").forEach(s=>io.observe(s))}else body.classList.add("no-io");


/* Site search: forgiving search over all guides and tools (assets/site-search.js). */
const ssInput=document.getElementById("siteSearchInput");
if(ssInput&&window.SiteSearch)window.SiteSearch.attach(ssInput);

/* Tool stage (Arabic page only: app.js renders the study tools into #mainContent). */
const stage=document.getElementById("hm-stage"),main=document.getElementById("mainContent");
if(!stage||!main)return;
const current=()=>(location.hash||"").replace(/^#/,"");
function open(scroll){stage.hidden=false;if(scroll)requestAnimationFrame(()=>stage.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"}))}
function close(){stage.hidden=true;try{history.replaceState(null,"",location.pathname+location.search)}catch(_){}document.getElementById("tools")?.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
document.addEventListener("click",e=>{const t=e.target.closest("[data-page]");if(t&&TOOL_IDS.includes(t.dataset.page))setTimeout(()=>open(true),0)});
stage.querySelector(".hm-stage-close")?.addEventListener("click",close);
/* Deep links (#calculator etc.) and footer buttons that call setPage directly. */
new MutationObserver(()=>{if(TOOL_IDS.includes(current()))open(false)}).observe(main,{childList:true});
if(TOOL_IDS.includes(current()))open(true);
})();
