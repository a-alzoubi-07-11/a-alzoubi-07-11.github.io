/* Share bar (top) and end-of-guide box on every guide and tool page: WhatsApp, Telegram, Facebook, copy link,
   native share, and "did this help?".
   - No cookies, nothing stored on a server by this script. The yes/no answer is sent only as an anonymous
     Analytics event (guide_feedback) and only when the visitor accepted analytics; otherwise it stays in the page.
   - One answer per page per browser (localStorage), so counts are not inflated.
   - Tools can set a result-specific message and link: window.gnShare.set(text, url). */
(()=>{"use strict";
if(window.__gnEngage)return;window.__gnEngage=true;
const reader=document.querySelector("main article.reader");
if(!reader||/\/(privacy|about|contact|editorial-policy|affiliate-disclosure|partners)\.html$/.test(location.pathname))return;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{share:"Deel deze pagina",shareShort:"Delen:",wa:"WhatsApp",tg:"Telegram",fb:"Facebook",copy:"Link kopiëren",copied:"Link gekopieerd",more:"Meer",q:"Heeft deze pagina je geholpen?",yes:"Ja",no:"Nee",thanksY:"Fijn! Deel de pagina met iemand die dit ook nodig heeft.",thanksN:"Bedankt. Wat miste je?",tell:"Laat het ons weten",msg:"Nuttige informatie van Gids Nederland:",via:"Delen via"}
           :{share:"شارك هذه الصفحة",shareShort:"شارك:",wa:"واتساب",tg:"تيليغرام",fb:"فيسبوك",copy:"انسخ الرابط",copied:"تم نسخ الرابط",more:"المزيد",q:"هل أفادتك هذه الصفحة؟",yes:"نعم",no:"لا",thanksY:"يسعدنا ذلك! شاركها مع من يحتاجها.",thanksN:"شكراً لك. ما الذي لم تجده؟",tell:"أخبرنا",msg:"معلومة مفيدة من موقع دليل هولندا بالعربية:",via:"شارك عبر"};
const canonical=(document.querySelector('link[rel="canonical"]')||{}).href||location.href.split("#")[0];
const title=((document.querySelector("h1")||{}).textContent||document.title).trim();
const S={text:T.msg+"\n"+title,url:canonical};
const KEY="gn-helpful:"+location.pathname;
let answered=null;try{answered=localStorage.getItem(KEY)}catch(_){}
const css=`.eg{margin:34px 0 10px;padding:18px 20px;border-radius:18px;background:var(--eg-bg);font-family:var(--ap-font,system-ui,sans-serif)}
:root{--eg-bg:#f5f5f7;--eg-btn:#fff;--eg-txt:#1d1d1f;--eg-line:#d2d2d7;--eg-line-h:#86868b;--eg-muted:#3a3a3c;--eg-sep:#e0e0e5}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--eg-bg:#1c1c1e;--eg-btn:#2c2c2e;--eg-txt:#f5f5f7;--eg-line:#3a3a3c;--eg-line-h:#636366;--eg-muted:#c7c7cc;--eg-sep:#38383a}}
:root[data-theme=dark]{--eg-bg:#1c1c1e;--eg-btn:#2c2c2e;--eg-txt:#f5f5f7;--eg-line:#3a3a3c;--eg-line-h:#636366;--eg-muted:#c7c7cc;--eg-sep:#38383a}
.eg h2{margin:0 0 10px;font-size:17px}
.eg-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.eg-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:0;font:inherit;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none!important;background:var(--eg-btn);color:var(--eg-txt)!important;box-shadow:inset 0 0 0 1px var(--eg-line)}
.eg-btn:hover{box-shadow:inset 0 0 0 1px var(--eg-line-h)}
.eg-wa{background:#128c4a;color:#fff!important;box-shadow:none}.eg-wa:hover{background:#0f7a40;box-shadow:none}
.eg-tg{background:#1f7ab8;color:#fff!important;box-shadow:none}.eg-tg:hover{background:#1a6aa0;box-shadow:none}
.eg-fb{background:#1b5fc7;color:#fff!important;box-shadow:none}.eg-fb:hover{background:#174fa6;box-shadow:none}
.eg-btn svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.eg-vote[aria-pressed=true]{background:var(--eg-txt);color:var(--eg-bg)!important;box-shadow:none}
.eg hr{border:0;border-top:1px solid var(--eg-sep);margin:16px 0}
.eg-q{font-weight:700;font-size:16px;margin:0 12px 0 0}
[dir=rtl] .eg-q{margin:0 0 0 12px}
.eg-status{margin:8px 0 0;font-size:15px;color:var(--eg-muted);min-height:1.4em}
.eg-status a{color:#0066cc}
.eg-top{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 14px;font-family:var(--ap-font,system-ui,sans-serif)}
.eg-top .eg-lbl{font-size:14px;color:var(--eg-muted);margin-inline-end:2px}
.eg-top .eg-btn{min-height:36px;padding:0 12px;font-size:14px}
.eg-top .eg-btn svg{width:16px;height:16px}
.eg-top .eg-st{font-size:13px;color:var(--eg-muted)}
.eg :focus-visible,.eg-top :focus-visible{outline:3px solid #0071e3;outline-offset:2px}
@media(max-width:420px){.eg-top .eg-t{display:none}.eg-top .eg-btn{padding:0 11px}}
@media print{.eg,.eg-top{display:none}}`;
const st=document.createElement("style");st.textContent=css;document.head.append(st);
const WA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.3A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/></svg>';
const TG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 9-6"/></svg>';
const FB='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>';
const LINK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3.1-3.1a4 4 0 0 0-5.7-5.7L12 6.3"/><path d="M14 10a4 4 0 0 0-5.7 0l-3.1 3.1a4 4 0 0 0 5.7 5.7l1.1-1.1"/></svg>';
const MORE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
const enc=encodeURIComponent;
function hrefs(){return{wa:"https://wa.me/?text="+enc(S.text+"\n"+S.url),tg:"https://t.me/share/url?url="+enc(S.url)+"&text="+enc(S.text),fb:"https://www.facebook.com/sharer/sharer.php?u="+enc(S.url)}}
function buttons(small){const h=hrefs(),t=s=>small?`<span class="eg-t">${s}</span>`:s;
 return `<a class="eg-btn eg-wa" data-net="whatsapp" target="_blank" rel="noopener" href="${h.wa}" aria-label="${T.via} ${T.wa}">${WA}${t(T.wa)}</a>`
 +`<a class="eg-btn eg-tg" data-net="telegram" target="_blank" rel="noopener" href="${h.tg}" aria-label="${T.via} ${T.tg}">${TG}${t(T.tg)}</a>`
 +`<a class="eg-btn eg-fb" data-net="facebook" target="_blank" rel="noopener" href="${h.fb}" aria-label="${T.via} ${T.fb}">${FB}${t(T.fb)}</a>`
 +`<button type="button" class="eg-btn eg-copy" aria-label="${T.copy}">${LINK}${small?"":T.copy}</button>`
 +(navigator.share?`<button type="button" class="eg-btn eg-more" aria-label="${T.more}">${MORE}${small?"":T.more}</button>`:"")}
// top bar, under the title (and the summary, when there is one)
const top=document.createElement("div");top.className="eg-top";top.setAttribute("role","group");top.setAttribute("aria-label",T.share);
top.innerHTML=`<span class="eg-lbl">${T.shareShort}</span>${buttons(true)}<span class="eg-st" role="status" aria-live="polite"></span>`;
const h1=reader.querySelector("h1"),sum=reader.querySelector("h1 + .summary, h1 ~ p.summary");
if(sum)sum.after(top);else if(h1)h1.after(top);
// end box
const box=document.createElement("section");box.className="eg";box.setAttribute("aria-label",T.share);
box.innerHTML=`<h2>${T.share}</h2><div class="eg-row eg-share">${buttons(false)}</div>
<hr><div class="eg-row" role="group" aria-label="${T.q}"><span class="eg-q">${T.q}</span>
<button type="button" class="eg-btn eg-vote" data-v="yes" aria-pressed="${answered==="yes"}">${T.yes}</button><button type="button" class="eg-btn eg-vote" data-v="no" aria-pressed="${answered==="no"}">${T.no}</button></div>
<p class="eg-status" role="status" aria-live="polite"></p>`;
const anchor=reader.querySelector("#sources")||null;
anchor?anchor.before(box):reader.append(box);
const status=box.querySelector(".eg-status");
function refresh(){const h=hrefs();document.querySelectorAll(".eg-wa").forEach(a=>a.href=h.wa);document.querySelectorAll(".eg-tg").forEach(a=>a.href=h.tg);document.querySelectorAll(".eg-fb").forEach(a=>a.href=h.fb)}
window.gnShare={set(text,url){if(text)S.text=String(text);if(url)S.url=String(url);refresh()},
 reset(){S.text=T.msg+"\n"+title;S.url=canonical;refresh()},
 async native(){if(navigator.share){try{await navigator.share({title,text:S.text,url:S.url});return true}catch(_){return true}}
  try{await navigator.clipboard.writeText(S.text+"\n"+S.url);return "copied"}catch(_){return false}},
 links:hrefs,labels:T};
function thanks(v){status.innerHTML=v==="yes"?T.thanksY:`${T.thanksN} <a href="${nl?"/nl/contact.html":"/contact.html"}">${T.tell}</a>`}
if(answered)thanks(answered);
const track=net=>{if(typeof window.gtag==="function"&&document.documentElement.dataset.analyticsConsent==="granted")
 window.gtag("event","share",{method:net,content_type:/\/calculators\/|tools\.html|beroep|knm|cv\.html|templates/.test(location.pathname)?"tool":"guide",item_id:location.pathname})};
async function onClick(e,out){
 const c=e.target.closest(".eg-copy");
 if(c){try{await navigator.clipboard.writeText(S.url);out.textContent=T.copied}catch(_){out.textContent=S.url}track("copy");return}
 if(e.target.closest(".eg-more")){try{await navigator.share({title,text:S.text,url:S.url})}catch(_){}track("native");return}
 const n=e.target.closest("[data-net]");if(n){track(n.dataset.net);return}
 const v=e.target.closest(".eg-vote");
 if(v){const val=v.dataset.v,first=!answered;answered=val;
  box.querySelectorAll(".eg-vote").forEach(b=>b.setAttribute("aria-pressed",String(b===v)));thanks(val);
  try{localStorage.setItem(KEY,val)}catch(_){}
  if(first&&typeof window.gtag==="function"&&document.documentElement.dataset.analyticsConsent==="granted")
   window.gtag("event","guide_feedback",{helpful:val,page_path:location.pathname});}
}
box.addEventListener("click",e=>onClick(e,status));
top.addEventListener("click",e=>onClick(e,top.querySelector(".eg-st")));
})();
