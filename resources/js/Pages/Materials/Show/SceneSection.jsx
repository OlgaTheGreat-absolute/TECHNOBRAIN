import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import SceneViewer from '../../../Components/SceneViewer';
import ScrambleText from '../../../Components/ScrambleText';

export default function SceneSection({ material }) {
    const { auth } = usePage().props;
    const [expanded, setExpanded] = useState(false);
    const [autoRotating, setAutoRotating] = useState(true);
    const [selected, setSelected] = useState(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        if (!expanded) {
            return undefined;
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }

        document.addEventListener('keydown', handleKeydown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        };
    }, [expanded]);

    function toggleAutoRotate() {
        const next = !autoRotating;
        setAutoRotating(next);
        sceneRef.current?.setAutoRotate(next);
    }

    function closeAnnotation() {
        sceneRef.current?.clearSelection();
        setSelected(null);
    }

    // Closing the modal unmounts the SceneViewer, but `selected` lives on
    // this component — leaving it set would show the old annotation again
    // the next time the modal opens, before anything's actually selected.
    function closeModal() {
        setExpanded(false);
        setSelected(null);
    }

    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-primary-100 px-5 py-3">
                <p className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Model 3D Interaktif</p>
                <p className="text-xs text-primary-400">Seret untuk memutar</p>
            </div>

            <div className="relative">
                <SceneViewer sceneConfig={material.scene_config} className="aspect-video w-full bg-primary-950" />

                {auth?.user ? (
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-3.5 py-2 text-xs font-bold text-primary-950 shadow-lg transition hover:bg-accent-300"
                    >
                        <ExpandIcon className="h-3.5 w-3.5" />
                        Perbesar &amp; Zoom
                    </button>
                ) : (
                    <Link
                        href={route('login')}
                        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-primary-950/80 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur transition hover:bg-primary-950"
                    >
                        <ExpandIcon className="h-3.5 w-3.5" />
                        Masuk untuk Zoom
                    </Link>
                )}
            </div>

            {expanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-primary-950 shadow-2xl">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                            aria-label="Tutup"
                        >
                            &times;
                        </button>

                        <button
                            type="button"
                            onClick={toggleAutoRotate}
                            className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            {autoRotating ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
                            {autoRotating ? 'Putar Manual' : 'Putar Otomatis'}
                        </button>

                        <SceneViewer
                            ref={sceneRef}
                            sceneConfig={material.scene_config}
                            zoomable
                            autoRotate={autoRotating}
                            onSelect={setSelected}
                            className="aspect-video w-full sm:aspect-21/9"
                        />

                        <p className="border-t border-white/10 px-5 py-3 text-center text-xs text-white/50">
                            Seret untuk memutar &middot; Scroll atau cubit untuk zoom &middot; Klik bagian model untuk penjelasan
                        </p>
                    </div>

                    <LeaderAnnotation selected={selected} onClose={closeAnnotation} />
                </div>
            )}
        </div>
    );
}

function LeaderAnnotation({ selected, onClose }) {
    if (!selected) {
        return null;
    }

    const goLeft = selected.x > window.innerWidth / 2;
    const goUp = selected.y > 220;
    const endX = selected.x + (goLeft ? -110 : 110);
    const endY = selected.y + (goUp ? -80 : 80);

    return (
        <>
            <svg className="pointer-events-none fixed inset-0 z-60" width="100%" height="100%" aria-hidden="true">
                <circle cx={selected.x} cy={selected.y} r="4" fill="#f6d84a" />
                <line x1={selected.x} y1={selected.y} x2={endX} y2={endY} stroke="#f6d84a" strokeWidth="1.5" />
            </svg>

            <div
                className="fixed z-60 w-64 rounded-xl bg-white p-4 text-left shadow-2xl"
                style={{ left: endX, top: endY, transform: `translate(${goLeft ? '-100%' : '0%'}, ${goUp ? '-100%' : '0%'})` }}
            >
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-accent-600">
                        <ScrambleText key={selected.name} text={selected.label} />
                    </p>
                    <button type="button" onClick={onClose} className="shrink-0 text-primary-300 hover:text-primary-950" aria-label="Tutup penjelasan">
                        &times;
                    </button>
                </div>
                {selected.info && <p className="mt-1.5 text-xs leading-relaxed text-primary-600">{selected.info}</p>}
            </div>
        </>
    );
}

function ExpandIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
        </svg>
    );
}

function PauseIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
    );
}

function PlayIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
    );
}
