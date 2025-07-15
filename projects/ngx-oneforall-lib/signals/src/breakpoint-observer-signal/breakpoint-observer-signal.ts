import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Breakpoint,
  BreakpointQueries,
} from '../../../constants/src/breakpoints';
import { isKeyDefined } from '@ngx-oneforall/utils';

export function breakpointObserverSignal(
  breakpoints: Breakpoint | Breakpoint[]
): Signal<BreakpointState> {
  const breakpointObserver = inject(BreakpointObserver);
  const queries = (
    Array.isArray(breakpoints) ? breakpoints : [breakpoints]
  ).map(b => (isKeyDefined(BreakpointQueries, b) ? BreakpointQueries[b] : b));

  return toSignal(breakpointObserver.observe(queries), {
    initialValue: {
      matches: false,
      breakpoints: {},
    },
  });
}
