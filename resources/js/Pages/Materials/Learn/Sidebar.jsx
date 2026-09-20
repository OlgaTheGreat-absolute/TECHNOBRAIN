import { Link } from '@inertiajs/react';
import { lessonTypeLabel } from '../../../lib/enums';

export default function Sidebar({ material, lessons, currentLessonId, progressPercent }) {
    const completedCount = lessons.filter((lesson) => lesson.completed).length;

    return (
        <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
                <p className="eyebrow text-accent-600">Progress</p>
                <div className="mt-2 flex items-end justify-between">
                    <span className="text-3xl font-extrabold text-primary-950">{progressPercent}%</span>
                    <span className="text-xs text-primary-400">
                        {completedCount}/{lessons.length} selesai
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-100">
                    <div
                        className="h-full rounded-full bg-accent-400 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <nav className="card mt-4 divide-y divide-primary-100 overflow-hidden p-0" aria-label="Daftar materi">
                {lessons.map((lesson, index) => {
                    const isActive = lesson.id === currentLessonId;

                    return (
                        <Link
                            key={lesson.id}
                            href={route('materials.learn', [material.slug, lesson.id])}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                                isActive ? 'bg-primary-950 text-accent-400' : 'text-primary-700 hover:bg-primary-50'
                            }`}
                        >
                            <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    lesson.completed
                                        ? 'bg-accent-400 text-primary-950'
                                        : isActive
                                          ? 'border border-accent-400 text-accent-400'
                                          : 'border border-primary-300 text-primary-400'
                                }`}
                            >
                                {lesson.completed ? '✓' : index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold">{lesson.title}</span>
                                <span className={`block text-xs ${isActive ? 'text-accent-400/70' : 'text-primary-400'}`}>
                                    {lessonTypeLabel(lesson.type)}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
