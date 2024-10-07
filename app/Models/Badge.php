<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['name', 'icon'];

    // Relación muchos a muchos entre Badge y User
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_badges');
    }
}
