import data from './products.json';
import colourData from './colours.json';
export type ModelLink = {colour: number; matte: boolean};
export type Variant = {id: string; name: string; price: number; compareAt: number | null; available: boolean};
export type Product = {
  id: string; handle: string; title: string; name: string; category: string;
  kind: 'link' | 'set' | 'canvas' | 'hook' | 'wall' | 'ceiling';
  finish: string; description: string; images: string[]; variants: Variant[]; price: number;
  specs: string[][]; contents: {quantity: number; colour: number; name: string; finish: string}[];
  hookContents: string[]; linkCount: number; rows: number; modelLinks: ModelLink[];
  notes: string[]; dimension: string; source: string;
};
export const products = data as Product[];
export const colours = colourData;
export const categories = ['All pieces','Single links','Small sets','Large sets','Canvas','Floor to ceiling','Hanging systems'];
export const HOME = '/Web-Demos/brisenn/';
export const BASE = HOME + 'products/';
export const money = (cents: number) => new Intl.NumberFormat('en-IE', {style:'currency',currency:'EUR'}).format(cents/100);
export function photo(src: string, width=1000) {
  const url = new URL(src); url.searchParams.set('width', String(width)); return url.href;
}
export function compositionURL(product: Product) {
  if (product.kind === 'link') {
    const a=product.modelLinks[0];
    return HOME+'?design='+encodeURIComponent(btoa(JSON.stringify({links:[a,a],hook:true})))+'#studio';
  }
  if (product.rows !== 1 || product.modelLinks.length < 2 || product.modelLinks.length > 24 || product.notes.length) return null;
  return HOME+'?design='+encodeURIComponent(btoa(JSON.stringify({links:product.modelLinks,hook:true})))+'#studio';
}
