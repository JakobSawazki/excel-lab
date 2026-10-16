"use strict";

// Prüft die NAGOLD-Tabelle (nagold.js): Grenzen, alte Lernstände, einmalige Buchung.
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { read } = require("./helpers.cjs");

const sandbox = { window: {} };
vm.runInNewContext(read("content.js"), sandbox, { filename: "content.js" });
vm.runInNewContext(read("nagold.js"), sandbox, { filename: "nagold.js" });
const nagold = sandbox.window.EXCEL_LAB_NAGOLD;
const lessons = sandbox.window.EXCEL_LAB_CONTENT.lessons;
const plain = (value) => JSON.parse(JSON.stringify(value));
const done = { completed: true };

test("Grundwerte: 5 NAGOLD je Einheit, 27 Einheiten ergeben 135", () => {
  assert.equal(nagold.maxPoints, 5);
  assert.equal(nagold.minPoints, -10);
  assert.equal(nagold.attendancePoints, 2);
  assert.equal(lessons.length, 27);
  const progress = Object.fromEntries(lessons.map((lesson) => [lesson.id, done]));
  assert.equal(nagold.total({ progress }), 135);
  assert.equal(nagold.maxEntries, nagold.maxManualEntries + lessons.length);
});

test("Datum und Uhrzeit: nur echte Kalendertage und HH:MM", () => {
  assert.equal(nagold.validDate("2026-10-11"), true);
  assert.equal(nagold.validDate("2026-02-30"), false);
  assert.equal(nagold.validDate("11.10.2026"), false);
  assert.equal(nagold.validTime("08:05"), true);
  assert.equal(nagold.validTime("24:00"), false);
  assert.equal(nagold.validTime("8:5"), false);
  const date = new Date(2026, 9, 3, 7, 4);
  assert.equal(nagold.today(date), "2026-10-03");
  assert.equal(nagold.clock(date), "07:04");
});

test("Bereinigung: ganze Punkte von -10 bis 5 ohne 0, Anlass nötig, Text gekürzt, fremde Felder entfallen", () => {
  const entries = plain(nagold.normalizeEntries([
    { date: "2026-10-11", time: "09:00", purpose: "  Mitarbeit  ", points: 3, extra: "x" },
    { date: "2026-10-11", time: "09:00", purpose: "zu viel", points: 6 },
    { date: "2026-10-11", time: "09:00", purpose: "null zählt nicht", points: 0 },
    { date: "2026-10-11", time: "09:00", purpose: "Abzug zu groß", points: -11 },
    { date: "2026-10-11", time: "09:00", purpose: "halb", points: 2.5 },
    { date: "2026-10-11", time: "09:00", purpose: "   ", points: 2 },
    { date: "2026-13-01", time: "09:00", purpose: "falsches Datum", points: 2 },
    { date: "2026-10-11", time: "25:00", purpose: "falsche Uhrzeit", points: 2 },
    { date: "", purpose: "ohne Datum und Uhrzeit", points: 1 },
    { date: "2026-10-11", time: "09:00", purpose: "x".repeat(300), points: 5, lessonId: "gibt-es-nicht" },
    { date: "2026-10-11", time: "09:00", purpose: "L1.1", points: 5, lessonId: "l1-1" },
    { date: "2026-10-11", time: "09:00", purpose: "Abzug", points: -10 },
    null, "text"
  ]));
  assert.deepEqual(entries.map((entry) => entry.points), [3, 1, 5, 5, -10]);
  assert.deepEqual(entries[0], { date: "2026-10-11", time: "09:00", purpose: "Mitarbeit", points: 3 });
  assert.deepEqual(entries[1], { date: "", time: "", purpose: "ohne Datum und Uhrzeit", points: 1 });
  assert.equal(entries[2].purpose.length, 160);
  assert.equal("lessonId" in entries[2], false);
  assert.equal(entries[3].lessonId, "l1-1");
  assert.deepEqual(plain(nagold.normalizeEntries("kein Feld")), []);
});

test("Alter Lernstand ohne Tabelle: je abgeschlossener Einheit eine Zeile ohne erfundenes Datum", () => {
  const profile = { progress: { "l1-1": done, "l1-2": { completed: false }, "l2-1": done, unbekannt: done } };
  const entries = plain(nagold.entriesFor(profile));
  assert.deepEqual(entries.map((entry) => entry.lessonId), ["l1-1", "l2-1"]);
  assert.ok(entries.every((entry) => entry.date === "" && entry.time === "" && entry.points === 5));
  assert.match(entries[0].purpose, /^L1\.1 · /);
  assert.equal(nagold.total(profile), 10);
  assert.equal("nagoldEntries" in profile, false, "Lesen legt nichts an");
});

test("Ausdrücklich leere Tabelle bleibt leer, auch mit abgeschlossenen Einheiten", () => {
  const profile = { progress: { "l1-1": done }, nagoldEntries: [] };
  assert.deepEqual(plain(nagold.entriesFor(profile)), []);
  assert.equal(nagold.total(profile), 0);
});

test("Abschluss bucht genau einmal und übernimmt den alten Stand", () => {
  const profile = { progress: { "l1-1": done } };
  const lesson = lessons.find((item) => item.id === "l1-2");
  assert.equal(nagold.addLessonEntry(profile, lesson, "2026-10-11", "10:15"), true);
  assert.deepEqual(plain(profile.nagoldEntries).map((entry) => [entry.lessonId, entry.date, entry.time, entry.points]),
    [["l1-1", "", "", 5], ["l1-2", "2026-10-11", "10:15", 5]]);
  assert.equal(nagold.addLessonEntry(profile, lesson, "2026-10-12", "08:00"), false, "keine zweite Buchung");
  assert.equal(nagold.total(profile), 10);
  assert.equal(nagold.addLessonEntry(profile, { id: "fremd" }, "2026-10-11", "10:15"), false);
  assert.equal(nagold.addLessonEntry(profile, lessons[2], "heute", "10:15"), false);
  assert.equal(nagold.addLessonEntry(null, lessons[2], "2026-10-11", "10:15"), false);
  assert.equal(nagold.total(null), 0);
});

test("Vorauswahl: sechs Anlässe und alle Einheiten", () => {
  const options = plain(nagold.presetOptions());
  assert.deepEqual(options.slice(0, 6), ["Anwesenheit", "Mitarbeit", "Zusatzaufgabe", "Präsentation", "Projektarbeit", "Lernprodukt"]);
  assert.equal(options.length, 6 + lessons.length);
});

test("Alle Seiten laden nagold.js direkt nach content.js", () => {
  const fs = require("node:fs");
  const { root } = require("./helpers.cjs");
  for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".html"))) {
    assert.match(read(file), /<script src="content\.js\?v=[^"]+" defer><\/script>\s*<script src="nagold\.js\?v=[^"]+" defer><\/script>/, file);
  }
});
