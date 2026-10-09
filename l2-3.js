(function () {
  "use strict";
  const masteryAnswers = { column: "b", copy: "b", name: "c" };
  const masteryHints = {
    column: "Das Dollarzeichen muss vor dem Teil stehen, der beim Kopieren fest bleibt.",
    copy: "Prüfe getrennt: Was passiert beim Schritt nach rechts mit der Spalte und beim Schritt nach unten mit der Zeile?",
    name: "Ein definierter Name verweist auf eine Zelle. Ein fester Betrag in der Formel oder ein beweglicher B3-Bezug leistet das nicht."
  };

  window.ExcelLabLesson.start({ id: "l2-3", answers: masteryAnswers, hints: masteryHints, files: "both" });
})();
