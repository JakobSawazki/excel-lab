(function () {
  "use strict";
  const header = document.querySelector(".lesson-page-header .header-actions");
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  // Dateiformat, Bereinigung und „Zuletzt gespeichert“ kommen aus save-core.js (gemeinsam mit der Startseite).
  const core = window.ExcelLabSave;
  if (!header || !Array.isArray(lessons) || !core || document.querySelector("#save-button")) return;
  const KEY = "excelLab.state.v1", SAVES = core.SAVES_KEY;
  const nagold = window.EXCEL_LAB_NAGOLD;
  const mark = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h11.2L20 7.8V20H5V4Z"/><path d="M8.5 4v4.8h6.5V4"/><path d="M8.5 20v-6h7v6"/></svg>';
  const button = document.createElement("button");
  button.id = "save-button"; button.type = "button"; button.className = "icon-button save-button";
  button.title = "Speichern und Laden";
  button.setAttribute("aria-label", "Speicherstand: speichern und laden");
  button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-controls", "save-dialog");
  button.innerHTML = mark;
  header.querySelector("#lesson-theme-toggle")?.after(button);
  if (!button.isConnected) header.prepend(button);
  const dialog = document.createElement("dialog");
  dialog.id = "save-dialog"; dialog.className = "dialog save-dialog";
  dialog.setAttribute("aria-labelledby", "save-dialog-title");
  dialog.innerHTML = `<div class="dialog-content">
    <button class="dialog-close" type="button" aria-label="Dialog schließen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg></button>
    <span class="save-dialog-mark" aria-hidden="true">${mark}</span><p class="eyebrow">Speicherdatei</p><h2 id="save-dialog-title">Speicherstand</h2>
    <p class="save-dialog-intro">Speichere deinen Stand als Datei in deinem Ordner. Mit „Laden“ holst du ihn zurück, auch an einem anderen PC.</p>
    <p class="save-dialog-status" id="save-status"></p>
    <div class="manager-actions save-actions"><span class="tip-wrap"><button class="button button-primary" type="button" id="export-button" aria-describedby="export-tip" aria-keyshortcuts="Alt+S">Speichern</button><span class="tip" role="tooltip" id="export-tip">Legt eine Datei mit Datum und Kürzel im Download-Ordner ab. Schneller: Alt+S</span></span><span class="tip-wrap"><button class="button button-secondary" type="button" id="import-button" aria-describedby="import-tip">Laden</button><span class="tip" role="tooltip" id="import-tip">Übernimmt eine früher gespeicherte Datei in diesen Browser.</span></span></div>
    <div class="recent-saves" id="recent-saves-box"><label for="recent-saves">Zuletzt gespeichert</label><div class="recent-saves-row"><select id="recent-saves"></select><button class="button button-secondary" type="button" id="recent-load">Diesen Stand laden</button></div></div>
    <p id="save-feedback" role="status" aria-live="polite" hidden></p><input id="import-file" type="file" accept="application/json,.json" hidden>
  </div>`;
  document.body.append(dialog);
  const $ = selector => dialog.querySelector(selector);
  function message(text) { $("#save-feedback").hidden = !text; $("#save-feedback").textContent = text; }
  function readState() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {version:1,theme:document.documentElement.dataset.theme || "dark",currentProfileId:null,profiles:[]};
    let state; try { state = JSON.parse(raw); } catch { throw new Error("Der Lernstand ist nicht lesbar. Öffne die Startseite, um ihn zu sichern oder wiederherzustellen."); }
    if (state?.version !== 1 || !Array.isArray(state.profiles)) throw new Error("Der vorhandene Lernstand kann hier nicht überschrieben werden. Bitte öffne die Startseite.");
    return state;
  }
  const current = state => state.profiles.find(profile => profile?.id === state.currentProfileId);
  const savedList = () => core.recentSaves();
  function render() {
    try {
      const profile=current(readState()); $("#export-button").disabled=!profile;
      $("#save-status").textContent=profile?`${profile.name} · ${profile.className || "ohne Klasse"} · ${core.xp(profile)} XP · ${nagold?.total(profile)||0} NAGOLD · ${lessons.filter(lesson=>profile.progress?.[lesson.id]?.completed).length}/${lessons.length} erledigt`:"Noch kein Lernprofil in diesem Browser. Du kannst eine gespeicherte Datei laden.";
    } catch(error) { $("#export-button").disabled=true; message(error.message); }
    const list=savedList(); $("#recent-saves").replaceChildren();
    list.forEach((item,index)=>{
      const option=document.createElement("option"); option.value=String(index);
      option.textContent=core.describeSave(item);
      $("#recent-saves").append(option);
    });
    $("#recent-saves-box").hidden=!list.length;
  }
  function exportProgress() {
    try {
      const profile=current(readState()); if(!profile) return;
      const appVersion=new URL(document.querySelector('script[src*="lesson-save.js"]').src).searchParams.get("v") || "unbekannt";
      core.download(profile,appVersion);
      render(); message("Speicherdatei zum Download bereitgestellt.");
    } catch(error) { message(error.message||"Die Speicherdatei konnte nicht erstellt werden."); }
  }
  function applyPayload(payload) {
    const state=readState();
    if(core.mergeImport(state,payload,(question)=>window.confirm(question))==="cancelled") { message("Laden abgebrochen. Dein Lernstand ist unverändert."); return; }
    // Only announce success after the persistent write actually succeeded.
    localStorage.setItem(KEY,JSON.stringify(state));
    window.dispatchEvent(new StorageEvent("storage",{key:KEY,storageArea:localStorage}));
    window.dispatchEvent(new Event("excel-lab-progress-change"));
    render(); message("Lernstand erfolgreich geladen.");
  }
  async function importFile(file) {
    if(!file) return;
    try {
      if(file.size>1000000) throw new Error("Datei ist zu groß.");
      const text=await file.text(); if(text.length>1000000) throw new Error("Datei ist zu groß.");
      applyPayload(JSON.parse(text));
    } catch(error) {message(error.message||"Die Speicherdatei konnte nicht geladen werden.");}
    finally {$("#import-file").value="";}
  }
  async function pickFile() {
    if(typeof window.showOpenFilePicker!=="function") {$("#import-file").click();return;}
    try {
      const [handle]=await window.showOpenFilePicker({startIn:"downloads",multiple:false,excludeAcceptAllOption:true,types:[{description:"Excel-Lab Speicherdatei",accept:{"application/json":[".json"]}}]});
      if(handle) await importFile(await handle.getFile());
    } catch(error) {if(error.name!=="AbortError") $("#import-file").click();}
  }
  button.addEventListener("click",()=>{message("");render();dialog.showModal();});
  $(".dialog-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",event=>{if(event.target===dialog) dialog.close();});
  $("#export-button").addEventListener("click",exportProgress);
  // Alt+S speichert sofort wie „Speichern“ (Wunsch Jakob, 16.10.2026); ohne Profil öffnet sich das Fenster.
  document.addEventListener("keydown",event=>{
    if(!core.isSaveShortcut(event)) return;
    event.preventDefault();
    if(!current(readState())) { button.click(); return; }
    exportProgress();
    if(!dialog.open) core.notify("Gespeichert: Die Datei liegt im Download-Ordner.");
  });
  $("#import-button").addEventListener("click",pickFile);
  $("#import-file").addEventListener("change",event=>importFile(event.target.files?.[0]));
  $("#recent-load").addEventListener("click",()=>{try {const item=savedList()[Number($("#recent-saves").value)];if(item) applyPayload(item.payload);} catch(error){message(error.message||"Der Speicherstand konnte nicht geladen werden.");}});
  window.addEventListener("storage",event=>{if(dialog.open&&(event.key===KEY||event.key===SAVES||event.key===null)) render();});
  window.addEventListener("excel-lab-progress-change",()=>{if(dialog.open) render();});
})();
