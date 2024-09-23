<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\FinanceController;


// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/stocks', [FinanceController::class, 'getStockPrices']);


// Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::prefix('profile')->group(function () {
        Route::post('/picture', [ProfileController::class, 'updateProfilePicture']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/online', [UserController::class, 'getOnlineUsers']);
        Route::get('/offline', [UserController::class, 'getOfflineUsers']);
        Route::get('/', [UserController::class, 'getAllUsers']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::post('/{user}/roles', [UserController::class, 'assignRole']);
        Route::post('/{user}', [UserController::class, 'update']);
    });
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
    Route::get('/api/roles', [RolesController::class, 'index']); // Suponiendo que RoleController es un error tipográfico
});
