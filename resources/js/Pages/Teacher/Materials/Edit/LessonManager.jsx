import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import QuestionManager from './QuestionManager';

const typeLabels = { video: 'Video', pdf: 'PDF', quiz: 'Quiz' };

function LessonForm({ material, lesson, onDone }) {
    const isEdit = !!lesson;
    const { data, setData, post, put, processing, reset, errors } = useForm({
        type: lesson?.type ?? 'video',
        title: lesson?.title ?? '',
        body: lesson?.body ?? '',
        video_url: lesson?.video_url ?? '',
        pdf_url: lesson?.pdf_url ?? '',
        order: lesson?.order ?? 0,
    });

    function submit(e) {
        e.preventDefault();

        if (isEdit) {
            put(route('teacher.materials.lessons.update', [material.id, lesson.id]), { preserveScroll: true, onSuccess: onDone });
        } else {
            post(route('teacher.materials.lessons.store', material.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onDone?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="mt-3 space-y-3 rounded-xl border border-primary-100 bg-primary-50/40 p-4">
            {!isEdit && (
                <div>
                    <label className="label">Tipe Konten</label>
                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="input">
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="quiz">Quiz</option>
                    </select>
                </div>
            )}

            <div>
                <label className="label">Judul</label>
                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required className="input" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label className="label">Deskripsi / Catatan (opsional)</label>
                <textarea rows={2} value={data.body} onChange={(e) => setData('body', e.target.value)} className="input" />
            </div>

            {data.type === 'video' && (
                <div>
                    <label className="label">URL Video (YouTube, dsb.)</label>
                    <input
                        type="url"
                        value={data.video_url}
                        onChange={(e) => setData('video_url', e.target.value)}
                        required
                        className="input"
                        placeholder="https://youtube.com/watch?v=..."
                    />
                    {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
                </div>
            )}

            {data.type === 'pdf' && (
                <div>
                    <label className="label">URL PDF</label>
                    <input
                        type="url"
                        value={data.pdf_url}
                        onChange={(e) => setData('pdf_url', e.target.value)}
                        required
                        className="input"
                        placeholder="https://..."
                    />
                    {errors.pdf_url && <p className="mt-1 text-sm text-red-600">{errors.pdf_url}</p>}
                </div>
            )}

            {isEdit && (
                <div>
                    <label className="label">Urutan</label>
                    <input
                        type="number"
                        min="0"
                        value={data.order}
                        onChange={(e) => setData('order', e.target.value)}
                        className="input w-24"
                    />
                </div>
            )}

            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="btn-secondary">
                    {isEdit ? 'Simpan Perubahan' : '+ Tambah Konten'}
                </button>
                {isEdit && (
                    <button type="button" onClick={onDone} className="btn-ghost">
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
}

export default function LessonManager({ material }) {
    const [editingId, setEditingId] = useState(null);
    const [adding, setAdding] = useState(false);

    function destroy(lessonId) {
        if (confirm('Hapus konten pembelajaran ini?')) {
            router.delete(route('teacher.materials.lessons.destroy', [material.id, lessonId]), { preserveScroll: true });
        }
    }

    return (
        <div className="card mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-primary-900">Kurikulum Pembelajaran</h2>
                    <p className="mt-1 text-sm text-primary-500">
                        Susun video, PDF, dan quiz yang akan dipelajari siswa secara berurutan.
                    </p>
                </div>
                {!adding && (
                    <button type="button" onClick={() => setAdding(true)} className="text-sm font-semibold text-accent-600 hover:underline">
                        + Tambah Konten
                    </button>
                )}
            </div>

            {material.lessons.length === 0 && !adding && <p className="mt-4 text-sm text-primary-400">Belum ada konten pembelajaran.</p>}

            <ul className="mt-4 space-y-3">
                {material.lessons.map((lesson, index) => (
                    <li key={lesson.id} className="rounded-xl border border-primary-100 p-4">
                        {editingId === lesson.id ? (
                            <LessonForm material={material} lesson={lesson} onDone={() => setEditingId(null)} />
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-accent-600">
                                        {index + 1}. {typeLabels[lesson.type]}
                                    </p>
                                    <p className="truncate font-medium text-primary-900">{lesson.title}</p>
                                </div>
                                <div className="flex shrink-0 gap-3 text-sm">
                                    <button type="button" onClick={() => setEditingId(lesson.id)} className="font-semibold text-primary-600 hover:text-primary-950">
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => destroy(lesson.id)} className="font-semibold text-red-500 hover:text-red-600">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        )}

                        {lesson.type === 'quiz' && lesson.quiz && editingId !== lesson.id && (
                            <QuestionManager material={material} quiz={lesson.quiz} />
                        )}
                    </li>
                ))}
            </ul>

            {adding && <LessonForm material={material} onDone={() => setAdding(false)} />}
        </div>
    );
}
