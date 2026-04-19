param(
    [switch]$Manual,
    [switch]$Autostart
)

if (-not ($Manual -or $Autostart)) { exit 0 }

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:PORT = "54321"
$scriptDir = $PSScriptRoot
$venvDir = Join-Path $scriptDir 'private\venv'
if (-not (Test-Path $venvDir)) { & 'py' -3 -m venv $venvDir }
$pythonExe = Join-Path $venvDir 'Scripts\python.exe'
if (-not (Test-Path $pythonExe)) { $pythonExe = 'python' }
$serverScript = Join-Path $scriptDir 'run_with_tray.py'
$requirementsFile = Join-Path $scriptDir 'requirements.txt'
& $pythonExe -c "import flask; import PIL; import pystray" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { & $pythonExe -m pip install --upgrade pip; & $pythonExe -m pip install -r $requirementsFile }
& $pythonExe $serverScript
