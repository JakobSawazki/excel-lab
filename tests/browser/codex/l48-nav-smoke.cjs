// Von Codex geschrieben (früher .tmp/l48-nav-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l48-nav-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:844},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l1-1':{completed:true}}}]})));
  const files=['l4-8.html'];
  for(const file of files){
   await page.goto((__BASE + '/')+file);
   await page.locator('.main-nav').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   for(const size of ['normal','large'])for(const width of [320,390,600,760,1024,1440]){
    await page.setViewportSize({width,height:844});
    await page.evaluate(size=>document.documentElement.dataset.textSize=size,size);
    await page.waitForTimeout(180); // Existing 160ms nav transitions must finish before measuring.
    // Claude, 10.10.2026: wie in mobile-navigation-smoke zusätzlich auf laufende Übergänge warten;
    // auf einem ausgelasteten Rechner fiel die Messung sonst in den Übergang.
    await page.evaluate(()=>Promise.all(document.getAnimations().map(animation=>animation.finished.catch(()=>{}))));
    const bounds=await page.locator('.main-nav > .nav-link, .main-nav .nav-learning-link, .main-nav .nav-menu-toggle').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return{x:b.x,right:b.right,top:b.y,bottom:b.bottom,width:b.width,height:b.height,scroll:n.scrollWidth,client:n.clientWidth};}));
    for(const b of bounds){assert.ok(b.x>=0&&b.right<=width+1&&b.top>=0&&b.bottom<=844,`${file}/${width}/${size}: bounds ${JSON.stringify(b)}`);assert.ok(b.scroll<=b.client+1,`${file}/${width}/${size}: clipped label ${JSON.stringify(b)}`);if(width<=600)assert.ok(b.height>=44,`${file}: touch height`);}
   }
   await page.setViewportSize({width:320,height:844});
   await page.locator('[data-learning-toggle]').tap();
   assert.equal(await page.locator('#nav-stage-menu').isVisible(),true);
   await page.locator('[data-stage-toggle="1"]').tap();
   assert.equal(await page.locator('#nav-chapters-1').isVisible(),true);
   const rect=await page.locator('#nav-stage-menu').boundingBox(),navRect=await page.locator('.main-nav').boundingBox();
   assert.ok(rect.x>=0&&rect.x+rect.width<=321&&rect.y>=0&&rect.y+rect.height<navRect.y,`${file}: dropdown over dock/offscreen`);
   await page.keyboard.press('Escape');
  }
  await page.goto((__BASE + '/l1-1.html'));
  await page.locator('.main-nav a[href="index.html#formeln"]').tap();await page.waitForURL('**/index.html#formeln');
  assert.equal(await page.locator('#view-formulas').isVisible(),true);
  await page.locator('[data-learning-toggle]').tap();await page.locator('[data-stage-toggle="1"]').tap();
  await page.screenshot({path:__OUT + '/mobile-navigation-dark.png'});
  await page.keyboard.press('Escape');
  await page.evaluate(()=>document.documentElement.dataset.theme='light');
  await page.waitForTimeout(180);
  await page.screenshot({path:__OUT + '/mobile-navigation-light.png'});
  assert.deepEqual(errors,[]);
  console.log(`Navigation passed: all ${files.length} pages, 6 widths, 2 text sizes, bounds/labels, 44px height, touch menu/chapter, dropdown clearance, direct formula navigation`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
