// Von Codex geschrieben (früher .tmp/l33-l34-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l33-l34-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const context=await browser.newContext();const external=[],errors=[];
  await context.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();external.push(r.request().url());return r.abort();});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l3-2':{completed:true},'l3-3':{completed:true}}}]})));
  for(const [file,ids] of [['l3-3.html',['l33-toto-rebuild','l33-last-row-test','l33-project-transfer']],['l3-4.html',['l34-edge-tests','l34-stock-transfer']]]){
   await page.goto(base+file+'?public-preview=1');
   await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   for(const id of ids){const el=page.locator('#'+id);await el.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await el.evaluate(e=>e.open),true,id);assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)),id+' order');}
   const text=await page.locator('.lesson-article').innerText();
   if(file==='l3-3.html'){
    for(const word of ['B5:E17','I5:I17','B21:C24','Zahl 1, 0 oder 2','B10 leer','beiden','B5:B9 auf B6:B10','I17','2 €'])assert.ok(text.includes(word),word);
    assert.equal(await page.locator('#l33-toto-data tbody tr').count(),13);
    const scores=await page.locator('#l33-toto-data tbody tr').evaluateAll(rows=>rows.map(r=>[r.cells[3],r.cells[4],r.cells[5]].map(c=>Number(c.textContent))));
    assert.deepEqual(scores,[[2,2,0],[5,0,1],[4,0,1],[1,2,2],[1,2,0],[1,0,1],[1,1,0],[4,0,1],[4,3,0],[3,1,1],[1,2,2],[0,2,2],[0,0,0]]);
    const count=values=>values.filter(([home,away,tip])=>(home===away?0:home>away?1:2)===tip).length;
    assert.equal(count(scores),11);scores[12][2]=1;assert.equal(count(scores),10);scores[12][2]=0;assert.equal(count(scores),11);
    const data=await page.locator('#l33-project-data tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent)));
    assert.deepEqual(data,[['5','Material','0'],['6','Druck','8'],['7','Material','5'],['8','Druck','12'],['9','Material','20']]);
   }else for(const word of ['D17 = 0','E17 = 0','I17 = 0','2:0, 1:1 und 0:2','J4 und J19:J20','0, 2, 3, 5 und 6','B5:B10','B6 von 2 auf 3','Zahl und Hinweis','Regelbedingungen die Zahlen 0, 1 und 3','Punktformeln in F und G bleiben unverändert'])assert.ok(text.includes(word),word);
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){await page.setViewportSize({width,height:900});await page.evaluate(([t,s])=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;},[theme,size]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);}
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l3-3.html'?1440:390,height:900});await page.evaluate(()=>{document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await page.locator('#'+ids.at(-1)).evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});
   await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
  }
  // Independent arithmetic is not evidence of an actual Excel workbook run.
  const cat=['Material','Druck','Material','Druck','Material'], amounts=[0,8,5,12,20];
  const grouped=(cats,values)=>['Material','Druck'].map(group=>cats.reduce((n,c,i)=>n+(c===group?values[i]:0),0));
  assert.deepEqual(grouped(cat,amounts),[25,20]);
  assert.deepEqual(grouped(cat,[8,5,12,20,0]),[20,25]);
  assert.equal(grouped(cat,amounts).reduce((a,b)=>a+b),grouped(cat,[8,5,12,20,0]).reduce((a,b)=>a+b));
  assert.deepEqual(grouped(cat,[0,8,7,12,20]),[27,20]);
  assert.deepEqual(grouped(['Material','Druck','Druck','Druck','Material'],amounts),[20,25]);
  assert.deepEqual(['Material','Druck'].map(c=>cat.filter(x=>x===c).length),[3,2]);
  assert.deepEqual(['Material','Druck'].map(c=>['Material','Druck','Druck','Druck','Material'].filter(x=>x===c).length),[2,3]);
  const points=(home,away)=>home===away?[1,1]:home>away?[3,0]:[0,3];
  assert.deepEqual([[2,0],[1,1],[0,2]].map(x=>points(...x)),[[3,0],[1,1],[0,3]]);
  const status=n=>n<=2?'Nachbestellen':n<=5?'Knapp':'Ausreichend';
  assert.deepEqual([0,2,3,5,6].map(status),['Nachbestellen','Nachbestellen','Knapp','Knapp','Ausreichend']);assert.equal(status(1),'Nachbestellen');
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  console.log('L3.3/L3.4 practice passed: five disclosures, 13 games, five expense rows, independent arithmetic including equal-total mispairing, keyboard, 32 layouts, unchanged storage, public materials, no external requests or browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
