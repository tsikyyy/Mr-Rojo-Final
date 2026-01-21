<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeReparation extends Model
{
    use HasFactory;

    protected $table = 'types_reparation';

    protected $fillable = [
        'nom',
        'prix',
        'duree_secondes',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'duree_secondes' => 'integer',
    ];

    public function interventions()
    {
        return $this->hasMany(Intervention::class, 'type_reparation_id');
    }
}
