(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Abschnittsdauer und Abschnittsstrecke müssen beide ab Fahrtbeginn aufsummiert werden. XY-Punkte verbinden die passenden Gesamtsummen.",
    axis: "Beim idealisierten freien Fall aus Ruhe nimmt die Geschwindigkeit zu; der Weg hängt quadratisch von der Zeit ab. Ein hohes R² allein begründet kein Modell.",
    change: "950 km liegt weit außerhalb der erfassten Gesamtstrecke. Die Rechnung gilt nur unter zusätzlichen Annahmen über den weiteren Verlauf."
  };

  window.ExcelLabLesson.start({ id: "l4-8", answers: masteryAnswers, hints: masteryHints });

  const svgNS = "http://www.w3.org/2000/svg";
  const px = x => 70 + x / 8 * 460;
  const py = y => 310 - y / 70 * 280;
  const decimal = new Intl.NumberFormat("de-DE", {maximumFractionDigits:2});
  let demoModel = "linear";
  function svgElement(tag, attributes, text) {
    const el = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([key,value])=>el.setAttribute(key,String(value)));
    if(text !== undefined) el.textContent=text;
    return el;
  }
  [0,20,40,60,70].forEach(y=>{
    $("#l48-grid").append(svgElement("line",{x1:70,y1:py(y),x2:530,y2:py(y),class:"l48-grid-line"}));
    $("#l48-ticks").append(svgElement("text",{x:58,y:py(y)+6,"text-anchor":"end"},String(y)));
  });
  [0,1,2,3,4,6,8].forEach(x=>{
    $("#l48-ticks").append(svgElement("text",{x:px(x),y:338,"text-anchor":"middle"},String(x)));
  });
  [[1,1],[2,4],[3,9]].forEach(([x,y])=>{
    const circle=svgElement("circle",{cx:px(x),cy:py(y),r:5,class:"l48-point"});
    circle.append(svgElement("title",{},`Eingabepunkt (${x}, ${y})`));
    $("#l48-points").append(circle);
  });
  function modelValue(x) { return demoModel === "linear" ? 4*x-10/3 : x*x; }
  function curve(start,end) {
    const count=100;
    return Array.from({length:count+1},(_,i)=>{
      const x=start+(end-start)*i/count;
      return `${i?"L":"M"}${px(x)},${py(modelValue(x))}`;
    }).join(" ");
  }
  function renderDemo() {
    const x=Number($("#l48-predict-x").value), value=modelValue(x);
    const model=demoModel === "linear" ? "Lineares Modell" : "Quadratisches Modell";
    const range=x<=3 ? "innerhalb des beobachteten X-Bereichs" : "außerhalb des beobachteten X-Bereichs (Extrapolation)";
    $("#l48-x-output").textContent=String(x);
    $("#l48-predict-x").setAttribute("aria-valuetext",`X = ${x}, ${range}`);
    $("#l48-observed-model").setAttribute("d",curve(1,3));
    $("#l48-forecast-model").setAttribute("d",curve(3,8));
    $("#l48-prediction").setAttribute("cx",String(px(x)));
    $("#l48-prediction").setAttribute("cy",String(py(value)));
    $("#l48-prediction").setAttribute("data-value",String(value));
    const fit=demoModel === "linear" ? "R² ≈ 0,980" : "R² = 1";
    const message=`${model}: X = ${x}, Modellwert Y ≈ ${decimal.format(value)}; ${range}. ${fit} für die drei Eingabepunkte, keine Prognosegarantie.`;
    $("#l48-model-output").textContent=message;
    $("#l48-chart-description").textContent="Erfundene Eingabepunkte (1, 1), (2, 4), (3, 9). "+message;
    document.querySelectorAll("[data-l48-model]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.l48Model===demoModel)));
  }
  document.querySelectorAll("[data-l48-model]").forEach(button=>button.addEventListener("click",()=>{demoModel=button.dataset.l48Model;renderDemo();}));
  $("#l48-predict-x").addEventListener("input",renderDemo);
  $("#l48-demo-reset").addEventListener("click",()=>{demoModel="linear";$("#l48-predict-x").value="6";renderDemo();});
  renderDemo();
})();
