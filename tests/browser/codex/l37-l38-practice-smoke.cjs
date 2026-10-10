// Von Codex geschrieben (früher .tmp/l37-l38-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l37-l38-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const {chromium} = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = (__BASE + '/');
(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  try {
    const context = await browser.newContext();
    const errors = [], external = [];
    await context.route('**/*', route => {
      if (route.request().url().startsWith(base)) return route.continue();
      external.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    await page.evaluate(() => localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1, theme:'dark', currentProfileId:'test', profiles:[{id:'test', name:'tes.pro', className:'WGW EK1', progress:{'l3-6':{completed:true},'l3-7':{completed:true}}}]})));
    for (const [file, ids] of [['l3-7.html',['l37-model-tests','l37-festival-transfer']], ['l3-8.html',['l38-choice-help','l38-change-tests']]]) {
      await page.goto(base + file + '?public-preview=1');
      await page.locator('.lesson-disclosure').evaluateAll(els => els.forEach(el => el.open=true));
      for (const id of ids) {
        const el = page.locator('#'+id);
        assert.equal(await el.count(), 1);
        await el.locator(':scope > summary').focus(); await page.keyboard.press('Enter');
        assert.equal(await el.evaluate(e => e.open), true);
        assert.ok(await el.evaluate(e => Boolean(e.compareDocumentPosition(document.querySelector('[id$="-mastery-section"]')) & Node.DOCUMENT_POSITION_FOLLOWING)));
      }
      const text = await page.locator('.lesson-article').innerText();
      if (file === 'l3-7.html') {
        for (const term of ['1,21 auf 1','5000 auf 10000','Schulfesttest','85,00','3,50','0,80','20 und 30','20 und 40','benachbarten ganzen','C3 auf 3,50','C5 auf 20','ohne zusätzliche XP']) assert.ok(text.includes(term), term);
        assert.equal(await page.locator('#l37-festival-transfer tbody tr').count(), 7);
      } else {
        for (const term of ['Empfehlung, keine zusätzliche Abschlussbedingung','Erwartung vor Excel','2010 auf 2012','33033 auf 34033','Ludwigsburg auf Ulm','101 auf 105','999','38 auf 40','nur die Tests zu deinen beiden']) assert.ok(text.includes(term), term);
        assert.equal(await page.locator('#l38-change-tests li').count(), 5);
        assert.equal(await page.locator('#l38-case-4 tbody tr').count(), 26);
      }
      const stored = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
      for (const width of [320,390,760,1440]) for (const theme of ['dark','light']) for (const size of ['normal','large']) {
        await page.setViewportSize({width,height:900});
        await page.evaluate(([t,s]) => {document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize=s;}, [theme,size]);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), file+' '+width+' '+theme+' '+size);
      }
      assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), stored);
      assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(), 0);
      await page.setViewportSize({width:file==='l3-7.html'?1440:390,height:900});
      await page.evaluate(() => {document.activeElement?.blur();document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
      await page.locator('#'+ids.at(-1)).evaluate(e => {e.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-150,behavior:'instant'});});
      await page.screenshot({path:__OUT + '/'+file.slice(0,-5)+'-practice-viewport.png'});
    }
    // Independent arithmetic models; no Excel workbook execution or private input.
    const net = (guests, price=3.5) => guests*price-(85+guests*.8);
    assert.ok(net(20)<0 && net(30)<0);
    const root = 85/(3.5-.8);
    assert.ok(net(Math.floor(root))<0 && net(Math.ceil(root))>=0);
    assert.ok(Math.abs(net(root))<1e-10);
    assert.equal(net(20,.8), -85); assert.equal(net(40,.8), -85);
    const capital = (start, rate) => Array.from({length:5},(_,i) => start*(1+rate/100)**(i+1));
    assert.deepEqual(capital(5000,0), [5000,5000,5000,5000,5000]);
    capital(5000,3).forEach((value,i) => assert.equal(capital(10000,3)[i], value*2));
    assert.equal((800+720)/1,1520);
    const years=[1998,2001,2007,2011,2015,1999];
    const sales=[85000,125000,68350,120750,197350,22786];
    const bonus=(year,sale,boundary)=>year>=boundary?.03:sale>100000?.1:.05;
    assert.deepEqual(years.flatMap((y,i) => bonus(y,sales[i],2010)!==bonus(y,sales[i],2012)?[i+1]:[]),[4]);
    const rows=[['Ludwigsburg','Einzelhandel',33033],['Ulm','Wiederverkäufer',42731]];
    const total=rs=>rs.reduce((s,r)=>s+r[2],0);
    assert.equal(total([[...rows[0].slice(0,2),34033],rows[1]])-total(rows),1000);
    assert.equal(total([['Ulm','Einzelhandel',33033],rows[1]]),total(rows));
    const departments=['Handball','Volleyball','Turnen','Fußball','Handball','Turnen'];
    assert.deepEqual(departments.flatMap((d,i)=>d==='Handball'?[i+1]:[]),[1,5]);
    assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
    console.log('L3.7/L3.8 practice passed: four disclosures, keyboard, 32 layouts, unchanged storage, public links, independent goal/whole-number/unreachable and rule-change models, no browser errors or external requests.');
  } finally {await browser.close();}
})().catch(e => {console.error(e);process.exitCode=1;});
