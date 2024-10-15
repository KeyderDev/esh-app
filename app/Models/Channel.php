<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Channel extends Model
{
    use HasFactory;

    protected $fillable = ['name']; // Agrega aquí otros atributos que desees permitir en la asignación masiva

    // Relación con los mensajes
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
