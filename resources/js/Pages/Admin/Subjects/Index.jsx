import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ subjects, departments }) {
    const { data, setData, post, processing, reset } = useForm({ department_id: departments[0]?.id ?? '', name: '', description: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.subjects.store'), { preserveScroll: true, onSuccess: () => reset('name', 'description') });
    }

    function destroy(subject) {
        if (confirm(`Hapus mata pelajaran ${subject.name}?`)) {
            router.delete(route('admin.subjects.destroy', subject.id), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Kelola Mata Pelajaran" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Kelola Mata Pelajaran</h1>
            <p className="mt-1 text-primary-500">Mata pelajaran per jurusan.</p>

            <form onSubmit={submit} className="card mt-6 grid gap-3 p-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="department_id" className="label">
                        Jurusan
                    </label>
                    <select id="department_id" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} required className="input">
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="name" className="label">
                        Nama Mata Pelajaran
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="input"
                        placeholder="Misal: Basis Data"
                    />
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="description" className="label">
                        Deskripsi
                    </label>
                    <input id="description" type="text" value={data.description} onChange={(e) => setData('description', e.target.value)} className="input" />
                </div>
                <button type="submit" disabled={processing} className="btn-primary w-fit sm:col-span-3">
                    + Tambah Mata Pelajaran
                </button>
            </form>

            <div className="mt-6 overflow-hidden rounded-2xl border border-primary-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                        <tr>
                            <th className="px-5 py-3">Mata Pelajaran</th>
                            <th className="px-5 py-3">Jurusan</th>
                            <th className="px-5 py-3">Jenjang</th>
                            <th className="px-5 py-3">Materi</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                        {subjects.map((subject) => (
                            <tr key={subject.id} className="hover:bg-primary-50/60">
                                <td className="px-5 py-3 font-medium text-primary-900">{subject.name}</td>
                                <td className="px-5 py-3 text-primary-500">{subject.department?.name}</td>
                                <td className="px-5 py-3 text-primary-500">{subject.department?.education_level?.name}</td>
                                <td className="px-5 py-3 text-primary-500">{subject.materials_count}</td>
                                <td className="px-5 py-3 text-right">
                                    <button type="button" onClick={() => destroy(subject)} className="text-xs text-red-500 hover:underline">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
