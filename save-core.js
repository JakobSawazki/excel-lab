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
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const STATE_KEY = "excelLab.state.v1";
  const IMPORT_BACKUP_KEY = "excelLab.importBackup.v1";
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
    assertNagoldEntries(profile);
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
    prepareImport(payload);
    const name = fileName(payload);
    downloadPayload(payload, name);
    remember(payload, name);
    return name;
  }

  function downloadPayload(payload, name) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    if (blob.size > MAX_FILE_BYTES) throw new Error("Die Speicherdatei überschreitet 10 MB. Bitte wende dich an die Lehrkraft; dein Stand bleibt erhalten.");
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function readFile(file) {
    if (file.size > MAX_FILE_BYTES) throw new Error("Datei ist zu groß (höchstens 10 MB).");
    const text = await file.text();
    if (text.length > MAX_FILE_BYTES) throw new Error("Datei ist zu groß (höchstens 10 MB).");
    try { return JSON.parse(text); }
    catch { throw new Error("Die Datei ist kein lesbares JSON. Bitte bewahre das Original auf und wähle eine andere Speicherdatei."); }
  }

  // Format 1 bleibt lesbar, unabhängig von der App-Version. Unbekannte Formate
  // niemals als leeren Stand behandeln; Migrationen brauchen eigene Tests.
  function prepareImport(payload) {
    if (payload?.app !== "Excel-Lab" || payload?.version !== FORMAT || !payload?.profile || typeof payload.profile !== "object" || Array.isArray(payload.profile)) {
      throw new Error("Keine gültige Excel-Lab-Exportdatei oder noch nicht unterstütztes Dateiformat. Bitte das Original behalten und die Lehrkraft ansprechen.");
    }
    if (typeof payload.profile.name !== "string" || !payload.profile.name.trim()
      || (payload.profile.progress !== undefined && (!payload.profile.progress || typeof payload.profile.progress !== "object" || Array.isArray(payload.profile.progress)))) {
      throw new Error("Das Profil in der Speicherdatei ist unvollständig oder nicht lesbar. Keine Daten übernommen. Bitte das Original aufbewahren.");
    }
    const rules = nagold();
    if (!rules) throw new Error("NAGOLD konnte nicht geladen werden. Bitte die Seite neu laden; es wurden keine Daten übernommen.");
    const profile = normalizeProfile(payload.profile);
    if (Object.hasOwn(payload.exportedBy || {}, "nagold")
      && (typeof payload.exportedBy.nagold !== "number" || payload.exportedBy.nagold !== rules.total(profile))) {
      throw new Error("Die NAGOLD-Summe passt nicht zur Tabelle in der Datei. Keine Daten übernommen. Bitte das Original durch die Lehrkraft prüfen lassen.");
    }
    return profile;
  }

  function assertNagoldEntries(profile) {
    const rules = nagold();
    if (profile && Object.hasOwn(profile, "nagoldEntries") && rules) {
      if (!Array.isArray(profile.nagoldEntries) || profile.nagoldEntries.length > rules.maxEntries) {
        throw new Error("Die NAGOLD-Tabelle ist nicht vollständig lesbar oder zu groß. Keine Daten übernommen. Bitte das Original zur Prüfung aufbewahren.");
      }
      profile.nagoldEntries.forEach((entry, index) => {
        if (rules.normalizeEntries([entry]).length !== 1 || entry.purpose.trim().length > 160
          || (entry.lessonId !== undefined && !lessons.some(lesson => lesson.id === entry.lessonId))) {
          throw new Error(`NAGOLD-Zeile ${index + 1} kann nicht verlustfrei übernommen werden. Keine Daten übernommen. Bitte das Original zur Prüfung aufbewahren.`);
        }
      });
    }
  }

  // Eine Rücksicherung vor JEDEM Import und vollständigen Profil-Reset.
  // Scheitert ein Schreibvorgang (z.B.
  // Speicher voll), bleibt der bisherige Stand unverändert und kein Erfolg wird gemeldet.
  function persistImport(state, operation = "Laden") {
    const serialized = JSON.stringify(state);
    const previous = localStorage.getItem(STATE_KEY);
    try {
      if (previous !== null) localStorage.setItem(IMPORT_BACKUP_KEY, previous);
      localStorage.setItem(STATE_KEY, serialized);
    } catch {
      throw new Error(`${operation} konnte nicht sicher gespeichert werden (Browserspeicher möglicherweise voll). Dein bisheriger Stand bleibt erhalten. Bitte zuerst eine Speicherdatei sichern.`);
    }
  }

  function upgradePayload(payload, appVersion) {
    const profile = prepareImport(payload);
    return { ...payload, ...buildPayload(profile, appVersion), upgradedFrom: {
      version: payload.version, appVersion: payload.appVersion || "unbekannt", exportedAt: payload.exportedAt || null
    } };
  }

  // Gleicher Upgrade-Weg auf Startseite und allen Lernseiten. Nur Dateikopie:
  // weder Browserprofil noch Originaldatei werden überschrieben.
  function bindUpgradeControl(container, appVersion) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "button button-secondary save-maintenance-button";
    button.id = "upgrade-save-button"; button.textContent = "Speicherdatei aktualisieren";
    const input = document.createElement("input");
    input.type = "file"; input.accept = "application/json,.json"; input.hidden = true;
    input.id = "upgrade-save-file";
    const feedback = document.createElement("p");
    feedback.setAttribute("role", "status"); feedback.hidden = true;
    const backupButton = document.createElement("button");
    backupButton.type = "button"; backupButton.className = "button button-secondary save-maintenance-button";
    backupButton.id = "import-backup-button"; backupButton.textContent = "Vorherigen Stand sichern";
    const refreshBackup = () => {
      try { backupButton.hidden = !localStorage.getItem(IMPORT_BACKUP_KEY); }
      catch { backupButton.hidden = true; }
    };
    refreshBackup();
    window.addEventListener("excel-lab-progress-change", refreshBackup);
    window.addEventListener("storage", refreshBackup);
    backupButton.addEventListener("click", () => {
      feedback.hidden = false;
      try {
        const backup = JSON.parse(localStorage.getItem(IMPORT_BACKUP_KEY) || "null");
        const profile = backup?.profiles?.find(item => item.id === backup.currentProfileId);
        if (!profile) throw new Error("Kein vorheriges aktives Profil vorhanden. Bitte die Lehrkraft ansprechen.");
        const payload = buildPayload(profile, appVersion);
        prepareImport(payload);
        downloadPayload(payload, fileName(payload).replace(/\.json$/, "_vor-dem-laden.json"));
        feedback.textContent = "Vorheriger Stand zum Download bereitgestellt. Zum Wiederherstellen diese Datei über „Laden“ auswählen.";
      } catch (error) { feedback.textContent = error.message; }
    });
    button.addEventListener("click", () => input.click());
    input.addEventListener("change", async () => {
      const file = input.files?.[0]; if (!file) return;
      feedback.hidden = false;
      try {
        const updated = upgradePayload(await readFile(file), appVersion);
        downloadPayload(updated, fileName(updated).replace(/\.json$/, "_aktualisiert.json"));
        feedback.textContent = `Datei geprüft: ${nagold().total(updated.profile)} NAGOLD, ${updated.profile.nagoldEntries.length} Tabellenzeilen. Aktualisierte Kopie zum Download bereitgestellt. Zum Übernehmen anschließend „Laden“ wählen. Original und aktueller Lernstand sind unverändert.`;
      } catch (error) { feedback.textContent = error.message; }
      finally { input.value = ""; }
    });
    container.append(button, input, backupButton, feedback);
  }

  // Übernimmt eine Speicherdatei in `state` (wird verändert). Dieselbe Person
  // (Kürzel und Klasse) wird ersetzt statt als weiteres Profil angelegt;
  // weniger Abschlüsse nur nach Rückfrage über `confirm(text)`.
  // Ergebnis: "loaded" oder "cancelled"; ungültige Dateien werfen einen Fehler.
  function mergeImport(state, payload, confirm) {
    const imported = prepareImport(payload);
    imported.updatedAt = new Date().toISOString();
    const existing = state.profiles.find((profile) => profile.name === imported.name && profile.className === imported.className);
    if (existing) {
      const rowKey = entry => JSON.stringify([entry.date, entry.time, entry.purpose, entry.points, entry.lessonId || ""]);
      const incoming = imported.nagoldEntries.map(rowKey);
      const missingRows = nagold().entriesFor(existing).some(entry => {
        const index = incoming.indexOf(rowKey(entry));
        if (index < 0) return true;
        incoming.splice(index, 1); return false;
      });
      const warnings = [];
      if (completedCount(imported) < completedCount(existing)) warnings.push(`Die Datei enthält weniger abgeschlossene Einheiten (${completedCount(imported)}) als dein Stand in diesem Browser (${completedCount(existing)}).`);
      if (missingRows || xp(imported) < xp(existing)) warnings.push(`NAGOLD: ${nagold().total(existing)} → ${nagold().total(imported)}. Vorhandene NAGOLD-Zeilen oder XP fehlen bzw. sind verändert.`);
      if (warnings.length && !confirm(`${warnings.join("\n")}\nTrotzdem laden? Der bisherige Browserstand wird zuvor lokal gesichert.`)) return "cancelled";
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
    buildPayload, fileName, recentSaves, remember, describeSave, download, mergeImport, isSaveShortcut, notify, normalizeHighlights, MARK_COLORS,
    MAX_FILE_BYTES, IMPORT_BACKUP_KEY, readFile, prepareImport, persistImport, upgradePayload, bindUpgradeControl
  });
})();
