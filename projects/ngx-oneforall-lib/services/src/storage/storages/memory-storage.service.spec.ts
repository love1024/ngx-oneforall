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
});
