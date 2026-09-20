<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class QuizResultController extends Controller
{
    public function index(): Response
    {
        $query = Auth::user()->isAdmin()
            ? Material::query()
            : Auth::user()->materials();

        $materials = $query
            ->whereHas('quizzes')
            ->with(['author', 'quizzes' => fn ($quizzes) => $quizzes->withCount('attempts')])
            ->latest()
            ->get();

        return Inertia::render('Teacher/Grades/Index', compact('materials'));
    }

    public function show(Quiz $quiz): Response
    {
        abort_unless($quiz->material->isManageableBy(Auth::user()), 403);

        $quiz->load('material.author');

        $attempts = $quiz->attempts()->with('user')->orderBy('completed_at')->get();

        return Inertia::render('Teacher/Grades/Show', compact('quiz', 'attempts'));
    }
}
