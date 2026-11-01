import {HOME,colours,ModelLink} from './catalogue';
type Cell={x:number;y:number;w:number;h:number};
export type RoomBounds={x:number;y:number;w:number;h:number};
export type RoomPainter=(ctx:CanvasRenderingContext2D,links:ModelLink[],x:number,y:number,height:number)=>RoomBounds;
export async function loadRoomPainter():Promise<RoomPainter>{
 const [meta,atlas]=await Promise.all([fetch(HOME+'assets/acrylic-materials.json').then(r=>{if(!r.ok)throw Error('Material atlas');return r.json() as Promise<{cells:Cell[]}>}),new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=HOME+'assets/acrylic-materials.png'})]);
 const sprites=new Map<string,HTMLCanvasElement>();
 const sprite=(link:ModelLink,edge:boolean)=>{const row=(link.matte?2:0)+(edge?1:0),key=link.colour+':'+row;if(sprites.has(key))return sprites.get(key)!;const cell=meta.cells[row*4+(link.colour<4?link.colour:3)],c=document.createElement('canvas');c.width=cell.w;c.height=cell.h;const g=c.getContext('2d')!;g.drawImage(atlas,cell.x,cell.y,cell.w,cell.h,0,0,c.width,c.height);if(link.colour>=4){g.globalCompositeOperation='multiply';g.fillStyle=colours[link.colour].css;g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='destination-in';g.drawImage(atlas,cell.x,cell.y,cell.w,cell.h,0,0,c.width,c.height)}sprites.set(key,c);return c};
 return (ctx,links,x,y,height)=>{const pitch=11.5/16.5,lh=height/(1+(links.length-1)*pitch);links.forEach((link,i)=>{const s=sprite(link,i%2===1),w=lh*s.width/s.height;ctx.save();ctx.shadowColor='rgba(42,31,20,.23)';ctx.shadowBlur=lh*.035;ctx.shadowOffsetX=-lh*.035;ctx.shadowOffsetY=lh*.022;ctx.drawImage(s,x-w/2,y+i*lh*pitch,w,lh);ctx.restore()});return {x:x-lh*.32,y,w:lh*.64,h:height}};
}
