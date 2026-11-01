import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const products=JSON.parse(readFileSync(new URL('../lib/products.json',import.meta.url)));
const colours=JSON.parse(readFileSync(new URL('../lib/colours.json',import.meta.url)));
assert.equal(products.length,125);assert.equal(new Set(products.map(p=>p.handle)).size,125);
assert.equal(products.reduce((n,p)=>n+p.images.length,0),279);
assert.equal(products.reduce((n,p)=>n+p.variants.length,0),239);
assert.equal(products.flatMap(p=>p.variants).filter(v=>v.compareAt).length,91);
const counts={'Single links':72,'Small sets':20,'Large sets':13,'Floor to ceiling':6,'Canvas':7,'Hanging systems':7};
for(const [c,n] of Object.entries(counts))assert.equal(products.filter(p=>p.category===c).length,n,c);
for(const p of products){
 assert.ok(p.images.length&&p.variants.length,p.handle);
 assert.ok(p.images.every(src=>new URL(src).hostname==='cdn.shopify.com'));
 assert.ok(p.variants.every(v=>/^\d+$/.test(v.id)&&Number.isInteger(v.price)&&v.price>0));
 assert.equal(p.price,Math.min(...p.variants.map(v=>v.price)));
 assert.ok(p.modelLinks.every(l=>Number.isInteger(l.colour)&&l.colour>=0&&l.colour<36&&typeof l.matte==='boolean'));
 if(p.kind==='link'){assert.equal(p.price,2999);assert.equal(p.modelLinks.length,1);assert.equal(p.linkCount,1);}
 if(p.kind==='canvas'){assert.equal(p.rows,5);assert.ok(p.hookContents.length,p.handle+' hook contents');}
 if(p.kind==='set'||p.kind==='canvas'){assert.ok(p.dimension);assert.ok(p.contents.length);}
 if(p.linkCount!==p.modelLinks.length)assert.ok(p.notes.some(n=>n.includes('colour breakdown')),p.handle+' discrepancy disclosure');
}
for(const c of colours){for(const finish of ['shiny','matte'])assert.ok(products.some(p=>p.handle===c[finish]&&p.kind==='link'&&p.finish===finish));}
const hook=products.find(p=>p.kind==='hook');assert.equal(hook.variants.length,70);assert.ok(hook.variants.every(v=>v.price===3499&&!v.name.includes('Black')));
const fade=products.find(p=>p.handle==='infinity-set-blue-fade-shiny-matte');assert.equal(fade.variants.find(v=>v.name==='With Infinity Hook').price,39498);assert.equal(fade.price,37999);
const mixed=products.find(p=>p.handle==='infinity-set-large-oak-shiny-matte');assert.ok(mixed.contents.every(c=>c.finish==='unspecified'));
console.log('Catalogue integrity passed:125 products,239 variants,279 photographs,72 single-link options.');
