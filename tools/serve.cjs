"use strict";
// Lokale Vorschau für die Browsertests (Claude, 16.10.2026). Liest jede Datei
// einmal und liefert sie danach aus dem Speicher; damit bremsen Google Drive
// und Virenprüfung die Tests nicht. Nur für 127.0.0.1, keine Schreibzugriffe.
// Änderungen an Dateien werden erst nach einem Neustart sichtbar.
// Aufruf aus dem Projektordner:  node tools/serve.cjs [Ordner] [Port]
// Vorgabe: Projektordner, Port 4273.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const port = Number(process.argv[3] || 4273);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".cjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4": "video/mp4", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".woff2": "font/woff2"
};
const cache = new Map();

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400); response.end(); return; }
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.join(root, pathname);
  // Nur Dateien im Ordner; .git und versteckte Ordner werden nicht ausgeliefert.
  if (!file.startsWith(root + path.sep) || /(^|[\\/])\./.test(path.relative(root, file))) { response.writeHead(403); response.end(); return; }
  let body = cache.get(file);
  if (!body) {
    try { body = fs.readFileSync(file); cache.set(file, body); }
    catch { response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); response.end("404"); return; }
  }
  const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = request.headers.range && /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : body.length - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
    response.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${body.length}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : body.subarray(start, end + 1));
    return;
  }
  response.writeHead(200, { "Content-Type": type, "Content-Length": body.length, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
  response.end(request.method === "HEAD" ? undefined : body);
}).listen(port, "127.0.0.1", () => console.log(`Testserver ${root} auf http://127.0.0.1:${port}/`));
