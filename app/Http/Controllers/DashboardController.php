<?php

namespace App\Http\Controllers;

use App\Enums\ProgressStatus;
use App\Models\Department;
use App\Models\Material;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        if ($user->isTeacher()) {
            return $this->teacherDashboard();
        }

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        return $this->studentDashboard();
    }

    private function studentDashboard(): Response
    {
        $user = Auth::user();

        $continueLearning = $user->progress()
            ->where('status', ProgressStatus::InProgress)
            ->with('material.department')
            ->latest('last_activity_at')
            ->take(3)
            ->get();

        $completedIds = $user->progress()->where('status', ProgressStatus::Completed)->pluck('material_id');

        $recommended = Material::published()
            ->with(['department', 'educationLevel'])
            ->withCount('lessons')
            ->when($user->department_id, fn ($q) => $q->where('department_id', $user->department_id))
            ->whereNotIn('id', $user->progress()->pluck('material_id'))
            ->take(4)
            ->get();

        if ($recommended->isEmpty()) {
            $recommended = Material::published()->with(['department', 'educationLevel'])->withCount('lessons')->take(4)->get();
        }

        $recent = Material::published()->with(['department', 'educationLevel'])->withCount('lessons')->latest()->take(4)->get();

        $completed = Material::published()->with(['department', 'educationLevel'])->withCount('lessons')->whereIn('id', $completedIds)->get();

        $totalMaterials = Material::published()->count();
        $percentOverall = $totalMaterials > 0
            ? (int) round(($completedIds->count() / $totalMaterials) * 100)
            : 0;

        return Inertia::render('Dashboard/Student', compact(
            'continueLearning', 'recommended', 'recent', 'completed', 'percentOverall'
        ));
    }

    private function teacherDashboard(): Response
    {
        $user = Auth::user();

        $materials = $user->materials()->with('department')->withCount(['progress', 'comments'])->latest()->get();

        return Inertia::render('Dashboard/Teacher', compact('materials'));
    }

    private function adminDashboard(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'usersCount' => User::count(),
            'materialsCount' => Material::count(),
            'departmentsCount' => Department::count(),
        ]);
    }
}
