// Von Codex geschrieben (früher .tmp/options-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/options-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const luminance = hex => { const values = hex.trim().replace('#', '').match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4); return values[0]*.2126+values[1]*.7152+values[2]*.0722; };
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto((__BASE + '/'));
    await page.locator('#profile-dialog').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    const before = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
    await page.locator('#options-button').click();
    const choose = (name, value) => page.locator(`.option-choice:has(input[name="${name}"][value="${value}"])`).click();
    assert.equal(await page.locator('#options-dialog select').count(), 0);
    assert.equal(await page.locator('#options-dialog .options-preview').count(), 0);
    assert.equal(await page.locator('input[name=background]').count(), 5);
    assert.equal(await page.locator('input[name=text]').count(), 5);
    assert.equal(await page.locator('input[name=size]').count(), 3);
    for (const theme of ['dark','light']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      for (const bg of ['standard','green','graphite','violet','sand']) for (const text of ['standard','warm','contrast','mint','lavender']) {
        await choose('background', bg);
        await choose('text', text);
        const colors = await page.evaluate(() => { const css = getComputedStyle(document.documentElement); return ['--bg','--surface','--surface-3','--text','--text-soft'].map(v => css.getPropertyValue(v)); });
        for (const surface of colors.slice(0,3)) for (const foreground of colors.slice(3)) {
          const a = luminance(surface), b = luminance(foreground);
          assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `contrast ${theme}/${bg}/${text}`);
        }
      }
    }
    await choose('size', 'large');
    assert.equal(await page.locator('#options-dialog input:checked').count(), 3);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '18px');
    assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), before);
    await page.locator('#options-dialog').screenshot({ path: __OUT + '/options-desktop.png' });
    await page.keyboard.press('Escape');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `home width ${width}`);
      await page.locator('#options-button').click();
      await page.locator('#options-dialog').screenshot({ path: `${__OUT}/options-mobile-${width}.png` });
      await page.keyboard.press('Escape');
    }
    await page.goto((__BASE + '/l3-3.html'));
    assert.equal(await page.evaluate(() => document.documentElement.dataset.textSize), 'large');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.background), 'sand');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'course width 320');
    await page.locator('#options-button').focus();
    await page.keyboard.press('Enter');
    await page.locator('#options-reset').click();
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '16px');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('excelLab.appearance.v1'))), { background: 'standard', text: 'standard', size: 'normal' });
    await page.locator('input[name=size][value=normal]').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('input[name=size][value=comfortable]').isChecked(), true);
    assert.equal(await page.evaluate(() => document.documentElement.dataset.textSize), 'comfortable');
    await page.locator('#options-reset').click();
    await page.keyboard.press('Escape');
    await page.evaluate(() => localStorage.setItem('excelLab.appearance.v1', '{"background":"bad","text":"bad","size":"bad"}'));
    await page.reload();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.background), 'standard');
    assert.deepEqual(errors, []);
    console.log('Options passed: preset contrast, text size, no profile writes, persistence on course pages, 390/320px, keyboard, reset, invalid settings');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
