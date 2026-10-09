(function () {
  "use strict";
  const masteryAnswers = { weights: "b", round: "c", sheet: "a" };
  const masteryHints = {
    weights: "Die Gewichte 2 und 1 ergeben zusammen 3. Der schriftliche Durchschnitt zählt zweimal, die mündliche Note einmal.",
    round: "Ein Zahlenformat ändert nur die Anzeige. RUNDEN erzeugt einen neuen gerundeten Rechenwert; verwende für weitere Schritte bewusst den passenden Wert.",
    sheet: "Die Suchmatrix braucht den Blattnamen und feste Bezüge. FALSCH fordert einen genauen Treffer, auch wenn die Schlüssel unsortiert sind."
  };

  window.ExcelLabLesson.start({ id: "l3-6", answers: masteryAnswers, hints: masteryHints });
})();
