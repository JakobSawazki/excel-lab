// Von Codex geschrieben (früher .tmp/l32-file-plan-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/l32-file-plan-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = (__BASE + '/');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', r => {
      if (r.request().url().startsWith(base)) return r.continue();
      external.push(r.request().url()); return r.abort();
    });
    assert.equal((await page.goto(base + 'l3-2.html?public-preview=1')).status(), 200);
    await page.evaluate(() => localStorage.setItem('excelLab.state.v1', JSON.stringify({ version: 1, theme: 'dark', currentProfileId: 'test', profiles: [{ id: 'test', name: 'tes.pro', className: 'WGW EK1', progress: { 'l3-1': { completed: true } } }] })));
    await page.reload();
    const state = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
    await page.locator('.lesson-disclosure').evaluateAll(els => els.forEach(el => el.open = true));
    const detail = page.locator('#l32-file-plan');
    await detail.locator('summary').focus(); await page.keyboard.press('Enter');
    assert.equal(await detail.evaluate(el => el.open), true);
    const text = await detail.innerText();
    for (const phrase of ['Speichern unter', 'bevor du Zellen änderst', 'automatisch', 'L3_1.1.2', 'L3_1.1.3', 'L3_1.1.4', 'Blattkopie', 'Zwei-Gruppen-Entscheidung', 'drei Tarifgruppen', 'Preisformeln', 'erneut öffnen', 'überschrieben', 'Testkopie']) assert.ok(text.includes(phrase), phrase);
    assert.ok(await detail.evaluate(el => !!(el.compareDocumentPosition(document.querySelector('#l32-task-heading').closest('details').querySelector('h3')) & Node.DOCUMENT_POSITION_FOLLOWING)));
    for (const width of [320, 390, 760, 1440]) for (const theme of ['dark', 'light']) for (const size of ['normal', 'large']) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(({theme, size}) => { document.documentElement.dataset.theme = theme; document.documentElement.dataset.textSize = size; }, {theme, size});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}/${theme}/${size}`);
    }
    assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), state);
    assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(), 0);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.documentElement.dataset.textSize = 'normal'; document.activeElement?.blur(); });
    await detail.screenshot({ path: __OUT + '/l32-file-plan.png' });
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    console.log('L3.2 file plan passed: keyboard, stage-specific file checks, 16 layouts, unchanged progress, no private links/external requests/browser errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
