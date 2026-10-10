// Von Codex geschrieben (früher .tmp/l48-mastery-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l48-mastery-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const {chromium} = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const seed=async(progress)=>{await page.evaluate(progress=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress}]})),progress);await page.reload();};
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].progress);
  await page.goto((__BASE + '/l4-8.html'));
  await seed({});assert.equal(await page.locator('#l48-content').isVisible(),false);
  await seed({'l4-7':{completed:true}});
  for(const i of [0,1,2]) await page.locator(`[data-page-check="${i}"]`).check();
  await page.locator('#page-teacher-check').check();
  await page.locator('#page-complete-button').click();
  assert.equal((await read())['l4-8'].completed,false);
  assert.equal(await page.locator('#l48-mastery-section').getAttribute('open'),'');
  const submit=()=>page.locator('#l48-mastery-form button[type=submit]').click();
  await submit();assert.equal(await page.locator('[data-result=incorrect]').count(),3);
  for(const name of ['source','axis','change']) await page.locator(`input[name=${name}][value=b]`).check();
  await submit();assert.equal((await read())['l4-8'].masteryPassed,false);
  assert.match(await page.locator('[data-mastery-question=change] .mastery-feedback').innerText(),/950/);
  for(const [name,value] of Object.entries({source:'b',axis:'c',change:'a'})) await page.locator(`input[name=${name}][value=${value}]`).check();
  await submit();assert.equal((await read())['l4-8'].masteryPassed,true);
  assert.equal((await read())['l4-8'].completed,false);
  await page.reload();assert.match(await page.locator('#l48-mastery-status').textContent(),/bestanden/);
  await page.locator('[data-page-check="2"]').uncheck();
  await page.locator('#page-complete-button').click();assert.equal((await read())['l4-8'].completed,false);
  await page.locator('[data-page-check="2"]').check();
  await page.locator('#page-teacher-check').uncheck();
  await page.locator('#page-complete-button').click();assert.equal((await read())['l4-8'].completed,false);
  await page.locator('#page-teacher-check').check();
  await page.locator('#page-complete-button').click();assert.equal((await read())['l4-8'].completed,true);
  assert.equal(await page.locator('#next-lesson-link').getAttribute('aria-disabled'),'false');
  assert.match(await page.locator('#lesson-points-status').innerText(),/100 von 100/);
  await page.locator('#next-lesson-link').click();
  await page.waitForURL('**/index.html#uebersicht');
  assert.equal(await page.locator('#lesson-dialog').isVisible(),false);
  await page.goto((__BASE + '/l4-8.html'));
  await seed({'l4-7':{completed:true},'l4-8':{completed:true,teacherChecked:true,checks:[true,true,true]},'l4-1':{completed:true}});
  assert.match(await page.locator('#l48-mastery-status').textContent(),/bestanden/);
  await page.locator('#page-complete-button').click();
  assert.equal((await read())['l4-1'].completed,true);assert.equal((await read())['l4-8'].masteryPassed,true);
  // Changing profile from another tab must not award the new profile a stale quiz attempt.
  await seed({'l4-7':{completed:true}});
  await page.locator('#l48-mastery-section summary').click();
  for(const [name,value] of Object.entries({source:'b',axis:'c',change:'a'})) await page.locator(`input[name=${name}][value=${value}]`).check();
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('excelLab.state.v1'));s.currentProfileId='other';s.profiles.push({id:'other',name:'oth.pro',className:'WGW EK1',progress:{'l4-7':{completed:true}}});localStorage.setItem('excelLab.state.v1',JSON.stringify(s));});
  await submit();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[1].progress['l4-8']),undefined);
  // Notification of a remote profile switch also clears stale answers.
  await seed({'l4-7':{completed:true}});
  await page.locator('#l48-mastery-section summary').click();
  await page.locator('input[name=source][value=b]').check();
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('excelLab.state.v1'));s.currentProfileId='other';s.profiles.push({id:'other',name:'oth.pro',className:'WGW EK1',progress:{'l4-7':{completed:true}}});localStorage.setItem('excelLab.state.v1',JSON.stringify(s));dispatchEvent(new StorageEvent('storage',{key:'excelLab.state.v1'}));});
  assert.equal(await page.locator('#l48-mastery-form input:checked').count(),0);
  // A failed write must not display a passed check or pretend to award points.
  await seed({'l4-7':{completed:true}});
  await page.locator('#l48-mastery-section summary').click();
  for(const [name,value] of Object.entries({source:'b',axis:'c',change:'a'})) await page.locator(`input[name=${name}][value=${value}]`).check();
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError');};});
  await submit();
  assert.equal((await read())['l4-8'],undefined);
  assert.doesNotMatch(await page.locator('#l48-mastery-status').textContent(),/^Verständnis-Check bestanden/);
  assert.match(await page.locator('#toast-region').innerText(),/Speichern im Browser nicht möglich/);
  await page.reload();
  const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
  await page.evaluate(()=>{window.EXCEL_LAB_DEV={enabled:true};dispatchEvent(new Event('excel-lab-dev-change'));});
  assert.equal(await page.locator('#l48-mastery-form input:disabled').count(),9);
  assert.equal(await page.locator('#page-complete-button').isDisabled(),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
  await page.reload();
  await page.locator('#l48-mastery-section summary').click();
  await page.setViewportSize({width:320,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.locator('#l48-mastery-section').screenshot({path:__OUT + '/l48-mastery-mobile.png'});
  for (const width of [320,390,760,1440]) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(el=>el.open=true));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true, 'page width '+width);
  }
  for (const link of await page.locator('.download-item').evaluateAll(els=>els.map(el=>el.href))) {
    assert.equal((await page.request.get(link)).status(),200);
    assert.doesNotMatch(link,/Lösung|Loesung/i);
  }
  await page.goto((__BASE + '/l4-8.html?public-preview=1'));
  assert.equal(await page.locator('.download-item[data-public-material-link=true]').count(),3);
  assert.equal(await page.locator('.lesson-main-nav').count(),1);
  assert.equal(await page.locator('.location-path').innerText(),'BPE1\n›\nL4\n›\nL4.8');
  assert.ok(await page.locator('a[href="index.html#lernpfad/4"]').count()>0);
  await seed({'l4-7':{completed:true},'l4-8':{completed:true,teacherChecked:true,checks:[true,true,true]}});
  await page.goto((__BASE + '/index.html#lernpfad/4/l4-8'));
  await page.waitForURL('**/l4-8.html');
  await page.locator('#l48-content').waitFor({state:'visible'});
  assert.match(await page.locator('#l48-mastery-status').textContent(),/bestanden/);
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#l48-content').screenshot({path:__OUT + '/l48-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.locator('#l48-content').screenshot({path:__OUT + '/l48-mobile.png'});
  assert.deepEqual(errors,[]);console.log('L4.8 mastery passed: prerequisite, empty/wrong/correct attempts, persisted gate, completion/100 points, legacy completion, undo, profile switch, mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
