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
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("hm-in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -15% 0px"});document.querySelectorAll(".hm-section,.hm-about").forEach(s=>io.observe(s))}else body.classList.add("no-io");


/* Site search (Arabic page): app.js searches its study data; add the site's guides on top. */
const box=document.getElementById("searchResults"),input=document.getElementById("searchInput");
if(box&&input){
  const norm=s=>(s||"").toLowerCase().normalize("NFKD").replace(/[̀-ًͯ-ٰٕـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
  const seen=new Set(),guides=[];
  document.querySelectorAll(".hm-panel").forEach(panel=>{const topic=panel.querySelector("h3")?.textContent||"";panel.querySelectorAll(".hm-links a").forEach(a=>{if(seen.has(a.href))return;seen.add(a.href);const slug=a.getAttribute("href").split("/").pop().replace(".html","").replace(/-/g," ");guides.push({a,title:a.textContent,topic,hay:norm(a.textContent+" "+topic+" "+slug)})})});
  const match=q=>{const nq=norm(q),words=nq.split(" ").filter(w=>w.length>1);if(!words.length)return[];
    const scored=guides.map(g=>{const nt=norm(g.title),has=(h,w)=>w.length>2?h.includes(w):(" "+h).includes(" "+w);const th=words.filter(w=>has(nt,w)).length,ah=words.filter(w=>has(g.hay,w)).length;return{g,th,score:th*2+ah+(nt.includes(nq)?3:0),ok:ah>=Math.max(1,Math.ceil(words.length*0.6))}}).filter(x=>x.ok);
    const best=Math.max(0,...scored.map(x=>x.th));
    return scored.filter(x=>best===0||x.th>0).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.g)};
  const render=()=>{const q=input.value.trim();if(!q||box.hidden||box.querySelector(".hm-sr-group"))return;const found=match(q);if(!found.length)return;
    box.querySelector(".search-empty")?.remove();
    const grp=document.createElement("div");grp.className="hm-sr-group";
    const head=document.createElement("div");head.className="search-cat";head.innerHTML='<span>أدلة الموقع</span><span class="search-cat-count">'+found.length+'</span>';grp.append(head);
    found.forEach(g=>{const l=document.createElement("a");l.className="search-result hm-sr";l.href=g.a.getAttribute("href");l.innerHTML='<div class="search-texts"><div class="search-t"></div><div class="search-s"></div></div>';l.querySelector(".search-t").textContent=g.title;l.querySelector(".search-s").textContent=g.topic;grp.append(l)});
    box.prepend(grp)};
  new MutationObserver(render).observe(box,{childList:true,attributes:true,attributeFilter:["hidden"]});
}

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
