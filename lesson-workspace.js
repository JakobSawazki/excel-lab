(function () {
  "use strict";
  function revealTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.closest("details");
    while (parent) { parent.open = true; parent = parent.parentElement.closest("details"); }
    if (target.closest(".lesson-disclosure")) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
  document.querySelectorAll("[data-expand-lessons], [data-collapse-lessons]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const open = button.hasAttribute("data-expand-lessons");
      button.closest(".lesson-article").querySelectorAll(".lesson-disclosure").forEach((section) => { section.open = open; });
    });
  });
  window.addEventListener("hashchange", revealTarget);
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.hash === location.hash) revealTarget();
  });
  function addExcelLinks(root) {
    if (window.EXCEL_LAB_DEPLOYMENT?.isPublicSite || !/^https?:$/.test(location.protocol)) return;
    root.querySelectorAll('a.download-item[href]').forEach((download) => {
      if (download.dataset.excelEnhanced) return;
      const url = new URL(download.getAttribute("href"), location.href);
      if (url.origin !== location.origin || !/\.xlsx$/i.test(url.pathname) || !url.pathname.includes("/materialien/BPE1/")) return;
      download.dataset.excelEnhanced = "true";
      const wrapper = document.createElement("div"); wrapper.className = "excel-open-actions";
      const link = document.createElement("a"); link.className = "text-button";
      // Read-only opening protects the original. Learners save their own copy.
      link.href = `ms-excel:ofv|u|${url.href}`;
      link.textContent = "Vorlage in Excel öffnen ↗";
      link.setAttribute("aria-label", `${download.querySelector("strong")?.textContent || "Vorlage"} in der Excel-App öffnen`);
      const hint = document.createElement("small");
      hint.textContent = "Benötigt installiertes Excel; der Browser fragt gegebenenfalls nach. Danach mit ‚Speichern unter‘ eine eigene Kopie anlegen. Falls es nicht klappt: Datei oben herunterladen und aus dem Downloadordner öffnen.";
      wrapper.append(link, hint); download.after(wrapper);
    });
  }
  addExcelLinks(document);
  const dialog = document.querySelector("#lesson-dialog-content");
  if (dialog) new MutationObserver(() => addExcelLinks(dialog)).observe(dialog, { childList: true });
  revealTarget();
})();
