<?php

namespace App\Http\Controllers\Teacher;

use App\Enums\ContentType;
use App\Enums\Difficulty;
use App\Enums\MaterialStatus;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Material;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(): Response
    {
        $materials = Auth::user()->materials()->with(['department', 'educationLevel'])->latest()->paginate(10);

        return Inertia::render('Teacher/Materials/Index', compact('materials'));
    }

    public function create(): Response
    {
        return Inertia::render('Teacher/Materials/Create', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateMaterial($request);

        $thumbnail = $this->resolveThumbnail($validated);
        $modelUrl = $validated['content_type'] === ContentType::ThreeD->value ? $this->resolveModelUrl($validated) : null;

        $material = Auth::user()->materials()->create([
            ...Arr::except($validated, ['model_file', 'model_url', 'thumbnail_file', 'thumbnail_url']),
            'thumbnail' => $thumbnail,
            'slug' => $this->uniqueSlug($validated['title']),
            'status' => $request->boolean('publish') ? MaterialStatus::Published : MaterialStatus::Draft,
            'scene_config' => $this->buildSceneConfig($validated['title'], $modelUrl),
        ]);

        return redirect()->route('teacher.materials.edit', $material)->with('status', 'Materi berhasil dibuat.');
    }

    public function edit(Material $material): Response
    {
        $this->authorizeOwner($material);

        $material->load(['activities', 'lessons.quiz.questions.answers']);

        return Inertia::render('Teacher/Materials/Edit', [...$this->formOptions(), 'material' => $material]);
    }

    public function update(Request $request, Material $material): RedirectResponse
    {
        $this->authorizeOwner($material);

        $validated = $this->validateMaterial($request);

        $thumbnail = $this->resolveThumbnail($validated, $material);
        $modelUrl = $validated['content_type'] === ContentType::ThreeD->value
            ? $this->resolveModelUrl($validated, $material)
            : ($material->scene_config['objects'][0]['model'] ?? null);

        $material->update([
            ...Arr::except($validated, ['model_file', 'model_url', 'thumbnail_file', 'thumbnail_url']),
            'thumbnail' => $thumbnail,
            'status' => $request->boolean('publish') ? MaterialStatus::Published : MaterialStatus::Draft,
            'scene_config' => $this->buildSceneConfig($validated['title'], $modelUrl, $material),
        ]);

        return back()->with('status', 'Materi berhasil diperbarui.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        $this->authorizeOwner($material);

        $material->delete();

        return redirect()->route('teacher.materials.index')->with('status', 'Materi berhasil dihapus.');
    }

    private function authorizeOwner(Material $material): void
    {
        abort_unless($material->author_id === Auth::id(), 403);
    }

    private function validateMaterial(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'content_type' => ['required', Rule::enum(ContentType::class)],
            'education_level_id' => ['required', 'exists:education_levels,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
            'category' => ['nullable', 'string', 'max:255'],
            'difficulty' => ['required', Rule::enum(Difficulty::class)],
            'model_url' => ['nullable', 'string', 'max:500'],
            'model_file' => ['nullable', (new File)->extensions(['glb'])->max(51200)],
            'thumbnail_url' => ['nullable', 'string', 'max:500'],
            'thumbnail_file' => ['nullable', 'image', 'max:4096'],
        ]);
    }

    /**
     * The teacher only supplies a GLB URL — this wraps it into the single
     * scene object the 3D viewer expects. Any `components` hover-explanation
     * map already on the material is carried over untouched, since there's
     * no UI yet for a teacher to edit it directly.
     */
    private function buildSceneConfig(string $title, ?string $modelUrl, ?Material $material = null): ?array
    {
        if (! $modelUrl) {
            return null;
        }

        $components = $material?->scene_config['objects'][0]['components'] ?? null;

        return [
            'objects' => [
                [
                    'key' => 'body',
                    'label' => $title,
                    'model' => $modelUrl,
                    'position' => [0, 0, 0],
                    'clickable' => false,
                    ...($components ? ['components' => $components] : []),
                ],
            ],
        ];
    }

    /**
     * Prefers a freshly uploaded GLB file (stored to the public disk, with
     * the previous stored file removed) over a typed URL, falling back to
     * whatever model the material already had.
     *
     * @param  array<string, mixed>  $validated
     */
    private function resolveModelUrl(array $validated, ?Material $material = null): ?string
    {
        if ($validated['model_file'] ?? null) {
            $this->deleteStoredUpload($material?->scene_config['objects'][0]['model'] ?? null);

            return Storage::disk('public')->url($validated['model_file']->store('materials/models', 'public'));
        }

        if (! empty($validated['model_url'])) {
            return $validated['model_url'];
        }

        return $material?->scene_config['objects'][0]['model'] ?? null;
    }

    /**
     * Same preference order as resolveModelUrl(), but for the cover image
     * that backs the `thumbnail` column.
     *
     * @param  array<string, mixed>  $validated
     */
    private function resolveThumbnail(array $validated, ?Material $material = null): ?string
    {
        if ($validated['thumbnail_file'] ?? null) {
            $this->deleteStoredUpload($material?->thumbnail);

            return Storage::disk('public')->url($validated['thumbnail_file']->store('materials/thumbnails', 'public'));
        }

        if (! empty($validated['thumbnail_url'])) {
            return $validated['thumbnail_url'];
        }

        return $material?->thumbnail;
    }

    /**
     * Deletes a previously uploaded file from the public disk, ignoring
     * external URLs (e.g. typed links) which aren't ours to delete.
     */
    private function deleteStoredUpload(?string $url): void
    {
        if (! $url) {
            return;
        }

        $path = Str::after($url, Storage::disk('public')->url(''));

        if ($path !== $url) {
            Storage::disk('public')->delete($path);
        }
    }

    private function uniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $i = 1;

        while (Material::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }

    private function formOptions(): array
    {
        return [
            'educationLevels' => EducationLevel::orderBy('name')->get(),
            'departments' => Department::orderBy('name')->get(),
            'subjects' => Subject::orderBy('name')->get(),
            'contentTypes' => array_map(fn ($case) => ['value' => $case->value, 'label' => $case->label()], ContentType::cases()),
            'difficulties' => array_map(fn ($case) => ['value' => $case->value, 'label' => $case->label()], Difficulty::cases()),
        ];
    }
}
