<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Enregistrer un nouvel utilisateur
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|unique:utilisateurs',
                'password' => 'required|min:6|confirmed',
                'name' => 'nullable|string|max:255',
            ]);

            $user = User::create([
                'email' => $validated['email'],
                'mot_de_passe' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Connexion utilisateur
     */
    public function login(Request $request)
    {
        \Log::info('Login attempt', ['email' => $request->email]);
        
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
                return response()->json([
                    'error' => 'Email ou mot de passe incorrect',
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer l'utilisateur actuel
     */
    public function getCurrentUser(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Déconnecté avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
