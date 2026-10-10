// Von Codex geschrieben (früher .tmp/l31-l32-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l31-l32-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const context=await browser.newContext();
  const external=[], errors=[];
  await context.route('**/*',route=>{
   if(route.request().url().startsWith(base)) return route.continue();
   external.push(route.request().url()); return route.abort();
  });
  const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l2-5':{completed:true},'l3-1':{completed:true}}}]})));
  for(const [file,ids] of [['l3-1.html',['l31-rebuild','l31-boundary-tests','l31-shipping-transfer']],['l3-2.html',['l32-chain-tests','l32-tier-transfer']]]){
   await page.goto(base+file+'?public-preview=1');
   await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   for(const id of ids){
    const el=page.locator('#'+id); await el.locator('summary').focus(); await page.keyboard.press('Enter');
    assert.equal(await el.evaluate(e=>e.open),true,id);
    assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)),id+' before mastery');
   }
   const text=await page.locator('.lesson-article').innerText();
   if(file==='l3-1.html'){
    for(const word of ['A7:E7','A8:D20','1999, 2000 und 2001','49,99; 50,00; 50,01','5,90','50,01 €','2018','Versandkosten sollen Zahlen sein'])assert.ok(text.includes(word),word);
    assert.equal(await page.locator('.l25-data-table tbody tr').count(),13);
   } else {
    for(const word of ['14.01.2018 auf 14.01.2019','05.07.2007 auf 05.07.2006','35 auf 37','10, 11, 20 und 21','positive ganze Mengen','alle Mappen','2,30','21 statt 20','Kosten für 20 und 21 Mappen'])assert.ok(text.includes(word),word);
   }
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:900});
    await page.evaluate(([theme,size])=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},[theme,size]);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l3-1.html'?1440:390,height:900});
   await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   const target=page.locator('#'+ids.at(-1));
   await page.evaluate(()=>document.activeElement?.blur());
   await target.evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});
   await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-transfer-viewport.png'});
  }
  // Independent arithmetic validates the exercise rules, not an actual Excel workbook.
  const years=[2005,1989,2000,2004,1999,2001,2002,1996,2006,1998,2000,1999,2007];
  const binary=(year,birth)=>year-birth<18?'Jugend':'Erwachsener';
  assert.deepEqual([1999,2000,2001].map(b=>binary(2018,b)),['Erwachsener','Erwachsener','Jugend']);
  assert.deepEqual(years.flatMap((b,i)=>binary(2018,b)!==binary(2019,b)?[i+8]:[]),[13]);
  const group=(year,birth)=>year-birth<=12?'Kind':year-birth<18?'Jugend':'Erwachsener';
  assert.deepEqual(years.flatMap((b,i)=>group(2018,b)!==group(2019,b)?[i+8]:[]),[13,16]);
  assert.equal(group(2018,2007),group(2018,2006));
  const shipping=(value,boundary=50,fee=4.9)=>value>=boundary?0:fee;
  assert.deepEqual([49.99,50,50.01].map(v=>shipping(v)),[4.9,0,0]);
  assert.deepEqual([49.99,50,50.01].map(v=>shipping(v,50.01)),[4.9,4.9,0]);
  const price=(qty,upper=20,middle=2.2)=>qty<=10?2.5:qty<=upper?middle:2;
  assert.deepEqual([10,11,20,21].map(q=>price(q)),[2.5,2.2,2.2,2]);
  assert.deepEqual([10,11,20,21].map(q=>price(q,21)),[2.5,2.2,2.2,2.2]);
  assert.deepEqual([10,11,20,21].map(q=>price(q,20,2.3)),[2.5,2.3,2.3,2]);
  assert.ok(21*price(21)<20*price(20));
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  console.log('L3.1/L3.2 practice passed: five disclosures, cell plan, 13 rows, input and boundary cases, keyboard, 32 layouts, unchanged storage, public materials, independent arithmetic, no external requests or browser errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
