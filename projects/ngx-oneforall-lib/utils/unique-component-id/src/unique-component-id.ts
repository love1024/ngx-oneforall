/**
 * Map of prefix to its current counter value.
 * Each prefix has its own independent counter.
 */
const prefixCounters = new Map<string, number>();

/**
 * A unique string for the current session to ensure IDs do not conflict
 * across page reloads. We evaluate this once per module load so the
 * timestamp remains constant within a session, keeping IDs slightly shorter
 * and cleaner, while still preventing cross-session collisions.
 */
const sessionPrefix = Date.now().toString(36);

/**
 * Generates a unique ID string for use in Angular components.
 * Each prefix has its own independent counter, ensuring IDs like
 * `btn-lxw9a3zb-1, btn-lxw9a3zb-2` instead of a shared global counter.
 *
 * @param prefix - Optional prefix for the ID. Default is `'id'`.
 * @returns A unique ID string in the format `{prefix}-{sessionPrefix}-{counter}`.
 *
 * @example
 * // Default prefix
 * uniqueComponentId();  // 'id-lxw9a3zb-1'
 * uniqueComponentId();  // 'id-lxw9a3zb-2'
 *
 * @example
 * // Custom prefixes have independent counters
 * uniqueComponentId('btn');    // 'btn-lxw9a3zb-1'
 * uniqueComponentId('input');  // 'input-lxw9a3zb-1'
 * uniqueComponentId('btn');    // 'btn-lxw9a3zb-2'
 * uniqueComponentId('input');  // 'input-lxw9a3zb-2'
 *
 * @remarks
 * - IDs are unique within a single page load/session.
 * - Counter resets on page refresh or SSR request, but the session prefix changes.
 * - Useful for generating unique IDs for form elements, ARIA attributes, etc.
 */
export function uniqueComponentId(prefix = 'id'): string {
  const currentCount = prefixCounters.get(prefix) ?? 0;
  const nextCount = currentCount + 1;
  prefixCounters.set(prefix, nextCount);
  return `${prefix}-${sessionPrefix}-${nextCount}`;
}
