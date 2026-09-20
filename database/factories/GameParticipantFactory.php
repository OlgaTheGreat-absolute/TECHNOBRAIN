<?php

namespace Database\Factories;

use App\Models\GameParticipant;
use App\Models\GameRoom;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameParticipant>
 */
class GameParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'game_room_id' => GameRoom::factory(),
            'user_id' => User::factory(),
            'powerup' => null,
            'powerup_used' => false,
            'score' => 0,
        ];
    }
}
