@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo QUICK PUSH BLOG - AI-ML-Developer-Profile
echo ==========================================
echo.

set "MSG=%~1"
set "SHOULD_PAUSE=1"
if not "%~1"=="" set "SHOULD_PAUSE=0"

if "%MSG%"=="" set /p "MSG=Nhap commit message (mac dinh: update blog): "
if "%MSG%"=="" set "MSG=update blog"

echo.
echo Dang stage cac file blog...
set "POST=%~2"
git add -A public\blog
git add -A public\blog-interact
git add vercel.json

if not "%POST%"=="" (
  if /I "%POST%"=="--all-images" (
    git add -A public\image
  ) else (
    if exist "public\image\%POST%\" (
      git add -A "public\image\%POST%"
    ) else (
      echo Khong tim thay thu muc anh: public\image\%POST%
    )
  )
)

echo.
echo Dang commit: %MSG%
git commit -m "%MSG%"
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
if "%SHOULD_PAUSE%"=="1" pause
endlocal
