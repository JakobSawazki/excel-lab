(function () {
  "use strict";
  const masteryAnswers = { structure: "b", numbers: "c", save: "a" };
  const masteryHints = {
    structure: "Eine Zeile beschreibt einen Artikel. Jede Spalte enthält genau eine Eigenschaft; Überschriften erklären sie.",
    numbers: "Menge und Preis müssen als Zahlen in getrennten Zellen stehen, damit Excel damit rechnen kann.",
    save: "Der Lernstand im Browser und deine Excel-Arbeitsmappe sind zwei getrennte Dateien. Speichere die Arbeitsmappe selbst in Excel."
  };

  window.ExcelLabLesson.start({ id: "l1-1", answers: masteryAnswers, hints: masteryHints });
})();
