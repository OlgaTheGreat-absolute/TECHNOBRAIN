<?php

namespace App\Models;

use App\Enums\LessonType;
use App\Enums\ProgressStatus;
use Database\Factories\LessonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['material_id', 'type', 'title', 'body', 'video_url', 'pdf_url', 'quiz_id', 'order'])]
class Lesson extends Model
{
    /** @use HasFactory<LessonFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => LessonType::class,
        ];
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function isCompletedFor(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->completions->contains('user_id', $user->id);
    }

    /**
     * Mark this lesson complete for the given user and recompute the
     * parent material's overall progress from how many of its lessons
     * are now complete.
     */
    public function completeFor(User $user): void
    {
        LessonCompletion::firstOrCreate(
            ['lesson_id' => $this->id, 'user_id' => $user->id],
            ['completed_at' => now()]
        );

        $totalLessons = Lesson::where('material_id', $this->material_id)->count();
        $completedLessons = LessonCompletion::where('user_id', $user->id)
            ->whereIn('lesson_id', Lesson::where('material_id', $this->material_id)->pluck('id'))
            ->count();

        $percent = $totalLessons > 0 ? (int) round($completedLessons / $totalLessons * 100) : 0;
        $status = match (true) {
            $percent >= 100 => ProgressStatus::Completed,
            $percent > 0 => ProgressStatus::InProgress,
            default => ProgressStatus::NotStarted,
        };

        $user->progress()->updateOrCreate(
            ['material_id' => $this->material_id],
            [
                'status' => $status,
                'percent' => $percent,
                'last_activity_at' => now(),
                'completed_at' => $status === ProgressStatus::Completed ? now() : null,
            ]
        );
    }
}
