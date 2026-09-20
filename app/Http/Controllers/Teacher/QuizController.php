<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        abort_unless($material->author_id === Auth::id(), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $material->quizzes()->create($validated);

        return back()->with('status', 'Quiz berhasil dibuat.');
    }

    public function destroy(Material $material, Quiz $quiz): RedirectResponse
    {
        abort_unless($material->author_id === Auth::id(), 403);
        abort_unless($quiz->material_id === $material->id, 404);

        $quiz->delete();

        return back()->with('status', 'Quiz berhasil dihapus.');
    }

    public function storeQuestion(Request $request, Material $material, Quiz $quiz): RedirectResponse
    {
        abort_unless($material->author_id === Auth::id(), 403);
        abort_unless($quiz->material_id === $material->id, 404);

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answers' => ['required', 'array', 'min:2'],
            'answers.*' => ['required', 'string', 'max:255'],
            'correct' => ['required', 'integer', 'min:0'],
        ]);

        $question = $quiz->questions()->create([
            'question' => $validated['question'],
            'order' => $quiz->questions()->count(),
        ]);

        foreach ($validated['answers'] as $index => $answerText) {
            $question->answers()->create([
                'answer_text' => $answerText,
                'is_correct' => (int) $validated['correct'] === $index,
                'order' => $index,
            ]);
        }

        return back()->with('status', 'Pertanyaan berhasil ditambahkan.');
    }

    public function updateQuestion(Request $request, Material $material, Quiz $quiz, QuizQuestion $question): RedirectResponse
    {
        abort_unless($material->author_id === Auth::id(), 403);
        abort_unless($quiz->material_id === $material->id, 404);
        abort_unless($question->quiz_id === $quiz->id, 404);

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answers' => ['required', 'array', 'min:2'],
            'answers.*' => ['required', 'string', 'max:255'],
            'correct' => ['required', 'integer', 'min:0'],
        ]);

        $question->update(['question' => $validated['question']]);
        $question->answers()->delete();

        foreach ($validated['answers'] as $index => $answerText) {
            $question->answers()->create([
                'answer_text' => $answerText,
                'is_correct' => (int) $validated['correct'] === $index,
                'order' => $index,
            ]);
        }

        return back()->with('status', 'Pertanyaan berhasil diperbarui.');
    }

    public function destroyQuestion(Material $material, Quiz $quiz, QuizQuestion $question): RedirectResponse
    {
        abort_unless($material->author_id === Auth::id(), 403);
        abort_unless($quiz->material_id === $material->id, 404);
        abort_unless($question->quiz_id === $quiz->id, 404);

        $question->delete();

        return back()->with('status', 'Pertanyaan berhasil dihapus.');
    }
}
