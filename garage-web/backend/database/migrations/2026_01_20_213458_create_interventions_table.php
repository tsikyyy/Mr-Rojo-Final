<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('interventions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('voiture_id')->constrained('voitures')->onDelete('cascade');
        $table->foreignId('type_reparation_id')->constrained('types_reparation');
        $table->foreignId('slot_id')->nullable()->constrained('slots_garage');
        $table->enum('statut', ['en_attente', 'en_cours', 'terminee'])->default('en_attente');
        $table->timestamp('date_debut')->nullable();
        $table->timestamp('date_fin')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('interventions');
}
};
