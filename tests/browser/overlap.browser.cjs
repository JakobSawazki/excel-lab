"use strict";

// Sucht auf allen Ansichten und Lernseiten bei drei Breiten nach absolut
// platzierten Elementen mit eigenem Text (Nummern, Abzeichen), die Textzeilen
// anderer Elemente überdecken. Anlass: Die Kartennummer „03“ unter „Quellen“
// ragte bis 0.20.7 in den Text (Hinweis Jakob, 10.10.2026).
// Aufruf: node tests/browser/overlap.browser.cjs http://127.0.0.1:4273/
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.argv[2] || process.env.EXCEL_LAB_BASE || "http://127.0.0.1:4273/";
const ids = [];
for (const [s, n] of [[1, 6], [2, 5], [3, 8], [4, 8]]) for (let i = 1; i <= n; i++) ids.push(`l${s}-${i}`);
const progress = Object.fromEntries(ids.map((id) => [id, { completed: true, teacherChecked: true, masteryPassed: true, checks: [] }]));
const state = JSON.stringify({ version: 1, theme: "dark", currentProfileId: "p1", profiles: [{ id: "p1", name: "mia.mus", className: "WGW EK1", progress }] });
const targets = ["index.html", "index.html#lernpfad", "index.html#formeln", "index.html#quellen", "lehrkraft.html", "nachweis.html", ...ids.map((id) => id + ".html")];

const scan = () => {
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05 && r.width > 2 && r.height > 2; };
  const label = (el) => (el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
  const textRects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const parent = node.parentElement;
    if (!parent || !visible(parent) || parent.closest("[hidden], dialog:not([open]), details:not([open]) > :not(summary), .skip-link, noscript, script, style")) continue;
    const range = document.createRange(); range.selectNodeContents(node);
    for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) textRects.push({ r, parent, text: node.textContent.trim().slice(0, 28) });
  }
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "absolute" || !visible(el)) continue;
    if (el.closest("[hidden], dialog, .skip-link, header.site-header, .floating-progress, nav") || cs.pointerEvents === "none" && !el.textContent.trim()) continue;
    if (!el.textContent.trim()) continue; // nur Elemente mit eigenem Text (Nummern, Abzeichen)
    const a = el.getBoundingClientRect();
    for (const t of textRects) {
      if (el.contains(t.parent) || t.parent.contains(el)) continue;
      const w = Math.min(a.right, t.r.right) - Math.max(a.left, t.r.left);
      const h = Math.min(a.bottom, t.r.bottom) - Math.max(a.top, t.r.top);
      if (w > 2 && h > 2) { out.push(`${label(el)} „${el.textContent.trim().slice(0, 12)}“ über ${label(t.parent)} „${t.text}“ (${Math.round(w)}×${Math.round(h)})`); break; }
    }
  }
  return out;
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const found = new Map();
  for (const width of [1536, 1024, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await context.addInitScript((s) => { if (!localStorage.getItem("excelLab.state.v1")) localStorage.setItem("excelLab.state.v1", s); }, state);
    const page = await context.newPage();
    for (const target of targets) {
      await page.goto(base + target, { waitUntil: "load" });
      await page.waitForTimeout(350);
      await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
      await page.waitForTimeout(150);
      for (const hit of await page.evaluate(scan)) {
        const key = target.replace(/^l\d-\d/, "lX-Y") + " | " + hit.replace(/#l\d\d-/g, "#lNN-");
        const entry = found.get(key) || { widths: new Set(), pages: new Set() };
        entry.widths.add(width); entry.pages.add(target); found.set(key, entry);
      }
    }
    await context.close();
  }
  await browser.close();
  const lines = [...found].map(([key, entry]) => `[${[...entry.widths].join(",")} px] (${entry.pages.size} Seiten) ${key}`);
  for (const line of lines) console.log("FAIL " + line);
  console.log(`${targets.length} Ansichten bei drei Breiten geprüft, ${lines.length} Überschneidungen.`);
  process.exitCode = lines.length ? 1 : 0;
})().catch((error) => { console.error(error); process.exitCode = 1; });
