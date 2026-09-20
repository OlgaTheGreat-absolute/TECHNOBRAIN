import { Link } from '@inertiajs/react';
import MaterialCard from '../../Components/MaterialCard';

export default function LatestMaterialsSection({ materials }) {
    if (materials.length === 0) {
        return null;
    }

    return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <span className="eyebrow">Materi terbaru</span>
                        <h2 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-4xl">
                            Mulai belajar sekarang
                        </h2>
                        <p className="mt-3 text-[15px] leading-relaxed text-primary-500">
                            Materi interaktif yang dirancang rapi per topik &mdash; mulai dari TJKT, terus berkembang ke jurusan lainnya.
                        </p>
                    </div>
                    <Link href={route('explore')} className="btn-secondary hidden shrink-0 sm:inline-flex">
                        Lihat semua
                    </Link>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            </div>
        </section>
    );
}
