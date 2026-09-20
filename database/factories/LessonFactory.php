<?php

namespace Database\Factories;

use App\Enums\LessonType;
use App\Models\Lesson;
use App\Models\Material;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'material_id' => Material::factory(),
            'type' => LessonType::Video,
            'title' => fake()->sentence(3),
            'body' => fake()->paragraph(),
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'pdf_url' => null,
            'quiz_id' => null,
            'order' => 0,
        ];
    }
}
