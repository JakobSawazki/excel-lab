"use strict";

// Prüft, dass Inhaltsliste, Lernseiten und Lernseiten-Skripte zusammenpassen.
const test = require("node:test");
const assert = require("node:assert/strict");
const { exists, loadContent, lessonPages, masteryConfig, attribute, tags, ids } = require("./helpers.cjs");

const content = loadContent();
const pages = lessonPages();

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
    const sources = tags(html, "script").map((tag) => attribute(tag, "src"));
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
