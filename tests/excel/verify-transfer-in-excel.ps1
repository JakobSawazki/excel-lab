# Rechnet ausgewaehlte Transferaufgaben (zweite Bonusaufgabe) in echtem Excel nach.
# Legt nur eine unbenannte Mappe an und schliesst sie ohne Speichern.
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
  $script:out.Add(('{0}  {1}: {2} (erwartet {3})' -f $(if ($ok) { 'ok    ' } else { 'FEHLER' }), $name, $actual, $expected))
}
try {
  $wb = $xl.Workbooks.Add(); $t = $wb.Worksheets.Item(1)
  Put $t 'A1' @(@(12500), @(2.4), @(210)); $t.Range('B1').FormulaLocal = '=A1*A3*A2/36000'; Check 'L1.6 Zinsen' $t.Range('B1').Value2 175
  Put $t 'D1' @(@('', 1.25, 2.4, 3.1, 4.75), @(5), @(10), @(20))
  $t.Range('E2').FormulaLocal = '=$D2*E$1'; $t.Range('E2').Copy($t.Range('E2:H4')) | Out-Null
  $t.Range('E6').FormulaLocal = '=SUMME(E2:H4)'; Check 'L2.3 Preistabelle' $t.Range('E6').Value2 402.5
  Put $t 'J1' @(@(2.3, 2.7, 3.0, 1.7), @(2.0, 3.3, 2.7, 2.3), @(1.7, 2.0, 3.7, 2.7))
  $t.Range('N1').FormulaLocal = '=MITTELWERT(J1:M1)'; $t.Range('N1').Copy($t.Range('N1:N3')) | Out-Null
  $t.Range('N5').FormulaLocal = '=RUNDEN(MIN(N1:N3);2)'; Check 'L2.5 bester Schnitt' $t.Range('N5').Value2 2.43
  Put $t 'P1' @(@(18500), @(20000), @(24300), @(19999), @(31000))
  $t.Range('Q1').FormulaLocal = '=WENN(P1>=20000;500;0)'; $t.Range('Q1').Copy($t.Range('Q1:Q5')) | Out-Null
  $t.Range('Q7').FormulaLocal = '=SUMME(Q1:Q5)'; Check 'L3.1 Umsatzbonus' $t.Range('Q7').Value2 1500
  Put $t 'S1' @(@(0.5), @(1), @(2.5), @(3), @(3.5), @(6))
  $t.Range('T1').FormulaLocal = '=WENN(S1<=1;2;WENN(S1<=3;5;9))'; $t.Range('T1').Copy($t.Range('T1:T6')) | Out-Null
  $t.Range('T8').FormulaLocal = '=SUMME(T1:T6)'; Check 'L3.2 Parkgebuehren' $t.Range('T8').Value2 32
  Put $t 'V1' @(@('Obst', 120), @('Gemuese', 85), @('Obst', 60), @('Getraenke', 240), @('Gemuese', 95), @('Obst', 40))
  $t.Range('Y1').FormulaLocal = '=SUMMEWENN(V1:V6;"Obst";W1:W6)'; Check 'L3.3 Warenwert Obst' $t.Range('Y1').Value2 220
  Put $t 'AA1' @(@(62), @(48), @(75), @(39), @(50), @(88), @(44)); $t.Range('AB1').FormulaLocal = '=ZÄHLENWENN(AA1:AA7;"<50")'; Check 'L3.4 rote Ergebnisse' $t.Range('AB1').Value2 3
  Put $t 'AD1' @(@('P01', 14.2), @('P02', 16.8), @('P03', 15.5)); Put $t 'AG1' @(@('P02', 38), @('P03', 40), @('P05', 20), @('P01', 35))
  $t.Range('AI1').FormulaLocal = '=WENN(ISTNV(SVERWEIS(AG1;$AD$1:$AE$3;2;FALSCH));0;SVERWEIS(AG1;$AD$1:$AE$3;2;FALSCH))*AH1'; $t.Range('AI1').Copy($t.Range('AI1:AI4')) | Out-Null
  $t.Range('AI6').FormulaLocal = '=SUMME(AI1:AI4)'; Check 'L3.5 Lohnsumme' $t.Range('AI6').Value2 1755.4
  $t.Range('AK1').FormulaLocal = '=RUNDEN(19,99*1,19;2)*3'; Check 'L3.6 erst runden' $t.Range('AK1').Value2 71.37
  $t.Range('AK2').FormulaLocal = '=RUNDEN(19,99*1,19*3;2)'; Check 'L3.6 erst addieren (Vergleich im Hinweis)' $t.Range('AK2').Value2 71.36
  Put $t 'AM1' @(@(350), @(24), @(10)); $t.Range('AM4').FormulaLocal = '=AM1+AM2*AM3'
  [void]$t.Range('AM4').GoalSeek(2000, $t.Range('AM3')); Check 'L3.7 Sparrate' ([math]::Round($t.Range('AM3').Value2, 2)) 68.75
  Put $t 'AO1' @(@(0, 0), @(500, 0.03), @(1000, 0.05), @(2500, 0.08)); Put $t 'AR1' @(@(480), @(500), @(999), @(1000), @(2600))
  $t.Range('AS1').FormulaLocal = '=AR1*SVERWEIS(AR1;$AO$1:$AP$4;2;WAHR)'; $t.Range('AS1').Copy($t.Range('AS1:AS5')) | Out-Null
  $t.Range('AS7').FormulaLocal = '=SUMME(AS1:AS5)'; Check 'L3.8 Rabattsumme' $t.Range('AS7').Value2 302.97
  Put $t 'AU1' @(@(10, 18), @(20, 29), @(30, 44), @(40, 52), @(50, 67)); $t.Range('AX1').FormulaLocal = '=RUNDEN(STEIGUNG(AV1:AV5;AU1:AU5);2)'; Check 'L4.6 Steigung' $t.Range('AX1').Value2 1.21
  Put $t 'AZ1' @(@(320, 20.8), @(410, 24.6), @(150, 10.5)); $t.Range('BC1').FormulaLocal = '=RUNDEN(SUMME(BA1:BA3)/SUMME(AZ1:AZ3)*100;2)'; Check 'L4.8 Verbrauch' $t.Range('BC1').Value2 6.35
  $wb.Close($false)
} finally { $xl.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl) }
$out
'{0} von {1} Pruefungen in Excel bestanden' -f ($out | Where-Object { $_ -like 'ok*' }).Count, $out.Count
