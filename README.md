# Excel-Lab

Excel-Lab ist eine statische Lernplattform zur Bildungsplaneinheit 1
„Tabellenkalkulation“. Sie richtet sich an Lernende am Beruflichen Gymnasium,
am Berufskolleg und in kaufmännischen Ausbildungsberufen.

Projektstand, erledigte und offene Aufgaben, Ideen sowie technische
Entscheidungen stehen in [`documentation/documentation.md`](documentation/documentation.md).

Die Anwendung gliedert den Lernstoff in vier Lernschritte:

1. Grundlagen und Tabellenaufbau
2. Adressierung und Grundfunktionen
3. Logik, Bedingungen und Verweise
4. Diagramme und Datenvisualisierung

In der Hauptnavigation führt ein Klick auf „Lernpfad“ zur Lernpfad-Seite.
Beim Zeigen auf den Menüpunkt erscheinen die vier Lernschritte und ihre Kapitel;
auf Touch-Geräten öffnet der kleine Pfeil das Menü.

## Online-Version

Aktueller Release: **0.10.1** – Themenlandkarte, vereinfachte Bedienung und
eigene Lernseiten für alle 27 Einheiten bis einschließlich L4.8.

Didaktisch überarbeitet (4. Oktober 2026): L1.2 kann mit den auf der
Lernseite angegebenen Eingabedaten ohne Vorlagen-Download bearbeitet werden.
Ein Vorhersage-/Änderungstest und eine unabhängige Eintrittskarten-Aufgabe
vertiefen die Arbeit mit Zellbezügen.
L1.3 ergänzt einen Druckkosten-Transfer zu Zellwert und gerundeter Anzeige;
L1.4 ergänzt eine Fehlerdiagnose mit absichtlich festgesetztem Ergebniswert,
Änderungstest und Reparatur. Die Zellzuordnung zwischen L1.2 und L1.3 ist
für den Aufbau ohne Vorlage abgestimmt.
L1.5 konkretisiert die Testkopie mit einer sechsten Person und Kontrollsummen;
L1.6 ergänzt schrittweise Hilfe zu Mehrbedarf/Paketanzahl, Paketgrenztests
und gezielte Änderungstests für die weiteren vier Rechenmodelle.
L2.1/L2.2 ergänzen getrennte Eingabetests für relative/absolute Bezüge.
L2.2 lässt sich ohne Vorlagen-Download mit der L2.1-Datei oder einer leeren
Arbeitsmappe bearbeiten; Zeilen werden nur beim passenden Startaufbau eingefügt.
L2.3 ergänzt gezielte Änderungstests für gemischte und benannte Bezüge.
L2.4 bietet einen vollständigen Einstieg ohne Vorlagen-Download sowie Tests
zu unveränderten Extremwerten und dem Unterschied zwischen null und leer.
L2.5 ergänzt eine selbstständige Angebotsauswertung mit Anbieterwechsel und Gleichstand.

- Website: <https://jakobsawazki.github.io/excel-lab/>
- Quellcode: <https://github.com/JakobSawazki/excel-lab>

Die Online-Version wird als statische Website über GitHub Pages ausgeliefert.
Sie besitzt kein eigenes Backend; Profile und Lernstand bleiben im jeweiligen
Browser. Die Originaldateien des BPE1-Materialpakets werden nicht in GitHub
veröffentlicht. Entsprechende Schaltflächen führen online stattdessen zur
offiziellen Materialseite des Landesbildungsservers Baden-Württemberg.

## Lokal starten

Die Datei `index.html` kann direkt im Browser geöffnet werden. Für eine
realistische lokale Vorschau empfiehlt sich ein kleiner Webserver:

```powershell
python -m http.server 4173
```

Danach ist die Seite unter `http://localhost:4173` erreichbar.

## Direkt im Browser lernen

L1.1 bis L1.6, L2.1 bis L2.5, L3.1 bis L3.8 und L4.1 bis L4.8 enthalten Informationen und Aufgaben vollständig als aufklappbare
Abschnitte. Ein separates Informations- oder Aufgabenblatt wird dafür nicht
benötigt. Browser und Excel lassen sich mit Windows-Taste + Pfeil links/rechts
nebeneinander anordnen. Die Excel-Datei wird am Schüler-PC bearbeitet und gespeichert.
Die Hauptnavigation bleibt auch auf diesen eigenen Lernseiten sichtbar. Direkt
darunter zeigt eine klickbare Standortzeile beispielsweise „BPE1 › L4 › L4.1“.

L1.1 bis L1.6, L2.1 bis L2.5, L3.1 bis L3.8 und L4.1 bis L4.8 erproben zusätzlich verpflichtende Verständnis-Checks mit je
drei Anwendungsfragen; L1.6 prüft seine fünf Rechenmodelle mit fünf Fragen. Alle Antworten müssen stimmen, bevor der Abschluss
möglich ist. Die Lehrkraft prüft weiterhin die tatsächlichen Excel-Dateien
und lässt sich die Vorgehensweise erklären. Ein Browser-Quiz allein ersetzt
keine Prüfung der praktischen Arbeit.

## Interaktive Themenlandkarte

Auf der Startseite gibt „Überblick BPE1 / Excel-Lab“ einen Überblick über die
vier Themenbereiche. Mauszeiger und Tastaturfokus aktualisieren die Lernziele
und Praxisbeispiele rechts. Bild und Themenkarte öffnen als direkte Links den
passenden Lernfortschritt – mit Klick, Enter oder Antippen. Die Auswahl
verändert weder Punkte noch Lernfortschritt.
Jede Themenkarte zeigt zusätzlich die erledigten Einheiten und einen
Fortschrittsbalken für das aktive Profil. Der doppelte Abschnitt „Vier
Lernschritte“ entfällt; der Gesamtlernstand bleibt separat aufklappbar.
Änderungen aus anderen Tabs werden übernommen. Auch beim Zurückkehren zur
Startseite werden Profil, Fortschritt und Freischaltungen neu abgeglichen.
Die Bereiche stehen zeilenweise als L1/L2 und L3/L4. Jeder besitzt ein eigenes
fotorealistisches Motiv und einen Tooltip „Lernfortschritt 1“ bis
„Lernfortschritt 4“. Die Grafiken werden bei Bedarf geladen und funktionieren
in beiden Farbschemata. Dateien und Generierungsprompts stehen unter
[`assets/images/organizer/`](assets/images/organizer/README.md).

## Optionale Video-Tutorials

Die eigenen Lernseiten L1.1–L1.6 und L2.1–L2.5 zeigen vor der ersten Aufgabe
jeweils ein thematisch passendes deutschsprachiges YouTube-Tutorial. Die
Videos erläutern allgemeine Excel-Techniken; die konkreten Aufgaben und
Prüfschritte bleiben vollständig auf der Lernseite. Einige Grundlagenvideos
werden in mehreren passenden Einheiten als Wiederholung verwendet.

Beim Öffnen der Lernseite wird keine Verbindung zu YouTube hergestellt.
Erst ein Klick auf „Video laden“ erstellt den eingebetteten Player über
`youtube-nocookie.com`; der alternative direkte YouTube-Link öffnet YouTube
in einem neuen Tab. In beiden Fällen können Daten an YouTube fließen.
„Video schließen“ entfernt den Player wieder. Wenn YouTube am Schul-PC
gesperrt ist, sind alle Einheiten auch ohne Video bearbeitbar.

Lokale Excel-Vorlagen bieten neben dem Download einen optionalen Direktaufruf
in installiertem Excel. Dieser setzt HTTP(S) und einen funktionierenden
Office-Protokollhandler voraus. Falls der Aufruf nicht funktioniert, die Datei
herunterladen und aus dem Downloadordner öffnen. Online bleiben die bisherigen
Verweise auf den Landesbildungsserver bestehen.

## Lernprofile und Datenschutz

Über das metallische Options-Icon lassen sich Hintergrund (Standard,
Smaragd, Graphit, Violett, Sand), Schriftfarbe (Standard, warmer Leseton,
hoher Kontrast, Mint, Lavendel)
und Schriftgröße (normal, etwas größer, groß) einstellen. Die Einstellungen
gelten auf allen Lernseiten, passen sich dem Hell-/Dunkelmodus an und bleiben
unter `excelLab.appearance.v1` nur im Browser gespeichert. Sie verändern
weder XP noch Lernstand und sind nicht Bestandteil der Lernstand-Speicherdatei.
„Standard wiederherstellen“ setzt die drei Darstellungsoptionen zurück.
Die Auswahl erfolgt über Farbkacheln und drei unterschiedlich große
„A“-Symbole; aktive Werte sind mit Rahmen und Häkchen markiert.

Das XP-Icon im Kopfbereich zeigt die Punkte des aktiven Profils an.
100 XP entsprechen einer abgeschlossenen Einheit. Der Dialog zeigt Level,
Fortschrittsbalken und die fehlenden XP; neue Level bei je 500 XP und das
letzte Level beim Abschluss aller Einheiten. Es gibt keinen separaten
XP-Speicher; zurückgenommene Abschlüsse korrigieren die Anzeige ebenfalls.

Die erste Fassung verwendet lokale Browserprofile. Schulischer Account-Name,
Klassenbezeichnung und Lernstand
werden ausschließlich im `localStorage` des verwendeten Browsers gespeichert.
Excel-Lab überträgt diese Lernprofildaten nicht an einen eigenen Server und
besitzt kein echtes Online-Konto. Externe Videos sind separat und freiwillig
(siehe oben). Der aktuelle
Lernstand lässt sich mit „Speichern“ als Datei sichern und mit „Laden“ auf
demselben oder einem anderen Gerät wieder öffnen. Das Format bleibt JSON;
der Dateiname lautet `YYYY-MM-DD_Excel-Lab_abc.xyz_XL-Browserkennung.json`.
Das Datum verwendet Europe/Berlin. Speichern nutzt den normalen Download
(Zielordner und Rückfragen richten sich nach den Browsereinstellungen).
Laden fordert bei unterstützter File-System-Access-API Downloads als
Startordner an und filtert auf `.json`; andernfalls wird die normale
Dateiauswahl geöffnet. Der Browser kann einen anderen Startordner wählen.

Der Account-Name folgt dem schulischen Muster `abc.xyz`. Zusätzlich erzeugt
die Anwendung eine anonyme lokale Geräte-ID. Kürzel und Klassenbezeichnung
lassen sich im Speichern/Laden-Dialog korrigieren, ohne den Fortschritt zu
verlieren. Beide Angaben sind bei der Profilanlage Pflicht; Klassen wie
`WGW EK1` behalten ihre Leerzeichen. Neues Profil und Zurücksetzen stehen
nur im Entwickler-Modus zur Verfügung; Zurücksetzen verlangt eine Bestätigung.
Browser können weder die
MAC-Adresse noch den Windows-Benutzernamen sicher auslesen; eine öffentliche
IP-Adresse wird aus Datenschutz- und Zuordnungsgründen nicht abgefragt.

Für einen späteren schulübergreifenden Login mit Synchronisierung wird ein
Backend mit Authentifizierung und Datenschutzkonzept benötigt.

## Lokale Unterrichtsmaterialien

Die Originaldateien liegen außerhalb des Projekts im Ordner `../BPE1`. Mit

```powershell
.\scripts\sync-materials.ps1
```

werden Aufgabenstellungen, Informationsmaterialien, Videos und Excel-Vorlagen
für die lokale Nutzung nach `materialien/BPE1` kopiert. Auch die
Aktivitätsverfolgungen sind dort enthalten. Lehrerdateien und
Musterlösungen werden bewusst nicht in den Webordner übernommen.

Ein Prüfsummenvergleich vom 25.09.2026 zeigte: Die 141 Dateien unter
`materialien/BPE1` sind bitgenaue Kopien eines Teils von `../BPE1`.
Im Ursprungsordner liegen 67 weitere, überwiegend für Lehrkräfte bestimmte
Dateien. Die geplante Entfernung der 141 redundanten Ursprungsdateien wurde
von der Ausführungsumgebung blockiert und ist noch offen. Bis dahin bleibt
der Synchronisationsweg bestehen. Der genaue Stand steht in der
[Projektdokumentation](documentation/documentation.md).

`materialien/BPE1` ist in `.gitignore` eingetragen. Die Materialseite des
Landesbildungsservers weist den Seitentext als CC BY 4.0 aus, macht aber auf
möglicherweise abweichende Lizenzangaben bei eingebundenen Bildern und Dateien
aufmerksam. Vor einer Veröffentlichung der Originaldateien müssen deren
Nutzungsbedingungen geklärt werden.

## Projektstruktur

```text
Excel-Lab/
├── index.html                 App-Shell und semantische Seitenstruktur
├── l1-1.html                  eigene Informations- und Aufgabenseite für L1.1
├── l1-2.html                  eigene Lernseite: Rechnen mit Zelladressen
├── l1-3.html                  eigene Lernseite: Zahlen und Tabellen formatieren
├── l1-4.html                  eigene Lernseite: Formeln kopieren
├── l1-5.html                  eigene Lernseite: Tabellenstruktur und Sommerfest
├── l1-6.html                  eigene Lernseite: fünf kaufmännische Rechenmodelle
├── l2-1.html                  eigene Lernseite: relative Adressierung
├── l2-2.html                  eigene Lernseite: absolute Adressierung
├── l2-3.html                  eigene Lernseite: gemischte und symbolische Bezüge
├── l2-4.html                  eigene Lernseite: Grundfunktionen für die Projektwoche
├── l2-5.html                  eigene Lernseite: Funktionen für Klassenfahrt und Provision
├── l3-1.html                  eigene Lernseite: WENN-Funktion für die Skiausfahrt
├── home.css                   Gestaltung der Startseite
├── formula-lab.js             interaktive Demo in L1.2 ohne Lernstandänderungen
├── formula-lab.css            gekapselte Gestaltung der Formel-Demo
├── lesson-workspace.css       aufklappbare Lernabschnitte
├── lesson-workspace.js        Abschnittsbedienung und optionale Excel-Links
├── lesson-navigation.js       gemeinsame Navigation auf eigenen Lernseiten
├── deployment.js              lokale/öffentliche Materialverweise
├── styles.css                 responsives Design und Farbschemata
├── content.js                 vier Lernschritte, 27 Einheiten, Formelsammlung
├── app.js                     Navigation, lokale Profile, Fortschritt, JSON
├── l1-1.js                    Fortschritt und Freischaltung auf der L1.1-Seite
├── l1-2.js                    Zugang, Abschluss und Punkte auf der L1.2-Seite
├── l1-3.js                    Zugang, Abschluss und Punkte auf der L1.3-Seite
├── l1-4.js                    Lernfortschritt und interaktive Kopier-Demo
├── l1-5.js                    Zugang, Abschluss und Punkte auf der L1.5-Seite
├── l1-6.js                    Zugang, Abschluss und Punkte auf der L1.6-Seite
├── l2-1.js                    Zugang, Abschluss und Punkte auf der L2.1-Seite
├── l2-2.js                    Zugang, Abschluss und Punkte auf der L2.2-Seite
├── l2-3.js                    Zugang, Abschluss und Punkte auf der L2.3-Seite
├── l2-4.js                    Zugang, Abschluss und Punkte auf der L2.4-Seite
├── l2-5.js                    Zugang, Verständnis-Check und Abschluss auf der L2.5-Seite
├── l3-1.js                    Zugang, Verständnis-Check und Abschluss auf der L3.1-Seite
├── developer-mode.js          temporäre Entwicklervorschau
├── documentation/
│   └── documentation.md       Projektstand, Aufgaben, Ideen und KI-Übergaben
├── .nojekyll                  direkte statische Bereitstellung über GitHub Pages
├── assets/images/             fotorealistisches Startmotiv
├── assets/brand/              metallisches Excel-Lab-Symbol
├── materialien/
│   └── BPE1/                  lokal synchronisiert, nicht in Git
└── scripts/
    └── sync-materials.ps1
```

## Fachliche Quellen

- Bildungsplan Informatik für nichtgewerbliche Berufliche Gymnasien,
  Bildungsplaneinheit 1 Tabellenkalkulation
- Landesbildungsserver Baden-Württemberg, Materialpaket Tabellenkalkulation,
  Stand 08.09.2018

Die Links zu den offiziellen Quellen sind in der Anwendung unter „Quellen“
hinterlegt.

## Temporärer Entwicklermodus

Auf der Startseite das Profilmenü oben rechts öffnen und **AltGr + S** drücken
(ersatzweise Strg + Alt + S). Der zunächst versteckte Button **Entwickler-Modus**
erscheint. Erst ein Klick darauf öffnet alle 27 Einheiten als Vorschau, auch ohne
Lernprofil. Lernstands- und Abschlussfelder bleiben dabei deaktiviert.

Die Vorschau gilt im aktuellen Tab auch beim Wechsel zu eigenen Lernseiten.
Neuladen oder „Beenden“ schaltet sie aus. Sie verwendet einen separaten
SessionStorage-Schalter; Profile, Punkte und JSON-Exporte werden nicht freigeschaltet
oder umgeschrieben. Das ist eine Entwicklungshilfe, keine geschützte Benutzerrolle.
