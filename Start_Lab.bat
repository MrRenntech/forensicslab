@echo off
TITLE ForensicLab Server
ECHO Starting ForensicLab Environment...
ECHO ===================================
ECHO Connecting to Database...
ECHO Launching Web Server...
ECHO.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    ECHO Error: Node.js is not installed. Please install it from nodejs.org.
    PAUSE
    EXIT /B
)

:: Install dependencies if node_modules is missing
if not exist node_modules (
    ECHO First time setup: Installing dependencies...
    call npm install
)

:: Start the server
node server.js

PAUSE
