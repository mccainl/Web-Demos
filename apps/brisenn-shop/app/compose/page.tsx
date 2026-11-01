import CompositionAtelier from '@/components/CompositionAtelier';
import {RevealMotion} from '@/components/Experience';
export const metadata={title:'Compose your piece',description:'Create your own BRISÉNN chain in 3D. Explore every colour, finish and length.'};
export default function Page(){return <main id="main" className="compose-page"><CompositionAtelier/><RevealMotion/></main>}
