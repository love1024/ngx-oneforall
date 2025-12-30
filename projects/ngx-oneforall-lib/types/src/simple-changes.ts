/**
 * Represents a typed change for a specific property of a component.
 * Provides type-safe access to `previousValue` and `currentValue`.
 *
 * @template T - The component type.
 * @template P - The property key of the component.
 */
export interface ComponentChange<T, P extends keyof T> {
  /** The previous value of the property. */
  previousValue: T[P];
  /** The current value of the property. */
  currentValue: T[P];
  /** True if this is the first change (initial binding). */
  firstChange: boolean;
  /** Returns true if this is the first change (initial binding). Matches Angular's SimpleChange API. */
  isFirstChange(): boolean;
}

/**
 * A type-safe version of Angular's `SimpleChanges`.
 * Maps component input properties to their typed change objects.
 *
 * @template T - The component type. Use `Pick<Component, 'prop1' | 'prop2'>` to limit to specific inputs.
 *
 * @example
 * interface MyComponent {
 *   name: string;
 *   count: number;
 * }
 *
 * ngOnChanges(changes: SimpleChangesTyped<MyComponent>) {
 *   if (changes.name) {
 *     console.log(changes.name.previousValue); // string
 *     console.log(changes.name.currentValue);  // string
 *   }
 *   if (changes.count) {
 *     console.log(changes.count.currentValue); // number
 *   }
 * }
 *
 * @remarks
 * - All properties are optional (`?`) since not all inputs change on every cycle.
 * - Use with `Pick<T, ...>` to limit type checking to specific input properties.
 */
export type SimpleChangesTyped<T> = {
  [P in keyof T]?: ComponentChange<T, P>;
};
