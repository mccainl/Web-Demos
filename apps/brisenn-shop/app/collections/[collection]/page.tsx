import {notFound} from 'next/navigation';
import Catalogue from '@/components/Catalogue';
import {collections} from '@/lib/collections';
export const dynamicParams=false;
export function generateStaticParams(){return collections.map(c=>({collection:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{collection:string}>}){const {collection}=await params,c=collections.find(c=>c.slug===collection);return {title:c?.category,description:c?.description}}
export default async function Page({params}:{params:Promise<{collection:string}>}){const {collection}=await params,c=collections.find(c=>c.slug===collection);if(!c)notFound();return <Catalogue key={c.slug} initialCategory={c.category}/>}
