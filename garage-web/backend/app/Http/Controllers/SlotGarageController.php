<?php

namespace App\Http\Controllers;

use App\Models\SlotGarage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SlotGarageController extends Controller
{
    /**
     * Get all garage slots
     */
    public function index(): JsonResponse
    {
        try {
            $slots = SlotGarage::orderBy('numero')->get();

            return response()->json([
                'success' => true,
                'data' => $slots,
                'count' => $slots->count()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des slots',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific slot
     */
    public function show($id): JsonResponse
    {
        try {
            $slot = SlotGarage::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $slot
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Slot introuvable',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new slot
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'numero' => ['required', 'integer', 'unique:slots_garage,numero'],
                'type' => ['required', 'string', 'in:reparation,attente'],
            ]);

            $slot = SlotGarage::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Slot créé avec succès',
                'data' => $slot
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
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a slot
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $slot = SlotGarage::findOrFail($id);

            $validated = $request->validate([
                'numero' => ['required', 'integer', 'unique:slots_garage,numero,' . $id],
                'type' => ['required', 'string', 'in:reparation,attente'],
            ]);

            $slot->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Slot mis à jour avec succès',
                'data' => $slot
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
     * Delete a slot
     */
    public function destroy($id): JsonResponse
    {
        try {
            $slot = SlotGarage::findOrFail($id);
            
            // Check if slot is in use
            if ($slot->interventions()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce slot est utilisé dans des interventions',
                    'count' => $slot->interventions()->count()
                ], 409);
            }

            $slot_id = $slot->id;
            $slot->delete();

            return response()->json([
                'success' => true,
                'message' => 'Slot supprimé avec succès',
                'data' => ['id' => $slot_id]
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
