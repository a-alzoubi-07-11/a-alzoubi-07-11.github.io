/* Partner offers bar (sponsored, clearly labelled). Data: /assets/partners.json.
   - Shows only active offers whose dates include today (and whose topics match the page, if set).
   - Moving text line (text only) + buttons that stand still, so every tap works the first time.
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
.pb{position:relative;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;max-width:100%;margin:0 auto;padding:6px 10px;background:#fff8e6;border-block:1px solid #f1dfb0;color:#3d2f00;font-size:14px;line-height:1.4;overflow:hidden}
.pb-tag{flex:none;font-size:11px;font-weight:700;background:#3d2f00;color:#fff8e6;border-radius:4px;padding:2px 6px}
.pb-view{flex:1 1 200px;min-width:0;overflow:hidden;display:block;color:inherit!important;text-decoration:none!important;min-height:30px;align-content:center;mask-image:linear-gradient(90deg,transparent,#000 16px,#000 calc(100% - 16px),transparent)}
.pb-track{display:flex;width:max-content;gap:48px;animation:pb-move var(--pb-dur,22s) linear infinite;will-change:transform}
[dir=rtl] .pb-track{animation-name:pb-move-rtl}
.pb:hover .pb-track{animation-play-state:paused}
@keyframes pb-move{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pb-move-rtl{from{transform:translateX(0)}to{transform:translateX(50%)}}
.pb-msg{white-space:nowrap}
.pb-msg b{font-weight:700}
.pb-code{font-family:ui-monospace,Menlo,Consolas,monospace;background:#fff;border:1px dashed #b8860b;border-radius:4px;padding:0 5px;direction:ltr;unicode-bidi:isolate}
.pb-acts{display:flex;align-items:center;gap:6px;flex:none}
.pb button,.pb a{font:inherit;color:#5a3d00}
.pb-btn{display:inline-flex;align-items:center;gap:4px;min-height:32px;border:1px solid #d9b65c;background:#fff;border-radius:999px;padding:2px 12px;cursor:pointer;text-decoration:none!important;font-weight:600;white-space:nowrap}
.pb-btn.pb-wa{border-color:#25d366}
.pb-x{flex:none;border:0;background:transparent;font-size:20px;line-height:1;width:32px;height:32px;cursor:pointer;color:#5a3d00;margin-inline-start:auto}
@media (max-width:600px){.pb{font-size:13px;padding:6px 8px}.pb-view{flex-basis:calc(100% - 90px);order:1}.pb-tag{order:0}.pb-x{order:2}.pb-acts{order:3;width:100%;justify-content:flex-start}}
@media (prefers-reduced-motion: reduce){.pb-track{animation:none;width:auto;flex-wrap:wrap}.pb-msg{white-space:normal}.pb-track>.pb-msg[aria-hidden]{display:none}.pb-view{mask-image:none}}
@media print{.pb{display:none}}
@media (prefers-color-scheme: dark){:root:not([data-theme=light]) .pb{background:#2a2410;border-color:#4a3f1c;color:#f3e6c0}:root:not([data-theme=light]) .pb button,:root:not([data-theme=light]) .pb a{color:#f3e6c0}:root:not([data-theme=light]) .pb-code,:root:not([data-theme=light]) .pb-btn{background:#1d1a0c}}
`;
const nameOf=o=>nl&&o.partner_nl?o.partner_nl:o.partner;
const titleOf=o=>(o.title&&(o.title[nl?"nl":"ar"]||o.title.ar||o.title.nl))||"";
/* moving line = text only (nothing to aim at); the buttons stand still next to it, so every tap works the first time */
function msg(o,dup){return `<span class="pb-msg"${dup?' aria-hidden="true"':""}><b>${esc(nameOf(o))}:</b> ${esc(titleOf(o))}${o.code?` — ${T.code} <span class="pb-code">${esc(o.code)}</span>`:""}</span>`;}
function acts(o){return (o.code?`<button type="button" class="pb-btn pb-copy" data-code="${esc(o.code)}">${T.copy} ${esc(o.code)}</button>`:"")
  +`<a class="pb-btn" href="${esc(o.url)}" target="_blank" rel="sponsored noopener">${T.open}</a>`
  +(/^\d{8,15}$/.test(o.whatsapp||"")?`<a class="pb-btn pb-wa" href="https://wa.me/${o.whatsapp}" target="_blank" rel="sponsored noopener">WhatsApp</a>`:"");}
function render(items){
  const st=document.createElement("style");st.textContent=css;document.head.append(st);
  const bar=document.createElement("aside");bar.className="pb";bar.setAttribute("aria-label",T.ad+" – "+T.label);bar.title=T.note;
  const line=items.map(o=>msg(o,false)).join("")+items.map(o=>msg(o,true)).join("");
  bar.innerHTML=`<span class="pb-tag">${T.ad}</span><a class="pb-view" href="${esc(items[0].url)}" target="_blank" rel="sponsored noopener"><span class="pb-track">${line}</span></a>`
    +`<span class="pb-acts">${acts(items[0])}</span><button type="button" class="pb-x" aria-label="${T.close}">×</button>`;
  // speed ~ 60px per second, whatever the text length
  requestAnimationFrame(()=>{const tr=bar.querySelector(".pb-track");tr.style.setProperty("--pb-dur",Math.max(12,Math.round(tr.scrollWidth/2/60))+"s")});
  // several partners: the buttons follow the offers one by one
  if(items.length>1){let i=0;const box=bar.querySelector(".pb-acts"),view=bar.querySelector(".pb-view");
    setInterval(()=>{if(bar.matches(":hover,:focus-within"))return;i=(i+1)%items.length;box.innerHTML=acts(items[i]);view.href=items[i].url},8000);}
  bar.addEventListener("click",async e=>{const c=e.target.closest(".pb-copy");if(c){e.preventDefault();let ok=false;try{await navigator.clipboard.writeText(c.dataset.code);ok=true}catch(_){}
      const old=c.textContent;c.textContent=ok?T.copied:c.dataset.code;setTimeout(()=>{c.textContent=old},2000);}
    if(e.target.closest(".pb-x")){bar.remove();try{sessionStorage.setItem(KEY,"1")}catch(_){}}});
  const header=["header.topbar","header.site-header","header.top","header.site-head","body > header"].map(s=>document.querySelector(s)).find(Boolean);
  if(header&&header.parentNode)header.parentNode.insertBefore(bar,header.nextSibling);else document.body.prepend(bar);
}
fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(items.length)render(items)}).catch(()=>{});
})();
