<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function show(Material $material, ?Lesson $lesson = null): Response
    {
        abort_unless(
            $material->status->value === 'published' || Auth::id() === $material->author_id,
            404
        );

        abort_if($lesson && $lesson->material_id !== $material->id, 404);

        $material->load(['lessons.quiz.questions.answers']);

        $completedIds = LessonCompletion::where('user_id', Auth::id())
            ->whereIn('lesson_id', $material->lessons->pluck('id'))
            ->pluck('lesson_id');

        $currentLesson = $lesson
            ?? $material->lessons->first(fn (Lesson $item) => ! $completedIds->contains($item->id))
            ?? $material->lessons->first();

        $total = $material->lessons->count();
        $percent = $total > 0 ? (int) round($completedIds->count() / $total * 100) : 0;

        return Inertia::render('Materials/Learn', [
            'material' => $material->only(['id', 'title', 'slug']),
            'lessons' => $material->lessons->map(fn (Lesson $item) => [
                'id' => $item->id,
                'type' => $item->type->value,
                'title' => $item->title,
                'order' => $item->order,
                'completed' => $completedIds->contains($item->id),
            ])->values(),
            'currentLesson' => $currentLesson ? $this->presentLesson($currentLesson) : null,
            'progressPercent' => $percent,
        ]);
    }

    public function complete(Material $material, Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->material_id === $material->id, 404);

        $lesson->completeFor(Auth::user());

        $next = $material->lessons()->where('order', '>', $lesson->order)->first();

        return redirect()->route('materials.learn', [$material, $next ?? $lesson]);
    }

    private function presentLesson(Lesson $lesson): array
    {
        return [
            'id' => $lesson->id,
            'type' => $lesson->type->value,
            'title' => $lesson->title,
            'body' => $lesson->body,
            'video_url' => $lesson->video_url,
            'pdf_url' => $lesson->pdf_url,
            'quiz' => $lesson->quiz ? [
                'id' => $lesson->quiz->id,
                'title' => $lesson->quiz->title,
                'description' => $lesson->quiz->description,
                'questions' => $lesson->quiz->questions->map(fn ($question) => [
                    'id' => $question->id,
                    'question' => $question->question,
                    'answers' => $question->answers->map(fn ($answer) => [
                        'id' => $answer->id,
                        'answer_text' => $answer->answer_text,
                    ]),
                ]),
            ] : null,
        ];
    }
}
