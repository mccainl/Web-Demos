'use client';
import Link from 'next/link';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {HOME} from '@/lib/catalogue';
import {Icon} from './Icon';
export function Header(){
  const menu=useRef<HTMLDialogElement>(null); const path=usePathname();
  useEffect(()=>{menu.current?.close()},[path]);
  return <><header className="header"><a href={HOME} className="wordmark" aria-label="BRISÉNN home">BRISÉNN</a><nav aria-label="Main navigation" className="desktop-nav"><Link href="/">The collection</Link><a href={HOME+'#about'}>The story</a></nav><a className="compose-link" href={HOME+'#studio'}>Compose yours<Icon name="arrow"/></a><button className="menu-trigger" aria-label="Open menu" onClick={()=>menu.current?.showModal()}><span/><span/></button></header><dialog className="nav-dialog" ref={menu}><div className="menu-heading"><span className="wordmark">BRISÉNN</span><button className="icon-button" aria-label="Close menu" onClick={()=>menu.current?.close()}><Icon name="close"/></button></div><nav aria-label="Mobile navigation"><Link href="/" onClick={()=>menu.current?.close()}>The collection</Link><a href={HOME}>Art, in connection.</a><a href={HOME+'#studio'}>Compose yours</a><a href={HOME+'#room'}>In your space</a></nav><p className="eyebrow">DESIGNED & HANDMADE IN AMSTERDAM</p></dialog></>;
}
export function Footer(){return <footer className="footer"><div className="footer-top"><p>Objects that connect.<br/><em>Spaces that feel like you.</em></p><div><a href={HOME+'#studio'}>Compose yours <Icon name="arrow"/></a><a href="https://brisenn.com/blogs/news/custom" target="_blank" rel="noreferrer">A custom piece <Icon name="arrow"/></a></div></div><a href={HOME} className="footer-wordmark" aria-label="BRISÉNN home">BRISÉNN</a><div className="footer-bottom"><span>Independent concept by <a href="https://mccai.nl/">MCC</a></span><p>Product photography © BRISÉNN. 3D studies are approximate. Explore and purchase through the original store.</p><a href="https://brisenn.com/" target="_blank" rel="noreferrer">Original store <Icon name="arrow"/></a></div></footer>}
