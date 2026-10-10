(function () {
  "use strict";

  // Lernnachweis: liest nur den gespeicherten Lernstand des aktuellen Profils
  // und stellt ihn druckbar dar. Die Seite schreibt nichts in den Speicher.
  const content = window.EXCEL_LAB_CONTENT;
  if (!content) return;
  const { stages, lessons } = content;
  const bonusTasks = window.EXCEL_LAB_BONUS?.tasks || {};
  const extraTasks = window.EXCEL_LAB_BONUS?.extra || {};
  const BONUS_XP = window.EXCEL_LAB_BONUS?.xp || 0;
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

  function render() {
    const profile = currentProfile();
    $("#certificate").hidden = !profile;
    $("#certificate-empty").hidden = Boolean(profile);
    $("#certificate-print").disabled = !profile;
    if (!profile) return;

    const progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    const done = (lesson) => Boolean(progress[lesson.id]?.completed);
    const bonus = (lesson) => Number(Boolean(bonusTasks[lesson.id] && progress[lesson.id]?.bonus))
      + Number(Boolean(extraTasks[lesson.id] && progress[lesson.id]?.bonus2));
    const completed = lessons.filter(done).length;
    const bonusSolved = lessons.reduce((sum, lesson) => sum + bonus(lesson), 0);
    const bonusAvailable = lessons.reduce((sum, lesson) => sum + Number(Boolean(bonusTasks[lesson.id])) + Number(Boolean(extraTasks[lesson.id])), 0);

    $("#certificate-name").textContent = String(profile.name || "").slice(0, 40);
    $("#certificate-class").textContent = String(profile.className || "–").slice(0, 32);
    $("#certificate-date").textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "Europe/Berlin" }).format(new Date());
    $("#certificate-lessons").textContent = `${completed} von ${lessons.length}`;
    $("#certificate-bonus").textContent = `${bonusSolved} von ${bonusAvailable}`;
    $("#certificate-xp").textContent = (completed * 100 + bonusSolved * BONUS_XP).toLocaleString("de-DE");

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
