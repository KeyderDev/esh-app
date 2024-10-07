<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\UserStatusChanged; // Asegúrate de incluir el evento


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
            ->with('roles:id,name') // Cargar solo id y name de roles
            ->get(['id', 'username', 'profile_picture', 'description']);

        $formattedUsers = $users->map(function ($user) {
            $user->roles = $user->roles->pluck('name'); // Extraer solo los nombres
            return $user->only(['id', 'username', 'profile_picture', 'description', 'roles']); // Solo devolver campos relevantes
        });

        return response()->json($formattedUsers);
    }

    // Get offline users
    public function getOfflineUsers()
    {
        $users = User::where('is_online', false)
            ->with('roles:id,name') // Cargar solo id y name de roles
            ->get(['id', 'username', 'profile_picture']);

        $formattedUsers = $users->map(function ($user) {
            $user->roles = $user->roles->pluck('name'); // Extraer solo los nombres
            return $user->only(['id', 'username', 'profile_picture', 'roles']); // Solo devolver campos relevantes
        });

        return response()->json($formattedUsers);
    }

    public function logout(Request $request)
    {
        // Obtén el usuario autenticado
        $user = Auth::user();
        
        // Actualiza el estado del usuario a offline
        if ($user) {
            $user->is_online = 0;
            $user->save();
        }
    
        Auth::logout(); // Cierra la sesión del usuario autenticado
    
        return response()->json(['message' => 'Usuario desconectado.']);
    }
    
    
    
    
    
    
    


    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
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

    // Assign role to a user
    public function assignRole(Request $request, User $user)
    {
        $request->validate(['role_id' => 'required|exists:roles,id']);

        $user->roles()->attach($request->role_id);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    // Get all users with roles
    public function getAllUsers()
    {
        $users = User::with('roles')->get(['id', 'username', 'profile_picture', 'description', 'is_online', 'created_at']);
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
