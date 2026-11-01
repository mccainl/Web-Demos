import type {AtelierState} from './composition';
export type AtelierControls = {
  update:()=>void; reset:()=>void; zoom:(factor:number)=>void;
  dispose:()=>void; readonly rotation:number[];
  project:(index:number)=>{x:number;y:number}|null;
};
export function createAtelier(canvas:HTMLCanvasElement,state:AtelierState,onSelect:(index:number)=>void,marker:HTMLElement|null):AtelierControls;
