(function () {
  "use strict";
  const KEY = "excelLab.state.v1";
  const ID = "l4-5";
  const $ = (s) => document.querySelector(s);
  const checks = Array.from(document.querySelectorAll("[data-page-check]"));
  const masteryAnswers = { source: "b", axis: "c", change: "a" };
  const masteryHints = {
    source: "Gruppierte Säulen starten gemeinsam bei null und vergleichen Einzelwerte direkt. Die Summe gehört nicht als zusätzliche Reihe hinein.",
    axis: "Die Lage hängt von den Segmenten darunter ab. Vergleiche Segmenthöhen oder Tabellenwerte, nicht nur die obere Kante.",
    change: "100-%-Säulen normieren jede Kategorie auf ihr eigenes Ganzes. Gleiche Höhe beweist keine gleiche absolute Summe."
  };
  let state, profile;
  function refresh() {
    const oldId = profile?.id;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
    profile = Array.isArray(state?.profiles) ? state.profiles.find((p) => p.id === state.currentProfileId) : null;
    if (oldId !== profile?.id) {
      $("#l45-mastery-form").reset();
      document.querySelectorAll("#l45-mastery-form .mastery-question").forEach(el => {
        delete el.dataset.result; el.querySelector(".mastery-feedback").textContent = "";
      });
    }
  }
  function unlocked() { return Boolean(window.EXCEL_LAB_DEV?.enabled) || Boolean(profile?.progress?.["l4-4"]?.completed); }
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
    // The existing overview treats a completed L4.6 as unlocked even without L4.5.
    // Revoke that completion too, retaining its checks and all other lesson data.
    if (!next.completed && profile.progress[ID]?.completed && profile.progress["l4-6"]) {
      profile.progress["l4-6"].completed = false;
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
    $("#l45-content").hidden = !open; $("#l45-access").hidden = open;
    $("#l45-access-message").textContent = profile ? "Schließe L4.4 mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen." : "Lege auf der Startseite dein Lernprofil an und schließe L4.4 ab.";
    $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
    $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    $("#lesson-score-ring").style.setProperty("--progress", percent);
    $("#lesson-page-percent").textContent = `${percent}%`;
    $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : p.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
    $("#lesson-points-status").textContent = open && p.completed ? "100 von 100 Punkten" : "0 von 100 Punkten";
    checks.forEach((el, i) => { el.checked = p.checks[i]; el.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#page-teacher-check").checked = p.teacherChecked; $("#page-teacher-check").disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    $("#l45-mastery-form").querySelectorAll("input, button").forEach(el => { el.disabled = !open || p.masteryPassed || Boolean(window.EXCEL_LAB_DEV?.enabled); });
    $("#l45-mastery-form").querySelectorAll(".mastery-question, button[type='submit']").forEach(el => { el.hidden = p.masteryPassed; });
    const status = $("#l45-mastery-status");
    status.classList.toggle("is-passed", p.masteryPassed);
    if (p.masteryPassed) status.textContent = "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft.";
    else status.textContent = "Noch nicht bestanden. Für den Abschluss müssen alle drei Antworten stimmen.";
    const button = $("#page-complete-button"); button.disabled = !open || Boolean(window.EXCEL_LAB_DEV?.enabled);
    button.textContent = p.completed ? "✓ L4.5 wieder öffnen" : "L4.5 abschließen";
    button.classList.toggle("button-primary", !p.completed); button.classList.toggle("button-secondary", p.completed);
    $("#page-completion-note").textContent = p.completed ? "100 Punkte wurden gutgeschrieben. Beim Wiederöffnen wird L4.6 erneut gesperrt; ein dortiger Abschluss wird ebenfalls zurückgenommen." : "Verständnis-Check, alle drei eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt 100 Punkte gut.";
    const next = $("#next-lesson-link"), ready = open && (p.completed || window.EXCEL_LAB_DEV?.enabled);
    next.classList.toggle("is-disabled", !ready); next.setAttribute("aria-disabled", String(!ready));
    next.tabIndex = ready ? 0 : -1;
  }
  $("#l45-mastery-form").addEventListener("submit", event => {
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
      $("#l45-mastery-status").textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
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
    if (saved && revoked) toast("Abschluss zurückgenommen. L4.6 ist wieder gesperrt.");
  });
  $("#page-complete-button").addEventListener("click", () => {
    if (window.EXCEL_LAB_DEV?.enabled) return;
    const oldProfileId = profile?.id; refresh();
    if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
    const next = progress();
    if (!next.completed && !next.masteryPassed) {
      $("#l45-mastery-section").open = true;
      $("#l45-mastery-section").scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Bestehe zuerst den Verständnis-Check."); return;
    }
    if (!next.completed && !next.checks.every(Boolean)) { toast("Hake zuerst alle drei eigenen Arbeitsschritte ab."); return; }
    if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
    next.completed = !next.completed;
    const saved = save(next); render();
    if (saved) toast(next.completed ? "L4.5 abgeschlossen: 100 Punkte. L4.6 ist freigeschaltet." : "L4.5 ist wieder offen. L4.6 ist wieder gesperrt.");
  });
  $("#next-lesson-link").addEventListener("click", (event) => {
    refresh(); if (!window.EXCEL_LAB_DEV?.enabled && (!unlocked() || !progress().completed)) { event.preventDefault(); render(); toast("Schließe zuerst L4.5 ab."); }
  });
  $("#lesson-theme-toggle").addEventListener("click", () => {
    refresh(); state = state || { version: 1, theme: "dark", currentProfileId: null, profiles: [] };
    state.theme = state.theme === "light" ? "dark" : "light"; persist(); render();
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
  window.addEventListener("pageshow", () => { refresh(); render(); });
  window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });

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
  refresh(); render();
})();
