<?php

// User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'password',
        'api_token',
        'profile_picture',
        'is_online', 
        'description',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'api_token' => 'string',
    ];

    // Relación con roles
    public function roles()
    {
        return $this->belongsToMany(Role::class); // Cambia Role::class si tienes un namespace diferente
    }

    // Accesor para obtener solo los nombres de los roles
    public function getRoleNamesAttribute()
    {
        return $this->roles->pluck('name');
    }
}
