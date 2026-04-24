@echo off
REM ============================================================
REM  SkillBond - Simple Startup Script
REM  Just starts both services, no fuss
REM ============================================================

setlocal enabledelayedexpansion

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  🚀 SKILLBOND STARTUP                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Get directory
set "ROOT=%~dp0"
cd /d "%ROOT%"

REM Kill existing processes
echo [1/3] Cleaning up existing services...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend on port 3001...
cd /d "%ROOT%backend"
start "SkillBond Backend" cmd /k npm start
timeout /t 4 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend on port 3000...
cd /d "%ROOT%frontend"
start "SkillBond Frontend" cmd /k npm run dev --legacy-peer-deps
timeout /t 4 /nobreak >nul

REM Open browser
echo.
echo ✅ Services started! Opening browser...
timeout /t 3 /nobreak >nul
start "" http://localhost:3000

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ STARTUP COMPLETE                     ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  Backend:  http://localhost:3001                          ║
echo ║  Frontend: http://localhost:3000                          ║
echo ║                                                            ║
echo ║  Test Accounts:                                           ║
echo ║  • alice.eth (95% reputation)                             ║
echo ║  • bob.eth   (72% reputation)                             ║
echo ║  • carol.eth (40% reputation)                             ║
echo ║                                                            ║
echo ║  Close either window to stop that service                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%ROOT%"
pause
