<?php

namespace App\Http\Controllers\Backoffice;

use App\Models\Categorie;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

class CategorieController extends Controller
{
    /**
     * Afficher la liste de toutes les catégories
     */
    public function index()
    {
        $categories = Categorie::all();
        return view('backoffice.categories.index', compact('categories'));
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        return view('backoffice.categories.add');
    }

    /**
     * Enregistrer une nouvelle catégorie en base
     */
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom',
            'description' => 'nullable|string|max:1000',
        ], [
            'nom.required' => 'Le nom de la catégorie est requis',
            'nom.unique' => 'Cette catégorie existe déjà',
            'nom.max' => 'Le nom ne doit pas dépasser 255 caractères',
            'description.max' => 'La description ne doit pas dépasser 1000 caractères',
        ]);

        try {
            // Créer la catégorie
            Categorie::create($validated);

            return redirect()
                ->route('categories.index')
                ->with('success', 'Catégorie créée avec succès');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Erreur lors de la création: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(Categorie $categorie)
    {
        return view('backoffice.categories.edit', compact('categorie'));
    }

    /**
     * Mettre à jour une catégorie
     */
    public function update(Request $request, Categorie $categorie)
    {
        // Validation
        $validated = $request->validate([
            'nom' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'nom')->ignore($categorie->id),
            ],
            'description' => 'nullable|string|max:1000',
        ], [
            'nom.required' => 'Le nom de la catégorie est requis',
            'nom.unique' => 'Cette catégorie existe déjà',
            'nom.max' => 'Le nom ne doit pas dépasser 255 caractères',
            'description.max' => 'La description ne doit pas dépasser 1000 caractères',
        ]);

        try {
            $categorie->update($validated);

            return redirect()
                ->route('categories.index')
                ->with('success', 'Catégorie mise à jour avec succès');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Erreur lors de la mise à jour: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy(Categorie $categorie)
    {
        // Vérifier si la catégorie a des interventions
        if ($categorie->interventions()->count() > 0) {
            return redirect()
                ->route('categories.index')
                ->with('error', 'Impossible de supprimer cette catégorie car elle est utilisée par des interventions');
        }

        try {
            $categorie->delete();

            return redirect()
                ->route('categories.index')
                ->with('success', 'Catégorie supprimée avec succès');
        } catch (\Exception $e) {
            return redirect()
                ->route('categories.index')
                ->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }
}
