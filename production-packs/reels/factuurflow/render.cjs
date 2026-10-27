const {chromium}=require('/usr/local/lib/node_modules/playwright');const fs=require('fs');const {spawn}=require('child_process');const path=require('path');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1.5});
await page.goto('file://'+path.resolve('mcc-factuurflow/scene.html'));await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await page.evaluate(()=>document.fonts.ready);
if(process.argv.includes('--inspect')){for(const t of [3,9,15,21,28,35]){await page.evaluate(t=>render(t),t);await page.screenshot({path:'mcc-factuurflow/frame-'+t+'.jpg',type:'jpeg',quality:78,scale:'css'});}await browser.close();return}
const enc=spawn('ffmpeg',['-y','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','-','-vf','scale=720:1280:flags=lanczos','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart','mcc-factuurflow/review.mp4'],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<1140;i++){await page.evaluate(t=>render(t),i/30);const buf=await page.screenshot({type:'jpeg',quality:94});if(!enc.stdin.write(buf))await new Promise(r=>enc.stdin.once('drain',r));if(i%150===0)console.log('frame',i);}
enc.stdin.end();await new Promise((r,j)=>enc.on('exit',c=>c?j(Error('encode '+c)):r()));await browser.close();console.log('render complete');
})();