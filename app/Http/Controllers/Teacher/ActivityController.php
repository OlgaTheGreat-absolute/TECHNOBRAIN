<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        abort_unless($material->isManageableBy(Auth::user()), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'instruction' => ['nullable', 'string', 'max:500'],
            'target_key' => ['nullable', 'string', 'max:255'],
            'information' => ['nullable', 'string', 'max:1000'],
        ]);

        $material->activities()->create([
            ...$validated,
            'order' => $material->activities()->count(),
        ]);

        return back()->with('status', 'Aktivitas berhasil ditambahkan.');
    }

    public function destroy(Material $material, Activity $activity): RedirectResponse
    {
        abort_unless($material->isManageableBy(Auth::user()), 403);
        abort_unless($activity->material_id === $material->id, 404);

        $activity->delete();

        return back()->with('status', 'Aktivitas berhasil dihapus.');
    }
}
