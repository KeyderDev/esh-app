<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotifyController;
use App\Http\Controllers; // Asegúrate de importar Controller


Route::get('/', function () {
    return view('welcome'); 
});

Route::get('/auth/spotify', [SpotifyController::class, 'redirectToSpotify']);
Route::get('/auth/spotify/callback', [SpotifyController::class, 'handleSpotifyCallback']);
Route::get('/test/spotify', [SpotifyController::class, 'redirectToSpotify']);
Route::get('/spotify/current-song', [SpotifyController::class, 'getCurrentSong']);


Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');

