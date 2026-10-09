(function () {
  "use strict";
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Ein Quartalsgesamtwert fasst die fünf Filialen dieses Quartals zusammen. Detailwerte und ihre Summe sind nicht sechs unabhängige Umsätze.",
    axis: "Umsatz pro Kunde teilt den Umsatz desselben Standorts durch seine Kundenanzahl. Kundenanteil und Umsatzanteil sind verschiedene Größen.",
    change: "Quartale haben eine Reihenfolge. Eine Linie betont die Entwicklung einer Filiale; Anteile am Jahresganzen beantworten eine andere Frage."
  };

  window.ExcelLabLesson.start({ id: "l4-7", answers: masteryAnswers, hints: masteryHints });
})();
