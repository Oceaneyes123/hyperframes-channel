param([Parameter(Mandatory=$true)][string]$OutputDirectory, [Parameter(Mandatory=$true)][string]$NarrationJson)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$lines = Get-Content -LiteralPath $NarrationJson -Raw | ConvertFrom-Json
if ($lines.Count -ne 8 -or ($lines | Where-Object { $_ -isnot [string] -or $_.Length -gt 300 }).Count) { throw 'Expected eight bounded benchmark narration lines.' }
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $speaker.SelectVoice('Microsoft Zira Desktop')
  $speaker.Rate = 0
  for ($index = 0; $index -lt $lines.Count; $index++) {
    $speaker.SetOutputToWaveFile((Join-Path $OutputDirectory "voice-$index.wav"))
    $speaker.Speak($lines[$index])
  }
  $speaker.SetOutputToNull()
} finally { $speaker.Dispose() }
