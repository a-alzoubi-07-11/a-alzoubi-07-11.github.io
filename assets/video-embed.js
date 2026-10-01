/* لا اتصال بيوتيوب أو تحميل صورته قبل اختيار تشغيل الفيديو. */
(()=>{'use strict';document.querySelectorAll('[data-video-id]').forEach(slot=>{
 const id=slot.dataset.videoId;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
 slot.querySelector('[data-play-video]')?.addEventListener('click',()=>{
  const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id;
  frame.title=slot.dataset.videoTitle||'YouTube';frame.loading='lazy';frame.width='560';frame.height='315';
  frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
  slot.replaceChildren(frame);
 },{once:true});
});})();
