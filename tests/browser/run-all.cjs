"use strict";

// Startet alle Browsertests nacheinander und fasst das Ergebnis zusammen.
// Aufruf aus dem Projektordner:
//   node tests/browser/run-all.cjs http://127.0.0.1:4273/ [codex|eigene]
// Bildschirmfotos der übernommenen Codex-Tests landen unter %TEMP%\excel-lab-tests.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const base = process.argv[2] || "http://127.0.0.1:4273/";
const only = process.argv[3] || "";
const own = fs.readdirSync(__dirname).filter((file) => file.endsWith(".browser.cjs") && file !== "contrast.browser.cjs")
  .map((file) => ({ file: path.join("tests", "browser", file), args: file === "lesson-gates.browser.cjs" ? [base, "all"] : [base] }));
const codexDir = path.join(__dirname, "codex");
const codex = fs.existsSync(codexDir) ? fs.readdirSync(codexDir).filter((file) => file.endsWith(".cjs")).sort()
  .map((file) => ({ file: path.join("tests", "browser", "codex", file), args: [base] })) : [];
const selected = only === "codex" ? codex : only === "eigene" ? own : [...own, ...codex];

let failed = 0;
for (const { file, args } of selected) {
  const started = Date.now();
  const run = spawnSync(process.execPath, [file, ...args], { cwd: root, encoding: "utf8", timeout: 600000, env: { ...process.env, EXCEL_LAB_BASE: base } });
  const ok = run.status === 0 && !run.error;
  if (!ok) failed++;
  const seconds = Math.round((Date.now() - started) / 1000);
  console.log(`${ok ? "ok    " : "FEHLER"} ${String(seconds).padStart(4)} s  ${file}`);
  if (!ok) console.log(((run.stdout || "") + (run.stderr || "")).trim().split("\n").slice(-12).map((line) => "         " + line).join("\n"));
}
console.log(`${selected.length - failed} von ${selected.length} Testdateien bestanden.`);
process.exitCode = failed ? 1 : 0;
