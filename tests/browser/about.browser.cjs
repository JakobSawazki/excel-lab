"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const { loadContent, read } = require("../helpers.cjs");
const { lessons } = loadContent();
const base = process.argv[2] || "http://127.0.0.1:4279/";
const html = read("index.html"), timeline = html.slice(html.indexOf('<ol class="version-timeline">'), html.indexOf("</ol>", html.indexOf('<ol class="version-timeline">')));
const versions = [...timeline.matchAll(/<li><span>([\d.]+)<\/span>/g)].map(match => match[1]);

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await context.addInitScript(progress => localStorage.setItem("excelLab.state.v1", JSON.stringify({ version: 1, theme: "dark", currentProfileId: "about-test", profiles: [{ id: "about-test", name: "inf.tes", className: "TEST", progress, nagoldEntries: [] }] })), Object.fromEntries(lessons.map(lesson => [lesson.id, { completed: true }])));
      let failFetch = false;
      await page.route("**/*", route => {
        if (!route.request().url().startsWith(base)) return route.abort();
        if (failFetch && route.request().resourceType() === "fetch" && new URL(route.request().url()).pathname.endsWith("/index.html")) return route.fulfill({ status: 503, body: "Unavailable" });
        return route.continue();
      });
      for (const file of ["index.html", ...lessons.map(lesson => lesson.page)]) {
        await page.goto(base + file);
        const logo = page.locator(".site-footer .footer-brand");
        await logo.scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => ({ y: scrollY, url: location.href }));
        await logo.click();
        const dialog = page.locator("#about-dialog");
        await dialog.waitFor({ state: "visible" });
        const bounds = await dialog.evaluate(element => {
          const box = element.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, position: getComputedStyle(element).position, height: innerHeight, width: innerWidth };
        });
        assert.ok(bounds.top >= 0 && bounds.bottom <= bounds.height + 1 && bounds.left >= 0 && bounds.right <= bounds.width + 1, `Dialog im sichtbaren Bildschirm: ${JSON.stringify(bounds)}`);
        assert.equal(page.url(), before.url);
        assert.ok(Math.abs(await page.evaluate(() => scrollY) - before.y) < 2, `${file}: kein Sprung beim Öffnen`);
        assert.deepEqual(await dialog.locator(".version-timeline > li > span").allTextContents(), versions, "alle Versionsstände vollständig und unverändert");
        assert.equal(await dialog.locator(".version-group[open]").count(), 0);
        assert.deepEqual(await dialog.locator(".version-group > summary > span:first-child").allTextContents(), ["0.3x", "0.2x", "0.1x", "0.0x"]);
        const summary = dialog.locator(".version-group > summary").first();
        assert.equal(await summary.locator("span").first().textContent(), "0.3x");
        const geometry = await summary.locator(".version-group-icon").evaluate(element => {
          const box = element.getBoundingClientRect(), border = getComputedStyle(element);
          return ["::before", "::after"].map(pseudo => {
            const style = getComputedStyle(element, pseudo), transform = new DOMMatrixReadOnly(style.transform);
            const width = parseFloat(style.width), height = parseFloat(style.height);
            return { width, height,
              x: parseFloat(border.borderLeftWidth) + parseFloat(style.left) + transform.e + width / 2 - box.width / 2,
              y: parseFloat(border.borderTopWidth) + parseFloat(style.top) + transform.f + height / 2 - box.height / 2 };
          });
        });
        assert.ok(geometry[0].width > geometry[0].height && geometry[1].height > geometry[1].width, "Plus aus horizontalem und vertikalem Strich");
        assert.ok(geometry.every(line => Math.abs(line.x) < .6 && Math.abs(line.y) < .6), "beide Striche im Kreismittelpunkt");
        await summary.click();
        assert.equal(await dialog.locator(".version-group[open]").count(), 1);
        assert.equal(await summary.locator(".version-group-icon").evaluate(element => getComputedStyle(element, "::after").display), "none", "Minus ohne vertikalen Strich");
        await summary.focus(); await page.keyboard.press("Enter");
        assert.equal(await dialog.locator(".version-group[open]").count(), 0);
        await page.keyboard.press("Escape");
        await dialog.waitFor({ state: "hidden" });
        await page.waitForFunction(y => Math.abs(scrollY - y) < 2, before.y);
        const afterClose = await page.evaluate(() => ({ y: scrollY, active: document.activeElement?.outerHTML.slice(0, 120) }));
        assert.ok(Math.abs(afterClose.y - before.y) < 2, `${file}: kein Sprung beim Schließen (${before.y} → ${afterClose.y}, ${afterClose.active})`);
        assert.equal(await logo.evaluate(element => document.activeElement === element), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
        if (file === "l1-1.html") {
          if (width === 390) await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
          await logo.click(); await dialog.waitFor({ state: "visible" });
          fs.mkdirSync(path.resolve(__dirname, "../../.tmp"), { recursive: true });
          await page.screenshot({ path: path.resolve(__dirname, `../../.tmp/about-${width}.png`) });
          await dialog.locator(".dialog-close").click();
          await dialog.waitFor({ state: "hidden" });
          await page.waitForFunction(y => Math.abs(scrollY - y) < 2, before.y);
          assert.ok(Math.abs(await page.evaluate(() => scrollY) - before.y) < 2);
        }
      }
      // Ladefehler darf nicht zur Startseite springen; erneuter Versuch funktioniert.
      await page.goto(base + "l1-2.html");
      const logo = page.locator(".site-footer .footer-brand");
      await logo.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => ({ y: scrollY, url: location.href }));
      failFetch = true; await logo.click();
      await page.locator(".toast").filter({ hasText: "Informationen konnten nicht geladen werden" }).waitFor();
      assert.equal(page.url(), before.url);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - before.y) < 2);
      failFetch = false; await logo.click(); await page.locator("#about-dialog").waitFor({ state: "visible" });
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: Startseite + 27 Lernseiten, Scrollposition, alle Versionen, Plus/Minus, Tastatur, erneutes Öffnen und Ladefehler`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
