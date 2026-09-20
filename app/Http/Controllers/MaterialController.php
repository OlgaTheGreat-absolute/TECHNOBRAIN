<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function show(Material $material): Response
    {
        abort_unless(
            $material->status->value === 'published' || (Auth::check() && Auth::id() === $material->author_id),
            404
        );

        $material->load([
            'department.educationLevel',
            'subject',
            'author',
            'activities',
            'comments.user',
        ]);

        $progress = null;

        if (Auth::check()) {
            $progress = Auth::user()->progress()->where('material_id', $material->id)->first();
        }

        $related = Material::published()
            ->where('id', '!=', $material->id)
            ->where('department_id', $material->department_id)
            ->take(4)
            ->get();

        return Inertia::render('Materials/Show', [
            'material' => $material,
            'progress' => $progress,
            'related' => $related,
        ]);
    }
}
