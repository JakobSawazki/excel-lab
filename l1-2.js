(function () {
  "use strict";
  const masteryAnswers = { refs: "b", recalc: "c", circle: "a" };
  const masteryHints = {
    refs: "Zellbezüge verwenden die aktuellen Werte der genannten Zellen. Fest eingetippte Zahlen ändern sich nicht mit der Tabelle.",
    recalc: "D2 multipliziert weiterhin B2 mit C2: Rechne 2,50 € mal 8. Die Formel selbst bleibt unverändert.",
    circle: "D2 darf nicht seine eigene Ergebniszelle als Eingabe verwenden. Preis und Menge stehen in B2 und C2."
  };

  window.ExcelLabLesson.start({ id: "l1-2", answers: masteryAnswers, hints: masteryHints });
})();
