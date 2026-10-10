// Von Codex geschrieben (früher .tmp/l11-entry-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l11-entry-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const {chromium} = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = (__BASE + '/');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1100}});
    const errors=[], external=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>{
      if(!r.request().url().startsWith(base)){external.push(r.request().url());return r.abort();}
      return r.continue();
    });
    assert.equal((await page.goto(base+'l1-1.html?public-preview=1')).status(),200);
    await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'practice',profiles:[{id:'practice',name:'tes.pro',className:'WGW EK1',progress:{}}]})));
    await page.reload();
    const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
    await page.locator('.l11-situation a').click();
    // Claude, 10.10.2026: Der Abschnitt öffnet erst im hashchange-Ereignis nach dem Klick.
    // Die sofortige Prüfung scheiterte in etwa einem von fünf Läufen; deshalb warten.
    await page.waitForFunction(()=>document.querySelector('#aufgabe1-heading').closest('details').open);
    for(const id of ['l11-layout-help','l11-change-test']){
      const d=page.locator('#'+id);
      await d.locator('xpath=ancestor::details[contains(@class,"lesson-disclosure")]').evaluate(el=>el.open=true);
      await d.evaluate(el=>el.open=false);
      await d.locator('summary').focus();await page.keyboard.press('Enter');
      assert.equal(await d.getAttribute('open'),'');
      assert.equal(await d.locator('input,button').count(),0);
    }
    const help=await page.locator('#l11-layout-help').innerText();
    for(const t of ['A1','A3 bis D3','A4 bis A8','B4 bis B8','C4 bis C8','D4 bis D8','A9','D9','Zellwerte müssen Zahlen bleiben'])assert.ok(help.includes(t),t);
    const test=await page.locator('#l11-change-test').innerText();
    for(const t of ['30 auf 32','Vorhersagen','automatisch','anderen vier Getränke','30','erneut','keine zusätzlichen XP'])assert.ok(test.includes(t),t);
    const situation=page.locator('#l11-situation-heading');
    assert.ok(await situation.isVisible());
    assert.ok(await page.locator('.l11-situation').innerText().then(t=>t.includes('Firmenveranstaltung')&&t.includes('Pfand')));
    assert.ok(await page.locator('.l11-situation img').evaluate(el=>el.complete&&el.naturalWidth>0));
    for(const formula of ['=B4*C4','=B5*C5','=B6*C6','=B7*C7','=B8*C8','=SUMME(D4:D8)'])assert.ok(help.includes(formula),formula);
    assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
    assert.equal(await page.locator('#l11-change-test a').getAttribute('href'),'l1-2.html');
    const data=await page.locator('.source-data-grid article').evaluateAll(els=>els.map(el=>({name:el.querySelector('small').textContent,price:Math.round(Number(el.querySelector('strong').textContent.replace('€','').replace(',','.').trim())*100),qty:Number(el.querySelector('span').textContent.match(/\d+/)[0])})));
    assert.equal(data.length,5);
    const original=data.map(r=>r.price*r.qty), sum=original.reduce((a,b)=>a+b,0);
    assert.equal(sum,10532);
    const changed=data.map((r,i)=>r.price*(r.qty+(i===0?2:0)));
    assert.equal(changed[0]-original[0],280);
    assert.equal(changed.reduce((a,b)=>a+b,0)-sum,280);
    assert.deepEqual(changed.slice(1),original.slice(1));
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
      await page.setViewportSize({width,height:1100});
      await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}/${theme}/${size}`);
    }
    for(const [width,target,path] of [[1440,'l11-situation-heading',__OUT + '/l11-entry-desktop.png'],[390,'l11-situation-heading',__OUT + '/l11-entry-mobile.png']]){
      await page.setViewportSize({width,height:1100});
      await page.evaluate(id=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';document.activeElement?.blur();window.scrollTo({top:document.getElementById(id).getBoundingClientRect().top+scrollY-150,behavior:'instant'});},target);
      await page.waitForTimeout(250);await page.locator('.l11-situation').screenshot({path});
    }
    assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    console.log('L1.1 entry practice passed: two keyboard disclosures, consistent cell plan, five source rows, independent arithmetic/change invariants, 16 layouts, no progress writes, external requests or JS errors');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
