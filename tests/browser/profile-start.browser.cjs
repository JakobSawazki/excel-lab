"use strict";
const assert = require("node:assert/strict");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.argv[2] || "http://127.0.0.1:4279/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.goto(base + "index.html");
      await page.locator("#profile-dialog").waitFor({ state: "visible" });
      const button = page.locator('#profile-form button[type="submit"]');
      const tip = page.locator("#profile-start-tip");
      assert.equal(await button.textContent(), "OK");
      assert.equal(await button.getAttribute("aria-describedby"), "profile-start-tip");
      assert.equal(await tip.evaluate(element => getComputedStyle(element).opacity), "0");
      assert.equal(await page.locator("#profile-form .privacy-note").count(), 0);
      await button.hover();
      assert.equal(await tip.evaluate(element => getComputedStyle(element).opacity), "1");
      await page.mouse.move(0, 0);
      await page.locator("#profile-name-input").fill("tes.pro");
      await page.locator("#profile-class-input").fill("WGW EK1");
      await page.keyboard.press("Tab");
      assert.equal(await button.evaluate(element => document.activeElement === element), true);
      assert.equal(await tip.evaluate(element => getComputedStyle(element).opacity), "1");
      await page.keyboard.press("Enter");
      await page.locator("#profile-dialog").waitFor({ state: "hidden" });
      const profile = await page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem("excelLab.state.v1"));
        return state.profiles.find(profile => profile.id === state.currentProfileId);
      });
      assert.equal(profile.name, "tes.pro"); assert.equal(profile.className, "WGW EK1");
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: OK, Tooltip nur bei Hover/Tastaturfokus, Profilanlage unverändert`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
