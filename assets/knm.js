/* KNM practice quiz. Questions: assets/knm-questions.js. Score stays in this browser only. */
(function(){'use strict';
var root=document.getElementById('knm');if(!root||!window.GN_KNM)return;
var D=window.GN_KNM,nl=(document.documentElement.lang||'').slice(0,2)==='nl',L=nl?1:0;
var T=nl?{pick:'Kies een onderwerp',all:'Alle onderwerpen',start:'Start (10 vragen)',q:'Vraag',of:'van',next:'Volgende vraag',finish:'Bekijk je score',right:'Goed!',wrong:'Niet goed.',ans:'Het goede antwoord:',score:'Je score',best:'Je beste score op dit apparaat',again:'Opnieuw oefenen',other:'Ander onderwerp',review:'Deze vragen had je fout',none:'Alles goed. Probeer een ander onderwerp.',count:'vragen'}
          :{pick:'اختر موضوعاً',all:'كل المواضيع',start:'ابدأ (10 أسئلة)',q:'السؤال',of:'من',next:'السؤال التالي',finish:'اعرض نتيجتك',right:'صحيح!',wrong:'غير صحيح.',ans:'الجواب الصحيح:',score:'نتيجتك',best:'أفضل نتيجة لك على هذا الجهاز',again:'تدرّب من جديد',other:'موضوع آخر',review:'أسئلة أخطأت فيها',none:'كل الإجابات صحيحة. جرّب موضوعاً آخر.',count:'سؤالاً'};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var KEY='gn-knm-best',theme='all',set=[],idx=0,good=0,wrongs=[];
function best(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
function saveBest(t,pct){try{var b=best();if(!(b[t]>=pct)){b[t]=pct;localStorage.setItem(KEY,JSON.stringify(b))}}catch(e){}}
function home(){
 var b=best(),keys=['all'].concat(Object.keys(D.themes));
 root.innerHTML='<fieldset class="knm-pick"><legend>'+T.pick+'</legend><div class="knm-themes">'+keys.map(function(k){
  var n=k==='all'?D.items.length:D.items.filter(function(i){return i.t===k}).length;
  return '<label><input type="radio" name="knm-t" value="'+k+'"'+(k===theme?' checked':'')+'><span><b>'+esc(k==='all'?T.all:D.themes[k][L])+'</b><small>'+n+' '+T.count+(b[k]!=null?' · '+b[k]+'%':'')+'</small></span></label>'}).join('')
  +'</div></fieldset><button type="button" class="knm-btn knm-start">'+T.start+'</button>';
}
function start(){
 var pool=D.items.filter(function(i){return theme==='all'||i.t===theme});
 set=shuffle(pool).slice(0,10).map(function(it){return{it:it,opts:shuffle(it.o.map(function(o,i){return{txt:o[L],ok:i===it.a}}))}});
 idx=0;good=0;wrongs=[];ask();
}
function ask(){
 var s=set[idx];
 root.innerHTML='<p class="knm-meta">'+T.q+' '+(idx+1)+' '+T.of+' '+set.length+' · '+esc(D.themes[s.it.t][L])+'</p><div class="knm-bar" aria-hidden="true"><span style="width:'+(idx/set.length*100)+'%"></span></div>'
  +'<h2 class="knm-q" tabindex="-1">'+esc(s.it.q[L])+'</h2><div class="knm-opts" role="group" aria-label="'+esc(s.it.q[L])+'">'+s.opts.map(function(o,i){return '<button type="button" class="knm-opt" data-i="'+i+'">'+esc(o.txt)+'</button>'}).join('')
  +'</div><div class="knm-fb" role="status" aria-live="polite"></div>';
 root.querySelector('.knm-q').focus({preventScroll:true});
}
function answer(i){
 var s=set[idx],o=s.opts[i],ok=o.ok,right=s.opts.filter(function(x){return x.ok})[0].txt;
 if(ok)good++;else wrongs.push(s.it);
 [].forEach.call(root.querySelectorAll('.knm-opt'),function(b,k){b.disabled=true;if(s.opts[k].ok)b.classList.add('ok');else if(k===i)b.classList.add('bad')});
 var last=idx===set.length-1;
 root.querySelector('.knm-fb').innerHTML='<p class="'+(ok?'good':'bad')+'"><b>'+(ok?T.right:T.wrong)+'</b>'+(ok?'':' '+T.ans+' '+esc(right)+'.')+'</p><p>'+esc(s.it.e[L])+'</p><button type="button" class="knm-btn knm-next">'+(last?T.finish:T.next)+'</button>';
 root.querySelector('.knm-next').focus();
}
function result(){
 var pct=Math.round(good/set.length*100);saveBest(theme,pct);
 root.innerHTML='<div class="knm-res"><p class="knm-meta">'+T.score+'</p><p class="knm-score" tabindex="-1">'+good+' / '+set.length+' <small>('+pct+'%)</small></p><p class="knm-meta">'+T.best+': '+(best()[theme]||pct)+'%</p></div>'
  +(wrongs.length?'<h2 class="knm-sub">'+T.review+'</h2><ul class="knm-rev">'+wrongs.map(function(it){return '<li><b>'+esc(it.q[L])+'</b><br>'+esc(it.o[it.a][L])+'. '+esc(it.e[L])+'</li>'}).join('')+'</ul>':'<p>'+T.none+'</p>')
  +'<div class="knm-acts"><button type="button" class="knm-btn knm-start">'+T.again+'</button><button type="button" class="knm-btn knm-ghost knm-home">'+T.other+'</button></div>';
 root.querySelector('.knm-score').focus({preventScroll:true});
 if(typeof window.gtag==='function'&&document.documentElement.dataset.analyticsConsent==='granted')window.gtag('event','knm_practice_done',{theme:theme,score:pct});
}
root.addEventListener('change',function(e){if(e.target.name==='knm-t')theme=e.target.value});
root.addEventListener('click',function(e){
 if(e.target.closest('.knm-start')){start();return}
 if(e.target.closest('.knm-home')){home();return}
 var o=e.target.closest('.knm-opt');if(o&&!o.disabled){answer(+o.getAttribute('data-i'));return}
 if(e.target.closest('.knm-next')){idx++;idx<set.length?ask():result()}
});
home();
})();
