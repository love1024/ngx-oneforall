import { findType, isObject } from './find-type';
import { Types } from '../../../constants/src/types';

describe('findType', () => {
  it('should detect null', () => {
    expect(findType(null)).toBe(Types.Null);
  });

  it('should detect undefined', () => {
    expect(findType(undefined)).toBe(Types.Undefined);
  });

  it('should detect boolean', () => {
    expect(findType(true)).toBe(Types.Boolean);
    expect(findType(false)).toBe(Types.Boolean);
    expect(findType(new Boolean(true))).toBe(Types.Boolean);
  });

  it('should detect string', () => {
    expect(findType('abc')).toBe(Types.String);
    expect(findType(new String('abc'))).toBe(Types.String);
  });

  it('should detect number', () => {
    expect(findType(123)).toBe(Types.Number);
    expect(findType(new Number(123))).toBe(Types.Number);
  });

  it('should detect symbol', () => {
    expect(findType(Symbol('s'))).toBe(Types.Symbol);
  });

  it('should detect bigint', () => {
    expect(findType(BigInt(123))).toBe(Types.BigInt);
    expect(findType(BigInt('9007199254740991'))).toBe(Types.BigInt);
  });

  it('should detect function', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(findType(sum)).toBe(Types.Function);
    expect(findType(() => void 0)).toBe(Types.Function);
  });

  it('should detect generator function', () => {
    function* gen() {
      yield 1;
    }
    expect(findType(gen)).toBe(Types.GeneratorFunction);
  });

  it('should detect map', () => {
    expect(findType(new Map())).toBe(Types.Map);
  });

  it('should detect weakmap', () => {
    expect(findType(new WeakMap())).toBe(Types.WeakMap);
  });

  it('should detect set', () => {
    expect(findType(new Set())).toBe(Types.Set);
  });

  it('should detect weakset', () => {
    expect(findType(new WeakSet())).toBe(Types.WeakSet);
  });

  it('should detect typed arrays', () => {
    expect(findType([])).toBe(Types.Array);
    expect(findType(new Int8Array())).toBe(Types.Int8Array);
    expect(findType(new Uint8Array())).toBe(Types.Uint8Array);
    expect(findType(new Uint8ClampedArray())).toBe(Types.Uint8ClampedArray);
    expect(findType(new Int16Array())).toBe(Types.Int16Array);
    expect(findType(new Uint16Array())).toBe(Types.Uint16Array);
    expect(findType(new Int32Array())).toBe(Types.Int32Array);
    expect(findType(new Uint32Array())).toBe(Types.Uint32Array);
    expect(findType(new Float32Array())).toBe(Types.Float32Array);
    expect(findType(new Float64Array())).toBe(Types.Float64Array);
  });

  it('should detect generator object', () => {
    function* gen() {
      yield 1;
    }
    const g = gen();
    expect(findType(g)).toBe(Types.GeneratorObject);
  });

  it('should detect object', () => {
    expect(findType({})).toBe(Types.Object);
    expect(findType(Object.create(null))).toBe(Types.Object);
  });

  it('should detect map iterators', () => {
    const map = new Map();
    map.set('0', 'test1');
    map.set('1', 'test2');
    const iterator = map[Symbol.iterator]();

    expect(findType(iterator)).toBe(Types.MapIterator);
  });

  it('should detect set iterators', () => {
    const set = new Set();
    set.add('a');
    set.add('b');
    const iterator = set[Symbol.iterator]();

    expect(findType(iterator)).toBe(Types.SetIterator);
  });

  it('should detect string iterators', () => {
    const str = 'abc';
    const iterator = str[Symbol.iterator]();

    expect(findType(iterator)).toBe(Types.StringIterator);
  });

  it('should detect array iterators', () => {
    const arr = [1, 2, 3];
    const iterator = arr[Symbol.iterator]();

    expect(findType(iterator)).toBe(Types.ArrayIterator);
  });
  it('should treat functions as objects per spec', () => {
    const fn = () => void 0;
    expect(typeof fn).toBe('function'); // sanity check
    expect(isObject(fn)).toBe(true);
  });

  it('shoudl treat null as NOT an object (edge case)', () => {
    // JS quirk: typeof null === 'object', but implementation guards with !!value
    expect(typeof null).toBe('object');
    expect(isObject(null)).toBe(false);
  });
});
