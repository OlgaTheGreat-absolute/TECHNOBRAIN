import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { roleLabel } from '../../lib/enums';

export default function Edit({ user }) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name ?? '',
        nickname: user.nickname ?? '',
        email: user.email ?? '',
        avatar: null,
        remove_avatar: false,
    });

    const avatarSrc = preview ?? user.avatar_url;

    function pickAvatar(e) {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        setData((current) => ({ ...current, avatar: file, remove_avatar: false }));
        setPreview(URL.createObjectURL(file));
    }

    function removeAvatar() {
        setData((current) => ({ ...current, avatar: null, remove_avatar: true }));
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function submit(e) {
        e.preventDefault();
        post(route('profile.update'), { forceFormData: true, preserveScroll: true });
    }

    return (
        <>
            <Head title="Profil Saya" />

            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Profil Saya</h1>
            <p className="mt-1 text-primary-500">Ubah nama, nama panggilan, dan foto profilmu.</p>

            <form onSubmit={submit} className="card mt-6 max-w-xl p-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-400 text-2xl font-black text-primary-950">
                                {(user.nickname || user.name)?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs">
                                Ganti Foto
                            </button>
                            {avatarSrc && (
                                <button type="button" onClick={removeAvatar} className="btn-ghost text-xs text-red-500 hover:text-red-600">
                                    Hapus Foto
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
                        {errors.avatar && <p className="mt-1.5 text-sm text-red-600">{errors.avatar}</p>}
                        <p className="mt-1.5 text-xs text-primary-400">JPG atau PNG, maksimal 2MB.</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
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
                            Nama Panggilan
                            <input
                                type="text"
                                value={data.nickname}
                                onChange={(e) => setData('nickname', e.target.value)}
                                className="input mt-1.5"
                                placeholder="Tampil di komentar dan hasil quiz"
                            />
                        </label>
                        {errors.nickname && <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>}
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

                    <div>
                        <span className="label">Peran</span>
                        <p className="mt-1.5 text-sm font-semibold text-primary-700">{roleLabel(user.role)}</p>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button type="submit" disabled={processing} className="btn-primary">
                        Simpan Perubahan
                    </button>
                    {recentlySuccessful && <span className="text-sm text-emerald-600">Tersimpan.</span>}
                </div>
            </form>
        </>
    );
}
