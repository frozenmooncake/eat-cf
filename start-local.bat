@echo off
setlocal
title Eat CF - Local Development

set "ROOT=%~dp0"
set "WORKER=%ROOT%worker"

if not exist "%ROOT%package.json" (
  echo Project root was not found.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  pause
  exit /b 1
)

if not exist "%ROOT%node_modules" (
  echo Installing frontend dependencies...
  pushd "%ROOT%"
  call npm.cmd install
  if errorlevel 1 (
    popd
    echo Frontend dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

if not exist "%WORKER%\node_modules" (
  echo Installing Worker dependencies...
  pushd "%WORKER%"
  call npm.cmd install
  if errorlevel 1 (
    popd
    echo Worker dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

if not exist "%WORKER%\.dev.vars" (
  echo Missing worker/.dev.vars.
  echo Copy worker/.dev.vars.example to worker/.dev.vars and fill in the Upstash values first.
  pause
  exit /b 1
)

findstr /C:"your-upstash-url" "%WORKER%\.dev.vars" >nul 2>nul
if not errorlevel 1 (
  echo worker/.dev.vars still contains the example Upstash URL.
  echo Fill in the real Upstash values before starting the local Worker.
  pause
  exit /b 1
)

start "Eat CF - Worker :8787" /D "%WORKER%" cmd /k "npm.cmd run dev -- --ip 127.0.0.1 --port 8787"
timeout /t 2 /nobreak >nul
start "Eat CF - Frontend :5173" /D "%ROOT%" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port 5173"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo.
echo Local services started:
echo Frontend: http://127.0.0.1:5173/
echo Worker:   http://127.0.0.1:8787/
echo Close the two command windows to stop the services.
exit /b 0
