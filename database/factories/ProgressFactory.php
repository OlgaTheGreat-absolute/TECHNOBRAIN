<?php

namespace Database\Factories;

use App\Enums\ProgressStatus;
use App\Models\Material;
use App\Models\Progress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Progress>
 */
class ProgressFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'material_id' => Material::factory(),
            'status' => ProgressStatus::InProgress,
            'percent' => fake()->numberBetween(10, 90),
            'last_activity_at' => now(),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProgressStatus::Completed,
            'percent' => 100,
            'completed_at' => now(),
        ]);
    }
}
