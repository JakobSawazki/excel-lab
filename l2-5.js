(function () {
  "use strict";
  const masteryAnswers = { bus: "b", cheap: "a", salary: "c" };
  const masteryHints = {
    bus: "Vergleiche nur die drei Busanbieter für ein einziges Reiseziel. Die Entfernung in Zeile 4 ist kein Angebotspreis.",
    cheap: "Gesucht ist der kleinste Wert in der Schwabenpark-Spalte.",
    salary: "Gehälter stehen in Spalte G; D enthält Umsätze und F Provisionen."
  };

  window.ExcelLabLesson.start({ id: "l2-5", answers: masteryAnswers, hints: masteryHints, files: "both" });
})();
