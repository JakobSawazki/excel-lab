(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l4-8";
  const $ = (s) => document.querySelector(s);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Abschnittsdauer und Abschnittsstrecke müssen beide ab Fahrtbeginn aufsummiert werden. XY-Punkte verbinden die passenden Gesamtsummen.",
    axis: "Beim idealisierten freien Fall aus Ruhe nimmt die Geschwindigkeit zu; der Weg hängt quadratisch von der Zeit ab. Ein hohes R² allein begründet kein Modell.",
    change: "950 km liegt weit außerhalb der erfassten Gesamtstrecke. Die Rechnung gilt nur unter zusätzlichen Annahmen über den weiteren Verlauf."
  };
  let state, profile;
  function refresh() {
    const oldId = profile?.id;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((p) => p.id === state.currentProfileId) : null;
    if (oldId !== profile?.id) {
      $("#l48-mastery-form").reset();
      document.querySelectorAll("#l48-mastery-form .mastery-question").forEach(el => {
        delete el.dataset.result; el.querySelector(".mastery-feedback").textContent = "";
      });
    }
  }
  function unlocked() { return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l4-7"]?.completed); }
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
    profile.progress[ID] = next; profile.updatedAt = new Date().toISOString();
    return persist();
  }
  function render() {
    const open = unlocked(), p = progress();
    const count = p.checks.filter(Boolean).length + Number(p.teacherChecked) + Number(p.masteryPassed);
    const percent = open ? p.completed ? 100 : Math.round(count / (checks.length + 3) * 100) : 0;
    document.documentElement.dataset.theme = state?.theme === "light" ? "light" : "dark";
    $("meta[name='theme-color']").content = state?.theme === "light" ? "#f4f7f4" : "#0b1422";
    $("#l48-content").hidden = !open; $("#l48-access").hidden = open;
    $("#l48-access-message").textContent = profile ? "Schließe L4.7 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen." : "Lege auf der Startseite dein Lernprofil an und schließe L4.7 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : p.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && p.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((el, i) => { el.checked = p.checks[i]; el.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#page-teacher-check").checked = p.teacherChecked; $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l48-mastery-form").querySelectorAll("input, button").forEach(el => { el.disabled = !open || p.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#l48-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach(el => { el.hidden = p.masteryPassed; });
    const status = $("#l48-mastery-status");
    status.classList.toggle("is-passed", p.masteryPassed);
    if (p.masteryPassed) status.textContent = "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft.";
    else status.textContent = "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";
    const button = $("#page-complete-button"); button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = p.completed ? "✓ L4.8 wieder öffnen" : "L4.8 abschließen";
    button.classList.toggle("button-primary", !p.completed); button.classList.toggle("button-secondary", p.completed);
    $("#page-completion-note").textContent = p.completed ? "100 Punkte wurden gutgeschrieben. Du hast die letzte Einheit bearbeitet. Sichere deinen Lernstand über das Profilmenü." : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link"), ready = open && (p.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready); next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }
  $("#l48-mastery-form").addEventListener("submit", event => {
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
      $("#l48-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
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
    if (saved && revoked) toast("Abschluss zurückgenommen. Deine übrigen Einheiten bleiben unverändert.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id; refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l48-mastery-section").open = true;
      $("#l48-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next); render();
    if (saved) toast(next.completed ? "L4.8 abgeschlossen: 100 Punkte. Sichere nun deinen Lernstand." : "L4.8 ist wieder offen.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) { event.preventDefault(); render(); toast("Schließe zuerst L4.8 ab."); }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh(); state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light"; persist(); render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });

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
  refresh(); render();
})();
