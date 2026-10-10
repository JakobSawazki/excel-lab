// Von Codex geschrieben (früher .tmp/l1-path-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l1-path-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto((__BASE + '/l1-1.html'));
  await page.evaluate(()=>localStorage.setItem('excelLab.state.v1',JSON.stringify({version:1,theme:'dark',currentProfileId:'test',profiles:[{id:'test',name:'tes.pro',className:'WGW EK1',progress:{}}]})));
  await page.reload();
  const answers=[{structure:'b',numbers:'c',save:'a'},{refs:'b',recalc:'c',circle:'a'},{display:'b',units:'c',formula:'a'},{shift:'b',dynamic:'c',sum:'a'},{structure:'b',central:'c',phone:'a'},{revenue:'b',time:'c',volume:'a',interest:'b',package:'c'}];
  for(let i=1;i<=6;i++){
   const form=page.locator(`#l1${i}-mastery-form`);
   await page.locator(`#l1${i}-mastery-section summary`).click();
   for(const [name,value]of Object.entries(answers[i-1]))await form.locator(`input[name=${name}][value=${value}]`).check();
   await form.locator('button[type=submit]').click();
   for(let j=0;j<3;j++)await page.locator(`[data-page-check="${j}"]`).check();
   await page.locator('#page-teacher-check').check();await page.locator('#page-complete-button').click();
   const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].progress);
   assert.equal(Object.values(progress).filter(p=>p.completed).length,i);
   await page.waitForFunction(points=>document.querySelector('#xp-button').textContent.includes(String(points)),i*100);
   assert.equal(await page.locator('#next-lesson-link').getAttribute('aria-disabled'),'false');
   await page.locator('#next-lesson-link').click();await page.waitForURL(`**/${i===6?'l2-1':'l1-'+(i+1)}.html`);
  }
  assert.equal(await page.locator('#l21-content').isVisible(),true);
  assert.deepEqual(errors,[]);console.log('Full L1 path passed: six quizzes, six teacher/work gates, direct successor links, 600 XP and L2.1 unlocked');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
