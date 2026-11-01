'use client';
import Link from 'next/link';
import {HOME} from '@/lib/catalogue';
import {Icon} from './Icon';
import {useCinema} from './Cinema';
export default function CinemaClosing(){const {openFilm}=useCinema();return <section className="experience-closing"><img src={HOME+'assets/film-living-room.jpg'} alt="Blue Fade in a sunlit living room" loading="lazy"/><div><span className="eyebrow">MADE BY US. FINISHED BY YOU.</span><h2>Make room<br/>for <em>possibility.</em></h2><Link prefetch={false} href="/compose/" className="button light">Open the 3D atelier </Link><button onClick={openFilm}><Icon name="play"/> Watch the 20-second film</button></div></section>}
