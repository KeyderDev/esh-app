<?php

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
        'xp'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'api_token' => 'string',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user'); 
    }

    public function getPermissionNamesAttribute()
    {
        return $this->permissions->pluck('name');
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'user_badges');
    }
}
