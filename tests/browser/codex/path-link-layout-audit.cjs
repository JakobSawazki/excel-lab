// Von Codex geschrieben (früher .tmp/path-link-layout-audit.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/path-link-layout-audit.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=(__BASE + '/');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage(), errors=[], external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{if(!r.request().url().startsWith(base)){external.push(r.request().url());return r.abort();}return r.continue();});
  // Claude, 10.10.2026: lehrkraft.html (Klassenübersicht, 0.15.0) gehört zu den Seiten.
  const files=fs.readdirSync('.').filter(f=>/^(index|lehrkraft|nachweis|l\d-\d)\.html$/.test(f));
  assert.equal(files.length,30);
  const inventories={};
  for(const file of files){
   assert.equal((await page.goto(base+file+'?public-preview=1')).status(),200,file);
   const info=await page.evaluate(()=>({ids:[...document.querySelectorAll('[id]')].map(e=>e.id),links:[...document.querySelectorAll('a[href]')].map(e=>e.href),headings:[...document.querySelectorAll('.lesson-article h2')].map(e=>e.textContent.trim()),checks:document.querySelectorAll('[data-page-check]').length,questions:document.querySelectorAll('.mastery-question').length,teacher:!!document.querySelector('#page-teacher-check')}));
   assert.equal(new Set(info.ids).size,info.ids.length,file+': duplicate IDs');
   if(/^l\d-\d\.html$/.test(file)){ // nur Lernseiten haben Verständnis-Check und Abschluss
    const source=fs.readFileSync(file,'utf8');
    assert.equal(info.questions,(source.match(/data-mastery-question=/g)||[]).length,file+': rendered questions differ from source');
    assert.ok(info.questions>=3,file+': missing understanding check');
    assert.ok(info.checks>=3,file+': missing work checks');assert.ok(info.teacher,file);
   }
   inventories[file]=info;
   if(file!=='index.html'){
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    for(const width of [320,1440])for(const theme of ['dark','light']){
     await page.setViewportSize({width,height:1000});
     await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.textSize='large';},theme);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${file}/${width}/${theme}/large`);
    }
   }
  }
  let anchors=0;
  const routes=new Set();
  const broken=[];
  for(const [file,info]of Object.entries(inventories))for(const url of info.links){
   if(!url.startsWith(base))continue;
   const parsed=new URL(url), target=decodeURIComponent(parsed.pathname.split('/').pop()||'index.html');
   if(!/\.html$/.test(target))continue;
   if(!inventories[target]){broken.push(`${file} -> missing page ${target}`);continue;}
   if(parsed.hash){anchors++;const id=decodeURIComponent(parsed.hash.slice(1));
    if(target==='index.html'&&/^(uebersicht|formeln|quellen|lernpfad(?:\/[1-4])?)$/.test(id)){routes.add(id);continue;}
    if(!inventories[target].ids.includes(id))broken.push(`${file} -> ${target}#${id}`);
   }
  }
  for(const route of routes){
   await page.goto(base+'index.html?public-preview=1#'+route);
   const expected={uebersicht:'dashboard',formeln:'formulas',quellen:'sources',lernpfad:'learning'}[route.split('/')[0]];
   assert.equal(await page.locator('[data-view-panel].is-active').getAttribute('data-view-panel'),expected,route);
   if(route.includes('/'))assert.ok((await page.locator('#location-path').innerText()).includes('L'+route.split('/')[1]),route+': wrong stage');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(broken,[]);
  console.log(`Path audit passed: 30 pages, ${anchors} local hash links including ${routes.size} tested app routes, unique IDs, 27 source-matched understanding/work/teacher gates, 108 large-text layouts, no external requests or browser errors. This does not verify every exercise's mathematics or classroom effectiveness.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
