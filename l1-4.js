(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { shift: "b", dynamic: "c", sum: "a" };
  const masteryHints = {
    shift: "Von E2 nach E4 sind es zwei Zeilen nach unten. Relative Zeilennummern erhöhen sich daher um zwei; die Spalten bleiben gleich.",
    dynamic: "Eine fest eingetragene Zahl ist keine Formel. Prüfe die Bearbeitungsleiste und ändere testweise eine Eingabe.",
    sum: "Eine neue Position muss auch in der Summenformel enthalten sein. Prüfe den Bereich und beobachte die Summe bei einer Mengenänderung."
  };

  window.ExcelLabLesson.start({ id: "l1-4", answers: masteryAnswers, hints: masteryHints });

  const distance = $("#copy-distance");
  distance.disabled = false;
  distance.addEventListener("change", () => {
    const offset = Number(distance.value);
    const row = 2 + offset;
    $("#copy-target").textContent = `E${row}`;
    $("#copy-formula").textContent = `=C${row}*D${row}`;
    $("#copy-explanation").textContent = `${offset === 1 ? "Eine Zeile" : `${offset} Zeilen`} nach unten: Aus Zeile 2 wird Zeile ${row}. Die Spalten C und D bleiben gleich.`;
  });
})();
