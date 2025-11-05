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
$checkProc = Start-Process -FilePath $pythonExe -ArgumentList '-c','import flask, PIL, pystray' -NoNewWindow -PassThru -Wait
if ($checkProc.ExitCode -ne 0) { & $pythonExe -m pip install --upgrade pip; & $pythonExe -m pip install -r $requirementsFile }
Start-Process -FilePath $pythonExe -ArgumentList ('"' + $serverScript + '"') -WorkingDirectory $scriptDir -WindowStyle Hidden