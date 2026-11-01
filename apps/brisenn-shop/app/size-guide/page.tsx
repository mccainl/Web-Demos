import SizeGuide from '@/components/SizeGuide';
import {EditorialAction} from '@/components/Editorial';
export const metadata={title:'Size guide',description:'Find the number of Infinity Links for your space. Explore approximate chain lengths from 1 to 40 links.'};
export default function Page(){return <main id="main"><section className="size-page-heading"><span className="eyebrow">THE SIZE GUIDE</span><h1>Room for<br/><em>the right piece.</em></h1><p>Find a length that feels at home. Measure the space for your chain, then explore the composition one link at a time.</p></section><SizeGuide/><EditorialAction title={<>See the scale.<br/><em>Feel the difference.</em></>} href="/in-your-space/" label="Try it in your room"/></main>}
