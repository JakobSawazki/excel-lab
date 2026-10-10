"use strict";

// Kontrast der Texte in beiden Farbschemata und allen Darstellungsoptionen
// (5 Hintergründe × 5 Schriftfarben × 2 Schemata). Gemessen wird die Textfarbe
// gegen die nächste deckende Hintergrundfarbe; halbtransparente Flächen werden
// verrechnet. Flächen mit Verlauf oder Bild zählen mit ihrer Hintergrundfarbe.
// Mindestwert 4,5 : 1, für große Schrift (ab 24 px oder fett ab 18,66 px) 3 : 1.
//
// Das ist ein Messwerkzeug, noch keine Abnahme: Schrift auf Verlaufs- und
// Metallflächen (Buttons, Karten) lässt sich so nicht messen und wird als
// „[Verlauf]“ nur aufgelistet. Mit „strict“ schlägt der Lauf bei messbaren
// Fundstellen fehl.
//
// Aufruf: node tests/browser/contrast.browser.cjs http://127.0.0.1:4273/ [strict]
const assert = require("node:assert/strict");
const { chromium } = require(process.env.EXCEL_LAB_PLAYWRIGHT
  || "C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const base = process.argv[2] || "http://127.0.0.1:4273/";
const strict = process.argv[3] === "strict";
const pages = ["index.html", "index.html#lernpfad", "index.html#formeln", "index.html#quellen", "l1-1.html", "l1-2.html", "l2-3.html", "l3-4.html", "l4-6.html"];
const backgrounds = ["standard", "green", "graphite", "violet", "sand"];
const texts = ["standard", "warm", "contrast", "mint", "lavender"];
const progress = Object.fromEntries(["l1-1", "l1-2", "l1-3", "l1-4", "l1-5", "l1-6", "l2-1", "l2-2", "l3-1", "l3-2", "l3-3", "l4-1", "l4-2", "l4-3", "l4-4", "l4-5"]
  .map((id) => [id, { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] }]));

function measure() {
  const parse = (value) => {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const color = (value) => {
    const direct = parse(value);
    if (direct) return direct;
    canvas.clearRect(0, 0, 1, 1); canvas.fillStyle = "#000"; canvas.fillStyle = value; canvas.fillRect(0, 0, 1, 1);
    const d = canvas.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  };
  const over = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const luminance = (c) => [c.r, c.g, c.b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const background = (element) => {
    const layers = [];
    for (let node = element; node; node = node.parentElement) {
      const c = color(getComputedStyle(node).backgroundColor);
      if (c.a > 0) layers.push(c);
      if (c.a >= 1) break;
    }
    let result = color(getComputedStyle(document.documentElement).backgroundColor);
    if (result.a < 1) result = over(result, { r: 255, g: 255, b: 255, a: 1 });
    for (const layer of layers.reverse()) result = over(layer, result);
    return result;
  };
  const found = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue.trim()) continue;
    const element = node.parentElement;
    if (!element || element.closest("[hidden], dialog:not([open]), [aria-hidden='true'], .sr-only, script, style, noscript, svg")) continue;
    const style = getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) continue;
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    if (element.closest(":disabled, [aria-disabled='true']")) continue; // deaktiviert: keine Kontrastpflicht
    let opacity = 1;
    for (let p = element; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
    const bg = background(element);
    const fgRaw = color(style.color);
    const fg = over({ ...fgRaw, a: fgRaw.a * opacity }, bg);
    const l1 = luminance(fg), l2 = luminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(style.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
    if (ratio >= (large ? 3 : 4.5)) continue;
    const path = [];
    for (let p = element; p && path.length < 3; p = p.parentElement) path.unshift(p.tagName.toLowerCase() + (p.id ? `#${p.id}` : "") + (typeof p.className === "string" && p.className ? "." + p.className.trim().split(/\s+/).join(".") : ""));
    const key = path.join(" > ");
    if (!found.has(key) || found.get(key).ratio > ratio) found.set(key, { ratio: Math.round(ratio * 100) / 100, size, text: node.nodeValue.trim().slice(0, 40), gradient: style.backgroundImage !== "none" || getComputedStyle(element.parentElement).backgroundImage !== "none" });
  }
  return [...found].map(([where, value]) => ({ where, ...value }));
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const failures = new Map();
  let views = 0;
  try {
    for (const theme of ["dark", "light"]) {
      for (const bg of backgrounds) {
        for (const text of texts) {
          const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
          await context.addInitScript(([state, appearance]) => {
            localStorage.setItem("excelLab.state.v1", state);
            localStorage.setItem("excelLab.appearance.v1", appearance);
          }, [JSON.stringify({ version: 1, theme, currentProfileId: "t", profiles: [{ id: "t", name: "tes.pro", className: "WGW EK1", progress }] }),
            JSON.stringify({ background: bg, text, size: "normal" })]);
          const page = await context.newPage();
          for (const file of pages) {
            await page.goto(base + file);
            await page.evaluate(() => document.querySelectorAll("details").forEach((element) => { element.open = true; }));
            await page.waitForTimeout(80);
            views++;
            for (const item of await page.evaluate(measure)) {
              const key = `${file.split("#")[0].replace(/l\d-\d/, "lX-Y")} | ${item.where.replace(/l\d\d-/g, "lNN-")}`;
              const entry = failures.get(key) || { ratio: 99, where: new Set(), text: item.text, size: item.size, gradient: item.gradient };
              if (item.ratio < entry.ratio) { entry.ratio = item.ratio; entry.worst = `${theme}/${bg}/${text}`; }
              entry.where.add(`${theme}/${bg}/${text}`);
              failures.set(key, entry);
            }
          }
          await context.close();
        }
      }
    }
  } finally { await browser.close(); }
  const list = [...failures].sort((a, b) => a[1].ratio - b[1].ratio);
  for (const [key, entry] of list) console.log(`${entry.ratio.toFixed(2)}  ${entry.where.size}/50  ${entry.worst}  ${entry.gradient ? "[Verlauf] " : ""}${key}  „${entry.text}“ ${entry.size}px`);
  const measurable = list.filter(([, entry]) => !entry.gradient).length;
  console.log(`${views} Ansichten: ${measurable} messbare Stellen unter dem Mindestkontrast, ${list.length - measurable} auf Verlaufsflächen nicht messbar.`);
  if (strict) assert.equal(measurable, 0);
})().catch((error) => { console.error(error); process.exitCode = 1; });
