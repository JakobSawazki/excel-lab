[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$SourceRoot = [System.IO.Path]::GetFullPath((Join-Path $ProjectRoot '..\BPE1'))
$TargetRoot = [System.IO.Path]::GetFullPath((Join-Path $ProjectRoot 'materialien\BPE1'))

if (-not (Test-Path -LiteralPath $SourceRoot -PathType Container)) {
    throw "Der Quellordner wurde nicht gefunden: $SourceRoot"
}

if (-not $TargetRoot.StartsWith([System.IO.Path]::GetFullPath($ProjectRoot), [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Der Zielordner liegt außerhalb des Projekts: $TargetRoot"
}

New-Item -ItemType Directory -Path $TargetRoot -Force | Out-Null

$Copied = 0

Get-ChildItem -LiteralPath $SourceRoot -Directory -Filter 'Lernfortschritt_*' | ForEach-Object {
    $StageSource = $_.FullName
    $StageTarget = Join-Path $TargetRoot $_.Name
    New-Item -ItemType Directory -Path $StageTarget -Force | Out-Null

    Get-ChildItem -LiteralPath $StageSource -File -Filter 'Aktivitätsverfolgung*' | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $StageTarget $_.Name) -Force
        $Copied++
    }

    foreach ($FolderName in @('Aufgabenstellungen', 'Informationsmaterial')) {
        $FolderSource = Join-Path $StageSource $FolderName
        if (-not (Test-Path -LiteralPath $FolderSource -PathType Container)) {
            continue
        }

        $FolderTarget = Join-Path $StageTarget $FolderName
        New-Item -ItemType Directory -Path $FolderTarget -Force | Out-Null

        Get-ChildItem -LiteralPath $FolderSource -File | ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $FolderTarget $_.Name) -Force
            $Copied++
        }
    }
}

Write-Output "$Copied Lernendenmaterialien wurden nach $TargetRoot kopiert."
Write-Output 'Musterlösungen und Lehrerdateien wurden nicht kopiert.'

