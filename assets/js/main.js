'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(document.activeElement.closest('nav'))menu.focus();}});
const tabs=[...document.querySelectorAll('[data-tab]')];
function selectTab(key,focus=false){tabs.forEach(tab=>{const active=tab.dataset.tab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.querySelector('#panel-'+tab.dataset.tab).hidden=!active;if(active&&focus)tab.focus();});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab.dataset.tab));tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[j].dataset.tab,true);}});});
document.querySelectorAll('[data-process]').forEach(a=>a.addEventListener('click',()=>selectTab(a.dataset.process)));
// Motion is recalculated from each element's viewport position, including reverse scrolling.
const photoReveal=[...document.querySelectorAll('.portfolio-page .real-photo')];
const motion=[...document.querySelectorAll('[data-motion]')].filter(el=>!photoReveal.includes(el));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
function updateMotion(){queued=false;updateSticky();const vh=innerHeight;motion.forEach(el=>{if(reduced.matches){el.style.removeProperty('transform');el.style.removeProperty('opacity');if(el.hasAttribute('data-production-photo'))el.querySelector('img').style.removeProperty('transform');return;}const top=el.getBoundingClientRect().top;const progress=Math.max(0,Math.min(1,(vh*.98-top)/(vh*.68)));const eased=progress*progress*(3-2*progress);if(el.dataset.motion==='grow'){el.style.transform=`scale(${.95+.05*eased})`;el.style.opacity=String(.6+.4*eased);}else{const distance=innerWidth<701?12:36;const direction=el.dataset.motion==='right'?1:-1;el.style.transform=el.dataset.motion==='up'?`translateY(${(1-eased)*(innerWidth<701?8:20)}px)`:`translateX(${(1-eased)*distance*direction}px)`;el.style.opacity=String(.28+.72*eased);if(el.hasAttribute('data-production-photo'))el.querySelector('img').style.transform=`translateY(${(1-eased)*(innerWidth<701?3:6)}px) scale(1.025)`;}});}
function schedule(){if(!queued){queued=true;requestAnimationFrame(updateMotion);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{if(innerWidth>1150)closeMenu();schedule();});reduced.addEventListener('change',schedule);schedule();

const sticky=document.querySelector('#mobile-cta');
function updateSticky(){if(!sticky||!document.querySelector('.hero')||!document.querySelector('#contact'))return;const hero=document.querySelector('.hero').getBoundingClientRect();const contact=document.querySelector('#contact').getBoundingClientRect();sticky.hidden=innerWidth>700||hero.bottom>72||contact.top<innerHeight*.8||navigation.classList.contains('open');}
menu.addEventListener('click',updateSticky);
const form=document.querySelector('#project-form');const files=document.querySelector('#project-files');const draft=document.querySelector('#draft-link');
if(form&&files&&draft){
document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{const kind=link.dataset.inquiry;if(!form.elements.task.value&&kind!=='project'){form.elements.task.value=kind==='material'?'Нужен подбор материала. ':kind==='professional'?'Оценка профессионального проекта. ':kind+': ';}draft.hidden=true;}));
files.addEventListener('change',()=>{const selected=[...files.files];const invalid=selected.some(f=>! /\.(pdf|dwg|dxf|jpe?g|png)$/i.test(f.name)||f.size>20*1024*1024);files.setCustomValidity(invalid?'Допустимы PDF, DWG, DXF, JPG и PNG до 20 МБ на файл.':'');document.querySelector('#file-status').textContent=invalid?'Проверьте формат и размер файлов.':selected.map(f=>f.name).join(' · ');});
form.addEventListener('input',()=>{draft.hidden=true;document.querySelector('#form-status').textContent='';});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const body=['Имя: '+form.elements.name.value,'Контакт: '+form.elements.contact.value,'Задача: '+form.elements.task.value,'Файлы для приложения вручную: '+([...files.files].map(f=>f.name).join(', ')||'не выбраны')].join('\n\n');draft.href='mailto:hello@roccastone.ru?subject='+encodeURIComponent('ROCCA — расчёт проекта')+'&body='+encodeURIComponent(body);draft.hidden=false;document.querySelector('#form-status').textContent='Черновик подготовлен. Откройте письмо и приложите файлы вручную. Заявка ещё не отправлена.';draft.focus();});

}

// Photo reveals run only on viewport entry; the existing heading motion stays scroll-driven.
if(photoReveal.length && 'IntersectionObserver' in window){
 const revealTimers=new WeakMap();
 let revealObserver;
 photoReveal.forEach((el,i)=>{
  const figure=el.closest('.real-card');
  const siblings=[...figure.parentElement.children].filter(x=>x.matches('.real-card'));
  const order=Math.max(0,siblings.indexOf(figure));
  el.style.setProperty('--reveal-delay',`${Math.min(order%3,2)*120}ms`);
  if(figure.matches('.wide') && i%2===1)el.classList.add('photo-mask');
 });
 function configurePhotoReveal(){
  if(revealObserver)revealObserver.disconnect();
  photoReveal.forEach(el=>{
   clearTimeout(revealTimers.get(el));
   el.classList.remove('photo-pending','photo-entering','photo-visible');
  });
  if(reduced.matches)return;
  revealObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    const el=entry.target;
    if(entry.isIntersecting){
     if(el.classList.contains('photo-visible'))return;
     el.classList.add('photo-entering','photo-visible');
     clearTimeout(revealTimers.get(el));
     revealTimers.set(el,setTimeout(()=>el.classList.remove('photo-entering'),1550));
    }else if(entry.boundingClientRect.top>innerHeight*.5){
     // Re-arm only below the viewport, so reverse scrolling can reveal the frame again.
     clearTimeout(revealTimers.get(el));
     el.classList.remove('photo-visible','photo-entering');
    }
   });
  },{threshold:.06,rootMargin:'0px 0px -24px 0px'});
  photoReveal.forEach(el=>{el.classList.add('photo-pending');revealObserver.observe(el);});
 }
 reduced.addEventListener('change',configurePhotoReveal);
 configurePhotoReveal();
}
