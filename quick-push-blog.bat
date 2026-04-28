@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"

echo ==========================================
echo QUICK PUSH BLOG - AI-ML-Developer-Profile
echo ==========================================
echo.

set "MSG=%~1"
if "%MSG%"=="" (
  set /p MSG=Nhap commit message (mac dinh: update blog): 
)
if "!MSG!"=="" (
  set "MSG=update blog"
)

echo.
echo Dang stage cac file blog...
git add public\blog public\image vercel.json

echo.
echo Dang commit: !MSG!
git commit -m "!MSG!"
if errorlevel 1 (
  echo.
  echo Khong co thay doi moi de commit hoac commit that bai.
  goto end
)

echo.
echo Dang push len origin/main...
git push origin main
if errorlevel 1 (
  echo.
  echo Push that bai. Vui long kiem tra mang/quyen truy cap.
  goto end
)

echo.
echo Hoan tat: da commit + push blog len GitHub.

:end
echo.
pause
endlocal
