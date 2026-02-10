# Documentation - Gestion des Catégories

## 📋 Vue d'ensemble

La fonctionnalité de gestion des catégories permet de créer, lire, mettre à jour et supprimer les catégories de réparation dans le système.

## 🗂️ Fichiers créés

### 1. **Modèle**
- **Chemin**: `app/Models/Categorie.php`
- **Description**: Modèle Eloquent pour les catégories
- **Relations**: `interventions()` - Relation vers les interventions

### 2. **Migration**
- **Chemin**: `database/migrations/2026_02_10_120000_create_categories_table.php`
- **Description**: Crée la table `categories` avec les champs:
  - `id` (bigint, clé primaire)
  - `nom` (string, unique)
  - `description` (text, nullable)
  - `created_at`, `updated_at` (timestamps)

- **Chemin**: `database/migrations/2026_02_10_120001_add_categorie_to_interventions_table.php`
- **Description**: Ajoute la colonne `categorie_id` à la table `interventions`

### 3. **Contrôleurs**

#### API Controller
- **Chemin**: `app/Http/Controllers/CategorieController.php`
- **Méthodes**:
  - `index()` - Récupère toutes les catégories (JSON)
  - `show($id)` - Récupère une catégorie spécifique
  - `store()` - Crée une catégorie avec validation
  - `update()` - Met à jour une catégorie
  - `destroy()` - Supprime une catégorie

#### Backoffice Controller
- **Chemin**: `app/Http/Controllers/Backoffice/CategorieController.php`
- **Méthodes**:
  - `index()` - Affiche la liste des catégories (Vue Blade)
  - `create()` - Affiche le formulaire de création
  - `store()` - Enregistre une nouvelle catégorie
  - `edit()` - Affiche le formulaire d'édition
  - `update()` - Met à jour une catégorie
  - `destroy()` - Supprime une catégorie

### 4. **Vues Blade**
- **Chemin**: `resources/views/backoffice/categories/`
  - `index.blade.php` - Liste de toutes les catégories
  - `add.blade.php` - Formulaire de création
  - `edit.blade.php` - Formulaire d'édition

### 5. **Routes**

#### Routes API
```php
GET    /api/categories              # Toutes les catégories
GET    /api/categories/{id}         # Une catégorie spécifique
POST   /api/categories              # Créer (authentifié)
PUT    /api/categories/{id}         # Modifier (authentifié)
DELETE /api/categories/{id}         # Supprimer (authentifié)
```

#### Routes Web
```php
GET    /backoffice/categories              # Liste
GET    /backoffice/categories/create       # Formulaire de création
POST   /backoffice/categories              # Enregistrer
GET    /backoffice/categories/{id}/edit    # Formulaire d'édition
PUT    /backoffice/categories/{id}         # Mettre à jour
DELETE /backoffice/categories/{id}         # Supprimer
```

## 🔄 Validation des données

### Champs requis
- **nom**: 
  - Requis
  - Chaîne de caractères (max 255)
  - Unique dans la base de données
  - Messages d'erreur personnalisés

- **description**:
  - Optionnel
  - Chaîne de caractères (max 1000)

## ✅ Fonctionnalités

### 1. **Création de catégorie**
   - Validation du formulaire côté serveur
   - Vérification de l'unicité du nom
   - Redirection vers la liste après succès
   - Messages d'erreur affichés

### 2. **Affichage de la liste**
   - Tableau avec colonnes: Nom, Description, Nombre d'interventions, Actions
   - Liens vers édition et suppression
   - Affichage du nombre d'interventions liées

### 3. **Édition de catégorie**
   - Formulaire pré-rempli avec les données existantes
   - Validation à la mise à jour
   - Affichage de la date de création et modification

### 4. **Suppression de catégorie**
   - Protection: impossible de supprimer si des interventions sont liées
   - Confirmation de suppression
   - Message d'erreur si suppression impossible

## 🔐 Sécurité

- **Validation côté serveur** pour tous les formulaires
- **Protection CSRF** avec `@csrf` dans les formulaires Blade
- **Autorisation** sur les routes API avec Sanctum
- **Gestion des erreurs** avec try/catch

## 🎯 Prochaines étapes

1. **Dashboard**: Ajouter des statistiques sur les catégories les plus utilisées
2. **API Client**: Intégrer les endpoints dans l'application Tsiky (React Native)
3. **Filtering**: Ajouter la possibilité de filtrer les catégories
4. **Pagination**: Implémenter la pagination pour les listes longues

## 📝 Exemple d'utilisation

### Avec cURL (API)
```bash
# Créer une catégorie
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nom": "Vidange",
    "description": "Changement de l'\''huile moteur"
  }'

# Récupérer toutes les catégories
curl http://localhost:8000/api/categories

# Mettre à jour
curl -X PUT http://localhost:8000/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"nom": "Vidange moteur"}'
```

### Interface Web
1. Accéder à `/backoffice/categories`
2. Cliquer sur "Ajouter une catégorie"
3. Remplir le formulaire et valider
4. La catégorie apparaît dans la liste
5. Cliquer sur "Éditer" ou "Supprimer" pour les actions

## ⚙️ Installation et migration

Pour utiliser cette fonctionnalité:

```bash
# 1. Migrer la base de données
php artisan migrate

# 2. Accéder au backoffice
http://localhost:8000/backoffice/categories
```

## 🐛 Dépannage

**Erreur: Table categories not found**
→ Exécuter `php artisan migrate`

**Erreur: Route categories.index not defined**
→ Vérifier que les routes sont bien importées dans `routes/web.php`

**Erreur: View not found**
→ Vérifier que les fichiers Blade sont bien dans `resources/views/backoffice/categories/`
