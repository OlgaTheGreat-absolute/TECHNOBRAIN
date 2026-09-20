import { Head, Link, useForm } from '@inertiajs/react';
import MaterialForm from './MaterialForm';

export default function Create({ educationLevels, departments, subjects, contentTypes, difficulties }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        content: '',
        content_type: contentTypes[0]?.value ?? 'text',
        education_level_id: '',
        department_id: '',
        subject_id: '',
        category: '',
        difficulty: difficulties[0]?.value ?? 'beginner',
        model_url: '',
        model_file: null,
        thumbnail_url: '',
        thumbnail_file: null,
        publish: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('teacher.materials.store'));
    }

    return (
        <>
            <Head title="Buat Materi Baru" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Buat Materi Baru</h1>
            <p className="mt-1 text-primary-500">Isi form di bawah untuk membuat materi pembelajaran baru.</p>

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

                <div className="mt-6 flex gap-3">
                    <button type="submit" disabled={processing} className="btn-primary">
                        Simpan Materi
                    </button>
                    <Link href={route('teacher.materials.index')} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </>
    );
}
