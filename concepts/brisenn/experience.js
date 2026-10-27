(() => {
  const $ = s => document.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = $('#hero-video'), header = $('#site-header'), story = $('#connection');
  const connection = $('#connection-video'), dialog = $('#film-dialog'), film = $('#full-film');
  const progress = $('.story-progress span');
  let manualPlay = false, paused = reduced, heroVisible = true, frameQueued = false, lastFilmTrigger;
  const clamp = (n, a=0, b=1) => Math.min(b, Math.max(a,n));
  const motion = $('#motion-toggle');
  function motionLabel(){motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-label',paused?'Play background motion':'Pause background motion');}
  motionLabel();
  motion.addEventListener('click',()=>{paused=!paused;paused?hero.pause():hero.play().catch(()=>{});motionLabel();});
  if(!reduced)hero.play().catch(()=>{paused=true;motionLabel();});else hero.pause();
  function syncHero(){if(document.hidden||paused||!heroVisible||dialog.open)hero.pause();else hero.play().catch(()=>{});}
  document.addEventListener('visibilitychange',syncHero);
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncHero();},{threshold:0}).observe($('.cinema-hero'));
  const menu=$('.menu-toggle');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');header.classList.remove('menu-open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');header.classList.toggle('menu-open',open);});
  document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.12});
  document.documentElement.classList.add('reveal-ready');
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  const storyObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&connection.readyState===0)connection.load();},{rootMargin:'600px'});storyObserver.observe(story);
  function updateScroll(){
    frameQueued=false;
    const sy=scrollY,h=innerHeight,rect=story.getBoundingClientRect();
    header.classList.toggle('scrolled',sy>h*.72);
    $('.reading-progress').style.transform=`scaleX(${clamp(sy/(document.documentElement.scrollHeight-h))})`;
    if(!reduced&&sy<h)hero.style.transform=`translateY(${sy*.12}px) scale(1.025)`;
    const amount=clamp(-rect.top/Math.max(1,story.offsetHeight-h));
    progress.style.transform=`scaleX(${amount})`;
    document.querySelectorAll('[data-step]').forEach((el,i)=>el.classList.toggle('active',i===Math.min(2,Math.floor(amount*3))));
    if(!manualPlay&&!reduced&&connection.readyState>0&&rect.top<h&&rect.bottom>0){
      const t=amount*Math.max(0,(connection.duration||8)-.06);
      if(!connection.seeking&&Math.abs(connection.currentTime-t)>.06)connection.currentTime=t;
    }
  }
  function queue(){if(!frameQueued){frameQueued=true;requestAnimationFrame(updateScroll);}}
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});connection.addEventListener('loadedmetadata',queue);connection.addEventListener('seeked',queue);queue();
  $('#play-connection').addEventListener('click',()=>{manualPlay=!manualPlay;if(manualPlay){connection.currentTime=0;connection.play().catch(()=>{});$('#play-connection').innerHTML='Pause connection <span>Ⅱ</span>';}else{connection.pause();$('#play-connection').innerHTML='Play the connection <span>↗</span>';queue();}});
  connection.addEventListener('ended',()=>{manualPlay=false;$('#play-connection').innerHTML='Play the connection <span>↗</span>';});
  $('#comparison-range').addEventListener('input',e=>$('#comparison').style.setProperty('--split',e.target.value+'%'));
  document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{lastFilmTrigger=button;closeMenu();dialog.showModal();document.body.classList.add('modal-open');hero.pause();film.currentTime=0;film.play().catch(()=>{});}));
  function closeFilm(){film.pause();dialog.close();document.body.classList.remove('modal-open');syncHero();lastFilmTrigger?.focus();}
  $('#close-film').addEventListener('click',closeFilm);
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeFilm();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFilm();}});
  if(!reduced&&matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1400px) rotateX(${-y*2}deg) rotateY(${x*2.4}deg)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});
  }
})();
