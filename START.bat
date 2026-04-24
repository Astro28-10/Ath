@echo off
REM ============================================================
REM  SkillBond - Simple Development Startup
REM  No process killing - just starts frontend & backend
REM ============================================================

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  🚀 SKILLBOND DEV START                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo Starting Backend...
cd /d "%ROOT%backend"
start "SkillBond Backend" cmd /k npm start

echo Starting Frontend...
cd /d "%ROOT%frontend"
start "SkillBond Frontend" cmd /k npm run dev

echo.
echo ✅ Services started!
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul

start "" http://localhost:3000

echo Done!
exit
