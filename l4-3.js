(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Zeitwerte gehören auf die X-Achse; Anmeldezahlen sind die Messreihe. Die zeitliche Reihenfolge bleibt erhalten.",
    axis: "Fehlend heißt unbekannt, nicht null. Kennzeichne die Lücke, statt eine Messung zu erfinden.",
    change: "Der beobachtete Verlauf beweist weder seine Ursache noch eine sichere Zukunftsentwicklung."
  };

  window.ExcelLabLesson.start({ id: "l4-3", answers: masteryAnswers, hints: masteryHints });

  const values = [24, 36, null, 48, 60];
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai"];
  const SVG_NS = "http://www.w3.org/2000/svg";
  function svgNode(name, attributes, text) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderChart() {
    const zero = document.querySelector('input[name="missing-value"]:checked').value === "zero";
    const grid = $("#l43-chart-grid"), line = $("#l43-chart-line"), points = $("#l43-chart-points");
    grid.replaceChildren(); line.replaceChildren(); points.replaceChildren();
    const x = index => 55 + index * 70, y = value => 242 - value / 60 * 180;
    for(let value=0;value<=60;value+=20) {
      grid.append(svgNode("line",{x1:55,x2:335,y1:y(value),y2:y(value),class:"l43-grid"}));
      grid.append(svgNode("text",{x:46,y:y(value)+5,"text-anchor":"end"},value));
    }
    grid.append(svgNode("line",{x1:55,x2:55,y1:62,y2:242,class:"l43-axis"}));
    let segment=[];
    function finish() {
      if(segment.length>1) line.append(svgNode("polyline",{points:segment.join(" "),class:"l43-line"}));
      segment=[];
    }
    values.forEach((original,i)=>{
      const value = original === null && zero ? 0 : original;
      points.append(svgNode("text",{x:x(i),y:268,"text-anchor":"middle"},months[i]));
      if(value === null) { finish(); return; }
      segment.push(x(i)+","+y(value));
      points.append(svgNode("circle",{cx:x(i),cy:y(value),r:5,class:original===null?"l43-point l43-false":"l43-point"}));
      points.append(svgNode("text",{x:x(i),y:y(value)-12,"text-anchor":"middle",class:"l43-value"},value));
    });
    finish();
    $("#l43-gap-status").textContent = zero
      ? "Falsche Darstellung: Der erfundene Nullwert erzeugt einen Einbruch im März. Dafür gibt es keine Messung."
      : "Für März fehlt die Messung. Die Linie bleibt dort unterbrochen; ein Einbruch auf null ist nicht belegt.";
    $("#l43-chart-description").textContent = "Januar 24, Februar 36, März unbekannt, April 48, Mai 60. " + $("#l43-gap-status").textContent;
    $("#l43-demo").classList.toggle("is-false",zero);
  }
  document.querySelectorAll('input[name="missing-value"]').forEach(input=>input.addEventListener("change",renderChart));
  renderChart();
})();
