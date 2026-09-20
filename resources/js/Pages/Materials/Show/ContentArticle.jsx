export default function ContentArticle({ content }) {
    if (!content) {
        return null;
    }

    return (
        <article className="card p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Materi</h2>
            <p className="mt-3 whitespace-pre-line text-primary-600">{content}</p>
        </article>
    );
}
