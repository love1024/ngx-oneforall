/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStorageEngine } from './cache.util';
import {
  MemoryStorageService,
  WebStorageService,
} from '@ngx-oneforall/services/storage';

describe('getStorageEngine', () => {
  it('should return a MemoryStorageService for "memory"', () => {
    const engine = getStorageEngine('memory');
    expect(engine).toBeInstanceOf(MemoryStorageService);
  });

  it('should default to a MemoryStorageService ', () => {
    const engine = getStorageEngine();
    expect(engine).toBeInstanceOf(MemoryStorageService);
  });

  it('should return a WebStorageService for "local"', () => {
    const engine = getStorageEngine('local');
    expect(engine).toBeInstanceOf(WebStorageService);
    expect((engine as WebStorageService as any).storage).toBe(localStorage);
  });

  it('should return a WebStorageService for "session"', () => {
    const engine = getStorageEngine('session');
    expect(engine).toBeInstanceOf(WebStorageService);
    expect((engine as WebStorageService as any).storage).toBe(sessionStorage);
  });

  it('should cache and return the same instance for repeated calls', () => {
    const engine1 = getStorageEngine('memory');
    const engine2 = getStorageEngine('memory');
    expect(engine1).toBe(engine2);

    const engine3 = getStorageEngine('local');
    const engine4 = getStorageEngine('local');
    expect(engine3).toBe(engine4);

    const engine5 = getStorageEngine('session');
    const engine6 = getStorageEngine('session');
    expect(engine5).toBe(engine6);
  });

  it('should pass prefix to WebStorageService', () => {
    const engine = getStorageEngine('local', 'myprefix');
    expect((engine as WebStorageService as any).prefix).toBe('myprefix');
  });
});
