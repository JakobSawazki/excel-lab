# Rechnet den L1.2-Auftrag "Kundenworkshop" (Codex, 14.10.2026) und den Budgetrahmen
# aus L1.1 in echtem Excel nach, genau mit den Zelladressen der Lernseiten.
# Legt nur eine unbenannte Mappe an und schliesst sie ohne Speichern.
# Aufruf: powershell -ExecutionPolicy Bypass -File tests\excel\verify-workshop-in-excel.ps1
$ErrorActionPreference = 'Stop'
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
$out = New-Object System.Collections.Generic.List[string]
function Put($ws, [string]$addr, $rows) {
  $r = $ws.Range($addr)
  for ($i = 0; $i -lt $rows.Count; $i++) { for ($j = 0; $j -lt $rows[$i].Count; $j++) { $r.Cells.Item($i + 1, $j + 1).Formula = [string]::Format([Globalization.CultureInfo]::InvariantCulture, '{0}', $rows[$i][$j]) } }
}
function Check([string]$name, $actual, $expected) {
  $ok = [math]::Abs([double]$actual - [double]$expected) -lt 0.0051
  $script:out.Add(('{0}  {1}: {2} (erwartet {3})' -f $(if ($ok) { 'ok    ' } else { 'FEHLER' }), $name, ([math]::Round([double]$actual, 4)), $expected))
}
try {
  $wb = $xl.Workbooks.Add()

  # L1.2 Materialbestellung: A4:C8 Eingaben, D4:D8 Positionen, D9 Summe, B11/B12 Lieferung/Rabatt,
  # D13 Bestellkosten, B15 Teilnehmer, D16 Kosten pro Teilnehmer, B18 Budget, D19 Restbudget.
  $m = $wb.Worksheets.Item(1)
  Put $m 'A4' @(@('Hefte', 2.5, 30), @('Kugelschreiber', 0.8, 30), @('Mappen', 1.2, 30), @('Namensschilder', 0.6, 30), @('Haftnotiz-Bloecke', 1.5, 10))
  foreach ($row in 4..8) { $m.Range("D$row").FormulaLocal = "=B$row*C$row" }
  $m.Range('D9').FormulaLocal = '=D4+D5+D6+D7+D8'
  Put $m 'B11' @(@(8), @(10)); Put $m 'B15' @(@(30)); Put $m 'B18' @(@(200))
  $m.Range('D13').FormulaLocal = '=D9+B11-B12'
  $m.Range('D16').FormulaLocal = '=D13/B15'
  $m.Range('D19').FormulaLocal = '=B18-D13'
  $m.Range('E9').FormulaLocal = '=SUMME(D4:D8)'
  $v = { param($a) $m.Range($a).Value2 }
  Check 'L1.2 Position Hefte D4' (& $v 'D4') 75
  Check 'L1.2 Materialsumme D9' (& $v 'D9') 168
  Check 'L1.2 Alternative SUMME(D4:D8)' (& $v 'E9') 168
  Check 'L1.2 Bestellkosten D13' (& $v 'D13') 166
  Check 'L1.2 Kosten pro Teilnehmer D16' (& $v 'D16') (166 / 30)
  Check 'L1.2 Restbudget D19' (& $v 'D19') 34

  # Aenderungstest 1: zwei Hefte mehr (C4 30 -> 32), D5:D8 bleiben gleich.
  $m.Range('C4').Formula = '32'
  Check 'L1.2 Test 1 D4' (& $v 'D4') 80
  Check 'L1.2 Test 1 D5 unveraendert' (& $v 'D5') 24
  Check 'L1.2 Test 1 D9' (& $v 'D9') 173
  Check 'L1.2 Test 1 D13' (& $v 'D13') 171
  Check 'L1.2 Test 1 D16' (& $v 'D16') (171 / 30)
  Check 'L1.2 Test 1 D19' (& $v 'D19') 29
  $m.Range('C4').Formula = '30'

  # Aenderungstest 2: teurere Lieferung (B11 8 -> 12), D9 bleibt gleich.
  $m.Range('B11').Formula = '12'
  Check 'L1.2 Test 2 D9 unveraendert' (& $v 'D9') 168
  Check 'L1.2 Test 2 D13' (& $v 'D13') 170
  Check 'L1.2 Test 2 D16 steigt' (& $v 'D16') (170 / 30)
  Check 'L1.2 Test 2 D19 sinkt' (& $v 'D19') 30
  $m.Range('B11').Formula = '8'

  # Aenderungstest 3: mehr Teilnehmer (B15 30 -> 32), nur D16 aendert sich (Frage 5: sinkt).
  $m.Range('B15').Formula = '32'
  Check 'L1.2 Test 3 D13 unveraendert' (& $v 'D13') 166
  Check 'L1.2 Test 3 D19 unveraendert' (& $v 'D19') 34
  Check 'L1.2 Test 3 D16 sinkt' (& $v 'D16') 5.1875
  $m.Range('B15').Formula = '30'
  Check 'L1.2 nach dem Zuruecksetzen D19' (& $v 'D19') 34

  # Frage 4: =D9+B11-B12 ist die richtige Bestellformel, die beiden Ablenker liefern andere Werte.
  $m.Range('F13').FormulaLocal = '=D9-B11+B12'; Check 'L1.2 Frage 4 Ablenker a' (& $v 'F13') 170
  $m.Range('G13').FormulaLocal = '=D9+B11+B12'; Check 'L1.2 Frage 4 Ablenker b' (& $v 'G13') 186

  # L1.2 Transfer "Eintrittskarten": 20 EUR Budget, 1,80 EUR je Karte, 7 und danach 10 Karten.
  $k = $wb.Worksheets.Add()
  Put $k 'B1' @(@(20), @(1.8), @(7))
  $k.Range('B4').FormulaLocal = '=B2*B3'; $k.Range('B5').FormulaLocal = '=B1-B4'
  Check 'L1.2 Transfer 7 Karten' ($k.Range('B4').Value2) 12.6
  Check 'L1.2 Transfer Rest bei 7' ($k.Range('B5').Value2) 7.4
  $k.Range('B3').Formula = '10'
  Check 'L1.2 Transfer 10 Karten' ($k.Range('B4').Value2) 18
  Check 'L1.2 Transfer Rest bei 10' ($k.Range('B5').Value2) 2

  # L1.1 Budgetrahmen (Codex, 12.10.2026): fuenf Getraenke, hoechstens 150 EUR.
  $g = $wb.Worksheets.Add()
  Put $g 'A4' @(@('Cola', 1.4, 30), @('Apfelsaft', 1.59, 10), @('Limonade', 1, 15), @('Mineralwasser', 0.79, 8), @('Orangensaft', 1.74, 15))
  foreach ($row in 4..8) { $g.Range("D$row").FormulaLocal = "=B$row*C$row" }
  $g.Range('D9').FormulaLocal = '=SUMME(D4:D8)'; $g.Range('D10').FormulaLocal = '=150-D9'
  Check 'L1.1 Gesamtkosten D9' ($g.Range('D9').Value2) 105.32
  Check 'L1.1 Reserve zum Budget' ($g.Range('D10').Value2) 44.68
  $g.Range('C4').Formula = '32'
  Check 'L1.1 zwei Flaschen Cola mehr' ($g.Range('D9').Value2) 108.12

  $wb.Close($false)
} finally { $xl.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl) }
$out
'{0} von {1} Pruefungen in Excel bestanden' -f ($out | Where-Object { $_ -like 'ok*' }).Count, $out.Count
