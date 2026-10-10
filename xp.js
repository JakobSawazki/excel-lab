(function () {
  "use strict";
  const actions = document.querySelector(".site-header .header-actions");
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!actions || !Array.isArray(lessons)) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-button xp-button";
  button.id = "xp-button";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "xp-dialog");
  button.innerHTML = '<span class="xp-count">0</span><span class="xp-label" aria-hidden="true">XP</span>';
  actions.insertBefore(button, actions.querySelector(".profile-button"));
  const dialog = document.createElement("dialog");
  dialog.className = "dialog xp-dialog";
  dialog.id = "xp-dialog";
  dialog.setAttribute("aria-labelledby", "xp-title");
  dialog.innerHTML = `<div class="dialog-content">
    <button class="dialog-close" type="button" aria-label="XP-Übersicht schließen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg></button>
    <h2 id="xp-title">Deine XP</h2>
    <div class="xp-summary"><strong id="xp-total">0 XP</strong><span id="xp-level">Level 1</span></div>
    <p id="xp-next"></p>
    <p class="xp-breakdown" id="xp-breakdown"></p>
    <progress id="xp-progress" max="500" value="0" aria-label="Fortschritt zum nächsten Level"></progress>
    <p class="xp-rule">Eine abgeschlossene Einheit bringt 100 XP, jede gelöste Bonusaufgabe zusätzlich 50 XP. Ein neues Level erreichst du nach je 500 XP; das letzte Level mit allen Einheiten und allen Bonusaufgaben.</p>
  </div>`;
  document.body.append(dialog);
  function refresh() {
    let profile = null;
    try {
      const state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null");
      if (state?.version === 1 && Array.isArray(state.profiles)) profile = state.profiles.find(item => item?.id === state.currentProfileId);
    } catch { /* Ohne gespeichertes Profil startet die Anzeige bei null. */ }
    // Nur bekannte, abgeschlossene Einheiten zählen; kein eigener XP-Speicher.
    const bonusXp = window.EXCEL_LAB_BONUS?.xp || 0;
    const bonusTasks = window.EXCEL_LAB_BONUS?.tasks || {};
    const extraTasks = window.EXCEL_LAB_BONUS?.extra || {};
    // Je Einheit bis zu zwei Bonusaufgaben: `bonus` und `bonus2` im Lernstand.
    const available = lessons.reduce((sum, lesson) => sum + Number(Boolean(bonusTasks[lesson.id])) + Number(Boolean(extraTasks[lesson.id])), 0);
    const solved = lessons.reduce((sum, lesson) => sum
      + Number(Boolean(bonusTasks[lesson.id] && profile?.progress?.[lesson.id]?.bonus))
      + Number(Boolean(extraTasks[lesson.id] && profile?.progress?.[lesson.id]?.bonus2)), 0);
    const completed = lessons.filter(lesson => Boolean(profile?.progress?.[lesson.id]?.completed)).length;
    const xp = completed * 100 + solved * bonusXp;
    const maximum = lessons.length * 100 + available * bonusXp;
    const thresholds = [0];
    for (let value = 500; value < maximum; value += 500) thresholds.push(value);
    if (maximum > 0) thresholds.push(maximum);
    let levelIndex = 0;
    while (levelIndex + 1 < thresholds.length && xp >= thresholds[levelIndex + 1]) levelIndex++;
    const next = thresholds[levelIndex + 1];
    const base = thresholds[levelIndex];
    button.querySelector(".xp-count").textContent = xp;
    button.setAttribute("aria-label", `${xp} XP, Level ${levelIndex + 1}. XP-Übersicht öffnen`);
    button.title = `${xp} XP · Level ${levelIndex + 1}`;
    dialog.querySelector("#xp-total").textContent = `${xp} XP`;
    dialog.querySelector("#xp-level").textContent = `Level ${levelIndex + 1}`;
    dialog.querySelector("#xp-next").textContent = !profile
      ? "Lege ein Profil an oder lade deine Speicherdatei, um XP zu sammeln."
      : next === undefined ? "Höchstes Level erreicht – alle Einheiten und Bonusaufgaben geschafft!"
        : `Noch ${next - xp} XP bis Level ${levelIndex + 2} (${next} XP insgesamt).`;
    // Woher die XP kommen: Einheiten und Bonusaufgaben getrennt.
    dialog.querySelector("#xp-breakdown").textContent = profile
      ? `${completed} von ${lessons.length} Einheiten: ${completed * 100} XP · ${solved} von ${available} Bonusaufgaben: ${solved * bonusXp} XP`
      : "";
    const progress = dialog.querySelector("#xp-progress");
    progress.max = next === undefined ? 1 : next - base;
    progress.value = next === undefined ? 1 : xp - base;
    progress.setAttribute("aria-label", next === undefined ? "Höchstes Level erreicht" : `Fortschritt zu Level ${levelIndex + 2}`);
  }
  button.addEventListener("click", () => { refresh(); if (!dialog.open) dialog.showModal(); });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener("storage", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("excel-lab-progress-change", refresh);
  // Lernseiten speichern ihren Abschluss innerhalb des jeweiligen Ereignisses.
  document.addEventListener("click", () => setTimeout(refresh, 0));
  document.addEventListener("change", () => setTimeout(refresh, 0));
  refresh();
})();
