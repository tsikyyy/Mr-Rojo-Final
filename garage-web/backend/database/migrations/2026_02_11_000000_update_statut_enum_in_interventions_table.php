<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change the 'statut' column from ENUM to VARCHAR to allow more flexible statuses
        // We use raw SQL to avoid Doctrine dependecy issues
        DB::statement("ALTER TABLE interventions MODIFY COLUMN statut VARCHAR(50) NOT NULL DEFAULT 'en_attente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to the original ENUM (Warning: This might fail if the column contains values not in the enum)
        // We comment this out or use a safe fallback since reverting leads to data loss for new statuses
        // DB::statement("ALTER TABLE interventions MODIFY COLUMN statut ENUM('en_attente', 'en_cours', 'terminee') NOT NULL DEFAULT 'en_attente'");
    }
};
