(function () {
  "use strict";

  // Gesamtfortschritt in der Profilkarte (Startseite und Lernseiten): ein
  // schmaler Balken aus vier Abschnitten (L1–L4, Breite nach Zahl der
  // Einheiten) mit Prozentwert. Ein Klick klappt darunter die Einzelheiten je
  // Lernschritt auf. Wunsch Jakob vom 16.10.2026; ersetzt den Ring im Startbild.
  const content = window.EXCEL_LAB_CONTENT;
  if (!Array.isArray(content?.lessons) || !Array.isArray(content?.stages)) return;
  const { stages, lessons } = content;
  let open = false;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function stats(profile) {
    const done = (lesson) => Boolean(profile?.progress?.[lesson.id]?.completed);
    const rows = stages.map((stage) => {
      const own = lessons.filter((lesson) => lesson.stage === stage.id);
      return { stage, total: own.length, completed: own.filter(done).length };
    });
    const completed = lessons.filter(done).length;
    return { rows, completed, percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0 };
  }

  // Liefert [Knopf, Einzelheiten]: der Knopf gehört in die Profilkarte, die
  // Einzelheiten direkt unter die Karte.
  function render(profile, idPrefix) {
    const { rows, completed, percent } = stats(profile);
    const detailId = `${idPrefix}-progress-detail`;
    const button = el("button", "profile-progress");
    button.type = "button";
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-controls", detailId);
    button.setAttribute("aria-label", `Gesamtfortschritt ${percent} %, ${completed} von ${lessons.length} Einheiten. Einzelheiten ${open ? "ausblenden" : "anzeigen"}`);
    button.title = "Gesamtfortschritt: Einzelheiten anzeigen";
    const head = el("span", "profile-progress-head");
    head.append(el("span", "profile-progress-label", "Gesamtfortschritt"), el("strong", "profile-progress-value", `${percent} %`));
    const bar = el("span", "profile-progress-bar");
    for (const row of rows) {
      const part = el("span", "profile-progress-part");
      part.style.flexGrow = String(row.total);
      part.style.setProperty("--stage-color", row.stage.color);
      part.style.setProperty("--fill", `${row.total ? Math.round((row.completed / row.total) * 100) : 0}%`);
      bar.append(part);
    }
    button.append(head, bar);

    const detail = el("div", "profile-progress-detail");
    detail.id = detailId;
    detail.hidden = !open;
    for (const row of rows) {
      const line = el("div", "profile-progress-row");
      line.style.setProperty("--stage-color", row.stage.color);
      const meter = el("span", "profile-progress-meter");
      meter.style.setProperty("--fill", `${row.total ? Math.round((row.completed / row.total) * 100) : 0}%`);
      line.append(el("span", "profile-progress-code", row.stage.code), el("span", "profile-progress-name", row.stage.shortTitle || row.stage.title), meter,
        el("span", "profile-progress-count", `${row.completed}/${row.total}`));
      detail.append(line);
    }
    button.addEventListener("click", () => {
      open = !open;
      detail.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", `Gesamtfortschritt ${percent} %, ${completed} von ${lessons.length} Einheiten. Einzelheiten ${open ? "ausblenden" : "anzeigen"}`);
    });
    return [button, detail];
  }

  window.ExcelLabProfileProgress = Object.freeze({ render, stats });
})();
