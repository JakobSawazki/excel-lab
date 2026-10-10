"use strict";

// Zugänglichkeit auf allen 28 Seiten: vorlesbare Namen aller Bedienelemente,
// Überschriften ohne übersprungene Ebene, genau eine h1, Sprache gesetzt,
// gültige ARIA-Verweise, und alles Bedienbare ist mit Tab erreichbar.
//
// Aufruf: node tests/browser/a11y.browser.cjs http://127.0.0.1:4273/ [report]
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..", "..");
const base = process.argv[2] || "http://127.0.0.1:4273/";
const report = process.argv[3] === "report";
const files = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
const views = [...files, "index.html#lernpfad", "index.html#formeln", "index.html#quellen"];
const done = { completed: true, teacherChecked: true, masteryPassed: false, checks: [true, true, true] };
const progress = Object.fromEntries(files.filter((f) => f !== "index.html").map((f) => [f.slice(0, -5), done]));
const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "t", profiles: [{ id: "t", name: "tes.pro", className: "WGW EK1", progress }] });
const CONTROLS = "a[href], button, input:not([type=hidden]), select, textarea, summary";

function audit(controlsSelector) {
  const problems = [];
  const visible = (element) => {
    if (element.closest("[hidden], dialog:not([open]), [aria-hidden=true]")) return false;
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  };
  const describe = (element) => element.tagName.toLowerCase() + (element.id ? "#" + element.id : "")
    + (typeof element.className === "string" && element.className ? "." + element.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  const name = (element) => {
    const labelled = (element.getAttribute("aria-labelledby") || "").split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
    if (labelled) return labelled;
    const label = (element.getAttribute("aria-label") || "").trim();
    if (label) return label;
    if (element.labels && element.labels.length) return Array.from(element.labels).map((item) => item.textContent).join(" ").trim();
    if (element.tagName === "IFRAME") return element.title;
    const text = (element.textContent || "").trim();
    if (text) return text;
    const image = element.querySelector("img[alt]");
    return image && image.alt ? image.alt : (element.title || "").trim();
  };
  if (!document.documentElement.lang) problems.push("html ohne lang");
  if (!document.title.trim()) problems.push("Seite ohne Titel");
  const controls = Array.from(document.querySelectorAll(controlsSelector + ", iframe")).filter(visible);
  for (const element of controls) if (!name(element)) problems.push("ohne Namen: " + describe(element));
  for (const image of document.querySelectorAll("img")) if (!image.hasAttribute("alt")) problems.push("img ohne alt: " + image.getAttribute("src"));
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).filter(visible);
  const h1 = headings.filter((heading) => heading.tagName === "H1");
  if (h1.length !== 1) problems.push(h1.length + " sichtbare h1");
  let previous = 0;
  for (const heading of headings) {
    const level = Number(heading.tagName[1]);
    if (previous && level > previous + 1) problems.push("Überschrift springt von h" + previous + " auf h" + level + ": " + heading.textContent.trim().slice(0, 40));
    previous = level;
  }
  const counts = {};
  for (const element of document.querySelectorAll("[id]")) counts[element.id] = (counts[element.id] || 0) + 1;
  for (const id of Object.keys(counts)) if (counts[id] > 1) problems.push("doppelte ID #" + id);
  for (const attribute of ["aria-controls", "aria-labelledby", "aria-describedby"]) {
    for (const element of document.querySelectorAll("[" + attribute + "]")) {
      for (const id of element.getAttribute(attribute).split(/\s+/).filter(Boolean)) {
        if (!document.getElementById(id)) problems.push(attribute + " zeigt auf fehlende #" + id + " (" + describe(element) + ")");
      }
    }
  }
  return { problems, focusable: controls.length };
}

function unreached(controlsSelector) {
  return Array.from(document.querySelectorAll(controlsSelector)).filter((element) => {
    if (element.dataset.a11yKey || element.disabled || element.getAttribute("tabindex") === "-1" || element.getAttribute("aria-disabled") === "true") return false;
    if (element.closest("[hidden], dialog:not([open])")) return false;
    // In einer Radiogruppe hält Tab nur bei einem Eintrag; die übrigen erreichen die Pfeiltasten.
    if (element.type === "radio" && Array.from(document.querySelectorAll("input[type=radio]")).some((other) => other.name === element.name && other.dataset.a11yKey)) return false;
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  }).map((element) => element.tagName.toLowerCase() + (element.id ? "#" + element.id : "") + "." + String(element.className).split(" ")[0]);
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const all = new Map();
  let checked = 0;
  try {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
    await context.addInitScript((value) => localStorage.setItem("excelLab.state.v1", value), state);
    const page = await context.newPage();
    for (const view of views) {
      await page.goto(base + view);
      await page.evaluate(() => document.querySelectorAll("details").forEach((element) => { element.open = true; }));
      await page.waitForTimeout(100);
      const result = await page.evaluate(audit, CONTROLS);
      checked++;
      await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); window.scrollTo(0, 0); });
      const seen = new Set();
      let repeats = 0;
      for (let i = 0; i < result.focusable + 40 && repeats < 3; i++) {
        await page.keyboard.press("Tab");
        const key = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element || element === document.body) return "body";
          if (!element.dataset.a11yKey) element.dataset.a11yKey = String(Math.random());
          return element.dataset.a11yKey;
        });
        if (seen.has(key)) repeats++; else seen.add(key);
      }
      for (const item of new Set(await page.evaluate(unreached, CONTROLS))) result.problems.push("mit Tab nicht erreicht: " + item);
      for (const problem of result.problems) {
        const key = problem.replace(/l\d\d-/g, "lNN-").replace(/L\d\.\d/g, "Lx.y");
        if (!all.has(key)) all.set(key, new Set());
        all.get(key).add(view);
      }
    }
    await context.close();
  } finally { await browser.close(); }
  for (const [problem, where] of all) console.log(where.size + "×  " + problem + "   [" + [...where].slice(0, 3).join(", ") + "]");
  console.log(checked + " Ansichten geprüft, " + all.size + " verschiedene Befunde.");
  if (!report) assert.equal(all.size, 0);
})().catch((error) => { console.error(error); process.exitCode = 1; });
