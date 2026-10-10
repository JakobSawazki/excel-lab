// Von Codex geschrieben (früher .tmp/l4-guidance-audit-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l4-guidance-audit-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();external.push(r.request().url());return r.abort();});
  for(const n of [2,5,7]){
   assert.equal((await page.goto(base+`l4-${n}.html?public-preview=1`)).status(),200);
   await page.evaluate(n=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{[`l4-${n-1}`]:{completed:true}}}]})),n);
   await page.reload();
   await page.waitForFunction(()=>window.EXCEL_LAB_DEPLOYMENT?.isPublicSite===true&&document.documentElement.classList.contains('public-site'),null,{timeout:10000});
   const saved=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   await page.locator('.lesson-disclosure').evaluateAll(els=>els.forEach(e=>e.open=true));
   const text=await page.locator('.lesson-article').innerText();
   if(n===2){
    const note=page.locator('.important-note').filter({hasText:'Vor dem Sortieren die Diagrammquelle prüfen'});
    for(const term of ['kopierten Blatt','nicht vom unveränderten Original','nur deren Diagramm','Stelle den Wert zurück','ursprüngliche Blatt'])assert.ok((await note.innerText()).includes(term),term);
    await note.screenshot({path:__OUT + '/l42-copy-source.png'});
   }
   if(n===5){
    for(const term of ['eigene Addition seiner vier Eingabewerte','Ein Vorlagen-Download ist dafür nicht nötig','vier Werte desselben Jahres','keine bereits berechnete Summe'])assert.ok(text.includes(term),term);
    assert.ok(!text.includes('Prüfe sie gegen die Tabelle der Originalaufgabe'));
   }
   if(n===7){
    const legend=await page.locator('#l47-mastery-form legend').allInnerTexts();
    assert.ok(legend.some(t=>t.includes('Was misst der Umsatz pro Kunde')));
    assert.ok(!legend.some(t=>t.includes('Jahresumsatz pro Kunde')));
    assert.equal(await page.locator('#l47-mastery-form fieldset').count(),3);
    assert.equal(await page.locator('#l47-mastery-form input[type=radio]').count(),9);
    assert.ok(text.includes('kein Zeitraum angegeben'));
   }
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:1000});
    await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${n}/${width}/${theme}/${size}`);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0,JSON.stringify(await page.evaluate(()=>({url:location.href,deployment:window.EXCEL_LAB_DEPLOYMENT,scripts:[...document.scripts].map(s=>s.src)}))));
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L4 guidance audit passed: copy/source/reset instructions, independent five-year sum check without template, period-neutral quiz with unchanged question structure, 48 layouts, unchanged progress, no private links/external requests/browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
