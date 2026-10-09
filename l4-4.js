(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Das Budget besteht aus Aktionskosten. Teilnehmerzahlen beantworten eine andere Frage; die Summe darf kein zusätzliches Segment sein.",
    axis: "Der Anteil verwendet die Gesamtsumme als Nenner. Ändert sich diese, ändern sich auch die Anteile unveränderter Beträge.",
    change: "Die Segmente brauchen dieselbe Einheit, dürfen sich nicht überschneiden und müssen nichtnegativ sein. Das Ganze muss positiv sein."
  };

  window.ExcelLabLesson.start({ id: "l4-4", answers: masteryAnswers, hints: masteryHints });

  const money = new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"});
  const percent = new Intl.NumberFormat("de-DE",{style:"percent",minimumFractionDigits:1,maximumFractionDigits:1});
  function renderPie() {
    const material = Number($("#l44-material").value);
    const values = [100,150,material], names = ["Bücher","Werkzeug","Material"], total = values.reduce((a,b)=>a+b,0);
    const shares = values.map(value=>value/total);
    $("#l44-material-value").textContent = money.format(material);
    $("#l44-material").setAttribute("aria-valuetext",money.format(material));
    $("#l44-total").textContent = money.format(total);
    $("#l44-pie").style.setProperty("--first-end",shares[0]*100+"%");
    $("#l44-pie").style.setProperty("--second-end",(shares[0]+shares[1])*100+"%");
    $("#l44-pie").setAttribute("aria-label","Projektbudget: "+names.map((name,i)=>name+" "+money.format(values[i])+", "+percent.format(shares[i])).join("; ")+". Gesamt "+money.format(total)+".");
    const table = $("#l44-demo-data"); table.replaceChildren();
    names.forEach((name,i)=>{
      const row = document.createElement("tr");
      const label = document.createElement("td");
      const dot = document.createElement("span"); dot.className = "l44-swatch l44-color-"+i; dot.setAttribute("aria-hidden","true");
      label.append(dot,document.createTextNode(name));
      row.append(label);
      [money.format(values[i]),percent.format(shares[i])].forEach(text=>{const cell=document.createElement("td");cell.textContent=text;row.append(cell);});
      table.append(row);
    });
    $("#l44-demo-status").textContent = material===0
      ? "Material hat 0 Euro und keinen sichtbaren Sektor. Bücher und Werkzeug teilen sich das positive Gesamtbudget."
      : "Bücher bleiben bei 100 Euro, Werkzeug bei 150 Euro. Ihre Prozentanteile beziehen sich nun auf "+money.format(total)+".";
  }
  $("#l44-material").addEventListener("input",renderPie);
  $("#l44-demo-reset").addEventListener("click",()=>{$("#l44-material").value="250";renderPie();});
  renderPie();
})();
