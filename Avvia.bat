@echo off
setlocal enabledelayedexpansion
title Freeshape
cd /d "%~dp0"

where node >nul 2>nul
if not %errorlevel%==0 (
    echo.
    echo  Node.js non e' installato ^(o non e' nel PATH^).
    echo.
    set /p INSTALLA="Vuoi che lo installi ora automaticamente? (S/N): "
    if /i "!INSTALLA!"=="S" call :install_node

    where node >nul 2>nul
    if not !errorlevel!==0 (
        echo.
        echo  Non sono riuscito a installarlo automaticamente ^(o hai risposto N^).
        echo  Scaricalo da: https://nodejs.org/ ^(versione LTS^), poi rilancia questo file.
        echo.
        pause
        exit /b 1
    )
    echo Node.js installato. Potrebbe servire riaprire questo file se non viene trovato subito.
)

if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        echo.
        echo  Manca il file .env ^(chiave API necessaria per generare i contenuti^).
        echo  Copio .env.example in .env: apri .env e inserisci la tua chiave prima di continuare.
        copy "%~dp0.env.example" "%~dp0.env" >nul
        notepad "%~dp0.env"
    )
)

if not exist "%~dp0node_modules" (
    echo Installo le dipendenze ^(solo la prima volta, puo' richiedere qualche minuto^)...
    call npm install
    if not !errorlevel!==0 (
        echo Installazione dipendenze non riuscita.
        pause
        exit /b 1
    )
)

echo Avvio Freeshape su http://localhost:3000 ...
start "" http://localhost:3000
call npm run dev
pause
exit /b

:install_node
where winget >nul 2>nul
if %errorlevel%==0 (
    echo Installo Node.js LTS con winget, un momento...
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    exit /b
)
echo winget non disponibile: apro la pagina di download di Node.js...
start "" https://nodejs.org/
exit /b
