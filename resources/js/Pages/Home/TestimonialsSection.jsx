import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { roleLabel } from '../../lib/enums';

function TestimonialForm() {
    const { data, setData, post, processing, errors, reset } = useForm({ body: '' });

    function submit(e) {
        e.preventDefault();
        post(route('testimonials.store'), { preserveScroll: true, onSuccess: () => reset() });
    }

    return (
        <form onSubmit={submit} className="card p-5">
            <label htmlFor="testimonial" className="label">
                Bagikan pengalamanmu belajar di TechnoBrain
            </label>
            <textarea
                id="testimonial"
                rows={3}
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                className="input"
                placeholder="Tulis komentarmu..."
                required
            />
            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
            <button type="submit" disabled={processing} className="btn-primary mt-3">
                Kirim Komentar
            </button>
        </form>
    );
}

function TestimonialCard({ testimonial }) {
    const [flipped, setFlipped] = useState(false);
    const role = roleLabel(testimonial.user.role);
    const lastCourse = testimonial.user.latest_progress?.material?.title;
    const avatarUrl =
        testimonial.user.avatar_url ??
        `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(testimonial.user.display_name)}&backgroundColor=f6d84a,fde047,171717`;

    return (
        <button
            type="button"
            onClick={() => setFlipped((current) => !current)}
            aria-pressed={flipped}
            className="group relative h-72 w-[82vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-primary-950 text-left shadow-sm outline-none transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-950/15 focus-visible:ring-2 focus-visible:ring-accent-400 sm:w-96"
        >
            {/* Quote face */}
            <div
                className={`absolute inset-0 flex flex-col justify-between bg-paper p-7 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    flipped ? 'pointer-events-none scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}
            >
                <p className="text-[15px] leading-relaxed text-primary-700">{testimonial.body}</p>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-400 text-sm font-black text-primary-950">
                            {testimonial.user.display_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-primary-950">{testimonial.user.display_name}</p>
                            {role && <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{role}</p>}
                        </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary-300 transition group-hover:text-accent-600">
                        Lihat profil
                    </span>
                </div>
            </div>

            {/* Profile face */}
            <div
                className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    flipped ? 'scale-100 opacity-100' : 'pointer-events-none scale-105 opacity-0'
                }`}
            >
                <img
                    src={avatarUrl}
                    alt=""
                    className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        flipped ? 'scale-100' : 'scale-110'
                    }`}
                    draggable="false"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary-950 via-primary-950/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-base font-bold text-white">{testimonial.user.display_name}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent-400">
                        {lastCourse ? `Terakhir belajar: ${lastCourse}` : role}
                    </p>
                </div>
            </div>
        </button>
    );
}

export default function TestimonialsSection({ testimonials, canComment }) {
    return (
        <section id="komentar" className="scroll-mt-20 py-16">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                <span className="eyebrow">Komentar</span>
                <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-4xl">
                    Apa kata siswa dan pengajar kami
                </h2>
                <p className="mt-2 text-sm text-primary-500">Tekan kartu untuk melihat profil penulisnya.</p>
            </div>

            {testimonials.length > 0 ? (
                <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scrollbar-none px-4 pb-4 sm:px-6 lg:px-[calc((100vw-80rem)/2+2rem)]">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                    <div className="w-px shrink-0" aria-hidden="true" />
                </div>
            ) : (
                <p className="mt-10 text-center text-sm text-primary-400">Belum ada komentar.</p>
            )}

            <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:px-8">
                {canComment ? (
                    <TestimonialForm />
                ) : (
                    <div className="card p-6 text-center">
                        <p className="text-sm text-primary-600">
                            <Link href={route('login')} className="font-semibold text-accent-600 hover:underline">
                                Masuk
                            </Link>{' '}
                            untuk menambahkan komentarmu.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
