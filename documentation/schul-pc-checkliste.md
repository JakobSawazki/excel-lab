# Checkliste für den Test am Schul-PC

Stand: 2026-10-10 · gilt für Excel-Lab ab 0.19.0 · Autor: Claude

Diese Punkte lassen sich nur an einem Schul-PC der KSN prüfen (Windows 11,
eigene Anmeldung je Person). Alles andere ist automatisch getestet; siehe
`claude2codex.md`. Dauer: etwa 20 Minuten mit einem Schüler-Account.
Adresse: <https://jakobsawazki.github.io/excel-lab/>

## 1 Erreichbarkeit und Darstellung

- [ ] Die Seite öffnet im Schulnetz in Edge ohne Warnung oder Sperrseite.
- [ ] Startseite, eine Lernseite (z. B. L1.2) und die Formelsammlung sehen
      vollständig aus: Fotos geladen, Schrift scharf, nichts abgeschnitten.
- [ ] Bei 100 % Zoom und bei 125 % Zoom läuft keine Seite seitlich über.
- [ ] Helles und dunkles Farbschema lassen sich umschalten; die Wahl bleibt
      nach dem Wechsel auf eine Lernseite erhalten, ohne kurzes Aufblitzen.

## 2 Profil, Speichern und Laden

- [ ] Profil mit Kürzel und Klasse anlegen, L1.1 öffnen, einen Haken setzen.
- [ ] Browser schließen und wieder öffnen: Profil und Haken sind noch da.
      (Falls nicht, löscht der Schul-PC den Browser-Speicher beim Abmelden;
      dann müssen die Lernenden jedes Mal „Speichern“ und „Laden“ nutzen.)
- [ ] „Speichern“ im Profil legt eine `.json`-Datei im Downloadordner ab.
      Liegt dieser Ordner im persönlichen Laufwerk der Person?
- [ ] Abmelden, an einem **anderen** PC anmelden, „Laden“: Der Stand
      erscheint, und es bleibt bei einem Profil.
- [ ] Meldet sich eine andere Person am selben PC an, sieht sie **nicht** das
      Profil der vorigen.

## 3 Arbeiten mit Excel

- [ ] Browser und Excel lassen sich mit Windows-Taste + Pfeiltaste
      nebeneinander anordnen.
- [ ] Eine Formel aus der Formelsammlung kopieren und in Excel einfügen: Sie
      rechnet (deutsche Funktionsnamen, Semikolon als Trennzeichen).
- [ ] L3.6, Abschnitt „KFZ-Steuer“: Die Musterformel für B7 funktioniert in
      der Excel-Version der Schule; `SVERWEIS … WAHR` liefert bei 2099 ccm 130.
- [ ] Zielwertsuche ist erreichbar (Daten › Was-wäre-wenn-Analyse).
- [ ] Eine Bonusaufgabe lösen, Kontrollwert mit Komma eintragen: +50 XP.

## 4 Videos und Originalmaterial

- [ ] „Video laden“ auf einer Lernseite: Ist YouTube im Schulnetz erreichbar?
      Wenn nicht, bleibt die Einheit ohne Video bearbeitbar.
- [ ] Der Link zum Landesbildungsserver in den Quellenabschnitten öffnet.

## 5 Drucken

- [ ] „Drucken“ auf einer Lernseite: Die Vorschau zeigt alle Abschnitte auf
      Weiß, ohne Navigation; Tabellen sind nicht abgeschnitten.
- [ ] Profil › „Lernnachweis“ › „Drucken“: passt auf eine Seite A4 oder
      bricht sauber um; die Unterschriftszeile ist sichtbar.

## 6 Klassenübersicht (am Lehrer-PC)

- [ ] Zwei oder drei Speicherdateien einsammeln (Tauschlaufwerk, Moodle oder
      Stick) und auf `lehrkraft.html` einlesen: Tabelle und Kennzahlen stimmen
      mit dem überein, was die Lernenden auf ihrem Bildschirm sehen.
- [ ] „Als CSV speichern“ und die Datei in Excel öffnen: Umlaute und Spalten
      sind richtig.

## 7 Bedienung ohne Maus und mit Vorlesefunktion

- [ ] Mit der Tabulatortaste durch Startseite und eine Lernseite gehen: Der
      Fokus ist immer sichtbar, das Lernpfad-Menü lässt sich mit Escape schließen.
- [ ] Optional: Windows-Sprachausgabe (Strg + Windows + Enter) einschalten und
      den Verständnis-Check einer Einheit vorlesen lassen. Werden Fragen,
      Antworten und die Rückmeldung verständlich angesagt?

## Was ich nach dem Test gern wüsste

1. Bleibt der Browser-Speicher über Abmeldungen erhalten (Punkt 2)?
2. Ist YouTube erreichbar (Punkt 4)?
3. Welche Excel-Version läuft an der Schule?
4. Wie lange brauchen Lernende für L1.1 und für eine Bonusaufgabe?
