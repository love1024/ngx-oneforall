/* eslint-disable @typescript-eslint/no-explicit-any */
import { of, throwError, timer } from 'rxjs';
import { loadingStatus } from './loading-status';
import { map } from 'rxjs/operators';

describe('loadingStatus', () => {
  it('should emit loading then success state', done => {
    const source$ = of('test-data');
    const results: any[] = [];

    source$.pipe(loadingStatus()).subscribe({
      next: res => results.push(res),
      complete: () => {
        expect(results).toEqual([
          { status: 'loading', data: null, error: null, isLoading: true },
          {
            status: 'success',
            data: 'test-data',
            error: null,
            isLoading: false,
          },
        ]);
        done();
      },
    });
  });

  it('should emit loading then error state', done => {
    const error = new Error('test-error');
    const source$ = throwError(() => error);
    const results: any[] = [];

    source$.pipe(loadingStatus()).subscribe({
      next: res => results.push(res),
      complete: () => {
        expect(results).toEqual([
          { status: 'loading', data: null, error: null, isLoading: true },
          { status: 'error', data: null, error: error, isLoading: false },
        ]);
        done();
      },
    });
  });

  it('should handle async data', done => {
    const source$ = timer(10).pipe(map(() => 'delayed-data'));
    const results: any[] = [];

    source$.pipe(loadingStatus()).subscribe({
      next: res => results.push(res),
      complete: () => {
        expect(results).toEqual([
          { status: 'loading', data: null, error: null, isLoading: true },
          {
            status: 'success',
            data: 'delayed-data',
            error: null,
            isLoading: false,
          },
        ]);
        done();
      },
    });
  });
});
