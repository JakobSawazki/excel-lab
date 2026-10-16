"use strict";

// Prüft den gemeinsamen Kern für Speichern und Laden (save-core.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { read } = require("./helpers.cjs");

function load() {
  const store = new Map();
  const sandbox = {
    window: {},
    navigator: { platform: "Win32" },
    localStorage: { getItem: (key) => (store.has(key) ? store.get(key) : null), setItem: (key, value) => store.set(key, String(value)) }
  };
  vm.runInNewContext(read("content.js"), sandbox, { filename: "content.js" });
  vm.runInNewContext(read("bonus-tasks.js"), sandbox, { filename: "bonus-tasks.js" });
  vm.runInNewContext(read("nagold.js"), sandbox, { filename: "nagold.js" });
  vm.runInNewContext(read("save-core.js"), sandbox, { filename: "save-core.js" });
  return { core: sandbox.window.ExcelLabSave, store, lessons: sandbox.window.EXCEL_LAB_CONTENT.lessons };
}
const plain = (value) => JSON.parse(JSON.stringify(value));
const done = { completed: true, teacherChecked: true, masteryPassed: true, checks: [true, true, true] };

test("Bereinigung: bekannte Einheiten, Kleinbuchstaben, Klasse groß, alte Abschlüsse gelten als bestanden", () => {
  const { core } = load();
  const profile = plain(core.normalizeProfile({
    id: "abc", name: "  ANN.BEI ", className: " wgw ek1 ",
    progress: { "l1-1": { completed: true, checks: [true, "x", 0, true] }, "l9-9": done, "l1-2": "kaputt" }
  }));
  assert.equal(profile.id, "abc");
  assert.equal(profile.name, "ann.bei");
  assert.equal(profile.className, "WGW EK1");
  assert.deepEqual(Object.keys(profile.progress), ["l1-1"], "unbekannte und kaputte Einträge entfallen");
  assert.equal(profile.progress["l1-1"].masteryPassed, true);
  assert.deepEqual(profile.progress["l1-1"].checks, [true, true, false], "so viele Haken wie die Einheit hat");
  assert.deepEqual(profile.nagoldEntries.map((entry) => entry.lessonId), ["l1-1"], "alter Stand: NAGOLD-Zeile je Abschluss");
});

test("XP: 100 je Abschluss, Bonus nur mit vorhandener Aufgabe", () => {
  const { core } = load();
  assert.equal(core.xp({ progress: { "l1-1": { ...done, bonus: true, bonus2: true }, "l1-2": { completed: false, bonus: true } } }), 100 + 50 + 50 + 50);
  assert.equal(core.xp(null), 0);
  assert.equal(core.completedCount({ progress: { "l1-1": done, "l1-2": done, unbekannt: done } }), 2);
});

test("Speicherdatei: Format 1, Kennzahlen, Dateiname mit Datum, Kürzel und Browser-Kennung", () => {
  const { core, store } = load();
  const profile = core.normalizeProfile({ name: "ann.bei", className: "WGW EK1", progress: { "l1-1": done }, nagoldEntries: [{ date: "2026-10-16", time: "08:00", purpose: "Anwesenheit", points: 2 }] });
  const payload = plain(core.buildPayload(profile, "9.9.9"));
  assert.equal(payload.app, "Excel-Lab");
  assert.equal(payload.version, 1);
  assert.equal(payload.appVersion, "9.9.9");
  assert.deepEqual(payload.exportedBy, { accountName: "ann.bei", className: "WGW EK1", points: 100, nagold: 2 });
  assert.match(payload.device.id, /^XL-[A-Z0-9]{1,10}$/);
  assert.equal(JSON.parse(store.get(core.DEVICE_KEY)).id, payload.device.id, "Kennung bleibt gespeichert");
  assert.equal(core.buildPayload(profile, "9.9.9").device.id, payload.device.id, "dieselbe Kennung beim zweiten Mal");
  assert.match(core.fileName(payload), new RegExp(`^\\d{4}-\\d{2}-\\d{2}_Excel-Lab_ann\\.bei_${payload.device.id}\\.json$`));
});

test("Zuletzt gespeichert: höchstens fünf, neueste zuerst, fremde Einträge entfallen", () => {
  const { core, store } = load();
  const profile = core.normalizeProfile({ name: "ann.bei", className: "WGW EK1", progress: {} });
  for (let index = 0; index < 7; index++) {
    const payload = core.buildPayload(profile, "1");
    payload.exportedAt = `2026-10-16T0${index}:00:00.000Z`;
    core.remember(payload, `datei-${index}.json`);
  }
  const list = plain(core.recentSaves());
  assert.equal(list.length, 5);
  assert.equal(list[0].fileName, "datei-6.json");
  assert.match(core.describeSave(list[0]), /ann\.bei · 0 XP · 0 NAGOLD$/);
  store.set(core.SAVES_KEY, JSON.stringify([{ savedAt: "x", payload: { app: "Anderes" } }, "kaputt"]));
  assert.deepEqual(plain(core.recentSaves()), []);
  store.set(core.SAVES_KEY, "{kaputt");
  assert.deepEqual(plain(core.recentSaves()), []);
});

test("Laden: dieselbe Person wird ersetzt, Rückfrage bei weniger Abschlüssen, andere Person neu", () => {
  const { core } = load();
  const state = { version: 1, currentProfileId: "a", profiles: [
    core.normalizeProfile({ id: "a", name: "ann.bei", className: "WGW EK1", createdAt: "2026-09-01T00:00:00.000Z", progress: { "l1-1": done, "l1-2": done } })] };
  const file = (progress, name = "ann.bei") => ({ app: "Excel-Lab", version: 1, profile: { id: "fremd", name, className: "WGW EK1", progress } });
  const questions = [];
  assert.equal(core.mergeImport(state, file({ "l1-1": done }), (question) => { questions.push(question); return false; }), "cancelled");
  assert.match(questions[0], /weniger abgeschlossene Einheiten \(1\) als dein Stand in diesem Browser \(2\)/);
  assert.equal(state.profiles[0].progress["l1-2"].completed, true, "Abbrechen ändert nichts");
  assert.equal(core.mergeImport(state, file({ "l1-1": done, "l1-2": done, "l1-3": done }), () => { throw new Error("keine Rückfrage erwartet"); }), "loaded");
  assert.equal(state.profiles.length, 1);
  assert.equal(state.profiles[0].id, "a", "Kennung bleibt");
  assert.equal(state.profiles[0].createdAt, "2026-09-01T00:00:00.000Z");
  assert.equal(core.completedCount(state.profiles[0]), 3);
  assert.equal(core.mergeImport(state, file({}, "ben.zwe"), () => true), "loaded");
  assert.equal(state.profiles.length, 2);
  assert.notEqual(state.profiles[1].id, "fremd", "neue Person erhält eine eigene Kennung");
  assert.equal(state.currentProfileId, state.profiles[1].id);
  for (const invalid of [null, {}, { app: "Excel-Lab", version: 2, profile: {} }, { app: "Excel-Lab", version: 1, profile: [] }, { app: "Anderes", version: 1, profile: {} }]) {
    assert.throws(() => core.mergeImport(state, invalid, () => true), /Keine gültige Excel-Lab-Exportdatei/);
  }
});

test("Startseite und Lernseiten laden save-core.js vor app.js und lesson-save.js", () => {
  const fs = require("node:fs");
  const { root } = require("./helpers.cjs");
  for (const file of fs.readdirSync(root).filter((name) => /^(index|l\d-\d)\.html$/.test(name))) {
    const html = read(file);
    const core = html.indexOf("save-core.js");
    assert.ok(core > 0, `${file}: save-core.js fehlt`);
    for (const user of ["app.js", "lesson-save.js"]) {
      const at = html.indexOf(`src="${user}`);
      if (at > 0) assert.ok(core < at, `${file}: save-core.js nach ${user}`);
    }
  }
});
