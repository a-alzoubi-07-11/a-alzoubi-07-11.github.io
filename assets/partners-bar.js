/* Partner offers bar (sponsored, clearly labelled). Data: /assets/partners.json.
   - Shows only active offers whose dates include today (and whose topics match the page, if set).
   - Moving text line (text only) + buttons that stand still, so every tap works the first time.
   - prefers-reduced-motion: no movement, the strip simply scrolls sideways by hand.
   - The visitor can close it for this browser session. No tracking, no cookies. */
(()=>{"use strict";
if(window.__partnersBar)return;window.__partnersBar=true;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{ad:"Advertentie",label:"Aanbiedingen",code:"Code",copy:"Kopieer",copied:"Gekopieerd",open:"Bekijk aanbod",all:"Alle aanbiedingen",close:"Sluiten",pause:"Pauzeren",play:"Afspelen",note:"Betaalde samenwerking. Gids Nederland garandeert de diensten van partners niet."}
            :{ad:"إعلان",label:"عروض الشركاء",code:"الكود",copy:"نسخ",copied:"تم النسخ",open:"اطّلع على العرض",all:"كل العروض",close:"إغلاق",pause:"إيقاف الحركة",play:"تشغيل الحركة",note:"تعاون مدفوع. دليل هولندا لا يضمن خدمات الشركاء."};
const KEY="gn-partners-closed";
try{if(sessionStorage.getItem(KEY)==="1")return;}catch(_){}
const today=new Date().toISOString().slice(0,10);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(u||"");
function live(items){const path=location.pathname.toLowerCase();
  return (items||[]).filter(o=>o&&o.active===true&&okUrl(o.url)&&(!o.start||o.start<=today)&&(!o.end||o.end>=today)
    &&(!Array.isArray(o.topics)||!o.topics.length||o.topics.some(t=>{t=String(t).toLowerCase();return t==="home"?HOME:path.includes(t)})));}
const HOME=/^\/(nl\/)?(index\.html)?$/.test(location.pathname);
const css=`
.pb{--pb-bg:#16202e;--pb-fg:#f5f7fa;--pb-acc:#f5a524;position:relative;z-index:5;display:flex;flex-wrap:wrap;align-items:stretch;gap:0;max-width:100%;margin:14px auto;background:var(--pb-bg);color:var(--pb-fg);font-size:15px;line-height:1.4;overflow:hidden;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.12)}
.hm-hero+.pb,.pb.pb-home{margin:18px auto 6px;width:min(1100px,calc(100% - 32px))}
.pb-tag{flex:none;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:800;background:var(--pb-acc);color:#1d1400;padding:0 12px;min-height:44px}
.pb-tag small{font-weight:600;font-size:11px;opacity:.85;border:1px solid rgba(29,20,0,.35);border-radius:4px;padding:0 4px}
.pb-view{flex:1 1 220px;min-width:0;overflow:hidden;display:flex;align-items:center;color:inherit!important;text-decoration:none!important;min-height:44px;mask-image:linear-gradient(90deg,transparent,#000 18px,#000 calc(100% - 18px),transparent)}
.pb-track{display:flex;width:max-content;gap:56px;padding-inline:12px;animation:pb-move var(--pb-dur,22s) linear infinite;will-change:transform}
[dir=rtl] .pb-track{animation-name:pb-move-rtl}
.pb:hover .pb-track,.pb.pb-paused .pb-track{animation-play-state:paused}
@keyframes pb-move{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pb-move-rtl{from{transform:translateX(0)}to{transform:translateX(50%)}}
.pb-msg{white-space:nowrap}
.pb-msg b{font-weight:800;color:var(--pb-acc)}
.pb-code{font-family:ui-monospace,Menlo,Consolas,monospace;background:rgba(255,255,255,.12);border:1px dashed var(--pb-acc);border-radius:4px;padding:0 6px;direction:ltr;unicode-bidi:isolate}
.pb-acts{display:flex;align-items:center;gap:6px;flex:none;padding:6px 8px}
.pb button,.pb a{font:inherit;color:var(--pb-fg)}
.pb-btn{display:inline-flex;align-items:center;gap:4px;min-height:34px;border:1px solid rgba(255,255,255,.45);background:transparent;border-radius:999px;padding:2px 12px;cursor:pointer;text-decoration:none!important;font-weight:600;white-space:nowrap;font-size:14px}
.pb-btn:hover{background:rgba(255,255,255,.1)}
.pb-btn.pb-copy{background:var(--pb-acc);color:#1d1400!important;border-color:var(--pb-acc)}
.pb-btn.pb-wa{border-color:#25d366}
.pb-ctl{flex:none;display:flex;align-items:center}
.pb-ctl button{border:0;background:transparent;font-size:16px;line-height:1;width:40px;height:44px;cursor:pointer}
.pb :focus-visible{outline:3px solid var(--pb-acc);outline-offset:2px}
@media (max-width:600px){.pb{font-size:14px;border-radius:8px}.pb-tag{padding:0 8px}.pb-tag-t{display:none}.pb-tag small{font-size:12px;font-weight:800;border:0;padding:0;opacity:1}.pb-view{flex:1 1 0}.pb-ctl button{width:36px}.pb-acts{order:3;flex-basis:100%;border-top:1px solid rgba(255,255,255,.12);flex-wrap:wrap}.pb-ctl{order:2}}
@media (prefers-reduced-motion: reduce){.pb-track{animation:none;width:auto;flex-wrap:wrap}.pb-msg{white-space:normal}.pb-track>.pb-msg[aria-hidden]{display:none}.pb-view{mask-image:none}.pb-pause{display:none}}
@media print{.pb{display:none}}
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
  bar.innerHTML=`<span class="pb-tag"><span class="pb-tag-t">${T.label}</span><small>${T.ad}</small></span><a class="pb-view" href="${esc(items[0].url)}" target="_blank" rel="sponsored noopener"><span class="pb-track">${line}</span></a>`
    +`<span class="pb-ctl"><button type="button" class="pb-pause" aria-pressed="false" aria-label="${T.pause}">⏸</button><button type="button" class="pb-x" aria-label="${T.close}">×</button></span><span class="pb-acts">${acts(items[0])}</span>`;
  // speed ~ 60px per second, whatever the text length
  requestAnimationFrame(()=>{const tr=bar.querySelector(".pb-track");tr.style.setProperty("--pb-dur",Math.max(12,Math.round(tr.scrollWidth/2/60))+"s")});
  // several partners: the buttons follow the offers one by one
  if(items.length>1){let i=0;const box=bar.querySelector(".pb-acts"),view=bar.querySelector(".pb-view");
    setInterval(()=>{if(bar.matches(":hover,:focus-within"))return;i=(i+1)%items.length;box.innerHTML=acts(items[i]);view.href=items[i].url},8000);}
  bar.addEventListener("click",async e=>{const c=e.target.closest(".pb-copy");if(c){e.preventDefault();let ok=false;try{await navigator.clipboard.writeText(c.dataset.code);ok=true}catch(_){}
      const old=c.textContent;c.textContent=ok?T.copied:c.dataset.code;setTimeout(()=>{c.textContent=old},2000);}
    const ps=e.target.closest(".pb-pause");if(ps){const on=bar.classList.toggle("pb-paused");ps.setAttribute("aria-pressed",String(on));ps.textContent=on?"▶":"⏸";ps.setAttribute("aria-label",on?T.play:T.pause);}
    if(e.target.closest(".pb-x")){bar.remove();try{sessionStorage.setItem(KEY,"1")}catch(_){}}});
  // place: homepage -> after the first section (title + search); guides -> after the summary box; else under the header
  const hero=document.querySelector("main .hm-hero"),sum=document.querySelector("main .reader .summary, main .summary");
  if(hero){bar.classList.add("pb-home");hero.after(bar);}
  else if(sum){sum.after(bar);}
  else{const header=["header.topbar","header.site-header","header.top","header.site-head","body > header"].map(s=>document.querySelector(s)).find(Boolean);
    if(header&&header.parentNode)header.parentNode.insertBefore(bar,header.nextSibling);else document.body.prepend(bar);}
}
fetch("/assets/partners.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(d=>{const items=live(d&&d.items);if(items.length)render(items)}).catch(()=>{});
})();
