<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('powerup')->nullable();
            $table->boolean('powerup_used')->default(false);
            $table->unsignedInteger('score')->default(0);
            $table->timestamps();

            $table->unique(['game_room_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_participants');
    }
};
