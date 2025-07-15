import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Breakpoint, BreakpointQueries } from '@ngx-oneforall/constants';

export interface BreakpointResult {
  matches: boolean;
  breakpoints: Record<string, boolean>;
}

export function breakpointObserverSignal(
  breakpoints: Breakpoint | string | (Breakpoint | string)[]
): Signal<BreakpointResult> {
  const breakpointObserver = inject(BreakpointObserver);
  const reverseMap = new Map<string, Breakpoint>();

  const queries = (
    Array.isArray(breakpoints) ? breakpoints : [breakpoints]
  ).map(b => {
    if (isBreakpoint(b)) {
      reverseMap.set(BreakpointQueries[b], b);
      return BreakpointQueries[b];
    }
    return b;
  });

  const observer = toSignal(breakpointObserver.observe(queries), {
    initialValue: {
      matches: false,
      breakpoints: {},
    },
  });

  return computed(() => {
    const response = observer();
    const reversedBreakpoints: Record<string, boolean> = {};
    Object.entries(response.breakpoints).forEach(([query, value]) => {
      const breakpoint = reverseMap.get(query);
      if (breakpoint) {
        reversedBreakpoints[breakpoint] = value;
      } else {
        reversedBreakpoints[query] = value;
      }
    });
    return {
      matches: response.matches,
      breakpoints: reversedBreakpoints,
    } satisfies BreakpointResult;
  });
}

function isBreakpoint(value: any): value is Breakpoint {
  return value in Breakpoint;
}
