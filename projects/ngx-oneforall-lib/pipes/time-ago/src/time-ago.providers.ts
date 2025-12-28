import { InjectionToken } from '@angular/core';
import { TimeAgoLabels } from './time-ago.util';
import { Observable } from 'rxjs';

type clockFn = (then?: number) => Observable<unknown>;
type labelFn = () => TimeAgoLabels;

export const TIME_AGO_PIPE_CLOCK = new InjectionToken<{ tick: clockFn }>(
  'TIME_AGO_PIPE_CLOCK'
);

export const TIME_AGO_PIPE_LABELS = new InjectionToken<TimeAgoLabels>(
  'TIME_AGO_PIPE_LABELS'
);

export const provideTimeAgoPipeLabels = (fn: labelFn) => {
  return {
    provide: TIME_AGO_PIPE_LABELS,
    useValue: fn(),
  };
};

export const provideTimeAgoPipeClock = (fn: clockFn) => {
  return {
    provide: TIME_AGO_PIPE_CLOCK,
    useValue: {
      tick: fn,
    },
  };
};
