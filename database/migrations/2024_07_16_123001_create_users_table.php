<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('api_token')->nullable(); // Adds the API token
            $table->string('profile_picture')->nullable();
            $table->boolean('is_online')->default(false);
            $table->text('description')->nullable();
            $table->string('spotify_access_token')->nullable(); 
            $table->timestamps();
        });
    }

    public function down()
    {
        // Disable foreign key checks
        Schema::disableForeignKeyConstraints();

        // Drop the table
        Schema::dropIfExists('users');

        // Enable foreign key checks
        Schema::enableForeignKeyConstraints();
    }
}
