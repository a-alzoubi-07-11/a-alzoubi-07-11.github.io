/* End-of-guide box on every guide and tool page: share (WhatsApp, copy link, native share) and "did this help?".
   - No cookies, nothing stored on a server by this script. The yes/no answer is sent only as an anonymous
     Analytics event (guide_feedback) and only when the visitor accepted analytics; otherwise it stays in the page.
   - One answer per page per browser (localStorage), so counts are not inflated. */
(()=>{"use strict";
if(window.__gnEngage)return;window.__gnEngage=true;
const reader=document.querySelector("main article.reader");
if(!reader||/\/(privacy|about|contact|editorial-policy|affiliate-disclosure|partners)\.html$/.test(location.pathname))return;
const nl=(document.documentElement.lang||"ar").slice(0,2)==="nl";
const T=nl?{share:"Deel deze pagina",wa:"Delen via WhatsApp",copy:"Link kopiëren",copied:"Link gekopieerd",more:"Meer delen",q:"Heeft deze pagina je geholpen?",yes:"Ja",no:"Nee",thanksY:"Fijn! Deel de pagina met iemand die dit ook nodig heeft.",thanksN:"Bedankt. Wat miste je?",tell:"Laat het ons weten",msg:"Kijk eens naar deze gids van Gids Nederland:"}
           :{share:"شارك هذه الصفحة",wa:"شارك على واتساب",copy:"انسخ الرابط",copied:"تم نسخ الرابط",more:"مشاركة أخرى",q:"هل أفادتك هذه الصفحة؟",yes:"نعم",no:"لا",thanksY:"يسعدنا ذلك! شاركها مع من يحتاجها.",thanksN:"شكراً لك. ما الذي لم تجده؟",tell:"أخبرنا",msg:"دليل مفيد من موقع دليل هولندا بالعربية:"};
const url=(document.querySelector('link[rel="canonical"]')||{}).href||location.href.split("#")[0];
const title=(document.querySelector("h1")||{}).textContent||document.title;
const KEY="gn-helpful:"+location.pathname;
let answered=null;try{answered=localStorage.getItem(KEY)}catch(_){}
const css=`.eg{margin:34px 0 10px;padding:18px 20px;border-radius:18px;background:#f5f5f7;font-family:var(--ap-font,system-ui,sans-serif)}
.eg h2{margin:0 0 10px;font-size:17px}
.eg-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.eg-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:0;font:inherit;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none!important;background:#fff;color:#1d1d1f!important;box-shadow:inset 0 0 0 1px #d2d2d7}
.eg-btn:hover{box-shadow:inset 0 0 0 1px #86868b}
.eg-wa{background:#128c4a;color:#fff!important;box-shadow:none}.eg-wa:hover{background:#0f7a40;box-shadow:none}
.eg-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.eg-vote[aria-pressed=true]{background:#1d1d1f;color:#fff!important;box-shadow:none}
.eg hr{border:0;border-top:1px solid #e0e0e5;margin:16px 0}
.eg-q{font-weight:700;font-size:16px;margin:0 12px 0 0}
[dir=rtl] .eg-q{margin:0 0 0 12px}
.eg-status{margin:8px 0 0;font-size:15px;color:#3a3a3c;min-height:1.4em}
.eg-status a{color:#0066cc}
.eg :focus-visible{outline:3px solid #0071e3;outline-offset:2px}
@media print{.eg{display:none}}`;
const st=document.createElement("style");st.textContent=css;document.head.append(st);
const WA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.3A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.5c0 3 2.500 5.500 5.500 5.500"/></svg>';
const LINK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.700 0l3.100-3.100a4 4 0 0 0-5.700-5.700L12 6.300"/><path d="M14 10a4 4 0 0 0-5.700 0l-3.100 3.100a4 4 0 0 0 5.700 5.700l1.100-1.100"/></svg>';
const box=document.createElement("section");box.className="eg";box.setAttribute("aria-label",T.share);
box.innerHTML=`<h2>${T.share}</h2><div class="eg-row">
<a class="eg-btn eg-wa" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(T.msg+"\n"+title.trim()+"\n"+url)}">${WA}${T.wa}</a>
<button type="button" class="eg-btn eg-copy">${LINK}${T.copy}</button>${navigator.share?`<button type="button" class="eg-btn eg-more">${T.more}</button>`:""}</div>
<hr><div class="eg-row" role="group" aria-label="${T.q}"><span class="eg-q">${T.q}</span>
<button type="button" class="eg-btn eg-vote" data-v="yes" aria-pressed="${answered==="yes"}">${T.yes}</button><button type="button" class="eg-btn eg-vote" data-v="no" aria-pressed="${answered==="no"}">${T.no}</button></div>
<p class="eg-status" role="status" aria-live="polite"></p>`;
const anchor=reader.querySelector("#sources")||null;
anchor?anchor.before(box):reader.append(box);
const status=box.querySelector(".eg-status");
function thanks(v){status.innerHTML=v==="yes"?T.thanksY:`${T.thanksN} <a href="${nl?"/nl/contact.html":"/contact.html"}">${T.tell}</a>`}
if(answered)thanks(answered);
box.addEventListener("click",async e=>{
 const c=e.target.closest(".eg-copy");
 if(c){try{await navigator.clipboard.writeText(url);status.textContent=T.copied}catch(_){status.textContent=url}return}
 if(e.target.closest(".eg-more")){try{await navigator.share({title:title.trim(),url})}catch(_){}return}
 const v=e.target.closest(".eg-vote");
 if(v){const val=v.dataset.v,first=!answered;answered=val;
  box.querySelectorAll(".eg-vote").forEach(b=>b.setAttribute("aria-pressed",String(b===v)));thanks(val);
  try{localStorage.setItem(KEY,val)}catch(_){}
  if(first&&typeof window.gtag==="function"&&document.documentElement.dataset.analyticsConsent==="granted")
   window.gtag("event","guide_feedback",{helpful:val,page_path:location.pathname});}
 if(e.target.closest(".eg-wa")&&typeof window.gtag==="function"&&document.documentElement.dataset.analyticsConsent==="granted")
  window.gtag("event","share",{method:"whatsapp",content_type:"guide",item_id:location.pathname});
});
})();
