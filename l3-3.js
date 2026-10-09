(function () {
  "use strict";
  const masteryAnswers = { count: "b", pairs: "c", copy: "a" };
  const masteryHints = {
    count: "ZÄHLENWENN zählt passende Zellen. SUMMEWENN addiert die zugehörigen Zahlen aus dem Summenbereich.",
    pairs: "Die Tarifgruppe einer Person und ihr Kartenpreis müssen sich auf dieselbe Zeile beziehen. Gleich große Bereiche allein reichen nicht.",
    copy: "Die Teilnehmerbereiche bleiben fest. Nur die Kriterienzelle soll zur nächsten Tarifgruppe wandern."
  };

  window.ExcelLabLesson.start({ id: "l3-3", answers: masteryAnswers, hints: masteryHints });
})();
