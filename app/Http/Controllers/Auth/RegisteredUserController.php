<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/AuthPanel', [
            'mode' => 'register',
            'educationLevels' => EducationLevel::orderBy('name')->get(),
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'education_level_id' => ['nullable', 'exists:education_levels,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'institution' => ['nullable', 'string', 'max:255'],
            'grade_or_semester' => ['nullable', 'string', 'max:255'],
        ]);

        // New accounts are always created as students — teacher/admin
        // accounts are provisioned separately by an admin.
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => UserRole::Student,
            'education_level_id' => $validated['education_level_id'] ?? null,
            'department_id' => $validated['department_id'] ?? null,
            'institution' => $validated['institution'] ?? null,
            'grade_or_semester' => $validated['grade_or_semester'] ?? null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
