@echo off
setlocal
cd /d "%~dp0"
echo.
echo ==========================================
echo   Poli-Educa - Servidor local Semana 5
echo ==========================================
echo.
echo Abriendo http://localhost:5500
start "" http://localhost:5500
where py >nul 2>&1
if %errorlevel%==0 (
  py -m http.server 5500
  goto :end
)
where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server 5500
  goto :end
)
echo No se encontro Python. Usa Live Server en VS Code o instala Python.
pause
:end
endlocal
