// Von Codex geschrieben (früher .tmp/release-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/release-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = (__BASE + '/');
(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const pages = fs.readdirSync('.').filter(name => /^(index|l\d-\d)\.html$/.test(name));
    const assets = new Set();
    for (const name of pages) {
      const response = await page.goto(new URL(name + '?public-preview=1', base).href);
      assert.equal(response.status(), 200, name);
      const found = await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel=stylesheet][href],img[src]')].map(el => el.src || el.href));
      found.filter(url => url.startsWith(base)).forEach(url => assets.add(url));
      assert.equal(await page.locator('a[href*="materialien/BPE1/"]').count(), 0, name + ': private material link');
    }
    for (const url of assets) {
      const response = await page.request.get(url);
      assert.equal(response.status(), 200, url);
    }
    const version = fs.readFileSync('app.js', 'utf8').match(/APP_VERSION = "([^"]+)"/)[1];
    const script = await page.request.get(new URL('app.js?release=' + version, base).href);
    assert.ok((await script.text()).includes('APP_VERSION = "' + version + '"'));
    assert.deepEqual(errors, []);
    console.log(`Release passed: ${pages.length} pages, ${assets.size} assets, public material links, version ${version}, no browser errors (${base})`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
