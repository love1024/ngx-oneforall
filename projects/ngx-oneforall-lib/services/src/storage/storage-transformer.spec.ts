import {
  JsonTransformer,
  StringTransformer,
  BooleanTransformer,
  NumberTransformer,
  DateTransformer,
  Base64Transformer,
} from './storage-transformer';

describe('Storage Transformers', () => {
  describe('JsonTransformer', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformer = new JsonTransformer<any>();

    it('should serialize and deserialize objects', () => {
      const obj = { a: 1, b: 'test' };
      const str = transformer.serialize(obj);
      expect(str).toBe(JSON.stringify(obj));
      expect(transformer.deserialize(str)).toEqual(obj);
    });

    it('should return undefined for invalid JSON', () => {
      expect(transformer.deserialize('not-json')).toBeUndefined();
    });
  });

  describe('StringTransformer', () => {
    const transformer = new StringTransformer();

    it('should serialize and deserialize strings', () => {
      expect(transformer.serialize('abc')).toBe('abc');
      expect(transformer.deserialize('xyz')).toBe('xyz');
    });
  });

  describe('BooleanTransformer', () => {
    const transformer = new BooleanTransformer();

    it('should serialize true/false', () => {
      expect(transformer.serialize(true)).toBe('true');
      expect(transformer.serialize(false)).toBe('false');
    });

    it('should deserialize "true" and "false"', () => {
      expect(transformer.deserialize('true')).toBe(true);
      expect(transformer.deserialize('false')).toBe(false);
    });

    it('should return undefined for invalid boolean string', () => {
      expect(transformer.deserialize('notbool')).toBeUndefined();
      expect(transformer.deserialize('')).toBeUndefined();
    });
  });

  describe('NumberTransformer', () => {
    const transformer = new NumberTransformer();

    it('should serialize numbers', () => {
      expect(transformer.serialize(123)).toBe('123');
      expect(transformer.serialize(-45.6)).toBe('-45.6');
    });

    it('should deserialize valid numbers', () => {
      expect(transformer.deserialize('123')).toBe(123);
      expect(transformer.deserialize('-45.6')).toBe(-45.6);
    });

    it('should return undefined for invalid number string', () => {
      expect(transformer.deserialize('notnum')).toBeUndefined();
      expect(transformer.deserialize('')).toBeUndefined();
    });
  });

  describe('DateTransformer', () => {
    const transformer = new DateTransformer();

    it('should serialize and deserialize dates', () => {
      const date = new Date('2020-01-01T00:00:00Z');
      const str = transformer.serialize(date);
      expect(str).toBe(date.toISOString());
      expect(transformer.deserialize(str).toISOString()).toBe(
        date.toISOString()
      );
    });
  });

  describe('Base64Transformer', () => {
    const transformer = new Base64Transformer();

    it('should serialize Uint8Array to base64', () => {
      const arr = new Uint8Array([65, 66, 67]); // 'ABC'
      expect(transformer.serialize(arr)).toBe(btoa('ABC'));
    });

    it('should deserialize base64 to Uint8Array', () => {
      const base64 = btoa('XYZ');
      const arr = transformer.deserialize(base64);
      expect(Array.from(arr)).toEqual([88, 89, 90]); // 'X', 'Y', 'Z'
    });
  });
});
