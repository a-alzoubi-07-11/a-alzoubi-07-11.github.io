// Search regression test: each query must put the expected page in the top results.
// Run: node tests/search.test.js   (uses assets/search-index.json, no network)
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
global.window={};global.document={addEventListener(){},querySelectorAll(){return[]},documentElement:{lang:"ar"}};
global.fetch=async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,"assets/search-index.json"),"utf8"))});
eval(fs.readFileSync(path.join(root,"assets/site-search.js"),"utf8"));
const CASES=[
 ["الطعن","ar","/beroep/",3],["طعن على رفض الإقامة","ar","/beroep/",3],["رفض الإقامة الدائمة","ar","/beroep/",5],
 ["beroep","nl","/nl/beroep/",3],["beroepschrift","nl","/nl/beroep/",3],["beroep","ar","/beroep/",3],
 ["الجنسية","ar","/articles/dutch-naturalisation-guide.html",3],["التجنس","ar","/articles/dutch-naturalisation-guide.html",3],
 ["naturalisatie","ar","/articles/dutch-naturalisation-guide.html",4],["naturalisatie","nl","/nl/articles/dutch-naturalisation-guide.html",3],
 ["زورخ توسلاخ","ar","/articles/zorgtoeslag-guide.html",3],["zorgtoeslag","ar","/articles/zorgtoeslag-guide.html",3],
 ["اعتراض","ar","/articles/bezwaar-objection-letter.html",3],["سيرة ذاتية","ar","/cv.html",3],["لم الشمل","ar","/articles/family-reunification-mvv-ind.html",3],
];
(async()=>{
 await window.SiteSearch.load();let fail=0;
 for(const [q,lang,want,top] of CASES){
  const r=window.SiteSearch.search(q,lang,8).results.map(x=>x.u);const pos=r.indexOf(want);
  const ok=pos>=0&&pos<top;if(!ok)fail++;
  console.log(`${ok?"ok  ":"FAIL"} ${q} [${lang}] -> ${want} at ${pos<0?"none":pos+1}${ok?"":"  got: "+r.slice(0,4).join(", ")}`);
 }
 const none=window.SiteSearch.search("xqzvw","ar").results.length;console.log(none===0?"ok   no results for nonsense":"FAIL nonsense matched");if(none)fail++;
 process.exit(fail?1:0);
})();
