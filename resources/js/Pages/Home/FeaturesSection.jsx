import { useEffect, useRef, useState } from 'react';

const steps = [
    {
        label: 'Learn',
        title: 'Materi terstruktur, bukan sekadar bacaan',
        description: 'Materi pembelajaran disusun bertahap untuk berbagai bidang, dari dasar sampai siap dipraktikkan.',
        icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
        image: '/images/hero/hero-2.png',
    },
    {
        label: 'Explore',
        title: 'Temukan materi yang sesuai jurusanmu',
        description: 'Jelajahi materi berdasarkan jenjang, jurusan, mata pelajaran, dan tingkat kesulitan yang kamu inginkan.',
        icon: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
        image: '/images/hero/hero-3.png',
    },
    {
        label: 'Interact',
        title: 'Belajar lewat simulasi dan objek 3D',
        description: 'Putar, jelajahi, dan klik bagian model 3D interaktif — seperti router MikroTik yang bisa kamu bongkar sendiri.',
        icon: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
        image: '/images/hero/hero-1.png',
    },
    {
        label: 'Practice',
        title: 'Uji pemahaman lewat aktivitas dan quiz',
        description: 'Setiap materi dilengkapi aktivitas dan quiz singkat sehingga progress belajarmu benar-benar terukur.',
        icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
        image: '/images/hero/hero-5.png',
    },
];

function StepIcon({ d, className = 'h-6 w-6' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

export default function FeaturesSection() {
    const [active, setActive] = useState(0);
    const stepRefs = useRef([]);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') {
            return undefined;
        }

        const observers = steps.map((_, index) => {
            const node = stepRefs.current[index];

            if (!node) {
                return null;
            }

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActive(index);
                    }
                },
                { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
            );

            observer.observe(node);
            return observer;
        });

        return () => observers.forEach((observer) => observer?.disconnect());
    }, []);

    return (
        <section id="keunggulan" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="eyebrow">Keunggulan</span>
                    <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-4xl">
                        Belajar bukan cuma membaca teks
                    </h2>
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Sticky visual panel — crossfades to match whichever step is in view */}
                    <div className="hidden lg:block">
                        <div className="sticky top-28 h-110 overflow-hidden rounded-2xl border border-primary-100 bg-primary-950">
                            {steps.map((step, index) => (
                                <div
                                    key={step.label}
                                    className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 transition-all duration-700 ease-out ${
                                        index === active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                    }`}
                                    aria-hidden={index !== active}
                                >
                                    <img src={step.image} alt="" className="h-56 w-56 object-contain drop-shadow-2xl" draggable="false" />
                                    <p className="text-2xl font-extrabold uppercase tracking-tight text-white">{step.label}</p>
                                </div>
                            ))}

                            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                                {steps.map((step, index) => (
                                    <span
                                        key={step.label}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                            index === active ? 'w-8 bg-accent-400' : 'w-1.5 bg-white/25'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scrollable steps */}
                    <div className="flex flex-col gap-16 lg:gap-0">
                        {steps.map((step, index) => (
                            <div
                                key={step.label}
                                ref={(el) => (stepRefs.current[index] = el)}
                                className="flex min-h-[40vh] flex-col justify-center py-6 lg:min-h-[50vh] lg:py-0"
                            >
                                <div className="flex items-center gap-3 lg:hidden">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-950 text-accent-400">
                                        <StepIcon d={step.icon} />
                                    </div>
                                    <span className="eyebrow">{step.label}</span>
                                </div>

                                <span className="eyebrow hidden lg:inline-block">0{index + 1} &middot; {step.label}</span>
                                <h3 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-3xl">
                                    {step.title}
                                </h3>
                                <p className="mt-4 max-w-md text-primary-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
