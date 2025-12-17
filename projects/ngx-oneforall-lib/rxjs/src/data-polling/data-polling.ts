import { OperatorFunction, Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

export function dataPolling<T>(data: {
    loader: () => Observable<T>;
    interval: number;
}): OperatorFunction<any, T> {
    return (source) =>
        source.pipe(
            switchMap(() =>
                timer(0, data.interval * 1000).pipe(
                    switchMap(data.loader)
                )
            )
        );
}
