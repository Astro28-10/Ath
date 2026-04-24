# SkillBond - Safe PowerShell Startup Script
# Alternative to START.bat with better error handling

param(
    [switch]$SkipNodeCheck = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗"
    Write-Host "║            🚀 SKILLBOND STARTUP (PowerShell)              ║"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
}

function Write-Step {
    param([int]$Step, [string]$Message)
    Write-Host "[$Step/6] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ ERROR: $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ WARNING: $Message" -ForegroundColor Yellow
}

try {
    Write-Header

    # Step 1: Check prerequisites
    Write-Step 1 "Checking prerequisites..."

    # Check Node.js
    if (-not $SkipNodeCheck) {
        $nodeCheck = Get-Command node -ErrorAction SilentlyContinue
        if (-not $nodeCheck) {
            Write-Error "Node.js is not installed or not in PATH"
            Write-Host "Please install Node.js from https://nodejs.org/"
            exit 1
        }
        $nodeVersion = & node --version
        Write-Success "Node.js found: $nodeVersion"

        # Check npm
        $npmCheck = Get-Command npm -ErrorAction SilentlyContinue
        if (-not $npmCheck) {
            Write-Error "npm is not installed or not in PATH"
            exit 1
        }
        $npmVersion = & npm --version
        Write-Success "npm found: $npmVersion"
    }

    # Step 2: Check dependencies
    Write-Host ""
    Write-Step 2 "Verifying dependencies..."

    $backendNodeModules = Join-Path $Root "backend" "node_modules"
    if (-not (Test-Path $backendNodeModules)) {
        Write-Host "Installing backend dependencies..."
        Push-Location "$Root\backend"
        & npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install backend dependencies"
            exit 1
        }
        Pop-Location
    }
    Write-Success "Backend dependencies ready"

    $frontendNodeModules = Join-Path $Root "frontend" "node_modules"
    if (-not (Test-Path $frontendNodeModules)) {
        Write-Host "Installing frontend dependencies..."
        Push-Location "$Root\frontend"
        & npm install --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install frontend dependencies"
            exit 1
        }
        Pop-Location
    }
    Write-Success "Frontend dependencies ready"

    # Step 3: Cleanup
    Write-Host ""
    Write-Step 3 "Cleaning up previous instances..."

    $skillbondProcesses = Get-Process | Where-Object { $_.Name -eq "node" -and $_.MainWindowTitle -like "*SkillBond*" }
    if ($skillbondProcesses) {
        Write-Host "Found $($skillbondProcesses.Count) previous instance(s), stopping..."
        foreach ($proc in $skillbondProcesses) {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 1
    }
    Write-Success "Cleanup complete"

    # Step 4: Check ports
    Write-Host ""
    Write-Step 4 "Checking port availability..."

    $port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($port3001) {
        Write-Warning "Port 3001 appears to be in use"
        Write-Host "  Process: $(Get-Process -Id $port3001.OwningProcess -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)"
    }
    else {
        Write-Success "Port 3001 is available"
    }

    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Warning "Port 3000 appears to be in use"
        Write-Host "  Process: $(Get-Process -Id $port3000.OwningProcess -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)"
    }
    else {
        Write-Success "Port 3000 is available"
    }

    # Step 5: Start backend
    Write-Host ""
    Write-Step 5 "Starting backend on port 3001..."

    $backendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/k cd /d `"$Root\backend`" && npm start" `
        -WindowStyle Normal `
        -PassThru

    if ($backendProcess) {
        Write-Success "Backend started (PID: $($backendProcess.Id))"
        Start-Sleep -Seconds 5
    }
    else {
        Write-Error "Failed to start backend"
        exit 1
    }

    # Step 6: Start frontend
    Write-Step 6 "Starting frontend on port 3000..."

    $frontendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/k cd /d `"$Root\frontend`" && npm run dev" `
        -WindowStyle Normal `
        -PassThru

    if ($frontendProcess) {
        Write-Success "Frontend started (PID: $($frontendProcess.Id))"
        Start-Sleep -Seconds 6
    }
    else {
        Write-Error "Failed to start frontend"
        exit 1
    }

    # Open browser
    Write-Host ""
    Write-Host "Opening browser..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"

    # Success message
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗"
    Write-Host "║                  ✅ STARTUP COMPLETE                       ║"
    Write-Host "╠════════════════════════════════════════════════════════════╣"
    Write-Host "║                                                            ║"
    Write-Host "║  Backend:  http://localhost:3001                          ║"
    Write-Host "║  Frontend: http://localhost:3000                          ║"
    Write-Host "║                                                            ║"
    Write-Host "║  Backend PID:  $($backendProcess.Id)"
    Write-Host "║  Frontend PID: $($frontendProcess.Id)"
    Write-Host "║                                                            ║"
    Write-Host "║  Test Accounts:                                           ║"
    Write-Host "║  • alice.eth (95% reputation)                             ║"
    Write-Host "║  • bob.eth   (72% reputation)                             ║"
    Write-Host "║  • carol.eth (40% reputation)                             ║"
    Write-Host "║                                                            ║"
    Write-Host "║  📋 TIPS:                                                  ║"
    Write-Host "║  • Press Ctrl+C in each window to stop services           ║"
    Write-Host "║  • Check browser console (F12) for frontend errors        ║"
    Write-Host "║  • Check terminal windows for backend errors              ║"
    Write-Host "║                                                            ║"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""

}
catch {
    Write-Error $_.Exception.Message
    Write-Host "Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor Gray
    exit 1
}
