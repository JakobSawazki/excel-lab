"use strict";

// Gemeinsame Hilfen der Node-Tests. Keine Pakete: nur Node-Bordmittel.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

function loadContent() {
  const sandbox = { window: {} };
  vm.runInNewContext(read("content.js"), sandbox, { filename: "content.js" });
  // Werte aus dem vm-Kontext haben fremde Prototypen; deepEqual braucht eine Kopie.
  return JSON.parse(JSON.stringify(sandbox.window.EXCEL_LAB_CONTENT));
}

function lessonPages() {
  return loadContent().lessons.map((lesson, index, all) => ({
    lesson,
    previous: all[index - 1] || null,
    following: all[index + 1] || null,
    prefix: lesson.id.replace("-", ""),
    html: read(lesson.page),
    script: read(`${lesson.id}.js`)
  }));
}

// Liest nur die beiden Literale; Projektdateien werden dafür nicht ausgeführt.
function masteryConfig(source, file) {
  const answersLiteral = source.match(/const masteryAnswers = \{([^}]+)\};/)?.[1];
  const hintsLiteral = source.match(/const masteryHints = \{([\s\S]*?)\n\s*\};/)?.[1];
  if (!answersLiteral || !hintsLiteral) throw new Error(`${file}: masteryAnswers oder masteryHints fehlt.`);
  const answers = Object.fromEntries([...answersLiteral.matchAll(/(\w+):\s*"([a-z])"/g)].map((m) => [m[1], m[2]]));
  const hints = Object.fromEntries([...hintsLiteral.matchAll(/^\s*(\w+):\s*"((?:[^"\\]|\\.)*)",?\s*$/gm)].map((m) => [m[1], m[2]]));
  return { answers, hints };
}

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, "g")) || [];
const ids = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

function imageSize(file) {
  const data = fs.readFileSync(path.join(root, file));
  if (data.toString("latin1", 1, 4) === "PNG") return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  if (data.toString("latin1", 0, 4) === "RIFF" && data.toString("latin1", 8, 12) === "WEBP") {
    const kind = data.toString("latin1", 12, 16);
    if (kind === "VP8 ") return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const bits = data.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8X") return { width: data.readUIntLE(24, 3) + 1, height: data.readUIntLE(27, 3) + 1 };
  }
  return null;
}

module.exports = { root, read, exists, loadContent, lessonPages, masteryConfig, attribute, tags, ids, imageSize };
