import { StorageTransformers } from '../transformers/storage-transformer';
import { WebStorageService } from './web-storage.service';

describe('WebStorageService', () => {
  let storage: Storage;
  let service: WebStorageService;

  beforeEach(() => {
    const store: Record<string, string> = {};
    storage = {
      getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      key: jest.fn(),
      length: 0,
    };
    service = new WebStorageService(storage);
  });

  it('should set and get a value', () => {
    service.set('foo', { bar: 123 }, StorageTransformers.JSON);
    expect(storage.setItem).toHaveBeenCalledWith(
      'foo',
      JSON.stringify({ bar: 123 })
    );
    expect(service.get('foo', StorageTransformers.JSON)).toEqual({ bar: 123 });
  });

  it('should return undefined for missing key', () => {
    expect(service.get('missing')).toBeUndefined();
  });

  it('should return true for has() if key exists', () => {
    service.set('foo', 1, StorageTransformers.NUMBER);
    expect(service.has('foo')).toBe(true);
  });

  it('should return false for has() if key does not exist', () => {
    expect(service.has('nope')).toBe(false);
  });

  it('should remove a key', () => {
    service.set('foo', 1, StorageTransformers.NUMBER);
    service.remove('foo');
    expect(storage.removeItem).toHaveBeenCalledWith('foo');
    expect(service.get('foo')).toBeUndefined();
  });

  it('should clear all keys', () => {
    service.set('foo', 1, StorageTransformers.NUMBER);
    service.set('bar', 2, StorageTransformers.NUMBER);
    service.clear();
    expect(storage.clear).toHaveBeenCalled();
    expect(service.get('foo')).toBeUndefined();
    expect(service.get('bar')).toBeUndefined();
  });
});
