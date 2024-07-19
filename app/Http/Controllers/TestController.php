<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\UserStatusChanged;

class TestController extends Controller
{
    public function testEvent(Request $request)
    {
        // Datos de prueba para el evento
        $user = [
            'id' => 1,
            'username' => 'testuser',
            'profile_picture' => 'path/to/picture.jpg',
            'is_online' => true,
            'description' => 'Test user',
            'roles' => []
        ];

        // Despachar el evento
        event(new UserStatusChanged($user));

        // Responder con un mensaje de éxito
        return response()->json(['message' => 'Event sent successfully!']);
    }
}
