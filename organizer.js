(function () {
  "use strict";
  const root = document.querySelector(".home-organizer");
  const content = window.EXCEL_LAB_CONTENT;
  if (!root || !content) return;
  const topics = {
    1: { level: "Einstieg", outcome: "eine eigene Tabelle planen, mit Zelladressen rechnen und sie verständlich gestalten.", example: "Eine Getränkeliste fürs Schulfest", code: "Menge × Einzelpreis = Gesamtpreis" },
    2: { level: "Aufbau", outcome: "Formeln sicher kopieren, gemeinsame Werte festhalten und ganze Datenbereiche auswerten.", example: "Busangebote für die Klassenfahrt vergleichen", code: "=MIN(B2:D2)" },
    3: { level: "Vertiefung", outcome: "Regeln in Formeln übersetzen, passende Einträge zählen und Werte in Listen nachschlagen.", example: "Tarifgruppen einer Skiausfahrt zuordnen", code: "Bedingung → Dann-Wert / Sonst-Wert" },
    4: { level: "Auswertung", outcome: "einen passenden Diagrammtyp auswählen und Entwicklungen verständlich darstellen.", example: "Die Umsatzentwicklung sichtbar machen", code: "Tabelle → Diagramm → Aussage" }
  };
  const buttons = Array.from(root.querySelectorAll("[data-organizer-stage]"));
  let selected;
  function showTopic(id) {
    const stage = content.stages.find((item) => String(item.id) === String(id));
    const topic = topics[id];
    if (!stage || !topic || selected === id) return;
    selected = id;
    buttons.forEach((button) => {
      const active = button.dataset.organizerStage === String(id);
      button.classList.toggle("is-selected", active);
    });
    const fields = {
      "organizer-stage-code": stage.code,
      "organizer-stage-count": `${content.lessons.filter((lesson) => lesson.stage === stage.id).length} Einheiten · ${topic.level}`,
      "organizer-stage-title": stage.title,
      "organizer-stage-description": stage.description,
      "organizer-stage-outcome": topic.outcome,
      "organizer-example-title": topic.example,
      "organizer-example-code": topic.code
    };
    for (const [elementId, text] of Object.entries(fields)) root.querySelector(`#${elementId}`).textContent = text;
    root.style.setProperty("--organizer-accent", `var(--${["green", "blue", "violet", "amber"][stage.id - 1]})`);
  }
  buttons.forEach((button) => {
    button.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") showTopic(button.dataset.organizerStage); });
    button.addEventListener("focus", () => showTopic(button.dataset.organizerStage));
    button.addEventListener("click", () => showTopic(button.dataset.organizerStage));
  });
  showTopic("1");
})();
