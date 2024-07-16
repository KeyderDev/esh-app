<?php

namespace Database\Seeders; // Asegúrate de incluir esto

use Illuminate\Database\Seeder;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        $manageUsersPermission = Permission::create(['name' => 'manage users']);
        $editContentPermission = Permission::create(['name' => 'edit content']);
    }
}
