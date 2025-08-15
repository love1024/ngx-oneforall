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
});
