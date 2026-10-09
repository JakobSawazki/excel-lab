"use strict";

// Abschlusswege aller 27 Lernseiten im echten Browser (Edge über Playwright):
// Zugang, Verständnis-Check, eigene Checks, Lehrkraftbestätigung, Punkte,
// Rücknahme, ältere Abschlüsse, Profilwechsel, Speicherfehler, Entwickler-Vorschau.
// Aus Codex' lokalem Audit übernommen (früher .tmp/all-lessons-gate-audit.cjs).
//
// Aufruf: node tests/browser/lesson-gates.browser.cjs http://127.0.0.1:4273/ [all|profile] [l1-1,l2-3]
// Playwright wird nicht installiert; der Pfad kommt aus EXCEL_LAB_PLAYWRIGHT
// oder aus der Codex-Laufzeit dieses Rechners.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || 'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..', '..');
const base = process.argv[2] || 'http://127.0.0.1:4273/';
const mode = process.argv[3] || 'all';
const files = fs.readdirSync(root).filter(f => /^l\d-\d\.js$/.test(f)).sort();
// Read only the literal answer map, never execute repository text as code.
const lessons = files.map(file => {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const literal = source.match(/const masteryAnswers = \{([^}]+)\}/)?.[1];
  assert.ok(literal, file);
  const answers = Object.fromEntries([...literal.matchAll(/(\w+):\s*"([abc])"/g)].map(m => [m[1], m[2]]));
  assert.ok(Object.keys(answers).length >= 3, file);
  return { id: file.slice(0, -3), prefix: file.slice(0, -3).replace('-', ''), answers };
});
assert.equal(lessons.length, 27);
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const failures = [];
  let questions = 0;
  let audited = 0;
  try {
    for (const [index, lesson] of lessons.entries()) {
      if (process.argv[4] && !process.argv[4].split(',').includes(lesson.id)) continue;
      audited++;
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [], external = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route('**/*', r => {
        if (!r.request().url().startsWith(base)) { external.push(r.request().url()); return r.abort(); }
        return r.continue();
      });
      const prior = index ? { [lessons[index - 1].id]: { completed: true } } : {};
      const form = page.locator(`#${lesson.prefix}-mastery-form`);
      const seed = async progress => {
        await page.evaluate(progress => localStorage.setItem('excelLab.state.v1', JSON.stringify({ version: 1, theme: 'dark', currentProfileId: 'audit', profiles: [{ id: 'audit', name: 'tes.pro', className: 'WGW EK1', progress }] })), progress);
        await page.reload();
        await page.waitForFunction(() => document.querySelector('#lesson-profile-name').textContent.includes('tes.pro'));
      };
      const read = () => page.evaluate(id => JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].progress[id] || {}, lesson.id);
      const complete = () => page.locator('#page-complete-button').click();
      const openQuiz = () => page.evaluate(prefix => { document.getElementById(prefix + '-mastery-section').open = true; }, lesson.prefix);
      const answer = async correct => {
        for (const [name, value] of Object.entries(lesson.answers)) await form.locator(`input[name="${name}"][value="${correct ? value : value === 'a' ? 'b' : 'a'}"]`).check();
      };
      const submit = () => form.locator('button[type=submit]').click();
      try {
        await page.goto(base + lesson.id + '.html?public-preview=1');
        if (mode === 'all' && index > 0) {
          await seed({});
          assert.equal(await page.locator(`#${lesson.prefix}-content`).isVisible(), false, 'missing prerequisite');
          assert.equal(await page.locator('#next-lesson-link').getAttribute('aria-disabled'), 'true');
        }
        await seed(prior);
        await openQuiz();
        questions += Object.keys(lesson.answers).length;
        if (mode === 'all') {
          await submit();
          assert.equal((await read()).masteryPassed || false, false, 'empty quiz');
          assert.equal(await form.locator('[data-result=incorrect]').count(), Object.keys(lesson.answers).length);
          await answer(false); await submit();
          assert.equal((await read()).masteryPassed || false, false, 'wrong quiz');
          await answer(true); await submit();
          assert.equal((await read()).masteryPassed, true, 'correct quiz');
          assert.equal((await read()).completed, false, 'quiz alone must not complete');
          await complete(); assert.equal((await read()).completed, false, 'work checks missing');
          for (const input of await page.locator('[data-page-check]').all()) await input.check();
          await complete(); assert.equal((await read()).completed, false, 'teacher confirmation missing');
          await page.locator('#page-teacher-check').check();
          await complete(); assert.equal((await read()).completed, true);
          assert.match(await page.locator('#lesson-points-status').innerText(), /100 von 100/);
          assert.equal(await page.locator('#next-lesson-link').getAttribute('aria-disabled'), 'false');
          await page.reload(); assert.equal((await read()).completed, true, 'completion persists');
          await page.waitForFunction(() => document.querySelector('[data-page-check="0"]').checked);
          await page.locator('[data-page-check="0"]').uncheck();
          await page.waitForFunction(id => !JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[0].progress[id].completed, lesson.id);
          assert.equal((await read()).completed, false, 'missing work revokes completion');
          assert.equal(await page.locator('#next-lesson-link').getAttribute('aria-disabled'), 'true');
          await page.locator('[data-page-check="0"]').check();
          await complete();
          await page.locator('#page-teacher-check').uncheck();
          assert.equal((await read()).completed, false, 'withdrawn teacher confirmation');
          await seed({ ...prior, [lesson.id]: { completed: true, teacherChecked: true, checks: [true, true, true] } });
          assert.match(await page.locator(`#${lesson.prefix}-mastery-status`).textContent(), /bestanden/, 'legacy completion remains valid');
          await seed(prior); await openQuiz(); await answer(true);
        } else {
          await answer(true);
        }
        await page.evaluate(() => dispatchEvent(new StorageEvent('storage', { key: 'excelLab.state.v1' })));
        assert.equal(await form.locator('input:checked').count(), Object.keys(lesson.answers).length, 'same-profile notification erased answers');
        // A real other-tab write emits a storage notification. Old answers must disappear.
        const other = await context.newPage();
        await other.goto(base + 'index.html?public-preview=1');
        await other.evaluate(prior => {
          const state = JSON.parse(localStorage.getItem('excelLab.state.v1'));
          state.currentProfileId = 'other';
          state.profiles.push({ id: 'other', name: 'oth.pro', className: 'WGW EK1', progress: prior });
          localStorage.setItem('excelLab.state.v1', JSON.stringify(state));
        }, prior);
        await page.waitForFunction(() => document.querySelector('#lesson-profile-name').textContent.includes('oth.pro'));
        assert.equal(await form.locator('input:checked').count(), 0, 'profile switch retained old quiz answers');
        assert.equal(await form.locator('[data-result]').count(), 0, 'profile switch retained grading marks');
        assert.ok((await form.locator('.mastery-feedback').allTextContents()).every(text => text === ''), 'profile switch retained feedback');
        await submit();
        assert.equal(await page.evaluate(id => Boolean(JSON.parse(localStorage.getItem('excelLab.state.v1')).profiles[1].progress[id]?.masteryPassed), lesson.id), false, 'other profile received stale pass');
        if (mode === 'all') {
          await seed(prior); await openQuiz(); await answer(true);
          await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('Blocked', 'SecurityError'); }; });
          await submit(); assert.equal((await read()).masteryPassed || false, false, 'failed storage write');
          assert.doesNotMatch(await page.locator(`#${lesson.prefix}-mastery-status`).textContent(), /^Verständnis-Check bestanden/);
          await page.reload();
          const before = await page.evaluate(() => localStorage.getItem('excelLab.state.v1'));
          await page.evaluate(() => { window.EXCEL_LAB_DEV = { enabled: true }; dispatchEvent(new Event('excel-lab-dev-change')); });
          assert.equal(await page.locator('#page-complete-button').isDisabled(), true);
          assert.equal(await page.evaluate(() => localStorage.getItem('excelLab.state.v1')), before, 'developer preview changed progress');
        }
        assert.deepEqual(errors, []); assert.deepEqual(external, []);
        console.log(`${lesson.id}: ${mode} passed`);
      } catch (e) { failures.push(`${lesson.id}: ${e.message}`); console.log(`${lesson.id}: FAILED ${e.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
  assert.deepEqual(failures, []);
  console.log(`${audited} lessons / ${questions} questions: ${mode} audit passed. Browser gates only; not proof of Excel execution or learning effectiveness.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
