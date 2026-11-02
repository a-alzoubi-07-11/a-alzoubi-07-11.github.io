/* Partner offers bar (sponsored, clearly labelled). Data: /assets/partners.json.
   - Shows only active offers whose dates include today (and whose topics match the page, if set).
   - Slowly scrolling strip; pauses on hover, focus and touch so links and the copy button take ONE tap.
   - prefers-reduced-motion: no movement, the strip simply scrolls sideways by hand.
   - The visitor can close it for this browser session. No tracking, no cookies. */
(()=>{"use strict";
if(window.__partnersBar)return;window.__partnersBar=true;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{ad:"Advertentie",label:"Partners en aanbiedingen",code:"Code",copy:"Kopieer",copied:"Gekopieerd",open:"Bekijk aanbod",all:"Alle aanbiedingen",close:"Sluiten",note:"Betaalde samenwerking. Gids Nederland garandeert de diensten van partners niet."}
            :{ad:"إعلان",label:"شركاء وعروض",code:"الكود",copy:"نسخ",copied:"تم النسخ",open:"اطّلع على العرض",all:"كل العروض",close:"إغلاق",note:"تعاون مدفوع. دليل هولندا لا يضمن خدمات الشركاء."};
const KEY="gn-partners-closed";
try{if(sessionStorage.getItem(KEY)==="1")return;}catch(_){}
const today=new Date().toISOString().slice(0,10);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
function live(items){const path=location.pathname.toLowerCase();
  return (items||[]).filter(o=>o&&o.active===true&&okUrl(o.url)&&(!o.start||o.start<=today)&&(!o.end||o.end>=today)
    &&(!Array.isArray(o.topics)||!o.topics.length||o.topics.some(t=>path.includes(String(t).toLowerCase()))));}
const css=`
.pb{position:relative;z-index:5;display:flex;align-items:center;gap:8px;max-width:100%;margin:0 auto;padding:6px 10px;background:#fff8e6;border-block:1px solid #f1dfb0;color:#3d2f00;font-size:14px;line-height:1.4;overflow:hidden}
.pb-tag{flex:none;font-size:11px;font-weight:700;letter-spacing:.02em;background:#3d2f00;color:#fff8e6;border-radius:4px;padding:2px 6px}
.pb-view{flex:1;min-width:0;overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 18px,#000 calc(100% - 18px),transparent)}
.pb-track{display:flex;width:max-content;gap:28px;animation:pb-move var(--pb-dur,40s) linear infinite}
[dir=rtl] .pb-track{animation-name:pb-move-rtl}
.pb:hover .pb-track,.pb:focus-within .pb-track,.pb.pb-hold .pb-track{animation-play-state:paused}
@keyframes pb-move{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pb-move-rtl{from{transform:translateX(0)}to{transform:translateX(50%)}}
.pb-item{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.pb-item b{font-weight:700}
.pb-code{font-family:ui-monospace,Menlo,Consolas,monospace;background:#fff;border:1px dashed #b8860b;border-radius:4px;padding:1px 6px;direction:ltr}
.pb button,.pb a{font:inherit;color:#5a3d00}
.pb-copy{border:1px solid #d9b65c;background:#fff;border-radius:999px;padding:2px 10px;cursor:pointer;min-height:30px}
.pb-go{font-weight:600;text-decoration:underline;text-underline-offset:2px;min-height:30px;display:inline-flex;align-items:center}
.pb-all{flex:none;font-size:13px;white-space:nowrap}
.pb-x{flex:none;border:0;background:transparent;font-size:18px;line-height:1;width:32px;height:32px;cursor:pointer;color:#5a3d00}
@media (prefers-reduced-motion: reduce){.pb-track{animation:none}.pb-view{overflow-x:auto;mask-image:none}}
/* touch screens: nothing moves under the finger; one offer at a time, changing gently */
.pb.pb-touch .pb-track{animation:none;width:auto;display:block}
.pb.pb-touch .pb-view{mask-image:none}
.pb.pb-touch .pb-item{display:none;white-space:normal;flex-wrap:wrap;row-gap:4px}
.pb.pb-touch .pb-item.pb-on{display:inline-flex;animation:pb-fade .4s ease}
@keyframes pb-fade{from{opacity:0}to{opacity:1}}
@media (max-width:600px){.pb{font-size:13px;padding:5px 8px}.pb-all{display:none}}
@media print{.pb{display:none}}
@media (prefers-color-scheme: dark){:root:not([data-theme=light]) .pb{background:#2a2410;border-color:#4a3f1c;color:#f3e6c0}:root:not([data-theme=light]) .pb button,:root:not([data-theme=light]) .pb a{color:#f3e6c0}:root:not([data-theme=light]) .pb-code,:root:not([data-theme=light]) .pb-copy{background:#1d1a0c}}
`;
function itemHtml(o,dup){const name=nl&&o.partner_nl?o.partner_nl:o.partner;const title=(o.title&&(o.title[nl?"nl":"ar"]||o.title.ar||o.title.nl))||"";
  return `<span class="pb-item"${dup?' aria-hidden="true"':""}><b>${esc(name)}:</b> ${esc(title)}`
   +(o.code?` <span>${T.code}</span> <span class="pb-code">${esc(o.code)}</span> <button type="button" class="pb-copy" data-code="${esc(o.code)}"${dup?' tabindex="-1"':""}>${T.copy}</button>`:"")
   +` <a class="pb-go" href="${esc(o.url)}" target="_blank" rel="sponsored noopener"${dup?' tabindex="-1"':""}>${T.open}</a>`
   +(/^\d{8,15}$/.test(o.whatsapp||"")?` <a class="pb-go" href="https://wa.me/${o.whatsapp}" target="_blank" rel="sponsored noopener"${dup?' tabindex="-1"':""}>WhatsApp</a>`:"")+`</span>`;}
function render(items){
  const st=document.createElement("style");st.textContent=css;document.head.append(st);
  const bar=document.createElement("aside");bar.className="pb";bar.setAttribute("aria-label",T.ad+" – "+T.label);bar.title=T.note;
  const one=items.map(o=>itemHtml(o,false)).join("");const two=items.map(o=>itemHtml(o,true)).join("");
  bar.innerHTML=`<span class="pb-tag">${T.ad}</span><div class="pb-view"><div class="pb-track">${one}${two}</div></div>`
    +`<a class="pb-all" href="${nl?"/nl/partners.html":"/partners.html"}">${T.all}</a><button type="button" class="pb-x" aria-label="${T.close}">×</button>`;
  bar.querySelector(".pb-track").style.setProperty("--pb-dur",Math.max(25,items.length*22)+"s");
  const touch=matchMedia("(hover: none), (pointer: coarse)").matches;
  if(touch){bar.classList.add("pb-touch");const its=[...bar.querySelectorAll(".pb-item:not([aria-hidden])")];let i=0;
    const show=()=>its.forEach((el,k)=>el.classList.toggle("pb-on",k===i));show();
    if(its.length>1&&!matchMedia("(prefers-reduced-motion: reduce)").matches)setInterval(()=>{if(!bar.classList.contains("pb-hold")){i=(i+1)%its.length;show()}},7000);}
  // hold still while a finger is on it, so the first tap hits its target
  let t=null;bar.addEventListener("pointerdown",()=>{bar.classList.add("pb-hold");clearTimeout(t);t=setTimeout(()=>bar.classList.remove("pb-hold"),5000)},{passive:true});
  bar.addEventListener("click",async e=>{const c=e.target.closest(".pb-copy");if(c){let ok=false;try{await navigator.clipboard.writeText(c.dataset.code);ok=true}catch(_){}
      c.textContent=ok?T.copied:c.dataset.code;setTimeout(()=>{c.textContent=T.copy},2000);}
    if(e.target.closest(".pb-x")){bar.remove();try{sessionStorage.setItem(KEY,"1")}catch(_){}}});
  const header=["header.topbar","header.site-header","header.top","header.site-head","body > header"].map(s=>document.querySelector(s)).find(Boolean);
  if(header&&header.parentNode)header.parentNode.insertBefore(bar,header.nextSibling);else document.body.prepend(bar);
}
fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(items.length)render(items)}).catch(()=>{});
})();
