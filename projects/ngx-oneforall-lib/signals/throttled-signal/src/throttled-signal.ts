import { Signal, signal, effect } from '@angular/core';

export function throttledSignal<T>(
    source: Signal<T>,
    delay: number
): Signal<T> {
    const out = signal(source());

    let lastEmit = Date.now();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    effect((onCleanup) => {
        const value = source();
        const now = Date.now();
        const remaining = delay - (now - lastEmit);

        if (remaining <= 0) {
            lastEmit = now;
            out.set(value);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastEmit = Date.now();
                out.set(value);
            }, remaining);
        }

        onCleanup(() => clearTimeout(timeoutId));
    });

    return out;
}
