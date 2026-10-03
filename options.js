(function () {
  "use strict";
  const key = "excelLab.appearance.v1";
  const defaults = { background: "standard", text: "standard", size: "normal" };
  const presets = {
    background: [["standard", "Standard"], ["green", "Smaragd"], ["graphite", "Graphit"], ["violet", "Violett"], ["sand", "Sand"]],
    text: [["standard", "Standard"], ["warm", "Warmer Leseton"], ["contrast", "Hoher Kontrast"], ["mint", "Mint"], ["lavender", "Lavendel"]],
    size: [["normal", "Normal"], ["comfortable", "Etwas größer"], ["large", "Groß"]]
  };
  const allowed = Object.fromEntries(Object.entries(presets).map(([name, choices]) => [name, choices.map(([value]) => value)]));
  const root = document.documentElement;
  let preferences;
  function read() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(key) || "null"); } catch { saved = null; }
    return Object.fromEntries(Object.keys(defaults).map(name => [name, allowed[name].includes(saved?.[name]) ? saved[name] : defaults[name]]));
  }
  function apply() {
    root.dataset.background = preferences.background;
    root.dataset.textTone = preferences.text;
    root.dataset.textSize = preferences.size;
  }
  preferences = read();
  apply();
  const actions = document.querySelector(".site-header .header-actions");
  if (!actions) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-button options-button";
  button.id = "options-button";
  button.title = "Darstellung einstellen";
  button.setAttribute("aria-label", "Optionen für die Darstellung öffnen");
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "options-dialog");
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></svg>';
  actions.insertBefore(button, actions.querySelector(".profile-button"));
  const dialog = document.createElement("dialog");
  dialog.id = "options-dialog";
  dialog.className = "dialog options-dialog";
  dialog.setAttribute("aria-labelledby", "options-title");
  function choices(name, title) {
    return `<fieldset class="option-group"><legend>${title}</legend><div class="option-grid option-grid-${name}">${presets[name].map(([value, label]) => `<label class="option-choice" title="${label}"><input class="sr-only" type="radio" name="${name}" value="${value}" aria-label="${label}"><span class="option-tile option-${name}-${value}" aria-hidden="true">${name === "background" ? "" : name === "size" ? "A" : "Aa"}</span></label>`).join("")}</div></fieldset>`;
  }
  dialog.innerHTML = `<div class="dialog-content">
    <button class="dialog-close" type="button" aria-label="Optionen schließen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg></button>
    <h2 id="options-title">Darstellung</h2>
    ${choices("background", "Hintergrund")}
    ${choices("text", "Schriftfarbe")}
    ${choices("size", "Schriftgröße")}
    <button class="button button-secondary button-full" id="options-reset" type="button">Standard wiederherstellen</button>
    <p class="sr-only" id="options-status" role="status"></p>
  </div>`;
  document.body.append(dialog);
  function sync() { dialog.querySelectorAll('input[type="radio"]').forEach(input => input.checked = input.value === preferences[input.name]); }
  function save() {
    apply();
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
      dialog.querySelector("#options-status").textContent = "Darstellung gespeichert.";
    } catch { dialog.querySelector("#options-status").textContent = "Darstellung geändert. Speichern ist in diesem Browser nicht möglich."; }
  }
  dialog.addEventListener("change", event => {
    const name = event.target.name;
    if (!allowed[name]?.includes(event.target.value)) return;
    preferences[name] = event.target.value;
    save();
  });
  button.addEventListener("click", () => { sync(); if (!dialog.open) dialog.showModal(); });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.querySelector("#options-reset").addEventListener("click", () => { preferences = { ...defaults }; sync(); save(); });
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener("storage", event => { if (event.key === key || event.key === null) { preferences = read(); apply(); sync(); } });
  sync();
})();
