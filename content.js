(function () {
  "use strict";

  const base = "materialien/BPE1";
  const resource = (path, label, type) => ({ path: `${base}/${path}`, label, type });

  const stages = [
    {
      id: 1,
      code: "L1",
      title: "Grundlagen und Tabellenaufbau",
      shortTitle: "Grundlagen",
      description: "Daten erfassen, einfache Formeln schreiben, Zellen formatieren und übersichtliche Tabellen entwerfen.",
      color: "#35bd7d",
      curriculum: "BPE 1.1"
    },
    {
      id: 2,
      code: "L2",
      title: "Adressierung und Grundfunktionen",
      shortTitle: "Adressierung",
      description: "Formeln sicher kopieren, Zellbezüge fixieren und Daten mit SUMME, MITTELWERT, MIN und MAX auswerten.",
      color: "#64a9ff",
      curriculum: "BPE 1.2 und 1.3"
    },
    {
      id: 3,
      code: "L3",
      title: "Logik, Bedingungen und Verweise",
      shortTitle: "Funktionen",
      description: "Entscheidungen abbilden, Daten bedingt auswerten, Fehler behandeln und Werte aus Listen nachschlagen.",
      color: "#a98cff",
      curriculum: "BPE 1.1 und 1.3"
    },
    {
      id: 4,
      code: "L4",
      title: "Diagramme und Datenvisualisierung",
      shortTitle: "Diagramme",
      description: "Den passenden Diagrammtyp wählen, verständlich gestalten und Zusammenhänge mit Trendlinien untersuchen.",
      color: "#ffca66",
      curriculum: "BPE 1.4"
    }
  ];

  const lessons = [
    {
      id: "l1-1",
      stage: 1,
      code: "L1.1",
      title: "Eine Tabelle planen und in Excel erfassen",
      duration: "45 Min.",
      level: "Einstieg",
      points: 100,
      page: "l1-1.html",
      tags: ["Tabellenentwurf", "Daten"],
      description: "Du planst den Getränkeeinkauf für eine Firmenveranstaltung und berechnest die Kosten mit einfachen Excel-Formeln.",
      goal: "Du kannst eine Getränkeliste mit passenden Überschriften erstellen, Preis mal Menge berechnen und die Gesamtpreise mit SUMME addieren.",
      keyPoints: [
        { title: "Ein Datensatz pro Zeile", text: "Zusammengehörende Angaben stehen in derselben Zeile." },
        { title: "Ein Merkmal pro Spalte", text: "Überschriften benennen Inhalt und Einheit eindeutig." },
        { title: "Zelle auswählen und eingeben", text: "Zelle anklicken, Daten eingeben und mit Enter übernehmen." },
        { title: "Spaltenbreite anpassen", text: "Am Rand des Spaltenkopfs ziehen oder für optimale Breite doppelklicken." }
      ],
      formulas: [{ code: "=B4*C4", note: "Preis je Flasche in B4 mal Menge in C4." }, { code: "=SUMME(D4:D8)", note: "Die fünf Gesamtpreise von D4 bis D8 addieren." }],
      steps: [
        "Lies zuerst alle Informationen auf der L1.1-Seite.",
        "Entwirf die Getränkeliste mit Getränkeart, Einkaufspreis je Flasche, Menge und Gesamtpreis.",
        "Prüfe deine Excel-Tabelle und speichere sie im Ordner Ergebnisse als „L1_1.2 Getränkeliste.xlsx“."
      ],
      checks: ["Informationen vollständig gelesen", "Tabellenentwurf und Berechnungen fertig", "Excel-Datei unter dem vorgegebenen Namen gespeichert"],
      tip: "Wenn eine Überschrift abgeschnitten wird, doppelklicke auf die rechte Grenze des Spaltenkopfs. Excel stellt dann die optimale Breite ein.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_1.1 Aufgabenstellung Entwurf einer Tabelle.docx", "Aufgabe Tabellenentwurf", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_1.2 Aufgabenstellung Erstellen einer Tabelle in Excel.docx", "Aufgabe Tabelle in Excel", "DOCX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_1 Informationsmaterial Erstellen einer Tabelle in Excel.docx", "Informationen zur Dateneingabe", "DOCX")
      ]
    },
    {
      id: "l1-2",
      stage: 1,
      code: "L1.2",
      title: "Rechnen mit Zelladressen",
      duration: "30 Min.",
      level: "Einstieg",
      points: 100,
      page: "l1-2.html",
      tags: ["Formeln", "Grundrechenarten"],
      description: "Du vertiefst die Formeln aus deiner Getränkeliste und prüfst, wie Excel bei Änderungen automatisch mitrechnet.",
      goal: "Du kannst Formeln mit = beginnen, Zelladressen einsetzen und Rechenoperatoren korrekt verwenden.",
      keyPoints: [
        { title: "Gleichheitszeichen", text: "Jede Excel-Formel beginnt mit =." },
        { title: "Zelladressen statt Zahlen", text: "So bleibt die Tabelle bei Änderungen dynamisch." },
        { title: "Operatoren", text: "+ Addition, - Subtraktion, * Multiplikation, / Division." },
        { title: "Plausibilitätscheck", text: "Überschlage das Ergebnis vor dem Kopieren." }
      ],
      formulas: [
        { code: "=B2*C2", note: "Beispiel Heftkauf: Preis in B2 mal Anzahl in C2." },
        { code: "=D2+D3+D4", note: "Beispiel: drei Ergebniszellen mit + addieren." }
      ],
      steps: [
        "Erstelle die Getränkeliste mit den Eingabedaten auf der Lernseite oder nutze die optionale Vorlage; fülle D4 bis D9 mit Formeln.",
        "Berechne jede Position aus Preis und Menge.",
        "Ermittle die Gesamtsumme und prüfe das Ergebnis mit einer Überschlagsrechnung."
      ],
      checks: ["Informationen gelesen und alle sechs Formeln mit Zelladressen geprüft", "Ergebnisse überschlagen, Neuberechnung getestet und ursprüngliche Menge wiederhergestellt", "Datei im Ordner Ergebnisse als L1_2 Getränkeliste.xlsx gespeichert"],
      tip: "Ein angezeigter Wert ist nur das Ergebnis. In der Bearbeitungsleiste siehst du die zugrunde liegende Formel.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_2 Aufgabenstellung Formeln in Excel.docx", "Aufgabe Formeln in Excel", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_2 Tabellenvorlage Formeln in Excel.xlsx", "Excel-Vorlage Getränkeliste", "XLSX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_2 Video Einführung in Formeln.m4v", "Video Einführung in Formeln", "VIDEO")
      ]
    },
    {
      id: "l1-3",
      stage: 1,
      code: "L1.3",
      title: "Zahlen und Tabellen formatieren",
      duration: "35 Min.",
      level: "Einstieg",
      points: 100,
      page: "l1-3.html",
      tags: ["Zahlenformat", "Layout"],
      description: "Du verbesserst Lesbarkeit und Aussagekraft mit passenden Zahlenformaten, Ausrichtung und zurückhaltender Gestaltung.",
      goal: "Du kannst Währung, Prozent, Datum und benutzerdefinierte Einheiten formatieren, ohne den Zellwert zu verändern.",
      keyPoints: [
        { title: "Wert bleibt erhalten", text: "Ein Zahlenformat verändert die Darstellung, nicht die gespeicherte Zahl." },
        { title: "Einheit sichtbar machen", text: "Währung und Mengen erhalten ein passendes Format." },
        { title: "Hierarchie", text: "Titel, Spaltenköpfe und Summenzeile werden klar unterschieden." },
        { title: "Zurückhaltung", text: "Rahmen und Farben unterstützen die Orientierung." }
      ],
      formulas: [
        { code: "#.##0,00 €", note: "Typische Anzeige für Eurobeträge in einer deutschen Excel-Umgebung." },
        { code: "0 \"Flaschen\"", note: "Benutzerdefiniertes Format mit einer Einheit." }
      ],
      steps: [
        "Öffne deine Datei aus L1.2 und folge dem vollständigen Formatierungsauftrag auf der L1.3-Seite.",
        "Setze die Überschrift, Spaltenköpfe, Währungsbeträge und Mengenangaben passend.",
        "Prüfe Formeln und Lesbarkeit; speichere als L1_3 Getränkeliste formatiert.xlsx im Ordner Ergebnisse."
      ],
      checks: ["Schrift, Farben, Ausrichtung, Umbruch und Rahmen gestaltet", "Zahlenformate stimmen und Formeln funktionieren", "L1_3 Getränkeliste formatiert.xlsx gespeichert"],
      tip: "Nutze „Format übertragen“, wenn mehrere Zellen exakt gleich gestaltet werden sollen.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_3 Aufgabenstellung Formatieren von Texten und Zahlen.docx", "Aufgabe Formatierung", "DOCX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_3 Informationsmaterial Formatieren von Texten und Zahlen.docx", "Informationen zur Formatierung", "DOCX")
      ]
    },
    {
      id: "l1-4",
      stage: 1,
      code: "L1.4",
      title: "Formeln kopieren",
      duration: "25 Min.",
      level: "Einstieg",
      points: 100,
      page: "l1-4.html",
      tags: ["Ausfüllkästchen", "Kopieren"],
      description: "Du nutzt die automatische Anpassung relativer Zellbezüge und vermeidest unnötige Mehrfacheingaben.",
      goal: "Du kannst eine passende Ausgangsformel erstellen und sie fehlerfrei über mehrere Zeilen kopieren.",
      keyPoints: [
        { title: "Relative Bezüge", text: "Beim Kopieren von D4 nach D5 wird B4*C4 zu B5*C5." },
        { title: "Ausfüllkästchen", text: "Der kleine Punkt am Zellrand kopiert Formeln schnell nach unten." },
        { title: "Muster prüfen", text: "Kontrolliere die erste, eine mittlere und die letzte kopierte Formel." },
        { title: "Nicht abschreiben", text: "Eine einmal korrekte Formel wird weiterverwendet." }
      ],
      formulas: [{ code: "=B4*C4  →  =B5*C5", note: "Excel passt Zeile und Spalte relativ zur Zielposition an." }],
      steps: [
        "Ergänze vor der Summenzeile 12 Flaschen Apfelsaftschorle für je 1,25 €.",
        "Kopiere die Formel für den Gesamtpreis, statt sie erneut einzugeben.",
        "Prüfe Bezüge und die Summe aller sechs Getränke; speichere als L1_4 Getränkeliste kopierte Formeln.xlsx."
      ],
      checks: ["Getränkezeile ergänzt und Formel kopiert", "Bezüge und Summe aller sechs Getränke im Änderungstest geprüft", "L1_4 Getränkeliste kopierte Formeln.xlsx gespeichert"],
      tip: "Doppelklick auf das Ausfüllkästchen kopiert eine Formel oft bis zum Ende des benachbarten Datenbereichs.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_4 Aufgabenstellung Formeln kopieren.docx", "Aufgabe Formeln kopieren", "DOCX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_4 Informationsmaterial Kopieren von Formeln.docx", "Informationen zum Kopieren", "DOCX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_4 Video Formeln kopieren.m4v", "Video Formeln kopieren", "VIDEO")
      ]
    },
    {
      id: "l1-5",
      page: "l1-5.html",
      points: 100,
      stage: 1,
      code: "L1.5",
      title: "Tabellen logisch strukturieren",
      duration: "40 Min.",
      level: "Grundlage",
      tags: ["Tabellenkopf", "Eingabe/Ausgabe"],
      description: "Du entwickelst eine Teilnehmerliste, in der feste Vorgaben nur einmal erfasst und offene Beträge automatisch berechnet werden.",
      goal: "Du kannst eine Tabelle in Kopf, Spaltenüberschriften und Datenbereich gliedern und gemeinsame Werte zentral ablegen.",
      keyPoints: [
        { title: "Gemeinsame Werte", text: "Der Kostenbeitrag wird einmal im Tabellenkopf gespeichert." },
        { title: "Saubere Datentypen", text: "Telefonnummern bleiben Text, Zahlungen bleiben Zahlen." },
        { title: "Berechenbare Inhalte", text: "Offene Beträge entstehen durch Formeln." },
        { title: "Erweiterbarkeit", text: "Neue Personen lassen sich ohne Umbau ergänzen." }
      ],
      formulas: [{ code: "=Kostenbeitrag-Zahlung", note: "In Excel werden dafür die passenden Zelladressen verwendet." }],
      steps: [
        "Lege den Kostenbeitrag von 10,00 € einmal im Tabellenkopf ab.",
        "Erfasse die fünf vorgegebenen Teilnehmenden mit Kontaktdaten und Zahlung.",
        "Berechne den offenen Betrag so, dass die Formel kopierfähig ist."
      ],
      checks: ["Fünf Personen mit allen acht Merkmalen erfasst", "Zentraler Beitrag und offene Beträge bestehen die Änderungstests", "Übersichtliche Datei L1_5 Sommerfest.xlsx gespeichert"],
      tip: "Vermeide verbundene Zellen im eigentlichen Datenbereich. Sie erschweren Sortieren und Filtern.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_5 Aufgabenstellung Tabellenstruktur entwerfen.docx", "Aufgabe Sommerfest", "DOCX"),
        resource("Lernfortschritt_1/Informationsmaterial/L1_5 Informationsmaterial Tabellenstruktur entwerfen.docx", "Regeln für gute Tabellen", "DOCX")
      ]
    },
      {
        id: "l1-6",
        page: "l1-6.html",
        stage: 1,
        code: "L1.6",
        title: "Vertiefung: kaufmännische Rechenmodelle",
        duration: "Mehrere Stunden",
      level: "Vertiefung",
      tags: ["Transfer", "Zinsen", "Tarife"],
      description: "Du überträgst die Grundlagen auf Kinoeinnahmen, Produktionszeiten, Füllmengen, Zinsen und Tarifvergleiche.",
      goal: "Du kannst selbstständig eine passende Tabellenstruktur wählen, Formeln entwickeln und Ergebnis- sowie Formelansicht dokumentieren.",
      keyPoints: [
        { title: "Modellieren", text: "Zuerst Größen und Beziehungen klären, dann Excel einsetzen." },
        { title: "Einheiten", text: "Liter, Dosen, Minuten, Prozent und Euro konsequent trennen." },
        { title: "Varianten", text: "Ein gutes Modell rechnet nach Änderung der Eingaben automatisch neu." },
        { title: "Dokumentation", text: "Ergebnis- und Formelansicht machen den Lösungsweg nachvollziehbar." }
      ],
      formulas: [
        { code: "=Kapital*Tage*Zinssatz/36000", note: "Kaufmännische Zinsformel bei Prozentangabe als ganze Zahl." },
        { code: "=Grundpreis+Zusatzminuten*Minutenpreis+ZusatzSMS*SMSPreis", note: "Grundstruktur eines Tarifvergleichs." }
      ],
        steps: [
          "Bearbeite alle fünf Vertiefungsaufgaben: Kino, Brötchen, Dosen, Zinsen und Tarifvergleich.",
          "Erstelle für die Aufgaben 2 bis 5 eine Ergebnis- und eine Formelansicht.",
          "Prüfe die Formeln durch Änderungstests, speichere fünf Dateien und bespreche sie mit der Lehrkraft."
        ],
        checks: ["Alle fünf Aufgaben bearbeitet und Dateien gespeichert", "Aufgaben 2 bis 5 mit Ergebnis- und Formelansicht", "Formeln durch Änderungstests geprüft"],
      tip: "Brüche wie 1/3 können als Datum erkannt werden. Formatiere die Zelle vor der Eingabe als Bruch.",
      downloads: [
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.1 Vertiefungsaufgabe1 Tabellen entwerfen.docx", "Vertiefung Kino", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.2 Vertiefungsaufgabe2 Brötchen.docx", "Vertiefung Brötchen", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.3 Vertiefungsaufgabe3 Dosen.docx", "Vertiefung Dosen", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.4 Vertiefungsaufgabe4 Zinsen.docx", "Vertiefung Zinsen", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.5 Vertiefungsaufgabe5 Tarifvergleich.docx", "Vertiefung Tarifvergleich", "DOCX"),
        resource("Lernfortschritt_1/Aufgabenstellungen/L1_6.5 Vorlage Vertiefungsaufgabe5 Tarifvergleich.xlsx", "Excel-Vorlage Tarifvergleich", "XLSX")
      ]
    },

    {
      id: "l2-1",
      stage: 2,
      page: "l2-1.html",
      code: "L2.1",
      title: "Relative Adressierung",
      duration: "35 Min.",
      level: "Grundlage",
      tags: ["Zellbezug", "Kopieren"],
      description: "Du berechnest Vergütungen in einer Projektwoche und nutzt bewusst mitwandernde Zellbezüge.",
      goal: "Du kannst erklären, warum sich relative Bezüge beim Kopieren verändern und wann genau dieses Verhalten erwünscht ist.",
      keyPoints: [
        { title: "Relativ zur Zielzelle", text: "D6*E6 wird eine Zeile tiefer automatisch zu D7*E7." },
        { title: "Kopierfähige Formel", text: "Eine Ausgangsformel funktioniert für alle gleich aufgebauten Zeilen." },
        { title: "Struktur zuerst", text: "Gleiche Merkmale stehen in denselben Spalten." },
        { title: "Stichproben", text: "Erste und letzte Zeile werden manuell kontrolliert." }
      ],
      formulas: [{ code: "=D6*E6", note: "Stundenzahl mal Vergütung je Stunde." }],
      steps: [
        "Erfasse Sportkurs, Betreuung, Stundenzahl und Vergütung je Stunde.",
        "Berechne den Verdienst in der ersten Datenzeile.",
        "Kopiere die Formel und kontrolliere die angepassten Zellbezüge."
      ],
      checks: ["Ausgangsformel korrekt", "Alle Zeilen per Kopieren berechnet", "Bezüge passen zur jeweiligen Zeile"],
      tip: "Relative Bezüge haben kein Dollarzeichen. Sie sind der Normalfall für zeilenweise Berechnungen.",
      downloads: [
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.1.1 Aufgabenstellung Tabellenentwurf-Relative Adressierung.docx", "Aufgabe Projektwoche Teil 1", "DOCX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_1.1.1 Informationsmaterial Kopieren von Formeln.docx", "Informationen relative Bezüge", "DOCX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_1.1.1 Video Formeln kopieren.m4v", "Video Formeln kopieren", "VIDEO")
      ]
    },
    {
      id: "l2-2",
      stage: 2,
      page: "l2-2.html",
      code: "L2.2",
      title: "Absolute Adressierung",
      duration: "40 Min.",
      level: "Grundlage",
      tags: ["$B$3", "F4-Taste"],
      description: "Du fixierst eine gemeinsame Aufwandspauschale, während die übrigen Bezüge beim Kopieren weiterwandern.",
      goal: "Du kannst einen festen Bezug mit Dollarzeichen schreiben und mit F4 zwischen den Bezugsarten wechseln.",
      keyPoints: [
        { title: "Zelle vollständig fixieren", text: "$B$3 bleibt beim Kopieren immer B3." },
        { title: "F4 verwenden", text: "Im Bearbeitungsmodus wechselt F4 die Adressierungsart." },
        { title: "Mischformel", text: "Relative und absolute Bezüge können in einer Formel kombiniert werden." },
        { title: "Fehler verstehen", text: "Ein verrutschter Festwert führt schnell zu #WERT! oder falschen Zahlen." }
      ],
      formulas: [{ code: "=D6*E6+$B$3", note: "D6 und E6 wandern mit, die Aufwandspauschale in B3 bleibt fest." }],
      steps: [
        "Füge die gemeinsame Aufwandspauschale von 20,00 € im Tabellenkopf ein.",
        "Erstelle in der ersten Datenzeile eine Formel mit absolutem Bezug auf B3.",
        "Kopiere die Formel nach unten und prüfe, ob überall $B$3 erhalten bleibt."
      ],
      checks: ["Festwert nur einmal gespeichert", "$B$3 bleibt in jeder Formel gleich", "Verdienste enthalten die Pauschale"],
      tip: "Das Dollarzeichen gehört jeweils vor den Teil, der nicht verändert werden soll: Spalte, Zeile oder beides.",
      downloads: [
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.1.2 Aufgabenstellung Tabellenentwurf-Absolute Adressierung.docx", "Aufgabe Projektwoche Teil 2", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.1.2 Tabellenvorlage Projektwoche absolute Adressierung.xlsx", "Excel-Vorlage Projektwoche", "XLSX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_1.1.2b Informationsmaterial Relative und Absolute Adressierung.docx", "Relative und absolute Adressierung", "DOCX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_1.1.2 Video absolute Adressierung.m4v", "Video absolute Adressierung", "VIDEO")
      ]
    },
    {
      id: "l2-3",
      stage: 2,
      page: "l2-3.html",
      code: "L2.3",
      title: "Gemischte und symbolische Bezüge",
      duration: "Mehrere Stunden",
      level: "Aufbau",
      tags: ["D$4", "$C7", "Namen"],
      description: "Du vergleichst Klassenfahrtpreise mit zweidimensional kopierbaren Formeln und verwendest benannte Zellen für ein gemeinsames Festgehalt.",
      goal: "Du kannst gezielt nur Zeile oder Spalte fixieren, Formeln in zwei Richtungen kopieren und einen gemeinsamen Festwert durch einen definierten Namen ansprechen.",
      keyPoints: [
        { title: "D$4", text: "Die Zeile 4 bleibt fest, die Spalte darf wandern." },
        { title: "$C7", text: "Die Spalte C bleibt fest, die Zeile darf wandern." },
        { title: "Namen", text: "Ein Name wie Festgehalt kann Formeln verständlicher machen." },
        { title: "Kopier-Richtung", text: "Entscheide für jeden Bezug, was horizontal und vertikal passieren soll." }
      ],
      formulas: [
        { code: "=D$4*$C7+$B7", note: "Gemischte Adressierung für Ziele in Spalten und Anbieter in Zeilen." },
        { code: "=F6+Festgehalt", note: "Der definierte Name verweist auf die feste Zelle B3." }
      ],
      steps: [
        "Bearbeite alle drei Klassenfahrt-Teile mit drei Anbietern und drei Zielen.",
        "Prüfe, dass die Formel in D7 nach unten und rechts kopierbar ist.",
        "Erstelle alle drei Teile der Provisionsabrechnung und ersetze den festen Zellbezug durch den Namen Festgehalt."
      ],
      checks: ["Drei Klassenfahrt-Dateien mit kopierbarer Formel", "Drei Provisionsdateien mit benanntem Festgehalt", "Randzellen und Änderungstests geprüft"],
      tip: "Sprich den Bezug laut: „Spalte C fest, Zeile beweglich“. Dann ist $C7 leichter zu merken.",
      downloads: [
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.2.1 Vertiefungsaufgabe Klassenfahrt Teil 1.docx", "Klassenfahrt Teil 1", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.2.2 Vertiefungsaufgabe Klassenfahrt Teil 2.docx", "Klassenfahrt Teil 2", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.2.3 Vertiefungsaufgabe Klassenfahrt Teil 3.docx", "Klassenfahrt Teil 3", "DOCX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_1.2.3 Informationsmaterial gemischte Adressierung.docx", "Gemischte Adressierung", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.3.1 Vertiefungsaufgabe Provisionsabrechnung Teil 1.docx", "Provisionsabrechnung Teil 1", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.3.2 Vertiefungsaufgabe Provisionsabrechnung Teil 2.docx", "Provisionsabrechnung Teil 2", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_1.3.3 Vertiefungsaufgabe Provisionsabrechnung Teil 3.docx", "Provisionsabrechnung Teil 3", "DOCX")
      ]
    },
    {
      id: "l2-4",
      stage: 2,
      code: "L2.4",
      title: "SUMME, MITTELWERT, MIN und MAX",
      page: "l2-4.html",
      duration: "40 Min.",
      level: "Grundlage",
      tags: ["Statistik", "Funktionen"],
      description: "Du fasst Datenbereiche mit Standardfunktionen zusammen und kopierst Auswertungsformeln über mehrere Spalten.",
      goal: "Du kannst Funktionsname, Klammern und Bereichsoperator korrekt einsetzen und passende Kennzahlen auswählen.",
      keyPoints: [
        { title: "Doppelpunkt", text: "C6:C11 bezeichnet alle sechs Teilnehmerzahlen von Zeile 6 bis 11." },
        { title: "SUMME", text: "Addiert alle numerischen Werte im Bereich." },
        { title: "MITTELWERT", text: "Berechnet den arithmetischen Durchschnitt." },
        { title: "MIN und MAX", text: "Liefern kleinsten und größten Wert." }
      ],
      formulas: [
        { code: "=SUMME(C6:C11)", note: "Summe aller sechs Teilnehmerzahlen." },
        { code: "=MITTELWERT(C6:C11)", note: "Durchschnitt ohne eine Auswertungszeile einzubeziehen." },
        { code: "=MIN(C6:C11)  ·  =MAX(C6:C11)", note: "Kleinster und größter Wert im Datenbereich." }
      ],
      steps: [
        "Öffne die Projektwochen-Vorlage.",
        "Berechne Summe, Durchschnitt, Minimum und Maximum für Teilnehmerzahl, Stundenzahl und Verdienst.",
        "Kontrolliere, dass keine Ergebniszeile versehentlich Teil des Mittelwertbereichs ist."
      ],
      checks: ["Bereiche enthalten nur Rohdaten", "Vier Kennzahlen vollständig", "Formeln sinnvoll kopiert"],
      tip: "Ein häufiger Fehler ist, dass die Summenzeile in den MITTELWERT einbezogen wird. Prüfe deshalb Start- und Endzeile genau.",
      downloads: [
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.1 Aufgabenstellung Funktionen.docx", "Aufgabe Funktionen", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.1 Tabellenvorlage Projektwoche Funktionen.xlsx", "Excel-Vorlage Projektwoche", "XLSX"),
        resource("Lernfortschritt_2/Informationsmaterial/L2_2.1 Informationsmaterial zu Funktionen.docx", "Informationen zu Funktionen", "DOCX")
      ]
    },
    {
      id: "l2-5",
      stage: 2,
      code: "L2.5",
      title: "Vertiefung: Funktionen im Vergleich",
      duration: "55 Min.",
      level: "Vertiefung",
      page: "l2-5.html",
      tags: ["Klassenfahrt", "Provision"],
      description: "Du wertest Preise und Provisionsdaten mit geeigneten Kennzahlen aus und vergleichst Ergebnisse.",
      goal: "Du kannst aus einer Fragestellung die passende Funktion ableiten und unterschiedliche Datenbereiche korrekt auswerten.",
      keyPoints: [
        { title: "Frage übersetzen", text: "„günstigster“ bedeutet MIN, „teuerster“ bedeutet MAX." },
        { title: "Gleiche Struktur", text: "Kennzahlen stehen zeilen- oder spaltenweise konsistent." },
        { title: "Passende Einheit", text: "Preise als Währung, Anzahlen als ganze Zahl." },
        { title: "Kontrollrechnung", text: "Mindestens ein Ergebnis wird unabhängig geprüft." }
      ],
      formulas: [
        { code: "=MIN(D7:D9)", note: "Günstigstes Angebot eines Reiseziels." },
        { code: "=MAX(D7:D9)", note: "Teuerstes Angebot desselben Reiseziels." }
      ],
      steps: [
        "Ermittle für jedes Reiseziel den günstigsten und teuersten Gesamtpreis.",
        "Erstelle für Umsatz, Provision und Gehalt jeweils vier statistische Kennzahlen.",
        "Formatiere alle Ergebnisse mit zur Kennzahl passender Einheit."
      ],
      checks: ["Passende Funktion zur Fragestellung", "Bereiche korrekt abgegrenzt", "Zahlenformate passen"],
      tip: "Beschrifte eine Kennzahl so genau, dass auch eine andere Person sofort weiß, welche Daten ausgewertet wurden.",
      downloads: [
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.2 Vertiefungsaufgabe Funktionen Teil 1.docx", "Funktionen Klassenfahrt", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.2 Tabellenvorlage Klassenfahrt Funktionen.xlsx", "Excel-Vorlage Klassenfahrt", "XLSX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.3 Vertiefungsaufgabe Funktionen Teil 2.docx", "Funktionen Provisionsabrechnung", "DOCX"),
        resource("Lernfortschritt_2/Aufgabenstellungen/L2_2.3 Tabellenvorlage Provisionsabrechnung Funktionen.xlsx", "Excel-Vorlage Provision", "XLSX")
      ]
    },

    {
      id: "l3-1",
      stage: 3,
      code: "L3.1",
      title: "Entscheidungen mit WENN",
      duration: "40 Min.",
      level: "Aufbau",
      page: "l3-1.html",
      tags: ["WENN", "Bedingung"],
      description: "Du bildest eine Entscheidung mit Bedingung, Dann-Wert und Sonst-Wert ab.",
      goal: "Du kannst eine verbale Wenn-dann-sonst-Regel in eine kopierfähige Excel-Formel übersetzen.",
      keyPoints: [
        { title: "Drei Teile", text: "Bedingung; Dann-Wert; Sonst-Wert." },
        { title: "Vergleichszeichen", text: "Nutze <, <=, =, >=, > und <> bewusst." },
        { title: "Texte in Anführungszeichen", text: "Ausgaben wie „Jugend“ sind Textwerte." },
        { title: "Grenzen testen", text: "Prüfe Werte direkt unter, auf und über der Grenze." }
      ],
      formulas: [{ code: "=WENN($B$5-D8<18;\"Jugend\";\"Erwachsener\")", note: "Reisejahr ist fixiert, Geburtsjahr wandert je Person." }],
      steps: [
        "Formuliere die Altersregel zunächst als Wenn-dann-sonst-Satz.",
        "Entwickle die Formel für die erste Person und kopiere sie nach unten.",
        "Teste eine Person mit genau 18 Jahren."
      ],
      checks: ["Drei Funktionsargumente vorhanden", "Textausgaben in Anführungszeichen", "Grenzfall 18 geprüft"],
      tip: "Nutze ein kleines Struktogramm oder drei Stichworte, bevor du eine längere WENN-Formel schreibst.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.1 Aufgabenstellung Wenn-Funktion.docx", "Aufgabe WENN-Funktion", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.1 Tabellenvorlage Skiausfahrt.xlsx", "Excel-Vorlage Skiausfahrt", "XLSX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_1.1.1 Informationsmaterial Wenn-Funktion.docx", "Informationen WENN", "DOCX")
      ]
    },
    {
      id: "l3-2",
      stage: 3,
      code: "L3.2",
      title: "Datum und geschachtelte WENN-Funktionen",
      duration: "75 Min.",
      level: "Aufbau",
      points: 100,
      page: "l3-2.html",
      tags: ["JAHR", "WENN verschachtelt"],
      description: "Du berechnest Jahreszahlen, unterscheidest drei Tarifgruppen und ordnest veränderbare Kartenpreise zu.",
      goal: "Du kannst Datumsbestandteile mit JAHR auslesen und mehrere geordnete Bedingungen korrekt verschachteln.",
      keyPoints: [
        { title: "Datum ist eine Zahl", text: "Excel speichert ein Datum numerisch und zeigt es formatiert an." },
        { title: "JAHR", text: "Extrahiert die vierstellige Jahreszahl aus einem Datum." },
        { title: "Reihenfolge", text: "Bei verschachtelten WENN-Prüfungen kommt die engste Grenze zuerst." },
        { title: "Grenzen eindeutig", text: "Bis einschließlich 12 bedeutet <=12." }
      ],
      formulas: [
        { code: "=JAHR(B4)", note: "Ermittelt das Reisejahr aus dem Reisedatum." },
        { code: "=WENN($B$5-D8<=12;\"Kind\";WENN($B$5-D8<18;\"Jugend\";\"Erwachsener\"))", note: "Drei Altersgruppen mit eindeutigen Grenzen." }
      ],
      steps: [
        "Ersetze manuell erfasste Jahreszahlen durch JAHR-Formeln.",
        "Erweitere die bisherige Altersregel um die Kategorie Kind bis einschließlich 12 Jahre.",
        "Teste die Jahresdifferenzen 12, 13, 17 und 18.",
        "Ordne Tageskartenpreise über feste Zellbezüge auf eine Tarifliste zu und teste eine Preisänderung.",
        "Speichere die Skiausfahrt als Teil 2, Teil 3 und Teil 4 im Ordner Ergebnisse."
      ],
      checks: ["JAHR-Formeln und Teil 2 gespeichert", "Drei Tarifgruppen und vier Grenztests geprüft", "Preisänderungstest und Teil 4 gespeichert"],
      tip: "Prüfe zuerst die kleinste Altersgrenze. Bis einschließlich 12 bedeutet <=12. Die vereinfachte Jahresdifferenz ist kein taggenaues Alter.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.2 Aufgabenstellung Datum-Funktion.docx", "Aufgabe Datumsfunktion", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.2 Tabellenvorlage Datum-Funktion.xlsx", "Excel-Vorlage Datum", "XLSX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_1.1.2 Informationsmaterial Datum-Funktion.docx", "Informationen zu Datumsfunktionen", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.3 Aufgabenstellung Geschachtelte Wenn-Funktion.docx", "Aufgabe geschachtelte WENN", "DOCX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_1.1.3 Informationsmaterial Geschachtelte Wenn-Funktion.docx", "Informationen geschachtelte WENN", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.3 Tabellenvorlage geschachtelte Wenn-Funktion.xlsx", "Excel-Vorlage geschachtelte WENN", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.1.4 Aufgabenstellung Geschachtelte Wenn-Funktion Erweiterung.docx", "Aufgabe Tageskartenpreise", "DOCX")
      ]
    },
    {
      id: "l3-3",
      stage: 3,
      code: "L3.3",
      title: "ZÄHLENWENN und SUMMEWENN",
      duration: "50 Min.",
      level: "Aufbau",
      points: 100,
      page: "l3-3.html",
      tags: ["ZÄHLENWENN", "SUMMEWENN"],
      description: "Du ermittelst Häufigkeiten und Summen für bestimmte Kriterien, etwa richtige Tipps oder Tarifgruppen.",
      goal: "Du kannst Kriterienbereich, Suchkriterium und Summenbereich richtig zuordnen.",
      keyPoints: [
        { title: "ZÄHLENWENN", text: "Zählt Zellen, die ein Kriterium erfüllen." },
        { title: "SUMMEWENN", text: "Summiert Werte, wenn die zugehörige Zeile ein Kriterium erfüllt." },
        { title: "Bereiche gleich groß", text: "Kriterien- und Summenbereich müssen zeilenweise zusammenpassen." },
        { title: "Kriterium aus Zelle", text: "Ein Zellbezug macht die Auswertung kopierfähig." }
      ],
      formulas: [
        { code: "=ZÄHLENWENN($E$10:$E$22;D27)", note: "Zählt Anmeldungen der Tarifgruppe in D27." },
        { code: "=SUMMEWENN($E$10:$E$22;D27;$F$10:$F$22)", note: "Summiert Kartenpreise derselben Tarifgruppe." }
      ],
      steps: [
        "Ermittle im Toto-Beispiel die Zahl der richtigen Tipps.",
        "Werte die Skiausfahrt nach Anzahl und Umsatz je Tarifgruppe aus.",
        "Kopiere die Auswertungsformeln über alle Kategorien.",
        "Prüfe Handzählung, Gewinnregeln und Gesamtvergleich; speichere beide eigenen Arbeitsmappen."
      ],
      checks: ["Kriterienbereich absolut gesetzt", "Summenbereich gleich groß", "Teilsummen ergeben Gesamtsumme"],
      tip: "Markiere Kriterien- und Summenbereich nacheinander. Die erste und letzte Zeile müssen identisch sein.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.3.1 Aufgabenstellung ZählenWenn-Funktion.docx", "Aufgabe ZÄHLENWENN", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.3.1 Tabellenvorlage Totogewinn.xlsx", "Excel-Vorlage Totogewinn", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.3.2 Aufgabenstellung SummeWenn-Funktion.docx", "Aufgabe SUMMEWENN", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_1.3.2 Tabellenvorlage Skiausfahrt.xlsx", "Excel-Vorlage Skiausfahrt Teil 5", "XLSX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_1.3.2 Informationsmaterial SummeWenn-Funktion.docx", "Informationen SUMMEWENN", "DOCX")
      ]
    },
    {
      id: "l3-4",
      page: "l3-4.html",
      stage: 3,
      code: "L3.4",
      title: "Bedingte Formatierung",
      duration: "35 Min.",
      level: "Aufbau",
      tags: ["Regeln", "Visualisierung"],
      description: "Du lässt Excel Zellen automatisch hervorheben, wenn Werte oder Texte festgelegte Bedingungen erfüllen.",
      goal: "Du kannst eindeutige Formatierungsregeln erstellen und ihren Geltungsbereich kontrollieren.",
      keyPoints: [
        { title: "Regel statt Handarbeit", text: "Das Format reagiert automatisch auf geänderte Werte." },
        { title: "Geltungsbereich", text: "Die Regel muss auf alle vorgesehenen Datenzeilen wirken." },
        { title: "Eindeutige Farben", text: "Farben erhalten eine klare, fachliche Bedeutung." },
        { title: "Nicht nur Farbe", text: "Bei wichtigen Aussagen zusätzlich Text oder Symbol verwenden." }
      ],
      formulas: [{ code: "Zellwert = \"Ja\"  →  grüne Füllung", note: "Eine Regel kann Text, Zahlen oder Formeln prüfen." }],
      steps: [
        "Markiere die 13 Spielzeilen im Ergebnisbereich J5:J17.",
        "Lege je eine Regel für „Ja“ und „Nein“ an.",
        "Erweitere F5:G17 um Regeln für 0, 1 und 3 Punkte und teste Eingabeänderungen."
      ],
      checks: ["Bewertungsregeln und Teil 5 gespeichert", "Punktregeln und Teil 6 gespeichert", "Änderungstests stimmen, Ausgangswerte und Formeln erhalten"],
      tip: "Öffne „Regeln verwalten“, wenn mehrere Regeln unerwartet miteinander konkurrieren.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_2.1 Aufgabenstellung Bedingte Formatierung.docx", "Aufgabe bedingte Formatierung", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_2.1 Tabellenvorlage Bedingte Formatierung.xlsx", "Excel-Vorlage", "XLSX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_2.1 Informationsmaterial Bedingte Formatierung.docx", "Informationen bedingte Formatierung", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_2.2 Aufgabenstellung Bedingte Formatierung - Erweiterung.docx", "Erweiterungsaufgabe", "DOCX")
      ]
    },
    {
      id: "l3-5",
      page: "l3-5.html",
      stage: 3,
      code: "L3.5",
      title: "SVERWEIS und Fehlerbehandlung",
      duration: "55 Min.",
      level: "Fortgeschritten",
      tags: ["SVERWEIS", "ISTNV"],
      description: "Du suchst zu einem Schlüssel den passenden Wert in einer Tabelle und behandelst fehlende Treffer verständlich.",
      goal: "Du kannst Matrix, Spaltenindex und Suchmodus festlegen sowie einen erwarteten #NV-Fehler behandeln.",
      keyPoints: [
        { title: "Suchspalte links", text: "SVERWEIS sucht in der ersten Spalte der Matrix." },
        { title: "Spaltenindex", text: "2 liefert den Wert aus der zweiten Spalte der Matrix." },
        { title: "FALSCH", text: "Fordert eine genaue Übereinstimmung." },
        { title: "WAHR", text: "Nutzt Bereiche und setzt eine aufsteigend sortierte Suchspalte voraus." }
      ],
      formulas: [
        { code: "=SVERWEIS(G2;$D$2:$E$4;2;FALSCH)", note: "Neutrales Artikelbeispiel: genaue Suche mit fester Matrix." },
        { code: "=WENN(ISTNV(H2);\"Artikel fehlt\";H2)", note: "Im Beispiel enthält H2 das Suchergebnis; nur #NV wird behandelt." }
      ],
      steps: [
        "Ersetze die mehrfach verschachtelte Gewinnformel durch SVERWEIS.",
        "Teste einen Wert, der nicht in der Tabelle vorhanden ist.",
        "Gib bei einem erwarteten Nichttreffer „kein Gewinn“ aus."
      ],
      checks: ["Genaue Gewinnsuche und Teil 1 gespeichert", "Gezielte Fehlerbehandlung und Teil 2 gespeichert", "Treffer und Nichttreffer geprüft, Zählformel erhalten"],
      tip: "In aktuellen Excel-Versionen ist XVERWEIS oft verständlicher. SVERWEIS bleibt wichtig, weil er in vielen bestehenden Dateien vorkommt.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.1.1 Aufgabenstellung SVerweis-Funktion.docx", "Aufgabe SVERWEIS", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.1.1 Tabellenvorlage SVerweis-Funktion.xlsx", "Excel-Vorlage SVERWEIS", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.1.2 Aufgabenstellung ISTNV-Funktion.docx", "Aufgabe ISTNV", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.1.2 Tabellenvorlage ISTNV-Funktion.xlsx", "Excel-Vorlage ISTNV", "XLSX"),
        // Original information sheets contain assignment solutions; use the neutral page examples.
      ]
    },
    {
      id: "l3-6",
      page: "l3-6.html",
      stage: 3,
      code: "L3.6",
      title: "RUNDEN und Verweistabellen",
      duration: "50 Min.",
      level: "Fortgeschritten",
      tags: ["RUNDEN", "Tabellenblatt"],
      description: "Du berechnest gewichtete Noten, rundest Ergebnisse und greifst auf eine Verweistabelle in einem zweiten Tabellenblatt zu.",
      goal: "Du kannst Rechenschritte nachvollziehbar trennen und Blattnamen in Zellbezügen verwenden.",
      keyPoints: [
        { title: "Gewichtung", text: "Schriftlich doppelt und mündlich einfach ergibt (2×S + M)/3." },
        { title: "RUNDEN", text: "Die zweite Angabe bestimmt die Zahl der Nachkommastellen." },
        { title: "Blattbezug", text: "Verweistabelle!A3:C8 greift auf ein anderes Blatt zu." },
        { title: "Exakte Suche", text: "FALSCH verhindert falsche Zuordnungen bei unsortierten Schlüsseln." }
      ],
      formulas: [
        { code: "=RUNDEN(A2;2)", note: "Neutrales Beispiel: 12,346 auf zwei Nachkommastellen runden." },
        { code: "=SVERWEIS(G2;'Artikelpreise'!$A$2:$C$4;2;FALSCH)", note: "Neutrales Beispiel: Artikelbezeichnung aus einem anderen Blatt." }
      ],
      steps: [
        "Berechne schriftlichen Durchschnitt und gewichtete Gesamtnote.",
        "Runde die Endnote auf eine ganze Zahl.",
        "Lies Bewertung und Bemerkung aus dem Blatt „Verweistabelle“ aus."
      ],
      checks: ["Ich habe Durchschnitt, Gewichtung 2:1 und Endrundung entwickelt und Teil 1 gespeichert.", "Ich habe Bewertung und Bemerkung mit einer festen Matrix aus dem zweiten Blatt ermittelt und Teil 2 gespeichert.", "Leere Note, Rundungsgrenze und alle sechs Zuordnungen sind geprüft; Teständerungen sind zurückgesetzt."],
      tip: "RUNDEN verändert das Ergebnis der Formel. Ein Zahlenformat verändert nur die sichtbare Darstellung.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.2.1 Aufgabenstellung Runden-Funktion.docx", "Aufgabe RUNDEN", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.2.1 Tabellenvorlage Runden-Funktion.xlsx", "Excel-Vorlage Noten Teil 1", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.2.2 Aufgabenstellung Verweistabelle.docx", "Aufgabe Verweistabelle", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.2.2 Tabellenvorlage Verweistabelle.xlsx", "Excel-Vorlage Noten Teil 2", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.3 Vertiefungsaufgabe SVerweis-Funktion Teil 1.docx", "Vertiefung KFZ-Steuer", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.3 Tabellenvorlage KFZ-Steuer.xlsx", "Excel-Vorlage KFZ-Steuer", "XLSX"),
        resource("Lernfortschritt_3/Informationsmaterial/L3_3.3 Informationsmaterial SVerweis-Funktion Erweiterung.docx", "Information SVERWEIS mit Bereich_Verweis", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.4 Vertiefungsaufgabe SVerweis-Funktion Teil 2.docx", "Vertiefung PLZ-Suche", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_3.4 Tabellenvorlage PLZ-Suche.xlsx", "Excel-Vorlage PLZ-Suche", "XLSX")
      ]
    },
    {
      id: "l3-7",
      page: "l3-7.html",
      stage: 3,
      code: "L3.7",
      title: "Zielwertsuche",
      duration: "40 Min.",
      level: "Fortgeschritten",
      tags: ["Was-wäre-wenn", "Zielwert"],
      description: "Du lässt Excel den nötigen Eingabewert bestimmen, damit eine Formel ein vorgegebenes Ergebnis erreicht.",
      goal: "Du kannst Zielzelle, Zielwert und veränderbare Zelle korrekt benennen und das Ergebnis fachlich prüfen.",
      keyPoints: [
        { title: "Zielzelle", text: "Enthält eine Formel und soll einen bestimmten Wert erreichen." },
        { title: "Zielwert", text: "Das gewünschte Ergebnis, zum Beispiel 1.500 €." },
        { title: "Veränderbare Zelle", text: "Ein einzelner Eingabewert, den Excel anpassen darf." },
        { title: "Plausibilität", text: "Das gefundene Ergebnis muss fachlich sinnvoll sein." }
      ],
      formulas: [{ code: "D2: =B2*C2 · Zielwert 120 · veränderbare Zelle C2", note: "Neutrales Beispiel: Bei festem Stückpreis die Menge für einen gewünschten Gesamtpreis finden." }],
      steps: [
        "Berechne zunächst Gesamtkosten in Franken und Euro.",
        "Nutze die Zielwertsuche für den kleinsten tragbaren positiven Kurs in CHF je Euro.",
        "Bestimme Zinssatz und Startkapital für 6.000 € in getrennten Versuchen mit wiederhergestellten Ausgangswerten."
      ],
      checks: ["Ich habe den Urlaub kalkuliert, den Grenzkurs gesucht, beidseitig geprüft und die Datei gespeichert.", "Ich habe die fünfjährige Verzinsung mit kopierfähigen Formeln aufgebaut und beide unabhängigen Zielwertsuchen durchgeführt.", "Ich habe Ausgangswerte, Zielangaben und Rückrechnungen dokumentiert und die Kapitaldatei gespeichert."],
      tip: "Die Zielwertsuche verändert eine Eingabezelle dauerhaft. Notiere vorher den Ausgangswert oder arbeite in einer Kopie.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_4.1 Aufgabenstellung Zielwertsuche Urlaub.docx", "Zielwertsuche Urlaub", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_4.2 Aufgabenstellung Zielwertsuche Kapital.docx", "Zielwertsuche Kapital", "DOCX")
      ]
    },
    {
      id: "l3-8",
      page: "l3-8.html",
      stage: 3,
      code: "L3.8",
      title: "Vertiefung: komplexe Auswertungen",
      duration: "90 Min.",
      level: "Vertiefung",
      tags: ["Transfer", "Praxisfälle"],
      description: "Du kombinierst WENN, SUMMEWENN, SVERWEIS und Datumslogik in kaufmännischen Praxisfällen.",
      goal: "Du kannst eine umfangreichere Aufgabenstellung selbstständig in Teilberechnungen zerlegen und robuste Formeln entwickeln.",
      keyPoints: [
        { title: "Teilprobleme", text: "Grundwert, Satz, Zuschlag und Ergebnis getrennt berechnen." },
        { title: "Regeln auslagern", text: "Staffeln und Zuordnungen gehören in Verweistabellen." },
        { title: "Grenzfälle", text: "Jede Tarif- oder Altersgrenze systematisch testen." },
        { title: "Nachvollziehbarkeit", text: "Zwischenergebnisse sichtbar und sinnvoll beschriften." }
      ],
      formulas: [
        { code: "=WENN(B2<50000;C2;D2)", note: "Neutrales Beispiel: unter einer Grenze einen von zwei Sätzen wählen." },
        { code: "=SVERWEIS(B2;$F$2:$G$6;2;FALSCH)", note: "Exakte Zuordnung, etwa anhand einer eindeutigen Kundennummer." }
      ],
      steps: [
        "Wähle zwei Fälle: Provision, Bonus, Umsatz, Versicherung oder Vereinsbeitrag.",
        "Skizziere zuerst Eingaben, Regeln, Zwischenergebnisse und Ausgaben.",
        "Teste jede relevante Grenze und mindestens einen unbekannten Schlüssel."
      ],
      checks: ["Zwei Fälle mit kopierfähigen Formeln bearbeitet", "Regelgrenzen und Änderungen mit Testprotokoll geprüft", "Beide XLSX-Dateien gespeichert und erneut geöffnet"],
      tip: "Wenn eine Formel kaum noch lesbar ist, teile die Berechnung in verständliche Zwischenspalten oder eine Verweistabelle auf.",
      downloads: [
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.1 Vertiefung 1 Mitarbeiterprovision Teil 1.docx", "Aufgabe Provision Teil 1", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.1 Tabellenvorlage Mitarbeiterprovision Teil 1.xlsx", "Vorlage Provision Teil 1", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.2 Vertiefung 2 Mitarbeiterprovision Teil 2.docx", "Aufgabe Provision Teil 2", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.2 Tabellenvorlage Mitarbeiterprovision Teil 2.xlsx", "Vorlage Provision Teil 2", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.3 Vertiefung 3 Bonusberechnung.docx", "Aufgabe Bonusberechnung", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.3 Tabellenvorlage Bonusberechnung.xlsx", "Vorlage Bonusberechnung", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.4 Vertiefung 4 Umsatzauswertung.docx", "Aufgabe Umsatzauswertung", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.4 Tabellenvorlage Umsatzauswertung.xlsx", "Vorlage Umsatzauswertung", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.5 Vertiefung 5 Versicherung.docx", "Aufgabe Versicherung", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.5 Tabellenvorlage Versicherung.xlsx", "Vorlage Versicherung", "XLSX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.6 Vertiefung 6 Vereinsbeitrag.docx", "Aufgabe Vereinsbeitrag", "DOCX"),
        resource("Lernfortschritt_3/Aufgabenstellungen/L3_5.6 Tabellenvorlage Vereinsbeitrag.xlsx", "Vorlage Vereinsbeitrag", "XLSX")
      ]
    },

    {
      id: "l4-1",
      page: "l4-1.html",
      stage: 4,
      code: "L4.1",
      title: "Säulendiagramm erstellen und gestalten",
      duration: "40 Min.",
      level: "Grundlage",
      tags: ["Säule", "Diagrammelemente"],
      description: "Du vergleichst Anmeldezahlen als Säulen und ergänzt Titel, Achsenbeschriftungen und eine klare Gestaltung.",
      goal: "Du kannst einen geeigneten Datenbereich markieren und ein vollständig beschriftetes Säulendiagramm erstellen.",
      keyPoints: [
        { title: "Kategorien horizontal", text: "Die einzelnen Aktionen stehen auf der X-Achse." },
        { title: "Werte vertikal", text: "Anmeldezahlen werden auf der Y-Achse abgetragen." },
        { title: "Titel mit Aussage", text: "Der Diagrammtitel beschreibt Inhalt und Zeitraum." },
        { title: "Achsen mit Einheit", text: "Beschriftungen sagen, was gemessen wird." }
      ],
      formulas: [{ code: "Kategorien + Werte markieren → Einfügen → Säule", note: "Die Datenbasis bestimmt Kategorien und Datenreihe." }],
      steps: [
        "Öffne die Vorlage zum Winteraktionstag und markiere Kategorien sowie Anmeldezahlen.",
        "Füge ein Säulendiagramm ein.",
        "Ergänze Diagrammtitel, Achsentitel und eine zurückhaltende Formatvorlage."
      ],
      checks: ["Vier Aktionen ohne Summe als 2D-Säulen dargestellt", "Titel, Achsen, Datenlabels und Nullbasis geprüft", "Datenänderung getestet und beide XLSX-Dateien gespeichert"],
      tip: "Beginne die Größenachse bei null, wenn Balken- oder Säulenlängen verglichen werden. Sonst können Unterschiede übertrieben wirken.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.1.1 Aufgabenstellung Säulendiagramm erstellen.docx", "Aufgabe Diagramm erstellen", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.1.1 Tabellenvorlage Säulendiagramm Teil 1.xlsx", "Vorlage Teil 1", "XLSX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.1.2 Aufgabenstellung Säulendiagramm formatieren.docx", "Aufgabe Diagramm formatieren", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.1.2 Tabellenvorlage Säulendiagramm Teil 2.xlsx", "Vorlage Teil 2", "XLSX")
      ]
    },
    {
      id: "l4-2",
      page: "l4-2.html",
      stage: 4,
      code: "L4.2",
      title: "Balkendiagramm für Rangfolgen",
      duration: "30 Min.",
      level: "Grundlage",
      tags: ["Balken", "Vergleich"],
      description: "Du stellst Kategorien horizontal dar und machst Rangfolgen sowie lange Beschriftungen gut lesbar.",
      goal: "Du kannst begründen, wann ein Balkendiagramm geeigneter ist als ein Säulendiagramm.",
      keyPoints: [
        { title: "Kategorien vertikal", text: "Lange Namen sind auf der Y-Achse gut lesbar." },
        { title: "Werte horizontal", text: "Balkenlängen zeigen Größenunterschiede." },
        { title: "Sortierung", text: "Absteigende Werte machen Rangfolgen schnell sichtbar." },
        { title: "Direkte Beschriftung", text: "Datenlabels können eine Legende überflüssig machen." }
      ],
      formulas: [{ code: "Kategorien vergleichen → Balkendiagramm", note: "Besonders geeignet bei langen Kategorienamen oder vielen Positionen." }],
      steps: [
        "Erstelle aus den Anmeldezahlen ein Balkendiagramm.",
        "Prüfe, ob eine Sortierung die Aussage verbessert.",
        "Wähle eine gut lesbare Darstellung ohne unnötige Effekte."
      ],
      checks: [
        "Ich habe ein 2D-Balkendiagramm mit vier Aktionen, lesbaren Namen, Datenlabels und Nullbasis erstellt.",
        "Ich habe auf einer Blattkopie ganze Datensätze sortiert, die sichtbare Rangfolge geprüft und Gleichstände erklärt.",
        "Ich habe eine Eingabeänderung getestet, die Originalwerte wiederhergestellt und die eigene XLSX-Datei mit beiden Blättern gespeichert und erneut geöffnet."
      ],
      tip: "3D-Effekte erschweren genaue Vergleiche. Für analytische Diagramme ist 2D fast immer klarer.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.2 Aufgabenstellung Balkendiagramm erstellen.docx", "Aufgabe Balkendiagramm", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.2 Tabellenvorlage Balkendiagramm.xlsx", "Excel-Vorlage Balken", "XLSX")
      ]
    },
    {
      id: "l4-3",
      page: "l4-3.html",
      stage: 4,
      code: "L4.3",
      title: "Liniendiagramm für Entwicklungen",
      duration: "35 Min.",
      level: "Grundlage",
      tags: ["Linie", "Zeitreihe"],
      description: "Du machst die Entwicklung von Teilnehmerzahlen über mehrere Jahre sichtbar.",
      goal: "Du kannst eine Zeitachse korrekt zuordnen und Trends mit einem Liniendiagramm darstellen.",
      keyPoints: [
        { title: "Zeit auf X-Achse", text: "Jahre oder Monate folgen chronologisch von links nach rechts." },
        { title: "Werte auf Y-Achse", text: "Die Messgröße erhält eine eindeutige Einheit." },
        { title: "Linie verbindet Messpunkte", text: "Verbindungen verdeutlichen den Verlauf, sind aber keine zusätzlichen Messungen." },
        { title: "Daten auswählen", text: "Nicht zusammenhängende Bereiche lassen sich mit Strg markieren." }
      ],
      formulas: [{ code: "Zeitreihe → Liniendiagramm", note: "Die Reihenfolge der Zeitwerte muss stimmen." }],
      steps: [
        "Markiere Jahre und Teilnehmerzahlen der Aktion Schwimmen.",
        "Erstelle ein Liniendiagramm und ordne die Jahre der horizontalen Achse zu.",
        "Entferne überflüssige Elemente und beschrifte den Verlauf."
      ],
      checks: [
        "Ich habe nur die Schwimmen-Werte als Datenreihe und die Jahre 2013 bis 2017 als X-Achsenbeschriftung verwendet.",
        "Ich habe ein lesbares 2D-Liniendiagramm mit Markierungen, Zahlenlabels, Titel und erklärter Achsenskalierung erstellt.",
        "Ich habe die Datenverknüpfung getestet, die Originalwerte wiederhergestellt und meine XLSX-Datei gespeichert und erneut geöffnet."
      ],
      tip: "Ein Liniendiagramm eignet sich für fortlaufende Zeit. Für unabhängige Kategorien ist ein Säulen- oder Balkendiagramm besser.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.3 Aufgabenstellung Liniendiagramm erstellen.docx", "Aufgabe Liniendiagramm", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.3 Tabellenvorlage Liniendiagramm.xlsx", "Excel-Vorlage Linie", "XLSX")
      ]
    },
    {
      id: "l4-4",
      page: "l4-4.html",
      stage: 4,
      code: "L4.4",
      title: "Kreisdiagramm für Anteile",
      duration: "30 Min.",
      level: "Grundlage",
      tags: ["Kreis", "Anteile"],
      description: "Du stellst dar, wie sich ein Gesamtbetrag auf wenige klar unterscheidbare Bestandteile verteilt.",
      goal: "Du kannst prüfen, ob ein Kreisdiagramm fachlich passt, und Anteile verständlich beschriften.",
      keyPoints: [
        { title: "Ganzes = 100 %", text: "Alle Segmente müssen Teile desselben Gesamtwerts sein." },
        { title: "Wenige Kategorien", text: "Zu viele Segmente machen das Diagramm unlesbar." },
        { title: "Direkte Prozentwerte", text: "Datenbeschriftungen helfen beim Ablesen." },
        { title: "Keine negativen Werte", text: "Negative Werte lassen sich als Kreisanteil nicht sinnvoll zeigen." }
      ],
      formulas: [{ code: "Anteil = Teilwert / Gesamtwert", note: "Ein Kreisdiagramm visualisiert dieselbe Beziehung grafisch." }],
      steps: [
        "Berechne die Verpflegungskosten je Aktion.",
        "Erstelle ein Kreisdiagramm aus Aktionen und Gesamtkosten.",
        "Zeige verständliche Beschriftungen und prüfe die Summe aller Anteile."
      ],
      checks: [
        "Ich habe die Verpflegungskosten je Aktion mit Formeln berechnet und den zusätzlichen Euro für Skifahrer berücksichtigt.",
        "Ich habe nur Aktionen und ihre Gesamtkosten als Kreisdiagramm gewählt, die Summe ausgeschlossen und die Anteile eindeutig beschriftet.",
        "Ich habe Gesamtsumme, Anteile und Neuberechnung geprüft, die Originalwerte wiederhergestellt und meine XLSX-Datei gespeichert und erneut geöffnet."
      ],
      tip: "Auch wenn das Ausgangsmaterial eine 3D-Darstellung vorsieht, ist eine klare 2D-Darstellung für exakte Vergleiche meist besser.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.4 Aufgabenstellung Kreisdiagramm erstellen.docx", "Aufgabe Kreisdiagramm", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.4 Tabellenvorlage Kreisdiagramm.xlsx", "Excel-Vorlage Kreis", "XLSX")
      ]
    },
    {
      id: "l4-5",
      page: "l4-5.html",
      stage: 4,
      code: "L4.5",
      title: "Gruppierte und gestapelte Säulen",
      duration: "55 Min.",
      level: "Aufbau",
      tags: ["Gruppiert", "Gestapelt", "100 %"],
      description: "Du vergleichst mehrere Datenreihen direkt, als Summe oder als prozentuale Zusammensetzung.",
      goal: "Du kannst zwischen gruppierter, gestapelter und 100-%-Darstellung anhand der Fragestellung wählen.",
      keyPoints: [
        { title: "Gruppiert", text: "Vergleicht Einzelwerte mehrerer Reihen nebeneinander." },
        { title: "Gestapelt", text: "Zeigt Zusammensetzung und absolute Gesamthöhe." },
        { title: "100 % gestapelt", text: "Vergleicht prozentuale Anteile unabhängig von der Gesamthöhe." },
        { title: "Legende", text: "Jede Datenreihe braucht eine eindeutige Bezeichnung." }
      ],
      formulas: [{ code: "Frage bestimmt Untertyp", note: "Einzelwerte vergleichen, Gesamtwerte zeigen oder Anteile vergleichen." }],
      steps: [
        "Vergleiche zwei Jahre als gruppierte Säulen.",
        "Stelle Aktionen mehrerer Jahre gestapelt dar und zeige die Jahressummen.",
        "Visualisiere Wahlergebnisse als 100-%-gestapelte Säulen."
      ],
      checks: [
        "Ich habe die vier Aktionen 2016 und 2017 als gruppierte Säulen verglichen und die Summenzeile ausgeschlossen.",
        "Ich habe für 2013–2017 je eine gestapelte Säule mit vier Aktionen erstellt, Jahressummen kontrolliert und die Grenzen beim Segmentvergleich erklärt.",
        "Ich habe die historischen Wahldaten 1994–2017 als 100-%-Säulen mit sieben Reihen dargestellt, Prozentwerte geprüft und alle drei Dateien gespeichert und erneut geöffnet."
      ],
      tip: "100-%-gestapelt zeigt die Zusammensetzung jeder Kategorie, nicht ihre absolute Gesamtsumme.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.5 Aufgabenstellung gruppiertes Säulendiagramm erstellen.docx", "Aufgabe gruppiert", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.5 Tabellenvorlage gruppiertes Säulendiagramm.xlsx", "Vorlage gruppiert", "XLSX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.6 Aufgabenstellung gestapeltes Säulendiagramm erstellen.docx", "Aufgabe gestapelt", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.6 Tabellenvorlage gestapeltes Säulendiagramm.xlsx", "Vorlage gestapelt", "XLSX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.7 Aufgabenstellung 100Prozent Säulendiagramm erstellen.docx", "Aufgabe 100 %", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.7 Tabellenvorlage 100Prozent Säulendiagramm.xlsx", "Vorlage 100 %", "XLSX")
      ]
    },
    {
      id: "l4-6",
      page: "l4-6.html",
      stage: 4,
      code: "L4.6",
      title: "Punktdiagramm und Trendlinie",
      duration: "45 Min.",
      level: "Aufbau",
      tags: ["XY", "Regression", "R²"],
      description: "Du untersuchst den Zusammenhang zwischen zwei numerischen Größen und ergänzt Regressionsgerade sowie Bestimmtheitsmaß.",
      goal: "Du kannst X- und Y-Werte korrekt zuordnen und Trendlinie, Gleichung und R² vorsichtig interpretieren.",
      keyPoints: [
        { title: "Zahlenpaare", text: "Jeder Punkt besteht aus einem X- und einem Y-Wert." },
        { title: "Keine Kategorienachse", text: "Beide Achsen sind numerisch skaliert." },
        { title: "Trendlinie", text: "Beschreibt den statistischen Verlauf der Punkte." },
        { title: "R²", text: "Zeigt, wie gut die gewählte Linie die Streuung erklärt." }
      ],
      formulas: [{ code: "y = m·x + b", note: "Lineare Regressionsgleichung; Zusammenhang bedeutet nicht automatisch Ursache." }],
      steps: [
        "Markiere Einkommen als X- und Energieverbrauch als Y-Werte.",
        "Erstelle ein Punktdiagramm mit sinnvoll beschrifteten Achsen.",
        "Füge eine lineare Trendlinie, Gleichung und Bestimmtheitsmaß ein."
      ],
      checks: [
        "Ich habe alle 14 vollständigen Länderpaare als XY-Punkte gewählt: Einkommen auf X und jährlicher Pro-Kopf-Energieverbrauch auf Y, mit richtigen Einheiten.",
        "Ich habe eine lineare Trendlinie ohne erzwungenen Nullschnittpunkt eingefügt, Gleichung und R² angezeigt und die Modellgrenzen erläutert.",
        "Ich habe Datenpaare, Punktpositionen und Neuberechnung geprüft, Originalwerte wiederhergestellt und meine XLSX-Datei gespeichert und erneut geöffnet."
      ],
      tip: "R² beschreibt die Modellpassung, keine Ursache. X und Y müssen aus denselben vollständigen Zeilen stammen.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.8 Aufgabenstellung Punktdiagramm mit Trendlinie erstellen.docx", "Aufgabe Punktdiagramm", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_1.8 Tabellenvorlage Punktdiagramm.xlsx", "Vorlage Punktdiagramm", "XLSX")
      ]
    },
    {
      id: "l4-7",
      page: "l4-7.html",
      stage: 4,
      code: "L4.7",
      title: "Vertiefung: betriebliche Diagramme",
      duration: "60 Min.",
      level: "Vertiefung",
      tags: ["Umsatz", "Diagrammwahl"],
      description: "Du entscheidest selbst, welcher Diagrammtyp eine betriebliche Fragestellung am besten beantwortet.",
      goal: "Du kannst aus Frage, Datenstruktur und gewünschter Aussage einen begründeten Diagrammtyp auswählen.",
      keyPoints: [
        { title: "Quartale vergleichen", text: "Säulen oder Linien, je nach Fokus auf Vergleich oder Verlauf." },
        { title: "Filialanteile", text: "Kreis nur bei wenigen Anteilen eines Ganzen." },
        { title: "Mehrere Filialen", text: "Gruppierte Säulen erlauben direkte Vergleiche." },
        { title: "Eine Filiale im Jahr", text: "Linie betont die zeitliche Entwicklung." }
      ],
      formulas: [{ code: "Frage → Datenbasis → Diagrammtyp → Gestaltung", note: "Die Auswahl wird begründet, nicht nur ausprobiert." }],
      steps: [
        "Erstelle für Filialumsätze vier Diagramme mit jeweils klarer Aussage.",
        "Visualisiere Kundenanzahl und Umsatzanteile nach Standort.",
        "Begründe für jedes Diagramm die Auswahl in einem kurzen Satz."
      ],
      checks: [
        "Ich habe vier Filialdiagramme aus passenden Summen bzw. Quartalswerten erstellt und jede Auswahl schriftlich begründet.",
        "Ich habe Kundenanzahl und Umsatzanteile der vier Standorte getrennt dargestellt und unterschiedliche Bezugsgrößen erklärt.",
        "Ich habe beide Änderungstests durchgeführt, die Eingaben wiederhergestellt und beide XLSX-Dateien gespeichert und erneut geöffnet."
      ],
      tip: "Markiere nicht gleichzeitig Detailwerte und ihre Summe. Sonst wird derselbe Umsatz im Diagramm doppelt dargestellt.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.1 Vertiefungsaufgabe 1 Filialumsätze.docx", "Vertiefung Filialumsätze", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.1 Tabellenvorlage Filialumsätze.xlsx", "Excel-Vorlage Filialumsätze", "XLSX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.2 Vertiefungsaufgabe 2 Umsatzauswertungen.docx", "Vertiefung Umsatzauswertung", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.2 Tabellenvorlage Umsatzauswertungen.xlsx", "Excel-Vorlage Umsatzauswertung", "XLSX")
      ]
    },
    {
      id: "l4-8",
      page: "l4-8.html",
      stage: 4,
      code: "L4.8",
      title: "Vertiefung: Messdaten und Prognosen",
      duration: "65 Min.",
      level: "Vertiefung",
      tags: ["Messreihe", "Trend", "Prognose"],
      description: "Du analysierst Bewegung, freien Fall und Fahrtdaten mit Punktdiagramm, Regression und vorsichtiger Prognose.",
      goal: "Du kannst Messdaten aufbereiten, ein passendes Regressionsmodell wählen und Grenzen einer Extrapolation benennen.",
      keyPoints: [
        { title: "Messwerte", text: "Zeit und Strecke bleiben echte Zahlen mit Einheiten." },
        { title: "Kumulieren", text: "Abschnittswerte werden für eine Gesamtfahrt laufend addiert." },
        { title: "Modellwahl", text: "Gleichförmige Bewegung ist linear, freier Fall typischerweise nicht." },
        { title: "Extrapolation", text: "Prognosen außerhalb des Messbereichs sind unsicherer." }
      ],
      formulas: [
        { code: "v = Δs / Δt", note: "Durchschnittliche Geschwindigkeit aus Strecken- und Zeitänderung." },
        { code: "=SUMME($B$2:B2)", note: "Beispiel für einen kumulierten Wert beim Kopieren nach unten." }
      ],
      steps: [
        "Erfasse mindestens eine Messreihe und erstelle ein Punktdiagramm.",
        "Füge eine fachlich passende Trendlinie mit Gleichung und R² ein.",
        "Nutze die Gleichung für eine Prognose und erläutere ihre Unsicherheit."
      ],
      checks: [
        "Ich habe Bewegung und freien Fall als XY-Diagramme ausgewertet, passende Modelle begründet und Durchschnittsgeschwindigkeit von Trendsteigung unterschieden.",
        "Ich habe Strecken und Zeiten der Fahrt kumuliert, eine lineare Regression erstellt und die Fahrtdauer für 950 km mit Einheiten und Annahmen berechnet.",
        "Ich habe Änderungstests durchgeführt, Prognosegrenzen erläutert, Originalwerte wiederhergestellt und alle drei XLSX-Dateien gespeichert und erneut geöffnet."
      ],
      tip: "Ein hohes R² allein beweist kein korrektes Modell. Die Funktionsform muss auch zur Physik oder zur Fachlogik passen.",
      downloads: [
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.3 Vertiefungsaufgabe 3 gleichförmige Bewegung.docx", "Messreihe gleichförmige Bewegung", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.4 Vertiefungsaufgabe 4 freier Fall.docx", "Messreihe freier Fall", "DOCX"),
        resource("Lernfortschritt_4/Aufgabenstellungen/L4_2.5 Vertiefungsaufgabe 5 Urlaubsfahrt.docx", "Messreihe Urlaubsfahrt", "DOCX")
      ]
    }
  ];

  const formulas = [
    { name: "Rechnen mit Zellen", category: "Grundlagen", syntax: "=B4*C4", description: "Verknüpft Zellwerte mit Grundrechenarten.", example: "Preis je Flasche × Menge" },
    { name: "SUMME", category: "Statistik", syntax: "=SUMME(C6:C10)", description: "Addiert alle Zahlen in einem Bereich.", example: "Gesamte Teilnehmerzahl" },
    { name: "MITTELWERT", category: "Statistik", syntax: "=MITTELWERT(C6:C10)", description: "Berechnet den arithmetischen Durchschnitt.", example: "Durchschnittlicher Verdienst" },
    { name: "MIN", category: "Statistik", syntax: "=MIN(D7:D9)", description: "Gibt den kleinsten Wert eines Bereichs zurück.", example: "Günstigstes Reiseangebot" },
    { name: "MAX", category: "Statistik", syntax: "=MAX(D7:D9)", description: "Gibt den größten Wert eines Bereichs zurück.", example: "Höchster Monatsumsatz" },
    { name: "ANZAHL", category: "Statistik", syntax: "=ANZAHL(C4:C20)", description: "Zählt Zellen, die Zahlen enthalten.", example: "Zahl vorhandener Messwerte" },
    { name: "WENN", category: "Logik", syntax: "=WENN(B2<18;\"Jugend\";\"Erwachsen\")", description: "Liefert abhängig von einer Bedingung eines von zwei Ergebnissen.", example: "Tarifgruppe nach Alter" },
    { name: "WENN verschachtelt", category: "Logik", syntax: "=WENN(B2<=12;\"Kind\";WENN(B2<18;\"Jugend\";\"Erwachsen\"))", description: "Bildet mehrere geordnete Entscheidungen ab.", example: "Drei Altersgruppen" },
    { name: "JAHR", category: "Datum", syntax: "=JAHR(B4)", description: "Liest die Jahreszahl aus einem echten Datumswert aus.", example: "Reisejahr aus Reisedatum" },
    { name: "ZÄHLENWENN", category: "Kriterien", syntax: "=ZÄHLENWENN($E$10:$E$22;D27)", description: "Zählt Zellen, die ein Kriterium erfüllen.", example: "Anmeldungen je Tarifgruppe" },
    { name: "SUMMEWENN", category: "Kriterien", syntax: "=SUMMEWENN($E$10:$E$22;D27;$F$10:$F$22)", description: "Summiert Werte der Zeilen, die ein Kriterium erfüllen.", example: "Umsatz je Tarifgruppe" },
    { name: "SVERWEIS genau", category: "Nachschlagen", syntax: "=SVERWEIS(A2;$H$2:$J$20;3;FALSCH)", description: "Sucht exakt in der ersten Spalte einer Matrix und liefert einen Wert von rechts.", example: "Ort zur Postleitzahl" },
    { name: "SVERWEIS Bereich", category: "Nachschlagen", syntax: "=SVERWEIS(B2;$H$2:$I$8;2;WAHR)", description: "Ordnet einen Wert einem aufsteigend sortierten Bereich zu.", example: "Rabattstaffel oder Notenschlüssel" },
    { name: "XVERWEIS", category: "Nachschlagen", syntax: "=XVERWEIS(A2;H2:H20;J2:J20;\"nicht gefunden\")", description: "Moderne Suche mit getrenntem Such- und Rückgabebereich.", example: "Robuste Alternative zu SVERWEIS" },
    { name: "ISTNV", category: "Fehler", syntax: "=ISTNV(SVERWEIS(A2;$H$2:$I$8;2;FALSCH))", description: "Prüft gezielt, ob ein Nicht-verfügbar-Fehler vorliegt.", example: "Fehlender Gewinnschlüssel" },
    { name: "WENNFEHLER", category: "Fehler", syntax: "=WENNFEHLER(XVERWEIS(A2;H:H;J:J);\"nicht gefunden\")", description: "Fängt einen erwarteten Fehler ab und zeigt eine verständliche Alternative.", example: "Fehlender Stammdatensatz" },
    { name: "RUNDEN", category: "Mathematik", syntax: "=RUNDEN(H4;0)", description: "Rundet einen Wert auf die angegebene Zahl an Nachkommastellen.", example: "Endnote auf ganze Zahl" },
    { name: "Relativer Bezug", category: "Bezüge", syntax: "=D6*E6", description: "Zeile und Spalte passen sich beim Kopieren an.", example: "Berechnung pro Datenzeile" },
    { name: "Absoluter Bezug", category: "Bezüge", syntax: "=D6*E6+$B$3", description: "Mit $ fixierte Spalte und Zeile bleiben unverändert.", example: "Gemeinsame Aufwandspauschale" },
    { name: "Gemischter Bezug", category: "Bezüge", syntax: "=D$4*$C7+$B7", description: "Fixiert gezielt nur Zeile oder Spalte für zweidimensionales Kopieren.", example: "Preismatrix für Ziele und Anbieter" },
    { name: "#NV", category: "Fehlermeldungen", syntax: "=SVERWEIS(\"A250\";$A$2:$C$5;3;FALSCH)", description: "Nicht verfügbar: Ein Verweis findet das Suchkriterium nicht. Prüfe Schreibweise, Text statt Zahl und den Suchbereich. Erwartete Fälle fängst du mit WENN(ISTNV(…);…;…) ab.", example: "Artikelnummer fehlt in der Preisliste" },
    { name: "#DIV/0!", category: "Fehlermeldungen", syntax: "=E2/F2", description: "Division durch null oder durch eine leere Zelle. Prüfe den Nenner. Mit =WENN(F2=0;\"\";E2/F2) bleibt die Zelle leer, bis ein Wert vorliegt.", example: "Anteil berechnen, obwohl die Gesamtsumme noch 0 ist" },
    { name: "#WERT!", category: "Fehlermeldungen", syntax: "=G2*E2", description: "Eine Rechnung trifft auf Text, den Excel nicht als Zahl lesen kann, zum Beispiel „12 Stück“. Gib nur die Zahl ein und zeige die Einheit über das Zahlenformat.", example: "Menge mit getippter Einheit in der Zelle" },
    { name: "#NAME?", category: "Fehlermeldungen", syntax: "=SUMM(E2:E6)", description: "Excel kennt einen Namen nicht: Funktionsname vertippt, Text ohne Anführungszeichen oder ein Bereichsname, den es nicht gibt.", example: "SUMM statt SUMME" },
    { name: "#BEZUG!", category: "Fehlermeldungen", syntax: "=SVERWEIS(10;$H$2:$I$8;3;FALSCH)", description: "Ein Bezug ist ungültig: Die Zelle wurde gelöscht, oder der Spaltenindex ist größer als die Matrix. Mache das Löschen rückgängig oder korrigiere Bezug und Spaltenindex.", example: "Spaltenindex 3 in einer Matrix mit zwei Spalten" },
    { name: "#ZAHL!", category: "Fehlermeldungen", syntax: "=WURZEL(-9)", description: "Eine Zahl passt nicht zur Funktion, oder das Ergebnis ist zu groß oder zu klein. Prüfe die Eingabewerte.", example: "Wurzel aus einer negativen Zahl" },
    { name: "#####", category: "Fehlermeldungen", syntax: "#####", description: "Kein Rechenfehler: Die Spalte ist zu schmal für die Zahl oder das Datum. Ziehe die Spalte breiter oder doppelklicke auf den rechten Rand des Spaltenkopfs.", example: "Großer Betrag mit Währungsformat in schmaler Spalte" }
  ];

  // Glossar der Fachbegriffe; lesson nennt die Einheit, in der der Begriff eingeführt wird.
  const glossary = [
    { term: "Arbeitsmappe", text: "Die Excel-Datei (.xlsx). Sie enthält ein oder mehrere Tabellenblätter.", lesson: "L1.1" },
    { term: "Tabellenblatt", text: "Ein einzelnes Blatt der Arbeitsmappe mit eigenem Namen auf dem Register unten.", lesson: "L1.2" },
    { term: "Zelle", text: "Das Feld, in dem sich eine Spalte und eine Zeile kreuzen. Eine Zelle enthält einen Wert oder eine Formel.", lesson: "L1.1" },
    { term: "Zelladresse", text: "Der Name einer Zelle aus Spaltenbuchstabe und Zeilennummer, zum Beispiel B4.", lesson: "L1.2" },
    { term: "Bereich", text: "Mehrere zusammenhängende Zellen, angegeben mit Doppelpunkt: C6:C11 reicht von C6 bis C11.", lesson: "L2.4" },
    { term: "Formel", text: "Eine Rechenanweisung in einer Zelle. Sie beginnt mit = und rechnet bei jeder Änderung neu.", lesson: "L1.2" },
    { term: "Funktion", text: "Eine fertige Rechenvorschrift mit Namen, zum Beispiel SUMME oder WENN.", lesson: "L2.4" },
    { term: "Argument", text: "Eine Angabe, die eine Funktion zum Rechnen braucht. Argumente stehen in der Klammer und werden mit Semikolon getrennt.", lesson: "L3.5" },
    { term: "Relativer Bezug", text: "Eine Zelladresse ohne Dollarzeichen. Beim Kopieren der Formel wandert sie mit.", lesson: "L2.1" },
    { term: "Absoluter Bezug", text: "Eine Zelladresse mit Dollarzeichen vor Spalte und Zeile, zum Beispiel $B$3. Sie bleibt beim Kopieren fest.", lesson: "L2.2" },
    { term: "Gemischter Bezug", text: "Nur Spalte oder nur Zeile ist mit einem Dollarzeichen fixiert, zum Beispiel $A5 oder B$4.", lesson: "L2.3" },
    { term: "Name", text: "Eine selbst vergebene Bezeichnung für eine Zelle oder einen Bereich, zum Beispiel Festgehalt.", lesson: "L2.3" },
    { term: "Zahlenformat", text: "Legt fest, wie ein Wert angezeigt wird, etwa als Währung oder Prozent. Der gespeicherte Wert ändert sich dadurch nicht.", lesson: "L1.3" },
    { term: "Bedingung", text: "Eine Prüfung, die wahr oder falsch ergibt, zum Beispiel B2<18. WENN entscheidet damit zwischen zwei Ergebnissen.", lesson: "L3.1" },
    { term: "Kriterium", text: "Die Angabe, welche Zellen gezählt oder summiert werden sollen, zum Beispiel \"Vertrieb\" bei ZÄHLENWENN.", lesson: "L3.3" },
    { term: "Bedingte Formatierung", text: "Eine Regel, die Zellen automatisch hervorhebt, sobald ihr Wert eine Bedingung erfüllt.", lesson: "L3.4" },
    { term: "Suchkriterium", text: "Der Wert, den SVERWEIS in der ersten Spalte der Matrix sucht.", lesson: "L3.5" },
    { term: "Matrix", text: "Der Bereich, in dem SVERWEIS sucht. Die erste Spalte enthält die Suchwerte, weiter rechts stehen die Ergebnisse.", lesson: "L3.5" },
    { term: "Spaltenindex", text: "Die Nummer der Spalte innerhalb der Matrix, aus der SVERWEIS das Ergebnis holt.", lesson: "L3.5" },
    { term: "Zielwertsuche", text: "Ein Werkzeug, das einen Eingabewert so lange verändert, bis eine Formel das gewünschte Ergebnis liefert.", lesson: "L3.7" },
    { term: "Datenreihe", text: "Zusammengehörende Werte, die ein Diagramm als Säulen, Linie oder Segmente darstellt.", lesson: "L4.1" },
    { term: "Kategorienachse", text: "Die Achse mit den Kategorien eines Diagramms, zum Beispiel die Namen der Kurse. Excel nennt sie auch Rubrikenachse.", lesson: "L4.1" },
    { term: "Größenachse", text: "Die Achse mit den Zahlenwerten. Beginnt sie nicht bei null, wirken Unterschiede größer, als sie sind.", lesson: "L4.1" },
    { term: "Legende", text: "Erklärt, welche Farbe im Diagramm zu welcher Datenreihe gehört.", lesson: "L4.5" },
    { term: "Trendlinie", text: "Eine berechnete Linie, die den Verlauf von Datenpunkten annähert. Sie ist eine Schätzung, keine Garantie.", lesson: "L4.6" },
    { term: "Bestimmtheitsmaß", text: "R² zwischen 0 und 1: Je näher an 1, desto besser passt die Trendlinie zu den Datenpunkten.", lesson: "L4.6" }
  ];

  window.EXCEL_LAB_CONTENT = { stages, lessons, formulas, glossary };
})();
