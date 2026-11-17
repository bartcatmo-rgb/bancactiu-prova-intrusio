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
echo    [1] TREBALLAR EN LOCAL (Instal·lar dependències i arrencar servidor)
echo    [2] DESPLEGAR AL NÚVOL (Credencials i passos de GitHub / Vercel)
echo    [0] Sortir
echo.
echo ==============================================================================
set /p opcio="Tria una opció [1, 2 o 0]: "

if "%opcio%"=="1" goto LOCAL_DEV
if "%opcio%"=="2" goto CLOUD_DEPLOY
if "%opcio%"=="0" goto EXIT_APP

echo.
echo [!] Opció no vàlida. Si us plau, tria 1, 2 o 0.
timeout /t 2 >nul
goto MENU

:LOCAL_DEV
cls
echo ==============================================================================
echo    [1] TREBALLAR EN LOCAL - BANCACTIU 3.0 PROVA INTRUSIÓ
echo ==============================================================================
echo.
cd /d "%~dp0"

if not exist "node_modules" (
    echo [1/2] Instal·lant dependències inicials (npm install)...
    echo       Això pot trigar uns minuts la primera vegada...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] La instal·lació de dependències ha fallat.
        pause
        goto MENU
    )
) else (
    echo [1/2] Dependències existents detectades a node_modules.
)

echo.
echo [2/2] Iniciant servidor de desenvolupament Next.js...
echo       El portal s'obrirà automàticament a: http://localhost:3000
echo.
start http://localhost:3000
call npm --prefix apps/bancactiu-nexus run dev
echo.
pause
goto MENU

:CLOUD_DEPLOY
cls
echo ==============================================================================
echo    [2] DESPLEGAMENT AL NÚVOL - CREDENCIALS I PASSOS (GITHUB / VERCEL)
echo ==============================================================================
echo.
echo  ==========================================================================
echo   CREDENCIALS DEL LABORATORI DE CIBERSEGURETAT
echo  ==========================================================================
echo   - Correu:                 bancactiu.labs@gmail.com
echo   - Contrasenya compartida: Bancactiuprovaintrusio2026
echo   - GitHub User / Repo:     bancactiulabs-prova-intrusio
echo   - Vercel Compte / URL:    bancactiulabs-9745 (login via GitHub)
echo  ==========================================================================
echo.
echo  PAS 1: CONNEXIÓ I PUJADA A GITHUB
echo  --------------------------------------------------------------------------
echo   1. Obre el navegador i entra a https://github.com/login
echo   2. Inicia sessió amb les credencials del laboratori:
echo        Usuari / Correu: bancactiu.labs@gmail.com
echo        Contrasenya:     Bancactiuprovaintrusio2026
echo   3. Assegura't de tenir creat el repositori:
echo        'bancactiulabs-prova-intrusio'
echo   4. Des del terminal en aquesta carpeta, executa:
echo        git add .
echo        git commit -m "feat: desplegament inicial laboratori intrusio"
echo        git branch -M main
echo        git remote set-url origin https://github.com/bancactiu-labs/bancactiulabs-prova-intrusio.git
echo        git push -u origin main
echo.
echo  PAS 2: VINCULACIÓ I DESPLEGAMENT A VERCEL
echo  --------------------------------------------------------------------------
echo   1. Obre https://vercel.com/login
echo   2. Selecciona l'opció "Continue with GitHub" utilitzant el compte del laboratori.
echo   3. Un cop a dins del compte 'bancactiulabs-9745':
echo        - Fes clic a "Add New..." -^> "Project".
echo        - Importa el repositori 'bancactiulabs-prova-intrusio'.
echo        - Framework Preset: Next.js (detectat automàticament).
echo        - Fes clic al botó blau "Deploy".
echo   4. Alternativament per línia de comandes (CLI):
echo        npx vercel login
echo        npx vercel --prod
echo.
echo ==============================================================================
echo.
echo    [A] Obrir GitHub al navegador (https://github.com/login)
echo    [B] Obrir Vercel al navegador (https://vercel.com/login)
echo    [T] Tornar al menú principal
echo.
set /p subopcio="Tria una acció [A, B o T]: "

if /i "%subopcio%"=="A" (
    start https://github.com/login
    goto CLOUD_DEPLOY
)
if /i "%subopcio%"=="B" (
    start https://vercel.com/login
    goto CLOUD_DEPLOY
)
goto MENU

:EXIT_APP
exit
