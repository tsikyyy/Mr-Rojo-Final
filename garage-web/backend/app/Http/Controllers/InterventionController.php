<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InterventionController extends Controller
{
    /**
     * Get all interventions with relationships
     */
    public function index(): JsonResponse
    {
        try {
            $interventions = Intervention::with(['voiture', 'typeReparation', 'categorie'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $interventions,
                'count' => $interventions->count()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des interventions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific intervention
     */
    public function show($id): JsonResponse
    {
        try {
            $intervention = Intervention::with(['voiture', 'typeReparation', 'categorie'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $intervention
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Intervention introuvable',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new intervention
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'voiture_id' => ['required', 'integer', 'exists:voitures,id'],
                'type_reparation_id' => ['required', 'integer', 'exists:types_reparation,id'],
                'categorie_id' => ['nullable', 'integer', 'exists:categories,id'],
                'slot_id' => ['nullable', 'integer', 'exists:slots_garage,id'],
                'statut' => ['required', 'string', 'in:en_attente,en_reparation,terminee,payee'],
                'date_debut' => ['nullable', 'date_format:Y-m-d H:i:s'],
                'date_fin' => ['nullable', 'date_format:Y-m-d H:i:s', 'after_or_equal:date_debut'],
            ]);

            // VERIFICATION REGLE METIER : Max 2 voitures en réparation simultanément
            if ($validated['statut'] === 'en_reparation') {
                $countEnReparation = Intervention::where('statut', 'en_reparation')->count();
                if ($countEnReparation >= 2) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le garage est complet (Max 2 voitures en réparation en même temps).',
                        'errors' => ['statut' => ['Le garage est complet. Veuillez mettre en attente ou terminer une autre intervention.']]
                    ], 422);
                }
            }

            $intervention = Intervention::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Intervention créée avec succès',
                'data' => $intervention->load(['voiture', 'typeReparation', 'categorie'])
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
                'message' => 'Erreur lors de la création de l\'intervention',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an intervention
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $intervention = Intervention::findOrFail($id);

            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'voiture_id' => ['required', 'integer', 'exists:voitures,id'],
                'type_reparation_id' => ['required', 'integer', 'exists:types_reparation,id'],
                'categorie_id' => ['nullable', 'integer', 'exists:categories,id'],
                'slot_id' => ['nullable', 'integer', 'exists:slots_garage,id'],
                'statut' => ['required', 'string', 'in:en_attente,en_reparation,terminee,payee'],
                'date_debut' => ['nullable', 'date_format:Y-m-d H:i:s'],
                'date_fin' => ['nullable', 'date_format:Y-m-d H:i:s', 'after_or_equal:date_debut'],
            ]);

            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }

            $validated = $validator->validated();

            // VERIFICATION REGLE METIER : Max 2 voitures en réparation simultanément
            if ($validated['statut'] === 'en_reparation') {
                $countEnReparation = Intervention::where('statut', 'en_reparation')
                    ->where('id', '!=', $id)
                    ->count();
                
                if ($countEnReparation >= 2) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le garage est complet (Max 2 voitures en réparation en même temps).',
                        'errors' => ['statut' => ['Le garage est complet. Veuillez mettre en attente ou terminer une autre intervention.']]
                    ], 422);
                }
            }

            $intervention->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Intervention mise à jour avec succès',
                'data' => $intervention->load(['voiture', 'typeReparation', 'categorie'])
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
     * Delete an intervention
     */
    public function destroy($id): JsonResponse
    {
        try {
            $intervention = Intervention::findOrFail($id);
            $intervention_id = $intervention->id;
            $intervention->delete();

            return response()->json([
                'success' => true,
                'message' => 'Intervention supprimée avec succès',
                'data' => ['id' => $intervention_id]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update intervention status
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $intervention = Intervention::findOrFail($id);

            $validated = $request->validate([
                'statut' => ['required', 'string', 'in:en_attente,en_reparation,terminee,payee']
            ]);

            $intervention->update(['statut' => $validated['statut']]);

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => $intervention
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
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
