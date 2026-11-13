// KNM practice questions: structure and both languages. Run: node tests/knm.test.js
global.window={};require("../assets/knm-questions.js");const D=window.GN_KNM;let fail=0;const bad=m=>{console.log("FAIL "+m);fail++};
const seen=new Set();
D.items.forEach((it,i)=>{const id=`#${i+1} ${it.q&&it.q[1]}`;
 if(!D.themes[it.t])bad(id+": unknown theme");
 for(const k of ["q","e"])if(!Array.isArray(it[k])||it[k].length!==2||it[k].some(x=>!x||x.length<3))bad(id+": "+k+" needs Arabic and Dutch");
 if(!Array.isArray(it.o)||it.o.length!==3||it.o.some(o=>o.length!==2||!o[0]||!o[1]))bad(id+": needs 3 options in both languages");
 if(!(it.a>=0&&it.a<3))bad(id+": answer index");
 if(new Set(it.o.map(o=>o[1])).size!==3)bad(id+": duplicate options");
 if(seen.has(it.q[1]))bad(id+": duplicate question");seen.add(it.q[1]);
 if(!/[؀-ۿ]/.test(it.q[0])||/[؀-ۿ]/.test(it.q[1]))bad(id+": language order must be [Arabic, Dutch]");});
for(const t of Object.keys(D.themes))if(D.items.filter(i=>i.t===t).length<6)bad("theme "+t+" has fewer than 6 questions");
console.log(fail?"":"ok   "+D.items.length+" questions, "+Object.keys(D.themes).length+" themes");process.exit(fail?1:0);
