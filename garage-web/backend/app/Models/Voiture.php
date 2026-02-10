<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    use HasFactory;

    protected $table = 'voitures';

    protected $fillable = [
        'utilisateur_id',
        'marque',
        'modele',
        'immatriculation',
        'description_panne',
        'statut',
    ];

    protected $casts = [
        'statut' => 'string',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }
}
