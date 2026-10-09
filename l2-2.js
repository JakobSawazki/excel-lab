(function () {
  "use strict";
  const masteryAnswers = { row: "b", formula: "c", copy: "a" };
  const masteryHints = {
    row: "Zwei eingefügte Zeilen verschieben jede bisherige Datenzeile um zwei nach unten.",
    formula: "Der gemeinsame Wert muss fest bleiben, die Kurswerte müssen mitwandern.",
    copy: "Prüfe, welche Bezüge beim Kopieren in die nächste Zeile wandern und welcher Bezug auf B3 zeigt."
  };

  window.ExcelLabLesson.start({ id: "l2-2", answers: masteryAnswers, hints: masteryHints });
})();
