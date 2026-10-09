(function () {
  "use strict";
  const masteryAnswers = { parts: "b", boundary: "b", copy: "c" };
  const masteryHints = {
    parts: "Die Funktion hat nach der Bedingung zwei mögliche Ergebnisse. Der dritte Teil gilt, wenn die Bedingung falsch ist.",
    boundary: "Berechne zuerst 2018 minus 2000. Vergleiche das Ergebnis streng mit 18; die Vorlage nutzt nur Jahreszahlen.",
    copy: "Das Reisejahr gilt für alle Personen. Nur das Geburtsjahr soll zur nächsten Zeile wandern."
  };

  window.ExcelLabLesson.start({ id: "l3-1", answers: masteryAnswers, hints: masteryHints });
})();
