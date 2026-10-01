/* اللغة الحالية تطبق على رابط الأدوات الثابت في الصفحة الرئيسية. */
(()=>{'use strict';const render=()=>document.querySelectorAll('[data-ar][data-nl]').forEach(el=>{el.textContent=el.dataset[document.documentElement.lang==='nl'?'nl':'ar'];});new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();})();
