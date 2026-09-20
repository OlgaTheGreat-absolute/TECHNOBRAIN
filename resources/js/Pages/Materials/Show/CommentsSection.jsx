import { useForm, usePage } from '@inertiajs/react';

function formatDate(isoString) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(isoString));
}

function CommentForm({ materialSlug }) {
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    function submit(e) {
        e.preventDefault();
        post(route('materials.comments.store', materialSlug), { preserveScroll: true, onSuccess: () => reset() });
    }

    return (
        <form onSubmit={submit} className="mt-4">
            <textarea
                rows={3}
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                required
                className="input"
                placeholder="Tulis komentar atau pertanyaanmu..."
            />
            <button type="submit" disabled={processing} className="btn-secondary mt-3">
                Kirim Komentar
            </button>
        </form>
    );
}

export default function CommentsSection({ materialSlug, comments }) {
    const { auth } = usePage().props;

    return (
        <div className="card p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Komentar ({comments.length})</h2>

            {auth?.user && <CommentForm materialSlug={materialSlug} />}

            <ul className="mt-6 space-y-5">
                {comments.length === 0 && <li className="text-sm text-primary-400">Belum ada komentar. Jadilah yang pertama!</li>}
                {comments.map((comment) => (
                    <li key={comment.id} className="flex gap-3">
                        {comment.user.avatar_url ? (
                            <img src={comment.user.avatar_url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400 text-xs font-black text-primary-950">
                                {comment.user.display_name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-bold text-primary-950">
                                {comment.user.display_name}
                                <span className="ml-2 text-xs font-normal text-primary-400">{formatDate(comment.created_at)}</span>
                            </p>
                            <p className="mt-0.5 text-sm text-primary-600">{comment.body}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
