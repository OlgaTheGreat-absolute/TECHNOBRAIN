import { Head, Link } from '@inertiajs/react';
import Pagination from '../../../Components/Pagination';
import { contentTypeLabel } from '../../../lib/enums';

export default function Index({ materials }) {
    return (
        <>
            <Head title="Materi Saya" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Materi Saya</h1>
                <Link href={route('teacher.materials.create')} className="btn-primary">
                    + Buat Materi Baru
                </Link>
            </div>

            {materials.data.length === 0 ? (
                <div className="card mt-6 p-10 text-center">
                    <p className="text-primary-500">Belum ada materi. Yuk buat materi pertamamu.</p>
                </div>
            ) : (
                <>
                    <div className="mt-6 space-y-3">
                        {materials.data.map((material) => (
                            <div key={material.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                                <div>
                                    <p className="font-semibold text-primary-900">{material.title}</p>
                                    <p className="text-xs text-primary-400">
                                        {material.education_level?.name} &middot; {material.department?.name} &middot; {contentTypeLabel(material.content_type)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge ${material.status === 'published' ? 'border-emerald-300 text-emerald-700' : ''}`}>
                                        {material.status === 'published' ? 'Diterbitkan' : 'Draft'}
                                    </span>
                                    <Link href={route('materials.show', material.slug)} className="btn-ghost">
                                        Lihat
                                    </Link>
                                    <Link href={route('teacher.materials.edit', material.id)} className="btn-secondary">
                                        Kelola
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination meta={materials} />
                    </div>
                </>
            )}
        </>
    );
}
