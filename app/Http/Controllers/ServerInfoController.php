<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServerInfoController extends Controller
{
    public function getDiskSpace()
    {
        // Obtén el espacio usado y disponible (esto es un ejemplo)
        $totalSpace = disk_total_space('/');
        $freeSpace = disk_free_space('/');
        $usedSpace = $totalSpace - $freeSpace;
    
        // Convierte los bytes a gigabytes
        $totalSpaceInGB = round($totalSpace / (1024 ** 3), 2);
        $usedSpaceInGB = round($usedSpace / (1024 ** 3), 2);
        $freeSpaceInGB = round($freeSpace / (1024 ** 3), 2);
    
        // Verifica si los datos están bien
        return response()->json([
            'used' => $usedSpaceInGB,
            'total' => $totalSpaceInGB,
            'free' => $freeSpaceInGB
        ]);
    }
}


?>