"use strict";

// Vollständiger Profilneustart nur nach ausdrücklicher Entwickler-Aktion.
// Synthetische Daten in isolierten Edge-Kontexten, kein echter Schülerstand.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.argv[2] || "http://127.0.0.1:4279/";
const KEY = "excelLab.state.v1", BACKUP = "excelLab.importBackup.v1";
const oldProfile = { id: "old", name: "alt.pro", className: "WGW EK1", progress: { "l1-1": { completed: true, bonus: true } },
  nagoldEntries: [{ date: "2026-10-19", time: "08:00", purpose: "Startkapital", points: 5 }, { date: "2026-10-19", time: "08:05", purpose: "Anwesenheit", points: 2 }],
  highlights: { "l1-1": [{ block: "b-1", start: 0, end: 3, quote: "Die", color: "mint" }] } };
const otherProfile = { id: "other", name: "and.ere", className: "BK1", progress: { "l1-1": { completed: true } }, nagoldEntries: [{ date: "", purpose: "Mitarbeit", points: 3 }] };
const initial = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "old", profiles: [oldProfile, otherProfile] });

async function open(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage(), errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  await page.addInitScript(([key, value]) => { if (!localStorage.getItem(key)) localStorage.setItem(key, value); }, [KEY, initial]);
  await page.goto(base + "index.html");
  await page.locator("#profile-button").click();
  return { context, page, errors };
}
async function enable(page) {
  await page.keyboard.press("Control+Alt+s");
  await page.locator("#developer-mode-button").click();
  await page.locator("#reset-button").waitFor({ state: "visible" });
}
const stored = page => page.evaluate(key => localStorage.getItem(key), KEY);

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const { context, page, errors } = await open(browser);
    try {
      assert.equal(await page.locator("#reset-button").isVisible(), false);
      await page.locator("#reset-button").evaluate(button => button.click());
      assert.equal(await stored(page), initial, "ohne Entwicklermodus keine Änderung");
      await enable(page);
      page.once("dialog", dialog => dialog.dismiss());
      await page.locator("#reset-button").click();
      assert.equal(await stored(page), initial, "Abbrechen lässt Profil unberührt");
      page.once("dialog", dialog => {
        assert.match(dialog.message(), /alt\.pro.*WGW EK1/);
        assert.match(dialog.message(), /Kürzel, Klasse, XP, NAGOLD-Tabelle und Textmarkierungen/);
        return dialog.accept();
      });
      const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#reset-button").click()]);
      await page.locator("#profile-dialog").waitFor({ state: "visible" });
      const backupFile = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
      assert.deepEqual(backupFile.profile, oldProfile, "Dateisicherung enthält auch Kürzel, Klasse, Bonus und Textmarker");
      assert.equal(backupFile.exportedBy.nagold, 7);
      assert.equal(await page.evaluate(key => localStorage.getItem(key), BACKUP), initial, "lokale Rücksicherung vollständig");
      let state = JSON.parse(await stored(page));
      assert.equal(state.currentProfileId, null);
      assert.deepEqual(state.profiles, [otherProfile], "nur das aktive Profil entfernt, anderes unverändert");
      assert.equal(await page.locator("#profile-name-input").inputValue(), "");
      assert.equal(await page.locator("#profile-class-input").inputValue(), "");
      await page.locator("#profile-name-input").fill("neu.pro");
      await page.locator("#profile-class-input").fill("WGW EK2");
      await page.locator('#profile-form button[type="submit"]').click();
      state = JSON.parse(await stored(page));
      const fresh = state.profiles.find(profile => profile.id === state.currentProfileId);
      assert.equal(fresh.name, "neu.pro"); assert.equal(fresh.className, "WGW EK2");
      assert.notEqual(fresh.id, oldProfile.id);
      assert.deepEqual(fresh.progress, {}); assert.deepEqual(fresh.nagoldEntries, []); assert.deepEqual(fresh.highlights, {});
      assert.deepEqual(state.profiles.find(profile => profile.id === "other"), otherProfile);
      // Rücksicherung bleibt auch nach der Neuanlage als normale JSON-Datei erreichbar.
      await page.locator("#save-button").click();
      const [previous] = await Promise.all([page.waitForEvent("download"), page.locator("#import-backup-button").click()]);
      assert.deepEqual(JSON.parse(fs.readFileSync(await previous.path(), "utf8")).profile, oldProfile);
      await page.setInputFiles("#import-file", { name: "ruecksicherung.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(backupFile)) });
      await page.waitForFunction(key => {
        const state = JSON.parse(localStorage.getItem(key));
        return state.profiles.find(profile => profile.id === state.currentProfileId)?.name === "alt.pro";
      }, KEY);
      state = JSON.parse(await stored(page));
      const restored = state.profiles.find(profile => profile.id === state.currentProfileId);
      assert.deepEqual(restored.nagoldEntries, oldProfile.nagoldEntries);
      assert.deepEqual(restored.highlights, oldProfile.highlights);
      assert.equal(restored.progress["l1-1"].completed, true);
      assert.equal(restored.progress["l1-1"].bonus, true);
      assert.equal(restored.className, oldProfile.className);
      assert.equal(state.profiles.some(profile => profile.name === "neu.pro"), true);
      assert.deepEqual(errors, []);
      console.log("PASS: Entwickler-Guard, Abbruch, vollständige Sicherung, Profilneuanlage, anderes Profil erhalten, Wiederherstellung");
    } finally { await context.close(); }
    for (const failure of ["backup", "write", "download"]) {
      const { context, page, errors } = await open(browser);
      try {
        await enable(page);
        await page.evaluate(({ key, backup, failure }) => {
          if (failure === "download") { URL.createObjectURL = () => { throw new Error("Download nicht möglich"); }; return; }
          const setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function(name, value) {
            if (name === (failure === "backup" ? backup : key)) throw new DOMException("Speicher voll", "QuotaExceededError");
            return setItem.call(this, name, value);
          };
        }, { key: KEY, backup: BACKUP, failure });
        page.once("dialog", dialog => dialog.accept());
        await page.locator("#reset-button").click();
        await page.waitForFunction(() => /Zurücksetzen abgebrochen/.test(document.body.innerText));
        assert.equal(await stored(page), initial);
        assert.equal(await page.locator("#profile-dialog").isVisible(), false);
        assert.equal(await page.locator("#profile-edit-name").inputValue(), "alt.pro");
        assert.deepEqual(errors, []);
        console.log(`PASS: ${failure}-Fehler lässt vollständiges altes Profil erhalten`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
