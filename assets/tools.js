(()=>{'use strict';
 const $=id=>document.getElementById(id),nl=()=>document.documentElement.lang==='nl';
 const text=(ar,nlText)=>nl()?nlText:ar;
 const euro=value=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
 let ratesReady=false;const salaryButton=$('salary-form').querySelector('button[type=submit]');if(salaryButton)salaryButton.disabled=true;GuideSalary2026.ready.then(()=>{ratesReady=true;if(salaryButton)salaryButton.disabled=false;}).catch(()=>{$('salary-out').textContent=text('تعذر تحميل أرقام موثقة. الحساب متوقف.','Geverifieerde tarieven niet beschikbaar. Berekening uitgeschakeld.');});
 let salaryResult=null,budgetResult=null,storageFailed=false;
 function line(parent,label,value,big=false){const p=document.createElement('p');p.append(document.createTextNode(label+' '));const b=document.createElement(big?'strong':'bdi');b.textContent=euro(value);p.append(b);parent.append(p);}
 function showSalary(){const out=$('salary-out');out.replaceChildren();if(!salaryResult)return;
  const r=salaryResult;
  line(out,text('متوسط الصافي الشهري المقدّر (يشمل الإجازة إن أضفتها):','Geschat netto maandgemiddelde (incl. eventueel extra vakantiegeld):'),r.net/12,true);
  line(out,text('الإجمالي السنوي:','Bruto per jaar:'),r.gross);
  line(out,text('الضريبة والاشتراكات الوطنية السنوية بعد الخصمين:','Belasting en volksverzekeringen per jaar na kortingen:'),r.tax);
  line(out,text('الصافي السنوي المقدّر:','Geschat netto per jaar:'),r.net);
 }
 $('salary-form').addEventListener('submit',e=>{e.preventDefault();if(!ratesReady||!e.currentTarget.reportValidity())return;
  // منع عرض جداول منتهية بوصفها حساباً للسنة الحالية.
  if(new Date().getFullYear()>2026){salaryResult=null;showSalary();$('salary-out').textContent=text('انتهت سنة هذا النموذج. يحتاج تحديث الجداول قبل استخدامه.','Dit model is verlopen. Werk de tabellen bij voordat je het gebruikt.');return;}
  const gross=Number($('salary-gross').value),holiday=Number($('salary-holiday').value||0);
  if(!Number.isFinite(gross)||!Number.isFinite(holiday)||gross<0||gross>50000||holiday<0||holiday>100)return;
  salaryResult=GuideSalary2026.annual(gross*12*(1+holiday/100),$('salary-credits').checked);showSalary();
 });
 // إزالة نتيجة قديمة فور تغيير مدخلاتها.
 $('salary-form').addEventListener('input',()=>{salaryResult=null;showSalary();});
 const checks=[...document.querySelectorAll('[data-check]')];
 try{const saved=JSON.parse(localStorage.getItem('guide-newcomer-checklist-v1')||'[]');if(Array.isArray(saved))checks.forEach(c=>{c.checked=saved.includes(c.dataset.check);});}catch{storageFailed=true;}
 function showChecks(){const count=checks.filter(c=>c.checked).length;$('check-progress').value=count;
  $('check-status').textContent=text(`${count} من ${checks.length} خطوات معلّمة`,`${count} van ${checks.length} stappen aangevinkt`)+(storageFailed?text(' — تعذّر الحفظ على الجهاز.',' — Opslaan op het apparaat lukt niet.'):'');
 }
 function saveChecks(){try{localStorage.setItem('guide-newcomer-checklist-v1',JSON.stringify(checks.filter(c=>c.checked).map(c=>c.dataset.check)));storageFailed=false;}catch{storageFailed=true;}showChecks();}
 checks.forEach(c=>c.addEventListener('change',saveChecks));
 $('check-reset').addEventListener('click',()=>{checks.forEach(c=>{c.checked=false;});saveChecks();});
 function showBudget(){const out=$('budget-out');out.replaceChildren();if(!budgetResult)return;
  line(out,text('المتبقي بعد المصروفات والادخار المخطط:','Resterend na uitgaven en gepland sparen:'),budgetResult.balance,true);
  line(out,text('مجموع الدخل:','Totaal inkomen:'),budgetResult.income);line(out,text('مجموع المصروفات والادخار المخطط:','Uitgaven en gepland sparen:'),budgetResult.expenses);
  if(budgetResult.balance<0){const p=document.createElement('p');p.textContent=text('المصروفات المدخلة تتجاوز الدخل. راجع الأرقام والمصروفات قبل اتخاذ قرار.','De ingevulde uitgaven zijn hoger dan het inkomen. Controleer je bedragen en uitgaven.');out.append(p);}
 }
 $('budget-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const val=k=>Number($('budget-'+k).value||0);
  const income=val('income')+val('benefits'),expenses=['rent','energy','health','food','transport','other'].reduce((sum,k)=>sum+val(k),0);
  budgetResult={income,expenses,balance:income-expenses};showBudget();
 });
 $('budget-form').addEventListener('input',()=>{budgetResult=null;showBudget();});
 $('budget-reset').addEventListener('click',()=>{$('budget-form').reset();budgetResult=null;showBudget();});
 function showRoutes(){const selected=$('route-filter').value;let count=0;document.querySelectorAll('[data-route]').forEach(c=>{c.hidden=selected!=='all'&&c.dataset.route!==selected;if(!c.hidden)count++;});$('route-status').textContent=text(`${count} مسارات معروضة`,`${count} routes zichtbaar`);}
 $('route-filter').addEventListener('change',showRoutes);
 new MutationObserver(()=>{showSalary();showBudget();showChecks();showRoutes();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 showChecks();showRoutes();
})();
