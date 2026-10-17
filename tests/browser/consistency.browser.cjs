"use strict";

// Einheitlichkeit aller Lernseiten (Wunsch Jakob, 16.10.2026: Design und
// Bedienung sollen sich durch alle Kapitel ziehen). Prüft je Lernseite:
// Pfadleiste „Übersicht › Lx › Lx.y“, Fortschrittsbalken mit Infofenster in der
// Pfadleiste, Textmarker-Leiste mit markierbaren Absätzen, einheitlicher
// Untertitel, keine Zeile „Lx.y · BPE … · 100 XP“, keine Skriptfehler.
//
// Aufruf: node tests/browser/consistency.browser.cjs http://127.0.0.1:4273/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..", "..");
const base = process.argv[2] || "http://127.0.0.1:4273/";
const files = fs.readdirSync(root).filter((file) => /^l\d-\d\.html$/.test(file)).sort();
const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true, true, true, true] };
const progress = Object.fromEntries(files.map((file) => [file.slice(0, -5), done]));

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const problems = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await context.addInitScript((p) => localStorage.setItem("excelLab.state.v1", JSON.stringify({ version: 1, theme: "dark", currentProfileId: "t", profiles: [{ id: "t", name: "tes.pro", className: "WGW EK1", progress: p }] })), progress);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const file of files) {
      errors.length = 0;
      await page.goto(base + file);
      await page.waitForLoadState("load");
      const code = file.slice(1, -5).replace("-", ".");
      const result = await page.evaluate(() => ({
        crumbs: [...document.querySelectorAll(".location-path a")].map((a) => a.textContent.trim()),
        score: document.querySelectorAll(".location-path .lesson-score-card").length,
        pop: document.querySelectorAll(".location-path #lesson-progress-pop").length,
        tools: document.querySelectorAll(".lesson-reading-tools [data-highlight-color]").length,
        blocks: document.querySelectorAll(".lesson-article [data-highlight-block]").length,
        subtitle: document.querySelector(".site-header .brand-copy small")?.textContent.trim(),
        oldEyebrow: /L\d\.\d\s+BPE 1\.\d · \d+ XP/.test(document.body.innerText)
      }));
      const check = (ok, message) => { if (!ok) problems.push(`${file}: ${message}`); };
      check(JSON.stringify(result.crumbs) === JSON.stringify(["Übersicht", `L${code[0]}`, `L${code}`]), `Pfadleiste ${result.crumbs.join(" › ")}`);
      check(result.score === 1 && result.pop === 1, "Fortschrittsbalken mit Infofenster fehlt");
      check(result.tools === 5, "Textmarker-Leiste unvollständig");
      check(result.blocks >= 20, `nur ${result.blocks} markierbare Absätze`);
      check(result.subtitle === "Tabellenkalkulation verstehen", `Untertitel „${result.subtitle}“`);
      check(!result.oldEyebrow, "alte Zeile „Lx.y · BPE … · 100 XP“");
      check(errors.length === 0, `Skriptfehler: ${errors.join(" | ")}`);
    }
    await context.close();
  } finally { await browser.close(); }
  assert.deepEqual(problems, []);
  console.log(`${files.length} Lernseiten einheitlich: Pfadleiste, Fortschritt, Textmarker, Untertitel.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
