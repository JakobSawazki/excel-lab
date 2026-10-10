(function () {
  "use strict";

  // Klassenübersicht: liest Speicherdateien der Lernenden nur in diesem Fenster
  // ein. Nichts wird gespeichert oder übertragen; alle Texte aus den Dateien
  // gelangen ausschließlich über textContent in die Seite.
  const content = window.EXCEL_LAB_CONTENT;
  if (!content) return;
  const { stages, lessons } = content;
  const bonusTasks = window.EXCEL_LAB_BONUS?.tasks || {};
  const extraTasks = window.EXCEL_LAB_BONUS?.extra || {};
  const BONUS_XP = window.EXCEL_LAB_BONUS?.xp || 0;
  const LESSON_XP = 100;
  const MAX_FILE_SIZE = 1_000_000;
  const $ = (selector) => document.querySelector(selector);
  const students = new Map();
  let rejected = [];

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function clean(value, limit) {
    return typeof value === "string" ? value.trim().slice(0, limit) : "";
  }

  // Liefert den bereinigten Lernstand einer Person oder wirft eine lesbare Meldung.
  function readPayload(payload) {
    if (!payload || payload.app !== "Excel-Lab" || payload.version !== 1 || !payload.profile || typeof payload.profile !== "object") {
      throw new Error("keine Excel-Lab-Speicherdatei");
    }
    const name = clean(payload.profile.name, 40).toLocaleLowerCase("de");
    if (!name) throw new Error("ohne Kürzel");
    const className = clean(payload.profile.className, 32).toLocaleUpperCase("de");
    const saved = payload.profile.progress && typeof payload.profile.progress === "object" ? payload.profile.progress : {};
    const exportedAt = Date.parse(payload.exportedAt);
    const progress = {};
    for (const lesson of lessons) {
      const entry = saved[lesson.id] && typeof saved[lesson.id] === "object" ? saved[lesson.id] : {};
      const completed = Boolean(entry.completed);
      const started = completed || Boolean(entry.masteryPassed) || Boolean(entry.teacherChecked)
        || (Array.isArray(entry.checks) && entry.checks.some(Boolean));
      progress[lesson.id] = {
        status: completed ? "done" : started ? "progress" : "open",
        // Zahl der gelösten Bonusaufgaben dieser Einheit (0 bis 2)
        bonus: Number(Boolean(entry.bonus) && Boolean(bonusTasks[lesson.id])) + Number(Boolean(entry.bonus2) && Boolean(extraTasks[lesson.id]))
      };
    }
    const completedCount = lessons.filter((lesson) => progress[lesson.id].status === "done").length;
    const bonusCount = lessons.reduce((sum, lesson) => sum + progress[lesson.id].bonus, 0);
    return {
      name,
      className,
      exportedAt: Number.isNaN(exportedAt) ? 0 : exportedAt,
      appVersion: clean(payload.appVersion, 12),
      progress,
      completedCount,
      bonusCount,
      xp: completedCount * LESSON_XP + bonusCount * BONUS_XP
    };
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList || []);
    rejected = [];
    for (const file of files) {
      try {
        if (file.size > MAX_FILE_SIZE) throw new Error("Datei zu groß");
        const student = readPayload(JSON.parse(await file.text()));
        const key = `${student.className}|${student.name}`;
        const existing = students.get(key);
        // Von mehreren Dateien derselben Person zählt die zuletzt gesicherte.
        if (!existing || student.exportedAt >= existing.exportedAt) students.set(key, student);
      } catch (error) {
        rejected.push(`${file.name}: ${error instanceof SyntaxError ? "kein gültiges JSON" : error.message}`);
      }
    }
    render(files.length);
  }

  function sorted() {
    return Array.from(students.values()).sort((a, b) => a.className.localeCompare(b.className, "de") || a.name.localeCompare(b.name, "de"));
  }

  function formatDate(timestamp) {
    return timestamp ? new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(timestamp)) : "unbekannt";
  }

  const STATUS = {
    done: { symbol: "✓", label: "abgeschlossen" },
    progress: { symbol: "◐", label: "in Arbeit" },
    open: { symbol: "·", label: "offen" }
  };

  function renderTable(list) {
    const table = $("#teacher-table");
    table.replaceChildren();
    const head = document.createElement("thead");
    const groupRow = document.createElement("tr");
    for (const [text, span] of [["Person", 2], ["Stand", 3]]) {
      const cell = node("th", "teacher-group", text);
      cell.colSpan = span;
      cell.scope = "colgroup";
      groupRow.append(cell);
    }
    for (const stage of stages) {
      const cell = node("th", "teacher-group teacher-stage", `${stage.code} · ${stage.shortTitle}`);
      cell.colSpan = lessons.filter((lesson) => lesson.stage === stage.id).length;
      cell.scope = "colgroup";
      cell.style.setProperty("--stage-color", stage.color);
      groupRow.append(cell);
    }
    const labelRow = document.createElement("tr");
    for (const text of ["Kürzel", "Klasse", "Einheiten", "Bonus", "XP"]) {
      const cell = node("th", "", text);
      cell.scope = "col";
      labelRow.append(cell);
    }
    for (const lesson of lessons) {
      const cell = node("th", "teacher-lesson", lesson.code);
      cell.scope = "col";
      cell.title = lesson.title;
      labelRow.append(cell);
    }
    head.append(groupRow, labelRow);

    const body = document.createElement("tbody");
    for (const student of list) {
      const row = document.createElement("tr");
      const nameCell = node("th", "teacher-name", student.name);
      nameCell.scope = "row";
      nameCell.title = `Gesichert am ${formatDate(student.exportedAt)}${student.appVersion ? ` · Version ${student.appVersion}` : ""}`;
      row.append(nameCell, node("td", "", student.className || "–"),
        node("td", "teacher-number", `${student.completedCount}/${lessons.length}`),
        node("td", "teacher-number", String(student.bonusCount)),
        node("td", "teacher-number teacher-xp", String(student.xp)));
      for (const lesson of lessons) {
        const entry = student.progress[lesson.id];
        const status = STATUS[entry.status];
        const cell = node("td", "teacher-status-cell");
        const badge = node("span", `teacher-cell is-${entry.status}${entry.bonus ? " has-bonus" : ""}`, status.symbol);
        badge.setAttribute("aria-hidden", "true");
        const bonusText = entry.bonus ? `, ${entry.bonus === 1 ? "eine Bonusaufgabe" : `${entry.bonus} Bonusaufgaben`} gelöst` : "";
        cell.append(badge, node("span", "sr-only", `${lesson.code} ${status.label}${bonusText}`));
        cell.title = `${lesson.code} ${lesson.title}: ${status.label}${bonusText}`;
        row.append(cell);
      }
      body.append(row);
    }

    const foot = document.createElement("tfoot");
    const footRow = document.createElement("tr");
    const footLabel = node("th", "", "Abgeschlossen von");
    footLabel.scope = "row";
    footLabel.colSpan = 5;
    footRow.append(footLabel);
    for (const lesson of lessons) {
      const count = list.filter((student) => student.progress[lesson.id].status === "done").length;
      footRow.append(node("td", "teacher-number", String(count)));
    }
    foot.append(footRow);
    table.append(head, body, foot);
  }

  function render(readCount) {
    const list = sorted();
    const hasData = list.length > 0;
    $("#teacher-summary").hidden = !hasData;
    $("#teacher-table-section").hidden = !hasData;
    $("#teacher-csv").disabled = !hasData;
    $("#teacher-clear").disabled = !hasData;
    const errors = $("#teacher-errors");
    errors.replaceChildren(...rejected.map((message) => node("li", "", message)));
    errors.hidden = rejected.length === 0;
    if (!hasData) {
      $("#teacher-status").textContent = rejected.length ? "Keine der Dateien konnte gelesen werden." : "Noch keine Datei eingelesen.";
      $("#teacher-table").replaceChildren();
      return;
    }
    const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
    $("#teacher-count").textContent = String(list.length);
    $("#teacher-average").textContent = `${average(list.map((student) => student.completedCount)).toLocaleString("de-DE", { maximumFractionDigits: 1 })} von ${lessons.length}`;
    $("#teacher-bonus").textContent = String(list.reduce((sum, student) => sum + student.bonusCount, 0));
    $("#teacher-xp").textContent = Math.round(average(list.map((student) => student.xp))).toLocaleString("de-DE");
    const classes = new Set(list.map((student) => student.className || "ohne Klasse"));
    $("#teacher-status").textContent = `${list.length} ${list.length === 1 ? "Person" : "Personen"} aus ${classes.size} ${classes.size === 1 ? "Klasse" : "Klassen"} in der Übersicht`
      + (readCount ? ` · ${readCount - rejected.length} von ${readCount} Dateien gelesen` : "")
      + (rejected.length ? ` · ${rejected.length} nicht lesbar` : "") + ".";
    renderTable(list);
  }

  function downloadCsv() {
    const list = sorted();
    if (!list.length) return;
    // Zellen in Anführungszeichen; führende Formelzeichen entschärfen, damit Excel nichts ausführt.
    const cell = (value) => `"${String(value).replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
    const header = ["Kürzel", "Klasse", "Gesichert am", "Einheiten", "Bonus", "XP", ...lessons.map((lesson) => lesson.code)];
    const rows = list.map((student) => [
      student.name, student.className, formatDate(student.exportedAt), student.completedCount, student.bonusCount, student.xp,
      ...lessons.map((lesson) => {
        const entry = student.progress[lesson.id];
        return `${STATUS[entry.status].label}${entry.bonus === 1 ? " + Bonus" : entry.bonus > 1 ? ` + ${entry.bonus} Bonus` : ""}`;
      })
    ]);
    const csv = "﻿" + [header, ...rows].map((row) => row.map(cell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${new Date().toISOString().slice(0, 10)}_Excel-Lab_Klassenuebersicht.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const input = $("#teacher-files");
  const drop = $("#teacher-drop");
  input.addEventListener("change", async () => { await addFiles(input.files); input.value = ""; });
  $("#teacher-csv").addEventListener("click", downloadCsv);
  $("#teacher-clear").addEventListener("click", () => { students.clear(); rejected = []; render(0); });
  for (const type of ["dragenter", "dragover"]) {
    drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add("is-dragging"); });
  }
  for (const type of ["dragleave", "drop"]) {
    drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.remove("is-dragging"); });
  }
  drop.addEventListener("drop", (event) => addFiles(event.dataTransfer?.files));
})();
