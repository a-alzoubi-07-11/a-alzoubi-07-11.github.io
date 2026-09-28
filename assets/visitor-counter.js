(()=>{"use strict";
const endpoint="https://gidsnederland-counter.a-alzoubi-07-11.workers.dev/count";
const sessionKey="gids_visit_counted_v1";
let busy=false;
function lang(){return (document.documentElement.lang||"ar").toLowerCase().startsWith("nl")||localStorage.getItem("mbo_site_lang")==="nl"?"nl":"ar"}
function mount(){let el=document.getElementById("gids-visitor-counter");if(!el){el=document.createElement("aside");el.id="gids-visitor-counter";el.setAttribute("aria-live","polite");el.setAttribute("role","status");document.body.appendChild(el)}return el}
async function refresh(){
 if(busy||!window.MboConsent?.allowed("analytics"))return;
 busy=true;
 try{
  let counted=false;try{counted=sessionStorage.getItem(sessionKey)==="1"}catch{}
  const url=endpoint+(counted?"":"?increment=1");
  const response=await fetch(url,{method:"GET",mode:"cors",cache:"no-store"});
  if(!response.ok)throw new Error("counter unavailable");
  const data=await response.json();
  if(!Number.isSafeInteger(data.total)||data.total<0)throw new Error("invalid count");
  const el=mount(),nl=lang();el.dir=nl?"ltr":"rtl";
  el.textContent=(nl?"Bezoeken: ":"الزيارات: ")+new Intl.NumberFormat(nl?"nl-NL":"ar-NL").format(data.total);
  if(!counted){try{sessionStorage.setItem(sessionKey,"1")}catch{}}
 }catch(_){document.getElementById("gids-visitor-counter")?.remove()}
 finally{busy=false}
}
const style=document.createElement("style");
style.textContent="#gids-visitor-counter{position:fixed;z-index:1000;inset-inline-start:18px;inset-block-end:calc(20px + env(safe-area-inset-bottom));padding:9px 14px;border:1px solid rgba(255,255,255,.9);border-radius:999px;background:rgba(255,255,255,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 6px 22px rgba(15,23,42,.12);color:#3a3a3c;font:600 12px/1.2 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;pointer-events:none}@media(max-width:480px){#gids-visitor-counter{inset-inline-start:10px;inset-block-end:calc(14px + env(safe-area-inset-bottom));font-size:11px;padding:8px 11px}}";
document.head.appendChild(style);
window.addEventListener("mbo:consentchange",e=>{if(e.detail?.analytics)refresh();else document.getElementById("gids-visitor-counter")?.remove()});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",refresh,{once:true});else refresh();
new MutationObserver(()=>{const el=document.getElementById("gids-visitor-counter");if(el)el.textContent=(lang()==="nl"?"Bezoeken: ":"الزيارات: ")+el.textContent.replace(/^.*?:\s*/,"")}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();