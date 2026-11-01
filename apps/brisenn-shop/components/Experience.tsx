'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {HOME} from '@/lib/catalogue';
import {Icon} from './Icon';
import {useCinema} from './Cinema';

export function ExperienceHero(){
  const video=useRef<HTMLVideoElement>(null),section=useRef<HTMLElement>(null);
  const [paused,setPaused]=useState(true);const {openFilm,filmOpen}=useCinema();
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setPaused(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
  useEffect(()=>{let visible=true;const sync=()=>{if(paused||filmOpen||!visible||document.hidden)video.current?.pause();else void video.current?.play().catch(()=>setPaused(true))};const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:.02});if(section.current)observer.observe(section.current);document.addEventListener('visibilitychange',sync);sync();return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync)}},[paused,filmOpen]);
  return <section className="experience-hero" ref={section} id="experience" aria-label="Introducing BRISÉNN">
    <video ref={video} className="experience-hero-video" muted loop playsInline preload="auto" poster={HOME+'assets/film-living-room.jpg'} aria-label="Blue Fade in a sunlit living room" data-testid="experience-hero-video"><source src={HOME+'media/living-room-loop.mp4'} type="video/mp4"/></video>
    <div className="experience-hero-shade"/>
    <span className="experience-hero-kicker eyebrow">HANDMADE ACRYLIC WALL ART / AMSTERDAM</span>
    <div className="experience-hero-copy"><p className="eyebrow">MADE BY HAND. COMPOSED BY YOU.</p><h1>Art, in<br/><em>connection.</em></h1><p>Sculptural links. Moving light.<br/>A piece that becomes part of your space.</p><div className="experience-hero-actions"><Link className="button light" href="/compose/">Compose your piece <Icon name="arrow"/></Link><Link className="hero-collection-link" href="/products/">Explore the collection <Icon name="arrow"/></Link></div></div>
    <div className="experience-hero-bottom"><a href="#connection" className="experience-scroll"><span/>SCROLL TO CONNECT</a><button className="experience-watch" onClick={openFilm}><span className="experience-play"><Icon name="play"/></span><span>Watch the film<small>BRISÉNN / 00:20</small></span></button><button className="experience-pause icon-button" aria-label={paused?'Play background motion':'Pause background motion'} onClick={()=>setPaused(!paused)}><Icon name={paused?'play':'pause'}/></button></div>
  </section>;
}

export function ConnectionStory(){
  const section=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),video=useRef<HTMLVideoElement>(null),progress=useRef<HTMLSpanElement>(null);
  const [playing,setPlaying]=useState(false),[step,setStep]=useState(0),[failed,setFailed]=useState(false);
  useEffect(()=>{
    const node=section.current,output=canvas.current,context=output?.getContext('2d',{alpha:false});if(!node||!output||!context)return;
    let disposed=false,frame=0,near=false,target=0,drawn=-1,loads=0;const cache=new Map<number,HTMLImageElement>(),pending=new Set<number>(),queue:number[]=[];const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const paint=(n:number)=>{const image=cache.get(Math.floor(n/12));if(!image)return;const cell=n%12;context.drawImage(image,(cell%4)*768,Math.floor(cell/4)*432,768,432,0,0,768,432);output.dataset.frame=String(n);output.dataset.ready='true';drawn=n};
    const load=()=>{while(loads<2&&queue.length&&!disposed){const n=queue.shift()!;if(cache.has(n)||pending.has(n))continue;pending.add(n);loads++;const image=new Image();image.decoding='async';image.onload=()=>{loads--;pending.delete(n);if(disposed)return;cache.set(n,image);if(n===Math.floor(target/12))paint(target);else if(drawn<0)paint(n*12);if(cache.size>3){const far=[...cache.keys()].sort((a,b)=>Math.abs(b-Math.floor(target/12))-Math.abs(a-Math.floor(target/12)));far.slice(0,cache.size-3).forEach(k=>cache.delete(k))}load()};image.onerror=()=>{loads--;pending.delete(n);if(!disposed){setFailed(true);load()}};image.src=HOME+`assets/connection-sequence/sequence-${String(n+1).padStart(2,'0')}.webp`}};
    const request=(n:number)=>{target=n;if(cache.has(Math.floor(n/12)))paint(n);queue.length=0;[Math.floor(n/12),Math.floor(n/12)+1,Math.floor(n/12)-1].filter(i=>i>=0&&i<8&&!cache.has(i)&&!pending.has(i)).forEach(i=>queue.push(i));load()};
    const update=()=>{frame=0;if(disposed)return;const top=document.querySelector('.header')?.getBoundingClientRect().height||80,r=node.getBoundingClientRect(),amount=Math.max(0,Math.min(1,(top-r.top)/Math.max(1,node.offsetHeight-(innerHeight-top))));if(progress.current)progress.current.style.transform=`scaleX(${amount})`;setStep(Math.min(2,Math.floor(amount*3)));if(near&&!playing)request(reduced.matches?48:Math.round(amount*95))};
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};const observer=new IntersectionObserver(([e])=>{near=e.isIntersecting;if(near)scroll()},{rootMargin:'700px'});observer.observe(node);addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);scroll();
    return()=>{disposed=true;observer.disconnect();removeEventListener('scroll',scroll);removeEventListener('resize',scroll);cancelAnimationFrame(frame);cache.clear()};
  },[playing]);
  const toggle=()=>{if(playing){video.current?.pause();setPlaying(false)}else{setPlaying(true);if(video.current){video.current.currentTime=0;void video.current.play().catch(()=>setPlaying(false))}}};
  return <section className="experience-connection" id="connection" ref={section} aria-label="Watch the links connect as you scroll"><div className="experience-connection-sticky">
    <div className={'experience-sequence'+(playing?' is-playing':'')}><img className="experience-sequence-poster" src={HOME+'assets/film-assembly-start.jpg'} alt="Gloved hands connecting acrylic links" loading="lazy"/><canvas ref={canvas} width="768" height="432" aria-label="Acrylic links connecting as you scroll" data-testid="experience-sequence"/><video ref={video} src={HOME+'media/connection.mp4'} poster={HOME+'assets/film-assembly-start.jpg'} muted playsInline controls={playing} preload="none" onEnded={()=>setPlaying(false)}/><span className="eyebrow">CRAFTED TO CONNECT</span></div>
    <div className="experience-connection-copy"><span className="eyebrow">THE ART OF COMING TOGETHER / 01</span><h2>One link.<br/><em>Endless<br className="wide-break"/> possibilities.</em></h2><p>Connect colour, finish and form. A small gesture becomes something entirely your own.</p><ol>{['Choose your colours.','Make the connection.','Find its place.'].map((text,i)=><li key={text} className={step===i?'active':''}><span>0{i+1}</span>{text}</li>)}</ol><div className="experience-sequence-progress"><span ref={progress}/></div><button className="text-link" onClick={toggle}>{playing?'Pause connection':'Play the connection'}<Icon name={playing?'pause':'play'}/></button>{failed&&<p className="small-note">Press play to watch the connection.</p>}</div>
  </div></section>;
}

export function RoomTransformation(){
  const [split,setSplit]=useState(45);
  return <section className="experience-transformation" id="in-your-space"><div className="experience-section-heading" data-motion><span className="eyebrow">A DIFFERENT PERSPECTIVE / 02</span><h2>A room.<br/><em>Then, a feeling.</em></h2><p>One composition can change the atmosphere.<br/>Move the line. See the difference.</p></div><div className="experience-comparison" style={{'--reveal':split+'%'} as React.CSSProperties}><img src={HOME+'assets/living-room-empty.jpg'} alt="Living room before the artwork" width="1280" height="720" loading="lazy"/><img className="experience-comparison-after" src={HOME+'assets/film-living-room.jpg'} alt="The room with Blue Fade acrylic wall art" width="1280" height="720" loading="lazy"/><div className="experience-comparison-line"><span><Icon name="compare"/></span></div><div className="experience-comparison-labels"><span>BEFORE</span><span>WITH BRISÉNN</span></div><input aria-label="Reveal the room with BRISÉNN artwork" type="range" min="0" max="100" value={split} onChange={e=>setSplit(+e.target.value)}/></div><div className="experience-comparison-caption"><span>BLUE FADE / A STUDY IN CONNECTION</span><Link href="/in-your-space/">Try it in your room <Icon name="arrow"/></Link></div></section>;
}

export function RevealMotion(){
  useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');observer.unobserve(e.target)}}),{threshold:.08});const nodes=document.querySelectorAll('[data-motion]');nodes.forEach(n=>{n.classList.add('motion-ready');observer.observe(n)});return()=>{observer.disconnect();nodes.forEach(n=>n.classList.remove('motion-ready'))}},[]);
  return null;
}
