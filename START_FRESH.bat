@echo off
REM ProcastiNo AI Chat - Clean Startup Script
REM This script kills old processes and starts the server fresh

cls
echo.
echo ╔════════════════════════════════════════════════╗
echo ║   ProcastiNo - AI Chat Startup Helper         ║
echo ║                                               ║
echo ║   This will:                                  ║
echo ║   1. Kill any old server processes            ║
echo ║   2. Start fresh npm server                   ║
echo ║   3. Show you the correct dashboard URL      ║
echo ╚════════════════════════════════════════════════╝
echo.

echo Killing old Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Old processes stopped
) else (
    echo ✓ No old processes found (that's fine)
)

echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Starting ProcastiNo Server...
echo.

cd /d "C:\Users\25eg1\OneDrive\Desktop\hackathon"

REM Try port 3000 first
npm start

pause
