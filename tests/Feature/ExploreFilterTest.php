<?php

namespace Tests\Feature;

use App\Enums\ContentType;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExploreFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_materials_by_department(): void
    {
        $smk = EducationLevel::factory()->create(['slug' => 'smk']);
        $tjkt = Department::factory()->for($smk)->create(['slug' => 'tjkt', 'name' => 'TJKT']);
        $pplg = Department::factory()->for($smk)->create(['slug' => 'pplg', 'name' => 'PPLG']);

        Material::factory()->for($smk)->for($tjkt)->create(['title' => 'MikroTik Dasar']);
        Material::factory()->for($smk)->for($pplg)->create(['title' => 'React Fundamental']);

        $response = $this->get('/explore?department=tjkt');

        $response->assertOk();
        $response->assertSee('MikroTik Dasar');
        $response->assertDontSee('React Fundamental');
    }

    public function test_it_searches_materials_by_keyword(): void
    {
        Material::factory()->create(['title' => 'Konfigurasi DHCP MikroTik']);
        Material::factory()->create(['title' => 'Jurnal Akuntansi Dasar']);

        $response = $this->get('/explore?q=DHCP');

        $response->assertOk();
        $response->assertSee('Konfigurasi DHCP MikroTik');
        $response->assertDontSee('Jurnal Akuntansi Dasar');
    }

    public function test_it_filters_materials_by_content_type(): void
    {
        Material::factory()->create(['title' => 'Model 3D Router', 'content_type' => ContentType::ThreeD]);
        Material::factory()->create(['title' => 'Poster Jaringan', 'content_type' => ContentType::Image]);

        $response = $this->get('/explore?content_type=3d');

        $response->assertOk();
        $response->assertSee('Model 3D Router');
        $response->assertDontSee('Poster Jaringan');
    }
}
