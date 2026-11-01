import {colours, ModelLink} from './catalogue';

export type Composition = {links: ModelLink[]; hook: boolean};
export type AtelierState = Composition & {selected: number; view: 'room' | 'detail' | 'whole'};
export const blueFade = (): ModelLink[] => [0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0].map((colour,i)=>({colour,matte:i<8}));
export const lengthCM = (n:number) => 16.5 + 11.5 * (n-1);
export const fitCount = (cm:number) => cm<16.5?0:Math.min(24,Math.max(1,Math.floor((cm-16.5+1e-7)/11.5)+1));
export function isBlueFade(links:ModelLink[]) {
  if(links.length!==16)return false;
  const counts=Array<number>(8).fill(0);
  for(const l of links){if(l.colour>3||l.colour<0)return false;counts[l.colour+(l.matte?4:0)]++}
  return counts.every(n=>n===2);
}
export const compositionPrice=(links:ModelLink[],hook:boolean)=>isBlueFade(links)?37999+(hook?1499:0):links.length*2999+(hook?3499:0);
export function readComposition(value:string|null):Composition|null {
  if(!value)return null;
  try {
    const d=JSON.parse(atob(value));
    if(!d||!Array.isArray(d.links)||d.links.length<2||d.links.length>24||d.links.some((l:ModelLink)=>!l||!Number.isInteger(l.colour)||l.colour<0||l.colour>=colours.length||typeof l.matte!=='boolean'))return null;
    return {links:d.links.map((l:ModelLink)=>({colour:l.colour,matte:l.matte})),hook:!!d.hook};
  }catch{return null}
}
export const encodeComposition=(links:ModelLink[],hook:boolean)=>btoa(JSON.stringify({links,hook}));
