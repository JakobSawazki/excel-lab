(function () {
  "use strict";

  // Lernpfad-Menü der Hauptnavigation: Aufbau und Bedienung für die Startseite
  // (app.js) und die Lernseiten (lesson-navigation.js). Beide Seiten liefern nur
  // noch den Lernstand und reagieren auf die Auswahl.

  function node(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent !== undefined) element.textContent = textContent;
    return element;
  }

  // status(lesson) liefert { unlocked, completed }. lessonAttribute ist der
  // data-Name der Kapitelknöpfe ("openLesson" → data-open-lesson).
  function renderStageMenu(menuBody, { stages, lessons, status, lessonAttribute }) {
    menuBody.replaceChildren();
    for (const stage of stages) {
      const stageLessons = lessons.filter((lesson) => lesson.stage === stage.id);
      const entry = node("div", "nav-stage-entry");
      const button = node("button", "nav-stage-button");
      button.type = "button";
      button.dataset.stageOpen = String(stage.id);
      button.append(node("span", "nav-stage-badge", stage.code));
      const stageText = node("span");
      stageText.append(node("strong", "", stage.shortTitle), node("small", "", `${stageLessons.length} Kapitel`));
      button.append(stageText);

      const toggle = node("button", "nav-stage-toggle");
      toggle.type = "button";
      toggle.dataset.stageToggle = String(stage.id);
      toggle.setAttribute("aria-label", `Kapitel von ${stage.code} anzeigen`);
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", `nav-chapters-${stage.id}`);
      toggle.innerHTML = '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 5.5 4.5 4.5-4.5 4.5"/></svg>';

      const flyout = node("div", "nav-chapter-flyout");
      flyout.id = `nav-chapters-${stage.id}`;
      flyout.setAttribute("role", "group");
      flyout.setAttribute("aria-label", `Kapitel ${stage.code}`);
      const heading = node("p");
      heading.append(node("span", "", stage.code), document.createTextNode(` ${stage.title}`));
      flyout.append(heading);

      for (const lesson of stageLessons) {
        const current = status(lesson);
        const chapter = node("button", `nav-chapter-link${current.unlocked ? "" : " is-locked"}`);
        chapter.type = "button";
        chapter.dataset[lessonAttribute] = lesson.id;
        chapter.append(
          node("span", "", current.unlocked ? current.completed ? "✓" : lesson.code : "▣"),
          node("strong", "", lesson.title),
          node("small", "", current.unlocked ? `${lesson.points || 100} XP` : "noch gesperrt")
        );
        flyout.append(chapter);
      }
      entry.append(button, toggle, flyout);
      menuBody.append(entry);
    }
  }

  // Öffnen und Schließen per Maus, Fokus, Pfeilknöpfen und Escape.
  function bindMenu(menu, learningButton) {
    let suppressFocusOpen = false;
    // Mit der Maus öffnet schon das Zeigen. Ein Klick auf den Pfeil soll das
    // gerade geöffnete Menü dann nicht wieder schließen.
    let hovering = false;

    function closeStages() {
      menu.querySelectorAll(".nav-stage-entry.is-open").forEach((entry) => entry.classList.remove("is-open"));
      menu.querySelectorAll("[data-stage-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    }

    function close() {
      menu.classList.remove("is-open");
      menu.querySelectorAll("[aria-expanded]").forEach((button) => button.setAttribute("aria-expanded", "false"));
      closeStages();
    }

    function setOpen(open) {
      if (!open) { close(); return; }
      menu.classList.add("is-open");
      learningButton.setAttribute("aria-expanded", "true");
      menu.querySelector("[data-learning-toggle]").setAttribute("aria-expanded", "true");
    }

    menu.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") { hovering = true; setOpen(true); }
    });
    menu.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") { hovering = false; close(); }
    });
    menu.addEventListener("focusin", (event) => {
      if (event.target === learningButton && !suppressFocusOpen) setOpen(true);
      const stageButton = event.target.closest(".nav-stage-button");
      if (stageButton) {
        closeStages();
        stageButton.closest(".nav-stage-entry").classList.add("is-open");
        stageButton.nextElementSibling?.setAttribute("aria-expanded", "true");
      }
    });
    menu.addEventListener("focusout", (event) => {
      if (!menu.contains(event.relatedTarget)) close();
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("[data-learning-toggle]")) {
        setOpen(hovering || !menu.classList.contains("is-open"));
        return;
      }
      const stageToggle = event.target.closest("[data-stage-toggle]");
      if (stageToggle) {
        const entry = stageToggle.closest(".nav-stage-entry");
        const open = !entry.classList.contains("is-open");
        closeStages();
        entry.classList.toggle("is-open", open);
        stageToggle.setAttribute("aria-expanded", String(open));
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(`#${menu.id}`)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.classList.contains("is-open")) return;
      close();
      suppressFocusOpen = true;
      learningButton.focus();
      suppressFocusOpen = false;
    });

    return { close, setOpen };
  }

  window.ExcelLabNav = Object.freeze({ renderStageMenu, bindMenu });
})();
