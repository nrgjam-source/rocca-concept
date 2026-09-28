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
document.querySelector('#all-projects').addEventListener('click',e=>{const button=e.currentTarget;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.querySelector('#project-note').hidden=!open;});
// Motion is recalculated from each element's viewport position, including reverse scrolling.
const motion=[...document.querySelectorAll('[data-motion]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
function updateMotion(){queued=false;const vh=innerHeight;motion.forEach(el=>{if(reduced.matches){el.style.removeProperty('transform');el.style.removeProperty('opacity');return;}const top=el.getBoundingClientRect().top;const progress=Math.max(0,Math.min(1,(vh*.98-top)/(vh*.68)));const eased=progress*progress*(3-2*progress);if(el.dataset.motion==='grow'){el.style.transform=`scale(${.91+.09*eased})`;el.style.opacity=String(.6+.4*eased);}else{const distance=innerWidth<701?20:Math.min(65,innerWidth*.04);const direction=el.dataset.motion==='right'?1:-1;el.style.transform=`translateX(${(1-eased)*distance*direction}px)`;el.style.opacity=String(.28+.72*eased);}});}
function schedule(){if(!queued){queued=true;requestAnimationFrame(updateMotion);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{if(innerWidth>1150)closeMenu();schedule();});reduced.addEventListener('change',schedule);schedule();
