export function Icon({name, className=''}:{name:'arrow'|'back'|'close'|'plus'|'minus'|'expand'|'rotate'|'search'|'chevron'|'cube';className?:string}) {
  const paths={arrow:'M5 19 19 5M5 5h14v14',back:'M19 12H5m7-7-7 7 7 7',close:'m6 6 12 12M6 18 18 6',plus:'M12 5v14M5 12h14',minus:'M5 12h14',expand:'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5',rotate:'M20 9a8 8 0 1 0 0 6M20 3v6h-6',search:'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',chevron:'m6 9 6 6 6-6',cube:'m12 3 9 5v8l-9 5-9-5V8l9-5Zm0 9v9M3 8l9 4 9-4'};
  return <svg className={'icon '+className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
