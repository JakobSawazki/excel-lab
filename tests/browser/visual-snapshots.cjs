"use strict";

// Bildschirmfotos aller Seiten für einen Vorher-Nachher-Vergleich: jede Seite
// in dunklem und hellem Schema bei 1280 und 390 Pixeln, ganze Seitenlänge,
// Lernseiten mit allen Abschnitten offen. Zufall (Antwortreihenfolge) und
// Datum sind festgelegt, damit zwei Läufe desselben Stands gleiche Bilder liefern.
//
// Aufruf:   node tests/browser/visual-snapshots.cjs http://127.0.0.1:4275/ <Ausgabeordner>
// Vergleich: python tests/browser/visual-compare.py <Ordner A> <Ordner B>   (braucht Pillow;
//            duldet Abweichungen um wenige Helligkeitsstufen, die Edge bei Verläufen von Lauf
//            zu Lauf erzeugt)
//            node tests/browser/visual-snapshots.cjs compare <Ordner A> <Ordner B>  (bytegleich)
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..", "..");

if (process.argv[2] === "compare") {
  const [a, b] = [process.argv[3], process.argv[4]];
  const names = fs.readdirSync(a).filter((file) => file.endsWith(".png")).sort();
  const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  const different = names.filter((name) => !fs.existsSync(path.join(b, name)) || hash(path.join(a, name)) !== hash(path.join(b, name)));
  for (const name of different) console.log("unterschiedlich:", name);
  console.log(`${names.length - different.length} von ${names.length} Bildern sind bytegleich.`);
  process.exitCode = different.length ? 1 : 0;
} else {
  const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
    || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
  const base = process.argv[2] || "http://127.0.0.1:4275/";
  const out = process.argv[3];
  if (!out) throw new Error("Ausgabeordner fehlt.");
  fs.mkdirSync(out, { recursive: true });
  const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
  const views = [...pages, "index.html#lernpfad", "index.html#formeln", "index.html#quellen"];
  const ids = pages.filter((file) => /^l\d-\d\.html$/.test(file)).map((file) => file.slice(0, -5));
  const progress = Object.fromEntries(ids.map((id, i) => [id, i < 14
    ? { completed: true, teacherChecked: true, masteryPassed: i % 3 !== 0, bonus: i % 2 === 0, bonus2: i % 4 === 0, checks: [true, true, true] }
    : i === 14 ? { checks: [true, false, false] } : {}]));

  (async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    let count = 0;
    try {
      for (const theme of ["dark", "light"]) {
        for (const width of [1280, 390]) {
          const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
          await context.addInitScript(([state]) => {
            localStorage.setItem("excelLab.state.v1", state);
            Math.random = () => 0.42;
            const fixed = new Date("2026-10-10T10:00:00+02:00").getTime();
            const RealDate = Date;
            // eslint-disable-next-line no-global-assign
            Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed; } };
          }, [JSON.stringify({ version: 1, theme, currentProfileId: "t", profiles: [{ id: "t", name: "tes.pro", className: "WGW EK1", progress }] })]);
          const page = await context.newPage();
          for (const view of views) {
            await page.goto(base + view);
            await page.evaluate(async () => {
              document.querySelectorAll("details").forEach((element) => { element.open = true; });
              for (const image of document.images) { image.loading = "eager"; if (!image.complete) await new Promise((done) => { image.onload = image.onerror = done; }); await image.decode().catch(() => {}); }
              // Videos zeigen beim Laden ein laufendes Symbol und wären in jedem Lauf anders.
              document.querySelectorAll("video, iframe").forEach((element) => { element.style.visibility = "hidden"; });
              await document.fonts.ready;
              await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
              document.querySelectorAll(".toast").forEach((toast) => toast.remove());
            });
            await page.waitForTimeout(150);
            await page.screenshot({ path: path.join(out, `${theme}_${width}_${view.replace(/[#/]/g, "_")}.png`), fullPage: true, animations: "disabled" });
            count++;
          }
          await context.close();
        }
      }
    } finally { await browser.close(); }
    console.log(`${count} Bilder in ${out}`);
  })().catch((error) => { console.error(error); process.exitCode = 1; });
}
