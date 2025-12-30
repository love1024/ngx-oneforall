import { fakeAsync, tick } from '@angular/core/testing';
import { dataPolling } from './data-polling';
import { Subject, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('dataPolling', () => {
  it('should immediately call loader on subscription', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => {
      callCount++;
      return of(callCount);
    };

    source
      .pipe(dataPolling({ loader, interval: 1000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);

    expect(results).toEqual([1]); // Immediate emission
    expect(callCount).toBe(1);
  }));

  it('should poll at specified interval', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => {
      callCount++;
      return of(callCount);
    };

    source
      .pipe(dataPolling({ loader, interval: 2000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([1]);

    tick(2000); // 2 seconds
    expect(results).toEqual([1, 2]);

    tick(2000); // Another 2 seconds
    expect(results).toEqual([1, 2, 3]);
  }));

  it('should cancel previous polling when source emits again', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => {
      callCount++;
      return of(callCount);
    };

    source
      .pipe(dataPolling({ loader, interval: 2000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([1]);

    tick(1000); // 1 second in
    source.next(); // Trigger again, should cancel previous timer
    tick(0);
    expect(results).toEqual([1, 2]); // New immediate call

    tick(2000);
    expect(results).toEqual([1, 2, 3]); // New interval
  }));

  it('should handle async loader responses', fakeAsync(() => {
    const source = new Subject<void>();
    const results: string[] = [];
    const loader = () => of('data').pipe(delay(500));

    source
      .pipe(dataPolling({ loader, interval: 2000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(500); // Wait for async
    expect(results).toEqual(['data']);

    tick(1500); // Complete 2 second interval
    tick(500); // Wait for async
    expect(results).toEqual(['data', 'data']);
  }));

  it('should propagate errors from loader', fakeAsync(() => {
    const source = new Subject<void>();
    let error: any = null;
    const loader = () => throwError(() => new Error('loader error'));

    source.pipe(dataPolling({ loader, interval: 1000 })).subscribe({
      error: err => (error = err),
    });

    source.next();
    tick(0);

    expect(error).toEqual(new Error('loader error'));
  }));

  it('should work with different interval values', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => of(++callCount);

    source
      .pipe(dataPolling({ loader, interval: 5000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([1]);

    tick(5000);
    expect(results).toEqual([1, 2]);

    tick(5000);
    expect(results).toEqual([1, 2, 3]);
  }));

  it('should handle multiple emissions from loader', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    const loader = () => of(1, 2, 3); // Multiple sync emissions

    source
      .pipe(dataPolling({ loader, interval: 1000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);

    // switchMap will only emit last value from inner observable
    expect(results).toEqual([1, 2, 3]);
  }));

  it('should continue polling after source emission', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => of(++callCount);
    const subscription = source
      .pipe(dataPolling({ loader, interval: 1000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([1]);

    tick(1000);
    expect(results).toEqual([1, 2]);

    tick(1000);
    expect(results).toEqual([1, 2, 3]);

    subscription.unsubscribe();
    tick(10000); // After unsubscribe, no more emissions

    expect(results).toEqual([1, 2, 3]); // Stopped at 3
  }));

  it('should handle loader that returns different data types', fakeAsync(() => {
    const source = new Subject<void>();
    const results: { id: number; name: string }[] = [];
    let id = 0;
    const loader = () => of({ id: ++id, name: `item-${id}` });

    source
      .pipe(dataPolling({ loader, interval: 1000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([{ id: 1, name: 'item-1' }]);

    tick(1000);
    expect(results).toEqual([
      { id: 1, name: 'item-1' },
      { id: 2, name: 'item-2' },
    ]);
  }));

  it('should handle immediate re-subscription', fakeAsync(() => {
    const source = new Subject<void>();
    const results: number[] = [];
    let callCount = 0;
    const loader = () => of(++callCount);

    source
      .pipe(dataPolling({ loader, interval: 1000 }))
      .subscribe(result => results.push(result));

    source.next();
    tick(0);
    expect(results).toEqual([1]);

    source.next(); // Immediate re-trigger
    tick(0);
    expect(results).toEqual([1, 2]);
  }));
});
