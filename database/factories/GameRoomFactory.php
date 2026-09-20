<?php

namespace Database\Factories;

use App\Enums\GameStatus;
use App\Models\GameRoom;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameRoom>
 */
class GameRoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => GameRoom::generateCode(),
            'title' => fake()->sentence(3),
            'host_id' => User::factory(),
            'status' => GameStatus::Lobby,
            'current_question_index' => -1,
            'default_seconds' => 20,
        ];
    }
}
