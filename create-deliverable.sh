#!/bin/bash

# Script de création du livrable final
# Usage: bash create-deliverable.sh

set -e

echo "📦 Garage Premium - Créateur de Livrable"
echo "========================================"

DATE=$(date +%Y%m%d_%H%M%S)
ZIP_NAME="garage-premium-LIVRABLE_${DATE}.zip"

echo "📅 Date: $DATE"
echo "📦 Fichier: $ZIP_NAME"
echo ""

# Vérification que nous sommes dans le bon répertoire
if [ ! -f "README.md" ] || [ ! -d "garage-web" ]; then
    echo "❌ Erreur: Lancer ce script depuis la racine du projet"
    echo "   Racine attendue: $(basename $(pwd))"
    exit 1
fi

echo "🔍 Vérification des fichiers essentiels..."

REQUIRED_FILES=(
    "README.md"
    "INSTRUCTIONS_DOCKER.md"
    "POSTMAN_COLLECTION.json"
    "TODO_AFFECTATION.md"
    "MANIFEST.txt"
    ".gitignore"
    "garage-web/backend"
    "garage-mobile"
    "garage-godot"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ Fichier manquant: $file"
        exit 1
    fi
done

echo "✅ Tous les fichiers essentiels sont présents"
echo ""

echo "🗜️  Création du ZIP..."
echo "   Exclusions:"
echo "     - node_modules/"
echo "     - vendor/"
echo "     - .git/"
echo "     - dist/"
echo "     - build/"
echo "     - .env (local)"
echo ""

# Créer le ZIP
zip -r "$ZIP_NAME" \
    README.md \
    INSTRUCTIONS_DOCKER.md \
    POSTMAN_COLLECTION.json \
    TODO_AFFECTATION.md \
    MANIFEST.txt \
    build-apk.sh \
    build-apk.ps1 \
    .gitignore \
    garage-web \
    garage-mobile \
    garage-godot \
    -x "*/node_modules/*" \
    "*/vendor/*" \
    "*/.git/*" \
    "*/dist/*" \
    "*/build/*" \
    "*/.env.local" \
    "*/.DS_Store" \
    "*.log" \
    "*.apk" \
    > /dev/null 2>&1

if [ $? -eq 0 ]; then
    SIZE=$(du -h "$ZIP_NAME" | cut -f1)
    
    echo "✅ ZIP créé avec succès!"
    echo ""
    echo "📊 Informations:"
    echo "   Nom: $ZIP_NAME"
    echo "   Taille: $SIZE"
    echo ""
    echo "📋 Contenu:"
    echo "   - Codes sources complets"
    echo "   - Documentation Docker"
    echo "   - Collection Postman"
    echo "   - Tableau de bord tâches"
    echo "   - Scripts de build APK"
    echo ""
    echo "⚠️  N'oubliez pas les commandes post-déploiement:"
    echo "   npm install (dans garage-mobile)"
    echo "   composer install (dans garage-web/backend)"
    echo "   docker-compose up -d (dans garage-web/backend)"
    echo ""
    echo "=========================================="
    echo "🎉 Livrable prêt: $ZIP_NAME"
    echo "=========================================="
else
    echo "❌ Erreur lors de la création du ZIP"
    exit 1
fi
