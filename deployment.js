(() => {
  "use strict";

  const MATERIAL_PREFIX = "materialien/BPE1/";
  const MATERIALS_URL = "https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/informatik/material/materialien-zum-neuen-bildungsplan-informatik-an-den-nichtgewerblichen-beruflichen-gymnasien";
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    && params.get("public-preview") === "1";
  const isPublicSite = /(^|\.)github\.io$/i.test(window.location.hostname) || isLocalPreview;

  function adaptMaterialLink(link) {
    const href = link.getAttribute("href") || "";
    if (!isPublicSite || !href.startsWith(MATERIAL_PREFIX) || link.dataset.publicMaterialLink === "true") {
      return;
    }

    link.dataset.publicMaterialLink = "true";
    link.href = MATERIALS_URL;
    link.removeAttribute("download");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Originalmaterial auf dem Landesbildungsserver öffnen";

    const arrow = link.querySelector(".arrow");
    if (arrow) {
      arrow.textContent = "↗";
    }
  }

  function replaceLocalVideo(video) {
    const source = video.getAttribute("src") || "";
    if (!isPublicSite || !source.startsWith(MATERIAL_PREFIX) || video.dataset.publicMaterialVideo === "true") {
      return;
    }

    video.dataset.publicMaterialVideo = "true";
    const notice = document.createElement("p");
    notice.className = "public-material-notice";
    notice.innerHTML = `Das Video gehört zum offiziellen BPE1-Materialpaket. <a href="${MATERIALS_URL}" target="_blank" rel="noopener noreferrer">Materialien auf dem Landesbildungsserver öffnen ↗</a>`;
    video.replaceWith(notice);
  }

  function adaptDownloadNote(note) {
    if (!isPublicSite || note.dataset.publicMaterialNote === "true") {
      return;
    }

    note.dataset.publicMaterialNote = "true";
    note.textContent = "Online werden die Originaldateien aus Lizenzgründen nicht mitgeliefert. Die Links führen zur offiziellen Materialseite.";
  }

  function adaptRoot(root) {
    if (!isPublicSite || !(root instanceof Element || root instanceof Document)) {
      return;
    }

    if (root instanceof Element && root.matches(`a[href^="${MATERIAL_PREFIX}"]`)) {
      adaptMaterialLink(root);
    }
    if (root instanceof Element && root.matches(`video[src^="${MATERIAL_PREFIX}"]`)) {
      replaceLocalVideo(root);
    }
    if (root instanceof Element && root.matches(".download-note")) {
      adaptDownloadNote(root);
    }

    root.querySelectorAll(`a[href^="${MATERIAL_PREFIX}"]`).forEach(adaptMaterialLink);
    root.querySelectorAll(`video[src^="${MATERIAL_PREFIX}"]`).forEach(replaceLocalVideo);
    root.querySelectorAll(".download-note").forEach(adaptDownloadNote);
  }

  function start() {
    if (!isPublicSite) {
      return;
    }

    document.documentElement.classList.add("public-site");
    adaptRoot(document);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            adaptRoot(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.EXCEL_LAB_DEPLOYMENT = Object.freeze({
    isPublicSite,
    materialsUrl: MATERIALS_URL
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
