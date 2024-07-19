<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RolesController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/roles/{id}/permissions', [RolesController::class, 'showPermissions']);
Route::post('/roles/{id}/permissions', [RolesController::class, 'assignPermission']);
Route::post('/roles', [RolesController::class, 'store']); // Para crear roles
Route::delete('/roles/{id}/permissions', [RolesController::class, 'removePermission']);
Route::post('/users/{user}/roles', [UserController::class, 'assignRole']);
Route::delete('/roles/{id}', [RolesController::class, 'destroy']);

// Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::post('/update-online-status', [UserController::class, 'updateOnlineStatus']);
    Route::get('/users/online', [UserController::class, 'getOnlineUsers']);
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture']);
    Route::get('/data', [ApiController::class, 'getData']);
    Route::get('/users/offline', [UserController::class, 'getOfflineUsers']);
    Route::get('/user', [UserController::class, 'show']);
    Route::post('/user', [UserController::class, 'update']);
    Route::get('/users', [UserController::class, 'getAllUsers']);
});

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/roles', 'RoleController@index');
});

