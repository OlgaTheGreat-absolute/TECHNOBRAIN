<?php

namespace Database\Factories;

use App\Models\EducationLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EducationLevel>
 */
class EducationLevelFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement(['SMK', 'Universitas', 'SMP', 'Professional']);

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
        ];
    }
}
