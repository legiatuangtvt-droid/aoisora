@echo off
REM ========================================
REM  START TEST SERVERS - IDLE TIMEOUT
REM ========================================

echo.
echo ========================================
echo   IDLE TIMEOUT WARNING - TEST SETUP
echo ========================================
echo.

REM Check if running from correct directory
if not exist "frontend\" (
    echo ERROR: Please run this script from the project root directory!
    pause
    exit /b 1
)

echo [1/3] Checking configuration...
echo.

REM Check if session.ts has test config
findstr /C:"SESSION_TIMEOUT: 120000" "frontend\src\config\session.ts" >nul
if %errorlevel% equ 0 (
    echo   [OK] Test config detected: 2 minutes timeout
    echo   [OK] Warning: 30 seconds before logout
    echo.
) else (
    echo   [WARNING] Production config detected!
    echo   You may want to edit frontend\src\config\session.ts for faster testing.
    echo.
    echo   Change to:
    echo     SESSION_TIMEOUT: 120000,   // 2 minutes
    echo     WARNING_TIME: 30000,       // 30 seconds
    echo.
    pause
)

echo [2/3] Starting Backend Server...
echo.
start "Backend Server - Port 8000" cmd /k "cd /d "%~dp0backend\api" && D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe -S localhost:8000"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend Server...
echo.
start "Frontend Server - Port 3000" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo   Backend:  http://localhost:8000/api/v1
echo   Frontend: http://localhost:3000
echo.
echo   Test Guide: TEST_SCENARIO_IDLE_TIMEOUT.md
echo.
echo   Press Ctrl+C in each terminal to stop servers
echo.
pause
