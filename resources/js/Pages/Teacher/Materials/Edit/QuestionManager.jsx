import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

function AnswerFields({ data, setData }) {
    function setAnswer(index, value) {
        const next = [...data.answers];
        next[index] = value;
        setData('answers', next);
    }

    return (
        <>
            {data.answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={data.correct === String(index)}
                        onChange={() => setData('correct', String(index))}
                        className="h-4 w-4 border-primary-300 text-accent-500 focus:ring-accent-400"
                    />
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(index, e.target.value)}
                        placeholder={`Pilihan jawaban ${index + 1}`}
                        required
                        className="input"
                    />
                </div>
            ))}
        </>
    );
}

function QuestionForm({ material, quiz, question, onDone }) {
    const isEdit = !!question;
    const { data, setData, post, put, processing, reset } = useForm({
        question: question?.question ?? '',
        answers: question ? question.answers.map((answer) => answer.answer_text) : ['', '', '', ''],
        correct: question ? String(question.answers.findIndex((answer) => answer.is_correct)) : '0',
    });

    function submit(e) {
        e.preventDefault();

        if (isEdit) {
            put(route('teacher.materials.quizzes.questions.update', [material.id, quiz.id, question.id]), {
                preserveScroll: true,
                onSuccess: onDone,
            });
        } else {
            post(route('teacher.materials.quizzes.questions.store', [material.id, quiz.id]), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onDone?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="mt-3 space-y-2">
            <input
                type="text"
                value={data.question}
                onChange={(e) => setData('question', e.target.value)}
                placeholder="Pertanyaan"
                required
                className="input"
            />
            <AnswerFields data={data} setData={setData} />
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="btn-secondary">
                    {isEdit ? 'Simpan' : 'Simpan Pertanyaan'}
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

export default function QuestionManager({ material, quiz }) {
    const [editingId, setEditingId] = useState(null);
    const [adding, setAdding] = useState(false);

    function destroy(questionId) {
        if (confirm('Hapus pertanyaan ini?')) {
            router.delete(route('teacher.materials.quizzes.questions.destroy', [material.id, quiz.id, questionId]), {
                preserveScroll: true,
            });
        }
    }

    return (
        <div className="mt-4 border-t border-primary-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-400">Pertanyaan Quiz</p>

            {quiz.questions.length === 0 && !adding && <p className="mt-2 text-sm text-primary-400">Belum ada pertanyaan.</p>}

            <ul className="mt-2 space-y-3 text-sm text-primary-600">
                {quiz.questions.map((question, index) =>
                    editingId === question.id ? (
                        <li key={question.id}>
                            <QuestionForm material={material} quiz={quiz} question={question} onDone={() => setEditingId(null)} />
                        </li>
                    ) : (
                        <li key={question.id} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-medium text-primary-800">
                                    {index + 1}. {question.question}
                                </p>
                                <ul className="ml-4 mt-1 list-disc text-xs text-primary-400">
                                    {question.answers.map((answer) => (
                                        <li key={answer.id} className={answer.is_correct ? 'text-emerald-600' : ''}>
                                            {answer.answer_text}
                                            {answer.is_correct ? ' (benar)' : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex shrink-0 gap-2 text-xs">
                                <button type="button" onClick={() => setEditingId(question.id)} className="font-semibold text-primary-600 hover:text-primary-950">
                                    Edit
                                </button>
                                <button type="button" onClick={() => destroy(question.id)} className="font-semibold text-red-500 hover:text-red-600">
                                    Hapus
                                </button>
                            </div>
                        </li>
                    )
                )}
            </ul>

            {adding ? (
                <QuestionForm material={material} quiz={quiz} onDone={() => setAdding(false)} />
            ) : (
                <button type="button" onClick={() => setAdding(true)} className="mt-3 text-sm font-medium text-accent-600 hover:underline">
                    + Tambah Pertanyaan
                </button>
            )}
        </div>
    );
}
