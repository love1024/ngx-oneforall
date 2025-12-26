import { Signal, signal, effect } from '@angular/core';

export function debouncedSignal<T>(
    source: Signal<T>,
    delay: number
): Signal<T> {
    const out = signal(source());

    let timeoutId: any;

    effect((onCleanup) => {
        const value = source();

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => out.set(value), delay);

        onCleanup(() => clearTimeout(timeoutId));
    });

    return out;
}
