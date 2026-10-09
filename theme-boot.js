(function () {
  "use strict";

  // Läuft bewusst ohne defer vor den Stylesheets: Farbschema und
  // Darstellungsoptionen stehen fest, bevor die Seite gezeichnet wird.
  // Sonst blitzt bei hellem Schema kurz die dunkle Vorgabe auf.
  const root = document.documentElement;
  const word = (value) => (typeof value === "string" && /^[a-z]{1,20}$/.test(value) ? value : null);
  let state = null;
  let appearance = null;
  try {
    state = JSON.parse(localStorage.getItem("excelLab.state.v1") || "null");
    appearance = JSON.parse(localStorage.getItem("excelLab.appearance.v1") || "null");
  } catch { /* Ohne lesbaren Speicher gilt die Vorgabe des Geräts. */ }
  root.dataset.theme = state?.theme === "light" || state?.theme === "dark"
    ? state.theme
    : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  // options.js prüft die Werte später gegen seine Liste und berichtigt sie.
  if (word(appearance?.background)) root.dataset.background = appearance.background;
  if (word(appearance?.text)) root.dataset.textTone = appearance.text;
  if (word(appearance?.size)) root.dataset.textSize = appearance.size;
})();
