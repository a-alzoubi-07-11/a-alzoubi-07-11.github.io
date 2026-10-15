/* يجهّز البريد فقط؛ يراجع الزائر الرسالة ويرسلها من تطبيق البريد بنفسه. */
(()=>{'use strict';const form=document.getElementById('contactForm');if(!form)return;
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const nl=document.documentElement.lang==='nl',get=id=>document.getElementById(id),topic=get('topic'),subject=topic.options[topic.selectedIndex].textContent;
const body=(nl?'Naam: ':'الاسم: ')+get('name').value+'\n'+(nl?'E-mail: ':'البريد: ')+get('email').value+'\n\n'+get('message').value;
window.location.href='mailto:a.alzoubi.07.11@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
get('status').textContent=nl?'Je e-mailapp wordt geopend. Controleer het bericht en verstuur het zelf.':'يُفتح تطبيق البريد. راجع الرسالة وأرسلها بنفسك.';
});})();

(()=>{'use strict';const form=document.getElementById('contactForm');if(!form||document.getElementById('copyEmail'))return;
const nl=document.documentElement.lang==='nl',addr='a.alzoubi.07.11@gmail.com',b=document.createElement('button');
b.type='button';b.id='copyEmail';b.className='btn secondary';b.textContent=nl?'E-mailadres kopiëren':'نسخ عنوان البريد';
b.addEventListener('click',async()=>{const st=document.getElementById('status');let ok=false;try{await navigator.clipboard.writeText(addr);ok=true;}catch{}
 if(st)st.textContent=ok?(nl?'Gekopieerd: '+addr+'. Plak het in je eigen e-mailprogramma.':'نُسخ: '+addr+'. الصقه في برنامج بريدك.'):(nl?'Kopiëren lukte niet. Het adres is: '+addr:'تعذّر النسخ. العنوان هو: '+addr);});
const reset=form.querySelector('button[type=reset]');(reset?.parentElement||form).insertBefore(b,reset?reset.nextSibling:null);})();
