import { Head, Link, router, useForm } from '@inertiajs/react';
import MaterialForm from './MaterialForm';
import ActivityManager from './Edit/ActivityManager';
import LessonManager from './Edit/LessonManager';

export default function Edit({ material, educationLevels, departments, subjects, contentTypes, difficulties }) {
    const { data, setData, post, transform, processing, errors } = useForm({
        title: material.title ?? '',
        description: material.description ?? '',
        content: material.content ?? '',
        content_type: material.content_type,
        education_level_id: material.education_level_id,
        department_id: material.department_id,
        subject_id: material.subject_id ?? '',
        category: material.category ?? '',
        difficulty: material.difficulty,
        model_url: material.scene_config?.objects?.[0]?.model ?? '',
        model_file: null,
        thumbnail_url: material.thumbnail ?? '',
        thumbnail_file: null,
        publish: material.status === 'published',
    });

    // File uploads cannot be sent over a native PUT request (PHP does not
    // populate $_FILES for multipart PUT bodies), so this spoofs the method
    // via Laravel's `_method` convention and submits as POST instead.
    transform((data) => ({ ...data, _method: 'put' }));

    function submit(e) {
        e.preventDefault();
        post(route('teacher.materials.update', material.id));
    }

    function destroyMaterial() {
        if (confirm('Hapus materi ini secara permanen?')) {
            router.delete(route('teacher.materials.destroy', material.id));
        }
    }

    return (
        <>
            <Head title={material.title} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">{material.title}</h1>
                    <p className="mt-1 text-primary-500">Kelola konten, aktivitas, dan quiz untuk materi ini.</p>
                </div>
                <Link href={route('materials.show', material.slug)} target="_blank" rel="noopener" className="btn-secondary">
                    Lihat Materi &rarr;
                </Link>
            </div>

            <form onSubmit={submit} className="card mt-6 p-6">
                <MaterialForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    educationLevels={educationLevels}
                    departments={departments}
                    subjects={subjects}
                    contentTypes={contentTypes}
                    difficulties={difficulties}
                />

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button type="submit" disabled={processing} className="btn-primary">
                        Simpan Perubahan
                    </button>
                    <button type="button" onClick={destroyMaterial} className="btn-ghost text-red-500 hover:text-red-600">
                        Hapus Materi
                    </button>
                </div>
            </form>

            <LessonManager material={material} />
            <ActivityManager material={material} />
        </>
    );
}
