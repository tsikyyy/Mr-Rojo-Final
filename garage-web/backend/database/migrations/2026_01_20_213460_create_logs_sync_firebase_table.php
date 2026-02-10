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
    Schema::create('logs_sync_firebase', function (Blueprint $table) {
        $table->id();
        $table->enum('type_entite', ['voiture', 'intervention', 'paiement']);
        $table->unsignedBigInteger('entite_id');
        $table->enum('statut_sync', ['en_attente', 'synchronise', 'erreur'])->default('en_attente');
        $table->string('id_firebase')->nullable();
        $table->timestamp('date_tentative')->useCurrent();
    });
}

public function down(): void
{
    Schema::dropIfExists('logs_sync_firebase');
}
};
