<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\UserStatusChanged;

class UserController extends Controller
{
    // Update online status
    public function updateOnlineStatus(Request $request)
    {
        $request->validate(['is_online' => 'required|boolean']);
    
        $user = Auth::user();
        if (!$user instanceof User) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        \Log::info('Attempting to update online status for user: ' . $user->id . ' to ' . $request->input('is_online'));
        $user->is_online = $request->is_online;
        \Log::info('Valor recibido para is_online:', ['is_online' => $request->input('is_online')]);
    
        $saved = $user->save();
        \Log::info('User save result: ' . ($saved ? 'success' : 'failed'));
    
        \Log::info('Broadcasting UserStatusChanged event for user: ', $user->toArray());
        broadcast(new UserStatusChanged($user))->toOthers();
    
        \Log::info('Online status updated for user: ' . $user->id . ' to ' . $user->is_online);
    
        return response()->json(['message' => 'Estado Real time actualizado']);
    }
    
    public function getOnlineUsers()
    {
        $users = User::where('is_online', true)
            ->get(['id', 'username', 'profile_picture', 'description']);

        return response()->json($users);
    }

    // Get offline users
    public function getOfflineUsers()
    {
        $users = User::where('is_online', false)
            ->get(['id', 'username', 'profile_picture']);

        return response()->json($users);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->is_online = 0;
            $user->save();
        }
    
        Auth::logout(); // Cierra la sesión del usuario autenticado
    
        return response()->json(['message' => 'Usuario desconectado.']);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Update user description
    public function update(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string',
        ]);

        $user = $request->user();
        $user->description = $request->description;
        $user->save();

        return response()->json($user);
    }

    // Get all users
    public function getAllUsers()
    {
        $users = User::get(['id', 'username', 'profile_picture', 'description', 'is_online', 'created_at']);
        return response()->json($users);
    }
    
    public function destroy($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
