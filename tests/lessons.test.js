"use strict";

// Prüft, dass Inhaltsliste, Lernseiten und Lernseiten-Skripte zusammenpassen.
const test = require("node:test");
const assert = require("node:assert/strict");
const { exists, read, loadContent, lessonPages, masteryConfig, attribute, tags, ids } = require("./helpers.cjs");

const content = loadContent();
const pages = lessonPages();

test("Alle Lernseiten integrieren die Pfadleiste in die mitlaufende Kopfzeile", () => {
  const navigation = read("lesson-navigation.js");
  assert.match(navigation, /header\.append\(breadcrumb\)/);
  assert.doesNotMatch(navigation, /header\.after\(breadcrumb\)/);
  assert.match(navigation, /ResizeObserver/);
  assert.match(read("styles.css"), /\.lesson-page-header > \.lesson-breadcrumb\s*\{/);
  for (const { lesson, html } of pages) {
    const header = html.slice(html.indexOf('<header class="site-header lesson-page-header">'), html.indexOf("</header>"));
    assert.match(header, /class="lesson-breadcrumb"/, `${lesson.code}: Pfadleiste bereits ohne Skript vorhanden`);
    assert.ok(header.includes(`<strong>${lesson.code}</strong>`), lesson.code);
  }
});

test("L1.1: kompakte Getränkeliste ab Zeile 1, Formeln und Folgeeinheit passen dazu", () => {
  const html = read("l1-1.html"), following = read("l1-3.html");
  assert.match(html, /Spaltenüberschriften direkt in <strong>Zeile 1<\/strong>/);
  assert.match(html, /<strong>A1 bis D1:<\/strong> Getränkeart/);
  assert.match(html, /<strong>A2 bis A6:<\/strong> Cola, Apfelsaft, Limonade, Mineralwasser und Orangensaft/);
  for (let row = 2; row <= 6; row++) assert.ok(html.includes(`=B${row}*C${row}`), `Formel in D${row}`);
  assert.match(html, /<strong>D7<\/strong> <code>=SUMME\(D2:D6\)<\/code>/);
  assert.match(html, /Ändere C2 von <strong>30 auf 32<\/strong>\. D2 und D7/);
  assert.doesNotMatch(html, /Zeile 2 bleibt frei|Überschriften in Zeile 3|\bD9\b|SUMME\(D4:D8\)/);
  assert.match(following, /Markiere A1:D1/);
  assert.match(following, /B2:C6 sind Eingabezahlen; D2:D7 enthalten Formeln/);
  assert.match(following, /Markiere A7:D7/);
  assert.doesNotMatch(following, /<strong>Tabellentitel:<\/strong> A1/);
});

test("Inhaltsliste: vier Lernschritte, 27 Einheiten, eindeutige Kennungen", () => {
  assert.equal(content.stages.length, 4);
  assert.equal(content.lessons.length, 27);
  assert.equal(new Set(content.lessons.map((lesson) => lesson.id)).size, 27);
  assert.equal(new Set(content.lessons.map((lesson) => lesson.code)).size, 27);
  for (const lesson of content.lessons) {
    assert.match(lesson.id, /^l[1-4]-[1-8]$/);
    assert.equal(lesson.code, `L${lesson.id[1]}.${lesson.id[3]}`, lesson.id);
    assert.equal(lesson.stage, Number(lesson.id[1]), lesson.id);
    assert.equal(lesson.page, `${lesson.id}.html`, lesson.id);
    assert.equal(lesson.points ?? 100, 100, lesson.id);
    assert.ok(content.stages.some((stage) => stage.id === lesson.stage), lesson.id);
  }
});

test("Einheiten stehen in Lernreihenfolge", () => {
  const sorted = [...content.lessons].sort((a, b) => a.id.localeCompare(b.id));
  assert.deepEqual(content.lessons.map((lesson) => lesson.id), sorted.map((lesson) => lesson.id));
});

for (const { lesson, previous, following, prefix, html, script } of pages) {
  test(`${lesson.code}: Seite und Skript vorhanden und eingebunden`, () => {
    const version = read("app.js").match(/const APP_VERSION = "([^"]+)";/)[1];
    const references = [...tags(html, "script").map((tag) => attribute(tag, "src")), ...tags(html, "link").filter((tag) => /rel="stylesheet"/.test(tag)).map((tag) => attribute(tag, "href"))];
    // Jeder Verweis trägt die Version, damit Seite und Skripte nach einem Release zusammenpassen.
    for (const reference of references) assert.ok(reference.endsWith(`?v=${version}`), `${reference} ohne ?v=${version}`);
    const sources = tags(html, "script").map((tag) => attribute(tag, "src").split("?")[0]);
    for (const source of sources) assert.ok(exists(source), `${source} fehlt`);
    assert.equal(sources[0], "theme-boot.js", "theme-boot.js zuerst");
    assert.ok(html.indexOf("theme-boot.js") < html.indexOf('rel="stylesheet"'), "theme-boot.js vor den Stylesheets");
    for (const tag of tags(html, "script").slice(1)) assert.match(tag, /\sdefer\b/, `${tag} ohne defer`);
    const order = (name) => sources.indexOf(name);
    assert.ok(order("content.js") >= 0 && order("lesson-core.js") > order("content.js"), "content.js vor lesson-core.js");
    assert.ok(order(`${lesson.id}.js`) > order("lesson-core.js"), "lesson-core.js vor dem Seitenskript");
    assert.ok(order("developer-mode.js") >= 0 && order("developer-mode.js") < order("lesson-core.js"));
    assert.match(script, new RegExp(`ExcelLabLesson\\.start\\(\\{ id: "${lesson.id}"`));
  });

  test(`${lesson.code}: keine doppelten IDs, Pflichtelemente vorhanden`, () => {
    const all = ids(html);
    const duplicates = all.filter((id, index) => all.indexOf(id) !== index);
    assert.deepEqual(duplicates, []);
    const required = [
      `${prefix}-mastery-form`, `${prefix}-mastery-status`, `${prefix}-mastery-section`,
      "lesson-profile-name", "lesson-profile-avatar", "lesson-score-ring", "lesson-page-percent",
      "lesson-page-status", "lesson-points-status", "page-teacher-check", "page-complete-button",
      "page-completion-note", "next-lesson-link", "lesson-theme-toggle", "toast-region"
    ];
    if (previous) required.push(`${prefix}-content`, `${prefix}-access`, `${prefix}-access-message`);
    for (const id of required) assert.ok(all.includes(id), `#${id} fehlt`);
    assert.match(html, /<meta name="theme-color"/);
  });

  test(`${lesson.code}: Verständnis-Check passt zu Antworten und Hinweisen`, () => {
    const { answers, hints } = masteryConfig(script, `${lesson.id}.js`);
    const form = html.slice(html.indexOf(`id="${prefix}-mastery-form"`), html.indexOf("</form>", html.indexOf(`id="${prefix}-mastery-form"`)));
    const questions = [...form.matchAll(/data-mastery-question="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(questions.length >= 3, "mindestens drei Fragen");
    assert.deepEqual(Object.keys(answers).sort(), [...questions].sort(), "Antworten und Fragen");
    assert.deepEqual(Object.keys(hints).sort(), [...questions].sort(), "Hinweise und Fragen");
    const blocks = form.split(/<fieldset\b/).slice(1);
    assert.equal(blocks.length, questions.length);
    for (const block of blocks) {
      const name = block.match(/data-mastery-question="([^"]+)"/)[1];
      const radios = tags(block, "input").filter((tag) => attribute(tag, "type") === "radio");
      assert.ok(radios.length >= 3, `${name}: mindestens drei Antwortmöglichkeiten`);
      for (const radio of radios) assert.equal(attribute(radio, "name"), name, `${name}: Gruppenname`);
      const values = radios.map((radio) => attribute(radio, "value"));
      assert.equal(new Set(values).size, values.length, `${name}: Werte eindeutig`);
      assert.ok(values.includes(answers[name]), `${name}: richtige Antwort ${answers[name]} fehlt`);
      assert.match(block, /class="mastery-feedback"/, `${name}: Rückmeldefeld`);
      assert.ok(hints[name].length > 20, `${name}: Hinweis zu kurz`);
    }
    assert.match(form, /<button[^>]*type="submit"/);
  });

  test(`${lesson.code}: eigene Checks lückenlos nummeriert`, () => {
    const indexes = [...html.matchAll(/data-page-check="(\d+)"/g)].map((m) => Number(m[1]));
    assert.deepEqual(indexes, indexes.map((_, i) => i));
    // app.js kürzt gespeicherte Checks beim Laden auf die Länge aus content.js.
    assert.equal(indexes.length, lesson.checks.length, "Anzahl wie in content.js");
  });

  test(`${lesson.code}: Verweise auf vorige und nächste Einheit`, () => {
    const next = tags(html, "a").find((tag) => attribute(tag, "id") === "next-lesson-link");
    assert.equal(attribute(next, "href"), following ? following.page : "index.html#uebersicht");
    assert.equal(attribute(next, "aria-disabled"), "true", "ohne JavaScript gesperrt");
    if (previous) {
      const access = html.slice(html.indexOf(`id="${prefix}-access"`), html.indexOf("</section>", html.indexOf(`id="${prefix}-access"`)));
      assert.ok(access.includes(`href="${previous.page}"`), `Zugangshinweis verweist auf ${previous.page}`);
      assert.ok(access.includes(previous.code), `Zugangshinweis nennt ${previous.code}`);
    }
    assert.ok(html.includes(`<strong>${lesson.code}</strong>`), "Standortzeile nennt die Einheit");
    assert.match(html, new RegExp(`<link rel="canonical" href="https://jakobsawazki\\.github\\.io/excel-lab/${lesson.page}">`));
  });
}
