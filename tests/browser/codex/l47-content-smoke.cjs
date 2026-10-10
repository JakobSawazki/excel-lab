// Von Codex geschrieben (früher .tmp/l47-content-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l47-content-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const source=JSON.parse(execFileSync('C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',['-c',String.raw`from docx import Document
from pathlib import Path
import json
root=Path('materialien/BPE1/Lernfortschritt_4/Aufgabenstellungen')
def number(s): return float(s.replace('€','').replace('.','').replace(',','.').strip())
a=Document(root/'L4_2.1 Vertiefungsaufgabe 1 Filialumsätze.docx').tables[0]
b=Document(root/'L4_2.2 Vertiefungsaufgabe 2 Umsatzauswertungen.docx').tables[0]
print(json.dumps({'branches':[[number(c.text) for c in r.cells[2:7]] for r in a.rows[2:6]],'quarters':[number(r.cells[7].text) for r in a.rows[2:6]],'years':[number(c.text) for c in a.rows[6].cells[2:7]],'total':number(a.rows[6].cells[7].text),'customers':[[number(r.cells[3].text),number(r.cells[4].text)] for r in b.rows[5:9]]}))`],{encoding:'utf8'}));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((__BASE + '/l4-7.html'));
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l4-6':{completed:true}}}]})));
  await page.reload();
  const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
  const rows=selector=>page.locator(selector+' tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].slice(1).map(c=>Number(c.textContent))));
  assert.deepEqual(await rows('#l47-branch-data'),source.branches);
  assert.deepEqual(await rows('#l47-customer-data'),source.customers);
  assert.deepEqual(source.branches.map(row=>row.reduce((a,b)=>a+b,0)),source.quarters);
  assert.deepEqual(source.branches[0].map((_,col)=>source.branches.reduce((sum,row)=>sum+row[col],0)),source.years);
  assert.equal(source.quarters.reduce((a,b)=>a+b,0),source.total);
  assert.equal(source.years.reduce((a,b)=>a+b,0),source.total);
  await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
  const text=await page.locator('.lesson-article').innerText();
  assert.match(await page.locator('.lesson-page-hero').innerText(),/sechs|Sechs/);
  assert.match(text,/=SUMME\(B2:F2\)/);
  assert.match(text,/=B6\/\$G\$6/);
  assert.match(text,/=C2\/\$C\$6/);
  assert.match(text,/ungewichteten Mittelwert/);
  assert.doesNotMatch(text,/339[. ]?620/); // Students calculate the total themselves.
  await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
  for(const theme of ['dark','light'])for(const size of ['normal','large'])for(const width of [320,390,760,1440]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme}/${size}/${width}`);
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
  await page.locator('#l47-task-heading').scrollIntoViewIfNeeded();
  await page.screenshot({path:__OUT + '/l47-task-desktop.png'});
  await page.setViewportSize({width:390,height:1000});
  await page.locator('#l47-branch-data').scrollIntoViewIfNeeded();
  await page.screenshot({path:__OUT + '/l47-task-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('L4.7 content passed: 28 source inputs, source sum reconciliation, six practical tasks, no solution totals, 16 viewport/theme/font states, no progress writes, screenshots');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
