<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizResultsTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_results_for_their_own_quiz(): void
    {
        $teacher = User::factory()->teacher()->create();
        $material = Material::factory()->create(['author_id' => $teacher->id]);
        $quiz = Quiz::factory()->create(['material_id' => $material->id]);
        $student = User::factory()->student()->create();
        QuizAttempt::factory()->create(['quiz_id' => $quiz->id, 'user_id' => $student->id, 'score' => 2, 'total_questions' => 2]);

        $response = $this->actingAs($teacher)->get(route('teacher.grades.show', $quiz));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Teacher/Grades/Show')
            ->where('attempts.0.user.id', $student->id)
        );
    }

    public function test_teacher_cannot_view_results_for_another_teachers_quiz(): void
    {
        $teacher = User::factory()->teacher()->create();
        $otherTeachersQuiz = Quiz::factory()->create();

        $response = $this->actingAs($teacher)->get(route('teacher.grades.show', $otherTeachersQuiz));

        $response->assertForbidden();
    }

    public function test_admin_can_view_results_for_any_quiz(): void
    {
        $admin = User::factory()->admin()->create();
        $quiz = Quiz::factory()->create();

        $response = $this->actingAs($admin)->get(route('teacher.grades.show', $quiz));

        $response->assertOk();
    }

    public function test_admin_can_edit_another_teachers_material(): void
    {
        $admin = User::factory()->admin()->create();
        $material = Material::factory()->create();

        $response = $this->actingAs($admin)->get(route('teacher.materials.edit', $material));

        $response->assertOk();
    }
}
