const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const home='/Web-Demos/brisenn/';
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain','.mp4':'video/mp4','.mp3':'audio/mpeg','.woff2':'font/woff2'};
module.exports=()=>http.createServer((req,res)=>{
 const route=decodeURIComponent(new URL(req.url,'http://local').pathname);
 if(!route.startsWith(home)){res.writeHead(404);res.end();return;}
 let file=null;
 for(const folder of ['apps/brisenn-shop/out','concepts/brisenn']){
  const root=path.resolve(folder);let candidate=path.resolve(root,route.slice(home.length)||'index.html');
  if(!candidate.startsWith(root+path.sep)&&candidate!==root){res.writeHead(403);res.end();return;}
  if(fs.existsSync(candidate)&&fs.statSync(candidate).isDirectory())candidate=path.join(candidate,'index.html');
  if(fs.existsSync(candidate)){file=candidate;break;}
 }
 if(!file){res.writeHead(404);res.end();return;}
 const size=fs.statSync(file).size,headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
 if(req.headers.range){const m=/bytes=(\d+)-(\d*)/.exec(req.headers.range);if(m){const start=+m[1],end=m[2]?Math.min(+m[2],size-1):size-1;if(start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`});fs.createReadStream(file,{start,end}).pipe(res);return;}}
 res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);
});
