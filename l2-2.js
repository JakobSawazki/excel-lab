(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l2-2";
  const $ = (selector) => document.querySelector(selector);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { row: "b", formula: "c", copy: "a" };
  const masteryHints = {
    row: "Zwei eingefügte Zeilen verschieben jede bisherige Datenzeile um zwei nach unten.",
    formula: "Der gemeinsame Wert muss fest bleiben, die Kurswerte müssen mitwandern.",
    copy: "Prüfe, welche Bezüge beim Kopieren in die nächste Zeile wandern und welcher Bezug auf B3 zeigt."
  };
  let state, profile;

  function refresh() {
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((item) => item.id === state.currentProfileId) : null;
  }
  function unlocked() {
    return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l2-1"]?.completed);
  }
  function progress() {
    const saved = profile?.progress?.[ID];
    return {
      completed: Boolean(saved?.completed),
      teacherChecked: Boolean(saved?.teacherChecked),
      masteryPassed: Boolean(saved?.masteryPassed || saved?.completed),
      checks: checks.map((_, index) => Boolean(saved?.checks?.[index]))
    };
  }
  function toast(message) {
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    $("#toast-region").append(element);
    setTimeout(() => element.remove(), 4500);
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch {
      toast("Speichern im Browser nicht möglich. Prüfe die Browsereinstellungen, bevor du weiterarbeitest.");
      refresh();
      return false;
    }
  }
  function save(next) {
    if (window.EXCEL_LAB_DEV?.enabled || !profile) return false;
    profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    // A revoked L2.2 completion must also revoke the next lesson's completion.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l2-3"]) {
      profile.progress["l2-3"].completed = false;
    }
    profile.progress[ID] = next;
    profile.updatedAt = new Date().toISOString();
    return persist();
  }
  function render() {
    const open = unlocked();
    const current = progress();
    const checkedCount = current.checks.filter(Boolean).length + Number(current.teacherChecked) + Number(current.masteryPassed);
    const percent = open ? current.completed ? 100 : Math.round(checkedCount / (checks.length + 3) * 100) : 0;
    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").content = state?.theme === "light" ? "#f4f7f4" : "#0b1422";
    $("#l22-content").hidden = !open;
    $("#l22-access").hidden = open;
    $("#l22-access-message").textContent = profile
      ? "Schließe L2.1 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen."
      : "Lege auf der Startseite dein Lernprofil an und schließe L2.1 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : current.completed ? "Abgeschlossen" : checkedCount ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && current.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((element, index) => {
      element.checked = current.checks[index];
      element.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    });
    $("#page-teacher-check").checked = current.teacherChecked;
    $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l22-mastery-form").querySelectorAll("input, button").forEach((element) => {
      element.disabled = !open || current.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled);
    });
    $("#l22-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach((element) => {
      element.hidden = current.masteryPassed;
    });
    const masteryStatus = $("#l22-mastery-status");
    if (current.masteryPassed) {
      masteryStatus.textContent = "Verständnis-Check bestanden. Jetzt noch die eigene Excel-Datei prüfen und mit der Lehrkraft besprechen.";
      masteryStatus.classList.add("is-passed");
    } else {
      masteryStatus.classList.remove("is-passed");
    }
    const button = $("#page-complete-button");
    button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = current.completed ? "✓ L2.2 wieder öffnen" : "L2.2 abschließen";
    button.classList.toggle("button-primary", !current.completed);
    button.classList.toggle("button-secondary", current.completed);
    $("#page-completion-note").textContent = current.completed
      ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L2.3 erneut gesperrt; ein dortiger Abschluss wird zurückgenommen."
      : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link");
    const ready = open && (current.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready);
    next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }

  $("#l22-mastery-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const previousProfileId = profile?.id;
    refresh();
    if (!unlocked() || !profile || previousProfileId !== profile.id || progress().masteryPassed || window.EXCEL_LAB_DEV?.enabled) {
      render();
      return;
    }
    let allCorrect = true;
    for (const [name, answer] of Object.entries(masteryAnswers)) {
      const question = document.querySelector(`[data-mastery-question="${name}"]`);
      const selected = question.querySelector(`input[name="${name}"]:checked`)?.value;
      const correct = selected === answer;
      question.dataset.result = correct ? "correct" : "incorrect";
      question.querySelector(".mastery-feedback").textContent = correct ? "Richtig." : selected ? masteryHints[name] : "Wähle eine Antwort.";
      if (!correct) allCorrect = false;
    }
    if (!allCorrect) {
      $("#l22-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
      document.querySelector('.mastery-question[data-result="incorrect"]')?.scrollIntoView({ block: "nearest" });
      return;
    }
    const next = progress();
    next.masteryPassed = true;
    if (save(next)) {
      render();
      toast("Verständnis-Check bestanden. Zeige nun deine Excel-Datei der Lehrkraft.");
    }
  });

  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-page-check], #page-teacher-check") || window.EXCEL_LAB_DEV?.enabled) return;
    const previousProfileId = profile?.id;
    refresh();
    if (!unlocked() || previousProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (event.target.id === "page-teacher-check") next.teacherChecked = event.target.checked;
    else next.checks[Number(event.target.dataset.pageCheck)] = event.target.checked;
    const revoked = next.completed && (!next.teacherChecked || !next.checks.every(Boolean));
    if (revoked) next.completed = false;
    const saved = save(next);
    render();
    if (saved && revoked) toast("Abschluss zurückgenommen. L2.3 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const previousProfileId = profile?.id;
    refresh();
    if (!unlocked() || previousProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l22-mastery-section").open = true;
      $("#l22-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check mit allen drei Fragen.");
      return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next);
    render();
    if (saved) toast(next.completed ? "L2.2 abgeschlossen: 100 Punkte. L2.3 ist freigeschaltet." : "L2.2 ist wieder offen. L2.3 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh();
    if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) {
      event.preventDefault();
      render();
      toast("Schließe zuerst L2.2 ab.");
    }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh();
    state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light";
    persist();
    render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });
  refresh();
  render();
})();
