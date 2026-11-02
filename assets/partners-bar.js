/* Partner offer card on guide pages (sponsored, clearly labelled). Data: /assets/partners.json.
   - Shows only active offers whose dates include today and whose topics match the page.
   - On the homepages the offers live inside the "updates" strip (news-ticker.js), so nothing is added here.
   - Quiet, static card (no moving text). The visitor can close it for this browser session. No tracking, no cookies. */
(()=>{"use strict";
if(window.__partnersBar)return;window.__partnersBar=true;
const HOME=/^\/(nl\/)?(index\.html)?$/.test(location.pathname);
if(HOME&&(window.__updatesStrip||document.getElementById("news-ticker")))return;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{ad:"Advertentie",code:"Kortingscode",copy:"Kopieer code",copied:"Gekopieerd",visit:"Naar de website",wa:"WhatsApp",all:"Alle aanbiedingen",close:"Sluiten",note:"Betaalde samenwerking. Wij garanderen de diensten van partners niet."}
            :{ad:"إعلان",code:"كود الخصم",copy:"انسخ الكود",copied:"تم النسخ",visit:"زيارة الموقع",wa:"واتساب",all:"كل العروض",close:"إغلاق",note:"تعاون مدفوع. لا نضمن خدمات الشركاء."};
const KEY="gn-partners-closed";
try{if(sessionStorage.getItem(KEY)==="1")return;}catch(_){}
const today=new Date().toISOString().slice(0,10);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
function live(items){const path=location.pathname.toLowerCase();
  return (items||[]).filter(o=>o&&o.active===true&&okUrl(o.url)&&(!o.start||o.start<=today)&&(!o.end||o.end>=today)
    &&(!Array.isArray(o.topics)||!o.topics.length||o.topics.some(t=>{t=String(t).toLowerCase();return t==="home"?HOME:path.includes(t)})));}
const ICO={copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15"/></svg>',
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>'};
const css=`
.pb{position:relative;margin:20px 0;padding:16px 18px 14px;border-radius:18px;background:#f5f5f7;color:#1d1d1f;font-family:var(--ap-font,system-ui,sans-serif);font-size:15px;line-height:1.5}
.pb-top{display:flex;align-items:center;gap:8px;font-size:13px;color:#6e6e73;padding-inline-end:36px}
.pb-ad{border:1px solid #d2d2d7;border-radius:6px;padding:0 6px;font-size:11px;line-height:18px;font-weight:600}
.pb-name{font-weight:600}
.pb-title{margin:6px 0 0;font-size:18px;line-height:1.35;font-weight:600;color:#1d1d1f}
.pb-note{margin:4px 0 0;font-size:13px;color:#86868b}
.pb-note a{color:#0066cc}
.pb-acts{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}
.pb-btn{display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:0 16px;border-radius:999px;font:inherit;font-size:14px;font-weight:500;text-decoration:none!important;cursor:pointer;border:0;white-space:nowrap}
.pb-primary{background:#0071e3;color:#fff!important}.pb-primary:hover{background:#0077ed}
.pb-ghost{background:transparent;color:#0066cc!important;padding:0 8px}
.pb-code{background:#fff;color:#1d1d1f;box-shadow:inset 0 0 0 1px #d2d2d7}
.pb-code-l{color:#6e6e73}.pb-code-v{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-weight:600;letter-spacing:.04em;direction:ltr;unicode-bidi:isolate}
.pb-code.done{box-shadow:inset 0 0 0 1px #34c759}.pb-code.done .pb-code-l{color:#248a3d}
.pb svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pb .pb-x{position:absolute;top:10px;inset-inline-end:10px;display:grid;place-items:center;box-sizing:border-box;width:32px!important;height:32px!important;min-width:0;min-height:0;border:0;border-radius:50%;background:rgba(0,0,0,.05);color:#6e6e73;cursor:pointer;padding:0}
.pb-x:hover{background:rgba(0,0,0,.09)}
.pb :focus-visible{outline:2px solid #0071e3;outline-offset:2px}
.pb.pb-top-page{width:min(1024px,calc(100% - 32px));margin:16px auto}
@media print{.pb{display:none}}
`;
function card(o){
  const name=nl&&o.partner_nl?o.partner_nl:o.partner,title=(o.title&&(o.title[nl?"nl":"ar"]||o.title.ar||o.title.nl))||"";
  return `<p class="pb-top"><span class="pb-ad" title="${esc(T.note)}">${T.ad}</span><span class="pb-name">${esc(name)}</span></p>`
   +`<p class="pb-title">${esc(title)}</p><p class="pb-note">${T.note} <a href="${nl?"/nl/partners.html":"/partners.html"}">${T.all}</a></p>`
   +`<div class="pb-acts">${o.code?`<button type="button" class="pb-btn pb-code" data-code="${esc(o.code)}" aria-label="${T.copy}: ${esc(o.code)}"><span class="pb-code-l">${T.code}</span><span class="pb-code-v">${esc(o.code)}</span>${ICO.copy}</button>`:""}`
   +`<a class="pb-btn pb-primary" href="${esc(o.url)}" target="_blank" rel="sponsored noopener">${T.visit}</a>`
   +(/^\d{8,15}$/.test(o.whatsapp||"")?`<a class="pb-btn pb-ghost" href="https://wa.me/${o.whatsapp}" target="_blank" rel="sponsored noopener">${T.wa}</a>`:"")+`</div>`;
}
function render(items){
  const st=document.createElement("style");st.textContent=css;document.head.append(st);
  const o=items[Math.floor(Math.random()*items.length)]; // several partners: a different one per page view, nothing moves
  const bar=document.createElement("aside");bar.className="pb";bar.setAttribute("aria-label",T.ad);
  bar.innerHTML=card(o)+`<button type="button" class="pb-x" aria-label="${T.close}">${ICO.x}</button>`;
  bar.addEventListener("click",async e=>{const c=e.target.closest(".pb-code");if(c){let ok=false;try{await navigator.clipboard.writeText(c.dataset.code);ok=true}catch(_){}
      const v=c.querySelector(".pb-code-l"),old=v.textContent;v.textContent=ok?T.copied:T.code;c.classList.toggle("done",ok);setTimeout(()=>{v.textContent=old;c.classList.remove("done")},2000);}
    if(e.target.closest(".pb-x")){bar.remove();try{sessionStorage.setItem(KEY,"1")}catch(_){}}});
  // place: guides -> after the summary box; other pages -> under the header
  const sum=document.querySelector("main .reader .summary, main .summary");
  if(sum){sum.after(bar);}
  else{bar.classList.add("pb-top-page");const header=["header.topbar","header.site-header","header.top","header.site-head","body > header"].map(s=>document.querySelector(s)).find(Boolean);
    if(header&&header.parentNode)header.parentNode.insertBefore(bar,header.nextSibling);else document.body.prepend(bar);}
}
fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(items.length)render(items)}).catch(()=>{});
})();
