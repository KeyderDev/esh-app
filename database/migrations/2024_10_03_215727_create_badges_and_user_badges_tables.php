<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBadgesAndUserBadgesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Crear la tabla de insignias (badges)
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la insignia
            $table->string('icon'); // Ruta o URL del ícono de la insignia
            $table->timestamps();
        });

        // Crear la tabla pivot para asociar usuarios con insignias (user_badges)
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con usuarios
            $table->foreignId('badge_id')->constrained()->onDelete('cascade'); // Relación con insignias
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
    }
}
