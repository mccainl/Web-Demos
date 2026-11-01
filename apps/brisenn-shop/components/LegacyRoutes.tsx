'use client';
import {useEffect} from 'react';
import {usePathname,useRouter} from 'next/navigation';
export function LegacyRoutes(){const path=usePathname(),router=useRouter();useEffect(()=>{if(path!=='/')return;const route=()=>{const mapping:Record<string,string>={'#studio':'/compose/','#room':'/in-your-space/','#collection':'/products/','#space':'/in-your-space/','#about':'/about/'};const target=mapping[location.hash];if(target)router.replace(target+location.search)};route();addEventListener('hashchange',route);return()=>removeEventListener('hashchange',route)},[path,router]);return null}
