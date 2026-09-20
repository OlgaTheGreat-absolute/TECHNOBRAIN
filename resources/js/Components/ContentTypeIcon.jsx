const paths = {
    '3d': 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    image: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 4.5h18a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V5.25A.75.75 0 0 1 3 4.5ZM9.75 9a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z',
};

export default function ContentTypeIcon({ type, className = 'h-6 w-6' }) {
    const d = paths[type] ?? paths.image;

    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}
