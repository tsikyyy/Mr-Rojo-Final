<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Firebase credentials file
    |--------------------------------------------------------------------------
    |
    | Chemin vers le fichier serviceAccountKey.json
    |
    */
    'credentials_file' => env('FIREBASE_CREDENTIALS', base_path('config/firebase-credentials.json')),

    /*
    |--------------------------------------------------------------------------
    | Firebase database URL (optionnel)
    |--------------------------------------------------------------------------
    |
    | Seulement nécessaire si tu utilises Realtime Database ou Firestore via REST.
    |
    */
    'database_url' => env('FIREBASE_DATABASE_URL', null),
];
