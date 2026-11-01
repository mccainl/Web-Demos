import type {Metadata,Viewport} from 'next';
import {Header,Footer} from '@/components/Shell';
import {LegacyRoutes} from '@/components/LegacyRoutes';
import {CinemaProvider} from '@/components/Cinema';
import './globals.css';
import './experience.css';
export const metadata: Metadata = {title:{default:'BRISÉNN — Art in connection.',template:'%s — BRISÉNN'},description:'Explore the complete BRISÉNN collection. Handmade acrylic Infinity Links, curated compositions, Canvas pieces and hanging systems.',robots:{index:false,follow:false}};
export const viewport: Viewport = {width:'device-width',initialScale:1,themeColor:'#f3efe6'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><CinemaProvider><LegacyRoutes/><Header/>{children}<Footer/></CinemaProvider></body></html>}
