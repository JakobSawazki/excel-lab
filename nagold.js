(function () {
  "use strict";

  // NAGOLD: Punktetabelle im Profil, wie in WorkbenchLab. Je abgeschlossener
  // Lerneinheit kommt automatisch eine Zeile mit 5 NAGOLD dazu; eigene Zeilen
  // (1 bis 5 Punkte) tragen Lernende selbst ein. Die Tabelle ist eine
  // Selbstauskunft, verbindlich bleibt die Bewertung der Lehrkraft.
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!Array.isArray(lessons)) return;

  const maxPoints = 5;
  const maxManualEntries = 1000;
  const maxEntries = maxManualEntries + lessons.length;
  const presets = ["Mitarbeit", "Zusatzaufgabe", "Präsentation", "Projektarbeit", "Lernprodukt"];

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
      const time = entry?.time === undefined ? "" : entry.time;
      if (!entry || typeof entry.purpose !== "string" || !entry.purpose.trim()
        || !Number.isInteger(entry.points) || entry.points < 1 || entry.points > maxPoints
        || (entry.date !== "" && !validDate(entry.date)) || (time !== "" && !validTime(time))) return [];
      const normalized = { date: entry.date, time, purpose: entry.purpose.trim().slice(0, 160), points: entry.points };
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

  function presetOptions() { return [...presets, ...lessons.map(lessonPurpose)]; }

  window.EXCEL_LAB_NAGOLD = Object.freeze({
    maxEntries, maxManualEntries, maxPoints, validDate, validTime, today, clock,
    normalizeEntries, entriesFor, total, addLessonEntry, presetOptions
  });
})();
