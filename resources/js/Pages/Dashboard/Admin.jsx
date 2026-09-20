import { Head, Link } from '@inertiajs/react';

export default function Admin({ usersCount, materialsCount, departmentsCount }) {
    return (
        <>
            <Head title="Admin Panel" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Admin Panel</h1>
            <p className="mt-1 text-primary-500">Kelola akun, jurusan, dan mata pelajaran TechnoBrain.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Link href={route('admin.users.index')} className="card p-6 transition hover:border-accent-300">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Total Akun</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{usersCount}</p>
                    <p className="mt-2 text-sm text-accent-600">Kelola Akun &rarr;</p>
                </Link>
                <div className="card p-6">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Total Materi</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{materialsCount}</p>
                </div>
                <Link href={route('admin.departments.index')} className="card p-6 transition hover:border-accent-300">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Total Jurusan</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{departmentsCount}</p>
                    <p className="mt-2 text-sm text-accent-600">Kelola Jurusan &rarr;</p>
                </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Link href={route('admin.users.create')} className="card p-6 transition hover:border-accent-300">
                    <h2 className="font-semibold text-primary-900">+ Buat Akun Baru</h2>
                    <p className="mt-1 text-sm text-primary-500">Buat akun siswa, pengajar, atau admin.</p>
                </Link>
                <Link href={route('admin.subjects.index')} className="card p-6 transition hover:border-accent-300">
                    <h2 className="font-semibold text-primary-900">Kelola Mata Pelajaran</h2>
                    <p className="mt-1 text-sm text-primary-500">Tambah atau hapus mata pelajaran per jurusan.</p>
                </Link>
            </div>
        </>
    );
}
