<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // Esta es tu vista inicial
});

Route::get('/{any}', function () {
    return view('app'); // Aquí manejas todas las rutas de Vue
})->where('any', '.*');

