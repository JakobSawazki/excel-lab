(function () {
  "use strict";
  const masteryAnswers = { matrix: "b", mode: "c", error: "a" };
  const masteryHints = {
    matrix: "Der Index zählt ab der ersten Spalte der Matrix. In D:E ist D die erste und E die zweite Spalte.",
    mode: "FALSCH fordert einen genauen Treffer. WAHR oder ein weggelassenes viertes Argument verwendet eine ungefähre Suche.",
    error: "ISTNV prüft nur #NV. Andere Fehler wie #BEZUG! müssen weiterhin korrigiert werden."
  };

  window.ExcelLabLesson.start({ id: "l3-5", answers: masteryAnswers, hints: masteryHints });
})();
