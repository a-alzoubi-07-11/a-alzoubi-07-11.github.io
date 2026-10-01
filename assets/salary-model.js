/* جداول Belastingdienst لعام 2026؛ نموذج سنوي مبسّط لموظف دون سن AOW طوال العام. */
(function(root){'use strict';
 function annual(gross,credits=true){
  if(!Number.isFinite(gross)||gross<0||gross>2000000)throw new RangeError('Invalid gross income');
  const taxBefore=Math.min(gross,38883)*.3575+Math.max(0,Math.min(gross,78426)-38883)*.3756+Math.max(0,gross-78426)*.495;
  const general=gross<=29736?3115:gross<=78426?Math.max(0,3115-.06398*(gross-29736)):0;
  const employment=gross<=11965?gross*.08324:gross<=25845?996+.31009*(gross-11965):gross<=45592?5300+.01950*(gross-25845):gross<=132920?Math.max(0,5685-.06510*(gross-45592)):0;
  const applied=credits?Math.min(taxBefore,general+employment):0;
  const tax=Math.max(0,taxBefore-applied);
  return {gross,taxBefore,credits:applied,tax,net:gross-tax};
 }
 root.GuideSalary2026={annual};
 if(typeof module==='object'&&module.exports)module.exports=root.GuideSalary2026;
})(typeof globalThis==='object'?globalThis:this);
