$ErrorActionPreference = 'SilentlyContinue'
$taskName = 'AIMLDevProfileServer'
schtasks /Delete /TN $taskName /F | Out-Null
schtasks /Create /SC ONLOGON /TN $taskName /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"d:\desktop\AIML Developer Profile\run_app.ps1\"" /RL LIMITED /F