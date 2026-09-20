<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        Auth::user()->comments()->create([
            'material_id' => $material->id,
            'body' => $validated['body'],
        ]);

        return back()->with('status', 'Komentar berhasil ditambahkan.');
    }
}
