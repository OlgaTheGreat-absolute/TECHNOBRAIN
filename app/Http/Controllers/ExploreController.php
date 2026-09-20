<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Enums\Difficulty;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Material::published()->with(['department', 'educationLevel', 'subject'])->withCount('lessons');

        if ($level = $request->string('level')->toString()) {
            $query->whereHas('educationLevel', fn ($q) => $q->where('slug', $level));
        }

        if ($department = $request->string('department')->toString()) {
            $query->whereHas('department', fn ($q) => $q->where('slug', $department));
        }

        if ($subject = $request->integer('subject')) {
            $query->where('subject_id', $subject);
        }

        if ($difficulty = $request->string('difficulty')->toString()) {
            $query->where('difficulty', $difficulty);
        }

        if ($contentType = $request->string('content_type')->toString()) {
            $query->where('content_type', $contentType);
        }

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        $materials = $query->latest()->paginate(9)->withQueryString();

        return Inertia::render('Explore', [
            'materials' => $materials,
            'educationLevels' => EducationLevel::orderBy('name')->get(),
            'departments' => Department::orderBy('name')->get(),
            'subjects' => Subject::orderBy('name')->get(),
            'difficulties' => array_map(fn ($case) => ['value' => $case->value, 'label' => $case->label()], Difficulty::cases()),
            'contentTypes' => array_map(fn ($case) => ['value' => $case->value, 'label' => $case->label()], ContentType::cases()),
            'filters' => $request->only(['level', 'department', 'subject', 'difficulty', 'content_type', 'q']),
        ]);
    }
}
