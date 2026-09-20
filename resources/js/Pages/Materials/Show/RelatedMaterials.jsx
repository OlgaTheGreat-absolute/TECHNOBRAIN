import { Link } from '@inertiajs/react';

export default function RelatedMaterials({ materials }) {
    if (materials.length === 0) {
        return null;
    }

    return (
        <div className="card p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Materi Terkait</h2>
            <ul className="mt-3 space-y-3">
                {materials.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={route('materials.show', item.slug)}
                            className="block rounded-xl px-3 py-2 text-sm text-primary-600 transition hover:bg-primary-50 hover:text-primary-900"
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
