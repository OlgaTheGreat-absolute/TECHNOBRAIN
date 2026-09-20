<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with(['department', 'educationLevel'])
            ->when($request->string('role')->toString(), fn ($q, $role) => $q->where('role', $role))
            ->when($request->string('q')->toString(), fn ($q, $search) => $q->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $this->roleOptions(),
            'filters' => $request->only(['role', 'q']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => $this->roleOptions(),
            'educationLevels' => EducationLevel::orderBy('name')->get(),
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', Rules\Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'education_level_id' => ['nullable', 'exists:education_levels,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'institution' => ['nullable', 'string', 'max:255'],
            'grade_or_semester' => ['nullable', 'string', 'max:255'],
        ]);

        User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.users.index')->with('status', 'Akun berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $this->roleOptions(),
            'educationLevels' => EducationLevel::orderBy('name')->get(),
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return array_map(fn ($case) => ['value' => $case->value, 'label' => $case->label()], UserRole::cases());
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::enum(UserRole::class)],
            'password' => ['nullable', Rules\Password::defaults()],
            'education_level_id' => ['nullable', 'exists:education_levels,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'institution' => ['nullable', 'string', 'max:255'],
            'grade_or_semester' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->update([
            ...$validated,
            'password' => filled($validated['password'] ?? null) ? Hash::make($validated['password']) : $user->password,
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('status', 'Akun berhasil diperbarui.');
    }

    public function resetPassword(User $user): RedirectResponse
    {
        $temporaryPassword = Str::password(10);

        $user->update(['password' => Hash::make($temporaryPassword)]);

        return back()->with('status', "Kata sandi baru untuk {$user->name}: {$temporaryPassword}");
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with('status', 'Akun berhasil dihapus.');
    }
}
