/* لا طلب إعلاني لوحدة وهمية أو صفحة غير مؤهلة أو من دون موافقة CMP. */
(()=>{'use strict';let observer;const cfg=window.GuideConfig||{};
function eligible(){return cfg.adsEnabled===true&&cfg.cmpReady===true&&window.MboConsent?.allowed('ads')===true&&document.documentElement.dataset.adReviewed==='true';}
function slots(){
 const units=[...document.querySelectorAll('.ad-slot')].slice(0,3);
 if(!eligible()){units.forEach(u=>u.hidden=true);observer?.disconnect();return;}
 observer?.disconnect();
 const run=u=>{const ad=u.querySelector('ins.adsbygoogle');if(!ad||!/^\d{3,12}$/.test(ad.dataset.adSlot||'')||ad.dataset.requested)return;
  u.hidden=false;requestAnimationFrame(()=>{ad.dataset.requested='true';try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{u.hidden=true;}});
 };
 const valid=units.filter(u=>/^\d{3,12}$/.test(u.querySelector('ins.adsbygoogle')?.dataset.adSlot||''));
 valid.forEach(u=>u.hidden=false);
 if('IntersectionObserver' in window){observer=new IntersectionObserver(items=>items.forEach(x=>{if(x.isIntersecting){run(x.target);observer.unobserve(x.target);}}),{rootMargin:'0px'});valid.forEach(u=>observer.observe(u));}else valid.forEach(run);
}
window.addEventListener('mbo:consentchange',slots);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',slots);else slots();
})();
