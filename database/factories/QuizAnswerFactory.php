<?php

namespace Database\Factories;

use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizAnswer>
 */
class QuizAnswerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'quiz_question_id' => QuizQuestion::factory(),
            'answer_text' => fake()->words(3, true),
            'is_correct' => false,
            'order' => 0,
        ];
    }

    public function correct(): static
    {
        return $this->state(fn (array $attributes) => ['is_correct' => true]);
    }
}
