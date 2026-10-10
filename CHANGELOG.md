# Änderungen an Excel-Lab

Ein Absatz je Veröffentlichung, neueste zuerst. Einzelheiten zu jeder Änderung stehen in
[`documentation/documentation.md`](documentation/documentation.md) (Taskstatus) und in
[`documentation/claude2codex.md`](documentation/claude2codex.md).

## 0.19.2 – 2026-10-10

**XP-Dialog mit Aufschlüsselung.** Der Dialog zeigt, wie viele XP aus abgeschlossenen Einheiten und wie viele aus Bonusaufgaben stammen. Außerdem ohne App-Änderung: Node-Tests laufen bei jedem Push auf GitHub, `tools/build-loesungen.cjs` erzeugt ein Lösungsheft für die Lehrkraft, Abschnitte 6, 7 und 9 der Projektdokumentation aktualisiert.

## 0.19.1 – 2026-10-10

**Ungenutzte Styles entfernt.** 66 Regeln und 80 einzelne Selektoren aus `styles.css` und `home.css`, die nur Klassen ohne Verwendung in HTML und JavaScript nannten (rund 9 KB). Vorher-Nachher-Vergleich von 132 Bildschirmfotos ohne sichtbaren Unterschied.

## 0.19.0 – 2026-10-10

**Lernnachweis zum Ausdrucken.** Im Profil führt „Lernnachweis“ zu `nachweis.html`: abgeschlossene Einheiten je Lernfortschritt, Bonusaufgaben und XP, mit Unterschriftszeile für die Lehrkraft.

## 0.18.1 – 2026-10-10

**Laden ersetzt dieselbe Person.** „Laden“ ersetzt den Stand derselben Person (gleiches Kürzel, gleiche Klasse), statt ein weiteres Profil anzulegen; Rückfrage bei weniger Abschlüssen.

## 0.18.0 – 2026-10-10

**Zweite Bonusaufgabe je Einheit.** 27 Transferaufgaben mit neuen Daten; zusammen 54 Bonusaufgaben, höchstens 5.400 XP. Neues Feld `bonus2` im Lernstand.

## 0.17.0 – 2026-10-10

**Glossar.** 26 Fachbegriffe in der Formelsammlung, mit der Einheit, in der sie eingeführt werden; die Suche durchsucht Formeln und Glossar.

## 0.16.0 – 2026-10-10

**Fehlerwerkstatt.** Sieben Karten zu #NV, #DIV/0!, #WERT!, #NAME?, #BEZUG!, #ZAHL! und ##### in der Formelsammlung; jedes Beispiel in Excel ausgelöst.

## 0.15.0 – 2026-10-10

**Klassenübersicht und Druckansicht.** `lehrkraft.html` liest Speicherdateien lokal ein und zeigt Abschlüsse, Bonusaufgaben und XP je Person, mit CSV-Export. Lernseiten lassen sich vollständig drucken.

## 0.14.1 – 2026-10-10

**Bonustabellen auf Handybreite.** Tabellen der Bonusaufgaben und der Abschnitte KFZ-Steuer und PLZ-Suche passen in den Rahmen.

## 0.14.0 – 2026-10-10

**Gemeinsames Lernpfad-Menü.** Aufbau und Bedienung des Menüs liegen einmal in `nav-menu.js`. Danach: 28 Browsertests von Codex ins Repository übernommen.

## 0.13.1 – 2026-10-10

**Zugänglichkeitstest.** Vorlesbare Namen, Überschriften, ARIA-Verweise und Tab-Reihenfolge als Test über alle Seiten; ungenutzter Lektionsdialog entfernt.

## 0.13.0 – 2026-10-10

**Sicheres Wiederöffnen und bessere Lesbarkeit.** Wiederöffnen ändert nur die eine Einheit und nimmt keine anderen Abschlüsse zurück; dunklere Akzent- und Nebenschrift im hellen Schema; Rettungskopie herunterladbar.

## 0.12.1 – 2026-10-10

**L3.6 vollständig nach BPE1.** Die Vertiefungsaufgaben KFZ-Steuer und PLZ-Suche ergänzt, dazu der vierte SVERWEIS-Parameter.

## 0.12.0 – 2026-10-10

**Bonusaufgaben mit Extra-XP.** Je Einheit eine freiwillige Vertiefungsaufgabe mit Kontrollwert, 50 Bonus-XP. Neues Feld `bonus` im Lernstand.

## 0.11.1 – 2026-10-09

**Meldung zum nicht lesbaren Lernstand.** Die Meldung bleibt 20 Sekunden sichtbar.

## 0.11.0 – 2026-10-09

**Einheitliche Lernseiten und XP.** Gemeinsamer Ablauf aller 27 Lernseiten in `lesson-core.js`, XP statt Punkte, gemischte Antworten im Verständnis-Check, Fotos verlustfrei als WebP, Rettungskopie bei beschädigtem Lernstand, Versionsparameter an Skripten und Styles.

## 0.10.1 – 2026-10-04

**Alle 27 Lernseiten verfügbar.** L4.7 mit betrieblichen Diagrammen und L4.8 mit Messdaten, Modellvergleich und Prognosen ergänzt; mit praktischen Aufgaben und Verständnis-Checks.

### Didaktische Überarbeitung im Stand 0.10.1 (4. bis 7. Oktober 2026)

Aus der README hierher verschoben, Wortlaut unverändert:

Bei einem Profilwechsel werden noch ausgewählte Antworten und Rückmeldungen
im Verständnis-Check entfernt. Die Antworten gehören damit ausschließlich
zum jeweiligen Profil; bereits gespeicherte Abschlüsse bleiben erhalten.

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

L3.1 präzisiert den Zellplan ohne Vorlage
und ergänzt Grenz-/Jahrestests sowie einen selbstständigen Versandkosten-Transfer.
L3.2 ergänzt Tests der Kette Datum → Jahr → Tarif → Preis sowie eine unabhängige
Mengenpreis-Aufgabe mit Grenzfällen, Parameteränderungen und Gesamtpreisvergleich.
L3.3 ergänzt einen konkreten Toto-Zellplan, Einzeländerungstests und eine
Projektkassen-Aufgabe mit bewusster Fehlzuordnung trotz passender Gesamtsumme.
L3.4 ergänzt letzte-Zeile-/Punktetests und eine Vorratsliste mit lesbaren Hinweisen,
Grenzfällen und Prüfung des erweiterten Formatierungsbereichs.
L3.5 ergänzt vollständige Treffer-/Fehlertests und eine Artikelbestellung mit
fehlendem Preis, Preisänderung und bewusster Erweiterung der Suchmatrix.
L3.6 ergänzt gezielte Änderungen der Noten-Rechenkette und eine unabhängige
Zeitplanung zum Vergleich von Einzelrundung und Rundung der Gesamtsumme.

Online veröffentlicht und geprüft am 04.10.2026: L3.7 ergänzt Modelltests und eine
eigenständige Schulfest-Kalkulation mit Zielwertsuche, ganzen Gästezahlen und
einem unerreichbaren Ziel. L3.8 ergänzt eine Empfehlung für komplementäre
Fallauswahl sowie ein Testprotokoll und konkrete Änderungstests für alle sechs Fälle.
L4.1 ergänzt Datenlesen ohne unbelegte Ursachenbehauptung und eine AG-Tabelle
mit bekannter Null, neuer Kategorie und expliziter Prüfung von Summen-/Diagrammquelle.
L4.2 ergänzt erneutes Sortieren nach einer Änderung sowie einen isolierten
Fehlzuordnungstest: Eine unveränderte Summe beweist keine richtigen Namen-Wert-Paare.
Beide Einheiten unterscheiden Datenänderung von optischer Änderung durch automatische Skalen.
L4.3 ergänzt belegte Zeitreihen-Aussagen, absolute/relative Änderungen und eine
Bibliotheks-Aufgabe mit unbekanntem Wert, echter Null und unvollständiger Gesamtsumme.
L4.4 ergänzt einen Zuschlagstest zum Vergleich von Teilnehmer- und Kostenanteilen
sowie einen Budgetfaktor-Transfer: gleiche Verteilung bei anderer Gesamtsumme,
aber keine berechenbaren Kreisanteile bei Gesamtsumme 0.
L4.5 ergänzt einen Drei-Team-Transfer mit Einzelwert-, Summen- und Anteilsfragen
sowie einem absichtlich unvollständigen 100-%-Diagramm und Wiederherstellung.
L4.6 ergänzt eine künstliche Fertigungsreihe mit ungleichen X-Abständen,
Modellprüfung, Einzelpunktänderung, Abweichungen und ausdrücklich unsicherer Extrapolation.
L4.7 ergänzt einen Standortvergleich zum gewichteten Umsatz je Kunde; ein
unbelegter Jahresbezug der Standortkennzahl wurde entfernt.
L4.8 ergänzt einen Fahrtvergleich mit ungleichen Abschnittsdauern, kumulierten
Werten und einer echten Pause; Gesamtgeschwindigkeit und einfacher Mittelwert
der Abschnittsgeschwindigkeiten werden bewusst getrennt.

Online veröffentlicht und geprüft am 04.10.2026: L1.1 bietet eine ausklappbare
Zellplan-Hilfe sowie einen Änderungstest mit eingetippten Ergebniszahlen.
Die Schüler sagen die Auswirkung zweier zusätzlicher Flaschen voraus,
berichtigen die Ergebnisse von Hand und erklären, wozu L1.2 Formeln einführt.
L1.2 erklärt nun die Weiterverwendung der eigenen Arbeitsmappe unter neuem
Namen und das getrennte Blatt Heftkauf mit vollständigen Eingaben und Mengentest.

Online veröffentlicht und geprüft am 04.10.2026: L1.3/L1.4 erklären die Zuordnung
bei eigenen Tabellenaufbauten und die sichere Weiterverwendung des Getränke-Blatts.
L1.6 unterstützt mit Rückrechnungen statt aufklappbaren fertigen Ergebnislisten.

Online veröffentlicht und geprüft am 04.10.2026: L2.1–L2.3 bieten Rückrechnungs-
Hilfen statt fertiger Kontrollbeträge. L2.3 erklärt das Erhalten aller sechs
Zwischenstandsdateien, L2.4 den Start ohne Vorlage und L2.5 die eindeutige
Prozent-Eingabe als ganze Zahl passend zur verwendeten Berechnungsregel.

## 0.10.0 – 2026-10-03

**Themenlandkarte und neue Lernseiten.** Eigene Lernseiten L3.2 bis L4.6, Verständnis-Checks, interaktive Diagrammbeispiele sowie vereinfachte Profile, Speichern/Laden und Darstellungsoptionen.

## 0.9.0 – 2026-09-27

**Neue Lernseiten und edlere Oberfläche.** L2.5 und L3.1 als eigene Lernseiten, Verständnis-Check in L2.1, optionale Video-Tutorials sowie smaragdgrüne Metallgestaltung.

## 0.8.0 – 2026-09-26

**Mehr Lernseiten und Verständnis-Checks.** L1.6 und L2.1 bis L2.4 als eigene Lernseiten; gemeinsames Lernpfad-Menü und verpflichtende Verständnisfragen in L2.2 bis L2.4.

## 0.7.0

**Direkt auf der Lernseite lernen.** Eigene Lernseiten bis L1.5 mit aufklappbaren Informationen und Aufgaben, metallischen Plus-/Minus-Symbolen und temporärer Entwicklervorschau.

## 0.6.1

**Online verfügbar.** GitHub-Pages-Bereitstellung mit datensparsamen lokalen Profilen und sicheren Verweisen auf die offiziellen BPE1-Materialien.

## 0.6

**Mehr entdecken, direkt ausprobieren.** Neue Startseitengestaltung, interaktives Formel-Lab und eigene Lernseite L1.2.

## 0.5

**L1.1 und Lernfortschritt.** Fotorealistisches Startbild, Kapitelmenüs, Punkte, Freischaltung, Fortschrittsbalken und eigene L1.1-Seite.

## 0.4

**Metallisches Erscheinungsbild.** Neues Symbol, gerade Grafiken, Lernschritt-Menü und präziser JSON-Export.

## 0.3

**Schaltflächen.** Metallisch-grüne Aktionsflächen mit Hover- und Fokuszuständen.

## 0.2

**Dokumentation und Einstieg.** Projektübersicht, Arbeitsablauf und Excel-Grundregeln ergänzt.

## 0.1

**Erster Lernprototyp.** Vier Lernschritte, Profile, Fortschritt, Formelsammlung und Materialdownloads.
