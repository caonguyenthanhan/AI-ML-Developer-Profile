$ErrorActionPreference = 'Stop'
$startup = [Environment]::GetFolderPath('Startup')
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$startup\AIMLDevProfileServer.lnk")
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "d:\desktop\AIML Developer Profile\run_app.ps1"'
$shortcut.WorkingDirectory = "d:\desktop\AIML Developer Profile"
$shortcut.Save()