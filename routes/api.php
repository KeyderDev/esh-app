<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SpotifyController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/stocks', [FinanceController::class, 'getStockPrices']);
Route::get('channels', [ChannelController::class, 'index']);
Route::post('channels', [ChannelController::class, 'store']);
Route::get('channels/{channel}', [ChannelController::class, 'show']);
Route::post('channels/{channel}/messages', [MessageController::class, 'store']);

// Rutas Privadas
Route::middleware(['auth.api', 'throttle.custom'])->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/update-online-status', [UserController::class, 'updateOnlineStatus']);
    Route::post('/users/description/{user}', [UserController::class, 'update']);
    Route::post('/badges', [BadgeController::class, 'createBadge']); 
    Route::post('/channels/{channel}/messages', [MessageController::class, 'store']);
    Route::post('/assign-badge', [BadgeController::class, 'assignBadgeToUser']); 
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture']);
    Route::get('/data', [ApiController::class, 'getData']);
    Route::get('/spotify/token', [SpotifyController::class, 'getSpotifyToken']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::get('/users/', [UserController::class, 'getAllUsers']);
    Route::get('/channels/{channel}/messages', [MessageController::class, 'index']);
    Route::get('/users/offline', [UserController::class, 'getOfflineUsers']);
    Route::get('/users/online', [UserController::class, 'getOnlineUsers']);
    Route::get('/badges', [BadgeController::class, 'getAllBadges']); 
    Route::get('/user/{id}/badges', [BadgeController::class, 'getUserBadges']); 
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::delete('/channels/{channel}', [ChannelController::class, 'destroy']);
});