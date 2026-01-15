@echo off
echo ========================================
echo    AURA PROJECT - SERVER LAUNCHER
echo ========================================
echo.

REM Check if MySQL is running
echo [1/3] Checking MySQL (port 3306)...
netstat -ano | findstr :3306 >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] MySQL is running
) else (
    echo       [X] MySQL is NOT running
    echo       Opening Laragon...
    start "" "D:\devtool\laragon\laragon.exe"
    echo.
    echo       Please click "Start All" in Laragon
    echo       Press any key after MySQL is started...
    pause >nul
)

REM Check if Backend is running
echo.
echo [2/3] Checking Backend API (port 8000)...
netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Backend is already running
) else (
    echo       Starting Backend API...
    start "Backend API - Port 8000" cmd /k "cd /d D:\Project\auraProject\backend\api && echo Starting PHP Server... && D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe -S localhost:8000"
    timeout /t 2 /nobreak >nul
    echo       [OK] Backend started
)

REM Check if Frontend is running
echo.
echo [3/3] Checking Frontend (port 3000)...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Frontend is already running
) else (
    echo       Starting Frontend...
    start "Frontend - Port 3000" cmd /k "cd /d D:\Project\auraProject\frontend && npm run dev"
    echo       [OK] Frontend started
)

echo.
echo ========================================
echo    ALL SERVERS STARTED
echo ========================================
echo.
echo    MySQL:    localhost:3306
echo    Backend:  http://localhost:8000/api/v1
echo    Frontend: http://localhost:3000
echo.
echo ========================================
echo.
echo Press any key to exit...
pause >nul
