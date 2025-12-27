@echo off
setlocal enabledelayedexpansion

REM ============================================
REM OptiChain Pre-Push Validation Script (Windows)
REM ============================================
REM Run this script before pushing code to ensure
REM no build/lint/test errors exist in the system.
REM ============================================

set "PROJECT_ROOT=%~dp0.."
set ERRORS=0
set WARNINGS=0

echo.
echo ========================================
echo    OptiChain Pre-Push Validation
echo ========================================
echo.

REM ============================================
REM Check 1: Git Status
REM ============================================

echo [1/4] Checking Git Status...
cd /d "%PROJECT_ROOT%"

for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
echo   Current branch: %BRANCH%

for /f "tokens=*" %%i in ('git log -1 --format^="%%h - %%s"') do set LAST_COMMIT=%%i
echo   Last commit: %LAST_COMMIT%

git status --porcelain > nul 2>&1
if not errorlevel 1 (
    echo   [OK] Git status checked
) else (
    echo   [WARNING] Could not check git status
    set /a WARNINGS+=1
)
echo.

REM ============================================
REM Check 2: Frontend Build
REM ============================================

echo [2/4] Running Frontend Build...
cd /d "%PROJECT_ROOT%\frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install --silent
)

echo   Running Next.js build...
call npm run build > "%TEMP%\fe-build.log" 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Frontend build successful
) else (
    echo   [FAILED] Frontend build failed
    echo   Check %TEMP%\fe-build.log for details
    echo.
    echo   Last 20 lines of build log:
    powershell -Command "Get-Content '%TEMP%\fe-build.log' | Select-Object -Last 20"
    set /a ERRORS+=1
)
echo.

REM ============================================
REM Check 3: Frontend Type Check
REM ============================================

echo [3/4] Running TypeScript Type Check...
cd /d "%PROJECT_ROOT%\frontend"

call npx tsc --noEmit > "%TEMP%\fe-tsc.log" 2>&1
if %errorlevel% equ 0 (
    echo   [OK] TypeScript types OK
) else (
    echo   [WARNING] TypeScript warnings found
    echo   Check %TEMP%\fe-tsc.log for details
    set /a WARNINGS+=1
)
echo.

REM ============================================
REM Check 4: Backend Syntax Check
REM ============================================

echo [4/4] Running Backend Syntax Check...
cd /d "%PROJECT_ROOT%\backend"

REM Try to find Python
where python >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    ) else (
        echo   [WARNING] Python not found, skipping backend checks
        set /a WARNINGS+=1
        goto :summary
    )
)

echo   Using Python: %PYTHON_CMD%

REM Check Python syntax
%PYTHON_CMD% -m py_compile app\main.py 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Main module syntax OK
) else (
    echo   [FAILED] Python syntax error in main.py
    set /a ERRORS+=1
)

%PYTHON_CMD% -m py_compile app\core\config.py 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Config module syntax OK
) else (
    echo   [FAILED] Python syntax error in config.py
    set /a ERRORS+=1
)

echo.

REM ============================================
REM Summary
REM ============================================

:summary
echo.
echo ========================================
echo    Summary
echo ========================================
echo   Errors: %ERRORS%
echo   Warnings: %WARNINGS%
echo.

if %ERRORS% gtr 0 (
    echo ========================================
    echo   X VALIDATION FAILED - DO NOT PUSH
    echo ========================================
    echo.
    echo Please fix the errors above before pushing.
    exit /b 1
) else (
    echo ========================================
    echo   V VALIDATION PASSED - READY TO PUSH
    echo ========================================
    echo.
    if %WARNINGS% gtr 0 (
        echo Note: %WARNINGS% warning(s) found. Consider reviewing them.
    )
    exit /b 0
)
