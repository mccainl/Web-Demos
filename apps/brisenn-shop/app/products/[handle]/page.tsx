import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {products} from '@/lib/catalogue';
import ProductDetail from '@/components/ProductDetail';
export const dynamicParams=false;
export function generateStaticParams(){return products.map(p=>({handle:p.handle}))}
export async function generateMetadata({params}:{params:Promise<{handle:string}>}):Promise<Metadata>{const {handle}=await params;const p=products.find(x=>x.handle===handle);return {title:p?.title||'Piece not found',description:p?.description,openGraph:p?{images:[p.images[0]]}:undefined}}
export default async function Page({params}:{params:Promise<{handle:string}>}){const {handle}=await params;const p=products.find(x=>x.handle===handle);if(!p)notFound();return <ProductDetail key={p.handle} product={p}/>}
