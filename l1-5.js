(function () {
  "use strict";
  const masteryAnswers = { structure: "b", central: "c", phone: "a" };
  const masteryHints = {
    structure: "Eine Zeile enthält den vollständigen Datensatz einer Person. In den Spalten stehen die einzelnen Merkmale mit klaren Überschriften.",
    central: "Der gemeinsame Wert wird einmal eingegeben und über feste Bezüge verwendet. So genügt eine Änderung an der zentralen Eingabezelle.",
    phone: "Telefonnummern sind Kennzeichen, keine Rechenwerte. Text vor der Eingabe bewahrt führende Nullen; nachträgliches Formatieren stellt verlorene Nullen nicht wieder her."
  };

  window.ExcelLabLesson.start({ id: "l1-5", answers: masteryAnswers, hints: masteryHints });
})();
