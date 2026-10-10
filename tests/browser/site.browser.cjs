"use strict";

// Alle 30 Seiten im echten Browser (Edge über Playwright): keine Skriptfehler,
// keine externen Anfragen, alle Bilder geladen, kein seitliches Überlaufen.
// Dazu der Umgang mit einem nicht lesbaren Lernstand (Rettungskopie).
//
// Aufruf: node tests/browser/site.browser.cjs http://127.0.0.1:4273/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..", "..");
const base = process.argv[2] || "http://127.0.0.1:4273/";
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
const KEY = "excelLab.state.v1";
const RESCUE = "excelLab.state.rescue.v1";
const BROKEN = "{kaputt";

async function open(browser, file, options = {}) {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: options.viewport || { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [], external = [], failed = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.route("**/*", (route) => {
    if (!route.request().url().startsWith(base)) { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.goto(base + file);
  if (options.state !== undefined) {
    await page.evaluate(([key, value]) => localStorage.setItem(key, value), [KEY, options.state]);
    await page.reload();
  }
  return { context, page, errors, external, failed };
}

const lessonFiles = pages.filter((file) => /^l\d-\d\.html$/.test(file));
const allDone = Object.fromEntries(lessonFiles
  .map((file) => [file.slice(0, -5), { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] }]));
const profileState = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "test", profiles: [{ id: "test", name: "tes.pro", className: "WGW EK1", progress: allDone }] });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const failures = [];
  const check = async (name, run) => {
    try { await run(); console.log(`ok   ${name}`); }
    catch (error) { failures.push(`${name}: ${error.message}`); console.log(`FAIL ${name}: ${error.message}`); }
  };
  try {
    for (const file of pages) {
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        await check(`${file} bei ${viewport.width} px`, async () => {
          const { context, page, errors, external, failed } = await open(browser, file, { state: profileState, viewport });
          try {
            // Alle Abschnitte öffnen, damit auch dort liegende Bilder und Tabellen geprüft werden.
            await page.evaluate(() => document.querySelectorAll("details").forEach((element) => { element.open = true; }));
            await page.evaluate(async () => {
              for (const image of document.images) { image.loading = "eager"; if (!image.complete) await new Promise((done) => { image.onload = image.onerror = done; }); }
            });
            const broken = await page.evaluate(() => Array.from(document.images).filter((image) => !image.naturalWidth).map((image) => image.getAttribute("src")));
            assert.deepEqual(broken, [], "Bilder nicht geladen");
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            assert.ok(overflow <= 1, `Seite läuft ${overflow} px seitlich über`);
            if (lessonFiles.includes(file)) {
              assert.equal(await page.locator(`#${file.slice(0, -5).replace("-", "")}-mastery-form`).count(), 1);
              assert.match(await page.locator("#lesson-points-status").innerText(), /100 von 100/);
              assert.match(await page.locator("#lesson-profile-name").innerText(), /tes\.pro/);
            } else if (file === "index.html") {
              assert.match(await page.locator("#xp-button").innerText(), /2700/);
            }
            assert.deepEqual(errors, [], "Skriptfehler");
            assert.deepEqual(external, [], "externe Anfragen");
            assert.deepEqual(failed, [], "fehlgeschlagene Anfragen");
          } finally { await context.close(); }
        });
      }
    }

    await check("Fotos verlustfrei in Originalgröße", async () => {
      const { context, page } = await open(browser, "index.html", { state: profileState });
      try {
        const sizes = await page.evaluate(async () => {
          const out = {};
          for (const image of document.querySelectorAll("img[src$='.webp']")) {
            image.loading = "eager";
            await image.decode();
            out[image.getAttribute("src")] = `${image.naturalWidth}x${image.naturalHeight}`;
          }
          return out;
        });
        assert.equal(sizes["assets/images/hero-students-excel-v1.webp"], "1672x941");
        for (const name of ["l1-foundations", "l2-calculations", "l3-decisions", "l4-charts"]) {
          assert.equal(sizes[`assets/images/organizer/${name}-v1.webp`], "1536x1024", name);
        }
      } finally { await context.close(); }
    });

    await check("Nicht lesbarer Lernstand: Rettungskopie vor dem Überschreiben", async () => {
      const { context, page, errors } = await open(browser, "index.html", { state: BROKEN });
      try {
        await page.locator("#toast-region .toast").filter({ hasText: "nicht lesbar" }).waitFor();
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), KEY), BROKEN, "Start darf nichts überschreiben");
        await page.locator("#profile-dialog").waitFor({ state: "visible" });
        await page.fill("#profile-name-input", "tes.pro");
        await page.fill("#profile-class-input", "WGW EK1");
        await page.locator("#profile-form button[type=submit]").click();
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), RESCUE), BROKEN, "Rettungskopie");
        assert.equal(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].name, KEY), "tes.pro");
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Nicht lesbarer Lernstand: ohne Rettungskopie wird nicht überschrieben", async () => {
      const { context, page } = await open(browser, "index.html", { state: BROKEN });
      try {
        await page.evaluate((rescue) => {
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function (key, value) {
            if (key.startsWith(rescue)) throw new DOMException("Voll", "QuotaExceededError");
            return original.call(this, key, value);
          };
        }, RESCUE);
        await page.locator("#profile-dialog").waitFor({ state: "visible" });
        await page.fill("#profile-name-input", "tes.pro");
        await page.fill("#profile-class-input", "WGW EK1");
        await page.locator("#profile-form button[type=submit]").click();
        await page.locator("#toast-region .toast").filter({ hasText: "Nicht gespeichert" }).waitFor();
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), KEY), BROKEN);
      } finally { await context.close(); }
    });

    await check("Nicht lesbarer Lernstand: Lernseite überschreibt ihn nicht", async () => {
      const { context, page, errors } = await open(browser, "l1-1.html", { state: BROKEN });
      try {
        await page.locator("#lesson-theme-toggle").click();
        await page.locator("#toast-region .toast").filter({ hasText: "nicht lesbar" }).waitFor();
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), KEY), BROKEN);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Bonusaufgabe: falscher und richtiger Kontrollwert, XP bleiben erhalten", async () => {
      const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "test", profiles: [{ id: "test", name: "tes.pro", className: "WGW EK1", progress: {} }] });
      const { context, page, errors } = await open(browser, "l1-1.html", { state });
      try {
        const stored = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].progress["l1-1"] || {}, KEY);
        await page.evaluate(() => { document.querySelector("#l11-bonus-section").open = true; });
        assert.match(await page.locator("#l11-bonus-section .bonus-badge").innerText(), /\+50 XP/);
        await page.fill("#l11-bonus-input", "abc");
        await page.locator("#l11-bonus-section button[type=submit]").click();
        assert.match(await page.locator("#l11-bonus-feedback").innerText(), /Zahl/);
        await page.fill("#l11-bonus-input", "40,00");
        await page.locator("#l11-bonus-section button[type=submit]").click();
        assert.match(await page.locator("#l11-bonus-feedback").innerText(), /Noch nicht richtig/);
        assert.equal((await stored()).bonus || false, false);
        await page.fill("#l11-bonus-input", "41,45 €");
        await page.locator("#l11-bonus-section button[type=submit]").click();
        assert.equal((await stored()).bonus, true);
        assert.equal((await stored()).completed, false, "Bonus schließt die Einheit nicht ab");
        assert.match(await page.locator("#lesson-points-status").innerText(), /0 von 100 XP · Bonus \+50 XP/);
        await page.waitForFunction(() => document.querySelector("#xp-button .xp-count").textContent === "50");
        assert.equal(await page.locator("#l11-bonus-input").isDisabled(), true);
        // Die Startseite liest, bereinigt und speichert den Lernstand; der Bonus bleibt.
        await page.goto(base + "index.html");
        await page.waitForFunction(() => document.querySelector("#xp-button .xp-count").textContent === "50");
        await page.locator("#theme-toggle").click();
        assert.equal((await stored()).bonus, true, "Bonus nach Speichern der Startseite");
        // Die zweite Aufgabe derselben Einheit zählt eigenständig.
        await page.goto(base + "l1-1.html");
        await page.evaluate(() => { document.querySelector("#l11-bonus-2-section").open = true; });
        await page.fill("#l11-bonus-2-input", "80,30");
        await page.locator("#l11-bonus-2-section button[type=submit]").click();
        assert.equal((await stored()).bonus2, true);
        await page.locator("#xp-button").click();
        assert.equal(await page.locator("#xp-breakdown").innerText(), "0 von 27 Einheiten: 0 XP · 2 von 54 Bonusaufgaben: 100 XP");
        await page.locator("#xp-dialog .dialog-close").click();
        assert.match(await page.locator("#lesson-points-status").innerText(), /Bonus \+100 XP/);
        await page.waitForFunction(() => document.querySelector("#xp-button .xp-count").textContent === "100");
        // Eine zweite Lösung derselben Aufgabe zählt nicht doppelt.
        await page.goto(base + "l1-1.html");
        assert.equal(await page.locator("#l11-bonus-section button[type=submit]").isHidden(), true);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Bonusaufgaben: jede Lernseite zeigt ihren Abschnitt vor dem Verständnis-Check", async () => {
      const { context, page } = await open(browser, "l4-6.html", { state: profileState });
      try {
        for (const file of lessonFiles) {
          await page.goto(base + file);
          const prefix = file.slice(0, -5).replace("-", "");
          assert.equal(await page.evaluate((id) => document.querySelector(`#${id}-bonus-section`)?.nextElementSibling?.id, prefix), `${prefix}-bonus-2-section`, file);
          assert.equal(await page.evaluate((id) => document.querySelector(`#${id}-bonus-2-section`)?.nextElementSibling?.id, prefix), `${prefix}-mastery-section`, file);
          assert.ok((await page.locator(`#${prefix}-bonus-section .instruction-list li`).count()) >= 3, file);
          assert.ok((await page.locator(`#${prefix}-bonus-2-section .instruction-list li`).count()) >= 2, file);
        }
      } finally { await context.close(); }
    });

    await check("Rücknahme: nur diese Einheit wird geöffnet, die Folgeeinheit bleibt abgeschlossen und ist gesperrt", async () => {
      const done = { completed: true, teacherChecked: true, masteryPassed: true, bonus: true, checks: [true, true, true] };
      const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "test", profiles: [{ id: "test", name: "tes.pro", className: "WGW EK1", progress: { "l1-1": done, "l1-2": done, "l1-3": done } }] });
      const { context, page, errors } = await open(browser, "l1-1.html", { state });
      try {
        const stored = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].progress, KEY);
        await page.locator("#page-complete-button").click();
        const after = await stored();
        assert.equal(after["l1-1"].completed, false);
        assert.equal(after["l1-1"].bonus, true, "Bonus bleibt");
        assert.equal(after["l1-2"].completed, true, "Folgeeinheit behält ihren Abschluss");
        assert.equal(after["l1-3"].completed, true);
        await page.goto(base + "l1-2.html");
        assert.equal(await page.locator("#l12-content").isHidden(), true, "L1.2 gesperrt, solange L1.1 offen ist");
        assert.equal(await page.locator("#l12-access").isVisible(), true);
        await page.goto(base + "l1-3.html");
        assert.equal(await page.locator("#l13-content").isVisible(), true, "L1.3 bleibt offen");
        await page.goto(base + "index.html#lernpfad/1");
        assert.equal(await page.locator('[data-open-lesson="l1-2"].lesson-card').getAttribute("aria-disabled"), "true");
        await page.waitForFunction(() => document.querySelector("#xp-button .xp-count").textContent === "350");
        // Nach erneutem Abschluss ist alles wie zuvor.
        await page.goto(base + "l1-1.html");
        await page.locator("#page-complete-button").click();
        await page.goto(base + "l1-2.html");
        assert.equal(await page.locator("#l12-content").isVisible(), true);
        assert.match(await page.locator("#lesson-points-status").innerText(), /100 von 100 XP/);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Rettungskopie lässt sich im Profildialog herunterladen", async () => {
      const { context, page } = await open(browser, "index.html", { state: BROKEN });
      try {
        await page.locator("#profile-dialog").waitFor({ state: "visible" });
        await page.locator("#profile-dialog [data-close-dialog]").click();
        await page.locator("#profile-button").click();
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#rescue-button").click()]);
        assert.match(download.suggestedFilename(), /^\d{4}-\d\d-\d\d_Excel-Lab_Rettungskopie\.txt$/);
        assert.equal(fs.readFileSync(await download.path(), "utf8"), BROKEN);
      } finally { await context.close(); }
      const normal = await open(browser, "index.html", { state: profileState });
      try {
        await normal.page.locator("#profile-button").click();
        assert.equal(await normal.page.locator("#rescue-button").isHidden(), true, "ohne Rettungskopie kein Knopf");
      } finally { await normal.context.close(); }
    });

    for (const file of ["index.html", "l1-2.html"]) {
      await check(`Lernpfad-Menü auf ${file}: öffnen, Kapitel zeigen, Escape, gesperrtes und offenes Kapitel`, async () => {
        const one = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
        const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "test", profiles: [{ id: "test", name: "tes.pro", className: "WGW EK1", progress: { "l1-1": one } }] });
        const { context, page, errors } = await open(browser, file, { state });
        try {
          const menu = page.locator("#learning-menu");
          const isOpen = () => menu.evaluate((element) => element.classList.contains("is-open"));
          assert.equal(await page.locator("#nav-stage-menu .nav-stage-entry").count(), 4);
          assert.equal(await page.locator("#nav-stage-menu .nav-chapter-link").count(), 27);
          assert.equal(await page.locator("#nav-stage-menu .nav-chapter-link.is-locked").count(), 25, "nur L1.1 und L1.2 offen");
          await page.locator("[data-learning-toggle]").click();
          assert.equal(await isOpen(), true);
          assert.equal(await page.locator("#learning-path-button").getAttribute("aria-expanded"), "true");
          await page.locator('[data-stage-toggle="1"]').click();
          assert.equal(await page.locator('[data-stage-toggle="1"]').getAttribute("aria-expanded"), "true");
          assert.equal(await page.locator("#nav-chapters-1").isVisible(), true);
          await page.locator("#nav-chapters-1 .nav-chapter-link").nth(2).click();
          await page.locator("#toast-region .toast").filter({ hasText: "L1.2 abgeschlossen ist" }).waitFor();
          await page.keyboard.press("Escape");
          assert.equal(await isOpen(), false);
          assert.equal(await page.evaluate(() => document.activeElement.id), "learning-path-button");
          await page.locator("[data-learning-toggle]").click();
          await page.locator("main").click({ position: { x: 5, y: 300 } });
          assert.equal(await isOpen(), false, "Klick außerhalb schließt");
          await page.locator("[data-learning-toggle]").click();
          await page.locator('[data-stage-toggle="1"]').click();
          await Promise.all([page.waitForURL(/l1-1\.html/), page.locator("#nav-chapters-1 .nav-chapter-link").first().click()]);
          assert.deepEqual(errors, []);
        } finally { await context.close(); }
      });
    }

    await check("Klassenübersicht: Dateien einlesen, neueste zählt, Fehler melden, CSV", async () => {
      const { context, page, errors, external } = await open(browser, "lehrkraft.html");
      try {
        const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
        const file = (name, className, progress, exportedAt, extra = {}) => ({
          name: `${name}-${exportedAt.slice(0, 10)}.json`, mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify({ app: "Excel-Lab", version: 1, appVersion: "0.15.0", exportedAt, profile: { name, className, progress }, ...extra }))
        });
        await page.setInputFiles("#teacher-files", [
          file("anna.bei", "WGW EK1", { "l1-1": { ...done, bonus: true }, "l1-2": done, "l1-3": { checks: [true, false, false] } }, "2026-10-09T08:00:00.000Z"),
          file("anna.bei", "WGW EK1", { "l1-1": done }, "2026-10-01T08:00:00.000Z"),
          file("ben.zwe", "WGW EK2", { "l1-1": done, "unbekannt": done, "l9-9": done }, "2026-10-08T08:00:00.000Z"),
          { name: "kaputt.json", mimeType: "application/json", buffer: Buffer.from("{kaputt") },
          { name: "fremd.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "Anderes", version: 1 })) },
          file("<img src=x onerror=alert(1)>", "=1+1", { "l1-1": done }, "2026-10-07T08:00:00.000Z")
        ]);
        await page.locator("#teacher-table tbody tr").nth(2).waitFor();
        assert.equal(await page.locator("#teacher-table tbody tr").count(), 3, "drei Personen, ältere Datei verworfen");
        assert.equal(await page.locator("#teacher-errors li").count(), 2);
        assert.match(await page.locator("#teacher-status").innerText(), /3 Personen aus 3 Klassen.*4 von 6 Dateien gelesen.*2 nicht lesbar/);
        const anna = page.locator("#teacher-table tbody tr", { hasText: "anna.bei" });
        assert.deepEqual((await anna.locator("td.teacher-number").allInnerTexts()).map((text) => text.trim()), ["2/27", "1", "250"]);
        assert.equal(await anna.locator(".teacher-cell.is-done").count(), 2);
        assert.equal(await anna.locator(".teacher-cell.has-bonus").count(), 1);
        assert.equal(await anna.locator(".teacher-cell.is-progress").count(), 1);
        assert.equal(await page.locator("#teacher-table img").count(), 0, "Dateiinhalt wird nicht als HTML eingesetzt");
        assert.equal(await page.locator("#teacher-table tfoot td").first().innerText(), "3");
        assert.equal(await page.locator("#teacher-count").innerText(), "3");
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#teacher-csv").click()]);
        const csv = fs.readFileSync(await download.path(), "utf8");
        assert.match(download.suggestedFilename(), /_Excel-Lab_Klassenuebersicht\.csv$/);
        assert.ok(csv.startsWith("﻿\"Kürzel\";\"Klasse\""));
        assert.ok(csv.includes("\"anna.bei\";\"WGW EK1\""));
        assert.ok(csv.includes("\"'=1+1\""), "Formelzeichen entschärft");
        assert.ok(csv.includes("abgeschlossen + Bonus"));
        await page.locator("#teacher-clear").click();
        assert.equal(await page.locator("#teacher-table-section").isHidden(), true);
        assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0, "nichts gespeichert");
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
      } finally { await context.close(); }
    });

    await check("Druckansicht: Knopf vorhanden, alle Abschnitte offen, Navigation ausgeblendet", async () => {
      const { context, page } = await open(browser, "l2-1.html", { state: profileState });
      try {
        assert.equal(await page.locator("[data-print-lesson]").count(), 1);
        const before = await page.locator(".lesson-article details[open]").count();
        await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
        assert.equal(await page.locator(".lesson-article details:not([open])").count(), 0);
        await page.emulateMedia({ media: "print" });
        assert.equal(await page.locator(".site-header").isVisible(), false);
        assert.equal(await page.locator(".lesson-page-sidebar").isVisible(), false);
        assert.equal(await page.locator("#l21-task-heading").isVisible(), true);
        assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
        await page.emulateMedia({ media: "screen" });
        await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        assert.equal(await page.locator(".lesson-article details[open]").count(), before, "Zustand wiederhergestellt");
      } finally { await context.close(); }
    });

    await check("Formelsammlung: Fehlermeldungen und Glossar, Suche über beides", async () => {
      const { context, page, errors } = await open(browser, "index.html#formeln", { state: profileState });
      try {
        await page.locator("#formula-grid .formula-card").first().waitFor();
        assert.equal(await page.locator("#formula-grid .formula-card").count(), 27);
        assert.equal(await page.locator("#glossary-list .glossary-entry").count(), 33);
        await page.locator('[data-formula-filter="Fehlermeldungen"]').click();
        assert.equal(await page.locator("#formula-grid .formula-card").count(), 7);
        assert.equal(await page.locator("#glossary").isHidden(), true);
        await page.locator('[data-formula-filter="Glossar"]').click();
        assert.equal(await page.locator("#formula-grid .formula-card").count(), 0);
        assert.equal(await page.locator("#glossary-list .glossary-entry").count(), 33);
        assert.equal(await page.locator("#formula-empty").isHidden(), true);
        await page.locator('[data-formula-filter="all"]').click();
        await page.fill("#formula-search", "absolut");
        assert.ok((await page.locator("#formula-grid .formula-card").count()) >= 1);
        assert.equal(await page.locator("#glossary-list .glossary-entry").count(), 1);
        await page.fill("#formula-search", "gibtesnicht");
        assert.equal(await page.locator("#formula-empty").isVisible(), true);
        assert.equal(await page.locator("#glossary").isHidden(), true);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Laden ersetzt dieselbe Person, fragt bei weniger Abschlüssen nach, legt andere neu an", async () => {
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const start = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "p1", profiles: [{ id: "p1", name: "tes.pro", className: "WGW EK1", createdAt: "2026-09-01T00:00:00.000Z", progress: { "l1-1": done, "l1-2": done } }] });
      const { context, page, errors } = await open(browser, "index.html", { state: start });
      try {
        await page.evaluate(() => { window.showOpenFilePicker = undefined; });
        const stateNow = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
        const file = (name, className, progress) => ({ name: "stand.json", mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify({ app: "Excel-Lab", version: 1, exportedAt: "2026-10-10T08:00:00.000Z", profile: { name, className, progress } })) });
        const load = async (payload, accept) => {
          page.once("dialog", (dialog) => (accept ? dialog.accept() : dialog.dismiss()));
          await page.setInputFiles("#import-file", payload);
          await page.waitForTimeout(300);
        };
        await page.setInputFiles("#import-file", file("tes.pro", "WGW EK1", { "l1-1": done, "l1-2": done, "l1-3": done }));
        await page.waitForFunction((key) => Boolean(JSON.parse(localStorage.getItem(key)).profiles[0].progress["l1-3"]?.completed), KEY);
        let now = await stateNow();
        assert.equal(now.profiles.length, 1, "kein zweites Profil");
        assert.equal(now.profiles[0].id, "p1");
        assert.equal(now.profiles[0].createdAt, "2026-09-01T00:00:00.000Z");
        await load(file("tes.pro", "WGW EK1", { "l1-1": done }), false);
        now = await stateNow();
        assert.equal(Boolean(now.profiles[0].progress["l1-3"]?.completed), true, "Abbrechen lässt den Stand unverändert");
        await load(file("tes.pro", "WGW EK1", { "l1-1": done }), true);
        now = await stateNow();
        assert.equal(now.profiles.length, 1);
        assert.equal(Boolean(now.profiles[0].progress["l1-3"]?.completed), false, "nach Bestätigung ersetzt");
        await page.setInputFiles("#import-file", file("and.ere", "WGW EK2", { "l1-1": done }));
        await page.waitForFunction((key) => JSON.parse(localStorage.getItem(key)).profiles.length === 2, KEY);
        now = await stateNow();
        assert.equal(now.profiles.find((profile) => profile.id === now.currentProfileId).name, "and.ere");
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Lernnachweis: Werte des Profils, Hinweis ohne Profil, Druckdarstellung, kein Schreiben", async () => {
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "test", profiles: [{ id: "test", name: "tes.pro", className: "WGW EK1", progress: { "l1-1": { ...done, bonus: true, bonus2: true }, "l1-2": { ...done, bonus: true }, "l2-1": done, "l1-3": { checks: [true, false, false] } } }] });
      const { context, page, errors } = await open(browser, "index.html", { state });
      try {
        await page.locator("#profile-button").click();
        await Promise.all([page.waitForURL(/nachweis\.html/), page.locator("#certificate-link").click()]);
        assert.equal(await page.locator("#certificate-name").innerText(), "tes.pro");
        assert.equal(await page.locator("#certificate-class").innerText(), "WGW EK1");
        assert.equal(await page.locator("#certificate-lessons").innerText(), "3 von 27");
        assert.equal(await page.locator("#certificate-bonus").innerText(), "3 von 54");
        assert.equal(await page.locator("#certificate-xp").innerText(), "450");
        assert.equal(await page.locator(".certificate-stage").count(), 4);
        assert.equal(await page.locator(".certificate-lessons li").count(), 27);
        assert.equal(await page.locator(".certificate-lessons li.is-done").count(), 3);
        assert.match(await page.locator(".certificate-lessons li").first().innerText(), /L1\.1[\s\S]*abgeschlossen · 2 Bonus/);
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), KEY), state, "Lernstand unverändert");
        await page.emulateMedia({ media: "print" });
        assert.equal(await page.locator(".site-header").isVisible(), false);
        assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
        await page.emulateMedia({ media: "screen" });
        await page.evaluate((key) => localStorage.removeItem(key), KEY);
        await page.reload();
        assert.equal(await page.locator("#certificate").isHidden(), true);
        assert.equal(await page.locator("#certificate-empty").isVisible(), true);
        assert.equal(await page.locator("#certificate-print").isDisabled(), true);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Startseite und Lernseite ohne content.js zeigen einen Hinweis mit „Seite neu laden“", async () => {
      for (const file of ["index.html", "l1-1.html", "l4-7.html"]) {
        const context = await browser.newContext({ reducedMotion: "reduce" });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.route("**/content.js*", (route) => route.abort());
        try {
          await page.goto(base + file);
          const box = page.locator("[data-load-problem]");
          await box.waitFor();
          assert.equal(await box.isVisible(), true, file);
          assert.match(await box.innerText(), /nicht vollständig geladen[\s\S]*Lernstand ist davon nicht betroffen/);
          assert.equal(await box.getByRole("button", { name: "Seite neu laden" }).isVisible(), true);
          assert.deepEqual(errors, [], `${file}: kein unbehandelter Fehler`);
          await page.unroute("**/content.js*");
          await box.getByRole("button", { name: "Seite neu laden" }).click();
          await page.waitForLoadState("load");
          assert.equal(await page.locator("[data-load-problem]").count(), 0, `${file}: nach dem Neuladen ohne Hinweis`);
        } finally { await context.close(); }
      }
    });

    await check("Farbschema: Lernseite ohne Lernstand speichert die Auswahl", async () => {
      const { context, page } = await open(browser, "l1-1.html");
      try {
        const before = await page.evaluate(() => document.documentElement.dataset.theme);
        await page.locator("#lesson-theme-toggle").click();
        const after = await page.evaluate(() => document.documentElement.dataset.theme);
        assert.notEqual(after, before);
        assert.equal(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).theme, KEY), after);
      } finally { await context.close(); }
    });
  } finally { await browser.close(); }
  assert.deepEqual(failures, []);
  console.log(`${pages.length} Seiten bei zwei Breiten und siebzehn Einzelprüfungen bestanden.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
