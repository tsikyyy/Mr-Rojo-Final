<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;

class FirebaseTestController extends Controller
{
    /**
     * Tester la connexion Firebase
     */
    public function test(): JsonResponse
    {
        try {
            $firebaseService = new FirebaseService();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Firebase initialized successfully',
                'project_id' => 'mr-rojo-final',
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
