import { Types } from '@ngx-oneforall/constants';

/**
 * Determines the JavaScript type of a value.
 * Returns a `Types` enum value representing the detected type.
 *
 * @param value - The value to check.
 * @returns A `Types` enum value representing the detected type.
 *
 * @example
 * findType(null);             // Types.Null
 * findType(undefined);        // Types.Undefined
 * findType(42);               // Types.Number
 * findType('hello');          // Types.String
 * findType(BigInt(123));      // Types.BigInt
 * findType([1, 2, 3]);        // Types.Array
 * findType(new Map());        // Types.Map
 * findType(() => {});         // Types.Function
 *
 * @remarks
 * Detection order is optimized for common types first.
 * Falls back to `Types.Object` for plain objects and class instances.
 */
export const findType = (value: unknown): Types => {
  if (isNull(value)) return Types.Null;
  if (isUndefined(value)) return Types.Undefined;

  if (isBoolean(value)) return Types.Boolean;
  if (isString(value)) return Types.String;
  if (isNumber(value)) return Types.Number;
  if (isBigInt(value)) return Types.BigInt;
  if (isSymbol(value)) return Types.Symbol;
  if (isGeneratorFn(value)) return Types.GeneratorFunction;
  if (isFunction(value)) return Types.Function;
  if (isMap(value)) return Types.Map;
  if (isWeakMap(value)) return Types.WeakMap;
  if (isSet(value)) return Types.Set;
  if (isWeakSet(value)) return Types.WeakSet;

  if (isArray(value)) return Types.Array;

  if (isInt8Array(value)) return Types.Int8Array;
  if (isUint8Array(value)) return Types.Uint8Array;
  if (isUint8ClampedArray(value)) return Types.Uint8ClampedArray;
  if (isInt16Array(value)) return Types.Int16Array;
  if (isUint16Array(value)) return Types.Uint16Array;
  if (isInt32Array(value)) return Types.Int32Array;
  if (isUint32Array(value)) return Types.Uint32Array;
  if (isFloat32Array(value)) return Types.Float32Array;
  if (isFloat64Array(value)) return Types.Float64Array;

  if (isGeneratorObject(value)) return Types.GeneratorObject;

  if (isMapIterator(value)) return Types.MapIterator;
  if (isSetIterator(value)) return Types.SetIterator;
  if (isStringIterator(value)) return Types.StringIterator;
  if (isArrayIterator(value)) return Types.ArrayIterator;

  return Types.Object;
};

//--------------------HELPER--------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const constructorName = (value: any): string | null => {
  return typeof value.constructor === 'function'
    ? value.constructor.name
    : null;
};

const getTagTester = (name: string): ((v: unknown) => boolean) => {
  const tag = `[object ${name}]`;
  return (value: unknown) => {
    return Object.prototype.toString.call(value) === tag;
  };
};
//--------------------HELPER--------------------------

/** Type guard that checks if a value is an array. */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/** Checks if a value is a generator function. */
export const isGeneratorFn = (value: unknown): value is GeneratorFunction => {
  return constructorName(value) === 'GeneratorFunction';
};

/** Type guard that checks if a value is an object (including functions). */
export const isObject = (value: unknown): value is object => {
  const type = typeof value;
  return type === 'function' || (type === 'object' && !!value);
};

/** Type guard that checks if a value is null. */
export const isNull = (value: unknown): value is null => {
  return value === null;
};

/** Type guard that checks if a value is undefined. */
export const isUndefined = (value: unknown): value is undefined => {
  return value === void 0;
};

/** Type guard that checks if a value is a boolean. */
export const isBoolean = (value: unknown): value is boolean => {
  return value === true || value === false || getTagTester('Boolean')(value);
};

/** Type guard that checks if a value is a BigInt. */
export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint';
};

// Typed Arrays

/** Type guard for Int8Array. */
export const isInt8Array = (value: unknown): value is Int8Array => {
  return constructorName(value) === 'Int8Array';
};

/** Type guard for Uint8Array. */
export const isUint8Array = (value: unknown): value is Uint8Array => {
  return constructorName(value) === 'Uint8Array';
};

/** Type guard for Uint8ClampedArray. */
export const isUint8ClampedArray = (
  value: unknown
): value is Uint8ClampedArray => {
  return constructorName(value) === 'Uint8ClampedArray';
};

/** Type guard for Int16Array. */
export const isInt16Array = (value: unknown): value is Int16Array => {
  return constructorName(value) === 'Int16Array';
};

/** Type guard for Uint16Array. */
export const isUint16Array = (value: unknown): value is Uint16Array => {
  return constructorName(value) === 'Uint16Array';
};

/** Type guard for Int32Array. */
export const isInt32Array = (value: unknown): value is Int32Array => {
  return constructorName(value) === 'Int32Array';
};

/** Type guard for Uint32Array. */
export const isUint32Array = (value: unknown): value is Uint32Array => {
  return constructorName(value) === 'Uint32Array';
};

/** Type guard for Float32Array. */
export const isFloat32Array = (value: unknown): value is Float32Array => {
  return constructorName(value) === 'Float32Array';
};

/** Type guard for Float64Array. */
export const isFloat64Array = (value: unknown): value is Float64Array => {
  return constructorName(value) === 'Float64Array';
};

/** Type guard for generator objects. */
export const isGeneratorObject = (value: unknown): value is Generator => {
  return (
    typeof (value as Generator).throw === 'function' &&
    typeof (value as Generator).return === 'function' &&
    typeof (value as Generator).next === 'function'
  );
};

/** Type guard for RegExp. */
export const isRegexp = (value: unknown): value is RegExp =>
  getTagTester('RegExp')(value);

/** Type guard for Date. */
export const isDate = (value: unknown): value is Date =>
  getTagTester('Date')(value);

/** Type guard for Error. */
export const isError = (value: unknown): value is Error =>
  getTagTester('Error')(value);

/** Type guard for string. */
export const isString = (value: unknown): value is string =>
  getTagTester('String')(value);

/** Type guard for number (includes boxed Number). */
export const isNumber = (value: unknown): value is number =>
  getTagTester('Number')(value);

/** Type guard for symbol. */
export const isSymbol = (value: unknown): value is symbol =>
  getTagTester('Symbol')(value);

/** Type guard for ArrayBuffer. */
export const isArrayBuffer = (value: unknown): value is ArrayBuffer =>
  getTagTester('ArrayBuffer')(value);

/** Type guard for functions. */
export const isFunction = (
  value: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): value is (...args: any[]) => any => {
  return typeof value === 'function';
};

/** Type guard for Map. */
export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  getTagTester('Map')(value);

/** Type guard for WeakMap. */
export const isWeakMap = (value: unknown): value is WeakMap<object, unknown> =>
  getTagTester('WeakMap')(value);

/** Type guard for Set. */
export const isSet = (value: unknown): value is Set<unknown> =>
  getTagTester('Set')(value);

/** Type guard for WeakSet. */
export const isWeakSet = (value: unknown): value is WeakSet<object> =>
  getTagTester('WeakSet')(value);

/** Checks if a value is a Map iterator. */
export const isMapIterator = getTagTester('Map Iterator');

/** Checks if a value is a Set iterator. */
export const isSetIterator = getTagTester('Set Iterator');

/** Checks if a value is a String iterator. */
export const isStringIterator = getTagTester('String Iterator');

/** Checks if a value is an Array iterator. */
export const isArrayIterator = getTagTester('Array Iterator');
