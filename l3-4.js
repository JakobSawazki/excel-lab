(function () {
  "use strict";
  const masteryAnswers = { rule: "b", range: "c", value: "a" };
  const masteryHints = {
    rule: "Eine bedingte Formatierungsregel prüft den Zellwert erneut. Eine manuelle Füllfarbe passt sich nicht automatisch an.",
    range: "Nur die Spielzeilen gehören zur Bewertung: Zeile 5 bis 17. Die Überschrift und die Gewinnzellen bleiben außerhalb.",
    value: "Zellwert gleich 1 trifft nur den gewünschten Zahlenwert. Größer oder gleich 0 würde auch 0 und 3 erfassen."
  };

  window.ExcelLabLesson.start({ id: "l3-4", answers: masteryAnswers, hints: masteryHints });
})();
