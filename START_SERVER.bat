@echo off
REM ProcastiNo - Windows Quick Start Script
REM Double-click this file to start the server!

echo.
echo ╔════════════════════════════════════════╗
echo ║     ProcastiNo Backend Server          ║
echo ║     Starting up...                     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This will take a moment (first time only)
    echo.
    call npm install
    echo.
)

echo ✓ Starting ProcastiNo server...
echo.
echo Open your browser to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
