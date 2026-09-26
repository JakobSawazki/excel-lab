(function () {
  "use strict";

  const content = window.EXCEL_LAB_CONTENT;
  const header = document.querySelector(".lesson-page-header");
  if (!content || !header) return;

  const { stages, lessons } = content;
  const nav = document.createElement("nav");
  nav.className = "main-nav lesson-main-nav";
  nav.setAttribute("aria-label", "Hauptnavigation");
  nav.innerHTML = `
    <a class="nav-link" href="index.html#uebersicht">Übersicht</a>
    <div class="nav-dropdown" id="learning-menu">
      <a class="nav-link nav-learning-link is-active" id="learning-path-button" href="index.html#lernpfad" aria-expanded="false" aria-controls="nav-stage-menu">Lernpfad</a>
      <button class="nav-menu-toggle" type="button" data-learning-toggle aria-label="Lernschritte und Kapitel anzeigen" aria-expanded="false" aria-controls="nav-stage-menu"><svg class="nav-chevron" aria-hidden="true" viewBox="0 0 20 20"><path d="m5.5 7.5 4.5 4.5 4.5-4.5"/></svg></button>
      <div class="nav-dropdown-menu" id="nav-stage-menu" aria-label="Lernschritte und Kapitel"></div>
    </div>
    <a class="nav-link" href="index.html#formeln">Formelsammlung</a>
    <a class="nav-link" href="index.html#quellen">Quellen</a>`;
  header.insertBefore(nav, header.querySelector(".header-actions"));

  const breadcrumb = header.querySelector(".lesson-breadcrumb");
  if (breadcrumb) header.after(breadcrumb);

  const menu = nav.querySelector("#learning-menu");
  const menuBody = nav.querySelector("#nav-stage-menu");
  const learningLink = nav.querySelector("#learning-path-button");
  let suppressFocusOpen = false;

  function profile() {
    let state;
    try { state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null"); } catch { state = null; }
    return Array.isArray(state?.profiles) ? state.profiles.find((item) => item.id === state.currentProfileId) : null;
  }

  function access(lesson, activeProfile = profile()) {
    const index = lessons.findIndex((item) => item.id === lesson.id);
    const completed = Boolean(activeProfile?.progress?.[lesson.id]?.completed);
    const previousComplete = index === 0 || Boolean(activeProfile?.progress?.[lessons[index - 1]?.id]?.completed);
    return {
      completed,
      unlocked: Boolean(window.EXCEL_LAB_DEV?.enabled) || completed || previousComplete,
      requiredPoints: Math.max(0, index * 100)
    };
  }

  function node(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    if (textContent !== undefined) element.textContent = textContent;
    return element;
  }

  function renderMenu() {
    const activeProfile = profile();
    menuBody.replaceChildren();
    for (const stage of stages) {
      const entry = node("div", "nav-stage-entry");
      const button = node("button", "nav-stage-button");
      button.type = "button";
      button.dataset.stageOpen = String(stage.id);
      button.append(node("span", "nav-stage-badge", stage.code));
      const stageText = node("span", "");
      stageText.append(node("strong", "", stage.shortTitle), node("small", "", `${lessons.filter((lesson) => lesson.stage === stage.id).length} Kapitel`));
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
      const heading = node("p", "");
      heading.append(node("span", "", stage.code), document.createTextNode(` ${stage.title}`));
      flyout.append(heading);

      for (const lesson of lessons.filter((item) => item.stage === stage.id)) {
        const status = access(lesson, activeProfile);
        const chapter = node("button", `nav-chapter-link${status.unlocked ? "" : " is-locked"}`);
        chapter.type = "button";
        chapter.dataset.lessonOpen = lesson.id;
        chapter.append(
          node("span", "", status.unlocked ? status.completed ? "✓" : lesson.code : "▣"),
          node("strong", "", lesson.title),
          node("small", "", status.unlocked ? `${lesson.points || 100} Punkte` : `${status.requiredPoints} Punkte nötig`)
        );
        flyout.append(chapter);
      }
      entry.append(button, toggle, flyout);
      menuBody.append(entry);
    }
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.querySelectorAll("[aria-expanded]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    menu.querySelectorAll(".nav-stage-entry.is-open").forEach((entry) => entry.classList.remove("is-open"));
  }

  function setMenuOpen(open) {
    if (!open) { closeMenu(); return; }
    menu.classList.add("is-open");
    learningLink.setAttribute("aria-expanded", "true");
    menu.querySelector("[data-learning-toggle]").setAttribute("aria-expanded", "true");
  }

  function showToast(message) {
    const region = document.querySelector("#toast-region");
    if (!region) return;
    const toast = node("div", "toast", message);
    region.append(toast);
    setTimeout(() => toast.remove(), 4500);
  }

  menu.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") setMenuOpen(true);
  });
  menu.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") closeMenu();
  });
  menu.addEventListener("focusin", (event) => {
    if (event.target === learningLink && !suppressFocusOpen) setMenuOpen(true);
    const stageButton = event.target.closest(".nav-stage-button");
    if (stageButton) {
      menu.querySelectorAll(".nav-stage-entry.is-open").forEach((entry) => entry.classList.remove("is-open"));
      menu.querySelectorAll("[data-stage-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
      stageButton.closest(".nav-stage-entry").classList.add("is-open");
      stageButton.nextElementSibling?.setAttribute("aria-expanded", "true");
    }
  });
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) closeMenu();
  });

  nav.addEventListener("click", (event) => {
    const topToggle = event.target.closest("[data-learning-toggle]");
    if (topToggle) { setMenuOpen(!menu.classList.contains("is-open")); return; }

    const stageToggle = event.target.closest("[data-stage-toggle]");
    if (stageToggle) {
      const entry = stageToggle.closest(".nav-stage-entry");
      const open = !entry.classList.contains("is-open");
      menu.querySelectorAll(".nav-stage-entry.is-open").forEach((item) => item.classList.remove("is-open"));
      menu.querySelectorAll("[data-stage-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
      entry.classList.toggle("is-open", open);
      stageToggle.setAttribute("aria-expanded", String(open));
      return;
    }

    const stageButton = event.target.closest("[data-stage-open]");
    if (stageButton) {
      location.href = `index.html#lernpfad/${stageButton.dataset.stageOpen}`;
      return;
    }

    const chapterButton = event.target.closest("[data-lesson-open]");
    if (chapterButton) {
      const lesson = lessons.find((item) => item.id === chapterButton.dataset.lessonOpen);
      if (!lesson) return;
      if (!window.EXCEL_LAB_DEV?.enabled && !profile()) {
        location.href = "index.html#uebersicht";
        return;
      }
      const status = access(lesson);
      if (!status.unlocked) {
        showToast(`Dieses Kapitel wird mit ${status.requiredPoints} Punkten freigeschaltet.`);
        return;
      }
      if (lesson.page) location.href = lesson.page;
      else location.href = `index.html#lernpfad/${lesson.stage}/${lesson.id}`;
      return;
    }

    if (event.target.closest("a.nav-link")) closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#learning-menu")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.classList.contains("is-open")) return;
    closeMenu();
    suppressFocusOpen = true;
    learningLink.focus();
    suppressFocusOpen = false;
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "excelLab.state.v1" || event.key === null) renderMenu();
  });
  window.addEventListener("excel-lab-dev-change", renderMenu);
  window.addEventListener("pageshow", renderMenu);
  renderMenu();
})();
