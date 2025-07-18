import { isPlatformBrowser } from '@angular/common';
import { effect, inject, PLATFORM_ID, signal, Signal } from '@angular/core';
import { Breakpoint, BreakpointQueries } from '@ngx-oneforall/constants';

type BreakpointInput = Breakpoint | string;
export interface BreakpointResult {
  matches: boolean;
  breakpoints: Record<string, boolean>;
}

export function breakpointMatcherSignal(
  breakpoint: BreakpointInput
): Signal<boolean> {
  const platformId = inject(PLATFORM_ID);
  const state = signal<boolean>(breakpoint === 'all' || breakpoint === '');
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const query = isBreakpoint(breakpoint)
      ? BreakpointQueries[breakpoint]
      : breakpoint;

    const mediaQuery = window.matchMedia(query);
    state.set(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => state.set(event.matches);

    // Added just for unsubscription
    effect(() => {
      if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', handler);
      } else {
        // @ts-expect-error deprecated API
        mediaQuery.addListener(handler);
      }

      return () => {
        if ('removeEventListener' in mediaQuery) {
          mediaQuery.removeEventListener('change', handler);
        } else {
          // @ts-expect-error deprecated API
          mediaQuery.removeListener(handler);
        }
      };
    });
  }

  return state.asReadonly();
}

// export function breakpointMatcherMultipleSignal(
//   breakpoints: BreakpointInput[]
// ): Signal<BreakpointResult> {
//   const platform = inject(Platform);
//   const state = signal<BreakpointResult>({
//     matches: false,
//     breakpoints: {},
//   });
//   if (platform.isBrowser && window.matchMedia) {
//   }

//   const breakpointObserver = inject(BreakpointObserver);
//   const reverseMap = new Map<string, Breakpoint>();

//   const queries = (
//     Array.isArray(breakpoints) ? breakpoints : [breakpoints]
//   ).map(b => {
//     if (isBreakpoint(b)) {
//       reverseMap.set(BreakpointQueries[b], b);
//       return BreakpointQueries[b];
//     }
//     return b;
//   });

//   const observer = toSignal(breakpointObserver.observe(queries), {
//     initialValue: {
//       matches: false,
//       breakpoints: {},
//     },
//   });

//   return computed(() => {
//     const response = observer();
//     const reversedBreakpoints: Record<string, boolean> = {};
//     Object.entries(response.breakpoints).forEach(([query, value]) => {
//       const breakpoint = reverseMap.get(query);
//       if (breakpoint) {
//         reversedBreakpoints[breakpoint] = value;
//       } else {
//         reversedBreakpoints[query] = value;
//       }
//     });
//     return {
//       matches: response.matches,
//       breakpoints: reversedBreakpoints,
//     } satisfies BreakpointResult;
//   });
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBreakpoint(value: any): value is Breakpoint {
  return value in Breakpoint;
}
