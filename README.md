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

L1.1 bis L1.6 sowie L2.1 bis L2.4 enthalten Informationen und Aufgaben vollständig als aufklappbare
Abschnitte. Ein separates Informations- oder Aufgabenblatt wird dafür nicht
benötigt. Browser und Excel lassen sich mit Windows-Taste + Pfeil links/rechts
nebeneinander anordnen. Die Excel-Datei wird am Schüler-PC bearbeitet und gespeichert.
Die Hauptnavigation bleibt auch auf diesen eigenen Lernseiten sichtbar. Direkt
darunter zeigt „Lernpfad › L1.x“ beziehungsweise „Lernpfad › L2.x“ den aktuellen Standort.

L2.2 bis L2.4 erproben zusätzlich verpflichtende Verständnis-Checks mit je
drei Anwendungsfragen. Alle Antworten müssen stimmen, bevor der Abschluss
möglich ist. Die Lehrkraft prüft weiterhin die tatsächlichen Excel-Dateien
und lässt sich die Vorgehensweise erklären. Für die übrigen Einheiten wird
dieses Prinzip erst nach fachlicher Ausarbeitung übernommen.

Lokale Excel-Vorlagen bieten neben dem Download einen optionalen Direktaufruf
in installiertem Excel. Dieser setzt HTTP(S) und einen funktionierenden
Office-Protokollhandler voraus. Falls der Aufruf nicht funktioniert, die Datei
herunterladen und aus dem Downloadordner öffnen. Online bleiben die bisherigen
Verweise auf den Landesbildungsserver bestehen.

## Lernprofile und Datenschutz

Die erste Fassung verwendet lokale Browserprofile. Schulischer Account-Name,
Klassenbezeichnung und Lernstand
werden ausschließlich im `localStorage` des verwendeten Browsers gespeichert.
Es gibt keine Datenübertragung und kein echtes Online-Konto. Der aktuelle
Lernstand lässt sich als JSON exportieren und auf demselben oder einem anderen
Gerät wieder importieren.

Der Account-Name folgt dem schulischen Muster `abc.xyz`. Zusätzlich erzeugt
die Anwendung eine anonyme lokale Geräte-ID. Browser können weder die
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
├── home.css                   Gestaltung der Startseite
├── home.js                    interaktives Formel-Lab ohne Lernstandänderungen
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
