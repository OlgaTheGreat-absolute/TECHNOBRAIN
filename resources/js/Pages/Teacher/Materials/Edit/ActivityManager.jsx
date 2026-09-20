import { router, useForm } from '@inertiajs/react';

export default function ActivityManager({ material }) {
    const { data, setData, post, processing, reset } = useForm({ title: '', instruction: '', information: '' });

    function submit(e) {
        e.preventDefault();
        post(route('teacher.materials.activities.store', material.id), { preserveScroll: true, onSuccess: () => reset() });
    }

    function destroy(activityId) {
        if (confirm('Hapus aktivitas ini?')) {
            router.delete(route('teacher.materials.activities.destroy', [material.id, activityId]), { preserveScroll: true });
        }
    }

    return (
        <div className="card mt-8 p-6">
            <h2 className="text-lg font-semibold text-primary-900">Aktivitas Pembelajaran</h2>
            <p className="mt-1 text-sm text-primary-500">Langkah-langkah singkat yang tampil di halaman materi sebelum siswa mulai belajar.</p>

            <ul className="mt-4 space-y-2">
                {material.activities.length === 0 && <li className="text-sm text-primary-400">Belum ada aktivitas.</li>}
                {material.activities.map((activity) => (
                    <li key={activity.id} className="flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50/40 px-4 py-2.5 text-sm">
                        <p className="font-medium text-primary-900">{activity.title}</p>
                        <button type="button" onClick={() => destroy(activity.id)} className="text-red-500 hover:underline">
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Judul aktivitas"
                    required
                    className="input sm:col-span-2"
                />
                <input
                    type="text"
                    value={data.instruction}
                    onChange={(e) => setData('instruction', e.target.value)}
                    placeholder="Instruksi"
                    className="input sm:col-span-2"
                />
                <textarea
                    value={data.information}
                    onChange={(e) => setData('information', e.target.value)}
                    placeholder="Informasi / penjelasan"
                    rows={2}
                    className="input sm:col-span-2"
                />
                <button type="submit" disabled={processing} className="btn-secondary sm:col-span-2">
                    + Tambah Aktivitas
                </button>
            </form>
        </div>
    );
}
