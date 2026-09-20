import { useEffect, useState } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Reveals `text` left to right, each letter cycling through random
 * characters briefly before locking into place — a classic "decode" intro
 * for a wordmark used as the sole brand mark. Starts immediately on mount
 * unless `trigger` is false (e.g. waiting for the element to scroll into
 * view), in which case it stays blank until `trigger` flips to true.
 */
export default function ScrambleText({ text, className = '', charDelay = 70, scrambleDuration = 340, trigger = true }) {
    const [display, setDisplay] = useState(() => text.replace(/[^\s]/g, ''));

    useEffect(() => {
        if (!trigger) {
            return undefined;
        }

        let frame;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            let done = true;

            const next = text
                .split('')
                .map((char, index) => {
                    if (char === ' ') {
                        return ' ';
                    }

                    const lockAt = index * charDelay + scrambleDuration;

                    if (elapsed >= lockAt) {
                        return char;
                    }

                    done = false;

                    if (elapsed < index * charDelay) {
                        return '';
                    }

                    return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
                })
                .join('');

            setDisplay(next);

            if (!done) {
                frame = requestAnimationFrame(tick);
            }
        }

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, trigger]);

    return (
        <span className={className} aria-label={text}>
            {display || ' '}
        </span>
    );
}
