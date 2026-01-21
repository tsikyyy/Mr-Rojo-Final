<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Database;
use Kreait\Firebase\Firestore;
use Kreait\Firebase\Messaging;

class FirebaseService
{
    protected $firebase;
    protected $auth;
    protected $database;
    protected $firestore;
    protected $messaging;

    public function __construct()
    {
        try {
            $credentialsPath = config('firebase.credentials_file');
            
            if (!file_exists($credentialsPath)) {
                throw new \Exception("Firebase credentials file not found at: {$credentialsPath}");
            }

            $this->firebase = (new Factory)
                ->withServiceAccount($credentialsPath)
                ->create();

            $this->auth = $this->firebase->createAuth();
            $this->firestore = $this->firebase->createFirestore();
            $this->messaging = $this->firebase->createMessaging();
            
        } catch (\Exception $e) {
            \Log::error('Firebase initialization error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get Firebase Auth instance
     */
    public function auth(): Auth
    {
        return $this->auth;
    }

    /**
     * Get Firebase Firestore instance
     */
    public function firestore(): Firestore
    {
        return $this->firestore;
    }

    /**
     * Get Firebase Messaging instance (pour les notifications push)
     */
    public function messaging(): Messaging
    {
        return $this->messaging;
    }

    /**
     * Get Firebase Factory
     */
    public function firebase()
    {
        return $this->firebase;
    }
}
