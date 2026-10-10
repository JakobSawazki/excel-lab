"use strict";

// Prüft Verweise, Bilder, Versionsgleichstand und die Veröffentlichungsgrenzen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const { root, read, exists, loadContent, attribute, tags, ids, imageSize } = require("./helpers.cjs");

const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
const scriptFiles = fs.readdirSync(root).filter((file) => file.endsWith(".js")).sort();
const MATERIALS = "materialien/BPE1/";

test("29 Seiten: Startseite, 27 Lernseiten und Klassenübersicht", () => {
  assert.equal(htmlFiles.length, 29);
  assert.equal(htmlFiles.filter((file) => /^l\d-\d\.html$/.test(file)).length, 27);
  assert.ok(htmlFiles.includes("lehrkraft.html"));
  assert.ok(htmlFiles.includes("index.html"));
});

test("JavaScript-Dateien sind syntaktisch gültig", () => {
  for (const file of scriptFiles) {
    assert.doesNotThrow(() => new (require("node:vm").Script)(read(file), { filename: file }), file);
  }
});

for (const file of htmlFiles) {
  const html = read(file);

  test(`${file}: lokale Verweise führen zu vorhandenen Zielen`, () => {
    const targets = [
      ...tags(html, "a").map((tag) => attribute(tag, "href")),
      ...tags(html, "link").filter((tag) => !/rel="canonical"/.test(tag)).map((tag) => attribute(tag, "href")),
      ...tags(html, "script").map((tag) => attribute(tag, "src")),
      ...tags(html, "img").map((tag) => attribute(tag, "src"))
    ].filter(Boolean);
    const own = ids(html);
    for (const target of targets) {
      if (/^(https?:|mailto:|tel:)/.test(target) || target.startsWith(MATERIALS)) continue;
      const [file2, anchor] = target.replace(/\?v=[\d.]+/, "").split("#");
      if (file2) assert.ok(exists(decodeURI(file2)), `${target}: Datei fehlt`);
      // Sprungziele der Startseite (#lernpfad/2 …) wertet app.js aus.
      if (!file2 && anchor && file !== "index.html") assert.ok(own.includes(anchor), `${target}: Sprungziel fehlt`);
    }
  });

  test(`${file}: Materialverweise nur auf Schülerunterlagen`, () => {
    const targets = [...html.matchAll(/(?:href|src)="(materialien\/[^"]+)"/g)].map((m) => m[1]);
    for (const target of targets) {
      assert.ok(target.startsWith(MATERIALS), `${target}: außerhalb von ${MATERIALS}`);
      assert.doesNotMatch(target, /l(?:ö|oe)sung|kompetenzraster|lehrer/i, `${target}: Lehrerunterlage`);
    }
  });

  test(`${file}: Bilder mit passenden Maßen und Alternativtext`, () => {
    for (const tag of tags(html, "img")) {
      const source = attribute(tag, "src");
      assert.notEqual(attribute(tag, "alt"), undefined, `${source}: alt fehlt`);
      const size = imageSize(source);
      if (!size) continue; // SVG
      assert.equal(Number(attribute(tag, "width")), size.width, `${source}: width`);
      assert.equal(Number(attribute(tag, "height")), size.height, `${source}: height`);
    }
  });

  test(`${file}: externe Links öffnen sicher in neuem Tab`, () => {
    for (const tag of tags(html, "a")) {
      if (attribute(tag, "target") !== "_blank") continue;
      assert.match(attribute(tag, "rel") || "", /noopener/, tag);
    }
  });
}

test("Versionsgleichstand in App, Versionsverlauf, README und Dokumentation", () => {
  const version = read("app.js").match(/const APP_VERSION = "([^"]+)";/)[1];
  assert.match(version, /^\d+\.\d+\.\d+$/);
  assert.equal(read("index.html").match(/<ol class="version-timeline">\s*<li><span>([^<]+)<\/span>/)[1], version, "index.html");
  assert.equal(read("README.md").match(/Aktueller Release: \*\*([^*]+)\*\*/)[1], version, "README.md");
  assert.equal(read("documentation/documentation.md").match(/^Projektversion: (.+)$/m)[1].trim(), version, "documentation.md");
});

test("Startseite und Klassenübersicht: Skripte und Styles tragen die Version", () => {
  const version = read("app.js").match(/const APP_VERSION = "([^"]+)";/)[1];
  const index = read("index.html") + read("lehrkraft.html");
  const references = [...tags(index, "script").map((tag) => attribute(tag, "src")), ...tags(index, "link").filter((tag) => /rel="stylesheet"/.test(tag)).map((tag) => attribute(tag, "href"))];
  assert.ok(references.length >= 10);
  for (const reference of references) assert.ok(reference.endsWith(`?v=${version}`), `${reference} ohne ?v=${version}`);
});

test("Lernstand heißt für Lernende XP, nicht Punkte", () => {
  for (const file of htmlFiles) assert.doesNotMatch(read(file).replace(/<ol class="version-timeline">[\s\S]*?<\/ol>/, ""), /100 Punkten?|Abschluss und Punkte/, file);
  for (const file of ["app.js", "lesson-core.js", "lesson-navigation.js"]) assert.doesNotMatch(read(file), /\} Punkten?/, file);
});

test("Startseite nennt die tatsächlichen Stückzahlen", () => {
  const content = loadContent();
  const index = read("index.html");
  for (const stage of content.stages) {
    const count = content.lessons.filter((lesson) => lesson.stage === stage.id).length;
    assert.match(index, new RegExp(`id="organizer-progress-${stage.id}" value="0" max="${count}"`), `L${stage.id}`);
  }
  assert.match(index, new RegExp(`0 von ${content.lessons.length} Einheiten`));
  assert.match(index, new RegExp(`<strong id="formula-count">${content.formulas.length} Formeln</strong>`));
});

test("Speicherschlüssel sind in allen Skripten gleich", () => {
  for (const file of scriptFiles) {
    const keys = [...read(file).matchAll(/"(excelLab\.state\.[^"]+)"/g)].map((m) => m[1]);
    for (const key of keys) assert.match(key, /^excelLab\.state\.(v1|rescue\.v1)$/, `${file}: ${key}`);
  }
});

test("Keine Originalmaterialien, Lösungen oder Arbeitsordner im Git-Index", (t) => {
  let tracked;
  try {
    tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    t.skip("git nicht verfügbar");
    return;
  }
  for (const file of tracked) {
    assert.doesNotMatch(file, /^(materialien|\.tmp)\//, file);
    assert.doesNotMatch(file, /desktop\.ini$/i, file);
    assert.doesNotMatch(file, /\.(xlsx|docx|m4v|mp4|pdf)$/i, file);
  }
});

test("Glossar: vollständige Einträge, sortierbar, Begriff steht auf der genannten Lernseite", () => {
  const content = loadContent();
  assert.ok(content.glossary.length >= 20);
  assert.equal(new Set(content.glossary.map((entry) => entry.term)).size, content.glossary.length, "Begriffe eindeutig");
  for (const entry of content.glossary) {
    assert.ok(entry.term.length >= 3 && entry.text.length >= 30, entry.term);
    const lesson = content.lessons.find((item) => item.code === entry.lesson);
    assert.ok(lesson, `${entry.term}: unbekannte Einheit ${entry.lesson}`);
    const page = read(lesson.page).replace(/<[^>]+>/g, " ").toLowerCase();
    const stem = entry.term.toLowerCase().split(" ").pop().slice(0, 7);
    assert.ok(page.includes(stem), `${entry.term}: kommt auf ${lesson.page} nicht vor`);
  }
  assert.match(read("index.html"), /id="glossary-list"/);
});
