(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "X und Y müssen zum selben Land gehören: Einkommen auf X, Energieverbrauch auf Y. Die Ländernummer ist kein Messwert.",
    axis: "Bei unverändertem X verändert sich nur die senkrechte Punktlage. Ein geändertes Zahlenpaar kann auch das geschätzte Modell verändern.",
    change: "R² beschreibt die Modellpassung in diesen Daten, keine Ursache und keine sichere Prognose."
  };

  window.ExcelLabLesson.start({ id: "l4-6", answers: masteryAnswers, hints: masteryHints });

  function linearFit(points) {
    if(points.length<2) return null;
    const count=points.length;
    const meanX=points.reduce((sum,p)=>sum+p.x,0)/count, meanY=points.reduce((sum,p)=>sum+p.y,0)/count;
    const sxx=points.reduce((sum,p)=>sum+(p.x-meanX)**2,0);
    if(sxx===0) return null;
    const slope=points.reduce((sum,p)=>sum+(p.x-meanX)*(p.y-meanY),0)/sxx;
    const intercept=meanY-slope*meanX;
    const sst=points.reduce((sum,p)=>sum+(p.y-meanY)**2,0);
    const sse=points.reduce((sum,p)=>sum+(p.y-(slope*p.x+intercept))**2,0);
    return {slope,intercept,r2:sst===0?null:Math.max(0,Math.min(1,1-sse/sst))};
  }
  const svgNS="http://www.w3.org/2000/svg";
  const px=x=>70+x/12*460, py=y=>310-y/30*282;
  function svgElement(tag,attributes,text) {
    const el=document.createElementNS(svgNS,tag);
    Object.entries(attributes).forEach(([name,value])=>el.setAttribute(name,String(value)));
    if(text!==undefined)el.textContent=text;
    return el;
  }
  [0,10,20,30].forEach(y=>{
    $("#l46-grid").append(svgElement("line",{x1:70,y1:py(y),x2:530,y2:py(y),class:"l46-grid-line"}));
    $("#l46-ticks").append(svgElement("text",{x:58,y:py(y)+6,"text-anchor":"end"},String(y)));
  });
  [0,2,4,6,8,10,12].forEach(x=>{
    $("#l46-grid").append(svgElement("line",{x1:px(x),y1:28,x2:px(x),y2:310,class:"l46-grid-line"}));
    $("#l46-ticks").append(svgElement("text",{x:px(x),y:338,"text-anchor":"middle"},String(x)));
  });
  const decimal=new Intl.NumberFormat("de-DE",{minimumFractionDigits:3,maximumFractionDigits:3});
  function renderDemo() {
    const value=Number($("#l46-c-value").value);
    const points=[{name:"A",x:2,y:5},{name:"B",x:4,y:9},{name:"C",x:8,y:value},{name:"D",x:10,y:21}];
    const fit=linearFit(points),equation="ŷ = "+decimal.format(fit.slope)+" · x "+(fit.intercept<0?"− ":"+ ")+decimal.format(Math.abs(fit.intercept));
    $("#l46-c-output").textContent=String(value);
    $("#l46-c-value").setAttribute("aria-valuetext",value+" Aufgaben bei 8 Stunden");
    $("#l46-equation").textContent=equation;
    $("#l46-r2").textContent=fit.r2===null?"R² nicht definiert":"R² = "+decimal.format(fit.r2);
    const trend=$("#l46-trend");
    Object.entries({x1:px(2),y1:py(fit.slope*2+fit.intercept),x2:px(10),y2:py(fit.slope*10+fit.intercept)}).forEach(([name,value])=>trend.setAttribute(name,String(value)));
    const group=$("#l46-points");group.replaceChildren();
    points.forEach(p=>{
      const point=svgElement("circle",{cx:px(p.x),cy:py(p.y),r:6,class:"l46-point","data-case":p.name,"data-x":p.x,"data-y":p.y});
      point.append(svgElement("title",{},p.name+": "+p.x+" Stunden, "+p.y+" Aufgaben"));
      group.append(point,svgElement("text",{x:px(p.x)+10,y:py(p.y)-10,class:"l46-point-label"},p.name));
    });
    $("#l46-demo-table").tBodies[0].rows[2].cells[2].textContent=String(value);
    $("#l46-chart-description").textContent="Vier frei erfundene Übungsfälle: "+points.map(p=>p.name+" ("+p.x+" Stunden, "+p.y+" Aufgaben)").join("; ")+". "+equation+". R² "+decimal.format(fit.r2)+". Gerade nur zwischen 2 und 10 Stunden dargestellt.";
    $("#l46-demo-status").textContent=value===17
      ? "In diesem erfundenen Ausgangsbeispiel liegen alle vier Punkte auf einer Geraden: R² ist 1. Auch das beweist keine Ursache."
      : "Nur Fall C hat einen geänderten Y-Wert; seine X-Position bleibt bei 8 Stunden. Die Gerade passt nicht mehr exakt. R² beschreibt die Passung, keinen ursächlichen Lerneffekt.";
  }
  $("#l46-c-value").addEventListener("input",renderDemo);
  $("#l46-demo-reset").addEventListener("click",()=>{$("#l46-c-value").value="17";renderDemo();});
  renderDemo();
})();
