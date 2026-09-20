import { Link, usePage } from '@inertiajs/react';

export default function ProgressCard({ materialSlug, progress }) {
    const { auth } = usePage().props;
    const currentPercent = progress?.percent ?? 0;

    if (!auth?.user) {
        return (
            <div className="card p-5 text-center">
                <p className="text-sm text-primary-600">Masuk untuk menyimpan progress belajarmu.</p>
                <Link href={route('login')} className="btn-primary mt-3 w-full">
                    Masuk
                </Link>
            </div>
        );
    }

    return (
        <div className="card p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Progress Belajar</h2>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full rounded-full bg-accent-400 transition-all duration-500" style={{ width: `${currentPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-primary-400">{currentPercent}% selesai</p>

            <div className="mt-4">
                {currentPercent >= 100 ? (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
                        &check; Selesai
                    </p>
                ) : (
                    <Link href={route('materials.learn', materialSlug)} className="btn-primary w-full">
                        {currentPercent === 0 ? 'Mulai Belajar' : 'Lanjutkan Belajar'}
                    </Link>
                )}
            </div>
        </div>
    );
}
