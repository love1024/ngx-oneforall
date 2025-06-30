import { Types } from '../../../constants/src/types';

export const findType = (value: unknown): Types => {
  if (isNull(value)) return Types.Null;
  if (isUndefined(value)) return Types.Undefined;

  if (isBoolean(value)) return Types.Boolean;
  if (isString(value)) return Types.String;
  if (isNumber(value)) return Types.Number;
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

export const isArray = (value: unknown): boolean => {
  return Array.isArray(value);
};

export const isGeneratorFn = (value: unknown): boolean => {
  return constructorName(value) === 'GeneratorFunction';
};

export const isObject = (value: unknown): boolean => {
  const type = typeof value;
  return type === 'function' || (type === 'object' && !!value);
};

export const isNull = (value: unknown): boolean => {
  return value === null;
};

export const isUndefined = (value: unknown): boolean => {
  return value === void 0;
};

export const isBoolean = (value: unknown): boolean => {
  return value === true || value === false || getTagTester('Boolean')(value);
};

// Extra

export const isInt8Array = (value: unknown): boolean => {
  return constructorName(value) === 'Int8Array';
};

export const isUint8Array = (value: unknown): boolean => {
  return constructorName(value) === 'Uint8Array';
};

export const isUint8ClampedArray = (value: unknown): boolean => {
  return constructorName(value) === 'Uint8ClampedArray';
};

// 16-bit typed arrays
export const isInt16Array = (value: unknown): boolean => {
  return constructorName(value) === 'Int16Array';
};

export const isUint16Array = (value: unknown): boolean => {
  return constructorName(value) === 'Uint16Array';
};

// 32-bit typed arrays
export const isInt32Array = (value: unknown): boolean => {
  return constructorName(value) === 'Int32Array';
};

export const isUint32Array = (value: unknown): boolean => {
  return constructorName(value) === 'Uint32Array';
};

export const isFloat32Array = (value: unknown): boolean => {
  return constructorName(value) === 'Float32Array';
};

export const isFloat64Array = (value: unknown): boolean => {
  return constructorName(value) === 'Float64Array';
};

export const isGeneratorObject = (value: unknown): boolean => {
  return (
    typeof (value as Generator).throw === 'function' &&
    typeof (value as Generator).return === 'function' &&
    typeof (value as Generator).next === 'function'
  );
};

export const isRegexp = getTagTester('RegExp');
export const isDate = getTagTester('Date');
export const isError = getTagTester('Error');
export const isString = getTagTester('String');
export const isNumber = getTagTester('Number');
export const isSymbol = getTagTester('Symbol');
export const isArrayBuffer = getTagTester('ArrayBuffer');
export const isFunction = getTagTester('Function');
export const isMap = getTagTester('Map');
export const isWeakMap = getTagTester('WeakMap');
export const isSet = getTagTester('Set');
export const isWeakSet = getTagTester('WeakSet');
export const isMapIterator = getTagTester('Map Iterator');
export const isSetIterator = getTagTester('Set Iterator');
export const isStringIterator = getTagTester('String Iterator');
export const isArrayIterator = getTagTester('Array Iterator');

// Private
