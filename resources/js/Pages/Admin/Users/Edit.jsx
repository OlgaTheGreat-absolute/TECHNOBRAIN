import { Head, Link, useForm } from '@inertiajs/react';
import UserForm from './UserForm';

export default function Edit({ user, roles, educationLevels, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        role: user.role,
        is_active: user.is_active,
        education_level_id: user.education_level_id ?? '',
        department_id: user.department_id ?? '',
        institution: user.institution ?? '',
        grade_or_semester: user.grade_or_semester ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    }

    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Edit Akun: {user.name}</h1>

            <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
                <UserForm data={data} setData={setData} errors={errors} roles={roles} educationLevels={educationLevels} departments={departments} isEdit />

                <div className="flex gap-3 sm:col-span-2">
                    <button type="submit" disabled={processing} className="btn-primary">
                        Simpan Perubahan
                    </button>
                    <Link href={route('admin.users.index')} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </>
    );
}
