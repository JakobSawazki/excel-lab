// Von Codex geschrieben (früher .tmp/l35-l36-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l35-l36-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext();const errors=[],external=[];
  await context.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();external.push(r.request().url());return r.abort();});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l3-4':{completed:true},'l3-5':{completed:true}}}]})));
  for(const [file,ids]of[['l3-5.html',['l35-error-tests','l35-order-transfer']],['l3-6.html',['l36-chain-tests','l36-time-transfer']]]){
   await page.goto(base+file+'?public-preview=1');await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   for(const id of ids){const el=page.locator('#'+id);await el.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await el.evaluate(e=>e.open),true,id);assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)),id+' order');}
   const text=await page.locator('.lesson-article').innerText();
   if(file==='l3-5.html'){
    for(const word of ['alle ganzen Trefferzahlen 0 bis 13','14 nur als ungültigen','B21:C27','Rückgabeindex vorübergehend auf 3','501 / 3; 503 / 10; 505 / 2; 507 / 4','A4:C7','505 / Stift / 1,50','1,20 auf 1,40','nicht „kostenlos“'])assert.ok(text.includes(word),word);
    const data=await page.locator('#l35-article-data tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent)));
    assert.deepEqual(data,[['4','501','Ordner','2,40'],['5','507','Textmarker','1,20'],['6','503','Heft','0,85']]);
    const wins=await page.locator('.l25-data-table').first().locator('tbody tr').evaluateAll(rows=>rows.map(r=>[Number(r.cells[1].textContent),Number(r.cells[2].textContent.replace(/[\s€.]/g,'').replace(',','.'))]));
    assert.deepEqual(wins,[[7,10],[8,40],[9,80],[10,100],[11,1000],[12,5000],[13,10000]]);
   }else {
    for(const word of ['G8 von 4 auf 5','G4 von 2 auf 2,1','2 in D5','nur D5','8,4 Minuten','12,4 Minuten','6,4 Minuten','8,49; 8,50; 8,51','B4 wieder auf 8,4','erst am Ende runden'])assert.ok(text.includes(word),word);
    const grades=await page.locator('.l25-data-table').first().locator('tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent)));
    assert.deepEqual(grades,[['4','1,4','1,6','1,4','2'],['5','1','leer','2','1,5'],['6','3,25','4','3','2,5'],['7','5','4,5','5','4'],['8','5','4','4,7','4']]);
    assert.equal(await page.locator('.l25-data-table').nth(1).locator('tbody tr').count(),6);
   }
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of[320,390,760,1440])for(const theme of['dark','light'])for(const size of['normal','large']){await page.setViewportSize({width,height:900});await page.evaluate(([t,s])=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;},[theme,size]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);}
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l3-5.html'?1440:390,height:900});await page.evaluate(()=>{document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await page.locator('#'+ids.at(-1)).evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
  }
  // Independent models check the exercise scenarios; they do not execute Excel workbooks.
  const lookup=(value,matrix,index)=>index>matrix[0].length?'#BEZUG!':matrix.find(row=>row[0]===value)?.[index-1]??'#NV';
  const winnings=[[7,10],[8,40],[9,80],[10,100],[11,1000],[12,5000],[13,10000]];
  for(let n=0;n<=13;n++)assert.equal(lookup(n,winnings,2),n<7?'#NV':winnings[n-7][1]);
  assert.equal(lookup(13,winnings.slice(0,-1),2),'#NV');assert.equal(lookup(14,winnings,2),'#NV');assert.equal(lookup(7,winnings,3),'#BEZUG!');
  const articles=[[501,'Ordner',2.4],[507,'Textmarker',1.2],[503,'Heft',.85]];
  assert.deepEqual([501,503,505,507].map(n=>lookup(n,articles,3)),[2.4,.85,'#NV',1.2]);
  assert.equal(lookup(507,[[501,'Ordner',2.4],[507,'Textmarker',1.4],[503,'Heft',.85]],3),1.4);
  assert.equal(lookup(505,[...articles,[505,'Stift',1.5]],3),1.5);
  const average=values=>values.reduce((a,b)=>a+b,0)/values.length;
  const final=(written,oral)=>(2*average(written)+oral)/3;
  const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
  assert.equal(Math.round(final([5,4,4.7],4)),4);assert.equal(Math.round(final([5,4,4.7],5)),5);
  close(final([5,4,4.7],5)-final([5,4,4.7],4),1/3);
  assert.equal(Math.round(final([1.4,1.6,1.4],2)),Math.round(final([1.4,1.6,1.4],2.1)));
  assert.equal(average([1,2]),1.5);close(average([1,2,2]),5/3);
  const times=[8.4,12.4,6.4];assert.equal(Math.round(times.reduce((a,b)=>a+b)),27);assert.equal(times.map(Math.round).reduce((a,b)=>a+b),26);
  assert.deepEqual([8.49,8.5,8.51].map(Math.round),[8,9,9]);assert.deepEqual([8.49,8.5,8.51].map(n=>Math.round(n+12.4+6.4)),[27,27,27]);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L3.5/L3.6 practice passed: four disclosures, article inputs, full lookup/invalid-index scenarios, grade and rounding arithmetic, keyboard, 32 layouts, unchanged storage, public links, no external requests or browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
