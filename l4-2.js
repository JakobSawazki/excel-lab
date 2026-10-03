(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l4-2";
  const $ = (s) => document.querySelector(s);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Sortiere Namen und Zahlen gemeinsam. Die Summe ist keine weitere Kategorie.",
    axis: "Im Balkendiagramm liegt die Größenachse waagerecht. Die Nullbasis erhält die Mengenverhältnisse.",
    change: "Gleiche Anmeldezahlen müssen gleich lange Balken ergeben; ihre Reihenfolge macht niemanden allein zum Spitzenreiter."
  };
  let state, profile;
  function refresh() {
    const oldId = profile?.id;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((p) => p.id === state.currentProfileId) : null;
    if (oldId !== profile?.id) {
      $("#l42-mastery-form").reset();
      document.querySelectorAll("#l42-mastery-form .mastery-question").forEach(el => {
        delete el.dataset.result; el.querySelector(".mastery-feedback").textContent = "";
      });
    }
  }
  function unlocked() { return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l4-1"]?.completed); }
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
    // The existing overview treats a completed L4.3 as unlocked even without L4.2.
    // Revoke that completion too, retaining its checks and all other lesson data.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l4-3"]) {
      profile.progress["l4-3"].completed = false;
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
    $("#l42-content").hidden = !open; $("#l42-access").hidden = open;
    $("#l42-access-message").textContent = profile ? "Schließe L4.1 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen." : "Lege auf der Startseite dein Lernprofil an und schließe L4.1 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : p.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && p.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((el, i) => { el.checked = p.checks[i]; el.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#page-teacher-check").checked = p.teacherChecked; $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l42-mastery-form").querySelectorAll("input, button").forEach(el => { el.disabled = !open || p.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#l42-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach(el => { el.hidden = p.masteryPassed; });
    const status = $("#l42-mastery-status");
    status.classList.toggle("is-passed", p.masteryPassed);
    if (p.masteryPassed) status.textContent = "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft.";
    else status.textContent = "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";
    const button = $("#page-complete-button"); button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = p.completed ? "✓ L4.2 wieder öffnen" : "L4.2 abschließen";
    button.classList.toggle("button-primary", !p.completed); button.classList.toggle("button-secondary", p.completed);
    $("#page-completion-note").textContent = p.completed ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L4.3 erneut gesperrt; ein dortiger Abschluss wird ebenfalls zurückgenommen." : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link"), ready = open && (p.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready); next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }
  $("#l42-mastery-form").addEventListener("submit", event => {
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
      $("#l42-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
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
    if (saved && revoked) toast("Abschluss zurückgenommen. L4.3 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id; refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l42-mastery-section").open = true;
      $("#l42-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next); render();
    if (saved) toast(next.completed ? "L4.2 abgeschlossen: 100 Punkte. L4.3 ist freigeschaltet." : "L4.2 ist wieder offen. L4.3 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) { event.preventDefault(); render(); toast("Schließe zuerst L4.2 ab."); }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh(); state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light"; persist(); render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });
  const exampleData = [
    ["Roboter und Technik", 36], ["Fotografie und Gestaltung", 60],
    ["Theater und Improvisation", 24], ["Umwelt und Nachhaltigkeit", 48]
  ];
  function renderChart() {
    const rank = document.querySelector('input[name="chart-order"]:checked').value === "rank";
    const rows = rank ? [...exampleData].sort((a, b) => b[1] - a[1]) : exampleData;
    const bars = $("#l42-chart-bars"), table = $("#l42-demo-data");
    bars.replaceChildren(); table.replaceChildren();
    rows.forEach(([label, value]) => {
      const row = document.createElement("div"); row.className = "l42-chart-row";
      const name = document.createElement("span"); name.className = "l42-category"; name.textContent = label;
      const track = document.createElement("span"); track.className = "l42-bar-track";
      const bar = document.createElement("span"); bar.className = "l42-bar"; bar.style.width = value / 60 * 100 + "%";
      const number = document.createElement("span"); number.className = "l42-value"; number.textContent = value;
      track.append(bar); row.append(name, track, number); bars.append(row);
      const tr = document.createElement("tr");
      [label, value].forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.append(td); });
      table.append(tr);
    });
    $("#l42-chart-description").textContent = "Von oben nach unten: " + rows.map(([name,value]) => name + ": " + value).join("; ") + ". Die Balkenlängen verwenden dieselbe Skala ab null.";
    $("#l42-order-status").textContent = rank
      ? "Die größte Anzahl steht oben. Namen und Zahlen wurden gemeinsam umgeordnet; die Werte und Balkenlängen bleiben unverändert."
      : "Die Ausgangsreihenfolge bleibt erhalten. Die größte Anzahl steht an zweiter Stelle.";
  }
  document.querySelectorAll('input[name="chart-order"]').forEach(input => input.addEventListener("change", renderChart));
  renderChart();
  refresh(); render();
})();
