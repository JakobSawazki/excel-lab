(function () {
  "use strict";
  // XP, Level und NAGOLD im Profilknopf der Kopfzeile. Die Einzelheiten stehen
  // auf der Startseite im Profilfenster, auf den Lernseiten in einem eigenen
  // Fenster, das sich beim Klick auf den Profilknopf öffnet.
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

  const panelMarkup = `
    <div class="xp-summary"><strong id="xp-total">0 XP</strong><span id="xp-level">Level 1</span></div>
    <p id="xp-next"></p>
    <progress id="xp-progress" max="500" value="0" aria-label="Fortschritt zum nächsten Level"></progress>
    <p class="xp-breakdown" id="xp-breakdown"></p>
    <p class="xp-nagold" id="xp-nagold"></p>
    <p class="xp-rule">Eine abgeschlossene Einheit bringt 100 XP und 5 NAGOLD, jede gelöste Bonusaufgabe zusätzlich 50 XP. Ein neues Level erreichst du nach je 500 XP; das letzte Level mit allen Einheiten und allen Bonusaufgaben.</p>`;

  const managerList = document.querySelector("#manager-dialog #profile-list");
  let dialog = null;
  let panel;
  if (managerList) {
    // Startseite: Abschnitt im Profilfenster.
    panel = document.createElement("section");
    panel.className = "xp-panel";
    panel.id = "xp-panel";
    panel.setAttribute("aria-labelledby", "xp-title");
    panel.innerHTML = `<h3 id="xp-title">Deine XP</h3>${panelMarkup}`;
    managerList.after(panel);
  } else {
    // Lernseiten: eigenes Fenster hinter dem Profilknopf.
    dialog = document.createElement("dialog");
    dialog.className = "dialog xp-dialog";
    dialog.id = "xp-dialog";
    dialog.setAttribute("aria-labelledby", "xp-title");
    dialog.innerHTML = `<div class="dialog-content">
      <button class="dialog-close" type="button" aria-label="XP-Übersicht schließen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg></button>
      <h2 id="xp-title">Deine XP</h2>${panelMarkup}
      <a class="button button-secondary button-full" id="xp-profile-link" href="${profileButton.getAttribute("href") || "index.html#uebersicht"}">Profil und Speicherstand öffnen</a>
    </div>`;
    document.body.append(dialog);
    panel = dialog;
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    profileButton.setAttribute("aria-haspopup", "dialog");
    profileButton.addEventListener("click", (event) => {
      // Ohne Profil führt der Knopf wie bisher zur Startseite, um eines anzulegen.
      if (!currentProfile()) return;
      event.preventDefault();
      refresh();
      if (!dialog.open) dialog.showModal();
    });
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
    if (dialog) profileButton.setAttribute("aria-label", profile ? `${summary}. XP-Übersicht öffnen` : "Lernprofil anlegen");
    else profileButton.setAttribute("aria-label", profile ? `${summary}. Profil öffnen` : "Profil öffnen");

    panel.querySelector("#xp-total").textContent = `${xp} XP`;
    panel.querySelector("#xp-level").textContent = `Level ${levelIndex + 1}`;
    panel.querySelector("#xp-next").textContent = !profile
      ? "Lege ein Profil an oder lade deine Speicherdatei, um XP zu sammeln."
      : next === undefined ? "Höchstes Level erreicht – alle Einheiten und Bonusaufgaben geschafft!"
        : `Noch ${next - xp} XP bis Level ${levelIndex + 2} (${next} XP insgesamt).`;
    // Woher die XP kommen: Einheiten und Bonusaufgaben getrennt.
    panel.querySelector("#xp-breakdown").textContent = profile
      ? `${completed} von ${lessons.length} Einheiten: ${completed * 100} XP · ${solved} von ${available} Bonusaufgaben: ${solved * bonusXp} XP`
      : "";
    const nextLesson = lessons.find((lesson) => !profile?.progress?.[lesson.id]?.completed);
    panel.querySelector("#xp-nagold").textContent = profile && nagold
      ? `${nagoldTotal} NAGOLD gesammelt. ${nextLesson ? `Die nächsten ${nagold.maxPoints} NAGOLD gibt es für den Abschluss von ${nextLesson.code}.` : "Alle Einheiten sind abgeschlossen."}`
      : "";
    const progress = panel.querySelector("#xp-progress");
    progress.max = next === undefined ? 1 : next - base;
    progress.value = next === undefined ? 1 : xp - base;
    progress.setAttribute("aria-label", next === undefined ? "Höchstes Level erreicht" : `Fortschritt zu Level ${levelIndex + 2}`);
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
