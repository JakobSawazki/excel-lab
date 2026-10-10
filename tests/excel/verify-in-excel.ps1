# Rechnet die neuen Aufgaben in echtem Excel (deutsche Funktionsnamen) nach.
# Legt nur eine unbenannte Mappe im Speicher an und schließt sie ohne Speichern.
$ErrorActionPreference = 'Stop'
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
$results = New-Object System.Collections.Generic.List[string]
function Put($ws, [string]$addr, $rows) {
  $r = $ws.Range($addr)
  for ($i = 0; $i -lt $rows.Count; $i++) { for ($j = 0; $j -lt $rows[$i].Count; $j++) { $r.Cells.Item($i + 1, $j + 1).Formula = [string]::Format([Globalization.CultureInfo]::InvariantCulture, "{0}", $rows[$i][$j]) } }
}
function Check([string]$name, $actual, $expected) {
  $ok = if ($expected -is [string]) { "$actual" -eq $expected } else { [math]::Abs([double]$actual - [double]$expected) -lt 0.0051 }
  $script:results.Add(("{0}  {1}: {2} (erwartet {3})" -f $(if ($ok) { 'ok    ' } else { 'FEHLER' }), $name, $actual, $expected))
}
try {
  $wb = $xl.Workbooks.Add()
  # ---------- KFZ-Steuer (L3.6, Vertiefung 1) ----------
  $b = $wb.Worksheets.Item(1); $b.Name = 'Berechnung'
  $k = $wb.Worksheets.Add([Type]::Missing, $b); $k.Name = 'Kennzeichenliste'
  $l = $wb.Worksheets.Add([Type]::Missing, $k); $l.Name = 'Länderfaktorliste'
  $h = $wb.Worksheets.Add([Type]::Missing, $l); $h.Name = 'Hubraumliste'
  Put $k 'A1' @(@('Kennzeichen','Landkreis','Bundesland'),@('A','Augsburg','Bayern'),@('AA','Aalen Ostalbkreis','Baden-Württemberg'),@('AB','Aschaffenburg','Bayern'),@('ABG','Altenburger Land','Thüringen'),@('AC','Aachen','Nordrhein-Westfalen'),@('AK','Altenkirchen/Westerwald','Rheinland-Pfalz'),@('ANA','Annaberg','Sachsen'))
  Put $l 'A1' @(@('Bundesland','Faktor'),@('Baden-Württemberg',1.1),@('Bayern',1.5),@('Berlin',1.7),@('Brandenburg',0.9),@('Bremen',0.8),@('Hamburg',1.0),@('Hessen',1.2),@('Mecklenburg-Vorpommern',0.7),@('Niedersachsen',0.9),@('Nordrhein-Westfalen',1.0),@('Rheinland-Pfalz',0.8),@('Saarland',0.9),@('Sachsen',1.3),@('Sachsen-Anhalt',1.2),@('Schleswig-Holstein',1.1),@('Thüringen',0.9))
  Put $h 'A1' @(@('Hubraum (ccm) ab','KFZ-Steuer pro Jahr'),@(300,10),@(600,20),@(900,30),@(1200,50),@(1500,80),@(1800,130),@(2100,210),@(2400,340),@(2700,550),@(3000,890),@(6000,2000))
  $b.Range('B3').Value2 = 'AA'; $b.Range('B4').Value2 = 2099
  $b.Range('B7').FormulaLocal = '=SVERWEIS(B3;Kennzeichenliste!$A$2:$C$8;2;FALSCH)'
  $b.Range('B8').FormulaLocal = '=SVERWEIS(B3;Kennzeichenliste!$A$2:$C$8;3;FALSCH)'
  $b.Range('B10').FormulaLocal = '=SVERWEIS(B8;Länderfaktorliste!$A$2:$B$17;2;FALSCH)'
  $b.Range('B11').FormulaLocal = '=SVERWEIS(B4;Hubraumliste!$A$2:$B$12;2;WAHR)'
  $b.Range('B12').FormulaLocal = '=B10*B11'
  $b.Range('D11').FormulaLocal = '=ISTNV(SVERWEIS(B4;Hubraumliste!$A$2:$B$12;2;FALSCH))'
  Check 'KFZ AA: Zulassungskreis' $b.Range('B7').Text 'Aalen Ostalbkreis'
  Check 'KFZ AA: Bundesland' $b.Range('B8').Text 'Baden-Württemberg'
  Check 'KFZ AA: Länderfaktor' $b.Range('B10').Value2 1.1
  Check 'KFZ 2099 ccm ohne Faktor (WAHR)' $b.Range('B11').Value2 130
  Check 'KFZ 2099 ccm mit Faktor' $b.Range('B12').Value2 143
  Check 'KFZ 2099 ccm mit FALSCH ergibt #NV' "$($b.Range('D11').Value2)" 'True'
  $b.Range('B4').Value2 = 2100; Check 'KFZ 2100 ccm springt auf nächste Stufe' $b.Range('B11').Value2 210
  $b.Range('B4').Value2 = 1799; Check 'KFZ 1799 ccm Stufe darunter' $b.Range('B11').Value2 80
  $b.Range('B3').Value2 = 'A'; Check 'KFZ Kennzeichen A (genau, nicht AA)' $b.Range('B7').Text 'Augsburg'
  $b.Range('B3').Value2 = 'ABG'; Check 'KFZ ABG: Faktor Thüringen' $b.Range('B10').Value2 0.9

  # ---------- PLZ-Suche (L3.6, Vertiefung 2) ----------
  $p = $wb.Worksheets.Add([Type]::Missing, $h); $p.Name = 'Postleitzahlenverzeichnis'
  $p.Range('A1:A20').NumberFormat = '@'
  Put $p 'A1' @(@('PLZ','Ort','Kreis','Bundesland'),@('01067','Dresden','Dresden, Stadt','Sachsen'),@('10115','Berlin','Berlin, Stadt','Berlin'),@('70173','Stuttgart','Stuttgart, Stadt','Baden-Württemberg'),@('72202','Nagold','Calw','Baden-Württemberg'),@('72250','Freudenstadt','Freudenstadt','Baden-Württemberg'),@('73547','Lorch','Ostalbkreis','Baden-Württemberg'))
  $s = $wb.Worksheets.Add([Type]::Missing, $p); $s.Name = 'Suche'
  $s.Range('B4').NumberFormat = '@'; $s.Range('B4').Value2 = '01067'
  $s.Range('B6').FormulaLocal = '=WENN(ISTNV(SVERWEIS(B4;Postleitzahlenverzeichnis!$A$2:$D$7;2;FALSCH));"PLZ nicht gefunden";SVERWEIS(B4;Postleitzahlenverzeichnis!$A$2:$D$7;2;FALSCH))'
  $s.Range('B7').FormulaLocal = '=SVERWEIS(B4;Postleitzahlenverzeichnis!$A$2:$D$7;3;FALSCH)'
  $s.Range('B8').FormulaLocal = '=SVERWEIS(B4;Postleitzahlenverzeichnis!$A$2:$D$7;4;FALSCH)'
  Check 'PLZ 01067 als Text: Ort' $s.Range('B6').Text 'Dresden'
  Check 'PLZ 01067: Bundesland' $s.Range('B8').Text 'Sachsen'
  $s.Range('B4').Value2 = '72202'; Check 'PLZ 72202: Ort' $s.Range('B6').Text 'Nagold'
  Check 'PLZ 72202: Kreis' $s.Range('B7').Text 'Calw'
  $s.Range('B4').Value2 = '99999'; Check 'PLZ unbekannt: Hinweis statt #NV' $s.Range('B6').Text 'PLZ nicht gefunden'
  $s.Range('D4').Value2 = 1067
  $s.Range('D6').FormulaLocal = '=ISTNV(SVERWEIS(D4;Postleitzahlenverzeichnis!$A$2:$D$7;2;FALSCH))'
  Check 'PLZ als Zahl 1067 findet den Text 01067 nicht' "$($s.Range('D6').Value2)" 'True'

  # ---------- Bonusaufgaben (Auswahl mit Excel-eigenen Funktionen) ----------
  $t = $wb.Worksheets.Add([Type]::Missing, $s); $t.Name = 'Bonus'
  # L1.6 Zinsen
  Put $t 'A1' @(@(4800),@(3.5),@(135)); $t.Range('B1').FormulaLocal = '=A1*A3*A2/36000'; Check 'L1.6 Zinsen' $t.Range('B1').Value2 63
  # L2.3 gemischte Bezüge, eine Formel nach rechts und unten kopiert
  Put $t 'E4' @(@('',0.35,0.32,0.28),@(10),@(25),@(50),@(100))
  $t.Range('F5').FormulaLocal = '=$E5*F$4'; $t.Range('F5').Copy($t.Range('F5:H8')) | Out-Null
  $t.Range('F10').FormulaLocal = '=SUMME(F5:H8)'; Check 'L2.3 Summe der zwölf Preise' $t.Range('F10').Value2 175.75
  Check 'L2.3 kopierte Formel in H8' $t.Range('H8').FormulaLocal '=$E8*H$4'
  # L2.4 MITTELWERT
  Put $t 'K1' @(@(412.5),@(389),@(455.2),@(501.8),@(478.4),@(620.1)); $t.Range('L1').FormulaLocal = '=RUNDEN(MITTELWERT(K1:K6);2)'; Check 'L2.4 Mittelwert' $t.Range('L1').Value2 476.17
  # L3.1 WENN mit Grenzfall
  Put $t 'N1' @(@(23.9),@(67.5),@(49.99),@(50),@(112.3),@(38.4),@(81))
  $t.Range('O1').FormulaLocal = '=WENN(N1<50;4,9;0)'; $t.Range('O1').Copy($t.Range('O1:O7')) | Out-Null
  $t.Range('O9').FormulaLocal = '=SUMME(O1:O7)'; Check 'L3.1 Versandkosten' $t.Range('O9').Value2 14.7
  # L3.2 JAHR und geschachtelte WENN
  $dates = @('14.03.2015','02.11.2009','27.01.2008','09.09.2014','30.06.1999','18.04.2012','05.12.2010','21.08.1987')
  for ($i = 0; $i -lt 8; $i++) { $t.Range("Q$($i+1)").FormulaLocal = '=DATWERT("' + $dates[$i] + '")' }
  $t.Range('S1').Value2 = 2026
  $t.Range('R1').FormulaLocal = '=WENN($S$1-JAHR(Q1)<=12;40;WENN($S$1-JAHR(Q1)<18;60;96))'; $t.Range('R1').Copy($t.Range('R1:R8')) | Out-Null
  $t.Range('R10').FormulaLocal = '=SUMME(R1:R8)'; Check 'L3.2 Beitragssumme' $t.Range('R10').Value2 548
  # L3.3 ZÄHLENWENN und SUMMEWENN
  Put $t 'U1' @(@('Einkauf',120.5),@('Vertrieb',310),@('Einkauf',89.9),@('Lager',45),@('Vertrieb',220.4),@('Einkauf',199),@('Lager',78.6),@('Vertrieb',150))
  $t.Range('X1').FormulaLocal = '=SUMMEWENN(U1:U8;"Vertrieb";V1:V8)/ZÄHLENWENN(U1:U8;"Vertrieb")'; Check 'L3.3 Durchschnitt Vertrieb' $t.Range('X1').Value2 226.8
  # L3.4 Nachbestellmenge
  Put $t 'Z1' @(@(12,20),@(45,30),@(8,10),@(60,60),@(19,25),@(33,15),@(5,5),@(14,18))
  $t.Range('AB1').FormulaLocal = '=WENN(Z1<AA1;AA1-Z1;0)'; $t.Range('AB1').Copy($t.Range('AB1:AB8')) | Out-Null
  $t.Range('AB10').FormulaLocal = '=SUMME(AB1:AB8)'; Check 'L3.4 Nachbestellmenge' $t.Range('AB10').Value2 20
  # L3.5 SVERWEIS mit ISTNV
  Put $t 'AD1' @(@('A100','Schraubenset',4.9),@('A200','Dübelbox',6.5),@('A300','Akkubohrer',79),@('A400','Wasserwaage',12.8))
  Put $t 'AH1' @(@('A300',2),@('A100',5),@('A250',3),@('A400',1),@('A200',4))
  $t.Range('AJ1').FormulaLocal = '=WENN(ISTNV(SVERWEIS(AH1;$AD$1:$AF$4;3;FALSCH));0;SVERWEIS(AH1;$AD$1:$AF$4;3;FALSCH))*AI1'; $t.Range('AJ1').Copy($t.Range('AJ1:AJ5')) | Out-Null
  $t.Range('AJ7').FormulaLocal = '=SUMME(AJ1:AJ5)'; Check 'L3.5 Rechnungssumme' $t.Range('AJ7').Value2 221.3
  # L3.6 gewichtete Note mit RUNDEN
  Put $t 'AL1' @(@(2.3,2),@(3.0,2),@(1.7,1),@(2.5,2))
  $t.Range('AN1').FormulaLocal = '=RUNDEN(SUMMENPRODUKT(AL1:AL4;AM1:AM4)/SUMME(AM1:AM4);1)'; Check 'L3.6 gerundete Note' $t.Range('AN1').Value2 2.5
  # L3.7 Zielwertsuche
  Put $t 'AP1' @(@(100),@(1.8),@(0.65),@(92)); $t.Range('AP5').FormulaLocal = '=AP1*(AP2-AP3)-AP4'
  [void]$t.Range('AP5').GoalSeek(150, $t.Range('AP1'))
  Check 'L3.7 Zielwertsuche Stückzahl (ungerundet)' ([math]::Round($t.Range('AP1').Value2, 2)) 210.43
  $t.Range('AP1').Value2 = 210; $g210 = $t.Range('AP5').Value2; $t.Range('AP1').Value2 = 211; $g211 = $t.Range('AP5').Value2
  Check 'L3.7 mit 210 Stück Ziel verfehlt, mit 211 erreicht' "$($g210 -lt 150 -and $g211 -ge 150)" 'True'
  # L3.8 Provision
  Put $t 'AR1' @(@(42000),@(61500),@(50000),@(38250),@(74800))
  $t.Range('AS1').FormulaLocal = '=WENN(AR1<50000;AR1*2%;AR1*3,5%)'; $t.Range('AS1').Copy($t.Range('AS1:AS5')) | Out-Null
  $t.Range('AS7').FormulaLocal = '=SUMME(AS1:AS5)'; Check 'L3.8 Provisionssumme' $t.Range('AS7').Value2 8125.5
  # L4.6 Steigung der Trendlinie, L4.8 Durchschnittsgeschwindigkeit
  Put $t 'AU1' @(@(1,22),@(2,31),@(3,38),@(4,49),@(5,58),@(6,66))
  $t.Range('AX1').FormulaLocal = '=RUNDEN(STEIGUNG(AV1:AV6;AU1:AU6);2)'; Check 'L4.6 Steigung' $t.Range('AX1').Value2 8.91
  Put $t 'AZ1' @(@(20,18),@(35,52),@(15,9),@(40,61))
  $t.Range('BC1').FormulaLocal = '=RUNDEN(SUMME(BA1:BA4)/(SUMME(AZ1:AZ4)/60);1)'; Check 'L4.8 Durchschnittsgeschwindigkeit' $t.Range('BC1').Value2 76.4
  $wb.Close($false)
} finally {
  $xl.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl)
}
$results
"{0} von {1} Prüfungen in Excel bestanden" -f ($results | Where-Object { $_ -like 'ok*' }).Count, $results.Count

