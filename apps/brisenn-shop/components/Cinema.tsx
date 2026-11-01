'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {HOME} from '@/lib/catalogue';
import {Icon} from './Icon';

const CinemaContext=createContext({openFilm:()=>{},filmOpen:false});
export const useCinema=()=>useContext(CinemaContext);
export function CinemaProvider({children}:{children:React.ReactNode}) {
  const dialog=useRef<HTMLDialogElement>(null),film=useRef<HTMLVideoElement>(null),audio=useRef<HTMLAudioElement>(null),trigger=useRef<HTMLElement|null>(null);
  const [filmOpen,setFilmOpen]=useState(false),[sound,setSound]=useState(false);
  const path=usePathname();
  const openFilm=useCallback(()=>{trigger.current=document.activeElement as HTMLElement;dialog.current?.showModal();setFilmOpen(true);audio.current?.pause();if(film.current){film.current.currentTime=0;film.current.muted=false;film.current.volume=1;void film.current.play().catch(()=>{})}},[]);
  const closeFilm=useCallback(()=>{film.current?.pause();dialog.current?.close();setFilmOpen(false);trigger.current?.focus({preventScroll:true})},[]);
  useEffect(()=>{if(!filmOpen)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}},[filmOpen]);
  useEffect(()=>{if(audio.current)audio.current.volume=.55;if(sound&&!filmOpen)void audio.current?.play().catch(()=>setSound(false));else audio.current?.pause()},[sound,filmOpen]);
  useEffect(()=>{const change=()=>{if(document.hidden){audio.current?.pause();film.current?.pause()}else if(sound&&!filmOpen)void audio.current?.play().catch(()=>{})};document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change)},[sound,filmOpen]);
  useEffect(()=>{closeFilm()},[path,closeFilm]);
  return <CinemaContext.Provider value={{openFilm,filmOpen}}>{children}
    <audio ref={audio} src={HOME+'media/design-ambience.mp3'} loop preload="none" data-testid="experience-audio"/>
    <button className={'experience-sound'+(path==='/'?' sound-at-home':'')} aria-label={sound?'Turn background music off':'Turn background music on'} aria-pressed={sound} onClick={()=>setSound(!sound)}><Icon name={sound?'sound':'mute'}/><span>Sound {sound?'on':'off'}</span></button>
    <dialog className="cinema-dialog" ref={dialog} aria-label="BRISÉNN introduction film" onCancel={e=>{e.preventDefault();closeFilm()}} onClick={e=>{if(e.target===dialog.current)closeFilm()}}>
      <div className="cinema-dialog-top"><span className="eyebrow">BRISÉNN / THE FILM</span><button className="icon-button" aria-label="Close film" onClick={closeFilm}><Icon name="close"/></button></div>
      <video ref={film} controls playsInline preload="none" poster={HOME+'assets/film-living-room.jpg'} data-testid="experience-film"><source src={HOME+'media/brisenn-film-design.mp4'} type="video/mp4"/></video>
      <div className="cinema-dialog-foot"><span>Mix. Match. Connect.</span><span>00:20 / 720p</span></div>
    </dialog>
  </CinemaContext.Provider>;
}
