// Von Codex geschrieben (früher .tmp/l48-content-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l48-content-smoke.cjs [Adresse]
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
def num(s): return float(s.replace(',','.').strip())
def transposed(name):
 t=Document(root/name).tables[0]
 return [[num(t.rows[0].cells[i].text),num(t.rows[1].cells[i].text)] for i in range(1,7)]
t=Document(root/'L4_2.5 Vertiefungsaufgabe 5 Urlaubsfahrt.docx').tables[0]
print(json.dumps({'motion':transposed('L4_2.3 Vertiefungsaufgabe 3 gleichförmige Bewegung.docx'),'fall':transposed('L4_2.4 Vertiefungsaufgabe 4 freier Fall.docx'),'travel':[[num(c.text) for c in r.cells] for r in t.rows[1:]]}))`],{encoding:'utf8'}));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((__BASE + '/l4-8.html'));
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{'l4-7':{completed:true}}}]})));
  await page.reload();
  const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
  await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
  for(const key of ['motion','fall','travel']){
   const actual=await page.locator('#l48-'+key+'-data tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>Number(c.textContent.replace(',','.')))));
   assert.deepEqual(actual,source[key]);
  }
  const text=await page.locator('.lesson-article').innerText();
  for(const formula of ['=(B7-B2)/(A7-A2)','=SUMME($A$2:A2)','=SUMME($B$2:B2)','=STEIGUNG(C2:C11;D2:D11)','=ACHSENABSCHNITT(C2:C11;D2:D11)','=(J2-H2)/G2','=C11/D11*60'])assert.ok(text.includes(formula),formula);
  assert.match(text,/kein.*eigenen Versuch/s);
  assert.match(text,/weitreichende Extrapolation/);
  assert.match(text,/keine Uhrzeit/);
  assert.match(text,/ungewichteter Mittelwert/);
  assert.equal(source.travel.reduce((sum,r)=>sum+r[0],0),234);
  assert.equal(source.travel.reduce((sum,r)=>sum+r[1],0),130);
  assert.doesNotMatch(text,/234|130/); // The exercise does not publish calculated totals.
  const points=[[1,1],[2,4],[3,9]];
  const sumX=points.reduce((s,p)=>s+p[0],0),sumY=points.reduce((s,p)=>s+p[1],0);
  const slope=(3*points.reduce((s,p)=>s+p[0]*p[1],0)-sumX*sumY)/(3*points.reduce((s,p)=>s+p[0]**2,0)-sumX**2);
  const intercept=(sumY-slope*sumX)/3;
  const meanY=sumY/3;
  const r2=1-points.reduce((s,p)=>s+(p[1]-slope*p[0]-intercept)**2,0)/points.reduce((s,p)=>s+(p[1]-meanY)**2,0);
  assert.ok(Math.abs(r2-48/49)<1e-12);
  for(const model of ['linear','quadratic']){
   await page.locator(`[data-l48-model=${model}]`).click();
   assert.equal(await page.locator(`[data-l48-model=${model}]`).getAttribute('aria-pressed'),'true');
   for(let x=1;x<=8;x++){
    await page.locator('#l48-predict-x').evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}));},x);
    const expected=model==='linear'?slope*x+intercept:x*x;
    const dot=page.locator('#l48-prediction');
    assert.ok(Math.abs(Number(await dot.getAttribute('data-value'))-expected)<1e-12);
    assert.ok(Math.abs(Number(await dot.getAttribute('cx'))-(70+x/8*460))<1e-10);
    assert.ok(Math.abs(Number(await dot.getAttribute('cy'))-(310-expected/70*280))<1e-10);
    const result=await page.locator('#l48-model-output').innerText();
    assert.ok(result.includes(x<=3?'innerhalb':'Extrapolation'));
    assert.match(await page.locator('#l48-chart-description').textContent(),/keine Prognosegarantie/);
   }
  }
  await page.locator('#l48-demo-reset').click();
  assert.equal(await page.locator('#l48-predict-x').inputValue(),'6');
  assert.equal(await page.locator('[data-l48-model=linear]').getAttribute('aria-pressed'),'true');
  await page.locator('#l48-predict-x').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#l48-predict-x').inputValue(),'7');
  await page.locator('[data-l48-model=quadratic]').focus();await page.keyboard.press('Space');
  assert.equal(await page.locator('[data-l48-model=quadratic]').getAttribute('aria-pressed'),'true');
  for(const theme of ['dark','light'])for(const size of ['normal','large'])for(const width of [320,390,760,1440]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme}/${size}/${width}`);
   const good=await page.locator('#l48-chart text').evaluateAll(els=>els.every(el=>{const b=el.getBBox(),m=el.ownerSVGElement.getCTM().inverse().multiply(el.getCTM());return [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].every(([x,y])=>{const p=new DOMPoint(x,y).matrixTransform(m);return p.x>=0&&p.y>=0&&p.x<=560&&p.y<=400;});}));
   assert.ok(good,'chart label bounds');
   const chartBox=await page.locator('#l48-chart').boundingBox();
   assert.ok(Math.abs(chartBox.height/chartBox.width-400/560)<.001,'chart must retain its aspect ratio, not inherit icon height');
   assert.notEqual(await page.locator('.l48-model').first().evaluate(el=>getComputedStyle(el).stroke),'none');
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
  await page.locator('#l48-demo-reset').click();
  await page.locator('.l48-demo').screenshot({path:__OUT + '/l48-demo-desktop.png',style:'.site-header {visibility:hidden!important}'});
  await page.setViewportSize({width:390,height:1000});
  await page.locator('#l48-travel-data').scrollIntoViewIfNeeded();
  await page.screenshot({path:__OUT + '/l48-task-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('L4.8 content passed: 44 source inputs, formulas/units, 16 model/slider states vs independent OLS, keyboard/reset, 16 viewport/theme/font states, SVG bounds, no progress writes');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
