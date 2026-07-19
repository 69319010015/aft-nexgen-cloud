@echo off
set PATH=%PATH%;C:\Program Files\nodejs
set NODE_PATH=C:\Program Files\nodejs\node_modules
cd /d "%~dp0"
call npm install
echo.
echo ==========================================
echo To run dev server, use:
echo   "%NODE_PATH%\npm.cmd" run dev
echo ==========================================
