import { Head, Link } from '@inertiajs/react';
import Sidebar from './Learn/Sidebar';
import LessonContent from './Learn/LessonContent';

export default function Learn({ material, lessons, currentLesson, progressPercent }) {
    const currentIndex = currentLesson ? lessons.findIndex((lesson) => lesson.id === currentLesson.id) : -1;
    const nextLessonId = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1].id : null;

    return (
        <>
            <Head title={`Belajar · ${material.title}`} />

            <section className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Link href={route('materials.show', material.slug)} className="text-sm font-semibold text-primary-500 hover:text-accent-600">
                        &larr; {material.title}
                    </Link>
                    <h1 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-3xl">Ruang Belajar</h1>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
                        <Sidebar
                            material={material}
                            lessons={lessons}
                            currentLessonId={currentLesson?.id}
                            progressPercent={progressPercent}
                        />

                        <LessonContent material={material} lesson={currentLesson} nextLessonId={nextLessonId} />
                    </div>
                </div>
            </section>
        </>
    );
}
