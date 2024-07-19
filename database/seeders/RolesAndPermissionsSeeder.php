<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'edit content']);
        Permission::create(['name' => 'create channels']);
    }
}
