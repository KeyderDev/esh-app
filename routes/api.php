<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::post('/update-online-status', [UserController::class, 'updateOnlineStatus']);
    Route::get('/users/online', [UserController::class, 'getOnlineUsers']);
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture']);
    Route::get('/data', [ApiController::class, 'getData']);
    Route::get('/users/offline', [UserController::class, 'getOfflineUsers']);
    Route::get('/user', [UserController::class, 'show']);
    Route::post('/user', [UserController::class, 'update']);
});
