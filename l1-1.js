(function () {
  "use strict";

  const STORAGE_KEY = "excelLab.state.v1";
  const LESSON_ID = "l1-1";
  const CHECK_COUNT = 3;
  const POINTS = 100;
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
      checks: Array.from({ length: CHECK_COUNT }, (_, index) => Boolean(saved.checks?.[index]))
    };
  }

  function saveProgress(state, profile, nextProgress) {
    if (!state || !profile) return false;
    profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    profile.progress[LESSON_ID] = nextProgress;
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
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

  function render() {
    const saved = progress(profile);
    const prerequisites = saved.checks.filter(Boolean).length + (saved.teacherChecked ? 1 : 0);
    const percent = saved.completed ? 100 : Math.round((prerequisites / (CHECK_COUNT + 1)) * 100);

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
      input.disabled = !profile;
    });
    $("#page-teacher-check").checked = saved.teacherChecked;
    $("#page-teacher-check").disabled = !profile;

    const completeButton = $("#page-complete-button");
    completeButton.textContent = profile ? saved.completed ? "✓ L1.1 wieder öffnen" : "L1.1 abschließen" : "Zuerst Lernprofil anlegen";
    completeButton.classList.toggle("button-primary", !saved.completed);
    completeButton.classList.toggle("button-secondary", saved.completed);
    completeButton.classList.toggle("is-complete", saved.completed);

    const nextLink = $("#next-lesson-link");
    nextLink.classList.toggle("is-disabled", !saved.completed);
    nextLink.setAttribute("aria-disabled", saved.completed ? "false" : "true");
    $("#page-completion-note").textContent = profile
      ? saved.completed
        ? "100 Punkte wurden gutgeschrieben. Du kannst den Abschluss wieder zurücknehmen."
        : "Erst nach der Bestätigung durch die Lehrkraft werden 100 Punkte gutgeschrieben."
      : "Lege auf der Startseite zuerst dein Lernprofil mit Account und Klassenbezeichnung an.";
  }

  function updateFromForm() {
    if (!profile) return;
    const next = progress(profile);
    next.checks = $$('[data-page-check]').map((input) => input.checked);
    next.teacherChecked = $("#page-teacher-check").checked;
    saveProgress(state, profile, next);
    render();
  }

  $("#lesson-theme-toggle").addEventListener("click", () => {
    state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-page-check], #page-teacher-check")) updateFromForm();
  });

  $("#page-complete-button").addEventListener("click", () => {
    if (!profile) {
      window.location.href = "index.html#uebersicht";
      return;
    }
    const next = progress(profile);
    if (next.completed) {
      next.completed = false;
      saveProgress(state, profile, next);
      render();
      showToast("L1.1 ist wieder als offen markiert.");
      return;
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
    saveProgress(state, profile, next);
    render();
    showToast("L1.1 abgeschlossen: 100 Punkte. L1.2 ist jetzt freigeschaltet.");
  });

  $("#next-lesson-link").addEventListener("click", (event) => {
    if (!progress(profile).completed) {
      event.preventDefault();
      showToast("Schließe zuerst L1.1 ab.");
    }
  });

  render();
})();
