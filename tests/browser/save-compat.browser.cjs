"use strict";

// Synthetische Lernstände, isolierte Edge-Kontexte; keine Schülerdaten und
// keine echten Netzwerkanfragen. Nur öffentliche, versionierte Assets dienen.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = path.resolve(__dirname, "../..");
const publicFiles = new Set(execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0")
  .filter(name => /\.(html|js|css|svg|png|jpe?g|webp|ico|woff2?)$/i.test(name) && !name.startsWith("materialien/")));
const KEY = "excelLab.state.v1";
const BACKUP = "excelLab.importBackup.v1";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2" };
const asFile = payload => ({ name: "alter-stand.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
const row = { date: "2026-10-16", time: "08:00", purpose: "Mitarbeit", points: 3 };
const seeded = { version: 1, theme: "dark", currentProfileId: "synthetic", profiles: [{ id: "synthetic", name: "tes.pro", className: "WGW EK1", progress: {}, nagoldEntries: [row] }] };
const old = { app: "Excel-Lab", version: 1, appVersion: "0.1.0", profile: { name: "tes.pro", className: "WGW EK1", progress: {}, nagoldEntries: [
  { date: "16.10.2026", purpose: "Startkapital", points: "5" },
  { date: "19.10.2026", time: "8:5", purpose: "Anwesenheit", points: "2" },
  { purpose: "Abzug", points: -3 }
] } };

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const file of ["index.html", "l1-1.html"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("dialog", dialog => dialog.accept());
      await page.route("**/*", async route => {
        const url = new URL(route.request().url());
        const name = decodeURIComponent(url.pathname.slice(1) || "index.html");
        if (url.origin !== "http://excel-lab.test" || !publicFiles.has(name)) return route.fulfill({ status: 404, body: "Not public" });
        return route.fulfill({ status: 200, contentType: mime[path.extname(name)] || "application/octet-stream", body: fs.readFileSync(path.join(root, name)) });
      });
      await page.addInitScript(([key, initial]) => { if (!localStorage.getItem(key)) localStorage.setItem(key, initial); }, [KEY, JSON.stringify(seeded)]);
      await page.goto(`http://excel-lab.test/${file}`);
      await page.locator("#save-button").click();
      const before = await page.evaluate(key => localStorage.getItem(key), KEY);
      const [download] = await Promise.all([
        page.waitForEvent("download"), page.setInputFiles("#upgrade-save-file", asFile(old))
      ]);
      assert.match(download.suggestedFilename(), /_aktualisiert\.json$/);
      const upgraded = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
      assert.equal(upgraded.exportedBy.nagold, 4);
      assert.equal(upgraded.profile.nagoldEntries.length, 3);
      assert.equal(await page.evaluate(key => localStorage.getItem(key), KEY), before, "Upgrade verändert das Browserprofil nicht");
      await page.setInputFiles("#import-file", asFile(upgraded));
      await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).profiles[0].nagoldEntries.length === 3, KEY);
      assert.equal(await page.evaluate(key => localStorage.getItem(key), BACKUP), before);
      assert.equal(await page.locator("#import-backup-button").isVisible(), true);
      const [backup] = await Promise.all([page.waitForEvent("download"), page.locator("#import-backup-button").click()]);
      const backupPayload = JSON.parse(fs.readFileSync(await backup.path(), "utf8"));
      assert.deepEqual(backupPayload.profile.nagoldEntries, [row]);
      const [saved] = await Promise.all([page.waitForEvent("download"), page.locator("#export-button").click()]);
      const roundtrip = JSON.parse(fs.readFileSync(await saved.path(), "utf8"));
      assert.deepEqual(roundtrip.profile.nagoldEntries, upgraded.profile.nagoldEntries);
      assert.equal(roundtrip.exportedBy.nagold, 4);
      if (file === "index.html") {
        fs.mkdirSync(path.join(root, ".tmp"), { recursive: true });
        await page.locator("#save-dialog").screenshot({ path: path.join(root, ".tmp", "save-compat-dialog.png") });
      }
      await page.reload();
      await page.locator("#save-button").click();
      const stable = await page.evaluate(key => localStorage.getItem(key), KEY);
      const invalid = { ...upgraded, profile: { ...upgraded.profile, nagoldEntries: [...upgraded.profile.nagoldEntries, { ...row, points: 99 }] } };
      await page.setInputFiles("#import-file", asFile(invalid));
      await page.waitForFunction(() => /NAGOLD-Zeile 4/.test(document.body.innerText));
      assert.equal(await page.evaluate(key => localStorage.getItem(key), KEY), stable);
      await page.evaluate(key => {
        const write = Storage.prototype.setItem;
        Storage.prototype.setItem = function(name, value) { if (name === key) throw new DOMException("Full", "QuotaExceededError"); return write.call(this, name, value); };
      }, KEY);
      await page.setInputFiles("#import-file", asFile(upgraded));
      await page.waitForFunction(() => /nicht sicher gespeichert/.test(document.body.innerText));
      assert.equal(await page.evaluate(key => localStorage.getItem(key), KEY), stable);
      assert.deepEqual(errors, []);
      console.log(`PASS ${file}: Upgrade-Kopie, NAGOLD-Rundlauf, Rücksicherung, ungültige Zeile, voller Speicher`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
