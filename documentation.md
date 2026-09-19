# Excel-Lab – Projektdokumentation

Stand: 19. September 2026  
Projektversion: 0.7.0
Status: lokaler, funktionsfähiger Prototyp  
Zielplattform: moderner Browser auf schulischen Windows-PCs

## 1. Vision

Excel-Lab ist eine leicht zugängliche Selbstlernplattform für die Grundlagen
der Tabellenkalkulation. Schülerinnen und Schüler sollen ohne lange Einführung
ein Thema verstehen, die zugehörige Aufgabe in Microsoft Excel bearbeiten und
den eigenen Lernfortschritt festhalten können.

Die Plattform richtet sich an:

- Schülerinnen und Schüler des Beruflichen Gymnasiums;
- Lernende am Berufskolleg;
- Auszubildende in kaufmännischen Berufen, beispielsweise Industrie- oder
  Einzelhandelskaufleute;
- weitere Lernende, die Excel-Grundlagen systematisch wiederholen möchten.

Leitidee:

> Kurz informieren, direkt in Excel anwenden, Ergebnis prüfen und Fortschritt
> sichtbar machen.

## 2. Aktueller Meilenstein: Öffentliche Beta 0.6.1

Status: lokal nutzbar und über GitHub Pages veröffentlicht

- Website: <https://jakobsawazki.github.io/excel-lab/>
- Repository: <https://github.com/JakobSawazki/excel-lab>

Enthalten sind:

- vier Lernschritte entlang der Bildungsplaneinheit BPE 1;
- 27 Lerneinheiten in einer schrittweise freischaltbaren Lernstruktur;
- vollständig ausgearbeitete eigene Seiten für L1.1 und L1.2 mit Informationen
  vor den Aufgaben, Abschluss-Check und Lehrkraftbestätigung;
- neu gestaltete Startseite mit direktem Weiterlernen und einem interaktiven
  Formel-Lab zum Heftkauf (ohne Punkte und ohne Speicherung);
- 20 Formelkarten mit deutschen Funktionsnamen und kaufmännischen Beispielen;
- 105 direkte Materialverweise auf 141 lokal bereitgestellte Schülerdateien;
- lokale Lernprofile für mehrere Personen oder Kurse;
- Speicherung des Lernstands im Browser;
- JSON-Export und JSON-Import des Lernstands;
- Volltextsuche und Lernschrittfilter;
- responsives Layout für Desktop, Tablet und Smartphone;
- helles und dunkles Farbschema;
- sichtbarer Drei-Schritte-Einstieg auf der Übersichtsseite;
- fotorealistisches Startmotiv mit zwei Lernenden an einem modernen
  Tabellenkalkulations-Arbeitsplatz;
- skalierbare, gerade Metallbuttons mit Glanz- und Hovereffekten;
- größeres metallisches Excel-Lab-Symbol;
- Lernschritt-Menü mit Kapitelvorschau für L1 bis L4;
- Punkte, Fortschrittsbalken und sequenzielle Freischaltung ab L1.1;
- schulisches Account-Schema `abc.xyz` und verpflichtende WebUntis-Klasse;
- anonyme lokale Browser-ID im JSON-Export;
- Versionsübersicht und Impressum;
- direkte Verknüpfung zu Sawazki Electronics;
- Quellen- und Lizenzhinweise innerhalb der Anwendung.

## 3. Lernstruktur

| Lernschritt | Schwerpunkt | Einheiten | Bildungsplanbezug |
|---|---|---:|---|
| L1 | Grundlagen und Tabellenaufbau | 6 | BPE 1.1 |
| L2 | Adressierung und Grundfunktionen | 5 | BPE 1.2 und 1.3 |
| L3 | Logik, Bedingungen und Verweise | 8 | BPE 1.1 und 1.3 |
| L4 | Diagramme und Datenvisualisierung | 8 | BPE 1.4 |
| **Gesamt** | Tabellenkalkulation | **27** | BPE 1 |

Der empfohlene Ablauf jeder Einheit ist:

1. Lernziel und Grundlagen lesen.
2. Aufgabe beziehungsweise Vorlage herunterladen.
3. Aufgabe selbstständig in Excel bearbeiten.
4. Ergebnis und Formelansicht kontrollieren.
5. Ergebnis mit der Lehrkraft besprechen, Abschluss-Check bestätigen und die
   Einheit abschließen.

## 4. Didaktische Grundsätze

- **Niedrige Einstiegshürde:** kurze Texte und klar benannte Aktionen.
- **Praxis vor Theorie:** Erklärungen führen unmittelbar zu einer Excel-Aufgabe.
- **Schrittweise Progression:** von Dateneingabe und Zelladressen zu
  Bedingungen, Verweisen und Diagrammen.
- **Sichtbarer Fortschritt:** erledigte Einheiten und Lernschritte bleiben
  erkennbar.
- **Selbstkontrolle:** Abschluss-Checks lenken den Blick auf Ergebnis,
  Formelansicht und Dateispeicherung.
- **Transfer:** Beispiele stammen überwiegend aus kaufmännischen und
  schulischen Situationen.
- **Keine automatische Lösungsfreigabe:** Musterlösungen werden nicht in den
  frei zugänglichen Schülerbereich kopiert.

## 5. Bedienung

### Übersichtsseite

Die Übersichtsseite erklärt den Arbeitsablauf, zeigt Gesamtfortschritt,
Punktestand und die nächste offene Einheit. Das Startmotiv zeigt zwei Lernende
beim gemeinsamen Arbeiten an einer Tabellenkalkulation.

### Lernpfad

Beim ersten Öffnen wird nur L1 angezeigt. Suche und Filter berücksichtigen
Titel, Beschreibungen, Lernziele, Schlagwörter und Formeln. Jede abgeschlossene
Einheit vergibt 100 Punkte und schaltet die unmittelbar folgende Einheit frei.

### Lerneinheit

Die eigenständige Seite L1.1 enthält:

- Lernziel und zeitliche Orientierung;
- kompaktes Grundlagenwissen;
- Informationen zum Planen einer Tabelle, zur Dateneingabe und zur
  Spaltenbreite;
- die konkrete Getränkelisten-Aufgabe aus dem Materialpaket;
- einen handschriftlichen Planungsschritt vor der Arbeit in Excel;
- einen geordneten Excel-Arbeitsauftrag mit Dateinamensvorgabe;
- einen Abschluss-Check;
- eine manuelle Erledigt-Markierung, die wieder zurückgenommen werden kann.

L1.2 erklärt Formeln und Zelladressen, führt durch die Getränkelisten-Aufgabe
und prüft den Zugang anhand des Abschlusses von L1.1.

Die Einheiten ab L1.3 verwenden vorerst weiterhin den kompakten Dialog und
werden schrittweise zu eigenen Inhaltsseiten ausgebaut.

### Formelsammlung

Formeln lassen sich durchsuchen, nach Kategorien filtern und in die
Zwischenablage kopieren. Die Beispiele verwenden deutsche Excel-Funktionsnamen
und das Semikolon als Argumenttrenner.

### Lernprofile

Profile sind lokale Browserprofile und keine geschützten Online-Konten. Name,
Kurs und Lernstand verlassen den Rechner nicht. Der Lernstand kann als JSON
gesichert und später wieder importiert werden.

## 6. Technische Architektur

Excel-Lab verwendet bewusst keine externen Frameworks und keine
Build-Abhängigkeiten. Die Anwendung kann als statische Website auf GitHub Pages
bereitgestellt werden.

```text
Excel-Lab/
├── index.html                 semantische App-Struktur
├── l1-1.html                  eigene Lernseite für L1.1
├── styles.css                 Layout, Komponenten und Farbschemata
├── content.js                 Lernschritte, Einheiten und Formeln
├── app.js                     Navigation, Profile und Fortschritt
├── l1-1.js                    Lernlogik der L1.1-Seite
├── favicon.svg                lokales Anwendungssymbol
├── assets/images/             fotorealistisches Startmotiv
├── assets/brand/              metallisches Excel-Lab-Symbol
├── README.md                  Kurzanleitung
├── documentation.md           zentrale Projektdokumentation
├── materialien/
│   ├── README.md
│   └── BPE1/                  lokale Schülerdateien, nicht in Git
└── scripts/
    └── sync-materials.ps1     reproduzierbare Materialauswahl
```

Technische Entscheidungen:

- reines HTML, CSS und JavaScript;
- keine Cookies, Tracker oder externen Schriftarten;
- keine Übertragung von Profil- oder Fortschrittsdaten;
- kein Auslesen von IP-Adresse, MAC-Adresse oder Windows-Benutzername;
- zustandsbasierte Navigation über URL-Fragmente sowie eine eigene HTML-Seite
  für L1.1;
- lokale Speicherung unter `excelLab.state.v1`;
- importierte Profildaten werden normalisiert und auf bekannte Einheiten
  begrenzt;
- responsive Navigation wird auf schmalen Bildschirmen am unteren Rand
  angezeigt;
- reduzierte Animationen werden über `prefers-reduced-motion` respektiert.

## 7. Lokales Datenformat

Vereinfachtes Schema:

```text
version
theme
currentProfileId
profiles[]
  id
  name
  className
  createdAt
  updatedAt
  progress
    lessonId
      completed
      teacherChecked
      checks[]
```

Beim JSON-Export wird nur das aktuell ausgewählte Profil ausgegeben. Ein Import
erzeugt eine neue lokale Profil-ID, damit ein vorhandenes Profil nicht
überschrieben wird.

Der Export enthält zusätzlich `exportedBy` mit Account, Klasse und Punktestand
sowie `device` mit einer zufällig erzeugten lokalen Browser-ID und der grob
erkannten Betriebssystemfamilie. Die Browser-ID identifiziert eine lokale
Browserinstallation, nicht zuverlässig einen physischen PC oder eine Person.

Der Dateiname enthält Account, Klasse, Browserkennung und
Exportdatum, zum Beispiel
`excel-lab-jak-saw-wgwek1-xl-a1b2c3d4e5-2026-09-18.json`.

Eine statische Website darf und kann den Windows-Benutzernamen oder die
MAC-Adresse nicht aus dem Browser auslesen. Eine öffentliche IP-Adresse wäre
bei gemeinsamem Schulnetz, NAT, DHCP oder Gerätewechsel ebenfalls keine
zuverlässige Benutzerkennung und wird bewusst nicht über einen externen Dienst
erhoben.

## 8. Unterrichtsmaterialien und Veröffentlichung

Die Quelldateien liegen außerhalb des Webprojekts im Ordner `../BPE1`. Das
Skript `scripts/sync-materials.ps1` übernimmt ausschließlich für Lernende
bestimmte Aufgabenstellungen, Informationsmaterialien, Videos und
Excel-Vorlagen nach `materialien/BPE1`.

Musterlösungen und Lehrerunterlagen werden nicht kopiert. Der Materialordner ist
über `.gitignore` von Git ausgeschlossen und wird nicht über GitHub Pages
veröffentlicht. `deployment.js` erkennt die öffentliche Website und ersetzt
lokale Datei- und Videoverweise dort durch einen Link zur offiziellen
Materialseite des Landesbildungsservers. Die lokale Fassung behält ihre direkten
Downloads. Vor einer späteren Veröffentlichung einzelner Originaldateien müssen
deren Nutzungsrechte weiterhin abschließend geprüft werden.

## 9. Qualitätsprüfung

Aktuell geprüft:

- JavaScript-Syntax aller sechs JavaScript-Dateien;
- vier Lernschritte, 27 Einheiten und 20 Formelkarten vorhanden;
- alle 105 in den Einheiten verwendeten Materialverweise vorhanden;
- keine Musterlösungsdatei im Webordner;
- keine doppelten HTML-IDs;
- Navigation, Suche, Filter und Lektionsdialog im Browser;
- Anlegen und Wechseln lokaler Profile;
- Abschluss-Check, Lehrkraftbestätigung, Punkte und Freischaltung;
- vollständiger Ablauf der eigenen L1.1-Seite einschließlich Rücknahme des
  Abschlusses;
- JSON-Export;
- mobile Darstellung und untere Navigation;
- Browserkonsole ohne Fehler oder Warnungen.
- lokaler Downloadbetrieb und öffentlicher Material-Fallback im Browser;
- Veröffentlichungsliste ohne `materialien/BPE1`, `.tmp` und `desktop.ini`.

## 10. Abgeschlossene Aufgaben

- [x] Projektstruktur für eine statische Website anlegen.
- [x] BPE1-Materialbestand erfassen und fachlich einordnen.
- [x] Vier Lernschritte und 27 Lerneinheiten erstellen.
- [x] Schülerdateien reproduzierbar in den lokalen Webordner übernehmen.
- [x] Musterlösungen und Lehrerdateien aus dem Schülerbereich ausschließen.
- [x] Übersichtsseite mit Lernfortschritt entwickeln.
- [x] Lernpfad mit Suche und Filtern entwickeln.
- [x] Lektionsdialog mit Materialien und Abschluss-Check entwickeln.
- [x] Formelsammlung mit Suche, Kategorien und Kopierfunktion entwickeln.
- [x] Mehrere lokale Lernprofile ermöglichen.
- [x] JSON-Import und JSON-Export implementieren.
- [x] helles und dunkles Farbschema implementieren.
- [x] responsive Desktop- und Mobilansicht erstellen.
- [x] Quellen-, Zielgruppen- und Lizenzhinweise ergänzen.
- [x] Einsteigerführung in drei Arbeitsschritten ergänzen.
- [x] Fotorealistische Haupt- und Nebenbuttons integrieren.
- [x] Buttons als gerade, skalierbare Excel-grüne Metalloberflächen verfeinern.
- [x] Metallisches Tabellen-Symbol als klickbaren Startseitenlink integrieren.
- [x] Frontale, ungedrehte Hero-Arbeitsumgebung mit Metallrahmen erstellen.
- [x] Lernschritte L1 bis L4 als aufklappbares Kopfmenü ergänzen.
- [x] Kapitelvorschau beim Zeigen oder Fokussieren eines Lernschritts ergänzen.
- [x] Menü durch Klick außerhalb und Escape schließen.
- [x] Footer auf „Designed by Sawazki Electronics“ umstellen.
- [x] Account-Format `abc.xyz` und verpflichtende Klassenbezeichnung validieren.
- [x] optionale PC-Kennung aus Profil und Datenmodell entfernen.
- [x] JSON-Export um Account, Klasse, Punkte, Zeitpunkt und anonyme Browser-ID
  erweitern.
- [x] fotorealistisches Startmotiv mit zwei Lernenden integrieren.
- [x] Versionsübersicht und lokales Impressum über die Markenlinks ergänzen.
- [x] Lernpfad standardmäßig auf L1 begrenzen.
- [x] sequenzielle Freischaltung mit 100 Punkten pro Lerneinheit umsetzen.
- [x] Fortschrittsbalken für Gesamtweg und Lernschritte ergänzen.
- [x] L1.1 als eigene Informations- und Aufgabenseite ausarbeiten.
- [x] Lehrkraftbestätigung und rücknehmbaren Abschluss ergänzen.
- [x] lokale Browserprüfung durchführen.
- [x] zentrale Projektdokumentation anlegen.
- [x] Git-Repository initialisieren und Veröffentlichungsliste prüfen.
- [x] öffentliches GitHub-Repository und GitHub Pages einrichten.
- [x] öffentliche Materialverweise ohne Mitveröffentlichung der Originaldateien
  absichern.

## 11. Offene Aufgaben

### Hohe Priorität

- [ ] Alle 27 Einheiten fachlich und sprachlich im Unterricht prüfen.
- [ ] Eindeutige Dateinamenskonvention für Schülerlösungen festlegen.
- [ ] Klären, welche Originalmaterialien auf GitHub beziehungsweise GitHub
  Pages veröffentlicht werden dürfen.
- [ ] Festlegen, ob die Website nur Begleitmaterial oder auch vollständige
  Unterrichtssequenzen anbieten soll.
- [ ] Bedienung auf typischen Schüler-PCs und mit schulischer Excel-Version
  testen.
- [ ] Tastaturbedienung und Screenreader-Ausgabe vollständig prüfen.
- [x] L1.2 als eigene Informations- und Aufgabenseite ausarbeiten.
- [ ] L1.3 als nächste eigene Informations- und Aufgabenseite ausarbeiten.
- [ ] Punktelogik und Bearbeitungszeit mit einer Lerngruppe erproben.

### Mittlere Priorität

- [ ] Geschützten Lehrerbereich für Musterlösungen konzipieren.
- [ ] Lernstandübersicht für Lehrkräfte konzipieren, ohne personenbezogene Daten
  unnötig zu sammeln.
- [ ] Zusätzliche Übungsaufgaben für Berufskolleg und Berufsschule ergänzen.
- [ ] Druckansicht beziehungsweise kompakte Merkblätter anbieten.
- [ ] Inhaltsversion in JSON-Exporten aufnehmen und Migrationen vorbereiten.
- [ ] Automatisierte Browser-Smoke-Tests ergänzen.
- [ ] Barrierefreiheitsprüfung nach WCAG durchführen.

### Betrieb und nächste Veröffentlichungsschritte

- [x] Git-Repository initialisieren und ersten Commit prüfen.
- [x] GitHub-Repository und GitHub Pages einrichten.
- [ ] Impressum und Datenschutzhinweise vor einem breiten schulischen Einsatz
  nochmals fachkundig prüfen lassen.
- [x] Originalmaterialien bis zur Lizenzfreigabe aus Git und GitHub Pages
  ausschließen.
- [x] Links und Downloadpfade auf Groß-/Kleinschreibung unter Linux prüfen.
- [ ] Excel-Lab von Sawazki Electronics aus verlinken.
- [x] Seitentitel, kanonische URLs und Vorschaubild-Metadaten festlegen.
- [ ] Optional eine eigene Domain festlegen.

## 12. Ideen und möglicher Ausbau

- freiwilliger Diagnose-Check vor L1 mit passenden Lernempfehlungen;
- kurze Verständnisfragen innerhalb einer Einheit;
- Formelsimulator mit veränderbaren Zellwerten;
- Glossar für Begriffe wie Zelle, Bereich, Bezug und Funktion;
- Kapitelzertifikat oder druckbarer Lernnachweis;
- persönlicher Notizbereich pro Einheit;
- Favoriten in der Formelsammlung;
- zusätzliche Praxiswelten für Handel, Industrie, Verwaltung und Logistik;
- Fehlerwerkstatt mit typischen Meldungen wie `#NV`, `#WERT!` und `#DIV/0!`;
- optionale Offline-Web-App nach Klärung des Veröffentlichungsumfangs;
- echtes Benutzerkonto mit Geräte-Synchronisierung;
- datensparsames Klassen-Dashboard für Lehrkräfte;
- gesicherter Import eigener Aufgabenpakete.

## 13. Bekannte Grenzen

- Profile sind nur im jeweiligen Browser verfügbar, sofern sie nicht als JSON
  exportiert werden.
- Die anonyme Browser-ID bezeichnet nur die Browserinstallation und ist keine
  verifizierte Personen- oder Hardwarekennung.
- MAC-Adresse und Windows-Benutzername sind einer statischen Browseranwendung
  aus Sicherheits- und Datenschutzgründen nicht zugänglich.
- Es gibt noch kein Backend, keine echte Anmeldung und keine
  Geräte-Synchronisierung.
- Die Lehrkraftbestätigung ist derzeit ein lokales Kontrollkästchen und kann
  technisch auch von Lernenden gesetzt werden. Eine echte Freigabe benötigt
  einen authentifizierten Lehrerbereich mit Backend.
- Die Plattform kann Excel-Dateien bereitstellen, aber deren Bearbeitung nicht
  automatisch auswerten.
- Musterlösungen sind noch nicht über einen geschützten Lehrerzugang verfügbar.
- Die Originalmaterialien sind lokal vorhanden, aber nicht für eine öffentliche
  Veröffentlichung freigegeben.
- Die Inhalte wurden noch nicht mit einer vollständigen Lerngruppe erprobt.

## 14. Nächste sinnvolle Schritte

1. Die öffentliche Beta mit zwei bis fünf Lernenden testen.
2. Verständlichkeit, benötigte Arbeitszeit und typische Fehlstellen je Einheit
   dokumentieren.
3. Inhalte und Navigation anhand dieser Beobachtungen überarbeiten.
4. Lizenzfragen klären, bevor einzelne Originalmaterialien öffentlich
   bereitgestellt werden.
5. Excel-Lab von Sawazki Electronics aus verlinken und anschließend L1.3 als
   eigene Lernseite ausarbeiten.

## 15. Änderungsprotokoll

### Version 0.6.1 – 19. September 2026

- öffentliches Repository `JakobSawazki/excel-lab` vorbereitet und GitHub Pages
  aus dem Hauptbranch eingerichtet;
- `deployment.js` ergänzt: lokale Downloads bleiben lokal erhalten, während die
  öffentliche Seite auf die offizielle Materialquelle verweist;
- Originalmaterialien, temporäre Arbeitsdateien und Windows-Metadaten sicher
  von Git ausgeschlossen;
- kanonische Seitenadressen, Open-Graph-Metadaten und `.nojekyll` ergänzt;
- Impressums- und Versionshinweise auf den öffentlichen Betrieb angepasst;
- JavaScript-Syntax sowie lokale und öffentliche Materialpfade geprüft.

### Version 0.6.0 – 19. September 2026

- Startseite mit prägnanter Typografie, stärkerem Bildrahmen, farbigen
  Kapitelkarten und direktem Weiterlernen unter dem Einstieg überarbeitet;
- eigenständiges Formel-Lab: 1–20 Hefte, feste 2,50 € pro Heft, live berechnete
  Zellwerte, Ergebnis und Balken; Tastatursteuerung, Rücksetzen und verzögerte
  Screenreader-Statusmeldung; keine Profil-/Lernstandänderungen;
- Startseitenstile und Demo in `home.css` / `home.js` gekapselt;
- vorhandenes Startbild, Branding und Lernlogik erhalten; dezente
  Einblendung respektiert reduzierte Bewegung;
- HTML-Klassenmuster für moderne Browser korrigiert (Bindestrich maskiert);
- App-/Exportversion und sichtbare Versionsübersicht auf 0.6 aktualisiert;
- vollständige L1.2-Seite aus Übergabe H-2026-09-18-01 verfügbar.


### Version 0.5.0 – 18. September 2026

- fotorealistisches Startmotiv mit zwei Lernenden an einem modernen PC
  integriert und mit einem geraden metallischen Rahmen versehen;
- Start-, Kopf- und Datenverwaltungsbuttons metallischer gestaltet und um
  Glanz-, Hover- und Fokusreaktionen ergänzt;
- Excel-Lab-Symbol vergrößert und optisch verfeinert;
- Lernschritt-Menü um Kapitelvorschau, Pfeilsymbolik, Außenklick- und
  Escape-Schließen erweitert;
- Versionsübersicht und lokales Impressum über beide Markenlinks ergänzt;
- PC-Kennung entfernt und Klassenfeld in „Klassenbezeichnung“ umbenannt;
- Lernpfad startet mit L1 und schaltet Kapitel in Reihenfolge frei;
- 100 Punkte pro bestätigter Einheit und Fortschrittsbalken ergänzt;
- L1.1 aus den vorhandenen BPE1-Unterlagen als eigene Seite mit Informationen,
  Aufgaben, Materialien und Dateinamensvorgabe umgesetzt;
- Abschluss erst nach eigenem Check und Lehrkraftbestätigung möglich sowie
  jederzeit rücknehmbar gemacht;
- Version auf 0.5.0 erhöht.

### Version 0.4.0 – 18. September 2026

- metallische Buttons ohne perspektivische Bildverzerrung neu aufgebaut;
- Kopfaktionen, Profilbutton und Profilavatar an die grüne Metalloptik
  angeglichen;
- neues metallisches Excel-Lab-Tabellensymbol eingebunden;
- das Symbol oben links und im Footer führt weiterhin zur Startseite;
- Tabellenvisualisierung begradigt und als frontaler Monitor mit Metallrahmen
  gestaltet;
- Erwartungen auf der Startseite verständlicher formuliert;
- aufklappbares Lernschritt-Menü in der Desktopnavigation ergänzt;
- Footer-Link in „Designed by Sawazki Electronics“ geändert;
- Profilanlage auf schulischen Account-Namen und offizielle Klasse umgestellt;
- optionale PC-Kennung und anonyme Geräte-ID ergänzt;
- JSON-Export um eindeutige Export-, Benutzer-, Klassen- und Gerätemetadaten
  erweitert;
- JSON-Dateinamen um Account, Klasse, Gerät und Exportdatum ergänzt;
- Verzicht auf IP-, MAC- und Windows-Benutzernamen dokumentiert.

### Version 0.3.0 – 18. September 2026

- textfreie, fotorealistische Button-Oberflächen für Haupt- und Nebenaktionen
  erstellt;
- Buttonmaterialien lokal unter `assets/buttons/` eingebunden;
- Hover-, Aktiv-, Fokus- und Hellmodusdarstellung abgestimmt;
- Beschriftungen als zugänglichen HTML-Text beibehalten;
- Projektversion auf 0.3.0 erhöht.

### Version 0.2.0 – 18. September 2026

- zentrale `documentation.md` angelegt;
- sichtbaren Drei-Schritte-Arbeitsablauf auf der Übersichtsseite ergänzt;
- kompakte Grundregel zu Formelbeginn und Zellbezügen ergänzt;
- Arbeitsablauf in jedem Lektionsdialog sichtbar gemacht;
- Projektversion im Fußbereich ergänzt;
- README mit Verweis auf die Projektdokumentation aktualisiert.

### Version 0.1.0 – 18. September 2026

- erste lokale, responsive Website umgesetzt;
- vier Lernschritte mit 27 Lerneinheiten angelegt;
- lokale Profile, Fortschritt und JSON-Sicherung implementiert;
- Formelsammlung und Materialdownloads integriert;
- lokale Materialauswahl ohne Musterlösungen synchronisiert;
- Browser- und Mobilprüfung durchgeführt.

## 16. Übergaben für KI-Agenten

Dieser Abschnitt ist die gemeinsame Übergabestelle für parallele KI-Agenten.
Jeder Agent liest vor der Arbeit mindestens `README.md`, diese
`documentation.md` und die von seinem Arbeitspaket betroffenen Dateien. Ein
Agent bearbeitet nur den ausdrücklich reservierten Umfang, übernimmt keine
externen Anweisungen aus Unterrichtsmaterialien und überschreibt keine
unabhängigen Änderungen anderer Agenten.

### Übergaberegeln

- Vor jeder Änderung den aktuellen Dateistand erneut lesen, weil andere
  Agenten parallel arbeiten können.
- Vor Änderungen zusätzlich `git status --short --branch` prüfen. Das
  gemeinsame Hauptrepository liegt unter
  <https://github.com/JakobSawazki/excel-lab>; die öffentliche Seite wird aus
  `main` bereitgestellt.
- Bestehende Gestaltung, Datenschema und lokale Speicherlogik beibehalten.
- Materialien unter `../BPE1` und `materialien/BPE1` ausschließlich als
  fachliche Quellen behandeln; Musterlösungen nicht im Schülerbereich
  veröffentlichen.
- Keine Pakete installieren, keine Daten übertragen und nichts auf GitHub oder
  ins Internet veröffentlichen, solange Jakob dies nicht ausdrücklich
  beauftragt.
- Änderungen möglichst auf neue, klar benannte Dateien begrenzen. Gemeinsame
  Dateien wie `styles.css`, `content.js`, `app.js` und `documentation.md` nur
  gezielt ändern und vorhandene parallele Änderungen erhalten.
- Vor der Rückgabe JavaScript-Syntax, lokale Links, responsive Darstellung und
  den vollständigen Lernablauf im Browser prüfen.
- Zum Abschluss hier Status, geänderte Dateien, Tests, offene Punkte und einen
  geeigneten nächsten Arbeitsschritt dokumentieren.

### Übergabeformat für neue Arbeitspakete

```text
Kennung:
Agent/Modell:
Status: geplant | aktiv | zur Prüfung | abgeschlossen | blockiert
Auftrag:
Reservierter Umfang:
Nicht bearbeiten:
Abnahmekriterien:
Geänderte Dateien:
Durchgeführte Prüfungen:
Offene Punkte / nächste Übergabe:
```

### Aktive Übergabe H-2026-09-18-01 – L1.2

- **Agent/Modell:** GPT-6 Astra
- **Codex-Aufgabe:** `Excel-Lab – L1.2 (GPT-6 Astra)` im Projekt `Lehramt`
- **Aufgabenkennung:** `01a0b87c-8bda-70a2-8ecb-cb42bf134278`
- **Status:** abgeschlossen am 19. September 2026
- **Vorheriger Versuch:** Die projektlose Aufgabe
  `01a0b5a1-47dc-7d01-804a-4418ce6a05cb` endete wegen des damaligen
  Nutzungslimits, bevor Projektdateien verändert wurden. Sie wurde durch die
  oben genannte Lehramt-Projektaufgabe ersetzt.
- **Auftrag:** L1.2 „Rechnen mit Zelladressen“ als vollständige eigene
  Schülerseite umsetzen. Aufbau, Qualität und visuelle Sprache sollen sich an
  `l1-1.html` orientieren, ohne deren Inhalt zu kopieren.
- **Fachliche Quellen:**
  - `materialien/BPE1/Lernfortschritt_1/Aufgabenstellungen/L1_2 Aufgabenstellung Formeln in Excel.docx`
  - `materialien/BPE1/Lernfortschritt_1/Aufgabenstellungen/L1_2 Tabellenvorlage Formeln in Excel.xlsx`
  - `materialien/BPE1/Lernfortschritt_1/Informationsmaterial/L1_2 Video Einführung in Formeln.m4v`
  - die zugehörigen Originalunterlagen unter `../BPE1`; Musterlösungen dienen
    nur zur fachlichen Kontrolle und dürfen nicht veröffentlicht werden.
- **Reservierter Umfang:** neue Dateien `l1-2.html` und `l1-2.js`, klar
  gekennzeichnete L1.2-Stile in `styles.css`, der L1.2-Eintrag in `content.js`
  sowie die abschließende Aktualisierung dieses Übergabeabschnitts.
- **Nicht bearbeiten:** Startmotiv, Branding, Profil-/JSON-Schema, L1.1-Inhalte,
  übrige Lernkapitel und Veröffentlichungs-/GitHub-Konfiguration.
- **Abnahmekriterien:**
  1. Informationen stehen vor den Aufgaben und erklären `=`, Zelladressen,
     `+`, `-`, `*`, `/`, Formelanzeige und Plausibilitätsprüfung verständlich.
  2. Die konkrete Getränkelisten-Aufgabe und die vorhandene Excel-Vorlage sind
     eingebunden; Schülerdatei und Speicherauftrag sind eindeutig benannt.
  3. L1.2 ist nur nach abgeschlossenem L1.1 zugänglich und vergibt nach allen
     eigenen Checks plus Lehrkraftbestätigung 100 Punkte.
  4. Der Abschluss ist rücknehmbar; danach wird L1.3 wieder gesperrt.
  5. Desktop- und Mobilansicht, Tastaturbedienung, lokale Links und
     Browserkonsole sind geprüft.
  6. Keine Musterlösung und kein berechnetes Endergebnis wird vorzeitig im
     Schülerbereich offengelegt.
- **Technischer Kontext:** statisches HTML/CSS/JavaScript ohne Framework;
  Speicherung unter `excelLab.state.v1`; Lektions-ID `l1-2`; Punktewert 100;
  L1.1 ist das verbindliche Referenzmuster.
- **Erwartete Rückgabe:** kurze Zusammenfassung, Liste aller geänderten Dateien,
  Testergebnisse, bekannte Grenzen und Aktualisierung des Status auf „zur
  Prüfung“ oder „abgeschlossen“.

- **Ergebnis:** Eigene Schülerseite mit Grundlagen vor Aufgaben, vier
  Rechenoperatoren, Zellbezügen, Formelanzeige, Plausibilitäts- und Änderungstest,
  optionalem lokalen Video und drei Materiallinks. Die tatsächliche Vorlage
  enthält leere Ergebniszellen D4:D9; dieser Unterschied zum Wortlaut der
  Originalaufgabe wird erklärt. Speicherauftrag: `Ergebnisse/L1_2 Getränkeliste.xlsx`.
  Beispiele verwenden einen separaten Heftkauf; keine Getränke-Endergebnisse
  oder Musterlösungen wurden übernommen.
- **Geänderte Dateien:** `l1-2.html` und `l1-2.js` neu; in `styles.css`
  ausschließlich ein gekennzeichneter, auf `.l12-page` begrenzter Ergänzungsblock;
  in `content.js` ausschließlich der L1.2-Eintrag; in `documentation.md`
  ausschließlich diese Übergabe. L1.1, `app.js`, andere Kapitel und das
  Profil-/JSON-Schema wurden nicht verändert.
- **Lernlogik:** Direktaufruf bleibt ohne Profil bzw. ohne abgeschlossenes L1.1
  gesperrt. Drei eigene Checks plus Lehrkraftbestätigung und Abschlussaktion
  ergeben 100 Punkte. Entfernen eines Checks oder der Lehrkraftbestätigung
  nimmt den Abschluss ebenfalls zurück. Beim Zurücknehmen von L1.2 wird auch
  ein etwaiger L1.3-Abschluss im aktiven Profil zurückgenommen, damit die
  bestehende Übersichtslogik L1.3 tatsächlich wieder sperrt. Dessen Checks
  bleiben erhalten. Andere Profile und sonstige Lernstände bleiben erhalten.
  Speicherfehler werden gemeldet; Profil- und Sperränderungen aus anderen Tabs
  werden beim Speichern neu gelesen und über Storage-Ereignisse angezeigt.
- **Durchgeführte Prüfungen:** JavaScript-Syntax; Edge-Browsertest mit vorhandenem
  Playwright ohne Installation: gesperrter Direktaufruf, Freigabe nach L1.1,
  fehlende Checks/Lehrkraftbestätigung, Abschluss per Tastatur, genau 100 Punkte,
  Neuladen, Aufruf aus dem Lernpfad, Rücknahme und L1.3-Sperre auch bei zuvor
  abgeschlossenem L1.3, Rücknahme durch Entfernen eigener/Lehrkraft-Checks,
  Erhalt eines zweiten Profils, tabübergreifende Sperre, defekter LocalStorage,
  alle lokalen Seiten-/Materiallinks, eindeutige HTML-IDs und fehler-/warnungsfreie
  Browserkonsole. Keine horizontale Überbreite bei 1440, 768, 390 und 320 Pixeln;
  Desktop/Mobil und hell/dunkel zusätzlich anhand von Screenshots geprüft.
  Alle drei eingebundenen Originalmaterialien stimmen bytegenau mit `../BPE1`
  überein. Prüfskript und Screenshots liegen nur im lokalen temporären Ordner.
- **Bekannte Grenzen:** Lokale didaktische Freischaltung, keine serverseitige
  Zugriffssicherung; Lehrkraftbestätigung bleibt ein lokales Kontrollkästchen.
  Die Plattform prüft die bearbeitete Excel-Datei nicht automatisch. Das M4V
  ist eingebunden und erreichbar; Wiedergabe hängt vom Browser/Codec ab,
  Download als Alternative vorhanden. Keine Installation, Veröffentlichung
  oder Übertragung an externe Dienste durchgeführt.
- **Nächste Übergabe:** L1.2 mit Lernenden und schulischer Excel-Version erproben;
  anschließend L1.3 als separates Arbeitspaket ausarbeiten. Die allgemeinen
  Stand-/Versionslisten außerhalb dieses reservierten Abschnitts wurden bewusst
  nicht redaktionell aktualisiert.


### Übergabe H-2026-09-19-02 – Startseite weiterentwickeln

- **Status:** abgeschlossen am 19. September 2026.
- **Auftrag:** Jakobs Folgeauftrag „Arbeite bitte autark weiter und mache die
  Homepage noch cooler“; Gestaltung und sinnvolle Interaktion der Startseite.
- **Geänderte Dateien:** `index.html`, neue `home.css` und `home.js`, `app.js`
  ausschließlich Versionskonstante, `README.md`, `documentation.md`.
- **Ergebnis:** Neuer visueller Einstieg, nächste offene Einheit direkt unter
  dem Hero, interaktive Tabellen-Demo mit Mengenregler und Live-Ergebnis,
  überarbeitete Kapitelkarten mit sichtbaren Fortschrittsbalken.
- **Prüfungen:** Edge/Playwright mit vorhandenen Paketen; Mengenminimum und
  -maximum, Reset, Pfeiltasten/Home/End, unveränderter Browser-Speicher durch
  die Demo, Profilanlage, Navigation/Formelsuche, L1.1-Aufruf, keine doppelten
  IDs, keine Browserfehler/-warnungen. Responsive Breiten 320/390/768/1024/1440
  ohne horizontale Überbreite; Hell/Dunkel und Mobil/Desktop visuell geprüft;
  reduzierte Bewegung schaltet neue Animationen ab. `styles.css` und
  `content.js` bytegleich zum Stand vor diesem Folgeauftrag; Lernseiten
  unverändert. JavaScript-Syntax und lokale Startseitenressourcen geprüft.
- **Grenzen / nächste Schritte:** Keine Änderungen an Berechtigungsmodell oder
  Lernstandschema; keine Veröffentlichung, Installation oder externen Dienste.
  Als Nächstes Startseite mit Lernenden erproben und L1.3 separat ausarbeiten.

### Übergabe H-2026-09-19-03 – GitHub und öffentliche Beta

- **Status:** abgeschlossen am 19. September 2026.
- **Agent/Modell:** Codex, koordinierter Hauptagent.
- **Auftrag:** aktuellen gemeinsamen Projektstand in GitHub veröffentlichen und
  Excel-Lab über GitHub Pages online bereitstellen.
- **Repository:** <https://github.com/JakobSawazki/excel-lab>
- **Website:** <https://jakobsawazki.github.io/excel-lab/>
- **Geänderte Dateien:** neue `.nojekyll` und `deployment.js`; `.gitignore`,
  `README.md`, `documentation.md`, `index.html`, `l1-1.html`, `l1-2.html`,
  `app.js` und `styles.css` gezielt für Version 0.6.1 und die Veröffentlichung
  ergänzt.
- **Sicherheits- und Lizenzentscheidung:** `materialien/BPE1`, `.tmp` und
  `desktop.ini` sind nicht versioniert. Auf GitHub Pages werden lokale
  Materiallinks und das eingebundene Video durch einen nachvollziehbaren
  Verweis auf den Landesbildungsserver ersetzt; lokal bleiben die direkten
  Dateien erhalten. Es wurden keine Zugangsdaten oder absoluten privaten
  Dateipfade veröffentlicht.
- **Prüfungen:** JavaScript-Syntax aller Dateien; exakte Groß-/Kleinschreibung
  aller lokalen HTML-Ressourcen; Veröffentlichungsliste und Git-Ignore-Regeln;
  Scan auf Zugangsdaten und lokale Benutzerpfade; GitHub-Pages-Build erfolgreich;
  HTTP 200 für Startseite, L1.1, L1.2, Startbild und `deployment.js`; echter
  Browsertest der öffentlichen Startseite und der drei L1.2-Materialverweise.
- **Nächste Übergabe:** Vor parallelen Änderungen `git status` und den neuesten
  Stand dieser Datei lesen. Sinnvoller nächster fachlicher Arbeitsblock ist
  L1.3; die Verlinkung von Sawazki Electronics zu Excel-Lab bleibt separat
  offen.


### Übergabe H-2026-09-19-04 – Lerneinheiten direkt im Browser

- **Status:** abgeschlossen am 19. September 2026 für die bestehenden eigenen
  Lernseiten L1.1/L1.2 und die gemeinsame Abschnittsbedienung.
- **Benutzerentscheidung:** Selbst erstellte Informations-/Aufgaben-PDFs werden
  nicht mehr als notwendiges Schüler-Arbeitsmittel verwendet. Informationen,
  Ausgangsdaten, Aufgaben, Speicherauftrag und Selbstkontrolle gehören auf die
  jeweilige Lernseite. Lernende bearbeiten ihre Dateien in Excel am Schüler-PC.
  Bei weiteren Kapiteln dieses Prinzip übernehmen, statt zusätzliche PDFs zu bauen.
- **Umgesetzt:** L1.1 mit dem vorhandenen zweiseitigen eigenen PDF inhaltlich
  abgeglichen (Dateneingabe, Spaltenbreite, fünf Getränke, Berechnungsauftrag,
  Kontrolle). Den Papierentwurf durch Planung und Datenerfassung direkt in Excel
  ersetzt; keine Ergebnisse vorgegeben. L1.1/L1.2 benötigen keine DOCX-/PDF-Blätter
  mehr. Originaldateien bleiben unverändert archiviert. In L1.2 bleiben die
  Excel-Vorlage und das optionale Video nutzbar.
- **Bedienung:** Native `details`/`summary`-Abschnitte, Lernziel zunächst offen,
  übrige Abschnitte gezielt aufklappbar, Alle öffnen/schließen und Aufgabensprung.
  Die kompakten Ansichten der übrigen 25 Einheiten erhalten ebenfalls aufklappbare
  Grundlagen, Formelbeispiele und Aufgaben. Deren Originalmaterialien bleiben
  erreichbar: vollständige fachliche Übertragung dieser Kapitel steht noch aus.
- **Excel-Anbindung:** Bei lokalen HTTP(S)-Vorlagen optionaler Link
  `ms-excel:ofv|u|...` zum Öffnen in installiertem Excel; schreibgeschütztes Öffnen
  schützt die Vorlage, Speichern unter erzeugt die Schülerdatei. Download bleibt
  als Alternative. Kein automatischer App-Start, keine Einbettung, keine Uploads.
  Öffnen im konkreten Schul-Office ist noch vor Ort zu testen. Bei `file://`
  gibt es nur Downloads; im öffentlichen Modus keine Excel-Links zu dort nicht
  mitgelieferten Materialien. Die vorhandene Lizenz-/Veröffentlichungslogik bleibt.
- **Technische Quellen:** Microsoft Office URI Schemes
  <https://learn.microsoft.com/en-us/office/client-developer/office-uri-schemes>;
  Microsoft beschreibt eingebettete Excel-Arbeitsmappen als nicht direkt editierbar:
  <https://support.microsoft.com/en-us/excel/embed-your-excel-workbook-on-your-web-page-or-blog-from-sharepoint-or-onedrive-for-business>.
- **Geänderte Dateien:** `l1-1.html`, `l1-2.html`, neue `lesson-workspace.css`
  und `lesson-workspace.js`, Einbindungen in `index.html`, gezielte Umstellung
  der drei Dialogabschnitte in `app.js`, L1.1-Beschreibung/Schritt in `content.js`,
  `README.md`, `documentation.md`. Bereits vorhandene Änderungen an Status-Icons
  in `app.js` und `styles.css` wurden erhalten; `styles.css` nicht bearbeitet.
- **Prüfungen:** JS-Syntax; Edge-Browsertests für native Tastaturbedienung,
  Alle öffnen/schließen, Aufgabensprung, Funktion der L1.1-Abschnitte ohne JS,
  keine PDF-/DOCX-Links auf L1.1/L1.2, lokale Excel-URI und HTTP-Erreichbarkeit der
  Vorlage, öffentlicher Vorschaumodus ohne defekte direkte Materiallinks,
  1440/768/390/320 Pixel ohne horizontalen Überlauf, Desktop/Mobil visuell geprüft,
  L1.2 weiterhin 100 Punkte und rücknehmbar mit erneuter L1.3-Sperre,
  aufklappbare L1.3-Dialogansicht, keine Konsolenfehler/-warnungen.
- **Nächster fachlicher Schritt:** L1.3 und danach die weiteren Einheiten aus
  ihren Originalquellen vollständig in eigene Lernseiten übertragen. Erst dann
  die dort noch notwendigen Arbeitsblattlinks entfernen. Kein Push in diesem Auftrag.


### Übergabe H-2026-09-19-05 – L1.3 und Entwicklervorschau

- **Status:** L1.3, Entwicklermodus und kurzer Profilhinweis abgeschlossen;
  Entfernen des alten L1.1-PDF-Ordners durch automatische Sicherheitsprüfung blockiert.
- **Auftrag:** Nächste Einheit direkt auf der Website ausarbeiten, fachlich
  vertiefen, alle Einheiten temporär für Entwickler öffnen, Profilhinweis kürzen
  und überflüssigen L1.1-Arbeitsblattordner entfernen.
- **L1.3:** Vollständige eigene Seite mit sechs nativen aufklappbaren Abschnitten.
  Alle Vorgaben aus den lokalen L1_3-Aufgaben-/Informations-DOCX berücksichtigt:
  blau/grün/rot nach Inhaltstyp, Titel Arial 20 fett/zentriert, Überschriften
  Calibri 14 fett horizontal/vertikal zentriert und B3 zweizeilig, übrige Inhalte
  Calibri 11, Euro mit zwei Nachkommastellen, Mengenformat `0 "Flaschen"`,
  Rahmen über der Summenzeile, Datei `Ergebnisse/L1_3 Getränkeliste formatiert.xlsx`.
  Zusätzlich Zellwert vs. Anzeige, Anzeige-Rundung, Markieren/Strg+1, sichere
  Titelzentrierung, Formatübertragung, Fehlerdiagnose und freiwilliger Transfer.
  Die missverständliche Prozent-Erklärung im Original wurde fachlich berichtigt:
  ein vorhandener Wert 0,2 erscheint als 20 %, der gespeicherte Wert bleibt erhalten.
  Microsoft-Quellen sind auf der Seite verlinkt. Keine Lösungsergebnisse übernommen.
- **Lernlogik:** Normaler Zugang nach L1.2. Drei Checks und Lehrkraftbestätigung
  plus Abschlussaktion vergeben 100 Punkte. Rücknahme bzw. Entfernen eines Checks
  nimmt den Abschluss zurück und sperrt L1.4 erneut, einschließlich eines dort
  eventuell bereits gesetzten Abschlusses; die dortigen Checks bleiben erhalten.
- **Entwicklermodus:** Profilmanager öffnen, AltGr+S bzw. Strg+Alt+S, dann auf den
  sichtbaren Entwickler-Button klicken. Alle 27 Einheiten einschließlich der
  eigenen Lernseiten sind als Vorschau offen, auch ohne Profil. Keine Änderungen
  an Punkten oder Lernständen; Abschlussfelder während der Vorschau deaktiviert.
  Zustand separat in SessionStorage, seitenübergreifend im Tab; bei Neuladen
  gelöscht. Beenden ist jederzeit über das sichtbare Vorschau-Band möglich.
  Auch Browser-Zurück aus dem Seitencache liest den aktuellen Vorschauzustand.
- **Profilhinweis:** „Lernstand lokal speichern oder als JSON sichern.“
- **Ordner:** Der angefragte Ordner `../BPE1/Lernfortschritt_1/L1.1` enthält nur
  das bereits übertragene eigene PDF und `desktop.ini`. Ein eng begrenzter,
  pfadgeprüfter Löschaufruf mit vorgesehener lokaler Sicherheitskopie wurde vom
  Tool vor der Ausführung mit „blocked by policy“ abgelehnt. Weder Kopie noch
  Löschung erfolgten. Ordner unverändert; keine Umgehung über andere Werkzeuge.
- **Geänderte Dateien:** neue `l1-3.html`, `l1-3.js`, `developer-mode.js`;
  `index.html`, `app.js`, `content.js`, `l1-1.html`, `l1-2.html`, `l1-1.js`,
  `l1-2.js`, `lesson-workspace.css`, `README.md`, `documentation.md` gezielt ergänzt.
  Vorhandene Änderungen anderer Arbeitspakete bewahrt; kein Push/Upload.
- **Prüfungen:** JS-Syntax; lokale Ressourcen vorhanden; git diff --check;
  Edge/Playwright: versteckter Button, Hotkey allein aktiviert noch nicht,
  alle 27 Einheiten offen nach Klick, seitenübergreifende Vorschau,
  schreibgeschützte Fortschrittsfelder in allen drei Seiten und im Dialog,
  unveränderter Lernstand, mit/ohne Profil, Rücksetzung beim Reload und Beenden,
  Button nach Reload wieder verborgen. L1.3: Zugangssperre, fehlende Checks,
  fehlende Lehrkraft, 100 Punkte, Neuladen, Rücknahme und L1.4-Sperre.
  Desktop/Mobil und Hell/Dunkel visuell geprüft; kein horizontaler Überlauf
  bei 1440/768/390/320 Pixeln; Browserkonsole fehler-/warnungsfrei.
- **Nächste Einheit:** L1.4 „Formeln kopieren“ aus Originalquellen als vollständige
  Lernseite umsetzen. Das Entfernen des alten PDF-Ordners bleibt separat offen.


### Übergabe H-2026-09-19-06 – L1.4 Formeln kopieren

- **Status:** abgeschlossen am 19. September 2026, lokal geprüft.
- **Auftrag:** Autark die nächste Einheit nach L1.3 gemäß dem vereinbarten
  Browser-/Excel-Konzept ausarbeiten.
- **Quellen:** Lokale `L1_4 Aufgabenstellung Formeln kopieren.docx` und
  `L1_4 Informationsmaterial Kopieren von Formeln.docx`; vorhandenes M4V als
  optionale Ergänzung. Microsoft-Primärquellen zu Ausfüllen und relativen Bezügen
  auf der Seite verlinkt. Keine Musterlösungen verwendet oder veröffentlicht.
- **Inhalt:** Sechs aufklappbare Abschnitte: Lernziel, relative Bezüge,
  interaktive Kopier-Demo, drei Kopierwege, vollständiger Getränkeauftrag,
  Fehlerdiagnose/Vertiefung. Die Demo verwendet ein separates Beispiel E2 mit
  `=C2*D2`, 1–4 Zeilen Versatz, Live-Formel und zugänglicher Statusmeldung;
  keine Ausführung eingegebener Formeln, keine Speicherung von Demowerten.
- **Arbeitsauftrag:** 12 Flaschen Apfelsaftschorle zu je 1,25 € ergänzen;
  ganze Zeile vor der bisherigen Summenzeile einfügen, Positionsformel kopieren,
  Bezüge und Summe aller sechs Positionen prüfen, Formate/Rahmen kontrollieren,
  Änderungstest und ursprüngliche Menge wiederherstellen. Speicherauftrag
  `Ergebnisse/L1_4 Getränkeliste kopierte Formeln.xlsx`. Ergebnisbeträge und
  fertige Aufgabenformeln werden nicht vorgegeben. Keine separaten Arbeitsblätter.
- **Didaktische Präzisierung:** Kopieren einer Zelle vs. Kopieren ihres Formeltexts,
  Ausschneiden vs. Kopieren, nur Werte vs. Formel, bewusstes Ende des Ausfüllens
  vor der Summe. Die Addition einzelner Zellen aus L1.2 muss um die neue Position
  ergänzt werden; eine neue Zeile allein garantiert keine vollständige Summe.
- **Lernlogik:** Zugang nach L1.3, drei eigene Checks und Lehrkraftbestätigung,
  Abschlussaktion mit 100 Punkten, Rücknahme sperrt L1.5 erneut. Entwicklervorschau
  ist integriert und verändert keine Punkte; Neuladen stellt die Sperre wieder her.
- **Geänderte Dateien:** neue `l1-4.html` und `l1-4.js`, nur L1.4-Eintrag in
  `content.js`, gekennzeichnete L1.4-Ergänzungen in `lesson-workspace.css`,
  `README.md` und dieser Dokumentationsabschnitt. Alle anderen Änderungen bewahrt.
- **Prüfungen:** JS-Syntax, lokale Ressourcen und eindeutige HTML-IDs,
  git diff --check; Edge/Playwright: Zugangssperre/Freigabe, native Abschnitte,
  Tastatur-Demo (1/4 Zeilen und Rückweg), kein Lernstandschreiben durch Demo,
  1440/768/390/320 Pixel ohne Überbreite, Hell/Dunkel und Desktop/Mobil,
  fehlende Checks/Lehrkraft, Abschluss/100 Punkte/Neuladen, Aufruf aus Lernpfad,
  Rücknahme durch Lehrkraft-Check mit L1.5-Sperre auch bei zuvor abgeschlossenem
  L1.5, zweites Profil unverändert, Entwicklermodus/Neuladen, öffentlicher
  Vorschaumodus ohne lokale Video-/Materiallinks, fehler-/warnungsfreie Konsole.
- **Grenzen:** Excel-Dateien werden weiterhin durch die Lehrkraft geprüft.
  Video-Erreichbarkeit/Einbindung geprüft, Codec-Wiedergabe nicht zugesichert.
  Keine Installation, keine Online-Veröffentlichung und kein Push durchgeführt.
- **Nächste Einheit:** L1.5 „Tabellen logisch strukturieren“ anhand der Originale
  zum Sommerfest vollständig auf eine eigene Lernseite übertragen. Der zuvor
  blockierte Löschauftrag für den alten L1.1-PDF-Ordner bleibt unverändert offen.


### Übergabe H-2026-09-19-07 – L1.5 vollständig und Abschnittsbedienung

- **Status:** abgeschlossen am 19. September 2026, lokal umgesetzt und geprüft.
- **Auftrag:** Die unterbrochene Fortsetzung abschließen: Informationen und
  vollständige Aufgaben der nächsten Einheit direkt in deren eigener Seite;
  zusätzlich Entwickler-Button verbreitern und per Hotkey ein-/ausblenden,
  metallische und mittig ausgerichtete Plus-/Minus-Symbole für Lernabschnitte.
- **Neue Lernseite:** `l1-5.html` / `l1-5.js`, sieben native aufklappbare Abschnitte:
  Lernziel, Tabellenaufbau, Formelbezüge, Datentypen/Gestaltung, vollständiger
  Sommerfest-Auftrag, Änderungstests/Fehlerdiagnose und freiwillige Vertiefung.
  `content.js` öffnet die eigene Seite; keine separaten PDF-/DOCX-Arbeitsblätter
  erforderlich. Lernende erstellen ihre Arbeitsmappe direkt in Excel.
- **Quellenabgleich:** Beide lokalen L1_5-DOCX aus
  `../BPE1/Lernfortschritt_1/Aufgabenstellungen` bzw. `Informationsmaterial`
  vollständig ausgelesen und gegen die Lernseite geprüft. Keine Musterlösung
  und keine fertigen Aufgaben-Ergebnisbeträge übernommen.

| Originalinhalt | Umsetzung auf L1.5 |
| --- | --- |
| Sommerfest, 10,00 € Beitrag, eigener Tabellenentwurf | Lernziel und vollständiger Auftrag in Abschnitt 05 |
| Fünf Personen mit Vor-/Nachname, Klasse, Wohnort, Telefon, Zahlung | Fünf vollständige Datenkarten in Abschnitt 05; Werte einzeln im Browser geprüft |
| Kostenbeitrag, bisherige Zahlung, offener Betrag je Person | Alle acht geforderten Merkmale explizit aufgeführt; Beitrag per Zellbezug, offene Beträge per Formel |
| Dateiname L1_5 Sommerfest.xlsx | Arbeitsweg, Abschlusscheck und Speicherauftrag; Ergebnisse-Ordner ergänzt |
| Titel, gemeinsamer Kopf, Tabellenrumpf; größere Anzahl in Zeilen | Strukturübersicht und Eingabe-/Ausgabe-Erklärung in Abschnitt 02 |
| Titel zentriert und mit Abstand, betonte Spaltenüberschriften | Gestaltungshilfen in Abschnitt 04 |
| Einheitliche Dezimalstellen, Tausenderpunkt, Dezimalkomma, zwei Stellen für Währung | Zahlenformat mit eigenständigem Beispiel in Abschnitt 04 |
| Gezielte senkrechte/waagerechte Linien; waagerecht nur Summen/Gruppierungen; zurückhaltende Farben | Abschnitt 04 und Gestaltungsauftrag |
| Möglichst eine Seite, sonst Überschriften wiederholen | Druckvorschau, Ausrichtung und Wiederholungszeilen in Abschnitt 04 |
| Gemeinsame Werte einmal; berechenbare Inhalte durch Formeln; Zelladressen statt fester Zahlen | Abschnitt 03 und Arbeitsauftrag, mit verständlicher Einführung absoluter Bezüge |

- **Fachliche Ergänzung:** Kopf enthält gemeinsame Eingaben, Tabellenkörper sowohl
  individuelle Eingaben als auch Ergebnisse. Absolute Bezüge halten die zentrale
  Eingabezelle beim Kopieren fest; separates Werkstatt-Beispiel mit Microsoft-Link.
  Telefonnummern vor der Eingabe als Text formatieren. Zwei Änderungstests prüfen
  Einzelzahlung und zentralen Beitrag; danach Originalwerte wiederherstellen.
  Freiwillige Erweiterung mit erfundener Person in separater Kopie.
- **Fortschritt:** Zugang nach L1.4, drei eigene Checks plus Lehrkraftbestätigung,
  Abschlussaktion mit 100 Punkten. Rücknahme sperrt L1.6 erneut und widerruft einen
  dortigen Abschluss; Checks bleiben erhalten. Entwicklervorschau schreibgeschützt.
- **Entwickler-Button:** Volle Breite und zentrierter Text, bündig mit den
  Profilaktionen. AltGr+S bzw. Strg+Alt+S schaltet die Sichtbarkeit abwechselnd um.
  Sichtbarkeit und aktiver Modus sind getrennt; Ausblenden beendet den Modus nicht.
  Erneuter Klick beendet ihn weiterhin. Fokus geht beim Ausblenden zurück zum
  Schließen-Button des Dialogs. Neuladen beendet die Vorschau wie bisher.
- **Abschnittssymbole:** Gemeinsamer silberner Metallstil mit dezentem Glanz,
  Kontur und Schatten. Geometrisch zentrierte Balken statt Schriftzeichen:
  geschlossen Plus, geöffnet Minus. Native Tastaturbedienung bleibt erhalten;
  Symbol ist dekorativ und kein verschachtelter Button. Gilt für eigene Seiten
  und die kompakten Lektionen auf der Übersicht. Systemkontrast berücksichtigt.
- **Prüfungen:** Node-Syntaxprüfung, git diff --check, eindeutige IDs und lokale
  Ressourcen. Edge/Playwright: Quelle aller fünf Datensätze, Zugang ohne/mit
  Vorgängerabschluss, sieben Abschnitte und Aufgaben-Sprung, fehlende Checks/
  Lehrkraft, Abschluss/100 Punkte/Reload, Rücknahme einschließlich altem L1.6-
  Abschluss, zweites Profil unverändert, Lernpfad-Navigation. Plus/Minus und
  Tastaturbedienung auf L1.1 bis L1.5 geprüft. Entwickler-Button: volle Breite
  bei 1440/768/390/320 Pixeln, Anzeigen/Verbergen auch bei aktivem Modus, Ein/Aus
  durch Klick, unveränderter Lernstand, alle 27 Einheiten ohne Profil freigegeben,
  Fortschrittsfelder gesperrt, Reload beendet Vorschau. Keine Browserfehler;
  L1.5 ohne Seitenüberlauf bei allen vier Breiten. Hell/Dunkel, Desktop/Mobil
  sowie Metall-Icons und Profilmanager visuell geprüft.
- **Dateien dieses Arbeitspakets:** neue `l1-5.html`, `l1-5.js`; Ergänzungen in
  `content.js`, `developer-mode.js`, `lesson-workspace.css`, `README.md` und hier.
  Vorhandene Änderungen anderer Arbeitspakete erhalten. Keine Veröffentlichung,
  kein Push, keine Installation. Excel-Ergebnisprüfung bleibt bei der Lehrkraft.
- **Fortsetzungsregel:** Für jede folgende Einheit stets Informationsmaterial
  UND sämtliche Originalaufgaben samt benötigten Ausgangsdaten übertragen;
  fachlich ergänzen, Quellenabgleich dokumentieren, keine bloße Kurzfassung.
- **Nächste Einheit:** L1.6 „Vertiefung: kaufmännische Rechenmodelle“ mit allen
  Originalaufgaben und Informationsmaterialien ausarbeiten. Der früher blockierte
  Löschauftrag zum L1.1-PDF-Ordner bleibt unverändert separat offen.


### Übergabe H-2026-09-19-08 – Veröffentlichung 0.7.0 und Sawazki Electronics

- Jakob hat Push und Veröffentlichung ausdrücklich beauftragt.
- Version 0.7.0 bündelt die ausgearbeiteten Lernseiten bis L1.5, aufklappbare
  Abschnitte, temporäre Entwicklervorschau, Metall-Symbole und Profilverbesserungen.
- Excel-Lab wird auf Sawazki Electronics auf Start- und Projektseite mit dem
  vorhandenen lokalen grünen Symbol und direktem GitHub-Pages-Link vorgestellt.
- Veröffentlichung aus einem sauberen temporären Checkout außerhalb von Google
  Drive, da eine desktop.ini in lokalen Git-Referenzen den Fetch störte.
- Originalmaterialien, lokale Schülerdaten und private Dateien bleiben ausgeschlossen.
