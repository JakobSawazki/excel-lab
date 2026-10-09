(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Gruppierte Säulen starten gemeinsam bei null und vergleichen Einzelwerte direkt. Die Summe gehört nicht als zusätzliche Reihe hinein.",
    axis: "Die Lage hängt von den Segmenten darunter ab. Vergleiche Segmenthöhen oder Tabellenwerte, nicht nur die obere Kante.",
    change: "100-%-Säulen normieren jede Kategorie auf ihr eigenes Ganzes. Gleiche Höhe beweist keine gleiche absolute Summe."
  };

  window.ExcelLabLesson.start({ id: "l4-5", answers: masteryAnswers, hints: masteryHints });

  function renderDemo() {
    const mode = document.querySelector('input[name="demo-mode"]:checked').value;
    const data = [[20,30],[40,60]], names = ["Hefte","Ordner"];
    const labels = {grouped:"Gruppiert",stacked:"Gestapelt",percent:"100 % gestapelt"};
    $("#l45-axis-title").textContent = mode === "percent" ? "Anteil (%)" : "Anzahl";
    $("#l45-axis").replaceChildren();
    [100,75,50,25,0].forEach(value => {
      const tick=document.createElement("span");
      tick.textContent=String(value)+(mode==="percent"?" %":"");
      $("#l45-axis").append(tick);
    });
    const plot=$("#l45-plot"); plot.replaceChildren(); plot.dataset.mode=mode;
    data.forEach((values,index)=>{
      const group=document.createElement("div"); group.className="l45-group";
      const bars=document.createElement("div"); bars.className="l45-bars";
      const total=values.reduce((sum,value)=>sum+value,0);
      const stack=document.createElement("div"); stack.className="l45-stack";
      if(mode!=="grouped"){stack.style.height=(mode==="percent"?100:total)+"%";bars.append(stack);}
      values.forEach((value,i)=>{
        const bar=document.createElement("div");bar.className="l45-bar l45-color-"+(i===0?"a":"b");
        // Grouped uses the common absolute axis; stacked heights are relative to that stack.
        bar.style.height=(mode==="grouped"?value:value/total*100)+"%";
        bar.dataset.value=String(value);bar.dataset.series=names[i];
        const series=document.createElement("span");series.textContent=i===0?"A":"B";
        const label=document.createElement("strong");label.textContent=String(mode==="percent"?value/total*100:value)+(mode==="percent"?" %":"");
        bar.append(series,label);(mode==="grouped"?bars:stack).append(bar);
      });
      const caption=document.createElement("strong");caption.className="l45-group-label";caption.textContent="Gruppe "+(index+1);
      group.append(bars,caption);plot.append(group);
    });
    $("#l45-chart").setAttribute("aria-label",labels[mode]+": "+data.map((values,i)=>"Gruppe "+(i+1)+", "+values.map((v,j)=>names[j]+" "+(mode==="percent"?v/(values[0]+values[1])*100+" Prozent":v+" Stück")).join(", ")+", absolute Summe "+(values[0]+values[1])+" Stück").join("; ")+".");
    $("#l45-demo-status").textContent = mode==="grouped"
      ? "Alle vier Einzelwerte starten bei null. Gruppe 2 bestellt von jedem Artikel doppelt so viel."
      : mode==="stacked"
      ? "Die Gesamthöhen zeigen 50 und 100 Stück. Das obere Segment startet erst über dem unteren; seine eigene Höhe zeigt die Ordnerzahl."
      : "Beide Gruppen haben 40 % Hefte und 60 % Ordner. Ihre absoluten Summen bleiben 50 und 100 Stück; im Diagramm sind sie nicht an der Gesamthöhe erkennbar.";
  }
  document.querySelectorAll('input[name="demo-mode"]').forEach(input=>input.addEventListener("change",renderDemo));
  renderDemo();
})();
