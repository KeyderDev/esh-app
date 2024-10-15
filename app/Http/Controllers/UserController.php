<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\UserStatusChanged;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // Relationship method for permissions
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }

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

        Auth::logout();

        return response()->json(['message' => 'Usuario desconectado.']);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function getAllPermissionsForUser($userId)
    {
        $user = User::with(['permissions' => function($query) {
            $query->select('permissions.id', 'permissions.name');
        }])->findOrFail($userId);
    
        $allPermissions = Permission::all();
    
        return response()->json([
            'user' => $user,
            'allPermissions' => $allPermissions,
        ]);
    }

    public function getAllPermissions($userId) {
        // Get all permissions
        $permissions = Permission::all();
        
        // Map permissions and determine if assigned to user
        $userPermissions = $permissions->map(function ($permission) use ($userId) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'assigned' => DB::table('permission_user')
                    ->where('user_id', $userId)
                    ->where('permission_id', $permission->id)
                    ->exists(), // returns true if the permission is assigned
            ];
        });
    
        return response()->json($userPermissions);
    }
    

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

    public function assignPermission(Request $request, $userId)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $user = User::findOrFail($userId);
        $permission = Permission::findOrFail($request->permission_id);

        $user->permissions()->attach($permission);

        return response()->json(['message' => 'Permiso asignado correctamente']);
    }

    public function revokePermission(Request $request, $userId)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $user = User::findOrFail($userId);
        $permission = Permission::findOrFail($request->permission_id);

        // Revoke the permission from the user
        $user->permissions()->detach($permission);

        return response()->json(['message' => 'Permiso revocado correctamente']);
    }

    public function getUserPermissions($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json($user->permissions);
    }

    public function hasPermission($userId, $permissionId)
    {
        $user = User::findOrFail($userId);
        $hasPermission = $user->permissions()->where('id', $permissionId)->exists();

        return response()->json(['has_permission' => $hasPermission]);
    }

    public function createPermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'nullable|string',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($permission, 201);
    }

    public function deletePermission($id)
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        $permission->delete();
        return response()->json(['message' => 'Permission deleted successfully'], 200);
    }
}
