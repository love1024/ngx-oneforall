/**
 * Type guard that checks if a value is a finite number primitive.
 * Excludes `NaN`, `Infinity`, and `-Infinity`.
 *
 * @param value - The value to check.
 * @returns `true` if value is a finite number primitive.
 *
 * @example
 * isNumberValue(42);        // true
 * isNumberValue(3.14);      // true
 * isNumberValue(NaN);       // false
 * isNumberValue(Infinity);  // false
 * isNumberValue('42');      // false
 */
export const isNumberValue = (value: unknown): value is number => {
  return typeof value === 'number' && isFinite(value);
};

/**
 * Type guard that checks if a value is a string that represents a valid number.
 * Handles edge cases like empty strings and whitespace-only strings (returns false).
 *
 * @param value - The value to check.
 * @returns `true` if value is a string that can be parsed as a number.
 *
 * @example
 * isNumberString('42');     // true
 * isNumberString('3.14');   // true
 * isNumberString('  123 '); // true (whitespace is trimmed by Number())
 * isNumberString('');       // false
 * isNumberString('   ');    // false
 * isNumberString('abc');    // false
 */
export const isNumberString = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    !isNaN(Number(value)) &&
    !isNaN(parseFloat(value))
  );
};

/**
 * Type guard that checks if a value is a boxed Number object.
 * Rarely needed, but useful for handling legacy code or edge cases.
 *
 * @param value - The value to check.
 * @returns `true` if value is a Number object (created with `new Number()`).
 *
 * @example
 * isNumberObject(new Number(42)); // true
 * isNumberObject(42);             // false (primitive)
 * isNumberObject('42');           // false
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const isNumberObject = (value: unknown): value is Number => {
  return typeof value === 'object' && value instanceof Number;
};

/**
 * Type guard that checks if a value is numeric (either a number primitive or a numeric string).
 * Combines `isNumberValue` and `isNumberString` for flexible numeric validation.
 *
 * @param value - The value to check.
 * @returns `true` if value is a finite number or a valid numeric string.
 *
 * @example
 * isNumeric(42);      // true
 * isNumeric('42');    // true
 * isNumeric('3.14');  // true
 * isNumeric(NaN);     // false
 * isNumeric('abc');   // false
 * isNumeric(null);    // false
 */
export const isNumeric = (value: unknown): value is number | string => {
  return isNumberValue(value) || isNumberString(value);
};
