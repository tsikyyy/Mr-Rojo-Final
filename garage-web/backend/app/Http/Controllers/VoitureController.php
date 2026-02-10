<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VoitureController extends Controller
{
    /**
     * Get all voitures
     */
    public function index(): JsonResponse
    {
        try {
            $voitures = Voiture::with('utilisateur')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $voitures,
                'count' => $voitures->count()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des voitures',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific voiture
     */
    public function show($id): JsonResponse
    {
        try {
            $voiture = Voiture::with('utilisateur')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $voiture
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Voiture introuvable',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new voiture
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'marque' => ['required', 'string', 'max:255'],
                'modele' => ['required', 'string', 'max:255'],
                'immatriculation' => ['required', 'string', 'unique:voitures,immatriculation'],
                'description_panne' => ['required', 'string'],
            ]);

            $voiture = Voiture::create([
                'utilisateur_id' => auth()->id(),
                'marque' => $validated['marque'],
                'modele' => $validated['modele'],
                'immatriculation' => $validated['immatriculation'],
                'description_panne' => $validated['description_panne'],
                'statut' => 'en_attente',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Voiture créée avec succès',
                'data' => $voiture->load('utilisateur')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la voiture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a voiture
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $voiture = Voiture::findOrFail($id);

            $validated = $request->validate([
                'marque' => ['required', 'string', 'max:255'],
                'modele' => ['required', 'string', 'max:255'],
                'immatriculation' => ['required', 'string', 'unique:voitures,immatriculation,' . $id],
                'description_panne' => ['required', 'string'],
                'statut' => ['nullable', 'string', 'in:en_attente,en_reparation,terminee,payee'],
            ]);

            $voiture->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Voiture mise à jour avec succès',
                'data' => $voiture->load('utilisateur')
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a voiture
     */
    public function destroy($id): JsonResponse
    {
        try {
            $voiture = Voiture::findOrFail($id);
            $voiture_id = $voiture->id;
            $voiture->delete();

            return response()->json([
                'success' => true,
                'message' => 'Voiture supprimée avec succès',
                'data' => ['id' => $voiture_id]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
