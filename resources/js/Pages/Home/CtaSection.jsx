import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const slides = [
    {
        key: 'register',
        bg: 'bg-accent-400',
        eyebrowClass: 'text-primary-950/60',
        titleClass: 'text-primary-950',
        descriptionClass: 'text-primary-950/70',
        eyebrow: 'Gabung sekarang',
        title: 'Siap Mulai Belajar?',
        description: 'Bergabung sebagai siswa TJKT dan dapatkan materi yang disesuaikan dengan jurusanmu.',
        cta: { label: 'Daftar Sekarang', href: () => route('register'), className: 'bg-primary-950 text-accent-400 hover:bg-primary-800' },
    },
    {
        key: 'login',
        bg: 'bg-primary-950',
        eyebrowClass: 'text-accent-400',
        titleClass: 'text-white',
        descriptionClass: 'text-white/70',
        eyebrow: 'Sudah jadi bagian kami',
        title: 'Sudah Punya Akun?',
        description: 'Masuk dan lanjutkan progress belajarmu dari mana kamu berhenti terakhir kali.',
        cta: { label: 'Masuk', href: () => route('login'), className: 'bg-accent-400 text-primary-950 hover:bg-accent-300' },
    },
];

function SlideFace({ slide }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-10 text-center sm:p-14">
            <span className={`eyebrow ${slide.eyebrowClass}`}>{slide.eyebrow}</span>
            <h2 className={`mt-2 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl ${slide.titleClass}`}>{slide.title}</h2>
            <p className={`mx-auto mt-3 max-w-xl ${slide.descriptionClass}`}>{slide.description}</p>
            <Link href={slide.cta.href()} className={`btn-primary mt-8 px-6 py-3 text-base ${slide.cta.className}`}>
                {slide.cta.label}
            </Link>
        </div>
    );
}

export default function CtaSection() {
    // currentIndex commits the instant a flip starts — it's never "pending".
    // The old slide is kept only as a fading `outgoing` visual on top; once
    // its exit animation ends it's discarded. This means the card's actual
    // content never lags behind the animation.
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dir, setDir] = useState(0);
    const [outgoing, setOutgoing] = useState(null);
    const [flipping, setFlipping] = useState(false);
    const dragStartX = useRef(null);

    function goTo(targetIndex, direction) {
        if (flipping || targetIndex === currentIndex) {
            return;
        }

        setOutgoing({ slide: slides[currentIndex], direction, id: Date.now() });
        setDir(direction);
        setCurrentIndex(targetIndex);
        setFlipping(true);
    }

    function handleOutgoingEnd() {
        setOutgoing(null);
        setFlipping(false);
    }

    useEffect(() => {
        function onWindowPointerUp(e) {
            if (dragStartX.current === null) {
                return;
            }

            const delta = e.clientX - dragStartX.current;
            dragStartX.current = null;

            if (Math.abs(delta) < 60) {
                return;
            }

            goTo(currentIndex === 0 ? 1 : 0, delta < 0 ? 1 : -1);
        }

        window.addEventListener('pointerup', onWindowPointerUp);
        return () => window.removeEventListener('pointerup', onWindowPointerUp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, flipping]);

    function onPointerDown(e) {
        dragStartX.current = e.clientX;
    }

    const current = slides[currentIndex];

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl" style={{ perspective: '1800px' }}>
                <div
                    className="relative min-h-85 cursor-grab touch-pan-y select-none overflow-hidden rounded-2xl active:cursor-grabbing"
                    style={{ transformStyle: 'preserve-3d' }}
                    onPointerDown={onPointerDown}
                >
                    <div
                        key={`${currentIndex}-${dir}`}
                        className={`absolute inset-0 ${current.bg} ${dir ? 'animate-cta-flip-in' : ''}`}
                        style={{ backfaceVisibility: 'hidden', '--flip-dir': dir || 1 }}
                    >
                        <SlideFace slide={current} />
                    </div>

                    {outgoing && (
                        <div
                            key={outgoing.id}
                            className={`absolute inset-0 ${outgoing.slide.bg} animate-cta-flip-out`}
                            style={{ backfaceVisibility: 'hidden', '--flip-dir': outgoing.direction }}
                            onAnimationEnd={handleOutgoingEnd}
                        >
                            <SlideFace slide={outgoing.slide} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
