"use strict";
// Synthetic profiles only; local public assets, no external requests.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const { loadContent } = require("../helpers.cjs");
const lessons = loadContent().lessons;
const base = process.argv[2] || "http://127.0.0.1:4279/";
const KEY = "excelLab.state.v1";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      if (process.argv[4] && Number(process.argv[4]) !== width) continue;
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await context.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      const page = await context.newPage();
      page.setDefaultNavigationTimeout(60000);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      for (const lesson of lessons) {
        if (process.argv[3] && !process.argv[3].split(",").includes(lesson.id)) continue;
        await page.goto(base + lesson.page + "?public-preview=1", { waitUntil: "domcontentloaded" });
        const progress = Object.fromEntries(lessons.filter(item => item.id !== lesson.id).map(item => [item.id, { completed: true }]));
        progress[lesson.id] = { checks: [true, true, true], teacherChecked: true, masteryPassed: true };
        const state = { version: 1, theme: width === 390 ? "light" : "dark", currentProfileId: "reading", profiles: [{
          id: "reading", name: "tes.pro", className: "WGW EK1", progress,
          nagoldEntries: [{ date: "2026-10-19", time: "10:00", purpose: "Mitarbeit", points: 3 }]
        }] };
        await page.evaluate(({ KEY, state }) => localStorage.setItem(KEY, JSON.stringify(state)), { KEY, state });
        await page.reload({ waitUntil: "domcontentloaded" });
        const inputs = page.locator("[data-reading-block]");
        const count = await inputs.count();
        assert.ok(count >= 2, lesson.id);
        const keys = await inputs.evaluateAll(inputs => inputs.map(input => input.dataset.readingBlock));
        assert.equal(new Set(keys).size, count, "unique stable keys");
        assert.equal(await page.locator(".task-section [data-reading-block], .material-section [data-reading-block], .bonus-section [data-reading-block]").count(), 0);
        assert.equal(await page.locator("#page-reading-check").isChecked(), false);
        assert.equal(await page.locator("#page-reading-check").isDisabled(), true);
        if (lesson.id === "l1-2") {
          await page.locator("[data-reading-block]").first().evaluate(input => input.closest("details").querySelector("summary").scrollIntoView({ block: "start" }));
          await page.screenshot({ path: `.tmp/reading-${width}.png` });
        }
        await page.locator("#page-complete-button").click();
        const read = () => page.evaluate(({ KEY, id }) => JSON.parse(localStorage.getItem(KEY)).profiles[0].progress[id], { KEY, id: lesson.id });
        assert.equal(Boolean((await read()).completed), false, "unread blocks prevent completion");
        for (let i = 0; i < count; i++) {
          if (i === 0) {
            await inputs.nth(i).focus();
            await inputs.nth(i).press("Space");
          } else await inputs.nth(i).check();
          assert.equal(await inputs.nth(i).evaluate(input => input.closest("details").open), false, "checked block collapses");
          assert.equal((await read()).reading[keys[i]], true);
          if (i + 1 < count) {
            assert.equal(await inputs.nth(i + 1).evaluate(input => input.closest("details").open), true, "next block opens");
            assert.equal(await inputs.nth(i + 1).evaluate(input => input.closest("details").querySelector("summary") === document.activeElement), true, "keyboard focus follows");
          }
        }
        assert.equal(await page.locator("#page-reading-check").isChecked(), true);
        await page.reload({ waitUntil: "domcontentloaded" });
        assert.equal(await page.locator("#page-reading-check").isChecked(), true, "persists reload");
        await page.locator("#page-complete-button").click();
        assert.equal((await read()).completed, true, "completion with all requirements");
        const nagold = await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).profiles[0].nagoldEntries, KEY);
        await inputs.first().evaluate(input => { input.closest("details").open = true; });
        await inputs.first().uncheck();
        assert.equal((await read()).completed, false, "withdrawal revokes completion");
        assert.equal(await page.locator("#page-reading-check").isChecked(), false);
        assert.deepEqual(await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).profiles[0].nagoldEntries, KEY), nagold, "EP never removed by reading changes");
        // Legacy files retain their achievements, without fabricating a new map on load.
        await page.evaluate(({ KEY, id }) => {
          const state = JSON.parse(localStorage.getItem(KEY));
          state.profiles[0].progress[id].completed = true;
          delete state.profiles[0].progress[id].reading;
          localStorage.setItem(KEY, JSON.stringify(state));
        }, { KEY, id: lesson.id });
        await page.reload({ waitUntil: "domcontentloaded" });
        assert.equal(await page.locator("#page-reading-check").isChecked(), true, "legacy completed grandfathered");
        assert.equal((await read()).completed, true);
        // Failed persistence must not show a confirmed/collapsed block.
        await inputs.first().evaluate(input => { input.closest("details").open = true; });
        await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); }; });
        await inputs.first().click();
        assert.equal(await inputs.first().isChecked(), true, "failed write rolls UI back");
        assert.equal((await read()).completed, true);
        assert.equal(await inputs.first().evaluate(input => input.closest("details").open), true);
        await page.reload({ waitUntil: "domcontentloaded" });
        // Profile changes must not leak confirmations.
        await page.evaluate(KEY => {
          const state = JSON.parse(localStorage.getItem(KEY));
          state.profiles.push({ id: "other", name: "oth.pro", className: "WGW EK1", progress: {} });
          state.currentProfileId = "other";
          localStorage.setItem(KEY, JSON.stringify(state));
          dispatchEvent(new StorageEvent("storage", { key: KEY }));
        }, KEY);
        assert.equal(await inputs.evaluateAll(inputs => inputs.filter(input => input.checked).length), 0);
        assert.equal(await page.locator("#page-reading-check").isChecked(), false);
        const beforeDev = await page.evaluate(KEY => localStorage.getItem(KEY), KEY);
        await page.evaluate(() => { window.EXCEL_LAB_DEV = { enabled: true }; dispatchEvent(new Event("excel-lab-dev-change")); });
        assert.equal(await inputs.first().isDisabled(), true, "developer preview is read-only");
        assert.equal(await page.evaluate(KEY => localStorage.getItem(KEY), KEY), beforeDev);
        assert.deepEqual(errors, []);
        console.log(`${lesson.id} / ${width}: ${count} reading blocks passed`);
      }
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
