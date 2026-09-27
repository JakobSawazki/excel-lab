(function () {
  "use strict";
  const videoTutorials = {
    "l1-1": { id: "xGg6PxGJyLI", title: "Excel Tabelle erstellen: Grundlagen", author: "Lernwas", context: "Tabellenaufbau und Dateneingabe. Deine Getränkeliste planst du anschließend selbst." },
    "l1-2": { id: "ZbWcoOrviaw", title: "Rechnen in Excel: Grundrechenarten", author: "Computerkurs", context: "Formeln und Rechenzeichen als Ergänzung zur Getränkeliste." },
    "l1-3": { id: "-beNwsieTQc", title: "Excel Basis: Zellen formatieren", author: "Jarek Galek", context: "Zellformatierung als Einstieg; für deine Datei gelten die Arbeitsaufträge auf dieser Seite." },
    "l1-4": { id: "82fEbFkxhbI", title: "Formeln kopieren: relative Zellbezüge", author: "Arno Burger", context: "Warum sich Zellbezüge beim Kopieren mitbewegen." },
    "l1-5": { id: "xGg6PxGJyLI", title: "Excel Tabelle erstellen: Grundlagen", author: "Lernwas", context: "Tabellenaufbau als Wiederholung für deine selbst entworfene Sommerfest-Liste." },
    "l1-6": { id: "ZbWcoOrviaw", title: "Rechnen in Excel: Grundrechenarten", author: "Computerkurs", context: "Rechenformeln als Wiederholung für die fünf Vertiefungsaufgaben." },
    "l2-1": { id: "82fEbFkxhbI", title: "Formeln kopieren: relative Zellbezüge", author: "Arno Burger", context: "Wie sich Formeln beim Kopieren an neue Zeilen anpassen." },
    "l2-2": { id: "l2y7YEgMX-I", title: "Formeln kopieren: absolute Zellbezüge", author: "Arno Burger", context: "Wie eine Zelladresse beim Kopieren festgehalten wird." },
    "l2-3": { id: "aT53rybCKm4", title: "Gemischte Zellbezüge in Excel 2019", author: "DieComputerOma", context: "Spalte oder Zeile gezielt fixieren; die Klassenfahrt- und Provisionsaufgaben löst du selbst." },
    "l2-4": { id: "e27toYqrty8", title: "SUMME, MITTELWERT, MIN und MAX", author: "SheetWise", context: "Die vier Grundfunktionen im Überblick, bevor du sie in der Projektwoche anwendest." },
    "l2-5": { id: "e27toYqrty8", title: "SUMME, MITTELWERT, MIN und MAX", author: "SheetWise", context: "Die Funktionen als Wiederholung für den Vergleich der Buspreise und die Provisionsabrechnung." }
  };

  function addVideoTutorial() {
    const lessonId = location.pathname.split("/").pop()?.replace(/\.html$/i, "");
    const video = videoTutorials[lessonId];
    const firstTask = document.querySelector(".lesson-article > .task-section");
    if (!video || !firstTask || !/^[\w-]{11}$/.test(video.id)) return;

    const card = document.createElement("section");
    card.className = "lesson-video-tutorial";
    card.setAttribute("aria-labelledby", "video-tutorial-heading");
    const eyebrow = document.createElement("p");
    eyebrow.className = "section-index";
    eyebrow.textContent = "Optional · Video-Tutorial";
    const heading = document.createElement("h2");
    heading.id = "video-tutorial-heading";
    heading.textContent = video.title;
    const description = document.createElement("p");
    description.textContent = `${video.context} Video von ${video.author}.`;
    const privacy = document.createElement("p");
    privacy.className = "lesson-video-privacy";
    privacy.textContent = "Beim Seitenaufruf wird YouTube nicht geladen. Erst wenn du das Video lädst oder den YouTube-Link öffnest, werden Daten an YouTube übertragen. Das Video ist freiwillig; Informationen und Aufgaben stehen vollständig hier.";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-primary lesson-video-button";
    button.textContent = "▶ Video laden";
    button.setAttribute("aria-controls", "lesson-video-frame");
    button.setAttribute("aria-expanded", "false");
    const frame = document.createElement("div");
    frame.id = "lesson-video-frame";
    frame.className = "lesson-video-frame";
    frame.hidden = true;
    button.addEventListener("click", () => {
      if (frame.firstChild) {
        frame.replaceChildren();
        frame.hidden = true;
        button.textContent = "▶ Video laden";
        button.setAttribute("aria-expanded", "false");
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
      iframe.title = `YouTube-Video: ${video.title}`;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
      frame.hidden = false;
      button.textContent = "Video schließen";
      button.setAttribute("aria-expanded", "true");
    });
    const fallback = document.createElement("a");
    fallback.href = `https://www.youtube.com/watch?v=${video.id}`;
    fallback.target = "_blank";
    fallback.rel = "noopener noreferrer";
    fallback.className = "text-button lesson-video-link";
    fallback.textContent = "Video direkt auf YouTube öffnen ↗";
    const controls = document.createElement("div");
    controls.className = "lesson-video-controls";
    controls.append(button, fallback);
    card.append(eyebrow, heading, description, privacy, controls, frame);
    firstTask.before(card);
  }

  addVideoTutorial();
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
