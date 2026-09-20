<?php

namespace App\Http\Controllers;

use App\Enums\ProgressStatus;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizAttemptController extends Controller
{
    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $quiz->load('questions.answers');

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['required', 'integer'],
        ]);

        $score = 0;
        $total = $quiz->questions->count();

        foreach ($quiz->questions as $question) {
            $selectedAnswerId = $validated['answers'][$question->id] ?? null;
            $correctAnswer = $question->answers->firstWhere('is_correct', true);

            if ($selectedAnswerId && $correctAnswer && (int) $selectedAnswerId === $correctAnswer->id) {
                $score++;
            }
        }

        $attempt = Auth::user()->quizAttempts()->create([
            'quiz_id' => $quiz->id,
            'score' => $score,
            'total_questions' => $total,
            'answers' => $validated['answers'],
            'completed_at' => now(),
        ]);

        $lesson = Lesson::where('quiz_id', $quiz->id)->first();

        if ($lesson) {
            $lesson->completeFor(Auth::user());

            // Stay on this lesson so the student sees their score before
            // choosing to move on — the Learn page offers a "next" link once
            // quizResult is present.
            return redirect()
                ->route('materials.learn', [$quiz->material, $lesson])
                ->with('quizResult', ['score' => $score, 'total' => $total, 'attempt' => $attempt->id]);
        }

        Auth::user()->progress()->updateOrCreate(
            ['material_id' => $quiz->material_id],
            [
                'status' => ProgressStatus::Completed,
                'percent' => 100,
                'last_activity_at' => now(),
                'completed_at' => now(),
            ]
        );

        return redirect()
            ->route('materials.show', $quiz->material)
            ->with('quizResult', ['score' => $score, 'total' => $total, 'attempt' => $attempt->id]);
    }
}
