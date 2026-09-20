import { Head, Link, usePage } from '@inertiajs/react';

export default function Teacher({ materials }) {
    const { auth } = usePage().props;
    const published = materials.filter((m) => m.status === 'published').length;
    const totalComments = materials.reduce((sum, m) => sum + (m.comments_count ?? 0), 0);

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Selamat datang, {auth.user.name}</h1>
                    <p className="mt-1 text-primary-500">Kelola materi pembelajaran untuk {auth.user.department?.name ?? 'bidangmu'}.</p>
                </div>
                <Link href={route('teacher.materials.create')} className="btn-primary">
                    + Buat Materi Baru
                </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="card p-5">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Total Materi</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{materials.length}</p>
                </div>
                <div className="card p-5">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Diterbitkan</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{published}</p>
                </div>
                <div className="card p-5">
                    <p className="text-xs uppercase tracking-wide text-primary-400">Total Komentar</p>
                    <p className="mt-1 text-3xl font-bold text-primary-900">{totalComments}</p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-primary-900">Materi Saya</h2>

                {materials.length === 0 ? (
                    <div className="card mt-4 p-10 text-center">
                        <p className="text-primary-500">Kamu belum membuat materi. Mulai dengan membuat materi pertamamu.</p>
                        <Link href={route('teacher.materials.create')} className="btn-primary mt-4 inline-flex">
                            + Buat Materi
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-primary-100">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                                <tr>
                                    <th className="px-5 py-3">Judul</th>
                                    <th className="px-5 py-3">Jurusan</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Siswa</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-100">
                                {materials.map((material) => (
                                    <tr key={material.id} className="hover:bg-primary-50/60">
                                        <td className="px-5 py-3 font-medium text-primary-900">{material.title}</td>
                                        <td className="px-5 py-3 text-primary-500">{material.department?.name}</td>
                                        <td className="px-5 py-3">
                                            <span className={`badge ${material.status === 'published' ? 'border-emerald-300 text-emerald-700' : ''}`}>
                                                {material.status === 'published' ? 'Diterbitkan' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-primary-500">{material.progress_count}</td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={route('teacher.materials.edit', material.id)} className="text-accent-600 hover:underline">
                                                Kelola
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
