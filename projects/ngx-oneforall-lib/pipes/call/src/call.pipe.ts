import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that calls a function with provided arguments.
 * Useful for invoking component methods in templates with pure pipe caching.
 *
 * @usageNotes
 * ```html
 * {{ formatDate | call:date:'short' }}
 * {{ multiply | call:5:10 }}
 * ```
 */
@Pipe({
  name: 'call',
})
export class CallPipe implements PipeTransform {
  /**
   * Invokes the provided function with the given arguments.
   *
   * @param fn - The function to call
   * @param args - Arguments to pass to the function
   * @returns The result of the function call, or null if fn is not a function
   */
  transform<T, A extends unknown[]>(
    fn: ((...args: A) => T) | unknown,
    ...args: A
  ): T | null {
    if (typeof fn !== 'function') return null;
    return fn(...args);
  }
}
