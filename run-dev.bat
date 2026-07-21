@echo off
set PATH=%PATH%;C:\Program Files\nodejs
cd /d "%~dp0"
echo Starting Next.js dev server on http://localhost:3000...
echo.
call node .\node_modules\next\dist\bin\next dev -p 3000
pause