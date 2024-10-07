<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelsAndMessagesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tabla de canales
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');  // Nombre del canal
            $table->timestamps();
        });

        // Tabla de mensajes
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->constrained()->onDelete('cascade'); // Relación con canales
            $table->foreignId('user_id')->constrained()->onDelete('cascade');    // Relación con usuarios (Laravel usa `users` por defecto)
            $table->text('content');  // Contenido del mensaje
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
        // Borrar las tablas en orden inverso para evitar problemas de FK
        Schema::dropIfExists('messages');
        Schema::dropIfExists('channels');
    }
}
