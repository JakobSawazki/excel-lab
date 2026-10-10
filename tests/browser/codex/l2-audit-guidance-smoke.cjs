// Von Codex geschrieben (früher .tmp/l2-audit-guidance-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l2-audit-guidance-smoke.cjs [Adresse]
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
  await page.route('**/*',r=>{if(!r.request().url().startsWith(base)){external.push(r.request().url());return r.abort();}return r.continue();});
  for(let n=1;n<=5;n++){
   assert.equal((await page.goto(base+`l2-${n}.html?public-preview=1`)).status(),200);
   await page.evaluate(n=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'audit',profiles:[{id:'audit',name:'tes.pro',className:'WGW EK1',progress:{[n===1?'l1-6':`l2-${n-1}`]:{completed:true}}}]})),n);await page.reload();
   const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
   const ids=n===1?['l21-backcheck']:n===2?['l22-backcheck']:n===3?['l23-file-plan','l23-bus-backcheck','l23-pay-backcheck']:n===4?['l24-independent-check']:['l25-pay-check'];
   for(const id of ids){const d=page.locator('#'+id);await d.evaluate(el=>el.open=false);await d.locator('summary').focus();await page.keyboard.press('Enter');await page.waitForFunction(id=>document.getElementById(id).open,id);assert.equal(await d.getAttribute('open'),'');}
   const hints=(await page.locator('.l16-source-check').allInnerTexts()).join(' ');
   for(const answer of ['60,00 €','80,00 €','892,00 €','5.800,00 €','6.800,00 €'])assert.ok(!hints.includes(answer),`l2-${n}: answer exposed`);
   if(n===3){const plan=await page.locator('#l23-file-plan').innerText();for(const t of ['Speichern unter','bevor du Zellen änderst','drei Dateien','getrennte Arbeitsmappen','automatisch'])assert.ok(plan.includes(t),t);}
   if(n===4){const intro=await page.locator('.lesson-workspace-intro').innerText();for(const t of ['L2.2-Datei','vollständigen Eingaben','nur eine Alternative'])assert.ok(intro.includes(t),t);assert.ok(!intro.includes('wird in der mitgelieferten Excel-Vorlage bearbeitet'));const help=await page.locator('#l24-independent-check').innerText();for(const t of ['sechs Eingabewerte','durch sechs','10 oder 16','Zwei Formeln können','mehr Dezimalstellen','zeigt dir die Formel'])assert.ok(help.includes(t),t);}
   if(n===5){
    const table=page.locator('table').filter({has:page.locator('caption',{hasText:'Ausgangsdaten für die Provisionsabrechnung'})});
    const rates=await table.locator('tbody tr').evaluateAll(rows=>rows.map(r=>r.cells[5].textContent));assert.deepEqual(rates,['2','2','3','4','3','4']);
    assert.match(await table.locator('thead th').last().innerText(),/ganze Prozentzahl/);
    const note=await page.locator('.important-note').filter({hasText:'Prozent-Eingabe beim Neuaufbau'}).innerText();for(const t of ['nicht 2 %','einmal durch 100','0,02','Zellwert'])assert.ok(note.includes(t),t);
    const help=await page.locator('#l25-pay-check').innerText();for(const t of ['jede der sechs Personen','Durchschnitt, Minimum und Maximum','1.000 auf 1.100','Umsätze und Provisionen müssen unverändert','Stelle B3 wieder auf 1.000','höchsten Umsatz','keine zusätzlichen XP'])assert.ok(help.includes(t),t);
   }
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:1100});await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${n}/${width}/${theme}/${size}`);
   }
   if(n===3||n===4||n===5){
    await page.setViewportSize({width:n===3?1440:390,height:1100});
    await page.evaluate(n=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';document.activeElement?.blur();const el=document.querySelector(n===3?'#l23-file-plan':n===4?'#l24-independent-check':'#l25-pay-check');scrollTo({top:el.getBoundingClientRect().top+scrollY-150,behavior:'instant'});},n);await page.waitForTimeout(250);await page.screenshot({path:`${__OUT}/l2-audit-${n}.png`});
    if(n===3)await page.locator('#l23-file-plan').screenshot({path:__OUT + '/l23-file-plan-detail.png'});
    if(n===4||n===5)await page.locator(n===4?'#l24-independent-check':'#l25-pay-check').screenshot({path:`${__OUT}/l2-source-check-${n}.png`});
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
  }
  // Independent arithmetic exercises the stated checking relationships, not Excel itself.
  for(const [rate,hours]of [[6,10],[4.5,15]]){assert.equal((rate*hours)/rate,hours);assert.equal((rate*hours+20-20)/rate,hours);}
  for(const distance of [410,40,126])for(const [rent,rate]of [[400,1.2],[500,1.05],[300,1.5]])assert.ok(Math.abs((distance*rate+rent-rent)/rate-distance)<1e-8);
  for(const [turnover,rate]of [[290000,2],[265000,2],[189000,3],[106000,4],[199000,3],[98000,4]]){const commission=turnover*rate/100;assert.ok(Math.abs(commission/turnover-rate/100)<1e-12);assert.equal(commission+1000-1000,commission);assert.ok(Math.abs((turnover*(rate/100)/100)*100-commission)<1e-8);}
  const stats=values=>({sum:values.reduce((a,b)=>a+b,0),mean:values.reduce((a,b)=>a+b,0)/values.length,min:Math.min(...values),max:Math.max(...values)});
  for(const badmintonHours of [10,16]){
   const inputs=[[12,6,10],[18,4,badmintonHours],[20,5,20],[14,4,18],[15,5,20],[18,4.5,15]];
   for(const values of [inputs.map(r=>r[0]),inputs.map(r=>r[2]),inputs.map(r=>r[1]*r[2]+20)]){
    const s=stats(values);assert.ok(Math.abs(s.mean*6-s.sum)<1e-8);assert.equal(values.length,6);
    const ordered=[...values].sort((a,b)=>a-b);assert.equal(s.min,ordered[0]);assert.equal(s.max,ordered[5]);
   }
  }
  const turnovers=[290000,265000,189000,106000,199000,98000],rates=[2,2,3,4,3,4],commissions=turnovers.map((t,i)=>t*rates[i]/100),c=stats(commissions);
  for(const fixed of [1000,1100]){const g=stats(commissions.map(v=>v+fixed));assert.equal(g.sum-c.sum,6*fixed);for(const key of ['mean','min','max'])assert.equal(g[key]-c[key],fixed);}
  assert.notEqual(turnovers.indexOf(Math.max(...turnovers)),commissions.indexOf(Math.max(...commissions)));
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L2 guidance audit passed: five pages, seven keyboard disclosures, original input variants, six whole-percent inputs, 80 layouts, independent inverse/unit and four-statistic checks, common-salary change and different maximum owners, unchanged progress, public fallback and no browser errors/external requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
