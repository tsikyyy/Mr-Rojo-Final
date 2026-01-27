<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'email',
        'mot_de_passe',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    /**
     * IMPORTANT :
     * Dire à Laravel que le mot de passe
     * est stocké dans la colonne mot_de_passe
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}
