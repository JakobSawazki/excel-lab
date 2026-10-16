(function () {
  "use strict";

  // NAGOLD-Tabelle (wie in WorkbenchLab) als gemeinsames Fenster für Startseite
  // und Lernseiten: Datum, Uhrzeit, Wofür (ein Feld mit Vorschlagsliste) und
  // Punkte. Ein Entwurf wird bearbeitet; erst „Speichern“ übergibt ihn an die
  // Seite, Schließen verwirft ihn. Wer speichert, entscheidet die Seite über
  // `save(entries)`; das Modul selbst schreibt nichts in den Speicher.
  const nagold = window.EXCEL_LAB_NAGOLD;
  if (!nagold) return;

  const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const ICONS = {
    close: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg>',
    add: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4"/></svg>',
    remove: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    chevron: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg>'
  };
  const RULE_ERROR = "Bitte für jede Zeile einen Anlass und ganze NAGOLD von −5 bis 5 eintragen. 0 gilt nicht als Eintrag.";
  const SAVE_ERROR = "Speichern nicht möglich. Das Profil hat sich geändert oder der Speicher ist gesperrt.";

  const dialog = document.createElement("dialog");
  dialog.className = "dialog nagold-dialog";
  dialog.id = "nagold-dialog";
  dialog.setAttribute("aria-labelledby", "nagold-title");
  dialog.innerHTML = `<form id="nagold-form" class="dialog-content" novalidate>
      <button class="dialog-close" type="button" data-close-dialog aria-label="NAGOLD-Tabelle schließen">${ICONS.close}</button>
      <p class="eyebrow">Deine gesammelten Punkte</p>
      <h2 id="nagold-title">NAGOLD</h2>
      <p class="nagold-intro">Jede abgeschlossene Lerneinheit bringt automatisch 5 NAGOLD. Weitere Einträge kommen dazu; verbindlich ist die Bewertung deiner Lehrkraft.</p>
      <div class="nagold-table-wrap">
        <table class="nagold-table">
          <caption class="sr-only">Deine NAGOLD-Einträge</caption>
          <thead><tr><th scope="col">Datum</th><th scope="col">Uhrzeit</th><th scope="col">Wofür</th><th scope="col">NAGOLD</th><th scope="col"><span class="sr-only">Aktionen</span></th></tr></thead>
          <tbody id="nagold-rows"></tbody>
        </table>
      </div>
      <div class="nagold-table-footer">
        <button class="nagold-icon-button" id="nagold-add-button" type="button" title="Zeile hinzufügen" aria-label="NAGOLD-Zeile hinzufügen">${ICONS.add}</button>
        <output id="nagold-sum" aria-live="polite"></output>
      </div>
      <p class="nagold-error" id="nagold-error" role="status" aria-live="polite"></p>
      <button class="button button-primary button-full" id="nagold-save-button" type="submit">Speichern</button>
    </form>`;
  // Das Fenster besteht von Anfang an, damit Verweise wie aria-controls ins Leere gehen.
  document.body.append(dialog);

  const $ = (selector) => dialog.querySelector(selector);
  const rows = $("#nagold-rows");
  let draft = [];
  let editing = new Set();
  let session = null;

  function updateSum() {
    $("#nagold-sum").textContent = `${nagold.normalizeEntries(draft).reduce((sum, row) => sum + row.points, 0)} NAGOLD gesamt`;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
  }

  function render() {
    const presets = nagold.presetOptions();
    rows.innerHTML = draft.map((row, index) => {
      const isEditing = editing.has(index);
      const label = `Zeile ${index + 1}`;
      return `<tr data-nagold-index="${index}" class="${isEditing ? "is-editing" : ""}">
        <td data-label="Datum">${isEditing ? `<input type="date" data-nagold-field="date" aria-label="Datum, ${label}" value="${escapeHtml(row.date)}" ${row.allowUnknownDate ? "" : "required"}>` : escapeHtml(row.date ? formatDate(row.date) : "Nicht erfasst")}</td>
        <td data-label="Uhrzeit">${isEditing ? `<input type="time" data-nagold-field="time" aria-label="Uhrzeit, ${label}" value="${escapeHtml(row.time)}" ${row.allowUnknownTime ? "" : "required"} step="60">` : escapeHtml(row.time || "Nicht erfasst")}</td>
        <td data-label="Wofür">${isEditing ? `<div class="nagold-combo"><input type="text" data-nagold-field="purpose" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="nagold-list-${index}" aria-label="Wofür, ${label}" value="${escapeHtml(row.purpose)}" maxlength="160" placeholder="Auswählen oder eintippen" autocomplete="off" required><button class="nagold-combo-toggle" type="button" data-nagold-combo-toggle tabindex="-1" aria-label="Vorschläge anzeigen, ${label}">${ICONS.chevron}</button><ul class="nagold-combo-list" id="nagold-list-${index}" role="listbox" aria-label="Vorschläge, ${label}" hidden>${presets.map((preset, option) => `<li role="option" id="nagold-option-${index}-${option}" data-nagold-option="${escapeHtml(preset)}" aria-selected="false">${escapeHtml(preset)}</li>`).join("")}</ul></div>` : escapeHtml(row.purpose)}</td>
        <td data-label="NAGOLD" class="nagold-points">${isEditing ? `<input type="number" data-nagold-field="points" aria-label="NAGOLD, ${label}" min="${nagold.minPoints}" max="${nagold.maxPoints}" step="1" value="${Number.isFinite(row.points) ? row.points : ""}" inputmode="numeric" required>` : row.points}</td>
        <td class="nagold-row-actions"><button class="nagold-icon-button" type="button" data-nagold-edit="${index}" title="Eintrag bearbeiten" aria-label="${label} bearbeiten" ${isEditing ? "disabled" : ""}>${ICONS.edit}</button><button class="nagold-icon-button" type="button" data-nagold-remove="${index}" title="Zeile löschen" aria-label="${label} löschen">${ICONS.remove}</button></td>
      </tr>`;
    }).join("");
    $("#nagold-add-button").disabled = draft.filter((row) => !row.lessonId).length >= nagold.maxManualEntries || draft.length >= nagold.maxEntries;
    updateSum();
  }

  function addRow() {
    if (draft.filter((row) => !row.lessonId).length >= nagold.maxManualEntries || draft.length >= nagold.maxEntries) return;
    const now = new Date();
    draft.push({ date: nagold.today(now), time: nagold.clock(now), purpose: "", points: 0 });
    editing.add(draft.length - 1);
    render();
    rows.querySelector('tr:last-child [data-nagold-field="purpose"]').focus();
  }

  function editRow(index) {
    if (!draft[index] || editing.has(index)) return;
    editing.add(index);
    render();
    rows.querySelector(`[data-nagold-index="${index}"] [data-nagold-field="purpose"]`).focus();
  }

  function readInput(event) {
    const field = event.target.closest("[data-nagold-field]");
    if (!field) return;
    const row = draft[Number(field.closest("[data-nagold-index]").dataset.nagoldIndex)];
    row[field.dataset.nagoldField] = field.dataset.nagoldField === "points" ? field.valueAsNumber : field.value;
    $("#nagold-error").textContent = "";
    updateSum();
  }

  // Auswahlliste im Feld „Wofür“ (wie in WorkbenchLab): eigene Liste statt der
  // Browser-Liste. Tippen filtert, Pfeiltasten wählen, Enter übernimmt, Esc
  // schließt nur die Liste.
  const combo = {
    parts(element) {
      const box = element?.closest?.(".nagold-combo");
      return box ? { box, input: box.querySelector("input"), list: box.querySelector("ul") } : null;
    },
    options(list) { return [...list.querySelectorAll("[data-nagold-option]")].filter((option) => !option.hidden); },
    filter(input, list, all) {
      const needle = all ? "" : input.value.trim().toLocaleLowerCase("de-DE");
      list.querySelectorAll("[data-nagold-option]").forEach((option) => {
        option.hidden = Boolean(needle) && !option.dataset.nagoldOption.toLocaleLowerCase("de-DE").includes(needle);
        option.setAttribute("aria-selected", "false");
      });
      input.removeAttribute("aria-activedescendant");
    },
    open(parts, all) {
      dialog.querySelectorAll(".nagold-combo.is-open").forEach((other) => { if (other !== parts.box) this.close(this.parts(other)); });
      this.filter(parts.input, parts.list, all);
      if (!this.options(parts.list).length) { this.close(parts); return; }
      // Maßgeblich ist der Platz im Fenster der Tabelle, nicht im Browserfenster: sonst schneidet der Dialog die Liste ab.
      const rect = parts.input.getBoundingClientRect();
      const frame = dialog.getBoundingClientRect();
      const below = frame.bottom - rect.bottom;
      const above = rect.top - frame.top;
      const upward = below < 180 && above > below;
      parts.list.style.maxHeight = `${Math.max(120, Math.min(280, (upward ? above : below) - 16))}px`;
      parts.box.classList.toggle("opens-upward", upward);
      parts.list.hidden = false;
      // Erst sichtbar machen, dann die Klasse setzen: so läuft der Übergang.
      void parts.list.offsetHeight;
      parts.box.classList.add("is-open");
      parts.input.setAttribute("aria-expanded", "true");
    },
    close(parts) {
      if (!parts || parts.list.hidden) return;
      parts.box.classList.remove("is-open");
      parts.input.setAttribute("aria-expanded", "false");
      parts.input.removeAttribute("aria-activedescendant");
      const list = parts.list;
      const hide = () => { if (!parts.box.classList.contains("is-open")) list.hidden = true; };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) hide();
      else window.setTimeout(hide, 170);
    },
    move(parts, step) {
      const options = this.options(parts.list);
      if (!options.length) return;
      const current = options.findIndex((option) => option.getAttribute("aria-selected") === "true");
      const next = options[(current + step + options.length) % options.length] || options[0];
      options.forEach((option) => option.setAttribute("aria-selected", String(option === next)));
      parts.input.setAttribute("aria-activedescendant", next.id);
      next.scrollIntoView({ block: "nearest" });
    },
    choose(parts, option) {
      parts.input.value = option.dataset.nagoldOption;
      parts.input.dispatchEvent(new Event("input", { bubbles: true }));
      this.close(parts);
      parts.input.focus();
    }
  };

  rows.addEventListener("pointerdown", (event) => {
    const option = event.target.closest("[data-nagold-option]");
    const toggle = event.target.closest("[data-nagold-combo-toggle]");
    if (!option && !toggle) return;
    // Der Fokus bleibt im Feld; sonst schlösse das Verlassen des Feldes die Liste vor der Auswahl.
    event.preventDefault();
    const parts = combo.parts(event.target);
    if (option) combo.choose(parts, option);
    else if (parts.box.classList.contains("is-open")) combo.close(parts);
    else { parts.input.focus(); combo.open(parts, true); }
  });
  rows.addEventListener("input", (event) => {
    readInput(event);
    if (event.target.matches(".nagold-combo input") && event.isTrusted) combo.open(combo.parts(event.target), false);
  });
  rows.addEventListener("change", readInput);
  rows.addEventListener("keydown", (event) => {
    if (!event.target.matches(".nagold-combo input")) return;
    const parts = combo.parts(event.target);
    const isOpen = parts.box.classList.contains("is-open");
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) combo.open(parts, true);
      combo.move(parts, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Enter" && isOpen) {
      const active = parts.list.querySelector('[aria-selected="true"]');
      if (active) { event.preventDefault(); combo.choose(parts, active); }
    } else if (event.key === "Escape" && isOpen) {
      // Nur die Liste schließen, nicht das ganze Fenster.
      event.preventDefault();
      event.stopPropagation();
      combo.close(parts);
    }
  });
  rows.addEventListener("focusout", (event) => {
    if (event.target.matches(".nagold-combo input")) combo.close(combo.parts(event.target));
  });
  dialog.addEventListener("scroll", () => dialog.querySelectorAll(".nagold-combo.is-open").forEach((box) => combo.close(combo.parts(box))), true);

  rows.addEventListener("dblclick", (event) => {
    if (event.target.closest("button, input, select")) return;
    const row = event.target.closest("[data-nagold-index]");
    if (row) editRow(Number(row.dataset.nagoldIndex));
  });
  rows.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-nagold-edit]");
    if (edit) editRow(Number(edit.dataset.nagoldEdit));
    const remove = event.target.closest("[data-nagold-remove]");
    if (!remove) return;
    const index = Number(remove.dataset.nagoldRemove);
    draft.splice(index, 1);
    editing = new Set([...editing].filter((value) => value !== index).map((value) => (value > index ? value - 1 : value)));
    render();
    (rows.querySelector(`[data-nagold-remove="${Math.min(index, draft.length - 1)}"]`) || $("#nagold-add-button")).focus();
  });
  $("#nagold-add-button").addEventListener("click", addRow);
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  $("#nagold-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const entries = nagold.normalizeEntries(draft);
    if (entries.length !== draft.length) { $("#nagold-error").textContent = RULE_ERROR; return; }
    if (!session || session.save(entries) === false) { $("#nagold-error").textContent = SAVE_ERROR; return; }
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    const focusTarget = session?.returnFocus;
    draft = [];
    editing.clear();
    session = null;
    rows.replaceChildren();
    if (focusTarget?.isConnected && focusTarget.closest("dialog")?.open) focusTarget.focus();
  });

  // entries: die bereinigten Zeilen des Profils; save(entries) gibt false zurück,
  // wenn die Seite nicht speichern konnte; returnFocus: Knopf, der danach den Fokus erhält.
  function open({ entries, save, returnFocus }) {
    session = { save, returnFocus };
    draft = nagold.normalizeEntries(entries).map((row) => ({ ...row, allowUnknownDate: !row.date, allowUnknownTime: !row.time }));
    editing = new Set();
    $("#nagold-error").textContent = "";
    render();
    if (!dialog.open) dialog.showModal();
    if (!draft.length) addRow();
  }

  window.ExcelLabNagoldTable = Object.freeze({ open, dialog });
})();
