(function () {
  "use strict";
  const masteryAnswers = { revenue: "b", time: "c", volume: "a", interest: "b", package: "c" };
  const masteryHints = {
    revenue: "Einnahmen entstehen aus Anzahl mal Einzelpreis. Bei gleichem Eintrittspreis verdoppeln doppelt so viele Besucher die zugehörigen Einnahmen.",
    time: "Die Bearbeitungszeit hängt von der Stückzahl ab. Die vorgegebene Einkaufszeit ist dagegen ein fester Anteil und wird nur einmal addiert.",
    volume: "Die Stückzahl ist Gesamtvolumen geteilt durch Volumen je Dose. Bei halbem Dosenvolumen brauchst du doppelt so viele Dosen.",
    interest: "Bei der Formel mit 36.000 im Nenner wird der Zinssatz als ganze Prozentzahl eingegeben. 10 bedeutet 10 Prozent; 0,10 wäre hier um den Faktor 100 zu klein.",
    package: "410 minus 300 ergibt 110 MB zusätzlich. Ein Paket reicht nicht; angebrochene 100-MB-Pakete werden ganz berechnet."
  };

  window.ExcelLabLesson.start({ id: "l1-6", answers: masteryAnswers, hints: masteryHints });
})();
