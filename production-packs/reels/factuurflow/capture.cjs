const {chromium}=require('/usr/local/lib/node_modules/playwright');
const fs=require('fs');
(async()=>{
const b=await chromium.launch({headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900},deviceScaleFactor:2});
await p.goto('https://mccainl.github.io/Web-Demos/factuurflow/',{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'mcc-factuurflow/hero.png'});
await p.selectOption('#invoice-type','wrong');
await p.locator('.lead-form').screenshot({path:'mcc-factuurflow/intake.png'});
await p.click('#process-invoice');
await p.locator('.fact-preview').screenshot({path:'mcc-factuurflow/discrepancy.png'});
await p.setViewportSize({width:720,height:1000});await p.click('[data-view=owner]');
await p.locator('.scenario').screenshot({path:'mcc-factuurflow/correction.png'});
await p.fill('[data-correction]','405.35');await p.click('[data-fix]');
await p.locator('.scenario').screenshot({path:'mcc-factuurflow/checked.png'});
await p.click('[data-approve]');
if(await p.locator('#invoice-approved').innerText()!=='1')throw Error('approval failed');
await p.locator('.scenario').screenshot({path:'mcc-factuurflow/approved.png'});
await p.locator('.statrow').screenshot({path:'mcc-factuurflow/stats.png'});
await p.locator('#invoice-log').screenshot({path:'mcc-factuurflow/audit.png'});
for(const lang of ['nl','en']){const r=await p.goto('https://mccai.nl/v3/'+lang+'/blog/factuurflow');if(r.status()!==200)throw Error('article not live');}
await b.close();console.log('Live UI captures and invoice journey verified; both articles HTTP 200');
})();