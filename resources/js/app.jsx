import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';
import PublicLayout from './Layouts/PublicLayout';
import DashboardLayout from './Layouts/DashboardLayout';

window.route = (name, params, absolute) => ziggyRoute(name, params, absolute, window.Ziggy);

/**
 * Pages under these prefixes get the authenticated dashboard shell
 * (sidebar + role-aware nav). Everything else gets the public marketing
 * shell (top nav + footer). Individual pages never import a layout
 * themselves — this is the single place that wires page -> layout, so
 * swapping a section's chrome is a one-line change here.
 */
const DASHBOARD_PREFIXES = ['Dashboard/', 'Teacher/', 'Admin/', 'Profile/', 'Games/'];

function layoutFor(name) {
    return DASHBOARD_PREFIXES.some((prefix) => name.startsWith(prefix)) ? DashboardLayout : PublicLayout;
}

createInertiaApp({
    title: (title) => (title ? `${title} — TechnoBrain` : 'TechnoBrain'),
    resolve: async (name) => {
        const module = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
        const Layout = layoutFor(name);

        module.default.layout ??= (page) => <Layout>{page}</Layout>;

        return module;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#2f2fe4',
    },
});
