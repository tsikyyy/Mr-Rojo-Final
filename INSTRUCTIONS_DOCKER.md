# 🐳 Instructions de Lancement avec Docker

Ce projet comprend trois applications: une API backend (Laravel), une application mobile (React Native) et un jeu (Godot).

## 📋 Prérequis

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 18.0 (pour développement local)
- **PHP** >= 8.2 (pour développement local)

---

## 🚀 Lancement Rapide avec Docker Compose

### 1. **Backend (Laravel API)**

```bash
cd garage-web/backend

# Construire les images
docker-compose build

# Lancer les services
docker-compose up -d

# Initialiser la base de données
docker-compose exec app php artisan migrate:fresh --seed

# Les services seront disponibles:
# - API: http://localhost:8000
# - MySQL: localhost:3306
# - Adminer: http://localhost:8080
```

### 2. **Application Mobile (React Native)**

#### Option A: Développement local
```bash
cd garage-mobile

# Installation des dépendances
npm install

# Lancer le serveur Expo
npm start

# Sur Android/iOS:
npm run android
npm run ios
```

#### Option B: Générer l'APK (Android)
```bash
cd garage-mobile

# Installation
npm install
npx eas build --platform android --local

# L'APK sera généré dans: ./dist/
```

### 3. **Jeu Godot**

```bash
cd garage-godot

# Ouvrir dans l'éditeur Godot
# - Ouvrir Godot 4.x
# - Importer le projet depuis cette dossier
# - Cliquer sur "Play" pour tester
```

---

## 🐳 Services Docker Détaillés

### Architecture Backend

```yaml
Services:
  - app: PHP 8.2-FPM (Laravel)
  - web: Nginx (Reverse Proxy)
  - db: MySQL 8.0 (Base de données)
  - adminer: Interface de gestion DB
  - redis: Caching (optionnel)
```

### Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f app

# Accéder au shell PHP
docker-compose exec app bash

# Accéder à MySQL
docker-compose exec db mysql -u laravel -psecret garage_db

# Arrêter les services
docker-compose down

# Supprimer tous les volumes
docker-compose down -v
```

---

## 📱 Configuration API

La configuration Docker utilise:

- **DB_HOST**: db (nom du service Docker)
- **DB_USER**: laravel
- **DB_PASSWORD**: secret
- **DB_NAME**: garage_db
- **Port API**: 8000
- **Port MySQL**: 3306

### Variables d'environnement

Créer un fichier `.env` dans `garage-web/backend`:

```env
APP_NAME=GaragePremium
APP_ENV=local
APP_KEY=base64:xxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=garage_db
DB_USERNAME=laravel
DB_PASSWORD=secret

FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
```

---

## 🔗 Routes API Principales

Pour tester les endpoints, voir **collection Postman** fournie.

```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion
GET    /api/user                   - Profil utilisateur
POST   /api/cars                   - Ajouter voiture
GET    /api/cars                   - Liste voitures
GET    /api/cars/{id}              - Détail voiture
PUT    /api/cars/{id}              - Modifier voiture
DELETE /api/cars/{id}              - Supprimer voiture
```

---

## ✅ Checklist de Déploiement

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` configuré
- [ ] `docker-compose up -d` exécuté
- [ ] Migrations appliquées
- [ ] Collection Postman importée
- [ ] Tests API validés
- [ ] Frontend/Mobile configuré pour pointer `/localhost:8000`

---

## 🐛 Dépannage

### "Port 8000 already in use"
```bash
# Changer le port dans docker-compose.yml
# ou tuer le processus
lsof -i :8000
kill -9 <PID>
```

### "Connection refused on localhost:3306"
```bash
# Vérifier que MySQL est lancé
docker-compose ps

# Relancer les services
docker-compose restart db
```

### Migrations échouent
```bash
# Vérifier les logs
docker-compose logs app

# Se connecter et relancer
docker-compose exec app php artisan migrate --force
```

---

## 📦 Structure de Fichiers

```
garage-web/
├── backend/
│   ├── docker-compose.yml       # Config Docker
│   ├── nginx/
│   ├── docker/
│   └── app/
├── frontend/
└── README.md

garage-mobile/
├── src/
├── package.json
└── app.json

garage-godot/
├── project.godot
├── scenes/
└── scripts/
```

---

## 📞 Support

Pour toute question, consulter:
- [Laravel Docs](https://laravel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Expo Docs](https://docs.expo.dev)
