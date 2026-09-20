import { usePage } from '@inertiajs/react';

export default function FlashMessage({ wrapperClassName = 'mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8' }) {
    const { flash } = usePage().props;

    if (!flash?.status) {
        return null;
    }

    return (
        <div className={wrapperClassName}>
            <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800" role="status">
                {flash.status}
            </div>
        </div>
    );
}
