"use strict";
// Synthetic profiles only. No user browser state or external requests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const { loadContent } = require("../helpers.cjs");
const base = process.argv[2] || "http://127.0.0.1:4279/";
const KEY = "excelLab.state.v1";
const entries = [{ date: "2026-10-19", time: "10:00", purpose: "Mitarbeit", points: 5 }, { date: "2026-10-19", time: "10:05", purpose: "Korrektur", points: -2 }];
const progress = Object.fromEntries(loadContent().lessons.map(lesson => [lesson.id, { completed: true }]));
const profile = { id: "direct-files", name: "tes.pro", className: "WGW EK1", progress, nagoldEntries: entries };
const asFile = payload => ({ name: "alte-speicherdatei.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390, 360, 320]) for (const file of ["index.html", "l1-1.html", "l1-2.html", "l4-8.html"]) {
      if (process.argv[3] === "no-profile") continue;
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", acceptDownloads: true });
      try {
        await context.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        const page = await context.newPage(), errors = [], downloads = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("download", download => downloads.push(download));
        page.on("dialog", dialog => dialog.accept());
        await page.addInitScript(({ KEY, profile }) => {
          if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify({ version: 1, theme: "dark", currentProfileId: profile.id, profiles: [profile] }));
        }, { KEY, profile });
        await page.goto(base + file);
        if (width === 360) await page.evaluate(() => { document.documentElement.style.fontSize = "18px"; });
        for (const [id, shortcut] of [["save-button", "Alt+S"], ["load-button", "Alt+O"]]) {
          assert.equal(await page.locator(`#${id}`).isVisible(), true);
          assert.equal(await page.locator(`#${id}`).getAttribute("aria-keyshortcuts"), shortcut);
          assert.match(await page.locator(`#${id}`).getAttribute("title"), new RegExp(shortcut.replace("+", "\\+")));
        }
        const header = await page.evaluate(() => {
          const brand = document.querySelector(".site-header > .brand").getBoundingClientRect();
          const actions = document.querySelector(".header-actions").getBoundingClientRect();
          return { brandRight: brand.right, actionsLeft: actions.left, right: actions.right, width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth };
        });
        assert.ok(header.overflow <= 1 && header.right <= header.width + 1, `header overflow: ${JSON.stringify(header)}`);
        assert.ok(header.brandRight <= header.actionsLeft + 1, `brand/actions overlap: ${JSON.stringify(header)}`);
        const [clickSave] = await Promise.all([page.waitForEvent("download"), page.locator("#save-button").click()]);
        const saved = JSON.parse(fs.readFileSync(await clickSave.path(), "utf8"));
        assert.equal(saved.version, 1);
        assert.equal(saved.exportedBy.nagold, 3);
        assert.deepEqual(saved.profile.nagoldEntries, entries);
        assert.equal(await page.locator("#save-dialog").evaluate(dialog => dialog.open), false);
        const [keySave] = await Promise.all([page.waitForEvent("download"), page.keyboard.press("Alt+s")]);
        assert.match(keySave.suggestedFilename(), /^\d{4}-\d{2}-\d{2}_Excel-Lab_tes\.pro_/);
        assert.equal(downloads.length, 2, "one download per save action");
        // Native picker: requested Downloads folder, JSON-only; direct old-file import.
        const incoming = { app: "Excel-Lab", version: 1, appVersion: "0.21.0", profile: { ...profile,
          nagoldEntries: [...entries, { date: "2026-11-04", time: "09:00", purpose: "Zusatzaufgabe", points: 4 }] } };
        await page.evaluate(payload => {
          window.pickerCalls = 0;
          window.showOpenFilePicker = async options => {
            window.pickerCalls++; window.pickerOptions = options;
            return [{ getFile: async () => new File([JSON.stringify(payload)], "alt.json", { type: "application/json" }) }];
          };
        }, incoming);
        const before = await page.evaluate(KEY => localStorage.getItem(KEY), KEY);
        await page.locator("#load-button").click();
        await page.waitForFunction(KEY => JSON.parse(localStorage.getItem(KEY)).profiles[0].nagoldEntries.length === 3, KEY);
        assert.equal(await page.evaluate(() => window.pickerOptions.startIn), "downloads");
        assert.equal(await page.evaluate(() => window.pickerOptions.excludeAcceptAllOption), true);
        assert.deepEqual(await page.evaluate(() => window.pickerOptions.types[0].accept), { "application/json": [".json"] });
        assert.equal(await page.evaluate(() => window.pickerOptions.multiple), false);
        assert.equal(await page.evaluate(() => localStorage.getItem("excelLab.importBackup.v1")), before);
        assert.equal(await page.locator("#save-dialog").evaluate(dialog => dialog.open), false);
        // Alt+O from a text field works too; cancelling changes nothing.
        await page.evaluate(() => {
          const input = document.createElement("input"); input.id = "shortcut-field"; document.body.append(input); input.focus();
          window.showOpenFilePicker = async options => { window.pickerCalls++; throw new DOMException("Cancelled", "AbortError"); };
        });
        const loaded = await page.evaluate(KEY => localStorage.getItem(KEY), KEY);
        await page.keyboard.press("Alt+o");
        await page.waitForFunction(() => window.pickerCalls === 2);
        assert.equal(await page.evaluate(KEY => localStorage.getItem(KEY), KEY), loaded);
        await page.evaluate(() => {
          for (const extra of [{ ctrlKey: true }, { shiftKey: true }, { repeat: true }, { isComposing: true }]) {
            for (const code of ["KeyS", "KeyO"]) document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, altKey: true, code, ...extra }));
          }
        });
        assert.equal(await page.evaluate(() => window.pickerCalls), 2);
        assert.equal(downloads.length, 2, "AltGr/repeat/IME do not trigger downloads");
        // Fallback picker, also through Alt+O, keeps the JSON filter.
        await page.evaluate(() => { window.showOpenFilePicker = undefined; });
        const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.keyboard.press("Alt+o")]);
        assert.equal(chooser.isMultiple(), false);
        assert.match(await page.locator("#import-file").getAttribute("accept"), /\.json/);
        await chooser.setFiles(asFile(incoming));
        await page.waitForFunction(loaded => localStorage.getItem("excelLab.importBackup.v1") === loaded, loaded);
        const afterFallback = await page.evaluate(KEY => localStorage.getItem(KEY), KEY);
        const [invalidChooser] = await Promise.all([page.waitForEvent("filechooser"), page.locator("#load-button").click()]);
        await invalidChooser.setFiles({ name: "ungueltig.json", mimeType: "application/json", buffer: Buffer.from("not json") });
        await page.waitForFunction(() => /kein lesbares JSON/.test(document.querySelector("#toast-region").textContent));
        assert.equal(await page.evaluate(KEY => localStorage.getItem(KEY), KEY), afterFallback, "bad files never overwrite progress");
        // History, upgrade and recovery remain available through a real profile click.
        await page.locator(".site-header .profile-button").click();
        await page.locator("#save-manager-button").click();
        assert.equal(await page.locator("#save-dialog").evaluate(dialog => dialog.open), true);
        assert.equal(await page.locator("#manager-dialog").evaluate(dialog => dialog.open), false);
        assert.equal(await page.locator("#upgrade-save-button").isVisible(), true);
        assert.equal(await page.locator("#import-backup-button").isVisible(), true);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator(".site-header .profile-button").evaluate(button => document.activeElement === button), true);
        // A download creation error is visible even with no open file dialog.
        await page.evaluate(() => { URL.createObjectURL = () => { throw new Error("Test: Download gesperrt"); }; });
        await page.locator("#save-button").click();
        assert.match(await page.locator("#toast-region").innerText(), /Download gesperrt/);
        assert.equal(await page.evaluate(KEY => localStorage.getItem(KEY), KEY), afterFallback);
        assert.deepEqual(errors, []);
        await page.locator("#toast-region").evaluate(region => region.replaceChildren());
        await page.locator("#save-button").hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector("#save-button-tip")).opacity === "1");
        const tipBounds = await page.locator("#save-button-tip").boundingBox();
        assert.ok(tipBounds.x >= 0 && tipBounds.y >= 0 && tipBounds.x + tipBounds.width <= width + 1, "shortcut tooltip fits viewport");
        if (file === "l1-2.html" && [1440, 390].includes(width)) await page.screenshot({ path: `.tmp/direct-files-${width}.png` });
        console.log(`PASS ${file} / ${width}: direct icons, Alt+S/O, old files, picker/cancel/fallback, tools and errors`);
      } finally { await context.close(); }
    }
    for (const file of ["index.html", "l1-1.html"]) {
      const context = await browser.newContext();
      try {
        await context.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        const page = await context.newPage(), downloads = [];
        page.on("download", item => downloads.push(item));
        await page.goto(base + file);
        if (file === "index.html") {
          await page.locator("#profile-dialog").waitFor({ state: "visible" });
          await page.keyboard.press("Escape");
        }
        await page.locator("#save-button").click();
        assert.equal(downloads.length, 0, "no empty profile download");
        assert.match((await page.locator("#toast-region, #save-feedback").allTextContents()).join(" "), /Lege zuerst/);
        await page.keyboard.press("Escape");
        await page.evaluate(profile => {
          window.showOpenFilePicker = async () => [{ getFile: async () => new File([JSON.stringify({ app: "Excel-Lab", version: 1, profile })], "alt.json", { type: "application/json" }) }];
        }, profile);
        await page.locator("#load-button").click();
        await page.waitForFunction(KEY => JSON.parse(localStorage.getItem(KEY))?.profiles?.length === 1, KEY);
        assert.equal(await page.evaluate(KEY => window.EXCEL_LAB_NAGOLD.total(JSON.parse(localStorage.getItem(KEY)).profiles[0]), KEY), 3);
        console.log(`PASS ${file}: no profile creates no download; old file can be loaded directly`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
