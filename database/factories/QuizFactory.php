<?php

namespace Database\Factories;

use App\Models\Material;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quiz>
 */
class QuizFactory extends Factory
{
    public function definition(): array
    {
        return [
            'material_id' => Material::factory(),
            'title' => 'Quiz '.fake()->words(2, true),
            'description' => fake()->sentence(),
        ];
    }
}
