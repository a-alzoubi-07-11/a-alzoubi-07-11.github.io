// Permanent-residence / naturalisation checker: browser scenarios (needs the local server on :8765 and Playwright).
// Run: python3 -m http.server 8765 &  NODE_PATH=$(npm root -g) node tests/permres.e2e.js
const {chromium}=require("playwright");
const SCEN=[
 {name:"asylum subsidiary protection: renunciation not required",lang:"",f:{permit:"asiel_bt",ground:"subsidiary",age:"35",startMonth:"1",startYear:"2019",inb:"diploma",src:"loon",contract:"vast",salary:"2600",vg:"monthly"},
  expect:{renounce:"ok",noPct:true}},
 {name:"refugee: renunciation not required",lang:"/nl",f:{permit:"asiel_bt",ground:"refugee",age:"40",startMonth:"3",startYear:"2018",inb:"diploma",src:"loon",contract:"vast",salary:"2600",vg:"monthly"},
  expect:{renounce:"ok",noPct:true}},
 {name:"regular permit: renunciation unresolved",lang:"",f:{permit:"reg_bt",purpose:"partner",age:"30",startMonth:"1",startYear:"2019",inb:"diploma",src:"loon",contract:"vast",salary:"2600",vg:"monthly"},
  expect:{renounce:"warn",noPct:true}},
 {name:"married to a Dutch national: exempt",lang:"",f:{permit:"reg_bt",purpose:"partner",dpartner:"married",dpYears:"4",age:"30",startMonth:"1",startYear:"2021",inb:"diploma",src:"loon",contract:"vast",salary:"2600",vg:"monthly"},
  expect:{renounce:"ok",noPct:true}},
];
(async()=>{const b=await chromium.launch();let fail=0;
 for(const s of SCEN){const p=await b.newPage();
  await p.route(/googlesyndication|googletagmanager|doubleclick|fundingchoices|workers\.dev/,r=>r.abort());
  await p.goto(`http://localhost:8765${s.lang}/calculators/permanent-residence-check.html`);await p.waitForSelector("form");
  const r=await p.evaluate(f=>{const form=document.querySelector(".prc form, form");
   for(const [k,v] of Object.entries(f)){const el=form.elements[k];if(!el)continue;if(el.length&&!el.tagName){for(const o of el)o.checked=o.value===v}else el.value=v;el.dispatchEvent?.(new Event("change",{bubbles:true}))}
   form.dispatchEvent(new Event("change",{bubbles:true}));form.requestSubmit();
   const out=document.querySelector(".prc-out, [class*=prc-result]")||document.body;
   const li=[...document.querySelectorAll(".prc-crit li")].filter(x=>/التخلي|afstand|Afstand|الجنسية الأصلية|nationaliteit/i.test(x.textContent));
   return {html:out.innerText,ren:li.map(x=>x.className),pct:/\d+%/.test([...document.querySelectorAll(".prc-route")].map(x=>x.innerText).join(" ")),tally:!!document.querySelector(".prc-tally")};},s.f);
  const ok=r.ren.includes(s.expect.renounce)&&(!s.expect.noPct||(!r.pct&&r.tally));
  if(!ok)fail++;console.log(`${ok?"ok  ":"FAIL"} ${s.name}  (renounce=${r.ren.join(",")||"none"}, percent shown=${r.pct}, tally=${r.tally})`);
  await p.close();}
 await b.close();process.exit(fail?1:0);})();
