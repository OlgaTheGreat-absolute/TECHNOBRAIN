<?php

namespace Database\Factories;

use App\Models\GameQuestion;
use App\Models\GameRoom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameQuestion>
 */
class GameQuestionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'game_room_id' => GameRoom::factory(),
            'question' => fake()->sentence().'?',
            'options' => ['Jawaban A', 'Jawaban B', 'Jawaban C', 'Jawaban D'],
            'correct_index' => 0,
            'seconds' => null,
            'order' => 0,
        ];
    }
}
