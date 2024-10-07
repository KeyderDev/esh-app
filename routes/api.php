<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\BadgeController;
// use App\Http\Controllers\ChannelController;


// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/stocks', [FinanceController::class, 'getStockPrices']);
Route::middleware('auth.api')->post('/logout', [UserController::class, 'logout']);

Route::get('/channels', [ChannelController::class, 'index']);
Route::post('/channels', [ChannelController::class, 'store']);
Route::post('/channels/{channel}/messages', [MessageController::class, 'store']);
Route::delete('/channels/{id}', [ChannelController::class, 'destroy']);

// Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::prefix('profile')->group(function () {
        Route::post('/picture', [ProfileController::class, 'updateProfilePicture']);
    });

    Route::middleware('auth.api')->group(function () {
        Route::post('/badges', [BadgeController::class, 'createBadge']); // Crear una insignia
        Route::post('/assign-badge', [BadgeController::class, 'assignBadgeToUser']); // Asignar insignia a un usuario
        Route::get('/user/{id}/badges', [BadgeController::class, 'getUserBadges']); // Obtener insignias de un usuario
        Route::get('/badges', [BadgeController::class, 'getAllBadges']); // Obtener todas las insignias
    });
    

    //OTras

    Route::prefix('users')->group(function () {
        Route::get('/online', [UserController::class, 'getOnlineUsers']);
        Route::get('/offline', [UserController::class, 'getOfflineUsers']);
        Route::get('/', [UserController::class, 'getAllUsers']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::post('/{user}/roles', [UserController::class, 'assignRole']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
    });

    Route::post('/users/description/{user}', [UserController::class, 'update']);

    Route::post('/update-online-status', [UserController::class, 'updateOnlineStatus']);

    Route::prefix('roles')->group(function () {
        Route::get('/', [RolesController::class, 'index']);
        Route::get('/{id}/permissions', [RolesController::class, 'showPermissions']);
        Route::post('/{id}/permissions', [RolesController::class, 'assignPermission']);
        Route::post('/', [RolesController::class, 'store']);
        Route::delete('/{id}/permissions', [RolesController::class, 'removePermission']);
        Route::delete('/{id}', [RolesController::class, 'destroy']);
    });

    Route::get('/data', [ApiController::class, 'getData']);
});

// Rutas con límite de tasa
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/roles', [RolesController::class, 'index']); 
});
