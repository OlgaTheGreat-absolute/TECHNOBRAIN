import { Link } from '@inertiajs/react';
import ContentTypeIcon from './ContentTypeIcon';
import { contentTypeLabel, difficultyLabel } from '../lib/enums';

export default function MaterialCard({ material }) {
    return (
        <Link
            href={route('materials.show', material.slug)}
            className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-950/10"
        >
            <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-accent-400">
                {material.thumbnail ? (
                    <img
                        src={material.thumbnail}
                        alt=""
                        className="h-full w-full object-contain p-6 transition duration-500 ease-out group-hover:scale-110"
                        draggable="false"
                    />
                ) : (
                    <ContentTypeIcon type={material.content_type} className="h-12 w-12 text-primary-950 transition duration-500 group-hover:scale-110" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-primary-950 px-2.5 py-1 text-xs font-bold text-accent-400">
                    {contentTypeLabel(material.content_type)}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow text-accent-600">
                    {material.education_level?.name} &middot; {material.department?.name}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-primary-950 group-hover:text-accent-600">{material.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-primary-500">{material.description}</p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary-100 pt-4">
                    <div className="flex min-w-0 items-center gap-3 text-xs text-primary-400">
                        <span className="badge shrink-0">{difficultyLabel(material.difficulty)}</span>
                        {material.lessons_count > 0 && (
                            <span className="flex shrink-0 items-center gap-1 font-semibold">
                                <LayersIcon className="h-3.5 w-3.5" />
                                {material.lessons_count} Materi
                            </span>
                        )}
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-950 transition duration-300 group-hover:translate-x-0.5 group-hover:bg-accent-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}

function LayersIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Zm-8.5 9L12 16.5 20.5 12M3.5 16.5 12 21l8.5-4.5"
            />
        </svg>
    );
}
