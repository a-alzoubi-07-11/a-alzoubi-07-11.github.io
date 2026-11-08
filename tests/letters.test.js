// Letter templates: every template must produce a complete Dutch letter. Run: node tests/letters.test.js
global.window={};require("../assets/letter-templates.js");
const G=window.GNLetters;let fail=0;const ok=(c,m)=>{console.log((c?"ok  ":"FAIL")+" "+m);if(!c)fail++};
const sample={name:"Test Persoon",address:"Teststraat 1\n1234 AB Plaats",contact:"test@example.org",to:"Voorbeeld BV"};
for(const t of G.list){
  const all={...sample};G.fieldsOf(t).forEach(f=>{if(!(f.k in all))all[f.k]="voorbeeldwaarde "+f.k});
  const full=G.build(t.id,all);
  ok(!/undefined|null|\[object/.test(full),`${t.id}: no undefined values`);
  ok(/^Aan: Voorbeeld BV\nDatum: \d{1,2} [a-z]+ \d{4}\nOnderwerp: .+\n\nGeachte heer\/mevrouw,/.test(full),`${t.id}: header and opening`);
  ok(full.includes("Met vriendelijke groet,\n\nTest Persoon\nTeststraat 1\n1234 AB Plaats\ntest@example.org"),`${t.id}: closing with name and address`);
  ok(!/\[[^\]]+\]/.test(full),`${t.id}: no placeholders when everything is filled`);
  const empty=G.build(t.id,{});
  ok(/\[Je volledige naam\]/.test(empty),`${t.id}: empty required field shows a visible placeholder`);
  ok(!/kenmerk \)|\(kenmerk \)|over \.|per \./.test(empty),`${t.id}: empty optional fields leave no broken text`);
  ok(typeof t.why==="string"&&t.why.length>40&&typeof t.whyNl==="string",`${t.id}: Arabic and Dutch explanation`);
}
ok(G.list.length===5,"five templates");
process.exit(fail?1:0);
