// Von Codex geschrieben (früher .tmp/l47-l48-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l47-l48-practice-smoke.cjs [Adresse]
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
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l4-6':{completed:true},'l4-7':{completed:true}}}]})));
  for(const [file,id]of[['l4-7.html','l47-weighted-transfer'],['l4-8.html','l48-pause-transfer']]){
   await page.goto(base+file+'?public-preview=1');await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   const el=page.locator('#'+id);assert.equal(await el.count(),1);await el.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.equal(await el.evaluate(e=>e.open),true);assert.ok(await el.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)));
   const text=await el.innerText();
   const data=await el.locator('tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map((c,i)=>i?Number(c.textContent):c.textContent)));
   if(file==='l4-7.html'){
    assert.deepEqual(data,[['Nord',1,100],['Süd',3,150]]);
    for(const term of ['3 auf 4','Umsatzanteile müssen unverändert','jeder Kunde gleich zählen','Gesamtzeile ist keine dritte','nicht, dass jeder einzelne Kunde'])assert.ok(text.includes(term),term);
    const whole=await page.locator('.lesson-article').innerText();assert.ok(whole.includes('kein Zeitraum angegeben'));assert.ok(!whole.includes('durchschnittlicher Jahresumsatz pro Kunde'));
    assert.equal(await page.locator('#l47-branch-data tbody tr').count(),4);assert.equal(await page.locator('#l47-customer-data tbody tr').count(),4);
   }else{
    assert.deepEqual(data,[['1',20,30],['2',80,60]]);
    for(const term of ['0 km und 10 Minuten','10 auf 20 Minuten','Zeile 5 würde die Pause ignorieren','Gesamtzeit auf X','dieselbe Gesamtstrecke','einschließlich Pause','kein fehlender Messwert'])assert.ok(text.includes(term),term);
    for(const [table,n]of [['l48-motion-data',6],['l48-fall-data',6],['l48-travel-data',10]])assert.equal(await page.locator('#'+table+' tbody tr').count(),n);
   }
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   for(const width of[320,390,760,1440])for(const theme of['dark','light'])for(const size of['normal','large']){await page.setViewportSize({width,height:900});await page.evaluate(([t,s])=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;},[theme,size]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' '+width+' '+theme+' '+size);}
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.setViewportSize({width:file==='l4-7.html'?1440:390,height:900});await page.evaluate(()=>{document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await el.evaluate(e=>{e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});await page.waitForTimeout(250);await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
  }
  // Independent arithmetic; no private workbook or actual Excel execution.
  assert.equal(250/4,62.5);assert.equal((100+150/3)/2,75);assert.notEqual(250/4,(100+150/3)/2);
  assert.equal(250/5,50);assert.equal(150/4,37.5);assert.equal(100/250,.4);assert.equal(150/250,.6);
  const speed=(km,min)=>km/min*60;assert.equal(speed(20,30),40);assert.equal(speed(80,60),80);assert.equal((40+80)/2,60);assert.notEqual(speed(100,90),60);
  assert.equal(speed(100,100),60);assert.ok(speed(100,110)<60);assert.equal(speed(0,10),0);assert.equal(speed(0,20),0);
  const cumulative=rows=>{let km=0,min=0;return rows.map(([d,t])=>{km+=d;min+=t;return[min,km];});};
  assert.deepEqual(cumulative([[20,30],[80,60],[0,10]]),[[30,20],[90,100],[100,100]]);
  assert.deepEqual(cumulative([[20,30],[80,60],[0,20]]),[[30,20],[90,100],[110,100]]);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L4.7/L4.8 practice passed: two disclosures, complete inputs, keyboard, 32 layouts, unchanged storage, public links, independent weighted-average/unit/cumulative/pause tests, no browser errors or external requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
