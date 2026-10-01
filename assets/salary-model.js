/* مصدر الأرقام الوحيد data/rates.json؛ فشل التحميل يوقف الحساب ولا يعيد أرقاماً قديمة. */
(()=>{'use strict';let data=null;
const ready=fetch('/data/rates.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Rates unavailable');return r.json();}).then(d=>{
 if(d.schemaVersion!==1||d.salary?.status!=='verified'||new Date().toISOString().slice(0,10)>d.validUntil)throw Error('Unverified or expired rates');
 const s=d.salary;if(!Array.isArray(s.taxRates)||s.taxRates.length!==3||!Array.isArray(s.thresholds)||s.thresholds.length!==2)throw Error('Invalid rates');data=d;return d;
});
function annual(gross,credits=true){
 if(!data)throw Error('Rates not ready');if(!Number.isFinite(gross)||gross<0||gross>2000000)throw RangeError('Invalid gross');
 const s=data.salary,[a,b]=s.thresholds,[r1,r2,r3]=s.taxRates;
 const before=Math.min(gross,a)*r1+Math.max(0,Math.min(gross,b)-a)*r2+Math.max(0,gross-b)*r3;
 const g=s.generalCredit,general=gross<=g.threshold?g.maximum:gross<=g.end?Math.max(0,g.maximum-g.reductionRate*(gross-g.threshold)):0;
 const e=s.employmentCredit;let employment=0;
 for(let i=0;i<4;i++)if(gross<=e.thresholds[i]){employment=Math.max(0,e.bases[i]+e.rates[i]*(gross-(i?e.thresholds[i-1]:0)));break;}
 const applied=credits?Math.min(before,general+employment):0,tax=Math.max(0,before-applied);
 return {gross,taxBefore:before,credits:applied,tax,net:gross-tax};
}
window.GuideSalary2026={annual,ready};
})();
