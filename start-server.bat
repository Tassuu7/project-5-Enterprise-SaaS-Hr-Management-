@echo off
title WorkSphere Enterprise HRMS (Port 5005)
color 0B
echo ======================================================================
echo           WORKSPHERE ENTERPRISE HRMS - CLOUD SAAS PLATFORM
echo ======================================================================
echo.
echo [*] Starting Enterprise HRMS Server on Port 5005...
echo [*] Open your browser at: http://localhost:5005 (or http://127.0.0.1:5005)
echo.
cd /d "%~dp0"
node server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Server exited with an error. Check logs in storage\logs
    pause
)
