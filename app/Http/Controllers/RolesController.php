<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission; // Asegúrate de tener este modelo
use Illuminate\Http\Request;
use App\Models\User;

class RolesController extends Controller
{
    // Método para crear un nuevo rol
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $role = Role::create([
            'name' => $request->name,
        ]);

        return response()->json($role, 201);
    }

    // Método para obtener todos los roles
    public function index()
    {
        return Role::with('permissions')->get(); // Devuelve roles con permisos
    }

    // Método para obtener permisos de un rol específico
    public function showPermissions($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all(); // Obtener todos los permisos
        return response()->json(['role' => $role, 'permissions' => $permissions]);
    }

    // Método para asignar un permiso a un rol
    public function assignPermission(Request $request, $id)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id', // Validar que el permiso existe
        ]);

        $role = Role::findOrFail($id);
        $role->permissions()->syncWithoutDetaching([$request->permission_id]); // Asignar permiso

        return response()->json(['message' => 'Permiso asignado.']);
    }
    public function removePermission(Request $request, $id)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id', // Validar que el permiso existe
        ]);

        $role = Role::findOrFail($id);
        $role->permissions()->detach($request->permission_id); // Eliminar permiso

        return response()->json(['message' => 'Permiso eliminado.']);
    }

    // UserController.php

public function assignRole(Request $request, User $user)
{
    $request->validate([
        'role_id' => 'required|exists:roles,id',
    ]);

    $user->roles()->attach($request->role_id); // O usar attach en un modelo de relación

    return response()->json(['message' => 'Rol asignado correctamente.']);
}

public function destroy($id)
{
    $role = Role::find($id);
    
    if (!$role) {
        return response()->json(['message' => 'Rol no encontrado'], 404);
    }

    $role->delete(); // Eliminar el rol

    return response()->json(['message' => 'Rol eliminado correctamente'], 200);
}



}
