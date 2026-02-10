@echo off
REM Script de génération de l'APK Android (Windows)
REM Usage: .\build-apk.ps1

setlocal enabledelayedexpansion

echo.
echo 🚀 Garage Premium - Generateur APK Android
echo ==========================================
echo.

REM Vérification Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js non trouvé. Installez Node.js ^>= 18
    pause
    exit /b 1
)

REM Navigation vers le répertoire mobile
cd garage-mobile || (
    echo ❌ Erreur: répertoire garage-mobile non trouvé
    pause
    exit /b 1
)

REM Installation des dépendances
echo [1/5] Installation des dépendances...
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erreur lors de l'installation npm
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules déjà présent
)

REM Installation de EAS CLI
echo [2/5] Installation de EAS CLI...
call npm install -g eas-cli
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'installation EAS CLI
    pause
    exit /b 1
)
echo ✅ EAS CLI installé

REM Configuration EAS
echo [3/5] Configuration EAS...
if not exist "eas.json" (
    echo Création du fichier eas.json...
    (
        echo {
        echo   "cli": {
        echo     "version": "^>= 5.0.0"
        echo   },
        echo   "build": {
        echo     "production": {
        echo       "android": {
        echo         "buildType": "apk"
        echo       }
        echo     },
        echo     "preview": {
        echo       "android": {
        echo         "buildType": "apk"
        echo       }
        echo     }
        echo   }
        echo }
    ) > eas.json
    echo ✅ eas.json créé
) else (
    echo ✅ eas.json déjà présent
)

REM Build APK
echo [4/5] Construction de l'APK...
echo Lancement du build EAS local...
call eas build --platform android --local

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo ✅ APK généré avec succès!
    echo ==========================================
    echo.
    echo 📱 Fichier APK disponible dans:
    echo    build\android\ ou dist\
    echo.
    echo Prêt à l'installation sur un appareil Android:
    echo    adb install -r ^<fichier.apk^>
) else (
    echo.
    echo Méthode alternative: Build en ligne
    echo 1. Créer un compte sur https://eas.expo.dev
    echo 2. Lancer: eas login
    echo 3. Relancer ce script
)

pause
