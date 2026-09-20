import { Head, Link, useForm } from '@inertiajs/react';

function emptyQuestion() {
    return { question: '', options: ['', '', '', ''], correct_index: 0, seconds: '' };
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        default_seconds: 20,
        questions: [emptyQuestion()],
    });

    function updateQuestion(index, patch) {
        const next = [...data.questions];
        next[index] = { ...next[index], ...patch };
        setData('questions', next);
    }

    function updateOption(qIndex, oIndex, value) {
        const next = [...data.questions];
        const options = [...next[qIndex].options];
        options[oIndex] = value;
        next[qIndex] = { ...next[qIndex], options };
        setData('questions', next);
    }

    function addQuestion() {
        setData('questions', [...data.questions, emptyQuestion()]);
    }

    function removeQuestion(index) {
        setData(
            'questions',
            data.questions.filter((_, i) => i !== index)
        );
    }

    function submit(e) {
        e.preventDefault();
        post(route('teacher.games.store'));
    }

    return (
        <>
            <Head title="Buat Room Kuis" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Buat Room Kuis</h1>
                    <p className="mt-1 text-primary-500">Susun soal pilihan ganda untuk kuis cepat-cepatan.</p>
                </div>
                <Link href={route('games.index')} className="btn-secondary">
                    Batal
                </Link>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="card grid gap-4 p-6 sm:grid-cols-[2fr_1fr]">
                    <div>
                        <label className="label">
                            Judul Kuis
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                className="input mt-1.5"
                                placeholder="Kuis Dasar Jaringan"
                            />
                        </label>
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="label">
                            Waktu per Soal (detik)
                            <input
                                type="number"
                                min={5}
                                max={120}
                                value={data.default_seconds}
                                onChange={(e) => setData('default_seconds', e.target.value)}
                                required
                                className="input mt-1.5"
                            />
                        </label>
                    </div>
                </div>

                {data.questions.map((question, qIndex) => (
                    <div key={qIndex} className="card p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-extrabold uppercase tracking-wide text-accent-600">Soal {qIndex + 1}</p>
                            {data.questions.length > 1 && (
                                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-xs font-semibold text-red-500 hover:text-red-600">
                                    Hapus Soal
                                </button>
                            )}
                        </div>

                        <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                            required
                            rows={2}
                            className="input mt-3"
                            placeholder="Tulis pertanyaan..."
                        />
                        {errors[`questions.${qIndex}.question`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`questions.${qIndex}.question`]}</p>
                        )}

                        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            {question.options.map((option, oIndex) => (
                                <label
                                    key={oIndex}
                                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition ${
                                        question.correct_index === oIndex ? 'border-accent-400 bg-accent-50' : 'border-primary-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        checked={question.correct_index === oIndex}
                                        onChange={() => updateQuestion(qIndex, { correct_index: oIndex })}
                                        className="h-4 w-4 shrink-0 border-primary-300 text-accent-500 focus:ring-accent-400"
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                        required
                                        placeholder={`Pilihan ${oIndex + 1}`}
                                        className="w-full bg-transparent text-sm text-primary-900 focus:outline-none"
                                    />
                                </label>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-primary-400">Pilih tombol radio di jawaban yang benar.</p>
                    </div>
                ))}

                <button type="button" onClick={addQuestion} className="btn-secondary w-full">
                    + Tambah Soal
                </button>

                <button type="submit" disabled={processing} className="btn-primary w-full">
                    Simpan &amp; Buat Room
                </button>
            </form>
        </>
    );
}
