<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_access_teacher_material_management(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('teacher.materials.index'));

        $response->assertForbidden();
    }

    public function test_student_cannot_access_admin_panel(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('admin.users.index'));

        $response->assertForbidden();
    }

    public function test_teacher_can_create_a_material(): void
    {
        $teacher = User::factory()->teacher()->create();
        $material = Material::factory()->make();

        $response = $this->actingAs($teacher)->post(route('teacher.materials.store'), [
            'title' => $material->title,
            'description' => $material->description,
            'content' => $material->content,
            'content_type' => $material->content_type->value,
            'education_level_id' => $material->education_level_id,
            'department_id' => $material->department_id,
            'difficulty' => $material->difficulty->value,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('materials', [
            'title' => $material->title,
            'author_id' => $teacher->id,
        ]);
    }

    public function test_teacher_cannot_edit_another_teachers_material(): void
    {
        $teacher = User::factory()->teacher()->create();
        $otherTeachersMaterial = Material::factory()->create();

        $response = $this->actingAs($teacher)->get(route('teacher.materials.edit', $otherTeachersMaterial));

        $response->assertForbidden();
    }

    public function test_admin_can_view_user_management(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
    }
}
