import { MemoryStorageService } from './memory-storage.service';

describe('MemoryStorageService', () => {
  let service: MemoryStorageService;

  beforeEach(() => {
    service = new MemoryStorageService();
  });

  it('should set and get a value', () => {
    service['storage'].set('foo', 'bar');
    expect(service['getItem']('foo')).toBe('bar');
  });

  it('should return undefined for missing key', () => {
    expect(service['getItem']('missing')).toBeUndefined();
  });

  it('should check if key exists', () => {
    service['storage'].set('foo', 'bar');
    expect(service.has('foo')).toBe(true);
    expect(service.has('baz')).toBe(false);
  });

  it('should remove a key', () => {
    service['storage'].set('foo', 'bar');
    service.remove('foo');
    expect(service.has('foo')).toBe(false);
  });

  it('should clear all keys', () => {
    service['storage'].set('a', '1');
    service['storage'].set('b', '2');
    service.clear();
    expect(service.has('a')).toBe(false);
    expect(service.has('b')).toBe(false);
  });

  it('should setItem store value', () => {
    service['setItem']('key', 'value');
    expect(service['storage'].get('key')).toBe('value');
  });

  it('should return length', () => {
    service['storage'].set('a', '1');

    expect(service.length()).toBe(1);
  });

  it('should return key by index', () => {
    service['storage'].set('a', '1');

    expect(service.key(0)).toBe('a');
  });

  it('should return null for out of bounds key index', () => {
    expect(service.key(999)).toBeNull();
  });

  it('should return all keys', () => {
    service['storage'].set('a', '1');
    service['storage'].set('b', '2');
    service['storage'].set('c', '3');

    expect(service.keys()).toEqual(['a', 'b', 'c']);
  });

  it('should return empty array for keys when storage is empty', () => {
    expect(service.keys()).toEqual([]);
  });
});
