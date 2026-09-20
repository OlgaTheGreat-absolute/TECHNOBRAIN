import { Head, Link } from '@inertiajs/react';

function formatDate(isoString) {
    if (!isoString) {
        return '—';
    }

    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(
        new Date(isoString)
    );
}

const SPEED_MEDALS = ['🥇', '🥈', '🥉'];

function speedRankLabel(rank) {
    return SPEED_MEDALS[rank - 1] ?? `#${rank}`;
}

export default function Show({ quiz, attempts }) {
    return (
        <>
            <Head title={`Nilai — ${quiz.title}`} />

            <Link href={route('teacher.grades.index')} className="text-sm font-bold text-primary-500 hover:text-primary-950">
                &larr; Kembali ke Nilai Siswa
            </Link>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">{quiz.title}</h1>
                    <p className="mt-1 text-sm text-primary-500">{quiz.material.title}</p>
                </div>
                {quiz.material.author && <span className="badge">Pengajar: {quiz.material.author.name}</span>}
            </div>

            {attempts.length === 0 ? (
                <div className="card mt-6 p-10 text-center">
                    <p className="text-primary-500">Belum ada siswa yang mengerjakan quiz ini.</p>
                </div>
            ) : (
                <div className="card mt-6 overflow-x-auto p-0">
                    <table className="w-full min-w-[480px] text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-primary-950 text-xs uppercase tracking-wide text-primary-500">
                                <th className="px-4 py-3">Kecepatan</th>
                                <th className="px-4 py-3">Siswa</th>
                                <th className="px-4 py-3">Nilai</th>
                                <th className="px-4 py-3">Persentase</th>
                                <th className="px-4 py-3">Waktu Selesai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((attempt, index) => (
                                <tr key={attempt.id} className="border-b border-primary-100 last:border-0">
                                    <td className="px-4 py-3 font-semibold text-primary-900">
                                        {attempt.completed_at ? speedRankLabel(index + 1) : '—'}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-primary-900">{attempt.user?.name ?? 'Pengguna dihapus'}</td>
                                    <td className="px-4 py-3">
                                        {attempt.score} / {attempt.total_questions}
                                    </td>
                                    <td className="px-4 py-3">
                                        {attempt.total_questions > 0 ? Math.round((attempt.score / attempt.total_questions) * 100) : 0}%
                                    </td>
                                    <td className="px-4 py-3 text-primary-500">{formatDate(attempt.completed_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {attempts.length > 0 && (
                <p className="mt-3 text-xs text-primary-400">
                    Kecepatan diurutkan dari siswa yang paling awal menyelesaikan quiz (submit tercepat).
                </p>
            )}
        </>
    );
}
