import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe that memoizes the result of a function call by applying the provided handler
 * with the given arguments and optional context.
 *
 * This pipe is useful for optimizing performance by avoiding redundant computations
 * when the same inputs are provided multiple times.
 *
 * @example
 * // In your Angular template:
 * // {{ someHandler | memoize: someContext : arg1 : arg2 }}
 *
 * // In your component:
 * someHandler(arg1: number, arg2: number): number {
 *   return arg1 + arg2;
 * }
 * someContext = this; // Optional context
 *
 * @example
 * // Using the pipe in a template:
 * // {{ calculateSum | memoize : null : 5 : 10 }}
 *
 * // In your component:
 * calculateSum(a: number, b: number): number {
 *   return a + b;
 * }
 *
 * @template T The tuple type of the arguments passed to the handler.
 * @template R The return type of the handler function.
 * @param handler The function to be invoked with the provided arguments.
 * @param context (Optional) The context (`this` value) to bind to the handler function.
 * @param args The arguments to pass to the handler function.
 * @returns The result of invoking the handler function with the provided arguments.
 */
@Pipe({
    name: 'memoize'
})
export class MemoizePipe implements PipeTransform {
    transform<T extends unknown[], R>(
        handler: (...args: T) => R, 
        context?: unknown,
        ...args: T
    ): R {
        return handler.apply(context, args);
    }
}