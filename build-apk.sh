#!/bin/bash

# Script de génération de l'APK Android
# Usage: ./build-apk.sh

set -e

echo "🚀 Garage Premium - Générateur APK Android"
echo "==========================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifications préalables
echo -e "${YELLOW}[1/5]${NC} Vérification des prérequis..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non trouvé. Installez Node.js >= 18${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm non trouvé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis OK${NC}"

# Navigation vers le répertoire mobile
cd garage-mobile || exit 1

# Installation des dépendances
echo -e "${YELLOW}[2/5]${NC} Installation des dépendances..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "node_modules déjà présent, passage..."
fi
echo -e "${GREEN}✅ Dépendances installées${NC}"

# Installation de EAS CLI
echo -e "${YELLOW}[3/5]${NC} Installation de EAS CLI..."
npm install -g eas-cli
echo -e "${GREEN}✅ EAS CLI installé${NC}"

# Configuration EAS (optionnel)
echo -e "${YELLOW}[4/5]${NC} Configuration EAS..."
if [ ! -f "eas.json" ]; then
    echo "Création du fichier eas.json..."
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "api-xxx.json",
        "track": "production"
      }
    }
  }
}
EOF
    echo -e "${GREEN}✅ eas.json créé${NC}"
else
    echo -e "${GREEN}✅ eas.json déjà présent${NC}"
fi

# Build APK
echo -e "${YELLOW}[5/5]${NC} Construction de l'APK..."
echo "Méthode 1: Build local (sans compte EAS)"
eas build --platform android --local

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ APK généré avec succès!${NC}"
    echo ""
    echo "📱 Fichier APK disponible dans:"
    echo "   build/android/ ou dist/"
    echo ""
    echo "Prêt à l'installation sur un appareil Android:"
    echo "   adb install -r <fichier.apk>"
else
    echo ""
    echo "Méthode 2: Build en ligne (nécessite compte EAS)"
    echo "   1. Créer un compte sur https://eas.expo.dev"
    echo "   2. Lancer: eas login"
    echo "   3. Relancer ce script"
    exit 1
fi

echo ""
echo "==========================================="
echo -e "${GREEN}✅ Processus terminé!${NC}"
echo "==========================================="
