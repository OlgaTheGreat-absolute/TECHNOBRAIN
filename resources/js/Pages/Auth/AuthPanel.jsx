import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function VisualPanel({ isLogin, onToggle }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-6 bg-primary-950 p-10 text-center">
            <img
                src={isLogin ? '/images/hero/hero-4.png' : '/images/hero/hero-3.png'}
                alt=""
                className="h-40 w-40 object-contain drop-shadow-2xl"
                draggable="false"
            />
            <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                    {isLogin ? 'Selamat Datang Kembali' : 'Mulai Belajar Bersama Kami'}
                </h2>
                <p className="mt-2 max-w-xs text-sm text-white/60">
                    {isLogin
                        ? 'Lanjutkan progress belajarmu dari mana kamu berhenti.'
                        : 'Buat akun gratis dan jelajahi materi interaktif TechnoBrain.'}
                </p>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className="btn-secondary border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-primary-950"
            >
                {isLogin ? 'Daftar' : 'Masuk'}
            </button>
        </div>
    );
}

function LoginFields({ form }) {
    const { data, setData, errors } = form;

    return (
        <>
            <div>
                <label className="label">
                    Email
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="input mt-1.5"
                    />
                </label>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
                <label className="label">
                    Kata Sandi
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className="input mt-1.5"
                    />
                </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-primary-500">
                <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded border-primary-300 text-accent-500 focus:ring-accent-400"
                />
                Ingat saya
            </label>
        </>
    );
}

function RegisterFields({ form, educationLevels, filteredDepartments }) {
    const { data, setData, errors } = form;

    return (
        <>
            <div>
                <label className="label">
                    Nama Lengkap
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="input mt-1.5"
                    />
                </label>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
                <label className="label">
                    Email
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="input mt-1.5"
                    />
                </label>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="label">
                        Kata Sandi
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="input mt-1.5"
                        />
                    </label>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div>
                    <label className="label">
                        Ulangi Sandi
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            className="input mt-1.5"
                        />
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="label">
                        Jenjang
                        <select
                            value={data.education_level_id}
                            onChange={(e) => setData({ ...data, education_level_id: e.target.value, department_id: '' })}
                            className="input mt-1.5"
                        >
                            <option value="">Pilih</option>
                            {educationLevels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="label">
                        Jurusan
                        <select
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            className="input mt-1.5"
                        >
                            <option value="">Pilih</option>
                            {filteredDepartments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="label">
                        Sekolah
                        <input
                            type="text"
                            value={data.institution}
                            onChange={(e) => setData('institution', e.target.value)}
                            className="input mt-1.5"
                        />
                    </label>
                </div>
                <div>
                    <label className="label">
                        Kelas
                        <input
                            type="text"
                            value={data.grade_or_semester}
                            onChange={(e) => setData('grade_or_semester', e.target.value)}
                            className="input mt-1.5"
                            placeholder="XI"
                        />
                    </label>
                </div>
            </div>
        </>
    );
}

function FormPanel({
    isLogin,
    onToggle,
    loginForm,
    registerForm,
    submitLogin,
    submitRegister,
    educationLevels,
    filteredDepartments,
    revision = 0,
}) {
    // Keyed on revision so every toggle remounts this content, replaying the
    // fade-up — held invisible (fill-mode "both") until the panel slide is
    // almost done, instead of popping in mid-slide.
    return (
        <div className="flex h-full flex-col justify-center overflow-hidden p-6 sm:p-8">
            <div
                key={revision}
                className="animate-fade-up"
                style={revision ? { animationDelay: '500ms', animationDuration: '400ms' } : undefined}
            >
                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">{isLogin ? 'Masuk' : 'Daftar'}</h1>
                <p className="mt-1 text-sm text-primary-500">
                    {isLogin ? 'Lanjutkan perjalanan belajarmu.' : 'Akun baru otomatis terdaftar sebagai siswa.'}
                </p>

                {isLogin ? (
                    <form onSubmit={submitLogin} className="mt-5 space-y-3">
                        <LoginFields form={loginForm} />
                        <button type="submit" disabled={loginForm.processing} className="btn-primary w-full">
                            Masuk
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submitRegister} className="mt-5 space-y-3">
                        <RegisterFields form={registerForm} educationLevels={educationLevels} filteredDepartments={filteredDepartments} />
                        <button type="submit" disabled={registerForm.processing} className="btn-primary w-full">
                            Daftar
                        </button>
                    </form>
                )}

                <p className="mt-4 text-center text-sm text-primary-500 lg:hidden">
                    {isLogin ? (
                        <>
                            Belum punya akun?{' '}
                            <button type="button" onClick={onToggle} className="font-medium text-accent-600 hover:underline">
                                Daftar sekarang
                            </button>
                        </>
                    ) : (
                        <>
                            Sudah punya akun?{' '}
                            <button type="button" onClick={onToggle} className="font-medium text-accent-600 hover:underline">
                                Masuk
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default function AuthPanel({ mode: initialMode, educationLevels, departments }) {
    const [mode, setMode] = useState(initialMode);
    const [revision, setRevision] = useState(0);
    const isLogin = mode === 'login';

    const loginForm = useForm({ email: '', password: '', remember: false });
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        education_level_id: '',
        department_id: '',
        institution: '',
        grade_or_semester: '',
    });

    const filteredDepartments = useMemo(
        () =>
            departments.filter(
                (department) =>
                    !registerForm.data.education_level_id ||
                    String(department.education_level_id) === String(registerForm.data.education_level_id)
            ),
        [departments, registerForm.data.education_level_id]
    );

    function toggleMode() {
        setMode((current) => (current === 'login' ? 'register' : 'login'));
        setRevision((r) => r + 1);
    }

    function submitLogin(e) {
        e.preventDefault();
        loginForm.post(route('login'));
    }

    function submitRegister(e) {
        e.preventDefault();
        registerForm.post(route('register'));
    }

    const sharedProps = {
        onToggle: toggleMode,
        loginForm,
        registerForm,
        submitLogin,
        submitRegister,
        educationLevels,
        filteredDepartments,
    };

    return (
        <>
            <Head title={isLogin ? 'Masuk' : 'Daftar'} />

            <section className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-primary-100 bg-paper shadow-xl lg:h-165">
                    {/*
                     * Desktop: a single two-frame track. Frame 1 is always the
                     * "login" layout (image | form), frame 2 is always
                     * "register" (form | image) — sliding the whole track
                     * between them means the two frames never overlap, unlike
                     * two independently-animated panels crossing paths.
                     */}
                    <div className="hidden h-full overflow-hidden lg:block">
                        <div
                            className="flex h-full transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: '200%', transform: isLogin ? 'translateX(0%)' : 'translateX(-50%)' }}
                        >
                            <div className="flex h-full w-1/2 shrink-0">
                                <div className="w-1/2 shrink-0">
                                    <VisualPanel isLogin onToggle={toggleMode} />
                                </div>
                                <div className="w-1/2 shrink-0">
                                    <FormPanel {...sharedProps} isLogin revision={revision} />
                                </div>
                            </div>
                            <div className="flex h-full w-1/2 shrink-0">
                                <div className="w-1/2 shrink-0">
                                    <FormPanel {...sharedProps} isLogin={false} revision={revision} />
                                </div>
                                <div className="w-1/2 shrink-0">
                                    <VisualPanel isLogin={false} onToggle={toggleMode} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: form only, no side-by-side slide */}
                    <div className="lg:hidden">
                        <FormPanel {...sharedProps} isLogin={isLogin} />
                    </div>
                </div>
            </section>
        </>
    );
}
