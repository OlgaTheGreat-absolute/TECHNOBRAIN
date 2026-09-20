import { Head, Link, useForm } from '@inertiajs/react';
import UserForm from './UserForm';

export default function Create({ roles, educationLevels, departments }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: roles.find((r) => r.value === 'student')?.value ?? roles[0]?.value ?? 'student',
        education_level_id: '',
        department_id: '',
        institution: '',
        grade_or_semester: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.users.store'));
    }

    return (
        <>
            <Head title="Buat Akun Baru" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Buat Akun Baru</h1>

            <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
                <UserForm data={data} setData={setData} errors={errors} roles={roles} educationLevels={educationLevels} departments={departments} />

                <div className="flex gap-3 sm:col-span-2">
                    <button type="submit" disabled={processing} className="btn-primary">
                        Buat Akun
                    </button>
                    <Link href={route('admin.users.index')} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </>
    );
}
