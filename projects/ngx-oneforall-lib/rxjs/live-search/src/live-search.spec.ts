/* eslint-disable @typescript-eslint/no-explicit-any */
import { fakeAsync, tick } from '@angular/core/testing';
import { liveSearch } from './live-search';
import { Subject, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('liveSearch', () => {
  it('should debounce input values', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => of(query);

    source
      .pipe(liveSearch(300, dataProducer))
      .subscribe(result => results.push(result));

    source.next('a');
    tick(100);
    source.next('b');
    tick(100);
    source.next('c');
    tick(299);
    expect(results).toEqual([]);

    tick(1);
    expect(results).toEqual(['c']);
  }));

  it('should filter out duplicate consecutive values', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => of(query);

    source
      .pipe(liveSearch(300, dataProducer))
      .subscribe(result => results.push(result));

    source.next('a');
    tick(300);
    expect(results).toEqual(['a']);

    source.next('a');
    tick(300);
    expect(results).toEqual(['a']); // Should not add duplicate

    source.next('b');
    tick(300);
    expect(results).toEqual(['a', 'b']);
  }));

  it('should  switch to new observables and cancel previous ones', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => {
      if (query === 'a') return of('result-a').pipe(delay(200));
      if (query === 'b') return of('result-b').pipe(delay(100));
      return of(query);
    };

    source
      .pipe(liveSearch(100, dataProducer))
      .subscribe(result => results.push(result));

    source.next('a');
    tick(100);
    tick(50);

    source.next('b');
    tick(100);
    tick(100);

    expect(results).toEqual(['result-b']); // 'a' should be canceled
  }));

  it('should call dataProducer with emitted query values', fakeAsync(() => {
    const source = new Subject<string>();
    const calls: string[] = [];
    const dataProducer = jest.fn((query: string) => {
      calls.push(query);
      return of(`result:${query}`);
    });

    source.pipe(liveSearch(100, dataProducer)).subscribe();

    source.next('test1');
    tick(100);
    source.next('test2');
    tick(100);

    expect(calls).toEqual(['test1', 'test2']);
    expect(dataProducer).toHaveBeenCalledTimes(2);
  }));

  it('should complete when source completes', fakeAsync(() => {
    const source = new Subject<string>();
    let completed = false;
    const dataProducer = (query: string) => of(query);

    source.pipe(liveSearch(100, dataProducer)).subscribe({
      complete: () => (completed = true),
    });

    source.complete();
    tick(100);

    expect(completed).toBe(true);
  }));

  it('should propagate errors from dataProducer', fakeAsync(() => {
    const source = new Subject<string>();
    let error: any = null;
    const dataProducer = () => throwError(() => new Error('test error'));

    source.pipe(liveSearch(100, dataProducer)).subscribe({
      error: err => (error = err),
    });

    source.next('test');
    tick(100);

    expect(error).toEqual(new Error('test error'));
  }));

  it('should respect custom delay values', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => of(query);

    source
      .pipe(liveSearch(500, dataProducer))
      .subscribe(result => results.push(result));

    source.next('a');
    tick(499);
    expect(results).toEqual([]);

    tick(1);
    expect(results).toEqual(['a']);
  }));

  it('should only emit last value from rapid emissions', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => of(query);

    source
      .pipe(liveSearch(300, dataProducer))
      .subscribe(result => results.push(result));

    source.next('a');
    source.next('b');
    source.next('c');
    source.next('d');

    tick(300);
    expect(results).toEqual(['d']); // Only last value
  }));

  it('should handle async data producer responses', fakeAsync(() => {
    const source = new Subject<string>();
    const results: any[] = [];
    const dataProducer = (query: string) =>
      of({ results: [query] }).pipe(delay(100));

    source
      .pipe(liveSearch(200, dataProducer))
      .subscribe(result => results.push(result));

    source.next('query');
    tick(200); // Debounce
    tick(100); // Async response

    expect(results).toEqual([{ results: ['query'] }]);
  }));

  it('should handle multiple searches with different queries', fakeAsync(() => {
    const source = new Subject<string>();
    const results: string[] = [];
    const dataProducer = (query: string) => of(query.toUpperCase());

    source
      .pipe(liveSearch(100, dataProducer))
      .subscribe(result => results.push(result));

    source.next('hello');
    tick(100);

    source.next('world');
    tick(100);

    expect(results).toEqual(['HELLO', 'WORLD']);
  }));
});
