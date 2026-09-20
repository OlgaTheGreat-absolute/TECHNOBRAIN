<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code', 8)->unique();
            $table->string('title');
            $table->foreignId('host_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('lobby');
            $table->integer('current_question_index')->default(-1);
            $table->unsignedInteger('default_seconds')->default(20);
            $table->timestamp('current_question_started_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_rooms');
    }
};
