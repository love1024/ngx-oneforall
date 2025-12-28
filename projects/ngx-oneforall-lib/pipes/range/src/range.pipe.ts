import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true,
  pure: true,
})
export class RangePipe implements PipeTransform {

  transform(start: number, end?: number, step: number = 1): number[] {
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
