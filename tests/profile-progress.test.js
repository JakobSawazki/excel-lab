"use strict";

// Prüft den Gesamtfortschritt der Profilkarte (profile-progress.js) und das
// Tastenkürzel Alt+S (save-core.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { read } = require("./helpers.cjs");

function load() {
  const sandbox = { window: {}, navigator: { platform: "Win32" }, localStorage: { getItem: () => null, setItem() {} } };
  for (const file of ["content.js", "bonus-tasks.js", "nagold.js", "save-core.js", "profile-progress.js"]) {
    vm.runInNewContext(read(file), sandbox, { filename: file });
  }
  return sandbox.window;
}
const plain = (value) => JSON.parse(JSON.stringify(value));

test("Gesamtfortschritt: Prozent über alle Einheiten, Zählung je Lernschritt", () => {
  const { ExcelLabProfileProgress: progress, EXCEL_LAB_CONTENT: content } = load();
  const done = { completed: true };
  const result = plain(progress.stats({ progress: { "l1-1": done, "l1-2": done, "l2-1": done, "l9-9": done, "l3-1": { completed: false } } }));
  assert.equal(result.completed, 3);
  assert.equal(result.percent, Math.round(3 / content.lessons.length * 100));
  assert.deepEqual(result.rows.map((row) => [row.stage.code, row.completed, row.total]), [["L1", 2, 6], ["L2", 1, 5], ["L3", 0, 8], ["L4", 0, 8]]);
  assert.equal(plain(progress.stats(null)).percent, 0);
});

test("Alt+S: nur Alt mit S, nicht mit Strg, Umschalt, Befehlstaste oder beim Festhalten", () => {
  const { ExcelLabSave: core } = load();
  const key = (extra) => ({ altKey: true, ctrlKey: false, metaKey: false, shiftKey: false, repeat: false, code: "KeyS", ...extra });
  assert.equal(core.isSaveShortcut(key()), true);
  for (const extra of [{ altKey: false }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { repeat: true }, { code: "KeyA" }]) {
    assert.equal(core.isSaveShortcut(key(extra)), false, JSON.stringify(extra));
  }
  assert.equal(core.isSaveShortcut(null), false);
});

test("Startseite und Lernseiten laden profile-progress.js nach save-core.js", () => {
  const fs = require("node:fs");
  const { root } = require("./helpers.cjs");
  for (const file of fs.readdirSync(root).filter((name) => /^(index|l\d-\d)\.html$/.test(name))) {
    const html = read(file);
    assert.ok(html.indexOf("save-core.js") > 0 && html.indexOf("profile-progress.js") > html.indexOf("save-core.js"), file);
  }
});
