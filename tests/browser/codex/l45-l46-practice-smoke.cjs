// Von Codex geschrieben (früher .tmp/l45-l46-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l45-l46-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext(),errors=[],external=[];
  await context.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();external.push(r.request().url());return r.abort();});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l4-4':{completed:true},'l4-5':{completed:true}}}]})));
  for(const [file,id]of[['l4-5.html','l45-team-transfer'],['l4-6.html','l46-production-transfer']]){
   await page.goto(base+file+'?public-preview=1');await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   const el=page.locator('#'+id);assert.equal(await el.count(),1);await el.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.equal(await el.evaluate(e=>e.open),true);assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)));
   const text=await el.innerText();
   const data=await el.locator('tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map((c,i)=>i?Number(c.textContent):c.textContent)));
   if(file==='l4-5.html'){
    assert.deepEqual(data,[['Alpha',6,4],['Beta',12,8],['Gamma',12,28]]);
    for(const term of ['A3:C6','D4:D6','6 auf 10','eigene Teamgröße','Entferne ausschließlich','wieder hinzu','automatische Skalenänderungen'])assert.ok(text.includes(term),term);
   }else{
    assert.deepEqual(data,[['A',1,3],['B',2,5],['C',4,9],['D',7,15]]);
    for(const term of ['B4:C7','9 auf 18','beobachteter Y-Wert minus Modellwert','100 Minuten','nicht als fünften Messpunkt','nicht automatisch neu','genügend genau'])assert.ok(text.includes(term),term);
    assert.equal(await page.locator('#l46-source-table tbody tr').count(),14);
   }
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of[320,390,760,1440])for(const theme of['dark','light'])for(const size of['normal','large']){await page.setViewportSize({width,height:900});await page.evaluate(([t,s])=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;},[theme,size]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);}
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l4-5.html'?1440:390,height:900});await page.evaluate(()=>{document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await el.evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});await page.waitForTimeout(250);await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
  }
  // Independent mathematics, not an Excel workbook or chart execution.
  const teams=[[6,4],[12,8],[12,28]],sum=r=>r.reduce((a,b)=>a+b);
  assert.deepEqual(teams.map(sum),[10,20,40]);assert.deepEqual(teams.map(r=>r[0]/sum(r)),[.6,.6,.3]);
  assert.equal(sum([10,4]),14);assert.equal(teams[0][1],4);assert.notEqual(4/14,4/10);
  assert.deepEqual(teams.map(r=>r[0]/r[0]),[1,1,1]);
  function fit(rows){const n=rows.length,sx=rows.reduce((s,r)=>s+r[0],0),sy=rows.reduce((s,r)=>s+r[1],0),sxx=rows.reduce((s,r)=>s+r[0]**2,0),sxy=rows.reduce((s,r)=>s+r[0]*r[1],0);const m=(n*sxy-sx*sy)/(n*sxx-sx*sx),b=(sy-m*sx)/n;const sst=rows.reduce((s,r)=>s+(r[1]-sy/n)**2,0),sse=rows.reduce((s,r)=>s+(r[1]-(m*r[0]+b))**2,0);return{m,b,r2:1-sse/sst};}
  const original=[[1,3],[2,5],[4,9],[7,15]],changed=[[1,3],[2,5],[4,18],[7,15]],f=fit(original),g=fit(changed);
  assert.deepEqual(f,{m:2,b:1,r2:1});assert.ok(g.r2>0&&g.r2<1);assert.notEqual(g.m,f.m);assert.notEqual(g.b,f.b);assert.ok(changed[2][1]-(g.m*4+g.b)>0);
  assert.deepEqual(original.map(r=>r[0]),changed.map(r=>r[0]));assert.equal(original[3][0]-original[2][0],3);assert.ok(100>7);assert.equal(f.m*100+f.b,201);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L4.5/L4.6 practice passed: two disclosures, complete data, 32 layouts, keyboard, unchanged storage, public links, normalization and regression-change models, no browser errors or external requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
