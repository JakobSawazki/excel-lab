// Von Codex geschrieben (früher .tmp/l15-l16-practice-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l15-l16-practice-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(!route.request().url().startsWith(base)){external.push(route.request().url());return route.abort();}return route.continue();});
  for(const id of [5,6]){
   await page.goto(base+`l1-${id}.html?public-preview=1`);
   await page.evaluate(id=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{['l1-'+(id-1)]:{completed:true}}}]})),id);
   await page.reload();
   const before=await page.evaluate(()=>localStorage.getItem('excelLab.state.v1'));
   const selectors=id===5?['#l15-transfer-task']:['#l16-package-help','#l16-package-tests','#l16-model-tests'];
   await page.evaluate(()=>document.querySelectorAll('.lesson-disclosure').forEach(d=>d.open=true));
   for(const selector of selectors){
    const section=page.locator(selector);await section.locator('summary').first().focus();await page.keyboard.press('Enter');
    assert.equal(await section.getAttribute('open'),'');
    assert.ok(await section.isVisible());
    assert.ok(await section.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('[id$="mastery-section"]'))&Node.DOCUMENT_POSITION_FOLLOWING)));
   }
   const text=await page.locator(id===5?'#l15-transfer-task':'#l16-package-help').innerText();
   const terms=id===5?['Testkopie.xlsx','Testperson 6','keine echten','4,00 €','10 auf 12','4 auf 5','sechste Zeile','ersetzt sie aber nicht','öffne nur die Testkopie']:['36 Hüllen','10 Hüllen','2 €','=MAX(0;C2-C3)','=AUFRUNDEN(C7/C4;0)','größer als null','nichtnegative','keine Lösung','jeweiligen Einzelpreise','genau einmal','Microsoft: MAX','Microsoft: AUFRUNDEN'];
   for(const term of terms)assert.ok(text.includes(term),id+': '+term);
   if(id===6){
    for(const target of ['l16-time-backcheck','l16-volume-backcheck','l16-interest-backcheck','l16-cinema-backcheck','l16-view-consistency']){
     const help=page.locator('#'+target);await help.locator('summary').focus();await page.keyboard.press('Enter');
     assert.equal(await help.getAttribute('open'),'');assert.ok(await help.isVisible());
    }
    const hints=await page.locator('.l16-source-check').allInnerTexts();
    assert.equal(hints.length,5);
    const hintText=hints.join(' ');
    for(const term of ['Zehnergruppen','nur einmal','Volumen je Dose','gespeicherten Zellwerte','Zinssatz','Tage','Kapital','ungerundeten','verdoppelt','sieben Besucherzahlen','passenden Preisen','nicht automatisch','beiden Blättern','denselben korrigierten Aufgabenstand'])assert.ok(hintText.includes(term),term);
    for(const solution of ['105 Minuten','40.000','60.000','160.000','125,00','90 Tage','8.662,50','Kontrollwerte aus dem Ausgangsmaterial'])assert.ok(!hintText.includes(solution),'solution exposed: '+solution);
    const tests=await page.locator('#l16-package-tests').innerText();
    for(const term of ['0 MB','200 MB','300 MB','301 MB','400 MB','401 MB','500 MB, 200 Minuten und 120 SMS','Formelkorrekturen'])assert.ok(tests.includes(term),term);
    assert.equal(await page.locator('#l16-package-help a').count(),2);
    const models=await page.locator('#l16-model-tests').innerText();
    for(const term of ['45 auf 46','50 auf 60','20.000 auf 10.000','2.500 auf 5.000','Vorhersage','drei anderen, unabhängigen','Überschreibe nicht'])assert.ok(models.includes(term),term);
   }
   for(const width of [320,390,760,1440])for(const theme of ['dark','light'])for(const size of ['normal','large']){
    await page.setViewportSize({width,height:1100});
    await page.evaluate(({theme,size})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.textSize=size;},{theme,size});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}/${width}/${theme}/${size}`);
   }
   await page.setViewportSize({width:390,height:1100});await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.textSize='normal';});
   await page.evaluate(target=>{document.activeElement?.blur();scrollTo({top:document.querySelector(target).getBoundingClientRect().top+scrollY-40,behavior:'instant'});},id===6?'#l16-view-consistency':selectors[0]);await page.waitForTimeout(250);await page.screenshot({path:`${__OUT}/l1${id}-practice-mobile.png`});
   await page.setViewportSize({width:1440,height:1100});await page.evaluate(target=>scrollTo({top:document.querySelector(target).getBoundingClientRect().top+scrollY-150,behavior:'instant'}),id===6?'#l16-cinema-backcheck':selectors[0]);await page.waitForTimeout(250);await page.screenshot({path:`${__OUT}/l1${id}-practice-desktop.png`});
   assert.equal(await page.evaluate(()=>localStorage.getItem('excelLab.state.v1')),before);
   assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(),0);
  }
  // Independent mathematical checks, not execution of a student's Excel file.
  for(const inclusive of [200,300])for(const need of [0,200,300,301,400,401,500]){
   const formula=Math.ceil(Math.max(0,need-inclusive)/100);
   let purchased=0;while(inclusive+purchased*100<need)purchased++;
   assert.equal(formula,purchased);
  }
  assert.equal(Math.ceil(Math.max(0,36-10)/10),3);
  const totalTime=30+50/10*15;assert.equal((totalTime-30)/15*10,50);
  for(const volume of [0.5,1/3,0.125])assert.ok(Math.abs((20000/volume)*volume-20000)<1e-8);
  const interest=(capital,days,rate)=>capital*days*rate/36000;
  for(const [capital,days,rate,expected] of [[34567,180,1728.35*36000/(34567*180),1728.35],[21345,426.90*36000/(21345*8),8,426.90],[231*36000/(120*8),120,8,231]])assert.ok(Math.abs(interest(capital,days,rate)-expected)<1e-8);
  assert.equal(interest(5000,180,10),2*interest(2500,180,10));
  const cinemaVisitors=[[45,52,33,85,63,68,74],[15,28,25,109,59,71,88],[38,42,35,135,76,99,109]],cinemaPrices=[8,12,10];
  const cinemaByHall=cinemaVisitors.reduce((total,days,hall)=>total+days.reduce((a,b)=>a+b,0)*cinemaPrices[hall],0);
  const cinemaByDay=Array.from({length:7},(_,day)=>cinemaVisitors.reduce((total,days,hall)=>total+days[day]*cinemaPrices[hall],0));
  assert.equal(cinemaByHall,cinemaByDay.reduce((a,b)=>a+b,0));
  cinemaVisitors[0][0]++;
  const changedMonday=cinemaVisitors.reduce((total,days,hall)=>total+days[0]*cinemaPrices[hall],0);
  assert.equal(changedMonday-cinemaByDay[0],8);
  cinemaVisitors[0][0]--;
  const payments=[10,0,5,10,3,4];const sum=a=>a.reduce((x,y)=>x+y,0);
  const open=payments.map(p=>10-p);assert.equal(6*10-sum(payments),sum(open));
  const raised=payments.map(p=>12-p);assert.equal(sum(raised)-sum(open),12);
  const paidMore=[...payments];paidMore[5]++;assert.equal(sum(paidMore.map(p=>10-p))-sum(open),-1);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('L1.5/L1.6 practice passed: copy/privacy/restoration instructions, progressive helper and boundary tests, keyboard/order, 32 layout states, independent arithmetic, public fallback, no progress writes or external requests');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
