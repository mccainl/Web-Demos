import {icon} from './icons.js';
const $=s=>document.querySelector(s), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero=$('#hero-video'),header=$('#site-header'),story=$('#connection'),canvas=$('#connection-canvas'),ctx=canvas.getContext('2d',{alpha:false});
const connection=$('#connection-video'),dialog=$('#film-dialog'),film=$('#full-film'),ambient=$('#ambient-audio'),sound=$('#sound-toggle');
let paused=reduced,heroVisible=true,musicOn=false,manualPlay=false,lastFilmTrigger,frameQueued=false;
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
function motionLabel(){const b=$('#motion-toggle');b.innerHTML=icon(paused?'play':'pause');b.setAttribute('aria-label',paused?'Play background motion':'Pause background motion');}
function syncHero(){if(paused||document.hidden||!heroVisible||dialog.open)hero.pause();else hero.play().catch(()=>{});}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;motionLabel();syncHero();});motionLabel();syncHero();
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncHero();}).observe($('.cinema-hero'));
function soundLabel(){sound.innerHTML=icon(musicOn?'sound':'mute')+'<span>Sound '+(musicOn?'on':'off')+'</span>';sound.setAttribute('aria-pressed',String(musicOn));sound.setAttribute('aria-label','Turn background music '+(musicOn?'off':'on'));}
ambient.volume=.6;
sound.addEventListener('click',async()=>{if(musicOn){musicOn=false;ambient.pause();soundLabel();}else{musicOn=true;soundLabel();try{await ambient.play();}catch{musicOn=false;soundLabel();}}});
document.addEventListener('visibilitychange',()=>{syncHero();if(document.hidden){ambient.pause();film.pause();}else if(musicOn&&!dialog.open)ambient.play().catch(()=>{});});
const menu=$('.menu-toggle');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');header.classList.remove('menu-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');header.classList.toggle('menu-open',open);});
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target);}}),{threshold:.08});
document.documentElement.classList.add('reveal-ready');document.querySelectorAll('[data-reveal]').forEach(e=>reveal.observe(e));
// A small frame cache makes scroll animation independent of the mobile video decoder.
const frameCount=96,cache=new Map(),pending=new Set(),queue=[];let activeLoads=0,targetFrame=0,drawnFrame=-1,nearStory=false;
function drawFrame(index){const im=cache.get(Math.floor(index/12));if(!im)return;const cell=index%12;ctx.drawImage(im,(cell%4)*768,Math.floor(cell/4)*432,768,432,0,0,768,432);drawnFrame=index;canvas.dataset.frame=String(index);canvas.dataset.ready='true';$('#sequence-state').textContent='';}
function prune(){if(cache.size<=3)return;const targetSheet=Math.floor(targetFrame/12);[...cache.keys()].sort((a,b)=>Math.abs(b-targetSheet)-Math.abs(a-targetSheet)).slice(0,cache.size-3).forEach(k=>cache.delete(k));}
function loadNext(){while(activeLoads<2&&queue.length){const index=queue.shift();if(cache.has(index)||pending.has(index))continue;pending.add(index);activeLoads++;
 const im=new Image();im.decoding='async';
 im.onload=()=>{cache.set(index,im);pending.delete(index);activeLoads--;if(index===Math.floor(targetFrame/12))drawFrame(targetFrame);else if(drawnFrame<0)drawFrame(index*12);prune();loadNext();};
 im.onerror=()=>{pending.delete(index);activeLoads--;if(index===Math.floor(targetFrame/12))$('#sequence-state').textContent='USE PLAY TO WATCH';loadNext();};
 im.src=`assets/connection-sequence/sequence-${String(index+1).padStart(2,'0')}.webp`;
 }}
function requestFrame(index){targetFrame=clamp(Math.round(index),0,frameCount-1);const sheet=Math.floor(targetFrame/12);if(cache.has(sheet))drawFrame(targetFrame);queue.length=0;[sheet,sheet+1,sheet-1].filter(n=>n>=0&&n<8&&!cache.has(n)&&!pending.has(n)).forEach(n=>queue.push(n));loadNext();}
new IntersectionObserver(entries=>{nearStory=entries[0].isIntersecting;if(nearStory)requestFrame(targetFrame);},{rootMargin:'1000px'}).observe(story);
function updateScroll(){frameQueued=false;const sy=scrollY,h=innerHeight,r=story.getBoundingClientRect(),top=header.getBoundingClientRect().height;header.classList.toggle('scrolled',sy>h*.65);$('.reading-progress').style.transform=`scaleX(${clamp(sy/Math.max(1,document.documentElement.scrollHeight-h))})`;
 if(!reduced&&sy<h)hero.style.transform=`translateY(${sy*.08}px) scale(1.025)`;
 const amount=clamp((top-r.top)/Math.max(1,story.offsetHeight-(h-top)));
 $('.story-progress span').style.transform=`scaleX(${amount})`;document.querySelectorAll('[data-step]').forEach((el,i)=>el.classList.toggle('active',i===Math.min(2,Math.floor(amount*3))));
 if(!manualPlay&&!reduced&&(nearStory||r.top<h+900&&r.bottom>0))requestFrame(amount*(frameCount-1));
}
function requestScroll(){if(!frameQueued){frameQueued=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',requestScroll,{passive:true});addEventListener('resize',requestScroll,{passive:true});requestScroll();
const playConnection=$('#play-connection'),videoWrap=$('.connection-video-wrap');
function connectionLabel(){playConnection.innerHTML='<span>'+(manualPlay?'Pause connection':'Play the connection')+'</span>'+icon(manualPlay?'pause':'play');}
playConnection.addEventListener('click',()=>{if(manualPlay){connection.pause();manualPlay=false;videoWrap.classList.remove('playing');requestScroll();}else{manualPlay=true;videoWrap.classList.add('playing');connection.currentTime=0;connection.controls=true;connection.play().catch(()=>{manualPlay=false;videoWrap.classList.remove('playing');connectionLabel();});}connectionLabel();});
connection.addEventListener('ended',()=>{manualPlay=false;videoWrap.classList.remove('playing');requestFrame(95);connectionLabel();});
$('#comparison-range').addEventListener('input',e=>$('#comparison').style.setProperty('--split',e.target.value+'%'));
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{lastFilmTrigger=button;closeMenu();dialog.showModal();document.body.classList.add('modal-open');hero.pause();ambient.pause();film.currentTime=0;film.muted=false;film.volume=1;film.play().catch(()=>{});}));
function closeFilm(){film.pause();dialog.close();document.body.classList.remove('modal-open');syncHero();if(musicOn)ambient.play().catch(()=>{});lastFilmTrigger?.focus({preventScroll:true});}
$('#close-film').addEventListener('click',closeFilm);dialog.addEventListener('cancel',e=>{e.preventDefault();closeFilm();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFilm();}});
if(!reduced&&matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1400px) rotateX(${-y*1.2}deg) rotateY(${x*1.4}deg)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});}
window.BrisennExperience={requestFrame,get drawnFrame(){return drawnFrame;},get targetFrame(){return targetFrame;},get musicOn(){return musicOn;}};
