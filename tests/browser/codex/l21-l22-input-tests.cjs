// Von Codex geschrieben (früher .tmp/l21-l22-input-tests.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l21-l22-input-tests.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(!route.request().url().startsWith(base)){external.push(route.request().url());return route.abort();}return route.continue();});
  for(const id of [1,2]){
   await page.goto(base+`l2-${id}.html?public-preview=1`);
   await page.evaluate(id=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{[id===1?'l1-6':'l2-1']:{completed:true}}}]})),id);await page.reload();
   const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   const expected=[['Tennis','Hakan','12','6,00','10'],['Badminton','Laura','18','4,00',id===1?'10':'16'],['Volleyball','Dennis','20','5,00','20'],['Basketball','Marie','14','4,00','18'],['Tischtennis','Nikolai','15','5,00','20'],['Handball','Umut','18','4,50','15']];
   assert.deepEqual(await page.locator('.l21-data-table thead th').allTextContents(),['Kurs','Betreuer','Teilnehmer','€/Stunde','Stunden']);
   assert.deepEqual(await page.locator('.l21-data-table tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent))),expected);
   await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
   const section=page.locator(`#l2${id}-input-tests`);await section.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await section.getAttribute('open'),'');
   const text=await section.innerText();for(const term of id===1?['C11','E11','D11','18 → 19','15 → 16','4,50 → 5,00','Vorhersage']:['20 → 23','E11','B3','auf 0','10 oder 16','festen Zahlenwert'])assert.ok(text.includes(term),term);
   assert.ok(await section.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('[id$="mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)));
   if(id===2){const article=await page.locator('.lesson-article').innerText();for(const term of ['ohne Download','keine weiteren Zeilen','optionale Alternative','leere Arbeitsmappe','Notiere deinen Startweg','Teil 1 bleibt unverändert'])assert.ok(article.includes(term),term);assert.match(await page.locator('[data-page-check="0"]').locator('..').innerText(),/nur bei Bedarf/);}
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:1100});await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}/${width}/${theme}/${size}`);
   }
   await page.setViewportSize({width:390,height:1100});await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await section.scrollIntoViewIfNeeded();await page.screenshot({path:`${__OUT}/l2${id}-input-tests-mobile.png`});
   await page.setViewportSize({width:1440,height:1100});await section.scrollIntoViewIfNeeded();await page.screenshot({path:`${__OUT}/l2${id}-input-tests-desktop.png`});
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
  }
  // Independent scenario arithmetic; these assertions do not execute Excel.
  const rates=[6,4,5,4,5,4.5];
  for(const badminton of [10,16]){const hours=[10,badminton,20,18,20,15];const calc=flat=>rates.map((r,i)=>r*hours[i]+flat);
   assert.deepEqual(calc(23).map((v,i)=>v-calc(20)[i]),[3,3,3,3,3,3]);assert.deepEqual(calc(0),rates.map((r,i)=>r*hours[i]));
  }
  assert.equal(4.5*16-4.5*15,4.5);assert.equal(5*15-4.5*15,7.5);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L2.1/L2.2 passed: all source rows and worksheet-aligned columns, no-download routes, conditional row insertion, separate input tests, 32 layout states, independent arithmetic, no progress writes/external requests');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
