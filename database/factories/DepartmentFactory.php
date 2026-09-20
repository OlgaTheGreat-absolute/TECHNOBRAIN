<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\EducationLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement(['TJKT', 'PPLG', 'DKV', 'Informatika', 'Sistem Informasi', 'Akuntansi']);

        return [
            'education_level_id' => EducationLevel::factory(),
            'name' => $name,
            'slug' => str($name)->slug(),
        ];
    }
}
