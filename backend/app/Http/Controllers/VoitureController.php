<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use Illuminate\Http\Request;

class VoitureController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'marque' => 'required|string',
            'modele' => 'required|string',
            'immatriculation' => 'required|string|unique:voitures,immatriculation',
            'description_panne' => 'required|string',
        ]);

        $voiture = Voiture::create([
            'utilisateur_id' => auth()->id(),
            'marque' => $request->marque,
            'modele' => $request->modele,
            'immatriculation' => $request->immatriculation,
            'description_panne' => $request->description_panne,
            'statut' => 'en_attente',
        ]);

        return response()->json($voiture, 201);
    }
}
