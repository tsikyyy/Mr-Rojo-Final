# Firebase Configuration - Mr Rojo Project

## ✅ Configuration Actuelle

### 1. **Credentials Firebase**
- ✅ Fichier: `backend/config/firebase-credentials.json`
- ✅ Project ID: `mr-rojo-final`
- ✅ Authentification: Service Account configurée

### 2. **SDK PHP Firebase**
- ✅ Package: `kreait/firebase-php` (v7.24)
- ✅ Installation: Complétée via Composer
- ✅ Localisation: `vendor/kreait/`

### 3. **Configuration Laravel**
- ✅ Fichier de config: `backend/config/firebase.php`
- ✅ Variables .env: 
  - `FIREBASE_CREDENTIALS=/var/www/html/config/firebase-credentials.json`
  - `FIREBASE_DATABASE_URL=null`

### 4. **Services Disponibles**
- ✅ **FirebaseService** (`app/Services/FirebaseService.php`)
  - Initialisation centralisée de Firebase
  - Accès à Auth, Firestore, Messaging

### 5. **Routes de Test**
- ✅ `GET /api/firebase-test` - Teste la connexion Firebase

## 🚀 Comment Utiliser Firebase

### Dans un Contrôleur :
```php
use App\Services\FirebaseService;

class MonController extends Controller {
    public function exemple()
    {
        $firebase = new FirebaseService();
        
        // Authentification
        $auth = $firebase->auth();
        
        // Firestore
        $firestore = $firebase->firestore();
        
        // Cloud Messaging (notifications push)
        $messaging = $firebase->messaging();
    }
}
```

### Authentification (Email/Password)
```php
$firebase = new FirebaseService();
$auth = $firebase->auth();

// Créer un utilisateur
$user = $auth->createUserWithEmailAndPassword('user@example.com', 'password123');

// Authentifier un utilisateur
$signedInUser = $auth->signInWithEmailAndPassword('user@example.com', 'password123');
```

### Firestore - Sauvegarder des données
```php
$firestore = $firebase->firestore();
$database = $firestore->database();

$database->collection('users')->document('user_123')->set([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'created_at' => now()
]);
```

### Cloud Messaging - Envoyer une notification push
```php
$messaging = $firebase->messaging();

$message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('topic', 'garage_updates')
    ->withData([
        'title' => 'Nouvelle réparation',
        'body' => 'Votre voiture est prête !'
    ]);

$messaging->send($message);
```

## 📋 Checklist Configuration Firebase

| Élément | Statut | Détails |
|---------|--------|---------|
| Project Firebase créé | ✅ | `mr-rojo-final` |
| Authentication Email/Password | ✅ | Activé |
| Cloud Messaging | ✅ | Pour notifications push |
| Firestore Database | ✅ | Pour synchronisation temps réel |
| Service Account créée | ✅ | Credentials téléchargées |
| SDK PHP installé | ✅ | Via Composer |
| Config Laravel | ✅ | Dans `config/firebase.php` |
| Service Helper | ✅ | `FirebaseService.php` |
| Routes de test | ✅ | `/api/firebase-test` |

## 🔧 Variables d'Environnement

```env
# Firebase Admin SDK
FIREBASE_CREDENTIALS=/var/www/html/config/firebase-credentials.json
FIREBASE_DATABASE_URL=null
```

## 📱 Prochaines Étapes

1. **Intégrer Firebase dans les contrôleurs d'auth** (`AuthController.php`)
2. **Créer des listeners Firestore** pour la synchronisation temps réel
3. **Configurer Cloud Messaging** pour les notifications push
4. **Tester les webhooks Firebase** depuis l'app mobile

## 🧪 Test Quick Start

Accédez à: `http://localhost:8000/api/firebase-test`

Vous devriez voir :
```json
{
  "status": "success",
  "message": "Firebase initialized successfully",
  "project_id": "mr-rojo-final",
  "timestamp": "2026-01-21T..."
}
```

## ⚠️ Notes de Sécurité

- Le fichier `firebase-credentials.json` est sensible - **NE PAS le committer** (ignoré par .gitignore)
- Les credentials doivent rester secrets en production
- Utiliser des variables d'environnement pour les paths en production
