<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture']);
    Route::get('/data', [ApiController::class, 'getData']);
});
