import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getJson, postJson } from '../../lib/http';

const OPTION_STYLES = [
    { bg: 'bg-rose-500', activeBg: 'bg-rose-600', shape: '▲' },
    { bg: 'bg-sky-500', activeBg: 'bg-sky-600', shape: '◆' },
    { bg: 'bg-amber-500', activeBg: 'bg-amber-600', shape: '●' },
    { bg: 'bg-emerald-500', activeBg: 'bg-emerald-600', shape: '■' },
];

const powerupLabels = {
    fifty_fifty: { label: '50:50', hint: 'Hilangkan 2 jawaban salah' },
    extra_time: { label: '+5 Detik', hint: 'Tambah waktu mengerjakan' },
    double_points: { label: 'Poin Ganda', hint: 'Poin soal ini x2' },
};

export default function Play({ roomCode, roomTitle }) {
    const [state, setState] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [eliminated, setEliminated] = useState([]);
    const [powerupBusy, setPowerupBusy] = useState(false);
    const lastQuestionId = useRef(null);
    const tickRef = useRef(null);
    const pollRef = useRef(null);

    useEffect(() => {
        async function poll() {
            try {
                const next = await getJson(route('games.state', roomCode));
                setState(next);

                if (next.question?.id !== lastQuestionId.current) {
                    lastQuestionId.current = next.question?.id ?? null;
                    setSelected(null);
                    setFeedback(null);
                    setEliminated([]);
                }

                setSeconds(next.secondsRemaining);
            } catch {
                // transient network hiccup — next tick will retry
            }
        }

        poll();
        pollRef.current = setInterval(poll, 2000);
        return () => clearInterval(pollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode]);

    useEffect(() => {
        tickRef.current = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(tickRef.current);
    }, []);

    async function submitAnswer(index) {
        if (selected !== null || state?.alreadyAnswered) {
            return;
        }

        setSelected(index);

        try {
            const result = await postJson(route('games.answer', roomCode), { selected_index: index });
            setFeedback(result);
        } catch {
            setFeedback({ error: true });
        }
    }

    async function usePowerup() {
        if (!state?.myPowerup || state.myPowerupUsed || powerupBusy) {
            return;
        }

        setPowerupBusy(true);
        try {
            const result = await postJson(route('games.powerup', roomCode));
            if (result.eliminate) {
                setEliminated(result.eliminate);
            }
            if (result.powerup === 'extra_time') {
                setSeconds((s) => s + 5);
            }
            setState((current) => ({ ...current, myPowerupUsed: true }));
        } finally {
            setPowerupBusy(false);
        }
    }

    if (!state) {
        return (
            <>
                <Head title={roomTitle} />
                <p className="text-center text-primary-400">Memuat...</p>
            </>
        );
    }

    return (
        <>
            <Head title={roomTitle} />

            {state.status === 'lobby' && (
                <div className="card mt-6 p-10 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-accent-400" />
                    <p className="mt-5 text-lg font-bold text-primary-950">Menunggu host memulai kuis...</p>
                    <p className="mt-1 text-sm text-primary-500">{state.title}</p>
                </div>
            )}

            {state.status === 'active' && state.question && (
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-500">
                            Soal {state.currentIndex + 1} / {state.totalQuestions}
                        </span>
                        <span className="rounded-full bg-primary-950 px-3 py-1 text-sm font-bold text-accent-400">{seconds}s</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-100">
                        <div
                            className="h-full rounded-full bg-accent-400 transition-all duration-1000 ease-linear"
                            style={{ width: `${Math.min(100, (seconds / state.question.seconds) * 100)}%` }}
                        />
                    </div>

                    <div className="card mt-4 p-6 text-center">
                        <h2 className="text-xl font-bold text-primary-950">{state.question.question}</h2>
                        <p className="mt-1 text-sm font-bold text-accent-600">Skor kamu: {state.myScore}</p>
                    </div>

                    {state.myPowerup && (
                        <button
                            type="button"
                            onClick={usePowerup}
                            disabled={state.myPowerupUsed || powerupBusy}
                            className={`mt-4 flex w-full items-center justify-between rounded-2xl border-2 border-dashed px-4 py-3 text-left transition ${
                                state.myPowerupUsed ? 'border-primary-200 text-primary-300' : 'border-accent-400 text-primary-950 hover:bg-accent-50'
                            }`}
                        >
                            <span>
                                <span className="font-bold">✨ {powerupLabels[state.myPowerup].label}</span>
                                <span className="ml-2 text-xs text-primary-500">{powerupLabels[state.myPowerup].hint}</span>
                            </span>
                            <span className="text-xs font-bold">{state.myPowerupUsed ? 'Terpakai' : 'Gunakan'}</span>
                        </button>
                    )}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {state.question.options.map((option, index) => {
                            const isEliminated = eliminated.includes(index);
                            const isSelected = selected === index;
                            const showResult = feedback && !feedback.error;
                            const isCorrectAnswer = showResult && index === feedback.correctIndex;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => submitAnswer(index)}
                                    disabled={selected !== null || isEliminated || state.alreadyAnswered}
                                    className={`flex items-center gap-3 rounded-2xl p-5 text-left text-white shadow-sm transition disabled:cursor-not-allowed ${
                                        isEliminated
                                            ? 'bg-primary-100 opacity-40'
                                            : isCorrectAnswer
                                              ? 'bg-emerald-500 ring-4 ring-emerald-300'
                                              : isSelected && showResult && !feedback.correct
                                                ? 'bg-red-500 ring-4 ring-red-300'
                                                : `${OPTION_STYLES[index % 4].bg} ${selected === null ? 'hover:' + OPTION_STYLES[index % 4].activeBg : ''}`
                                    }`}
                                >
                                    <span className="text-2xl">{OPTION_STYLES[index % 4].shape}</span>
                                    <span className="font-bold">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {(selected !== null || state.alreadyAnswered) && (
                        <p className="mt-4 text-center text-sm font-semibold text-primary-500">
                            {feedback && !feedback.error
                                ? feedback.correct
                                    ? `Benar! +${feedback.points} poin`
                                    : 'Kurang tepat, tetap semangat!'
                                : 'Menunggu soal berikutnya...'}
                        </p>
                    )}
                </div>
            )}

            {state.status === 'finished' && (
                <div className="card mt-6 p-8 text-center">
                    <span className="eyebrow text-accent-600">Kuis Selesai</span>
                    <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-primary-950">
                        Kamu peringkat #{state.myRank} dari {state.totalParticipants}
                    </h2>
                    <p className="mt-1 text-primary-500">Skor akhir: {state.myScore} poin</p>

                    <div className="mx-auto mt-6 flex max-w-lg items-end justify-center gap-4">
                        {state.leaderboard?.[1] && <PodiumCard entry={state.leaderboard[1]} height="h-24" />}
                        {state.leaderboard?.[0] && <PodiumCard entry={state.leaderboard[0]} height="h-32" gold />}
                        {state.leaderboard?.[2] && <PodiumCard entry={state.leaderboard[2]} height="h-16" />}
                    </div>
                </div>
            )}
        </>
    );
}

function PodiumCard({ entry, height, gold }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black ${
                            gold ? 'bg-accent-400 text-primary-950' : 'bg-primary-100 text-primary-700'
                        }`}
                    >
                        {entry.name.charAt(0)}
                    </div>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-950 text-[10px] font-bold text-accent-400">
                    {entry.rank}
                </span>
            </div>
            <p className="mt-2.5 max-w-20 truncate text-sm font-bold text-primary-950">{entry.name}</p>
            <p className="text-xs text-primary-500">{entry.score} poin</p>
            <div className={`mt-2 w-16 rounded-t-xl ${gold ? 'bg-accent-400' : 'bg-primary-200'} ${height}`} />
        </div>
    );
}
