import { Link } from '@inertiajs/react';

export default function Pagination({ meta }) {
    if (!meta || meta.links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Navigasi halaman">
            {meta.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    preserveScroll
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                        link.active
                            ? 'bg-primary-950 text-accent-400'
                            : link.url
                              ? 'border border-primary-200 bg-paper text-primary-600 hover:border-primary-950 hover:text-primary-950'
                              : 'cursor-not-allowed text-primary-300'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}
