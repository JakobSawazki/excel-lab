# Excel-Lab

Excel-Lab ist eine statische Lernplattform zur Bildungsplaneinheit 1
„Tabellenkalkulation“. Sie richtet sich an Lernende am Beruflichen Gymnasium,
am Berufskolleg und in kaufmännischen Ausbildungsberufen.

Projektstand, erledigte und offene Aufgaben, Ideen sowie technische
Entscheidungen stehen in [`documentation.md`](documentation.md).

Die Anwendung gliedert den Lernstoff in vier Lernschritte:

1. Grundlagen und Tabellenaufbau
2. Adressierung und Grundfunktionen
3. Logik, Bedingungen und Verweise
4. Diagramme und Datenvisualisierung

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

## Materialien synchronisieren

Die Originaldateien liegen außerhalb des Projekts im Ordner `../BPE1`. Mit

```powershell
.\scripts\sync-materials.ps1
```

werden Aufgabenstellungen, Informationsmaterialien, Videos und Excel-Vorlagen
für die lokale Nutzung nach `materialien/BPE1` kopiert. Lehrerdateien und
Musterlösungen werden bewusst nicht in den Webordner übernommen.

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
├── home.css                   Gestaltung der Startseite
├── home.js                    interaktives Formel-Lab ohne Lernstandänderungen
├── deployment.js              lokale/öffentliche Materialverweise
├── styles.css                 responsives Design und Farbschemata
├── content.js                 vier Lernschritte, 27 Einheiten, Formelsammlung
├── app.js                     Navigation, lokale Profile, Fortschritt, JSON
├── l1-1.js                    Fortschritt und Freischaltung auf der L1.1-Seite
├── l1-2.js                    Zugang, Abschluss und Punkte auf der L1.2-Seite
├── documentation.md           Projektstand, Aufgaben, Ideen und Änderungsprotokoll
├── .nojekyll                  direkte statische Bereitstellung über GitHub Pages
├── assets/images/             fotorealistisches Startmotiv
├── assets/brand/              metallisches Excel-Lab-Symbol
├── materialien/
│   ├── README.md
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
