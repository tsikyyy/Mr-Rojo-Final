<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'email' => 'admin@garage.com',
            'mot_de_passe' => Hash::make('password'),
        ]);

        echo "✅ Utilisateur admin@garage.com créé!\n";
    }
}
