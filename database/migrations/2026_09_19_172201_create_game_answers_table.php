<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_participant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_question_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('selected_index')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('points_awarded')->default(0);
            $table->unsignedInteger('time_taken_ms')->nullable();
            $table->timestamps();

            $table->unique(['game_participant_id', 'game_question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_answers');
    }
};
