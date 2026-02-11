<?php

namespace App\Http\Controllers;

use App\Models\TypeReparation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TypeReparationController extends Controller
{
    /**
     * Get all repair types
     */
    public function index(): JsonResponse
    {
        try {
            $types = TypeReparation::orderBy('nom')->get();

            return response()->json([
                'success' => true,
                'data' => $types,
                'count' => $types->count()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des types de réparation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific repair type
     */
    public function show($id): JsonResponse
    {
        try {
            $type = TypeReparation::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $type
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Type de réparation introuvable',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new repair type
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nom' => ['required', 'string', 'unique:types_reparation,nom'],
                'prix' => ['required', 'numeric', 'min:0'],
                'duree_secondes' => ['nullable', 'integer', 'min:0'],
            ]);

            $data = $validated;
            // Default duration to 3600 seconds (1 hour) if not provided
            if (!isset($data['duree_secondes'])) {
                $data['duree_secondes'] = 3600;
            }

            $type = TypeReparation::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Type de réparation créé avec succès',
                'data' => $type
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
     * Update a repair type
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $type = TypeReparation::findOrFail($id);

            $validated = $request->validate([
                'nom' => ['required', 'string', 'unique:types_reparation,nom,' . $id],
                'prix' => ['required', 'numeric', 'min:0'],
                'duree_secondes' => ['nullable', 'integer', 'min:0'],
            ]);

            $type->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Type de réparation mis à jour avec succès',
                'data' => $type
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
     * Delete a repair type
     */
    public function destroy($id): JsonResponse
    {
        try {
            $type = TypeReparation::findOrFail($id);
            
            // Check if type is in use
            if ($type->interventions()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce type de réparation est utilisé dans des interventions',
                    'count' => $type->interventions()->count()
                ], 409);
            }

            $type_id = $type->id;
            $type->delete();

            return response()->json([
                'success' => true,
                'message' => 'Type de réparation supprimé avec succès',
                'data' => ['id' => $type_id]
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
