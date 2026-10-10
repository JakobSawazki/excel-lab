# claude2codex.md – Übergabe von Claude an Codex (Excel-Lab)

Stand: 2026-10-10 · Release 0.20.1 (veröffentlicht) · Grundlage: 0.10.1 (`5e1a758`) · Autor: Claude

Jakob hat Claude am 9. Oktober 2026 beauftragt, Excel-Lab wie zuvor WorkbenchLab
zu optimieren und dir die Punkte zu übergeben, an denen du weiterarbeiten kannst.
Diese Datei ist Claudes einzige Übergabedatei. Für deine Antwort bietet sich
`documentation/codex2claude.md` an. Die Projektdokumentation
(`documentation/documentation.md`) bleibt deine; Claude hat dort nur Kopf und
einen Eintrag im Taskstatus ergänzt.

## Teil A – Das Wichtigste

### A0 Jakobs Entscheidungen vom 9. Oktober 2026

| Frage | Entscheidung | Folge |
| --- | --- | --- |
| Branch übernehmen und veröffentlichen? | Ja. Grafiken und Fotos bleiben im Original, Qualität nie verschlechtern | Release 0.11.0 und 0.11.1 auf `main`, veröffentlicht (OPT-07) |
| Geräte | An der Kaufmännischen Schule Nagold hat jede Person eine eigene Windows-Anmeldung (Windows 11) mit eigenen Dateien und sitzt möglichst am selben PC; sonst lädt sie ihre JSON-Datei | OPT-11 ist kein dringendes Problem mehr |
| Nur App-Dateien veröffentlichen? | Claude überlassen; wichtig ist, dass der aktuelle Stand immer online ist | Bereitstellung bleibt „aus `main`“, einfach und ohne zusätzlichen Schritt (OPT-14) |
| „Punkte“ oder „XP“? | XP | umgesetzt in 0.11.0 (OPT-20) |
| `.tmp/` leeren? | Ja | Freigabe erteilt; erst nachdem deine Tests übernommen sind (OPT-08) |
| Rücknahme eines Abschlusses (OPT-10) | Jakob hat nachgefragt, was gemeint ist | noch offen |

### A0b Jakobs Aufträge vom 10. Oktober 2026

- Selbstständig weiterarbeiten; nach einem geeigneten Versionsstand darf Claude
  pushen und online stellen.
- Je Lerneinheit dürfen weitere vertiefende Aufgaben dazukommen, die Extra-XP
  bringen → umgesetzt als Bonusaufgaben in 0.12.0 (OPT-23).
- Inhaltlich prüfen, ob alle fachlichen Inhalte der BPE1-Unterlagen enthalten
  sind → OPT-09; Ergebnis siehe dort.

### A0c Von Claude entschieden (0.13.0), jederzeit rücknehmbar

Jakob hat am 10. Oktober verlangt, selbstständig weiterzuarbeiten. Drei offene
Punkte hat Claude deshalb nach eigener Empfehlung umgesetzt, jeweils als
eigene, kleine Änderung:

- **OPT-10, Weg c:** `save` in `lesson-core.js` nimmt beim Wiederöffnen keinen
  fremden Abschluss mehr zurück. `lessonAccess` (`app.js`) und `access`
  (`lesson-navigation.js`) geben eine Einheit nur noch frei, wenn die vorige
  abgeschlossen ist – nicht mehr schon deshalb, weil sie selbst abgeschlossen
  war. Folge: Nach dem Wiederöffnen von L2.1 ist L2.2 gesperrt, behält aber
  Abschluss und XP; L2.3 bleibt offen. Zurück zum alten Verhalten: die drei
  Stellen im Commit zurücknehmen.
- **OPT-19, Kontrast im hellen Schema:** nur drei Farbwerte in
  `[data-theme="light"]` (`styles.css`): `--text-soft` `#52645b` → `#46574e`,
  `--text-faint` `#75857c` → `#5d6d64`, `--green` `#188a55` → `#12744a`.
  Startseite und Lernpfad im hellen Schema angesehen. Nicht angesehen: die
  übrigen vier Hintergründe und vier Schriftfarben im hellen Schema.
- **OPT-16:** Knopf `#rescue-button` im Profildialog (`index.html`, `app.js`).

### A0d Nachtrag 0.13.1

- `tests/browser/a11y.browser.cjs` prüft 31 Ansichten: jedes Bedienelement hat
  einen vorlesbaren Namen, genau eine sichtbare `h1`, keine übersprungene
  Überschriftenebene, keine doppelten IDs, alle ARIA-Verweise zeigen auf
  vorhandene Elemente, und jedes Bedienelement ist mit Tab erreichbar. Neue
  Seiten und Bedienelemente müssen das bestehen.
- Entfernt aus `app.js`: der Dialogteil von `openLesson`,
  `updateOpenLessonCheck`, `updateOpenLessonTeacherCheck`,
  `toggleOpenLessonComplete`, `writeLessonProgress`, `openLessonId` und die
  zugehörigen Ereignisse; aus `index.html` der `<dialog id="lesson-dialog">`.
  Der Code war unerreichbar, weil jede Einheit eine eigene Seite hat. Die
  Felder `keyPoints`, `steps`, `tip` in `content.js` und die Styles
  `.lesson-dialog*` sind geblieben; `downloads` nutzt Claudes Abgleichskript
  als Zuordnung Einheit → Originaldatei.
- Sichtprüfung helles Schema: Smaragd/warm, Graphit/hoher Kontrast,
  Violett/Lavendel, Sand/Mint auf L1.2 angesehen, ohne Auffälligkeit.
- **`.tmp/` hat Claude nicht geleert.** Jakobs Freigabe liegt vor (A0), aber
  dort liegen deine einzigen Testskripte, und Claude löscht keine Dateien
  endgültig. Bitte nach der Übernahme deiner Tests selbst leeren.

### A0e Nachtrag 0.14.0

- **OPT-12:** `nav-menu.js` stellt `window.ExcelLabNav.renderStageMenu` und
  `bindMenu` bereit. `app.js` (`renderNavMenu`, `closeLearningMenu`) und
  `lesson-navigation.js` (`renderMenu`) nutzen beide. Die Kapitelknöpfe heißen
  weiter `data-open-lesson` (Startseite) und `data-lesson-open` (Lernseiten).
  Neu: Bei Mausbedienung schließt ein Klick auf den Pfeil das durch Zeigen
  geöffnete Menü nicht mehr. `tests/browser/site.browser.cjs` prüft das Menü
  auf beiden Seitentypen.
- **OPT-08, Bestandsaufnahme deiner `.tmp`-Skripte:** 75 Skripte (ohne
  `audit-memory-server.cjs` und das bereits übernommene Abschluss-Audit) liefen
  als Kopien außerhalb des Projekts mit angepasstem Port und Ausgabeordner;
  `.tmp/` wurde nicht verändert. Port 4325, den 68 Skripte fest eingetragen
  haben, war von einem fremden Prozess belegt.
  - Gegen den Ausgangsstand 0.10.1 (`5e1a758`): 35 bestanden, 40 nicht. Diese
    40 passten also schon vor Claudes Arbeit nicht mehr zum Stand (unter
    anderem `l16-smoke` bis `l33-smoke`, `navigation-smoke`, `organizer-smoke`,
    `video-smoke`, `design-smoke`, viele `*-mastery-smoke`).
  - Gegen 0.14.0: 28 bestanden. Zwölf bestanden vorher und jetzt nicht mehr,
    alle wegen gewollter Änderungen:
    `l11`–`l16-mastery-smoke` erwarten, dass das Wiederöffnen den Abschluss der
    Folgeeinheit löscht (OPT-10 geändert); `l37-`, `l42-`, `l46-content-smoke`
    und `l41-l42-practice-smoke` zählen acht aufklappbare Abschnitte, jetzt
    sind es mit dem Bonusabschnitt neun; `xp-smoke` erwartet die alten
    Levelgrenzen; `publish-practice-smoke` besteht bei einzelner Wiederholung.
  - Fünf bestehen jetzt, die am Ausgangsstand scheiterten
    (`l11-entry-practice-smoke`, `l47-`/`l48-content-smoke`,
    `l48-mastery-smoke`, `mobile-navigation-smoke`) – vermutlich Zeitverhalten.
  - **Empfehlung:** Nur die 28 bestehenden und die zwölf leicht anzupassenden
    Skripte übernehmen; Port und Playwright-Pfad wie in
    `tests/browser/site.browser.cjs` als Parameter. Die übrigen erst prüfen,
    ob sie noch etwas absichern, das die neuen Tests nicht abdecken.

### A0f Deine Tests im Repository (10. Oktober, nach 0.14.0)

- Die 28 Skripte aus `.tmp/`, die gegen 0.14.0 bestehen, liegen jetzt unter
  `tests/browser/codex/`. Geändert sind nur drei Dinge: Adresse
  (`process.argv[2]`, sonst `EXCEL_LAB_BASE`, sonst Port 4273 statt fest
  4325/4326), Playwright-Pfad (`EXCEL_LAB_PLAYWRIGHT`) und Ausgabeordner
  (`%TEMP%\excel-lab-tests` statt `.tmp/`). Jede Datei nennt das im Kopf. Die
  Prüflogik ist unverändert; alle 28 bestehen am neuen Ort.
- Vor der Übernahme durchsucht: Die Skripte enthalten keine Inhalte aus den
  Originalunterlagen und keine Lösungen. `l47-content-smoke` und
  `l48-content-smoke` lesen die lokalen DOCX-Dateien zur Laufzeit und brauchen
  deshalb `materialien/BPE1`.
- `node tests/browser/run-all.cjs http://127.0.0.1:4273/` startet alle
  Browsertests nacheinander (`codex` oder `eigene` als zweiter Parameter
  schränkt ein); das Kontrast-Messwerkzeug läuft dabei nicht mit.
- Nicht übernommen: die 47 Skripte, die am aktuellen Stand scheitern (40 davon
  schon am Ausgangsstand), `audit-memory-server.cjs`, die 6 Python-Dateien und
  alle Bilder. Sie liegen weiter nur in `.tmp/`.
- **`.tmp/` leeren:** Aus Claudes Sicht steht dem nichts mehr im Weg, außer du
  willst einzelne der 47 Skripte noch retten. Claude löscht den Ordner nicht
  selbst; das Leeren liegt bei Jakob oder dir.

### A0g Abschlussprüfung am 10. Oktober (Stand `main`, App 0.14.0)

- `node --test`: 287 bestanden. `run-all.cjs`: 3 eigene und 28 übernommene
  Browsertestdateien bestanden.
- Ein übernommener Test war instabil: `l11-entry-practice-smoke.cjs` prüfte
  direkt nach dem Klick auf „Meine Getränkeliste anlegen“, ob der
  Aufgabenabschnitt offen ist. Der Abschnitt öffnet aber erst im
  `hashchange`-Ereignis; in zwei von sieben Gesamtläufen scheiterte das. Die
  Prüfung wartet jetzt auf das Öffnen (im Test kommentiert); danach 25 von 25
  Einzelläufen bestanden. Das Verhalten der Seite ist unverändert.
- Sichtprüfung: alle 28 Seiten und drei weitere Ansichten der Startseite
  (Lernpfad, Formelsammlung, Quellen) in dunklem und hellem Schema als
  Bildschirmfotos bei 1280 Pixeln angesehen; einheitlich, kein verrutschtes
  Layout, kein fehlendes Bild. Nicht einzeln angesehen: Mobilbreite (dort
  prüfen die Tests nur das Überlaufen) und jeder aufgeklappte Abschnitt.

### A0h Protokoll des Abschlusslaufs (10. Oktober, lokal auf Port 4273)

Nach der Korrektur von `l11-entry-practice-smoke.cjs`, alles zweimal:

| Lauf | Node-Tests | eigene Browsertests | übernommene Browsertests |
| --- | --- | --- | --- |
| 1 | 287 von 287 | 3 von 3 Dateien | 28 von 28 Dateien |
| 2 | 287 von 287 | 3 von 3 Dateien | 28 von 28 Dateien |

- Mobilansicht: alle 31 Ansichten bei 390 Pixeln in beiden Schemata als
  Bildschirmfotos angesehen, ohne Auffälligkeit bis auf eine: Die Tabellen der
  Bonusaufgaben und der neuen Abschnitte in L3.6 waren breiter als der
  Bildschirm. **0.14.1** setzt für `.bonus-table` `min-width: 0` und erlaubt
  Umbrüche; nachgemessen an fünf Seiten: keine Tabelle ist mehr breiter als
  ihr Rahmen. Danach erneut 287 Node-Prüfungen und die eigenen Browsertests
  bestanden.

### A0i Nachlauf der übernommenen Tests gegen 0.14.1

- Ergebnis: 28 von 28 Dateien bestanden (ein einzelner, ungestörter Lauf).
- Davor waren mehrere Läufe unbrauchbar: Claude hatte Läufe per Zeitlimit
  abgebrochen, deren Browser weiterliefen, und parallel gegen die
  veröffentlichte Seite getestet. Die Reste sind beendet.
- Dabei zeigte sich ein zweiter zeitabhängiger Test:
  `mobile-navigation-smoke.cjs` misst 180 ms nach einem Breitenwechsel. Auf
  dem zu der Zeit etwa achtmal langsameren Rechner fiel die Messung in den
  Übergang (Menüpfeil 25 statt 36 Pixel breit) und meldete „clipped label“.
  Nachgemessen nach 1,5 Sekunden, lokal und online: 36 Pixel, nichts
  abgeschnitten – kein Darstellungsfehler. Der Test wartet jetzt zusätzlich
  auf laufende Übergänge (im Test kommentiert); danach drei von drei
  Einzelläufen und der Gesamtlauf bestanden.
- Hinweis: Unter Last brauchen die übernommenen Tests rund 20 statt 4 Minuten.

### A0j In Excel nachgerechnet und alle Farbkombinationen gesichtet (10. Oktober)

- **Excel:** `tests/excel/verify-in-excel.ps1` rechnet per COM in echtem Excel
  (hier Version 16, deutsch) mit deutschen Funktionsnamen nach: die
  KFZ-Steuer (drei Verweistabellen, `SVERWEIS … WAHR` an den Grenzen 1799,
  2099, 2100 ccm, `#NV` mit `FALSCH`, Kennzeichen A gegen AA), die PLZ-Suche
  (Text mit führender Null, `WENN(ISTNV(…))`, Zahl findet Text nicht) und 15
  Bonusaufgaben einschließlich der Zielwertsuche. Ergebnis: 31 von 31. Das
  Skript legt nur eine unbenannte Mappe an und schließt sie ohne Speichern.
  Aufruf: `powershell -File tests\excelerify-in-excel.ps1`.
  Damit entfällt die Einschränkung „nicht in Excel durchgerechnet“ aus OPT-09
  und OPT-23. Nicht in Excel geprüft: die zwölf Bonusaufgaben ohne eigene
  Excel-Funktion (reine Grundrechenarten und Diagramme) und das Erstellen der
  Diagramme selbst.
- **Farben:** alle 50 Kombinationen (2 Schemata × 5 Hintergründe × 5
  Schriftfarben) als Bildschirmfotos von L1.2 angesehen; einheitlich und
  lesbar, keine Auffälligkeit.
- **Weiter nicht möglich:** Prüfung mit einem echten Bildschirmleser (kein
  solches Programm steuerbar), Schul-PCs, Unterrichtserprobung.

### A0k Gesamtlauf als Nachweis (10. Oktober)

Ein einzelner, ungestörter Lauf am Commit `965d49c` (App 0.14.1, danach nur
Dokumentation): 287 von 287 Node-Prüfungen und 31 von 31 Browsertestdateien
(3 eigene, 28 übernommene) bestanden. Das vollständige Protokoll mit Zeiten je
Datei liegt in [`testlauf-2026-10-10.txt`](testlauf-2026-10-10.txt).

### A0l Release 0.15.0: Klassenübersicht und Druckansicht

- **Klassenübersicht** (`lehrkraft.html`, `lehrkraft.js`, `lehrkraft.css`; Link
  im Fuß der Startseite). Liest eine oder mehrere Speicherdateien (Auswahl oder
  Ziehen), prüft `app`, `version`, `profile`, begrenzt auf 1 MB je Datei und
  bereinigt die Werte selbst; unbekannte Einheiten werden ignoriert. Je Person
  zählt die zuletzt gesicherte Datei (Schlüssel Klasse + Kürzel). Anzeige:
  Kennzahlen, Tabelle mit ✓ / ◐ / · je Einheit, goldener Rand für gelöste
  Bonusaufgaben, Fußzeile mit Abschlüssen je Einheit, CSV mit Semikolon und
  BOM für deutsches Excel (führende `= + - @` werden entschärft).
  - Nichts wird gespeichert oder übertragen; alle Dateiinhalte gelangen nur
    über `textContent` in die Seite. Die Seite trägt `noindex`.
  - Sie zeigt, was Lernende selbst gespeichert haben. Sie prüft keine
    Echtheit und setzt keine Bestätigung; das bleibt der in OPT-21 offene Punkt.
  - Neue Seiten ohne Lernablauf müssen in `tests/site.test.js` (Seitenzahl)
    und in `tests/browser/site.browser.cjs` (Liste `lessonPages`) bedacht werden.
- **Druckansicht:** `lesson-workspace.js` ergänzt den Knopf „Drucken“ und öffnet
  vor dem Druck alle Abschnitte (`beforeprint`/`afterprint`);
  `lesson-workspace.css` enthält die Druckregeln (heller Hintergrund, ohne
  Kopf, Navigation, Seitenleiste, Videos, Eingabefelder).
- Erledigt damit aus Abschnitt 11 der Dokumentation: „Lernstandübersicht für
  Lehrkräfte konzipieren“ und „Druckansicht anbieten“.

### A0m Release 0.16.0: Fehlerwerkstatt

- `content.js`, Liste `formulas`: sieben neue Einträge der Kategorie
  „Fehlermeldungen“ (#NV, #DIV/0!, #WERT!, #NAME?, #BEZUG!, #ZAHL!, #####) mit
  Ursache, Abhilfe und einem Beispiel. Kein neuer Code: Filter, Suche und
  Kopierknopf der Formelsammlung greifen automatisch. `index.html` nennt
  jetzt 27 Formeln (der Node-Test vergleicht die Zahl mit `content.js`).
- In Excel geprüft: `tests/excel/verify-errors-in-excel.ps1` löst jede Meldung
  mit dem Beispiel der Karte aus und prüft zwei Abhilfen; 9 von 9.
  **Befund für deine Seiten:** Text wie „12 €“ rechnet deutsches Excel
  stillschweigend als Zahl (12 × 12 = 144), „12 Stück“ ergibt #WERT!. Die
  Lernseiten nennen #WERT! nur einmal (Geldbeträge müssen als Zahlen
  vorliegen) und behaupten nichts Falsches; durchsucht am 10. Oktober.

### A0n Release 0.17.0: Glossar

- `content.js`: neue Liste `glossary` mit 26 Einträgen `{ term, text, lesson }`,
  exportiert über `EXCEL_LAB_CONTENT.glossary`.
- `app.js`: `renderFormulaFilters` ergänzt den Filter „Glossar“;
  `renderFormulas` füllt `#glossary-list` (unter „Alle“ nach den Formeln, unter
  „Glossar“ allein) und wendet die Suche auf beide an. Styles am Ende von
  `home.css`.
- **Bitte fachlich gegenlesen:** Die Erklärungen stammen von Claude; ein
  Node-Test prüft, dass jeder Begriff auf der genannten Lernseite vorkommt.
  Dabei angepasst: „Kategorienachse“ statt „Rubrikenachse“ (so heißen die
  Seiten L4.1–L4.3 die Achse; auch in der Bonusaufgabe zu L4.3 berichtigt) und
  „Argument“ bei L3.5 statt L2.4.

### A0o Release 0.18.0: zweite Bonusaufgabe je Einheit

- `bonus-tasks.js`: neue Liste `extra` mit 27 Transferaufgaben, exportiert als
  `EXCEL_LAB_BONUS.extra`. Jede Aufgabe trägt zusätzlich `calc`, einen
  Rechenausdruck, mit dem `tests/bonus.test.js` den Kontrollwert nachrechnet.
- `lesson-core.js`: Die Bonusabschnitte entstehen jetzt aus der Liste
  `bonusItems` (erste Aufgabe: Feld `bonus`, Kennungen `#lXY-bonus-…`; zweite:
  Feld `bonus2`, Kennungen `#lXY-bonus-2-…`, Beschriftung „Bonus · Transfer“).
- `app.js` (`solvedBonus`, `normalizeProfile`, `getLessonProgress`), `xp.js`
  und `lehrkraft.js` zählen beide Felder. Höchstwert jetzt 27 × 100 + 54 × 50
  = 5400 XP. Ältere Sicherungen ohne `bonus2` laden unverändert.
- In Excel nachgerechnet: `tests/excel/verify-transfer-in-excel.ps1` prüft 13
  der Transferaufgaben mit Excel-Funktionen (unter anderem `SVERWEIS … WAHR`,
  `RUNDEN`, Zielwertsuche, `STEIGUNG`), 14 von 14 Prüfungen bestanden.
- **Bitte fachlich gegenlesen:** Auch diese 27 Aufgaben stammen von Claude und
  sind nicht im Unterricht erprobt.

### A0p Release 0.18.1: Laden ersetzt dieselbe Person (OPT-11)

- `importProgress` in `app.js`: Gibt es schon ein Profil mit gleichem Kürzel
  und gleicher Klasse, übernimmt die geladene Datei dessen `id` und
  `createdAt` und ersetzt es. Hat die Datei weniger abgeschlossene Einheiten,
  fragt `window.confirm` nach; bei „Abbrechen“ bleibt alles unverändert.
- Nicht geändert: Profile, die sich früher angesammelt haben, bleiben im
  Speicher; einen Profilwechsel außerhalb des Entwickler-Modus gibt es weiter
  nicht. Verglichen wird nur die Zahl der Abschlüsse, nicht Bonus oder Checks.

### A0q Testlauf zu 0.18.1 und ein Hinweis zu Google Drive

- `tests/browser/codex/save-load-smoke.cjs` erwartete, dass jedes Laden ein
  weiteres Profil anlegt (2, dann 3 Profile). Angepasst an das neue Verhalten
  (ein Profil, geänderter Zeitstempel); im Test kommentiert.
- **Drive bremst die Browsertests:** Am 10. Oktober dauerte das Laden einer
  Seite über `python -m http.server` aus dem Drive-Ordner zeitweise fast 30
  Sekunden, Tests liefen in Zeitüberschreitungen und ein Browser stürzte ab
  („Target crashed“). Ursache war nicht der Code, sondern der Dateizugriff
  auf `G:` während der Synchronisierung. Abhilfe: den Ordner ohne `.git` und
  `.tmp` nach `%TEMP%\excel-lab-serve` spiegeln (`robocopy … /MIR`) und den
  Vorschauserver dort starten; die Tests selbst weiter aus dem Projektordner
  aufrufen. `l48-mastery-smoke` ruft die lokalen Downloads ab und braucht
  dafür `materialien/` auch in der Kopie.
- Ergebnis gegen die lokale Kopie: 293 Node-Prüfungen, 3 von 3 eigenen und 27
  von 28 übernommenen Browsertestdateien in einem Lauf; die 28. bestand danach
  zweimal einzeln, nachdem `materialien/` in der Kopie lag.

### A0r Release 0.19.0: Lernnachweis

- Neue Seite `nachweis.html` mit `nachweis.js` und `nachweis.css`; Link
  `#certificate-link` im Profildialog der Startseite. Die Seite liest
  `excelLab.state.v1` nur, schreibt nichts und setzt alle Werte über
  `textContent`. Ohne Profil zeigt sie einen Hinweis statt des Nachweises.
- Der Nachweis ist eine Selbstauskunft aus dem Browser (wie die
  Klassenübersicht) und sagt das auch; gültig wird er laut Text erst mit der
  Unterschrift der Lehrkraft.
- Es gibt jetzt 30 HTML-Seiten: Startseite, 27 Lernseiten, Klassenübersicht,
  Lernnachweis. `tests/site.test.js` und der übernommene Link-Audit zählen so.

### A0s Dokumentation gestrafft (10. Oktober, keine App-Änderung)

- Neu: `CHANGELOG.md` mit einem Absatz je Version von 0.1 bis 0.19.0. Die 75
  Zeilen Änderungsbericht vom 4. bis 7. Oktober standen in der README und
  liegen jetzt wörtlich unter 0.10.1 im Changelog.
- README: Kopf nennt nur noch den aktuellen Release und verweist auf den
  Changelog; die Projektstruktur beschreibt den heutigen Stand statt einzelner
  Seiten bis L3.1. Der Node-Test liest weiter „Aktueller Release: **x**“.
- **Neue Regel je Release:** einen Absatz oben in `CHANGELOG.md` ergänzen und
  die Versionsnummer in der README anheben. Der Versionsverlauf im Dialog
  „Versionen und Impressum“ fasst mehrere Zwischenversionen unter einer Nummer
  zusammen; maßgeblich für die Geschichte ist der Changelog.
- `documentation/documentation.md`: Die Abschnitte 6 (Dateibaum, technische
  Entscheidungen), 7 (Datenformat mit `masteryPassed`, `bonus`, `bonus2` und
  dem neuen Importverhalten) und 9 (Qualitätsprüfung) hat Claude am
  10. Oktober auf den Stand 0.19.1 gebracht. Alle übrigen Abschnitte und die
  Übergaben H-01 bis H-70 sind unverändert; die Datei ist weiter ungeteilt.

### A0t Checkliste für den Schul-PC

`documentation/schul-pc-checkliste.md` bündelt, was nur vor Ort prüfbar ist
(Speicher über Abmeldungen, Laden an einem anderen PC, Excel-Version,
YouTube, Druck, Klassenübersicht, Tastatur und Sprachausgabe), als
Abhakliste für Jakob mit vier Rückfragen am Ende.

### A0u Release 0.19.1: ungenutzte Styles entfernt, Bildvergleich als Werkzeug

- Entfernt aus `styles.css` (84,9 → 77,9 KB) und `home.css` (24,5 → 22,8 KB):
  alle Regeln, deren Selektoren nur Klassen nennen, die in keiner HTML- oder
  JS-Datei vorkommen. Betroffen sind 24 Klassen: `chapter-card`,
  `chapter-footer`, `chapter-grid`, `chapter-number`, `chapter-progress-label`,
  `chapter-state`, `chapter-top`, `compact`, `complete-button`,
  `content-section`, `corner`, `key-point`, `key-points`, `mini-sheet`,
  `monitor-camera`, `monitor-shell`, `monitor-stand`, `next-card`,
  `next-section`, `sheet-tabs`, `sidebar-panel`, `tip-box`, `workbook-bar`,
  `workbook-window`. Klassen, die Skripte aus Teilen zusammensetzen
  (`option-…`, `is-…`, `lNN-…` und weitere Präfixe), blieben unangetastet.
  Die übrigen Stylesheets wurden nicht bereinigt.
- **Neues Werkzeug für Gestaltungsänderungen:**
  `tests/browser/visual-snapshots.cjs` fotografiert alle 33 Ansichten in
  beiden Schemata bei 1280 und 390 Pixeln in voller Länge (Zufall und Datum
  festgelegt, Videos ausgeblendet); `tests/browser/visual-compare.py`
  vergleicht zwei solche Ordner mit kleiner Toleranz (braucht Pillow).
  Zwei Läufe desselben Stands stimmen überein. Vereinzelt meldet ein Lauf
  wenige Pixel Abweichung, die ein zweiter Lauf nicht zeigt; im Zweifel den
  Nachher-Lauf wiederholen. Empfohlen vor jeder CSS-Änderung (A2).
- Ergebnis für 0.19.1: Vorher gegen Nachher 132 von 132 Bildern ohne
  sichtbaren Unterschied (ein erster Nachher-Lauf zeigte zwei Bilder mit 80
  und 7 Pixeln Abweichung, die Wiederholung keines).

### A0v Node-Tests laufen bei jedem Push auf GitHub

`.github/workflows/tests.yml` startet `node --test` bei jedem Push auf `main`
und bei Pull Requests (Node 22, keine Pakete, nur Leserechte). Die
Veröffentlichung über GitHub Pages bleibt davon unabhängig: Ein roter Lauf
verhindert sie nicht, zeigt aber sofort an, dass ein Test nicht besteht.
Die Browsertests laufen dort nicht; sie brauchen Edge und lokal Playwright.

### A0w Lösungsheft für die Lehrkraft

`node tools/build-loesungen.cjs` schreibt die richtigen Antworten aller 83
Fragen der Verständnis-Checks und die Kontrollwerte aller 54 Bonusaufgaben
nach `../Lehrkraft/Excel-Lab-Loesungen.md`, also außerhalb des Projekt- und
Web-Ordners. Das Werkzeug weigert sich, in den Projektordner zu schreiben.
Die Datei ist nicht im Repository und wird nicht veröffentlicht; nach
Änderungen an Fragen oder Bonusaufgaben neu erzeugen. (Die Lösungen stehen
weiterhin lesbar in den Skripten der Seite; das Heft ist eine Arbeitshilfe,
kein Schutz.)

### A0x Release 0.19.2: XP-Dialog mit Aufschlüsselung

`xp.js` zeigt im Dialog zusätzlich `#xp-breakdown`: „x von 27 Einheiten: … XP ·
y von 54 Bonusaufgaben: … XP“. Styles am Ende von `styles.css`.

Beim Testlauf war der Rechner wieder langsam. `l47-nav-smoke.cjs` und
`l48-nav-smoke.cjs` meldeten dabei denselben Messfehler wie zuvor
`mobile-navigation-smoke.cjs` („clipped label“, Messung mitten im Übergang).
Beide warten jetzt ebenfalls auf laufende Übergänge und bestanden danach je
zweimal. Im Sammellauf bestanden die übrigen 26 übernommenen Tests.

### A0y Release 0.20.0: Feinschliff am Design (Auftrag Jakob vom 10. Oktober)

Jakob: „Bitte optimiere auch das Design … schönes, edles Design. Hochwertige
Buttons, hochwertiger Hintergrund. Die Grafiken von Codex nicht anfassen bzw.
niemals die Qualität mindern.“ Umgesetzt als ein Block „Feinschliff 0.20.0“ am
Ende von `styles.css`; deine Regeln davor sind unverändert, keine Bilddatei
wurde angefasst.

- **Hintergrund** (`body`, `.lesson-page-body`): drei weiche Lichtflächen in
  Akzent- und Blauton, darüber ein Zellraster aus zwei Linienverläufen (46 px
  Zeilen, 92 px Spalten, 3 % Deckkraft), darunter ein Tiefenverlauf; fest
  stehend (`background-attachment: fixed`). Alles aus `var(--bg)`,
  `var(--green)`, `var(--blue)`, `var(--text)` gemischt, folgt also Schema und
  Hintergrundoption von selbst.
- **Nebenbuttons im hellen Schema** (`.button-secondary`): helles,
  gebürstetes Perlmetall mit dunkelgrüner Schrift statt der dunklen Blöcke;
  Hover, Tastendruck und gesperrter Zustand angepasst. Im dunklen Schema und
  bei den Hauptbuttons bleibt dein Metall-Grün.
- **Fokus:** einheitlicher Rahmen für alle Buttons.
- **Kleinstschriften:** `.check-note`, `.download-note`, `.section-index`,
  `.lesson-meta`, `.tag` und weitere von 0,62–0,68 rem auf 0,66–0,76 rem.
- Geprüft: vorher/nachher in beiden Schemata angesehen (Startseite, Lernpfad,
  Lernseite); Tests siehe unten. Nicht einzeln angesehen: die vier weiteren
  Hintergrundoptionen mit dem neuen Hintergrund.
- Rücknahme: den Block „Feinschliff 0.20.0“ am Ende von `styles.css` löschen.

### A0z Release 0.20.1: Feinschliff, zweiter Teil

Block „Feinschliff 0.20.1“ am Ende von `styles.css`:

- `.formula-card`, Glossareinträge, `.learning-summary`, `.stat-card`,
  `.source-card`: Rand, leichter Verlauf und Schatten wie bei deinen
  Lernseiten-Karten (`--metal-hairline`, `--metal-shadow`); Formelkarten heben
  sich beim Zeigen leicht an; `.formula-code` als eingelassenes Feld.
- `.toolbar` (Suche und Filter in Lernpfad und Formelsammlung): abgerundete
  Glasfläche statt eines deckenden Balkens, der auf dem neuen Hintergrund als
  harter Block wirkte.
- `::selection` und Bildlaufleiste in den Farben der Seite.
- Die in A0y offene Sichtprüfung ist nachgeholt: Smaragd, Graphit, Violett
  und Sand in beiden Schemata angesehen, ohne Auffälligkeit.
- Der Bildvergleich (`visual-snapshots.cjs`) zeigt nach diesen beiden
  Releases gewollt Unterschiede; neue Vergleichsbasis ist der Stand 0.20.1.

### A1 Wo der Stand liegt

- Claudes Arbeit ist auf `main` übernommen und veröffentlicht (Jakobs Auftrag
  vom 9. Oktober): **0.11.0** (`ae06c23`, Pages-Lauf 37983993229) und kurz darauf
  **0.11.1**. Der Online-Test von 0.11.0 zeigte, dass die Meldung zum nicht
  lesbaren Lernstand nach 3,2 Sekunden verschwand, bevor die Seite über das Netz
  fertig geladen war; in 0.11.1 bleibt sie 20 Sekunden stehen (`showToast` in
  `app.js` hat dafür eine optionale Dauer). Der Branch
  `claude/optimierung-2026-10-09` zeigt auf denselben Stand und kann gelöscht werden.
- Vor deiner Arbeit `git status --short --branch` und `git log --oneline -10` lesen.
- Einzelnes zurücknehmen: `git revert <commit>`; jeder Punkt ist ein eigener Commit.

### A2 Jakobs Vorgabe zum Design (9. Oktober 2026)

Jakob legt viel Wert auf hochwertiges, durchdachtes Design: fotorealistische
Grafiken, edle Buttons und Hintergründe. **Die Qualität der Fotos darf nicht
sinken – „mindestens gleich“.** Claude hatte die Fotos zuerst verkleinert und
verlustbehaftet umgewandelt; Jakob hat das gestoppt. Daraus folgt für uns beide:

- Bilder nur verlustfrei und in Originalauflösung umwandeln, Pixelgleichheit prüfen.
- Keine Verkleinerung, keine verlustbehaftete Kompression ohne Jakobs Freigabe.
- Gestaltung nicht vereinfachen, um Code oder Bytes zu sparen.

### A3 Was Claude geändert hat

| ID | Commit | Inhalt | Dateien |
| --- | --- | --- | --- |
| OPT-01 | `d6e77cd` | Gemeinsamer Ablauf aller Lernseiten | `lesson-core.js` (neu), `l1-1.js`–`l4-8.js`, alle 27 `l*.html` |
| OPT-02 | `13f4b5b` | Sechs Fotos verlustfrei als WebP | `assets/**/*.webp` (neu), `index.html`, `l1-1.html` |
| OPT-03 | `0dd5641` | Rettungskopie bei nicht lesbarem Lernstand | `app.js`, `lesson-core.js` |
| OPT-04 | `1a29fb6` | Tests im Repository | `tests/` (neu) |
| OPT-05 | `cba52e5` | Farbschema vor dem ersten Zeichnen | `theme-boot.js` (neu), alle 28 HTML-Seiten, `lesson-core.js` |
| OPT-06 | `da0cc4c` | Antwortmöglichkeiten im Verständnis-Check mischen | `lesson-core.js` |
| OPT-20 | Release-Commit | „XP“ statt „Punkte“ in allen Texten für Lernende | 27 `l*.html`, `index.html`, `app.js`, `lesson-core.js`, `lesson-navigation.js` |
| OPT-15 | Release-Commit | `?v=0.11.0` an allen Skript- und Style-Verweisen | alle 28 HTML-Seiten, `tests/` |
| OPT-07 | Release-Commit | Version 0.11.0 | `app.js`, `index.html`, `README.md`, Kopf der Dokumentation |

**OPT-01 – `lesson-core.js`.** Zugang, Verständnis-Check, eigene Checks,
Lehrkraftbestätigung, Abschluss und Punkte standen 27-mal fast gleich in den
Seitenskripten (4670 Zeilen). Jetzt enthält jedes Seitenskript nur noch
`masteryAnswers`, `masteryHints`, einen Aufruf
`window.ExcelLabLesson.start({ id, answers, hints })` und gegebenenfalls seine
Demo (L1.4, L4.1–L4.6, L4.8, unverändert). Zusammen 598 Zeilen. Vorgänger,
Nachfolger, Code („L2.1“) und Punkte liest `lesson-core.js` aus `content.js`.
Die Zeile `const masteryAnswers = { … };` ist bewusst einzeilig geblieben, weil
deine `.tmp`-Tests sie per Muster lesen.

Bewusst vereinheitlichte Texte (vorher je nach Seite leicht verschieden):

- Status nach bestandenem Check: „Verständnis-Check bestanden. Prüfe nun deine
  Excel-Datei und besprich sie mit der Lehrkraft.“ In L2.3 und L2.5 „beide
  Excel-Dateien“ (Schalter `files: "both"`).
- Meldung ohne bestandenen Check: „Bestehe zuerst den Verständnis-Check.“
- Hinweis nach Abschluss: „… ein dortiger Abschluss wird ebenfalls zurückgenommen.“
- Zahlwörter („alle drei Antworten“, „alle fünf“) entstehen aus der Zahl der
  Fragen und Checks der Seite.
- Der Status „Noch nicht bestanden …“ wird bei jedem Neuzeichnen gesetzt (so in
  18 der 27 alten Skripte).

Behobene Abweichungen: `l1-1.js` schrieb das Farbschema ohne `try` und brach bei
gesperrtem Speicher ab. Hinweise verschwanden in L1.1 nach 3,2 statt 4,5 Sekunden.

**OPT-02 – Fotos.** Sechs PNG-Fotos liegen zusätzlich als verlustfreies WebP in
Originalauflösung vor; die Seiten laden das WebP. Mit Pillow Pixel für Pixel
verglichen: identisch. Zusammen 10,9 MB → 7,1 MB. Die PNG-Originale bleiben als
Quelle und für `og:image`. Das Startbild hatte im HTML falsche Maße (1536 × 1024
statt 1672 × 941); berichtigt.

**OPT-03 – Rettungskopie.** War `excelLab.state.v1` nicht lesbar oder hatte eine
fremde Version, startete `app.js` leer und überschrieb den Eintrag beim nächsten
Speichern. Jetzt: Meldung beim Start; vor dem ersten Überschreiben Kopie nach
`excelLab.state.rescue.v1` (liegt dort schon eine andere Kopie, zusätzlich mit
Zeitstempel im Schlüssel); misslingt die Kopie, wird nicht gespeichert. Die
Lernseiten überschreiben einen nicht lesbaren Lernstand nicht (Farbschema-Knopf).
Das greift deinen Befund OPT-21 aus WorkbenchLab von Anfang an auf. Außerdem
entfiel in `normalizeProfile` und `getLessonProgress` die Liste aller 27
Kennungen; `masteryPassed || completed` ist gleichwertig.

**OPT-04 – Tests.** Siehe B2. Dein `.tmp/all-lessons-gate-audit.cjs` liegt als
`tests/browser/lesson-gates.browser.cjs` im Repository (Pfade angepasst, Logik
unverändert). Das ist ein erster Schritt zu deiner offenen Aufgabe
„Regressionstestsuite aus den `.tmp`-Tests ableiten“.

**OPT-05 – `theme-boot.js`.** Läuft ohne `defer` vor den Stylesheets und setzt
`data-theme`, `data-background`, `data-text-tone`, `data-text-size`. Vorher
setzten das erst die nachgeladenen Skripte; bei hellem Schema blitzte auf jeder
Seite kurz die dunkle Vorgabe auf. Ohne gespeicherten Lernstand folgen die
Lernseiten jetzt wie die Startseite `prefers-color-scheme` (vorher immer dunkel).

**OPT-06 – Antworten mischen.** In 20 von 27 Einheiten lauten die richtigen
Antworten der Reihe nach b, c, a; die erste Frage ist in 25 Einheiten b, nie a.
Wer das Muster kennt, besteht ohne Lesen. `lesson-core.js` mischt die
Antwortmöglichkeiten jeder Frage bei jedem Seitenaufruf. HTML, `value`-Werte
und Hinweise sind unverändert. Keine Antwort bezieht sich auf die Position einer
anderen (geprüft per Suche).

**OPT-20 – XP.** Ersetzt wurden nur Angaben zum Lernstand („100 Punkte“,
„0 von 100 Punkten“, „Abschluss und Punkte“, „… Punkte nötig“, „vergibt keine
Punkte“). Fachliche Punkte bleiben: Toto-Punkte, Datenpunkte, Punktdiagramm.
Der ältere Versionsverlauf in `index.html` ist unverändert. **Falls deine
`.tmp`-Tests auf das Wort „Punkte“ prüfen, schlagen sie jetzt fehl** und
brauchen „XP“; Claude hat sie nicht angefasst.

**OPT-15 – Versionsparameter.** Jeder lokale Skript- und Style-Verweis endet auf
`?v=<APP_VERSION>`; zwei Node-Tests erzwingen das. Bei jedem Release den
Parameter in allen 28 Seiten mit anheben.

**OPT-23 – Bonusaufgaben (0.12.0).** Jede der 27 Einheiten hat eine freiwillige
Vertiefungsaufgabe für Excel mit eigenen, erfundenen Daten (nicht aus dem
BPE1-Paket). `bonus-tasks.js` enthält je Einheit Titel, Situation, Tabelle,
Schritte, Frage, Kontrollwert, Toleranz und Hinweis. `lesson-core.js` baut
daraus den Abschnitt „Bonus · Vertiefung“ direkt vor dem Verständnis-Check und
prüft den eingegebenen Kontrollwert (deutsche Zahlschreibweise, Einheit
erlaubt). Richtig gelöst: einmalig 50 XP, gespeichert als
`progress[lessonId].bonus = true`. Der Bonus ist unabhängig vom Abschluss der
Einheit, braucht keine Lehrkraftbestätigung und bleibt bei einer Rücknahme des
Abschlusses erhalten.

- Speicherschema bleibt Version 1; `bonus` ist ein zusätzliches Feld.
  `normalizeProfile`, `getLessonProgress` und `writeLessonProgress` in `app.js`
  führen es mit. Ältere Sicherungen ohne das Feld laden unverändert.
- XP = abgeschlossene Einheiten × 100 + gelöste Bonusaufgaben × 50, höchstens
  4050. Level weiter je 500 XP (`xp.js`). `exportedBy.points` enthält den Bonus.
- Weil XP jetzt nicht mehr nur aus Abschlüssen entstehen, nennen gesperrte
  Einheiten keine XP-Schwelle mehr („600 XP nötig“), sondern die Einheit, die
  zuerst abzuschließen ist. `requiredPoints` wird nicht mehr angezeigt.
- `tests/bonus.test.js` rechnet alle 27 Kontrollwerte unabhängig nach.
- **Bitte fachlich gegenlesen:** Aufgabenstellungen und Hinweise stammen von
  Claude und sind nicht im Unterricht erprobt. Die Kontrollwerte stehen wie die
  Antworten der Verständnis-Checks lesbar im Quelltext.

**Kontrast-Messwerkzeug.** `tests/browser/contrast.browser.cjs` misst Textkontraste
in 450 Ansichten (2 Schemata × 5 Hintergründe × 5 Schriftfarben × 9 Seiten).
Ergebnis am 10. Oktober: im dunklen Schema keine Fundstelle; im hellen Schema
78 messbare Stellen unter 4,5 : 1, meist kleine grüne Akzentschrift
(`--green: #188a55` auf Weiß 4,3 : 1, auf den Hintergründen Graphit und Violett
3,3 : 1) und `--text-soft` auf getönten Hintergründen (3,5 : 1). Schrift auf
Verlaufs- und Metallflächen kann das Werkzeug nicht messen. Claude hat **keine
Farben geändert**, weil das die Gestaltung berührt (A2); siehe OPT-19.

### A4 Prüfstand

- `node --test`: 287 Prüfungen bestanden (Stand 0.13.0).
- `tests/browser/site.browser.cjs`: jetzt neun Einzelprüfungen, darunter
  Bonusaufgabe, Wiederöffnen ohne Verlust und Download der Rettungskopie.
- Online gegen <https://jakobsawazki.github.io/excel-lab/>: Abschluss-Audit
  27 Einheiten / 83 Fragen an 0.11.0 bestanden; Seitentest an 0.11.0 mit dem
  oben genannten einen Befund; an 0.11.1 (`548012e`, Pages-Lauf 37985437922)
  Seitentest vollständig bestanden, dazu der Abschluss-Audit für L1.1, L2.5,
  L3.4 und L4.8.
- `tests/browser/lesson-gates.browser.cjs`: 27 Einheiten, 83 Fragen bestanden
  (Ausgangsmessung vor dem Umbau, danach nach OPT-01, nach OPT-06 und am Stand 0.11.0).
- `tests/browser/site.browser.cjs`: 28 Seiten bei 1440 und 390 Pixeln, dazu
  fünf Einzelprüfungen bestanden.
- Startseite und L1.2 im Browser angesehen (dunkles Schema).
- **Nicht geprüft:** deine
  übrigen 76 `.tmp`-Tests, Schul-PCs, andere Browser als Edge, Bildschirmleser,
  helles Schema und Darstellungsoptionen nur automatisch (kein Sichtvergleich),
  die Arbeit in Excel selbst.

### A5 Übergabeprotokoll

- Claude schreibt in `documentation/claude2codex.md`, Codex in
  `documentation/codex2claude.md` und in der Projektdokumentation.
- Jeder Punkt hat eine feste ID (`OPT-xx`); Commits nennen sie.
- Ein Thema pro Commit. Fremde uncommittete Änderungen nicht überschreiben. Nie `--force`.
- Claude testet auf Port 4273. Auf 4199 lief während Claudes Arbeit ein fremder
  Server (WorkbenchLab); Claude hat ihn nicht angefasst.

## Teil B – Projektwissen

### B1 Dateikarte

| Datei | Inhalt | von |
| --- | --- | --- |
| `index.html`, `app.js`, `home.css`, `organizer.js` | Startseite, Lernpfad, Formelsammlung, Profile, Speichern/Laden | Codex; `app.js` mit OPT-03 |
| `content.js` | 4 Lernschritte, 27 Einheiten, 20 Formeln | Codex |
| `l1-1.html` … `l4-8.html` | Lernseiten | Codex; je zwei Skriptzeilen Claude |
| `lesson-core.js` | Ablauf aller Lernseiten | Claude, aus deinem Code zusammengeführt |
| `l1-1.js` … `l4-8.js` | Antworten, Hinweise, Demo der Seite | Codex, gekürzt von Claude |
| `theme-boot.js` | Farbschema und Darstellung vor dem Zeichnen | Claude |
| `lehrkraft.html`, `lehrkraft.js`, `lehrkraft.css` | Klassenübersicht für Lehrkräfte | Claude |
| `nav-menu.js` | Lernpfad-Menü: Aufbau und Bedienung für alle Seiten | Claude, aus deinem Code zusammengeführt |
| `bonus-tasks.js` | 27 freiwillige Vertiefungsaufgaben mit Kontrollwert | Claude |
| `lesson-navigation.js`, `lesson-workspace.js`, `xp.js`, `options.js`, `developer-mode.js`, `deployment.js`, `formula-lab.js` | Navigation, Abschnitte, XP, Darstellung, Vorschau, Materialverweise, Formel-Demo | Codex |
| `styles.css`, `lesson-workspace.css`, `formula-lab.css`, `l4-*.css` | Gestaltung | Codex |
| `tests/*.test.js`, `tests/helpers.cjs` | Node-Tests ohne Pakete | Claude |
| `tests/browser/*.browser.cjs` | Browsertests (Edge über Playwright) | Abschluss-Audit Codex, Seitentest Claude |

Speicherschlüssel: `excelLab.state.v1` (Lernstand), `excelLab.state.rescue.v1`
(neu, Rettungskopie), `excelLab.device.v1`, `excelLab.appearance.v1`,
`sessionStorage["excelLab.developerPreview"]`.

### B2 Befehle

```powershell
node --test                                   # 287 Prüfungen, ohne Pakete
python -m http.server 4273 --bind 127.0.0.1
node tests/browser/site.browser.cjs http://127.0.0.1:4273/
node tests/browser/lesson-gates.browser.cjs http://127.0.0.1:4273/ all          # rund 5 Minuten
node tests/browser/lesson-gates.browser.cjs http://127.0.0.1:4273/ all l1-1,l2-3
node tests/browser/contrast.browser.cjs http://127.0.0.1:4273/                  # Messwerkzeug, rund 2 Minuten
node tests/browser/a11y.browser.cjs http://127.0.0.1:4273/
node tests/browser/run-all.cjs http://127.0.0.1:4273/                           # alle Browsertests, rund 15 Minuten
```

Playwright wird nicht installiert. Die Browsertests nehmen den Pfad aus
`EXCEL_LAB_PLAYWRIGHT`, sonst deine Laufzeit unter
`C:/Users/PC/.cache/codex-runtimes/…/node_modules/playwright`.

### B3 Regeln, die die Tests jetzt erzwingen

1. Neue Lernseite: Eintrag in `content.js` mit `page`, Seite `lX-Y.html`, Skript
   `lX-Y.js` mit `ExcelLabLesson.start({ id: "lX-Y", … })`.
2. Skriptreihenfolge der Lernseiten: `theme-boot.js` (ohne `defer`, vor den
   Stylesheets), dann mit `defer` … `content.js` … `lesson-core.js`, `lX-Y.js`.
3. Kennungen der Seite folgen dem Präfix: `#l21-mastery-form`,
   `#l21-mastery-status`, `#l21-mastery-section`, ab der zweiten Einheit auch
   `#l21-content`, `#l21-access`, `#l21-access-message`.
4. Jede Frage: `fieldset.mastery-question[data-mastery-question="name"]`, Radios
   mit `name="name"`, darin die richtige Antwort aus `masteryAnswers`, ein
   Hinweis in `masteryHints`, ein `.mastery-feedback`. Die `label` müssen direkte
   Geschwister von `.mastery-feedback` sein, sonst wird nicht gemischt.
5. Die Zahl der `[data-page-check]` einer Seite muss `checks.length` in
   `content.js` entsprechen. `app.js` kürzt gespeicherte Checks beim Laden auf
   diese Länge; mehr Checks auf der Seite gingen beim Import verloren.
6. `#next-lesson-link` zeigt auf die nächste Einheit, der Zugangshinweis auf die vorige.
7. Bilder: `width`/`height` wie die Datei, `alt` vorhanden.
8. `APP_VERSION` in `app.js`, oberster Eintrag im Versionsverlauf, „Aktueller
   Release“ in der README und „Projektversion“ in der Dokumentation stimmen überein;
   alle Skript- und Style-Verweise tragen `?v=<Version>`.
9. Keine Originalmaterialien, Office-Dateien, `.tmp/` oder `desktop.ini` im Git-Index.

## Teil C – Offene Punkte für Codex

### C1 Übersicht

| ID | Titel | Status |
| --- | --- | --- |
| OPT-01 | Gemeinsamer Ablauf der Lernseiten | erledigt (Claude) |
| OPT-02 | Fotos verlustfrei als WebP | erledigt (Claude) |
| OPT-03 | Rettungskopie | erledigt (Claude); Ausbau siehe OPT-16 |
| OPT-04 | Tests im Repository | erster Schritt erledigt (Claude); Rest OPT-08 |
| OPT-05 | Farbschema vor dem Zeichnen | erledigt (Claude) |
| OPT-06 | Antworten mischen | erledigt (Claude); bitte fachlich gegenlesen |
| OPT-07 | Release 0.11.0/0.11.1 und Veröffentlichung | erledigt (Claude, Auftrag Jakob) |
| OPT-08 | Übrige `.tmp`-Tests ins Repository, `.tmp/` aus Drive | 28 gültige Skripte übernommen (Claude, 10.10.); Leeren von `.tmp/` bei Jakob oder Codex |
| OPT-09 | Quellenabgleich L3–L4 | maschineller Abgleich erledigt (Claude, 0.12.1): zwei fehlende Aufgaben ergänzt; Feinabgleich je Aufgabe offen |
| OPT-10 | Rücknahme eines Abschlusses | erledigt (Claude, 0.13.0): Weg c, siehe A0c |
| OPT-11 | Profile sammeln sich an; kein Profilwechsel | teilweise erledigt (Claude, 0.18.1): Laden ersetzt dieselbe Person; Aufräumen alter Profile offen |
| OPT-12 | Navigation doppelt vorhanden | erledigt (Claude, 0.14.0): `nav-menu.js` |
| OPT-13 | Ungenutzter Code und ungenutzte Styles | erledigt (Claude, 0.13.1 und 0.19.1); nur die Felder `keyPoints`, `steps`, `tip` in `content.js` sind geblieben |
| OPT-14 | Veröffentlicht wird das ganze Repository | entschieden (Claude, von Jakob überlassen): bleibt so |
| OPT-15 | Versionsparameter an Skripten und Styles | erledigt (Claude, 0.11.0) |
| OPT-16 | Rettungskopie herunterladbar machen | erledigt (Claude, 0.13.0) |
| OPT-17 | Dokumentation gliedern | README gestrafft, `CHANGELOG.md` angelegt (Claude, 10.10.); `documentation.md` weiter ungeteilt |
| OPT-18 | Lernsituationsbilder für weitere Einheiten | offen (Vorgabe Jakob vom 07.10.) |
| OPT-19 | Barrierefreiheit, Kontrast, Tastatur als Tests | Kontrast im hellen Schema verbessert (0.13.0); Namen, Überschriften, ARIA und Tab-Reihenfolge als Test ohne Befund (0.13.1); echter Bildschirmleser offen |
| OPT-20 | „Punkte“ und „XP“ | erledigt (Claude, 0.11.0): XP |
| OPT-21 | Lehrkraftbestätigung und Klassenübersicht | Klassenübersicht erledigt (Claude, 0.15.0); Absicherung der Bestätigung weiter Entscheidung Jakob |
| OPT-22 | `.git/refs/desktop.ini` | Hinweis |
| OPT-23 | Bonusaufgaben mit Extra-XP | erledigt (Claude, 0.12.0); fachlich gegenlesen |

### C2 Die Punkte im Einzelnen

#### OPT-07 Release 0.11.0 und Veröffentlichung

- **Vor dem Push:** Branch übernehmen, `APP_VERSION`, Versionsverlauf in
  `index.html`, README und Kopf der Dokumentation auf 0.11.0 (der Node-Test
  erzwingt den Gleichstand), alle drei Testbefehle aus B2.
- **Achtung beim Veröffentlichen:** GitHub Pages lässt Seiten und Skripte bis zu
  zehn Minuten im Browser. Wer in dieser Zeit eine alte Lernseite mit dem neuen
  `lX-Y.js` lädt, hat kein `lesson-core.js`; die Seite bleibt dann ohne Ablauf.
  Deshalb nicht während des Unterrichts veröffentlichen. OPT-15 verhindert das künftig.
- **Online prüfen:** dein Release-Test (28 Seiten, Assets, keine privaten
  Materiallinks) und der Abschluss-Audit gegen die veröffentlichte Adresse.

#### OPT-08 Übrige `.tmp`-Tests ins Repository

- **Befund:** `.tmp/` enthält 77 Testskripte, 228 Bildschirmfotos und 6
  Python-Dateien, zusammen 49 MB, und wird von Google Drive synchronisiert. Die
  Tests stehen nicht im Repository; alle laden Playwright über einen festen Pfad.
- **Vorschlag:** die allgemeinen Tests (Navigation, Speichern/Laden,
  Startseiten-Abgleich, Organizer, Standortzeile, Inhalts- und Übungstests je
  Einheit) nach `tests/browser/` übernehmen, Pfad wie in den beiden vorhandenen
  Dateien, Bildschirmfotos nach `%TEMP%\excel-lab-tests`. Danach `.tmp/` mit
  Jakobs Freigabe leeren. Extrahierte Originalbilder (`.tmp/*-source-images`,
  `*-media`) gehören nicht ins Repository.
- **Nicht übernommen von Claude:** alles außer dem Abschluss-Audit, weil Claude
  die übrigen Tests nicht gelesen hat.

#### OPT-09 Quellenabgleich L3–L4 (Auftrag Jakob vom 10. Oktober)

- **Vorgehen:** Alle 90 DOCX- und XLSX-Dateien aus `Lernfortschritt_3` und
  `Lernfortschritt_4` als Text ausgelesen (nur gelesen, nichts verändert, nichts
  veröffentlicht). Je Einheit die in `content.js` zugeordneten Dateien mit
  Seite und Skript verglichen: Welche Zahlen und Begriffe der Aufgabe stehen
  auf der Lernseite? Dazu die Aktivitätsverfolgungen L3 und L4 gegen die
  Zuordnung geprüft. Die Videos (`.mp4`) wurden nicht gesichtet.
- **Ergebnis – fehlte ganz, jetzt ergänzt (0.12.1):**
  `L3_3.3 Vertiefungsaufgabe SVerweis-Funktion Teil 1` (KFZ-Steuer; in der
  Aktivitätsverfolgung als PA geführt) und `L3_3.4 … Teil 2` (PLZ-Suche, WA).
  Sie waren weder einer Einheit zugeordnet noch auf einer Seite erwähnt. Jetzt
  in `l3-6.html` als Abschnitte `#l36-kfz-section` und `#l36-plz-section` vor
  dem Verständnis-Check, mit Zellplan, Länderfaktoren, Hubraumstaffel und einem
  Auszug der Kennzeichenliste aus der Vorlage. Für die PLZ-Suche steht ein
  eigener Auszug mit sechs Orten auf der Seite, weil das vollständige
  Verzeichnis nur in der lokalen Vorlage liegt. Die Aufgaben geben das Muster
  der ersten Formel vor und lassen die übrigen entwickeln; Kontrollbeträge
  werden nicht genannt (Rückrechnung wie in deinen Seiten). Die fünf Dateien
  sind in `content.js` und im Quellenabschnitt von L3.6 eingetragen.
- **Vorhanden:** alle übrigen Aufgaben. Toto Teil 1 (Tabellenpunkte) steht in
  L3.4, Teil 2 und 3 in L3.3; L4.3 verwendet wie die Aufgabe nur die Reihe
  Schwimmen; L4.4 nennt die Eingaben, bewusst nicht die Ergebnisbeträge; L4.7
  verwendet aus der Umsatzauswertung die Orte, die Kundenart wird erklärt.
- **Nicht zugeordnet, aber inhaltlich abgedeckt (nicht einzeln geprüft):** die
  Informationsblätter zu SVERWEIS, ISTNV, RUNDEN, Verweistabelle,
  Zielwertsuche, zu allen Diagrammen und `L4_2 Zusammenfassung zu
  Diagrammtypen`. Sie fehlen in `content.js` als Download; ob jede Aussage
  daraus auf den Seiten steht, ist nicht Satz für Satz verglichen.
- **Auffällig:** In der Aktivitätsverfolgung L3 steht
  `L3_4.1 Tabellenvorlage Urlaubsplanung.xlsx`; die Datei gibt es im
  Materialordner nicht. Die Teilnehmerliste der Skiausfahrt meldete der
  maschinelle Vergleich als fehlend; sie steht aber als Tabelle in L3.1
  (nachgesehen), L3.2 und L3.3 bauen auf derselben Datei auf. Solche
  Fehlmeldungen des Vergleichs sind möglich; Treffer wurden einzeln geprüft.
- **Grenzen:** Der Vergleich ist maschinell und prüft Vorhandensein, nicht
  didaktische Gleichwertigkeit. L1 und L2 hast du am 4. Oktober direkt
  abgeglichen; Claude hat sie nicht erneut geprüft. Die neuen Abschnitte in
  L3.6 sind nicht im Unterricht erprobt; in Excel nachgerechnet am
  10. Oktober (A0j). Die Staffelwerte stammen aus der Vorlage.

#### OPT-10 Rücknahme wirkt nur eine Einheit weit

- **Befund:** Wird der Abschluss von L2.1 zurückgenommen, setzt die Seite
  `completed` von L2.2 auf falsch. L2.3 und alles danach bleiben abgeschlossen,
  zählen weiter XP und gelten als offen, weil abgeschlossene Einheiten immer
  offen sind. Verhalten unverändert aus deinem Code übernommen
  (`save` in `lesson-core.js`).
- **Nebenwirkung:** Hatte die Folgeeinheit einen Abschluss aus der Zeit vor den
  Verständnis-Checks (kein `masteryPassed` gespeichert), verliert sie mit dem
  Abschluss auch den bestandenen Check.
- **Möglichkeiten:** (a) lassen und den Hinweistext anpassen; (b) alle späteren
  Abschlüsse zurücknehmen – dann löscht ein Fehlklick in L1.1 bis zu 26
  Abschlüsse, also nur mit Rückfrage; (c) nichts Fremdes zurücknehmen und die
  Folgeeinheit nur sperren, solange die Vorgängerin offen ist.
- **Empfehlung Claude:** c. Kein Datenverlust, klare Regel. **Frage an Jakob.**

#### OPT-11 Profile

- **Befund:** „Laden“ legt jedes Mal ein neues Profil an und macht es aktiv
  (`importProgress`). Angezeigt wird nur das aktive Profil; wechseln lässt sich
  außerhalb des Entwickler-Modus nicht (der Knopf `data-switch-profile` wird
  nirgends mehr erzeugt). Frühere Profile bleiben mit Kürzel und Klasse
  unsichtbar im Browser.
- **Folge an gemeinsam genutzten Geräten:** Die nächste Person sieht das Profil
  der vorigen. Ein neues Profil gibt es nur im Entwickler-Modus; wer stattdessen
  das Kürzel ändert, übernimmt den fremden Fortschritt.
- **Vorschlag:** beim Laden ein vorhandenes Profil mit gleichem Kürzel und
  gleicher Klasse nach Rückfrage ersetzen; nicht aktive Profile entfernen oder
  wieder wählbar machen; „Abmelden“ für gemeinsam genutzte Geräte.
- **Frage an Jakob:** Arbeiten die Lernenden an Geräten mit eigener
  Windows-Anmeldung (dann ist der Browser je Person getrennt) oder an gemeinsamen Konten?

#### OPT-12 Navigation doppelt

Erledigt in 0.14.0, siehe A0e.

#### OPT-13 Ungenutzter Code und ungenutzte Styles

- **Lektionsdialog:** Alle 27 Einheiten haben `page`. `openLesson` verlässt die
  Funktion deshalb immer vor dem Dialog; `updateOpenLessonCheck`,
  `updateOpenLessonTeacherCheck`, `toggleOpenLessonComplete`, `#lesson-dialog`
  und die Felder `keyPoints`, `steps`, `tip`, `downloads` in `content.js` werden
  nicht mehr erreicht. `checks` wird noch gebraucht (Regel B3.5), `formulas`
  und `tags` für die Suche.
- **Styles ohne Treffer in HTML und JS** (Klassennamen per Suche, bitte einzeln
  prüfen): in `styles.css` unter anderem `monitor-shell`, `monitor-camera`,
  `monitor-stand`, `workbook-window`, `workbook-bar`, `formula-bar`,
  `mini-sheet`, `sheet-tabs`, `chapter-grid`, `chapter-card`, `chapter-top`,
  `chapter-number`, `chapter-state`, `chapter-footer`, `next-section`,
  `next-card`, `page-downloads`, `content-section`, `dialog-hint`,
  `complete-button`; in `home.css` `home-topline`, `home-next`. Die Suche meldet
  auch Klassen, die `options.js` zusammensetzt (`option-background-*`); die sind
  in Gebrauch.
- **Vorsicht:** nur entfernen, was sichtbar nichts ändert (A2). Vorher und
  nachher Bildschirmfotos beider Schemata vergleichen.

#### OPT-14 Veröffentlicht wird das ganze Repository

- **Befund:** GitHub Pages liefert alles aus `main` aus: die sechs PNG-Originale
  (10,9 MB), `assets/buttons/*.png` (2,7 MB, seit 0.4 von keiner Seite geladen),
  `documentation/` mit beiden Übergabedateien, `tests/`, `scripts/`.
  Geladen wird davon nichts; es ist aber öffentlich abrufbar.
- **Vorschlag:** wie in WorkbenchLab (`tools/build-site.cjs`) nur eine Liste von
  App-Dateien veröffentlichen. Braucht eine GitHub-Action statt „aus Branch
  bereitstellen“. Die Bildoriginale bleiben im Repository.
- **Entschieden (9. Oktober):** Jakob hat es Claude überlassen; ihm ist wichtig,
  dass der aktuelle Stand immer online steht. Es bleibt bei der Bereitstellung
  aus `main`: Ein Push genügt, es gibt keinen Bauschritt, der ausfallen kann.
  Die zusätzlich abrufbaren Dateien enthalten nichts Vertrauliches.

#### OPT-15 Versionsparameter

Skripte und Styles werden ohne `?v=` eingebunden. Vorschlag: bei jedem Release
`?v=<Version>` an alle lokalen Skript- und Style-Verweise der 28 Seiten, dazu ein
Node-Test für den Gleichstand mit `APP_VERSION`. Am besten zusammen mit OPT-07.

#### OPT-16 Rettungskopie herunterladbar

Die Kopie aus OPT-03 liegt nur im Browser-Speicher. Vorschlag: im Profildialog
ein Knopf „Rettungskopie herunterladen“, sichtbar nur, wenn eine vorliegt.

#### OPT-17 Dokumentation gliedern

- **Befund:** `documentation/documentation.md` hat 3886 Zeilen und 260 KB; der
  Taskstatus allein rund 840 Zeilen. Abschnitt 6 nennt als Dateien nur
  `index.html`, `l1-1.html`, `app.js`, `l1-1.js`; Abschnitt 9 „sechs
  JavaScript-Dateien“. Die README führt die Änderungen des 4. Oktober als
  Fließtext über 80 Zeilen und listet in der Projektstruktur Seiten nur bis L3.1.
- **Vorschlag wie in WorkbenchLab:** `CHANGELOG.md` mit einem Absatz je Release,
  erledigte Übergaben H-01 bis H-70 nach `documentation/archiv/`, README auf
  Zweck, Start, Tests, Datenschutz kürzen.
- **Warum Abstimmung:** Es sind deine Dateien. Claude hat in der README nur die
  Projektstruktur und einen Abschnitt „Tests“ ergänzt.

#### OPT-18 Lernsituationsbilder

Laut Taskstatus vom 7. Oktober sollen neue Lernsituationen wie L1.1 ein
motivierendes Bild, eine kurze Situation und einen Auftrag erhalten. Bisher hat
nur L1.1 eines. Für neue Bilder gilt A2: PNG-Original behalten, daneben
verlustfreies WebP in gleicher Auflösung, `width`/`height` wie die Datei, Prompt
in der Dokumentation. Umwandeln und prüfen:

```python
from PIL import Image, ImageChops
im = Image.open("bild.png"); im.save("bild.webp", "WEBP", lossless=True, quality=100, method=6)
assert ImageChops.difference(im, Image.open("bild.webp").convert(im.mode)).getbbox() is None
```

#### OPT-19 Barrierefreiheit als Tests

In der Dokumentation offen: Tastatur, Bildschirmleser, WCAG. WorkbenchLab hat
dafür Browsertests (vorlesbare Namen, Überschriftenebenen, Kontrast 4,5 : 1 in
beiden Schemata und allen Darstellungsoptionen, Überlauf bei 320 bis 1280
Pixeln, Tastaturfallen, gesperrter Speicher). Sie lassen sich mit wenig Aufwand
übertragen. Excel-Lab hat 5 Hintergründe × 5 Schriftfarben × 2 Schemata; der
Kontrast dieser 50 Kombinationen ist nicht gemessen.

#### OPT-20 „Punkte“ und „XP“

Lernpfad, Lernseiten und Meldungen sprechen von „100 Punkten“, der Kopfbereich
und sein Dialog von „XP“. Beides ist derselbe Wert. **Frage an Jakob:** ein Begriff?

#### OPT-21 Lehrkraftbestätigung und Klassenübersicht

Wie in WorkbenchLab kann den Haken „Lehrkraft hat bestätigt“ jede Person selbst
setzen; die Antworten der Verständnis-Checks stehen lesbar in `lX-Y.js`. Ohne
Server lässt sich das auf dem Schülergerät nicht absichern. In WorkbenchLab gibt
es dafür eine Klassenübersicht (`lehrkraft.html`), die Sicherungsdateien einliest;
Jakobs Entscheidung zur Absicherung steht dort noch aus (WorkbenchLab OPT-09).
Für Excel-Lab erst danach sinnvoll.

#### OPT-22 `.git/refs/desktop.ini`

Google Drive legt `desktop.ini` in `.git/refs/` ab; jeder Git-Befehl warnt
„ignoring broken ref“. Bisher bricht nichts. Claude hat die Dateien nicht gelöscht.

### C3 Was bei Jakob liegt

1. Durchsicht der veröffentlichten Fassung 0.13.0: die 27 Bonusaufgaben, die
   Abschnitte KFZ-Steuer und PLZ-Suche in L3.6, das Wiederöffnen (A0c) und das
   helle Farbschema. Was nicht gefällt, lässt sich einzeln zurücknehmen.
2. Freigabe für neue Lernsituationsbilder (OPT-18); Claude kann keine Bilder erzeugen.

### C4 Bekannte Schwächen in Claudes Teilen

- `lesson-core.js` setzt die Kennungen aus B3.3 voraus und bricht ab, wenn
  `#lXY-mastery-form` fehlt. Der Node-Test fängt das vor dem Browser ab.
- Das Mischen (OPT-06) verhindert das Auswendiglernen der Position, nicht das
  Durchprobieren; der Check ist wiederholbar.
- Die Rettungskopie ist nur über die Entwicklerwerkzeuge des Browsers erreichbar (OPT-16).
- `theme-boot.js` hält den Seitenaufbau für die Dauer einer kleinen Datei an.
  Fehlt sie, setzen die bisherigen Skripte das Schema wie zuvor.
- Die verlustfreien WebP-Dateien sparen 35 Prozent, nicht mehr. Kleinere Dateien
  gäbe es nur mit Qualitätsverlust; das ist ausgeschlossen (A2).
- `tests/browser/site.browser.cjs` prüft das Überlaufen nur bei zwei Breiten und
  nur im dunklen Schema.
