<?php

namespace Database\Seeders;

use App\Models\TypeReparation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeReparationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'nom' => 'Vidange Simple',
                'prix' => 50000,
                'duree_secondes' => 1800, // 30 min
            ],
            [
                'nom' => 'Changement Pneus',
                'prix' => 80000,
                'duree_secondes' => 2700, // 45 min
            ],
            [
                'nom' => 'Révision Complète',
                'prix' => 150000,
                'duree_secondes' => 7200, // 2h
            ],
            [
                'nom' => 'Freins (Plaquettes)',
                'prix' => 100000,
                'duree_secondes' => 3600, // 1h
            ],
            [
                'nom' => 'Diagnostic',
                'prix' => 30000,
                'duree_secondes' => 900, // 15 min
            ],
             [
                'nom' => 'Climatisation',
                'prix' => 120000,
                'duree_secondes' => 3600, // 1h
            ],
             [
                'nom' => 'Batterie',
                'prix' => 60000,
                'duree_secondes' => 1200, // 20 min
            ],
        ];

        foreach ($types as $type) {
            TypeReparation::firstOrCreate(
                ['nom' => $type['nom']],
                $type
            );
        }
    }
}
