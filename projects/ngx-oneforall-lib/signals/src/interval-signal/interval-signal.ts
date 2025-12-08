import {
    signal,
    WritableSignal,
    Signal,
    inject,
    DestroyRef,
    NgZone
} from '@angular/core';

export interface IntervalController {
    value: Signal<number>;
    running: Signal<boolean>;
    start: () => void;
    stop: () => void;
}

export function intervalSignal(ms: number): IntervalController {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    const value = signal(0);
    const running = signal(false);

    let intervalId: any = null;
    let count = 0;

    const start = () => {
        if (running()) return;
        running.set(true);

        zone.runOutsideAngular(() => {
            intervalId = setInterval(() => {
                zone.run(() => value.set(++count));
            }, ms);
        });
    }

    const stop = () => {
        running.set(false);
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    destroyRef.onDestroy(stop);

    return {
        value: value.asReadonly(),
        running: running.asReadonly(),
        start,
        stop
    };
}
