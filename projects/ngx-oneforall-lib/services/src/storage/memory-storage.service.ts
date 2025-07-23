import { StorageEngine } from './storage-engine';

export class MemoryStorageService<T = unknown> implements StorageEngine<T> {
  private readonly storage = new Map<string, string>();

  get(key: string): T | undefined {
    const value = this.getItem(key);
    return value !== undefined ? JSON.parse(value) : undefined;
  }

  set(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  protected getItem(key: string): string | undefined {
    return this.storage.get(key);
  }

  protected setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
}
