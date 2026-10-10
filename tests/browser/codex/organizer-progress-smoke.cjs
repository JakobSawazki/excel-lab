// Von Codex geschrieben (früher .tmp/organizer-progress-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/organizer-progress-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((__BASE + '/'));
  await page.locator('#profile-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');
  const totals=[6,5,8,8];
  const verify=async(counts)=>{
   for(let i=0;i<4;i++){
    const bar=page.locator(`#organizer-progress-${i+1}`);
    assert.equal(await bar.getAttribute('max'),String(totals[i]));
    assert.equal(await bar.getAttribute('value'),String(counts[i]));
    assert.equal(await page.locator(`#organizer-progress-label-${i+1} [data-organizer-completed]`).innerText(),`${counts[i]}/${totals[i]} erledigt`);
    assert.equal(await page.locator(`#organizer-progress-label-${i+1} [data-organizer-percent]`).innerText(),`${Math.round(counts[i]/totals[i]*100)}%`);
    assert.ok((await page.locator(`[data-organizer-stage="${i+1}"]`).getAttribute('aria-describedby')).includes(`organizer-progress-label-${i+1}`));
   }
  };
  await verify([0,0,0,0]);
  const seed=async(progress)=>{await page.evaluate(progress=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress}]})),progress);await page.reload();};
  await seed({'l1-1':{completed:true},'l1-2':{completed:true},'l2-1':{completed:true},'l3-4':{completed:true},'l4-1':{completed:true},'l4-2':{checks:[true,true,true]},'unknown':{completed:true}});
  await verify([2,1,1,1]);
  const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
  for(let i=1;i<=4;i++){
   await page.locator(`[data-organizer-stage="${i}"]`).hover();
   await page.locator(`[data-organizer-stage="${i}"] img`).click();
   await page.waitForURL(`**#lernpfad/${i}`);
   assert.match(await page.locator(`#stage-${i} .stage-progress`).innerText(),new RegExp(`${[2,1,1,1][i-1]}/${totals[i-1]}`));
   await page.locator('[data-brand-home]').first().click();
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before,'exploration must not write progress');
  const all={};for(let stage=1;stage<=4;stage++)for(let n=1;n<=totals[stage-1];n++)all[`l${stage}-${n}`]={completed:true};
  await seed(all);await verify(totals);
  await seed({});await verify([0,0,0,0]);
  await page.locator('#import-file').setInputFiles({name:'test-profile.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({app:'Excel-Lab',version:1,profile:{id:'imported',name:'oth.pro',className:'WGW EK1',progress:{'l4-1':{completed:true}}}}))});
  await page.waitForFunction(()=>document.querySelector('#organizer-progress-4').value===1);
  await verify([0,0,0,1]);
  assert.equal(await page.locator('#profile-name').innerText(),'oth.pro');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].progress['l4-1']),undefined,'previous profile retained without transferred progress');
  for(const theme of ['dark','light'])for(const width of [320,390,760,1440]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize='large';},theme);
   await page.waitForTimeout(180);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   for(const label of await page.locator('.organizer-progress-label').evaluateAll(els=>els.map(el=>({w:el.clientWidth,s:el.scrollWidth}))))assert.ok(label.s<=label.w+1);
  }
  await page.setViewportSize({width:390,height:1000});
  await page.evaluate(()=>document.activeElement?.blur());
  await page.locator('.home-organizer').screenshot({path:__OUT + '/organizer-progress-mobile.png'});
  assert.equal(await page.locator('.home-stages-disclosure, #chapter-grid').count(),0);
  assert.deepEqual(errors,[]);
  console.log('Organizer progress passed: empty/partial/full/reset states, exact stage counts, unknown/incomplete ignored, accessible values, links, no writes, dark/light and 4 widths at large size');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
