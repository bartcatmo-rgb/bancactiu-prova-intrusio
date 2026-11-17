@echo off
title BancActiu 3.0 Prova Intrusió - Gestor d'Arrencada
chcp 65001 >nul
color 0B

:MENU
cls
echo ==============================================================================
echo    BANCACTIU 3.0 PROVA INTRUSIÓ - ENTOR DE CIBERSEGURETAT (HONEYPOT)
echo ==============================================================================
echo    Classificació: VERSIÓ EDUCATIVA DE DEMOSTRACIÓ - Ús restringit
echo    Autors: Marc Cachinero Baranda i Bartolomé Cachinero Baranda (c) 2026
echo ==============================================================================
echo.
echo    [1] Arrencar en Local (npm install + npm run dev)
echo    [2] Compilar i Verificar Build (npm run build)
echo    [3] Obrir Portal Vercel Producció (https://bancactiu-prova-intrusio.vercel.app)
echo    [4] Obrir Pantalla Trampa Honeypot (/honeypot)
echo    [5] Obrir Monitor d'IPs en Temps Real (/security/intrusions)
echo    [6] Veure Instruccions de GitHub i Desplegament
echo    [7] Netejar node_modules i .next (Llest per a ZIP / Google Drive)
echo    [0] Sortir
echo.
echo ==============================================================================
set /p opcio="Tria una opció [0-7]: "

if "%opcio%"=="1" goto LOCAL_DEV
if "%opcio%"=="2" goto BUILD_CHECK
if "%opcio%"=="3" goto OPEN_VERCEL
if "%opcio%"=="4" goto OPEN_HONEYPOT
if "%opcio%"=="5" goto OPEN_INTRUSIONS
if "%opcio%"=="6" goto INSTRUCTIONS
if "%opcio%"=="7" goto CLEAN_ENV
if "%opcio%"=="0" goto EXIT_APP

echo.
echo [!] Opció no vàlida.
pause
goto MENU

:LOCAL_DEV
cls
echo ==============================================================================
echo    ARRENCANT BANCACTIU 3.0 PROVA INTRUSIÓ EN LOCAL (DEV)
echo ==============================================================================
echo.
cd /d "%~dp0"

if not exist "node_modules" (
    echo [1/2] Instal·lant dependències inicials (npm install)...
    call npm install
    if errorlevel 1 (
        echo [ERROR] La instal·lació de dependències ha fallat.
        pause
        goto MENU
    )
) else (
    echo [1/2] Dependències existents detectades.
)

echo.
echo [2/2] Iniciant servidor de desenvolupament Next.js...
echo       El portal estarà disponible a: http://localhost:3000
echo.
start http://localhost:3000
call npm --prefix apps/bancactiu-nexus run dev
pause
goto MENU

:BUILD_CHECK
cls
echo ==============================================================================
echo    COMPILACIÓ I VERIFICACIÓ DE PRODUCCIÓ (NPM RUN BUILD)
echo ==============================================================================
echo.
cd /d "%~dp0"
call npm run build
echo.
if errorlevel 1 (
    color 0C
    echo [ERROR] La compilació ha fallat amb errors.
) else (
    color 0A
    echo [OK] Compilació completada amb zero errors de TypeScript.
)
echo.
pause
color 0B
goto MENU

:OPEN_VERCEL
echo.
echo Obrint URL permanent de Vercel Producció...
start https://bancactiu-prova-intrusio.vercel.app
goto MENU

:OPEN_HONEYPOT
echo.
echo Obrint Pantalla Trampa Honeypot (Gatets i Coches Chocones)...
start https://bancactiu-prova-intrusio.vercel.app/honeypot
goto MENU

:OPEN_INTRUSIONS
echo.
echo Obrint Monitor d'Intrusions i IPs en Temps Real...
start https://bancactiu-prova-intrusio.vercel.app/security/intrusions
goto MENU

:INSTRUCTIONS
cls
echo ==============================================================================
echo    INSTRUCCIONS DE GITHUB I DESPLEGAMENT A VERCEL
echo ==============================================================================
echo.
echo 1. REPOSITORI DE GITHUB:
echo    - URL: https://github.com/bartcatmo-rgb/bancactiu-prova-intrusio
echo    - Comanda per actualitzar:
echo        git add .
echo        git commit -m "update: notes de canvi"
echo        git push origin main
echo.
echo 2. DESPLEGAMENT A VERCEL:
echo    - URL Producció: https://bancactiu-prova-intrusio.vercel.app
echo    - Comanda per desplegar a producció:
echo        vercel --prod --yes
echo.
echo 3. CONTROL D'ACCÉS AL MONITOR D'IPS:
echo    - Ruta: /security/intrusions
echo    - Pregunta de seguretat: "¿Qué pasó el 22 de abril de 1996?"
echo    - Resposta acceptada (flexible): "Comencé a salir con María Ángeles"
echo.
echo 4. TRAMPA HONEYPOT:
echo    - Ruta: /honeypot
echo    - Mostra 3 segons de gatets animats i salta a pantalla completa.
echo.
echo ==============================================================================
pause
goto MENU

:CLEAN_ENV
cls
echo ==============================================================================
echo    NETEJA DE NODE_MODULES I .NEXT PER A DISTRIBUCIÓ
echo ==============================================================================
echo.
echo S'estan eliminant les carpetes pesades de caché i dependències...
cd /d "%~dp0"

if exist "node_modules" (
    echo - Eliminant node_modules arrel...
    rmdir /s /q "node_modules" 2>nul
)
if exist "apps\bancactiu-nexus\node_modules" (
    echo - Eliminant apps/bancactiu-nexus/node_modules...
    rmdir /s /q "apps\bancactiu-nexus\node_modules" 2>nul
)
if exist "apps\bancactiu-nexus\.next" (
    echo - Eliminant apps/bancactiu-nexus/.next...
    rmdir /s /q "apps\bancactiu-nexus\.next" 2>nul
)
if exist ".vercel" (
    echo - Eliminant .vercel...
    rmdir /s /q ".vercel" 2>nul
)
if exist ".turbo" (
    echo - Eliminant .turbo...
    rmdir /s /q ".turbo" 2>nul
)

echo.
echo [OK] Neteja finalitzada amb èxit! El directori és llest per empaquetar en ZIP.
echo.
pause
goto MENU

:EXIT_APP
exit
