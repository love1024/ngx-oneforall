import { tap } from 'rxjs';

/**
 * RxJS operator that logs observable events to the console with styling.
 *
 * @param tag - A label to identify the stream in the console.
 * @param when - Optional predicate to filter logs. Receives the value for 'next' events.
 *               For 'error' and 'complete' events, it is called without arguments.
 * @returns Operator function that logs events.
 *
 * @example
 * source$.pipe(debug('MyStream'))
 */
export function debug<T>(
  tag: string,
  when: (value?: T) => boolean = () => true
) {
  return tap<T>({
    next(value) {
      if (!when(value)) return;
      console.log(
        `%c[${tag}: Next]`,
        'background: #00bbd4ff; color: #fff; padding: 3px; font-size: 9px;',
        value
      );
    },
    error(error) {
      if (!when()) return;
      console.error(
        `%c[${tag}: Error]`,
        'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
        error
      );
    },
    complete() {
      if (!when()) return;
      console.info(
        `%c[${tag}]: Complete`,
        'background:  #009688; color: #fff; padding: 3px; font-size: 9px;'
      );
    },
  });
}
