/* Google CMP is the only source of advertising consent. Unknown values stay denied. */
(()=>{'use strict';
const cfg=window.GuideConfig||{},denied={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'};
let analytics=false,ads=false,gaLoaded=false,tc=null,apiReady=false,revision=0;
const fc=window.googlefc=window.googlefc||{};fc.callbackQueue=fc.callbackQueue||[];
const emit=()=>window.dispatchEvent(new CustomEvent('mbo:consentchange',{detail:{analytics,ads}}));
function apply(values){window.gtag?.('consent','update',values);analytics=values.analytics_storage==='granted';ads=values.ad_storage==='granted'&&values.ad_user_data==='granted';emit();}
function stop(){revision++;if(cfg.measurementId)window['ga-disable-'+cfg.measurementId]=true;apply({...denied});}
function activateAnalytics(){
 if(analytics&&cfg.measurementId)window['ga-disable-'+cfg.measurementId]=false;
 if(!analytics||gaLoaded||!/^G-[A-Z0-9]{6,20}$/.test(cfg.measurementId||'')||cfg.measurementId.includes('YOUR'))return;
 gaLoaded=true;window.gtag('js',new Date());window.gtag('config',cfg.measurementId,{send_page_view:true});
 const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+cfg.measurementId;document.head.append(script);
}
function update(){
 if(!cfg.cmpReady||!tc||tc.gdprApplies!==true||!['tcloaded','useractioncomplete'].includes(tc.eventStatus)||typeof fc.getGoogleConsentModeValues!=='function'){apply({...denied});return;}
 let status;try{status=fc.getGoogleConsentModeValues();}catch{stop();return;}
 const vendor=tc.vendor?.consents?.[755]===true,storage=tc.purpose?.consents?.[1]===true;
 const grant=(key,extra=true)=>status?.[key]===1&&extra?'granted':'denied';
 const values={ad_storage:grant('adStoragePurposeConsentStatus',vendor&&storage),ad_user_data:grant('adUserDataPurposeConsentStatus',vendor&&storage),ad_personalization:grant('adPersonalizationPurposeConsentStatus',vendor&&storage&&tc.purpose?.consents?.[3]===true&&tc.purpose?.consents?.[4]===true),analytics_storage:grant('analyticsStoragePurposeConsentStatus',tc.publisher?.consents?.[1]===true&&tc.publisher?.consents?.[8]===true)};
 apply(values);activateAnalytics();
}
function notice(){
 document.getElementById('mbo-consent')?.remove();const nl=document.documentElement.lang==='nl',box=document.createElement('section');box.id='mbo-consent';box.className='mbo-consent';box.setAttribute('role','status');
 const title=nl?'Cookie-instellingen':'إعدادات الكوكيز',info=nl?'Google beheert de toestemmingskeuze. Optionele verwerking blijft uit zolang je niet kiest of de melding niet beschikbaar is.':'تدير Google اختيار الموافقة. تبقى المعالجة الاختيارية متوقفة حتى تختار، أو إذا تعذّر تحميل الرسالة. خياراتها: Toestemming geven = قبول، Geen toestemming geven = رفض، Opties beheren = إدارة الخيارات.';
 box.innerHTML='<h2>'+title+'</h2><p>'+info+'</p><div class="actions"><button type="button" data-retry>'+(nl?'Google-melding openen':'فتح رسالة Google')+'</button><a href="'+(nl?'/nl/privacy.html':'/privacy.html')+'">'+(nl?'Privacyverklaring':'سياسة الخصوصية')+'</a><button type="button" data-dismiss>'+(nl?'Sluiten':'إغلاق')+'</button></div>';
 box.querySelector('[data-retry]').addEventListener('click',open);box.querySelector('[data-dismiss]').addEventListener('click',()=>box.remove());document.body.append(box);
}
function open(){
 stop();if(!cfg.cmpReady){notice();return;}
 fc.callbackQueue.push({CONSENT_API_READY:()=>{if(typeof fc.showRevocationMessage==='function'){document.getElementById('mbo-consent')?.remove();fc.showRevocationMessage();}else notice();}});
 if(!apiReady)notice();
}
Object.defineProperty(window,'MboConsent',{value:Object.freeze({allowed:kind=>kind==='analytics'?analytics:kind==='ads'?ads:false,open}),configurable:false});
// No legacy localStorage consent is reused as a TCF decision.
fc.callbackQueue.push({CONSENT_API_READY:()=>{
 apiReady=true;if(typeof window.__tcfapi!=='function')return;
 window.__tcfapi('addEventListener',2,(data,success)=>{
  if(!success||!data){tc=null;stop();return;}tc=data;
  if(data.eventStatus==='cmpuishown'){stop();return;}
  const current=++revision;update();[100,500].forEach(delay=>setTimeout(()=>{if(revision===current)update();},delay));
 });
}});
fc.callbackQueue.push({CONSENT_MODE_DATA_READY:update});
function init(){document.querySelectorAll('[data-cookie-settings]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open();}));if(!cfg.cmpReady)notice();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
