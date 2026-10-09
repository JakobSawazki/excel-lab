(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Die Summe ist keine weitere Aktion. Wähle die vier Kategorien mit ihren Werten.",
    axis: "Nur mit einer Nullbasis entsprechen die Säulenhöhen den Mengenverhältnissen.",
    change: "Ein verknüpftes Diagramm übernimmt den geänderten Wert aus seiner Datenquelle."
  };

  window.ExcelLabLesson.start({ id: "l4-1", answers: masteryAnswers, hints: masteryHints });

  const SVG_NS = "http://www.w3.org/2000/svg";
  function svgElement(name, attributes, text) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderChart() {
    const minimum = Number(document.querySelector('input[name="axis-start"]:checked').value);
    const top = 50, bottom = 242, left = 53, right = 345;
    const y = value => bottom - (value - minimum) / (100 - minimum) * (bottom - top);
    const grid = $("#l41-chart-grid"), bars = $("#l41-chart-bars");
    grid.replaceChildren(); bars.replaceChildren();
    for (let value = minimum; value <= 100; value += 20) {
      grid.append(svgElement("line", { x1: left, x2: right, y1: y(value), y2: y(value), class: "l41-grid-line" }));
      grid.append(svgElement("text", { x: left - 9, y: y(value) + 4, "text-anchor": "end" }, String(value)));
    }
    grid.append(svgElement("line", { x1: left, x2: left, y1: top, y2: bottom, class: "l41-axis-line" }));
    [45, 60, 75, 90].forEach((value, i) => {
      const x = 69 + i * 70;
      bars.append(svgElement("rect", { x, y: y(value), width: 36, height: bottom - y(value), class: "l41-bar" }));
      bars.append(svgElement("text", { x: x + 18, y: y(value) - 8, "text-anchor": "middle", class: "l41-value" }, String(value)));
      bars.append(svgElement("text", { x: x + 18, y: bottom + 22, "text-anchor": "middle" }, "ABCD"[i]));
    });
    $("#l41-chart-description").textContent = "Vier Gruppen: A 45, B 60, C 75, D 90. Die Größenachse beginnt bei " + minimum + ".";
    $("#l41-axis-status").textContent = minimum === 0
      ? "Die Achse beginnt bei 0. D hat doppelt so viele Anmeldungen wie A und die doppelte Säulenhöhe."
      : "Die Achse beginnt bei 40. D wirkt zehnmal so hoch wie A, obwohl die Anzahl nur doppelt so groß ist.";
    $("#l41-demo").classList.toggle("is-truncated", minimum !== 0);
  }
  document.querySelectorAll('input[name="axis-start"]').forEach(input => input.addEventListener("change", renderChart));
  renderChart();
})();
