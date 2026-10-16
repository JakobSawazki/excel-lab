(function () {
  "use strict";

  // Lernnachweis: liest nur den gespeicherten Lernstand des aktuellen Profils
  // und stellt ihn druckbar dar. Die Seite schreibt nichts in den Speicher.
  const content = window.EXCEL_LAB_CONTENT;
  const core = window.ExcelLabSave;
  if (!content || !core) return;
  const { stages, lessons } = content;
  const $ = (selector) => document.querySelector(selector);

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function currentProfile() {
    try {
      const state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null");
      if (state?.version !== 1 || !Array.isArray(state.profiles)) return null;
      return state.profiles.find((profile) => profile?.id === state.currentProfileId) || null;
    } catch {
      return null;
    }
  }

  // Das X führt zurück zur Startseite und öffnet dort wieder das Profilfenster.
  $("#certificate-close")?.addEventListener("click", () => {
    try { sessionStorage.setItem("excelLab.openProfile", "1"); } catch { /* Dann öffnet sich nur die Startseite. */ }
  });

  function render() {
    const profile = currentProfile();
    $("#certificate").hidden = !profile;
    $("#certificate-empty").hidden = Boolean(profile);
    $("#certificate-print").disabled = !profile;
    if (!profile) return;

    const progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    const done = (lesson) => Boolean(progress[lesson.id]?.completed);
    const bonus = (lesson) => core.bonusSolved(lesson.id, progress[lesson.id]);
    const { completed, bonusSolved, bonusAvailable, xp } = core.xpStats(profile);

    $("#certificate-name").textContent = String(profile.name || "").slice(0, 40);
    $("#certificate-class").textContent = String(profile.className || "–").slice(0, 32);
    $("#certificate-date").textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "Europe/Berlin" }).format(new Date());
    $("#certificate-lessons").textContent = `${completed} von ${lessons.length}`;
    $("#certificate-bonus").textContent = `${bonusSolved} von ${bonusAvailable}`;
    $("#certificate-xp").textContent = xp.toLocaleString("de-DE");
    $("#certificate-nagold").textContent = (window.EXCEL_LAB_NAGOLD ? window.EXCEL_LAB_NAGOLD.total(profile) : 0).toLocaleString("de-DE");

    const container = $("#certificate-stages");
    container.replaceChildren();
    for (const stage of stages) {
      const stageLessons = lessons.filter((lesson) => lesson.stage === stage.id);
      const section = node("section", "certificate-stage");
      section.style.setProperty("--stage-color", stage.color);
      const head = node("header", "certificate-stage-head");
      head.append(node("span", "certificate-stage-code", stage.code), node("h3", "", stage.title),
        node("span", "certificate-stage-count", `${stageLessons.filter(done).length} von ${stageLessons.length}`));
      const list = node("ul", "certificate-lessons");
      for (const lesson of stageLessons) {
        const item = node("li", done(lesson) ? "is-done" : "");
        const mark = node("span", "certificate-check", done(lesson) ? "✓" : "");
        mark.setAttribute("aria-hidden", "true");
        const solved = bonus(lesson);
        item.append(mark, node("span", "certificate-code", lesson.code), node("span", "certificate-title", lesson.title),
          node("span", "certificate-state", `${done(lesson) ? "abgeschlossen" : "offen"}${solved ? ` · ${solved} Bonus` : ""}`));
        list.append(item);
      }
      section.append(head, list);
      container.append(section);
    }
  }

  $("#certificate-print").addEventListener("click", () => window.print());
  window.addEventListener("storage", render);
  window.addEventListener("pageshow", render);
  render();
})();
