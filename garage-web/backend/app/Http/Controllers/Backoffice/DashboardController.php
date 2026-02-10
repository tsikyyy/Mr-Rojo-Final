<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Intervention;
use App\Models\Voiture;
use App\Models\Categorie;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics
     */
    public function index(): View
    {
        // Count interventions by status
        $statusCounts = [
            'en_attente' => Intervention::where('statut', 'en_attente')->count(),
            'en_reparation' => Intervention::where('statut', 'en_reparation')->count(),
            'terminee' => Intervention::where('statut', 'terminee')->count(),
            'payee' => Intervention::where('statut', 'payee')->count(),
        ];

        // Total statistics
        $totalInterventions = Intervention::count();
        $totalVoitures = Voiture::count();
        $totalCategories = Categorie::count();

        // Get recent interventions
        $recentInterventions = Intervention::with(['voiture', 'typeReparation', 'categorie'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get interventions by category
        $interventionsByCategory = Categorie::withCount('interventions')
            ->orderByDesc('interventions_count')
            ->limit(5)
            ->get();

        // Calculate percentage for status badges
        $statusPercentages = [];
        foreach ($statusCounts as $status => $count) {
            $statusPercentages[$status] = $totalInterventions > 0 ? round(($count / $totalInterventions) * 100, 1) : 0;
        }

        return view('backoffice.dashboard', [
            'statusCounts' => $statusCounts,
            'statusPercentages' => $statusPercentages,
            'totalInterventions' => $totalInterventions,
            'totalVoitures' => $totalVoitures,
            'totalCategories' => $totalCategories,
            'recentInterventions' => $recentInterventions,
            'interventionsByCategory' => $interventionsByCategory,
        ]);
    }
}
