import { useEffect, useRef, useState } from 'react';
import TypewriterText from '../../Components/TypewriterText';

const description =
    'TechnoBrain adalah platform pembelajaran interaktif yang dirancang untuk membantu siswa SMK mempelajari berbagai bidang keilmuan melalui materi digital, visualisasi interaktif, dan simulasi 3D. Guru dapat membuat dan mengelola materi secara mandiri lewat dashboard pengajar, tanpa perlu menyentuh kode sama sekali.';

export default function AboutSection() {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = sectionRef.current;

        if (!node || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(node);

        // Safety net: never leave the section stuck invisible if the
        // observer doesn't fire (e.g. it's already in view on load).
        const fallback = setTimeout(() => setVisible(true), 1500);

        return () => {
            observer.disconnect();
            clearTimeout(fallback);
        };
    }, []);

    return (
        <section id="tentang" ref={sectionRef} className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="ml-auto max-w-xl text-right">
                    <span
                        className={`eyebrow transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                        }`}
                    >
                        Tentang TechnoBrain
                    </span>

                    <h2
                        className={`mt-4 text-3xl font-extrabold uppercase tracking-tight text-primary-950 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl ${
                            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                        style={{ transitionDelay: visible ? '150ms' : '0ms' }}
                    >
                        Satu platform, dibangun untuk siswa SMK
                    </h2>

                    <div
                        className={`transition-opacity duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: visible ? '450ms' : '0ms' }}
                    >
                        <TypewriterText
                            text={description}
                            trigger={visible}
                            startDelay={750}
                            className="mt-5 min-h-[8.5em] text-primary-600 sm:min-h-[6.5em]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
