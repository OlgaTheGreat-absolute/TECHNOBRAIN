<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(): Response
    {
        $subjects = Subject::with('department.educationLevel')->withCount('materials')->orderBy('name')->get();

        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects,
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        Subject::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return back()->with('status', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();

        return back()->with('status', 'Mata pelajaran berhasil dihapus.');
    }
}
