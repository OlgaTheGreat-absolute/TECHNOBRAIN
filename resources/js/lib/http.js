/**
 * Minimal JSON fetch helpers for the live-quiz polling endpoints, which are
 * plain JSON routes (not Inertia visits) so they can be hit every couple of
 * seconds without a full page-swap. Laravel's CSRF guard reads the
 * XSRF-TOKEN cookie it already sets for the session, so POSTs just need to
 * echo it back as a header.
 */
function csrfToken() {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export async function getJson(url) {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error(`GET ${url} failed: ${response.status}`);
    }

    return response.json();
}

export async function postJson(url, body = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message ?? `POST ${url} failed: ${response.status}`);
        error.data = data;
        throw error;
    }

    return data;
}
