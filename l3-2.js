(function () {
  "use strict";
  const masteryAnswers = { year: "c", boundary: "a", prices: "b" };
  const masteryHints = {
    year: "Ein Zahlenformat verändert die Darstellung. JAHR liest den Jahresbestandteil des Datums aus und liefert eine Zahl.",
    boundary: "Die erste Prüfung gilt bis einschließlich 12. Erst wenn sie falsch ist, wird die nächste Altersgrenze geprüft.",
    prices: "Der Preis soll sich beim Ändern der Preistabelle aktualisieren. Die gemeinsame Preiszelle muss beim Kopieren fest bleiben."
  };

  window.ExcelLabLesson.start({ id: "l3-2", answers: masteryAnswers, hints: masteryHints });
})();
