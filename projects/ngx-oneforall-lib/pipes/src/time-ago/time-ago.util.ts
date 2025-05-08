import { timer } from 'rxjs';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export enum Unit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type TimeAgoLabels = {
  prefix?: string;
  suffix?: string;
  seconds?: string;
  minutes?: string;
  hours?: string;
  days?: string;
  weeks?: string;
  months?: string;
  years?: string;
} & Record<Unit, string>;

export function getSecondsPassed(then: number): number {
  const now = Date.now();
  return Math.floor((now - then) / 1000);
}

export function mergeLabels(labels?: TimeAgoLabels): TimeAgoLabels {
  return {
    suffix: labels?.suffix ?? 'ago',
    prefix: labels?.prefix ?? '',
    second: labels?.second ?? 'second',
    minute: labels?.minute ?? 'minute',
    hour: labels?.hour ?? 'hour',
    day: labels?.day ?? 'day',
    week: labels?.week ?? 'week',
    month: labels?.month ?? 'month',
    year: labels?.year ?? 'year',
    seconds: labels?.seconds ?? 'seconds',
    minutes: labels?.minutes ?? 'minutes',
    hours: labels?.hours ?? 'hours',
    days: labels?.days ?? 'days',
    weeks: labels?.weeks ?? 'weeks',
    months: labels?.months ?? 'months',
    years: labels?.years ?? 'years',
  };
}

export const defaultClock = {
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

export const defaultLabels: TimeAgoLabels = mergeLabels();
