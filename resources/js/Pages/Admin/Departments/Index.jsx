import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ departments, educationLevels }) {
    const { data, setData, post, processing, reset } = useForm({ education_level_id: educationLevels[0]?.id ?? '', name: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.departments.store'), { preserveScroll: true, onSuccess: () => reset('name') });
    }

    function destroy(department) {
        if (confirm(`Hapus jurusan ${department.name}?`)) {
            router.delete(route('admin.departments.destroy', department.id), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Kelola Jurusan" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Kelola Jurusan</h1>
            <p className="mt-1 text-primary-500">Jurusan/bidang tersedia untuk SMK.</p>

            <form onSubmit={submit} className="card mt-6 flex flex-wrap items-end gap-3 p-5">
                <div className="min-w-[160px]">
                    <label htmlFor="education_level_id" className="label">
                        Jenjang
                    </label>
                    <select
                        id="education_level_id"
                        value={data.education_level_id}
                        onChange={(e) => setData('education_level_id', e.target.value)}
                        required
                        className="input"
                    >
                        {educationLevels.map((level) => (
                            <option key={level.id} value={level.id}>
                                {level.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[200px] flex-1">
                    <label htmlFor="name" className="label">
                        Nama Jurusan
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="input"
                        placeholder="Misal: Teknik Elektronika"
                    />
                </div>
                <button type="submit" disabled={processing} className="btn-primary">
                    + Tambah
                </button>
            </form>

            <div className="mt-6 overflow-hidden rounded-2xl border border-primary-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                        <tr>
                            <th className="px-5 py-3">Jurusan</th>
                            <th className="px-5 py-3">Jenjang</th>
                            <th className="px-5 py-3">Mata Pelajaran</th>
                            <th className="px-5 py-3">Materi</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                        {departments.map((department) => (
                            <tr key={department.id} className="hover:bg-primary-50/60">
                                <td className="px-5 py-3 font-medium text-primary-900">{department.name}</td>
                                <td className="px-5 py-3 text-primary-500">{department.education_level?.name}</td>
                                <td className="px-5 py-3 text-primary-500">{department.subjects_count}</td>
                                <td className="px-5 py-3 text-primary-500">{department.materials_count}</td>
                                <td className="px-5 py-3 text-right">
                                    <button type="button" onClick={() => destroy(department)} className="text-xs text-red-500 hover:underline">
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
