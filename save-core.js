(function () {
  "use strict";

  // Gemeinsamer Kern für Speichern und Laden (Startseite und Lernseiten) und
  // für die XP-Regel (auch Lernnachweis und Klassenübersicht).
  // Hier stehen Dateiformat, Bereinigung eines Profils, XP-Berechnung,
  // Dateiname, „Zuletzt gespeichert“ und das Übernehmen einer Datei. Die
  // Seiten (app.js, lesson-save.js) kümmern sich nur um Anzeige und Meldungen.
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!Array.isArray(lessons)) return;

  const FORMAT = 1;
  const SAVES_KEY = "excelLab.saves.v1";
  const DEVICE_KEY = "excelLab.device.v1";
  const MAX_SAVES = 5;
  const nagold = () => window.EXCEL_LAB_NAGOLD || null;

  function createId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // Anonyme Kennung dieser Browser-Installation, keine Hardwarekennung.
  function deviceId() {
    try {
      const saved = JSON.parse(localStorage.getItem(DEVICE_KEY) || "null");
      if (saved?.id && typeof saved.id === "string") return saved.id.slice(0, 24);
    } catch {
      // Eine beschädigte Kennung wird durch eine neue lokale Kennung ersetzt.
    }
    const id = `XL-${createId().replace(/[^a-z0-9]/gi, "").slice(0, 10).toLocaleUpperCase("de")}`;
    try { localStorage.setItem(DEVICE_KEY, JSON.stringify({ id })); }
    catch { /* Die App bleibt auch ohne gespeicherte Kennung nutzbar. */ }
    return id;
  }

  function completedCount(profile) {
    return lessons.filter((lesson) => Boolean(profile?.progress?.[lesson.id]?.completed)).length;
  }

  // XP-Regel an einer Stelle für Profilknopf, Startseite, Lernnachweis und
  // Klassenübersicht: 100 XP je abgeschlossener Einheit, je gelöster
  // Bonusaufgabe die XP aus bonus-tasks.js. Je Einheit gibt es bis zu zwei
  // Bonusaufgaben (`bonus` und `bonus2` im Lernstand); sie zählen nur, wenn es
  // die Aufgabe gibt.
  const LESSON_XP = 100;

  function bonusSolved(lessonId, row) {
    const bonus = window.EXCEL_LAB_BONUS || {};
    return Number(Boolean(bonus.tasks?.[lessonId] && row?.bonus)) + Number(Boolean(bonus.extra?.[lessonId] && row?.bonus2));
  }

  function xpStats(profile) {
    const bonus = window.EXCEL_LAB_BONUS || {};
    const bonusXp = bonus.xp || 0;
    const completed = completedCount(profile);
    const bonusDone = lessons.reduce((sum, lesson) => sum + bonusSolved(lesson.id, profile?.progress?.[lesson.id]), 0);
    const bonusAvailable = lessons.reduce((sum, lesson) => sum + Number(Boolean(bonus.tasks?.[lesson.id])) + Number(Boolean(bonus.extra?.[lesson.id])), 0);
    return {
      completed,
      lessons: lessons.length,
      bonusSolved: bonusDone,
      bonusAvailable,
      bonusXp,
      lessonXp: LESSON_XP,
      xp: completed * LESSON_XP + bonusDone * bonusXp,
      maximum: lessons.length * LESSON_XP + bonusAvailable * bonusXp
    };
  }

  const xp = (profile) => xpStats(profile).xp;

  // Textmarker (0.31.0, wie in WorkbenchLab): je Einheit höchstens 400 Stellen
  // mit Absatz-Kennung, Zeichenbereich, markiertem Text und Farbe.
  const MARK_COLORS = new Set(["yellow", "mint", "coral", "green"]);
  function normalizeHighlights(candidate) {
    const result = {};
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return result;
    for (const lesson of lessons) {
      const entries = candidate[lesson.id];
      if (!Array.isArray(entries)) continue;
      const clean = entries.slice(0, 400).filter((item) => item
        && typeof item.block === "string" && /^b-\d{1,4}$/.test(item.block)
        && Number.isInteger(item.start) && Number.isInteger(item.end)
        && item.start >= 0 && item.end > item.start && item.end <= 20000
        && typeof item.quote === "string" && item.quote.length === item.end - item.start
        && MARK_COLORS.has(item.color)).map(({ block, start, end, quote, color }) => ({ block, start, end, quote, color }));
      if (clean.length) result[lesson.id] = clean;
    }
    return result;
  }

  function normalizeProfile(profile, previous) {
    const safeProgress = {};
    if (profile && profile.progress && typeof profile.progress === "object") {
      lessons.forEach((lesson) => {
        const candidate = profile.progress[lesson.id];
        if (!candidate || typeof candidate !== "object") return;
        safeProgress[lesson.id] = {
          completed: Boolean(candidate.completed),
          teacherChecked: Boolean(candidate.teacherChecked),
          // Abschlüsse aus der Zeit vor den Verständnis-Checks gelten als bestanden.
          masteryPassed: Boolean(candidate.masteryPassed || candidate.completed),
          bonus: Boolean(candidate.bonus),
          bonus2: Boolean(candidate.bonus2),
          checks: Array.isArray(candidate.checks)
            ? lesson.checks.map((_, index) => Boolean(candidate.checks[index]))
            : lesson.checks.map(() => false)
        };
      });
    }
    const rules = nagold();
    return {
      id: typeof profile?.id === "string" ? profile.id.slice(0, 80) : createId(),
      name: typeof profile?.name === "string" ? profile.name.trim().toLocaleLowerCase("de").slice(0, 40) || "lernprofil" : "lernprofil",
      className: typeof profile?.className === "string" ? profile.className.trim().toLocaleUpperCase("de").slice(0, 32) : "",
      createdAt: typeof profile?.createdAt === "string" ? profile.createdAt : previous?.createdAt || new Date().toISOString(),
      updatedAt: typeof profile?.updatedAt === "string" ? profile.updatedAt : previous?.updatedAt || new Date().toISOString(),
      progress: safeProgress,
      // NAGOLD-Tabelle: alte Lernstände erhalten je abgeschlossener Einheit eine Zeile.
      // Ohne nagold.js bleiben die vorhandenen Zeilen unverändert erhalten.
      nagoldEntries: rules ? rules.entriesFor(profile) : Array.isArray(profile?.nagoldEntries) ? profile.nagoldEntries : [],
      highlights: normalizeHighlights(profile?.highlights)
    };
  }

  function buildPayload(profile, appVersion) {
    const rules = nagold();
    return {
      app: "Excel-Lab",
      version: FORMAT,
      appVersion,
      exportedAt: new Date().toISOString(),
      exportedBy: { accountName: profile.name, className: profile.className, points: xp(profile), nagold: rules ? rules.total(profile) : 0 },
      device: { id: deviceId(), type: "anonyme Browser-Installation", operatingSystem: /win/i.test(navigator.platform || "") ? "Windows" : "nicht erkannt" },
      profile
    };
  }

  // Dateiname: Berliner Datum, Excel-Lab, Kürzel und Browser-Kennung.
  function fileName(payload) {
    const parts = new Intl.DateTimeFormat("en", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(payload.exportedAt));
    const part = (type) => parts.find((item) => item.type === type).value;
    const safe = (value) => String(value).replace(/[^a-z0-9äöüß._-]+/gi, "-").replace(/^-+|-+$/g, "") || "lernprofil";
    return `${part("year")}-${part("month")}-${part("day")}_Excel-Lab_${safe(payload.profile.name)}_${safe(payload.device.id)}.json`;
  }

  // Zuletzt gespeichert: Die letzten fünf Speicherstände bleiben zusätzlich im
  // Browser. Eine Webseite kann Dateien im Download-Ordner nicht selbst wieder
  // öffnen; die Liste ersetzt das erneute Heraussuchen am selben Gerät.
  function recentSaves() {
    try {
      const list = JSON.parse(localStorage.getItem(SAVES_KEY) || "[]");
      return Array.isArray(list)
        ? list.filter((item) => item && typeof item.savedAt === "string" && item.payload?.app === "Excel-Lab" && item.payload?.version === FORMAT && item.payload?.profile).slice(0, MAX_SAVES)
        : [];
    } catch { return []; }
  }

  function remember(payload, name) {
    try { localStorage.setItem(SAVES_KEY, JSON.stringify([{ savedAt: payload.exportedAt, fileName: name, payload }, ...recentSaves()].slice(0, MAX_SAVES))); }
    catch { /* Ohne freien Speicher bleibt es bei der Datei; der Download ist davon unabhängig. */ }
  }

  function describeSave(item) {
    const by = item.payload.exportedBy || {};
    const date = new Date(item.savedAt);
    const when = Number.isNaN(date.getTime()) ? "Zeit unbekannt" : new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(date);
    return `${when} · ${String(by.accountName || item.payload.profile.name || "").slice(0, 40)} · ${Number(by.points) || 0} XP · ${Number(by.nagold) || 0} NAGOLD`;
  }

  // Erzeugt die Speicherdatei, bietet sie zum Download an und merkt sie sich.
  function download(profile, appVersion) {
    const payload = buildPayload(profile, appVersion);
    const name = fileName(payload);
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    remember(payload, name);
    return name;
  }

  // Übernimmt eine Speicherdatei in `state` (wird verändert). Dieselbe Person
  // (Kürzel und Klasse) wird ersetzt statt als weiteres Profil angelegt;
  // weniger Abschlüsse nur nach Rückfrage über `confirm(text)`.
  // Ergebnis: "loaded" oder "cancelled"; ungültige Dateien werfen einen Fehler.
  function mergeImport(state, payload, confirm) {
    if (payload?.app !== "Excel-Lab" || payload?.version !== FORMAT || !payload?.profile || typeof payload.profile !== "object" || Array.isArray(payload.profile)) {
      throw new Error("Keine gültige Excel-Lab-Exportdatei.");
    }
    const imported = normalizeProfile(payload.profile);
    imported.updatedAt = new Date().toISOString();
    const existing = state.profiles.find((profile) => profile.name === imported.name && profile.className === imported.className);
    if (existing) {
      if (completedCount(imported) < completedCount(existing)
        && !confirm(`Die Datei enthält weniger abgeschlossene Einheiten (${completedCount(imported)}) als dein Stand in diesem Browser (${completedCount(existing)}). Trotzdem laden?`)) {
        return "cancelled";
      }
      imported.id = existing.id;
      imported.createdAt = existing.createdAt;
      state.profiles[state.profiles.indexOf(existing)] = imported;
    } else {
      imported.id = createId();
      state.profiles.push(imported);
    }
    state.currentProfileId = imported.id;
    return "loaded";
  }

  // Tastenkürzel Alt+S (ohne Strg, Umschalt, Befehlstaste; nicht beim Festhalten).
  function isSaveShortcut(event) {
    return Boolean(event?.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.repeat && event.code === "KeyS");
  }

  // Kurze Rückmeldung unten auf der Seite (Bereich #toast-region), falls vorhanden.
  function notify(text) {
    const region = document.querySelector("#toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text;
    region.append(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  window.ExcelLabSave = Object.freeze({
    FORMAT, SAVES_KEY, DEVICE_KEY, LESSON_XP, createId, deviceId, completedCount, bonusSolved, xpStats, xp, normalizeProfile,
    buildPayload, fileName, recentSaves, remember, describeSave, download, mergeImport, isSaveShortcut, notify, normalizeHighlights, MARK_COLORS
  });
})();
