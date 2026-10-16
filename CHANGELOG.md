# Änderungen an Excel-Lab

Ein Absatz je Veröffentlichung, neueste zuerst. Einzelheiten zu jeder Änderung stehen in
[`documentation/documentation.md`](documentation/documentation.md) (Taskstatus) und in
[`documentation/claude2codex.md`](documentation/claude2codex.md).

## 0.31.0 – 2026-10-16

**Textmarker in jeder Lerneinheit (wie in WorkbenchLab).** Oben in jeder Einheit steht eine kleine, beim Lesen mitlaufende Leiste mit vier Farben (Gelb, Mint, Koralle, Grün) und einem Radierer. Text auswählen, Farbe wählen – fertig. Die Markierungen gehören zum Profil, bleiben nach dem Neuladen erhalten und reisen mit der Speicherdatei. Ändert sich ein Absatz später, wird eine nicht mehr passende Markierung einfach nicht angezeigt.

## 0.30.0 – 2026-10-16

**Fortschritt in der Pfadleiste.** Jede Lerneinheit zeigt ihren Fortschritt als schmalen grünen Balken mit Prozentwert rechts in der Pfadleiste („Fortschritt L1.1“); Status und XP stehen im Tooltip. Die Fortschrittskarte neben dem Titel und die Zeile „L1.1 · BPE 1.1 · 100 XP“ über dem Titel entfallen, der Titel nutzt die volle Breite. Beim Überfahren hebt sich der Balken an und leuchtet; ein Klick zeigt Status, Arbeitsschritte, Verständnis-Check, Lehrkraft, XP und Bonus. Die Kopfzeile mit Profil und Symbolen bleibt jetzt auch auf schmalen Bildschirmen beim Scrollen sichtbar; ihr Untertitel lautet überall „Tabellenkalkulation verstehen“. Auf der Startseite schließt die Leiste „Verstehen · Üben · Prüfen“ nahtlos an das Bild an und bekommt beim Überfahren einen Lichtreflex; die Überschrift lautet „Überblick“ statt „Überblick BPE1“ (der Bildungsplanbezug steht in den Quellen).

## 0.29.1 – 2026-10-16

**Pfadleiste beim Überfahren.** „Übersicht“ und die übrigen Glieder der Pfadleiste heben sich beim Überfahren und beim Tastaturfokus sanft an, bekommen eine grüne Kante und einen weichen Glanz – wie die Symbolknöpfe oben rechts.

## 0.29.0 – 2026-10-16

**Feinschliff im Design (Wunsch Jakob: edel und professionell).** Karten und Panels folgen einer gemeinsamen Ebenen-Sprache mit feiner Lichtkante und weichen, mehrschichtigen Schatten; anklickbare Karten heben sich beim Überfahren sanft an. Überschriften sind ausbalanciert umbrochen, der Fokusring für die Tastatur ist einheitlich. Die Kopfzeile trägt eine haarfeine Metallkante, die Fußzeile eine zur Mitte aufleuchtende Lichtkante. Der gebürstete Hintergrund ist etwas ruhiger. Auf der Startseite ist die Leiste „Verstehen · Üben · Prüfen“ aus einem Stück, und das Detailfeld im Überblick füllt seine Höhe ruhig aus.

## 0.28.4 – 2026-10-16

**Drucken immer hell.** Ausdrucke verwenden unabhängig vom gewählten Farbschema die helle Palette; im dunklen Schema kam vorher helle Schrift aufs weiße Papier. Die Klassenübersicht druckt im Querformat mit kleineren Statusfeldern, sodass alle 27 Einheiten auf die Seitenbreite passen.

## 0.28.3 – 2026-10-16

**Formelsammlung als Merkblatt.** Wer die Formelsammlung mit Strg+P druckt, erhält ein kompaktes Merkblatt: drei Spalten, ohne Kopfzeile, Suche und Kopierknöpfe, mit dunkler Schrift auch im dunklen Farbschema. Am Bildschirm ändert sich nichts.

## 0.28.2 – 2026-10-16

**Abstände in Aufgaben.** Folgt auf eine Schrittliste direkt die nächste Teilaufgabe wie „Aufgabe B · Gewinnermittlung Teil 2“, hat die Überschrift jetzt Abstand nach oben (L1.3, L3.3, L3.4, L3.5).

## 0.28.1 – 2026-10-16

**Klassenübersicht: Zahlen in der CSV.** Einheiten, Bonus, XP und NAGOLD stehen als echte Zahlen in der CSV. Bisher wurde eine negative NAGOLD-Summe wie −5 vom Formelschutz als Text „'-5“ geschrieben, Excel konnte damit nicht rechnen. Texte bleiben weiter gegen Formeln geschützt. Außerdem laden die Situationsbilder von L1.1 und L1.2 erst beim Scrollen.

## 0.28.0 – 2026-10-16

**Gebürstetes Metall, Fortschritt im Profil, Tastenkürzel (Wünsche Jakob).** Kopfzeile, Menüleiste, Lernpfad-Menü, Pfadleiste „BPE1 › Übersicht“, Symbolknöpfe, große Knöpfe, Fenster und Seitenhintergrund tragen einen feinen, unregelmäßigen Metallschliff (SVG-Rauschen im Stylesheet, keine Bilddatei); die Pfadleiste ist eine Metallschiene mit Schatten. Der Gesamtfortschritt steht nicht mehr als Karte im Startbild, sondern als Balken (L1–L4) in der Profilkarte; ein Klick zeigt die Einheiten je Lernschritt. Der Bereich unter dem Startbild rückt nach oben. Alt+S speichert sofort (Tooltip am Knopf „Speichern“), Esc schließt den Lernnachweis. Das Speicherfenster hat nur noch einen kurzen Satz statt zweier Hinweise. Die Pfadleiste beginnt mit „Übersicht“ (ohne „BPE1“), zum Beispiel „Übersicht › L1 › L1.1“; jedes Glied ist eine kleine Metallplakette. Der gebürstete Hintergrund wirkt jetzt auch auf der Startseite; das frühere feine Zellraster im Seitenhintergrund ist entfernt.

## 0.27.0 – 2026-10-16

**Startkapital und Jahresziel (Antworten Jakob vom 16. Oktober).** In der NAGOLD-Tabelle gibt es den Anlass „Startkapital“ mit 5 NAGOLD, einmal je Schuljahr (ab 1. August); ein zweites im selben Schuljahr wird nicht gespeichert. Das NAGOLD-Feld im Profil zeigt einen schmalen goldenen Balken „x / 100 · Jahresziel“; mehr als 100 NAGOLD sind möglich, die Erklärung steht im Tooltip. Nach dem Abschluss einer Einheit lautet die Meldung kurz „L1.2 geschafft: +100 XP, +5 NAGOLD. Jetzt über das Disketten-Symbol speichern.“ Im Fenster „Versionen und Impressum“ steht ein kurzer Datenschutzabschnitt. Intern: Die XP-Regel steht nur noch in `save-core.js` (Profilknopf, Startseite, Lernnachweis, Klassenübersicht).

## 0.26.0 – 2026-10-16

**Ein Kern für Speichern und Laden.** Startseite und Lernseiten verwenden jetzt dasselbe Modul `save-core.js` für Dateiformat, Bereinigung des Profils, XP in der Datei, Dateinamen, „Zuletzt gespeichert“ und das Übernehmen einer Datei. Bisher war das zweimal programmiert. Für Lernende ändert sich nichts; die Speicherdateien bleiben im selben Format und lassen sich weiter auf beiden Seitenarten laden.

## 0.25.2 – 2026-10-16

**Klassenübersicht nachgebessert.** Die NAGOLD-Summe im Einträge-Fenster ist golden, auf dem Handy stehen die Feldbezeichnungen vor jedem Wert. Der Einleitungstext nennt NAGOLD und das Disketten-Symbol statt „im Profil über Speichern“. README auf den aktuellen Stand gebracht (Profil, Speicherstand, NAGOLD, Testserver).

## 0.25.1 – 2026-10-16

**Profilfenster der Lernseiten: Hinweis bei Profilwechsel.** Wird das Profil in einem anderen Fenster gewechselt, während das Profilfenster einer Lernseite offen ist, zeigen die Felder das neue Profil und ein Hinweis erklärt das; vorher verschwand die Meldung sofort wieder. Das Profilfenster der Lernseiten hat jetzt eine feste Browserprüfung.

**Klassenübersicht: NAGOLD-Einträge ansehen.** Ein Klick auf die NAGOLD-Zahl einer Person zeigt ihre Einträge mit Datum, Uhrzeit, Anlass und Punkten, nur zum Ansehen. So lässt sich die Selbstauskunft prüfen; Abzüge sind rot markiert.

## 0.25.0 – 2026-10-16

**NAGOLD wie in WorkbenchLab 0.48.0.** Die NAGOLD-Tabelle speichert gültige Zeilen und Löschungen sofort; der Knopf „Speichern“ entfällt, Schließen nimmt nichts zurück. Eine unvollständige Korrektur behält den letzten gültigen Wert, eine unvollständige neue Zeile wird nicht gespeichert, ein Hinweis zeigt beides an. Abzüge sind bis −10 möglich (für besonders schwere Fälle wie Manipulation). Der neue Anlass „Anwesenheit“ trägt automatisch 2 NAGOLD vor. Scrollen in der Vorschlagsliste schließt sie nicht mehr. Nicht übernommen: Startkapital und Jahresziel aus WorkbenchLab – sie verändern die Bewertung und bleiben Jakobs Entscheidung.

## 0.24.1 – 2026-10-16

**Aufgeräumt und geprüft.** Verwaiste Styles des früheren XP-Symbols, des früheren XP-Fensters der Lernseiten und entfernter Hinweistexte gelöscht; keine sichtbare Änderung. Der neue L1.2-Auftrag und das L1.1-Budget sind in echtem Excel nachgerechnet (29 Prüfungen), Speichern und Laden auf den Lernseiten hat eine feste Browserprüfung.

## 0.24.0 – 2026-10-16

Sammel-Release für die Änderungen vom 12. bis 16. Oktober. Codex hat sie unter 0.23.0 veröffentlicht; dieser Stand gibt ihnen eine eigene Versionsnummer, damit Browser die geänderten Skripte sicher neu laden.

**Von Codex (12.–15. Oktober, Wünsche Jakob).** L1.1: korrigierte Laptop-Grafik, Budget von 150 € mit Restbudget, keine Bildunterschrift mehr. L1.2: neuer Hauptauftrag „Materialbestellung für einen Kundenworkshop“ mit neuer Grafik, neun Formeln, drei Änderungstests und fünf statt drei Verständnisfragen; L1.3 formatiert wieder die Getränkeliste aus L1.1. Direkte Situationssprache in 17 Einheiten statt „fiktiv“ oder „frei erfunden“. Schlichter Seitenfuß auf allen Lernseiten mit „Designed by Sawazki Electronics“. Fragenüberschriften stehen innerhalb der Karten. Profilfenster wie auf der Startseite und Disketten-Symbol mit Speichern, Laden und „Zuletzt gespeichert“ auf allen 27 Lernseiten.

**Von Claude (16. Oktober).** Die NAGOLD-Tabelle ist auf Startseite und Lernseiten dieselbe: ein Feld „Wofür“ mit Vorschlagsliste, gezeichnete Symbole, Datum im deutschen Format. Auf dem Handy quillt die Tabelle bei geöffneter Vorschlagsliste nicht mehr über „Speichern“. Beim Laden auf einer Lernseite bleiben NAGOLD-Zeilen auch dann erhalten, wenn ein Skript nicht geladen wurde.

## 0.23.0 – 2026-10-11

**Navigation ohne „Übersicht“ (Wunsch Jakob).** Der Punkt „Übersicht“ entfällt aus der Leiste, weil das Logo bereits dorthin führt. Die Pfadzeile oben links zeigt dafür „BPE1 › Übersicht“ und auf den anderen Ansichten „BPE1 › Lernpfad“, „BPE1 › Formelsammlung“ oder „BPE1 › Quellen“; „BPE1“ führt immer zur Übersicht. Im Handy-Dock steht der Lernpfad oben über die ganze Breite.

## 0.22.2 – 2026-10-11

**Profilfenster neu geordnet (Wünsche Jakob).** Oben die Profilkarte, darunter Kürzel und Klasse nebeneinander, dann XP und NAGOLD als zwei gleich hohe Felder. Im NAGOLD-Feld zeigt ein goldener Stift, dass sich die Einträge bearbeiten lassen. Der Lernnachweis hat oben rechts ein X, das zurück in die Profil-Übersicht führt.

## 0.22.1 – 2026-10-11

**Profilfenster schlanker (Wünsche Jakob).** Breiter und zweispaltig, dadurch ohne Rollbalken. Im XP-Abschnitt stehen nur noch XP, Level, Balken und „Noch n XP bis Level n“; Herkunft der XP, Level-Regel und der Hinweis auf die nächsten NAGOLD erscheinen als Tooltip. Die Profilkarte zeigt nur Kürzel, Klasse und Fortschritt, die Browser-ID entfällt.

**NAGOLD-Tabelle wie in WorkbenchLab (Wunsch Jakob).** „Wofür“ ist ein einziges Feld mit aufklappender Vorschlagsliste: tippen filtert, Pfeiltasten wählen, Enter übernimmt. Punkte sind ganze Zahlen von −5 bis 5 (Abzüge durch die Lehrkraft möglich), 0 gilt nicht als Eintrag; neue Zeilen beginnen bei 0.

## 0.22.0 – 2026-10-11

**XP im Profilknopf (Wunsch Jakob).** Der Profilknopf zeigt statt „Profil“ den Stand „n XP · n NAG“ über dem Kürzel; das eigene XP-Symbol entfällt. Ein Klick aufs Profil zeigt Level, die fehlenden XP bis zum nächsten Level, die Herkunft der XP und wofür es die nächsten NAGOLD gibt. Auf den Lernseiten öffnet der Profilknopf diese Übersicht in einem eigenen Fenster; auf dem Handy steht der XP-Stand neben dem Kürzel-Feld.

**Speicherstand: Tooltips und „Zuletzt gespeichert“ (Wünsche Jakob).** Die Erklärungen zu „Speichern“ und „Laden“ erscheinen nur noch beim Darüberfahren oder bei Tastaturfokus. Neu ist die Auswahl der fünf zuletzt gespeicherten Stände: Jeder Klick auf „Speichern“ legt neben der Datei eine Kopie im Browser ab, die sich über die Liste wieder laden lässt. Die Liste gilt nur für diesen Browser; für ein anderes Gerät bleibt die Datei nötig.

## 0.21.1 – 2026-10-11 (zusammen mit 0.22.0 veröffentlicht)

**Speicherstand über das Disketten-Symbol (Wunsch Jakob).** „Speichern“ und „Laden“ stehen nicht mehr im Profilfenster. Links neben dem Profil sitzt ein Disketten-Symbol; es öffnet das Fenster „Speicherstand“ mit beiden Knöpfen, einer Zeile zum aktuellen Stand und, falls vorhanden, der Rettungskopie.

## 0.21.0 – 2026-10-11

**NAGOLD im Profil (Auftrag Jakob, wie in WorkbenchLab).** Im Profil steht der NAGOLD-Stand; ein Klick öffnet die Punktetabelle mit Datum, Uhrzeit, Anlass und Punkten. Jede abgeschlossene Lerneinheit trägt automatisch einmalig 5 NAGOLD ein (27 Einheiten: 135). Eigene Zeilen mit 1 bis 5 Punkten lassen sich hinzufügen, bearbeiten und löschen; gespeichert wird erst mit „Speichern“. Ältere Lernstände erhalten je abgeschlossener Einheit eine Zeile ohne Datum. Die Tabelle reist in der Speicherdatei mit; Lernnachweis und Klassenübersicht (auch CSV) zeigen die Summe. Die Tabelle ist eine Selbstauskunft, verbindlich bleibt die Bewertung der Lehrkraft.

## 0.20.10 – 2026-10-10

**Klassenübersicht: Seitenfuß am unteren Rand.** Bei leerer Übersicht stand der Fuß mitten auf dem Bildschirm und klebte direkt unter der Statuszeile.

## 0.20.9 – 2026-10-10

**Übersicht schließt sauber am Seitenfuß an.** Unter dem letzten Aufklapp-Bereich schien ein schmaler Streifen des Seitenhintergrunds mit Zellraster durch; die Fläche der Übersicht reicht jetzt bis zum Fuß. Neuer Browsertest gegen überdeckten Text auf allen Ansichten.

## 0.20.8 – 2026-10-10

**Quellen: Kartennummer überdeckt den Text nicht mehr** (Hinweis Jakob). Die große „03“ ragte in die erste Textzeile von „Lizenz und Veröffentlichung“.

**Aufklapp-Symbole der Übersicht neu gezeichnet** (Hinweis Jakob). Plus und Minus sind jetzt gezeichnete, exakt mittige Balken in einem größeren Knopf statt Schriftzeichen; beim Öffnen dreht sich das Plus zum Minus.

**Klassenübersicht umgezogen** (Wunsch Jakob). Der Link „Für Lehrkräfte: Klassenübersicht“ steht nicht mehr im Seitenfuß, sondern als eigener Bereich „Für Lehrkräfte“ am Ende der Ansicht „Quellen“.

**Hinweis bei unvollständig geladener Seite.** Kann der Browser die Inhaltsdaten nicht laden (abgebrochene Verbindung), blieben Lernseite und Startseite bisher kommentarlos gesperrt oder halb leer. Jetzt erscheint „Seite nicht vollständig geladen“ mit dem Knopf „Seite neu laden“ und dem Hinweis, dass der Lernstand nicht betroffen ist. L4.1: Schritt 3 in zwei Absätzen.

## 0.20.7 – 2026-10-10

**Glossar erweitert.** Sieben weitere Fachbegriffe aus den Informationsblättern: Funktionsassistent, Fehlerwert, Tabellenkopf, Tabellenrumpf, Bereich_Verweis, Punktwolke und Regressionsgerade (jetzt 33 Einträge).

## 0.20.6 – 2026-10-10

**Informationsblätter L1 bis L4 abgeglichen.** Alle 28 Blätter Aussage für Aussage mit den Lernseiten verglichen; fachlich fehlte nichts. Ergänzt wurden Excel-Bezeichnungen, die die Blätter nennen: Funktionsassistent „Funktion einfügen“ mit der Kategorie „Datum & Zeit“ (L3.2), „Empfohlene Diagramme“, „Alle Diagramme“ und die drei Schaltflächen neben dem Diagramm (L4.1), Punktwolke, Regressionsgerade und die Häkchen für Formel und Bestimmtheitsmaß (L4.6); außerdem „An Zellengröße anpassen“ (L1.3), Eingabeteil, Ausgabeteil und Tabellenrumpf (L1.5), Spalten und einzelne Zellen einfügen mit Formatübernahme sowie der Fehlerwert #WERT! beim Kopieren (L2.2).

## 0.20.5 – 2026-10-10

**Kleinschriften lesbarer.** Schlagworte, Schrittbeschreibungen, Merksätze, Abzeichen und Listenziffern erreichen jetzt in allen 450 geprüften Kombinationen aus Schema, Hintergrund und Schriftton den Mindestkontrast von 4,5 : 1.

## 0.20.4 – 2026-10-10

**Kontrast nachgebessert.** Stufen-Abzeichen und Einheiten-Kürzel im Lernpfad sind im hellen Schema dunkler und damit lesbar (vorher unter 2 : 1). Die Seite hat unter dem mehrschichtigen Hintergrund wieder eine feste Grundfarbe.

## 0.20.3 – 2026-10-10

**Lernseiten auf dem Handy.** Die Knöpfe am Seitenanfang stehen kompakter: „Zur Aufgabe“ über die ganze Breite, „Alle öffnen“ und „Alle schließen“ nebeneinander, darunter „Drucken“. Handy-Ansicht von Startseite und Lernseite in beiden Schemata angesehen.

## 0.20.2 – 2026-10-10

**Profildialog aufgeräumt.** Die Knöpfe „Lernnachweis“ und „Rettungskopie herunterladen“ nehmen die volle Breite ein und schließen bündig an „Speichern“ und „Laden“ an. Dialoge für Profil, XP und Darstellung in beiden Schemata angesehen.

## 0.20.1 – 2026-10-10

**Feinschliff, zweiter Teil.** Karten der Formelsammlung, des Glossars, der Quellen und die Lernpfad-Zusammenfassung erhalten dieselbe Tiefe wie die Lernseiten; Formelzeilen als eingelassenes Feld; Such- und Filterleiste als Glasfläche; Markierungsfarbe und Bildlaufleiste im Stil der Seite. Die vier weiteren Hintergrundoptionen mit dem neuen Hintergrund angesehen.

## 0.20.0 – 2026-10-10

**Feinschliff am Design.** Hintergrund aus weichen Lichtflächen, kaum sichtbarem Zellraster und Tiefenverlauf (beide Schemata, alle Darstellungsoptionen); Nebenbuttons im hellen Schema als gebürstetes Perlmetall statt dunkler Blöcke; einheitlicher Fokusrahmen; Kleinstschriften angehoben. Keine Bilddatei geändert.

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
