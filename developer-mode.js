(function () {
  "use strict";
  const KEY = "excelLab.developerPreview";
  const navigation = performance.getEntriesByType("navigation")[0];
  let enabled = false;
  try {
    if (navigation?.type === "reload") sessionStorage.removeItem(KEY);
    enabled = sessionStorage.getItem(KEY) === "1";
  } catch { /* Still allow an in-memory preview if session storage is unavailable. */ }
  let buttonVisible = enabled;
  const banner = document.createElement("div");
  banner.className = "developer-preview-banner";
  banner.innerHTML = '<span>Entwickler-Vorschau · alle Einheiten offen · keine Fortschrittsänderungen</span><button type="button">Beenden</button>';
  document.querySelector("header")?.after(banner);
  function paint() {
    banner.hidden = !enabled;
    const button = document.querySelector("#developer-mode-button");
    if (button) {
      button.hidden = !buttonVisible;
      button.textContent = enabled ? "Entwickler-Modus beenden" : "Entwickler-Modus";
      button.setAttribute("aria-pressed", String(enabled));
    }
  }
  function setEnabled(value) {
    enabled = Boolean(value);
    try { if (enabled) sessionStorage.setItem(KEY, "1"); else sessionStorage.removeItem(KEY); } catch { /* No persistent profile changes. */ }
    paint(); window.dispatchEvent(new Event("excel-lab-dev-change"));
  }
  window.EXCEL_LAB_DEV = Object.freeze({ get enabled() { return enabled; } });
  banner.querySelector("button").addEventListener("click", () => setEnabled(false));
  document.querySelector("#developer-mode-button")?.addEventListener("click", () => setEnabled(!enabled));
  document.addEventListener("keydown", (event) => {
    const manager = document.querySelector("#manager-dialog");
    if (!manager?.open || event.repeat || event.shiftKey || event.metaKey) return;
    if (event.code !== "KeyS" || !(event.getModifierState("AltGraph") || (event.ctrlKey && event.altKey))) return;
    event.preventDefault();
    const button = document.querySelector("#developer-mode-button");
    if (!button) return;
    buttonVisible = !buttonVisible;
    paint();
    if (buttonVisible) button.focus();
    else manager.querySelector(".dialog-close, [data-close-dialog], button")?.focus();
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try { enabled = sessionStorage.getItem(KEY) === "1"; } catch { enabled = false; }
    paint(); window.dispatchEvent(new Event("excel-lab-dev-change"));
  });
  paint();
})();
