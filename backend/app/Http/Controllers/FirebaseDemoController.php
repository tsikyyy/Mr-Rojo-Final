<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;

/**
 * Firebase Demo Controller
 * 
 * Contient des exemples d'utilisation Firebase pour :
 * - Authentification
 * - Firestore (base de données temps réel)
 * - Cloud Messaging (notifications push)
 */
class FirebaseDemoController extends Controller
{
    private FirebaseService $firebaseService;

    public function __construct()
    {
        $this->firebaseService = new FirebaseService();
    }

    /**
     * Tester la connexion Firebase
     */
    public function testConnection(): JsonResponse
    {
        try {
            $firebase = $this->firebaseService->firebase();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Firebase connected successfully',
                'services' => [
                    'auth' => 'Available',
                    'firestore' => 'Available',
                    'messaging' => 'Available'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exemple : Créer un utilisateur Firebase
     * POST /api/firebase/create-user
     * Body: { "email": "user@example.com", "password": "password123" }
     */
    public function createUser(): JsonResponse
    {
        try {
            $email = request('email');
            $password = request('password');

            if (!$email || !$password) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email and password are required'
                ], 422);
            }

            $auth = $this->firebaseService->auth();
            $user = $auth->createUserWithEmailAndPassword($email, $password);

            return response()->json([
                'status' => 'success',
                'user_id' => $user->uid,
                'email' => $user->email
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exemple : Sauvegarder des données Firestore
     * POST /api/firebase/save-data
     * Body: { "collection": "voitures", "document": "doc_123", "data": {...} }
     */
    public function saveFirestoreData(): JsonResponse
    {
        try {
            $collection = request('collection');
            $document = request('document');
            $data = request('data', []);

            if (!$collection || !$document) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Collection and document are required'
                ], 422);
            }

            $firestore = $this->firebaseService->firestore();
            $database = $firestore->database();

            $database->collection($collection)->document($document)->set($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Data saved successfully',
                'collection' => $collection,
                'document' => $document
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exemple : Lire des données Firestore
     * GET /api/firebase/get-data?collection=voitures&document=doc_123
     */
    public function getFirestoreData(): JsonResponse
    {
        try {
            $collection = request('collection');
            $document = request('document');

            if (!$collection || !$document) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Collection and document are required'
                ], 422);
            }

            $firestore = $this->firebaseService->firestore();
            $database = $firestore->database();

            $snapshot = $database->collection($collection)->document($document)->snapshot();

            if (!$snapshot->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Document not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $snapshot->data()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exemple : Envoyer une notification push
     * POST /api/firebase/send-notification
     * Body: { "topic": "garage_updates", "title": "...", "body": "..." }
     */
    public function sendNotification(): JsonResponse
    {
        try {
            $topic = request('topic');
            $title = request('title');
            $body = request('body');

            if (!$topic || !$title || !$body) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Topic, title and body are required'
                ], 422);
            }

            $messaging = $this->firebaseService->messaging();

            $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('topic', $topic)
                ->withData([
                    'title' => $title,
                    'body' => $body,
                    'timestamp' => now()->toIso8601String()
                ]);

            $result = $messaging->send($message);

            return response()->json([
                'status' => 'success',
                'message' => 'Notification sent',
                'message_id' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
