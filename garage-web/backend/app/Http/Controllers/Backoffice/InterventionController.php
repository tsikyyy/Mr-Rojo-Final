<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Intervention;
use App\Models\Voiture;
use App\Models\TypeReparation;
use App\Models\SlotGarage;
use App\Models\Categorie;

class InterventionController extends Controller
{
    private function allowedStatuts(): array
    {
        // ⚠️ Mets ici EXACTEMENT les valeurs autorisées par ton ENUM interventions.statut
        return ['en_attente', 'en_reparation', 'terminee', 'payee'];
    }

    public function index()
    {
        $interventions = Intervention::with(['voiture', 'typeReparation', 'slot'])
            ->orderByDesc('id')
            ->get();

        return view('backoffice.interventions.index', compact('interventions'));
    }

    public function create()
    {
        $voitures = Voiture::orderBy('immatriculation')->get();
        $types = TypeReparation::orderBy('nom')->get();
        $categories = Categorie::orderBy('nom')->get();
        $slots = SlotGarage::orderBy('numero')->get();
        $statuts = $this->allowedStatuts();

        return view('backoffice.interventions.create', compact('voitures', 'types', 'categories', 'slots', 'statuts'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'voiture_id' => ['required', 'integer', 'exists:voitures,id'],
            'type_reparation_id' => ['required', 'integer', 'exists:types_reparation,id'],
            'categorie_id' => ['nullable', 'integer', 'exists:categories,id'],
            'slot_id' => ['nullable', 'integer', 'exists:slots_garage,id'],
            'statut' => ['required', 'in:' . implode(',', $this->allowedStatuts())],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_debut'],
        ]);

        Intervention::create($data);

        return redirect()
            ->route('backoffice.interventions')
            ->with('success', 'Intervention créée avec succès');
    }

    // ====== 2) EDIT ======
    public function edit(Intervention $intervention)
    {
        $voitures = Voiture::orderBy('immatriculation')->get();
        $types = TypeReparation::orderBy('nom')->get();
        $categories = Categorie::orderBy('nom')->get();
        $slots = SlotGarage::orderBy('numero')->get();
        $statuts = $this->allowedStatuts();

        return view('backoffice.interventions.edit', compact('intervention', 'voitures', 'types', 'categories', 'slots', 'statuts'));
    }

    public function update(Request $request, Intervention $intervention)
    {
        $data = $request->validate([
            'voiture_id' => ['required', 'integer', 'exists:voitures,id'],
            'type_reparation_id' => ['required', 'integer', 'exists:types_reparation,id'],
            'categorie_id' => ['nullable', 'integer', 'exists:categories,id'],
            'slot_id' => ['nullable', 'integer', 'exists:slots_garage,id'],
            'statut' => ['required', 'in:' . implode(',', $this->allowedStatuts())],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_debut'],
        ]);

        $intervention->update($data);

        return redirect()
            ->route('backoffice.interventions')
            ->with('success', 'Intervention mise à jour');
    }

    // ====== 3) DELETE ======
    public function destroy(Intervention $intervention)
    {
        $intervention->delete();

        return redirect()
            ->route('backoffice.interventions')
            ->with('success', 'Intervention supprimée');
    }

    // ====== 4) WORKFLOW STATUT ======
    public function updateStatut(Request $request, Intervention $intervention)
    {
        $data = $request->validate([
            'statut' => ['required', 'in:' . implode(',', $this->allowedStatuts())],
        ]);

        $intervention->update([
            'statut' => $data['statut'],
        ]);

        return redirect()
            ->route('backoffice.interventions')
            ->with('success', 'Statut mis à jour : ' . $data['statut']);
    }
}
