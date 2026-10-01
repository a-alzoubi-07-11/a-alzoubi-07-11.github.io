/* الشريط المحلي يدير الإحصاءات فقط، ولا يصنع موافقة TCF للإعلانات. */
(()=>{'use strict';
const KEY='guide-consent-v4',cfg=window.GuideConfig||{},lang=()=>document.documentElement.lang==='nl'?'nl':'ar';
const texts={ar:{title:'إعدادات الكوكيز',intro:'التخزين الضروري يدعم الأدوات. إحصاءات الزيارات اختيارية. موافقة الإعلانات تُدار عبر رسالة Google المعتمدة عند تفعيلها.',analytics:'إحصاءات الزيارات وعداد الموقع',accept:'قبول الكل',reject:'رفض الكل',manage:'إدارة الخيارات',save:'حفظ الاختيار',privacy:'الخصوصية',storage:'تعذّر حفظ الاختيار؛ يسري أثناء فتح الصفحة.'},nl:{title:'Cookie-instellingen',intro:'Noodzakelijke opslag ondersteunt de tools. Bezoekersstatistieken zijn optioneel. Advertentietoestemming loopt via de gecertificeerde Google-melding zodra deze is ingesteld.',analytics:'Bezoekersstatistieken en bezoekenteller',accept:'Alles accepteren',reject:'Alles weigeren',manage:'Opties beheren',save:'Keuze opslaan',privacy:'Privacy',storage:'Opslaan lukt niet; de keuze geldt voor deze pagina.'}};
let local=null,analytics=false,ads=false,gaLoaded=false,cmpSeen=false;
try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x?.version===4&&typeof x.analytics==='boolean')local=x;}catch{}
const emit=()=>window.dispatchEvent(new CustomEvent('mbo:consentchange',{detail:{analytics,ads}}));
function mode(values){window.gtag?.('consent','update',values);}
function activateAnalytics(){
 if(!analytics||gaLoaded||!/^G-[A-Z0-9]{6,20}$/.test(cfg.measurementId||'')||cfg.measurementId.includes('YOUR'))return;
 gaLoaded=true;window.gtag('js',new Date());window.gtag('config',cfg.measurementId,{send_page_view:true});
 const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+cfg.measurementId;document.head.append(script);
}
function setLocal(value){analytics=value;ads=false;mode({analytics_storage:value?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});activateAnalytics();emit();}
function fallback(expanded=false){
 document.getElementById('mbo-consent')?.remove();const t=texts[lang()],box=document.createElement('section');box.id='mbo-consent';box.className='mbo-consent';box.setAttribute('role','dialog');box.setAttribute('aria-label',t.title);
 const privacy=location.pathname.startsWith('/nl/')?'/nl/privacy.html':'/privacy.html';
 box.innerHTML=`<h2>${t.title}</h2><p>${t.intro} <a href="${privacy}">${t.privacy}</a></p><div class="choices" ${expanded?'':'hidden'}><label><input id="consent-analytics" type="checkbox" ${local?.analytics?'checked':''}>${t.analytics}</label></div><div class="actions"><button type="button" data-choice="accept">${t.accept}</button><button type="button" data-choice="reject">${t.reject}</button><button type="button" data-choice="manage">${expanded?t.save:t.manage}</button></div><p id="consent-storage" role="status"></p>`;
 document.body.append(box);
 box.addEventListener('click',e=>{const choice=e.target.closest('[data-choice]')?.dataset.choice;if(!choice)return;if(choice==='manage'&&!expanded){fallback(true);return;}
 const value=choice==='accept'?true:choice==='reject'?false:box.querySelector('input').checked;
 local={version:4,analytics:value,updatedAt:new Date().toISOString()};let saved=true;
 try{localStorage.setItem(KEY,JSON.stringify(local));}catch{saved=false;}
 const wasLoaded=gaLoaded;setLocal(value);if(saved)box.remove();else box.querySelector('#consent-storage').textContent=t.storage;
 if(wasLoaded&&!value&&saved)location.reload();
 });
}
function open(){
 if(cfg.cmpReady&&typeof window.googlefc?.showRevocationMessage==='function'){
  analytics=false;ads=false;mode({analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});emit();
  window.googlefc.callbackQueue.push({CONSENT_API_READY:()=>window.googlefc.showRevocationMessage()});
 }else fallback(true);
}
Object.defineProperty(window,'MboConsent',{value:Object.freeze({allowed:kind=>kind==='analytics'?analytics:kind==='ads'?ads:false,open}),configurable:false});
function cmpUpdate(){
 const fc=window.googlefc;if(!cfg.cmpReady||typeof fc?.getGoogleConsentModeValues!=='function')return;
 const status=fc.getGoogleConsentModeValues();if(!status)return;cmpSeen=true;document.getElementById('mbo-consent')?.remove();
 // لا نعتبر UNKNOWN أو NOT_CONFIGURED موافقة.
 const grant=v=>v===1;
 const values={ad_storage:grant(status.adStoragePurposeConsentStatus)?'granted':'denied',ad_user_data:grant(status.adUserDataPurposeConsentStatus)?'granted':'denied',ad_personalization:grant(status.adPersonalizationPurposeConsentStatus)?'granted':'denied',analytics_storage:grant(status.analyticsStoragePurposeConsentStatus)?'granted':'denied'};
 mode(values);analytics=values.analytics_storage==='granted';ads=values.ad_storage==='granted'&&values.ad_user_data==='granted'&&typeof window.__tcfapi==='function';activateAnalytics();emit();
}
window.googlefc=window.googlefc||{};window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];
window.googlefc.callbackQueue.push({CONSENT_MODE_DATA_READY:cmpUpdate});
function init(){
 document.querySelectorAll('[data-cookie-settings]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open();}));
 if(!cfg.cmpReady){if(local)setLocal(local.analytics);else fallback();}
 else setTimeout(()=>{if(!cmpSeen)fallback();},4000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
