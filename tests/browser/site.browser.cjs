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
              assert.equal(await page.locator("#xp-button").count(), 0, "kein eigenes XP-Symbol mehr");
              if (viewport.width > 760) assert.match(await page.locator("#profile-xp").innerText(), /2700 XP/);
              else assert.equal(await page.locator(".profile-mini .xp-count-mini").innerText(), "2700");
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
        await page.waitForFunction(() => document.querySelector("#profile-xp .xp-count").textContent === "50");
        assert.equal(await page.locator("#l11-bonus-input").isDisabled(), true);
        // Die Startseite liest, bereinigt und speichert den Lernstand; der Bonus bleibt.
        await page.goto(base + "index.html");
        await page.waitForFunction(() => document.querySelector("#profile-xp .xp-count").textContent === "50");
        await page.locator("#theme-toggle").click();
        assert.equal((await stored()).bonus, true, "Bonus nach Speichern der Startseite");
        // Die zweite Aufgabe derselben Einheit zählt eigenständig.
        await page.goto(base + "l1-1.html");
        await page.evaluate(() => { document.querySelector("#l11-bonus-2-section").open = true; });
        await page.fill("#l11-bonus-2-input", "80,30");
        await page.locator("#l11-bonus-2-section button[type=submit]").click();
        assert.equal((await stored()).bonus2, true);
        // Auf Lernseiten öffnet der Profilknopf das Profilfenster mit dem XP-Abschnitt.
        await page.locator("#lesson-profile-link").click();
        assert.equal(await page.locator("#xp-breakdown").innerText(), "0 von 27 Einheiten: 0 XP · 2 von 54 Bonusaufgaben: 100 XP");
        await page.locator("#manager-dialog .dialog-close").click();
        assert.match(await page.locator("#lesson-points-status").innerText(), /Bonus \+100 XP/);
        await page.waitForFunction(() => document.querySelector("#profile-xp .xp-count").textContent === "100");
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
        await page.waitForFunction(() => document.querySelector("#profile-xp .xp-count").textContent === "350");
        // Nach erneutem Abschluss ist alles wie zuvor.
        await page.goto(base + "l1-1.html");
        await page.locator("#page-complete-button").click();
        await page.goto(base + "l1-2.html");
        assert.equal(await page.locator("#l12-content").isVisible(), true);
        assert.match(await page.locator("#lesson-points-status").innerText(), /100 von 100 XP/);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Rettungskopie lässt sich im Fenster Speicherstand herunterladen", async () => {
      const { context, page } = await open(browser, "index.html", { state: BROKEN });
      try {
        await page.locator("#profile-dialog").waitFor({ state: "visible" });
        await page.locator("#profile-dialog [data-close-dialog]").click();
        await page.locator("#save-button").click();
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#rescue-button").click()]);
        assert.match(download.suggestedFilename(), /^\d{4}-\d\d-\d\d_Excel-Lab_Rettungskopie\.txt$/);
        assert.equal(fs.readFileSync(await download.path(), "utf8"), BROKEN);
      } finally { await context.close(); }
      const normal = await open(browser, "index.html", { state: profileState });
      try {
        await normal.page.locator("#save-button").click();
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
        assert.deepEqual((await anna.locator("td.teacher-number").allInnerTexts()).map((text) => text.trim()), ["2/27", "1", "250", "10"], "alte Datei ohne Tabelle: 5 NAGOLD je Abschluss");
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
        assert.ok(csv.includes("\"XP\";\"NAGOLD\";"), "Spalte NAGOLD in der CSV");
        assert.match(csv, /"anna\.bei";"WGW EK1";"[^"]+";2;1;250;10;/, "Zahlen als Zahlen, damit Excel rechnen kann (auch negative NAGOLD)");
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

    await check("Übersicht und Quellen: Symbole mittig, Kartennummern frei, Lehrkräfte-Bereich", async () => {
      for (const viewport of [{ width: 1536, height: 900 }, { width: 1100, height: 900 }, { width: 390, height: 844 }]) {
        const { context, page, errors } = await open(browser, "index.html", { state: profileState, viewport });
        try {
          // Plus und Minus sind gezeichnete Balken und sitzen in der Mitte des Knopfs.
          const symbols = await page.evaluate(() => [...document.querySelectorAll(".home-disclosure-symbol")].map((element) => {
            const before = getComputedStyle(element, "::before");
            return { inner: element.clientWidth, left: parseFloat(before.left), top: parseFloat(before.top), content: before.content, width: parseFloat(before.width) };
          }));
          assert.ok(symbols.length >= 2, "Aufklapp-Symbole vorhanden");
          for (const symbol of symbols) {
            assert.equal(symbol.content, '""', "kein Schriftzeichen als Symbol");
            assert.ok(Math.abs(symbol.left - symbol.inner / 2) <= 0.5 && Math.abs(symbol.top - symbol.inner / 2) <= 0.5, `Symbol mittig bei ${viewport.width} px`);
            assert.ok(symbol.width >= 12, "Balken sichtbar");
          }
          assert.equal(await page.locator('.site-footer a[href="lehrkraft.html"]').count(), 0, "kein Lehrkräfte-Link im Seitenfuß");
          await page.goto(base + "index.html#quellen");
          await page.locator(".source-card").first().waitFor();
          // Die große Kartennummer darf keine Textzeile der Karte berühren.
          const hits = await page.evaluate(() => [...document.querySelectorAll(".source-card")].flatMap((card) => {
            const number = card.querySelector(".source-number").getBoundingClientRect();
            return [...card.querySelectorAll("h2, p, a, li")].filter((element) => {
              const range = document.createRange();
              range.selectNodeContents(element);
              return [...range.getClientRects()].some((rect) => rect.right > number.left && rect.left < number.right && rect.bottom > number.top && rect.top < number.bottom);
            }).map((element) => element.textContent.trim().slice(0, 30));
          }));
          assert.deepEqual(hits, [], `Kartennummer überdeckt Text bei ${viewport.width} px`);
          const teacher = page.locator('.teacher-section a[href="lehrkraft.html"]');
          assert.equal(await teacher.isVisible(), true, "Klassenübersicht unter Quellen");
          assert.deepEqual(errors, []);
        } finally { await context.close(); }
      }
    });

    await check("NAGOLD: Tabelle im Profil, Abschluss bucht 5, Klassenübersicht und Lernnachweis", async () => {
      // Alter Lernstand ohne Tabelle: L1.1 abgeschlossen, L1.2 fertig zum Abschließen.
      const ready = { completed: false, teacherChecked: true, masteryPassed: true, checks: [true, true, true, true, true, true] };
      const old = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "nag", profiles: [{ id: "nag", name: "nag.old", className: "WGW EK1",
        progress: { "l1-1": { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] }, "l1-2": ready } }] });
      const { context, page, errors } = await open(browser, "index.html", { state: old });
      const stored = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].nagoldEntries, KEY);
      try {
        assert.equal((await page.locator("#profile-nagold").innerText()).trim(), "· 5 NAG", "alter Stand: 5 NAGOLD im Profilknopf");
        await page.locator("#profile-button").click();
        assert.equal(await page.locator("#nagold-total-value").innerText(), "5 NAGOLD");
        await page.locator("#nagold-total").click();
        assert.equal(await page.locator("#nagold-dialog").evaluate((dialog) => dialog.open), true);
        assert.equal(await page.locator("#nagold-rows tr").count(), 1);
        assert.match(await page.locator("#nagold-rows tr").first().innerText(), /Nicht erfasst[\s\S]*L1\.1 · /, "kein erfundenes Datum");

        // Wie in WorkbenchLab 0.48.0: kein Speichern-Knopf, gültige Zeilen werden sofort gespeichert.
        assert.equal(await page.locator("#nagold-save-button").count(), 0);
        await page.locator("#nagold-add-button").click();
        const row = page.locator("#nagold-rows tr").nth(1);
        assert.match(await row.locator('[data-nagold-field="date"]').inputValue(), /^\d{4}-\d{2}-\d{2}$/);
        assert.match(await row.locator('[data-nagold-field="time"]').inputValue(), /^\d{2}:\d{2}$/);
        assert.equal(await row.locator("select").count(), 0, "keine zweite Zeile mit Auswahlfeld");
        assert.equal(await row.locator('[data-nagold-field="points"]').inputValue(), "0", "neue Zeile beginnt bei 0");
        // Ein Feld „Wofür“ mit Vorschlagsliste: tippen filtert, Auswahl übernimmt.
        await row.locator('[data-nagold-field="purpose"]').pressSequentially("Prä");
        assert.deepEqual(await row.locator(".nagold-combo-list li:visible").allInnerTexts(), ["Präsentation"]);
        await row.locator('[data-nagold-option="Präsentation"]').click();
        assert.equal(await row.locator('[data-nagold-field="purpose"]').inputValue(), "Präsentation");
        // 0 Punkte: unvollständig, nichts gespeichert, Hinweis sichtbar.
        assert.match(await page.locator("#nagold-error").innerText(), /Unvollständige Zeilen sind noch nicht gespeichert.*−10 bis 5/);
        assert.equal(await page.evaluate((key) => "nagoldEntries" in JSON.parse(localStorage.getItem(key)).profiles[0], KEY), false, "unvollständig: nichts geschrieben");
        await row.locator('[data-nagold-field="points"]').fill("6");
        assert.equal(await page.evaluate((key) => "nagoldEntries" in JSON.parse(localStorage.getItem(key)).profiles[0], KEY), false, "6 Punkte werden nicht gespeichert");
        await row.locator('[data-nagold-field="points"]').fill("-11");
        assert.equal(await page.evaluate((key) => "nagoldEntries" in JSON.parse(localStorage.getItem(key)).profiles[0], KEY), false, "−11 Punkte werden nicht gespeichert");
        await row.locator('[data-nagold-field="points"]').fill("-10");
        assert.deepEqual((await stored()).map((entry) => entry.points), [5, -10], "Abzug bis −10 sofort gespeichert");
        assert.equal(await page.locator("#nagold-sum").innerText(), "-5 NAGOLD gesamt");
        assert.equal(await page.locator("#nagold-error").innerText(), "");
        await row.locator('[data-nagold-field="points"]').fill("3");
        assert.deepEqual((await stored()).map((entry) => entry.points), [5, 3]);
        assert.equal(await page.locator("#nagold-sum").innerText(), "8 NAGOLD gesamt");

        // „Anwesenheit“ füllt 2 NAGOLD vor und wird sofort gespeichert.
        await page.locator("#nagold-add-button").click();
        const attendance = page.locator("#nagold-rows tr").nth(2);
        await attendance.locator('[data-nagold-field="purpose"]').pressSequentially("Anw");
        await attendance.locator('[data-nagold-option="Anwesenheit"]').click();
        assert.equal(await attendance.locator('[data-nagold-field="points"]').inputValue(), "2");
        assert.deepEqual((await stored()).map((entry) => [entry.purpose, entry.points]).slice(1), [["Präsentation", 3], ["Anwesenheit", 2]]);

        // Schließen nimmt nichts zurück; eine leere neue Zeile wird nicht gespeichert.
        await page.locator("#nagold-add-button").click();
        await page.locator("#nagold-dialog [data-close-dialog]").click();
        assert.equal(await page.locator("#nagold-total-value").innerText(), "10 NAGOLD");
        assert.match(await page.locator("#nagold-total").getAttribute("aria-label"), /^10 NAGOLD: Tabelle bearbeiten$/);
        await page.locator("#nagold-total").click();
        assert.equal(await page.locator("#nagold-rows tr").count(), 3, "drei gespeicherte Zeilen, die leere fehlt");

        // HTML bleibt Text; Doppelklick bearbeitet; eine unvollständige Korrektur behält den letzten gültigen Wert.
        await page.locator("#nagold-add-button").click();
        await page.locator('#nagold-rows tr:last-child [data-nagold-field="purpose"]').fill("<b>Mitarbeit</b>");
        await page.locator('#nagold-rows tr:last-child [data-nagold-field="points"]').fill("4");
        await page.locator("#nagold-dialog [data-close-dialog]").click();
        await page.locator("#nagold-total").click();
        assert.equal(await page.locator("#nagold-rows b").count(), 0, "Text wird nicht als HTML eingefügt");
        await page.locator("#nagold-rows tr").nth(1).locator("td").nth(2).dblclick();
        await page.locator('#nagold-rows tr:nth-child(2) [data-nagold-field="points"]').fill("1");
        assert.deepEqual((await stored()).map((entry) => entry.points), [5, 1, 2, 4]);
        await page.locator('#nagold-rows tr:nth-child(2) [data-nagold-field="points"]').fill("");
        assert.deepEqual((await stored()).map((entry) => entry.points), [5, 1, 2, 4], "letzter gültiger Wert bleibt");
        assert.match(await page.locator("#nagold-error").innerText(), /Bisherige gültige Einträge bleiben erhalten/);

        // Löschen wirkt sofort, auch bei der automatischen Zeile.
        for (let index = 0; index < 3; index++) await page.locator('[data-nagold-remove="0"]').click();
        assert.deepEqual((await stored()).map((entry) => [entry.purpose, entry.points]), [["<b>Mitarbeit</b>", 4]], "gelöschte Zeilen bleiben gelöscht");
        assert.equal(await page.locator("#nagold-error").innerText(), "");
        await page.locator("#nagold-dialog [data-close-dialog]").click();
        assert.equal(await page.locator("#nagold-total-value").innerText(), "4 NAGOLD");
        assert.deepEqual(errors, []);

        // Abschluss von L1.2 bucht genau einmal 5 NAGOLD mit Datum und Uhrzeit.
        await page.goto(base + "l1-2.html");
        await page.locator("#page-complete-button").click();
        assert.match(await page.locator("#toast-region").innerText(), /\+100 XP, \+5 NAGOLD\. Jetzt über das Disketten-Symbol speichern\./);
        let entries = await stored();
        assert.deepEqual(entries.map((entry) => [entry.lessonId || "", entry.points]), [["", 4], ["l1-2", 5]]);
        assert.match(entries[1].date, /^\d{4}-\d{2}-\d{2}$/);
        assert.match(entries[1].time, /^\d{2}:\d{2}$/);
        await page.locator("#page-complete-button").click();
        await page.locator("#page-complete-button").click();
        assert.equal((await stored()).length, 2, "wieder öffnen und erneut abschließen bucht nicht doppelt");
        await page.reload();
        assert.equal((await stored()).length, 2, "Neuladen bucht nichts");

        // Lernnachweis und Speicherdatei tragen die Summe.
        await page.goto(base + "nachweis.html");
        assert.equal(await page.locator("#certificate-nagold").innerText(), "9");
        // Das X im Lernnachweis führt zurück in die Profil-Übersicht.
        await page.locator("#certificate-close").click();
        await page.waitForURL(/index\.html/);
        await page.locator("#manager-dialog[open]").waitFor();
        assert.equal(await page.evaluate(() => sessionStorage.getItem("excelLab.openProfile")), null, "Merker verbraucht");
        await page.locator("#manager-dialog [data-close-dialog]").click();
        // Disketten-Symbol direkt links vom Profil; Speichern und Laden nur noch dort.
        assert.equal(await page.evaluate(() => document.querySelector("#profile-button").previousElementSibling.id), "save-button");
        await page.locator("#save-button").click();
        assert.match(await page.locator("#save-status").innerText(), /nag\.old · WGW EK1 · 200 XP · 9 NAGOLD · 2\/27 erledigt/);
        assert.equal(await page.locator("#save-dialog .save-dialog-notes").count(), 0, "Erklärungen nur noch als Tooltip");
        assert.equal(await page.locator("#export-tip").evaluate((tip) => getComputedStyle(tip).opacity), "0");
        await page.locator("#export-button").hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector("#export-tip")).opacity === "1");
        assert.match(await page.locator("#export-tip").innerText(), /Download-Ordner/);
        assert.match(await page.locator("#import-tip").innerText(), /früher gespeicherte Datei/);
        assert.equal(await page.locator("#recent-saves-box").isHidden(), true, "vor dem ersten Speichern keine Liste");
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#export-button").click()]);
        const payload = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
        assert.equal(payload.exportedBy.nagold, 9);
        assert.equal(payload.profile.nagoldEntries.length, 2);
        // Zuletzt gespeichert: Der Stand steht in der Liste und lässt sich daraus laden.
        assert.equal(await page.locator("#recent-saves-box").isVisible(), true);
        assert.equal(await page.locator("#recent-saves option").count(), 1);
        assert.match(await page.locator("#recent-saves option").first().innerText(), /nag\.old · 200 XP · 9 NAGOLD/);
        await page.evaluate((key) => { const state = JSON.parse(localStorage.getItem(key)); state.profiles[0].nagoldEntries = []; localStorage.setItem(key, JSON.stringify(state)); }, KEY);
        await page.reload();
        await page.waitForFunction(() => document.querySelector("#profile-nagold")?.textContent.trim() === "· 0 NAG");
        await page.locator("#save-button").click();
        await page.locator("#recent-load").click();
        await page.waitForFunction(() => document.querySelector("#profile-nagold").textContent.trim() === "· 9 NAG");
        assert.equal((await stored()).length, 2, "Stand aus der Liste wiederhergestellt");
        for (let index = 0; index < 6; index++) await page.locator("#export-button").click();
        assert.equal(await page.locator("#recent-saves option").count(), 5, "höchstens fünf Stände");
        await page.locator("#save-dialog [data-close-dialog]").click();
        // Profilfenster: XP, Level und der Weg zu den nächsten NAGOLD.
        await page.locator("#profile-button").click();
        assert.equal(await page.locator("#xp-panel #xp-total").innerText(), "200 XP");
        assert.equal(await page.locator("#xp-level").innerText(), "Level 1");
        assert.equal(await page.locator("#xp-next").innerText(), "Noch 300 XP bis Level 2");
        // Wenig Text im Profil: Erklärungen stehen in Tooltips und erscheinen erst beim Darüberfahren.
        assert.equal(await page.locator("#nagold-tip").evaluate((tip) => tip.textContent), "Noch 91 NAGOLD bis zum Jahresziel (100). Die nächsten 5 NAGOLD gibt es für den Abschluss von L1.3.");
        assert.equal(await page.locator("#nagold-goal-text").innerText(), "9 / 100 · Jahresziel");
        assert.equal(await page.locator("#xp-breakdown").evaluate((tip) => getComputedStyle(tip).opacity), "0");
        await page.locator("#xp-total").hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector("#xp-breakdown")).opacity === "1");
        assert.equal(await page.locator("#xp-breakdown").innerText(), "2 von 27 Einheiten: 200 XP · 0 von 54 Bonusaufgaben: 0 XP");
        assert.equal(await page.locator("#manager-dialog .xp-rule").count(), 0);
        assert.doesNotMatch(await page.locator("#profile-list").innerText(), /Browser-ID|XP|NAGOLD|Aktiv/, "Profilkarte nur mit Kürzel, Klasse, Fortschritt");
        // Profilkarte oben, darunter XP und NAGOLD als gleich hohe Felder nebeneinander.
        const layout = await page.evaluate(() => { const r = (selector) => document.querySelector(selector).getBoundingClientRect(); return { card: r("#profile-list"), form: r("#profile-edit-form"), xp: r("#xp-panel"), nagold: r("#nagold-total") }; });
        assert.ok(layout.card.bottom <= layout.form.top && layout.form.bottom <= layout.xp.top, "Reihenfolge: Profil, Felder, XP/NAGOLD");
        assert.ok(Math.abs(layout.xp.height - layout.nagold.height) <= 1 && Math.abs(layout.xp.top - layout.nagold.top) <= 1, "XP und NAGOLD gleich hoch");
        const dialogBox = await page.locator("#manager-dialog").evaluate((dialog) => ({ scroll: dialog.scrollHeight, client: dialog.clientHeight }));
        assert.ok(dialogBox.scroll <= dialogBox.client + 1, "Profilfenster ohne Rollbalken bei 900 px Höhe");
        assert.equal(await page.locator("#profile-button .profile-label").isHidden(), true, "Text „Profil“ entfällt mit Profil");
        assert.match(await page.locator("#profile-stats").innerText(), /^200 XP · 9 NAG$/);
        await page.locator("#manager-dialog [data-close-dialog]").click();

        // Klassenübersicht zeigt die Summe aus der Datei.
        await page.goto(base + "lehrkraft.html");
        await page.setInputFiles("#teacher-files", [{ name: "nag.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) }]);
        await page.locator("#teacher-table tbody tr").first().waitFor();
        assert.equal(await page.locator("#teacher-table tbody .teacher-nagold").first().innerText(), "9");
        // Ein Klick auf die Zahl zeigt die Einträge der Person, nur lesend und als Text.
        await page.locator("#teacher-table tbody .teacher-nagold-button").first().click();
        const teacherDialog = page.locator("#teacher-nagold-dialog");
        assert.equal(await teacherDialog.evaluate((dialog) => dialog.open), true);
        assert.match(await teacherDialog.locator("h2").innerText(), /NAGOLD · nag\.old \(WGW EK1\)/);
        assert.equal(await teacherDialog.locator("tbody tr").count(), 2);
        assert.equal(await teacherDialog.locator("tbody b").count(), 0, "Text aus der Datei wird nicht als HTML eingefügt");
        assert.match(await teacherDialog.locator("tbody").innerText(), /<b>Mitarbeit<\/b>[\s\S]*4[\s\S]*L1\.2 · /);
        assert.match(await teacherDialog.locator(".nagold-intro").innerText(), /2 Einträge, davon 1 automatisch/);
        assert.equal(await teacherDialog.locator(".teacher-nagold-sum").innerText(), "9 NAGOLD gesamt");
        assert.equal(await teacherDialog.locator("input, [contenteditable]").count(), 0, "nur lesend");
        await teacherDialog.locator(".dialog-close").click();
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("NAGOLD auf der Lernseite: dieselbe Tabelle wie auf der Startseite", async () => {
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const seeded = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "nl", profiles: [{ id: "nl", name: "nag.les", className: "WGW EK1", progress: { "l1-1": done } }] });
      const { context, page, errors } = await open(browser, "l1-2.html", { state: seeded });
      try {
        // Das Fenster besteht von Anfang an; der Verweis des NAGOLD-Knopfs zeigt nicht ins Leere.
        assert.equal(await page.locator("#nagold-dialog").count(), 1);
        await page.locator("#lesson-profile-link").click();
        assert.equal(await page.locator("#nagold-total").getAttribute("aria-controls"), "nagold-dialog");
        await page.locator("#nagold-total").click();
        assert.equal(await page.locator("#nagold-dialog").evaluate((dialog) => dialog.open), true);
        assert.match(await page.locator("#nagold-rows tr").first().innerText(), /Nicht erfasst[\s\S]*L1\.1 · /);
        assert.equal(await page.locator("#nagold-dialog datalist").count(), 0, "keine Browser-Vorschlagsliste");
        assert.equal(await page.locator("#nagold-rows .nagold-icon-button svg").count(), 2, "gezeichnete Symbole statt Schriftzeichen");
        await page.locator("#nagold-add-button").click();
        const row = page.locator("#nagold-rows tr").nth(1);
        await row.locator('[data-nagold-field="purpose"]').pressSequentially("Mit");
        await row.locator('[data-nagold-option="Mitarbeit"]').click();
        await row.locator('[data-nagold-field="points"]').fill("2");
        await page.locator("#nagold-dialog [data-close-dialog]").click();
        assert.equal(await page.locator("#nagold-dialog").evaluate((dialog) => dialog.open), false);
        const entries = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].nagoldEntries, KEY);
        assert.deepEqual(entries.map((entry) => [entry.purpose.slice(0, 9), entry.points]), [["L1.1 · Ei", 5], ["Mitarbeit", 2]]);
        assert.match(await page.locator("#nagold-total-value").innerText(), /^7 NAGOLD$/);
        assert.equal((await page.locator("#profile-nagold").innerText()).trim(), "· 7 NAG");
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Speichern und Laden auf der Lernseite: Datei, Liste, Rückfrage, gemeinsam mit der Startseite", async () => {
      // Codex, 15.10.2026: lesson-save.js; feste Prüfung ergänzt von Claude, 16.10.2026.
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const seeded = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "ls", profiles: [{ id: "ls", name: "sav.les", className: "WGW EK1",
        progress: { "l1-1": done, "l1-2": done }, nagoldEntries: [{ date: "2026-10-15", time: "08:10", purpose: "Mitarbeit", points: 3 }] }] });
      const { context, page, errors } = await open(browser, "l1-3.html", { state: seeded });
      const state = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
      try {
        // Disketten-Symbol direkt neben dem Farbschema-Schalter.
        assert.equal(await page.evaluate(() => document.querySelector("#save-button")?.previousElementSibling?.id), "lesson-theme-toggle");
        await page.locator("#save-button").click();
        assert.match(await page.locator("#save-status").innerText(), /sav\.les · WGW EK1 · 200 XP · 3 NAGOLD · 2\/27 erledigt/);
        assert.equal(await page.locator("#recent-saves-box").isHidden(), true);
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#export-button").click()]);
        assert.match(download.suggestedFilename(), /^\d{4}-\d{2}-\d{2}_Excel-Lab_sav\.les_XL-[A-Z0-9]+\.json$/);
        const payload = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
        assert.equal(payload.app, "Excel-Lab");
        assert.equal(payload.version, 1);
        assert.equal(payload.exportedBy.points, 200);
        assert.equal(payload.exportedBy.nagold, 3);
        assert.equal(payload.profile.progress["l1-2"].completed, true);
        assert.equal(await page.locator("#recent-saves option").count(), 1, "Stand in „Zuletzt gespeichert“");

        // Weniger Abschlüsse in der Datei: Rückfrage; Abbrechen lässt alles, wie es ist.
        const older = { ...payload, profile: { ...payload.profile, progress: { "l1-1": done } } };
        page.once("dialog", (dialog) => dialog.dismiss());
        await page.setInputFiles("#import-file", { name: "alt.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(older)) });
        await page.waitForFunction(() => /abgebrochen/.test(document.querySelector("#save-feedback")?.textContent || ""));
        assert.equal((await state()).profiles[0].progress["l1-2"].completed, true, "Abbrechen ändert nichts");

        // Ungültige Datei: Meldung, Lernstand unverändert.
        const before = JSON.stringify(await state());
        await page.setInputFiles("#import-file", { name: "fremd.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "Anderes" })) });
        await page.waitForFunction(() => /Keine gültige Excel-Lab-Exportdatei/.test(document.querySelector("#save-feedback")?.textContent || ""));
        assert.equal(JSON.stringify(await state()), before);

        // Aus der Liste laden stellt den gespeicherten Stand wieder her, NAGOLD eingeschlossen.
        await page.evaluate((key) => { const s = JSON.parse(localStorage.getItem(key)); s.profiles[0].nagoldEntries = []; localStorage.setItem(key, JSON.stringify(s)); }, KEY);
        await page.locator("#recent-load").click();
        await page.waitForFunction(() => /erfolgreich geladen/.test(document.querySelector("#save-feedback")?.textContent || ""));
        const restored = (await state()).profiles;
        assert.equal(restored.length, 1, "dieselbe Person wird ersetzt");
        assert.deepEqual(restored[0].nagoldEntries.map((entry) => entry.points), [3]);
        assert.equal(restored[0].id, "ls", "Kennung bleibt");
        assert.match(await page.locator("#profile-stats").innerText(), /200 XP · 3 NAG/);

        // Die Liste ist dieselbe wie auf der Startseite.
        await page.goto(base + "index.html");
        await page.locator("#save-button").click();
        assert.equal(await page.locator("#recent-saves option").count(), 1);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    });

    await check("Profilfenster auf der Lernseite: Kürzel und Klasse ändern, Format, Profilwechsel", async () => {
      // Codex, 14.10.2026: Profilfenster auf allen Lernseiten; feste Prüfung ergänzt von Claude, 16.10.2026.
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const seeded = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "pa", profiles: [
        { id: "pa", name: "pro.les", className: "WGW EK1", progress: { "l1-1": done } },
        { id: "pb", name: "oth.pro", className: "WGW EK2", progress: {} }] });
      const { context, page, errors } = await open(browser, "l1-2.html", { state: seeded });
      const profiles = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles, KEY);
      try {
        await page.locator("#lesson-profile-link").click();
        const dialog = page.locator("#manager-dialog");
        assert.equal(await dialog.evaluate((element) => element.open), true, "Profilfenster statt Seitenwechsel");
        assert.equal(page.url().endsWith("l1-2.html"), true);
        assert.match(await page.locator("#profile-list").innerText(), /pro\.les[\s\S]*WGW EK1 · 1\/27 erledigt/);
        assert.equal(await page.locator("#profile-edit-name").inputValue(), "pro.les");
        // Gleiche Anordnung wie auf der Startseite: Karte, Felder, XP neben NAGOLD, Lernnachweis.
        const layout = await page.evaluate(() => { const r = (selector) => document.querySelector(selector).getBoundingClientRect(); return { card: r("#profile-list"), form: r("#profile-edit-form"), xp: r("#xp-panel"), nagold: r("#nagold-total"), certificate: r("#certificate-link") }; });
        assert.ok(layout.card.bottom <= layout.form.top && layout.form.bottom <= layout.xp.top && layout.xp.bottom <= layout.certificate.top);
        assert.ok(Math.abs(layout.xp.top - layout.nagold.top) <= 1 && Math.abs(layout.xp.height - layout.nagold.height) <= 1);

        // Falsches Format: nichts gespeichert.
        await page.locator("#profile-edit-name").fill("Falsch");
        await page.locator("#profile-edit-name").dispatchEvent("change");
        assert.equal((await profiles())[0].name, "pro.les", "ungültiges Kürzel wird nicht gespeichert");
        assert.equal(await page.locator("#profile-edit-name").evaluate((input) => input.validity.valid), false);

        // Gültige Änderung: Kleinschreibung, Klasse in Großbuchstaben, Kopfzeile folgt, Fortschritt bleibt.
        await page.locator("#profile-edit-name").fill("NEU.LES");
        await page.locator("#profile-edit-name").dispatchEvent("change");
        await page.locator("#profile-edit-class").fill("wgw   ek3");
        await page.locator("#profile-edit-class").dispatchEvent("change");
        const saved = (await profiles())[0];
        assert.equal(saved.name, "neu.les");
        assert.equal(saved.className, "WGW EK3");
        assert.equal(saved.progress["l1-1"].completed, true, "Fortschritt unverändert");
        assert.equal((await profiles())[1].name, "oth.pro", "anderes Profil unverändert");
        await page.waitForFunction(() => /neu\.les · WGW EK3/.test(document.querySelector("#lesson-profile-name").textContent));
        assert.match(await page.locator("#lesson-profile-status").innerText(), /aktualisiert/);

        // Wechselt das Profil in einem anderen Tab, wird der offene Entwurf nicht auf das falsche Profil geschrieben.
        await page.evaluate((key) => { const s = JSON.parse(localStorage.getItem(key)); s.currentProfileId = "pb"; localStorage.setItem(key, JSON.stringify(s)); }, KEY);
        await page.locator("#profile-edit-class").fill("WGW EK9");
        await page.locator("#profile-edit-class").dispatchEvent("change");
        const after = await profiles();
        assert.equal(after[0].className, "WGW EK3", "erstes Profil bleibt");
        assert.equal(after[1].className, "WGW EK2", "zweites Profil bleibt");
        await page.waitForFunction(() => /anderes Profil ist jetzt aktiv/.test(document.querySelector("#lesson-profile-status").textContent));
        assert.equal(await page.locator("#profile-edit-name").inputValue(), "oth.pro", "Felder zeigen das jetzt aktive Profil");
        assert.equal(await page.locator("#profile-edit-class").inputValue(), "WGW EK2");
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
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

    // Release 0.27.0/0.28.0 (Wünsche Jakob vom 16.10.2026).
    await check("Alt+S, Esc, Fortschrittsbalken, Pfadleiste, Startkapital", async () => {
      const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };
      const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "s", profiles: [{ id: "s", name: "alt.ess", className: "WGW EK1", progress: { "l1-1": done, "l1-2": done, "l2-1": done }, nagoldEntries: [] }] });
      const { context, page, errors } = await open(browser, "index.html", { state });
      try {
        // Pfadleiste beginnt mit „Übersicht“, ohne „BPE1“.
        assert.equal(await page.locator("#location-path").innerText(), "Übersicht");
        // Alt+S speichert sofort, ohne das Fenster zu öffnen.
        const download = page.waitForEvent("download");
        await page.keyboard.press("Alt+s");
        assert.match((await download).suggestedFilename(), /_Excel-Lab_alt\.ess_/);
        assert.equal(await page.locator("#save-dialog").evaluate((dialog) => dialog.open), false);
        // Fortschrittsbalken: 3 von 27 = 11 %, Einzelheiten je Lernschritt auf Klick.
        await page.locator(".site-header .profile-button").click();
        const bar = page.locator("#profile-list .profile-progress");
        assert.equal(await bar.locator(".profile-progress-value").innerText(), "11 %");
        assert.equal(await bar.getAttribute("aria-expanded"), "false");
        await bar.click();
        assert.equal(await bar.getAttribute("aria-expanded"), "true");
        assert.deepEqual(await page.locator("#home-progress-detail .profile-progress-count").allInnerTexts(), ["2/6", "1/5", "0/8", "0/8"]);
        // Startkapital: vorgeschlagen, füllt 5 vor, ein zweites im selben Schuljahr wird nicht gespeichert.
        await page.locator("#nagold-total").click();
        for (let round = 0; round < 2; round++) {
          await page.locator("#nagold-add-button").click();
          const purpose = page.locator('#nagold-rows tr:last-child [data-nagold-field="purpose"]');
          if (round === 0) {
            await purpose.click();
            assert.equal(await page.locator("#nagold-rows tr:last-child [data-nagold-option]:not([hidden])").first().innerText(), "Startkapital");
          }
          await purpose.fill("Startkapital");
          assert.equal(await page.locator('#nagold-rows tr:last-child [data-nagold-field="points"]').inputValue(), "5");
        }
        assert.match(await page.locator("#nagold-error").innerText(), /nur einmal je Schuljahr/);
        const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].nagoldEntries, KEY);
        assert.deepEqual(saved.map((entry) => [entry.purpose, entry.points]), [["Startkapital", 5]]);
        assert.equal(await page.locator("#nagold-goal-text").innerText(), "5 / 100 · Jahresziel");
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
      // Lernseite: Pfad „Übersicht › L1 › L1.2“, Alt+S mit kurzer Rückmeldung.
      const lesson = await open(browser, "l1-2.html", { state });
      try {
        assert.deepEqual(await lesson.page.locator(".location-path a").allInnerTexts(), ["Übersicht", "L1", "L1.2"]);
        assert.equal(await lesson.page.locator(".location-path .lesson-score-card").count(), 1, "Fortschritt in der Pfadleiste");
        const download = lesson.page.waitForEvent("download");
        await lesson.page.keyboard.press("Alt+s");
        await download;
        await lesson.page.locator("#toast-region .toast").filter({ hasText: "Speicherdatei zum Download bereitgestellt" }).waitFor();
        assert.deepEqual(lesson.errors, []);
      } finally { await lesson.context.close(); }
      // Textmarker: markieren, nach Neuladen sichtbar, radieren (0.31.0).
      const marker = await open(browser, "l1-1.html", { state });
      try {
        const select = () => marker.page.evaluate(() => {
          const para = [...document.querySelectorAll("[data-highlight-block]")].find((e) => e.textContent.includes("Organisationsteam"));
          const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
          let node; while ((node = walker.nextNode()) && !node.textContent.includes("Organisationsteam"));
          const at = node.textContent.indexOf("Organisationsteam");
          const range = document.createRange(); range.setStart(node, at); range.setEnd(node, at + "Organisationsteam".length);
          getSelection().removeAllRanges(); getSelection().addRange(range);
        });
        await select();
        await marker.page.locator('[data-highlight-color="coral"]').click();
        assert.equal(await marker.page.locator('mark[data-study-mark="coral"]').innerText(), "Organisationsteam");
        await marker.page.reload();
        assert.equal(await marker.page.locator('mark[data-study-mark="coral"]').innerText(), "Organisationsteam", "bleibt nach Neuladen");
        const saved = await marker.page.evaluate((key) => JSON.parse(localStorage.getItem(key)).profiles[0].highlights["l1-1"], KEY);
        assert.deepEqual(saved.map((item) => [item.quote, item.color]), [["Organisationsteam", "coral"]]);
        await select();
        await marker.page.locator('[data-highlight-color="erase"]').click();
        assert.equal(await marker.page.locator("mark[data-study-mark]").count(), 0);
        assert.deepEqual(marker.errors, []);
      } finally { await marker.context.close(); }
      // Lernnachweis: Esc führt wie das X zurück und öffnet das Profil.
      const certificate = await open(browser, "nachweis.html", { state });
      try {
        await certificate.page.keyboard.press("Escape");
        await certificate.page.waitForURL(/index\.html/);
        await certificate.page.locator("#manager-dialog[open]").waitFor();
        assert.deepEqual(certificate.errors, []);
      } finally { await certificate.context.close(); }
    });
  } finally { await browser.close(); }
  assert.deepEqual(failures, []);
  console.log(`${pages.length} Seiten bei zwei Breiten und dreiundzwanzig Einzelprüfungen bestanden.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
