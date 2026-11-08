// Motivation letter: uses only CV facts and the visitor's text. Run: node tests/motivation.test.js
global.window={};require("../assets/cv-motivation.js");const M=window.GNMotivation;let fail=0;const ok=(c,m)=>{console.log((c?"ok  ":"FAIL")+" "+m);if(!c)fail++};
const facts={name:"Test Persoon",phone:"0600000000",email:"test@example.org",experience:[{id:"a",role:"Magazijnmedewerker",company:"Voorbeeld BV",years:"2023–heden"},{id:"b",role:"Kok",company:"",years:""}],skills:["Teamwork","Plannen"],languages:["Nederlands (B1)","Arabisch"]};
let t=M.build(facts,{job:"Logistiek medewerker",company:"Bedrijf X",why:"jullie werken duurzaam",pick:["a"]});
ok(t.startsWith("Onderwerp: Sollicitatie Logistiek medewerker"),"subject uses the job");
ok(t.includes("Magazijnmedewerker bij Voorbeeld BV (2023–heden)")&&!t.includes("Kok"),"only the chosen experience");
ok(t.includes("Jullie werken duurzaam."),"own sentence, capitalised with full stop");
ok(t.includes("teamwork en plannen")&&t.includes("Nederlands (B1) en Arabisch"),"skills and languages from the CV");
ok(t.trim().endsWith("Test Persoon\n0600000000 · test@example.org"),"signature from the CV");
const e=M.build({},{});ok(e.includes("[functie]")&&e.includes("[bedrijf]")&&e.includes("[naam]")&&!/ervaring als/.test(e),"empty CV: placeholders, no invented experience");
ok(!/undefined|null/.test(t+e),"no undefined values");
ok(M.arabicIn({why:"لأنني أحب العمل"}).join()==="why","Arabic text is flagged, not translated");
process.exit(fail?1:0);
