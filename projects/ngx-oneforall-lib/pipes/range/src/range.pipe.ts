import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generates an array of numbers in a range.
 * Follows Python's range() convention.
 *
 * @usageNotes
 * ```html
 * @for (i of 5 | range) { ... }      → [0,1,2,3,4]
 * @for (i of 1 | range:5) { ... }    → [1,2,3,4]
 * @for (i of 0 | range:10:2) { ... } → [0,2,4,6,8]
 * @for (i of 5 | range:0) { ... }    → [5,4,3,2,1]
 * ```
 */
@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  /**
   * Generates an array of numbers from start to end (exclusive).
   *
   * @param start - Start value (or end value if end is not provided)
   * @param end - End value (exclusive). If not provided, start is treated as end and 0 as start
   * @param step - Step increment (default: 1). Direction is auto-detected from start/end
   * @returns Array of numbers in the range
   */
  transform(start: number, end?: number, step = 1): number[] {
    let actualStart = start;
    let actualEnd = end;

    // If only one argument is provided, treat it as end, and start from 0
    if (actualEnd === undefined) {
      actualEnd = actualStart;
      actualStart = 0;
    }

    // Ensure step is positive and non-zero to prevent infinite loops
    // Direction is determined by start vs end
    let actualStep = Math.abs(step);
    if (actualStep === 0) actualStep = 1;

    const result: number[] = [];
    const increasing = actualEnd > actualStart;

    if (increasing) {
      for (let i = actualStart; i < actualEnd; i += actualStep) {
        result.push(i);
      }
    } else {
      for (let i = actualStart; i > actualEnd; i -= actualStep) {
        result.push(i);
      }
    }

    return result;
  }
}
