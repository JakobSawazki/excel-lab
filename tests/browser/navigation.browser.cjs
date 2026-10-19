"use strict";

// Pfadleiste auf jeder Lernseite vor/nach Scrollen, mit/ohne Freischaltung.
// Nur isolierte, synthetische Browserprofile; keine Schülerdaten.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const { loadContent } = require("../helpers.cjs");
const { lessons } = loadContent();
const base = process.argv[2] || "http://127.0.0.1:4279/";
const KEY = "excelLab.state.v1";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      for (const locked of [false, true]) {
        const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width, height: 900 } });
        const progress = locked ? {} : Object.fromEntries(lessons.map(lesson => [lesson.id, { completed: true }]));
        await context.addInitScript(([key, value]) => localStorage.setItem(key, value), [KEY, JSON.stringify({ version: 1, theme: "dark", currentProfileId: "nav-test", profiles: [{ id: "nav-test", name: "nav.tes", className: "TEST", progress, nagoldEntries: [] }] })]);
        const page = await context.newPage(), errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        for (const lesson of locked ? lessons.filter(lesson => lesson.id === "l1-2") : lessons) {
          await page.goto(base + lesson.page);
          const nav = page.locator(".lesson-page-header > .lesson-breadcrumb");
          await nav.waitFor({ state: "visible" });
          assert.deepEqual(await nav.locator(":scope > a").allTextContents(), ["Übersicht", `L${lesson.stage}`, lesson.code]);
          assert.equal(await nav.locator(":scope > a").nth(0).getAttribute("href"), "index.html#uebersicht");
          assert.equal(await nav.locator(":scope > a").nth(1).getAttribute("href"), `index.html#lernpfad/${lesson.stage}`);
          assert.equal(await nav.locator('[aria-current="page"]').getAttribute("href"), lesson.page);
          const initial = await nav.boundingBox();
          await page.evaluate(() => window.scrollTo(0, 1200));
          const after = await nav.boundingBox();
          assert.ok(Math.abs(initial.y - after.y) <= 1, `${lesson.code} ${width}: Pfadleiste bleibt oben`);
          for (const anchor of await nav.locator(":scope > a").all()) {
            assert.equal(await anchor.evaluate(element => {
              const box = element.getBoundingClientRect();
              return box.top >= 0 && box.bottom < innerHeight && element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
            }), true, `${lesson.code} ${width}: Glieder sichtbar und anklickbar`);
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${lesson.code}: kein seitliches Überlaufen`);
          if (!locked && lesson.id === "l1-2") {
            // Vergrößerte Schrift und Textmarker dürfen die Pfadleiste nicht verdecken.
            await page.evaluate(() => { document.documentElement.style.fontSize = "20px"; });
            await page.waitForFunction(() => parseFloat(document.documentElement.style.getPropertyValue("--lesson-header-height")) >= document.querySelector(".lesson-page-header").getBoundingClientRect().height - 1);
            const headerBottom = await page.locator(".lesson-page-header").evaluate(element => element.getBoundingClientRect().bottom);
            const toolsTop = await page.locator(".lesson-reading-tools").evaluate(element => parseFloat(getComputedStyle(element).top));
            assert.ok(toolsTop >= headerBottom, "Textmarker bleibt unter der Kopfzeile");
            if (width === 1440) {
              const sidebarTop = await page.locator(".lesson-page-sidebar").evaluate(element => element.getBoundingClientRect().top);
              assert.ok(sidebarTop >= headerBottom, "Abschlussleiste bleibt unter der Kopfzeile");
            }
            await nav.locator(".lesson-score-card").click();
            await page.locator(".lesson-progress-pop").waitFor({ state: "visible" });
            await page.keyboard.press("Escape");
            fs.mkdirSync(path.resolve(__dirname, "../../.tmp"), { recursive: true });
            await page.screenshot({ path: path.resolve(__dirname, `../../.tmp/navigation-scrolled-${width}.png`) });
            await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
            // Echter Klick statt nur Linkprüfung: Zurück zum Lernfortschritt.
            await nav.locator(":scope > a").nth(1).click();
            await page.waitForURL(`${base}index.html#lernpfad/${lesson.stage}`);
          }
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${width}px: ${locked ? "gesperrte L1.2" : "alle 27 Lernseiten"}, Pfadleiste mitlaufend und bedienbar`);
        await context.close();
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
