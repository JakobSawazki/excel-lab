(function () {
  "use strict";

  // NAGOLD: Punktetabelle im Profil, wie in WorkbenchLab. Je abgeschlossener
  // Lerneinheit kommt automatisch eine Zeile mit 5 NAGOLD dazu; eigene Zeilen
  // (ganze Punkte von -10 bis 5, nicht 0) tragen Lernende selbst ein. Die Tabelle ist eine
  // Selbstauskunft, verbindlich bleibt die Bewertung der Lehrkraft.
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!Array.isArray(lessons)) return;

  const maxPoints = 5;
  // Wie in WorkbenchLab (Vorgabe Jakob, 11.10.2026): Abzüge durch die Lehrkraft sind möglich,
  // bis −10 für besonders schwere Fälle wie Manipulation; 0 ist kein Eintrag.
  const minPoints = -10;
  const maxManualEntries = 1000;
  const maxEntries = maxManualEntries + lessons.length;
  // „Anwesenheit“ füllt in der Tabelle automatisch 2 NAGOLD vor (wie in WorkbenchLab 0.48.0).
  const presets = ["Anwesenheit", "Mitarbeit", "Zusatzaufgabe", "Präsentation", "Projektarbeit", "Lernprodukt"];
  const attendancePoints = 2;
  // Startkapital (Vorgabe Jakob, 16.10.2026): einmalig 5 NAGOLD je Schuljahr,
  // als Zeile „Startkapital“ wie in WorkbenchLab. Das Schuljahr beginnt am 1. August.
  const startCapitalPoints = 5;
  // Jahresziel wie in WorkbenchLab: 100 NAGOLD = 100 %; mehr ist möglich.
  const yearGoal = 100;

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function validTime(value) {
    return typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  }

  const two = (value) => String(value).padStart(2, "0");
  // Datum und Uhrzeit des Geräts, nicht UTC: Der Eintrag soll zum Schultag passen.
  function today(date = new Date()) { return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`; }
  function clock(date = new Date()) { return `${two(date.getHours())}:${two(date.getMinutes())}`; }

  function lessonPurpose(lesson) { return `${lesson.code} · ${lesson.title}`.slice(0, 160); }

  function normalizeEntries(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, maxEntries).flatMap((entry) => {
      // Ältere Dateien haben teils noch keine Uhrzeit/kein Datum. Unbekannte
      // Angaben bleiben leer; nur eindeutige Schreibweisen werden umgewandelt.
      let date = entry?.date ?? "";
      let time = entry?.time ?? "";
      if (typeof date === "string" && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(date)) {
        const [day, month, year] = date.split(".");
        date = `${year}-${two(month)}-${two(day)}`;
      }
      if (typeof time === "string" && /^\d{1,2}:\d{1,2}$/.test(time)) time = time.split(":").map(two).join(":");
      const points = typeof entry?.points === "string" && /^-?\d+$/.test(entry.points) ? Number(entry.points) : entry?.points;
      if (!entry || typeof entry.purpose !== "string" || !entry.purpose.trim()
        || !Number.isInteger(points) || points === 0 || points < minPoints || points > maxPoints
        || (date !== "" && !validDate(date)) || (time !== "" && !validTime(time))) return [];
      const normalized = { date, time, purpose: entry.purpose.trim().slice(0, 160), points };
      if (lessons.some((lesson) => lesson.id === entry.lessonId)) normalized.lessonId = entry.lessonId;
      return [normalized];
    });
  }

  function entriesFor(profile) {
    if (!profile || typeof profile !== "object") return [];
    if (Object.hasOwn(profile, "nagoldEntries")) return normalizeEntries(profile.nagoldEntries);
    // Lernstände aus der Zeit vor der Tabelle: je abgeschlossener Einheit eine
    // Zeile. Datum und Uhrzeit sind nicht bekannt und werden nicht erfunden.
    return lessons.filter((lesson) => Boolean(profile.progress?.[lesson.id]?.completed)).map((lesson) => ({
      date: "", time: "", purpose: lessonPurpose(lesson), points: maxPoints, lessonId: lesson.id
    }));
  }

  function total(profile) {
    return entriesFor(profile).reduce((sum, entry) => sum + entry.points, 0);
  }

  // Bucht die Zeile für eine abgeschlossene Einheit genau einmal.
  function addLessonEntry(profile, lesson, date, time) {
    if (!profile || !lesson || !lessons.some((known) => known.id === lesson.id) || !validDate(date) || !validTime(time)) return false;
    const entries = entriesFor(profile);
    if (entries.some((entry) => entry.lessonId === lesson.id) || entries.length >= maxEntries) return false;
    profile.nagoldEntries = [...entries, { date, time, purpose: lessonPurpose(lesson), points: maxPoints, lessonId: lesson.id }];
    return true;
  }

  function isStartCapital(value) {
    return typeof value === "string" && value.trim().toLocaleLowerCase("de-DE") === "startkapital";
  }

  // Schuljahr eines Datums (JJJJ-MM-TT), zum Beispiel "2026/27"; leer bei unbekanntem Datum.
  function schoolYear(date) {
    if (!validDate(date)) return "";
    const year = Number(date.slice(0, 4));
    const start = Number(date.slice(5, 7)) >= 8 ? year : year - 1;
    return `${start}/${String((start + 1) % 100).padStart(2, "0")}`;
  }

  // Gibt es im Schuljahr von `date` schon eine Zeile „Startkapital“? (`except`: diese Zeile nicht mitzählen)
  function startCapitalTaken(entries, date, except) {
    const year = schoolYear(date);
    return Boolean(year) && (Array.isArray(entries) ? entries : []).some((entry) => entry !== except && isStartCapital(entry?.purpose) && schoolYear(entry.date) === year);
  }

  // Vorschläge für „Wofür“; „Startkapital“ nur, solange es im laufenden Schuljahr fehlt.
  function presetOptions(entries) {
    return [...(startCapitalTaken(entries, today()) ? [] : ["Startkapital"]), ...presets, ...lessons.map(lessonPurpose)];
  }

  window.EXCEL_LAB_NAGOLD = Object.freeze({
    maxEntries, maxManualEntries, maxPoints, minPoints, attendancePoints, startCapitalPoints, yearGoal, validDate, validTime, today, clock,
    normalizeEntries, entriesFor, total, addLessonEntry, isStartCapital, schoolYear, startCapitalTaken, presetOptions
  });
})();
