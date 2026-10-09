(function () {
  "use strict";
  const masteryAnswers = { display: "b", units: "c", formula: "a" };
  const masteryHints = {
    display: "Ein Zahlenformat ändert die sichtbare Anzeige. Ohne besondere Genauigkeitseinstellung rechnet Excel weiterhin mit dem gespeicherten Wert.",
    units: "Trage nur die Zahl ein und ergänze die Einheit als benutzerdefiniertes Zahlenformat. So bleibt die Menge eine Zahl.",
    formula: "Eine neue Eingabe ersetzt den Zellinhalt und damit auch eine vorhandene Formel. Ein Währungsformat ändert dagegen nur die Anzeige."
  };

  window.ExcelLabLesson.start({ id: "l1-3", answers: masteryAnswers, hints: masteryHints });
})();
