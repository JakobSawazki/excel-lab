# Prüft in echtem Excel, welche Fehlermeldung die Beispiele der Fehlerwerkstatt liefern.
$ErrorActionPreference = 'Stop'
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
try {
  $wb = $xl.Workbooks.Add(); $ws = $wb.Worksheets.Item(1)
  $ws.Range('A2').Formula = 'A100'; $ws.Range('B2').Formula = 'Schraubenset'; $ws.Range('C2').Formula = '4.9'
  $ws.Range('H2').Formula = '10'; $ws.Range('I2').Formula = '5'
  $ws.Range('E2').Formula = '12'; $ws.Range('F2').Formula = '0'; $ws.Range('G2').NumberFormat = '@'; $ws.Range('G2').Formula = '12 Stück'
  $cases = [ordered]@{
    '#NV'     = '=SVERWEIS("A250";$A$2:$C$5;3;FALSCH)'
    '#DIV/0!' = '=E2/F2'
    '#WERT!'  = '=G2*E2'
    '#NAME?'  = '=SUMM(E2:E6)'
    '#BEZUG!' = '=SVERWEIS(10;$H$2:$I$8;3;FALSCH)'
    '#ZAHL!'  = '=WURZEL(-9)'
  }
  $row = 10; $ok = 0
  foreach ($expected in $cases.Keys) {
    $cell = $ws.Range("K$row"); $cell.FormulaLocal = $cases[$expected]; $text = $cell.Text
    if ($text -eq $expected) { $ok++ }
    "{0}  {1} -> {2} (erwartet {3})" -f $(if ($text -eq $expected) { 'ok    ' } else { 'FEHLER' }), $cases[$expected], $text, $expected
    $row++
  }
  $ws.Columns.Item('M').ColumnWidth = 2; $ws.Range('M1').Formula = '1250000'; $ws.Range('M1').NumberFormat = '#,##0.00'
  $hash = $ws.Range('M1').Text
  if ($hash -match '^#+$') { $ok++ }
  "{0}  zu schmale Spalte -> {1}" -f $(if ($hash -match '^#+$') { 'ok    ' } else { 'FEHLER' }), $hash
  $ws.Range('N1').FormulaLocal = '=WENN(F2=0;"";E2/F2)'; $ws.Range('N2').FormulaLocal = '=WENN(ISTNV(K10);"nicht gefunden";K10)'
  if ($ws.Range('N1').Text -eq '' -and $ws.Range('N2').Text -eq 'nicht gefunden') { $ok += 2 }
  "Abhilfen: Division abgefangen='{0}', ISTNV='{1}'" -f $ws.Range('N1').Text, $ws.Range('N2').Text
  "$ok von 9 Prüfungen bestanden"
  $wb.Close($false)
} finally { $xl.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl) }
