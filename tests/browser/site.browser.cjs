"use strict";

// Alle 28 Seiten im echten Browser (Edge über Playwright): keine Skriptfehler,
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

const allDone = Object.fromEntries(pages.filter((file) => file !== "index.html")
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
            if (file !== "index.html") {
              assert.equal(await page.locator(`#${file.slice(0, -5).replace("-", "")}-mastery-form`).count(), 1);
              assert.match(await page.locator("#lesson-points-status").innerText(), /100 von 100/);
              assert.match(await page.locator("#lesson-profile-name").innerText(), /tes\.pro/);
            } else {
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
  console.log(`${pages.length} Seiten bei zwei Breiten und fünf Einzelprüfungen bestanden.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
