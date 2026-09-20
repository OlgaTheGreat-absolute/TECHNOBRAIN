<?php

namespace App\Models;

use Database\Factories\EducationLevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug'])]
class EducationLevel extends Model
{
    /** @use HasFactory<EducationLevelFactory> */
    use HasFactory;

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}
