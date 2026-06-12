#!/usr/bin/env pwsh
# Run Nexus AI without relying on the broken start.ps1 file.

$ErrorActionPreference = 'Stop'

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $ROOT 'backend'
$frontendPath = Join-Path $ROOT 'frontend'

Write-Host "Starting backend (uvicorn) on http://localhost:8001 ..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  python -m uvicorn main:app --host 127.0.0.1 --port 8001
} -ArgumentList $backendPath

Start-Sleep -Seconds 2

Write-Host "Starting frontend (next dev) on http://localhost:3000 ..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  npm run dev
} -ArgumentList $frontendPath

Write-Host "Backend: http://localhost:8001" -ForegroundColor Cyan
Write-Host "API docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan

while ($true) {
  Start-Sleep -Seconds 2
  $b = Receive-Job $backendJob -ErrorAction SilentlyContinue
  if ($b) { $b | ForEach-Object { Write-Host "[backend] $_" -ForegroundColor DarkGray } }
  $f = Receive-Job $frontendJob -ErrorAction SilentlyContinue
  if ($f) { $f | ForEach-Object { Write-Host "[frontend] $_" -ForegroundColor DarkGray } }
}

