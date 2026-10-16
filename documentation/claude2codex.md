# claude2codex.md – Übergabe von Claude an Codex (Excel-Lab)

Stand: 2026-10-16 · Release 0.31.0 (veröffentlicht) · Grundlage: 0.10.1 (`5e1a758`) · Autor: Claude

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

### A0za Release 0.20.2: Profildialog

`#certificate-link` und `#rescue-button` sind jetzt so breit wie die Reihe
„Speichern“/„Laden“ (vorher schmal und linksbündig). Die Dialoge Profil, XP
und Darstellung wurden in beiden Schemata angesehen; die Perlmetall-Buttons
aus 0.20.0 passen auch dort.

### A0zb Release 0.20.3: Lernseiten auf dem Handy

`.lesson-workspace-actions` ist bei schmaler Breite ein zweispaltiges Raster
statt vier gestapelter Knöpfe (`lesson-workspace.css`). Handy-Ansicht (390 px)
von Startseite und Lernseite in beiden Schemata angesehen; sonst unauffällig.

### A0zc Release 0.20.4: Kontrast nach den Design-Releases

`node tests/browser/contrast.browser.cjs` nach 0.20.0 bis 0.20.3 ausgewertet:

- **Nebenwirkung von 0.20.0 behoben:** Die Kurzschreibweise `background:` hatte
  `background-color` von `body` auf durchsichtig gesetzt. Sichtbar war das
  nicht, der Bericht maß aber gegen Weiß (184 Meldungen). Jetzt steht
  `background-color: var(--bg)` in beiden Regeln; der Bericht ist wieder
  aussagekräftig.
- **Echte Schwäche behoben:** `.stage-badge` und `.lesson-code` nutzen die
  Stufenfarbe aus `content.js`, die für dunkle Flächen gewählt ist. Im hellen
  Schema lag der Kontrast bei 1,9 : 1; jetzt wird die Farbe dort mit einem
  dunklen Ton gemischt (Block „Feinschliff 0.20.4“ am Ende von `styles.css`).
- **Offen (14 Stellen, 3,8 bis 4,5 : 1):** `.starter-copy code` bei hellem
  Violett, `.tag` und `.formula-principle span` bei dunklem Graphit,
  Stepper-`small` bei dunklem Sand, `.eyebrow span` und Listenziffern bei
  hellem Graphit. Alles Kleinschrift knapp unter der Schwelle.

### A0zd Release 0.20.5: Kleinschriften

Die in A0zc offenen 14 Stellen sind erledigt (Block „Feinschliff 0.20.5“ am
Ende von `styles.css`): `.tag`, `.lesson-stepper small`,
`.formula-principle span` und `.summary-icon small` mischen `--text-faint`
mit `--text-soft`; im hellen Schema sind `.eyebrow span`, Häkchen,
Listenziffern, `.starter-copy code` und der Bonus-Abschnittsindex leicht
abgedunkelt. `contrast.browser.cjs`: 450 Ansichten, keine messbare Stelle
unter dem Mindestkontrast; 24 Stellen auf Verlaufsflächen kann das Werkzeug
nicht messen (weiße Schrift auf Metall-Grün, Profil-Kürzel, Quellennummern).

### A0ze Testläufer: Wiederholung und Zeitlimit (ohne Versionssprung)

Am 10. Oktober war der Rechner zeitweise so langsam, dass
`lesson-gates.browser.cjs` in das Zeitlimit lief und `release-smoke.cjs` einmal
`ERR_CONNECTION_TIMED_OUT` vom lokalen Server bekam; einzeln wiederholt
bestanden beide. `tests/browser/run-all.cjs` deshalb angepasst:

- Zeitlimit je Testdatei 900 s statt 600 s, änderbar mit
  `EXCEL_LAB_TEST_TIMEOUT` (Sekunden).
- Scheitert eine Datei an Zeitlimit oder Verbindungsfehler, wird sie einmal
  wiederholt; die Zeile trägt dann „(zweiter Versuch)“, am Ende steht die
  Anzahl der Wiederholungen. Andere Fehler werden nicht wiederholt.
- Besteht eine Datei regelmäßig erst im zweiten Versuch, bitte als echten
  Fehler behandeln, nicht als Umgebung.
- Bei einem Fehlschlag schreibt der Läufer die vollständige Ausgabe nach
  `%TEMP%\excel-lab-tests\<Testdatei>.fehler.log` und nennt den Pfad. Anlass:
  Im Sammellauf für 0.20.7 schlug `site.browser.cjs` einmal mit einer
  Browser-Fehlermeldung fehl, von der nur das Ende sichtbar war; direkt davor
  und danach bestand die Datei allein. **Ursache ungeklärt.** Ebenso offen:
  `l47-content-smoke.cjs` meldete im Lauf für 0.20.6 einmal „unbekannte
  Lerneinheit l4-7“ und bestand danach dreimal. Beides trat nur auf dem stark
  ausgelasteten Rechner auf; falls es wiederkommt, steht die Meldung jetzt im
  Protokoll.
- Neuer Node-Test in `tests/site.test.js` (jetzt 298 Tests): Die Regeln für
  den mehrschichtigen Seitenhintergrund müssen nach `background:` ein
  `background-color` setzen (Fehler aus 0.20.0, siehe A0zc).

### A0zf Release 0.20.6: Informationsblätter L3/L4 Aussage für Aussage

Schließt den in OPT-09 offenen Punkt „nicht einzeln geprüft“. Gelesen (nur
lesend) wurden die elf Informationsblätter aus `Lernfortschritt_3`, die
sieben aus `Lernfortschritt_4` und `L4_2 Zusammenfassung zu Diagrammtypen`.
Bilder und Bildschirmfotos in den Blättern wurden nicht ausgewertet, nur der
Text.

- **Fachlich vorhanden:** WENN mit Bedingung/Dann/Sonst und Struktogramm
  (L3.1), geschachtelte WENN mit der Grenze 12 (L3.2), SUMMEWENN mit Bereich,
  Suchkriterium, Summe_Bereich und festen Bezügen (L3.3), bedingte
  Formatierung über „Regeln verwalten“ (L3.4), SVERWEIS mit Suchkriterium,
  erster Spalte und Spaltenindex, ISTNV mit WENN (L3.5), RUNDEN,
  unsortierte Verweistabelle, Bereich_Verweis WAHR/FALSCH mit nächstkleinerem
  Wert (L3.6), Zielwertsuche über die Was-wäre-wenn-Analyse (L3.7);
  Diagrammbestandteile, Kategorien- und Größenachse, Formatvorlagen (L4.1),
  Balken (L4.2), Linie mit „Daten auswählen“ und horizontalen
  Achsenbeschriftungen, getrennte Bereiche mit Strg (L4.3), Kreis mit
  Anteilen am Ganzen (L4.4), gruppierte Säulen (L4.5), Punktdiagramm,
  Trendlinie, Gleichung und Bestimmtheitsmaß (L4.6).
- **Ergänzt (nur Bezeichnungen, je ein bis zwei Sätze):**
  `l3-2.html`: Funktionsassistent „Funktion einfügen“ (fx), Kategorie
  „Datum & Zeit“; `l4-1.html`: „Empfohlene Diagramme“, „Alle Diagramme“,
  die drei Schaltflächen Plus, Pinsel, Trichter; `l4-6.html`: „Punktwolke“,
  „Regressionsgerade“, die Häkchen „Formel im Diagramm anzeigen“ und
  „Bestimmtheitsmaß im Diagramm darstellen“.
- **L1 und L2 ebenfalls gelesen** (neun Informationsblätter und dein PDF
  `L1.1_Informations_und_Aufgabenblatt_Tabellenentwurf.pdf`; dessen fünf
  Getränke, Preise und Mengen stehen unverändert auf `l1-1.html`). Dein
  Abgleich vom 4. Oktober hält: fachlich vollständig. Ergänzt:
  `l1-3.html` „An Zellengröße anpassen“; `l1-5.html` Eingabeteil,
  Ausgabeteil und „Tabellenrumpf“ als zweites Wort für Tabellenkörper;
  `l2-2.html` Spalten und einzelne Zellen einfügen (Rückfrage nach unten/nach
  rechts, Formatübernahme) und der Fehlerwert `#WERT!`, wenn ein
  mitgewanderter Bezug auf Text trifft.
- **Bewusst nicht übernommen:** der Hinweis der Zusammenfassung, Kreisdiagramme
  wirkten in 3-D ansprechender. Deine Seiten raten begründet von 3-D ab
  (verzerrte Anteile); das bleibt so. Bitte mit Jakob klären, falls die
  Quelle hier Vorrang haben soll.
- **Nicht geprüft:** die Kategoriebezeichnung im Funktionsassistenten der an
  der Schule installierten Excel-Version; der Text nennt deshalb beide
  üblichen Schreibweisen.

### A0zg Release 0.20.7: Glossar mit 33 Einträgen

Die in 0.20.6 auf den Seiten ergänzten Begriffe stehen jetzt auch im Glossar
(`content.js`, `glossary`): Funktionsassistent (L3.2), Fehlerwert (L2.2),
Tabellenkopf und Tabellenrumpf (L1.5), Bereich_Verweis (L3.6), Punktwolke und
Regressionsgerade (L4.6). Der Node-Test prüft wie bisher, dass jeder Begriff
auf seiner Einheit vorkommt; `tests/browser/site.browser.cjs` erwartet 33
statt 26 Einträge. Vor der Veröffentlichung liefen wegen des langsamen
Rechners nur `site.browser.cjs` und `release-smoke.cjs` lokal, nicht der
ganze Sammellauf; geändert wurden nur `content.js` und dieser Test.

### A0zh Release 0.20.8: Hinweis bei fehlenden Inhaltsdaten

Nachgegangen: die Meldung „unbekannte Lerneinheit l4-7“ aus dem Testlauf für
0.20.6. Die Skripte laufen mit `defer` in fester Reihenfolge; die Meldung kann
nur entstehen, wenn `content.js` gar nicht geladen wurde. Auf dem überlasteten
Rechner hat der lokale Server offenbar eine Anfrage fallen lassen. Dasselbe
kann im Schulnetz passieren, und dann blieb die Lernseite gesperrt, ohne dass
Lernende erfahren, warum.

- `lesson-core.js`: `start()` prüft zuerst, ob Inhaltsdaten da sind. Fehlen
  sie, füllt `showLoadProblem()` den Zugangskasten (`#lXY-access`, auf L1.1
  ein neuer Abschnitt) mit Überschrift, Erklärung und „Seite neu laden“,
  setzt `role="alert"` und `data-load-problem` und schreibt eine Zeile in die
  Konsole. Eine unbekannte Kennung bei vorhandenen Daten wirft weiter.
- `tests/browser/site.browser.cjs`: neue Einzelprüfung blockiert `content.js`
  auf L1.1 und L4.7, erwartet den Hinweis ohne unbehandelten Fehler und nach
  „Seite neu laden“ die normale Seite.
- `app.js`: derselbe Hinweis auf der Startseite (vorher `throw`, die Seite
  blieb halb leer); die Einzelprüfung deckt `index.html` mit ab.
- **Quellenkarten (Hinweis Jakob vom 10. Oktober, mit Bildschirmfoto):**
  `.source-number` war absolut positioniert und ragte mit normaler
  Zeilenhöhe in die erste Textzeile der Karte „03“. Jetzt `line-height: 1`,
  in `.source-stack` 2,5 rem groß, und die Überschriften der beiden kleinen
  Karten halten rechts 4,4 rem Abstand. Bei 1536, 1100 und 390 px in beiden
  Schemata nachgemessen: keine Überschneidung von Nummer und Text mehr.
  Abgesichert durch die achtzehnte Einzelprüfung in
  `tests/browser/site.browser.cjs` („Übersicht und Quellen“): Symbole mittig
  und ohne Schriftzeichen, Kartennummern berühren keinen Text, Link zur
  Klassenübersicht nur unter „Quellen“; jeweils bei 1536, 1100 und 390 px.
  Sammellauf für 0.20.8 danach: 31 von 31 Testdateien bestanden.
- **Neuer Browsertest `tests/browser/overlap.browser.cjs`:** sucht auf 33
  Ansichten (vier Ansichten der Startseite, Klassenübersicht, Lernnachweis,
  27 Lernseiten, alle Abschnitte geöffnet) bei 1536, 1024 und 390 px nach
  absolut platzierten Elementen mit eigenem Text, die fremde Textzeilen
  überdecken. Stand 0.20.8: 0 Überschneidungen. Gegenprobe: Mit dem alten CSS
  der Kartennummer meldet er „03“ über dem Absatz. Er läuft im Sammellauf mit
  (jetzt 32 Testdateien). Grenzen: nur dunkles Schema, nur absolut platzierte
  Elemente mit Text; Überläufe, abgeschnittener Text und reine
  Schmuckelemente (`::before`/`::after`) erkennt er nicht.
- **Aufklapp-Symbole (Hinweis Jakob, mit Bildschirmfotos):** „+“ und „−“ in
  `.home-disclosure-symbol` waren Schriftzeichen und saßen nicht mittig;
  Jakob wünscht außerdem schönere Zeichen. Jetzt zwei gezeichnete Balken
  (`::before`, `::after`, je 14 × 2 px, absolut auf 50 %/50 %) in einem
  38-px-Knopf mit Verlauf und Schatten; geöffnet blendet der senkrechte
  Balken aus. Block am Ende von `home.css`, deine Regeln davor unverändert.
- **Klassenübersicht (Wunsch Jakob):** Link aus `.footer-links` entfernt;
  neuer Abschnitt `.teacher-section` am Ende von `#view-sources` in
  `index.html` mit Knopf „Klassenübersicht öffnen“ (Styles am Ende von
  `styles.css`). Jakob fand die Idee gut, den Platz im Fuß aber unpassend;
  die Wahl „Quellen“ stammt von Claude und ist nicht mit ihm abgestimmt.
- **Weiter ungeklärt:** der einmalige Fehlschlag von `site.browser.cjs` im
  Sammellauf für 0.20.7 (Meldung nicht erhalten). Der Läufer schreibt seither
  ein vollständiges Protokoll (A0ze).
- **Nicht abgedeckt:** Klassenübersicht und Lernnachweis ohne
  `content.js`; andere fehlende Skripte.

### A0zi Release 0.20.9: Streifen über dem Seitenfuß

Jakobs Bildschirmfotos sind rund 1830 px breit; geprüft hatte Claude bis
dahin höchstens 1536 px. Deshalb alle vier Ansichten der Startseite bei
1830 px angesehen. Befund: `#view-dashboard` hat eine eigene deckende
Hintergrundfläche; der untere Außenabstand (2 rem) des letzten
`.home-lab-disclosure` fiel durch Zusammenfallen der Abstände aus dieser
Fläche heraus. In dem 32 px hohen Streifen bis zum Seitenfuß war der
Seitenhintergrund mit dem Zellraster aus 0.20.0 zu sehen, sonst auf der
Übersicht nirgends. Behoben mit `#view-dashboard { padding-bottom: 2.5rem; }`
am Ende von `home.css`; nachgemessen: Unterkante der Ansicht = Oberkante des
Seitenfußes. Lernpfad, Formelsammlung und Quellen haben keine eigene Fläche
und waren nicht betroffen. Die 14 Arten kleiner Felder mit Zeichen (Häkchen,
Nummern, Kürzel, Abzeichen) wurden vergrößert angesehen: alle mittig.

### A0zj Release 0.20.10: Klassenübersicht, Seitenfuß

Bei 1830 px auch `l1-2.html`, `lehrkraft.html` und `nachweis.html` angesehen.
Lernseite und Lernnachweis unauffällig. `lehrkraft.html` (Seite von Claude
aus 0.15.0): Ohne eingelesene Dateien ist der Inhalt kürzer als das Fenster;
der Seitenfuß stand deshalb mitten auf dem Bildschirm, ohne Abstand zur
Statuszeile. Jetzt `.teacher-page` als Spalten-Flex mit `min-height: 100vh`,
`main` wächst und hält 4 rem Abstand nach unten (nur `@media screen`, der
Druck bleibt unverändert). Versionsnummern sind ab hier zweistellig in der
letzten Stelle (0.20.10); die Node-Tests kommen damit zurecht.

### A0zk Release 0.21.0: NAGOLD im Profil (Auftrag Jakob vom 11. Oktober)

Jakob: „Du weißt ja, wie wir das beim Projekt WorkbenchLab mit den NAGOLD in
dem Profil-Bereich gemacht haben. Lass uns das auch so in Excel-Lab machen.“
Vorlage war dein Stand in WorkbenchLab (`nagold.js`, Tabellen-Dialog in
`app.js`, Abschnitte „NAGOLD im Profilbutton“ und „NAGOLD-Tabelle“ der
dortigen Dokumentation). Übernommen sind die Regeln, nicht der Code der
Oberfläche (Excel-Lab hat keine Lucide-Symbole und mehrere Profile).

- **`nagold.js`** (neu, auf allen 30 Seiten direkt nach `content.js`):
  `window.EXCEL_LAB_NAGOLD` mit `maxPoints` 5, `normalizeEntries`,
  `entriesFor(profile)`, `total(profile)`, `addLessonEntry(profile, lesson,
  date, time)`, `today()`, `clock()`, `presetOptions()`. Grenzen wie bei dir:
  160 Zeichen Anlass, echte Kalendertage, HH:MM, 1 bis 5 ganze Punkte,
  1000 eigene Zeilen plus 27 Einheiten.
- **Speicherort:** `profile.nagoldEntries` im bestehenden Lernstand
  (`excelLab.state.v1`), Zeilen `{ date, time, purpose, points, lessonId? }`.
  `normalizeProfile` in `app.js` füllt das Feld beim Laden; die
  Speicherdatei enthält es im Profil und die Summe in `exportedBy.nagold`.
  **Abweichung von WorkbenchLab:** Die Formatnummer bleibt 1. Excel-Lab weist
  jede andere Nummer zurück; eine Erhöhung hätte alle bisherigen
  Speicherdateien unlesbar gemacht. Folge: Eine Seite, die noch mit einer
  Version vor 0.21.0 geöffnet ist, würde die Tabelle beim Speichern
  verwerfen. Bitte gegenprüfen, ob du das anders lösen willst.
- **Alte Lernstände:** ohne Feld je abgeschlossener Einheit eine Zeile mit
  5 NAGOLD, Datum und Uhrzeit „Nicht erfasst“. Eine ausdrücklich leere
  Tabelle bleibt leer.
- **Abschluss einer Einheit** (`lesson-core.js`): bucht einmalig 5 NAGOLD mit
  Datum und Uhrzeit des Geräts; `lessonId` verhindert die zweite Buchung nach
  „wieder öffnen“. Meldung: „… abgeschlossen: 100 XP und 5 NAGOLD.“
  Bonusaufgaben bringen weiterhin nur XP.
- **Oberfläche:** Profilknopf zeigt „Profil · n NAG“ in Gold (nur Startseite,
  auf dem Handy mit dem übrigen Text ausgeblendet). Im Profil-Dialog der Knopf
  `#nagold-total`; er öffnet `#nagold-dialog` mit Tabelle (Datum, Uhrzeit,
  Wofür, NAGOLD), Plus, Stift oder Doppelklick, Minus, Summe und „Speichern“.
  Schließen verwirft den Entwurf. Styles im Block „NAGOLD (0.21.0)“ am Ende
  von `styles.css`, Goldton `--nagold`.
- **Lehrkraft:** `lehrkraft.js` zeigt die Summe je Person als Spalte NAGOLD
  (auch in der CSV), `nachweis.html` als viertes Zahlenfeld.
- **Tests:** `tests/nagold.test.js` (acht Tests), neunzehnte Einzelprüfung in
  `tests/browser/site.browser.cjs` (Tabelle bedienen, Abbruch, Grenzen,
  HTML-Sicherheit, Abschluss bucht einmal, Lernnachweis, Speicherdatei,
  Klassenübersicht). Angesehen: Profil, Tabelle und Kopfzeile dunkel und hell
  bei 1500 px, Tabelle dunkel bei 390 px.
- **Nicht übernommen:** deine separate Bestätigungsliste der Lehrkraft
  (WorkbenchLab OPT-09, `workbenchlab-teacher-reviews-v1`). Die
  Klassenübersicht zeigt hier nur die gemeldete Summe.
- **Annahmen von Claude, von Jakob nicht ausdrücklich bestätigt:** 5 NAGOLD
  je Einheit wie in WorkbenchLab (dort 21 Einheiten = 105, hier 27 = 135);
  dieselben fünf Vorauswahl-Anlässe; Anzeige nur auf der Startseite.

### A0zl Release 0.21.1: Speicherstand hinter dem Disketten-Symbol

Jakob (11. Oktober, mit Bildschirmfoto des Profilfensters): „Statt dem
Speichern und Laden im Profil-Fenster wünsche ich mir lieber ein
Diskette-Icon links vom Profil-Icon. Und über dieses Icon öffnet sich dann ein
Fenster und darüber kann man dann seinen Speicherstand speichern und laden.“

- `index.html`: Knopf `#save-button` (`.icon-button.save-button`, Diskette als
  Linien-SVG) direkt vor `#profile-button`; neues Fenster `#save-dialog` mit
  Statuszeile `#save-status`, `#export-button`, `#import-button`,
  `#rescue-button` und `#import-file`. Die Kennungen sind unverändert, die
  Elemente nur umgezogen. Im Profilfenster bleiben Kürzel, Klasse, NAGOLD und
  Lernnachweis; die Unterzeile heißt „Dein lokales Lernprofil“.
- `xp.js`, `options.js`: fügen ihre Knöpfe vor `#save-button` ein, falls es
  ihn gibt, damit die Diskette direkt links vom Profil bleibt.
- `app.js`: `#save-button` öffnet das Fenster; `renderProfileManager()` füllt
  die Statuszeile. Nach dem Laden bleibt das Fenster offen und zeigt den neuen
  Stand. Export und Import selbst sind unverändert.
- Nur Startseite, wie bisher: Auf den Lernseiten gab es Speichern und Laden
  auch vorher nicht.
- Sehr schmale Handys (bis 350 px): Abstand der Kopfknöpfe und Schriftzug
  etwas kleiner, damit „Excel-Lab“ einzeilig bleibt. Gemessen bei 320, 340,
  360 und 390 px: kein Überlauf, keine Überdeckung.
- Tests angepasst: `tests/browser/codex/save-load-smoke.cjs` (öffnet das neue
  Fenster, prüft, dass das Profil die Knöpfe nicht mehr enthält; dein Ablauf
  sonst unverändert), drei Stellen in `tests/browser/site.browser.cjs`.

### A0zm Release 0.22.0: XP im Profilknopf, Tooltips, „Zuletzt gespeichert“

0.21.1 (A0zl) wurde nicht einzeln veröffentlicht, sondern zusammen mit diesem
Stand. Drei Nachrichten von Jakob vom 11. Oktober, jeweils mit Bildschirmfoto:

**1. XP ins Profil.** „Lass uns die XP-Punkte bzw. den Level in das
Profil-Icon einbinden … links von den NAGOLD-Punkten sollen die XP angezeigt
werden. Der Text ‚Profil‘ kann weg. Wenn man auf sein Profil klickt, erfährt
man mehr über seine XP, wie viel noch erreicht werden muss, um auf den
nächsten Level zu kommen und damit NAGOLD zu erhalten. Das vorherige XP-Icon
kann dann weg.“

- `xp.js` neu geschrieben: kein Knopf `#xp-button` mehr. Die Datei füllt im
  Profilknopf die Zeile `#profile-stats` (`#profile-xp` mit `.xp-count`,
  `#profile-nagold`); ohne Profil bleibt die bisherige Beschriftung
  (`.profile-label`). Unter 760 px, wo dein CSS `.profile-copy` ausblendet,
  zeigt `.profile-mini` den XP-Stand neben dem Kürzel-Feld.
- Einzelheiten (`#xp-total`, `#xp-level`, `#xp-next`, `#xp-progress`,
  `#xp-breakdown`, neu `#xp-nagold`): auf der Startseite als Abschnitt
  `#xp-panel` im Profilfenster direkt unter der Profilkarte; auf den
  Lernseiten weiter im Fenster `#xp-dialog`, das sich jetzt beim Klick auf
  `#lesson-profile-link` öffnet (mit Knopf „Profil und Speicherstand öffnen“
  zur Startseite). Ohne Profil führt der Link wie bisher zur Startseite.
- `app.js` setzt NAGOLD-Anzeige und Titel des Profilknopfs nicht mehr selbst.
- **Offene Fachfrage an Jakob:** Sein Satz verknüpft das nächste Level mit
  NAGOLD. Umgesetzt ist weiterhin die Regel aus WorkbenchLab: 5 NAGOLD je
  abgeschlossener Einheit, unabhängig vom Level. Der Abschnitt nennt deshalb
  beides getrennt („Noch n XP bis Level …“ und „Die nächsten 5 NAGOLD gibt es
  für den Abschluss von Lx.y“). Falls NAGOLD an Level hängen sollen, ist das
  eine Regeländerung in `nagold.js` und `lesson-core.js`.

**2. Tooltips.** „Die Informationen unten für Speichern und Laden würde ich
nur als Tooltip zeigen.“ Die Liste `.save-dialog-notes` ist entfernt; jeder
Knopf sitzt in `.tip-wrap` mit `<span role="tooltip">` und `aria-describedby`.
Sichtbar beim Darüberfahren und bei `:focus-visible`, nicht nach einem
Mausklick und nicht auf reinen Touch-Geräten.

**3. Zuletzt gespeichert.** „… ein Drop-Down-Menü, um die letzten 5 zuletzt
gespeicherten Dateien auszuwählen, wie zuletzt verwendet.“ Eine Webseite kann
Dateien im Download-Ordner nicht selbst wieder öffnen. Umgesetzt ist deshalb:
`exportProgress()` legt neben dem Download eine Kopie des Speicherstands unter
`excelLab.saves.v1` ab (höchstens fünf, neueste zuerst). `#recent-saves`
listet sie mit Zeit, Kürzel, XP und NAGOLD; `#recent-load` lädt den gewählten
Stand über `applyImportedPayload()`, dieselbe Prüfung und Rückfrage wie beim
Laden einer Datei (aus `importProgress()` herausgelöst). Die Liste gilt nur
für diesen Browser und dieses Windows-Konto; der Hinweis steht darunter.
**Jakob bitte bestätigen,** dass diese Lösung gemeint war. Die Alternative
wären gemerkte Dateizugriffe (File System Access API mit IndexedDB und
Berechtigungsabfrage je Sitzung); das wurde nicht gebaut.

**Tests.** `site.browser.cjs`: Profilknopf statt XP-Symbol (auch bei 390 px),
XP-Übersicht auf der Lernseite, Tooltip erst beim Darüberfahren, Liste erst
nach dem ersten Speichern, Wiederherstellen aus der Liste, höchstens fünf
Einträge, XP-Abschnitt im Profil. `codex/l1-path-smoke.cjs` liest die XP aus
`#profile-xp`. Angesehen bei 1500 px dunkel und hell sowie 390 und 320 px.
Die Styles `.xp-button`, `.xp-count`, `.xp-label` in `styles.css` sind jetzt
teilweise ungenutzt und nicht entfernt.

### A0zn Release 0.22.1: schlankes Profilfenster, NAGOLD-Tabelle wie WorkbenchLab

Vier Nachrichten von Jakob vom 11. Oktober nach 0.22.0, jeweils mit
Bildschirmfoto. Sein Grundsatz dabei: „Ich würde da nicht so viel Text rein
machen, das verwirrt die Schüler … wenn, nur über Tooltips.“ und „Keep it
simple.“ Bitte bei künftigen Fenstern für Lernende beachten.

- **Breiter, ohne Rollbalken:** `#manager-dialog` ist 900 px breit. Neue Hülle
  `.manager-grid` mit `.manager-main` (Profilkarte, XP-Abschnitt) und
  `.manager-side` (Kürzel, Klasse, NAGOLD, Lernnachweis); unter 820 px
  einspaltig. Gemessen ohne Rollbalken bei 1830×920, 1500×800, 1280×680 und
  390×844.
- **Wenig Text im XP-Abschnitt** (`xp.js`, `panelMarkup`): sichtbar sind
  `#xp-total`, `#xp-level`, `#xp-progress` und `#xp-next` („Noch n XP bis
  Level n“). `#xp-breakdown` und `#xp-rule` sind Tooltips an XP-Zahl und
  Level (`.tip-wrap`, `role="tooltip"`, per Tab erreichbar). Der Hinweis auf
  die nächsten NAGOLD steht als Tooltip `#nagold-tip` am NAGOLD-Knopf, auf den
  Lernseiten an einem NAGOLD-Feld `#xp-nagold-chip` im Fenster `#xp-dialog`.
- **Profilkarte:** nur Kürzel, Klasse und „n/27 erledigt“. Browser-ID, XP,
  NAGOLD und „Aktiv“ sind entfernt; die Browser-ID bleibt in der
  Speicherdatei.
- **NAGOLD-Tabelle:** Jakob: „alles so wie es auch in der WorkbenchLab in der
  NAGOLD-Tabelle ist“. Übernommen aus dem dortigen Stand vom 11. Oktober:
  kombiniertes Feld `.nagold-combo` (Textfeld mit `role="combobox"`, Liste
  `role="listbox"`, Logik `nagoldCombo` in `app.js`), `minPoints` −5, 0 ist
  kein Eintrag, neue Zeile beginnt bei 0, Fehlermeldung wie dort. Abweichung:
  Die Liste richtet sich nach dem Platz im Dialog statt im Browserfenster,
  weil der Dialog sie sonst abschneidet.
- **Tests:** `tests/nagold.test.js` (Abzüge, 0 ungültig), `site.browser.cjs`
  (ein Feld ohne `select`, Filtern und Auswählen, Meldung, Abzug in der Summe,
  Tooltips erst beim Darüberfahren, Profilkarte ohne Zusatzangaben,
  Profilfenster ohne Rollbalken).

### A0zo Release 0.22.2: Profilfenster neu geordnet, X im Lernnachweis

Jakob (11. Oktober, mit zwei Bildschirmfotos und Skizze): „Das Profil soll
oben angezeigt werden. Die Bereiche für XP und NAGOLD sollen möglichst gleiche
Höhe haben. Wenn man auf Lernnachweis klickt, kann man nicht wieder zurück …
oben rechts ein X.“ Danach: „Statt rechts ‚Einträge‘ einfach ein Stiftsymbol
… in derselben goldenen Farbe wie NAGOLD.“

- `index.html`, `#manager-dialog`: Reihenfolge jetzt Titel, `#profile-list`,
  `#profile-edit-form` (zwei Felder nebeneinander), `.manager-panels` mit
  `#xp-slot` und `#nagold-total`, `#certificate-link`. Die Hüllen
  `.manager-grid`/`.manager-main`/`.manager-side` aus 0.22.1 und die
  Unterzeile sind entfernt. `xp.js` hängt `#xp-panel` in `#xp-slot`.
- `#nagold-total` ist ein Feld mit Titel „Deine NAGOLD“, Münze, Summe und
  `.nagold-edit-icon` (goldener Stift). Beide Felder strecken sich im Raster
  auf dieselbe Höhe; gemessen je 156 px bei 1830, 1500 und 1280 px Breite.
  Unter 720 px stehen sie untereinander.
- `nachweis.html`: Link `#certificate-close` (X oben rechts in der Karte).
  `nachweis.js` setzt beim Klick `sessionStorage["excelLab.openProfile"]`;
  `init()` in `app.js` liest und löscht den Merker und öffnet das
  Profilfenster. Im Druck ist das X ausgeblendet.
- Nebenbei: Die Meldung zur Rettungskopie verweist auf das Disketten-Symbol
  statt auf „Profil › Laden“.
- Tests in `site.browser.cjs`: Reihenfolge und gleiche Höhe der Felder,
  Rückweg aus dem Lernnachweis, Merker verbraucht.

### A0zp Release 0.23.0: Navigation ohne „Übersicht“

Jakob (11. Oktober): „Der Navigationspunkt ‚Übersicht‘ ist irgendwie
redundant … wenn man oben links auf das Excel-Lab-Logo klickt, gelangt man ja
auch zur Übersicht. Besser wäre es, wenn man oben links bei BPE1 › Übersicht
oder so als Navigationsübersicht macht.“

- `index.html`: Knopf `data-view="dashboard"` aus `.main-nav` entfernt. Die
  Ansicht und die Route `#uebersicht` bleiben; erreichbar über Logo,
  „BPE1“ in der Pfadzeile und alle bisherigen Links.
- `lesson-navigation.js`: derselbe Link aus der Leiste der Lernseiten
  entfernt; „BPE1“ im Pfad trägt den Titel „Zur Übersicht“.
- `app.js`, `renderLocationPath()`: auf der Übersicht „BPE1 › Übersicht“
  (letzter Eintrag `aria-current="page"`), sonst wie bisher „BPE1 › …“.
- `styles.css`: Im Dock bis 600 px spannt `.nav-dropdown` (Lernpfad) die
  erste Zeile; darunter Formelsammlung und Quellen. Deine Regeln davor sind
  unverändert.
- Angesehen bei 1500, 390 und 320 px. Auf dem Handy führt nur noch das Logo
  und „BPE1“ zur Übersicht.

### A0zq Release 0.24.0: Release-Stand für deine Änderungen, eine NAGOLD-Tabelle

Jakob am 16. Oktober: „Codex und ich haben bereits weiter daran gearbeitet.
Setze bitte als Ziel, dass du daran autark weiter arbeitest.“ Ausgangslage:
deine Commits `97ad313` bis `97132cb` (12.–15. Oktober), alle unter der
Versionsnummer 0.23.0. Der Versionsparameter `?v=` an Skripten und Styles
blieb dadurch gleich, obwohl sich `xp.js`, `lesson-workspace.js`,
`styles.css` und andere geändert hatten; Browser konnten bis zu zehn Minuten
die alten Dateien verwenden. **Bitte bei jeder Veröffentlichung, die Skripte
oder Styles ändert, die Version erhöhen** (Regel in A1/B, Node-Tests prüfen
die Gleichheit, nicht die Erhöhung).

**Gesamtlauf auf deinem Stand vom 15. Oktober** (vor meinen Änderungen):
306 Node-Tests bestanden; Browser 28 von 32. Ursachen:

- drei veraltete Tests: `codex/l1-path-smoke.cjs` (L1.2 hat fünf Fragen),
  `codex/l13-l14-transfer-smoke.cjs` (L1.3 verweist auf `l1-1.html`),
  `site.browser.cjs` (Lernseiten öffnen jetzt `#manager-dialog`, nicht
  `#xp-dialog`). Angepasst, Kommentare in den Dateien.
- ein echter Befund in `a11y.browser.cjs`: auf allen 27 Lernseiten zeigte
  `aria-controls` des NAGOLD-Knopfs auf `#lesson-nagold-dialog`, das erst
  beim Klick entstand.

**Eine NAGOLD-Tabelle (`nagold-table.js`, neu).** Deine Lernseiten-Fassung in
`xp.js` war eine zweite, einfachere Tabelle: Schriftzeichen „✎“/„×“ statt
gezeichneter Symbole, Browser-`datalist` statt des Felds „Wofür“ wie in
WorkbenchLab, Datum als „2026-10-11“. Jakob hat ausdrücklich gezeichnete
Symbole und „alles so wie in der WorkbenchLab-NAGOLD-Tabelle“ gewünscht.
Jetzt legt `nagold-table.js` beim Laden ein Fenster `#nagold-dialog` an
(dieselben Kennungen wie bisher auf der Startseite) und bietet
`window.ExcelLabNagoldTable.open({ entries, save, returnFocus })`.
`save(entries)` gibt `false` zurück, wenn die Seite nicht speichern konnte;
dann erscheint die Meldung im Fenster. Startseite (`app.js`,
`bindNagoldEvents`) und Lernseiten (`xp.js`, `openLessonNagold` mit deinem
`writeProfile`) rufen nur noch das Modul auf. Das statische Fenster in
`index.html` ist entfernt. Eingebunden direkt nach `nagold.js` auf Startseite
und allen Lernseiten.

**Weitere Korrekturen.**
- `styles.css`: `.nagold-table-wrap` ohne eigenen Rollbereich. Bisher wurde
  er beim Öffnen der Vorschlagsliste aufgehoben; auf dem Handy quoll die
  Tabelle dann über Summe und „Speichern“ (auch auf der Startseite).
- `lesson-save.js`, `normalizeProfile`: ohne `window.EXCEL_LAB_NAGOLD`
  bleiben die NAGOLD-Zeilen der Datei erhalten (bisher `[]`, wie in `app.js`
  schon abgesichert).
- Neue Einzelprüfung „NAGOLD auf der Lernseite“ in `site.browser.cjs`
  (jetzt zwanzig).

**L1.2 und L1.1 in Excel nachgerechnet (nach 0.24.0, ohne Versionssprung).**
Neues Skript `tests/excel/verify-workshop-in-excel.ps1` baut deinen
Kundenworkshop genau mit den Zelladressen der Seite auf (A4:C8, D4:D9,
B11/B12, D13, B15, D16, B18, D19) und rechnet per COM in Excel 16: Grundwerte
(Materialsumme 168 €, Bestellkosten 166 €, Restbudget 34 €, 5,53 € pro
Teilnehmer), die drei Änderungstests mit Zurückstellen, die beiden
Ablenker von Frage 4 (170 € und 186 €) und die Transferaufgabe
Eintrittskarten (12,60 €/7,40 €, danach 18,00 €/2,00 €). Dazu dein
L1.1-Budget: 105,32 € Gesamtkosten, 44,68 € Reserve bei 150 €, mit zwei
Flaschen Cola mehr 108,12 €. **29 von 29 Prüfungen bestanden.** Das
Lösungsheft außerhalb des Repositorys (`../Lehrkraft/Excel-Lab-Loesungen.md`)
ist mit `node tools/build-loesungen.cjs` neu erzeugt (85 Fragen).

**Feste Prüfung für dein `lesson-save.js`** (nach 0.24.0, ohne
Versionssprung): Deine Tests dafür waren temporär und liegen nicht im
Repository. Neue Einzelprüfung in `site.browser.cjs` (jetzt
einundzwanzig): Symbol neben `#lesson-theme-toggle`, Statuszeile,
Dateiname und Inhalt der Speicherdatei, „Zuletzt gespeichert“, Rückfrage bei
weniger Abschlüssen mit Abbruch, ungültige Datei, Wiederherstellen aus der
Liste mit NAGOLD und unveränderter Profilkennung, dieselbe Liste auf der
Startseite. Kontrastbericht nach deinen Änderungen: 450 Ansichten, keine
messbare Stelle unter 4,5 : 1.

**0.24.1: verwaiste Styles entfernt.** In `styles.css` gelöscht:
`.xp-button`, `.xp-label`, `.xp-dialog` (Breite, Fortschrittsbalken, Regel)
und alle `.nagold-total-hint`-Regeln; aus fünf weiteren Selektoren der
Teil `.xp-dialog …`. Keine dieser Klassen kommt in HTML oder Skripten noch
vor (geprüft per Suche über alle `.html`, `.js`, `.cjs`). `.xp-count` und
`.xp-summary` bleiben, sie werden im Profilknopf und im XP-Abschnitt
verwendet.

**Hinweise zu deinem Code, nicht geändert.** `lesson-save.js` dupliziert
Export und Import aus `app.js` (eigene Normalisierung, eigene XP-Berechnung).
Beides stimmt derzeit überein; bei künftigen Änderungen am Dateiformat bitte
beide Stellen anpassen oder zusammenführen.

### A0zr Release 0.25.0: NAGOLD-Tabelle auf dem Stand von WorkbenchLab 0.48.0

Jakobs Vorgabe vom 11. Oktober für Excel-Lab: NAGOLD „so wie in WorkbenchLab“,
die Tabelle „alles so wie in der WorkbenchLab-NAGOLD-Tabelle“. Seitdem hat
WorkbenchLab bis 0.48.0 (15. Oktober, dein Release) weitere Vorgaben von
Jakob umgesetzt. Abgeglichen mit `WorkbenchLab/nagold.js`, `app.js`
(`autosaveNagold`, `readNagoldInput`, Combo) und dem Abschnitt 0.48.0 der
dortigen Dokumentation.

**Übernommen** (betrifft nur die Tabelle):
- `nagold.js`: `minPoints` −10 (Jakob 11.10.: „bis −10 für besonders schwere
  Fälle, z. B. Manipulation“), Vorauswahl beginnt mit „Anwesenheit“,
  `attendancePoints` 2.
- `nagold-table.js`: automatisches Speichern wie `autosaveNagold`: gültige
  Zeilen und Löschungen sofort über `save(entries)`, letzter gültiger Stand je
  Zeile in `savedRows`, unvollständige neue Zeilen werden nicht gespeichert,
  Hinweistext wie in WorkbenchLab. Kein Knopf „Speichern“ mehr
  (`#nagold-save-button` entfällt), Enter speichert, Schließen nimmt nichts
  zurück. „Anwesenheit“ füllt 2 NAGOLD vor. Scrollen in der Liste schließt
  sie nicht (deine Korrektur `event.target.closest(".nagold-combo-list")`).
- Startseite: `save` rendert nur noch das Profilfenster (kein `renderAll`,
  kein Hinweis je Tastendruck); Lernseiten: `writeProfile` wie bisher.
  `aria-label` des NAGOLD-Felds: „n NAGOLD: Tabelle bearbeiten“.

**Nicht übernommen, Rückfrage an Jakob:**
- *Startkapital* (einmalig 5 NAGOLD, `nagoldStartCapitalClaimed`): schenkt
  Punkte und verändert damit die Bewertung; offen, ob das auch in Excel-Lab
  gelten soll und ob es je Lab oder nur einmal je Schuljahr gilt.
- *Jahresziel* 100 NAGOLD = 100 % = Note 1: In Excel-Lab ergeben allein die
  27 Einheiten 135 NAGOLD (WorkbenchLab: 21 Einheiten = 105). Das Ziel lässt
  sich nicht ohne Jakobs Festlegung übertragen.

**Tests:** `tests/nagold.test.js` (−10, „Anwesenheit“, sechs Anlässe),
`site.browser.cjs`: Ablauf mit automatischem Speichern (unvollständig, 6,
−11, −10, Summe −5, Anwesenheit, Schließen, leere Zeile, HTML, Doppelklick,
unvollständige Korrektur, sofortiges Löschen) und Lernseite ohne Knopf.

### A0zs Release 0.25.1: Profilfenster der Lernseiten geprüft

Dein Profilfenster auf den Lernseiten (`xp.js`, 14. Oktober) hatte nur deine
temporären Tests. Neue Einzelprüfung in `site.browser.cjs`: öffnet sich statt
des Seitenwechsels, gleiche Anordnung wie die Startseite, ungültiges Kürzel
wird nicht gespeichert, gültige Änderung (Kleinschreibung, Klasse in
Großbuchstaben, Mehrfach-Leerzeichen zusammengezogen) erreicht Speicher und
Kopfzeile, Fortschritt und andere Profile bleiben unverändert, Profilwechsel
in einem anderen Fenster schreibt nichts auf das falsche Profil.

Dabei gefunden: Dein Schutz in `writeProfile` greift, die Meldung „Das Profil
hat sich geändert“ wurde aber sofort von `renderLessonProfile` gelöscht
(`status("")` beim Umschalten der Felder). Jetzt zeigt `renderLessonProfile`
beim Umschalten „Ein anderes Profil ist jetzt aktiv. Die Felder zeigen seine
Angaben.“ Beim Öffnen des Fensters bleibt der Hinweis leer.

**Klassenübersicht: NAGOLD-Einträge ansehen** (`lehrkraft.js`, `lehrkraft.css`).
Die NAGOLD-Zahl je Person ist ein Knopf `.teacher-nagold-button`; er öffnet
`#teacher-nagold-dialog` mit den bereinigten Zeilen (`nagoldEntries` aus
`EXCEL_LAB_NAGOLD.entriesFor`), Sicherungsdatum, Zahl der automatischen
Zeilen und Summe. Nur lesend, alle Texte über `textContent`; Abzüge rot.
Bewusst kein Bestätigen wie in WorkbenchLab (OPT-09 dort): Das wäre eine
Bewertungsregel und bleibt Jakobs Entscheidung. Test im NAGOLD-Ablauf von
`site.browser.cjs`.

**0.25.2:** Im Einträge-Fenster der Klassenübersicht fehlten auf dem Handy
die Spaltennamen (`data-label` für die gestapelte Ansicht der
`.nagold-table`), die Summe war grau (`.dialog p` überschrieb die Farbe).
Einleitung von `lehrkraft.html` nennt jetzt Disketten-Symbol und NAGOLD.
Geprüft mit `site`, `a11y`, `overlap`, `path-link-layout-audit` und
`release-smoke` (nur `lehrkraft.*` und Dokumentation geändert).

**Testserver `tools/serve.cjs` (neu).** Am 16. Oktober lieferte
`python -m http.server` eine CSS-Datei in über einer Sekunde aus; die Tests
liefen ins Zeitlimit. `node tools/serve.cjs [Ordner] [Port]` (Vorgabe:
Projektordner, 4273) liest jede Datei einmal und liefert sie aus dem
Speicher, auch direkt aus Google Drive in 30–50 ms. Nur 127.0.0.1, keine
versteckten Ordner (`.git` → 403), Bereichsanfragen für Videos. Nach
Dateiänderungen neu starten. Zusätzlich war ein Windows-Prozess
(TextInputHost) dauerhaft bei einem vollen Kern; der Sammellauf brauchte
trotzdem ein Vielfaches der üblichen Zeit (`EXCEL_LAB_TEST_TIMEOUT=1500`).

### A0zt Release 0.26.0: ein Kern für Speichern und Laden

In A0zq hatte ich angemerkt, dass dein `lesson-save.js` Export und Import aus
`app.js` dupliziert. Jetzt zusammengeführt in `save-core.js`
(`window.ExcelLabSave`), eingebunden auf Startseite und allen Lernseiten
direkt nach `nagold-table.js`, also vor `app.js` und `lesson-save.js`:

- `normalizeProfile(profile, previous)` (bisher in `app.js`, auch für den
  Speicherstand im Browser), `xp`, `completedCount`, `deviceId`, `createId`
- `buildPayload(profile, appVersion)`, `fileName(payload)`,
  `download(profile, appVersion)` (Datei, Download, „Zuletzt gespeichert“)
- `recentSaves()`, `remember()`, `describeSave(item)` (Text der Auswahl)
- `mergeImport(state, payload, confirm)` → `"loaded"` / `"cancelled"`,
  wirft bei ungültiger Datei; dieselbe Person wird ersetzt, Rückfrage bei
  weniger Abschlüssen.

`app.js`: `normalizeProfile`, `loadDeviceIdentity`, `exportProgress`,
`recentSaves`, `renderRecentSaves`, `applyImportedPayload` delegieren an den
Kern; `rememberSave` und die Schlüsselkonstanten entfallen. Ohne
`save-core.js` zeigt die Startseite denselben Hinweis „Seite nicht vollständig
geladen“ wie ohne `content.js`. `lesson-save.js` (138 → 98 Zeilen): deine
Oberfläche, Meldungen, `readState` und der Schutz vor unlesbarem Lernstand
bleiben; Export, Liste, Bereinigung und Import kommen aus dem Kern.
`appVersion` in Dateien von Lernseiten fällt ohne `?v=` auf „unbekannt“ statt
auf eine feste Versionsnummer zurück.

Tests: `tests/save-core.test.js` (Bereinigung, XP, Datei und Dateiname,
Kennung, Liste mit fünf Einträgen, Laden mit Ersetzen/Rückfrage/neuer Person,
ungültige Dateien, Reihenfolge der Skripte); Browser wie bisher
(`codex/save-load-smoke.cjs`, beide Speicherprüfungen in `site.browser.cjs`).
**Bitte künftige Änderungen am Dateiformat nur noch in `save-core.js`.**

### A0zu Feinabgleich L3/L4 Aufgabe für Aufgabe (ohne Versionssprung)

Schließt den letzten offenen Teil von OPT-09. Gelesen (nur lesend, Text per
Skript aus den `.docx`) wurden alle 25 Aufgabenblätter aus
`materialien/BPE1/Lernfortschritt_3/Aufgabenstellungen` und alle 14 aus
`Lernfortschritt_4/Aufgabenstellungen`; Stichprobe aus den Excel-Vorlagen:
`L3_5.4 Tabellenvorlage Umsatzauswertung.xlsx` (26 Kunden).

- **L4.1–L4.6:** Alle Tabellenwerte stehen unverändert auf den Seiten
  (Winteraktionstag 125/100/125/50; Schwimmen 2013–2017 120/90/85/60/50;
  Verpflegung 3,50 € + 1,00 € für Skifahrer; 2016/2017 und 2013–2017 je
  Aktion; Wahlanteile 1994–2017, sieben Reihen, in L4.5). Formatvorgabe
  Titel Arial fett 16 pt, Datenbeschriftungen und Achsentitel in L4.1.
  Pro-Kopf-Einkommen/Energieverbrauch in L4.6 (Begriffsunterschied
  Strom/Energie wird auf der Seite benannt).
- **L4.7/L4.8:** Filialumsätze (20 Quartalswerte), Kundenzahl und Umsatz je
  Ort, gleichförmige Bewegung, freier Fall und Urlaubsfahrt (zehn Abschnitte,
  950 km) stimmen Wert für Wert. Die Auswertung nach Kundenart aus L4_2.2
  fehlt bewusst: Das Aufgabenblatt fragt nur nach Orten.
- **L3.1–L3.6:** Skiausfahrt (Grenze „kleiner als 18“, E8 bis E20, JAHR in
  B5 und D8:D20, Kind bis 12, Tarife 46/35/20 € als Zellbezüge mit
  Begründung), Fußball-Toto (Tabellenpunkte, Totoergebnis, Tipp, ZÄHLENWENN,
  Gewinnstufen 10–13 und 7–13, ISTNV mit „kein Gewinn“), bedingte
  Formatierung (Ja grün/Nein rosa; 0 rosa, 1 gelb, 3 hellblau),
  Notenberechnung 2 : 1 mit RUNDEN und Verweistabelle (Belobigung/nicht
  bestanden), Kfz-Steuer mit Länderfaktor und Hubraum 2099, PLZ-Suche.
- **L3.7:** Urlaub (Kurs 1,21, Budget 1.500 €) und Kapital (5 Jahre,
  Zielwert 6.000 € für Zinssatz und Startkapital).
- **L3.8:** alle sechs Vertiefungen als Fall 1–6 mit den Originalregeln und
  -werten; Firmen- und Personennamen sind neutralisiert (Kundennummern statt
  Namen), die Umsätze aus der Vorlage L3_5.4 stimmen alle (Stuttgart: 11
  Kunden, 501.290 €, wie in L4_2.2).
- **Bewusste Abweichung:** L4.4 erstellt den Kreis in 2D und bietet die vom
  Blatt verlangte 3D-Fassung auf einer Blattkopie an, falls die Lehrkraft das
  Originalformat verlangt (Rückfrage an Jakob bleibt, siehe A0zf).

Ergebnis: L3 und L4 sind fachlich vollständig und zahlengleich mit BPE1.
Keine Seitenänderung nötig.

### A1e Release 0.31.0: Textmarker

`highlighter.js` (nach `lNN.js` geladen): vergibt an `p, li, td, th, h2–h4, dt,
dd, figcaption, blockquote` in `.lesson-article` (ohne Formulare, Knöpfe,
Labels; nur innerste Elemente) die Kennungen `b-0, b-1, …` in Seitenreihenfolge.
Markierung = {block, start, end, quote, color}; angezeigt nur, wenn der Text
dort noch genau so steht. **Wenn du Absätze einfügst oder entfernst, verschieben
sich die Kennungen; alte Markierungen fallen dann still weg, es entsteht kein
Fehler.** Speicherung im Profil (`highlights`), Prüfung in `save-core.js`.
Schreibt per Lesen-Ändern-Schreiben und meldet ein `storage`-Ereignis, damit
`lesson-core.js` den Stand nicht überschreibt.

### A1d Release 0.30.0: Fortschritt in der Pfadleiste

Die IDs `#lesson-score-ring`, `#lesson-page-percent`, `#lesson-page-status`,
`#lesson-points-status` bleiben (Tests, `lesson-core.js`). Die Karte
`.lesson-score-card` steht weiter im HTML jeder Lernseite;
`lesson-navigation.js` hängt sie in `.location-path`. Neue Lernseiten bitte
ohne `<p class="eyebrow"><span>Lx.y</span> BPE …</p>` anlegen.
`lesson-navigation.js` legt `#lesson-progress-pop` an (Klick/Enter, Esc schließt), `lesson-core.js` füllt es in `render()`. Kopfzeile auch unter 1051 px `position: sticky`. Untertitel der Lernseiten jetzt „Tabellenkalkulation verstehen“. Startseite: `.hero-outcomes` nahtlos unter `.hero-photo-frame`; Eyebrow „Überblick“.

### A1c Release 0.29.1: Pfadleiste beim Überfahren

`.location-path a:hover, :focus-visible` wie `.icon-button:hover`
(translateY −2px, grüne Kante, `--metal-glow`), ohne Bewegung bei
`prefers-reduced-motion`.

### A1b Release 0.29.0: Feinschliff im Design

Block „Feinschliff 0.29.0“ am Ende von `styles.css`. Für neue Karten bitte
`box-shadow: var(--elev-1)` (Ruhe) bzw. `var(--elev-2)` (Hover/offen)
verwenden; Bewegung mit `var(--ease-out)`, bei `prefers-reduced-motion` ohne
Anheben. Startseiten-Regeln mit `body #view-dashboard …`, weil `home.css`
nach `styles.css` lädt.

### A1a Release 0.28.4: Drucken immer hell

Am Ende von `styles.css` setzt `@media print` die Farbvariablen auf die hellen
Werte (Selektoren `html[data-theme]`, `…[data-background]`,
`…[data-text-tone]`, damit auch Optionen überschrieben werden). Neue
Farbvariablen bitte dort ergänzen. `lehrkraft.css`: `@page { size: A4
landscape }` und kleinere Zellen im Druck.

### A0zz Release 0.28.3: Formelsammlung druckt als Merkblatt

Nur Druckregeln am Ende von `styles.css` (keine neue Bedienung):
`body:has(#view-formulas:not([hidden]))` blendet Kopfzeile, Pfadleiste, Fuß,
Suche und Beispielchip aus; Karten dreispaltig, `align-content: start`, ohne
Mindesthöhen, feste dunkle Farben (Hintergründe druckt der Browser meist nicht).

### A0zy Release 0.28.2: Abstand nach Schrittlisten

Durchsicht deiner Lernseiten L2–L4 in der neuen Metalloptik: stimmig. Einzige
Korrektur: `.instruction-list` hat `margin: 0`; eine direkt folgende `h3`
(„Aufgabe B …“) klebte an der Liste. Neu `.instruction-list + h3 { margin-top:
1.6rem }` (betrifft L1.3, L3.3, L3.4, L3.5).

### A0zx Release 0.28.1: CSV-Zahlen

`lehrkraft.js` `downloadCsv`: `cell()` schreibt endliche Zahlen unverändert
(ohne Anführungszeichen, ohne Apostroph). Vorher machte der Formelschutz aus
einer negativen NAGOLD-Summe Text („'-5“). Test in `site.browser.cjs`
(Klassenübersicht). Dazu `loading="lazy"` an den Situationsbildern L1.1/L1.2
(Dateien unverändert).

### A0zw Release 0.28.0: gebürstetes Metall, Fortschritt im Profil, Tastenkürzel

Wünsche Jakob vom 16.10. (alle umgesetzt):
- **Gebürstetes Metall:** am Ende von `styles.css` die Variablen `--brush`
  (helle Schliffspuren) und `--brush-dark` (dunkle) als SVG-`feTurbulence`
  mit stark gestreckter Frequenz (waagerecht), `--brush-strength` je Schema.
  Überlagert per `::before` (z-index −1, `isolation: isolate`) auf
  `.site-header`, `.main-nav`, `.nav-dropdown-menu`, `.icon-button`,
  `.profile-button`, `.dialog`, `.xp-panel`, `.nagold-total`, Pfadleiste;
  große Knöpfe über ihr `::after`; Seitenhintergrund über `body::before`
  (fixiert). Erste Fassung war Jakob zu kräftig gedacht – bewusst dezent
  halten, Texte müssen ruhig lesbar bleiben.
- **Pfadleiste** `.location-path` / `.lesson-breadcrumb` als Metallschiene mit
  Lichtkante und Schatten; aktuelle Seite als kleine Plakette.
- **Gesamtfortschritt:** Karte `.floating-progress` im Startbild entfernt
  (samt CSS); neu `profile-progress.js` (`ExcelLabProfileProgress.render(profile,
  idPrefix)` → [Knopf, Einzelheiten]): Balken aus vier Abschnitten L1–L4 in der
  Profilkarte, Klick klappt Einzelheiten je Lernschritt auf. Eingebunden nach
  `save-core.js` auf Startseite und Lernseiten. `home.css`: Startbild ohne
  Platz für die Karte, Abschnitt darunter rückt hoch.
- **Alt+S** speichert sofort (`save-core.js`: `isSaveShortcut(event)`,
  `notify(text)`; `app.js` und `lesson-save.js`), Tooltip „Schneller: Alt+S“.
- **Esc** schließt den Lernnachweis wie das X (`nachweis.js`).
- **Speicherfenster:** unterer Hinweis zu „Zuletzt gespeichert“ entfernt,
  oberer Satz vereinfacht.
- **Pfadleiste ohne „BPE1“:** beginnt mit „Übersicht“ (`app.js`
  `renderLocationPath`, `lesson-navigation.js`, `index.html`); alle Glieder als
  Plakette, das aktuelle hervorgehoben.
- **Startseite:** `#view-dashboard` (home.css) ist nicht mehr deckend, damit
  `body::before` wirkt; das Zellraster (46/92 px) im Seitenhintergrund ist
  entfernt (zeichnete sich als Quadrate ab).
- **Achtung Mobil:** `.main-nav` ist unter 1051 px unten fixiert. Deshalb kein
  `position: relative` an `.main-nav` und keine `isolation` an `.site-header`
  (sonst Überlauf bzw. Menü unter dem Inhalt) – nur per `@media (min-width: 1051px)`.
- **Tests (nachgezogen, ohne Versionssprung):** `site.browser.cjs` Prüfung 23
  „Alt+S, Esc, Fortschrittsbalken, Pfadleiste, Startkapital“;
  `tests/profile-progress.test.js` (Prozent und Zählung je Lernschritt, Alt+S,
  Skriptreihenfolge).

### A0zv Release 0.27.0: Jakobs Antworten vom 16. Oktober

**Neu: `documentation/tasks.md`.** Offene Fragen an Jakob stehen dort
nummeriert, er antwortet darunter mit derselben Nummer. Beantwortete und
umgesetzte Punkte werden dort gelöscht und hier/in `documentation.md`
dokumentiert. Nummern nie neu vergeben. Bitte nutze die Datei ebenfalls.

Entscheidungen Jakob:
- Startkapital: ja, **einmal je Schuljahr** (Schuljahr ab 1. August).
  `nagold.js`: `startCapitalPoints` (5), `isStartCapital`, `schoolYear(date)`
  („2026/27“), `startCapitalTaken(entries, date, except)`,
  `presetOptions(entries)` zeigt „Startkapital“ nur, solange es im laufenden
  Schuljahr fehlt. `nagold-table.js` füllt 5 vor und speichert ein zweites
  Startkapital im selben Schuljahr nicht (Meldung `START_ERROR`).
- Jahresziel: 100 NAGOLD = 100 %, darüber ist möglich (`yearGoal`). Balken
  `#nagold-goal-progress` und `#nagold-goal-text` im Knopf `#nagold-total`
  (Startseite `index.html`, Lernseiten `xp.js`), Rest als Tooltip `#nagold-tip`.
- NAGOLD je abgeschlossener Einheit bleibt (nicht je Level).
- Haken „Lehrkraft hat bestätigt“ dürfen Lernende selbst setzen.
- 3D-Kreis: 2D bleibt, 3D wird erwähnt (L4.4 tut das schon).
- „Zuletzt gespeichert“ bleibt Browserliste; Lernende sichern die Datei
  selbst. Hinweis beim Abschluss (`lesson-core.js`, `SAVE_HINT`), Meldung
  gekürzt: „L1.2 geschafft: +100 XP, +5 NAGOLD. Jetzt über das
  Disketten-Symbol speichern.“
- Datenschutz: kurzer Abschnitt im Fenster „Versionen und Impressum“ mit
  Verweis auf die Datenschutzerklärung von Sawazki Electronics.
- **Grundsatz Jakob:** Für Lernende einfach und verständlich, nicht mit
  Information überfluten; mehr nur auf Abruf (Tooltip, Aufklappen).

Aufgeräumt (Freigabe Jakob): 141 per SHA-256 bestätigte Doppeldateien aus
`../BPE1` und der Ordner `.tmp/` liegen im Papierkorb; in `../BPE1` bleiben
nur Dateien ohne Kopie (Lösungen, Kompetenzraster, L1.1-PDF).

Intern: XP-Regel nur noch in `save-core.js` (`LESSON_XP`, `bonusSolved`,
`xpStats`); `app.js`, `xp.js`, `nachweis.js`, `lehrkraft.js` rechnen nicht mehr
selbst; `nachweis.html` und `lehrkraft.html` laden `save-core.js`.

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
| OPT-09 | Quellenabgleich L3–L4 | erledigt (Claude): maschinell 0.12.1, Informationsblätter 0.20.6 (A0zf), Aufgabenblätter Aufgabe für Aufgabe 16.10. (A0zu) |
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
