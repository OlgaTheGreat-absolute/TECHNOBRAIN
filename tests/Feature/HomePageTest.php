<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_lists_departments_and_published_materials(): void
    {
        $level = EducationLevel::factory()->create(['name' => 'SMK']);
        $department = Department::factory()->for($level)->create(['name' => 'TJKT']);
        $material = Material::factory()->for($level)->for($department)->create(['title' => 'MikroTik Dasar']);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('TJKT');
        $response->assertSee('MikroTik Dasar');
    }

    public function test_home_page_does_not_show_draft_materials(): void
    {
        Material::factory()->draft()->create(['title' => 'Materi Belum Terbit']);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertDontSee('Materi Belum Terbit');
    }
}
