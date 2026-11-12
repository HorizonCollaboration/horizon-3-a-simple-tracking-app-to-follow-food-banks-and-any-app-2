import { useEffect, useRef } from 'react';

// The heading for each screen. After someone switches screens, focus moves here
// so keyboard and screen reader users start at the top of the new screen.
export default function ScreenHeading({ children, focusOnShow, intro }) {
    const ref = useRef(null);

    useEffect(() => {
        if (focusOnShow) ref.current?.focus();
    }, [focusOnShow]);

    return (
        <div>
            <h1 ref={ref} tabIndex={-1} className="font-display text-2xl font-bold text-ink focus:outline-none sm:text-3xl">
                {children}
            </h1>
            {intro && <p className="mt-1 text-base text-ink-muted">{intro}</p>}
        </div>
    );
}
