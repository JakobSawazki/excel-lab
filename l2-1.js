(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l2-1";
  const $ = (selector) => document.querySelector(selector);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  let state, profile;

  function refresh() {
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((item) => item.id === state.currentProfileId) : null;
  }
  function unlocked() {
    return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l1-6"]?.completed);
  }
  function progress() {
    const saved = profile?.progress?.[ID];
    return {
      completed: Boolean(saved?.completed),
      teacherChecked: Boolean(saved?.teacherChecked),
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
    // A revoked L2.1 completion must also revoke the next lesson's completion.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l2-2"]) {
      profile.progress["l2-2"].completed = false;
    }
    profile.progress[ID] = next;
    profile.updatedAt = new Date().toISOString();
    return persist();
  }
  function render() {
    const open = unlocked();
    const current = progress();
    const checkedCount = current.checks.filter(Boolean).length + Number(current.teacherChecked);
    const percent = open ? current.completed ? 100 : Math.round(checkedCount / (checks.length + 2) * 100) : 0;
    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").content = state?.theme === "light" ? "#f4f7f4" : "#0b1422";
    $("#l21-content").hidden = !open;
    $("#l21-access").hidden = open;
    $("#l21-access-message").textContent = profile
      ? "Schließe L1.6 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen."
      : "Lege auf der Startseite dein Lernprofil an und schließe L1.6 ab.";
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
    const button = $("#page-complete-button");
    button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = current.completed ? "✓ L2.1 wieder öffnen" : "L2.1 abschließen";
    button.classList.toggle("button-primary", !current.completed);
    button.classList.toggle("button-secondary", current.completed);
    $("#page-completion-note").textContent = current.completed
      ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L2.2 erneut gesperrt; ein dortiger Abschluss wird zurückgenommen."
      : "Alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link");
    const ready = open && (current.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready);
    next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }

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
    if (saved && revoked) toast("Abschluss zurückgenommen. L2.2 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const previousProfileId = profile?.id;
    refresh();
    if (!unlocked() || previousProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next);
    render();
    if (saved) toast(next.completed ? "L2.1 abgeschlossen: 100 Punkte. L2.2 ist freigeschaltet." : "L2.1 ist wieder offen. L2.2 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh();
    if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) {
      event.preventDefault();
      render();
      toast("Schließe zuerst L2.1 ab.");
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
