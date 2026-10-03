(function () {
  "use strict";

  const STORAGE_KEY = "excelLab.state.v1";
  const LESSON_ID = "l1-1";
  const CHECK_COUNT = 3;
  const POINTS = 100;
  const masteryAnswers = { structure: "b", numbers: "c", save: "a" };
  const masteryHints = {
    structure: "Eine Zeile beschreibt einen Artikel. Jede Spalte enthält genau eine Eigenschaft; Überschriften erklären sie.",
    numbers: "Menge und Preis müssen als Zahlen in getrennten Zellen stehen, damit Excel damit rechnen kann.",
    save: "Der Lernstand im Browser und deine Excel-Arbeitsmappe sind zwei getrennte Dateien. Speichere die Arbeitsmappe selbst in Excel."
  };
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return parsed && Array.isArray(parsed.profiles) ? parsed : null;
    } catch {
      return null;
    }
  }

  function currentProfile(state) {
    return state?.profiles?.find((profile) => profile.id === state.currentProfileId) || null;
  }

  function initials(name) {
    return String(name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  }

  function progress(profile) {
    const saved = profile?.progress?.[LESSON_ID] || {};
    return {
      completed: Boolean(saved.completed),
      teacherChecked: Boolean(saved.teacherChecked),
      masteryPassed: Boolean(saved.masteryPassed || saved.completed),
      checks: Array.from({ length: CHECK_COUNT }, (_, index) => Boolean(saved.checks?.[index]))
    };
  }

  function saveProgress(state, profile, nextProgress) {
    if (window.EXCEL_LAB_DEV?.enabled || !state || !profile) return false;
    profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    if (!nextProgress.completed && profile.progress[LESSON_ID]?.completed && profile.progress["l1-2"]) {
      profile.progress["l1-2"].completed = false;
    }
    profile.progress[LESSON_ID] = nextProgress;
    profile.updatedAt = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch { showToast("Speichern im Browser nicht möglich. Prüfe die Browsereinstellungen."); refresh(); return false; }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    $("#toast-region").append(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  let state = loadState();
  let profile = currentProfile(state);
  function refresh() {
    const oldId = profile?.id;
    state = loadState(); profile = currentProfile(state);
    if (oldId !== profile?.id) {
      $("#l11-mastery-form").reset();
      $$("#l11-mastery-form .mastery-question").forEach(el => { delete el.dataset.result; $(".mastery-feedback", el).textContent = ""; });
    }
  }
  function refreshSameProfile() {
    const oldId = profile?.id;
    refresh();
    if (!profile || oldId !== profile.id) { render(); return false; }
    return true;
  }

  function render() {
    const saved = progress(profile);
    const prerequisites = saved.checks.filter(Boolean).length + Number(saved.teacherChecked) + Number(saved.masteryPassed);
    const percent = saved.completed ? 100 : Math.round((prerequisites / (CHECK_COUNT + 3)) * 100);

    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").setAttribute("content", state?.theme === "light" ? "#f4f7f4" : "#0b1422");
    $("#lesson-profile-avatar").textContent = initials(profile?.name);
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = saved.completed ? "Abgeschlossen" : prerequisites ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = saved.completed ? `${POINTS} von ${POINTS} Punkten` : `0 von ${POINTS} Punkten`;

    $$('[data-page-check]').forEach((input) => {
      input.checked = saved.checks[Number(input.dataset.pageCheck)];
      input.disabled = !profile || Boolean(window.EXCEL_LAB_DEV?.enabled);
    });
    $("#page-teacher-check").checked = saved.teacherChecked;
    $("#page-teacher-check").disabled = !profile || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $$("#l11-mastery-form input, #l11-mastery-form button").forEach(el => { el.disabled = !profile || saved.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $$("#l11-mastery-form .mastery-question, #l11-mastery-form button[type='submit']").forEach(el => { el.hidden = saved.masteryPassed; });
    $("#l11-mastery-status").classList.toggle("is-passed", saved.masteryPassed);
    $("#l11-mastery-status").textContent = saved.masteryPassed ? "Verständnis-Check bestanden. Besprich nun deine Excel-Datei mit der Lehrkraft." : "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";

    const completeButton = $("#page-complete-button");
    completeButton.disabled = Boolean(window.EXCEL_LAB_DEV?.enabled);
    completeButton.textContent = profile ? saved.completed ? "✓ L1.1 wieder öffnen" : "L1.1 abschließen" : "Zuerst Lernprofil anlegen";
    completeButton.classList.toggle("button-primary", !saved.completed);
    completeButton.classList.toggle("button-secondary", saved.completed);
    completeButton.classList.toggle("is-complete", saved.completed);

    const nextLink = $("#next-lesson-link");
    nextLink.classList.toggle("is-disabled", !(saved.completed || window.EXCEL_LAB_DEV?.enabled));
    nextLink.setAttribute("aria-disabled", saved.completed || window.EXCEL_LAB_DEV?.enabled ? "false" : "true");
    nextLink.tabIndex = saved.completed || window.EXCEL_LAB_DEV?.enabled ? 0 : -1;
    $("#page-completion-note").textContent = profile
      ? saved.completed
        ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L1.2 erneut gesperrt; ein dortiger Abschluss wird zurückgenommen."
        : "Verständnis-Check, alle drei Arbeitsschritte und die Lehrkraftbestätigung sind nötig. Erst der Abschluss bringt 100 Punkte."
      : "Lege auf der Startseite zuerst dein Lernprofil mit Account und Klassenbezeichnung an.";
  }

  function updateFromForm(event) {
    if (window.EXCEL_LAB_DEV?.enabled || !refreshSameProfile()) return;
    const next = progress(profile);
    if (event.target.id === "page-teacher-check") next.teacherChecked = event.target.checked;
    else next.checks[Number(event.target.dataset.pageCheck)] = event.target.checked;
    if (next.completed && (!next.teacherChecked || !next.checks.every(Boolean))) next.completed = false;
    saveProgress(state, profile, next);
    render();
  }

  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh();
    state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-page-check], #page-teacher-check")) updateFromForm(event);
  });
  $("#l11-mastery-form").addEventListener("submit", event => {
    event.preventDefault();
    if (window.EXCEL_LAB_DEV?.enabled || !refreshSameProfile() || progress(profile).masteryPassed) return;
    let allCorrect = true;
    for (const [name, answer] of Object.entries(masteryAnswers)) {
      const question = $(`[data-mastery-question="${name}"]`);
      const selected = $("input:checked", question)?.value;
      const correct = selected === answer;
      question.dataset.result = correct ? "correct" : "incorrect";
      $(".mastery-feedback", question).textContent = correct ? "Richtig." : selected ? masteryHints[name] : "Wähle eine Antwort.";
      allCorrect = allCorrect && correct;
    }
    if (!allCorrect) {
      $("#l11-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
      $('.mastery-question[data-result="incorrect"]')?.scrollIntoView({ block: "nearest" }); return;
    }
    const next = progress(profile); next.masteryPassed = true;
    if (saveProgress(state, profile, next)) showToast("Verständnis-Check bestanden. Zeige nun deine Excel-Datei der Lehrkraft.");
    render();
  });

  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    if (profile && !refreshSameProfile()) return;
    if (!profile) {
      window.location.href = "index.html#uebersicht";
      return;
    }
    const next = progress(profile);
    if (next.completed) {
      next.completed = false;
      const saved = saveProgress(state, profile, next);
      render();
      if (saved) showToast("L1.1 ist wieder offen. L1.2 ist wieder gesperrt.");
      return;
    }
    if (!next.masteryPassed) {
      $("#l11-mastery-section").open = true;
      $("#l11-mastery-section").scrollIntoView({block: "start", behavior: "smooth"});
      showToast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (next.checks.some((checked) => !checked)) {
      showToast("Hake zuerst alle drei eigenen Arbeitsschritte ab.");
      return;
    }
    if (!next.teacherChecked) {
      showToast("Die Bestätigung durch die Lehrkraft fehlt noch.");
      return;
    }
    next.completed = true;
    const saved = saveProgress(state, profile, next);
    render();
    if (saved) showToast("L1.1 abgeschlossen: 100 Punkte. L1.2 ist jetzt freigeschaltet.");
  });

  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); render();
    if (!window.EXCEL_LAB_DEV?.enabled && !progress(profile).completed) {
      event.preventDefault();
      showToast("Schließe zuerst L1.1 ab.");
    }
  });

  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });
  window.addEventListener("storage", event => { if (event.key === STORAGE_KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  render();
})();
