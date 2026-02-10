<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SlotGarage extends Model
{
    use HasFactory;

    protected $table = 'slots_garage';

    protected $fillable = [
        'nom',
        'disponible',
    ];

    protected $casts = [
        'disponible' => 'boolean',
    ];

    public function interventions()
    {
        return $this->hasMany(Intervention::class, 'slot_id');
    }
}
