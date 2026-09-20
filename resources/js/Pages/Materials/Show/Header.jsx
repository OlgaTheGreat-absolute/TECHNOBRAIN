import { Link } from '@inertiajs/react';
import { contentTypeLabel, difficultyLabel } from '../../../lib/enums';

export default function Header({ material }) {
    return (
        <section className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-primary-400">
                    <Link href={route('explore')} className="hover:text-accent-600">
                        Explore
                    </Link>
                    <span>/</span>
                    <Link href={route('explore', { level: material.department.education_level.slug })} className="hover:text-accent-600">
                        {material.department.education_level.name}
                    </Link>
                    <span>/</span>
                    <Link href={route('explore', { department: material.department.slug })} className="hover:text-accent-600">
                        {material.department.name}
                    </Link>
                </nav>

                <span className="eyebrow mt-4 block">{contentTypeLabel(material.content_type)}</span>
                <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-4xl">{material.title}</h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-primary-500">{material.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="badge">{difficultyLabel(material.difficulty)}</span>
                    {material.category && <span className="badge">{material.category}</span>}
                    <span className="text-sm text-primary-400">
                        Diajarkan oleh <span className="font-semibold text-primary-700">{material.author.name}</span>
                        {material.subject ? ` · ${material.subject.name}` : ` · ${material.department.name}`}
                    </span>
                </div>
            </div>
        </section>
    );
}
