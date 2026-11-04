"use strict";
// Isolated synthetic profiles; all requests fulfilled from public local assets.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = path.resolve(__dirname, "../..");
const allowed = new Set(execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0")
  .filter(name => !name.startsWith("materialien/")));
allowed.add("about.js");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2" };
const KEY = "excelLab.state.v1";
const publicBase = process.argv[2] ? new URL(process.argv[2]) : null;
const entries = [{ date: "2026-10-19", time: "10:00", purpose: "Mitarbeit", points: 5 }, { date: "2026-10-19", time: "10:05", purpose: "Korrektur", points: -2 }];
const profile = { id: "ep-test", name: "tes.pro", className: "WGW EK1", progress: { "l1-1": { completed: true } }, nagoldEntries: entries };
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) for (const file of ["index.html", "l1-1.html", "l1-2.html"]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", acceptDownloads: true });
      try {
        const page = await context.newPage(), errors = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("dialog", dialog => dialog.accept());
        await context.route("**/*", route => {
          const url = new URL(route.request().url());
          if (publicBase) return url.href.startsWith(publicBase.href) ? route.continue() : route.abort();
          const file = decodeURIComponent(url.pathname.slice(1) || "index.html");
          if (url.origin !== "http://ep.test" || !allowed.has(file) || !mime[path.extname(file)]) return route.fulfill({ status: 404, body: "Not public" });
          return route.fulfill({ status: 200, contentType: mime[path.extname(file)], body: fs.readFileSync(path.join(root, file)) });
        });
        await page.addInitScript(({ KEY, profile }) => localStorage.setItem(KEY, JSON.stringify({ version: 1, theme: "dark", currentProfileId: profile.id, profiles: [profile] })), { KEY, profile });
        await page.goto(publicBase ? new URL(file, publicBase).href : `http://ep.test/${file}`);
        // A real old JSON file through the normal UI, including on the live site.
        await page.locator(".site-header .profile-button").click();
        await page.locator("#save-manager-button").click();
        await page.setInputFiles("#import-file", { name: "2026-10-19_Excel-Lab_alt.json", mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify({ app: "Excel-Lab", version: 1, appVersion: "0.21.0", exportedBy: { nagold: 3 }, profile })) });
        await page.waitForFunction(KEY => localStorage.getItem("excelLab.importBackup.v1") !== null
          && JSON.parse(localStorage.getItem(KEY)).profiles[0].nagoldEntries.length === 2, KEY);
        assert.match(await page.locator("#save-status").textContent(), /3 EP/);
        await page.locator("#save-dialog .dialog-close").click();
        const profileButton = page.locator(".site-header .profile-button");
        assert.match(await profileButton.getAttribute("aria-label"), /3 EP/);
        await profileButton.click();
        assert.equal(await page.locator("#nagold-total-value").innerText(), "3 EP");
        assert.match(await page.locator("#nagold-tip").textContent(), /97 EP/);
        await page.locator("#nagold-total").click();
        assert.equal(await page.locator("#nagold-title").innerText(), "EP · Erfahrungspunkte");
        assert.equal(await page.locator("#nagold-sum").innerText(), "3 EP gesamt");
        assert.equal(await page.locator("#nagold-rows tr").count(), 2);
        assert.equal(await page.locator("#nagold-dialog th").nth(3).innerText(), "EP");
        assert.doesNotMatch(await page.locator("#nagold-dialog").innerText(), /\bNAG(?:OLD)?\b/);
        await page.locator("#nagold-dialog [data-close-dialog]").click();
        await page.locator("#manager-dialog .dialog-close").click();
        await page.locator(".site-header .profile-button").click();
        await page.locator("#save-manager-button").click();
        assert.match(await page.locator("#save-status").textContent(), /3 EP/);
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#export-button").click()]);
        const payload = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
        assert.equal(payload.version, 1);
        assert.equal(payload.exportedBy.nagold, 3);
        assert.deepEqual(payload.profile.nagoldEntries, entries);
        assert.match(await page.locator("#recent-saves").innerText(), /3 EP/);
        assert.deepEqual(errors, []);
        console.log(`PASS ${file} / ${width}: alte JSON direkt laden, EP-Profil, Tabelle, Speicherdatei und Verlauf`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
