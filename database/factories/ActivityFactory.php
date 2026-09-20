<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Material;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'material_id' => Material::factory(),
            'title' => fake()->sentence(3),
            'instruction' => fake()->sentence(),
            'target_key' => fake()->word(),
            'information' => fake()->paragraph(),
            'order' => 0,
        ];
    }
}
