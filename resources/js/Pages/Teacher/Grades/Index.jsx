import { Head, Link } from '@inertiajs/react';

export default function Index({ materials }) {
    return (
        <>
            <Head title="Nilai Siswa" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Nilai Siswa</h1>
            <p className="mt-1 text-sm text-primary-500">Hasil quiz siswa untuk tiap materi.</p>

            {materials.length === 0 ? (
                <div className="card mt-6 p-10 text-center">
                    <p className="text-primary-500">Belum ada materi dengan quiz.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    {materials.map((material) => (
                        <div key={material.id} className="card p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold text-primary-900">{material.title}</p>
                                {material.author && <span className="badge">{material.author.name}</span>}
                            </div>

                            <div className="mt-3 space-y-2">
                                {material.quizzes.map((quiz) => (
                                    <div key={quiz.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 p-3">
                                        <div>
                                            <p className="text-sm font-semibold text-primary-800">{quiz.title}</p>
                                            <p className="text-xs text-primary-400">{quiz.attempts_count} siswa sudah mengerjakan</p>
                                        </div>
                                        <Link href={route('teacher.grades.show', quiz.id)} className="btn-secondary">
                                            Lihat Nilai
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
