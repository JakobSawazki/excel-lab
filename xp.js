(function () {
  "use strict";
  // XP, Level und NAGOLD im Profilknopf der Kopfzeile. Die Einzelheiten stehen
  // auf Startseite und Lernseiten im gleich gestalteten Profilfenster.
  const profileButton = document.querySelector(".site-header .profile-button");
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!profileButton || !Array.isArray(lessons)) return;
  const nagold = window.EXCEL_LAB_NAGOLD || null;

  // Kopfzeile: „200 XP · 13 NAG“ über dem Kürzel; ohne Profil bleibt die bisherige Beschriftung.
  const small = profileButton.querySelector(".profile-copy small");
  const label = document.createElement("span");
  label.className = "profile-label";
  label.textContent = small ? small.textContent : "";
  const stats = document.createElement("span");
  stats.className = "profile-stats";
  stats.id = "profile-stats";
  stats.hidden = true;
  stats.innerHTML = '<span class="profile-xp" id="profile-xp"><span class="xp-count">0</span> XP</span><span class="profile-nagold" id="profile-nagold"></span>';
  if (small) small.replaceChildren(label, stats);
  // Schmale Bildschirme zeigen nur das Kürzel-Feld; dort steht der XP-Stand daneben.
  const mini = document.createElement("span");
  mini.className = "profile-mini";
  mini.hidden = true;
  mini.setAttribute("aria-hidden", "true");
  mini.innerHTML = '<span class="xp-count-mini">0</span><span class="profile-mini-label">XP</span>';
  profileButton.querySelector(".profile-avatar")?.after(mini);

  // Wenig Text: Zahl, Level, Balken und eine Zeile. Erklärungen erscheinen als
  // Tooltip beim Darüberfahren oder bei Tastaturfokus.
  const panelMarkup = (withNagold) => `
    <div class="xp-summary">
      <span class="tip-wrap tip-start"><strong id="xp-total" tabindex="0" aria-describedby="xp-breakdown">0 XP</strong><span class="tip" role="tooltip" id="xp-breakdown"></span></span>
      ${withNagold ? '<span class="tip-wrap"><span class="xp-nagold-chip" id="xp-nagold-chip" tabindex="0" aria-describedby="xp-nagold">0 NAGOLD</span><span class="tip" role="tooltip" id="xp-nagold"></span></span>' : ""}
      <span class="tip-wrap tip-end"><span id="xp-level" tabindex="0" aria-describedby="xp-rule">Level 1</span><span class="tip" role="tooltip" id="xp-rule">Eine Einheit bringt 100 XP, eine Bonusaufgabe 50 XP. Ein neues Level gibt es nach je 500 XP.</span></span>
    </div>
    <progress id="xp-progress" max="500" value="0" aria-label="Fortschritt zum nächsten Level"></progress>
    <p id="xp-next"></p>`;

  const lessonProfile = !document.querySelector("#manager-dialog");
  let lessonManager = null;
  if (lessonProfile) {
    lessonManager = document.createElement("dialog");
    lessonManager.className = "dialog manager-dialog";
    lessonManager.id = "manager-dialog";
    lessonManager.setAttribute("aria-labelledby", "manager-dialog-title");
    lessonManager.innerHTML = `<div class="dialog-content">
      <button class="dialog-close" type="button" aria-label="Dialog schließen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg></button>
      <h2 id="manager-dialog-title">Profil</h2><div class="profile-list" id="profile-list"></div>
      <form id="profile-edit-form" class="profile-edit-form">
        <label><span>Kürzel</span><input id="profile-edit-name" type="text" maxlength="7" pattern="[a-zäöüß]{3}\\.[a-zäöüß]{3}" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="z. B. jak.saw"></label>
        <label><span>Klassenbezeichnung</span><input id="profile-edit-class" type="text" minlength="3" maxlength="32" required autocapitalize="characters" spellcheck="false" placeholder="z. B. WGW EK1"></label>
      </form>
      <div class="manager-panels"><div class="manager-panel-slot" id="xp-slot"></div>
        <span class="tip-wrap nagold-tip-wrap"><button class="nagold-total" type="button" id="nagold-total" aria-haspopup="dialog" aria-controls="nagold-dialog" aria-describedby="nagold-tip"><span class="nagold-panel-title">Deine NAGOLD</span><span class="nagold-panel-value"><span class="nagold-coin" aria-hidden="true"></span><strong id="nagold-total-value">0 NAGOLD</strong><span class="nagold-edit-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4"/></svg></span></span></button><span class="tip" role="tooltip" id="nagold-tip"></span></span>
      </div><a class="button button-secondary" id="certificate-link" href="nachweis.html">Lernnachweis</a>
      <p id="lesson-profile-status" role="status" aria-live="polite" hidden></p>
    </div>`;
    document.body.append(lessonManager);
    lessonManager.querySelector(".dialog-close").addEventListener("click", () => lessonManager.close());
    lessonManager.addEventListener("click", event => { if (event.target === lessonManager) lessonManager.close(); });
    profileButton.setAttribute("aria-haspopup", "dialog");
    profileButton.setAttribute("aria-controls", "manager-dialog");
    profileButton.addEventListener("click", event => {
      if (!currentProfile()) return;
      event.preventDefault();
      renderLessonProfile(true);
      refresh();
      lessonManager.showModal();
    });
    const editForm = lessonManager.querySelector("#profile-edit-form");
    editForm.addEventListener("input", event => event.target.setCustomValidity?.(""));
    editForm.addEventListener("change", editLessonProfile);
    editForm.addEventListener("submit", event => { event.preventDefault(); editLessonProfile(); });
    lessonManager.querySelector("#nagold-total").addEventListener("click", openLessonNagold);
  }
  const managerList = document.querySelector("#manager-dialog #profile-list");
  let panel;
  if (managerList) {
    // Startseite: Abschnitt im Profilfenster.
    panel = document.createElement("section");
    panel.className = "xp-panel";
    panel.id = "xp-panel";
    panel.setAttribute("aria-labelledby", "xp-title");
    panel.innerHTML = `<h3 id="xp-title">Deine XP</h3>${panelMarkup(false)}`;
    // Der Abschnitt sitzt neben dem NAGOLD-Feld; ohne den Platzhalter unter der Profilkarte.
    const slot = document.querySelector("#manager-dialog #xp-slot");
    if (slot) slot.append(panel);
    else managerList.after(panel);
  }

  function currentProfile() {
    try {
      const state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null");
      if (state?.version === 1 && Array.isArray(state.profiles)) return state.profiles.find((item) => item?.id === state.currentProfileId) || null;
    } catch { /* Ohne gespeichertes Profil startet die Anzeige bei null. */ }
    return null;
  }

  function refresh() {
    const profile = currentProfile();
    // Nur bekannte, abgeschlossene Einheiten zählen; kein eigener XP-Speicher.
    const bonusXp = window.EXCEL_LAB_BONUS?.xp || 0;
    const bonusTasks = window.EXCEL_LAB_BONUS?.tasks || {};
    const extraTasks = window.EXCEL_LAB_BONUS?.extra || {};
    // Je Einheit bis zu zwei Bonusaufgaben: `bonus` und `bonus2` im Lernstand.
    const available = lessons.reduce((sum, lesson) => sum + Number(Boolean(bonusTasks[lesson.id])) + Number(Boolean(extraTasks[lesson.id])), 0);
    const solved = lessons.reduce((sum, lesson) => sum
      + Number(Boolean(bonusTasks[lesson.id] && profile?.progress?.[lesson.id]?.bonus))
      + Number(Boolean(extraTasks[lesson.id] && profile?.progress?.[lesson.id]?.bonus2)), 0);
    const completed = lessons.filter((lesson) => Boolean(profile?.progress?.[lesson.id]?.completed)).length;
    const xp = completed * 100 + solved * bonusXp;
    const maximum = lessons.length * 100 + available * bonusXp;
    const thresholds = [0];
    for (let value = 500; value < maximum; value += 500) thresholds.push(value);
    if (maximum > 0) thresholds.push(maximum);
    let levelIndex = 0;
    while (levelIndex + 1 < thresholds.length && xp >= thresholds[levelIndex + 1]) levelIndex++;
    const next = thresholds[levelIndex + 1];
    const base = thresholds[levelIndex];
    const nagoldTotal = nagold && profile ? nagold.total(profile) : 0;

    label.hidden = Boolean(profile);
    stats.hidden = !profile;
    mini.hidden = !profile;
    stats.querySelector(".xp-count").textContent = xp;
    mini.querySelector(".xp-count-mini").textContent = xp;
    stats.querySelector("#profile-nagold").textContent = nagold ? ` · ${nagoldTotal} NAG` : "";
    const summary = profile
      ? `${profile.name}: ${xp} XP, Level ${levelIndex + 1}${nagold ? `, ${nagoldTotal} NAGOLD` : ""}`
      : "";
    profileButton.title = profile ? `${summary.replace(/, /g, " · ").replace(": ", " · ")} · Profil öffnen` : "Profil öffnen";
    profileButton.setAttribute("aria-label", profile ? `${summary}. Profil öffnen` : "Profil öffnen");

    panel.querySelector("#xp-total").textContent = `${xp} XP`;
    panel.querySelector("#xp-level").textContent = `Level ${levelIndex + 1}`;
    panel.querySelector("#xp-next").textContent = !profile
      ? "Lege ein Profil an, um XP zu sammeln."
      : next === undefined ? "Höchstes Level erreicht"
        : `Noch ${next - xp} XP bis Level ${levelIndex + 2}`;
    // Woher die XP kommen: Einheiten und Bonusaufgaben getrennt.
    panel.querySelector("#xp-breakdown").textContent = profile
      ? `${completed} von ${lessons.length} Einheiten: ${completed * 100} XP · ${solved} von ${available} Bonusaufgaben: ${solved * bonusXp} XP`
      : "";
    // Wofür es die nächsten NAGOLD gibt: als Tooltip am NAGOLD-Feld.
    const nextLesson = lessons.find((lesson) => !profile?.progress?.[lesson.id]?.completed);
    const nagoldHint = profile && nagold
      ? nextLesson ? `Die nächsten ${nagold.maxPoints} NAGOLD gibt es für den Abschluss von ${nextLesson.code}.` : "Alle Einheiten sind abgeschlossen."
      : "";
    const chip = panel.querySelector("#xp-nagold-chip");
    if (chip) {
      chip.textContent = `${nagoldTotal} NAGOLD`;
      chip.parentElement.hidden = !profile || !nagold;
      panel.querySelector("#xp-nagold").textContent = nagoldHint;
    }
    const managerNagold = document.querySelector("#nagold-tip");
    if (managerNagold) managerNagold.textContent = nagoldHint;
    const progress = panel.querySelector("#xp-progress");
    progress.max = next === undefined ? 1 : next - base;
    progress.value = next === undefined ? 1 : xp - base;
    progress.setAttribute("aria-label", next === undefined ? "Höchstes Level erreicht" : `Fortschritt zu Level ${levelIndex + 2}`);
    if (lessonProfile) renderLessonProfile(false);
  }

  let editingProfileId = null;
  function status(message) {
    const box = lessonManager.querySelector("#lesson-profile-status");
    box.hidden = !message;
    box.textContent = message;
  }
  function renderLessonProfile(fields) {
    const profile = currentProfile();
    if (fields || editingProfileId !== profile?.id) {
      editingProfileId = profile?.id || null;
      lessonManager.querySelector("#profile-edit-name").value = profile?.name || "";
      lessonManager.querySelector("#profile-edit-class").value = profile?.className || "";
      status("");
    }
    const list = lessonManager.querySelector("#profile-list");
    list.replaceChildren();
    if (profile) {
      const card = document.createElement("div"); card.className = "profile-list-item is-current";
      const avatar = document.createElement("span"); avatar.className = "profile-avatar";
      avatar.textContent = profile.name.split(/[.\s]+/).map(part => part[0] || "").slice(0, 2).join("").toLocaleUpperCase("de");
      const copy = document.createElement("div"), name = document.createElement("strong"), detail = document.createElement("small");
      name.textContent = profile.name;
      detail.textContent = `${profile.className || "ohne Klasse"} · ${lessons.filter(item => profile.progress?.[item.id]?.completed).length}/${lessons.length} erledigt`;
      copy.append(name, detail); card.append(avatar, copy); list.append(card);
    }
    lessonManager.querySelector("#profile-edit-form").hidden = !profile;
    lessonManager.querySelector("#nagold-total").disabled = !profile || !nagold;
    lessonManager.querySelector("#nagold-total-value").textContent = `${nagold && profile ? nagold.total(profile) : 0} NAGOLD`;
  }
  function writeProfile(id, update) {
    try {
      const state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null");
      const profile = state?.version === 1 && state.currentProfileId === id && Array.isArray(state.profiles)
        ? state.profiles.find(item => item.id === id) : null;
      if (!profile) { status("Das Profil hat sich geändert. Öffne das Profilfenster erneut."); return false; }
      update(profile);
      profile.updatedAt = new Date().toISOString();
      localStorage.setItem("excelLab.state.v1", JSON.stringify(state));
      window.dispatchEvent(new StorageEvent("storage", {key:"excelLab.state.v1",storageArea:localStorage}));
      window.dispatchEvent(new Event("excel-lab-progress-change"));
      return true;
    } catch { status("Speichern ist nicht möglich. Deine Änderungen wurden nicht übernommen."); return false; }
  }
  function editLessonProfile() {
    const name = lessonManager.querySelector("#profile-edit-name"), className = lessonManager.querySelector("#profile-edit-class");
    name.value = name.value.trim().toLocaleLowerCase("de");
    className.value = className.value.trim().replace(/\s+/g, " ").toLocaleUpperCase("de");
    name.setCustomValidity(/^[a-zäöüß]{3}\.[a-zäöüß]{3}$/.test(name.value) ? "" : "Bitte das Format abc.xyz verwenden.");
    if (!name.reportValidity() || !className.reportValidity()) return;
    const current = currentProfile();
    if (current?.name === name.value && current?.className === className.value) return;
    if (writeProfile(editingProfileId, profile => { profile.name = name.value; profile.className = className.value; })) {
      renderLessonProfile(true); status("Profilangaben aktualisiert.");
    }
  }
  // Dieselbe NAGOLD-Tabelle wie auf der Startseite (nagold-table.js).
  function openLessonNagold() {
    const profile = currentProfile();
    const table = window.ExcelLabNagoldTable;
    if (!profile || !nagold || !table) return;
    const id = profile.id;
    table.open({
      entries: nagold.entriesFor(profile),
      returnFocus: lessonManager.querySelector("#nagold-total"),
      save(entries) {
        if (!writeProfile(id, (current) => { current.nagoldEntries = entries; })) return false;
        refresh();
        status("NAGOLD gespeichert.");
        return true;
      }
    });
  }

  window.addEventListener("storage", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("excel-lab-progress-change", refresh);
  // Lernseiten speichern ihren Abschluss innerhalb des jeweiligen Ereignisses.
  document.addEventListener("click", () => setTimeout(refresh, 0));
  document.addEventListener("change", () => setTimeout(refresh, 0));
  refresh();
})();
