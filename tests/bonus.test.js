"use strict";

// Prüft die freiwilligen Vertiefungsaufgaben (bonus-tasks.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { read, loadContent } = require("./helpers.cjs");

const sandbox = { window: {} };
vm.runInNewContext(read("bonus-tasks.js"), sandbox, { filename: "bonus-tasks.js" });
const bonus = JSON.parse(JSON.stringify(sandbox.window.EXCEL_LAB_BONUS));
const lessons = loadContent().lessons;

test("Jede Einheit hat genau eine Bonusaufgabe, 50 XP", () => {
  assert.equal(bonus.xp, 50);
  assert.deepEqual(Object.keys(bonus.tasks).sort(), lessons.map((lesson) => lesson.id).sort());
});

for (const lesson of lessons) {
  test(`${lesson.code}: Bonusaufgabe vollständig`, () => {
    const task = bonus.tasks[lesson.id];
    for (const field of ["title", "situation", "question", "hint"]) {
      assert.equal(typeof task[field], "string", field);
      assert.ok(task[field].length >= 10, `${field} zu kurz`);
    }
    assert.ok(Array.isArray(task.steps) && task.steps.length >= 3, "mindestens drei Schritte");
    assert.equal(typeof task.answer, "number");
    assert.ok(Number.isFinite(task.answer));
    assert.equal(typeof task.unit, "string");
    if (task.tolerance !== undefined) assert.ok(task.tolerance > 0 && task.tolerance < 0.1);
    for (const table of [task.table, task.table2].filter(Boolean)) {
      assert.ok(table.head.length >= 2);
      for (const row of table.rows) assert.equal(row.length, table.head.length, "Spaltenzahl");
    }
    // Der Kontrollwert steht nicht im Aufgabentext.
    const shown = String(task.answer).replace(".", ",");
    const text = [task.situation, task.question, ...task.steps].join(" ");
    assert.ok(!new RegExp(`(^|[^\d,.])${shown.replace(".", "\.")}([^\d,]|$)`).test(text) || task.answer < 100 && Number.isInteger(task.answer),
      "Kontrollwert im Aufgabentext");
    // Backticks für Formeln stehen paarweise.
    for (const part of [task.situation, task.question, task.hint, ...task.steps]) assert.equal(part.split("`").length % 2, 1, part);
  });
}

test("Kontrollwerte unabhängig nachgerechnet", () => {
  const sum = (list) => list.reduce((a, b) => a + b, 0);
  const round = (value, digits) => Math.round((value + Number.EPSILON) * 10 ** digits) / 10 ** digits;
  const tutors = [[9.5, 12], [11, 8], [10, 15], [12.5, 6], [9, 14], [10.5, 10]];
  const fee = (age) => (age <= 12 ? 40 : age < 18 ? 60 : 96);
  const x = [1, 2, 3, 4, 5, 6], y = [22, 31, 38, 49, 58, 66];
  const mx = sum(x) / 6, my = sum(y) / 6;
  const expected = {
    "l1-1": 30 * 0.45 + 4 * 1.89 + 3 * 2.49 + 2 * 2.29 + 6 * 1.39,
    "l1-2": 12 * 2.35 + 11 * 4.99 + 15 * 0.89,
    "l1-3": round(12480 / (12480 + 9360 + 15600) * 100, 1),
    "l1-4": 42 * 1.2 + 58 * 0.95 + 35 * 1.1 + 27 * 1.85 + 46 * 1.3 + 39 * 1.6,
    "l1-5": sum([85, 50, 0, 85, 40, 85, 60, 25].map((paid) => 85 - paid)),
    "l1-6": 4800 * 135 * 3.5 / 36000,
    "l2-1": sum(tutors.map(([rate, hours]) => rate * hours)),
    "l2-2": sum(tutors.map(([rate, hours]) => rate * hours + 9)),
    "l2-3": sum([10, 25, 50, 100].flatMap((amount) => [0.35, 0.32, 0.28].map((price) => amount * price))),
    "l2-4": round(sum([412.5, 389, 455.2, 501.8, 478.4, 620.1]) / 6, 2),
    "l2-5": Math.min(12.4, 11.9, 12.75) + Math.min(8.2, 8.45, 7.95) + Math.min(23.5, 24.1, 22.9) + Math.min(5.6, 5.35, 5.5),
    "l3-1": sum([23.9, 67.5, 49.99, 50, 112.3, 38.4, 81].map((value) => (value < 50 ? 4.9 : 0))),
    "l3-2": sum([2015, 2009, 2008, 2014, 1999, 2012, 2010, 1987].map((year) => fee(2026 - year))),
    "l3-3": (310 + 220.4 + 150) / 3,
    "l3-4": sum([[12, 20], [45, 30], [8, 10], [60, 60], [19, 25], [33, 15], [5, 5], [14, 18]].map(([stock, minimum]) => Math.max(0, minimum - stock))),
    "l3-5": 79 * 2 + 4.9 * 5 + 0 * 3 + 12.8 * 1 + 6.5 * 4,
    "l3-6": round((2.3 * 2 + 3.0 * 2 + 1.7 * 1 + 2.5 * 2) / 7, 1),
    "l3-7": Math.ceil((150 + 92) / (1.8 - 0.65)),
    "l3-8": sum([42000, 61500, 50000, 38250, 74800].map((value) => value * (value < 50000 ? 0.02 : 0.035))),
    "l4-1": Math.max(18, 27, 22, 9, 34) - sum([18, 27, 22, 9, 34]) / 5,
    "l4-2": [1240, 2380, 890, 1760, 3150, 1020].sort((a, b) => b - a)[2],
    "l4-3": round((2890 - 1850) / 1850 * 100, 1),
    "l4-4": round(2900 / (1450 + 2900 + 1160 + 870 + 420) * 100, 1),
    "l4-5": 180 / (180 + 140) * 100,
    "l4-6": round(sum(x.map((value, i) => (value - mx) * (y[i] - my))) / sum(x.map((value) => (value - mx) ** 2)), 2),
    "l4-7": Math.max(184000 / 8, 251000 / 12, 96600 / 4),
    "l4-8": round((18 + 52 + 9 + 61) / ((20 + 35 + 15 + 40) / 60), 1)
  };
  for (const lesson of lessons) {
    assert.ok(Math.abs(bonus.tasks[lesson.id].answer - expected[lesson.id]) < 1e-6, `${lesson.code}: ${bonus.tasks[lesson.id].answer} statt ${expected[lesson.id]}`);
  }
});

test("Tabellen der Aufgaben enthalten die Zahlen der Nachrechnung", () => {
  // Stichprobe: Die Daten aus L1.1 stehen so in der Tabelle, wie sie nachgerechnet werden.
  const rows = bonus.tasks["l1-1"].table.rows;
  const total = rows.reduce((value, row) => value + Number(row[1]) * Number(row[2].replace(" €", "").replace(",", ".")), 0);
  assert.ok(Math.abs(total - bonus.tasks["l1-1"].answer) < 1e-6);
});

test("Zweite Bonusaufgabe je Einheit: vollständig, Kontrollwert aus calc nachgerechnet", () => {
  assert.deepEqual(Object.keys(bonus.extra).sort(), lessons.map((lesson) => lesson.id).sort());
  for (const lesson of lessons) {
    const task = bonus.extra[lesson.id];
    for (const field of ["title", "situation", "question", "hint", "calc"]) {
      assert.equal(typeof task[field], "string", `${lesson.code} ${field}`);
      assert.ok(task[field].length >= 3, `${lesson.code} ${field}`);
    }
    assert.notEqual(task.title, bonus.tasks[lesson.id].title, `${lesson.code}: eigener Titel`);
    assert.ok(Array.isArray(task.steps) && task.steps.length >= 2, lesson.code);
    assert.equal(typeof task.answer, "number");
    for (const table of [task.table, task.table2].filter(Boolean)) {
      for (const row of table.rows) assert.equal(row.length, table.head.length, `${lesson.code}: Spaltenzahl`);
    }
    for (const part of [task.situation, task.question, task.hint, ...task.steps]) assert.equal(part.split("`").length % 2, 1, part);
    // calc enthält nur Zahlen, Rechenzeichen und einfache Listenfunktionen.
    assert.match(task.calc, /^[\d\s.,+\-*/()[\]<>=?:&|a-zA-Z]+$/, `${lesson.code}: calc`);
    const value = vm.runInNewContext(task.calc, { Math });
    assert.ok(Math.abs(value - task.answer) < 1e-6, `${lesson.code}: ${task.answer} statt ${value}`);
  }
});
