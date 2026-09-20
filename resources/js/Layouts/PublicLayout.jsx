import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import FlashMessage from '../Components/FlashMessage';
import ScrambleText from '../Components/ScrambleText';

const navLinks = [
    { href: '/#beranda', label: 'Beranda' },
    { href: '/#tentang', label: 'Tentang' },
    { href: '/#keunggulan', label: 'Keunggulan' },
    { href: '/#komentar', label: 'Komentar' },
];

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);
    const footerRef = useRef(null);

    useEffect(() => {
        const node = footerRef.current;

        if (!node || typeof IntersectionObserver === 'undefined') {
            setFooterVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFooterVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    function submitSearch(e) {
        e.preventDefault();
        router.get(route('explore'), { q: query });
    }

    return (
        <div className="min-h-screen bg-surface font-sans text-primary-900">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-950 focus:px-4 focus:py-2 focus:text-accent-400"
            >
                Langsung ke konten
            </a>

            <header className="sticky top-0 z-40 h-20 border-b border-white/10 bg-primary-950/55 shadow-lg shadow-primary-950/20 backdrop-blur-xl">
                <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
                    <Link href={route('home')} className="flex items-center text-lg font-extrabold uppercase tracking-tight text-white">
                        <ScrambleText text="TechnoBrain" />
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-xs font-bold uppercase tracking-[0.12em] text-white/70 transition hover:text-accent-400"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href={route('explore')}
                            className="text-xs font-bold uppercase tracking-[0.12em] text-white/70 transition hover:text-accent-400"
                        >
                            Explore
                        </Link>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <form onSubmit={submitSearch} className="relative">
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari MikroTik, React..."
                                className="input w-56 pr-9 text-sm"
                            />
                            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-accent-600" aria-label="Cari">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="btn-secondary hidden border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-primary-950 sm:inline-flex"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-ghost hidden text-white/80 hover:text-accent-400 sm:inline-flex">
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="btn-primary bg-accent-400 text-primary-950 hover:bg-accent-300">
                                    Daftar
                                </Link>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="btn-ghost px-2! text-white/80 hover:text-accent-400 md:hidden"
                            aria-label="Buka menu"
                            aria-expanded={menuOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M3 5.75A.75.75 0 0 1 3.75 5h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.75ZM3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </nav>

                {menuOpen && (
                    <div className="border-t border-primary-800 bg-primary-950 px-4 py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs font-bold uppercase tracking-[0.12em] text-white/70"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link href={route('explore')} className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                                Explore
                            </Link>
                            {!auth?.user && (
                                <Link href={route('login')} className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main id="main">
                <FlashMessage />
                {children}
            </main>

            <footer ref={footerRef} className="mt-24 border-t-2 border-primary-950">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-base font-extrabold uppercase tracking-tight text-primary-950">
                                <ScrambleText text="TechnoBrain" trigger={footerVisible} />
                            </p>
                            <p className="mt-2 max-w-sm text-sm text-primary-500">
                                Media pembelajaran interaktif untuk siswa SMK — mulai dari TJKT, lintas jurusan.
                            </p>
                        </div>
                        <div className="flex gap-6 text-xs font-bold uppercase tracking-[0.12em] text-primary-600">
                            <Link href={route('explore')} className="hover:text-accent-600">
                                Explore
                            </Link>
                            <Link href={route('register')} className="hover:text-accent-600">
                                Daftar
                            </Link>
                            <Link href={route('login')} className="hover:text-accent-600">
                                Masuk
                            </Link>
                        </div>
                    </div>
                    <p className="mt-8 text-xs text-primary-400">&copy; {new Date().getFullYear()} TechnoBrain.</p>
                </div>
            </footer>
        </div>
    );
}
