<?php

namespace App\Models;

use App\Enums\ContentType;
use App\Enums\Difficulty;
use App\Enums\MaterialStatus;
use Database\Factories\MaterialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'title', 'slug', 'description', 'content', 'thumbnail', 'content_type',
    'education_level_id', 'department_id', 'subject_id', 'category',
    'difficulty', 'status', 'scene_config', 'author_id',
])]
class Material extends Model
{
    /** @use HasFactory<MaterialFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'content_type' => ContentType::class,
            'difficulty' => Difficulty::class,
            'status' => MaterialStatus::class,
            'scene_config' => 'array',
        ];
    }

    public function educationLevel(): BelongsTo
    {
        return $this->belongsTo(EducationLevel::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class)->orderBy('order');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function scopePublished($query)
    {
        return $query->where('status', MaterialStatus::Published);
    }
}
