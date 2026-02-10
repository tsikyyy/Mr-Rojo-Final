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
    Schema::create('types_reparation', function (Blueprint $table) {
        $table->id();
        $table->string('nom')->unique();
        $table->decimal('prix', 10, 2);
        $table->integer('duree_secondes');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('types_reparation');
}
};
