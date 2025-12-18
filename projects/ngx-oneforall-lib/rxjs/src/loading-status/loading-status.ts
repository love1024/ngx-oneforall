import { catchError, map, Observable, of, OperatorFunction, startWith } from "rxjs";

export type ResourceResult<T> = {
    isLoading: boolean;
    status: 'loading' | 'success' | 'error';
    data: T | null;
    error?: unknown;
}

export function loadingStatus<T>(): OperatorFunction<T, ResourceResult<T>> {
    return (source: Observable<T>) => {
        return source.pipe(
            map(data => ({
                status: 'success' as const,
                data
            })),
            startWith({
                status: 'loading' as const,
                data: null
            }),
            catchError((error) =>
                of({
                    status: "error" as const,
                    error,
                    data: null,
                })
            ),
            map(
                (result) =>
                ({
                    ...result,
                    isLoading: result.status === "loading",
                } satisfies ResourceResult<T>)
            )

        )
    }
}