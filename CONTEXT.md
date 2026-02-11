# 📋 CONTEXT.md - Garage Premium Project Reference

**Date:** Février 2026 | **Statut Global:** 92% ✅ | **Équipe:** ETU3637, ETU3616, ETU3603, ETU3513

---

## 🎯 Vue d'Ensemble du Projet

**Garage Premium** est une plateforme complète de gestion de réparations automobiles avec:
- 📱 Application Mobile (React Native + Expo)
- 🔧 API Backend (Laravel 12 + MySQL + Docker)
- 🎮 Jeu 2D (Godot 4.6)
- 🌐 Frontend Web (React + TypeScript + Vite)

**Thème:** Simulation de garage automobile
- Users décrivent les pannes via l'app mobile
- Le jeu HTML permet de réparer les voitures
- L'app web permet aux administrateurs de gérer les interventions et statistiques

---

## 📊 Architecture Générale

```
┌─────────────────────────────────────────────┐
│    UTILISATEURS (Mobile App)                │
│  React Native + Expo + TypeScript           │
└──────────────┬──────────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────────┐
│    BACKEND API (Laravel)                    │
│  Laravel 12 + Sanctum JWT + MySQL           │
│  Docker Compose (php-fpm + nginx)           │
└──────────────┬──────────────────────────────┘
       ┌───────┴───────────────────┐               ▲
       │                           │               │ HTTP/REST API
   MySQL DB               Firebase/Sync            │
                         (config existant)         │
                                                   │
┌─────────────────────────────────────────────┐    │
│    ADMIN BACKOFFICE (Web App)               │────┘
│  React 19 + TypeScript + Vite + Tailwind    │
│  Dashboard + Gestion interventions (CRUD)   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│    JEU HTML (À EXPORTER)                    │
│  Godot 4.6 → Export HTML5                   │
│  Réparations interactives                   │
└─────────────────────────────────────────────┘
```

---

## ✅/❌ État Actuel de Chaque Composant

### 1. **BACKEND - LARAVEL (90% ✅)**

| Élément | État | Détails |
|---------|------|---------|
| **Framework** | ✅ | Laravel 12, Sanctum JWT, MySQL |
| **Docker** | ✅ | docker-compose.yml configuré (php-fpm + nginx) |
| **Base de Données** | ✅ | 9 migrations + 6 modèles (User, Voiture, Intervention, TypeReparation, SlotGarage, Categorie) |
| **API REST** | ✅ | Routes complètes (auth, CRUD voitures/interventions) |
| **Authentification** | ✅ | Login/Register avec Sanctum JWT |
| **Autorisation** | ⏳ | Policies à implémenter (45min estimé) |
| **Firebase Config** | ✅ | Fichier config/firebase.php exists mais pas intégré |

**Fichiers clés:**
- `routes/api.php` - Endpoints API
- `app/Models/` - Eloquent Models (6 fichiers)
- `database/migrations/` - 13 migrations
- `app/Http/Controllers/` - Controllers (Auth + CRUD)
- `docker-compose.yml` - Orchestration

**Manquements:**
- ⚠️ Policies d'autorisation (admin/user distinction)
- ⚠️ Firebase Cloud Messaging non intégré
- ⚠️ Synchronisation Firestore mock

---

### 2. **MOBILE - REACT NATIVE (66% ✅)**

| Élément | État | Détails |
|---------|------|---------|
| **Framework** | ✅ | React Native 0.81.5 + Expo 54.0.32 + TypeScript |
| **Authentification** | ✅ | Login/Register 95% (mot de passe oublié TODO) |
| **Gestion Véhicules** | ✅ | Liste, détail, ajout (API-ready) |
| **Réparations** | ✅ | 8 types de réparations créés + prix/durée |
| **Notifications UI** | ✅ | Écrans créés (UserNotificationScreen) |
| **Notifications FCM** | ❌ | Firebase Cloud Messaging NON implémenté |
| **Paiements** | ✅ | UI créée (formulaire + historique) |
| **Admin Dashboard** | ✅ | Écran créé (AdminDashboardScreen) |
| **Design/Thème** | ✅ | Thème bleu premium + dark mode context |

**Fichiers clés:**
- `src/screens/` - 16 screens (Login, CarList, Payment, Notifications, etc.)
- `src/services/auth.ts` - Services d'authentification
- `src/contexts/ThemeContext.tsx` - Gestion du thème
- `package.json` - Dépendances

**Manquements:**
- ❌ Firebase Cloud Messaging (180min estimé)
- ❌ Photos des pannes (120min)
- ❌ Devis PDF (90min)
- ⏳ Historique complet des réparations

---

### 3. **GODOT - JEU 2D (10% ✅)**

| Élément | État | Détails |
|---------|------|---------|
| **Projet Godot** | ✅ | 4.6 avec scenes/scripts de base |
| **Sprites/Assets** | ✅ | Icon.svg + Background.png importés |
| **Logique Gameplay** | ✅ | Player 2D + Input mappées (Haut/Bas/Gauche/Droite) |
| **Export HTML5** | ❌ | MANQUANT - Pas configuré |
| **Intégration API** | ❌ | Pas de connection au backend |

**Fichiers clés:**
- `project.godot` - Configuration projet
- `scenes/` - Scenes (Main.tscn, Car.tscn, RepairUI.tscn, etc.)
- `scripts/player_test.gd` - GDScript basique
- `assets/` - Images et sprites

**Manquements:**
- ❌ Configuration export HTML5
- ❌ Communication avec l'API backend
- ❌ Interface de réparation fonctionnelle
- ❌ Système de progressions/scores

---

### 4. **FRONTEND WEB BACKOFFICE (100% ✅)**

| Élément | État | Détails |
|---------|------|----------|
| **Framework** | ✅ | React 19.2.0 + TypeScript 5.9 + Vite 7.3 |
| **Build System** | ✅ | Vite + React Router 7 |
| **Styling** | ✅ | Tailwind CSS v4 + PostCSS |
| **HTTP Client** | ✅ | Axios avec interceptors auth |
| **Auth Context** | ✅ | useAuth() hook + AuthProvider |
| **Routes Setup** | ✅ | 6 pages (Login, Dashboard, Interventions, Voitures, Statistics, Public) |
| **Login Page** | ✅ | Formulaire + validation + API integration |
| **API Service** | ✅ | api.ts avec tous les endpoints implémentés |
| **ProtectedRoute** | ✅ | Route guard avec token JWT |
| **Dashboard UI** | ✅ | Tableau de bord professionnel + 4 KPI cards + sidebar navigation |
| **CRUD Interventions** | ✅ | Tableau complet + Modal form + Statut color-coded |
| **CRUD Voitures** | ✅ | Tableau + Modal form + Filtrage par statut |
| **Statistiques Page** | ✅ | 4 KPI cards + Distribution charts + Visualisation |
| **Icons** | ✅ | lucide-react intégré (22 icons utilisés) |
| **Page Publique** | ✅ | FrontOffice "Atelier en Direct" (sans login) |

**Fichiers créés/modifiés:**
- `src/services/api.ts` - Client HTTP complet ✅
- `src/contexts/AuthContext.tsx` - Gestion auth globale ✅
- `src/pages/LoginPage.tsx` - Formulaire login fonctionnel ✅
- `src/pages/DashboardPage.tsx` - Dashboard pro avec sidebar (338 ligne) ✅
- `src/pages/InterventionsPage.tsx` - CRUD interventions complet + validation (400+ lignes) ✅
- `src/pages/VoituresPage.tsx` - CRUD voitures avec filtrage (350+ lignes) ✅
- `src/pages/StatisticsPage.tsx` - Statistiques avec graphiques corrigés (380+ lignes) ✅
- `src/pages/PublicAtelierPage.tsx` - Vue publique liste réparations ✅
- `src/components/ProtectedRoute.tsx` - Route guard ✅
- `src/types/index.ts` - Interfaces TypeScript centralisées (import type only) ✅
- `src/App.tsx` - Router configuration (Routes publiques ajoutées) ✅
- `.env` - Configuration API ✅
- `package.json` - Dépendances (lucide-react ajouté) ✅

**Features implémentées:**
- ✅ Authentification JWT complète
- ✅ Dashboard avec KPI temps réel
- ✅ Gestion CRUD interventions (Create/Read/Update/Delete) + Correction 422/500 erreurs
- ✅ Gestion CRUD voitures (Create/Read/Update/Delete + filtrage)
- ✅ Statuts color-codés (en_attente=orange, en_reparation=blue, terminee=green, payee=purple)
- ✅ Sidebar navigation collapsible
- ✅ Modals pour créer/éditer (avec gestion formulaires et dates)
- ✅ Confirmations avant suppression
- ✅ Messages d'erreur détaillés (Validation API)
- ✅ Chargement des données depuis l'API (gestion défensive des formats)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Types TypeScript stricts partout (import type)
- ✅ Page publique "Atelier en Direct" (liste filtrée en réparation/attente)

**Reste à faire:**
- ⏳ Tests utilisateurs complets
- ⏳ Intégration Firebase Cloud Messaging (optionnel)

---

## 🗄️ Structure du Projet

```
Mr-Rojo-Final/
├── garage-web/
│   └── backend/                  (Laravel API - 90% ✅)
│       ├── app/
│       │   ├── Http/Controllers/ (Auth, Voiture, Intervention, etc.)
│       │   └── Models/           (User, Voiture, TypeReparation, etc.)
│       ├── database/
│       │   ├── migrations/       (13 migrations)
│       │   └── seeders/
│       ├── routes/
│       │   └── api.php           (API endpoints)
│       ├── resources/
│       │   ├── views/            (Blade templates - basique)
│       │   └── js/               (Vite assets)
│       ├── config/firebase.php   (Firebase config - not used)
│       ├── docker-compose.yml
│       └── composer.json
│   └── frontend/                 (React 19.2 - 95% ✅)
│       ├── src/
│       │   ├── pages/              (LoginPage, DashboardPage, etc.)
│       │   ├── components/         (ProtectedRoute, etc.)
│       │   ├── services/           (api.ts avec tous endpoints)
│       │   ├── contexts/           (AuthContext.tsx)
│       │   ├── types/              (index.ts - interfaces)
│       │   └── App.tsx             (React Router setup)
│       ├── .env                    (API_URL=http://localhost:8000)
│       ├── tailwind.config.js
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── garage-mobile/                (React Native - 66% ✅)
│   ├── src/
│   │   ├── screens/              (16 screens)
│   │   ├── services/             (auth.ts, api.ts)
│   │   ├── contexts/             (ThemeContext.tsx)
│   │   └── types/                (Car.ts, Voiture.ts)
│   ├── package.json
│   └── App.tsx                   (App root)
│
├── garage-godot/                 (Godot 4.6 - 10% ✅)
│   ├── scenes/                   (Main, Car, RepairUI, etc.)
│   ├── scripts/                  (GDScript - player_test.gd)
│   ├── assets/                   (Sprites - Background.png, icon.svg)
│   ├── ui/
│   └── project.godot             (Config)
│
├── CONTEXT.md                    (Ce fichier)
├── README.md
├── TODO_AFFECTATION.md
├── POSTMAN_COLLECTION.json       (Tests API)
├── docker-compose.yml            (Global stack)
└── INSTRUCTIONS_DOCKER.md
```

---

## 🔧 Technos Utilisées

### Backend
- **Framework:** Laravel 12
- **Base de données:** MySQL 8
- **Auth:** Sanctum (JWT tokens)
- **Container:** Docker Compose (php-fpm 8.2 + nginx)
- **ORM:** Eloquent
- **Frontend:** Blade PHP + Tailwind CSS + Vite

### Mobile
- **Framework:** React Native 0.81.5
- **Runtime:** Expo 54.0
- **Langage:** TypeScript 5.9.2
- **Navigation:** React Navigation 7.1.28
- **Storage:** AsyncStorage (local)

### Jeu
- **Engine:** Godot 4.6
- **Langage:** GDScript
- **Export:** Standard 2D (HTML5 à configurer)

### Frontend Web
- ✅ **React 19.2.0** (choisi - cohérence avec mobile)

---

## 📱 Modèles de Données

### User (Utilisateurs)
```
- id (PK)
- email (unique)
- mot_de_passe (hashed)
- created_at, updated_at
```

### Voiture (Véhicules)
```
- id (PK)
- utilisateur_id (FK)
- marque
- modele
- immatriculation
- description_panne
- statut (en_attente, en_cours, termine)
- created_at, updated_at
```

### TypeReparation (Types de réparations)
```
- id (PK)
- nom (Vidange, Frein, Pneu, etc.)
- prix (en Ariary)
- duree_secondes
- created_at, updated_at
```

### Intervention (Réparations effectuées)
```
- id (PK)
- voiture_id (FK)
- type_reparation_id (FK)
- statut (en_attente, en_cours, termine)
- date_debut
- date_fin
- created_at, updated_at
```

### SlotGarage (Gestion des emplacements)
```
- id (PK)
- numero_slot (1 ou 2)
- statut (libre, occupe)
- voiture_id (FK) - nullable
- created_at, updated_at
```

### Categories (Catégories d'interventions)
```
- id (PK)
- nom
- icone
- created_at, updated_at
```

---

## 🎯 Fonctionnalités Minimales (Cahier des Charges)

### ✅ Complétées
- [x] Backend API complète avec authentification
- [x] Gestion des types d'interventions en BD
- [x] Système de slots (2 voitures max simultanément)
- [x] App mobile avec login/register
- [x] Liste des réparations et détails
- [x] Interface mobile avec notifications (UI)
- [x] Système de paiements (UI)
- [x] FrontOffice web public

### ⏳ En Cours
- [ ] Firebase Cloud Messaging pour notifications réelles
- [ ] Export Godot en HTML5
- [ ] Frontend Web Backoffice complet
- [ ] Intégration API Godot ↔ Backend
- [ ] Devis PDF mobile
- [ ] Photos des pannes

### ❌ Non Commencées
- [ ] Synchronisation Firestore réelle
- [ ] Tableau statistiques complet (montants, clients)
- [ ] Authentification Firebase (optionnel)
- [ ] Tests automatisés

---

## 📞 Endpoints API Disponibles (Backend)

### Authentification
```
POST   /api/register          - Inscription user
POST   /api/login             - Connexion user
GET    /api/user              - Info user courant (auth)
```

### Voitures (Publics)
```
GET    /api/voitures          - Lister toutes
GET    /api/voitures/{id}     - Détail
POST   /api/voitures          - Créer (auth)
PUT    /api/voitures/{id}     - Modifier (auth)
DELETE /api/voitures/{id}     - Supprimer (auth)
```

### Types de Réparations
```
GET    /api/types-reparation  - Lister
GET    /api/types-reparation/{id}
POST   /api/types-reparation  - Créer (auth)
PUT    /api/types-reparation/{id}
DELETE /api/types-reparation/{id}
```

### Interventions
```
GET    /api/interventions     - Lister
GET    /api/interventions/{id}
POST   /api/interventions     - Créer (auth)
PUT    /api/interventions/{id}
PATCH  /api/interventions/{id}/status - Changer statut
DELETE /api/interventions/{id}
```

### Slots de Garage
```
GET    /api/slots             - Lister
POST   /api/slots             - Créer (auth)
PUT    /api/slots/{id}
DELETE /api/slots/{id}
```

### Catégories
```
GET    /api/categories        - Lister
POST   /api/categories        - Créer (auth)
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

---

## 🚀 Étapes Prioritaires (Ordre d'importance)

### Phase 1: Frontend Web (✅ COMPLETE - Ready for Production)
1. **Créer structure React/Vue/Angular** → Choix du framework ✅
2. **Écran Login Backoffice** → Authentification Sanctum JWT ✅
3. **Dashboard Admin** → Gestion interventions (CRUD) ✅
4. **Tableau Statistiques** → Montants totaux, nombre clients ✅
5. **FrontOffice Public** → Voir clients et réparations en cours ✅

### Phase 2: Godot Export & Integration (15-20h)
1. **Configurer export HTML5** → Webassembly + canvas
2. **Intégration API Backend** → Récupérer interventions
3. **Interface réparation interactive** → Gameplay principal
4. **Score/Progression** → Sauvegarde état réparations

### Phase 3: Firebase Réel (20-30h)
1. **Firebase Cloud Messaging (FCM)** → Push notifications mobiles
2. **Synchronisation Firestore** → Remplacer logs_sync_firebase
3. **Authentication Firebase** → Optionnel, amélioration
4. **Real-time updates** → Notifications en temps réel

### Phase 4: Finalisation Mobile (10-15h)
1. **Photos des pannes** → Intégration caméra
2. **Devis PDF** → Génération documents
3. **Mode sombre complet** → Bug fixes
4. **Navigation bottom tabs** → Refactoring navigation

---

## 🔐 Authentification & Sécurité

### Actuelle (✅ Funktionnel)
```
Login → API Laravel /login (POST /api/login)
        ↓
        JWT Token Sanctum (createToken() method)
        ↓
        Stocké dans:
        - localStorage (Frontend Web)
        - AsyncStorage (Mobile)
        ↓
        Header: Authorization: Bearer {token}
        ↓
        Validated on protected routes
```

### Fixes Appliqués
- ✅ User model: Ajout trait `HasApiTokens` (Sanctum)
- ✅ Dockerfile: Installation extensions PHP (pdo_mysql, mbstring, xml, bcmath)
- ✅ AuthController: Logging et error handling
- ✅ Frontend: API interceptor pour tokens
- ✅ Database: Utilisateur test `admin@garage.com` / `password`

### À Améliorer
- [ ] Refresh tokens (expiration)
- [ ] CSRF protection web
- [ ] Rate limiting API
- [ ] Validation input robuste
- [ ] Encryption données sensibles

---

## 🧪 Testing & Validation

### Outils Disponibles
- **Postman Collection** → `POSTMAN_COLLECTION.json` (à importer)
- **PHPUnit** → Tests Laravel (pas utilisés actuellement)
- **Mobile Testing** → Expo Go app preview

### À Faire
- [ ] Tests unitaires Laravel (Models, Controllers)
- [ ] Tests e2e Expo (eas build + EAS Submit)
- [ ] Tests Godot HTML5 cross-browser
- [ ] Tests intégration Firebase

---

## 📝 Notes Importantes

### ⚠️ Dépendances Externes
- **Firebase:** Config existe (`config/firebase.php`) mais créentials non chargées
- **Docker:** db.env ou configs manquants pour MySQL en production
- **Expo:** Besoin compte Expo pour build APK

### 🎨 Design Decisions
- **Mobile:** Thème bleu premium (#3b82f6 primary)
- **Backend:** Blade PHP (peut être remplacé par React)
- **Godot:** 2D simple, pas de 3D
- **Devise:** Ariary (monnaie Madagascar)

### 🔄 CI/CD
- `build-apk.sh` / `build-apk.ps1` → Scripts APK disponibles
- `create-deliverable.sh/ps1` → Packaging final
- `docker-compose.yml` → Stack complète

---

## 💾 Fichiers Critiques à Connaître

| Fichier | Purpose | Modification? |
|---------|---------|---------------|
| `garage-web/backend/routes/api.php` | Endpoints API | Ajouter nouvelles routes |
| `garage-web/backend/app/Models/*` | Data models | Modifier pour nouvelles features |
| `garage-web/backend/config/firebase.php` | Firebase config | Implémenter réellement |
| `garage-mobile/src/services/api.ts` | API client | Adapter endpoints |
| `garage-mobile/App.tsx` | App root mobile | Navigation refactor |
| `garage-godot/project.godot` | Godot project | Export configuration |
| `docker-compose.yml` | Docker orchestration | Ajouter services si nécessaire |

---

## 🎬 Commandes Utiles

### Backend
```bash
cd garage-web/backend

# Démarrer avec Docker
docker-compose up -d

# Migrations
docker-compose exec app php artisan migrate:fresh --seed

# Tests
./vendor/bin/phpunit
```

### Mobile
```bash
cd garage-mobile

# Installer deps
npm install

# Démarrer Expo
npm start

# Build APK
eas build --platform android
```

### Godot
```bash
cd garage-godot

# Ouvrir projet
godot --path .

# Exporter HTML5
godot --headless --export-release "HTML5" export/index.html
```

---

## 📊 Progression Globale

| Component | Complété | En Cours | À Faire | % |
|-----------|----------|----------|---------|---|
| Backend | 92% | - | 8% | ✅ |
| Mobile | 66% | - | 34% | ✅ |
| Frontend Web | 100% | - | 0% | ✅ |
| Godot | 10% | - | 90% | ❌ |
| **TOTAL** | **67%** | - | **33%** | 🟡 |

**Estimation temps restant:** ~30-40 heures (Godot + Firebase = priorities)

### Avancée depuis dernier update
- ✅ Frontend Web : Page Publique implémentée avec succès
- ✅ Build System : Correction des types TypeScript, build production OK (0 erreurs)
- ✅ Routing : Ajout route publique, protection des routes admin
- ✅ Validation : Le frontend web est considéré comme "Terminé" pour le MVP

---

## 👤 Responsabilité

## 👥 Équipe de Développement

| Rôle | Étudiant | Spécialité | Contribution |
|------|----------|-----------|---------------|
| **Lead Developer** | ETU3637 | Authentification & Sécurité API | 11 tâches - 73% |
| **Mobile Developer** | ETU3616 | Gestion Réparations Mobile | 12 tâches - 75% |
| **Backend Developer** | ETU3603 | Paiements & Notifications API | 11 tâches - 73% |
| **Frontend Developer** | ETU3513 | UI/UX & Base de Données | 11 tâches - 64% |

**Charge Totale:** 45 tâches | **Avancement Moyen:** 71% (32 complétées, 13 TODO)

---

## 📊 Répartition des Tâches

### ETU3637 - Lead Developer (Authentification & Sécurité)
**Assigné:** 11 tâches | **Complétées:** 8 | **TODO:** 3
- Authentification mobile (9 tâches): Login, inscription, validation, JWT Sanctum
- Backend sécurité: Modèles Eloquent, validations métier, Sanctum, Policies

### ETU3616 - Mobile Developer (Réparations)
**Assigné:** 12 tâches | **Complétées:** 9 | **TODO:** 3  
- Gestion réparations mobile (12 tâches): Liste, filtres, statuts, pricing, types, timeline, photos, PDF, historique
- Backend: CRUD Réparations

### ETU3603 - Backend Developer (Paiements & API)
**Assigné:** 11 tâches | **Complétées:** 8 | **TODO:** 3
- Paiements mobile (4 tâches): Historique, formulaire, Firebase, reçus
- Notifications (3 tâches): Push, écran, temps réel
- Backend: CRUD Voitures, CRUD Paiements, Pagination/filtering

### ETU3513 - Frontend Developer (UI & Database)
**Assigné:** 11 tâches | **Complétées:** 7 | **TODO:** 4
- Interface utilisateur mobile (4 tâches): Responsive, design, animations, accessibilité
- Base de données (4 tâches): Migrations, seeders, indexes, backups
- Backend: Relations BD

---

## 📋 Protocole de Collaboration

### Communication
- **Commits:** Messages clairs avec assigné et tâche (#numéroTâche)
- **Format:** `feat/fix/chore: description - @assigné`
- **Branches:** Une branche par feature/bugfix

### Synchronisation GitHub
- Push tous les jours (fin de journée)
- Pull requests avec review avant merge
- Main branch: code production
- Dev branch: intégration continue

### Priorités de Développement
1. **Critique:** Frontend + API (bloquants pour tests)
2. **Important:** Paiements + Notifications
3. **Nice to Have:** Bonus features

---

## 🔧 Stack Technique par Rôle

| Rôle | Frontend | Backend | Mobile | DevOps |
|------|----------|---------|--------|--------|
| **ETU3637** | - | PHP/Laravel | TypeScript/React | Docker |
| **ETU3616** | React/Vite | PHP/Laravel | React Native | - |
| **ETU3603** | - | PHP/Laravel | Firebase | - |
| **ETU3513** | React/CSS | MySQL | - | DB |

---

## 📈 Métriques Équipe

| Métrique | Valeur |
|----------|--------|
| **Tâches par Personne** | 11-12 (équilibré) |
| **Chevauchement** | Oui - intégration continue |
| **Dépendances** | Backend → Frontend/Mobile |
| **Code Review** | Entre membres |
| **Tempo Cible** | 8h/jour par personne |

---  
**Date dernier update:** Février 11, 2026 - 11h30 UTC  
**Workload actuel:** 55% de 50 tâches
**Session avancée:** Frontend Web finalisé (Statut 100%)

---

**NEXT STEPS:**
1. 🚨 **URGENT**: Configurer l'export Godot HTML5
2. 🔄 API Godot : Connecter le jeu au backend (récupérer session)
3. 🔄 Mobile Features : Notifications FCM et Photos
4. ⏳ Cleanup final : Préparer les sources pour la remise

**Current Blocker:** Godot HTML5 export configuration manquante.
