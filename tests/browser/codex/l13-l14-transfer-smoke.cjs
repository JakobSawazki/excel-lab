// Von Codex geschrieben (früher .tmp/l13-l14-transfer-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l13-l14-transfer-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(!route.request().url().startsWith(base)){external.push(route.request().url());return route.abort();}return route.continue();});
  for(const [id,prerequisite,terms] of [
   ['l13','l1-2',['Druckkosten','0,035 €','100 Seiten','zwei Nachkommastellen','Bearbeitungsleiste','200','Genauigkeit wie angezeigt','Taschenrechner']],
   ['l14','l1-3',['Materialtest','Klebestift','2,40 €','Stift','1,20 €','Heft','3,50 €','Inhalte einfügen → Werte','D6','C3','0,50 €','Reparieren','1,20']]
  ]){
   await page.goto(base+`l1-${id.at(-1)}.html?public-preview=1`);
   await page.evaluate(prerequisite=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{[prerequisite]:{completed:true}}}]})),prerequisite);
   await page.reload();
   const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   const layout=page.locator(`#${id}-layout-check`);
   await layout.locator('summary').focus();await page.keyboard.press('Enter');
   assert.equal(await layout.getAttribute('open'),'');
   const layoutText=await layout.innerText();
   for(const term of (id==='l13'?['Getränkeliste','nicht Heftkauf','tatsächliche Zelladresse','Nur die Darstellung','Datei fehlt']:['Getränkeliste','Druckkosten','tatsächliche Summenzeile','ganze Blattzeile','alle sechs Positionspreise','nie mit einer Positionsformel','eigene Blätter']))assert.ok(layoutText.includes(term),id+':'+term);
   assert.equal(await layout.locator('a').getAttribute('href'),id==='l13'?'l1-2.html':'l1-3.html');
   const section=page.locator(`#${id}-transfer-section`);
   await section.locator('summary').first().focus();await page.keyboard.press('Enter');
   assert.equal(await section.getAttribute('open'),'');
   const text=await section.innerText();for(const term of terms)assert.ok(text.includes(term),id+':'+term);
   assert.equal(await section.locator('input,button,code').count(),0,'No formula answer or progress input in transfer');
   assert.ok(await page.evaluate(id=>Boolean(document.querySelector(`#${id}-transfer-section`).compareDocumentPosition(document.querySelector(`#${id}-mastery-section`))&Node.DOCUMENT_POSITION_FOLLOWING),id));
   const hint=section.locator('details summary');await hint.focus();await page.keyboard.press('Enter');assert.equal(await hint.locator('..').getAttribute('open'),'');
   if(id==='l13'){
    await page.locator('#aufgabe-heading').locator('..').click();
    const task=await page.locator('#aufgabe-heading').locator('xpath=ancestor::details').innerText();
    assert.ok(task.includes('ohne Vorlage'));assert.ok(task.includes('A4:A8 und A9 Texte'));assert.ok(task.includes('stattdessen in C9'));
   }
   await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:1100});
    await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}/${width}/${theme}/${size}`);
    assert.ok(await section.isVisible());
   }
   await page.setViewportSize({width:390,height:1100});
   await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await page.evaluate(id=>{document.activeElement?.blur();scrollTo({top:document.getElementById(id+'-layout-check').getBoundingClientRect().top+scrollY-40,behavior:'instant'});},id);
   await page.waitForTimeout(250);await page.screenshot({path:`${__OUT}/${id}-transfer-mobile.png`});
   await page.setViewportSize({width:1440,height:1100});await page.evaluate(id=>scrollTo({top:document.getElementById(id+'-layout-check').getBoundingClientRect().top+scrollY-150,behavior:'instant'}),id);await page.waitForTimeout(250);await page.screenshot({path:`${__OUT}/${id}-transfer-desktop.png`});
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
  }
  // Independent scenario checks, not a claim that an actual Excel workbook was run.
  assert.equal(35*100/1000,3.5);assert.equal(4*100/100,4);assert.equal(35*200/1000,7);
  const initial=[240*3,120*8,350*2];const stale=[initial[0],initial[1],initial[2]];const repaired=[initial[0],170*8,initial[2]];
  assert.equal(repaired[1]-stale[1],400);assert.equal(repaired.reduce((a,b)=>a+b)-stale.reduce((a,b)=>a+b),400);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L1.3/L1.4 transfers passed: worksheet continuity, content/order, keyboard/hints, 32 layout states, scenario arithmetic, public fallback, no browser errors/external requests/progress writes');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
