import { StorageEngine } from './storage-engine';
import {
  StorageTransformers,
  BaseStorageTransformer,
} from './transformers/storage-transformer';

class TestStorageEngine extends StorageEngine {
  private store: Record<string, string> = {};

  has(key: string): boolean {
    return key in this.store;
  }

  remove(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  keys(): string[] {
    return Object.keys(this.store);
  }

  protected getItem(key: string): string | undefined {
    return this.store[key];
  }

  protected setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('StorageEngine', () => {
  let engine: TestStorageEngine;

  beforeEach(() => {
    engine = new TestStorageEngine();
  });

  it('should set and get string values by default', () => {
    engine.set('foo', 'bar');
    expect(engine.get('foo')).toBe('bar');
  });

  it('should use custom transformer for get/set', () => {
    engine.set('json', { a: 1 }, StorageTransformers.JSON);
    expect(engine.get('json', StorageTransformers.JSON)).toEqual({ a: 1 });
  });

  it('should return undefined if key does not exist', () => {
    expect(engine.get('missing')).toBeUndefined();
  });

  it('should check if key exists', () => {
    engine.set('foo', 'bar');
    expect(engine.has('foo')).toBe(true);
    expect(engine.has('baz')).toBe(false);
  });

  it('should remove a key', () => {
    engine.set('foo', 'bar');
    engine.remove('foo');
    expect(engine.has('foo')).toBe(false);
  });

  it('should clear all keys', () => {
    engine.set('a', '1');
    engine.set('b', '2');
    engine.clear();
    expect(engine.has('a')).toBe(false);
    expect(engine.has('b')).toBe(false);
  });

  it('should serialize and deserialize using custom transformer', () => {
    const transformer: BaseStorageTransformer<number> = {
      serialize: (v: number) => (v * 2).toString(),
      deserialize: (v: string) => Number(v) / 2,
    };
    engine.set('num', 21, transformer);
    expect(engine.get('num', transformer)).toBe(21);
  });

  it('should return all values with getAll', () => {
    engine.set('a', '1');
    engine.set('b', '2');
    engine.set('c', '3');

    const all = engine.getAll();

    expect(all.size).toBe(3);
    expect(all.get('a')).toBe('1');
    expect(all.get('b')).toBe('2');
    expect(all.get('c')).toBe('3');
  });

  it('should return all values with getAll using transformer', () => {
    engine.set('x', { value: 10 }, StorageTransformers.JSON);
    engine.set('y', { value: 20 }, StorageTransformers.JSON);

    const all = engine.getAll(StorageTransformers.JSON);

    expect(all.size).toBe(2);
    expect(all.get('x')).toEqual({ value: 10 });
    expect(all.get('y')).toEqual({ value: 20 });
  });

  it('should return empty map for getAll when storage is empty', () => {
    const all = engine.getAll();
    expect(all.size).toBe(0);
  });

  it('should skip undefined values in getAll (else branch)', () => {
    // Custom transformer that returns undefined for certain values
    const transformer: BaseStorageTransformer<string | undefined> = {
      serialize: (v: string | undefined) => v ?? '',
      deserialize: (v: string) => (v === '' ? undefined : v),
    };

    // Store an empty string which will deserialize to undefined
    engine.set('valid', 'hello', transformer);
    engine.set('invalid', '', transformer);

    const all = engine.getAll(transformer);

    // Only 'valid' should be in the map since 'invalid' deserializes to undefined
    expect(all.size).toBe(1);
    expect(all.get('valid')).toBe('hello');
    expect(all.has('invalid')).toBe(false);
  });
});
