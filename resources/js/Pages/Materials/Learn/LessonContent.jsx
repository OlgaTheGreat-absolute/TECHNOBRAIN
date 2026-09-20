import { Link } from '@inertiajs/react';
import { lessonTypeLabel } from '../../../lib/enums';
import { toEmbedUrl } from '../../../lib/video';
import QuizPlayer from './QuizPlayer';

export default function LessonContent({ material, lesson, nextLessonId }) {
    if (!lesson) {
        return (
            <div className="card p-10 text-center">
                <p className="text-primary-500">Materi ini belum memiliki konten pembelajaran.</p>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="border-b border-primary-100 px-6 py-5">
                <span className="eyebrow text-accent-600">{lessonTypeLabel(lesson.type)}</span>
                <h1 className="mt-1 text-xl font-extrabold uppercase tracking-tight text-primary-950">{lesson.title}</h1>
            </div>

            <div className="p-6">
                {lesson.body && <p className="mb-6 whitespace-pre-line text-[15px] leading-relaxed text-primary-600">{lesson.body}</p>}

                {lesson.type === 'video' && lesson.video_url && (
                    <div className="aspect-video overflow-hidden rounded-2xl bg-primary-950">
                        <iframe
                            src={toEmbedUrl(lesson.video_url)}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={lesson.title}
                        />
                    </div>
                )}

                {lesson.type === 'pdf' && lesson.pdf_url && (
                    <div>
                        <div className="aspect-4/3 overflow-hidden rounded-2xl border border-primary-100 sm:aspect-video">
                            <iframe src={lesson.pdf_url} className="h-full w-full" title={lesson.title} />
                        </div>
                        <a
                            href={lesson.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block text-sm font-semibold text-accent-600 hover:underline"
                        >
                            Buka PDF di tab baru &rarr;
                        </a>
                    </div>
                )}

                {lesson.type === 'quiz' && lesson.quiz && (
                    <QuizPlayer material={material} quiz={lesson.quiz} nextLessonId={nextLessonId} />
                )}

                {lesson.type !== 'quiz' && (
                    <Link
                        href={route('materials.lessons.complete', [material.slug, lesson.id])}
                        method="post"
                        as="button"
                        className="btn-primary mt-6"
                    >
                        Tandai Selesai &amp; Lanjut
                    </Link>
                )}
            </div>
        </div>
    );
}
