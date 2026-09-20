<?php

namespace App\Http\Controllers\Teacher;

use App\Enums\LessonType;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LessonController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $this->authorizeOwner($material);

        $validated = $request->validate([
            'type' => ['required', Rule::enum(LessonType::class)],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:2000'],
            'video_url' => ['required_if:type,video', 'nullable', 'url', 'max:500'],
            'pdf_url' => ['required_if:type,pdf', 'nullable', 'url', 'max:500'],
        ]);

        $quizId = null;

        if ($validated['type'] === LessonType::Quiz->value) {
            $quizId = $material->quizzes()->create(['title' => $validated['title']])->id;
        }

        $material->lessons()->create([
            ...$validated,
            'quiz_id' => $quizId,
            'order' => $material->lessons()->count(),
        ]);

        return back()->with('status', 'Konten pembelajaran ditambahkan.');
    }

    public function update(Request $request, Material $material, Lesson $lesson): RedirectResponse
    {
        $this->authorizeOwner($material);
        abort_unless($lesson->material_id === $material->id, 404);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:2000'],
            'video_url' => ['nullable', 'url', 'max:500'],
            'pdf_url' => ['nullable', 'url', 'max:500'],
            'order' => ['required', 'integer', 'min:0'],
        ]);

        $lesson->update($validated);

        if ($lesson->quiz_id) {
            $lesson->quiz()->update(['title' => $validated['title']]);
        }

        return back()->with('status', 'Konten pembelajaran diperbarui.');
    }

    public function destroy(Material $material, Lesson $lesson): RedirectResponse
    {
        $this->authorizeOwner($material);
        abort_unless($lesson->material_id === $material->id, 404);

        $quiz = $lesson->quiz;
        $lesson->delete();
        $quiz?->delete();

        return back()->with('status', 'Konten pembelajaran dihapus.');
    }

    private function authorizeOwner(Material $material): void
    {
        abort_unless($material->isManageableBy(Auth::user()), 403);
    }
}
