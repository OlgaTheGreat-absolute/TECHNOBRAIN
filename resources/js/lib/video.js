/**
 * Converts a common YouTube watch/share URL into its embeddable form.
 * Falls back to the original URL for any other host (e.g. Vimeo, a direct
 * .mp4 link, or an already-embeddable URL) since <iframe> handles most
 * video hosts directly.
 */
export function toEmbedUrl(url) {
    if (!url) {
        return url;
    }

    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes('youtu.be')) {
            return `https://www.youtube.com/embed${parsed.pathname}`;
        }

        if (parsed.hostname.includes('youtube.com')) {
            const videoId = parsed.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        return url;
    } catch {
        return url;
    }
}
