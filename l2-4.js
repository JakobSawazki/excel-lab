(function () {
  "use strict";
  const masteryAnswers = { range: "b", average: "c", copy: "b" };
  const masteryHints = {
    range: "Prüfe, ob der Bereich alle sechs Kurszeilen enthält.",
    average: "Achte auf die richtige Spalte und den Unterschied zwischen Summe und Durchschnitt.",
    copy: "Beim Kopieren um eine Spalte wandert ein relativer C-Bezug genau nach D."
  };

  window.ExcelLabLesson.start({ id: "l2-4", answers: masteryAnswers, hints: masteryHints });
})();
