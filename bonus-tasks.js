(function () {
  "use strict";

  // Freiwillige Vertiefungsaufgaben: je Einheit eine eigene Aufgabe für Excel
  // mit einem Kontrollwert. Wer den Kontrollwert richtig einträgt, erhält
  // einmalig Bonus-XP. Alle Zahlen sind frei erfunden und unabhängig vom
  // BPE1-Materialpaket. Text in `Backticks` wird als Formel oder Zelle gesetzt.
  // answer: Kontrollwert; tolerance: zulässige Abweichung (Vorgabe 0,005).
  const XP = 50;
  const tasks = {
    "l1-1": {
      title: "Klassenfrühstück planen",
      situation: "Deine Klasse organisiert ein gemeinsames Frühstück. Du übernimmst den Einkauf und brauchst eine saubere Kostenübersicht.",
      table: { head: ["Artikel", "Menge", "Einzelpreis"], rows: [["Brötchen", "30", "0,45 €"], ["Butter", "4", "1,89 €"], ["Käse", "3", "2,49 €"], ["Marmelade", "2", "2,29 €"], ["Orangensaft", "6", "1,39 €"]] },
      steps: ["Lege ein neues Tabellenblatt mit den Überschriften Artikel, Menge, Einzelpreis und Gesamtpreis an.", "Berechne jeden Gesamtpreis mit einer Formel nach dem Muster `=B2*C2`.", "Addiere alle Gesamtpreise mit `=SUMME(...)`."],
      question: "Wie viel kostet der gesamte Einkauf?", unit: "€", answer: 41.45,
      hint: "Prüfe, ob wirklich alle fünf Zeilen im Bereich der SUMME liegen und ob die Preise als Zahlen (nicht als Text) eingegeben sind."
    },
    "l1-2": {
      title: "Bürobedarf nachbestellen",
      situation: "Das Sekretariat bestellt Bürobedarf. Kurz vor dem Absenden ändert sich eine Menge – deine Tabelle soll automatisch mitrechnen.",
      table: { head: ["Artikel", "Menge", "Einzelpreis"], rows: [["Ordner", "12", "2,35 €"], ["Kopierpapier (Karton)", "8", "4,99 €"], ["Textmarker", "15", "0,89 €"]] },
      steps: ["Berechne die drei Gesamtpreise mit Zelladressen und addiere sie mit einer Additionsformel wie `=D2+D3+D4`.", "Notiere die Gesamtsumme. Ändere dann die Menge Kopierpapier von 8 auf 11.", "Beobachte, welche Zellen sich ändern, ohne dass du eine Formel anfasst."],
      question: "Wie hoch ist die Gesamtsumme nach der Änderung auf 11 Kartons?", unit: "€", answer: 96.44,
      hint: "Wenn sich die Summe nicht geändert hat, steht in einer Ergebniszelle eine getippte Zahl statt einer Formel."
    },
    "l1-3": {
      title: "Umsatzanteile lesbar machen",
      situation: "Drei Filialen melden ihren Monatsumsatz. Die Geschäftsleitung möchte den Anteil jeder Filiale auf einen Blick sehen.",
      table: { head: ["Filiale", "Umsatz"], rows: [["A", "12.480 €"], ["B", "9.360 €"], ["C", "15.600 €"]] },
      steps: ["Erfasse die Umsätze als Zahlen und formatiere sie als Währung mit Tausendertrennzeichen.", "Berechne den Gesamtumsatz und in einer weiteren Spalte den Anteil jeder Filiale (Umsatz geteilt durch Gesamtumsatz).", "Formatiere die Anteile als Prozent mit einer Nachkommastelle."],
      question: "Welchen Anteil hat Filiale A (in Prozent, eine Nachkommastelle)?", unit: "%", answer: 33.3, tolerance: 0.05,
      hint: "Teile den Umsatz von A durch den Gesamtumsatz aller drei Filialen. Das Prozentformat multipliziert die Anzeige mit 100."
    },
    "l1-4": {
      title: "Tagesabrechnung der Schulbäckerei",
      situation: "Die Schülerfirma verkauft Backwaren. Eine einzige Formel soll für alle Produkte reichen.",
      table: { head: ["Produkt", "Stück", "Preis"], rows: [["Croissant", "42", "1,20 €"], ["Brezel", "58", "0,95 €"], ["Laugenstange", "35", "1,10 €"], ["Nussschnecke", "27", "1,85 €"], ["Berliner", "46", "1,30 €"], ["Käsebrötchen", "39", "1,60 €"]] },
      steps: ["Schreibe die Umsatzformel nur in die erste Datenzeile.", "Kopiere sie mit dem Ausfüllkästchen bis zur letzten Zeile und kontrolliere in zwei Zeilen die Bearbeitungsleiste.", "Bilde die Summe aller Umsätze."],
      question: "Wie hoch ist der Tagesumsatz?", unit: "€", answer: 316.15,
      hint: "Kontrolliere die letzte kopierte Formel: Sie muss Stück und Preis ihrer eigenen Zeile verwenden."
    },
    "l1-5": {
      title: "Abschlussfahrt: Wer muss noch zahlen?",
      situation: "Für die Abschlussfahrt zahlt jede Person denselben Kostenbeitrag von 85 €. Einige haben erst einen Teil überwiesen.",
      table: { head: ["Person", "Bisher gezahlt"], rows: [["Aylin", "85 €"], ["Ben", "50 €"], ["Chiara", "0 €"], ["David", "85 €"], ["Elif", "40 €"], ["Finn", "85 €"], ["Greta", "60 €"], ["Hamza", "25 €"]] },
      steps: ["Trage den Kostenbeitrag nur einmal in eine eigene, beschriftete Zelle oberhalb der Liste ein.", "Berechne für jede Person den offenen Betrag aus Kostenbeitrag und Zahlung.", "Addiere die offenen Beträge. Ändere testweise den Kostenbeitrag und stelle ihn wieder auf 85 €."],
      question: "Wie viel Geld fehlt insgesamt noch?", unit: "€", answer: 250,
      hint: "Offener Betrag = Kostenbeitrag − Zahlung. Der Kostenbeitrag darf nur an einer Stelle stehen."
    },
    "l1-6": {
      title: "Zinsen für ein Tagesgeld",
      situation: "Eine Auszubildende legt Geld für kurze Zeit an und möchte wissen, was sie an Zinsen erwarten kann.",
      table: { head: ["Angabe", "Wert"], rows: [["Kapital", "4.800 €"], ["Zinssatz pro Jahr", "3,5 (als ganze Prozentzahl)"], ["Anlagedauer", "135 Tage"]] },
      steps: ["Lege Kapital, Zinssatz und Tage in drei beschrifteten Eingabezellen an.", "Berechne die Zinsen mit der kaufmännischen Formel `=Kapital*Tage*Zinssatz/36000`.", "Verdopple testweise die Tage und prüfe, ob sich die Zinsen verdoppeln. Stelle danach 135 Tage wieder her."],
      question: "Wie viele Zinsen erhält sie?", unit: "€", answer: 63,
      hint: "Bei 36000 im Nenner wird der Zinssatz als 3,5 eingegeben, nicht als 0,035 und nicht mit Prozentformat."
    },
    "l2-1": {
      title: "Nachhilfebörse abrechnen",
      situation: "Die SMV vermittelt Nachhilfe. Am Monatsende wird für sechs Tutorinnen und Tutoren der Verdienst berechnet.",
      table: { head: ["Tutor/in", "€ je Stunde", "Stunden"], rows: [["Jana", "9,50", "12"], ["Karim", "11,00", "8"], ["Lea", "10,00", "15"], ["Milan", "12,50", "6"], ["Nora", "9,00", "14"], ["Omar", "10,50", "10"]] },
      steps: ["Berechne den Verdienst in der ersten Zeile mit relativen Bezügen.", "Kopiere die Formel nach unten und prüfe die letzte Zeile in der Bearbeitungsleiste.", "Bilde die Summe aller Verdienste."],
      question: "Wie viel zahlt die SMV insgesamt aus?", unit: "€", answer: 658,
      hint: "Jede Zeile rechnet Stundenlohn mal Stunden derselben Zeile."
    },
    "l2-2": {
      title: "Nachhilfebörse mit Fahrtkostenpauschale",
      situation: "Zusätzlich zum Verdienst aus der Nachhilfebörse (Daten wie in der Bonusaufgabe zu L2.1) erhält jede Person dieselbe Fahrtkostenpauschale.",
      table: { head: ["Tutor/in", "€ je Stunde", "Stunden"], rows: [["Jana", "9,50", "12"], ["Karim", "11,00", "8"], ["Lea", "10,00", "15"], ["Milan", "12,50", "6"], ["Nora", "9,00", "14"], ["Omar", "10,50", "10"]] },
      steps: ["Trage die Pauschale von 7,50 € in eine eigene Zelle ein, zum Beispiel `B3`.", "Erweitere die Formel der ersten Zeile um den absoluten Bezug `$B$3` und kopiere sie nach unten.", "Erhöhe die Pauschale auf 9,00 € und beobachte alle sechs Ergebnisse."],
      question: "Wie hoch ist die Gesamtauszahlung mit 9,00 € Pauschale?", unit: "€", answer: 712,
      hint: "Ohne Dollarzeichen wandert der Bezug auf die Pauschale beim Kopieren in leere Zellen."
    },
    "l2-3": {
      title: "Staffelpreise für Flyer",
      situation: "Eine Druckerei bietet drei Papierqualitäten an. Du erstellst eine Preistabelle für vier Auflagen mit einer einzigen kopierbaren Formel.",
      table: { head: ["Auflage", "Standard 0,35 €", "Premium 0,32 €", "Recycling 0,28 €"], rows: [["10", "?", "?", "?"], ["25", "?", "?", "?"], ["50", "?", "?", "?"], ["100", "?", "?", "?"]] },
      steps: ["Schreibe die Stückpreise in eine Zeile (z. B. `B4:D4`) und die Auflagen in eine Spalte (z. B. `A5:A8`).", "Formuliere in `B5` eine Formel mit gemischten Bezügen wie `=$A5*B$4`.", "Kopiere sie nach rechts und nach unten in alle zwölf Zellen und addiere die zwölf Ergebnisse."],
      question: "Wie groß ist die Summe aller zwölf Preise?", unit: "€", answer: 175.75,
      hint: "Die Spalte der Auflage und die Zeile der Stückpreise müssen fest bleiben: `$A5` und `B$4`."
    },
    "l2-4": {
      title: "Wochenumsatz des Schulkiosks",
      situation: "Der Schulkiosk hat an sechs Tagen geöffnet. Die Leitung möchte Kennzahlen statt Einzelwerten.",
      table: { head: ["Tag", "Umsatz"], rows: [["Montag", "412,50 €"], ["Dienstag", "389,00 €"], ["Mittwoch", "455,20 €"], ["Donnerstag", "501,80 €"], ["Freitag", "478,40 €"], ["Samstag", "620,10 €"]] },
      steps: ["Berechne Summe, Mittelwert, kleinsten und größten Umsatz mit den vier Funktionen.", "Formatiere alle Ergebnisse als Währung mit zwei Nachkommastellen.", "Prüfe den Mittelwert unabhängig: Summe geteilt durch sechs."],
      question: "Wie hoch ist der durchschnittliche Tagesumsatz (zwei Nachkommastellen)?", unit: "€", answer: 476.17,
      hint: "`=MITTELWERT(...)` über genau sechs Zellen; die Summenzelle darf nicht im Bereich liegen."
    },
    "l2-5": {
      title: "Lieferanten vergleichen",
      situation: "Für vier Artikel liegen Angebote von drei Lieferanten vor. Du möchtest wissen, was der Einkauf im besten Fall kostet.",
      table: { head: ["Artikel", "Lieferant 1", "Lieferant 2", "Lieferant 3"], rows: [["Tonerkassette", "12,40 €", "11,90 €", "12,75 €"], ["Briefumschläge", "8,20 €", "8,45 €", "7,95 €"], ["Aktenvernichter-Öl", "23,50 €", "24,10 €", "22,90 €"], ["Haftnotizen", "5,60 €", "5,35 €", "5,50 €"]] },
      steps: ["Ermittle je Artikel das günstigste Angebot mit `=MIN(...)`.", "Ermittle zum Vergleich je Artikel das teuerste Angebot mit `=MAX(...)`.", "Addiere die vier günstigsten Preise."],
      question: "Was kostet der Einkauf, wenn jeder Artikel beim günstigsten Lieferanten bestellt wird?", unit: "€", answer: 48.1,
      hint: "MIN wird je Zeile über die drei Angebote gebildet, nicht über die ganze Tabelle."
    },
    "l3-1": {
      title: "Versandkosten im Schülershop",
      situation: "Der Online-Shop der Schülerfirma liefert ab 50 € Bestellwert versandkostenfrei. Darunter kostet der Versand 4,90 €.",
      table: { head: ["Bestellung", "Bestellwert"], rows: [["1", "23,90 €"], ["2", "67,50 €"], ["3", "49,99 €"], ["4", "50,00 €"], ["5", "112,30 €"], ["6", "38,40 €"], ["7", "81,00 €"]] },
      steps: ["Lege Grenze (50) und Versandpreis (4,90) in zwei Eingabezellen an.", "Berechne die Versandkosten je Bestellung mit `=WENN(...)` und absoluten Bezügen auf die Eingabezellen.", "Prüfe besonders die Grenzfälle 49,99 € und 50,00 €. Addiere die Versandkosten."],
      question: "Wie viel Versandkosten fallen insgesamt an?", unit: "€", answer: 14.7,
      hint: "Genau 50,00 € ist bereits versandkostenfrei: Die Bedingung lautet Bestellwert kleiner als 50 oder größer gleich 50."
    },
    "l3-2": {
      title: "Mitgliedsbeiträge im Sportverein",
      situation: "Ein Verein staffelt den Jahresbeitrag 2026 nach dem Alter, das im Jahr 2026 erreicht wird: bis 12 Jahre 40 €, unter 18 Jahre 60 €, sonst 96 €.",
      table: { head: ["Mitglied", "Geburtsdatum"], rows: [["1", "14.03.2015"], ["2", "02.11.2009"], ["3", "27.01.2008"], ["4", "09.09.2014"], ["5", "30.06.1999"], ["6", "18.04.2012"], ["7", "05.12.2010"], ["8", "21.08.1987"]] },
      steps: ["Trage das Beitragsjahr 2026 in eine Eingabezelle ein und berechne je Mitglied das Alter mit `=Beitragsjahr-JAHR(Geburtsdatum)`.", "Ordne den Beitrag mit einer geschachtelten WENN-Funktion zu; die drei Beträge stehen in eigenen Zellen.", "Prüfe die Grenzfälle 12 und 18 Jahre und addiere alle Beiträge."],
      question: "Wie hoch sind die Beitragseinnahmen insgesamt?", unit: "€", answer: 548,
      hint: "Wer 2026 genau 12 wird, zahlt noch 40 €; wer genau 18 wird, zahlt bereits 96 €."
    },
    "l3-3": {
      title: "Bestellungen nach Abteilung auswerten",
      situation: "Die Buchhaltung möchte wissen, wie viel der Vertrieb im Durchschnitt je Bestellung ausgibt.",
      table: { head: ["Abteilung", "Betrag"], rows: [["Einkauf", "120,50 €"], ["Vertrieb", "310,00 €"], ["Einkauf", "89,90 €"], ["Lager", "45,00 €"], ["Vertrieb", "220,40 €"], ["Einkauf", "199,00 €"], ["Lager", "78,60 €"], ["Vertrieb", "150,00 €"]] },
      steps: ["Zähle die Bestellungen je Abteilung mit `=ZÄHLENWENN(...)`.", "Addiere die Beträge je Abteilung mit `=SUMMEWENN(...)`.", "Teile für den Vertrieb die Summe durch die Anzahl. Kontrolle: Die drei Abteilungssummen ergeben die Gesamtsumme."],
      question: "Wie hoch ist der durchschnittliche Bestellwert des Vertriebs?", unit: "€", answer: 226.8,
      hint: "Summe Vertrieb geteilt durch Anzahl Vertrieb. Achte auf identische Schreibweise des Kriteriums."
    },
    "l3-4": {
      title: "Lagerampel",
      situation: "Im Lager soll sofort auffallen, welche Artikel unter den Mindestbestand gefallen sind.",
      table: { head: ["Artikel", "Bestand", "Mindestbestand"], rows: [["Kugelschreiber", "12", "20"], ["Blöcke", "45", "30"], ["Tacker", "8", "10"], ["Locher", "60", "60"], ["Scheren", "19", "25"], ["Klebestifte", "33", "15"], ["Lineale", "5", "5"], ["Hefter", "14", "18"]] },
      steps: ["Richte für die Bestandsspalte eine bedingte Formatierung ein: rot, wenn der Bestand kleiner als der Mindestbestand derselben Zeile ist.", "Berechne in einer weiteren Spalte die Nachbestellmenge: fehlende Stück bis zum Mindestbestand, sonst 0.", "Addiere die Nachbestellmengen. Setze testweise einen roten Bestand hoch und beobachte die Farbe."],
      question: "Wie viele Stück müssen insgesamt nachbestellt werden?", unit: "Stück", answer: 20,
      hint: "Bestand gleich Mindestbestand ist nicht rot. Nachbestellmenge = Mindestbestand − Bestand, aber nie negativ."
    },
    "l3-5": {
      title: "Bestellung mit Preisliste",
      situation: "Ein Baumarkt-Azubi berechnet eine Kundenbestellung. Die Preise stehen in einer Preisliste; eine Artikelnummer gibt es dort nicht.",
      table: { caption: "Preisliste", head: ["Artikelnummer", "Bezeichnung", "Preis"], rows: [["A100", "Schraubenset", "4,90 €"], ["A200", "Dübelbox", "6,50 €"], ["A300", "Akkubohrer", "79,00 €"], ["A400", "Wasserwaage", "12,80 €"]] },
      table2: { caption: "Bestellung", head: ["Artikelnummer", "Menge"], rows: [["A300", "2"], ["A100", "5"], ["A250", "3"], ["A400", "1"], ["A200", "4"]] },
      steps: ["Lege Preisliste (Artikelnummer, Bezeichnung, Preis) und Bestellung (Artikelnummer, Menge) getrennt an.", "Hole den Preis mit `=SVERWEIS(...;...;...;FALSCH)` und fange den fehlenden Artikel mit `WENN(ISTNV(...))` ab: Preis 0 und ein lesbarer Hinweis.", "Berechne Menge mal Preis je Zeile und die Gesamtsumme."],
      question: "Wie hoch ist die Rechnungssumme ohne den fehlenden Artikel?", unit: "€", answer: 221.3,
      hint: "A250 steht nicht in der Preisliste und darf nichts kosten. Die Suchmatrix braucht absolute Bezüge."
    },
    "l3-6": {
      title: "Zeugnisnote berechnen",
      situation: "Eine Fachnote setzt sich aus gewichteten Einzelleistungen zusammen und wird auf eine Nachkommastelle gerundet.",
      table: { head: ["Leistung", "Note", "Gewicht"], rows: [["Klassenarbeit 1", "2,3", "2"], ["Klassenarbeit 2", "3,0", "2"], ["Test", "1,7", "1"], ["Mündlich", "2,5", "2"]] },
      steps: ["Berechne je Zeile Note mal Gewicht.", "Teile die Summe dieser Produkte durch die Summe der Gewichte.", "Runde das Ergebnis mit `=RUNDEN(...;1)` und vergleiche mit der bloßen Anzeige einer Nachkommastelle."],
      question: "Welche gerundete Note ergibt sich?", unit: "", answer: 2.5, tolerance: 0.001,
      hint: "Der ungerundete Wert liegt knapp unter 2,5. RUNDEN ändert den Zellwert, ein Zahlenformat nur die Anzeige."
    },
    "l3-7": {
      title: "Ab wann lohnt sich der Kuchenverkauf?",
      situation: "Die Klasse verkauft Kuchenstücke: Verkaufspreis 1,80 €, Kosten je Stück 0,65 €, feste Kosten für den Stand 92 €. Ziel ist ein Gewinn von 150 €.",
      table: { head: ["Angabe", "Wert"], rows: [["Verkaufspreis je Stück", "1,80 €"], ["Kosten je Stück", "0,65 €"], ["Feste Kosten", "92,00 €"], ["Zielgewinn", "150,00 €"]] },
      steps: ["Baue das Modell: Gewinn = Stückzahl × (Verkaufspreis − Kosten je Stück) − feste Kosten.", "Starte die Zielwertsuche: Zielzelle Gewinn, Zielwert 150, veränderbare Zelle Stückzahl.", "Excel liefert keine ganze Zahl. Überlege, wie viele ganze Stück mindestens nötig sind, und prüfe mit dieser Zahl den Gewinn."],
      question: "Wie viele ganze Stück müssen mindestens verkauft werden?", unit: "Stück", answer: 211, tolerance: 0.001,
      hint: "Die Zielwertsuche ergibt etwa 210,43. Mit 210 Stück wird das Ziel knapp verfehlt."
    },
    "l3-8": {
      title: "Provisionen im Außendienst",
      situation: "Fünf Mitarbeitende erhalten Provision: unter 50.000 € Umsatz 2 %, ab 50.000 € Umsatz 3,5 % auf den gesamten Umsatz.",
      table: { head: ["Mitarbeiter/in", "Umsatz"], rows: [["Petra", "42.000 €"], ["Quentin", "61.500 €"], ["Rana", "50.000 €"], ["Sven", "38.250 €"], ["Tara", "74.800 €"]] },
      steps: ["Lege Grenze und beide Provisionssätze in Eingabezellen an.", "Berechne die Provision mit `=WENN(...)` und absoluten Bezügen.", "Prüfe den Grenzfall 50.000 € und addiere alle Provisionen."],
      question: "Wie viel Provision wird insgesamt gezahlt?", unit: "€", answer: 8125.5,
      hint: "Genau 50.000 € erhält bereits 3,5 %. Der Satz gilt für den gesamten Umsatz, nicht nur für den Teil über der Grenze."
    },
    "l4-1": {
      title: "AG-Anmeldungen vergleichen",
      situation: "Die Schulleitung möchte sehen, welche Arbeitsgemeinschaften besonders gefragt sind.",
      table: { head: ["AG", "Anmeldungen"], rows: [["Theater", "18"], ["Robotik", "27"], ["Chor", "22"], ["Schach", "9"], ["Fußball", "34"]] },
      steps: ["Erstelle ein Säulendiagramm mit Titel und beschrifteten Achsen; die Größenachse beginnt bei 0.", "Berechne daneben den Mittelwert der Anmeldungen.", "Vergleiche die höchste Säule mit dem Mittelwert."],
      question: "Um wie viele Anmeldungen liegt die höchste Säule über dem Mittelwert?", unit: "", answer: 12,
      hint: "Mittelwert aller fünf AGs bilden und vom größten Wert abziehen."
    },
    "l4-2": {
      title: "Rangfolge der Schülerfirma-Produkte",
      situation: "Die Schülerfirma möchte ihre Produkte nach Umsatz geordnet präsentieren.",
      table: { head: ["Produkt", "Umsatz"], rows: [["Notizbuch", "1.240 €"], ["Stifteset", "2.380 €"], ["Ordner", "890 €"], ["Kalender", "1.760 €"], ["Taschenrechner", "3.150 €"], ["Mäppchen", "1.020 €"]] },
      steps: ["Sortiere die Tabelle so, dass Namen und Umsätze zusammenbleiben.", "Erstelle ein Balkendiagramm, in dem der größte Umsatz oben steht.", "Lies die Rangfolge im Diagramm ab und vergleiche mit der sortierten Tabelle."],
      question: "Welcher Umsatz steht auf Rang 3?", unit: "€", answer: 1760,
      hint: "Markiere vor dem Sortieren beide Spalten, sonst werden Namen und Werte getrennt."
    },
    "l4-3": {
      title: "Besucherzahlen der Schulbibliothek",
      situation: "Die Bibliothek zählt jedes Jahr ihre Ausleihen und möchte die Entwicklung zeigen.",
      table: { head: ["Jahr", "Ausleihen"], rows: [["2020", "1.850"], ["2021", "1.420"], ["2022", "1.980"], ["2023", "2.310"], ["2024", "2.540"], ["2025", "2.890"]] },
      steps: ["Erstelle ein Liniendiagramm; die Jahre sind die Beschriftung der Kategorienachse, keine eigene Linie.", "Berechne die absolute Veränderung von 2020 bis 2025.", "Berechne die relative Veränderung bezogen auf 2020 und formatiere sie als Prozent mit einer Nachkommastelle."],
      question: "Um wie viel Prozent sind die Ausleihen von 2020 bis 2025 gestiegen?", unit: "%", answer: 56.2, tolerance: 0.05,
      hint: "(Wert 2025 − Wert 2020) geteilt durch Wert 2020."
    },
    "l4-4": {
      title: "Budget der Klassenfahrt",
      situation: "Die Elternvertretung möchte sehen, wofür das Geld der Klassenfahrt verwendet wird.",
      table: { head: ["Posten", "Betrag"], rows: [["Bus", "1.450 €"], ["Unterkunft", "2.900 €"], ["Verpflegung", "1.160 €"], ["Programm", "870 €"], ["Reserve", "420 €"]] },
      steps: ["Berechne die Gesamtsumme und den Anteil jedes Postens.", "Erstelle ein Kreisdiagramm mit Prozentbeschriftung; die Summenzeile gehört nicht in die Datenquelle.", "Vergleiche die Prozentwerte im Diagramm mit deinen berechneten Anteilen."],
      question: "Welchen Anteil hat die Unterkunft (in Prozent, eine Nachkommastelle)?", unit: "%", answer: 42.6, tolerance: 0.05,
      hint: "Unterkunft geteilt durch die Summe aller fünf Posten."
    },
    "l4-5": {
      title: "Zwei Filialen im Quartalsvergleich",
      situation: "Zwei Filialen melden ihre Verkäufe für drei Quartale. Je nach Frage passt ein anderer Säulentyp.",
      table: { head: ["Quartal", "Nord", "Süd"], rows: [["Q1", "120", "90"], ["Q2", "150", "160"], ["Q3", "180", "140"]] },
      steps: ["Erstelle gruppierte Säulen: Welche Filiale liegt je Quartal vorn?", "Erstelle gestapelte Säulen: In welchem Quartal wurde insgesamt am meisten verkauft?", "Erstelle 100-%-gestapelte Säulen und berechne den Anteil von Nord in Q3 zur Kontrolle selbst."],
      question: "Welchen Anteil hat Nord in Q3 (in Prozent)?", unit: "%", answer: 56.25, tolerance: 0.06,
      hint: "Nord in Q3 geteilt durch die Summe beider Filialen in Q3."
    },
    "l4-6": {
      title: "Lernzeit und Testergebnis",
      situation: "Eine Lerngruppe notiert erfundene Übungsdaten: Lernzeit in Stunden und erreichte Punktzahl im Übungstest.",
      table: { head: ["Lernzeit (h)", "Punktzahl"], rows: [["1", "22"], ["2", "31"], ["3", "38"], ["4", "49"], ["5", "58"], ["6", "66"]] },
      steps: ["Erstelle ein Punktdiagramm (XY) mit der Lernzeit auf der X-Achse.", "Füge eine lineare Trendlinie hinzu und blende Formel und Bestimmtheitsmaß ein.", "Lies die Steigung ab. Formuliere vorsichtig: Die erfundenen Daten zeigen einen Zusammenhang, keinen Beweis für eine Ursache."],
      question: "Wie groß ist die Steigung der Trendlinie (zwei Nachkommastellen)?", unit: "", answer: 8.91, tolerance: 0.006,
      hint: "Die Steigung steht in der Trendlinienformel vor dem x. Kontrolle mit `=STEIGUNG(Y-Werte;X-Werte)`."
    },
    "l4-7": {
      title: "Umsatz je Mitarbeiter",
      situation: "Drei Filialen sind unterschiedlich groß. Ein fairer Vergleich braucht eine Kennzahl statt des reinen Umsatzes.",
      table: { head: ["Filiale", "Umsatz", "Mitarbeitende"], rows: [["A", "184.000 €", "8"], ["B", "251.000 €", "12"], ["C", "96.600 €", "4"]] },
      steps: ["Berechne für jede Filiale den Umsatz je Mitarbeiter/in.", "Wähle selbst einen passenden Diagrammtyp für den Vergleich der Kennzahl und begründe ihn in einem Satz.", "Vergleiche: Welche Filiale liegt beim Gesamtumsatz vorn, welche bei der Kennzahl?"],
      question: "Wie hoch ist der höchste Umsatz je Mitarbeiter/in?", unit: "€", answer: 24150,
      hint: "Umsatz geteilt durch Zahl der Mitarbeitenden. Die größte Filiale hat nicht den höchsten Wert."
    },
    "l4-8": {
      title: "Durchschnittsgeschwindigkeit einer Fahrt",
      situation: "Ein Fahrtenbuch enthält vier Abschnitte mit unterschiedlicher Dauer. Gesucht ist die Geschwindigkeit über die gesamte Fahrt.",
      table: { head: ["Abschnitt", "Dauer (min)", "Strecke (km)"], rows: [["1", "20", "18"], ["2", "35", "52"], ["3", "15", "9"], ["4", "40", "61"]] },
      steps: ["Bilde kumulierte Zeit und kumulierte Strecke, zum Beispiel mit `=SUMME($B$2:B2)`.", "Stelle die kumulierten Werte als Punktdiagramm (XY) dar.", "Berechne die Gesamtgeschwindigkeit aus Gesamtstrecke und Gesamtzeit in km/h. Vergleiche mit dem einfachen Mittelwert der vier Abschnittsgeschwindigkeiten."],
      question: "Wie hoch ist die Durchschnittsgeschwindigkeit der gesamten Fahrt (km/h, eine Nachkommastelle)?", unit: "km/h", answer: 76.4, tolerance: 0.05,
      hint: "Gesamtstrecke geteilt durch Gesamtzeit in Stunden (Minuten durch 60). Der Mittelwert der Abschnittsgeschwindigkeiten ist ein anderer Wert."
    }
  };

  // Zweite Bonusaufgabe je Einheit („Transfer“). calc ist die Nachrechnung des
  // Kontrollwerts für tests/bonus.test.js und wird auf der Seite nicht gezeigt.
  const extra = {
    "l1-1": { title: "Materialliste für den Werkraum", situation: "Für ein Bauprojekt im Werkraum stellst du die Materialkosten zusammen.",
      table: { head: ["Material", "Menge", "Einzelpreis"], rows: [["Holzleisten", "14", "2,60 €"], ["Schrauben (Packung)", "6", "3,45 €"], ["Holzleim", "3", "4,90 €"], ["Schleifpapier", "10", "0,85 €"]] },
      steps: ["Lege die Tabelle mit einer Spalte Gesamtpreis an und berechne jede Zeile mit einer Formel.", "Addiere die Gesamtpreise mit `=SUMME(...)`."],
      question: "Wie hoch sind die Materialkosten insgesamt?", unit: "€", answer: 80.3, calc: "14*2.6+6*3.45+3*4.9+10*0.85",
      hint: "Vier Zeilen, je Menge mal Einzelpreis; die Summe umfasst alle vier Gesamtpreise." },
    "l1-2": { title: "Kinobesuch der Klasse", situation: "Die Klasse plant einen Kinobesuch. Kurz vor der Bestellung melden sich zwei weitere Personen an.",
      table: { head: ["Posten", "Anzahl", "Einzelpreis"], rows: [["Kinokarten", "23", "8,50 €"], ["Popcorn", "12", "4,20 €"], ["Getränke", "20", "3,10 €"]] },
      steps: ["Berechne die drei Gesamtpreise mit Zelladressen und bilde die Gesamtsumme.", "Erhöhe die Anzahl der Kinokarten von 23 auf 25 und beobachte, welche Zellen neu rechnen."],
      question: "Wie hoch ist die Gesamtsumme mit 25 Karten?", unit: "€", answer: 324.9, calc: "25*8.5+12*4.2+20*3.1",
      hint: "Nur die Kartenzeile und die Gesamtsumme dürfen sich ändern." },
    "l1-3": { title: "Rabatt übersichtlich darstellen", situation: "Ein Fahrrad kostet laut Liste 249,00 €. Der Händler gewährt 15 % Rabatt.",
      table: { head: ["Angabe", "Wert"], rows: [["Listenpreis", "249,00 €"], ["Rabatt", "15 %"]] },
      steps: ["Trage den Rabatt als Prozentwert ein (Zahlenformat Prozent) und berechne den Rabattbetrag.", "Berechne den Endpreis und formatiere alle Beträge als Währung mit zwei Nachkommastellen."],
      question: "Wie hoch ist der Endpreis?", unit: "€", answer: 211.65, calc: "249*(1-0.15)",
      hint: "Rabattbetrag = Listenpreis mal Rabatt; Endpreis = Listenpreis minus Rabattbetrag." },
    "l1-4": { title: "Stundenzettel einer Aushilfe", situation: "Eine Aushilfe arbeitet an fünf Tagen unterschiedlich lange. Der Stundenlohn beträgt 13,40 € und steht in jeder Zeile.",
      table: { head: ["Tag", "Stunden", "Stundenlohn"], rows: [["Montag", "7,5", "13,40 €"], ["Dienstag", "8", "13,40 €"], ["Mittwoch", "6,25", "13,40 €"], ["Donnerstag", "8,5", "13,40 €"], ["Freitag", "7", "13,40 €"]] },
      steps: ["Berechne den Tageslohn in der ersten Zeile und kopiere die Formel nach unten.", "Bilde die Wochensumme und prüfe die kopierte Formel in der letzten Zeile."],
      question: "Wie hoch ist der Wochenlohn?", unit: "€", answer: 499.15, calc: "(7.5+8+6.25+8.5+7)*13.4",
      hint: "Jede Zeile rechnet Stunden mal Stundenlohn derselben Zeile." },
    "l1-5": { title: "Klassenkasse", situation: "Jede Person zahlt 12 € in die Klassenkasse. Neun Personen haben unterschiedlich viel eingezahlt.",
      table: { head: ["Person", "Eingezahlt"], rows: [["1", "12 €"], ["2", "12 €"], ["3", "6 €"], ["4", "0 €"], ["5", "12 €"], ["6", "12 €"], ["7", "3 €"], ["8", "12 €"], ["9", "0 €"]] },
      steps: ["Trage den Beitrag nur einmal in eine eigene, beschriftete Zelle ein.", "Berechne je Person den offenen Betrag und addiere alle offenen Beträge."],
      question: "Wie viel fehlt insgesamt noch in der Kasse?", unit: "€", answer: 39, calc: "9*12-(12+12+6+0+12+12+3+12+0)",
      hint: "Offen = Beitrag minus Einzahlung, für jede der neun Zeilen." },
    "l1-6": { title: "Zinsen für ein Festgeld", situation: "Ein Betrieb legt 12.500 € für 210 Tage zu 2,4 % pro Jahr an.",
      table: { head: ["Angabe", "Wert"], rows: [["Kapital", "12.500 €"], ["Zinssatz pro Jahr", "2,4 (als Prozentzahl)"], ["Tage", "210"]] },
      steps: ["Lege drei Eingabezellen an und berechne die Zinsen mit `=Kapital*Tage*Zinssatz/36000`.", "Halbiere testweise die Tage: Die Zinsen müssen sich halbieren. Stelle 210 wieder her."],
      question: "Wie viele Zinsen fallen an?", unit: "€", answer: 175, calc: "12500*210*2.4/36000",
      hint: "Der Zinssatz wird als 2,4 eingegeben, nicht als 0,024." },
    "l2-1": { title: "Fahrtkosten abrechnen", situation: "Fünf Dienstfahrten werden mit 0,30 € je Kilometer erstattet. Der Satz steht in jeder Zeile.",
      table: { head: ["Fahrt", "Kilometer", "€ je km"], rows: [["1", "42", "0,30"], ["2", "118", "0,30"], ["3", "67", "0,30"], ["4", "205", "0,30"], ["5", "31", "0,30"]] },
      steps: ["Berechne die Erstattung der ersten Fahrt mit relativen Bezügen und kopiere die Formel nach unten.", "Bilde die Summe aller Erstattungen."],
      question: "Wie hoch ist die gesamte Erstattung?", unit: "€", answer: 138.9, calc: "(42+118+67+205+31)*0.3",
      hint: "Kilometer mal Satz derselben Zeile; fünf Zeilen." },
    "l2-2": { title: "Fahrtkosten mit einem gemeinsamen Satz", situation: "Der Kilometersatz für die fünf Fahrten (42, 118, 67, 205 und 31 km) steht jetzt nur noch einmal in einer Zelle und steigt auf 0,38 €.",
      table: { head: ["Fahrt", "Kilometer"], rows: [["1", "42"], ["2", "118"], ["3", "67"], ["4", "205"], ["5", "31"]] },
      steps: ["Trage den Satz 0,30 in eine eigene Zelle ein und verwende ihn in der Formel mit absolutem Bezug.", "Ändere den Satz auf 0,38 und prüfe, dass sich alle fünf Erstattungen ändern."],
      question: "Wie hoch ist die gesamte Erstattung mit 0,38 € je Kilometer?", unit: "€", answer: 175.94, calc: "(42+118+67+205+31)*0.38",
      hint: "Der Bezug auf die Satz-Zelle braucht Dollarzeichen vor Spalte und Zeile." },
    "l2-3": { title: "Preistabelle für Getränkekisten", situation: "Ein Getränkehandel braucht eine Preistabelle: drei Mengen in den Zeilen, vier Stückpreise in den Spalten.",
      table: { head: ["Menge", "1,25 €", "2,40 €", "3,10 €", "4,75 €"], rows: [["5", "?", "?", "?", "?"], ["10", "?", "?", "?", "?"], ["20", "?", "?", "?", "?"]] },
      steps: ["Schreibe eine einzige Formel mit gemischten Bezügen in die erste Ergebniszelle.", "Kopiere sie in alle zwölf Zellen und addiere die Ergebnisse."],
      question: "Wie groß ist die Summe aller zwölf Preise?", unit: "€", answer: 402.5, calc: "(5+10+20)*(1.25+2.4+3.1+4.75)",
      hint: "Die Spalte der Menge und die Zeile der Stückpreise müssen fest bleiben." },
    "l2-4": { title: "Temperaturen einer Woche", situation: "Eine Klasse misst sieben Tage lang die Mittagstemperatur.",
      table: { head: ["Tag", "Temperatur (°C)"], rows: [["Mo", "18,5"], ["Di", "21,0"], ["Mi", "19,5"], ["Do", "24,0"], ["Fr", "22,5"], ["Sa", "17,0"], ["So", "20,5"]] },
      steps: ["Ermittle Mittelwert, kleinsten und größten Wert mit den passenden Funktionen.", "Berechne die Spannweite als Differenz aus größtem und kleinstem Wert."],
      question: "Wie groß ist die Spannweite in Grad?", unit: "", answer: 7, calc: "24-17",
      hint: "Spannweite = MAX minus MIN." },
    "l2-5": { title: "Klassenarbeiten im Vergleich", situation: "Drei Klassen haben je vier Arbeiten geschrieben. Gesucht ist die Klasse mit dem besten (kleinsten) Notendurchschnitt.",
      table: { head: ["Klasse", "Arbeit 1", "Arbeit 2", "Arbeit 3", "Arbeit 4"], rows: [["A", "2,3", "2,7", "3,0", "1,7"], ["B", "2,0", "3,3", "2,7", "2,3"], ["C", "1,7", "2,0", "3,7", "2,7"]] },
      steps: ["Berechne für jede Klasse den Mittelwert der vier Arbeiten.", "Ermittle mit `=MIN(...)` den kleinsten der drei Mittelwerte und formatiere mit zwei Nachkommastellen."],
      question: "Wie lautet der beste Notendurchschnitt (zwei Nachkommastellen)?", unit: "", answer: 2.43, tolerance: 0.006, calc: "Math.round(Math.min((2.3+2.7+3.0+1.7)/4,(2.0+3.3+2.7+2.3)/4,(1.7+2.0+3.7+2.7)/4)*100+0.0000001)/100",
      hint: "Erst je Zeile MITTELWERT, dann MIN über die drei Ergebnisse." },
    "l3-1": { title: "Umsatzbonus", situation: "Wer im Monat mindestens 20.000 € Umsatz erreicht, erhält 500 € Bonus.",
      table: { head: ["Person", "Umsatz"], rows: [["1", "18.500 €"], ["2", "20.000 €"], ["3", "24.300 €"], ["4", "19.999 €"], ["5", "31.000 €"]] },
      steps: ["Lege Grenze und Bonus in Eingabezellen an und berechne den Bonus je Person mit `=WENN(...)`.", "Prüfe die Grenzfälle 19.999 € und 20.000 € und addiere die Boni."],
      question: "Wie viel Bonus wird insgesamt gezahlt?", unit: "€", answer: 1500, calc: "[18500,20000,24300,19999,31000].filter(v=>v>=20000).length*500",
      hint: "Genau 20.000 € erhält den Bonus, 19.999 € nicht." },
    "l3-2": { title: "Parkgebühren nach Dauer", situation: "Ein Parkhaus berechnet: bis 1 Stunde 2 €, bis 3 Stunden 5 €, darüber 9 €.",
      table: { head: ["Fahrzeug", "Dauer (Stunden)"], rows: [["1", "0,5"], ["2", "1"], ["3", "2,5"], ["4", "3"], ["5", "3,5"], ["6", "6"]] },
      steps: ["Ordne die Gebühr mit einer geschachtelten WENN-Funktion zu; die drei Beträge stehen in eigenen Zellen.", "Prüfe die Grenzfälle 1 und 3 Stunden und addiere die Gebühren."],
      question: "Wie hoch sind die Einnahmen insgesamt?", unit: "€", answer: 32, calc: "[0.5,1,2.5,3,3.5,6].map(h=>h<=1?2:h<=3?5:9).reduce((a,b)=>a+b,0)",
      hint: "Genau 1 Stunde kostet 2 €, genau 3 Stunden kosten 5 €." },
    "l3-3": { title: "Warenwert je Kategorie", situation: "Eine Inventurliste nennt Kategorie und Warenwert. Gesucht ist der Warenwert einer Kategorie.",
      table: { head: ["Kategorie", "Warenwert"], rows: [["Obst", "120 €"], ["Gemüse", "85 €"], ["Obst", "60 €"], ["Getränke", "240 €"], ["Gemüse", "95 €"], ["Obst", "40 €"]] },
      steps: ["Zähle mit `=ZÄHLENWENN(...)`, wie oft jede Kategorie vorkommt.", "Addiere mit `=SUMMEWENN(...)` den Warenwert je Kategorie; die drei Summen ergeben die Gesamtsumme."],
      question: "Wie hoch ist der Warenwert der Kategorie Obst?", unit: "€", answer: 220, calc: "120+60+40",
      hint: "Kriterium \"Obst\"; summiert wird die Spalte Warenwert." },
    "l3-4": { title: "Testergebnisse hervorheben", situation: "Bei einem Test sind 50 Punkte nötig. Ergebnisse darunter sollen rot erscheinen.",
      table: { head: ["Person", "Punkte"], rows: [["1", "62"], ["2", "48"], ["3", "75"], ["4", "39"], ["5", "50"], ["6", "88"], ["7", "44"]] },
      steps: ["Richte eine bedingte Formatierung ein: rot, wenn die Punktzahl kleiner als 50 ist.", "Zähle die roten Ergebnisse zur Kontrolle mit `=ZÄHLENWENN(...;\"<50\")`."],
      question: "Wie viele Ergebnisse sind rot markiert?", unit: "", answer: 3, calc: "[62,48,75,39,50,88,44].filter(p=>p<50).length",
      hint: "Genau 50 Punkte sind bestanden und bleiben ohne Farbe." },
    "l3-5": { title: "Lohnliste mit Personalnummern", situation: "Die Stundenlöhne stehen in einer Personalliste. Eine Personalnummer der Stundenliste gibt es dort nicht.",
      table: { caption: "Personalliste", head: ["Personalnummer", "Stundenlohn"], rows: [["P01", "14,20 €"], ["P02", "16,80 €"], ["P03", "15,50 €"]] },
      table2: { caption: "Stundenliste", head: ["Personalnummer", "Stunden"], rows: [["P02", "38"], ["P03", "40"], ["P05", "20"], ["P01", "35"]] },
      steps: ["Hole den Stundenlohn mit `=SVERWEIS(...;...;2;FALSCH)` und fange die fehlende Nummer mit `WENN(ISTNV(...))` ab (Lohn 0).", "Berechne Stunden mal Stundenlohn je Zeile und die Gesamtsumme."],
      question: "Wie hoch ist die Lohnsumme ohne die unbekannte Personalnummer?", unit: "€", answer: 1755.4, calc: "38*16.8+40*15.5+0+35*14.2",
      hint: "P05 steht nicht in der Personalliste und zählt mit 0." },
    "l3-6": { title: "Erst runden oder erst addieren?", situation: "Ein Artikel kostet netto 19,99 €. Mit 19 % Umsatzsteuer ergibt sich ein Bruttopreis mit mehr als zwei Nachkommastellen. Ein Kunde kauft drei Stück.",
      table: { head: ["Angabe", "Wert"], rows: [["Nettopreis", "19,99 €"], ["Umsatzsteuer", "19 %"], ["Menge", "3"]] },
      steps: ["Berechne den Bruttopreis je Stück und runde ihn mit `=RUNDEN(...;2)`.", "Berechne den Gesamtpreis einmal aus dem gerundeten Stückpreis und einmal aus dem ungerundeten und vergleiche."],
      question: "Wie hoch ist der Gesamtpreis, wenn zuerst der Stückpreis gerundet wird?", unit: "€", answer: 71.37, calc: "Math.round(19.99*1.19*100)/100*3",
      hint: "Der gerundete Stückpreis ist 23,79 €. Aus dem ungerundeten Preis ergäben sich 71,36 €." },
    "l3-7": { title: "Sparziel erreichen", situation: "Du hast 350 € gespart und möchtest in 24 Monaten 2.000 € haben. Gesucht ist die monatliche Sparrate.",
      table: { head: ["Angabe", "Wert"], rows: [["Startguthaben", "350 €"], ["Monate", "24"], ["Ziel", "2.000 €"]] },
      steps: ["Baue das Modell: Endguthaben = Startguthaben + Monate × Sparrate, mit einer Eingabezelle für die Sparrate.", "Starte die Zielwertsuche: Zielzelle Endguthaben, Zielwert 2000, veränderbare Zelle Sparrate."],
      question: "Wie hoch muss die monatliche Sparrate sein?", unit: "€", answer: 68.75, calc: "(2000-350)/24",
      hint: "Kontrolle von Hand: fehlender Betrag geteilt durch die Zahl der Monate." },
    "l3-8": { title: "Rabattstaffel mit SVERWEIS", situation: "Der Rabatt richtet sich nach dem Bestellwert: ab 0 € 0 %, ab 500 € 3 %, ab 1.000 € 5 %, ab 2.500 € 8 %.",
      table: { head: ["Bestellung", "Bestellwert"], rows: [["1", "480 €"], ["2", "500 €"], ["3", "999 €"], ["4", "1.000 €"], ["5", "2.600 €"]] },
      steps: ["Lege die Staffel als aufsteigend sortierte Tabelle mit Untergrenze und Rabattsatz an und hole den Satz mit `=SVERWEIS(...;...;2;WAHR)`.", "Berechne den Rabattbetrag je Bestellung und die Summe aller Rabatte."],
      question: "Wie hoch ist die Summe aller Rabattbeträge?", unit: "€", answer: 302.97, calc: "0+500*0.03+999*0.03+1000*0.05+2600*0.08",
      hint: "999 € erhält noch 3 %, 1.000 € bereits 5 %. Die Staffel muss aufsteigend sortiert sein." },
    "l4-1": { title: "Verkäufe einer Woche", situation: "Der Schulkiosk zählt die verkauften Brötchen von Montag bis Freitag.",
      table: { head: ["Tag", "Verkäufe"], rows: [["Montag", "34"], ["Dienstag", "41"], ["Mittwoch", "29"], ["Donnerstag", "52"], ["Freitag", "44"]] },
      steps: ["Erstelle ein Säulendiagramm mit Titel und Achsentiteln; die Größenachse beginnt bei 0.", "Berechne die Wochensumme und den Anteil des stärksten Tages in Prozent."],
      question: "Welchen Anteil hat der stärkste Tag an der Wochensumme (in Prozent)?", unit: "%", answer: 26, calc: "52/(34+41+29+52+44)*100",
      hint: "Größter Wert geteilt durch die Summe aller fünf Tage." },
    "l4-2": { title: "Abstimmung über das Ausflugsziel", situation: "Die Klasse stimmt über fünf Ausflugsziele ab.",
      table: { head: ["Ziel", "Stimmen"], rows: [["Berlin", "14"], ["Hamburg", "9"], ["München", "11"], ["Wien", "17"], ["Prag", "6"]] },
      steps: ["Sortiere die Tabelle nach Stimmen, sodass Ziel und Stimmenzahl zusammenbleiben.", "Erstelle ein Balkendiagramm mit dem beliebtesten Ziel oben."],
      question: "Wie viele Stimmen liegen zwischen dem ersten und dem letzten Platz?", unit: "", answer: 11, calc: "17-6",
      hint: "Größter minus kleinster Wert der sortierten Liste." },
    "l4-3": { title: "Wachstum eines Schulkanals", situation: "Der Kanal der Schülerzeitung zählt am Monatsende seine Abonnenten.",
      table: { head: ["Monat", "Abonnenten"], rows: [["Januar", "120"], ["Februar", "150"], ["März", "210"], ["April", "260"], ["Mai", "340"]] },
      steps: ["Stelle die Entwicklung als Liniendiagramm dar.", "Berechne den durchschnittlichen Zuwachs je Monat aus dem ersten und dem letzten Wert."],
      question: "Wie groß ist der durchschnittliche Zuwachs je Monat?", unit: "", answer: 55, calc: "(340-120)/4",
      hint: "Zwischen fünf Monatswerten liegen vier Abstände." },
    "l4-4": { title: "Zeitbudget eines Schultags", situation: "Du teilst die 24 Stunden eines Schultags in fünf Bereiche ein.",
      table: { head: ["Bereich", "Stunden"], rows: [["Schule", "7"], ["Schlaf", "8"], ["Freizeit", "5"], ["Lernen", "2"], ["Sonstiges", "2"]] },
      steps: ["Prüfe mit einer Summe, dass die Bereiche zusammen 24 Stunden ergeben.", "Erstelle ein Kreisdiagramm mit Prozentbeschriftung und berechne den Anteil der Freizeit selbst."],
      question: "Welchen Anteil hat die Freizeit (in Prozent, eine Nachkommastelle)?", unit: "%", answer: 20.8, tolerance: 0.05, calc: "Math.round(5/24*1000)/10",
      hint: "5 geteilt durch 24, als Prozent mit einer Nachkommastelle." },
    "l4-5": { title: "Zwei Produkte in drei Monaten", situation: "Ein Betrieb verkauft zwei Produkte und möchte die Monatssummen vergleichen.",
      table: { head: ["Monat", "Produkt A", "Produkt B"], rows: [["April", "40", "60"], ["Mai", "55", "45"], ["Juni", "35", "75"]] },
      steps: ["Erstelle gestapelte Säulen: Jede Säule zeigt die Summe beider Produkte.", "Berechne die drei Monatssummen zur Kontrolle selbst."],
      question: "Wie hoch ist die größte Monatssumme?", unit: "", answer: 110, calc: "Math.max(40+60,55+45,35+75)",
      hint: "Je Monat Produkt A plus Produkt B; die höchste gestapelte Säule." },
    "l4-6": { title: "Werbung und Besucherzahl", situation: "Ein Verein notiert erfundene Daten: Werbeausgaben in Euro und Besucherzahl von fünf Veranstaltungen.",
      table: { head: ["Werbung (€)", "Besucher"], rows: [["10", "18"], ["20", "29"], ["30", "44"], ["40", "52"], ["50", "67"]] },
      steps: ["Erstelle ein Punktdiagramm (XY) mit linearer Trendlinie und eingeblendeter Formel.", "Lies die Steigung ab und kontrolliere sie mit `=STEIGUNG(Y-Werte;X-Werte)`."],
      question: "Wie groß ist die Steigung der Trendlinie (zwei Nachkommastellen)?", unit: "", answer: 1.21, tolerance: 0.006, calc: "((10-30)*(18-42)+(20-30)*(29-42)+(40-30)*(52-42)+(50-30)*(67-42))/((20*20)+(10*10)+(10*10)+(20*20))",
      hint: "Die Steigung steht in der Trendlinienformel vor dem x." },
    "l4-7": { title: "Kosten je Stück", situation: "Drei Werke stellen dasselbe Teil her. Verglichen werden soll, wo ein Stück am günstigsten entsteht.",
      table: { head: ["Werk", "Kosten", "Stückzahl"], rows: [["A", "12.600 €", "1.800"], ["B", "9.450 €", "1.260"], ["C", "15.300 €", "2.250"]] },
      steps: ["Berechne für jedes Werk die Kosten je Stück.", "Wähle einen passenden Diagrammtyp für den Vergleich der Kennzahl und begründe ihn in einem Satz."],
      question: "Wie hoch sind die niedrigsten Kosten je Stück?", unit: "€", answer: 6.8, calc: "Math.min(12600/1800,9450/1260,15300/2250)",
      hint: "Kosten geteilt durch Stückzahl; das Werk mit den höchsten Gesamtkosten ist hier das günstigste." },
    "l4-8": { title: "Durchschnittsverbrauch eines Autos", situation: "Ein Fahrtenbuch nennt für drei Etappen Strecke und getankte Liter.",
      table: { head: ["Etappe", "Strecke (km)", "Verbrauch (Liter)"], rows: [["1", "320", "20,8"], ["2", "410", "24,6"], ["3", "150", "10,5"]] },
      steps: ["Berechne Gesamtstrecke und Gesamtverbrauch.", "Berechne den Verbrauch je 100 km aus den Gesamtwerten und vergleiche ihn mit dem Mittelwert der drei Einzelverbräuche."],
      question: "Wie hoch ist der Durchschnittsverbrauch (Liter je 100 km, zwei Nachkommastellen)?", unit: "l/100 km", answer: 6.35, tolerance: 0.006, calc: "Math.round((20.8+24.6+10.5)/(320+410+150)*10000)/100",
      hint: "Gesamtverbrauch geteilt durch Gesamtstrecke, mal 100." }
  };

  window.EXCEL_LAB_BONUS = Object.freeze({ xp: XP, tasks: Object.freeze(tasks), extra: Object.freeze(extra) });
})();
