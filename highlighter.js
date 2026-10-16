(function () {
  "use strict";

  // Textmarker auf den Lernseiten (0.31.0, wie in WorkbenchLab): Text auswählen,
  // dann eine Farbe wählen. Die Markierungen gehören zum aktiven Profil
  // (profile.highlights[lessonId]) und reisen mit der Speicherdatei.
  // Absätze, Listenpunkte, Tabellenzellen und Überschriften der Einheit erhalten
  // in Seitenreihenfolge eine Kennung b-0, b-1, …; eine Markierung wird nur
  // wieder angezeigt, wenn ihr Text an dieser Stelle noch genau so steht.
  const KEY = "excelLab.state.v1";
  const core = window.ExcelLabSave;
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  const root = document.querySelector(".lesson-article");
  const page = location.pathname.split("/").pop();
  const lesson = Array.isArray(lessons) ? lessons.find((item) => item.page === page) : null;
  if (!core || !root || !lesson) return;

  const COLORS = [["yellow", "Gelb"], ["mint", "Mint"], ["coral", "Koralle"], ["green", "Grün"]];
  const BLOCKS = "p, li, td, th, h2, h3, h4, dt, dd, figcaption, blockquote";
  const SKIP = "form, button, label, .lesson-reading-tools, [contenteditable]";

  // Nur „Blätter“: ein Listenpunkt mit eigenen Absätzen wird über die Absätze markiert.
  const blocks = [...root.querySelectorAll(BLOCKS)].filter((element) => !element.closest(SKIP) && !element.querySelector(BLOCKS));
  blocks.forEach((element, index) => { element.dataset.highlightBlock = `b-${index}`; });

  function readState() {
    try {
      const state = JSON.parse(localStorage.getItem(KEY) || "null");
      return state?.version === 1 && Array.isArray(state.profiles) ? state : null;
    } catch { return null; }
  }
  const currentProfile = (state) => state?.profiles.find((item) => item?.id === state.currentProfileId) || null;
  const entries = () => core.normalizeHighlights(currentProfile(readState())?.highlights)[lesson.id] || [];

  function update(list, selection, color) {
    let result = list.slice();
    for (const anchor of selection) {
      const kept = [];
      for (const item of result) {
        if (item.block !== anchor.block || item.end <= anchor.start || item.start >= anchor.end) { kept.push(item); continue; }
        if (item.start < anchor.start) kept.push({ ...item, end: anchor.start, quote: item.quote.slice(0, anchor.start - item.start) });
        if (item.end > anchor.end) kept.push({ ...item, start: anchor.end, quote: item.quote.slice(anchor.end - item.start) });
      }
      if (core.MARK_COLORS.has(color)) kept.push({ ...anchor, color });
      result = kept;
    }
    return result.slice(-400);
  }

  function anchors(selection) {
    if (!selection?.rangeCount || selection.isCollapsed) return [];
    const selected = selection.getRangeAt(0);
    if (!root.contains(selected.commonAncestorContainer)) return [];
    const found = [];
    for (const block of blocks) {
      if (!selected.intersectsNode(block)) continue;
      const clipped = document.createRange();
      clipped.selectNodeContents(block);
      if (selected.compareBoundaryPoints(Range.START_TO_START, clipped) > 0) clipped.setStart(selected.startContainer, selected.startOffset);
      if (selected.compareBoundaryPoints(Range.END_TO_END, clipped) < 0) clipped.setEnd(selected.endContainer, selected.endOffset);
      if (clipped.collapsed) continue;
      const prefix = document.createRange();
      prefix.selectNodeContents(block);
      prefix.setEnd(clipped.startContainer, clipped.startOffset);
      const start = prefix.toString().length;
      const quote = clipped.toString();
      if (quote.trim()) found.push({ block: block.dataset.highlightBlock, start, end: start + quote.length, quote });
    }
    return found;
  }

  function apply(list) {
    for (const mark of root.querySelectorAll("mark[data-study-mark]")) mark.replaceWith(...mark.childNodes);
    root.normalize();
    for (const block of blocks) {
      const text = block.textContent;
      const matches = list.filter((item) => item.block === block.dataset.highlightBlock && text.slice(item.start, item.end) === item.quote)
        .sort((a, b) => b.start - a.start);
      for (const item of matches) {
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        const segments = [];
        let offset = 0;
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const end = offset + node.length;
          if (offset < item.end && end > item.start) segments.push({ node, start: Math.max(0, item.start - offset), end: Math.min(node.length, item.end - offset) });
          offset = end;
        }
        // Jedes Textstück einzeln einfassen, damit fette Wörter und Code erhalten bleiben.
        for (const segment of segments.reverse()) {
          const range = document.createRange();
          range.setStart(segment.node, segment.start);
          range.setEnd(segment.node, segment.end);
          const mark = document.createElement("mark");
          mark.dataset.studyMark = item.color;
          range.surroundContents(mark);
        }
      }
    }
  }

  function toast(text) {
    const region = document.querySelector("#toast-region");
    if (!region) return;
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = text;
    region.append(element);
    setTimeout(() => element.remove(), 3500);
  }

  // Werkzeugleiste oben in der Einheit, beim Lesen mitlaufend.
  const tools = document.createElement("div");
  tools.className = "lesson-reading-tools";
  tools.setAttribute("role", "toolbar");
  tools.setAttribute("aria-label", "Textmarker");
  tools.innerHTML = `<span class="reading-tools-icon" title="Textmarker: Text auswählen, dann Farbe wählen" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg></span>
    ${COLORS.map(([color, name]) => `<button class="marker-swatch" type="button" data-highlight-color="${color}" title="${name} markieren" aria-label="${name} markieren"><span></span></button>`).join("")}
    <button class="marker-swatch marker-erase" type="button" data-highlight-color="erase" title="Markierung entfernen" aria-label="Markierung im ausgewählten Text entfernen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg></button>`;
  root.prepend(tools);

  let selected = [];
  document.addEventListener("selectionchange", () => {
    const found = anchors(window.getSelection());
    if (found.length || !document.activeElement?.closest(".lesson-reading-tools")) selected = found;
  });
  // Ein Klick auf die Farbe darf die Auswahl nicht aufheben.
  tools.addEventListener("pointerdown", (event) => { if (event.target.closest("[data-highlight-color]")) event.preventDefault(); });
  tools.addEventListener("click", (event) => {
    const button = event.target.closest("[data-highlight-color]");
    if (!button) return;
    if (!selected.length) selected = anchors(window.getSelection());
    if (!selected.length) { toast("Wähle zuerst eine Textstelle in der Einheit aus."); return; }
    const state = readState();
    const profile = currentProfile(state);
    if (!profile) { toast("Lege zuerst ein Profil an, damit deine Markierungen gespeichert werden."); return; }
    const all = core.normalizeHighlights(profile.highlights);
    all[lesson.id] = update(all[lesson.id] || [], selected, button.dataset.highlightColor);
    if (!all[lesson.id].length) delete all[lesson.id];
    profile.highlights = all;
    profile.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      // Andere Skripte der Seite (Lernstand, Profil) lesen den neuen Stand ein.
      window.dispatchEvent(new StorageEvent("storage", { key: KEY, storageArea: localStorage }));
    } catch { toast("Markierung konnte nicht gespeichert werden."); return; }
    apply(all[lesson.id] || []);
    selected = [];
    window.getSelection()?.removeAllRanges();
  });

  apply(entries());
  // Profilwechsel oder Laden einer Datei in einem anderen Fenster.
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) apply(entries()); });
})();
