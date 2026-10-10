"use strict";

// Erzeugt ein Lösungsheft für die Lehrkraft: richtige Antworten aller
// Verständnis-Checks und Kontrollwerte aller Bonusaufgaben.
//
// Die Datei entsteht bewusst AUSSERHALB des Projektordners, damit sie weder
// vom lokalen Vorschauserver ausgeliefert noch veröffentlicht wird.
// Aufruf aus dem Projektordner:  node tools/build-loesungen.cjs [Zieldatei]
// Vorgabe: ../Lehrkraft/Excel-Lab-Loesungen.md
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const target = path.resolve(process.argv[2] || path.join(root, "..", "Lehrkraft", "Excel-Lab-Loesungen.md"));
if (!path.relative(root, target).startsWith("..")) {
  throw new Error("Das Lösungsheft darf nicht im Projektordner liegen: " + target);
}

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const load = (file, name) => { const sandbox = { window: {} }; vm.runInNewContext(read(file), sandbox, { filename: file }); return sandbox.window[name]; };
const content = load("content.js", "EXCEL_LAB_CONTENT");
const bonus = load("bonus-tasks.js", "EXCEL_LAB_BONUS");
const version = read("app.js").match(/const APP_VERSION = "([^"]+)";/)[1];
const text = (html) => html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const number = (value) => String(value).replace(".", ",");

const lines = [
  "# Excel-Lab – Lösungsheft für die Lehrkraft",
  "",
  `Stand: Version ${version}, erzeugt mit \`node tools/build-loesungen.cjs\`. Nicht an Lernende weitergeben.`,
  "",
  "Je Einheit: die richtigen Antworten des Verständnis-Checks (die Reihenfolge der Antworten wird auf der Seite gemischt) und die Kontrollwerte der beiden Bonusaufgaben.",
  ""
];
let questions = 0;
let tasks = 0;
for (const lesson of content.lessons) {
  const html = read(lesson.page);
  const script = read(`${lesson.id}.js`);
  const answers = Object.fromEntries([...script.match(/const masteryAnswers = \{([^}]+)\};/)[1].matchAll(/(\w+):\s*"([a-z])"/g)].map((m) => [m[1], m[2]]));
  lines.push(`## ${lesson.code} ${lesson.title}`, "", "**Verständnis-Check**", "");
  for (const block of html.split(/<fieldset\b/).slice(1)) {
    const name = block.match(/data-mastery-question="([^"]+)"/)?.[1];
    if (!name || !(name in answers)) continue;
    const legend = text(block.match(/<legend>([\s\S]*?)<\/legend>/)[1]);
    const options = [...block.matchAll(/<label>\s*<input[^>]*value="([a-z])"[^>]*>([\s\S]*?)<\/label>/g)].map((m) => [m[1], text(m[2])]);
    const correct = options.find(([value]) => value === answers[name]);
    lines.push(`- ${legend}`, `  - Richtig: **${correct ? correct[1] : "?"}**`);
    questions++;
  }
  lines.push("", "**Bonusaufgaben**", "");
  for (const [label, task] of [["Vertiefung", bonus.tasks[lesson.id]], ["Transfer", bonus.extra?.[lesson.id]]]) {
    if (!task) continue;
    const tolerance = task.tolerance ?? 0.005;
    lines.push(`- ${label}: ${task.title} – ${task.question}`,
      `  - Kontrollwert: **${number(task.answer)}${task.unit ? " " + task.unit : ""}** (angenommen wird ± ${number(tolerance)})`,
      `  - Hinweis bei falscher Eingabe: ${task.hint.replace(/`/g, "")}`);
    tasks++;
  }
  lines.push("");
}
lines.splice(5, 0, `Umfang: ${content.lessons.length} Einheiten, ${questions} Fragen, ${tasks} Bonusaufgaben.`, "");

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, lines.join("\n"), "utf8");
console.log(`${questions} Fragen und ${tasks} Bonusaufgaben geschrieben nach ${target}`);
