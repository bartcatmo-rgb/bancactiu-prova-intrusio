@echo off
setlocal enabledelayedexpansion
title BancActiu 3.0 Enterprise - Gateway Launcher
color 0B
chcp 65001 >nul

set "PROD_URL=https://banc-actiu-2-0-separacion-entidades.vercel.app"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP_DIR%\BancActiu 3.0 Enterprise.lnk"

cls
echo ===============================================================================
echo            BANCACTIU 3.0 ENTERPRISE - LLANÇADOR D'ESCRIPTORI (KIOSK)
echo ===============================================================================
echo  Arquitectura Zero-Trust · ENS Nivell Alt · Control Perimetral de Governança
echo -------------------------------------------------------------------------------
echo.

echo [*] Netejant i refrescant la memòria cau de resolució DNS...
ipconfig /flushdns >nul 2>&1
echo [OK] Memòria cau DNS refrescada amb èxit.
echo.

echo [*] Verificant connectivitat amb el Gateway Permanent de Producció...
echo     URL: %PROD_URL%
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%PROD_URL%' -Method Head -TimeoutSec 7 -UseBasicParsing; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { exit 0 } else { exit 1 } } catch { exit 2 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] Connexió establerta correctament amb Vercel Cloud Edge.
) else (
    echo [AVÍS] Verificació HTTP no concloent o xarxa local restringida.
    echo       S'intentarà la connexió directa mitjançant el navegador.
)
echo.

:: Localització dels navegadors per a mode App Kiosk
set "BROWSER_EXE="

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) else if exist "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

:: Generació automàtica de la Drecera a l'Escriptori si no existeix
if not exist "%SHORTCUT_PATH%" (
    echo [*] Creant drecera intel·ligent a l'Escriptori...
    if exist "%~dp0create_shortcut.vbs" (
        cscript //Nologo "%~dp0create_shortcut.vbs" >nul 2>&1
    )
    if not exist "%SHORTCUT_PATH%" (
        powershell -NoProfile -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = '%~f0'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = 'Accés directe a BancActiu 3.0 Enterprise Gateway'; $Shortcut.Save()" >nul 2>&1
    )
    if exist "%SHORTCUT_PATH%" (
        echo [OK] Drecera creada correctament: "BancActiu 3.0 Enterprise" a l'Escriptori.
    )
)

echo.
echo [*] Iniciant BancActiu 3.0 en mode Kiosk (finestra d'aplicació nativa)...

if defined BROWSER_EXE (
    echo     Executant motor: !BROWSER_EXE!
    start "" "!BROWSER_EXE!" --app="%PROD_URL%" --start-maximized
) else (
    echo     Motor dedicat no localitzat. Obrint navegador per defecte...
    start "" "%PROD_URL%"
)

echo [OK] Sessió de BancActiu 3.0 desplegada amb èxit.
echo.
timeout /t 3 >nul
exit /b 0
