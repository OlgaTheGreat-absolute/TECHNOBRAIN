<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subject>
 */
class SubjectFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'department_id' => Department::factory(),
            'name' => $name,
            'slug' => str($name)->slug(),
            'description' => fake()->sentence(),
        ];
    }
}
