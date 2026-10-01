/* يجهّز البريد فقط؛ يراجع الزائر الرسالة ويرسلها من تطبيق البريد بنفسه. */
(()=>{'use strict';const form=document.getElementById('contactForm');if(!form)return;
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const nl=document.documentElement.lang==='nl',get=id=>document.getElementById(id),topic=get('topic'),subject=topic.options[topic.selectedIndex].textContent;
const body=(nl?'Naam: ':'الاسم: ')+get('name').value+'\n'+(nl?'E-mail: ':'البريد: ')+get('email').value+'\n\n'+get('message').value;
window.location.href='mailto:a.alzoubi.07.11@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
get('status').textContent=nl?'Je e-mailapp wordt geopend. Controleer het bericht en verstuur het zelf.':'يُفتح تطبيق البريد. راجع الرسالة وأرسلها بنفسك.';
});})();
