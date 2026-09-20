import { Head, Link, useForm } from '@inertiajs/react';

const statusLabels = { lobby: 'Menunggu', active: 'Berlangsung', finished: 'Selesai' };

function TeacherView({ recentRooms }) {
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Kuis Cepat</h1>
                    <p className="mt-1 text-primary-500">Buat room kuis cepat-cepatan seperti Quizizz untuk kelasmu.</p>
                </div>
                <Link href={route('teacher.games.create')} className="btn-primary">
                    + Buat Room Kuis
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-primary-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                        <tr>
                            <th className="px-5 py-3">Judul</th>
                            <th className="px-5 py-3">Kode</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Soal</th>
                            <th className="px-5 py-3">Peserta</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                        {recentRooms.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-primary-400">
                                    Belum ada room kuis. Buat yang pertama!
                                </td>
                            </tr>
                        )}
                        {recentRooms.map((room) => (
                            <tr key={room.id} className="hover:bg-primary-50/60">
                                <td className="px-5 py-3 font-semibold text-primary-900">{room.title}</td>
                                <td className="px-5 py-3 font-mono font-bold text-accent-600">{room.code}</td>
                                <td className="px-5 py-3">
                                    <span className="badge">{statusLabels[room.status]}</span>
                                </td>
                                <td className="px-5 py-3 text-primary-500">{room.questions_count}</td>
                                <td className="px-5 py-3 text-primary-500">{room.participants_count}</td>
                                <td className="px-5 py-3 text-right">
                                    <Link href={route('teacher.games.manage', room.code)} className="font-semibold text-accent-600 hover:underline">
                                        Kelola &rarr;
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function StudentView({ joined }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    function submit(e) {
        e.preventDefault();
        post(route('games.join'));
    }

    return (
        <>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Kuis Cepat</h1>
            <p className="mt-1 text-primary-500">Masukkan kode room dari gurumu untuk ikut kuis cepat-cepatan.</p>

            <form onSubmit={submit} className="card mt-6 max-w-md p-6">
                <label className="label">
                    Kode Room
                    <input
                        type="text"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        placeholder="MIS. AB12CD"
                        maxLength={8}
                        required
                        className="input mt-1.5 text-center font-mono text-lg tracking-[0.3em] uppercase"
                    />
                </label>
                {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                <button type="submit" disabled={processing} className="btn-primary mt-4 w-full">
                    Gabung Kuis
                </button>
            </form>

            {joined.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Kuis Terakhir</h2>
                    <div className="mt-3 space-y-2">
                        {joined.map((room) => (
                            <Link
                                key={room.code}
                                href={route('games.play', room.code)}
                                className="card flex items-center justify-between p-4 transition hover:border-primary-950"
                            >
                                <div>
                                    <p className="font-semibold text-primary-900">{room.title}</p>
                                    <p className="text-xs text-primary-400">{statusLabels[room.status]}</p>
                                </div>
                                <span className="text-sm font-bold text-accent-600">{room.score} poin</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default function Index({ isTeacher, recentRooms, joined }) {
    return (
        <>
            <Head title="Kuis Cepat" />
            {isTeacher ? <TeacherView recentRooms={recentRooms} /> : <StudentView joined={joined} />}
        </>
    );
}
