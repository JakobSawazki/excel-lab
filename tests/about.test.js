"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { root, read } = require("./helpers.cjs");

test("Versionsdialog: gemeinsames Skript auf jeder Seite mit Seitenfuß", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html"))) {
    const html = read(file);
    if (html.includes('class="site-footer')) assert.match(html, /<script src="about\.js\?v=[\d.]+" defer><\/script>/, file);
  }
});

test("Versionsdialog: zentrale Versionsliste und Öffnen ohne Seitennavigation", () => {
  const script = read("about.js");
  assert.match(script, /event\.preventDefault\(\)/);
  assert.match(script, /preventScroll: true/);
  assert.match(script, /Math\.floor\(Number\(match\[2\]\) \/ 10\)/);
  assert.match(script, /new URL\("index\.html", location\.href\)/);
  assert.doesNotMatch(script, /location\.(href|hash)\s*=/);
  assert.doesNotMatch(read("app.js"), /function openAboutDialog/);
  assert.match(read("styles.css"), /\.dialog\.about-dialog\s*\{\s*position: fixed;/, "Dialogposition hat Vorrang vor allgemeinen Metall-Stilregeln");
});
