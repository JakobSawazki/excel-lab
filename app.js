(function () {
  "use strict";

  const content = window.EXCEL_LAB_CONTENT;
  if (!content) {
    throw new Error("Excel-Lab-Inhalte konnten nicht geladen werden.");
  }

  const { stages, lessons, formulas } = content;
  const STORAGE_KEY = "excelLab.state.v1";
  const DEVICE_KEY = "excelLab.device.v1";
  const VERSION = 1;
  const APP_VERSION = "0.7.0";
  const POINTS_PER_LESSON = 100;
  const ACCOUNT_PATTERN = /^[a-zäöüß]{3}\.[a-zäöüß]{3}$/;
  const routeMap = {
    dashboard: "uebersicht",
    learning: "lernpfad",
    formulas: "formeln",
    sources: "quellen"
  };
  const routeMapReverse = Object.fromEntries(Object.entries(routeMap).map(([key, value]) => [value, key]));

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  let state = loadState();
  const deviceIdentity = loadDeviceIdentity();
  let activeView = "dashboard";
  let activeStage = "1";
  let activeFormulaCategory = "all";
  let openLessonId = null;

  function defaultState() {
    return {
      version: VERSION,
      theme: window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
      currentProfileId: null,
      profiles: []
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.profiles)) return defaultState();
      return {
        ...defaultState(),
        ...parsed,
        profiles: parsed.profiles.map(normalizeProfile)
      };
    } catch (error) {
      console.warn("Lokaler Lernstand konnte nicht gelesen werden.", error);
      return defaultState();
    }
  }

  function normalizeProfile(profile) {
    const safeProgress = {};
    if (profile && profile.progress && typeof profile.progress === "object") {
      lessons.forEach((lesson) => {
        const candidate = profile.progress[lesson.id];
        if (!candidate || typeof candidate !== "object") return;
        safeProgress[lesson.id] = {
          completed: Boolean(candidate.completed),
          teacherChecked: Boolean(candidate.teacherChecked),
          checks: Array.isArray(candidate.checks)
            ? lesson.checks.map((_, index) => Boolean(candidate.checks[index]))
            : lesson.checks.map(() => false)
        };
      });
    }
    return {
      id: typeof profile?.id === "string" ? profile.id.slice(0, 80) : createId(),
      name: typeof profile?.name === "string" ? profile.name.trim().toLocaleLowerCase("de").slice(0, 40) || "lernprofil" : "lernprofil",
      className: typeof profile?.className === "string" ? profile.className.trim().toLocaleUpperCase("de").slice(0, 16) : "",
      createdAt: typeof profile?.createdAt === "string" ? profile.createdAt : new Date().toISOString(),
      updatedAt: typeof profile?.updatedAt === "string" ? profile.updatedAt : new Date().toISOString(),
      progress: safeProgress
    };
  }

  function loadDeviceIdentity() {
    try {
      const saved = JSON.parse(localStorage.getItem(DEVICE_KEY) || "null");
      if (saved?.id && typeof saved.id === "string") return { id: saved.id.slice(0, 24) };
    } catch {
      // Eine beschädigte Kennung wird durch eine neue lokale Kennung ersetzt.
    }
    const randomPart = createId().replace(/[^a-z0-9]/gi, "").slice(0, 10).toLocaleUpperCase("de");
    const identity = { id: `XL-${randomPart}` };
    try {
      localStorage.setItem(DEVICE_KEY, JSON.stringify(identity));
    } catch {
      // Die App bleibt auch ohne persistente Gerätekennung nutzbar.
    }
    return identity;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      showToast("Der Lernstand konnte in diesem Browser nicht gespeichert werden.");
      console.warn(error);
    }
  }

  function createId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function currentProfile() {
    return state.profiles.find((profile) => profile.id === state.currentProfileId) || null;
  }

  function initials(name) {
    const parts = String(name || "?").trim().split(/[.\s]+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  }

  function getLessonProgress(lessonId) {
    const lesson = lessons.find((item) => item.id === lessonId);
    const profile = currentProfile();
    const saved = profile?.progress?.[lessonId];
    return {
      completed: Boolean(saved?.completed),
      teacherChecked: Boolean(saved?.teacherChecked),
      checks: lesson.checks.map((_, index) => Boolean(saved?.checks?.[index]))
    };
  }

  function writeLessonProgress(lessonId, progress) {
    const profile = currentProfile();
    if (!profile) return false;
    profile.progress[lessonId] = {
      completed: Boolean(progress.completed),
      teacherChecked: Boolean(progress.teacherChecked),
      checks: Array.isArray(progress.checks) ? progress.checks.map(Boolean) : []
    };
    profile.updatedAt = new Date().toISOString();
    saveState();
    return true;
  }

  function ensureProfile() {
    if (currentProfile()) return true;
    openProfileDialog();
    showToast("Lege zuerst ein lokales Profil an, damit dein Fortschritt gespeichert werden kann.");
    return false;
  }

  function progressStats() {
    const completed = lessons.filter((lesson) => getLessonProgress(lesson.id).completed).length;
    const percent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    return { completed, total: lessons.length, percent, points: completed * POINTS_PER_LESSON };
  }

  function lessonAccess(lesson) {
    const index = lessons.findIndex((item) => item.id === lesson.id);
    const progress = getLessonProgress(lesson.id);
    const previousComplete = index <= 0 || getLessonProgress(lessons[index - 1].id).completed;
    return {
      index,
      unlocked: Boolean(window.EXCEL_LAB_DEV?.enabled) || progress.completed || previousComplete,
      requiredPoints: Math.max(0, index * POINTS_PER_LESSON),
      points: lesson.points || POINTS_PER_LESSON
    };
  }

  function stageStats(stageId) {
    const stageLessons = lessons.filter((lesson) => lesson.stage === stageId);
    const completed = stageLessons.filter((lesson) => getLessonProgress(lesson.id).completed).length;
    return {
      completed,
      total: stageLessons.length,
      percent: stageLessons.length ? Math.round((completed / stageLessons.length) * 100) : 0
    };
  }

  function nextLesson() {
    return lessons.find((lesson) => lessonAccess(lesson).unlocked && !getLessonProgress(lesson.id).completed) || lessons[0];
  }

  function setView(view, updateHash = true) {
    if (!routeMap[view]) view = "dashboard";
    activeView = view;
    $$('[data-view-panel]').forEach((panel) => {
      const active = panel.dataset.viewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    $$(".nav-link").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    if (updateHash) history.replaceState(null, "", `#${routeMap[view]}`);
    if (view === "learning") renderLessons();
    if (view === "formulas") renderFormulas();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function syncRouteFromHash() {
    const route = location.hash.replace(/^#/, "").split("/")[0];
    setView(routeMapReverse[route] || "dashboard", false);
  }

  function renderAll() {
    applyTheme();
    renderProfileHeader();
    renderNavMenu();
    renderDashboard();
    renderStageFilters();
    renderLessons();
    renderFormulaFilters();
    renderFormulas();
    renderProfileManager();
  }

  function renderProfileHeader() {
    const profile = currentProfile();
    $("#profile-name").textContent = profile?.name || "Anmelden";
    $("#profile-avatar").textContent = initials(profile?.name);
  }

  function renderNavMenu() {
    const menu = $("#nav-stage-menu");
    if (!menu) return;
    menu.innerHTML = stages.map((stage) => {
      const stageLessons = lessons.filter((lesson) => lesson.stage === stage.id);
      return `
        <div class="nav-stage-entry">
          <button class="nav-stage-button" type="button" data-stage-open="${stage.id}" aria-haspopup="true">
            <span class="nav-stage-badge">${escapeHtml(stage.code)}</span>
            <span><strong>${escapeHtml(stage.shortTitle)}</strong><small>${stageLessons.length} Kapitel</small></span>
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 5.5 4.5 4.5-4.5 4.5"/></svg>
          </button>
          <div class="nav-chapter-flyout" role="menu" aria-label="Kapitel ${escapeHtml(stage.code)}">
            <p><span>${escapeHtml(stage.code)}</span> ${escapeHtml(stage.title)}</p>
            ${stageLessons.map((lesson) => {
              const progress = getLessonProgress(lesson.id);
              const access = lessonAccess(lesson);
              return `<button class="nav-chapter-link ${access.unlocked ? "" : "is-locked"}" type="button" data-open-lesson="${lesson.id}" role="menuitem">
                <span>${access.unlocked ? progress.completed ? "✓" : escapeHtml(lesson.code) : "▣"}</span>
                <strong>${escapeHtml(lesson.title)}</strong>
                <small>${access.unlocked ? `${access.points} Punkte` : `${access.requiredPoints} Punkte nötig`}</small>
              </button>`;
            }).join("")}
          </div>
        </div>`;
    }).join("");
  }

  function renderDashboard() {
    const stats = progressStats();
    const profile = currentProfile();
    $("#total-ring").style.setProperty("--progress", stats.percent);
    $("#hero-ring").style.setProperty("--progress", stats.percent);
    $("#total-percent").textContent = `${stats.percent}%`;
    $("#hero-percent").textContent = `${stats.percent}%`;
    $("#completed-count").textContent = `${stats.completed} von ${stats.total} Einheiten`;
    $("#hero-progress-text").textContent = stats.completed === 0
      ? "Noch nicht begonnen"
      : `${stats.completed} ${stats.completed === 1 ? "Einheit" : "Einheiten"} erledigt`;

    const next = nextLesson();
    const continueButton = $("#continue-button");
    const continueLabel = stats.completed === 0 ? "Lernpfad starten" : stats.completed === stats.total ? "Lernpfad wiederholen" : "Weiterlernen";
    continueButton.innerHTML = `${continueLabel} <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11m-4-4 4 4-4 4"/></svg>`;
    continueButton.dataset.lessonId = next.id;

    $("#chapter-grid").innerHTML = stages.map((stage) => {
      const stageProgress = stageStats(stage.id);
      const stateText = stageProgress.completed === stageProgress.total
        ? "Abgeschlossen"
        : stageProgress.completed === 0 ? "Noch offen" : "In Arbeit";
      return `
        <button class="chapter-card" type="button" data-stage-open="${stage.id}" style="--chapter-color:${stage.color}">
          <span>
            <span class="chapter-top">
              <span class="chapter-number">${escapeHtml(stage.code)}</span>
              <span class="chapter-state">${stateText}</span>
            </span>
            <h3>${escapeHtml(stage.title)}</h3>
            <p>${escapeHtml(stage.description)}</p>
          </span>
          <span class="chapter-footer">
            <span class="progress-track"><span style="--width:${stageProgress.percent}%"></span></span>
            <span class="chapter-progress-label"><span>${stageProgress.completed}/${stageProgress.total} erledigt</span><span>${stageProgress.percent}%</span></span>
          </span>
        </button>`;
    }).join("");

    const nextStage = stages.find((stage) => stage.id === next.stage);
    const allComplete = stats.completed === stats.total;
    $("#next-section").innerHTML = `
      <div class="next-card">
        <div>
          <p class="eyebrow">${allComplete ? "Lernpfad abgeschlossen" : profile ? `Weiter für ${escapeHtml(profile.name)}` : "Dein nächster Schritt"}</p>
          <h2 id="next-heading">${allComplete ? "Alle Einheiten sind erledigt" : `${escapeHtml(next.code)} ${escapeHtml(next.title)}`}</h2>
          <p>${allComplete ? "Du kannst einzelne Themen wiederholen, deine Formelsammlung nutzen oder deinen Lernstand als JSON sichern." : escapeHtml(next.description)}</p>
        </div>
        <button class="button button-primary" type="button" data-open-lesson="${next.id}">${allComplete ? "Einheit wiederholen" : "Einheit öffnen"}</button>
      </div>`;

    const formulaCount = $("#formula-count");
    if (formulaCount) formulaCount.textContent = `${formulas.length} Formeln`;
  }

  function renderStageFilters() {
    $("#stage-filters").innerHTML = [
      `<button class="filter-chip ${activeStage === "all" ? "is-active" : ""}" type="button" data-stage-filter="all">Alle</button>`,
      ...stages.map((stage) => `<button class="filter-chip ${String(activeStage) === String(stage.id) ? "is-active" : ""}" type="button" data-stage-filter="${stage.id}">${escapeHtml(stage.code)}</button>`)
    ].join("");
  }

  function renderLessons() {
    const query = ($("#lesson-search")?.value || "").trim().toLocaleLowerCase("de");
    const filteredStages = stages.filter((stage) => activeStage === "all" || String(activeStage) === String(stage.id));
    let visibleCount = 0;
    const blocks = filteredStages.map((stage) => {
      const stageLessons = lessons.filter((lesson) => {
        if (lesson.stage !== stage.id) return false;
        const haystack = [lesson.code, lesson.title, lesson.description, lesson.goal, ...lesson.tags, ...lesson.formulas.map((item) => item.code)].join(" ").toLocaleLowerCase("de");
        return !query || haystack.includes(query);
      });
      if (!stageLessons.length) return "";
      visibleCount += stageLessons.length;
      const stats = stageStats(stage.id);
      return `
        <section class="stage-block" id="stage-${stage.id}" style="--stage-color:${stage.color}">
          <header class="stage-header">
            <span class="stage-badge">${escapeHtml(stage.code)}</span>
            <div>
              <h2>${escapeHtml(stage.title)}</h2>
              <p>${escapeHtml(stage.curriculum)} · ${stageLessons.length} sichtbare Lerneinheiten</p>
            </div>
          <span class="stage-progress"><strong>${stats.completed}/${stats.total}</strong> erledigt</span>
          </header>
          <div class="stage-progress-bar" aria-label="${stats.percent} Prozent in ${escapeHtml(stage.code)} abgeschlossen"><span style="--width:${stats.percent}%;--stage-color:${stage.color}"></span></div>
          <div class="lesson-cards">
            ${stageLessons.map((lesson) => lessonCard(lesson, stage)).join("")}
          </div>
        </section>`;
    }).join("");
    $("#lesson-list").innerHTML = blocks;
    $("#learning-empty").hidden = visibleCount > 0;

    const stats = progressStats();
    $("#learning-summary").innerHTML = `
      <span class="summary-icon">${stats.points}<small>Punkte</small></span>
      <p><strong>${stats.completed} von ${stats.total} ${stats.total === 1 ? "Einheit" : "Einheiten"} erledigt.</strong> Arbeite der Reihe nach. Jede bestätigte Einheit bringt ${POINTS_PER_LESSON} Punkte und schaltet das nächste Kapitel frei.</p>
      <span class="mini-progress"><span class="progress-track"><span style="--width:${stats.percent}%;--chapter-color:var(--green)"></span></span><small>${stats.percent}% Gesamtfortschritt</small></span>`;
  }

  function lessonCard(lesson, stage) {
    const progress = getLessonProgress(lesson.id);
    const access = lessonAccess(lesson);
    const statusIcon = progress.completed
      ? `<svg class="lesson-status-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m6.5 12.5 3.3 3.3 7.7-8.1"/></svg>`
      : access.unlocked
        ? `<svg class="lesson-status-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5.5 12h12m-4.5-4.5L17.5 12 13 16.5"/></svg>`
        : `<svg class="lesson-status-icon lesson-status-icon-lock" aria-hidden="true" viewBox="0 0 24 24"><rect x="6.5" y="10.5" width="11" height="8" rx="2"/><path d="M9 10.5V8a3 3 0 0 1 6 0v2.5M12 14v1.5"/></svg>`;
    return `
      <button class="lesson-card ${progress.completed ? "is-complete" : ""} ${access.unlocked ? "" : "is-locked"}" type="button" data-open-lesson="${lesson.id}" style="--stage-color:${stage.color}" ${access.unlocked ? "" : 'aria-disabled="true"'}>
        <span>
          <span class="lesson-meta"><span class="lesson-code">${escapeHtml(lesson.code)}</span><span>${escapeHtml(lesson.duration)}</span><span>·</span><span>${access.points} Punkte</span></span>
          <h3>${escapeHtml(lesson.title)}</h3>
          <p>${access.unlocked ? escapeHtml(lesson.description) : `Noch gesperrt. Schließe zuerst das vorherige Kapitel ab und sammle ${access.requiredPoints} Punkte.`}</p>
          <span class="lesson-tags">${lesson.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
        </span>
        <span class="lesson-status" aria-label="${progress.completed ? "Erledigt" : access.unlocked ? "Einheit öffnen" : "Gesperrt"}">${statusIcon}</span>
      </button>`;
  }

  function renderFormulaFilters() {
    const categories = [...new Set(formulas.map((formula) => formula.category))];
    $("#formula-filters").innerHTML = [
      `<button class="filter-chip ${activeFormulaCategory === "all" ? "is-active" : ""}" type="button" data-formula-filter="all">Alle</button>`,
      ...categories.map((category) => `<button class="filter-chip ${activeFormulaCategory === category ? "is-active" : ""}" type="button" data-formula-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
    ].join("");
  }

  function renderFormulas() {
    const query = ($("#formula-search")?.value || "").trim().toLocaleLowerCase("de");
    const visible = formulas.filter((formula) => {
      const categoryMatches = activeFormulaCategory === "all" || formula.category === activeFormulaCategory;
      const haystack = [formula.name, formula.category, formula.syntax, formula.description, formula.example].join(" ").toLocaleLowerCase("de");
      return categoryMatches && (!query || haystack.includes(query));
    });
    $("#formula-grid").innerHTML = visible.map((formula, index) => `
      <article class="formula-card">
        <div class="formula-card-header">
          <div><span class="category">${escapeHtml(formula.category)}</span><h2>${escapeHtml(formula.name)}</h2></div>
          <button class="copy-button" type="button" data-copy-formula="${escapeHtml(formula.syntax)}" aria-label="Formel ${escapeHtml(formula.name)} kopieren" title="Formel kopieren">
            <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          </button>
        </div>
        <p>${escapeHtml(formula.description)}</p>
        <code class="formula-code">${escapeHtml(formula.syntax)}</code>
        <div class="formula-example"><strong>Beispiel</strong><span>${escapeHtml(formula.example)}</span></div>
      </article>`).join("");
    $("#formula-empty").hidden = visible.length > 0;
  }

  function openLesson(lessonId) {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson) return;
    if (!window.EXCEL_LAB_DEV?.enabled && !ensureProfile()) return;
    const access = lessonAccess(lesson);
    if (!access.unlocked) {
      showToast(`Dieses Kapitel wird mit ${access.requiredPoints} Punkten freigeschaltet.`);
      return;
    }
    $("#learning-menu")?.removeAttribute("open");
    if (lesson.page) {
      window.location.href = lesson.page;
      return;
    }
    const stage = stages.find((item) => item.id === lesson.stage);
    const progress = getLessonProgress(lesson.id);
    openLessonId = lesson.id;
    $("#lesson-dialog-content").innerHTML = `
      <header class="lesson-detail-head" style="--lesson-color:${stage.color}">
        <div class="lesson-detail-meta"><span>${escapeHtml(lesson.code)}</span><span>${escapeHtml(stage.curriculum)}</span><span>${escapeHtml(lesson.duration)}</span><span>${escapeHtml(lesson.level)}</span></div>
        <h2 id="lesson-dialog-title">${escapeHtml(lesson.title)}</h2>
        <p>${escapeHtml(lesson.goal)}</p>
        <ol class="lesson-workflow" aria-label="Arbeitsablauf dieser Lerneinheit">
          <li><span>1</span><strong>Informieren</strong></li>
          <li><span>2</span><strong>In Excel arbeiten</strong></li>
          <li><span>3</span><strong>Ergebnis prüfen</strong></li>
        </ol>
      </header>
      <div class="lesson-detail-body">
        <div class="lesson-content">
          <details class="lesson-disclosure" open><summary><h3>Das musst du wissen</h3><span class="lesson-disclosure-icon" aria-hidden="true">+</span></summary><div class="lesson-disclosure-body">
            <div class="key-points">${lesson.keyPoints.map((point) => `<div class="key-point"><strong>${escapeHtml(point.title)}</strong><span>${escapeHtml(point.text)}</span></div>`).join("")}</div>
          </div></details>
          <details class="lesson-disclosure"><summary><h3>Formeln und Merksätze</h3><span class="lesson-disclosure-icon" aria-hidden="true">+</span></summary><div class="lesson-disclosure-body">
            ${lesson.formulas.map((formula) => `<div class="lesson-formula"><code>${escapeHtml(formula.code)}</code><span>${escapeHtml(formula.note)}</span></div>`).join("")}
          </div></details>
          <details class="lesson-disclosure"><summary><h3>Dein Arbeitsauftrag</h3><span class="lesson-disclosure-icon" aria-hidden="true">+</span></summary><div class="lesson-disclosure-body">
            <ol>${lesson.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
          </div></details>
          <section class="lesson-section">
            <div class="tip-box"><strong>Praxis-Tipp:</strong> ${escapeHtml(lesson.tip)}</div>
          </section>
        </div>
        <aside class="lesson-sidebar">
          <section class="sidebar-panel">
            <h3>Materialien</h3>
            <div class="download-list">
              ${lesson.downloads.map((file) => `
                <a class="download-item" href="${encodeURI(file.path)}" download>
                  <span class="file-type ${file.type.toLowerCase() === "xlsx" ? "xlsx" : file.type === "VIDEO" ? "video" : ""}">${escapeHtml(file.type)}</span>
                  <strong>${escapeHtml(file.label)}</strong>
                  <span class="arrow" aria-hidden="true">↓</span>
                </a>`).join("")}
            </div>
            <p class="download-note">Die Dateien werden lokal aus dem BPE1-Materialordner bereitgestellt.</p>
          </section>
          <section class="sidebar-panel">
            <h3>Abschluss-Check</h3>
            <div class="completion-list">
              ${lesson.checks.map((check, index) => `
                <label class="completion-check">
                  <input type="checkbox" data-check-index="${index}" ${progress.checks[index] ? "checked" : ""}>
                  <span>${escapeHtml(check)}</span>
                </label>`).join("")}
              <label class="completion-check teacher-check">
                <input type="checkbox" data-teacher-check ${progress.teacherChecked ? "checked" : ""}>
                <span>Die Aufgabe wurde mit der Lehrkraft besprochen und als richtig bestätigt.</span>
              </label>
            </div>
            <button class="button button-full ${progress.completed ? "button-secondary is-complete complete-button" : "button-primary complete-button"}" type="button" data-toggle-complete>
              ${progress.completed ? "✓ Als erledigt markiert" : "Lerneinheit abschließen"}
            </button>
          </section>
        </aside>
      </div>`;
    const dialog = $("#lesson-dialog");
    if (window.EXCEL_LAB_DEV?.enabled) {
      dialog.querySelectorAll("[data-check-index], [data-teacher-check], [data-toggle-complete]").forEach((el) => { el.disabled = true; });
    }
    if (!dialog.open) dialog.showModal();
  }

  function updateOpenLessonCheck(index, checked) {
    if (window.EXCEL_LAB_DEV?.enabled || !openLessonId || !ensureProfile()) return false;
    const progress = getLessonProgress(openLessonId);
    progress.checks[index] = Boolean(checked);
    writeLessonProgress(openLessonId, progress);
    return true;
  }

  function updateOpenLessonTeacherCheck(checked) {
    if (window.EXCEL_LAB_DEV?.enabled || !openLessonId || !ensureProfile()) return false;
    const progress = getLessonProgress(openLessonId);
    progress.teacherChecked = Boolean(checked);
    writeLessonProgress(openLessonId, progress);
    return true;
  }

  function toggleOpenLessonComplete() {
    if (window.EXCEL_LAB_DEV?.enabled || !openLessonId || !ensureProfile()) return;
    const lesson = lessons.find((item) => item.id === openLessonId);
    const progress = getLessonProgress(openLessonId);
    if (!progress.completed && progress.checks.some((checked) => !checked)) {
      showToast("Hake zuerst alle Punkte im Abschluss-Check ab.");
      return;
    }
    if (!progress.completed && !progress.teacherChecked) {
      showToast("Bestätige zuerst, dass die Lehrkraft die Aufgabe geprüft hat.");
      return;
    }
    progress.completed = !progress.completed;
    writeLessonProgress(openLessonId, progress);
    renderAll();
    openLesson(openLessonId);
    showToast(progress.completed ? "Lerneinheit als erledigt gespeichert." : "Lerneinheit wieder als offen markiert.");
  }

  function openProfileDialog() {
    const dialog = $("#profile-dialog");
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => $("#profile-name-input").focus());
  }

  function renderProfileManager() {
    const current = currentProfile();
    $("#profile-list").innerHTML = state.profiles.length
      ? state.profiles.map((profile) => {
        const completed = lessons.filter((lesson) => Boolean(profile.progress?.[lesson.id]?.completed)).length;
        const points = completed * POINTS_PER_LESSON;
        return `
          <div class="profile-list-item ${profile.id === current?.id ? "is-current" : ""}">
            <span class="profile-avatar">${escapeHtml(initials(profile.name))}</span>
            <div><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.className || "ohne Klasse")} · ${points} Punkte · ${completed}/${lessons.length} erledigt</small><small>Browser-ID ${escapeHtml(deviceIdentity.id)}</small></div>
            ${profile.id === current?.id ? "<small>Aktiv</small>" : `<button type="button" data-switch-profile="${escapeHtml(profile.id)}">Wechseln</button>`}
          </div>`;
      }).join("")
      : "<p>Noch kein lokales Profil vorhanden.</p>";
    $("#export-button").disabled = !current;
    $("#reset-button").disabled = !current;
  }

  function createProfile(name, className) {
    const profile = normalizeProfile({
      id: createId(),
      name,
      className,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: {}
    });
    state.profiles.push(profile);
    state.currentProfileId = profile.id;
    saveState();
    renderAll();
    showToast(`Profil „${profile.name}“ wurde lokal angelegt.`);
  }

  function exportProgress() {
    const profile = currentProfile();
    if (!profile) return;
    const payload = {
      app: "Excel-Lab",
      version: VERSION,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      exportedBy: {
        accountName: profile.name,
        className: profile.className,
        points: progressStats().points
      },
      device: {
        id: deviceIdentity.id,
        type: "anonyme Browser-Installation",
        operatingSystem: /win/i.test(navigator.platform || "") ? "Windows" : "nicht erkannt"
      },
      profile
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeName = [
      profile.name,
      profile.className,
      deviceIdentity.id,
      payload.exportedAt.slice(0, 10)
    ].join("-").toLocaleLowerCase("de").replace(/[^a-z0-9äöüß]+/gi, "-").replace(/^-|-$/g, "") || "lernprofil";
    anchor.href = url;
    anchor.download = `excel-lab-${safeName}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Lernstand als JSON exportiert.");
  }

  async function importProgress(file) {
    if (!file) return;
    try {
      const text = await file.text();
      if (text.length > 1_000_000) throw new Error("Datei ist zu groß.");
      const payload = JSON.parse(text);
      if (payload?.app !== "Excel-Lab" || payload?.version !== VERSION || !payload?.profile) {
        throw new Error("Keine gültige Excel-Lab-Exportdatei.");
      }
      const imported = normalizeProfile(payload.profile);
      imported.id = createId();
      imported.updatedAt = new Date().toISOString();
      state.profiles.push(imported);
      state.currentProfileId = imported.id;
      saveState();
      renderAll();
      showToast("Lernstand erfolgreich importiert.");
    } catch (error) {
      showToast(error.message || "Die JSON-Datei konnte nicht importiert werden.");
    } finally {
      $("#import-file").value = "";
    }
  }

  function resetProgress() {
    const profile = currentProfile();
    if (!profile) return;
    if (!window.confirm(`Soll der gesamte Lernfortschritt von „${profile.name}“ wirklich zurückgesetzt werden?`)) return;
    profile.progress = {};
    saveState();
    renderAll();
    showToast("Der Lernfortschritt wurde zurückgesetzt.");
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    $("meta[name='theme-color']").setAttribute("content", state.theme === "light" ? "#f4f7f4" : "#0b1422");
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    saveState();
    applyTheme();
    showToast(state.theme === "light" ? "Helles Farbschema aktiviert." : "Dunkles Farbschema aktiviert.");
  }

  function openAboutDialog() {
    const dialog = $("#about-dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeLearningMenu() {
    $("#learning-menu")?.removeAttribute("open");
  }

  async function copyFormula(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    showToast("Formel kopiert.");
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    $("#toast-region").append(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const brandHome = event.target.closest("[data-brand-home]");
      if (brandHome) {
        event.preventDefault();
        closeLearningMenu();
        if (activeView === "dashboard") openAboutDialog();
        else setView("dashboard");
        return;
      }

      const navButton = event.target.closest("[data-view]");
      if (navButton) {
        closeLearningMenu();
        setView(navButton.dataset.view);
      }

      const goView = event.target.closest("[data-go-view]");
      if (goView) setView(goView.dataset.goView);

      const chapter = event.target.closest("[data-stage-open]");
      if (chapter) {
        chapter.closest(".nav-dropdown")?.removeAttribute("open");
        activeStage = chapter.dataset.stageOpen;
        renderStageFilters();
        setView("learning");
        requestAnimationFrame(() => $(`#stage-${activeStage}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }

      const lessonButton = event.target.closest("[data-open-lesson]");
      if (lessonButton) openLesson(lessonButton.dataset.openLesson);

      const stageFilter = event.target.closest("[data-stage-filter]");
      if (stageFilter) {
        activeStage = stageFilter.dataset.stageFilter;
        renderStageFilters();
        renderLessons();
      }

      const formulaFilter = event.target.closest("[data-formula-filter]");
      if (formulaFilter) {
        activeFormulaCategory = formulaFilter.dataset.formulaFilter;
        renderFormulaFilters();
        renderFormulas();
      }

      const copyButton = event.target.closest("[data-copy-formula]");
      if (copyButton) copyFormula(copyButton.dataset.copyFormula);

      const completeButton = event.target.closest("[data-toggle-complete]");
      if (completeButton) toggleOpenLessonComplete();

      const closeButton = event.target.closest("[data-close-dialog]");
      if (closeButton) closeButton.closest("dialog")?.close();

      const switchButton = event.target.closest("[data-switch-profile]");
      if (switchButton) {
        state.currentProfileId = switchButton.dataset.switchProfile;
        saveState();
        renderAll();
        $("#manager-dialog").close();
        showToast("Profil gewechselt.");
      }

      if (!event.target.closest("#learning-menu")) closeLearningMenu();
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches("[data-check-index]")) {
        const success = updateOpenLessonCheck(Number(event.target.dataset.checkIndex), event.target.checked);
        if (!success) event.target.checked = false;
      }
      if (event.target.matches("[data-teacher-check]")) {
        const success = updateOpenLessonTeacherCheck(event.target.checked);
        if (!success) event.target.checked = false;
      }
    });

    $("#lesson-search").addEventListener("input", renderLessons);
    $("#formula-search").addEventListener("input", renderFormulas);
    $("#theme-toggle").addEventListener("click", toggleTheme);
    $("#profile-button").addEventListener("click", () => {
      renderProfileManager();
      $("#manager-dialog").showModal();
    });
    $("#footer-data-button").addEventListener("click", () => {
      renderProfileManager();
      $("#manager-dialog").showModal();
    });
    $("#new-profile-button").addEventListener("click", () => {
      $("#manager-dialog").close();
      $("#profile-form").reset();
      openProfileDialog();
    });
    $("#export-button").addEventListener("click", exportProgress);
    $("#import-button").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (event) => importProgress(event.target.files?.[0]));
    $("#reset-button").addEventListener("click", resetProgress);
    $("#continue-button").addEventListener("click", (event) => openLesson(event.currentTarget.dataset.lessonId));

    $("#profile-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = String(form.get("name") || "").trim().toLocaleLowerCase("de");
      const className = String(form.get("className") || "").trim().toLocaleUpperCase("de");
      const accountInput = $("#profile-name-input");
      accountInput.setCustomValidity(ACCOUNT_PATTERN.test(name) ? "" : "Bitte das Format abc.xyz verwenden.");
      if (!event.currentTarget.reportValidity()) return;
      createProfile(name, className);
      $("#profile-dialog").close();
      event.currentTarget.reset();
    });

    $("#profile-name-input").addEventListener("input", (event) => {
      event.target.value = event.target.value.toLocaleLowerCase("de").replace(/\s+/g, "");
      event.target.setCustomValidity("");
    });
    $("#profile-class-input").addEventListener("input", (event) => {
      event.target.value = event.target.value.toLocaleUpperCase("de").replace(/\s+/g, "");
    });
    $$('dialog').forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => {
        if (dialog.id === "lesson-dialog") openLessonId = null;
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLearningMenu();
    });

    window.addEventListener("excel-lab-dev-change", () => {
      $("#lesson-dialog").close();
      renderAll();
    });
    window.addEventListener("hashchange", syncRouteFromHash);
  }

  function init() {
    bindEvents();
    renderAll();
    syncRouteFromHash();
    if (!currentProfile() && !window.EXCEL_LAB_DEV?.enabled) window.setTimeout(openProfileDialog, 250);
  }

  init();
})();
