import { Observable } from "rxjs/internal/Observable";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

export type DataProducer<T> = (query: string) => Observable<T>;

export function liveSearch<T>(delay: number, dataProducer: DataProducer<T>) {
    return (source: Observable<string>) => {
        return source.pipe(
            debounceTime(delay),
            distinctUntilChanged(),
            switchMap(dataProducer)
        );
    };
}