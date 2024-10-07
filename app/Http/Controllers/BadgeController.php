<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Badge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    public function createBadge(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación para imagen
        ]);
    
        try {
            // Almacena la imagen y obtén la ruta
            $path = $request->file('icon')->store('badges', 'public'); // Almacena en storage/app/public/badges
    
            $badge = Badge::create([
                'name' => $request->name,
                'icon' => $path, // Guarda la ruta de la imagen
            ]);
    
            return response()->json([
                'message' => 'Badge created successfully',
                'badge' => $badge,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error creating badge: ' . $e->getMessage(),
            ], 500); // Internal Server Error
        }
    }
    
    // Obtener todas las insignias
public function getAllBadges()
{
    $badges = Badge::all(); // Obtiene todas las insignias de la base de datos
    return response()->json($badges, 200);
}


    // Asignar una insignia a un usuario
    public function assignBadgeToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'badge_id' => 'required|exists:badges,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $badge = Badge::findOrFail($request->badge_id);

        // Verificar si el usuario ya tiene la insignia asignada
        if ($user->badges->contains($badge)) {
            return response()->json(['message' => 'Badge already assigned to this user'], 409); // 409 Conflict
        }

        $user->badges()->attach($badge);

        return response()->json(['message' => 'Badge assigned successfully'], 200);
    }

    // Obtener las insignias de un usuario
    public function getUserBadges($userId)
    {
        $user = User::with('badges')->findOrFail($userId);
        
        return response()->json([
            'username' => $user->username,
            'badges' => $user->badges // Deberías recibir un array de insignias
        ], 200);
    }
    
}
