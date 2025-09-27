@echo off
echo 🔗 Iniciando Chrome con debugging habilitado...
echo.

REM Cerrar Chrome si está abierto
taskkill /f /im chrome.exe 2>nul

REM Esperar un momento
timeout /t 2 /nobreak >nul

REM Iniciar Chrome con debugging
start "" "chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug" --disable-web-security

echo ✅ Chrome iniciado con debugging en puerto 9222
echo.
echo 📋 Ahora ejecuta: node scripts/auto-chrome-logs.js
echo.
pause
