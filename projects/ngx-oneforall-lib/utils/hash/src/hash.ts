/**
 * Generates a 32-bit signed integer hash code from a string.
 * Uses the DJB2-like algorithm (hash * 31 + char), similar to Java's `String.hashCode()`.
 *
 * @param str - The string to hash.
 * @returns A 32-bit signed integer hash code.
 *
 * @example
 * hashCode('hello'); // -1794106052
 * hashCode('world'); // 113318802
 *
 * @remarks
 * This is a non-cryptographic hash suitable for:
 * - Cache keys
 * - Hash table distribution
 * - Quick string comparison
 *
 * Not suitable for security-sensitive applications.
 */
export function hashCode(str: string): number {
  return str.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }, 0);
}

/**
 * Generates a salted 32-bit signed integer hash code from a string.
 * Seeds the hash computation with the hash of the provided salt.
 *
 * @param str - The string to hash.
 * @param salt - A salt string to seed the hash computation.
 * @returns A 32-bit signed integer hash code.
 *
 * @example
 * hashCodeWithSalt('hello', 'my-secret');
 * // Different result than hashCode('hello')
 *
 * @remarks
 * Use salting when you need:
 * - Different hash values for the same input across contexts
 * - Basic protection against hash collision attacks
 */
export function hashCodeWithSalt(str: string, salt: string): number {
  return str.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }, hashCode(salt));
}
