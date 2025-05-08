import { InjectionToken } from '@angular/core';
import {
  DAY,
  mergeLabels,
  getSecondsPassed,
  HOUR,
  MINUTE,
  TimeAgoLabels,
} from './time-ago.util';
import { Observable, timer } from 'rxjs';

export const TIME_AGO_PIPE_CLOCK = new InjectionToken('TIME_AGO_PIPE_CLOCK', {
  providedIn: 'root',
  factory: () => {
    return {
      tick: (then: number) => {
        const secondsPassed = getSecondsPassed(then);
        let interval = 0;

        if (secondsPassed < MINUTE) {
          interval = 1000;
        } else if (secondsPassed < HOUR) {
          interval = MINUTE * 1000;
        } else if (secondsPassed < DAY) {
          interval = HOUR * 1000;
        }

        return timer(interval);
      },
    };
  },
});

export const TIME_AGO_PIPE_LABELS = new InjectionToken<TimeAgoLabels>(
  'TIME_AGO_PIPE_LABELS',
  {
    providedIn: 'root',
    factory: () => {
      return mergeLabels();
    },
  }
);

export const provideTimeAgoPipeLabels = (fn: () => TimeAgoLabels) => {
  return {
    provide: TIME_AGO_PIPE_LABELS,
    useValue: fn(),
  };
};

export const provideTimeAgoPipeClock = (
  fn: (then?: number) => Observable<unknown>
) => {
  return {
    provide: TIME_AGO_PIPE_CLOCK,
    useValue: {
      tick: fn,
    },
  };
};
