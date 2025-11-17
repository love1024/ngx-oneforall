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
});
