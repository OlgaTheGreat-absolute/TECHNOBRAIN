import { useEffect, useState } from 'react';

/**
 * Reveals `text` character by character once `trigger` becomes true, with a
 * blinking caret while typing. Stays blank until triggered (e.g. by an
 * IntersectionObserver watching the element's scroll position).
 */
export default function TypewriterText({ text, trigger, className = '', speed = 18, startDelay = 200 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) {
            return undefined;
        }

        let cancelled = false;
        let interval;

        const timeout = setTimeout(() => {
            if (cancelled) {
                return;
            }

            interval = setInterval(() => {
                setCount((current) => {
                    if (current >= text.length) {
                        clearInterval(interval);
                        return current;
                    }

                    return current + 1;
                });
            }, speed);
        }, startDelay);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, trigger]);

    const done = count >= text.length;

    return (
        <p className={className} aria-label={text}>
            {text.slice(0, count)}
            {!done && trigger && <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-current align-middle" aria-hidden="true" />}
        </p>
    );
}
