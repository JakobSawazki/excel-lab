(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l4-6";
  const $ = (s) => document.querySelector(s);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "X und Y müssen zum selben Land gehören: Einkommen auf X, Energieverbrauch auf Y. Die Ländernummer ist kein Messwert.",
    axis: "Bei unverändertem X verändert sich nur die senkrechte Punktlage. Ein geändertes Zahlenpaar kann auch das geschätzte Modell verändern.",
    change: "R² beschreibt die Modellpassung in diesen Daten, keine Ursache und keine sichere Prognose."
  };
  let state, profile;
  function refresh() {
    const oldId = profile?.id;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((p) => p.id === state.currentProfileId) : null;
    if (oldId !== profile?.id) {
      $("#l46-mastery-form").reset();
      document.querySelectorAll("#l46-mastery-form .mastery-question").forEach(el => {
        delete el.dataset.result; el.querySelector(".mastery-feedback").textContent = "";
      });
    }
  }
  function unlocked() { return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l4-5"]?.completed); }
  function progress() {
    const p = profile?.progress?.[ID];
    return { completed: Boolean(p?.completed), teacherChecked: Boolean(p?.teacherChecked), masteryPassed: Boolean(p?.masteryPassed || p?.completed), checks: checks.map((_, i) => Boolean(p?.checks?.[i])) };
  }
  function toast(message) {
    const el = document.createElement("div"); el.className = "toast"; el.textContent = message;
    $("#toast-region").append(el); setTimeout(() => el.remove(), 4500);
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch { toast("Speichern im Browser nicht möglich. Prüfe die Browsereinstellungen, bevor du weiterarbeitest."); refresh(); return false; }
  }
  function save(next) {
    if (window.EXCEL_LAB_DEV?.enabled || !profile) return false;
    profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
    // The existing overview treats a completed L4.7 as unlocked even without L4.6.
    // Revoke that completion too, retaining its checks and all other lesson data.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l4-7"]) {
      profile.progress["l4-7"].completed = false;
    }
    profile.progress[ID] = next; profile.updatedAt = new Date().toISOString();
    return persist();
  }
  function render() {
    const open = unlocked(), p = progress();
    const count = p.checks.filter(Boolean).length + Number(p.teacherChecked) + Number(p.masteryPassed);
    const percent = open ? p.completed ? 100 : Math.round(count / (checks.length + 3) * 100) : 0;
    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").content = state?.theme === "light" ? "#f4f7f4" : "#0b1422";
    $("#l46-content").hidden = !open; $("#l46-access").hidden = open;
    $("#l46-access-message").textContent = profile ? "Schließe L4.5 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen." : "Lege auf der Startseite dein Lernprofil an und schließe L4.5 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : p.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && p.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((el, i) => { el.checked = p.checks[i]; el.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#page-teacher-check").checked = p.teacherChecked; $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l46-mastery-form").querySelectorAll("input, button").forEach(el => { el.disabled = !open || p.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#l46-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach(el => { el.hidden = p.masteryPassed; });
    const status = $("#l46-mastery-status");
    status.classList.toggle("is-passed", p.masteryPassed);
    if (p.masteryPassed) status.textContent = "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft.";
    else status.textContent = "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";
    const button = $("#page-complete-button"); button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = p.completed ? "✓ L4.6 wieder öffnen" : "L4.6 abschließen";
    button.classList.toggle("button-primary", !p.completed); button.classList.toggle("button-secondary", p.completed);
    $("#page-completion-note").textContent = p.completed ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L4.7 erneut gesperrt; ein dortiger Abschluss wird ebenfalls zurückgenommen." : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link"), ready = open && (p.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready); next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }
  $("#l46-mastery-form").addEventListener("submit", event => {
    event.preventDefault();
    const oldProfileId = profile?.id;
    refresh();
    if (!unlocked() || !profile || oldProfileId !== profile.id || progress().masteryPassed || window.EXCEL_LAB_DEV?.enabled) { render(); return; }
    let allCorrect = true;
    for (const [name, answer] of Object.entries(masteryAnswers)) {
      const question = document.querySelector(`[data-mastery-question="${name}"]`);
      const selected = question.querySelector("input:checked")?.value;
      const correct = selected === answer;
      question.dataset.result = correct ? "correct" : "incorrect";
      question.querySelector(".mastery-feedback").textContent = correct ? "Richtig." : selected ? masteryHints[name] : "Wähle eine Antwort.";
      allCorrect = allCorrect && correct;
    }
    if (!allCorrect) {
      $("#l46-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
      document.querySelector('.mastery-question[data-result="incorrect"]')?.scrollIntoView({ block: "nearest" });
      return;
    }
    const next = progress(); next.masteryPassed = true;
    if (save(next)) { render(); toast("Verständnis-Check bestanden. Zeige nun die Excel-Datei der Lehrkraft."); }
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-page-check], #page-teacher-check")) return;
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id;
    refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (event.target.id === "page-teacher-check") next.teacherChecked = event.target.checked;
    else next.checks[Number(event.target.dataset.pageCheck)] = event.target.checked;
    const revoked = next.completed && (!next.teacherChecked || !next.checks.every(Boolean));
    if (revoked) next.completed = false;
    const saved = save(next); render();
    if (saved && revoked) toast("Abschluss zurückgenommen. L4.7 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id; refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l46-mastery-section").open = true;
      $("#l46-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next); render();
    if (saved) toast(next.completed ? "L4.6 abgeschlossen: 100 Punkte. L4.7 ist freigeschaltet." : "L4.6 ist wieder offen. L4.7 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) { event.preventDefault(); render(); toast("Schließe zuerst L4.6 ab."); }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh(); state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light"; persist(); render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });

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
  refresh(); render();
})();
