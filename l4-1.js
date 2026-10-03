(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l4-1";
  const $ = (s) => document.querySelector(s);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Die Summe ist keine weitere Aktion. Wähle die vier Kategorien mit ihren Werten.",
    axis: "Nur mit einer Nullbasis entsprechen die Säulenhöhen den Mengenverhältnissen.",
    change: "Ein verknüpftes Diagramm übernimmt den geänderten Wert aus seiner Datenquelle."
  };
  let state, profile;
  function refresh() {
    const oldId = profile?.id;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((p) => p.id === state.currentProfileId) : null;
    if (oldId !== profile?.id) {
      $("#l41-mastery-form").reset();
      document.querySelectorAll("#l41-mastery-form .mastery-question").forEach(el => {
        delete el.dataset.result; el.querySelector(".mastery-feedback").textContent = "";
      });
    }
  }
  function unlocked() { return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l3-8"]?.completed); }
  function progress() {
    const p = profile?.progress?.[ID];
    return { completed: Boolean(p?.completed), teacherChecked: Boolean(p?.teacherChecked), masteryPassed: Boolean(p?.masteryPassed || p?.completed), checks: checks.map((_, i) => Boolean(p?.checks?.[i])) };
  }
  function toast(message) {
    const el = document.createElement("div"); el.className = "toast"; el.textContent = message;
    $("#toast-region").append(el); setTimeout(() => el.remove(), 4500);
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch { toast("Speichern im Browser nicht möglich. Prüfe die Browsereinstellungen, bevor du weiterarbeitest."); refresh(); return false; }
  }
  function save(next) {
    if (window.EXCEL_LAB_DEV?.enabled || !profile) return false;
    profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    // The existing overview treats a completed L4.2 as unlocked even without L4.1.
    // Revoke that completion too, retaining its checks and all other lesson data.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l4-2"]) {
      profile.progress["l4-2"].completed = false;
    }
    profile.progress[ID] = next; profile.updatedAt = new Date().toISOString();
    return persist();
  }
  function render() {
    const open = unlocked(), p = progress();
    const count = p.checks.filter(Boolean).length + Number(p.teacherChecked) + Number(p.masteryPassed);
    const percent = open ? p.completed ? 100 : Math.round(count / (checks.length + 3) * 100) : 0;
    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").content = state?.theme === "light" ? "#f4f7f4" : "#0b1422";
    $("#l41-content").hidden = !open; $("#l41-access").hidden = open;
    $("#l41-access-message").textContent = profile ? "Schließe L3.8 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen." : "Lege auf der Startseite dein Lernprofil an und schließe L3.8 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : p.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && p.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((el, i) => { el.checked = p.checks[i]; el.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#page-teacher-check").checked = p.teacherChecked; $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l41-mastery-form").querySelectorAll("input, button").forEach(el => { el.disabled = !open || p.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#l41-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach(el => { el.hidden = p.masteryPassed; });
    const status = $("#l41-mastery-status");
    status.classList.toggle("is-passed", p.masteryPassed);
    if (p.masteryPassed) status.textContent = "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft.";
    else status.textContent = "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";
    const button = $("#page-complete-button"); button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = p.completed ? "✓ L4.1 wieder öffnen" : "L4.1 abschließen";
    button.classList.toggle("button-primary", !p.completed); button.classList.toggle("button-secondary", p.completed);
    $("#page-completion-note").textContent = p.completed ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L4.2 erneut gesperrt; ein dortiger Abschluss wird ebenfalls zurückgenommen." : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link"), ready = open && (p.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready); next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }
  $("#l41-mastery-form").addEventListener("submit", event => {
    event.preventDefault();
    const oldProfileId = profile?.id;
    refresh();
    if (!unlocked() || !profile || oldProfileId !== profile.id || progress().masteryPassed || window.EXCEL_LAB_DEV?.enabled) { render(); return; }
    let allCorrect = true;
    for (const [name, answer] of Object.entries(masteryAnswers)) {
      const question = document.querySelector(`[data-mastery-question="${name}"]`);
      const selected = question.querySelector("input:checked")?.value;
      const correct = selected === answer;
      question.dataset.result = correct ? "correct" : "incorrect";
      question.querySelector(".mastery-feedback").textContent = correct ? "Richtig." : selected ? masteryHints[name] : "Wähle eine Antwort.";
      allCorrect = allCorrect && correct;
    }
    if (!allCorrect) {
      $("#l41-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
      document.querySelector('.mastery-question[data-result="incorrect"]')?.scrollIntoView({ block: "nearest" });
      return;
    }
    const next = progress(); next.masteryPassed = true;
    if (save(next)) { render(); toast("Verständnis-Check bestanden. Zeige nun die Excel-Datei der Lehrkraft."); }
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-page-check], #page-teacher-check")) return;
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id;
    refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (event.target.id === "page-teacher-check") next.teacherChecked = event.target.checked;
    else next.checks[Number(event.target.dataset.pageCheck)] = event.target.checked;
    const revoked = next.completed && (!next.teacherChecked || !next.checks.every(Boolean));
    if (revoked) next.completed = false;
    const saved = save(next); render();
    if (saved && revoked) toast("Abschluss zurückgenommen. L4.2 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id; refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l41-mastery-section").open = true;
      $("#l41-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next); render();
    if (saved) toast(next.completed ? "L4.1 abgeschlossen: 100 Punkte. L4.2 ist freigeschaltet." : "L4.1 ist wieder offen. L4.2 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) { event.preventDefault(); render(); toast("Schließe zuerst L4.1 ab."); }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh(); state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light"; persist(); render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });
  const SVG_NS = "http://www.w3.org/2000/svg";
  function svgElement(name, attributes, text) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderChart() {
    const minimum = Number(document.querySelector('input[name="axis-start"]:checked').value);
    const top = 50, bottom = 242, left = 53, right = 345;
    const y = value => bottom - (value - minimum) / (100 - minimum) * (bottom - top);
    const grid = $("#l41-chart-grid"), bars = $("#l41-chart-bars");
    grid.replaceChildren(); bars.replaceChildren();
    for (let value = minimum; value <= 100; value += 20) {
      grid.append(svgElement("line", { x1: left, x2: right, y1: y(value), y2: y(value), class: "l41-grid-line" }));
      grid.append(svgElement("text", { x: left - 9, y: y(value) + 4, "text-anchor": "end" }, String(value)));
    }
    grid.append(svgElement("line", { x1: left, x2: left, y1: top, y2: bottom, class: "l41-axis-line" }));
    [45, 60, 75, 90].forEach((value, i) => {
      const x = 69 + i * 70;
      bars.append(svgElement("rect", { x, y: y(value), width: 36, height: bottom - y(value), class: "l41-bar" }));
      bars.append(svgElement("text", { x: x + 18, y: y(value) - 8, "text-anchor": "middle", class: "l41-value" }, String(value)));
      bars.append(svgElement("text", { x: x + 18, y: bottom + 22, "text-anchor": "middle" }, "ABCD"[i]));
    });
    $("#l41-chart-description").textContent = "Vier Gruppen: A 45, B 60, C 75, D 90. Die Größenachse beginnt bei " + minimum + ".";
    $("#l41-axis-status").textContent = minimum === 0
      ? "Die Achse beginnt bei 0. D hat doppelt so viele Anmeldungen wie A und die doppelte Säulenhöhe."
      : "Die Achse beginnt bei 40. D wirkt zehnmal so hoch wie A, obwohl die Anzahl nur doppelt so groß ist.";
    $("#l41-demo").classList.toggle("is-truncated", minimum !== 0);
  }
  document.querySelectorAll('input[name="axis-start"]').forEach(input => input.addEventListener("change", renderChart));
  renderChart();
  refresh(); render();
})();
