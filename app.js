(function () {
  "use strict";

  const content = window.EXCEL_LAB_CONTENT;
  if (!content) {
    throw new Error("Excel-Lab-Inhalte konnten nicht geladen werden.");
  }

  const { stages, lessons, formulas } = content;
  const glossary = Array.isArray(content.glossary) ? content.glossary : [];
  const GLOSSARY_FILTER = "Glossar";
  const STORAGE_KEY = "excelLab.state.v1";
  const RESCUE_KEY = "excelLab.state.rescue.v1";
  const DEVICE_KEY = "excelLab.device.v1";
  const VERSION = 1;
  const APP_VERSION = "0.17.0";
  const POINTS_PER_LESSON = 100;
  // Freiwillige Vertiefungsaufgaben (bonus-tasks.js) bringen zusätzliche XP.
  const BONUS_XP = window.EXCEL_LAB_BONUS?.xp || 0;
  const hasBonusTask = (lessonId) => Boolean(window.EXCEL_LAB_BONUS?.tasks?.[lessonId]);
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

  // Rohtext eines nicht lesbaren Lernstands. Muss vor loadState() stehen.
  let unreadableState = null;
  let state = loadState();
  const deviceIdentity = loadDeviceIdentity();
  let activeView = "dashboard";
  let activeStage = "1";
  let activeFormulaCategory = "all";

  function defaultState() {
    return {
      version: VERSION,
      theme: window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
      currentProfileId: null,
      profiles: []
    };
  }

  function loadState(fallback) {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.profiles)) {
        if (!fallback) unreadableState = raw;
        return fallback || defaultState();
      }
      return {
        ...defaultState(),
        ...parsed,
        profiles: parsed.profiles.map((profile) => normalizeProfile(profile,
          fallback?.profiles.find((previous) => previous.id === profile?.id)))
      };
    } catch (error) {
      console.warn("Lokaler Lernstand konnte nicht gelesen werden.", error);
      if (!fallback && raw) unreadableState = raw;
      return fallback || defaultState();
    }
  }

  function syncStoredState() {
    // Another lesson tab or a BFCache restore can leave this page's memory stale.
    // Read only: never write a refreshed copy back over the authoritative storage.
    const next = loadState(state);
    if (JSON.stringify(next) === JSON.stringify(state)) return;
    const previousProfile = currentProfile();
    const nextProfile = next.profiles.find((profile) => profile.id === next.currentProfileId);
    const sameProfile = previousProfile?.id === nextProfile?.id;
    const manager = $("#manager-dialog");
    const draft = manager.open && sameProfile ? [
      [$("#profile-edit-name"), previousProfile?.name || ""],
      [$("#profile-edit-class"), previousProfile?.className || ""]
    ].filter(([input, saved]) => input.value !== saved).map(([input]) => ({
      input, value: input.value, start: input.selectionStart, end: input.selectionEnd
    })) : [];
    state = next;
    if (!sameProfile) {
      manager.close();
      $("#profile-dialog").close();
    }
    renderAll();
    draft.forEach(({ input, value, start, end }) => {
      input.value = value;
      input.setSelectionRange(start, end);
    });
    window.dispatchEvent(new Event("excel-lab-progress-change"));
  }

  function normalizeProfile(profile, previous) {
    const safeProgress = {};
    if (profile && profile.progress && typeof profile.progress === "object") {
      lessons.forEach((lesson) => {
        const candidate = profile.progress[lesson.id];
        if (!candidate || typeof candidate !== "object") return;
        safeProgress[lesson.id] = {
          completed: Boolean(candidate.completed),
          teacherChecked: Boolean(candidate.teacherChecked),
          // Abschlüsse aus der Zeit vor den Verständnis-Checks gelten als bestanden.
          masteryPassed: Boolean(candidate.masteryPassed || candidate.completed),
          bonus: Boolean(candidate.bonus),
          checks: Array.isArray(candidate.checks)
            ? lesson.checks.map((_, index) => Boolean(candidate.checks[index]))
            : lesson.checks.map(() => false)
        };
      });
    }
    return {
      id: typeof profile?.id === "string" ? profile.id.slice(0, 80) : createId(),
      name: typeof profile?.name === "string" ? profile.name.trim().toLocaleLowerCase("de").slice(0, 40) || "lernprofil" : "lernprofil",
      className: typeof profile?.className === "string" ? profile.className.trim().toLocaleUpperCase("de").slice(0, 32) : "",
      createdAt: typeof profile?.createdAt === "string" ? profile.createdAt : previous?.createdAt || new Date().toISOString(),
      updatedAt: typeof profile?.updatedAt === "string" ? profile.updatedAt : previous?.updatedAt || new Date().toISOString(),
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

  // Ein nicht lesbarer Lernstand wird vor dem ersten Überschreiben als
  // Rettungskopie abgelegt. Gelingt das nicht, bleibt das Original unberührt.
  function keepUnreadableState() {
    if (unreadableState === null) return true;
    try {
      const existing = localStorage.getItem(RESCUE_KEY);
      if (existing !== unreadableState) {
        localStorage.setItem(existing === null ? RESCUE_KEY : `${RESCUE_KEY}.${Date.now()}`, unreadableState);
      }
      unreadableState = null;
      return true;
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  function saveState() {
    if (!keepUnreadableState()) {
      showToast("Nicht gespeichert: Der bisherige Lernstand ist nicht lesbar und konnte nicht gesichert werden. Bitte die Lehrkraft informieren.", 20000);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event("excel-lab-progress-change"));
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
      masteryPassed: Boolean(saved?.masteryPassed || saved?.completed),
      bonus: Boolean(saved?.bonus),
      checks: lesson.checks.map((_, index) => Boolean(saved?.checks?.[index]))
    };
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
    const bonus = lessons.filter((lesson) => hasBonusTask(lesson.id) && getLessonProgress(lesson.id).bonus).length;
    return { completed, total: lessons.length, percent, bonus, points: completed * POINTS_PER_LESSON + bonus * BONUS_XP };
  }

  function lessonAccess(lesson) {
    const index = lessons.findIndex((item) => item.id === lesson.id);
    const progress = getLessonProgress(lesson.id);
    const previousComplete = index <= 0 || getLessonProgress(lessons[index - 1].id).completed;
    return {
      index,
      // Gesperrt, solange die vorige Einheit offen ist – auch wenn diese hier schon abgeschlossen war.
      unlocked: Boolean(window.EXCEL_LAB_DEV?.enabled) || previousComplete,
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
    renderLocationPath();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLocationPath() {
    const stage = stages.find(item => String(item.id) === String(activeStage));
    let detail = "";
    if (activeView === "learning") detail = stage
      ? `<a href="#lernpfad/${stage.id}" aria-current="page" title="Lernfortschritt ${stage.id}">${escapeHtml(stage.code)}</a>`
      : '<a href="#lernpfad" aria-current="page">Lernpfad</a>';
    if (activeView === "formulas") detail = '<a href="#formeln" aria-current="page">Formelsammlung</a>';
    if (activeView === "sources") detail = '<a href="#quellen" aria-current="page">Quellen</a>';
    $("#location-path").innerHTML = `<a href="#uebersicht" data-brand-home${detail ? "" : ' aria-current="page"'}>BPE1</a>${detail ? `<span aria-hidden="true">›</span>${detail}` : ""}`;
  }

  function syncRouteFromHash() {
    const [route, stageId, lessonId] = location.hash.replace(/^#/, "").split("/");
    if (route === routeMap.learning && stages.some((stage) => String(stage.id) === stageId)) {
      activeStage = stageId;
      renderStageFilters();
    }
    setView(routeMapReverse[route] || "dashboard", false);
    if (route === routeMap.learning && lessonId && lessons.some((lesson) => lesson.id === lessonId)) {
      openLesson(lessonId);
    }
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
    window.ExcelLabNav.renderStageMenu(menu, {
      stages,
      lessons,
      lessonAttribute: "openLesson",
      status: (lesson) => ({ unlocked: lessonAccess(lesson).unlocked, completed: getLessonProgress(lesson.id).completed })
    });
  }

  function renderDashboard() {
    const stats = progressStats();
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

    // Use the same normalized statistics as the learning path.
    stages.forEach((stage) => {
      const stats = stageStats(stage.id);
      const bar = document.querySelector(`#organizer-progress-${stage.id}`);
      const label = document.querySelector(`#organizer-progress-label-${stage.id}`);
      if (!bar || !label) return;
      bar.max = stats.total;
      bar.value = stats.completed;
      label.querySelector("[data-organizer-completed]").textContent = `${stats.completed}/${stats.total} erledigt`;
      label.querySelector("[data-organizer-percent]").textContent = `${stats.percent}%`;
    });

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
    renderLocationPath();
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
      <span class="summary-icon">${stats.points}<small>XP</small></span>
      <p><strong>${stats.completed} von ${stats.total} ${stats.total === 1 ? "Einheit" : "Einheiten"} erledigt.</strong> Arbeite der Reihe nach. Jede bestätigte Einheit bringt ${POINTS_PER_LESSON} XP und schaltet das nächste Kapitel frei.${BONUS_XP ? ` Jede gelöste Bonusaufgabe bringt zusätzlich ${BONUS_XP} XP (${stats.bonus} gelöst).` : ""}</p>
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
          <span class="lesson-meta"><span class="lesson-code">${escapeHtml(lesson.code)}</span><span>${escapeHtml(lesson.duration)}</span><span>·</span><span>${access.points} XP</span></span>
          <h3>${escapeHtml(lesson.title)}</h3>
          <p>${access.unlocked ? escapeHtml(lesson.description) : "Noch gesperrt. Schließe zuerst das vorherige Kapitel ab."}</p>
          <span class="lesson-tags">${lesson.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
        </span>
        <span class="lesson-status" aria-label="${progress.completed ? "Erledigt" : access.unlocked ? "Einheit öffnen" : "Gesperrt"}">${statusIcon}</span>
      </button>`;
  }

  function renderFormulaFilters() {
    const categories = [...new Set(formulas.map((formula) => formula.category))];
    $("#formula-filters").innerHTML = [
      `<button class="filter-chip ${activeFormulaCategory === "all" ? "is-active" : ""}" type="button" data-formula-filter="all">Alle</button>`,
      ...categories.map((category) => `<button class="filter-chip ${activeFormulaCategory === category ? "is-active" : ""}" type="button" data-formula-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`),
      ...(glossary.length ? [`<button class="filter-chip ${activeFormulaCategory === GLOSSARY_FILTER ? "is-active" : ""}" type="button" data-formula-filter="${GLOSSARY_FILTER}">${GLOSSARY_FILTER}</button>`] : [])
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
    // Glossar: unter „Alle“ nach den Formeln, unter „Glossar“ allein; die Suche gilt für beides.
    const showGlossary = activeFormulaCategory === "all" || activeFormulaCategory === GLOSSARY_FILTER;
    const terms = showGlossary ? glossary.filter((entry) => !query || [entry.term, entry.text, entry.lesson].join(" ").toLocaleLowerCase("de").includes(query)) : [];
    $("#glossary-list").innerHTML = terms.map((entry) => `
      <div class="glossary-entry">
        <dt>${escapeHtml(entry.term)}</dt>
        <dd>${escapeHtml(entry.text)} <span class="glossary-lesson">${escapeHtml(entry.lesson)}</span></dd>
      </div>`).join("");
    $("#glossary").hidden = terms.length === 0;
    $("#formula-empty").hidden = visible.length > 0 || terms.length > 0;
  }

  function openLesson(lessonId) {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson) return;
    if (!window.EXCEL_LAB_DEV?.enabled && !ensureProfile()) return;
    const access = lessonAccess(lesson);
    if (!access.unlocked) {
      showToast(`Dieses Kapitel wird freigeschaltet, sobald ${lessons[access.index - 1].code} abgeschlossen ist.`);
      return;
    }
    closeLearningMenu();
    // Jede Einheit hat eine eigene Lernseite (tests/lessons.test.js erzwingt das).
    if (lesson.page) window.location.href = lesson.page;
  }

  function openProfileDialog() {
    const dialog = $("#profile-dialog");
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => $("#profile-name-input").focus());
  }

  function renderProfileManager() {
    const current = currentProfile();
    $("#profile-list").innerHTML = current
      ? [current].map((profile) => {
        const completed = lessons.filter((lesson) => Boolean(profile.progress?.[lesson.id]?.completed)).length;
        const points = progressStats().points;
        return `
          <div class="profile-list-item ${profile.id === current?.id ? "is-current" : ""}">
            <span class="profile-avatar">${escapeHtml(initials(profile.name))}</span>
            <div><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.className || "ohne Klasse")} · ${points} XP · ${completed}/${lessons.length} erledigt</small><small>Browser-ID ${escapeHtml(deviceIdentity.id)}</small></div>
            <small>Aktiv</small>
          </div>`;
      }).join("")
      : "<p>Noch kein lokales Profil vorhanden.</p>";
    $("#export-button").disabled = !current;
    $("#profile-edit-form").hidden = !current;
    $("#profile-edit-name").value = current?.name || "";
    $("#profile-edit-class").value = current?.className || "";
    $("#developer-profile-actions").hidden = !window.EXCEL_LAB_DEV?.enabled;
    $("#reset-button").disabled = !current;
    $("#rescue-button").hidden = rescueCopy() === null;
  }

  function validateProfileFields(nameInput, classInput) {
    nameInput.value = nameInput.value.trim().toLocaleLowerCase("de");
    classInput.value = classInput.value.trim().replace(/\s+/g, " ").toLocaleUpperCase("de");
    nameInput.setCustomValidity(ACCOUNT_PATTERN.test(nameInput.value) ? "" : "Bitte das Format abc.xyz verwenden.");
    classInput.setCustomValidity(classInput.value.length >= 3 ? "" : "Bitte die vollständige Klassenbezeichnung eintragen.");
    return nameInput.reportValidity() && classInput.reportValidity();
  }

  function editCurrentProfile() {
    const profile = currentProfile();
    if (!profile) return;
    const nameInput = $("#profile-edit-name");
    const classInput = $("#profile-edit-class");
    if (!validateProfileFields(nameInput, classInput)) return;
    if (profile.name === nameInput.value && profile.className === classInput.value) return;
    profile.name = nameInput.value;
    profile.className = classInput.value;
    profile.updatedAt = new Date().toISOString();
    saveState();
    renderAll();
    showToast("Profilangaben aktualisiert.");
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
    const dateParts = new Intl.DateTimeFormat("en", {
      timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date(payload.exportedAt));
    const part = (type) => dateParts.find((item) => item.type === type).value;
    const datePrefix = `${part("year")}-${part("month")}-${part("day")}`;
    const safePart = (value) => String(value).replace(/[^a-z0-9äöüß._-]+/gi, "-").replace(/^-+|-+$/g, "") || "lernprofil";
    anchor.href = url;
    anchor.download = `${datePrefix}_Excel-Lab_${safePart(profile.name)}_${safePart(deviceIdentity.id)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Speicherdatei zum Download bereitgestellt.");
  }

  async function loadProgressFile() {
    if (typeof window.showOpenFilePicker !== "function") {
      $("#import-file").click();
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        startIn: "downloads",
        multiple: false,
        excludeAcceptAllOption: true,
        types: [{ description: "Excel-Lab Speicherdatei", accept: { "application/json": [".json"] } }]
      });
      if (handle) await importProgress(await handle.getFile());
    } catch (error) {
      if (error.name === "AbortError") return;
      // Browser ohne nutzbare File-System-Access-API behalten die normale Dateiauswahl.
      $("#import-file").click();
    }
  }

  async function importProgress(file) {
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error("Datei ist zu groß.");
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
      showToast("Lernstand erfolgreich geladen.");
    } catch (error) {
      showToast(error.message || "Die Speicherdatei konnte nicht geladen werden.");
    } finally {
      $("#import-file").value = "";
    }
  }

  function rescueCopy() {
    if (unreadableState !== null) return unreadableState;
    try { return localStorage.getItem(RESCUE_KEY); } catch { return null; }
  }

  // Die Rettungskopie ist der unveränderte Rohtext des nicht lesbaren Lernstands.
  function downloadRescueCopy() {
    const copy = rescueCopy();
    if (copy === null) return;
    const url = URL.createObjectURL(new Blob([copy], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${new Date().toISOString().slice(0, 10)}_Excel-Lab_Rettungskopie.txt`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Rettungskopie zum Download bereitgestellt. Gib die Datei deiner Lehrkraft.");
  }

  function resetProgress() {
    if (!window.EXCEL_LAB_DEV?.enabled) return;
    const profile = currentProfile();
    if (!profile || !window.confirm(`Fortschritt von „${profile.name}“ wirklich zurücksetzen?`)) return;
    profile.progress = {};
    profile.updatedAt = new Date().toISOString();
    saveState();
    renderAll();
    showToast("Lernfortschritt zurückgesetzt.");
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

  // Bedienung des Lernpfad-Menüs liegt in nav-menu.js.
  let learningMenu = null;
  function closeLearningMenu() {
    learningMenu?.close();
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

  function showToast(message, duration = 3200) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    $("#toast-region").append(toast);
    window.setTimeout(() => toast.remove(), duration);
  }

  function bindEvents() {
    learningMenu = window.ExcelLabNav.bindMenu($("#learning-menu"), $("#learning-path-button"));
    document.addEventListener("click", (event) => {
      const brandHome = event.target.closest("[data-brand-home]");
      if (brandHome) {
        event.preventDefault();
        closeLearningMenu();
        setView("dashboard");
        return;
      }

      if (event.target.closest("[data-about-info]")) {
        event.preventDefault();
        closeLearningMenu();
        openAboutDialog();
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
        closeLearningMenu();
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
    });

    $("#lesson-search").addEventListener("input", renderLessons);
    $("#formula-search").addEventListener("input", renderFormulas);
    $("#theme-toggle").addEventListener("click", toggleTheme);
    $("#profile-button").addEventListener("click", () => {
      renderProfileManager();
      $("#manager-dialog").showModal();
    });
    $("#export-button").addEventListener("click", exportProgress);
    $("#import-button").addEventListener("click", loadProgressFile);
    $("#import-file").addEventListener("change", (event) => importProgress(event.target.files?.[0]));
    $("#profile-edit-form").addEventListener("change", editCurrentProfile);
    $("#profile-edit-form").addEventListener("submit", (event) => {
      event.preventDefault();
      editCurrentProfile();
    });
    $("#new-profile-button").addEventListener("click", () => {
      if (!window.EXCEL_LAB_DEV?.enabled) return;
      $("#manager-dialog").close();
      $("#profile-form").reset();
      openProfileDialog();
    });
    $("#reset-button").addEventListener("click", resetProgress);
    $("#rescue-button").addEventListener("click", downloadRescueCopy);
    $("#continue-button").addEventListener("click", (event) => openLesson(event.currentTarget.dataset.lessonId));

    $("#profile-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const accountInput = $("#profile-name-input");
      if (!validateProfileFields(accountInput, $("#profile-class-input"))) return;
      if (!event.currentTarget.reportValidity()) return;
      createProfile(accountInput.value, $("#profile-class-input").value);
      $("#profile-dialog").close();
      event.currentTarget.reset();
    });

    $("#profile-name-input").addEventListener("input", (event) => {
      event.target.value = event.target.value.toLocaleLowerCase("de").replace(/\s+/g, "");
      event.target.setCustomValidity("");
    });
    $("#profile-class-input").addEventListener("input", (event) => {
      event.target.value = event.target.value.toLocaleUpperCase("de");
      event.target.setCustomValidity("");
    });
    $$("#profile-edit-form input").forEach((input) => input.addEventListener("input", () => input.setCustomValidity("")));
    $$('dialog').forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    window.addEventListener("excel-lab-dev-change", renderAll);
    window.addEventListener("hashchange", syncRouteFromHash);
    window.addEventListener("storage", (event) => {
      if ((event.key === STORAGE_KEY || event.key === null) &&
          (!event.storageArea || event.storageArea === localStorage)) syncStoredState();
    });
    window.addEventListener("pageshow", syncStoredState);
    window.addEventListener("focus", syncStoredState);
  }

  function init() {
    bindEvents();
    renderAll();
    syncRouteFromHash();
    if (unreadableState !== null) {
      showToast("Der gespeicherte Lernstand war nicht lesbar und bleibt als Rettungskopie im Browser erhalten. Lade deine letzte Speicherdatei über Profil › Laden.", 20000);
    }
    if (!currentProfile() && !window.EXCEL_LAB_DEV?.enabled) window.setTimeout(openProfileDialog, 250);
  }

  init();
})();
