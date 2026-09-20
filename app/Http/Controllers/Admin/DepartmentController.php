<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\EducationLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        $departments = Department::with('educationLevel')->withCount(['subjects', 'materials'])->orderBy('name')->get();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
            'educationLevels' => EducationLevel::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'education_level_id' => ['required', 'exists:education_levels,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        Department::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return back()->with('status', 'Jurusan berhasil ditambahkan.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        return back()->with('status', 'Jurusan berhasil dihapus.');
    }
}
