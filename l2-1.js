(function () {
  "use strict";
  const masteryAnswers = { copy: "b", basis: "b", test: "c" };
  const masteryHints = {
    copy: "Beim Kopieren um eine Zeile nach unten wandern die relativen Zeilenbezüge mit.",
    basis: "Gesucht ist der Verdienst der Betreuungsperson: Vergütung je Stunde mal geleistete Stunden.",
    test: "Eine Änderung der Stunden in nur einer Kurszeile sollte nur den Verdienst dieser Zeile beeinflussen."
  };

  window.ExcelLabLesson.start({ id: "l2-1", answers: masteryAnswers, hints: masteryHints });
})();
