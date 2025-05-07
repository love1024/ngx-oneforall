import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TimeAgoPipe } from './time-ago.pipe';
import { ChangeDetectorRef } from '@angular/core';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: {
            markForCheck: jest.fn(),
          },
        },
        TimeAgoPipe,
      ],
    });
    pipe = TestBed.inject(TimeAgoPipe);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "0 second ago" for dates very close to the current time', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('0 second ago');
  });

  it('should should accept the input as string as well', () => {
    const now = new Date();
    const dateString = now.toISOString();
    expect(pipe.transform(dateString)).toBe('0 second ago');
  });

  it('should return "x seconds ago" for dates within the last minute', () => {
    const now = new Date();
    const secondsAgo = new Date(now.getTime() - 15 * 1000); // 15 seconds ago
    expect(pipe.transform(secondsAgo)).toBe('15 seconds ago');
  });

  it('should return "x minutes ago" for dates within the last hour', () => {
    const now = new Date();
    const minutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    expect(pipe.transform(minutesAgo)).toBe('5 minutes ago');
  });

  it('should return "x hours ago" for dates within the last day', () => {
    const now = new Date();
    const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(pipe.transform(hoursAgo)).toBe('3 hours ago');
  });

  it('should return "1 day ago" for dates approximately 1 day ago', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    expect(pipe.transform(yesterday)).toBe('1 day ago');
  });

  it('should return "x week ago" for dates more than a 7 days', () => {
    const now = new Date();
    const daysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    expect(pipe.transform(daysAgo)).toBe('1 week ago');
  });

  it('should return "x months ago" for dates within the last year', () => {
    const now = new Date();
    const monthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000); // 6 months ago
    expect(pipe.transform(monthsAgo)).toBe('6 months ago');
  });

  it('should return "x years ago" for dates older than a year', () => {
    const now = new Date();
    const yearsAgo = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000); // 3 years ago
    expect(pipe.transform(yearsAgo)).toBe('3 years ago');
  });

  it('should handle invalid dates gracefully', () => {
    try {
      pipe.transform('invalid-date');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);
      if (e instanceof Error) {
        expect(e.message).toBe('Invalid date format');
      }
    }
  });

  it('should unsubscribe from the clock first before subscribing again', fakeAsync(() => {
    const now = new Date();
    const secondsAgo = new Date(now.getTime() - 15 * 1000); // 15 seconds ago

    pipe.transform(secondsAgo, true);
    pipe.transform(secondsAgo, true);

    const transformSpy = jest.spyOn(changeDetectorRef, 'markForCheck');

    tick(1000);

    expect(transformSpy).toHaveBeenCalledTimes(1);
  }));

  it('should trigger mark for check after calculated time', fakeAsync(() => {
    const now = new Date();
    const secondsAgo = new Date(now.getTime() - 5 * 1000); // 5 seconds ago

    pipe.transform(secondsAgo, true);

    const transformSpy = jest.spyOn(changeDetectorRef, 'markForCheck');

    tick(1000);

    expect(transformSpy).toHaveBeenCalled();
  }));
});
