<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'channel_id', 'user_id']; // Propiedades que se pueden asignar de forma masiva

    // Relación con el canal
    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }

    // Relación con el usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
