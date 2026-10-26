param([Parameter(Mandatory=$true)][string]$RequestJson, [Parameter(Mandatory=$true)][string]$OutputWav)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$request = Get-Content -LiteralPath $RequestJson -Raw | ConvertFrom-Json
if (!$request.text -or $request.text.Length -gt 4000 -or $request.rate -lt -3 -or $request.rate -gt 3) { throw 'Invalid bounded narration request.' }
if (Test-Path -LiteralPath $OutputWav) { throw 'Existing audio must be preserved.' }
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $speaker.SelectVoice($request.voice)
  $speaker.Rate = $request.rate
  $format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
  $speaker.SetOutputToWaveFile($OutputWav, $format)
  $speaker.Speak([string]$request.text)
  $speaker.SetOutputToNull()
  @{ engineVersion = [System.Speech.Synthesis.SpeechSynthesizer].Assembly.GetName().Version.ToString(); voice = $speaker.Voice.Name; culture = $speaker.Voice.Culture.Name; platform = [Environment]::OSVersion.VersionString } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path (Split-Path -Parent $OutputWav) 'runtime.json') -Encoding UTF8
} finally { $speaker.Dispose() }
