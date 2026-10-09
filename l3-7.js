(function () {
  "use strict";
  const masteryAnswers = { target: "b", variable: "c", restore: "a" };
  const masteryHints = {
    target: "Die Zielzelle muss eine Formel enthalten, die von der veränderbaren Eingabe abhängt. Der gewünschte Betrag kommt ins Feld Zielwert.",
    variable: "Ein Durchlauf verändert genau eine Eingabe. Andere Eingaben und die Formeln bleiben erhalten.",
    restore: "Für einen unabhängigen zweiten Versuch brauchst du wieder den ursprünglichen Zinssatz. Sonst löst du eine andere Aufgabe."
  };

  window.ExcelLabLesson.start({ id: "l3-7", answers: masteryAnswers, hints: masteryHints });
})();
