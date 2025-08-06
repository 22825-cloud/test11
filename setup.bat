@echo off
setlocal

REM Check if Node.js is installed
echo Checking for Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo *******************************************************************
    echo * ERROR: Node.js is not installed or not found in your system PATH.
    echo * Please install Node.js to continue.
    echo * You can download it from: https://nodejs.org/
    echo *******************************************************************
    goto :end
)
echo Node.js is installed.
echo.

REM Install dependencies
echo Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo.
    echo ******************************************************
    echo * An error occurred during installation.
    echo * Please review the errors above. You can try clearing the
    echo * npm cache by running "npm cache clean --force"
    echo * and then run this script again.
    echo ******************************************************
    goto :end
)
echo Dependencies installed successfully.
echo.

REM Verify the installation
echo Verifying installed libraries...
npm ls >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo *******************************************************************
    echo * WARNING: Dependency verification failed. Some packages may be
    echo * missing or mismatched. To fix this, please try the following:
    echo * 1. Delete the "node_modules" folder.
    echo * 2. Delete the "package-lock.json" file.
    echo * 3. Run this setup.bat script again.
    echo *******************************************************************
) else (
    echo.
    echo All dependencies have been installed and verified successfully.
)

:end
echo.
pause
endlocal
