'use strict';
const journalVideo=document.querySelector('#journal-video');
const journalPlay=document.querySelector('.journal-play');
const videoStatus=document.querySelector('#video-status');
if(journalVideo&&journalPlay){
 journalVideo.controls=false;
 journalPlay.hidden=false;
 journalPlay.addEventListener('click',async()=>{
  journalVideo.controls=true;
  journalPlay.hidden=true;
  videoStatus.textContent='';
  try{await journalVideo.play();}catch{
   journalPlay.hidden=false;
   videoStatus.textContent='Не удалось запустить видео. Попробуйте ещё раз.';
  }
 });
 journalVideo.addEventListener('ended',()=>{journalPlay.hidden=false;});
 journalVideo.addEventListener('error',()=>{journalVideo.controls=true;journalPlay.hidden=true;videoStatus.textContent='Видео не удалось загрузить. Обновите страницу или попробуйте позже.';});
}
