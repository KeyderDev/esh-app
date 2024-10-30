<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelsAndMessagesTables extends Migration
{
    public function up()
    {
        // Tabla de canales
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->integer('order')->default(0);  
            $table->timestamps();
        });

        // Tabla de mensajes
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->constrained()->onDelete('cascade'); 
            $table->foreignId('user_id')->constrained()->onDelete('cascade');    
            $table->text('content')->nullable();
            $table->timestamps();
            $table->string('image')->nullable(); 
            $table->string('gif_url')->nullable(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('channels');
    }
}
