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
    Schema::create('voitures', function (Blueprint $table) {
        $table->id();
        $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
        $table->string('marque');
        $table->string('modele');
        $table->string('immatriculation')->unique();
        $table->text('description_panne')->nullable();
        $table->enum('statut', ['en_attente', 'en_reparation', 'terminee', 'payee'])->default('en_attente');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('voitures');
}
};
