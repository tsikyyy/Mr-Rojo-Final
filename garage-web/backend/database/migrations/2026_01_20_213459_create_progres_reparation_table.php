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
    Schema::create('progres_reparation', function (Blueprint $table) {
        $table->foreignId('intervention_id')->primary()->constrained('interventions')->onDelete('cascade');
        $table->integer('pourcentage')->default(0);
        $table->timestamp('derniere_maj')->useCurrent()->useCurrentOnUpdate();
    });
}

public function down(): void
{
    Schema::dropIfExists('progres_reparation');
}
};
