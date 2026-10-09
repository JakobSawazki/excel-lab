(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Sortiere Namen und Zahlen gemeinsam. Die Summe ist keine weitere Kategorie.",
    axis: "Im Balkendiagramm liegt die Größenachse waagerecht. Die Nullbasis erhält die Mengenverhältnisse.",
    change: "Gleiche Anmeldezahlen müssen gleich lange Balken ergeben; ihre Reihenfolge macht niemanden allein zum Spitzenreiter."
  };

  window.ExcelLabLesson.start({ id: "l4-2", answers: masteryAnswers, hints: masteryHints });

  const exampleData = [
    ["Roboter und Technik", 36], ["Fotografie und Gestaltung", 60],
    ["Theater und Improvisation", 24], ["Umwelt und Nachhaltigkeit", 48]
  ];
  function renderChart() {
    const rank = document.querySelector('input[name="chart-order"]:checked').value === "rank";
    const rows = rank ? [...exampleData].sort((a, b) => b[1] - a[1]) : exampleData;
    const bars = $("#l42-chart-bars"), table = $("#l42-demo-data");
    bars.replaceChildren(); table.replaceChildren();
    rows.forEach(([label, value]) => {
      const row = document.createElement("div"); row.className = "l42-chart-row";
      const name = document.createElement("span"); name.className = "l42-category"; name.textContent = label;
      const track = document.createElement("span"); track.className = "l42-bar-track";
      const bar = document.createElement("span"); bar.className = "l42-bar"; bar.style.width = value / 60 * 100 + "%";
      const number = document.createElement("span"); number.className = "l42-value"; number.textContent = value;
      track.append(bar); row.append(name, track, number); bars.append(row);
      const tr = document.createElement("tr");
      [label, value].forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.append(td); });
      table.append(tr);
    });
    $("#l42-chart-description").textContent = "Von oben nach unten: " + rows.map(([name,value]) => name + ": " + value).join("; ") + ". Die Balkenlängen verwenden dieselbe Skala ab null.";
    $("#l42-order-status").textContent = rank
      ? "Die größte Anzahl steht oben. Namen und Zahlen wurden gemeinsam umgeordnet; die Werte und Balkenlängen bleiben unverändert."
      : "Die Ausgangsreihenfolge bleibt erhalten. Die größte Anzahl steht an zweiter Stelle.";
  }
  document.querySelectorAll('input[name="chart-order"]').forEach(input => input.addEventListener("change", renderChart));
  renderChart();
})();
