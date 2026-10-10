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
  if (breadcrumb) {
    const lesson = lessons.find(item => item.code === breadcrumb.querySelector("strong")?.textContent.trim());
    const stage = stages.find(item => item.id === lesson?.stage);
    if (lesson && stage) {
      breadcrumb.innerHTML = `<a href="index.html#uebersicht">BPE1</a><span aria-hidden="true">›</span><a href="index.html#lernpfad/${stage.id}" title="Lernfortschritt ${stage.id}">${stage.code}</a><span aria-hidden="true">›</span><a href="${lesson.page}" aria-current="page">${lesson.code}</a>`;
    }
    breadcrumb.setAttribute("aria-label", "Aktueller Lernpfad");
    breadcrumb.classList.add("location-path");
    header.after(breadcrumb);
  }

  const menu = nav.querySelector("#learning-menu");
  const menuBody = nav.querySelector("#nav-stage-menu");
  const learningLink = nav.querySelector("#learning-path-button");

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
      unlocked: Boolean(window.EXCEL_LAB_DEV?.enabled) || previousComplete,
      requiredPoints: Math.max(0, index * 100)
    };
  }

  function renderMenu() {
    const activeProfile = profile();
    window.ExcelLabNav.renderStageMenu(menuBody, {
      stages,
      lessons,
      lessonAttribute: "lessonOpen",
      status: (lesson) => access(lesson, activeProfile)
    });
  }

  const menuControl = window.ExcelLabNav.bindMenu(menu, learningLink);
  const closeMenu = menuControl.close;

  function showToast(message) {
    const region = document.querySelector("#toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.append(toast);
    setTimeout(() => toast.remove(), 4500);
  }

  nav.addEventListener("click", (event) => {
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
        showToast(`Dieses Kapitel wird freigeschaltet, sobald ${lessons[lessons.indexOf(lesson) - 1].code} abgeschlossen ist.`);
        return;
      }
      if (lesson.page) location.href = lesson.page;
      else location.href = `index.html#lernpfad/${lesson.stage}/${lesson.id}`;
      return;
    }

    if (event.target.closest("a.nav-link")) closeMenu();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "excelLab.state.v1" || event.key === null) renderMenu();
  });
  window.addEventListener("excel-lab-dev-change", renderMenu);
  window.addEventListener("pageshow", renderMenu);
  renderMenu();
})();
