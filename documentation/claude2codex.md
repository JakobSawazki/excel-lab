# claude2codex.md – Übergabe von Claude an Codex (Excel-Lab)

Stand: 2026-10-09 · Grundlage: Release 0.10.1 (`5e1a758`) · Autor: Claude

Jakob hat Claude am 9. Oktober 2026 beauftragt, Excel-Lab wie zuvor WorkbenchLab
zu optimieren und dir die Punkte zu übergeben, an denen du weiterarbeiten kannst.
Diese Datei ist Claudes einzige Übergabedatei. Für deine Antwort bietet sich
`documentation/codex2claude.md` an. Die Projektdokumentation
(`documentation/documentation.md`) bleibt deine; Claude hat dort nur Kopf und
einen Eintrag im Taskstatus ergänzt.

## Teil A – Das Wichtigste

### A1 Wo der Stand liegt

- Claudes Arbeit liegt **lokal auf dem Branch `claude/optimierung-2026-10-09`**,
  sechs Commits auf `5e1a758`. `main` ist unverändert, **nichts ist gepusht oder
  veröffentlicht** (Übergaberegel: nur mit Jakobs ausdrücklichem Auftrag).
- Der Arbeitsordner in Google Drive steht auf diesem Branch. Vor deiner Arbeit
  `git status --short --branch` und `git log --oneline -8` lesen.
- Übernehmen: `git checkout main` und `git merge --ff-only claude/optimierung-2026-10-09`.
  Einzelnes zurücknehmen: `git revert <commit>`; jeder Punkt ist ein eigener Commit.
- Die Versionsnummer ist weiter 0.10.1. Ein Release mit diesen Änderungen wäre 0.11.0
  (siehe OPT-07).

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
| OPT-06 | siehe `git log` | Antwortmöglichkeiten im Verständnis-Check mischen | `lesson-core.js` |

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

### A4 Prüfstand

- `node --test`: 255 Prüfungen bestanden.
- `tests/browser/lesson-gates.browser.cjs`: 27 Einheiten, 83 Fragen bestanden
  (vor dem Umbau als Ausgangsmessung und nach OPT-01). Nach OPT-06 lief der
  vollständige Lauf beim Schreiben dieser Datei noch; bitte einmal wiederholen.
- `tests/browser/site.browser.cjs`: 28 Seiten bei 1440 und 390 Pixeln, dazu
  fünf Einzelprüfungen bestanden.
- Startseite und L1.2 im Browser angesehen (dunkles Schema).
- **Nicht geprüft:** veröffentlichte Fassung (nichts veröffentlicht), deine
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
| `lesson-navigation.js`, `lesson-workspace.js`, `xp.js`, `options.js`, `developer-mode.js`, `deployment.js`, `formula-lab.js` | Navigation, Abschnitte, XP, Darstellung, Vorschau, Materialverweise, Formel-Demo | Codex |
| `styles.css`, `lesson-workspace.css`, `formula-lab.css`, `l4-*.css` | Gestaltung | Codex |
| `tests/*.test.js`, `tests/helpers.cjs` | Node-Tests ohne Pakete | Claude |
| `tests/browser/*.browser.cjs` | Browsertests (Edge über Playwright) | Abschluss-Audit Codex, Seitentest Claude |

Speicherschlüssel: `excelLab.state.v1` (Lernstand), `excelLab.state.rescue.v1`
(neu, Rettungskopie), `excelLab.device.v1`, `excelLab.appearance.v1`,
`sessionStorage["excelLab.developerPreview"]`.

### B2 Befehle

```powershell
node --test                                   # 255 Prüfungen, ohne Pakete
python -m http.server 4273 --bind 127.0.0.1
node tests/browser/site.browser.cjs http://127.0.0.1:4273/
node tests/browser/lesson-gates.browser.cjs http://127.0.0.1:4273/ all          # rund 5 Minuten
node tests/browser/lesson-gates.browser.cjs http://127.0.0.1:4273/ all l1-1,l2-3
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
   Release“ in der README und „Projektversion“ in der Dokumentation stimmen überein.
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
| OPT-07 | Release 0.11.0 und Veröffentlichung | offen; braucht Jakobs Auftrag |
| OPT-08 | Übrige `.tmp`-Tests ins Repository, `.tmp/` aus Drive | offen (Codex) |
| OPT-09 | Quellenabgleich L3–L4 | offen (Codex, laut Dokumentation dein nächster Schritt) |
| OPT-10 | Rücknahme eines Abschlusses wirkt nur eine Einheit weit | Befund; Entscheidung Jakob |
| OPT-11 | Profile sammeln sich an; kein Profilwechsel | Befund; Entscheidung Jakob |
| OPT-12 | Navigation doppelt vorhanden | offen (Codex) |
| OPT-13 | Ungenutzter Code und ungenutzte Styles | offen (Codex); Liste in C2 |
| OPT-14 | Veröffentlicht wird das ganze Repository | Vorschlag; Entscheidung Jakob |
| OPT-15 | Versionsparameter an Skripten und Styles | Vorschlag |
| OPT-16 | Rettungskopie herunterladbar machen | Vorschlag |
| OPT-17 | Dokumentation gliedern | Vorschlag; deine Dateien |
| OPT-18 | Lernsituationsbilder für weitere Einheiten | offen (Vorgabe Jakob vom 07.10.) |
| OPT-19 | Barrierefreiheit, Kontrast, Tastatur als Tests | offen |
| OPT-20 | „Punkte“ und „XP“ | Befund; Entscheidung Jakob |
| OPT-21 | Lehrkraftbestätigung und Klassenübersicht | Idee; Entscheidung Jakob |
| OPT-22 | `.git/refs/desktop.ini` | Hinweis |

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

#### OPT-09 Quellenabgleich L3–L4

Unverändert dein offener Schritt laut Taskstatus. Claude hat keine Inhalte der
Lernseiten geändert und keine Originalmaterialien geöffnet.

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

`app.js` (`renderNavMenu`, Menüereignisse in `bindEvents`) und
`lesson-navigation.js` bauen dasselbe Lernpfad-Menü zweimal, einmal als
HTML-Text, einmal über DOM-Knoten, mit eigener Freischaltlogik. Vorschlag:
`lesson-navigation.js` auch auf der Startseite verwenden. Abnahme: deine
`navigation-smoke`- und `breadcrumb-smoke`-Tests.

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
- **Entscheidung Jakob**, weil es die Veröffentlichung umstellt.

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

1. Durchsicht des Branches und Auftrag zur Veröffentlichung (OPT-07).
2. OPT-10: Rücknahme – a, b oder c?
3. OPT-11: eigene Windows-Anmeldung je Person oder gemeinsame Konten?
4. OPT-14: nur App-Dateien veröffentlichen?
5. OPT-20: „Punkte“ oder „XP“?
6. Freigabe zum Leeren von `.tmp/` (OPT-08).

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
