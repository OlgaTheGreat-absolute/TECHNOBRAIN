<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Material::published()
            ->with(['department', 'educationLevel'])
            ->withCount('lessons')
            ->latest()
            ->take(6)
            ->get();

        $departments = Department::withCount('materials')
            ->with('educationLevel')
            ->orderBy('name')
            ->get();

        $educationLevels = EducationLevel::withCount('materials')->get();

        $testimonials = Testimonial::with('user.latestProgress.material:id,title')
            ->where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Home', [
            'featured' => $featured,
            'departments' => $departments,
            'educationLevels' => $educationLevels,
            'testimonials' => $testimonials,
        ]);
    }
}
