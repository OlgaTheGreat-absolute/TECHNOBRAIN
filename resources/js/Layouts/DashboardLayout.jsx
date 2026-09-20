import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '../Components/FlashMessage';
import ScrambleText from '../Components/ScrambleText';
import { roleLabel } from '../lib/enums';

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                active ? 'bg-primary-950 text-accent-400' : 'text-primary-600 hover:bg-primary-50 hover:text-primary-950'
            }`}
        >
            {children}
        </Link>
    );
}

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = auth.user;

    return (
        <div className="min-h-screen bg-surface font-sans text-primary-950">
            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 border-r-2 border-primary-950 bg-paper p-6 transition-transform md:static md:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <Link href={route('home')} className="flex items-center text-lg font-extrabold uppercase tracking-tight text-primary-950">
                        <ScrambleText text="TechnoBrain" />
                    </Link>

                    <nav className="mt-10 space-y-1 text-sm" aria-label="Navigasi dashboard">
                        <NavItem href={route('dashboard')} active={currentUrl === '/dashboard'}>
                            Dashboard
                        </NavItem>
                        <NavItem href={route('games.index')} active={currentUrl.startsWith('/kuis')}>
                            Kuis Cepat
                        </NavItem>
                        {user.role === 'student' && (
                            <NavItem href={route('explore')} active={currentUrl.startsWith('/explore')}>
                                Explore Materi
                            </NavItem>
                        )}

                        {(user.role === 'teacher' || user.role === 'admin') && (
                            <>
                                <p className="eyebrow px-3 pb-1 pt-6">Pengajar</p>
                                <NavItem href={route('teacher.materials.index')} active={currentUrl.startsWith('/teacher/materials')}>
                                    Materi Saya
                                </NavItem>
                                <NavItem href={route('teacher.materials.create')} active={currentUrl === '/teacher/materials/create'}>
                                    + Buat Materi
                                </NavItem>
                                <NavItem href={route('teacher.games.create')} active={currentUrl === '/teacher/kuis/buat'}>
                                    + Buat Kuis Cepat
                                </NavItem>
                            </>
                        )}

                        {user.role === 'admin' && (
                            <>
                                <p className="eyebrow px-3 pb-1 pt-6">Admin</p>
                                <NavItem href={route('admin.users.index')} active={currentUrl.startsWith('/admin/users')}>
                                    Kelola Akun
                                </NavItem>
                                <NavItem href={route('admin.departments.index')} active={currentUrl.startsWith('/admin/departments')}>
                                    Jurusan
                                </NavItem>
                                <NavItem href={route('admin.subjects.index')} active={currentUrl.startsWith('/admin/subjects')}>
                                    Mata Pelajaran
                                </NavItem>
                            </>
                        )}
                    </nav>

                    <div className="absolute inset-x-6 bottom-6">
                        <Link href={route('profile.edit')} className="card mb-3 flex items-center gap-3 p-3 transition hover:border-primary-950">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-400 text-sm font-black text-primary-950">
                                    {(user.display_name ?? user.name)?.charAt(0) ?? '?'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-primary-950">{user.display_name ?? user.name}</p>
                                <p className="truncate text-xs text-primary-500">{roleLabel(user.role)}</p>
                            </div>
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="btn-secondary w-full">
                            Keluar
                        </Link>
                    </div>
                </aside>

                {sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Tutup menu"
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-30 bg-primary-950/30 md:hidden"
                    />
                )}

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-primary-950 bg-paper px-4 py-4 md:hidden">
                        <button type="button" onClick={() => setSidebarOpen((open) => !open)} className="btn-ghost px-2!" aria-label="Buka menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M3 5.75A.75.75 0 0 1 3.75 5h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.75ZM3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <span className="text-sm font-extrabold uppercase tracking-tight text-primary-950">TechnoBrain</span>
                        <span className="w-8" />
                    </header>

                    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                        <FlashMessage wrapperClassName="mb-6" />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
