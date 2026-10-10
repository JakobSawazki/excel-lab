// Von Codex geschrieben (früher .tmp/formula-lab-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/formula-lab-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({ channel:'msedge', headless:true });
 try {
  const page = await browser.newPage({ viewport:{width:1440,height:1000} });
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto((__BASE + '/l1-2.html'));
  assert.equal(await page.locator('#lab-quantity').isVisible(),false,'prerequisite respected');
  await page.addInitScript(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l1-1':{completed:true}}}]})));
  await page.reload();
  const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
  const demo=page.locator('.formula-lab-disclosure');
  await demo.locator('summary').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('#lab-quantity').isVisible(),true);
  await page.locator('#lab-quantity').focus(); await page.keyboard.press('Home');
  assert.match(await page.locator('#lab-total').innerText(),/2,50/);
  await page.keyboard.press('End'); assert.match(await page.locator('#lab-total').innerText(),/50,00/);
  await page.locator('#lab-reset').click(); assert.match(await page.locator('#lab-total').innerText(),/15,00/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
  const order=await page.locator('.lesson-page-content > details .section-index').allTextContents();
  // Verify pedagogical order independently of the content wrapper name.
  const indices=await page.locator('.section-index').allTextContents();
  assert.ok(indices.indexOf('02 · Informieren') < indices.indexOf('03 · Ausprobieren'));
  assert.ok(indices.indexOf('03 · Ausprobieren') < indices.indexOf('05 · Deine Aufgabe'));
  for(const theme of ['dark','light']) {
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await demo.screenshot({path:__OUT + '/formula-lab-'+theme+'.png'});
  }
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await demo.screenshot({path:__OUT + '/formula-lab-mobile.png'});
  await demo.locator('summary').click(); assert.equal(await page.locator('#lab-quantity').isVisible(),false);
  await page.goto((__BASE + '/')); assert.equal(await page.locator('#lab-quantity').count(),0);
  assert.deepEqual(errors,[]); console.log('Formula lab passed: prerequisite, lesson order, quantity/reset, unchanged progress, dark/light/mobile, disclosure, absent on homepage');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
