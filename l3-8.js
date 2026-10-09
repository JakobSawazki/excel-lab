(function () {
  "use strict";
  const masteryAnswers = { priority: "b", boundary: "c", lookup: "a" };
  const masteryHints = {
    priority: "Prüfe die Sonderregel zuerst. Wenn sie greift, ersetzt sie die gewöhnliche Umsatzregel.",
    boundary: "Unter bedeutet strikt kleiner. Prüfe die Grenze selbst und Werte auf beiden Seiten.",
    lookup: "Eindeutige Kundennummern brauchen eine exakte Suche. Bei Rabattstufen gelten aufsteigend sortierte Untergrenzen."
  };

  window.ExcelLabLesson.start({ id: "l3-8", answers: masteryAnswers, hints: masteryHints });
})();
