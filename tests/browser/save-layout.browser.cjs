"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.argv[2] || "http://127.0.0.1:4279/";
const profile = { id: "layout", name: "tes.pro", className: "WGW EK1", progress: { "l1-1": { completed: true } }, nagoldEntries: [{ date: "2026-10-19", purpose: "Mitarbeit", points: 3 }] };
const initial = JSON.stringify({ version: 1, theme: "dark", currentProfileId: profile.id, profiles: [profile] });
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [width, height, font] of [[1280, 720, 16], [1024, 600, 18], [390, 844, 16], [360, 640, 18], [360, 400, 16]]) {
      for (const file of ["index.html", "l1-1.html"]) {
        const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
        const page = await context.newPage(), errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        await context.addInitScript(raw => {
          localStorage.setItem("excelLab.state.v1", raw);
          localStorage.setItem("excelLab.importBackup.v1", raw);
          localStorage.setItem("excelLab.state.rescue.v1", raw);
        }, initial);
        await page.goto(base + file);
        await page.evaluate(font => {
          document.documentElement.style.fontSize = `${font}px`;
          const state = JSON.parse(localStorage.getItem("excelLab.state.v1"));
          for (let i = 0; i < 5; i++) {
            const payload = window.ExcelLabSave.buildPayload(state.profiles[0], "0.32.0");
            window.ExcelLabSave.remember(payload, `test-${i}.json`);
          }
        }, font);
        await page.locator("#save-button").click();
        const dialog = page.locator("#save-dialog");
        assert.equal(await page.locator("#recent-saves option").count(), 5);
        for (const id of ["export-button", "import-button", "recent-load", "upgrade-save-button", "import-backup-button"]) {
          const button = page.locator(`#${id}`);
          assert.equal(await button.isVisible(), true);
          assert.equal(await button.locator("svg").count(), 1, `${id}: passendes Icon`);
        }
        await page.locator("#upgrade-save-button").hover();
        assert.equal(await page.locator("#upgrade-save-button-tip").evaluate(element => getComputedStyle(element).opacity), "1");
        await page.mouse.move(0, 0);
        await page.locator("#recent-load").focus(); await page.keyboard.press("Tab");
        assert.equal(await page.locator("#upgrade-save-button").evaluate(element => document.activeElement === element), true);
        assert.equal(await page.locator("#upgrade-save-button-tip").evaluate(element => getComputedStyle(element).opacity), "1");
        await page.evaluate(() => document.activeElement?.blur());
        const payload = await page.evaluate(() => window.ExcelLabSave.buildPayload(JSON.parse(localStorage.getItem("excelLab.state.v1")).profiles[0], "0.32.0"));
        const [download] = await Promise.all([page.waitForEvent("download"), page.setInputFiles("#upgrade-save-file", { name: "test.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) })]);
        assert.match(download.suggestedFilename(), /_aktualisiert\.json$/);
        const metrics = await dialog.evaluate(element => ({ scroll: element.scrollHeight, client: element.clientHeight, content: [...element.querySelector('.dialog-content').children].filter(item => getComputedStyle(item).display !== 'none').map(item => [item.id || item.className, Math.round(item.getBoundingClientRect().height)]) }));
        if (height >= 600) assert.ok(metrics.scroll <= metrics.client + 1, `${file} ${width}×${height}/${font}: ohne Scrollbar ${JSON.stringify(metrics)}`);
        else {
          assert.equal(await dialog.evaluate(element => getComputedStyle(element).overflowY), "auto", "auf extrem kleinen Fenstern nichts abschneiden");
          await dialog.evaluate(element => { element.scrollTop = element.scrollHeight; });
          assert.ok(await dialog.evaluate(element => element.scrollTop > 0));
        }
        const box = await dialog.boundingBox();
        assert.ok(box.y >= 0 && box.y + box.height <= height + 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
        if (file === "l1-1.html" && (width === 1280 || width === 360)) {
          fs.mkdirSync(path.resolve(__dirname, "../../.tmp"), { recursive: true });
          await page.screenshot({ path: path.resolve(__dirname, `../../.tmp/save-layout-${width}.png`) });
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${file} ${width}×${height}, Schrift ${font}: ${height >= 600 ? "ohne Scrollbar" : "sicherer Scroll-Fallback"}, alle Funktionen zugänglich`);
        await context.close();
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
