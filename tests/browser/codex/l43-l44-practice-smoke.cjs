// Von Codex geschrieben (früher .tmp/l43-l44-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l43-l44-practice-smoke.cjs [Adresse]
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
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l4-2':{completed:true},'l4-3':{completed:true}}}]})));
  for(const [file,ids]of[['l4-3.html',['l43-change-tests','l43-library-transfer']],['l4-4.html',['l44-rate-tests','l44-scale-transfer']]]){
   await page.goto(base+file+'?public-preview=1');await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   for(const id of ids){const el=page.locator('#'+id);assert.equal(await el.count(),1);await el.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.equal(await el.evaluate(e=>e.open),true);assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)));}
   const text=await page.locator('.lesson-article').innerText();
   if(file==='l4-3.html'){
    for(const term of ['2014 → 2015','2016 → 2017','vier Jahresabstände','2017 von 50 auf 80','B6 wirklich leer','15','Startwert 0','nur eine Teilsumme','angrenzenden Linienabschnitte'])assert.ok(text.includes(term),term);
    const inputs=await page.locator('#l43-library-inputs tbody tr').evaluateAll(rows=>rows.map(r=>[r.cells[0].textContent,r.cells[1].textContent]));
    assert.deepEqual(inputs,[['Woche 1','12'],['Woche 2','18'],['Woche 3','nicht erhoben – B6 leer lassen'],['Woche 4','0'],['Woche 5','24']]);
    const data=await page.locator('#l43-task-heading').locator('xpath=ancestor::details').locator('tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>Number(c.textContent))));
    assert.deepEqual(data,[[2013,120],[2014,90],[2015,85],[2016,60],[2017,50]]);
   }else{
    for(const term of ['G3 = 3,50','G4 = 1,00','1,00 auf 0','1,50','nicht einen Anteil von Hand','1 auf 2','Summe 0','Keine Anteile berechenbar','B1 auf 1'])assert.ok(text.includes(term),term);
    const inputs=await page.locator('#l44-budget-inputs tbody tr').evaluateAll(rows=>rows.map(r=>[r.cells[0].textContent,Number(r.cells[1].textContent)]));
    assert.deepEqual(inputs,[['Material',60],['Druck',30],['Dekoration',30]]);
   }
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of[320,390,760,1440])for(const theme of['dark','light'])for(const size of['normal','large']){await page.setViewportSize({width,height:900});await page.evaluate(([t,s])=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;},[theme,size]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);}
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l4-3.html'?1440:390,height:900});await page.evaluate(()=>{document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await page.locator('#'+ids.at(-1)).evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});await page.waitForTimeout(250);await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
  }
  // Independent models; these do not execute Excel workbooks or diagrams.
  const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
  const change=(start,end)=>({absolute:end-start,relative:(end-start)/start});
  assert.equal(change(90,85).absolute,-5);close(change(90,85).relative,-5/90);
  assert.equal(change(60,50).absolute,-10);close(change(60,50).relative,-1/6);
  assert.equal((50-120)/4,-17.5);assert.ok(80>60);
  const library=[12,18,null,0,24];assert.equal(library.filter(n=>n!==null).reduce((a,b)=>a+b),54);assert.ok(library.includes(null));assert.equal(Number.isFinite(change(0,24).relative),false);
  const people=[125,100,125,50], costs=(extra)=>people.map((n,i)=>n*(3.5+(i===0?extra:0)));
  const shares=values=>{const total=values.reduce((a,b)=>a+b);return total>0?values.map(n=>n/total):null;};
  const personShares=shares(people), equal=shares(costs(0));equal.forEach((v,i)=>close(v,personShares[i]));
  const baseline=shares(costs(1)),raised=shares(costs(1.5));assert.ok(raised[0]>baseline[0]);for(let i=1;i<4;i++){assert.equal(costs(1)[i],costs(1.5)[i]);assert.ok(raised[i]<baseline[i]);}
  close(baseline.reduce((a,b)=>a+b),1);
  const budget=[60,30,30];assert.deepEqual(shares(budget),[.5,.25,.25]);assert.deepEqual(shares(budget.map(n=>n*2)),shares(budget));assert.equal(shares(budget.map(()=>0)),null);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L4.3/L4.4 practice passed: four disclosures, complete inputs, keyboard, 32 layouts, unchanged storage, public links, independent time/gap/zero and share/scale models, no browser errors or external requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
