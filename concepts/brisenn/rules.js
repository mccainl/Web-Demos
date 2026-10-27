export const COLOURS=[{name:'Midnight Blue',hex:0x252543,css:'#343449',shiny:'56204582977919',matte:'57306787938687'},{name:'Dark Blue',hex:0x173c58,css:'#32576c',shiny:'56204582912383',matte:'57306787316095'},{name:'Blue',hex:0x4296b0,css:'#86b7c4',shiny:'56204582846847',matte:'57306786529663'},{name:'Clear',hex:0xa9c1cd,css:'#d9dfdf',shiny:'56085923987839',matte:'57306468123007'}];
export const preset=()=>[0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0].map((colour,i)=>({colour,matte:i>=8}));
export const lengthCM=n=>16.5+11.5*(n-1);
export const fitCount=cm=>cm<16.5?0:Math.min(24,Math.max(1,Math.floor((cm-16.5+1e-7)/11.5)+1));
export function isCurated(links){if(links.length!==16)return false;const counts=Array(8).fill(0);for(const l of links)counts[l.colour+(l.matte?4:0)]++;return counts.every(n=>n===2)}
export const totalCents=(links,hook)=>isCurated(links)?37999+(hook?1499:0):links.length*2999+(hook?3499:0);
export const money=cents=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(cents/100);
export function validateDesign(raw){if(!raw||!Array.isArray(raw.links)||raw.links.length<2||raw.links.length>24)return null;if(raw.links.some(l=>!Number.isInteger(l.colour)||l.colour<0||l.colour>3||typeof l.matte!=='boolean'))return null;return {links:raw.links.map(l=>({colour:l.colour,matte:l.matte})),hook:!!raw.hook}}
