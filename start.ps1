#!/usr/bin/env pwsh
# Nexus AI Startup Script
# Run from the project root to start both backend and frontend servers.

$ErrorActionPreference = 'Stop'

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "" 
Write-Host "  NEXUS AI – Autonomous Personal Operating System" -ForegroundColor Cyan
Write-Host "  Starting all services..." -ForegroundColor Gray
Write-Host ""

# Kill any existing servers
Write-Host "  [1/3] Clearing old instances..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue | ForEach-Object {
  try { taskkill /PID $_.OwningProcess /F 2>$null } catch {}
}
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object {
  try { taskkill /PID $_.OwningProcess /F 2>$null } catch {}
}
Start-Sleep -Seconds 1

# Start Backend
Write-Host "  [2/3] Starting FastAPI backend on http://localhost:8001 ..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  python -m uvicorn main:app --host 127.0.0.1 --port 8001 2>&1
} -ArgumentList (Join-Path $ROOT 'backend')

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "  [3/3] Starting Next.js frontend on http://localhost:3000 ..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  npm run dev 2>&1
} -ArgumentList (Join-Path $ROOT 'frontend')

Start-Sleep -Seconds 3

Write-Host "" 
Write-Host "  Nexus AI is running!" -ForegroundColor Green
Write-Host "" 
Write-Host "  Frontend -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend  -> http://localhost:8001" -ForegroundColor Cyan
Write-Host "  API Docs  -> http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host "" 
Write-Host "  Click 'Try Demo' on the landing page for instant access." -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop all services." -ForegroundColor Gray
Write-Host ""

# Wait and stream output
try {
  while ($true) {
    Start-Sleep -Seconds 2

    $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
    foreach ($line in @($backendOutput)) {
      if ($null -ne $line -and $line -ne '') {
        Write-Host "  [backend] $line" -ForegroundColor DarkGray
      }
    }

    $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
    foreach ($line in @($frontendOutput)) {
      if ($null -ne $line -and $line -ne '') {
        Write-Host "  [frontend] $line" -ForegroundColor DarkGray
      }
    }
  }
}
finally {
  Write-Host "  Stopping Nexus AI..." -ForegroundColor Yellow
  if ($backendJob) { Stop-Job $backendJob -ErrorAction SilentlyContinue | Out-Null }
  if ($frontendJob) { Stop-Job $frontendJob -ErrorAction SilentlyContinue | Out-Null }
  if ($backendJob) { Remove-Job $backendJob -ErrorAction SilentlyContinue | Out-Null }
  if ($frontendJob) { Remove-Job $frontendJob -ErrorAction SilentlyContinue | Out-Null }
  Write-Host "  Stopped." -ForegroundColor Green
}

