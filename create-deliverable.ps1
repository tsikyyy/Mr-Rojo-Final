@echo off
REM Script de création du livrable final (Windows)
REM Usage: create-deliverable.ps1

setlocal enabledelayedexpansion

echo.
echo 📦 Garage Premium - Createur de Livrable
echo =========================================
echo.

REM Vérification PowerShell >= 5.0
powershell -version 5.0 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Warning: PowerShell 5.0+ necessary
)

REM Créer le filename avec timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set ZIP_NAME=garage-premium-LIVRABLE_%mydate%_%mytime%.zip

echo 📅 Date: %mydate% %mytime%
echo 📦 Fichier: %ZIP_NAME%
echo.

REM Vérification que nous sommes dans le bon répertoire
if not exist "README.md" (
    echo ❌ Erreur: Fichier README.md non trouvé
    echo    Lancer ce script depuis la racine du projet
    pause
    exit /b 1
)

if not exist "garage-web" (
    echo ❌ Erreur: Répertoire garage-web non trouvé
    pause
    exit /b 1
)

echo 🔍 Verification des fichiers essentiels...

REM Vérification des fichiers
for %%f in (README.md INSTRUCTIONS_DOCKER.md POSTMAN_COLLECTION.json TODO_AFFECTATION.md MANIFEST.txt) do (
    if not exist "%%f" (
        echo ❌ Fichier manquant: %%f
        pause
        exit /b 1
    )
)

for /d %%d in (garage-web garage-mobile garage-godot) do (
    if not exist "%%d" (
        echo ❌ Répertoire manquant: %%d
        pause
        exit /b 1
    )
)

echo ✅ Tous les fichiers essentiels sont presents
echo.

echo 🗜️  Creation du ZIP...
echo    Exclusions:
echo      - node_modules/
echo      - vendor/
echo      - .git/
echo      - dist/
echo      - build/
echo      - .env
echo.

REM Pour créer le ZIP, utiliser PowerShell
powershell -Command ^
    "$include = @('README.md','INSTRUCTIONS_DOCKER.md','POSTMAN_COLLECTION.json','TODO_AFFECTATION.md','MANIFEST.txt','build-apk.ps1','garage-web','garage-mobile','garage-godot','.gitignore');" ^
    "$exclude = @('node_modules','vendor','.git','dist','build','.env','*.log','*.apk','.DS_Store');" ^
    "& { ^
        if (Test-Path '!ZIP_NAME!') { Remove-Item '!ZIP_NAME!' }; ^
        Write-Host 'Compress-Archive en cours...'; ^
        Compress-Archive -Path $include[0] -DestinationPath '!ZIP_NAME!' -Force; ^
        foreach ($item in $include[1..9]) { ^
            if (Test-Path $item) { ^
                Compress-Archive -Path $item -Update -DestinationPath '!ZIP_NAME!' ^
            } ^
        } ^
    }" 

if %ERRORLEVEL% EQU 0 (
    echo.
    for /f "usebackq" %%A in ('!ZIP_NAME!') do (set size=%%~zA)
    REM Convertir en MB
    set /a sizeMB=size / 1048576
    
    echo ✅ ZIP cree avec succes!
    echo.
    echo 📊 Informations:
    echo    Nom: !ZIP_NAME!
    echo    Taille: %sizeMB% MB
    echo.
    echo 📋 Contenu:
    echo    - Codes sources complets
    echo    - Documentation Docker
    echo    - Collection Postman
    echo    - Tableau de bord taches
    echo    - Scripts de build APK
    echo.
    echo ⚠️  N'oubliez pas post-deploiement:
    echo    npm install ^(garage-mobile^)
    echo    composer install ^(garage-web/backend^)
    echo    docker-compose up -d ^(garage-web/backend^)
    echo.
    echo ==========================================
    echo 🎉 Livrable pret: !ZIP_NAME!
    echo ==========================================
) else (
    echo ❌ Erreur lors de la creation du ZIP
    pause
    exit /b 1
)

pause
