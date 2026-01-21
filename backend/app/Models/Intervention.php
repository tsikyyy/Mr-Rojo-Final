<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $table = 'interventions';

    protected $fillable = [
        'voiture_id',
        'type_reparation_id',
        'slot_id',
        'statut',
        'date_debut',
        'date_fin',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'statut' => 'string',
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    public function typeReparation()
    {
        return $this->belongsTo(TypeReparation::class, 'type_reparation_id');
    }

    public function slot()
    {
        return $this->belongsTo(SlotGarage::class, 'slot_id');
    }
}
