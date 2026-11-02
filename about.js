(function () {
  "use strict";
  const triggers = document.querySelectorAll(".site-footer .footer-brand, [data-about-info]");
  if (!triggers.length) return;
  let loading;

  function groupVersions(dialog) {
    if (dialog.dataset.versionsGrouped) return;
    const timeline = dialog.querySelector(".version-timeline");
    if (!timeline) return;
    const groups = document.createElement("div");
    groups.className = "version-groups";
    const buckets = new Map();
    for (const entry of Array.from(timeline.children)) {
      const version = entry.querySelector(":scope > span")?.textContent.trim() || "";
      const match = version.match(/^(\d+)\.(\d+)(?:\.|$)/);
      const label = match ? `${match[1]}.${Math.floor(Number(match[2]) / 10)}x` : "Weitere Versionen";
      if (!buckets.has(label)) {
        const section = document.createElement("details");
        section.className = "version-group";
        const summary = document.createElement("summary");
        const title = document.createElement("span"); title.textContent = label;
        const count = document.createElement("small");
        const icon = document.createElement("span"); icon.className = "version-group-icon"; icon.setAttribute("aria-hidden", "true");
        summary.append(title, count, icon);
        const list = document.createElement("ol"); list.className = "version-timeline";
        section.append(summary, list); groups.append(section);
        buckets.set(label, { list, count });
      }
      buckets.get(label).list.append(entry);
    }
    for (const { list, count } of buckets.values()) count.textContent = `${list.children.length} ${list.children.length === 1 ? "Versionsstand" : "Versionsstände"}`;
    timeline.replaceWith(groups);
    dialog.dataset.versionsGrouped = "true";
  }

  async function getDialog() {
    let dialog = document.querySelector("#about-dialog");
    if (dialog) return dialog;
    if (!loading) loading = (async () => {
      // Eine Quelle für Verlauf und Impressum, auch auf den Lernseiten.
      const response = await fetch(new URL("index.html", location.href), { credentials: "omit", cache: "no-cache" });
      if (!response.ok) throw new Error("Informationen konnten nicht geladen werden. Bitte erneut versuchen.");
      const source = new DOMParser().parseFromString(await response.text(), "text/html").querySelector("#about-dialog");
      if (!source) throw new Error("Versionsinformationen sind gerade nicht verfügbar.");
      dialog = document.importNode(source, true);
      dialog.querySelectorAll("script, iframe, object, embed, base, link, style").forEach(element => element.remove());
      for (const element of [dialog, ...dialog.querySelectorAll("*")]) {
        for (const attribute of [...element.attributes]) if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
      }
      document.body.append(dialog);
      return dialog;
    })().catch(error => { loading = null; throw error; });
    return loading;
  }

  async function open(trigger) {
    const position = { left: window.scrollX, top: window.scrollY };
    const restore = () => window.scrollTo({ ...position, behavior: "instant" });
    try {
      const dialog = await getDialog();
      if (dialog.open) return;
      groupVersions(dialog);
      dialog.querySelectorAll(".version-group").forEach(group => { group.open = false; });
      if (!dialog.dataset.aboutBound) {
        dialog.dataset.aboutBound = "true";
        dialog.addEventListener("click", event => {
          if (event.target === dialog || event.target.closest(".dialog-close, [data-close-dialog]")) {
            if (dialog.open) dialog.close();
          }
        });
      }
      dialog.addEventListener("close", () => {
        trigger.focus({ preventScroll: true }); restore();
        // Auch nach der nativen Fokus-Rückgabe des Browsers dieselbe Position.
        requestAnimationFrame(() => { trigger.focus({ preventScroll: true }); restore(); });
      }, { once: true });
      dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector(".dialog-close")?.focus({ preventScroll: true });
      restore();
      requestAnimationFrame(restore);
    } catch (error) {
      window.ExcelLabSave?.notify(error.message || "Informationen konnten nicht geladen werden.");
      trigger.focus({ preventScroll: true }); restore();
    }
  }

  triggers.forEach(trigger => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "about-dialog");
    trigger.setAttribute("aria-label", "Excel-Lab Versionen und Impressum");
    trigger.addEventListener("click", event => { event.preventDefault(); open(trigger); });
  });
  const existing = document.querySelector("#about-dialog");
  if (existing) groupVersions(existing);
})();
