import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'call'
})
export class CallFunctionPipe implements PipeTransform {
  transform(fn: Function, ...args: unknown[]): unknown {
    if (typeof fn !== 'function') return fn;
    return fn(...args);
  }
}
