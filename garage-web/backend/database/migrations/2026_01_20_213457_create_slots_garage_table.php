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
    Schema::create('slots_garage', function (Blueprint $table) {
        $table->id();
        $table->integer('numero')->unique();
        $table->enum('type', ['reparation', 'attente']);
        $table->enum('statut', ['libre', 'occupe'])->default('libre');
        $table->foreignId('voiture_id')->nullable()->constrained('voitures')->onDelete('set null');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('slots_garage');
}
};
