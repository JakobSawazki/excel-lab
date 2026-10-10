// Von Codex geschrieben (früher .tmp/l33-l34-workflow-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l33-l34-workflow-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = (__BASE + '/');
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true});
 try {
  const page = await browser.newPage(), errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', r => { if(r.request().url().startsWith(base)) return r.continue(); external.push(r.request().url()); return r.abort(); });
  for (const n of [3,4]) {
   assert.equal((await page.goto(base + `l3-${n}.html?public-preview=1`)).status(),200);
   await page.evaluate(n => localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{[`l3-${n-1}`]:{completed:true}}}]})),n);
   await page.reload();
   const saved = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
   await page.locator('.lesson-disclosure').evaluateAll(els => els.forEach(e => e.open = true));
   const detail = page.locator(n===3?'#l33-file-layout-check':'#l34-file-plan');
   await detail.locator('summary').focus(); await page.keyboard.press('Enter');
   assert.equal(await detail.evaluate(e => e.open),true);
   const text = await detail.innerText();
   const terms = n===3?['Teil 4 bleibt unverändert','B4/B5','H10:I12','F10:F22','F23 selbst gehört weder','D26:F26','D27:D29','erste und letzte Person','13 Preise']:['bevor du Formatierungsregeln ergänzt','automatischem Speichern','L3_2.1','L3_2.2','Blattkopie','F4/G4','13 Spiele','Tore und Tipps'];
   for(const t of terms) assert.ok(text.includes(t),t);
   for(const width of [320,390,760,1440]) for(const theme of ['dark','light']) for(const size of ['normal','large']) {
    await page.setViewportSize({width,height:1100});
    await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${n}/${width}/${theme}/${size}`);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),saved);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
   await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';document.activeElement?.blur();});
   await detail.screenshot({path:`${__OUT}/l3-${n}-workflow.png`});
  }
  // Independent coordinate/count checks, not an Excel workbook execution.
  const shifted = row => row>=7?row+2:row;
  assert.deepEqual([4,5,7,8,20].map(shifted),[4,5,9,10,22]);
  assert.deepEqual([8,9,10].map(shifted),[10,11,12]);
  assert.equal(22-10+1,13); assert.ok(23>22 && 27>23);
  assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
  console.log('L3.3/L3.4 workflows passed: two keyboard disclosures, row/parameter/tariff mapping, total outside data, file stages, 32 layouts, unchanged progress and no private links/external requests/browser errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
