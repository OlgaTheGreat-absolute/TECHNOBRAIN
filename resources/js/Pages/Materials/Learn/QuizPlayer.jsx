import { Link, useForm, usePage } from '@inertiajs/react';

export default function QuizPlayer({ material, quiz, nextLessonId }) {
    const { flash, auth } = usePage().props;
    const { data, setData, post, processing } = useForm({ answers: {} });
    const result = flash?.quizResult;

    function selectAnswer(questionId, answerId) {
        setData('answers', { ...data.answers, [questionId]: answerId });
    }

    function submit(e) {
        e.preventDefault();
        post(route('quizzes.attempt', quiz.id));
    }

    if (result) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4">
                    {auth.user.avatar_url ? (
                        <img src={auth.user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-400 text-xs font-black text-primary-950">
                            {(auth.user.display_name ?? auth.user.name).charAt(0)}
                        </div>
                    )}
                    <span className="text-sm font-bold text-primary-900">{auth.user.display_name ?? auth.user.name}</span>
                </div>

                <p className="mt-4 text-lg font-bold text-emerald-700">
                    {result.score === result.total ? 'Jawaban benar semua!' : `Skor kamu: ${result.score} / ${result.total}`}
                </p>
                <p className="mt-1 text-sm text-emerald-600">Hasil quiz telah disimpan ke progress belajarmu.</p>

                {nextLessonId && (
                    <Link href={route('materials.learn', [material.slug, nextLessonId])} className="btn-primary mt-4">
                        Lanjut ke Materi Berikutnya &rarr;
                    </Link>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            {quiz.description && <p className="text-sm text-primary-500">{quiz.description}</p>}

            {quiz.questions.map((question, index) => (
                <fieldset key={question.id}>
                    <legend className="text-sm font-bold text-primary-900">
                        {index + 1}. {question.question}
                    </legend>
                    <div className="mt-3 space-y-2">
                        {question.answers.map((answer) => (
                            <label
                                key={answer.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                                    data.answers[question.id] === answer.id
                                        ? 'border-accent-400 bg-accent-50 text-primary-900'
                                        : 'border-primary-200 bg-paper text-primary-600 hover:border-accent-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    checked={data.answers[question.id] === answer.id}
                                    onChange={() => selectAnswer(question.id, answer.id)}
                                    className="h-4 w-4 border-primary-300 text-accent-500 focus:ring-accent-400"
                                    required
                                />
                                {answer.answer_text}
                            </label>
                        ))}
                    </div>
                </fieldset>
            ))}

            <button type="submit" disabled={processing} className="btn-primary">
                Kumpulkan Jawaban
            </button>
        </form>
    );
}
