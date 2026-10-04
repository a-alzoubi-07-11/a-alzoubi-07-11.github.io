/* Site search: forgiving search over the site's guides, tools and topics.
   Handles typos, Arabic spelling variants (أ/ا، ة/ه، ى/ي، tashkeel), prefixes (ال، وال، بال…),
   colloquial words and Dutch terms written in Arabic letters (aliases in the index),
   split or joined Dutch compounds (zorg toeslag ↔ zorgtoeslag) and Persian/Urdu keyboard letters.
   Exposes window.SiteSearch = {load, search, attach, suggest}. No dependencies. */
(()=>{"use strict";
if(window.SiteSearch)return;
const INDEX_URL="/assets/search-index.json";
let DATA=null,LOADING=null;

/* ---------- text normalisation ---------- */
const AR_DIGITS={"٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"};
function norm(s){
  return String(s||"").toLowerCase()
    .replace(/[٠-٩۰-۹]/g,d=>AR_DIGITS[d])
    .replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ء/g,"")
    .replace(/ک/g,"ك").replace(/[یې]/g,"ي").replace(/گ/g,"ك").replace(/چ/g,"ج").replace(/پ/g,"ب").replace(/ڤ/g,"ف").replace(/ژ/g,"ز")
    .normalize("NFKD").replace(/[̀-ͯ]/g,"")
    .replace(/[ً-ٰٟـ]/g,"")
    .replace(/[^\p{L}\p{N}]+/gu," ").trim();
}
const STOP=new Set(("في من على عن ما ماذا هو هي هل كيف كيفيه طريقه متى اين وين كم لماذا ليش الى او و مع بدي اريد ابغي ابي عايز شو ايش وش لو اذا ان انا عندي لي هذا هذه ذلك التي الذي عند بعد قبل كل اي شي شيء "+
  "de het een van voor in op en of ik wil hoe wat wie waar wanneer is zijn mijn je jij met naar te bij om").split(" "));
const PREFIXES=["وبال","وال","بال","فال","كال","لل","ال","و","ب","ل","ف"];
function stems(tok){
  const out=new Set([tok]);
  if(/[؀-ۿ]/.test(tok)){
    for(const p of PREFIXES){if(tok.startsWith(p)&&tok.length-p.length>=3){out.add(tok.slice(p.length));break}}
    for(const t of [...out]){
      for(const suf of ["ات","ين","ون","يه","ها","ه","ي"]){if(t.endsWith(suf)&&t.length-suf.length>=3){out.add(t.slice(0,-suf.length));break}}
    }
  }else if(tok.length>4){ if(tok.endsWith("en"))out.add(tok.slice(0,-2)); if(tok.endsWith("s"))out.add(tok.slice(0,-1)) }
  return [...out];
}
function tokens(s){return norm(s).split(" ").filter(t=>t&&!STOP.has(t))}

/* Damerau–Levenshtein with a cap */
function dist(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  const d=[];for(let i=0;i<=a.length;i++){d[i]=[i];}
  for(let j=0;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++){let rowMin=Infinity;
    for(let j=1;j<=b.length;j++){const c=a[i-1]===b[j-1]?0:1;
      let v=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,d[i-2][j-2]+1);
      d[i][j]=v;if(v<rowMin)rowMin=v}
    if(rowMin>max)return max+1}
  return d[a.length][b.length];
}
const allowed=len=>len<=3?0:len<=5?1:2;

/* ---------- index ---------- */
const FIELDS=[["t",10],["k",7],["c",3],["h",3],["d",2]];
function prepare(items){
  const vocab=new Set();
  const docs=items.map(it=>{
    const f={};
    for(const [key] of FIELDS){const toks=new Set();for(const t of tokens(it[key]||""))for(const s of stems(t)){toks.add(s);if(s.length>2)vocab.add(s)}f[key]=[...toks]}
    const all=norm([it.t,it.k,it.c,it.h,it.d].join(" "));
    return {it,f,title:norm(it.t),all,compact:all.replace(/ /g,"")};
  });
  return {docs,vocab:[...vocab]};
}
function load(){
  if(DATA)return Promise.resolve(DATA);
  if(!LOADING)LOADING=fetch(INDEX_URL,{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("index "+r.status);return r.json()}).then(j=>(DATA=prepare(j.items||[])));
  return LOADING;
}

function tokenScore(q,list){
  let best=0;const maxD=allowed(q.length);
  for(const t of list){
    if(t===q)return 1;
    if(q.length>=3&&(t.startsWith(q)||(q.startsWith(t)&&t.length>=4&&t.length>=q.length*.75))){best=Math.max(best,.85);continue}
    if(maxD&&best<.6){const d=dist(q,t,maxD);if(d<=maxD)best=Math.max(best,.68-.12*d)}
  }
  return best;
}
function search(query,lang,limit=8){
  if(!DATA)return {results:[],corrected:null};
  const raw=tokens(query);
  if(!raw.length)return {results:[],corrected:null};
  const qn=norm(query),qc=qn.replace(/ /g,"");
  const groups=raw.map(t=>stems(t));
  /* split Dutch compounds the other way: "zorg toeslag" also as "zorgtoeslag" */
  const joined=[];for(let i=0;i<raw.length-1;i++)joined.push(raw[i]+raw[i+1]);
  const scored=[];
  for(const doc of DATA.docs){
    let sum=0,hit=0;
    for(const g of groups){
      let s=0,extra=0;
      for(const [key,w] of FIELDS){let fm=0;for(const v of g){const m=tokenScore(v,doc.f[key]);if(m)fm=Math.max(fm,w*m)}if(fm>s){extra+=s;s=fm}else extra+=fm}
      if(s)s+=.15*extra;
      if(!s&&g[0].length>=4&&doc.compact.includes(g[0]))s=4;
      if(s){sum+=s;hit++}
    }
    for(const j of joined){if(j.length>=6&&doc.compact.includes(j)){sum+=8;hit=Math.max(hit,groups.length)}}
    if(!sum)continue;
    const cover=hit/groups.length;
    if(groups.length>1&&cover<.5)continue;
    let score=sum*(.45+.55*cover);
    if(qn.length>=3&&doc.title.includes(qn))score+=12;
    else if(qc.length>=5&&doc.compact.includes(qc))score+=5;
    if(doc.it.l===lang)score*=1.6;
    if(doc.it.y==="topic")score*=.7;
    scored.push({doc,score});
  }
  scored.sort((a,b)=>b.score-a.score);
  const top=scored.length?scored[0].score:0;
  let results=scored.filter(x=>x.score>=top*.35).slice(0,limit).map(x=>x.doc.it);
  /* prefer the page language; show the other language only if nothing else matched */
  const same=results.filter(r=>r.l===lang);if(same.length)results=same;
  return {results,corrected:results.length?null:suggest(query)};
}
/* "Did you mean": replace each unknown word with the closest known word */
function suggest(query){
  if(!DATA)return null;
  const toks=tokens(query);let changed=false;
  const fixed=toks.map(t=>{if(DATA.vocab.includes(t))return t;let best=null,bd=3;
    for(const v of DATA.vocab){if(Math.abs(v.length-t.length)>2)continue;const d=dist(t,v,2);if(d<bd){bd=d;best=v}}
    if(best&&bd<=Math.max(1,allowed(t.length))){changed=true;return best}return t});
  return changed?fixed.join(" "):null;
}

/* ---------- UI ---------- */
const TXT={ar:{ph:"مثلاً: لمّ الشمل، بدل السكن",none:"لم نجد نتيجة مطابقة.",mean:"هل تقصد:",try:"جرّب أحد هذه المواضيع:",guide:"دليل",tool:"أداة",topic:"قسم",other:"بالهولندية",hint:"اكتب كلمة أو كلمتين، بالعربية أو الهولندية، ولا تقلق من الأخطاء الإملائية.",pop:"الأكثر بحثاً",count:n=>n+" نتيجة"},
 nl:{ph:"Bijv. huurtoeslag, DigiD",none:"Geen passend resultaat gevonden.",mean:"Bedoel je:",try:"Probeer een van deze onderwerpen:",guide:"Gids",tool:"Hulpmiddel",topic:"Onderwerp",other:"in het Arabisch",hint:"Typ een of twee woorden, in het Nederlands of Arabisch. Tikfouten zijn geen probleem.",pop:"Veelgezocht",count:n=>n+" resultaten"}};
const POPULAR={ar:["لم الشمل","بدل السكن","zorgtoeslag","الحد الأدنى للأجر","DigiD","الجنسية","تمويل الدراسة","قسيمة الراتب"],
 nl:["gezinshereniging","huurtoeslag","zorgtoeslag","minimumloon","DigiD","naturalisatie","studiefinanciering","loonstrook"]};
const CSS=`.ss-list{list-style:none;margin:8px 0 0;padding:6px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.14);max-height:min(62vh,520px);overflow:auto;text-align:start;font-family:var(--ap-font,system-ui)}
.ss-list[hidden]{display:none}
.ss-wrap{position:relative}.ss-wrap>.ss-list{position:absolute;inset-inline:0;top:100%;z-index:60}
.ss-opt{display:block;padding:10px 12px;border-radius:10px;color:#1d1d1f;text-decoration:none;cursor:pointer}
.ss-opt[aria-selected="true"],.ss-opt:hover{background:#f2f2f5}
.ss-t{display:block;font-size:15px;font-weight:600;line-height:1.45}
.ss-m{display:block;font-size:12.5px;color:#6e6e73;margin-top:2px;line-height:1.5}
.ss-note{padding:10px 12px;font-size:14px;color:#6e6e73;line-height:1.6}
.ss-note button,.ss-chip{font:inherit;font-size:14px;border:0;background:#f2f2f5;color:#1d1d1f;border-radius:999px;padding:.3rem .8rem;margin:4px 4px 0 0;cursor:pointer}
.ss-note button.ss-fix{background:none;color:#0066cc;padding:0;margin:0;text-decoration:underline}
.ss-chip:hover{background:#e8e8ed}
.ss-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}`;
function css(){if(document.getElementById("ss-css"))return;const s=document.createElement("style");s.id="ss-css";s.textContent=CSS;document.head.append(s)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let uid=0;
function attach(input,opts={}){
  css();
  const lang=opts.lang||((document.documentElement.lang||"ar").startsWith("nl")?"nl":"ar"),T=TXT[lang];
  const list=document.createElement("ul");const id="ss-list-"+(++uid);
  list.id=id;list.className="ss-list";list.setAttribute("role","listbox");list.hidden=true;
  (opts.container||input.parentNode).append(list);
  const live=document.createElement("div");live.className="ss-sr";live.setAttribute("aria-live","polite");list.after(live);
  input.setAttribute("role","combobox");input.setAttribute("aria-autocomplete","list");input.setAttribute("aria-controls",id);input.setAttribute("aria-expanded","false");
  if(!input.placeholder||opts.placeholder!==false)input.placeholder=T.ph;
  let items=[],active=-1,timer=null;
  const open=v=>{list.hidden=!v;input.setAttribute("aria-expanded",String(v))};
  const mark=()=>{[...list.querySelectorAll(".ss-opt")].forEach((o,i)=>o.setAttribute("aria-selected",String(i===active)));const a=list.querySelector('.ss-opt[aria-selected="true"]');if(a){input.setAttribute("aria-activedescendant",a.id);a.scrollIntoView({block:"nearest"})}else input.removeAttribute("aria-activedescendant")};
  const chips=(arr)=>arr.map(q=>`<button type="button" class="ss-chip" data-q="${esc(q)}">${esc(q)}</button>`).join("");
  function renderEmpty(){list.innerHTML=`<li class="ss-note" role="presentation">${esc(T.hint)}<div>${chips(POPULAR[lang])}</div></li>`;items=[];active=-1;open(true)}
  function render(q){
    const {results,corrected}=search(q,lang,8);items=results;active=results.length?0:-1;
    if(!results.length){
      list.innerHTML=`<li class="ss-note" role="presentation">${esc(T.none)}${corrected?` ${esc(T.mean)} <button type="button" class="ss-fix" data-q="${esc(corrected)}">${esc(corrected)}</button>`:""}<div style="margin-top:6px">${esc(T.try)}</div><div>${chips(POPULAR[lang])}</div></li>`;
      live.textContent=T.none;open(true);return}
    list.innerHTML=results.map((r,i)=>`<li role="presentation"><a class="ss-opt" role="option" id="${id}-o${i}" href="${esc(r.u)}"><span class="ss-t">${esc(r.t)}</span><span class="ss-m">${esc([T[r.y]||"",r.c,r.l!==lang?T.other:""].filter(Boolean).join(" · "))}</span></a></li>`).join("");
    live.textContent=T.count(results.length);open(true);mark();
  }
  function run(){const q=input.value.trim();if(!q){renderEmpty();return}load().then(()=>render(q)).catch(()=>{list.innerHTML=`<li class="ss-note">${esc(T.none)}</li>`;open(true)})}
  input.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(run,70)});
  input.addEventListener("focus",()=>{load();run()});
  input.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"&&items.length){e.preventDefault();active=(active+1)%items.length;mark()}
    else if(e.key==="ArrowUp"&&items.length){e.preventDefault();active=(active-1+items.length)%items.length;mark()}
    else if(e.key==="Enter"){e.preventDefault();if(items[active>=0?active:0])location.href=items[active>=0?active:0].u;else run()}
    else if(e.key==="Escape"){open(false);opts.onEscape&&opts.onEscape()}
  });
  list.addEventListener("mousedown",e=>{if(e.target.closest("button"))e.preventDefault()});
  list.addEventListener("click",e=>{const b=e.target.closest("[data-q]");if(b){input.value=b.dataset.q;input.focus();run()}});
  document.addEventListener("click",e=>{if(!opts.keepOpen&&!list.contains(e.target)&&e.target!==input)open(false)});
  return {run,close:()=>open(false)};
}
window.SiteSearch={load,search,attach,suggest,norm};
})();
