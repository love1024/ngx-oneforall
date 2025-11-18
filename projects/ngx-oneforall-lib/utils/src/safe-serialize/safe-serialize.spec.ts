import { safeSerialize } from './safe-serialize';

describe('safeSerialize', () => {
  it('serializes primitives and empty args', () => {
    expect(safeSerialize([])).toBe('[]');

    const res = safeSerialize(1, 'a', true, null);
    expect(JSON.parse(res)).toEqual([1, 'a', true, null]);
  });

  it('serializes named and anonymous functions as __fn:NAME', () => {
    function named() {
      return 'n';
    }

    // create an anonymous function expression
    const anon = (function () {
      return function () {
        return 'x';
      };
    })();

    const parsed = JSON.parse(safeSerialize([named, anon]));
    expect(parsed[0]).toBe('__fn:named');
    // anonymous/unnamed function will at least be prefixed with __fn:
    expect(typeof parsed[1]).toBe('string');
    expect(parsed[1].startsWith('__fn:')).toBe(true);
  });

  it('serializes anonymous functions as __fn:anonymous|h:HASH', () => {
    const result = safeSerialize(function (a: number, b: number) {
      return a + b;
    });
    // Should be a string like __fn:anonymous|h:HASH
    expect(result.startsWith('"__fn:anonymous|h:')).toBe(true);
    // Should parse as a string
    expect(typeof JSON.parse(result)).toBe('string');
    // Should include the hash part
    expect(result).toMatch(/\|h:[0-9-]+/);
  });

  it('serializes symbol and bigint to string tokens', () => {
    const s = Symbol('sym');
    const b = BigInt(9007199254740991);

    const parsed = JSON.parse(safeSerialize([s, b]));
    expect(parsed[0]).toBe('__sym:Symbol(sym)');
    expect(parsed[1]).toBe('__bigint:9007199254740991');
  });

  it('handles circular references by producing __circular__ token', () => {
    const a: Record<string, unknown> = { name: 'root' };
    (a as Record<string, unknown>)['self'] = a;

    const parsed = JSON.parse(safeSerialize([a]));
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('root');
    expect(parsed[0].self).toBe('__circular__');
  });

  it('handles nested structures with functions, symbols and circulars', () => {
    const obj: Record<string, unknown> = { arr: [] };
    const fn = function fnx() {
      return true;
    };
    const s = Symbol('x');
    (obj['arr'] as unknown[]).push({ fn, s, sub: obj });

    const parsed = JSON.parse(safeSerialize([obj]));
    expect(parsed[0].arr).toBeDefined();
    const item = parsed[0].arr[0];
    expect(item.fn).toBe('__fn:fnx');
    expect(item.s).toBe('__sym:Symbol(x)');
    // circular will be replaced by __circular__ inside nested object
    expect(item.sub).toBe('__circular__');
  });

  it('serializes Date, RegExp, and Error objects with type tags', () => {
    const d = new Date('2020-01-01T12:00:00Z');
    const r = /abc/gi;
    const e = new Error('fail');
    // Date as direct value (not inside array) is serialized as ISO string
    expect(JSON.parse(safeSerialize(d))).toBe(d.toJSON());
    // Date, RegExp, and Error inside an array are type-tagged
    const parsed = JSON.parse(safeSerialize([d, r, e]));
    expect(parsed[0]).toEqual(d.toJSON());
    expect(parsed[1]).toEqual({ __type: 'RegExp', value: r.toString() });
    expect(parsed[2].__type).toBe('Error');
    expect(parsed[2].name).toBe(e.name);
    expect(parsed[2].message).toBe('fail');
  });

  it('serializes Map and Set with type tags and contents', () => {
    const m = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const s = new Set([1, 2, 3]);
    const parsed = JSON.parse(safeSerialize([m, s]));
    expect(parsed[0]).toEqual({
      __type: 'Map',
      entries: [
        ['a', 1],
        ['b', 2],
      ],
    });
    expect(parsed[1]).toEqual({ __type: 'Set', values: [1, 2, 3] });
  });

  it('serializes class instances with constructor name and stable key order', () => {
    class Point {
      constructor(
        public x: number,
        public y: number
      ) {}
      method() {
        return this.x + this.y;
      }
    }
    const p = new Point(2, 3);
    // Add an extra property out of order
    (p as unknown as Record<string, unknown>)['z'] = 99;
    const parsed = JSON.parse(safeSerialize([p]));
    expect(parsed[0].__type).toBe('Point');
    // keys should be sorted: x, y, z
    expect(Object.keys(parsed[0])).toEqual(['__type', 'x', 'y', 'z']);
    expect(parsed[0].x).toBe(2);
    expect(parsed[0].y).toBe(3);
    expect(parsed[0].z).toBe(99);
    // method is not included
    expect(parsed[0].method).toBeUndefined();
  });

  it('serializes plain objects with stable key ordering', () => {
    const a = { b: 2, a: 1 };
    const b = { a: 1, b: 2 };
    const sa = safeSerialize(a);
    const sb = safeSerialize(b);
    expect(sa).toBe(sb);
    expect(JSON.parse(sa)).toEqual({ a: 1, b: 2 });
  });
});
