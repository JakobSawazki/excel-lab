(function () {
  "use strict";

  // Gemeinsamer Ablauf aller eigenen Lernseiten: Zugang, Verständnis-Check,
  // eigene Checks, Lehrkraftbestätigung, Abschluss und Punkte. Die Seiten
  // l1-1.js bis l4-8.js übergeben nur noch ihre Antworten und Hinweise.
  const KEY = "excelLab.state.v1";
  const NUMBER_WORDS = { 1: "eine", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs" };
  const $ = (selector) => document.querySelector(selector);

  function start(config) {
    const lessons = window.EXCEL_LAB_CONTENT?.lessons || [];
    const index = lessons.findIndex((item) => item.id === config.id);
    if (index < 0) throw new Error(`Excel-Lab: unbekannte Lerneinheit ${config.id}.`);
    const lesson = lessons[index];
    const previous = lessons[index - 1] || null;
    const following = lessons[index + 1] || null;
    const ID = lesson.id;
    const code = lesson.code;
    const points = lesson.points || 100;
    const prefix = ID.replace("-", "");
    const answers = config.answers;
    const hints = config.hints;
    const bothFiles = config.files === "both";
    const questionWord = NUMBER_WORDS[Object.keys(answers).length] || String(Object.keys(answers).length);

    const checks = Array.from(document.querySelectorAll("[data-page-check]"));
    const checkWord = NUMBER_WORDS[checks.length] || String(checks.length);
    const form = $(`#${prefix}-mastery-form`);
    const masteryStatus = $(`#${prefix}-mastery-status`);
    const masterySection = $(`#${prefix}-mastery-section`);
    const dev = () => Boolean(window.EXCEL_LAB_DEV?.enabled);
    let state, profile;

    function refresh() {
      const oldId = profile?.id;
      try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { state = null; }
      profile = Array.isArray(state?.profiles) ? state.profiles.find((item) => item.id === state.currentProfileId) : null;
      if (oldId !== profile?.id) {
        // Antworten gehören zum Profil, mit dem sie ausgewählt wurden.
        form.reset();
        form.querySelectorAll(".mastery-question").forEach((question) => {
          delete question.dataset.result;
          question.querySelector(".mastery-feedback").textContent = "";
        });
      }
    }

    function unlocked() {
      return dev() || !previous || Boolean(profile?.progress?.[previous.id]?.completed);
    }

    function progress() {
      const saved = profile?.progress?.[ID];
      return {
        completed: Boolean(saved?.completed),
        teacherChecked: Boolean(saved?.teacherChecked),
        masteryPassed: Boolean(saved?.masteryPassed || saved?.completed),
        checks: checks.map((_, i) => Boolean(saved?.checks?.[i]))
      };
    }

    function toast(message) {
      const element = document.createElement("div");
      element.className = "toast";
      element.textContent = message;
      $("#toast-region").append(element);
      setTimeout(() => element.remove(), 4500);
    }

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
      catch {
        toast("Speichern im Browser nicht möglich. Prüfe die Browsereinstellungen, bevor du weiterarbeitest.");
        refresh();
        return false;
      }
    }

    function save(next) {
      if (dev() || !profile) return false;
      profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
      // Die Übersicht behandelt eine abgeschlossene Folgeeinheit als offen, auch
      // wenn diese Einheit wieder offen ist. Deshalb deren Abschluss mit
      // zurücknehmen; ihre Checks und alle anderen Einheiten bleiben erhalten.
      if (following && !next.completed && profile.progress[ID]?.completed && profile.progress[following.id]) {
        profile.progress[following.id].completed = false;
      }
      profile.progress[ID] = next;
      profile.updatedAt = new Date().toISOString();
      return persist();
    }

    function render() {
      const open = unlocked();
      const current = progress();
      const editable = open && Boolean(profile) && !dev();
      const count = current.checks.filter(Boolean).length + Number(current.teacherChecked) + Number(current.masteryPassed);
      const percent = open ? current.completed ? 100 : Math.round(count / (checks.length + 3) * 100) : 0;
      // Ohne gespeicherten Lernstand gilt wie auf der Startseite die Vorgabe des Geräts.
      const light = state ? state.theme === "light" : window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.dataset.theme = light ? "light" : "dark";
      $("meta[name='theme-color']").content = light ? "#f4f7f4" : "#0b1422";

      const content = $(`#${prefix}-content`);
      const access = $(`#${prefix}-access`);
      const accessMessage = $(`#${prefix}-access-message`);
      if (content) content.hidden = !open;
      if (access) access.hidden = open;
      if (accessMessage && previous) {
        accessMessage.textContent = profile
          ? `Schließe ${previous.code} mit allen eigenen Checks und der Lehrkraftbestätigung ab. Danach kannst du hier weiterlernen.`
          : `Lege auf der Startseite dein Lernprofil an und schließe ${previous.code} ab.`;
      }

      $("#lesson-profile-name").textContent = profile ? `${profile.name} · ${profile.className}` : "Profil anlegen";
      $("#lesson-profile-avatar").textContent = String(profile?.name || "?").split(/[.\s]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
      $("#lesson-score-ring").style.setProperty("--progress", percent);
      $("#lesson-page-percent").textContent = `${percent}%`;
      $("#lesson-page-status").textContent = !open ? "Noch gesperrt" : current.completed ? "Abgeschlossen" : count ? "In Arbeit" : "Noch nicht begonnen";
      $("#lesson-points-status").textContent = `${open && current.completed ? points : 0} von ${points} Punkten`;

      checks.forEach((element, i) => { element.checked = current.checks[i]; element.disabled = !editable; });
      $("#page-teacher-check").checked = current.teacherChecked;
      $("#page-teacher-check").disabled = !editable;
      form.querySelectorAll("input, button").forEach((element) => { element.disabled = !editable || current.masteryPassed; });
      form.querySelectorAll(".mastery-question, button[type='submit']").forEach((element) => { element.hidden = current.masteryPassed; });
      masteryStatus.classList.toggle("is-passed", current.masteryPassed);
      masteryStatus.textContent = current.masteryPassed
        ? bothFiles
          ? "Verständnis-Check bestanden. Prüfe nun beide Excel-Dateien und besprich sie mit der Lehrkraft."
          : "Verständnis-Check bestanden. Prüfe nun deine Excel-Datei und besprich sie mit der Lehrkraft."
        : `Noch nicht bestanden. Für den Abschluss müssen alle ${questionWord} Antworten stimmen.`;

      const button = $("#page-complete-button");
      button.disabled = !open || dev();
      button.textContent = !profile && !previous ? "Zuerst Lernprofil anlegen" : current.completed ? `✓ ${code} wieder öffnen` : `${code} abschließen`;
      button.classList.toggle("button-primary", !current.completed);
      button.classList.toggle("button-secondary", current.completed);
      $("#page-completion-note").textContent = !profile && !previous
        ? "Lege auf der Startseite zuerst dein Lernprofil mit Account und Klassenbezeichnung an."
        : current.completed
          ? following
            ? `${points} Punkte wurden gutgeschrieben. Beim Wiederöffnen wird ${following.code} erneut gesperrt; ein dortiger Abschluss wird ebenfalls zurückgenommen.`
            : `${points} Punkte wurden gutgeschrieben. Du hast die letzte Einheit bearbeitet. Sichere deinen Lernstand über das Profilmenü.`
          : `Verständnis-Check, alle ${checkWord} eigenen Checks und die Lehrkraftbestätigung sind nötig. Erst der Abschluss schreibt ${points} Punkte gut.`;

      const nextLink = $("#next-lesson-link");
      const ready = open && (current.completed || dev());
      nextLink.classList.toggle("is-disabled", !ready);
      nextLink.setAttribute("aria-disabled", String(!ready));
      nextLink.tabIndex = ready ? 0 : -1;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const oldProfileId = profile?.id;
      refresh();
      if (!unlocked() || !profile || oldProfileId !== profile.id || progress().masteryPassed || dev()) { render(); return; }
      let allCorrect = true;
      for (const [name, answer] of Object.entries(answers)) {
        const question = form.querySelector(`[data-mastery-question="${name}"]`);
        const selected = question.querySelector("input:checked")?.value;
        const correct = selected === answer;
        question.dataset.result = correct ? "correct" : "incorrect";
        question.querySelector(".mastery-feedback").textContent = correct ? "Richtig." : selected ? hints[name] : "Wähle eine Antwort.";
        allCorrect = allCorrect && correct;
      }
      if (!allCorrect) {
        masteryStatus.textContent = "Noch nicht bestanden. Lies die Hinweise und versuche es erneut.";
        form.querySelector('.mastery-question[data-result="incorrect"]')?.scrollIntoView({ block: "nearest" });
        return;
      }
      const next = progress();
      next.masteryPassed = true;
      const saved = save(next);
      render();
      if (saved) toast(`Verständnis-Check bestanden. Zeige nun ${bothFiles ? "beide Excel-Dateien" : "die Excel-Datei"} der Lehrkraft.`);
    });

    document.addEventListener("change", (event) => {
      if (!event.target.matches("[data-page-check], #page-teacher-check") || dev()) return;
      const oldProfileId = profile?.id;
      refresh();
      if (!unlocked() || !profile || oldProfileId !== profile.id) { render(); return; }
      const next = progress();
      if (event.target.id === "page-teacher-check") next.teacherChecked = event.target.checked;
      else next.checks[Number(event.target.dataset.pageCheck)] = event.target.checked;
      const revoked = next.completed && (!next.teacherChecked || !next.checks.every(Boolean));
      if (revoked) next.completed = false;
      const saved = save(next);
      render();
      if (saved && revoked) {
        toast(following
          ? `Abschluss zurückgenommen. ${following.code} ist wieder gesperrt.`
          : "Abschluss zurückgenommen. Deine übrigen Einheiten bleiben unverändert.");
      }
    });

    $("#page-complete-button").addEventListener("click", () => {
      if (dev()) return;
      const oldProfileId = profile?.id;
      refresh();
      if (!unlocked() || oldProfileId !== profile?.id) { render(); return; }
      if (!profile) { window.location.href = "index.html#uebersicht"; return; }
      const next = progress();
      if (!next.completed && !next.masteryPassed) {
        masterySection.open = true;
        masterySection.scrollIntoView({ block: "start", behavior: "smooth" });
        toast("Bestehe zuerst den Verständnis-Check.");
        return;
      }
      if (!next.completed && !next.checks.every(Boolean)) { toast(`Hake zuerst alle ${checkWord} eigenen Arbeitsschritte ab.`); return; }
      if (!next.completed && !next.teacherChecked) { toast("Die Bestätigung durch die Lehrkraft fehlt noch."); return; }
      next.completed = !next.completed;
      const saved = save(next);
      render();
      if (!saved) return;
      if (next.completed) {
        toast(following
          ? `${code} abgeschlossen: ${points} Punkte. ${following.code} ist freigeschaltet.`
          : `${code} abgeschlossen: ${points} Punkte. Sichere nun deinen Lernstand.`);
      } else {
        toast(following ? `${code} ist wieder offen. ${following.code} ist wieder gesperrt.` : `${code} ist wieder offen.`);
      }
    });

    $("#next-lesson-link").addEventListener("click", (event) => {
      refresh();
      if (!dev() && (!unlocked() || !progress().completed)) {
        event.preventDefault();
        render();
        toast(`Schließe zuerst ${code} ab.`);
      }
    });

    $("#lesson-theme-toggle").addEventListener("click", () => {
      refresh();
      if (!state) {
        // Einen vorhandenen, aber nicht lesbaren Lernstand nicht überschreiben;
        // die Startseite legt dafür zuerst eine Rettungskopie an.
        let stored = null;
        try { stored = localStorage.getItem(KEY); } catch { /* gesperrter Speicher */ }
        if (stored) { toast("Der Lernstand ist nicht lesbar. Öffne die Startseite und lade deine Speicherdatei."); return; }
        state = { version: 1, theme: document.documentElement.dataset.theme === "light" ? "light" : "dark", currentProfileId: null, profiles: [] };
      }
      state.theme = state.theme === "light" ? "dark" : "light";
      persist();
      render();
    });

    window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) { refresh(); render(); } });
    window.addEventListener("pageshow", () => { refresh(); render(); });
    window.addEventListener("excel-lab-dev-change", () => { refresh(); render(); });
    refresh();
    render();
  }

  window.ExcelLabLesson = Object.freeze({ start });
})();
