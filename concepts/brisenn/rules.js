import {COLOURS} from './catalogue.js?v=room72';
export {COLOURS};
export const preset=()=>[0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0].map((colour,i)=>({colour,matte:i<8}));
export const lengthCM=n=>16.5+11.5*(n-1);
export const fitCount=cm=>cm<16.5?0:Math.min(24,Math.max(1,Math.floor((cm-16.5+1e-7)/11.5)+1));
export function isCurated(links){if(links.length!==16)return false;const counts=Array(8).fill(0);for(const l of links){if(l.colour<0||l.colour>3)return false;counts[l.colour+(l.matte?4:0)]++;}return counts.every(n=>n===2)}
export const totalCents=(links,hook)=>isCurated(links)?37999+(hook?1499:0):links.length*2999+(hook?3499:0);
export const money=cents=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(cents/100);
export function validateDesign(raw){if(!raw||!Array.isArray(raw.links)||raw.links.length<2||raw.links.length>24)return null;if(raw.links.some(l=>!Number.isInteger(l.colour)||l.colour<0||l.colour>=COLOURS.length||typeof l.matte!=='boolean'))return null;return {links:raw.links.map(l=>({colour:l.colour,matte:l.matte})),hook:!!raw.hook}}

