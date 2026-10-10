"use strict";

// Startet alle Browsertests nacheinander und fasst das Ergebnis zusammen.
// Aufruf aus dem Projektordner:
//   node tests/browser/run-all.cjs http://127.0.0.1:4273/ [codex|eigene]
// Zeitlimit je Testdatei: 900 s, änderbar mit EXCEL_LAB_TEST_TIMEOUT (Sekunden).
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

// Zeitlimit je Testdatei; auf einem ausgelasteten Rechner über die Umgebung anhebbar.
const timeout = Number(process.env.EXCEL_LAB_TEST_TIMEOUT) > 0 ? Number(process.env.EXCEL_LAB_TEST_TIMEOUT) * 1000 : 900000;
// Ausfälle, die nach Umgebung aussehen (Zeitlimit, keine Verbindung), werden einmal
// wiederholt und in der Ausgabe als „zweiter Versuch“ gekennzeichnet. Besteht eine
// Datei regelmäßig erst im zweiten Versuch, ist das ein Hinweis auf einen echten Fehler.
const environmental = (run) => Boolean(run.error) || run.signal !== null
  || /net::ERR_|ECONNREFUSED|ECONNRESET|Timeout \d+ms exceeded/.test((run.stdout || "") + (run.stderr || ""));
const start = (file, args) => spawnSync(process.execPath, [file, ...args], { cwd: root, encoding: "utf8", timeout, env: { ...process.env, EXCEL_LAB_BASE: base } });

let failed = 0;
let repeated = 0;
for (const { file, args } of selected) {
  const started = Date.now();
  let run = start(file, args);
  let ok = run.status === 0 && !run.error;
  let retried = false;
  if (!ok && environmental(run)) {
    retried = true;
    repeated++;
    run = start(file, args);
    ok = run.status === 0 && !run.error;
  }
  if (!ok) failed++;
  const seconds = Math.round((Date.now() - started) / 1000);
  console.log(`${ok ? "ok    " : "FEHLER"} ${String(seconds).padStart(4)} s  ${file}${retried ? "  (zweiter Versuch)" : ""}`);
  if (!ok) {
    const output = ((run.stdout || "") + (run.stderr || "")).trim();
    console.log(output.split("\n").slice(-12).map((line) => "         " + line).join("\n"));
    // Die vollständige Ausgabe bleibt erhalten; die letzten zwölf Zeilen zeigen oft nur das Ende der Meldung.
    try {
      const logDir = path.join(require("node:os").tmpdir(), "excel-lab-tests");
      fs.mkdirSync(logDir, { recursive: true });
      const logFile = path.join(logDir, path.basename(file).replace(/\.cjs$/, "") + ".fehler.log");
      fs.writeFileSync(logFile, output + "\n", "utf8");
      console.log("         Vollständige Ausgabe: " + logFile);
    } catch { /* Ohne Schreibrecht bleibt es bei der gekürzten Ausgabe. */ }
  }
}
if (repeated) console.log(`${repeated} Testdatei(en) nach Zeitlimit oder Verbindungsfehler wiederholt.`);
console.log(`${selected.length - failed} von ${selected.length} Testdateien bestanden.`);
process.exitCode = failed ? 1 : 0;
