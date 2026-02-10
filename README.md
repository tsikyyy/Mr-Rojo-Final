# 🚗 Garage Premium - Projet Complet

**Plateforme de gestion de réparations automobiles** | React Native + Laravel + Godot

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

---

## 👀 Vue d'Ensemble

**Garage Premium** est une solution complète de gestion de réparations automobiles composée de:

### 📱 **Frontend Mobile** (React Native + Expo)
- Authentification utilisateur sécurisée
- Gestion des véhicules et réparations
- Suivi des paiements
- Notifications en temps réel
- Interface responsive

### 🔧 **Backend API** (Laravel + MySQL)
- RESTful API avec authentification JWT
- CRUD complet (Véhicules, Réparations, Paiements)
- Gestion des utilisateurs et autorisation
- Firebase Integration
- Docker ready

### 🎮 **Jeu Godot** (2D Game)
- Interface de jeu bonus
- Intégration assets
- Godot Engine 4.x

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND (React Native)         │
│    Expo | TypeScript | React Navigation│
└──────────────────┬──────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────┐
│    BACKEND API (Laravel + Sanctum)      │
│  RESTful | JWT Auth | Firebase | MySQL  │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    MySQL DB          Firebase/Storage
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js >= 18
- PHP >= 8.2 (optionnel avec Docker)

### En 3 Commandes

```bash
# 1. Cloner et naviguer
git clone <repo>
cd garage-premium

# 2. Lancer le backend
cd garage-web/backend
docker-compose up -d
docker-compose exec app php artisan migrate:fresh --seed

# 3. Lancer le frontend
cd ../../garage-mobile
npm install
npm start
```

**API disponible:** `http://localhost:8000`
**Frontend:** Scanner QR Expo pour mobile

---

## 📁 Structure du Projet

```
garage-premium/
│
├── 🔧 garage-web/
│   └── backend/
│       ├── app/              # Controllers, Models, Requests
│       ├── routes/           # API routes
│       ├── database/         # Migrations, Factories, Seeders
│       ├── config/           # Configurations
│       ├── docker-compose.yml
│       └── README.md
│
├── 📱 garage-mobile/
│   ├── src/
│   │   ├── screens/          # Screens React Native
│   │   ├── components/       # Réusable components
│   │   ├── services/         # API calls (auth.ts, api.ts)
│   │   ├── contexts/         # Context API (Theme, Auth)
│   │   └── types/            # TypeScript interfaces
│   ├── App.tsx
│   ├── package.json
│   └── app.json
│
├── 🎮 garage-godot/
│   ├── scenes/               # Game scenes
│   ├── scripts/              # GDScript
│   ├── assets/               # Images, audio
│   └── project.godot
│
├── 📚 INSTRUCTIONS_DOCKER.md # Setup guide complet
├── 📋 TODO_AFFECTATION.md    # Tableau de bord tâches
├── 📬 POSTMAN_COLLECTION.json # Tests API
└── README.md                 # Ce fichier

```

---

## 💾 Installation

### Backend (Laravel API)

```bash
cd garage-web/backend

# Avec Docker (recommandé)
docker-compose build
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh --seed

# Sans Docker (local)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### Frontend (React Native)

```bash
cd garage-mobile

# Installation
npm install

# Développement
npm start

# Pour Android
npm run android

# Pour iOS
npm run ios

# Générer APK
npx eas build --platform android --local
```

### Godot

```bash
cd garage-godot

# Ouvrir dans Godot 4.x editor
# Cliquer Play ou F5
```

---

## 🔐 Configuration API

### Variables d'environnement (.env)

```env
APP_NAME=GaragePremium
APP_URL=http://localhost:8000
APP_DEBUG=true

DB_HOST=db
DB_DATABASE=garage_db
DB_USERNAME=laravel
DB_PASSWORD=secret

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001
```

### Endpoints Principaux

```
POST   /api/auth/register              Inscription
POST   /api/auth/login                 Connexion
GET    /api/user                       Profil utilisateur

GET    /api/cars                       Liste véhicules
POST   /api/cars                       Ajouter véhicule
GET    /api/cars/{id}                  Détails véhicule
PUT    /api/cars/{id}                  Modifier véhicule
DELETE /api/cars/{id}                  Supprimer véhicule

GET    /api/repairs                    Liste réparations
POST   /api/repairs                    Nouvelle réparation
PUT    /api/repairs/{id}               Mettre à jour réparation

GET    /api/payments                   Historique paiements
POST   /api/payments                   Créer paiement
```

*Voir [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json) pour tous les endpoints*

---

## 📚 Documentation

### Guides Complets
- **[Docker Setup](INSTRUCTIONS_DOCKER.md)** - Lancer avec Docker
- **[API Documentation](garage-web/backend/README.md)** - Documentation backend
- **[Mobile Setup](garage-mobile/README.md)** - Configuration mobile
- **[Tasks & Affectations](TODO_AFFECTATION.md)** - Tableau de bord

### Collections
- **Postman:** [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json) - Importer dans Postman

### Getting Help
```bash
# Voir les logs
docker-compose logs -f app

# Exécuter migrations
docker-compose exec app php artisan migrate

# Seeder données test
docker-compose exec app php artisan db:seed
```

---

## 🧪 Tests

### Backend
```bash
cd garage-web/backend

# PHPUnit tests
php artisan test

# Feature tests
php artisan test --testsuite=Feature

# Unit tests
php artisan test --testsuite=Unit
```

### Frontend
```bash
cd garage-mobile

# Jest tests
npm test

# E2E (optionnel)
npm run test:e2e
```

---

## 🐛 Troubleshooting

### "Port 8000 already in use"
```bash
# Option 1: Utiliser un autre port
docker-compose up -d -p 8001:80

# Option 2: Tuer le processus
lsof -i :8000
kill -9 <PID>
```

### "Connection refused - MySQL"
```bash
# Vérifier le statut
docker-compose ps

# Redémarrer MySQL
docker-compose restart db

# Attendre et relancer migrations
sleep 5 && docker-compose exec app php artisan migrate
```

### "npm install fails"
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### "Expo connection error"
```bash
# Assurer que le serveur expo tourne
npm start

# Si encore d'erreurs:
npm start --clear
```

---

## 📱 Générer l'APK

```bash
cd garage-mobile

# Méthode EAS (recommandé)
npx eas build --platform android

# Méthode locale
npm install -g eas-cli
eas build --platform android --local

# L'APK sera dans build/
```

---

## 📦 Packaging pour Livraison

```bash
# Créer le ZIP sans dépendances
zip -r garage-premium-LIVRABLE.zip \
  garage-web \
  garage-mobile \
  garage-godot \
  INSTRUCTIONS_DOCKER.md \
  POSTMAN_COLLECTION.json \
  TODO_AFFECTATION.md \
  README.md \
  --exclude="*/node_modules/*" \
  --exclude="*/vendor/*" \
  --exclude="*/.git/*" \
  --exclude="*/dist/*"
```

---

## 👥 Équipe

| Rôle | Développeur |
|------|------------|
| Full Stack | ETU3637 |

---

## 📄 License

MIT License - Voir LICENSE pour détails

---

## 📞 Support

**Documentation complète:** [INSTRUCTIONS_DOCKER.md](INSTRUCTIONS_DOCKER.md)
**Postman Collection:** [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json)
**Tableau de bord:** [TODO_AFFECTATION.md](TODO_AFFECTATION.md)

---

**Dernière mise à jour:** 10 Février 2026
**Status:** ✅ Production Ready
