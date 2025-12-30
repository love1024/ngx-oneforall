/**
 * Map of prefix to its current counter value.
 * Each prefix has its own independent counter.
 */
const prefixCounters = new Map<string, number>();

/**
 * Generates a unique ID string for use in Angular components.
 * Each prefix has its own independent counter, ensuring IDs like
 * `btn1, btn2, input1, input2` instead of a shared global counter.
 *
 * @param prefix - Optional prefix for the ID. Default is `'id'`.
 * @returns A unique ID string in the format `{prefix}{counter}`.
 *
 * @example
 * // Default prefix
 * uniqueComponentId();  // 'id1'
 * uniqueComponentId();  // 'id2'
 *
 * @example
 * // Custom prefixes have independent counters
 * uniqueComponentId('btn');    // 'btn1'
 * uniqueComponentId('input');  // 'input1'
 * uniqueComponentId('btn');    // 'btn2'
 * uniqueComponentId('input');  // 'input2'
 *
 * @remarks
 * - IDs are unique within a single page load/session.
 * - Counter resets on page refresh or SSR request.
 * - Useful for generating unique IDs for form elements, ARIA attributes, etc.
 */
export function uniqueComponentId(prefix = 'id'): string {
  const currentCount = prefixCounters.get(prefix) ?? 0;
  const nextCount = currentCount + 1;
  prefixCounters.set(prefix, nextCount);
  return `${prefix}${nextCount}`;
}
