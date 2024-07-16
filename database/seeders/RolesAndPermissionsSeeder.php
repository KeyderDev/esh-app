<?php

namespace Database\Seeders; // Asegúrate de incluir esto

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Crear roles
        $adminRole = Role::create(['name' => 'Admin']);
        $userRole = Role::create(['name' => 'User']);

        // Crear permisos
        $manageUsersPermission = Permission::create(['name' => 'manage users']);
        $editContentPermission = Permission::create(['name' => 'edit content']);

        // Asignar permisos a roles
        $adminRole->permissions()->attach($manageUsersPermission);
        $adminRole->permissions()->attach($editContentPermission);
    }
}
