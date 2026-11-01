import Link from 'next/link';
import {Product,money,photo} from '@/lib/catalogue';
import {Icon} from './Icon';
export default function ProductCard({product:p,priority=false}:{product:Product;priority?:boolean}){
 return <Link prefetch={false} prefetch={false} href={'/products/'+p.handle+'/'} className="product-card" aria-label={p.title} data-product={p.handle}><div className={'card-image '+p.kind}><img src={photo(p.images[0],700)} alt={p.title} loading={priority?'eager':'lazy'} decoding="async" width="700" height="933"/>{p.images[1]&&<img className="card-alternate" src={photo(p.images[1],700)} alt="" loading="lazy" width="700" height="933"/>}<span className="card-index">{p.category}</span><span className="card-open"><Icon name="arrow"/></span></div><div className="card-caption"><div><h3>{p.name}</h3><p>{p.kind==='link'?(p.finish==='matte'?'Matte':'Shiny')+' · One link':p.dimension||'A considered finishing detail'}</p></div><span>{p.variants.some(v=>v.price!==p.price)?'From ':''}{money(p.price)}</span></div></Link>
}
