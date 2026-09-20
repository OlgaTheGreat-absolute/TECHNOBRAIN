<?php

namespace Tests\Feature;

use App\Enums\LessonType;
use App\Enums\ProgressStatus;
use App\Models\Lesson;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaterialLearningFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_complete_a_lesson_and_progress_updates(): void
    {
        $user = User::factory()->student()->create();
        $material = Material::factory()->create();
        $lessonOne = Lesson::factory()->for($material)->create(['type' => LessonType::Video, 'order' => 0]);
        Lesson::factory()->for($material)->create(['type' => LessonType::Video, 'order' => 1]);

        $response = $this->actingAs($user)->post(route('materials.lessons.complete', [$material, $lessonOne]));

        $response->assertRedirect();
        $this->assertDatabaseHas('lesson_completions', [
            'lesson_id' => $lessonOne->id,
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('progress', [
            'user_id' => $user->id,
            'material_id' => $material->id,
            'percent' => 50,
            'status' => ProgressStatus::InProgress->value,
        ]);
    }

    public function test_guest_is_redirected_to_login_when_visiting_the_learn_page(): void
    {
        $material = Material::factory()->create();

        $response = $this->get(route('materials.learn', $material));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_comment_on_a_material(): void
    {
        $user = User::factory()->student()->create();
        $material = Material::factory()->create();

        $response = $this->actingAs($user)->post(route('materials.comments.store', $material), [
            'body' => 'Materi yang sangat membantu!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'user_id' => $user->id,
            'material_id' => $material->id,
            'body' => 'Materi yang sangat membantu!',
        ]);
    }

    public function test_quiz_attempt_is_scored_correctly_and_marks_material_complete(): void
    {
        $user = User::factory()->student()->create();
        $material = Material::factory()->create();
        $quiz = Quiz::factory()->for($material)->create();

        $question = QuizQuestion::factory()->for($quiz)->create();
        $correctAnswer = $question->answers()->create(['answer_text' => 'Benar', 'is_correct' => true, 'order' => 0]);
        $question->answers()->create(['answer_text' => 'Salah', 'is_correct' => false, 'order' => 1]);

        $response = $this->actingAs($user)->post(route('quizzes.attempt', $quiz), [
            'answers' => [$question->id => $correctAnswer->id],
        ]);

        $response->assertRedirect(route('materials.show', $material));
        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'user_id' => $user->id,
            'score' => 1,
            'total_questions' => 1,
        ]);
        $this->assertDatabaseHas('progress', [
            'user_id' => $user->id,
            'material_id' => $material->id,
            'status' => ProgressStatus::Completed->value,
        ]);
    }

    public function test_quiz_attempt_linked_to_a_lesson_completes_only_that_lesson(): void
    {
        $user = User::factory()->student()->create();
        $material = Material::factory()->create();
        $quiz = Quiz::factory()->for($material)->create();
        $lesson = Lesson::factory()->for($material)->create(['type' => LessonType::Quiz, 'quiz_id' => $quiz->id, 'order' => 0]);
        Lesson::factory()->for($material)->create(['type' => LessonType::Video, 'order' => 1]);

        $question = QuizQuestion::factory()->for($quiz)->create();
        $correctAnswer = $question->answers()->create(['answer_text' => 'Benar', 'is_correct' => true, 'order' => 0]);
        $question->answers()->create(['answer_text' => 'Salah', 'is_correct' => false, 'order' => 1]);

        $response = $this->actingAs($user)->post(route('quizzes.attempt', $quiz), [
            'answers' => [$question->id => $correctAnswer->id],
        ]);

        $response->assertRedirect(route('materials.learn', [$material, $lesson]));
        $this->assertDatabaseHas('lesson_completions', [
            'lesson_id' => $lesson->id,
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('progress', [
            'user_id' => $user->id,
            'material_id' => $material->id,
            'percent' => 50,
            'status' => ProgressStatus::InProgress->value,
        ]);
    }
}
