/* Partner offers as a slim, full-width moving strip right under the site header. Data: /assets/partners.json.
   - Shows only active offers whose dates include today and whose topics match the page.
   - Clearly labelled ("إعلان" / "Advertentie"), separate from the official news card.
   - Arabic text moves left-to-right (so each sentence enters with its first word), Dutch right-to-left.
   - Calm: 30 px/s, a pause button, and it stops after 3 passes. Pauses on hover/focus and while the tab is hidden;
     with prefers-reduced-motion it stands still.
   - The visitor can close it for this browser session. No tracking, no cookies. */
(()=>{"use strict";
if(window.__partnersBar)return;window.__partnersBar=true;
const HOME=/^\/(nl\/)?(index\.html)?$/.test(location.pathname);
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{pause:"Strook pauzeren",play:"Strook afspelen",ad:"Advertentie",code:"Code",close:"Sluiten",visit:"Bekijk",wa:"App via WhatsApp",all:"Alle aanbiedingen"}
            :{pause:"إيقاف حركة الشريط",play:"تشغيل حركة الشريط",ad:"إعلان",code:"كود الخصم",close:"إغلاق",visit:"زيارة",wa:"راسلهم واتساب",all:"كل العروض"};
const KEY="gn-partners-closed";
try{if(sessionStorage.getItem(KEY)==="1")return;}catch(_){}
const today=new Date().toISOString().slice(0,10);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const SPEED=30; // px per second: calm reading speed
const LOOPS=3;  // then it stands still (moving content must not run forever)
function live(items){const path=location.pathname.toLowerCase();
  return (items||[]).filter(o=>o&&o.active===true&&okUrl(o.url)&&(!o.start||o.start<=today)&&(!o.end||o.end>=today)
    &&(!Array.isArray(o.topics)||!o.topics.length||o.topics.some(t=>{t=String(t).toLowerCase();return t==="home"?HOME:path.includes(t)})));}
const css=`
.pt{position:relative;display:flex;align-items:stretch;height:34px;width:100%;background:#1d1d1f;color:#f5f5f7;font-family:var(--ap-font,system-ui,sans-serif);font-size:13.5px;line-height:34px;overflow:hidden;z-index:5}
.pt-ad{flex:none;display:flex;align-items:center;padding:0 12px;background:#ee731c;color:#fff;font-weight:700;font-size:12px;letter-spacing:.02em}
.pt-view{position:relative;flex:1;min-width:0;overflow:hidden;direction:ltr;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)}
.pt-track{display:inline-flex;white-space:nowrap;will-change:transform}
.pt-copy{display:inline-flex;flex:none}
.pt-item{display:inline-flex;align-items:center;gap:8px;padding:0 22px;color:#f5f5f7!important;text-decoration:none!important}
.pt-item:hover .pt-go,.pt-item:focus-visible .pt-go{text-decoration:underline}
.pt-name{font-weight:700}
.pt-sep{opacity:.45}
.pt-kind{color:#c7c7cc;font-size:12.5px}
.pt-code{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-weight:700;letter-spacing:.04em;background:rgba(255,255,255,.12);border-radius:5px;padding:0 6px;line-height:22px;direction:ltr;unicode-bidi:isolate}
.pt-go{color:#6cb6ff;font-weight:600}
.pt-dot{display:inline-block;align-self:center;flex:none;width:5px;height:5px;border-radius:50%;background:#ee731c;margin:0 4px}
.pt-p{flex:none;display:grid;place-items:center;width:34px!important;height:34px!important;min-width:0;min-height:0;padding:0;border:0;background:transparent;color:#a1a1a6;cursor:pointer}
.pt-p:hover{color:#fff}.pt-p svg{width:13px;height:13px;fill:currentColor}
.pt.pt-static .pt-p{display:none}
.pt-x{flex:none;display:grid;place-items:center;width:34px!important;height:34px!important;min-width:0;min-height:0;padding:0;border:0;background:transparent;color:#a1a1a6;cursor:pointer}
.pt-x:hover{color:#fff}
.pt-x svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.pt :focus-visible{outline:2px solid #6cb6ff;outline-offset:-2px}
.pt.pt-static .pt-track{animation:none!important}
.pt.pt-static .pt-copy:not(:first-child){display:none}
@media print{.pt{display:none}}
`;
const PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
function item(o){
  const name=nl&&o.partner_nl?o.partner_nl:o.partner,title=(o.title&&(o.title[nl?"nl":"ar"]||o.title.ar||o.title.nl))||"",kind=(o.kind&&(o.kind[nl?"nl":"ar"]||o.kind.ar))||"";
  // strip_link "whatsapp": the strip opens a WhatsApp chat with the partner, with a ready message naming the site and the code
  const wa=o.strip_link==="whatsapp"&&/^\d{8,15}$/.test(o.whatsapp||"");
  const msg=nl?`Hallo, ik kom via Gids Nederland (gidsnederland.nl)${o.code?` en wil graag de korting met code ${o.code}`:""}.`
              :`مرحباً، وصلت إليكم من موقع دليل هولندا بالعربية (gidsnederland.nl)${o.code?` وأريد الاستفادة من الخصم بالكود ${o.code}`:""}.`;
  const href=wa?`https://wa.me/${o.whatsapp}?text=${encodeURIComponent(msg)}`:o.url;
  return `<a class="pt-item" dir="${nl?"ltr":"rtl"}" href="${esc(href)}" target="_blank" rel="sponsored noopener">`
    +`<span class="pt-name">${esc(name)}</span>`+(kind?`<span class="pt-kind">${esc(kind)}</span>`:"")+`<span class="pt-sep">·</span><span>${esc(title)}</span>`
    +(o.code?`<span class="pt-sep">·</span><span>${T.code}</span><span class="pt-code">${esc(o.code)}</span>`:"")
    +`<span class="pt-sep">·</span><span class="pt-go">${wa?T.wa:T.visit} ${nl?"→":"←"}</span></a><span class="pt-dot" aria-hidden="true"></span>`;
}
function render(items){
  const st=document.createElement("style");st.textContent=css;document.head.append(st);
  const bar=document.createElement("aside");bar.className="pt";bar.dir=nl?"ltr":"rtl";bar.setAttribute("aria-label",T.ad);
  const one=items.map(item).join("");
  bar.innerHTML=`<span class="pt-ad">${T.ad}</span><div class="pt-view"><div class="pt-track"><div class="pt-copy">${one}</div></div></div>`
    +`<button type="button" class="pt-p" aria-pressed="false" aria-label="${T.pause}">${PAUSE}</button>`
    +`<button type="button" class="pt-x" aria-label="${T.close}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></button>`;
  bar.querySelector(".pt-x").addEventListener("click",()=>{bar.remove();try{sessionStorage.setItem(KEY,"1")}catch(_){}});
  // right under the site header (same header site-chrome.js makes sticky); fall back to the top of <main>/<body>
  const header=["header.topbar","header.site-header","header.top","header.site-head","body > nav","body > header"].map(s=>document.querySelector(s)).find(Boolean);
  if(header)header.after(bar);else{const main=document.querySelector("main");if(main)main.before(bar);else document.body.prepend(bar);}
  const view=bar.querySelector(".pt-view"),track=bar.querySelector(".pt-track"),copy=track.firstElementChild;
  let anim=null;
  function build(){
    lastW=view.clientWidth;
    if(anim){anim.cancel();anim=null}
    copy.innerHTML=one;track.querySelectorAll(".pt-copy:not(:first-child)").forEach(n=>n.remove());
    // fill one copy until it is at least as wide as the strip, then add a twin for a seamless loop
    let guard=0;while(copy.scrollWidth<view.clientWidth&&guard++<20)copy.insertAdjacentHTML("beforeend",one);
    if(reduce){bar.classList.add("pt-static");return}
    const twin=copy.cloneNode(true);twin.setAttribute("aria-hidden","true");twin.querySelectorAll("a").forEach(a=>a.tabIndex=-1);track.append(twin);
    const w=copy.getBoundingClientRect().width,dur=w/SPEED*1000;
    const frames=nl?[{transform:"translateX(0)"},{transform:`translateX(${-w}px)`}]   // Dutch: right-to-left
                   :[{transform:`translateX(${-w}px)`},{transform:"translateX(0)"}];  // Arabic: left-to-right
    anim=track.animate(frames,{duration:dur,iterations:LOOPS,easing:"linear"});
    anim.onfinish=()=>{anim=null;bar.classList.add("pt-static");track.style.transform="none"};
  }
  let userPaused=false;
  const pause=()=>anim&&anim.pause(),play=()=>anim&&!document.hidden&&!userPaused&&anim.play();
  const pb=bar.querySelector(".pt-p");
  pb.addEventListener("click",()=>{userPaused=!userPaused;pb.setAttribute("aria-pressed",String(userPaused));pb.setAttribute("aria-label",userPaused?T.play:T.pause);pb.innerHTML=userPaused?PLAY:PAUSE;userPaused?pause():play()});
  bar.addEventListener("mouseenter",pause);bar.addEventListener("mouseleave",play);
  bar.addEventListener("focusin",pause);bar.addEventListener("focusout",play);
  document.addEventListener("visibilitychange",()=>document.hidden?pause():play());
  let rw=0,lastW=0;addEventListener("resize",()=>{clearTimeout(rw);rw=setTimeout(()=>{if(view.clientWidth!==lastW)build()},200)},{passive:true});
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(build);
}
function start(){fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(items.length)render(items)}).catch(()=>{});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
