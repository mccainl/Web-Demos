const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base='https://mccainl.github.io/Web-Demos/';
const slugs=['marea-stay','factuurflow','haven-interiors','leadpilot','pulse-studio','vraagassistent','rivier-coffee','orderbridge'];
const results=[];
async function visibleText(p,selector,text){await p.locator(selector).filter({hasText:text}).first().waitFor({state:'visible',timeout:8000});}
async function owner(p,s,w){
 if(s==='marea-stay'){
  if(await p.locator('#open-admin').isVisible())await p.locator('#open-admin').click();
  else{await p.locator('#menu-toggle').click();await p.locator('#admin-mobile').click();}
 }else if(s==='leadpilot')await p.locator('#tab-owner').click();
 else await p.getByRole('button',{name:'Eigenaar · Demo',exact:true}).click();
}
async function layout(p,label){
 const dimensions=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(dimensions.scroll<=dimensions.width+1,label+' horizontal page overflow '+JSON.stringify(dimensions));
 const broken=await p.locator('img').evaluateAll(images=>images.filter(x=>x.complete&&x.currentSrc&&x.naturalWidth===0).map(x=>x.currentSrc));
 assert.deepEqual(broken,[],label+' broken images');
}
async function journey(p,s){
 if(s==='factuurflow'){
  await p.locator('#invoice-type').selectOption('wrong');await p.locator('#process-invoice').click();await owner(p,s);
  await visibleText(p,'#invoice-queue','afwijking');
  assert.equal(await p.locator('[data-approve]').count(),0,'mismatched invoice must not be approvable');
  await p.locator('[data-correction]').fill('405.35');await p.getByRole('button',{name:'Controleer correctie'}).click();
  await p.getByRole('button',{name:'Goedkeuren (simulatie)'}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#invoice-queue','goedgekeurd');
 }else if(s==='haven-interiors'){
  await p.locator('[data-save="living"]').click();
  await p.locator('#haven-name').fill('MCC QA');await p.locator('#haven-email').fill('qa@example.com');
  await p.locator('#haven-message').fill('Fictieve testaanvraag voor een rustige woonkamer.');
  await p.locator('#haven-form button[type=submit]').click();await owner(p,s);
  await visibleText(p,'#enquiry-list','MCC QA');await visibleText(p,'#enquiry-list','Living softly');
  await p.getByRole('button',{name:'Markeer opgevolgd'}).click();await p.reload();await owner(p,s);
  await visibleText(p,'#enquiry-list','opgevolgd');
 }else if(s==='pulse-studio'){
  await p.locator('#member-name').fill('MCC QA');await p.locator('#member-email').fill('qa@example.com');
  await p.locator('#class-form button[type=submit]').click();await owner(p,s);
  await visibleText(p,'#owner-bookings','MCC QA');
  await p.getByRole('button',{name:'Annuleren',exact:true}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#owner-bookings','geannuleerd');
  assert.equal(await p.locator('#total-bookings').innerText(),'0');
 }else if(s==='rivier-coffee'){
  await p.locator('#res-name').fill('MCC QA');await p.locator('#res-email').fill('qa@example.com');
  await p.locator('#reserve-form button[type=submit]').click();await owner(p,s);
  await visibleText(p,'#reservation-list','MCC QA');await p.getByRole('button',{name:'Bevestigen',exact:true}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#reservation-list','bevestigd');
 }else if(s==='orderbridge'){
  await p.locator('#o-name').fill('MCC QA');await p.locator('#o-email').fill('qa@example.com');
  await p.locator('#o-message').fill('Fictieve testaanvraag voor een nieuwe website.');
  await p.locator('#order-form button[type=submit]').click();await owner(p,s);
  await visibleText(p,'#crm-list','MCC QA');await visibleText(p,'#crm-list','Team Web');
  await p.getByRole('button',{name:'Markeer gekwalificeerd'}).click();
  await p.getByRole('button',{name:'Beoordeel e-mailconcept'}).click();
  await p.getByRole('button',{name:'Vink taak af'}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#crm-list','gekwalificeerd');
  assert.equal(await p.locator('#crm-followups').innerText(),'0');assert.equal(await p.locator('#crm-ready').innerText(),'1');
 }else if(s==='vraagassistent'){
  await p.getByRole('button',{name:'Openingstijden',exact:true}).click();await visibleText(p,'#chat-log','09:00');
  await p.getByRole('button',{name:'Afspraak wijzigen',exact:true}).click();await owner(p,s);
  await visibleText(p,'#tickets-list','Ik wil mijn afspraak wijzigen');await p.getByRole('button',{name:'Markeer behandeld'}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#tickets-list','behandeld');
 }else if(s==='marea-stay'){
  await p.locator('#availability-form button[type=submit]').click();
  await p.getByRole('radio',{name:/De Dune Suite/}).click();
  await p.locator('#guest-name').fill('MCC QA');await p.locator('#guest-email').fill('qa@example.com');
  await p.getByRole('button',{name:'Bevestig demo-reservering'}).click();
  await visibleText(p,'#confirmation','Tot aan de kust');
  await p.locator('#confirmation-open-admin').click();
  await p.getByRole('row').filter({hasText:'MCC QA'}).getByRole('button',{name:'Check-in',exact:true}).click();
  await p.reload();await owner(p,s);await visibleText(p,'#booking-rows','Ingecheckt');
 }else if(s==='leadpilot'){
  await p.locator('#company').fill('MCC QA');await p.locator('#email').fill('qa@example.com');
  await p.locator('#description').fill('Fictieve testaanvraag voor een website met een klantportaal.');
  await p.getByRole('button',{name:'Verstuur testaanvraag'}).click();
  await p.locator('#open-owner').click();
  await p.getByRole('button',{name:/WEBSITE MCC QA/}).click();await p.locator('#detail-stage').selectOption('Voorstel');
  await p.locator('#detail-notes').fill('Fictieve QA: voorstel voorbereiden.');
  await p.locator('#save-detail').click();await p.reload();await owner(p,s);
  await visibleText(p,'#recent-leads','MCC QA');await visibleText(p,'#recent-leads','Voorstel');
  await visibleText(p,'#overview-tasks','Neem contact op met MCC QA');
 }
}
(async()=>{
 await fs.mkdir('qa-results',{recursive:true});
 const browser=await chromium.launch();
 for(const width of [360,390,768,1440]){
  for(const slug of ['',...slugs]){
   const name=(slug||'gallery')+'-'+width;
   const ctx=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce'});
   const p=await ctx.newPage();p.setDefaultTimeout(12000);const errors=[],badResponses=[],writes=[];
   p.on('pageerror',e=>errors.push(e.message));
   p.on('response',r=>{if(r.status()>=400)badResponses.push(r.status()+' '+r.url());});
   p.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.method()+' '+r.url());});
   try{
    const response=await p.goto(base+(slug?slug+'/':''),{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    await layout(p,name+' visitor');
    if(!slug){for(const s of slugs)assert.ok(await p.locator('a[href="./'+s+'/"]').count()>0,'gallery missing '+s);}
    else{
     if(width===390||width===1440)await journey(p,slug);
     else await owner(p,slug,width);
     await layout(p,name+' owner');
    }
    assert.deepEqual(errors,[],'JavaScript errors');assert.deepEqual(badResponses,[],'HTTP asset failures');assert.deepEqual(writes,[],'Unexpected outbound mutation');
    await p.screenshot({path:'qa-results/'+name+'.png',fullPage:true});
    results.push({name,ok:true,journey:!!slug&&(width===390||width===1440)});
    console.log('PASS',name);
   }catch(e){
    results.push({name,ok:false,error:e.message});console.error('FAIL',name,e.message);
    await p.screenshot({path:'qa-results/'+name+'-FAILED.png',fullPage:true}).catch(()=>{});
   }finally{await ctx.close();}
  }
 }
 await browser.close();
 await fs.writeFile('qa-results/results.json',JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2));
 const failures=results.filter(r=>!r.ok);
 console.log('SUMMARY',results.length-failures.length+'/'+results.length,'passed');
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
