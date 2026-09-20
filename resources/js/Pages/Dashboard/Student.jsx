import { Head, Link, usePage } from '@inertiajs/react';
import MaterialCard from '../../Components/MaterialCard';

export default function Student({ continueLearning, recommended, recent, completed, percentOverall }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Dashboard" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Selamat datang, {auth.user.name}</h1>
            <p className="mt-1 text-primary-500">
                {auth.user.department ? `Materi untuk kamu di ${auth.user.department.name}` : 'Lanjutkan perjalanan belajarmu hari ini.'}
            </p>

            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary-900">Learning Progress</h2>
                    <span className="text-sm text-primary-500">{percentOverall}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                    <div className="h-full rounded-full bg-linear-to-r from-primary-600 to-accent-500" style={{ width: `${percentOverall}%` }} />
                </div>
            </div>

            {continueLearning.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-primary-900">Continue Learning</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {continueLearning.map((item) => (
                            <Link
                                key={item.id}
                                href={route('materials.show', item.material.slug)}
                                className="card p-5 transition hover:border-accent-300"
                            >
                                <p className="text-xs font-medium uppercase tracking-wide text-accent-600">{item.material.department?.name}</p>
                                <p className="mt-1 font-semibold text-primary-900">{item.material.title}</p>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-100">
                                    <div className="h-full rounded-full bg-accent-500" style={{ width: `${item.percent}%` }} />
                                </div>
                                <p className="mt-1.5 text-xs text-primary-400">{item.percent}% &middot; Continue</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {recommended.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-primary-900">Materi untuk kamu</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recommended.map((material) => (
                            <MaterialCard key={material.id} material={material} />
                        ))}
                    </div>
                </div>
            )}

            {completed.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-primary-900">Selesai Dipelajari</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {completed.map((material) => (
                            <MaterialCard key={material.id} material={material} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary-900">Recent Materials</h2>
                    <Link href={route('explore')} className="text-sm font-medium text-accent-600 hover:underline">
                        Explore semua &rarr;
                    </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recent.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            </div>
        </>
    );
}
