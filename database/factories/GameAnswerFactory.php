<?php

namespace Database\Factories;

use App\Models\GameAnswer;
use App\Models\GameParticipant;
use App\Models\GameQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameAnswer>
 */
class GameAnswerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'game_participant_id' => GameParticipant::factory(),
            'game_question_id' => GameQuestion::factory(),
            'selected_index' => 0,
            'is_correct' => true,
            'points_awarded' => 1000,
            'time_taken_ms' => 2000,
        ];
    }
}
