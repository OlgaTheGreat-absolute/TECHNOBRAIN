<?php

namespace Database\Factories;

use App\Enums\ContentType;
use App\Enums\Difficulty;
use App\Enums\MaterialStatus;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Material>
 */
class MaterialFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => str($title)->slug(),
            'description' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'content_type' => fake()->randomElement(ContentType::cases()),
            'education_level_id' => EducationLevel::factory(),
            'department_id' => Department::factory(),
            'category' => fake()->word(),
            'difficulty' => fake()->randomElement(Difficulty::cases()),
            'status' => MaterialStatus::Published,
            'author_id' => User::factory()->teacher(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['status' => MaterialStatus::Draft]);
    }
}
