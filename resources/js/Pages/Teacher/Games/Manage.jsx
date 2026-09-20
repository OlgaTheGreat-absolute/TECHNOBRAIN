import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getJson, postJson } from '../../../lib/http';

const OPTION_STYLES = [
    { bg: 'bg-rose-500', shape: '▲' },
    { bg: 'bg-sky-500', shape: '◆' },
    { bg: 'bg-amber-500', shape: '●' },
    { bg: 'bg-emerald-500', shape: '■' },
];

export default function Manage({ room: initialRoom }) {
    const [room, setRoom] = useState(initialRoom);
    const [busy, setBusy] = useState(false);
    const pollRef = useRef(null);

    useEffect(() => {
        pollRef.current = setInterval(async () => {
            try {
                const next = await getJson(route('teacher.games.state', room.code));
                setRoom(next);
            } catch {
                // transient network hiccup — next tick will retry
            }
        }, 2000);

        return () => clearInterval(pollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room.code]);

    async function refreshNow() {
        try {
            setRoom(await getJson(route('teacher.games.state', room.code)));
        } catch {
            // the next poll tick will retry
        }
    }

    async function start() {
        setBusy(true);
        await postJson(route('teacher.games.start', room.code));
        await refreshNow();
        setBusy(false);
    }

    async function next() {
        setBusy(true);
        await postJson(route('teacher.games.next', room.code));
        await refreshNow();
        setBusy(false);
    }

    async function finish() {
        setBusy(true);
        await postJson(route('teacher.games.finish', room.code));
        await refreshNow();
        setBusy(false);
    }

    function destroy() {
        if (confirm('Hapus room kuis ini?')) {
            router.delete(route('teacher.games.destroy', room.code));
        }
    }

    const isLast = room.currentIndex >= room.totalQuestions - 1;

    return (
        <>
            <Head title={room.title} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">{room.title}</h1>
                    <p className="mt-1 flex items-center gap-2 text-primary-500">
                        Kode Room: <span className="rounded-lg bg-primary-950 px-2.5 py-1 font-mono text-base font-bold text-accent-400">{room.code}</span>
                    </p>
                </div>
                <button type="button" onClick={destroy} className="btn-ghost text-red-500 hover:text-red-600">
                    Hapus Room
                </button>
            </div>

            {room.status === 'lobby' && (
                <div className="card mt-6 p-8 text-center">
                    <p className="text-sm text-primary-500">Bagikan kode ini ke siswa untuk bergabung.</p>
                    <p className="mt-2 text-5xl font-black tracking-[0.2em] text-primary-950">{room.code}</p>
                    <p className="mt-4 text-sm font-semibold text-primary-600">{room.participants.length} siswa bergabung</p>

                    <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2">
                        {room.participants.map((p) => (
                            <span key={p.id} className="badge">
                                {p.name}
                            </span>
                        ))}
                    </div>

                    <button type="button" onClick={start} disabled={busy || room.participants.length === 0} className="btn-primary mt-6">
                        Mulai Kuis
                    </button>
                </div>
            )}

            {room.status === 'active' && room.question && (
                <div className="mt-6">
                    <div className="card p-6">
                        <div className="flex items-center justify-between text-sm text-primary-500">
                            <span>
                                Soal {room.currentIndex + 1} / {room.totalQuestions}
                            </span>
                            <span className="font-bold text-primary-950">{room.secondsRemaining}s</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-100">
                            <div
                                className="h-full rounded-full bg-accent-400 transition-all duration-1000 ease-linear"
                                style={{ width: `${(room.secondsRemaining / room.question.seconds) * 100}%` }}
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-primary-950">{room.question.question}</h2>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {room.question.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 rounded-2xl p-4 text-white ${OPTION_STYLES[index % 4].bg} ${
                                        index === room.question.correctIndex ? 'ring-4 ring-primary-950' : ''
                                    }`}
                                >
                                    <span className="text-xl">{OPTION_STYLES[index % 4].shape}</span>
                                    <span className="font-semibold">{option}</span>
                                    {index === room.question.correctIndex && <span className="ml-auto text-xs font-bold">BENAR</span>}
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-primary-500">
                            {room.question.answeredCount} / {room.participants.length} siswa sudah menjawab
                        </p>
                    </div>

                    <button type="button" onClick={isLast ? finish : next} disabled={busy} className="btn-primary mt-4 w-full">
                        {isLast ? 'Selesaikan Kuis' : 'Soal Berikutnya'}
                    </button>
                </div>
            )}

            {room.status === 'finished' && (
                <div className="mt-6">
                    <div className="card p-8 text-center">
                        <span className="eyebrow text-accent-600">Kuis Selesai</span>
                        <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-primary-950">Papan Peringkat</h2>

                        <div className="mx-auto mt-6 flex max-w-lg items-end justify-center gap-4">
                            {room.leaderboard?.[1] && <PodiumCard entry={room.leaderboard[1]} height="h-24" />}
                            {room.leaderboard?.[0] && <PodiumCard entry={room.leaderboard[0]} height="h-32" gold />}
                            {room.leaderboard?.[2] && <PodiumCard entry={room.leaderboard[2]} height="h-16" />}
                        </div>
                    </div>

                    <div className="card mt-4 divide-y divide-primary-100 overflow-hidden p-0">
                        {room.participants.map((p, index) => (
                            <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                <span className="font-semibold text-primary-900">
                                    {index + 1}. {p.name}
                                </span>
                                <span className="font-bold text-accent-600">{p.score} poin</span>
                            </div>
                        ))}
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
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black ${gold ? 'bg-accent-400 text-primary-950' : 'bg-primary-100 text-primary-700'}`}
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
