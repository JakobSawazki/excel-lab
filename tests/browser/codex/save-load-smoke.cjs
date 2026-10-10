// Von Codex geschrieben (früher .tmp/save-load-smoke.cjs); von Claude ins Repository übernommen.
// Geändert sind nur Adresse, Playwright-Pfad und Ausgabeordner. Aufruf aus dem
// Projektordner: node tests/browser/codex/save-load-smoke.cjs [Adresse]
const __BASE = (process.argv[2] || process.env.EXCEL_LAB_BASE || 'http://127.0.0.1:4273/').replace(/\/$/, '');
const __OUT = require('node:path').join(require('node:os').tmpdir(), 'excel-lab-tests');
require('node:fs').mkdirSync(__OUT, { recursive: true });
const assert = require('node:assert/strict');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const profile = { id: 'test', name: 'jak.saw', className: 'WGWEK1', progress: { 'l1-1': { completed: true, teacherChecked: true, checks: [true, true, true] } } };
      localStorage.setItem('excelLab.state.v1', JSON.stringify({ version: 1, theme: 'dark', currentProfileId: 'test', profiles: [profile] }));
      localStorage.setItem('excelLab.device.v1', JSON.stringify({ id: 'XL-TESTDEVICE' }));
    });
    await page.goto((__BASE + '/'));
    await page.locator('#profile-button').click();
    assert.deepEqual(await page.locator('.manager-actions button:visible').allTextContents(), ['Speichern', 'Laden']);
    assert.equal(await page.locator('#developer-profile-actions').isVisible(), false);
    assert.equal(await page.locator('#manager-dialog .dialog-hint').count(), 0);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#export-button').click();
    const download = await downloadPromise;
    assert.match(download.suggestedFilename(), /^\d{4}-\d{2}-\d{2}_Excel-Lab_jak\.saw_XL-TESTDEVICE\.json$/);
    const stream = await download.createReadStream();
    let text = ''; for await (const chunk of stream) text += chunk.toString();
    const payload = JSON.parse(text);
    assert.equal(payload.exportedBy.accountName, 'jak.saw');
    assert.equal(payload.device.id, 'XL-TESTDEVICE');
    assert.equal(payload.profile.progress['l1-1'].completed, true);
    await page.evaluate(payload => {
      window.testPayload = payload;
      window.showOpenFilePicker = async options => {
        window.testPickerOptions = options;
        return [{ getFile: async () => new File([JSON.stringify(payload)], 'saved.json', { type: 'application/json' }) }];
      };
    }, payload);
    // Claude, 10.10.2026 (0.18.1): Laden ersetzt dieselbe Person, statt ein weiteres Profil anzulegen.
    const loadedStamp = () => page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId).updatedAt; });
    const stampBeforeFirstLoad = await loadedStamp();
    await page.locator('#import-button').click();
    await page.waitForFunction(stamp => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.length === 1 && state.profiles[0].updatedAt !== stamp; }, stampBeforeFirstLoad);
    const options = await page.evaluate(() => window.testPickerOptions);
    assert.equal(options.startIn, 'downloads');
    assert.equal(options.multiple, false);
    assert.deepEqual(options.types[0].accept, { 'application/json': ['.json'] });
    const before = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
    await page.evaluate(() => { window.showOpenFilePicker = async () => { throw new DOMException('cancelled', 'AbortError'); }; });
    await page.locator('#import-button').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), before);
    await page.evaluate(() => { window.showOpenFilePicker = undefined; });
    const chooserPromise = page.waitForEvent('filechooser');
    await page.locator('#import-button').click();
    const chooser = await chooserPromise;
    assert.equal(await page.locator('#import-file').getAttribute('accept'), 'application/json,.json');
    await chooser.setFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"app":"other"}') });
    await page.getByText('Keine gültige Excel-Lab-Exportdatei.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), before);
    const chooser2Promise = page.waitForEvent('filechooser');
    await page.locator('#import-button').click();
    await (await chooser2Promise).setFiles({ name: 'saved.json', mimeType: 'application/json', buffer: Buffer.from(text) });
    await page.waitForFunction(old => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.length === 1 && JSON.stringify(state) !== old; }, before);
    const original = await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId); });
    await page.locator('#profile-edit-name').fill('max.mus');
    await page.locator('#profile-edit-class').focus();
    await page.locator('#profile-edit-class').fill('WGW EK1');
    await page.locator('#export-button').focus();
    const edited = await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId); });
    assert.equal(edited.id, original.id);
    assert.deepEqual(edited.progress, original.progress);
    assert.equal(edited.name, 'max.mus');
    assert.equal(edited.className, 'WGW EK1');
    await page.locator('#profile-edit-name').fill('invalid');
    await page.locator('#profile-edit-class').focus();
    assert.equal(await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId).name; }), 'max.mus');
    await page.locator('#profile-edit-name').fill('max.mus');
    await page.locator('#profile-edit-class').focus();
    await page.locator('#manager-dialog').screenshot({ path: __OUT + '/save-load-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await page.locator('#manager-dialog').screenshot({ path: __OUT + '/save-load-mobile.png' });
    await page.keyboard.press('Control+Alt+KeyS');
    await page.locator('#developer-mode-button').click();
    assert.equal(await page.locator('#new-profile-button').isVisible(), true);
    assert.equal(await page.locator('#reset-button').isVisible(), true);
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#reset-button').click();
    assert.equal(await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId).progress['l1-1'].completed; }), true);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#reset-button').click();
    assert.deepEqual(await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('excelLab.state.v1')); return state.profiles.find(p => p.id === state.currentProfileId).progress; }), {});
    await page.locator('#developer-mode-button').click();
    assert.equal(await page.locator('#developer-profile-actions').isVisible(), false);
    // Initial profile creation requires both fields and retains official spaces.
    const newcomer = await browser.newPage();
    await newcomer.goto((__BASE + '/'));
    await newcomer.locator('#profile-dialog').waitFor({ state: 'visible' });
    await newcomer.locator('#profile-name-input').fill('jan.mus');
    await newcomer.locator('#profile-form button[type=submit]').click();
    assert.equal(await newcomer.evaluate(() => localStorage.getItem('excelLab.state.v1')), null);
    await newcomer.locator('#profile-class-input').fill('WGW EK1');
    await newcomer.locator('#profile-form button[type=submit]').click();
    assert.equal(await newcomer.evaluate(() => JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].className), 'WGW EK1');
    await newcomer.close();
    assert.deepEqual(errors, []);
    console.log('Save/load passed: labels, download name/payload, Downloads picker options, cancellation, fallback, invalid file, round-trip and mobile width');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
