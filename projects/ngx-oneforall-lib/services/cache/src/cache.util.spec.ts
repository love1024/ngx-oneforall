/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cacheUtil from './cache.util';
import {
  MemoryStorageService,
  WebStorageService,
} from 'ngx-oneforall/services/storage';

describe('getStorageEngine', () => {
  it('should return a MemoryStorageService for "memory"', () => {
    const engine = cacheUtil.getStorageEngine('memory');
    expect(engine).toBeInstanceOf(MemoryStorageService);
  });

  it('should default to a MemoryStorageService ', () => {
    const engine = cacheUtil.getStorageEngine();
    expect(engine).toBeInstanceOf(MemoryStorageService);
  });

  it('should return a WebStorageService for "local"', () => {
    const engine = cacheUtil.getStorageEngine('local');
    expect(engine).toBeInstanceOf(WebStorageService);
    expect((engine as WebStorageService as any).storage).toBe(localStorage);
  });

  it('should return a WebStorageService for "session"', () => {
    const engine = cacheUtil.getStorageEngine('session');
    expect(engine).toBeInstanceOf(WebStorageService);
    expect((engine as WebStorageService as any).storage).toBe(sessionStorage);
  });

  it('should cache and return the same instance for repeated calls', () => {
    const engine1 = cacheUtil.getStorageEngine('memory');
    const engine2 = cacheUtil.getStorageEngine('memory');
    expect(engine1).toBe(engine2);

    const engine3 = cacheUtil.getStorageEngine('local');
    const engine4 = cacheUtil.getStorageEngine('local');
    expect(engine3).toBe(engine4);

    const engine5 = cacheUtil.getStorageEngine('session');
    const engine6 = cacheUtil.getStorageEngine('session');
    expect(engine5).toBe(engine6);
  });

  it('should pass prefix to WebStorageService', () => {
    const engine = cacheUtil.getStorageEngine('local', 'myprefix');
    expect((engine as WebStorageService as any).prefix).toBe('myprefix');
  });
});
