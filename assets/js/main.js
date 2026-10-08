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
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const photoReveal=[...document.querySelectorAll('.portfolio-page .real-photo')];
let queued=false;
function schedule(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;updateSticky();});}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{if(innerWidth>1150)closeMenu();schedule();});
schedule();

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

// Internal photographic chapters keep their separate viewport reveal.
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

// One-time reveal: IntersectionObserver changes classes; scroll never writes image styles.
const homepage=!!document.querySelector('.hero');
const entryTargets=[...document.querySelectorAll('[data-motion],.technology-item')].filter(el=>!photoReveal.includes(el));
const seenEntries=new WeakSet();
let entryObserver;
entryTargets.forEach(el=>{
 if(homepage&&el.matches('.architecture-image,.final-stair,.solutions-grid .media'))el.classList.add('cinematic-entry');
 else el.classList.add('section-entry');
 if(el.matches('.technology-item')){
  const siblings=[...el.parentElement.children];el.style.setProperty('--entry-delay',`${siblings.indexOf(el)%4*80}ms`);
 }
 if(el.matches('.solutions-grid .media'))el.style.setProperty('--entry-delay','100ms');
});
function configureEntries(){
 if(entryObserver)entryObserver.disconnect();
 entryTargets.forEach(el=>{
  if(reduced.matches){seenEntries.add(el);el.classList.remove('entry-ready');el.classList.add('entry-shown');}
  else{el.classList.add('entry-ready');el.classList.toggle('entry-shown',seenEntries.has(el));}
 });
 if(reduced.matches||!('IntersectionObserver' in window)){
  entryTargets.forEach(el=>el.classList.add('entry-shown'));return;
 }
 entryObserver=new IntersectionObserver(entries=>entries.forEach(({target:el,isIntersecting})=>{
  if(!isIntersecting)return;
  seenEntries.add(el);el.classList.add('entry-shown');entryObserver.unobserve(el);
  if(el.matches('.architecture-image'))setTimeout(()=>el.classList.add('camera-ready'),1400);
 }),{threshold:.18});
 entryTargets.filter(el=>!seenEntries.has(el)).forEach(el=>entryObserver.observe(el));
}
reduced.addEventListener('change',configureEntries);configureEntries();
if(homepage){
 const hero=document.querySelector('.hero');
 const image=hero.querySelector('img');
 if(!reduced.matches)hero.classList.add('hero-entry');
 image.decode().catch(()=>{}).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
  hero.classList.add('hero-loaded');
  setTimeout(()=>hero.classList.add('hero-camera-ready'),innerWidth<=700?1250:1450);
 })));
 reduced.addEventListener('change',()=>{if(reduced.matches)hero.classList.remove('hero-entry');});
 // Visibility affects only play state; time and scale are handled entirely by CSS.
 const cameraObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.classList.toggle('camera-active',isIntersecting)),{threshold:0}):null;
 document.querySelectorAll('.hero-photo,.architecture-image').forEach(el=>cameraObserver?.observe(el));
}
