(function () {
  "use strict";
  const header = document.querySelector(".lesson-page-header .header-actions");
  const lessons = window.EXCEL_LAB_CONTENT?.lessons;
  if (!header || !Array.isArray(lessons) || document.querySelector("#save-button")) return;
  const KEY = "excelLab.state.v1", SAVES = "excelLab.saves.v1", DEVICE = "excelLab.device.v1";
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
    <p class="save-dialog-intro">Dein Lernstand liegt nur in diesem Browser. Sichere ihn als Datei in deinen persönlichen Ordner und lade ihn an einem anderen Gerät wieder.</p>
    <p class="save-dialog-status" id="save-status"></p>
    <div class="manager-actions save-actions"><span class="tip-wrap"><button class="button button-primary" type="button" id="export-button" aria-describedby="export-tip">Speichern</button><span class="tip" role="tooltip" id="export-tip">Legt eine Datei mit Datum und Kürzel im Download-Ordner ab.</span></span><span class="tip-wrap"><button class="button button-secondary" type="button" id="import-button" aria-describedby="import-tip">Laden</button><span class="tip" role="tooltip" id="import-tip">Übernimmt eine früher gespeicherte Datei in diesen Browser.</span></span></div>
    <div class="recent-saves" id="recent-saves-box"><label for="recent-saves">Zuletzt gespeichert</label><div class="recent-saves-row"><select id="recent-saves" aria-describedby="recent-saves-hint"></select><button class="button button-secondary" type="button" id="recent-load">Diesen Stand laden</button></div><small id="recent-saves-hint">Die letzten fünf gespeicherten Stände bleiben zusätzlich in diesem Browser. Für ein anderes Gerät brauchst du die Datei.</small></div>
    <p id="save-feedback" role="status" aria-live="polite" hidden></p><input id="import-file" type="file" accept="application/json,.json" hidden>
  </div>`;
  document.body.append(dialog);
  const $ = selector => dialog.querySelector(selector);
  const id = () => window.crypto?.randomUUID?.() || `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  function message(text) { $("#save-feedback").hidden = !text; $("#save-feedback").textContent = text; }
  function readState() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {version:1,theme:document.documentElement.dataset.theme || "dark",currentProfileId:null,profiles:[]};
    let state; try { state = JSON.parse(raw); } catch { throw new Error("Der Lernstand ist nicht lesbar. Öffne die Startseite, um ihn zu sichern oder wiederherzustellen."); }
    if (state?.version !== 1 || !Array.isArray(state.profiles)) throw new Error("Der vorhandene Lernstand kann hier nicht überschrieben werden. Bitte öffne die Startseite.");
    return state;
  }
  const current = state => state.profiles.find(profile => profile?.id === state.currentProfileId);
  function points(profile) {
    return lessons.reduce((sum,lesson) => sum + (profile.progress?.[lesson.id]?.completed ? 100 : 0)
      + (window.EXCEL_LAB_BONUS?.tasks?.[lesson.id] && profile.progress?.[lesson.id]?.bonus ? window.EXCEL_LAB_BONUS.xp : 0)
      + (window.EXCEL_LAB_BONUS?.extra?.[lesson.id] && profile.progress?.[lesson.id]?.bonus2 ? window.EXCEL_LAB_BONUS.xp : 0),0);
  }
  function savedList() {
    try { const list=JSON.parse(localStorage.getItem(SAVES)||"[]"); return Array.isArray(list)?list.filter(item=>item?.payload?.app==="Excel-Lab"&&item.payload.version===1&&item.payload.profile&&typeof item.savedAt==="string").slice(0,5):[]; }
    catch { return []; }
  }
  function render() {
    try {
      const profile=current(readState()); $("#export-button").disabled=!profile;
      $("#save-status").textContent=profile?`${profile.name} · ${profile.className || "ohne Klasse"} · ${points(profile)} XP · ${nagold?.total(profile)||0} NAGOLD · ${lessons.filter(lesson=>profile.progress?.[lesson.id]?.completed).length}/${lessons.length} erledigt`:"Noch kein Lernprofil in diesem Browser. Du kannst eine gespeicherte Datei laden.";
    } catch(error) { $("#export-button").disabled=true; message(error.message); }
    const list=savedList(); $("#recent-saves").replaceChildren();
    list.forEach((item,index)=>{
      const option=document.createElement("option"); option.value=String(index);
      const date=new Date(item.savedAt), by=item.payload.exportedBy||{};
      const dateText=Number.isNaN(date.getTime())?"Zeit unbekannt":new Intl.DateTimeFormat("de-DE",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Berlin"}).format(date);
      option.textContent=`${dateText} · ${String(by.accountName||item.payload.profile.name||"").slice(0,40)} · ${Number(by.points)||0} XP · ${Number(by.nagold)||0} NAGOLD`;
      $("#recent-saves").append(option);
    });
    $("#recent-saves-box").hidden=!list.length;
  }
  function deviceId() {
    try { const saved=JSON.parse(localStorage.getItem(DEVICE)||"null"); if(typeof saved?.id==="string"&&saved.id) return saved.id.slice(0,24); } catch { /* Generate a local anonymous identity, not a hardware identifier. */ }
    const value="XL-"+id().replace(/[^a-z0-9]/gi,"").slice(0,10).toUpperCase();
    try { localStorage.setItem(DEVICE,JSON.stringify({id:value})); } catch { /* Download still works without persisting the identity. */ }
    return value;
  }
  function exportProgress() {
    try {
      const profile=current(readState()); if(!profile) return;
      const device=deviceId();
      const appVersion=new URL(document.querySelector('script[src*="lesson-save.js"]').src).searchParams.get("v") || "0.23.0";
      const payload={app:"Excel-Lab",version:1,appVersion,exportedAt:new Date().toISOString(),exportedBy:{accountName:profile.name,className:profile.className,points:points(profile),nagold:nagold?.total(profile)||0},device:{id:device,type:"anonyme Browser-Installation",operatingSystem:/win/i.test(navigator.platform||"")?"Windows":"nicht erkannt"},profile};
      const parts=new Intl.DateTimeFormat("en",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(payload.exportedAt));
      const part=type=>parts.find(item=>item.type===type).value;
      const safe=value=>String(value).replace(/[^a-z0-9äöüß._-]+/gi,"-").replace(/^-+|-+$/g,"")||"lernprofil";
      const filename=`${part("year")}-${part("month")}-${part("day")}_Excel-Lab_${safe(profile.name)}_${safe(device)}.json`;
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
      const anchor=document.createElement("a"); anchor.href=url; anchor.download=filename; document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      try { localStorage.setItem(SAVES,JSON.stringify([{savedAt:payload.exportedAt,fileName:filename,payload},...savedList()].slice(0,5))); } catch { /* The downloaded file does not depend on the local history. */ }
      render(); message("Speicherdatei zum Download bereitgestellt.");
    } catch(error) { message(error.message||"Die Speicherdatei konnte nicht erstellt werden."); }
  }
  function normalizeProfile(profile) {
    const progress={};
    for(const lesson of lessons) {
      const row=profile.progress?.[lesson.id]; if(!row||typeof row!=="object") continue;
      progress[lesson.id]={completed:Boolean(row.completed),teacherChecked:Boolean(row.teacherChecked),masteryPassed:Boolean(row.masteryPassed||row.completed),bonus:Boolean(row.bonus),bonus2:Boolean(row.bonus2),checks:lesson.checks.map((_,index)=>Boolean(Array.isArray(row.checks)&&row.checks[index]))};
    }
    return {id:id(),name:typeof profile.name==="string"?profile.name.trim().toLocaleLowerCase("de").slice(0,40)||"lernprofil":"lernprofil",className:typeof profile.className==="string"?profile.className.trim().toLocaleUpperCase("de").slice(0,32):"",createdAt:typeof profile.createdAt==="string"?profile.createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),progress,nagoldEntries:nagold?nagold.entriesFor(profile):[]};
  }
  function applyPayload(payload) {
    if(payload?.app!=="Excel-Lab"||payload.version!==1||!payload.profile||typeof payload.profile!=="object"||Array.isArray(payload.profile)) throw new Error("Keine gültige Excel-Lab-Exportdatei.");
    const state=readState(), imported=normalizeProfile(payload.profile);
    const existing=state.profiles.find(profile=>profile.name===imported.name&&profile.className===imported.className);
    if(existing) {
      const count=profile=>lessons.filter(lesson=>profile.progress?.[lesson.id]?.completed).length;
      if(count(imported)<count(existing)&&!window.confirm(`Die Datei enthält weniger abgeschlossene Einheiten (${count(imported)}) als dein Stand in diesem Browser (${count(existing)}). Trotzdem laden?`)) { message("Laden abgebrochen. Dein Lernstand ist unverändert."); return; }
      imported.id=existing.id; imported.createdAt=existing.createdAt;
      state.profiles[state.profiles.indexOf(existing)]=imported;
    } else state.profiles.push(imported);
    state.currentProfileId=imported.id;
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
  $("#import-button").addEventListener("click",pickFile);
  $("#import-file").addEventListener("change",event=>importFile(event.target.files?.[0]));
  $("#recent-load").addEventListener("click",()=>{try {const item=savedList()[Number($("#recent-saves").value)];if(item) applyPayload(item.payload);} catch(error){message(error.message||"Der Speicherstand konnte nicht geladen werden.");}});
  window.addEventListener("storage",event=>{if(dialog.open&&(event.key===KEY||event.key===SAVES||event.key===null)) render();});
  window.addEventListener("excel-lab-progress-change",()=>{if(dialog.open) render();});
})();
